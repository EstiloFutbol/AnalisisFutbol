"""
sync_wc_players.py — Sync FIFA World Cup 2026 player stats from football-data.org
===================================================================================

Fetches per-player, per-match statistics for WC 2026 matches and upserts them
into the `match_player_stats` table (same schema used for La Liga players).

What is fetched per match:
  * Home and away lineups with player names, positions, shirt numbers
  * Goals, assists, yellow/red cards per player
  * Substitutions (used to estimate minutes played)

Strategy (no external_id column needed):
  1. Fetch all WC matches from football-data.org in one call.
  2. Build a lookup: (matchday, home_team_name) -> fd_match_id.
     Team names in WC DB are identical to football-data.org names so no
     mapping is required (same teams imported via import_world_cup.py).
  3. For each played DB match, resolve its fd_match_id from the lookup.
  4. Fetch /v4/matches/{fd_match_id} for full lineup + events.

Called from the GitHub Actions daily pipeline after sync_match_dates.py.
Only processes matches that have already been played (home_goals IS NOT NULL).

API docs: https://www.football-data.org/documentation/quickstart
Endpoint: GET /v4/competitions/WC/matches  -> full season match list (single call)
          GET /v4/matches/{matchId}         -> per-match with lineups + scorers

Usage:
    python .github/sync_wc_players.py
    python .github/sync_wc_players.py --dry-run     # print, don't write
    python .github/sync_wc_players.py --match 12345 # specific DB match_id only
    python .github/sync_wc_players.py --force       # re-fetch even if stats exist
"""

import os, sys, io, time, argparse
from dotenv import load_dotenv
import requests

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(_ROOT, ".env.local"))

SUPABASE_URL = os.environ.get("SUPABASE_URL") or os.environ.get("VITE_SUPABASE_URL")
SUPABASE_KEY = (os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
                or os.environ.get("VITE_SUPABASE_SERVICE_ROLE_KEY"))
FD_API_KEY   = os.environ.get("FOOTBALL_DATA_API_KEY", "")
FD_BASE      = "https://api.football-data.org/v4"

WC_LEAGUE_CODE = "WC"
WC_FD_SEASON   = 2026
REQUEST_DELAY  = 6   # seconds between per-match requests (free tier: 10 req/min)


# ── Helpers ────────────────────────────────────────────────────────────────────

def fd_get(path, params=None):
    """Call football-data.org API with auth header; auto-retry once on 429."""
    url = FD_BASE + path
    r = requests.get(url, headers={"X-Auth-Token": FD_API_KEY},
                     params=params or {}, timeout=20)
    if r.status_code == 429:
        print("  [WAIT] Rate limited -- sleeping 60s...")
        time.sleep(60)
        r = requests.get(url, headers={"X-Auth-Token": FD_API_KEY},
                         params=params or {}, timeout=20)
    r.raise_for_status()
    return r.json()


def create_sb():
    from supabase import create_client
    return create_client(SUPABASE_URL, SUPABASE_KEY)


# ── Build fd_match_id lookup ───────────────────────────────────────────────────

def build_fd_match_lookup() -> dict:
    """
    Fetch all WC 2026 matches from football-data.org in one API call.

    Returns:
        dict: {(matchday: int, home_team_name: str) -> fd_match_id: int}

    This avoids needing an external_id column in the matches table.
    WC team names in the DB are identical to football-data.org names
    (imported via import_world_cup.py with no name remapping).
    """
    data = fd_get(f"/competitions/{WC_LEAGUE_CODE}/matches",
                  {"season": WC_FD_SEASON})
    matches = data.get("matches", [])
    lookup = {}
    for m in matches:
        md       = m.get("matchday")
        fd_id    = m.get("id")
        home_raw = (m["homeTeam"].get("name") or "").strip()
        away_raw = (m["awayTeam"].get("name") or "").strip()
        if not home_raw or not away_raw or not md or not fd_id:
            continue
        lookup[(md, home_raw)] = fd_id
    return lookup


# ── Parse one match into player stat rows ─────────────────────────────────────

def parse_match_players(match_data: dict, db_match_id: int,
                        home_team_id: int, away_team_id: int) -> list[dict]:
    """
    Given a football-data.org /v4/matches/{id} response, extract all player
    rows matching the match_player_stats schema.

    Schema columns used:
        match_id, team_id, is_home, player_name, shirt_number, position,
        is_starter, minutes, goals, assists, yellow_cards, red_cards
    """
    rows = []

    home_team = match_data.get("homeTeam", {})
    away_team = match_data.get("awayTeam", {})
    goals     = match_data.get("goals", [])
    bookings  = match_data.get("bookings", [])
    subs      = match_data.get("substitutions", [])

    # -- goal scorers / assisters -------------------------------------------
    goal_scorers   = {}
    goal_assisters = {}
    for g in goals:
        scorer = g.get("scorer") or {}
        assist = g.get("assist")
        if scorer.get("id"):
            goal_scorers[scorer["id"]] = goal_scorers.get(scorer["id"], 0) + 1
        if assist and assist.get("id"):
            goal_assisters[assist["id"]] = goal_assisters.get(assist["id"], 0) + 1

    # -- cards ---------------------------------------------------------------
    yellow_cards = {}
    red_cards    = {}
    for b in bookings:
        p = b.get("player") or {}
        if not p.get("id"):
            continue
        card = b.get("card", "")
        if "YELLOW" in card:
            yellow_cards[p["id"]] = yellow_cards.get(p["id"], 0) + 1
        elif "RED" in card:
            red_cards[p["id"]] = red_cards.get(p["id"], 0) + 1

    # -- substitution minutes -----------------------------------------------
    sub_on_min  = {}   # player_id -> minute they came ON
    sub_off_min = {}   # player_id -> minute they went OFF
    for s in subs:
        player_in  = s.get("playerIn")  or {}
        player_out = s.get("playerOut") or {}
        minute     = s.get("minute") or 90
        if player_in.get("id"):
            sub_on_min[player_in["id"]]   = minute
        if player_out.get("id"):
            sub_off_min[player_out["id"]] = minute

    # -- build rows per lineup -----------------------------------------------
    def process_lineup(team_data: dict, team_id: int, is_home: bool):
        lineup = team_data.get("lineup") or []
        bench  = team_data.get("bench")  or []

        for player in lineup + bench:
            pid = player.get("id")
            if not pid:
                continue

            name     = player.get("name", "")
            position = player.get("position", "")
            shirt    = player.get("shirtNumber")
            started  = player in lineup

            # Estimate minutes played
            if started:
                # Starter: plays until subbed off (or full 90)
                mins = sub_off_min.get(pid, 90)
            else:
                # Bench: only plays if they came on
                if pid in sub_on_min:
                    mins = max(0, 90 - sub_on_min[pid])
                else:
                    mins = 0

            rows.append({
                "match_id":     db_match_id,
                "team_id":      team_id,
                "is_home":      is_home,
                "player_name":  name,
                "position":     position,
                "shirt_number": shirt,
                "is_starter":   started,
                "minutes":      mins,
                "goals":        goal_scorers.get(pid, 0),
                "assists":      goal_assisters.get(pid, 0),
                "yellow_cards": yellow_cards.get(pid, 0),
                "red_cards":    red_cards.get(pid, 0),
            })

    process_lineup(home_team, home_team_id, is_home=True)
    process_lineup(away_team, away_team_id, is_home=False)

    return rows


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Sync WC 2026 player stats from football-data.org")
    parser.add_argument("--dry-run", action="store_true",
                        help="Print rows, do not write to DB")
    parser.add_argument("--match", type=int,
                        help="Process only this DB match_id")
    parser.add_argument("--force", action="store_true",
                        help="Re-fetch even if stats already exist")
    args = parser.parse_args()

    if not FD_API_KEY:
        print("ERROR: FOOTBALL_DATA_API_KEY not set.")
        sys.exit(1)
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("ERROR: Supabase credentials not set.")
        sys.exit(1)

    sb = create_sb()

    # ── Find WC league ────────────────────────────────────────────────────────
    wc_league = sb.from_("leagues").select("id").eq("code", WC_LEAGUE_CODE).execute()
    if not wc_league.data:
        print("WC league not found in DB. Run import_world_cup.py first.")
        sys.exit(0)
    wc_id = wc_league.data[0]["id"]

    # ── Fetch ALL WC matches from football-data.org for ID lookup ─────────────
    print("Fetching WC match list from football-data.org...")
    fd_lookup = build_fd_match_lookup()
    print(f"  -> {len(fd_lookup)} WC matches indexed (matchday + home team name)")
    time.sleep(REQUEST_DELAY)

    # ── Find played WC matches in DB ──────────────────────────────────────────
    query = (sb.from_("matches")
               .select("id, matchday, match_date, home_team_id, away_team_id, "
                       "home_goals, away_goals, "
                       "home_team:teams!matches_home_team_id_fkey(name), "
                       "away_team:teams!matches_away_team_id_fkey(name)")
               .eq("league_id", wc_id)
               .not_.is_("home_goals", "null")
               .order("match_date", desc=False))

    if args.match:
        query = query.eq("id", args.match)

    matches_db = query.execute().data or []
    print(f"Found {len(matches_db)} played WC matches to process")

    if not matches_db:
        print("No played matches found.")
        return

    total_written = 0
    skipped_no_fd = 0

    for m in matches_db:
        db_id    = m["id"]
        matchday = m.get("matchday")
        home     = (m.get("home_team") or {}).get("name", f"team{m['home_team_id']}")
        away     = (m.get("away_team") or {}).get("name", f"team{m['away_team_id']}")
        score_str = f"{m['home_goals']}-{m['away_goals']}"

        print(f"\nMatch {db_id}: {home} {score_str} {away}  (J{matchday}, {m['match_date']})")

        # Skip if stats already exist (unless --force)
        if not args.force:
            existing = (sb.from_("match_player_stats")
                          .select("id", count="exact")
                          .eq("match_id", db_id)
                          .execute())
            if (existing.count or 0) > 0:
                print(f"  -> Already has {existing.count} player rows "
                      f"-- skip (use --force to re-fetch)")
                continue

        # Resolve football-data.org match ID via (matchday, home_name) lookup
        fd_id = fd_lookup.get((matchday, home))
        if not fd_id:
            print(f"  -> No fd match found for J{matchday} + '{home}' -- skipping")
            skipped_no_fd += 1
            continue

        # Fetch per-match data (lineups + events)
        print(f"  -> Fetching from football-data.org (fd_id={fd_id})...")
        try:
            data = fd_get(f"/matches/{fd_id}")
        except Exception as e:
            print(f"  -> API error: {e}")
            time.sleep(REQUEST_DELAY)
            continue

        rows = parse_match_players(
            data, db_id, m["home_team_id"], m["away_team_id"])
        print(f"  -> Parsed {len(rows)} player rows")

        if not rows:
            print("  -> No lineup data in API response "
                  "(match may be too recent or free-tier limit)")
            time.sleep(REQUEST_DELAY)
            continue

        if args.dry_run:
            for r in rows[:4]:
                print(f"    {r['player_name']:25s} {r['position']:12s} "
                      f"G:{r['goals']} A:{r['assists']} "
                      f"Y:{r['yellow_cards']} min:{r['minutes']}")
            if len(rows) > 4:
                print(f"    ... and {len(rows)-4} more")
        else:
            # Clean re-insert: delete existing rows for this match, then bulk-insert
            sb.from_("match_player_stats").delete().eq("match_id", db_id).execute()
            batch_size = 50
            for i in range(0, len(rows), batch_size):
                sb.from_("match_player_stats").insert(rows[i:i+batch_size]).execute()
            total_written += len(rows)
            print(f"  -> Written {len(rows)} rows")

        time.sleep(REQUEST_DELAY)   # respect free-tier rate limit (10 req/min)

    if args.dry_run:
        print("\n[DRY RUN] No data written.")
    else:
        print(f"\n[DONE] Total player rows written: {total_written}")
        if skipped_no_fd:
            print(f"  ({skipped_no_fd} matches skipped — no football-data.org match ID resolved)")


if __name__ == "__main__":
    main()
