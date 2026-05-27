"""
fetch_odds_api.py  —  Fetch match odds and scores from The Odds API.

Auto-detects which competition to sync:
  • WC mode   — active when WC has matches within the last 3 or next 7 days.
                Uses sport key 'soccer_fifa_world_cup'. League calls are skipped.
  • League mode — all other times. Uses 'soccer_spain_la_liga'. WC calls are skipped.

This prevents wasted API quota: La Liga is on summer break during the WC,
and WC odds are irrelevant the rest of the year.

Up to 2 API calls per run (each skipped independently in --auto mode):
  1. /v4/sports/{sport}/scores/ → completed results from the last 3 days
  2. /v4/sports/{sport}/odds/   → h2h + totals (O/U 2.5) + btts markets

DB columns written (match_date is NEVER touched here):
  matches: home_odds, draw_odds, away_odds, over25_odds, under25_odds,
           btts_yes_odds, btts_no_odds, home_goals, away_goals
  match_odds_bookmakers: all individual bookmaker rows (upserted)

Usage:
  python .github/fetch_odds_api.py --preview
  python .github/fetch_odds_api.py --upload
  python .github/fetch_odds_api.py --auto --upload   ← GitHub Actions
"""

import io, os, re, sys, argparse, unicodedata
from datetime import date, timedelta

import requests
from supabase import create_client

try:
    from dotenv import load_dotenv
    _ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    load_dotenv(os.path.join(_ROOT, ".env.local"), override=False)
except ImportError:
    pass

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

SUPABASE_URL = os.environ.get("SUPABASE_URL") or os.environ["VITE_SUPABASE_URL"]
SUPABASE_KEY = (os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
                or os.environ["VITE_SUPABASE_SERVICE_ROLE_KEY"])
ODDS_API_KEY = os.environ["ODDS_API_KEY"]

# ── Competition config ────────────────────────────────────────────────────────

LEAGUE_SPORT  = "soccer_spain_la_liga"
LEAGUE_SEASON = "2025-2026"

WC_SPORT       = "soccer_fifa_world_cup"
WC_SEASON      = "2026"
WC_LEAGUE_CODE = "WC"

TOTALS_POINT = 2.5

# ── Team name maps: The Odds API name → canonical DB name ─────────────────────

LEAGUE_TEAM_MAP = {
    "Alaves":             "Alavés",
    "Athletic Bilbao":    "Athletic Club",
    "Athletic Club":      "Athletic Club",
    "Atletico De Madrid": "Atlético Madrid",
    "Atletico Madrid":    "Atlético Madrid",
    "Atletico de Madrid": "Atlético Madrid",
    "Atlético de Madrid": "Atlético Madrid",
    "Barcelona":          "Barcelona",
    "Betis":              "Real Betis",
    "CA Osasuna":         "Osasuna",
    "CD Leganes":         "Leganés",
    "CD Oviedo":          "Real Oviedo",
    "Celta De Vigo":      "Celta Vigo",
    "Celta Vigo":         "Celta Vigo",
    "Celta de Vigo":      "Celta Vigo",
    "Deportivo Alaves":   "Alavés",
    "Deportivo Alavés":   "Alavés",
    "Elche":              "Elche",
    "Elche CF":           "Elche",
    "Espanyol":           "Espanyol",
    "FC Barcelona":       "Barcelona",
    "Getafe":             "Getafe",
    "Getafe CF":          "Getafe",
    "Girona":             "Girona",
    "Girona FC":          "Girona",
    "Las Palmas":         "Las Palmas",
    "Leganes":            "Leganés",
    "Levante":            "Levante",
    "Mallorca":           "Mallorca",
    "Osasuna":            "Osasuna",
    "Oviedo":             "Real Oviedo",
    "RCD Espanyol":       "Espanyol",
    "RCD Mallorca":       "Mallorca",
    "Rayo":               "Rayo Vallecano",
    "Rayo Vallecano":     "Rayo Vallecano",
    "Real Betis":         "Real Betis",
    "Real Madrid":        "Real Madrid",
    "Real Oviedo":        "Real Oviedo",
    "Real Sociedad":      "Real Sociedad",
    "Real Valladolid":    "Valladolid",
    "Sevilla":            "Sevilla",
    "Sevilla FC":         "Sevilla",
    "UD Las Palmas":      "Las Palmas",
    "UD Levante":         "Levante",
    "Valencia":           "Valencia",
    "Valencia CF":        "Valencia",
    "Valladolid":         "Valladolid",
    "Villarreal":         "Villarreal",
    "Villarreal CF":      "Villarreal",
}

# DB names come from football-data.org (same source as import_world_cup.py),
# so only the cases where The Odds API differs from FD need to be listed.
WC_TEAM_MAP = {
    "Czech Republic":        "Czechia",
    "USA":                   "United States",
    "Bosnia & Herzegovina":  "Bosnia-Herzegovina",
    "Curacao":               "Curaçao",
    "Cape Verde":            "Cape Verde Islands",
    "DR Congo":              "Congo DR",
    "Korea Republic":        "South Korea",
    "South Korea":           "South Korea",
    "Ivory Coast":           "Ivory Coast",
    "Cote d'Ivoire":         "Ivory Coast",
    "Republic of Ireland":   "Ireland",
}


# ── Normalize helpers ─────────────────────────────────────────────────────────

def _slug(name: str) -> str:
    nfd  = unicodedata.normalize("NFD", name)
    bare = "".join(c for c in nfd if unicodedata.category(c) != "Mn").lower()
    bare = re.sub(r"\b(fc|cf|cd|ud|rcd|ca|sd|real|deportivo|club)\b", "", bare)
    return re.sub(r"\s+", " ", bare).strip()


def normalize(api_name: str, db_teams: dict, team_map: dict) -> str:
    name = api_name.strip()
    if name in team_map:
        return team_map[name]
    slug = _slug(name)
    for db_name in db_teams:
        if _slug(db_name) == slug:
            return db_name
    return name


# ── API helpers ───────────────────────────────────────────────────────────────

_api_calls = 0


def _get(path: str, params: dict) -> list:
    global _api_calls
    resp = requests.get(
        f"https://api.the-odds-api.com/v4{path}",
        params={"apiKey": ODDS_API_KEY, **params},
        timeout=15,
    )
    resp.raise_for_status()
    _api_calls += 1
    print(f"  [API call {_api_calls}]  "
          f"used={resp.headers.get('x-requests-used','?')}  "
          f"remaining={resp.headers.get('x-requests-remaining','?')}")
    return resp.json()


def fetch_odds(sport: str) -> list:
    for markets in ["h2h,totals,btts", "h2h,totals", "h2h"]:
        print(f"[->] Fetching odds ({markets}) — {sport}...")
        try:
            return _get(f"/sports/{sport}/odds/",
                        {"regions": "eu", "markets": markets, "oddsFormat": "decimal"})
        except requests.exceptions.HTTPError as exc:
            if exc.response is not None and exc.response.status_code == 422:
                print(f"  [WARN] '{markets}' rejected (422) — trying fewer markets")
                continue
            raise
    return []


def fetch_scores(sport: str) -> list:
    print(f"[->] Fetching scores (last 3 days) — {sport}...")
    return _get(f"/sports/{sport}/scores/", {"daysFrom": 3})


# ── Odds extraction (unchanged logic) ────────────────────────────────────────

def _best_bk(rows, key):
    return max(rows, key=lambda r: r[key])["title"]


def extract_h2h(bookmakers, home_api, away_api):
    rows = []
    for bk in bookmakers:
        for mkt in bk.get("markets", []):
            if mkt["key"] != "h2h":
                continue
            by_name = {o["name"]: o["price"] for o in mkt.get("outcomes", [])}
            draw_p  = by_name.get("Draw")
            home_p  = by_name.get(home_api)
            away_p  = by_name.get(away_api)
            if (home_p is None or away_p is None) and draw_p is not None:
                non_draw = [(k, v) for k, v in by_name.items() if k != "Draw"]
                if len(non_draw) == 2:
                    home_p, away_p = non_draw[0][1], non_draw[1][1]
            if home_p and draw_p and away_p:
                rows.append({"key": bk["key"], "title": bk["title"],
                             "home": home_p, "draw": draw_p, "away": away_p})
    if not rows:
        return None
    return {
        "best_home":  max(r["home"] for r in rows),
        "best_draw":  max(r["draw"] for r in rows),
        "best_away":  max(r["away"] for r in rows),
        "worst_home": min(r["home"] for r in rows),
        "worst_draw": min(r["draw"] for r in rows),
        "worst_away": min(r["away"] for r in rows),
        "home_bk": _best_bk(rows, "home"), "draw_bk": _best_bk(rows, "draw"),
        "away_bk": _best_bk(rows, "away"), "count": len(rows), "rows": rows,
    }


def extract_totals(bookmakers, point=TOTALS_POINT):
    rows = []
    for bk in bookmakers:
        for mkt in bk.get("markets", []):
            if mkt["key"] != "totals":
                continue
            over_p = under_p = None
            for o in mkt.get("outcomes", []):
                if abs((o.get("point") or 0.0) - point) > 0.01:
                    continue
                if o["name"] == "Over":   over_p  = o["price"]
                elif o["name"] == "Under": under_p = o["price"]
            if over_p and under_p:
                rows.append({"key": bk["key"], "title": bk["title"],
                             "over": over_p, "under": under_p})
    if not rows:
        return None
    return {"best_over": max(r["over"] for r in rows),
            "best_under": max(r["under"] for r in rows),
            "over_bk": _best_bk(rows, "over"), "under_bk": _best_bk(rows, "under"),
            "rows": rows}


def extract_btts(bookmakers):
    rows = []
    for bk in bookmakers:
        for mkt in bk.get("markets", []):
            if mkt["key"] != "btts":
                continue
            yes_p = no_p = None
            for o in mkt.get("outcomes", []):
                if o["name"] == "Yes": yes_p = o["price"]
                elif o["name"] == "No": no_p  = o["price"]
            if yes_p and no_p:
                rows.append({"key": bk["key"], "title": bk["title"],
                             "yes": yes_p, "no": no_p})
    if not rows:
        return None
    return {"best_yes": max(r["yes"] for r in rows),
            "best_no":  max(r["no"]  for r in rows),
            "yes_bk": _best_bk(rows, "yes"), "no_bk": _best_bk(rows, "no"),
            "rows": rows}


def build_bk_rows(match_id, h2h, totals, btts):
    out = []
    for r in h2h["rows"]:
        for outcome, val in [("home", r["home"]), ("draw", r["draw"]), ("away", r["away"])]:
            out.append({"match_id": match_id, "bookmaker_key": r["key"],
                        "bookmaker_title": r["title"], "market": "h2h",
                        "outcome": outcome, "point": None, "odds": val})
    if totals:
        for r in totals["rows"]:
            for outcome, val in [("over", r["over"]), ("under", r["under"])]:
                out.append({"match_id": match_id, "bookmaker_key": r["key"],
                            "bookmaker_title": r["title"], "market": "totals",
                            "outcome": outcome, "point": TOTALS_POINT, "odds": val})
    if btts:
        for r in btts["rows"]:
            for outcome, val in [("yes", r["yes"]), ("no", r["no"])]:
                out.append({"match_id": match_id, "bookmaker_key": r["key"],
                            "bookmaker_title": r["title"], "market": "btts",
                            "outcome": outcome, "point": None, "odds": val})
    return out


# ── DB helpers ────────────────────────────────────────────────────────────────

def detect_active_sport(sb):
    """
    Returns ('wc', wc_league_id) when WC has matches within ±7 days.
    Returns ('league', None) otherwise.
    Keeps the two competitions mutually exclusive to avoid duplicate API calls.
    """
    wc = sb.from_("leagues").select("id").eq("code", WC_LEAGUE_CODE).execute()
    if not wc.data:
        return ("league", None)

    wc_id      = wc.data[0]["id"]
    window_lo  = (date.today() - timedelta(days=3)).isoformat()
    window_hi  = (date.today() + timedelta(days=7)).isoformat()

    res = (sb.from_("matches").select("id")
           .eq("league_id", wc_id)
           .gte("match_date", window_lo)
           .lte("match_date", window_hi)
           .limit(1).execute())

    return ("wc", wc_id) if res.data else ("league", None)


def has_recent_matches(sb, *, league_id=None, season=None) -> bool:
    window_lo = (date.today() - timedelta(days=3)).isoformat()
    window_hi = date.today().isoformat()
    q = (sb.from_("matches").select("id")
         .gte("match_date", window_lo).lte("match_date", window_hi))
    if league_id: q = q.eq("league_id", league_id)
    elif season:  q = q.eq("season", season)
    return len(q.limit(1).execute().data) > 0


def next_match_days_away(sb, *, league_id=None, season=None):
    today_str = date.today().isoformat()
    q = (sb.from_("matches").select("match_date")
         .is_("home_goals", "null").not_.is_("match_date", "null")
         .gte("match_date", today_str).order("match_date").limit(1))
    if league_id: q = q.eq("league_id", league_id)
    elif season:  q = q.eq("season", season)
    res = q.execute()
    if not res.data:
        return None
    return (date.fromisoformat(res.data[0]["match_date"]) - date.today()).days


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser()
    grp = parser.add_mutually_exclusive_group(required=True)
    grp.add_argument("--preview", action="store_true")
    grp.add_argument("--upload",  action="store_true")
    parser.add_argument("--auto", action="store_true",
                        help="Auto-detect mode; gate each endpoint independently")
    args = parser.parse_args()

    sb = create_client(SUPABASE_URL, SUPABASE_KEY)

    # ── Detect WC vs League mode ──────────────────────────────────────────────
    mode, wc_league_id = detect_active_sport(sb)

    if mode == "wc":
        sport      = WC_SPORT
        team_map   = WC_TEAM_MAP
        league_id  = wc_league_id
        season_key = None
        print(f"[MODE] World Cup 2026  (league_id={wc_league_id})")
    else:
        sport      = LEAGUE_SPORT
        team_map   = LEAGUE_TEAM_MAP
        league_id  = None
        season_key = LEAGUE_SEASON
        print(f"[MODE] League season {LEAGUE_SEASON}")

    # ── --auto gate ───────────────────────────────────────────────────────────
    do_scores = do_odds = True

    if args.auto:
        do_scores = has_recent_matches(sb, league_id=league_id, season=season_key)
        days      = next_match_days_away(sb, league_id=league_id, season=season_key)
        do_odds   = days is not None and 0 <= days <= 7

        print("[AUTO] Endpoint check:")
        print(f"  Scores -> {'YES' if do_scores else 'NO — no matches in last 3 days'}")
        if days is None:       print("  Odds   -> NO — no upcoming matches")
        elif days > 7:         print(f"  Odds   -> NO — next match in {days}d (>7d window)")
        else:                  print(f"  Odds   -> YES — next match in {days}d")

        if not do_scores and not do_odds:
            print("[AUTO] Nothing to fetch today.")
            return
        print()

    # ── Load DB reference data ────────────────────────────────────────────────
    # Filter teams by type to avoid cross-competition name collisions
    if mode == "wc":
        db_teams = {t["name"]: t["id"]
                    for t in sb.from_("teams").select("id,name")
                    .eq("team_type", "national").execute().data}
    else:
        db_teams = {t["name"]: t["id"]
                    for t in sb.from_("teams").select("id,name")
                    .neq("team_type", "national").execute().data}

    # Unplayed matches (odds target — only those with known teams)
    uq = (sb.from_("matches")
          .select("id,matchday,match_date,home_team_id,away_team_id")
          .is_("home_goals", "null"))
    uq = uq.eq("league_id", league_id) if league_id else uq.eq("season", season_key)
    unplayed = {
        (r["home_team_id"], r["away_team_id"]): r
        for r in uq.execute().data
        if r["home_team_id"] and r["away_team_id"]
    }

    # All matches (scores target)
    aq = sb.from_("matches").select("id,home_team_id,away_team_id,home_goals")
    aq = aq.eq("league_id", league_id) if league_id else aq.eq("season", season_key)
    all_by_pair = {
        (r["home_team_id"], r["away_team_id"]): r
        for r in aq.execute().data
        if r["home_team_id"] and r["away_team_id"]
    }

    print(f"[DB] {len(db_teams)} teams  |  {len(unplayed)} unplayed matches\n")

    # ── Fetch from The Odds API ───────────────────────────────────────────────
    events      = fetch_odds(sport)   if do_odds   else []
    scores_data = fetch_scores(sport) if do_scores else []
    completed   = [s for s in scores_data if s.get("completed")]
    print(f"\n  {len(events)} events with odds  |  {len(completed)} completed in last 3 days\n")

    # ── Process scores ────────────────────────────────────────────────────────
    score_updates = []
    score_skipped = []

    for ev in completed:
        api_home = ev.get("home_team", "")
        api_away = ev.get("away_team", "")
        db_home  = normalize(api_home, db_teams, team_map)
        db_away  = normalize(api_away, db_teams, team_map)
        home_id  = db_teams.get(db_home)
        away_id  = db_teams.get(db_away)

        if not home_id or not away_id:
            score_skipped.append(f"  Unknown: '{api_home}' vs '{api_away}'")
            continue

        match = all_by_pair.get((home_id, away_id))
        if not match or match["home_goals"] is not None:
            continue

        raw = ev.get("scores") or []
        by_sc    = {s["name"]: s["score"] for s in raw}
        home_raw = by_sc.get(api_home)
        away_raw = by_sc.get(api_away)
        if (home_raw is None or away_raw is None) and len(raw) >= 2:
            home_raw, away_raw = raw[0]["score"], raw[1]["score"]
        try:
            home_g, away_g = int(home_raw), int(away_raw)
        except (ValueError, TypeError):
            score_skipped.append(f"  Bad score: {db_home} vs {db_away} -> {raw}")
            continue

        score_updates.append({"id": match["id"], "home_name": db_home,
                               "away_name": db_away, "home_goals": home_g, "away_goals": away_g})

    # ── Process odds ──────────────────────────────────────────────────────────
    odds_updates  = []
    bk_rows_queue = []
    odds_skipped  = []

    for ev in events:
        api_home = ev.get("home_team", "")
        api_away = ev.get("away_team", "")
        db_home  = normalize(api_home, db_teams, team_map)
        db_away  = normalize(api_away, db_teams, team_map)
        home_id  = db_teams.get(db_home)
        away_id  = db_teams.get(db_away)

        if not home_id or not away_id:
            odds_skipped.append(f"  Unknown — '{api_home}' vs '{api_away}' -> '{db_home}' vs '{db_away}'")
            continue

        match = unplayed.get((home_id, away_id))
        if not match:
            odds_skipped.append(f"  Not in unplayed DB: {db_home} vs {db_away}")
            continue

        bks    = ev.get("bookmakers", [])
        h2h    = extract_h2h(bks, api_home, api_away)
        totals = extract_totals(bks)
        btts   = extract_btts(bks)

        if h2h is None:
            odds_skipped.append(f"  No h2h odds: {db_home} vs {db_away}")
            continue

        odds_updates.append({"id": match["id"], "matchday": match["matchday"],
                             "match_date": match.get("match_date"),
                             "home_name": db_home, "away_name": db_away,
                             "h2h": h2h, "totals": totals, "btts": btts})
        bk_rows_queue.extend(build_bk_rows(match["id"], h2h, totals, btts))

    # ── Report ────────────────────────────────────────────────────────────────
    SEP = "-" * 84
    print(f"{SEP}\n  ODDS UPDATE — {len(odds_updates)} matches  ({len(odds_skipped)} skipped)\n{SEP}")
    for u in odds_updates:
        h = u["h2h"]; t = u["totals"]; b = u["btts"]
        print(f"\n  J{u['matchday']:>2}  {u['match_date'] or '??-??-??'}  {u['home_name']:<22} vs {u['away_name']}")
        print(f"    H2H  best  1={h['best_home']:.2f}[{h['home_bk']}]  X={h['best_draw']:.2f}[{h['draw_bk']}]  2={h['best_away']:.2f}[{h['away_bk']}]  ({h['count']} bks)")
        if h["count"] > 1:
            print(f"         worst 1={h['worst_home']:.2f}  X={h['worst_draw']:.2f}  2={h['worst_away']:.2f}")
        if t: print(f"    O/U2.5  O={t['best_over']:.2f}[{t['over_bk']}]  U={t['best_under']:.2f}[{t['under_bk']}]")
        if b: print(f"    BTTS    Y={b['best_yes']:.2f}[{b['yes_bk']}]  N={b['best_no']:.2f}[{b['no_bk']}]")

    print(f"\n{SEP}")
    if odds_skipped:
        print("\n[!] Odds skipped:")
        for s in odds_skipped: print(s)

    if score_updates:
        print(f"\n{SEP}\n  SCORES UPDATE — {len(score_updates)} results\n{SEP}")
        for s in score_updates:
            print(f"  {s['home_name']:<22} {s['home_goals']} - {s['away_goals']}  {s['away_name']}")
    else:
        print("\n  [SCORES] No new completed results.")

    if score_skipped:
        print("\n[!] Scores skipped:")
        for s in score_skipped: print(s)

    print(f"\n  Bookmaker rows queued: {len(bk_rows_queue)}")
    print(f"  Total API calls this run: {_api_calls}\n")

    if args.preview:
        print("[PREVIEW] Nothing written. Re-run with --upload to save.")
        return

    # ── Upload ────────────────────────────────────────────────────────────────
    print("[->] Writing to Supabase...")

    for u in odds_updates:
        h = u["h2h"]; t = u["totals"]; b = u["btts"]
        payload = {"home_odds": h["best_home"], "draw_odds": h["best_draw"], "away_odds": h["best_away"]}
        if t: payload["over25_odds"] = t["best_over"]; payload["under25_odds"] = t["best_under"]
        if b: payload["btts_yes_odds"] = b["best_yes"]; payload["btts_no_odds"]  = b["best_no"]
        sb.from_("matches").update(payload).eq("id", u["id"]).execute()
    print(f"  [OK] {len(odds_updates)} match odds updated")

    BATCH = 200
    for i in range(0, len(bk_rows_queue), BATCH):
        sb.from_("match_odds_bookmakers").upsert(
            bk_rows_queue[i:i+BATCH],
            on_conflict="match_id,bookmaker_key,market,outcome"
        ).execute()
    print(f"  [OK] {len(bk_rows_queue)} bookmaker rows upserted")

    for s in score_updates:
        sb.from_("matches").update({"home_goals": s["home_goals"], "away_goals": s["away_goals"]}
                                   ).eq("id", s["id"]).execute()
    print(f"  [OK] {len(score_updates)} match results written")

    print(f"\n[DONE]  {_api_calls} API call(s) used this run.")


if __name__ == "__main__":
    main()
