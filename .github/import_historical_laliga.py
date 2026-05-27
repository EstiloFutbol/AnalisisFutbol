"""
import_historical_laliga.py — Import historical La Liga seasons from football-data.co.uk

What this does:
  1. Downloads CSV files for seasons 2021-22, 2022-23, 2023-24 (SP1)
  2. Creates league records for each season
  3. Maps / creates teams as needed
  4. Imports match results + stats + B365 closing odds
  5. Stores Pinnacle closing odds in match_odds_bookmakers (for backtesting)

Data source: https://www.football-data.co.uk/spainm.php
CSV columns used:
  - Date, HomeTeam, AwayTeam
  - FTHG, FTAG (full-time goals)
  - HTHG, HTAG (half-time goals)
  - HS, AS (shots), HST, AST (shots on target)
  - HC, AC (corners), HF, AF (fouls)
  - HY, AY (yellows), HR, AR (reds)
  - B365H, B365D, B365A (Bet365 1X2 closing odds)
  - B365>2.5, B365<2.5 (Bet365 over/under closing odds)
  - PSH, PSD, PSA (Pinnacle 1X2 closing odds)
  - P>2.5, P<2.5 (Pinnacle over/under closing odds)

Usage:
    python .github/import_historical_laliga.py --preview
    python .github/import_historical_laliga.py --upload
    python .github/import_historical_laliga.py --upload --seasons 2122 2223 2324

Requires migration_v17_historical_stats.sql to have been run first.
Re-running is safe — all inserts are upserts keyed on (league_id, home_team_id, away_team_id).
"""

import sys, io, os, csv, argparse, requests
from datetime import datetime
from dotenv import load_dotenv
from supabase import create_client

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(_ROOT, ".env.local"))

SUPABASE_URL = os.environ.get("SUPABASE_URL") or os.environ["VITE_SUPABASE_URL"]
SUPABASE_KEY = (os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
                or os.environ["VITE_SUPABASE_SERVICE_ROLE_KEY"])

# ── Seasons to import ─────────────────────────────────────────────────────────
# Format: (fd_code, season_str, display)
DEFAULT_SEASONS = [
    ("2122", "2021-2022", "La Liga 2021-22"),
    ("2223", "2022-2023", "La Liga 2022-23"),
    ("2324", "2023-2024", "La Liga 2023-24"),
]

# ── Team name mapping: football-data.co.uk → our DB ──────────────────────────
# Keys are exactly as they appear in the CSV HomeTeam/AwayTeam column.
TEAM_MAP = {
    # Standard differences
    "Ath Bilbao":       "Athletic Club",
    "Ath Madrid":       "Atlético Madrid",
    "Atletico Madrid":  "Atlético Madrid",
    "Sociedad":         "Real Sociedad",
    "Betis":            "Real Betis",
    "Celta":            "Celta Vigo",
    "Celta Vigo":       "Celta Vigo",
    "Leganes":          "Leganés",
    "Espanol":          "Espanyol",
    "Alaves":           "Alavés",
    "Vallecano":        "Rayo Vallecano",
    "Rayo Vallecano":   "Rayo Vallecano",
    # Teams that promoted/relegated — use canonical accented names
    "Cadiz":            "Cádiz",
    "Almeria":          "Almería",
    "La Palmas":        "Las Palmas",
    "Las Palmas":       "Las Palmas",
    # These already match our DB:
    # Barcelona, Real Madrid, Sevilla, Valencia, Villarreal, Osasuna,
    # Getafe, Mallorca, Elche, Levante, Girona, Valladolid, Granada,
    # Eibar, Huesca, Oviedo
}


def fd_csv_url(fd_code: str) -> str:
    return f"https://www.football-data.co.uk/mmz4281/{fd_code}/SP1.csv"


def parse_float(val: str):
    """Return float or None for missing / non-numeric values."""
    try:
        v = float(val.strip())
        return v if v > 0 else None
    except (ValueError, AttributeError):
        return None


def parse_int(val: str):
    """Return int or None."""
    try:
        return int(val.strip())
    except (ValueError, AttributeError):
        return None


def parse_date(val: str):
    """Parse DD/MM/YY or DD/MM/YYYY → 'YYYY-MM-DD'."""
    val = val.strip()
    for fmt in ("%d/%m/%y", "%d/%m/%Y"):
        try:
            return datetime.strptime(val, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue
    return None


def normalize_team(raw: str) -> str:
    return TEAM_MAP.get(raw.strip(), raw.strip())


def download_csv(url: str) -> list[dict]:
    """Download CSV and return list of row dicts. Tries UTF-8, falls back to latin-1."""
    resp = requests.get(url, timeout=30)
    resp.raise_for_status()
    # Try UTF-8 first, fall back to latin-1
    for enc in ("utf-8-sig", "latin-1"):
        try:
            text = resp.content.decode(enc)
            reader = csv.DictReader(text.splitlines())
            rows = [r for r in reader if r.get("HomeTeam", "").strip()]
            return rows
        except (UnicodeDecodeError, Exception):
            continue
    raise ValueError(f"Could not decode CSV from {url}")


def get_or_create_team(sb, name: str, league_id: int, db_teams: dict) -> int:
    """Look up team by name; create if missing. Updates db_teams cache."""
    if name in db_teams:
        return db_teams[name]
    # Search DB (exact name)
    res = sb.from_("teams").select("id").eq("name", name).execute()
    if res.data:
        tid = res.data[0]["id"]
        db_teams[name] = tid
        return tid
    # Create new team
    ins = sb.from_("teams").insert({
        "name":       name,
        "short_name": name[:3].upper(),
        "team_type":  "club",
        "league_id":  league_id,
    }).execute()
    tid = sb.from_("teams").select("id").eq("name", name).execute().data[0]["id"]
    db_teams[name] = tid
    print(f"    [NEW TEAM] Created '{name}' (id={tid})")
    return tid


def upsert_bookmaker_odds(sb, match_id: int, entries: list[dict], preview: bool):
    """Insert odds into match_odds_bookmakers. Silently skips if odds are null."""
    valid = [e for e in entries if e.get("odds") is not None]
    if not valid or preview:
        return
    for e in valid:
        try:
            sb.from_("match_odds_bookmakers").upsert(
                {
                    "match_id":       match_id,
                    "bookmaker_key":  e["key"],
                    "bookmaker_title":e["title"],
                    "market":         e["market"],
                    "outcome":        e["outcome"],
                    "point":          e.get("point"),
                    "odds":           e["odds"],
                },
                on_conflict="match_id,bookmaker_key,market,outcome",
            ).execute()
        except Exception:
            pass  # Non-fatal; continue


def import_season(sb, fd_code: str, season_str: str, label: str, args, summary: list):
    print(f"\n{'='*60}")
    print(f"  {label}")
    print(f"{'='*60}")

    # ── Download ──────────────────────────────────────────────────
    url = fd_csv_url(fd_code)
    print(f"  [CSV] Downloading {url}")
    try:
        rows = download_csv(url)
    except Exception as e:
        print(f"  [ERROR] Could not download CSV: {e}")
        summary.append(f"{label}: ERROR downloading CSV")
        return
    print(f"  [CSV] {len(rows)} matches found")

    if args.preview:
        # Sample teams
        home_teams = sorted(set(r["HomeTeam"].strip() for r in rows if r.get("HomeTeam")))
        print(f"\n  [PREVIEW] Teams in CSV ({len(home_teams)}):")
        for t in home_teams:
            mapped = normalize_team(t)
            marker = "" if mapped == t else f" → {mapped}"
            print(f"    {t}{marker}")
        print(f"\n  [PREVIEW] Would import {len(rows)} matches for {label}")
        summary.append(f"{label}: {len(rows)} matches (preview only)")
        return

    # ── League record ─────────────────────────────────────────────
    existing_l = (sb.from_("leagues").select("id")
                  .eq("code", "PD")
                  .eq("season", season_str)
                  .execute())
    if existing_l.data:
        league_id = existing_l.data[0]["id"]
        print(f"  [DB] League already exists (id={league_id})")
    else:
        sb.from_("leagues").insert({
            "name":       "La Liga",
            "code":       "PD",
            "season":     season_str,
            "is_default": False,
        }).execute()
        league_id = (sb.from_("leagues").select("id")
                     .eq("code", "PD")
                     .eq("season", season_str)
                     .execute().data[0]["id"])
        print(f"  [DB] Created league (id={league_id})")

    # ── Load existing teams into cache ───────────────────────────
    all_teams = sb.from_("teams").select("id,name").execute().data
    db_teams  = {t["name"]: t["id"] for t in all_teams}

    # ── Load existing matches for this league (for upsert logic) ─
    existing_matches = sb.from_("matches").select(
        "id,home_team_id,away_team_id"
    ).eq("league_id", league_id).execute().data
    existing_map = {(r["home_team_id"], r["away_team_id"]): r["id"] for r in existing_matches}

    # ── Import rows ───────────────────────────────────────────────
    ok = skip = updated = 0
    unknown_teams: list[str] = []

    for row in rows:
        home_raw = row.get("HomeTeam", "").strip()
        away_raw = row.get("AwayTeam", "").strip()
        if not home_raw or not away_raw:
            skip += 1
            continue

        home_name = normalize_team(home_raw)
        away_name = normalize_team(away_raw)

        home_id = get_or_create_team(sb, home_name, league_id, db_teams)
        away_id = get_or_create_team(sb, away_name, league_id, db_teams)

        match_date = parse_date(row.get("Date", ""))
        if not match_date:
            print(f"  [!] Bad date '{row.get('Date')}' for {home_name} vs {away_name} — skipped")
            skip += 1
            continue

        # ── Build match payload ───────────────────────────────────
        home_goals = parse_int(row.get("FTHG") or row.get("HG"))
        away_goals = parse_int(row.get("FTAG") or row.get("AG"))

        # B365 closing odds (use as primary odds for backtesting)
        b365_h = parse_float(row.get("B365H"))
        b365_d = parse_float(row.get("B365D"))
        b365_a = parse_float(row.get("B365A"))
        # B365 key name differs by CSV year: "B365>2.5" or with space
        b365_o25 = parse_float(row.get("B365>2.5") or row.get("B365.1"))
        b365_u25 = parse_float(row.get("B365<2.5") or row.get("B365.2"))

        payload = {
            "league_id":            league_id,
            "season":               season_str,
            "matchday":             None,   # Not available in FD.co.uk CSVs
            "match_date":           match_date,
            "kick_off_time":        row.get("Time", "").strip() or None,
            "home_team_id":         home_id,
            "away_team_id":         away_id,
            "home_goals":           home_goals,
            "away_goals":           away_goals,
            "home_ht_goals":        parse_int(row.get("HTHG")),
            "away_ht_goals":        parse_int(row.get("HTAG")),
            "home_shots":           parse_int(row.get("HS")),
            "away_shots":           parse_int(row.get("AS")),
            "home_shots_on_target": parse_int(row.get("HST")),
            "away_shots_on_target": parse_int(row.get("AST")),
            "home_corners":         parse_int(row.get("HC")),
            "away_corners":         parse_int(row.get("AC")),
            "home_fouls":           parse_int(row.get("HF")),
            "away_fouls":           parse_int(row.get("AF")),
            "home_yellow_cards":    parse_int(row.get("HY")),
            "away_yellow_cards":    parse_int(row.get("AY")),
            "home_red_cards":       parse_int(row.get("HR")),
            "away_red_cards":       parse_int(row.get("AR")),
            # Bet365 closing odds as baseline (best for backtesting)
            "home_odds":            b365_h,
            "draw_odds":            b365_d,
            "away_odds":            b365_a,
            "over25_odds":          b365_o25,
            "under25_odds":         b365_u25,
        }
        # Remove None values from payload (don't overwrite existing data with None)
        payload = {k: v for k, v in payload.items() if v is not None or k in (
            "matchday", "home_ht_goals", "away_ht_goals",
        )}

        # Upsert by (league_id, home_team_id, away_team_id)
        match_key = (home_id, away_id)
        if match_key in existing_map:
            mid = existing_map[match_key]
            sb.from_("matches").update(payload).eq("id", mid).execute()
            updated += 1
        else:
            ins = sb.from_("matches").insert(payload).execute()
            # Fetch the new id
            res = (sb.from_("matches").select("id")
                   .eq("league_id", league_id)
                   .eq("home_team_id", home_id)
                   .eq("away_team_id", away_id)
                   .execute())
            if res.data:
                mid = res.data[0]["id"]
                existing_map[match_key] = mid
            else:
                mid = None
            ok += 1

        # ── Pinnacle odds → match_odds_bookmakers ─────────────────
        if mid:
            ps_h  = parse_float(row.get("PSH"))
            ps_d  = parse_float(row.get("PSD"))
            ps_a  = parse_float(row.get("PSA"))
            ps_o  = parse_float(row.get("P>2.5"))
            ps_u  = parse_float(row.get("P<2.5"))
            upsert_bookmaker_odds(sb, mid, [
                {"key":"pinnacle","title":"Pinnacle","market":"h2h","outcome":"home","odds":ps_h},
                {"key":"pinnacle","title":"Pinnacle","market":"h2h","outcome":"draw","odds":ps_d},
                {"key":"pinnacle","title":"Pinnacle","market":"h2h","outcome":"away","odds":ps_a},
                {"key":"pinnacle","title":"Pinnacle","market":"totals","outcome":"over","point":2.5,"odds":ps_o},
                {"key":"pinnacle","title":"Pinnacle","market":"totals","outcome":"under","point":2.5,"odds":ps_u},
                {"key":"bet365","title":"Bet365","market":"h2h","outcome":"home","odds":b365_h},
                {"key":"bet365","title":"Bet365","market":"h2h","outcome":"draw","odds":b365_d},
                {"key":"bet365","title":"Bet365","market":"h2h","outcome":"away","odds":b365_a},
                {"key":"bet365","title":"Bet365","market":"totals","outcome":"over","point":2.5,"odds":b365_o25},
                {"key":"bet365","title":"Bet365","market":"totals","outcome":"under","point":2.5,"odds":b365_u25},
            ], preview=False)

    if unknown_teams:
        print(f"\n  [!] Unknown team names (not in DB and not in TEAM_MAP):")
        for u in sorted(set(unknown_teams)):
            print(f"      {u}")

    print(f"\n  [DONE] Inserted: {ok}  Updated: {updated}  Skipped: {skip}")
    summary.append(f"{label}: {ok} inserted, {updated} updated, {skip} skipped")


def main():
    parser = argparse.ArgumentParser()
    grp = parser.add_mutually_exclusive_group(required=True)
    grp.add_argument("--preview", action="store_true",
                     help="Show what would be imported without writing to DB")
    grp.add_argument("--upload",  action="store_true",
                     help="Write to Supabase")
    parser.add_argument("--seasons", nargs="*", default=None,
                        help="Season codes to import (e.g. 2122 2223 2324). Defaults to all three.")
    args = parser.parse_args()

    seasons = DEFAULT_SEASONS
    if args.seasons:
        valid = {s[0] for s in DEFAULT_SEASONS}
        seasons = [s for s in DEFAULT_SEASONS if s[0] in args.seasons]
        if not seasons:
            print(f"[ERROR] No valid season codes. Choose from: {', '.join(valid)}")
            sys.exit(1)

    sb      = create_client(SUPABASE_URL, SUPABASE_KEY)
    summary = []

    for fd_code, season_str, label in seasons:
        try:
            import_season(sb, fd_code, season_str, label, args, summary)
        except Exception as e:
            import traceback
            print(f"\n[ERROR] {label}: {e}")
            traceback.print_exc()
            summary.append(f"{label}: ERROR — {e}")

    print(f"\n{'='*60}\n[SUMMARY]")
    for line in summary:
        print(f"  {line}")
    if args.preview:
        print("\n[PREVIEW] No changes written. Run with --upload to apply.")
    print("[DONE]")


if __name__ == "__main__":
    main()
