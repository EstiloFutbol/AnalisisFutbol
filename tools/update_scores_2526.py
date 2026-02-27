import sys
import io
import csv
import os
import re
from datetime import datetime
from dotenv import load_dotenv
from supabase import create_client

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# Anchor all paths to the project root (one level above this script)
_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(_ROOT, ".env.local"))
SUPABASE_URL = os.environ["VITE_SUPABASE_URL"]
SUPABASE_KEY = os.environ["VITE_SUPABASE_SERVICE_ROLE_KEY"]
CSV_FILE = os.path.join(_ROOT, "data", "fixtures_2526.csv")
SEASON = "2025-2026"

TEAM_NAME_MAP = {
    "Atletico Madrid":  "Atlético Madrid",
    "Alaves":           "Alavés",
    "Alavés":           "Alavés",
    "Oviedo":           "Real Oviedo",
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
    return TEAM_NAME_MAP.get(name.strip(), name.strip())

def parse_score(score_str):
    """Parse score, handling ASCII hyphen, Unicode en-dash, and Windows-1252 en-dash (0x96)."""
    if not score_str or not score_str.strip():
        return None, None
    s = score_str.strip()
    # Match digit(s), then any dash variant, then digit(s)
    m = re.match(r"(\d+)[\-\x96\u2013\u2014](\d+)", s)
    if m:
        return int(m.group(1)), int(m.group(2))
    return None, None

def main():
    sb = create_client(SUPABASE_URL, SUPABASE_KEY)

    # Fetch teams
    teams_resp = sb.from_("teams").select("id, name").execute()
    db_teams = {t["name"]: t["id"] for t in teams_resp.data}

    # Fetch existing 25/26 matches (id + team ids + matchday + current goals)
    existing_resp = (
        sb.from_("matches")
        .select("id, matchday, home_team_id, away_team_id, home_goals, away_goals")
        .eq("season", SEASON)
        .execute()
    )
    # Build lookup: (matchday, home_team_id, away_team_id) -> match record
    existing = {
        (r["matchday"], r["home_team_id"], r["away_team_id"]): r
        for r in existing_resp.data
    }
    print(f"[OK] Found {len(existing)} existing 25/26 matches")

    updates = []

    with open(CSV_FILE, encoding="cp1252") as f:
        reader = csv.DictReader(f, delimiter=";")
        for row in reader:
            matchday = int(row["Wk"].strip()) if row["Wk"].strip() else None
            home_name = normalize_name(row["Home"])
            away_name = normalize_name(row["Away"])
            home_id = db_teams.get(home_name)
            away_id = db_teams.get(away_name)

            if not home_id or not away_id or not matchday:
                continue

            home_goals, away_goals = parse_score(row["Score"])
            if home_goals is None:
                continue  # No score to update

            key = (matchday, home_id, away_id)
            match = existing.get(key)
            if not match:
                continue  # Match not in DB

            if match["home_goals"] is not None:
                continue  # Already has a score, skip

            updates.append({
                "id":         match["id"],
                "home_goals": home_goals,
                "away_goals": away_goals,
            })

    print(f"[OK] {len(updates)} matches need score updates")

    if not updates:
        print("Nothing to update.")
        return

    # Update in batches
    for i, upd in enumerate(updates):
        sb.from_("matches").update({
            "home_goals": upd["home_goals"],
            "away_goals": upd["away_goals"],
        }).eq("id", upd["id"]).execute()
        if (i + 1) % 20 == 0:
            print(f"  Updated {i+1}/{len(updates)}...", end="\r")

    print(f"\n[OK] Done! {len(updates)} match scores updated.")

if __name__ == "__main__":
    main()
