"""
import_world_cup.py — One-time import of FIFA World Cup 2026 data from football-data.org

What this does:
  1. Creates/updates the WC 2026 league record
  2. Imports all 48 national teams (with logo URLs from football-data.org crests)
  3. Imports 72 group-stage matches (dates, kick-off times, group names)
  4. Imports 32 knockout-round slots (TBD teams, dates only)
  5. Initialises tournament_standings rows for all 48 teams across 12 groups

Re-running is safe: all inserts are upserts. Re-run after group stage completes
to fill in real team IDs for the knockout bracket.

Usage:
    python .github/import_world_cup.py --preview   # dry run, no DB writes
    python .github/import_world_cup.py --upload    # write to Supabase

Requires migration_v16_world_cup.sql to have been run in Supabase first.
"""

import sys, io, os, argparse, requests
from datetime import datetime
from zoneinfo import ZoneInfo
from dotenv import load_dotenv
from supabase import create_client

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(_ROOT, ".env.local"))

SUPABASE_URL = os.environ.get("SUPABASE_URL") or os.environ["VITE_SUPABASE_URL"]
SUPABASE_KEY = (os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
                or os.environ["VITE_SUPABASE_SERVICE_ROLE_KEY"])
FD_API_KEY   = os.environ.get("FOOTBALL_DATA_API_KEY", "")

FD_BASE   = "https://api.football-data.org/v4"
FD_COMP   = "WC"
FD_SEASON = 2026
WC_SEASON = "2026"
MADRID_TZ = ZoneInfo("Europe/Madrid")

# football-data.org stage name → matchday number stored in DB
STAGE_MATCHDAY = {
    "LAST_32":        4,
    "LAST_16":        5,
    "QUARTER_FINALS": 6,
    "SEMI_FINALS":    7,
    "THIRD_PLACE":    8,
    "FINAL":          9,
}


def fd_get(path, params=None):
    resp = requests.get(
        f"{FD_BASE}{path}",
        headers={"X-Auth-Token": FD_API_KEY},
        params=params or {},
        timeout=20,
    )
    if resp.status_code == 403:
        print("[ERROR] FOOTBALL_DATA_API_KEY rejected (403).")
        sys.exit(1)
    resp.raise_for_status()
    return resp.json()


def utc_to_madrid(iso_str):
    """Return (date_str, time_str) in Madrid local time. time_str=None for TBD kick-offs."""
    dt     = datetime.fromisoformat(iso_str.replace("Z", "+00:00"))
    dt_mad = dt.astimezone(MADRID_TZ)
    is_placeholder = dt.hour == 0 and dt.minute == 0
    return dt_mad.strftime("%Y-%m-%d"), (None if is_placeholder else dt_mad.strftime("%H:%M"))


def main():
    parser = argparse.ArgumentParser()
    grp = parser.add_mutually_exclusive_group(required=True)
    grp.add_argument("--preview", action="store_true")
    grp.add_argument("--upload",  action="store_true")
    args = parser.parse_args()

    if not FD_API_KEY:
        print("[ERROR] FOOTBALL_DATA_API_KEY not set in .env.local or environment.")
        sys.exit(1)

    # ── Fetch from football-data.org ─────────────────────────────────────────
    print("[API] Fetching competition info...")
    comp_data = fd_get(f"/competitions/{FD_COMP}")

    print("[API] Fetching teams...")
    teams_data = fd_get(f"/competitions/{FD_COMP}/teams", {"season": FD_SEASON})
    teams = teams_data.get("teams", [])

    print("[API] Fetching matches...")
    matches_data = fd_get(f"/competitions/{FD_COMP}/matches", {"season": FD_SEASON})
    matches = matches_data.get("matches", [])

    group_matches    = [m for m in matches if m.get("group")]
    knockout_matches = [m for m in matches if not m.get("group")]

    print(f"  {len(teams)} teams | {len(group_matches)} group matches | {len(knockout_matches)} knockout slots")

    if args.preview:
        print("\n[PREVIEW] Would import:")
        print(f"  1 WC 2026 league record")
        print(f"  {len(teams)} national teams (all with logo URLs)")
        print(f"  {len(group_matches)} group-stage matches across 12 groups")
        print(f"  {len(knockout_matches)} knockout slots (TBD teams)")
        print(f"  48 initial standings rows (all zeros)")
        print("\n[PREVIEW] Run with --upload to apply.")
        return

    sb = create_client(SUPABASE_URL, SUPABASE_KEY)

    # ── 1. League ─────────────────────────────────────────────────────────────
    print("\n[1/4] Upserting WC 2026 league...")
    league_payload = {
        "name":       "FIFA World Cup 2026",
        "code":       "WC",
        "season":     WC_SEASON,
        "logo_url":   comp_data.get("emblem"),
        "is_default": False,
    }
    existing_l = sb.from_("leagues").select("id").eq("code", "WC").eq("season", WC_SEASON).execute()
    if existing_l.data:
        wc_league_id = existing_l.data[0]["id"]
        sb.from_("leagues").update(league_payload).eq("id", wc_league_id).execute()
        print(f"  Updated (id={wc_league_id})")
    else:
        sb.from_("leagues").insert(league_payload).execute()
        res = sb.from_("leagues").select("id").eq("code", "WC").eq("season", WC_SEASON).execute()
        wc_league_id = res.data[0]["id"]
        print(f"  Created (id={wc_league_id})")

    # ── 2. Teams ─────────────────────────────────────────────────────────────
    print(f"\n[2/4] Importing {len(teams)} national teams...")
    team_name_to_id = {}
    for t in teams:
        name = t["name"]
        payload = {
            "name":       name,
            "short_name": t.get("shortName") or t.get("tla") or name[:3].upper(),
            "logo_url":   t.get("crest"),
            "team_type":  "national",
            "league_id":  wc_league_id,
        }
        existing_t = sb.from_("teams").select("id").eq("name", name).execute()
        if existing_t.data:
            tid = existing_t.data[0]["id"]
            sb.from_("teams").update(payload).eq("id", tid).execute()
        else:
            sb.from_("teams").insert(payload).execute()
            tid = sb.from_("teams").select("id").eq("name", name).execute().data[0]["id"]
        team_name_to_id[name] = tid

    print(f"  Done: {len(team_name_to_id)} teams upserted")

    # ── 3. Matches ────────────────────────────────────────────────────────────
    print(f"\n[3/4] Importing {len(matches)} matches...")
    ok = skip = 0

    # Separate group-stage and knockout matches for different upsert strategies
    group_stage  = [m for m in matches if m.get("group")]
    knockout_raw = [m for m in matches if not m.get("group")]

    # ── Group-stage: upsert by (league_id, matchday, home_team_id, away_team_id) ──
    for m in group_stage:
        group    = m["group"]
        md       = m.get("matchday")
        group_name = group.replace("GROUP_", "")

        home_name = (m["homeTeam"].get("name") or "").strip() or None
        away_name = (m["awayTeam"].get("name") or "").strip() or None
        home_id   = team_name_to_id.get(home_name) if home_name else None
        away_id   = team_name_to_id.get(away_name) if away_name else None

        if home_name and not home_id:
            print(f"  [!] Unknown team '{home_name}' — skipped J{md}")
            skip += 1
            continue
        if away_name and not away_id:
            print(f"  [!] Unknown team '{away_name}' — skipped J{md}")
            skip += 1
            continue

        utc_date = m.get("utcDate", "")
        match_date, kick_off_time = utc_to_madrid(utc_date) if utc_date else (None, None)

        payload = {
            "league_id":     wc_league_id,
            "season":        WC_SEASON,
            "matchday":      md,
            "group_name":    group_name,
            "match_date":    match_date,
            "kick_off_time": kick_off_time,
            "home_team_id":  home_id,
            "away_team_id":  away_id,
        }

        existing_m = (sb.from_("matches").select("id")
                      .eq("league_id", wc_league_id)
                      .eq("matchday", md)
                      .eq("home_team_id", home_id)
                      .eq("away_team_id", away_id)
                      .execute())

        if existing_m.data:
            sb.from_("matches").update(payload).eq("id", existing_m.data[0]["id"]).execute()
        else:
            sb.from_("matches").insert(payload).execute()
        ok += 1

    # ── Knockout TBD slots: delete-and-replace strategy ──────────────────────
    # Multiple games can share the same (matchday, match_date) so a unique-key
    # lookup on that pair is ambiguous. Instead: delete all current TBD slots
    # and re-insert from the API. Once teams are determined, their IDs will be
    # filled in by sync_match_dates.py using the normal team-pair lookup.
    knockout_to_insert = []
    for m in knockout_raw:
        stage = m.get("stage", "")
        md    = STAGE_MATCHDAY.get(stage)
        if md is None:
            print(f"  [!] Unknown stage '{stage}' — skipped")
            skip += 1
            continue

        home_name = (m["homeTeam"].get("name") or "").strip() or None
        away_name = (m["awayTeam"].get("name") or "").strip() or None
        home_id   = team_name_to_id.get(home_name) if home_name else None
        away_id   = team_name_to_id.get(away_name) if away_name else None

        utc_date = m.get("utcDate", "")
        match_date, kick_off_time = utc_to_madrid(utc_date) if utc_date else (None, None)

        knockout_to_insert.append({
            "league_id":     wc_league_id,
            "season":        WC_SEASON,
            "matchday":      md,
            "group_name":    None,
            "match_date":    match_date,
            "kick_off_time": kick_off_time,
            "home_team_id":  home_id,
            "away_team_id":  away_id,
        })

    if knockout_to_insert:
        # Delete existing TBD slots; preserve rows that already have real teams
        (sb.from_("matches").delete()
           .eq("league_id", wc_league_id)
           .gte("matchday", 4)
           .is_("home_team_id", "null")
           .execute())
        for row in knockout_to_insert:
            sb.from_("matches").insert(row).execute()
            ok += 1

    print(f"  Done: {ok} matches upserted, {skip} skipped")

    # ── 4. Initial standings ──────────────────────────────────────────────────
    print(f"\n[4/4] Initialising group standings...")
    group_teams: dict[str, set] = {}
    for m in group_matches:
        g = m["group"].replace("GROUP_", "")
        group_teams.setdefault(g, set())
        for name_key in ("homeTeam", "awayTeam"):
            n = m[name_key].get("name")
            if n and n in team_name_to_id:
                group_teams[g].add(n)

    standing_rows = []
    for g, team_names in sorted(group_teams.items()):
        for tname in sorted(team_names):
            standing_rows.append({
                "league_id":     wc_league_id,
                "group_name":    g,
                "team_id":       team_name_to_id[tname],
                "played": 0, "won": 0, "drawn": 0, "lost": 0,
                "goals_for": 0, "goals_against": 0, "points": 0,
            })

    sb.from_("tournament_standings").upsert(
        standing_rows, on_conflict="league_id,group_name,team_id"
    ).execute()
    print(f"  Done: {len(standing_rows)} rows across {len(group_teams)} groups")

    print(f"\n[DONE] WC 2026 import complete. league_id={wc_league_id}")
    print("       Next: run migration_v16 in Supabase if not done yet,")
    print("       then trigger the GitHub Actions workflow to start fetching odds.")


if __name__ == "__main__":
    main()
