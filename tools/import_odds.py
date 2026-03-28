"""
import_odds.py — Betting Odds Importer

Reads an odds Excel file (e.g. w29_odds.xlsx) from src/match_files/odds/
and updates existing matches in the DB with their 1X2 betting odds.
If a match is not yet in the DB, a stub fixture is inserted.

Usage:
    python tools/import_odds.py src/match_files/w29_odds.xlsx
    python tools/import_odds.py src/match_files/w29_odds.xlsx --upload
"""

import sys, os, re, glob
import numpy as np
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client

# ── Config ────────────────────────────────────────────────────────────────────
_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(_ROOT, ".env.local"))
SUPABASE_URL = os.environ["VITE_SUPABASE_URL"]
SUPABASE_KEY = os.environ["VITE_SUPABASE_SERVICE_ROLE_KEY"]

# ── Team name normalization ───────────────────────────────────────────────────
TEAM_NAME_MAP = {
    # Variations that appear in betting sites → canonical DB name
    "Atletico Madrid":     "Atlético Madrid",
    "Atletico de Madrid":  "Atlético Madrid",
    "Atlético de Madrid":  "Atlético Madrid",
    "Atletico De Madrid":  "Atlético Madrid",
    "Alaves":              "Alavés",
    "Leganes":             "Leganés",
    "Celta de Vigo":       "Celta Vigo",
    "Celta De Vigo":       "Celta Vigo",
    "Oviedo":              "Real Oviedo",
    "Deportivo Alaves":    "Alavés",
    "Villarreal CF":       "Villarreal",
    "RCD Espanyol":        "Espanyol",
    "Rayo":                "Rayo Vallecano",
}

def normalize_team(name):
    if not name or not isinstance(name, str):
        return None
    name = name.strip().replace('\xa0', '').replace('_x000D_', '').strip()
    return TEAM_NAME_MAP.get(name, name)

# ── Excel parser ──────────────────────────────────────────────────────────────

def is_integer_value(v):
    """True if v is an integer-like value (could be a score like 21 = 2-1)."""
    if isinstance(v, (int, np.integer)):
        return True
    # A float with no decimal part AND small enough to be a score (0–99)
    if isinstance(v, float) and v == int(v) and 0 <= v <= 99:
        return True
    return False

def is_odds_value(v):
    """True if v looks like betting odds (float, typically 1.0–20.0)."""
    try:
        f = float(v)
        return 1.0 <= f <= 50.0 and not is_integer_value(v)
    except (TypeError, ValueError):
        return False

STATUS_PATTERNS = [
    r'Finalizado', r'Descanso',
    # Live minute: "45+2'" or "45+2\xa0" (non-breaking space used by betting site)
    r"\d+\+?\d*[\u2019\u2032\u02bc'\xa0]",
    # Plain minute with no suffix — e.g. "90" alone is ambiguous, but "90+" is a match min
    r"\d+\+\d*$",
]

def is_status_row(v):
    """True if this cell is a match status indicator (time, result state, or live min)."""
    if not v or not isinstance(v, str):
        return False
    v = v.strip()
    # Kickoff time like "21:00:00" or "14:00:00"
    if re.match(r'^\d{1,2}:\d{2}(:\d{2})?$', v):
        return True
    for pat in STATUS_PATTERNS:
        if re.search(pat, v, re.IGNORECASE):
            return True
    return False

def parse_odds_sheet(df):
    """
    Parse a single sheet and return a list of match dicts:
      {home_team, away_team, home_odds, draw_odds, away_odds}
    """
    values = [df.iloc[i, 0] for i in range(len(df))]
    matches = []
    i = 0

    while i < len(values):
        v = values[i]

        # Look for a status row that marks the start of a match block
        str_v = str(v).strip().replace('\xa0', '') if v is not None and not (isinstance(v, float) and np.isnan(v)) else ''

        if is_status_row(str_v):
            # Try to parse the block starting at i
            # Pattern: STATUS, NaN, NaN, HOME_TEAM, NaN, AWAY_TEAM, [SCORE|ODDS], ...
            try:
                home_team = None
                away_team = None
                # Scan next 8 cells for team names and odds
                block = []
                for j in range(i + 1, min(i + 12, len(values))):
                    cell = values[j]
                    cell_str = str(cell).strip().replace('\xa0', '') if cell is not None and not (isinstance(cell, float) and np.isnan(cell)) else ''
                    block.append((j, cell, cell_str))

                # Find team names (non-empty strings that aren't known keywords)
                teams_found = []
                for idx, cell, cell_str in block:
                    if cell_str and not is_status_row(cell_str) and not is_odds_value(cell) and not is_integer_value(cell):
                        teams_found.append((idx, cell_str))
                    if len(teams_found) == 2:
                        break

                if len(teams_found) < 2:
                    i += 1
                    continue

                home_idx, home_name = teams_found[0]
                away_idx, away_name = teams_found[1]

                home_team = normalize_team(home_name)
                away_team = normalize_team(away_name)

                # After away team, look for score (int) then odds, OR directly odds
                odds_start = away_idx + 1
                # Skip if it's a score (integer)
                if odds_start < len(values) and is_integer_value(values[odds_start]):
                    odds_start += 1  # skip score row

                # Now read 3 consecutive odds values
                odds = []
                j = odds_start
                while j < min(odds_start + 5, len(values)) and len(odds) < 3:
                    candidate = values[j]
                    if is_odds_value(candidate):
                        odds.append(float(candidate))
                    j += 1

                if len(odds) == 3 and home_team and away_team:
                    matches.append({
                        'home_team': home_team,
                        'away_team': away_team,
                        'home_odds': round(odds[0], 2),
                        'draw_odds': round(odds[1], 2),
                        'away_odds': round(odds[2], 2),
                    })

                # Jump past this block
                i = j
                continue

            except Exception as e:
                pass

        i += 1

    return matches


def parse_odds_file(filepath):
    """Parse all sheets in the odds Excel file."""
    matchday = None
    basename = os.path.basename(filepath)
    m = re.search(r'w(\d+)', basename, re.IGNORECASE)
    if m:
        matchday = int(m.group(1))

    all_matches = []
    with pd.ExcelFile(filepath) as xl:
        for sheet in xl.sheet_names:
            df = pd.read_excel(filepath, sheet_name=sheet, header=None)
            sheet_matches = parse_odds_sheet(df)
            all_matches.extend(sheet_matches)

    # Deduplicate by home+away team pair
    seen = set()
    unique = []
    for m in all_matches:
        key = (m['home_team'], m['away_team'])
        if key not in seen:
            seen.add(key)
            m['matchday'] = matchday
            unique.append(m)

    return unique


# ── DB upload ─────────────────────────────────────────────────────────────────

def upload_odds(sb, db_teams, matches):
    ok = fail = inserted = 0

    for m in matches:
        home_id = db_teams.get(m['home_team'])
        away_id = db_teams.get(m['away_team'])

        if not home_id:
            print(f"  [!] Team not found in DB: '{m['home_team']}'")
            fail += 1
            continue
        if not away_id:
            print(f"  [!] Team not found in DB: '{m['away_team']}'")
            fail += 1
            continue

        odds_payload = {
            'home_odds': m['home_odds'],
            'draw_odds': m['draw_odds'],
            'away_odds': m['away_odds'],
        }

        # Try to find existing match
        query = (sb.from_('matches')
                   .select('id')
                   .eq('home_team_id', home_id)
                   .eq('away_team_id', away_id))
        if m.get('matchday'):
            query = query.eq('matchday', m['matchday'])

        resp = query.execute()

        if resp.data:
            # Update existing match with odds
            match_id = resp.data[0]['id']
            sb.from_('matches').update(odds_payload).eq('id', match_id).execute()
            print(f"  [OK] Updated J{m['matchday']:02d} {m['home_team']} vs {m['away_team']}  "
                  f"  {m['home_odds']}/{m['draw_odds']}/{m['away_odds']}")
            ok += 1
        else:
            # Insert stub fixture (to be filled in when match report is imported)
            stub = {
                'matchday':     m.get('matchday'),
                'home_team_id': home_id,
                'away_team_id': away_id,
                'home_odds':    m['home_odds'],
                'draw_odds':    m['draw_odds'],
                'away_odds':    m['away_odds'],
                'season':       '2025-2026',
            }
            sb.from_('matches').insert(stub).execute()
            print(f"  [NEW] Inserted stub J{m['matchday']:02d} {m['home_team']} vs {m['away_team']}  "
                  f"  {m['home_odds']}/{m['draw_odds']}/{m['away_odds']}")
            inserted += 1

    return ok, inserted, fail


# ── Entry point ───────────────────────────────────────────────────────────────

def main():
    if len(sys.argv) < 2:
        # Auto-find odds files in src/match_files/
        pattern = os.path.join(_ROOT, 'src', 'match_files', '*odds*.xlsx')
        files = sorted(glob.glob(pattern))
        if not files:
            print("Usage: python tools/import_odds.py <odds_file.xlsx> [--upload]")
            print("No odds files found automatically either.")
            return
        filepath = files[-1]  # use the most recent
        print(f"Auto-detected: {os.path.basename(filepath)}")
    else:
        filepath = sys.argv[1]
        if not os.path.isabs(filepath):
            filepath = os.path.join(_ROOT, filepath)

    upload = '--upload' in sys.argv

    print(f"\nParsing: {os.path.basename(filepath)}")
    print("=" * 60)
    matches = parse_odds_file(filepath)

    if not matches:
        print("No matches found. Check the file format.")
        return

    print(f"\nFound {len(matches)} match(es):\n")
    for m in matches:
        print(f"  J{m.get('matchday', '?'):>2}  {m['home_team']:<22} vs {m['away_team']:<22}"
              f"  {m['home_odds']}/{m['draw_odds']}/{m['away_odds']}")

    if not upload:
        print(f"\n{'=' * 60}")
        print("  Preview only. Run with --upload to save to DB.")
        print(f"{'=' * 60}\n")
        return

    print(f"\n[Connecting to Supabase...]")
    sb = create_client(SUPABASE_URL, SUPABASE_KEY)
    db_teams = {t['name']: t['id'] for t in sb.from_('teams').select('id,name').execute().data}

    ok, inserted, fail = upload_odds(sb, db_teams, matches)

    print(f"\n{'=' * 60}")
    print(f"  Done: {ok} updated, {inserted} new stubs inserted, {fail} failed.")
    print(f"{'=' * 60}\n")


if __name__ == '__main__':
    main()
