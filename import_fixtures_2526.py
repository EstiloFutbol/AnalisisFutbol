import sys
import io
import csv
import os
import re
from datetime import datetime
from dotenv import load_dotenv
from supabase import create_client

# Fix Windows console Unicode issues
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

"""
Import fixtures_2526.csv into Supabase matches table.
- Skips matches that already exist (matched by matchday + home_team_id + away_team_id + season)
- Parses scores where available (played matches)
- Leaves stat columns as NULL for future fixtures
"""

# Config
load_dotenv(".env.local")
SUPABASE_URL = os.environ["VITE_SUPABASE_URL"]
SUPABASE_KEY = os.environ["VITE_SUPABASE_SERVICE_ROLE_KEY"]
CSV_FILE = "fixtures_2526.csv"
SEASON = "2025-2026"

# Name mapping: CSV name -> DB team name (exact DB names from teams table)
TEAM_NAME_MAP = {
    # CSV uses no accents, DB has accents
    "Atletico Madrid":  "Atlético Madrid",
    "Alaves":           "Alavés",
    "Alavés":           "Alavés",
    "Oviedo":           "Real Oviedo",          # CSV says "Oviedo", DB has "Real Oviedo"
    # The rest match directly
    "Athletic Club":    "Athletic Club",
    "Barcelona":        "Barcelona",
    "Celta Vigo":       "Celta Vigo",
    "Elche":            "Elche",
    "Espanyol":         "Espanyol",
    "Getafe":           "Getafe",
    "Girona":           "Girona",
    "Las Palmas":       "Las Palmas",
    "Leganes":          "Leganés",
    "Leganés":          "Leganés",
    "Levante":          "Levante",
    "Mallorca":         "Mallorca",
    "Osasuna":          "Osasuna",
    "Rayo Vallecano":   "Rayo Vallecano",
    "Real Betis":       "Real Betis",
    "Real Madrid":      "Real Madrid",
    "Real Sociedad":    "Real Sociedad",
    "Sevilla":          "Sevilla",
    "Valencia":         "Valencia",
    "Valladolid":       "Valladolid",
    "Villarreal":       "Villarreal",
}


def normalize_name(name):
    name = name.strip()
    return TEAM_NAME_MAP.get(name, name)

def parse_date(date_str):
    if not date_str.strip():
        return None
    try:
        return datetime.strptime(date_str.strip(), "%d/%m/%Y").strftime("%Y-%m-%d")
    except ValueError:
        return None

def parse_score(score_str):
    if not score_str or not score_str.strip():
        return None, None
    s = score_str.strip()
    m = re.match(r"(\d+)[–\-](\d+)", s)
    if m:
        return int(m.group(1)), int(m.group(2))
    return None, None

def main():
    sb = create_client(SUPABASE_URL, SUPABASE_KEY)

    # Fetch all teams from DB -> name: id map
    teams_resp = sb.from_("teams").select("id, name").execute()
    db_teams = {t["name"]: t["id"] for t in teams_resp.data}
    print(f"[OK] Loaded {len(db_teams)} teams from DB")
    print("     Teams in DB:", sorted(db_teams.keys()))

    # Show what seasons exist in DB
    seasons_resp = sb.from_("matches").select("season").execute()
    distinct_seasons = sorted(set(r["season"] for r in seasons_resp.data if r["season"]))
    print(f"     Seasons in DB: {distinct_seasons}")

    # Fetch existing 25/26 matches to avoid duplicates
    existing_resp = (
        sb.from_("matches")
        .select("matchday, home_team_id, away_team_id")
        .eq("season", SEASON)
        .execute()
    )
    existing = {
        (r["matchday"], r["home_team_id"], r["away_team_id"])
        for r in existing_resp.data
    }
    print(f"[OK] Found {len(existing)} existing 25/26 matches in DB")

    rows_to_insert = []
    skipped_existing = 0
    skipped_no_team = []

    with open(CSV_FILE, encoding="latin-1") as f:
        reader = csv.DictReader(f, delimiter=";")
        for row in reader:
            matchday = int(row["Wk"].strip()) if row["Wk"].strip() else None
            match_date = parse_date(row["Date"])
            kick_off = row["Time"].strip() or None
            stadium = row["Venue"].strip() or None
            referee = row["Referee"].strip() or None
            attendance_raw = row["Attendance"].replace(",", "").strip()
            attendance = int(attendance_raw) if attendance_raw.isdigit() else None

            home_name = normalize_name(row["Home"])
            away_name = normalize_name(row["Away"])

            home_id = db_teams.get(home_name)
            away_id = db_teams.get(away_name)

            if not home_id or not away_id:
                skipped_no_team.append(f"  J{matchday}: '{home_name}' vs '{away_name}'  [home_found={bool(home_id)}, away_found={bool(away_id)}]")
                continue

            key = (matchday, home_id, away_id)
            if key in existing:
                skipped_existing += 1
                continue

            home_goals, away_goals = parse_score(row["Score"])

            rows_to_insert.append({
                "season":        SEASON,
                "league_id":     2,
                "matchday":      matchday,
                "match_date":    match_date,
                "kick_off_time": kick_off,
                "home_team_id":  home_id,
                "away_team_id":  away_id,
                "home_goals":    home_goals,
                "away_goals":    away_goals,
                "stadium":       stadium,
                "referee":       referee,
                "attendance":    attendance,
            })

    print(f"\n-- Summary --")
    print(f"  To insert:          {len(rows_to_insert)}")
    print(f"  Skipped (existing): {skipped_existing}")
    print(f"  Skipped (no team):  {len(skipped_no_team)}")
    for s in skipped_no_team[:20]:
        print(s)

    if not rows_to_insert:
        print("Nothing to insert. Done!")
        return

    # Insert in batches of 50
    BATCH = 50
    inserted = 0
    for i in range(0, len(rows_to_insert), BATCH):
        batch = rows_to_insert[i:i+BATCH]
        sb.from_("matches").insert(batch).execute()
        inserted += len(batch)
        print(f"  Inserted {inserted}/{len(rows_to_insert)}...", end="\r")

    print(f"\n[OK] Done! {inserted} new fixtures inserted.")

if __name__ == "__main__":
    main()
