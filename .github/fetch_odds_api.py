"""
fetch_odds_api.py — Fetch pre-match 1X2 odds from The Odds API and upsert
home_odds / draw_odds / away_odds into the matches table.

Averages decimal odds across all EU bookmakers that offer the h2h (1X2) market.

Usage (local):
    python .github/scripts/fetch_odds_api.py --preview
    python .github/scripts/fetch_odds_api.py --upload

Usage (CI — GitHub Actions):
    python .github/scripts/fetch_odds_api.py --auto --upload
    (skips the upload if the next jornada is not within 5 days)

Credentials:
    Local:   reads VITE_SUPABASE_URL / VITE_SUPABASE_SERVICE_ROLE_KEY / ODDS_API_KEY
             from .env.local (git-ignored).
    CI:      reads SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / ODDS_API_KEY
             from GitHub Actions environment (set via repo Secrets).
"""

import sys
import io
import os
import argparse
import requests
from datetime import date, timedelta

# Load .env.local when running locally; no-op if the file does not exist (CI)
try:
    from dotenv import load_dotenv
    _ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    load_dotenv(os.path.join(_ROOT, ".env.local"), override=False)
except ImportError:
    pass

from supabase import create_client

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

# Support both local (VITE_ prefix) and CI (plain) env var names
SUPABASE_URL = os.environ.get("SUPABASE_URL") or os.environ["VITE_SUPABASE_URL"]
SUPABASE_KEY = (
    os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    or os.environ["VITE_SUPABASE_SERVICE_ROLE_KEY"]
)
ODDS_API_KEY = os.environ["ODDS_API_KEY"]

SEASON = "2025-2026"
SPORT  = "soccer_spain_la_liga"

# The Odds API team names → canonical names stored in our DB teams table
TEAM_NAME_MAP = {
    "Atletico Madrid":       "Atlético Madrid",
    "Atletico de Madrid":    "Atlético Madrid",
    "Atlético de Madrid":    "Atlético Madrid",
    "Atletico De Madrid":    "Atlético Madrid",
    "Alaves":                "Alavés",
    "Deportivo Alaves":      "Alavés",
    "Deportivo Alavés":      "Alavés",
    "CD Leganes":            "Leganés",
    "Leganes":               "Leganés",
    "Athletic Club":         "Athletic Club",
    "Athletic Bilbao":       "Athletic Club",
    "Barcelona":             "Barcelona",
    "FC Barcelona":          "Barcelona",
    "Celta Vigo":            "Celta Vigo",
    "Celta de Vigo":         "Celta Vigo",
    "Celta De Vigo":         "Celta Vigo",
    "RCD Espanyol":          "Espanyol",
    "Espanyol":              "Espanyol",
    "Getafe":                "Getafe",
    "Getafe CF":             "Getafe",
    "Girona":                "Girona",
    "Girona FC":             "Girona",
    "Las Palmas":            "Las Palmas",
    "UD Las Palmas":         "Las Palmas",
    "Mallorca":              "Mallorca",
    "RCD Mallorca":          "Mallorca",
    "Osasuna":               "Osasuna",
    "CA Osasuna":            "Osasuna",
    "Rayo Vallecano":        "Rayo Vallecano",
    "Rayo":                  "Rayo Vallecano",
    "Real Betis":            "Real Betis",
    "Betis":                 "Real Betis",
    "Real Madrid":           "Real Madrid",
    "Real Sociedad":         "Real Sociedad",
    "Sevilla":               "Sevilla",
    "Sevilla FC":            "Sevilla",
    "Valencia":              "Valencia",
    "Valencia CF":           "Valencia",
    "Valladolid":            "Valladolid",
    "Real Valladolid":       "Valladolid",
    "Villarreal":            "Villarreal",
    "Villarreal CF":         "Villarreal",
}


def normalize(name: str) -> str:
    return TEAM_NAME_MAP.get(name.strip(), name.strip())


def next_jornada_days_away(sb) -> int | None:
    """
    Return how many days until the first match of the next jornada.
    Returns None if no upcoming matches are found.
    """
    result = (
        sb.from_("matches")
        .select("match_date")
        .eq("season", SEASON)
        .is_("home_goals", "null")
        .not_.is_("match_date", "null")
        .order("match_date")
        .limit(1)
        .execute()
    )
    if not result.data:
        return None
    next_date = date.fromisoformat(result.data[0]["match_date"])
    return (next_date - date.today()).days


def fetch_odds() -> list:
    url = f"https://api.the-odds-api.com/v4/sports/{SPORT}/odds/"
    params = {
        "apiKey":     ODDS_API_KEY,
        "regions":    "eu",
        "markets":    "h2h",
        "oddsFormat": "decimal",
    }
    resp = requests.get(url, params=params, timeout=15)
    resp.raise_for_status()
    remaining = resp.headers.get("x-requests-remaining", "?")
    used      = resp.headers.get("x-requests-used", "?")
    print(f"[API] Requests used: {used}  |  Remaining this month: {remaining}")
    return resp.json()


def average_h2h(home_team_api: str, away_team_api: str, bookmakers: list) -> tuple:
    home_list, draw_list, away_list = [], [], []
    for bk in bookmakers:
        for market in bk.get("markets", []):
            if market["key"] != "h2h":
                continue
            by_name = {o["name"]: o["price"] for o in market.get("outcomes", [])}
            draw_p = by_name.get("Draw")
            home_p = by_name.get(home_team_api)
            away_p = by_name.get(away_team_api)
            # Fallback: take the two non-Draw values if exact name match fails
            if (home_p is None or away_p is None) and draw_p is not None:
                non_draw = [(k, v) for k, v in by_name.items() if k != "Draw"]
                if len(non_draw) == 2:
                    home_p, away_p = non_draw[0][1], non_draw[1][1]
            if home_p and draw_p and away_p:
                home_list.append(home_p)
                draw_list.append(draw_p)
                away_list.append(away_p)
    if not home_list:
        return None, None, None
    avg = lambda lst: round(sum(lst) / len(lst), 2)
    return avg(home_list), avg(draw_list), avg(away_list)


def main():
    parser = argparse.ArgumentParser(description="Import La Liga odds from The Odds API")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--preview", action="store_true",
                       help="Print what would be updated without writing to DB")
    group.add_argument("--upload",  action="store_true",
                       help="Write averaged odds to Supabase")
    parser.add_argument("--auto", action="store_true",
                        help="Only run if the next jornada starts within 5 days")
    args = parser.parse_args()

    sb = create_client(SUPABASE_URL, SUPABASE_KEY)

    # ── Auto-check: skip if jornada is not close enough ─────────────────────
    if args.auto:
        days = next_jornada_days_away(sb)
        if days is None:
            print("[AUTO] No upcoming matches found — nothing to do.")
            return
        print(f"[AUTO] Next jornada starts in {days} day(s).")
        if days > 5:
            print(f"[AUTO] More than 5 days away — skipping odds fetch.")
            return
        if days < 0:
            print(f"[AUTO] Jornada already started — skipping (use --upload manually if needed).")
            return
        print(f"[AUTO] Within 5-day window — proceeding with odds fetch.")

    # ── Fetch from API ───────────────────────────────────────────────────────
    print("[→] Fetching La Liga odds from The Odds API...")
    events = fetch_odds()
    print(f"[OK] {len(events)} upcoming events returned\n")

    # ── Load unplayed matches from DB ────────────────────────────────────────
    teams_resp = sb.from_("teams").select("id, name").execute()
    db_teams = {t["name"]: t["id"] for t in teams_resp.data}

    matches_resp = (
        sb.from_("matches")
        .select("id, matchday, match_date, home_team_id, away_team_id")
        .eq("season", SEASON)
        .is_("home_goals", "null")
        .execute()
    )
    unplayed = {
        (r["home_team_id"], r["away_team_id"]): r
        for r in matches_resp.data
    }
    print(f"[DB] {len(unplayed)} unplayed {SEASON} matches found\n")

    # ── Match API events → DB rows ───────────────────────────────────────────
    updates = []
    skipped = []

    for event in events:
        api_home = event.get("home_team", "")
        api_away = event.get("away_team", "")
        db_home  = normalize(api_home)
        db_away  = normalize(api_away)

        home_id = db_teams.get(db_home)
        away_id = db_teams.get(db_away)

        if not home_id or not away_id:
            skipped.append(
                f"  Unknown team — API: '{api_home}' vs '{api_away}'"
                f"  →  DB lookup: '{db_home}' vs '{db_away}'"
            )
            continue

        match = unplayed.get((home_id, away_id))
        if not match:
            skipped.append(f"  Not in unplayed DB: {db_home} vs {db_away}")
            continue

        home_avg, draw_avg, away_avg = average_h2h(
            api_home, api_away, event.get("bookmakers", [])
        )
        if home_avg is None:
            skipped.append(f"  No bookmaker odds: {db_home} vs {db_away}")
            continue

        updates.append({
            "id":         match["id"],
            "matchday":   match["matchday"],
            "match_date": match.get("match_date"),
            "home_name":  db_home,
            "away_name":  db_away,
            "home_odds":  home_avg,
            "draw_odds":  draw_avg,
            "away_odds":  away_avg,
            "bk_count":   len(event.get("bookmakers", [])),
        })

    # ── Print report ─────────────────────────────────────────────────────────
    print(f"{'─' * 78}")
    for u in updates:
        print(
            f"  J{u['matchday']:>2}  {u['match_date'] or '??-??-??'}  "
            f"{u['home_name']:<22} vs {u['away_name']:<22}  "
            f"1={u['home_odds']:.2f}  X={u['draw_odds']:.2f}  2={u['away_odds']:.2f}"
            f"  ({u['bk_count']} bks)"
        )
    print(f"{'─' * 78}")
    print(f"  {len(updates)} matches with odds  |  {len(skipped)} skipped\n")

    if skipped:
        print("[!] Skipped:")
        for s in skipped:
            print(s)
        print()

    if args.preview:
        print("[PREVIEW] No changes written. Run with --upload to save to Supabase.")
        return

    # ── Upload ───────────────────────────────────────────────────────────────
    print("[→] Writing to Supabase...")
    ok = 0
    for u in updates:
        sb.from_("matches").update({
            "home_odds": u["home_odds"],
            "draw_odds": u["draw_odds"],
            "away_odds": u["away_odds"],
        }).eq("id", u["id"]).execute()
        ok += 1

    print(f"[OK] Done — {ok}/{len(updates)} matches updated.")


if __name__ == "__main__":
    main()
