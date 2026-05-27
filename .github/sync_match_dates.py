"""
sync_match_dates.py — Sync match dates, kick-off times and scores from football-data.org

Run locally:
    python .github/sync_match_dates.py --preview   # show changes, no DB writes
    python .github/sync_match_dates.py --upload    # apply to Supabase
    python .github/sync_match_dates.py --upload --scores  # also sync scores

In CI the script reads secrets from environment variables (no .env.local needed).
"""

import sys, io, os, argparse, requests
from datetime import datetime
from zoneinfo import ZoneInfo
from dotenv import load_dotenv
from supabase import create_client

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(_ROOT, ".env.local"))

SUPABASE_URL = os.environ["VITE_SUPABASE_URL"]
SUPABASE_KEY = os.environ["VITE_SUPABASE_SERVICE_ROLE_KEY"]
FD_API_KEY   = os.environ.get("FOOTBALL_DATA_API_KEY", "")

SEASON     = "2025-2026"
MADRID_TZ  = ZoneInfo("Europe/Madrid")
FD_BASE    = "https://api.football-data.org/v4"
FD_COMP    = "PD"   # Primera División (La Liga)
FD_SEASON  = 2025   # start year of the season

# football-data.org team names → our DB team names
TEAM_NAME_MAP = {
    "FC Barcelona":             "Barcelona",
    "Real Madrid CF":           "Real Madrid",
    "Club Atlético de Madrid":  "Atlético Madrid",
    "Atlético de Madrid":       "Atlético Madrid",
    "Athletic Club":            "Athletic Club",
    "Real Betis Balompié":      "Real Betis",
    "Real Betis":               "Real Betis",
    "Villarreal CF":            "Villarreal",
    "Villarreal":               "Villarreal",
    "Sevilla FC":               "Sevilla",
    "Sevilla":                  "Sevilla",
    "RC Celta de Vigo":         "Celta Vigo",
    "Celta de Vigo":            "Celta Vigo",
    "Celta Vigo":               "Celta Vigo",
    "Rayo Vallecano":           "Rayo Vallecano",
    "Rayo Vallecano de Madrid": "Rayo Vallecano",
    "RCD Mallorca":             "Mallorca",
    "Mallorca":                 "Mallorca",
    "Getafe CF":                "Getafe",
    "Getafe":                   "Getafe",
    "CA Osasuna":               "Osasuna",
    "Osasuna":                  "Osasuna",
    "UD Las Palmas":            "Las Palmas",
    "Las Palmas":               "Las Palmas",
    "RCD Espanyol":                "Espanyol",
    "RCD Espanyol de Barcelona":   "Espanyol",
    "Espanyol":                    "Espanyol",
    "Deportivo Alavés":         "Alavés",
    "Alavés":                   "Alavés",
    "Girona FC":                "Girona",
    "Girona":                   "Girona",
    "Valencia CF":              "Valencia",
    "Valencia":                 "Valencia",
    "Real Valladolid CF":       "Valladolid",
    "Valladolid":               "Valladolid",
    "Real Sociedad":            "Real Sociedad",
    "Real Sociedad de Fútbol":  "Real Sociedad",
    "Elche CF":                 "Elche",
    "Elche":                    "Elche",
    "Levante UD":               "Levante",
    "Levante":                  "Levante",
    "Real Oviedo":              "Real Oviedo",
    "CD Leganés":               "Leganés",
    "Leganés":                  "Leganés",
}


def normalize(name: str) -> str:
    return TEAM_NAME_MAP.get(name.strip(), name.strip())


def utc_to_madrid(iso_str: str):
    """Return (YYYY-MM-DD, HH:MM) in Madrid local time.
    Returns (date, None) when time is midnight UTC — football-data.org's placeholder
    for matches whose kick-off hasn't been confirmed yet."""
    dt = datetime.fromisoformat(iso_str.replace("Z", "+00:00"))
    dt_mad = dt.astimezone(MADRID_TZ)
    time_str = dt_mad.strftime("%H:%M")
    # 00:00 UTC = 01:00 or 02:00 Madrid — never a real La Liga kick-off time
    is_placeholder = dt.hour == 0 and dt.minute == 0
    return dt_mad.strftime("%Y-%m-%d"), (None if is_placeholder else time_str)


def fetch_season_matches() -> list:
    if not FD_API_KEY:
        print("[ERROR] FOOTBALL_DATA_API_KEY not set")
        sys.exit(1)

    url = f"{FD_BASE}/competitions/{FD_COMP}/matches"
    headers = {"X-Auth-Token": FD_API_KEY}
    params  = {"season": FD_SEASON}

    resp = requests.get(url, headers=headers, params=params, timeout=20)
    if resp.status_code == 403:
        print("[ERROR] API key rejected (403). Check FOOTBALL_DATA_API_KEY secret.")
        sys.exit(1)
    resp.raise_for_status()

    data = resp.json()
    matches = data.get("matches", [])
    print(f"[API] football-data.org returned {len(matches)} matches for La Liga {FD_SEASON}")
    return matches


def main():
    parser = argparse.ArgumentParser()
    group  = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--preview", action="store_true")
    group.add_argument("--upload",  action="store_true")
    parser.add_argument("--scores", action="store_true",
                        help="Also update scores for finished matches")
    args = parser.parse_args()

    api_matches = fetch_season_matches()

    sb = create_client(SUPABASE_URL, SUPABASE_KEY)
    db_teams = {t["name"]: t["id"]
                for t in sb.from_("teams").select("id,name").execute().data}

    db_rows = (
        sb.from_("matches")
        .select("id, matchday, home_team_id, away_team_id, match_date, kick_off_time, home_goals, away_goals")
        .eq("season", SEASON)
        .execute()
        .data
    )
    db_map = {(r["matchday"], r["home_team_id"], r["away_team_id"]): r for r in db_rows}
    print(f"[DB]  {len(db_map)} matches loaded for season {SEASON}\n")

    updates     = []
    unknown     = []
    not_in_db   = []

    for m in api_matches:
        matchday  = m.get("matchday")
        utc_date  = m.get("utcDate", "")
        status    = m.get("status", "")
        home_name = normalize(m.get("homeTeam", {}).get("name", ""))
        away_name = normalize(m.get("awayTeam", {}).get("name", ""))

        home_id = db_teams.get(home_name)
        away_id = db_teams.get(away_name)

        if not home_id or not away_id:
            unknown.append(
                f"  J{matchday}: API '{m['homeTeam']['name']}' vs '{m['awayTeam']['name']}'"
                f" → DB lookup '{home_name}' vs '{away_name}'"
            )
            continue

        db_row = db_map.get((matchday, home_id, away_id))
        if not db_row:
            not_in_db.append(f"  J{matchday}: {home_name} vs {away_name}")
            continue

        api_date, api_time = utc_to_madrid(utc_date) if utc_date else (None, None)

        payload = {}
        notes   = []

        if api_date and api_date != db_row.get("match_date"):
            payload["match_date"] = api_date
            notes.append(f"date {db_row.get('match_date')} → {api_date}")

        if api_time and api_time != db_row.get("kick_off_time"):
            payload["kick_off_time"] = api_time
            notes.append(f"time {db_row.get('kick_off_time')} → {api_time}")

        if args.scores and status == "FINISHED":
            ft = m.get("score", {}).get("fullTime", {})
            api_home_g = ft.get("home")
            api_away_g = ft.get("away")
            if api_home_g is not None and api_away_g is not None:
                if db_row.get("home_goals") is None:
                    payload["home_goals"] = api_home_g
                    payload["away_goals"] = api_away_g
                    notes.append(f"score {api_home_g}-{api_away_g}")

        if not payload:
            continue

        updates.append({
            "id":       db_row["id"],
            "matchday": matchday,
            "home":     home_name,
            "away":     away_name,
            "date":     api_date,
            "time":     api_time,
            "status":   status,
            "payload":  payload,
            "notes":    ", ".join(notes),
        })

    # ── Report ─────────────────────────────────────────────────────────────────
    print(f"{'─'*90}")
    if updates:
        for u in sorted(updates, key=lambda x: (x["matchday"], x["home"])):
            print(f"  J{u['matchday']:>2}  {u['date'] or '?':12}  {u['time'] or '?':6}"
                  f"  {u['home']:<22} vs {u['away']:<22}  [{u['notes']}]")
    print(f"{'─'*90}")
    print(f"  {len(updates)} matches to update  |  {len(unknown)} unknown teams  |  {len(not_in_db)} not in DB\n")

    if unknown:
        print("[!] Unrecognized team names (add to TEAM_NAME_MAP):")
        for s in unknown:
            print(s)
        print()

    if not_in_db:
        print("[!] Matches from API not found in DB:")
        for s in not_in_db[:10]:
            print(s)
        print()

    if args.preview:
        print("[PREVIEW] No changes written. Run with --upload to apply.")
        return

    if not updates:
        print("[OK] Nothing to update.")
        return

    # ── Apply ──────────────────────────────────────────────────────────────────
    print("[→] Applying updates to Supabase...")
    ok = fail = 0
    for u in updates:
        try:
            sb.from_("matches").update(u["payload"]).eq("id", u["id"]).execute()
            ok += 1
        except Exception as e:
            print(f"  [!] J{u['matchday']} {u['home']} vs {u['away']}: {e}")
            fail += 1

    print(f"\n[OK] Done — {ok} updated, {fail} failed.")


if __name__ == "__main__":
    main()
