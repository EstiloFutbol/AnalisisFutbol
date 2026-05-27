"""
sync_match_dates.py — Sync match dates, kick-off times and scores from football-data.org.

Handles multiple competitions in a single run:
  • La Liga 2025-26  (code=PD)
  • FIFA World Cup 2026 (code=WC) — only if it exists in the DB

For each competition the script:
  1. Fetches the full season match list from football-data.org
  2. Compares dates/kick-off times with the DB and patches any mismatch
  3. With --scores: writes results for FINISHED matches not yet in DB
  4. With --scores + WC: also recalculates tournament_standings from results

Usage:
    python .github/sync_match_dates.py --preview
    python .github/sync_match_dates.py --upload
    python .github/sync_match_dates.py --upload --scores
"""

import sys, io, os, argparse, requests
from datetime import datetime
from zoneinfo import ZoneInfo
from dotenv import load_dotenv
from supabase import create_client

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(_ROOT, ".env.local"))

SUPABASE_URL = (os.environ.get("SUPABASE_URL")
                or os.environ["VITE_SUPABASE_URL"])
SUPABASE_KEY = (os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
                or os.environ["VITE_SUPABASE_SERVICE_ROLE_KEY"])
FD_API_KEY   = os.environ.get("FOOTBALL_DATA_API_KEY", "")

FD_BASE   = "https://api.football-data.org/v4"
MADRID_TZ = ZoneInfo("Europe/Madrid")

# ── Competitions to sync ──────────────────────────────────────────────────────
# WC is only processed when its league record exists in the DB
# (i.e., after import_world_cup.py --upload has been run).
# WC team names are imported directly from football-data.org so no map is needed.

COMPETITIONS = [
    {
        "code":      "PD",
        "fd_season": 2025,
        "label":     "La Liga 2025-26",
        "team_map": {
            "FC Barcelona":              "Barcelona",
            "Real Madrid CF":            "Real Madrid",
            "Club Atlético de Madrid":   "Atlético Madrid",
            "Atlético de Madrid":        "Atlético Madrid",
            "Athletic Club":             "Athletic Club",
            "Real Betis Balompié":       "Real Betis",
            "Real Betis":                "Real Betis",
            "Villarreal CF":             "Villarreal",
            "Sevilla FC":                "Sevilla",
            "RC Celta de Vigo":          "Celta Vigo",
            "Celta de Vigo":             "Celta Vigo",
            "Celta Vigo":                "Celta Vigo",
            "Rayo Vallecano de Madrid":  "Rayo Vallecano",
            "RCD Mallorca":              "Mallorca",
            "Getafe CF":                 "Getafe",
            "CA Osasuna":                "Osasuna",
            "UD Las Palmas":             "Las Palmas",
            "RCD Espanyol":              "Espanyol",
            "RCD Espanyol de Barcelona": "Espanyol",
            "Deportivo Alavés":          "Alavés",
            "Girona FC":                 "Girona",
            "Valencia CF":               "Valencia",
            "Real Valladolid CF":        "Valladolid",
            "Real Sociedad de Fútbol":   "Real Sociedad",
            "Elche CF":                  "Elche",
            "Levante UD":                "Levante",
            "Real Oviedo":               "Real Oviedo",
            "CD Leganés":                "Leganés",
        },
    },
    {
        "code":      "WC",
        "fd_season": 2026,
        "label":     "FIFA World Cup 2026",
        "team_map":  {},   # Names are identical to FD source — no mapping needed
    },
]


# ── Helpers ───────────────────────────────────────────────────────────────────

def utc_to_madrid(iso_str: str):
    """Return (date_str, time_str). time_str=None for midnight-UTC TBD kick-offs."""
    dt     = datetime.fromisoformat(iso_str.replace("Z", "+00:00"))
    dt_mad = dt.astimezone(MADRID_TZ)
    is_placeholder = dt.hour == 0 and dt.minute == 0
    return dt_mad.strftime("%Y-%m-%d"), (None if is_placeholder else dt_mad.strftime("%H:%M"))


def normalize(name: str, team_map: dict) -> str:
    return team_map.get(name.strip(), name.strip()) if name else ""


def recalculate_wc_standings(sb, league_id: int) -> int:
    """Recompute group standings from all played WC group-stage results."""
    rows = (sb.from_("matches")
            .select("home_team_id,away_team_id,home_goals,away_goals,group_name")
            .eq("league_id", league_id)
            .not_.is_("group_name", "null")
            .not_.is_("home_goals", "null")
            .execute().data)

    if not rows:
        return 0

    agg: dict = {}
    for m in rows:
        g = m["group_name"]
        for tid, gf, ga in [
            (m["home_team_id"], m["home_goals"], m["away_goals"]),
            (m["away_team_id"], m["away_goals"], m["home_goals"]),
        ]:
            key = (g, tid)
            if key not in agg:
                agg[key] = {"played": 0, "won": 0, "drawn": 0, "lost": 0, "gf": 0, "ga": 0, "pts": 0}
            t = agg[key]
            t["played"] += 1
            t["gf"]     += gf
            t["ga"]     += ga
            if   gf > ga: t["won"]   += 1; t["pts"] += 3
            elif gf == ga: t["drawn"] += 1; t["pts"] += 1
            else:          t["lost"]  += 1

    upsert_rows = [
        {
            "league_id":     league_id,
            "group_name":    g,
            "team_id":       tid,
            "played":        v["played"],
            "won":           v["won"],
            "drawn":         v["drawn"],
            "lost":          v["lost"],
            "goals_for":     v["gf"],
            "goals_against": v["ga"],
            "points":        v["pts"],
            "updated_at":    datetime.utcnow().isoformat() + "Z",
        }
        for (g, tid), v in agg.items()
    ]

    sb.from_("tournament_standings").upsert(
        upsert_rows, on_conflict="league_id,group_name,team_id"
    ).execute()
    return len(upsert_rows)


# ── Per-competition sync ──────────────────────────────────────────────────────

def sync_competition(sb, comp: dict, args, summary: list):
    code      = comp["code"]
    fd_season = comp["fd_season"]
    team_map  = comp["team_map"]
    label     = comp["label"]

    print(f"\n{'='*60}")
    print(f"[{code}]  {label}")
    print(f"{'='*60}")

    # Skip if league not in DB
    league_res = sb.from_("leagues").select("id").eq("code", code).execute()
    if not league_res.data:
        print(f"  [SKIP] '{code}' not found in leagues table — run import first.")
        return
    league_id = league_res.data[0]["id"]

    # Fetch from football-data.org
    resp = requests.get(
        f"{FD_BASE}/competitions/{code}/matches",
        headers={"X-Auth-Token": FD_API_KEY},
        params={"season": fd_season},
        timeout=20,
    )
    if resp.status_code == 403:
        print(f"  [ERROR] API key rejected (403).")
        return
    resp.raise_for_status()
    api_matches = resp.json().get("matches", [])
    print(f"  [API] {len(api_matches)} matches received")

    # Load DB state for this league
    db_rows = (sb.from_("matches")
               .select("id,matchday,home_team_id,away_team_id,match_date,kick_off_time,home_goals,away_goals")
               .eq("league_id", league_id)
               .execute().data)
    db_teams = {t["name"]: t["id"]
                for t in sb.from_("teams").select("id,name").execute().data}
    db_map   = {(r["matchday"], r["home_team_id"], r["away_team_id"]): r for r in db_rows}
    print(f"  [DB]  {len(db_rows)} matches loaded")

    updates   = []
    unknown   = []
    not_in_db = []

    for m in api_matches:
        matchday  = m.get("matchday")
        utc_date  = m.get("utcDate", "")
        status    = m.get("status", "")
        home_raw  = (m["homeTeam"].get("name") or "").strip()
        away_raw  = (m["awayTeam"].get("name") or "").strip()

        # Skip TBD knockout slots (no team names yet)
        if not home_raw or not away_raw or not matchday:
            continue

        home_name = normalize(home_raw, team_map)
        away_name = normalize(away_raw, team_map)
        home_id   = db_teams.get(home_name)
        away_id   = db_teams.get(away_name)

        if not home_id or not away_id:
            unknown.append(f"  J{matchday}: '{home_raw}' vs '{away_raw}' -> '{home_name}' vs '{away_name}'")
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
            notes.append(f"date -> {api_date}")
        if api_time and api_time != db_row.get("kick_off_time"):
            payload["kick_off_time"] = api_time
            notes.append(f"time -> {api_time}")

        if args.scores and status == "FINISHED":
            ft = m.get("score", {}).get("fullTime", {})
            hg, ag = ft.get("home"), ft.get("away")
            if hg is not None and ag is not None and db_row.get("home_goals") is None:
                payload["home_goals"] = hg
                payload["away_goals"] = ag
                notes.append(f"score {hg}-{ag}")

        if payload:
            updates.append({
                "id": db_row["id"], "matchday": matchday,
                "home": home_name, "away": away_name,
                "date": api_date, "time": api_time,
                "has_score": "home_goals" in payload,
                "payload": payload, "notes": ", ".join(notes),
            })

    # ── Report ────────────────────────────────────────────────────────────────
    SEP = "-" * 90
    print(f"\n{SEP}")
    for u in sorted(updates, key=lambda x: (x["matchday"] or 0, x["home"])):
        print(f"  J{u['matchday']:>2}  {u['date'] or '?':12}  {u['time'] or '?':5}"
              f"  {u['home']:<22} vs {u['away']:<22}  [{u['notes']}]")
    print(f"{SEP}")
    print(f"  {len(updates)} to update  |  {len(unknown)} unknown teams  |  {len(not_in_db)} not in DB")

    if unknown:
        print("\n[!] Unknown team names (add to team_map):")
        for s in unknown: print(s)
    if not_in_db:
        print("\n[!] Matches from API not found in DB:")
        for s in not_in_db[:10]: print(s)

    summary.append(f"{code}: {len(updates)} updated, {len(unknown)} unknown")

    if args.preview or not updates:
        if not updates: print("  [OK] Nothing to update.")
        return

    # ── Apply ─────────────────────────────────────────────────────────────────
    print(f"\n[->] Applying {len(updates)} updates...")
    ok = fail = scores_written = 0
    for u in updates:
        try:
            sb.from_("matches").update(u["payload"]).eq("id", u["id"]).execute()
            ok += 1
            if u["has_score"]:
                scores_written += 1
        except Exception as e:
            print(f"  [!] J{u['matchday']} {u['home']} vs {u['away']}: {e}")
            fail += 1

    print(f"  [OK] {ok} updated, {fail} failed")

    # Recalculate WC standings whenever scores were written
    if code == "WC" and scores_written > 0 and args.scores:
        n = recalculate_wc_standings(sb, league_id)
        print(f"  [OK] {n} WC standing rows recalculated")


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser()
    grp = parser.add_mutually_exclusive_group(required=True)
    grp.add_argument("--preview", action="store_true")
    grp.add_argument("--upload",  action="store_true")
    parser.add_argument("--scores", action="store_true",
                        help="Also sync scores for FINISHED matches")
    args = parser.parse_args()

    if not FD_API_KEY:
        print("[ERROR] FOOTBALL_DATA_API_KEY not set.")
        sys.exit(1)

    sb      = create_client(SUPABASE_URL, SUPABASE_KEY)
    summary = []

    for comp in COMPETITIONS:
        try:
            sync_competition(sb, comp, args, summary)
        except Exception as e:
            print(f"\n[ERROR] {comp['code']}: {e}")
            summary.append(f"{comp['code']}: ERROR — {e}")

    print(f"\n{'='*60}\n[SUMMARY]")
    for line in summary: print(f"  {line}")
    if args.preview:
        print("\n[PREVIEW] No changes written. Run with --upload to apply.")
    print("[DONE]")


if __name__ == "__main__":
    main()
