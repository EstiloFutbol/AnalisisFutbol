"""
limpieza_datos.py — FBref Excel Match Report Parser & Supabase Uploader

Usage:
    python limpieza_datos.py              # Preview all match files (no DB write)
    python limpieza_datos.py --upload     # Parse and upload to DB

Place FBref Excel match reports in: src/match_files/*.xlsx

Extracted fields:
  Match:       home/away teams, date, kick-off, matchday, score
  Venue:       stadium, referee, attendance
  Coaches:     home/away coach names
  Formations:  home/away (e.g. "3-4-3")
  Goals:       home/away goal minutes list
  Team Stats:  possession, shots, shots on target, fouls, corners,
               crosses, interceptions, offsides, yellow/red cards, saves
  Per-player:  goals, assists, shots, SoT, cards, fouls, minutes,
               tackles won, interceptions, offsides (stored as JSON)
  GK stats:    SoTA, goals against, saves, save% (per keeper)
"""

import sys, io, os, re, glob, datetime, json
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# ── Config ──────────────────────────────────────────────────────────────────
# Anchor all paths to the project root (one level above this script)
_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(_ROOT, ".env.local"))
SUPABASE_URL = os.environ["VITE_SUPABASE_URL"]
SUPABASE_KEY = os.environ["VITE_SUPABASE_SERVICE_ROLE_KEY"]
MATCH_FILES_DIR = os.path.join(_ROOT, "src", "match_files")

TEAM_NAME_MAP = {
    "Atletico Madrid":    "Atlético Madrid",
    "Atletico de Madrid": "Atlético Madrid",
    "Alaves":             "Alavés",
    "Leganes":            "Leganés",
    "Oviedo":             "Real Oviedo",
    "Real Oviedo":        "Real Oviedo",
}

def normalize_team(name):
    name = name.strip()
    return TEAM_NAME_MAP.get(name, name)

# ── Helpers ──────────────────────────────────────────────────────────────────

def clean(val):
    if val is None or (isinstance(val, float) and str(val) == 'nan'):
        return None
    if isinstance(val, datetime.time):
        return val  # keep time objects as-is for score parsing
    s = str(val).replace('\xa0', ' ').strip()
    return s if s else None

def find_row(df, text, start=0):
    """Return first row index where col-0 contains text (case-insensitive)."""
    text = text.lower()
    for i in range(start, len(df)):
        v = clean(df.iloc[i, 0])
        if v and isinstance(v, str) and text in v.lower():
            return i
    return None

def parse_minute(raw):
    if not raw:
        return None
    m = re.search(r'(\d+)\+?(\d*)', str(raw).strip())
    if m:
        return int(m.group(1)) + (int(m.group(2)) if m.group(2) else 0)
    return None

def parse_possession(raw):
    try:
        v = float(raw)
        return int(round(v * 100)) if v <= 1 else int(round(v))
    except:
        return None

def parse_shots_cell(raw):
    """'5 of 14 — 36%'  →  sot=5, total=14"""
    if not raw:
        return None, None
    m = re.search(r'(\d+)\s+of\s+(\d+)', str(raw))
    if m:
        return int(m.group(1)), int(m.group(2))
    m2 = re.search(r'(\d+)', str(raw))
    return (int(m2.group(1)), None) if m2 else (None, None)

def parse_saves_cell(raw):
    """'80% — 4 of 5'  →  saves=4, sota=5"""
    if not raw:
        return None, None
    m = re.search(r'(\d+)\s+of\s+(\d+)', str(raw))
    if m:
        return int(m.group(1)), int(m.group(2))
    return None, None

def get_int(val):
    try:
        return int(val)
    except:
        return None

def get_float(val):
    try:
        return float(val)
    except:
        return None

# ── Team Stats block ─────────────────────────────────────────────────────────

def parse_team_stats(df, stats_row):
    """
    Parses the zigzag Team Stats section:
      Label row → value above/below label alternates home/away side.
    Returns a dict with home_* and away_* keys.
    """
    s = {}
    i = stats_row
    limit = min(i + 50, len(df))

    while i < limit:
        label = clean(df.iloc[i, 0])
        if not isinstance(label, str):
            i += 1; continue

        if "Possession" in label:
            row_vals = [clean(df.iloc[i+1, c]) for c in range(df.shape[1]) if clean(df.iloc[i+1, c])]
            if len(row_vals) >= 2:
                s["home_possession"] = parse_possession(row_vals[0])
                s["away_possession"] = parse_possession(row_vals[1])

        elif "Shots on Target" in label:
            row_vals = [clean(df.iloc[i+1, c]) for c in range(df.shape[1]) if clean(df.iloc[i+1, c])]
            if len(row_vals) >= 2:
                sot_h, sh_h = parse_shots_cell(row_vals[0])
                # Away cell is "29% — 2 of 7" (reversed order)
                m = re.search(r'(\d+)\s+of\s+(\d+)', str(row_vals[1]))
                sot_a = int(m.group(1)) if m else None
                sh_a  = int(m.group(2)) if m else None
                s.update(home_shots_on_target=sot_h, home_shots=sh_h,
                         away_shots_on_target=sot_a, away_shots=sh_a)

        elif label == "Saves":
            row_vals = [clean(df.iloc[i+1, c]) for c in range(df.shape[1]) if clean(df.iloc[i+1, c])]
            if len(row_vals) >= 2:
                sv_h, _ = parse_saves_cell(row_vals[0])
                # Away: "80% — 4 of 5"
                m = re.search(r'(\d+)\s+of\s+(\d+)', str(row_vals[1]))
                sv_a = int(m.group(1)) if m else None
                s.update(home_saves=sv_h, away_saves=sv_a)

        elif label == "Fouls":
            s["home_fouls"] = get_int(clean(df.iloc[i-1, 0]))
            s["away_fouls"] = get_int(clean(df.iloc[i+1, 0]))

        elif label == "Corners":
            s["home_corners"] = get_int(clean(df.iloc[i-1, 0]))
            s["away_corners"] = get_int(clean(df.iloc[i+1, 0]))

        elif label == "Crosses":
            s["home_crosses"] = get_int(clean(df.iloc[i-1, 0]))
            s["away_crosses"] = get_int(clean(df.iloc[i+1, 0]))

        elif label == "Interceptions":
            s["home_interceptions"] = get_int(clean(df.iloc[i-1, 0]))
            s["away_interceptions"] = get_int(clean(df.iloc[i+1, 0]))

        elif label == "Offsides":
            s["home_offsides"] = get_int(clean(df.iloc[i-1, 0]))
            s["away_offsides"] = get_int(clean(df.iloc[i+1, 0]))

        i += 1
    return s

# ── Player stats table ───────────────────────────────────────────────────────

def parse_player_table(df, header_row):
    """Return list of player dicts from a player stats table."""
    # Build col_name -> df_col_index map from the header row
    col_map = {}
    for c in range(df.shape[1]):
        v = clean(df.iloc[header_row, c])
        if v and isinstance(v, str):
            col_map[v] = c

    def gcol(row, name, default=None):
        c = col_map.get(name)
        return get_int(clean(df.iloc[row, c])) if c is not None else default

    players = []
    j = header_row + 1
    while j < len(df):
        name_val = df.iloc[j, col_map.get('Player', 0)]
        if pd.isna(name_val):
            j += 1; continue
        name = str(name_val).replace('\xa0', ' ').strip()
        if not name or 'Players' in name:
            break
        is_sub = str(name_val).startswith('\xa0') or str(name_val).startswith(' ')
        players.append({
            "name":       name,
            "is_sub":     is_sub,
            "number":     gcol(j, '#'),
            "pos":        clean(df.iloc[j, col_map['Pos']]) if 'Pos' in col_map else None,
            "minutes":    gcol(j, 'Min'),
            "goals":      gcol(j, 'Gls', 0),
            "assists":    gcol(j, 'Ast', 0),
            "pk":         gcol(j, 'PK', 0),
            "pk_att":     gcol(j, 'PKatt', 0),
            "shots":      gcol(j, 'Sh', 0),
            "shots_ot":   gcol(j, 'SoT', 0),
            "yellow":     gcol(j, 'CrdY', 0),
            "red":        gcol(j, 'CrdR', 0),
            "fouls_com":  gcol(j, 'Fls', 0),
            "fouls_drawn":gcol(j, 'Fld', 0),
            "offsides":   gcol(j, 'Off', 0),
            "crosses":    gcol(j, 'Crs', 0),
            "tackles_w":  gcol(j, 'TklW', 0),
            "ints":       gcol(j, 'Int', 0),
            "own_goals":  gcol(j, 'OG', 0),
        })
        j += 1
    return players


GK_COLS = ['Player','Nation','Age','Min','SoTA','GA','Saves','Save%']

def parse_gk_table(df, header_row):
    """Return list of GK stat dicts."""
    col_map = {}
    for c in range(df.shape[1]):
        v = clean(df.iloc[header_row, c])
        if v and isinstance(v, str):
            col_map[v] = c

    def gcol(row, name, default=None):
        c = col_map.get(name)
        if c is None: return default
        v = clean(df.iloc[row, c])
        return get_float(v) if name == 'Save%' else get_int(v)

    gks = []
    j = header_row + 1
    while j < len(df):
        name_val = df.iloc[j, col_map.get('Player', 0)]
        if pd.isna(name_val): break
        name = str(name_val).replace('\xa0', ' ').strip()
        if not name: break
        gks.append({
            "name":          name,
            "minutes":       gcol(j, 'Min'),
            "shots_faced":   gcol(j, 'SoTA'),
            "goals_against": gcol(j, 'GA'),
            "saves":         gcol(j, 'Saves'),
            "save_pct":      gcol(j, 'Save%'),
        })
        j += 1
    return gks

# ── Main parser ──────────────────────────────────────────────────────────────

def parse_match_file(filepath, sheet_name=0):
    df = pd.read_excel(filepath, sheet_name=sheet_name, header=None)
    fname = os.path.basename(filepath)
    sheet_label = f"{fname}[{sheet_name}]" if sheet_name != 0 else fname
    r = {"file": sheet_label}

    # ── Title: teams, matchday ───────────────────────────────────────────
    title = clean(df.iloc[0, 0]) or ""
    m = re.match(r"^(.+?)\s+vs\.\s+(.+?)\s+Match Report", title)
    if m:
        r["home_team_raw"] = m.group(1).strip()
        r["away_team_raw"] = m.group(2).strip()

    league_row = clean(df.iloc[2, 0]) or ""
    mw = re.search(r'Matchweek\s+(\d+)', league_row, re.IGNORECASE)
    r["matchday"] = int(mw.group(1)) if mw else None

    # ── Score ────────────────────────────────────────────────────────────
    try: r["home_goals"] = int(clean(df.iloc[5, 0]))
    except: r["home_goals"] = None
    try: r["away_goals"] = int(clean(df.iloc[12, 0]))
    except: r["away_goals"] = None

    # ── Coaches ──────────────────────────────────────────────────────────
    coaches_found = 0
    for i in range(6, 25):
        val = clean(df.iloc[i, 0]) or ""
        if isinstance(val, str) and val.startswith("Manager:"):
            name = val.replace("Manager:", "").strip()
            if coaches_found == 0:
                r["home_coach"] = name; coaches_found += 1
            else:
                r["away_coach"] = name; break

    # ── Date / kick-off / venue / referee / attendance ───────────────────
    for i in range(17, 30):
        val = clean(df.iloc[i, 0]) or ""
        if not isinstance(val, str):
            continue
        dt_m = re.search(r'(\w+ \w+ \d+, \d{4}),?\s*([\d:]+)', val)
        if dt_m and "match_date" not in r:
            try:
                r["match_date"] = datetime.datetime.strptime(
                    dt_m.group(1), "%A %B %d, %Y").strftime("%Y-%m-%d")
                r["kick_off_time"] = dt_m.group(2)
            except: pass
        att_m = re.search(r'Attendance:\s*([\d,]+)', val)
        if att_m:
            r["attendance"] = int(att_m.group(1).replace(",", ""))
        venue_m = re.search(r'Venue:\s*(.+)', val)
        if venue_m:
            r["stadium"] = venue_m.group(1).strip()
        ref_m = re.search(r'Officials:\s*(.+?)\s*\(Referee\)', val)
        if ref_m:
            r["referee"] = ref_m.group(1).strip()

    # ── Formations ───────────────────────────────────────────────────────
    for i in range(45, 100):
        val = clean(df.iloc[i, 0]) or ""
        if not isinstance(val, str): continue
        fm = re.search(r'\((\d[\d-]+)\)', val)
        if fm:
            if "home_formation" not in r: r["home_formation"] = fm.group(1)
            elif "away_formation" not in r: r["away_formation"] = fm.group(1)

    # ── Goal minutes (from Match Summary) ───────────────────────────────
    summary_row = find_row(df, "Match Summary")
    home_goal_min, away_goal_min = [], []
    if summary_row:
        home_g = away_g = 0
        i = summary_row + 1
        while i < len(df) - 1:
            val0 = df.iloc[i, 0]
            val0_str = "" if pd.isna(val0) else str(val0).replace('\xa0', ' ').strip()
            if re.search(r"\d+['\u2019\u02bc]", val0_str):
                score_raw = df.iloc[i + 1, 0]
                minute = parse_minute(val0_str)
                if minute and isinstance(score_raw, datetime.time):
                    new_h, new_a = score_raw.hour, score_raw.minute
                    if new_h > home_g:
                        home_goal_min.append(minute); home_g = new_h
                    elif new_a > away_g:
                        away_goal_min.append(minute); away_g = new_a
            i += 1
    r["home_goal_minutes"] = home_goal_min
    r["away_goal_minutes"] = away_goal_min

    # ── Team Stats ───────────────────────────────────────────────────────
    stats_row = find_row(df, "Team Stats")
    if stats_row:
        r.update(parse_team_stats(df, stats_row))

    # ── Player stats tables ──────────────────────────────────────────────
    home_players = away_players = []
    home_gk = away_gk = []

    for i in range(len(df)):
        val = clean(df.iloc[i, 0]) or ""
        if not isinstance(val, str): continue

        if "Player Stats" in val and "Goalkeeper" not in val:
            team_name = val.replace("Player Stats", "").strip()
            # find header row: col-0 is exactly 'Player'
            header_row = None
            for hi in range(i, min(i + 10, len(df))):
                v0 = clean(df.iloc[hi, 0])
                if v0 == 'Player':
                    header_row = hi; break
            if header_row is not None:
                players = parse_player_table(df, header_row)
                if normalize_team(team_name) == normalize_team(r.get("home_team_raw", "")):
                    home_players = players
                    r["home_yellow_cards"] = sum(p["yellow"] or 0 for p in players)
                    r["home_red_cards"]    = sum(p["red"] or 0 for p in players)
                else:
                    away_players = players
                    r["away_yellow_cards"] = sum(p["yellow"] or 0 for p in players)
                    r["away_red_cards"]    = sum(p["red"] or 0 for p in players)

        elif "Goalkeeper Stats" in val:
            team_name = val.replace("Goalkeeper Stats", "").strip()
            # find GK header row: any col contains 'SoTA'
            gk_header = None
            for hi in range(i, min(i + 10, len(df))):
                row_vals = [clean(df.iloc[hi, c]) for c in range(df.shape[1])]
                if 'SoTA' in row_vals:
                    gk_header = hi; break
            if gk_header:
                gks = parse_gk_table(df, gk_header)
                if normalize_team(team_name) == normalize_team(r.get("home_team_raw", "")):
                    home_gk = gks
                else:
                    away_gk = gks

    r["home_players"] = home_players
    r["away_players"] = away_players
    r["home_gk"]      = home_gk
    r["away_gk"]      = away_gk

    # Normalize team names for DB lookup
    r["home_team"] = normalize_team(r.get("home_team_raw", ""))
    r["away_team"] = normalize_team(r.get("away_team_raw", ""))
    return r


# ── Preview ──────────────────────────────────────────────────────────────────

def print_preview(d):
    sep = "=" * 62
    print(f"\n{sep}")
    print(f"  FILE: {d['file']}")
    print(sep)
    print(f"  Match:        {d.get('home_team')} vs {d.get('away_team')}")
    print(f"  Date:         {d.get('match_date')}  {d.get('kick_off_time','')}")
    print(f"  Jornada:      {d.get('matchday')}")
    print(f"  Score:        {d.get('home_goals')} - {d.get('away_goals')}")
    print(f"  Stadium:      {d.get('stadium')}")
    print(f"  Referee:      {d.get('referee')}")
    print(f"  Attendance:   {d.get('attendance')}")
    print(f"  Coaches:      {d.get('home_coach')} / {d.get('away_coach')}")
    print(f"  Formations:   {d.get('home_formation')} / {d.get('away_formation')}")
    print()
    print(f"  ── Team Stats ──────────────────────────────────────────")
    print(f"  Possession:    {d.get('home_possession')}%  /  {d.get('away_possession')}%")
    print(f"  Shots (SoT):   {d.get('home_shots')} ({d.get('home_shots_on_target')})  /  {d.get('away_shots')} ({d.get('away_shots_on_target')})")
    print(f"  Saves:         {d.get('home_saves')}  /  {d.get('away_saves')}")
    print(f"  Fouls:         {d.get('home_fouls')}  /  {d.get('away_fouls')}")
    print(f"  Corners:       {d.get('home_corners')}  /  {d.get('away_corners')}")
    print(f"  Crosses:       {d.get('home_crosses')}  /  {d.get('away_crosses')}")
    print(f"  Interceptions: {d.get('home_interceptions')}  /  {d.get('away_interceptions')}")
    print(f"  Offsides:      {d.get('home_offsides')}  /  {d.get('away_offsides')}")
    print(f"  Yellow cards:  {d.get('home_yellow_cards')}  /  {d.get('away_yellow_cards')}")
    print(f"  Red cards:     {d.get('home_red_cards')}  /  {d.get('away_red_cards')}")
    print(f"  Goal min (H):  {d.get('home_goal_minutes')}")
    print(f"  Goal min (A):  {d.get('away_goal_minutes')}")
    print()
    print(f"  ── {d.get('home_team')} Players ({len(d.get('home_players',[]))}) ─────────────────────")
    for p in d.get('home_players', []):
        sub = " (sub)" if p['is_sub'] else ""
        print(f"    {p['name']:<25}{sub:7} {p['minutes']:>3}' | G:{p['goals']} A:{p['assists']} Sh:{p['shots']} Y:{p['yellow']} R:{p['red']}")
    print(f"  ── {d.get('away_team')} Players ({len(d.get('away_players',[]))}) ─────────────────────")
    for p in d.get('away_players', []):
        sub = " (sub)" if p['is_sub'] else ""
        print(f"    {p['name']:<25}{sub:7} {p['minutes']:>3}' | G:{p['goals']} A:{p['assists']} Sh:{p['shots']} Y:{p['yellow']} R:{p['red']}")
    print(f"  ── Goalkeepers ─────────────────────────────────────────")
    for gk in d.get('home_gk', []):
        print(f"    [H] {gk['name']:<20} SoTA:{gk['shots_faced']} GA:{gk['goals_against']} Sv:{gk['saves']} ({gk['save_pct']}%)")
    for gk in d.get('away_gk', []):
        print(f"    [A] {gk['name']:<20} SoTA:{gk['shots_faced']} GA:{gk['goals_against']} Sv:{gk['saves']} ({gk['save_pct']}%)")


# ── Upload ───────────────────────────────────────────────────────────────────

def upload_match(sb, db_teams, d):
    home_id = db_teams.get(d["home_team"])
    away_id = db_teams.get(d["away_team"])
    if not home_id: print(f"  [!] Team not found: '{d['home_team']}'"); return False
    if not away_id: print(f"  [!] Team not found: '{d['away_team']}'"); return False

    # ── Find match in DB ──────────────────────────────────────────────────────
    query = (sb.from_("matches").select("id")
            .eq("home_team_id", home_id)
            .eq("away_team_id", away_id))
    
    # Try different filters to identify the match uniquely
    if d.get("matchday"):
        query = query.eq("matchday", d["matchday"])
    elif d.get("match_date"):
        query = query.eq("match_date", d["match_date"])
    
    # Optional: filter by season if we had it, but let's stick to teams+matchday/date
    resp = query.execute()
    
    id_str = f"J{d.get('matchday')}" if d.get('matchday') else f"on {d.get('match_date')}"
    if not resp.data:
        print(f"  [!] Match not found: {d['home_team']} vs {d['away_team']} {id_str}")
        return False

    match_id = resp.data[0]["id"]
    if len(resp.data) > 1:
        print(f"  [!] Multiple matches found for {d['home_team']} vs {d['away_team']} {id_str}. Using first ID: {match_id}")

    # ── Update matches row ────────────────────────────────────────────────────
    payload = {
        "home_goals":           d.get("home_goals"),
        "away_goals":           d.get("away_goals"),
        "match_date":           d.get("match_date"),
        "kick_off_time":        d.get("kick_off_time"),
        "stadium":              d.get("stadium"),
        "referee":              d.get("referee"),
        "attendance":           d.get("attendance"),
        "home_coach":           d.get("home_coach"),
        "away_coach":           d.get("away_coach"),
        "home_formation":       d.get("home_formation"),
        "away_formation":       d.get("away_formation"),
        "home_possession":      d.get("home_possession"),
        "away_possession":      d.get("away_possession"),
        "home_shots":           d.get("home_shots"),
        "away_shots":           d.get("away_shots"),
        "home_shots_on_target": d.get("home_shots_on_target"),
        "away_shots_on_target": d.get("away_shots_on_target"),
        "home_saves":           d.get("home_saves"),
        "away_saves":           d.get("away_saves"),
        "home_fouls":           d.get("home_fouls"),
        "away_fouls":           d.get("away_fouls"),
        "home_corners":         d.get("home_corners"),
        "away_corners":         d.get("away_corners"),
        "total_corners":        (d.get("home_corners") or 0) + (d.get("away_corners") or 0) or None,
        "home_crosses":         d.get("home_crosses"),
        "away_crosses":         d.get("away_crosses"),
        "home_interceptions":   d.get("home_interceptions"),
        "away_interceptions":   d.get("away_interceptions"),
        "home_offsides":        d.get("home_offsides"),
        "away_offsides":        d.get("away_offsides"),
        "home_yellow_cards":    d.get("home_yellow_cards"),
        "home_red_cards":       d.get("home_red_cards"),
        "away_yellow_cards":    d.get("away_yellow_cards"),
        "away_red_cards":       d.get("away_red_cards"),
        "home_goal_minutes":    d.get("home_goal_minutes"),
        "away_goal_minutes":    d.get("away_goal_minutes"),
    }
    payload = {k: v for k, v in payload.items() if v is not None}
    sb.from_("matches").update(payload).eq("id", match_id).execute()

    # ── Player stats: delete existing rows, then re-insert ───────────────────
    sb.from_("match_player_stats").delete().eq("match_id", match_id).execute()

    player_rows = []

    def build_player_rows(players, gks, team_id, is_home):
        rows = []
        for p in players:
            rows.append({
                "match_id":        match_id,
                "team_id":         team_id,
                "is_home":         is_home,
                "player_name":     p["name"],
                "shirt_number":    p.get("number"),
                "position":        p.get("pos"),
                "is_starter":      not p.get("is_sub", False),
                "minutes":         p.get("minutes"),
                "goals":           p.get("goals", 0),
                "assists":         p.get("assists", 0),
                "shots":           p.get("shots", 0),
                "shots_on_target": p.get("shots_ot", 0),
                "pk_scored":       p.get("pk", 0),
                "pk_attempted":    p.get("pk_att", 0),
                "own_goals":       p.get("own_goals", 0),
                "yellow_cards":    p.get("yellow", 0),
                "red_cards":       p.get("red", 0),
                "fouls_committed": p.get("fouls_com", 0),
                "fouls_drawn":     p.get("fouls_drawn", 0),
                "tackles_won":     p.get("tackles_w", 0),
                "interceptions":   p.get("ints", 0),
                "offsides":        p.get("offsides", 0),
                "crosses":         p.get("crosses", 0),
            })
        for gk in gks:
            # Find if this GK is already in the outfield list (same name)
            existing = next((r for r in rows if r["player_name"] == gk["name"]), None)
            if existing:
                # Just add GK stats to existing row
                existing["gk_shots_faced"]   = gk.get("shots_faced")
                existing["gk_goals_against"] = gk.get("goals_against")
                existing["gk_saves"]         = gk.get("saves")
                existing["gk_save_pct"]      = gk.get("save_pct")
            else:
                rows.append({
                    "match_id":          match_id,
                    "team_id":           team_id,
                    "is_home":           is_home,
                    "player_name":       gk["name"],
                    "position":          "GK",
                    "is_starter":        True,
                    "minutes":           gk.get("minutes"),
                    "goals": 0, "assists": 0, "shots": 0, "shots_on_target": 0,
                    "pk_scored": 0, "pk_attempted": 0, "own_goals": 0,
                    "yellow_cards": 0, "red_cards": 0,
                    "fouls_committed": 0, "fouls_drawn": 0,
                    "tackles_won": 0, "interceptions": 0,
                    "offsides": 0, "crosses": 0,
                    "gk_shots_faced":   gk.get("shots_faced"),
                    "gk_goals_against": gk.get("goals_against"),
                    "gk_saves":         gk.get("saves"),
                    "gk_save_pct":      gk.get("save_pct"),
                })
        return rows

    player_rows += build_player_rows(d.get("home_players", []), d.get("home_gk", []), home_id, True)
    player_rows += build_player_rows(d.get("away_players", []), d.get("away_gk", []), away_id, False)

    if player_rows:
        sb.from_("match_player_stats").insert(player_rows).execute()

    print(f"  [OK] id={match_id}: {d['home_team']} vs {d['away_team']} J{d['matchday']} "
          f"— {len(player_rows)} player rows written")
    return True


# ── Move file to processed folder ────────────────────────────────────────────

PROCESSED_DIR = os.path.join(MATCH_FILES_DIR, "processed")

def move_to_processed(filepath):
    """Move a successfully uploaded file to src/match_files/processed/."""
    os.makedirs(PROCESSED_DIR, exist_ok=True)
    filename  = os.path.basename(filepath)
    dest      = os.path.join(PROCESSED_DIR, filename)
    # If a file with the same name already exists in processed, add a timestamp
    if os.path.exists(dest):
        base, ext = os.path.splitext(filename)
        ts   = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        dest = os.path.join(PROCESSED_DIR, f"{base}_{ts}{ext}")
    os.rename(filepath, dest)
    print(f"  [>>] Moved to: {os.path.relpath(dest)}")


# ── Entry point ──────────────────────────────────────────────────────────────

def main():
    preview_only = "--preview" in sys.argv
    force_upload = "--upload"  in sys.argv

    # Collect .xlsx files (not inside processed/)
    files = sorted(
        f for f in glob.glob(os.path.join(MATCH_FILES_DIR, "*.xlsx"))
        if "processed" not in f.replace("\\", "/")
    )

    if not files:
        print(f"No .xlsx files found in {MATCH_FILES_DIR}/")
        print(f"(Already-processed files are in {MATCH_FILES_DIR}/processed/)\n")
        return

    print(f"Found {len(files)} match file(s)\n")

    # ── Parse & preview all files (multi-sheet aware) ─────────────────────────
    # parsed entries: {data dict, '_filepath': str, '_all_sheets_done': bool}
    parsed = []          # list of data dicts (one per match/sheet)
    file_sheet_map = {}  # filepath -> [sheet_indices that parsed OK]

    for f in files:
        with pd.ExcelFile(f) as xl:        # ← 'with' releases the file lock
            sheet_names = xl.sheet_names
            is_multi = len(sheet_names) > 1

            if is_multi:
                print(f"  Multi-sheet file: {os.path.basename(f)} ({len(sheet_names)} hojas)")

            for sheet_idx, sheet_name in enumerate(sheet_names):
                try:
                    data = parse_match_file(f, sheet_name=sheet_idx)
                    data["_filepath"]     = f
                    data["_sheet_idx"]    = sheet_idx
                    data["_is_multi"]     = is_multi
                    data["_total_sheets"] = len(sheet_names)
                    print_preview(data)
                    parsed.append(data)
                    file_sheet_map.setdefault(f, []).append(sheet_idx)
                except Exception as e:
                    label = f"{os.path.basename(f)}[Hoja{sheet_idx+1}]"
                    print(f"[ERROR] Could not parse {label}: {e}")
                    import traceback; traceback.print_exc()

    if not parsed:
        print("No files could be parsed. Aborting.")
        return

    # ── Decide whether to upload ──────────────────────────────────────────────
    if preview_only:
        print(f"\n{'='*62}")
        print("  --preview mode: data NOT saved to DB.")
        print(f"{'='*62}\n")
        return

    if not force_upload:
        print(f"\n{'='*62}")
        ans = input(f"  Upload {len(parsed)} match(es) to Supabase? (y/N): ").strip().lower()
        if ans != "y":
            print("  Aborted. Nothing was saved.")
            print(f"{'='*62}\n")
            return

    # ── Connect and upload ────────────────────────────────────────────────────
    print(f"\n[Connecting to Supabase...]")
    sb       = create_client(SUPABASE_URL, SUPABASE_KEY)
    db_teams = {t["name"]: t["id"] for t in sb.from_("teams").select("id,name").execute().data}

    ok = fail = 0
    file_ok_sheets = {}   # filepath -> count of successfully uploaded sheets

    for data in parsed:
        filepath     = data.pop("_filepath")
        sheet_idx    = data.pop("_sheet_idx")
        is_multi     = data.pop("_is_multi")
        total_sheets = data.pop("_total_sheets")

        if upload_match(sb, db_teams, data):
            ok += 1
            file_ok_sheets[filepath] = file_ok_sheets.get(filepath, 0) + 1
            # For single-sheet files, move immediately
            if not is_multi:
                move_to_processed(filepath)
        else:
            fail += 1
            print(f"  [!] Sheet {sheet_idx+1} failed — keeping file: {os.path.basename(filepath)}")

    # Move multi-sheet files only after ALL their sheets have been processed
    for filepath in file_ok_sheets:
        sheets_in_file = len(file_sheet_map.get(filepath, []))
        if sheets_in_file > 1:   # is multi-sheet — move the whole file once
            move_to_processed(filepath)

    print(f"\n{'='*62}")
    print(f"  Done: {ok} uploaded, {fail} failed.")
    print(f"{'='*62}\n")


if __name__ == "__main__":
    main()
