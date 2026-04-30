"""
fetch_odds_api.py  —  Fetch La Liga odds and recent scores from The Odds API.

Up to 2 API calls per run (each skipped independently when not needed):
  1. /v4/sports/{sport}/scores/ → completed results from the last 3 days
       Called when: any match in our DB has match_date in the last 3 days.
  2. /v4/sports/{sport}/odds/   → h2h + totals (O/U 2.5) + btts markets
       Called when: the next unplayed jornada starts within 7 days.

With --auto, each call is skipped independently, so a typical post-jornada day
(results just in, next jornada still a week away) uses only 1 call instead of 2.

DB writes (never touches match_date — only odds/score columns):
  • matches.home_odds / draw_odds / away_odds  — best available h2h per outcome
  • matches.over25_odds / under25_odds         — best over/under 2.5
  • matches.btts_yes_odds / btts_no_odds       — best BTTS
  • matches.home_goals / away_goals            — from scores (never overwrites existing)
  • match_odds_bookmakers                      — all individual bookmaker rows (upserted)

Usage (local):
  python .github/fetch_odds_api.py --preview
  python .github/fetch_odds_api.py --upload

Usage (CI — GitHub Actions):
  python .github/fetch_odds_api.py --auto --upload
  (--auto gates each endpoint independently based on timing)

Credentials:
  Local : reads VITE_SUPABASE_URL / VITE_SUPABASE_SERVICE_ROLE_KEY / ODDS_API_KEY
          from .env.local (git-ignored).
  CI    : reads SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / ODDS_API_KEY
          from GitHub Actions Secrets.
"""

import io
import os
import re
import sys
import argparse
import unicodedata
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
SUPABASE_KEY = (
    os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    or os.environ["VITE_SUPABASE_SERVICE_ROLE_KEY"]
)
ODDS_API_KEY = os.environ["ODDS_API_KEY"]

SEASON       = "2025-2026"
SPORT        = "soccer_spain_la_liga"
TOTALS_POINT = 2.5   # The O/U line we store (most bookmakers offer 2.5)


# ── Team name mapping: The Odds API name → canonical DB teams.name ────────────

TEAM_NAME_MAP = {
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


def _slug(name: str) -> str:
    """Accent-free lowercase with common club words stripped — fuzzy fallback."""
    nfd  = unicodedata.normalize("NFD", name)
    bare = "".join(c for c in nfd if unicodedata.category(c) != "Mn").lower()
    bare = re.sub(r"\b(fc|cf|cd|ud|rcd|ca|sd|real|deportivo|club)\b", "", bare)
    return re.sub(r"\s+", " ", bare).strip()


def normalize(api_name: str, db_teams: dict) -> str:
    """
    Map an API team name to its canonical DB name.
    Priority: explicit map → fuzzy slug match against all DB team names → as-is.
    """
    name = api_name.strip()
    if name in TEAM_NAME_MAP:
        return TEAM_NAME_MAP[name]
    slug = _slug(name)
    for db_name in db_teams:
        if _slug(db_name) == slug:
            return db_name
    return name   # will produce "Unknown team" warning


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
          f"used={resp.headers.get('x-requests-used', '?')}  "
          f"remaining={resp.headers.get('x-requests-remaining', '?')}")
    return resp.json()


def fetch_odds() -> list:
    """Fetch odds, falling back to fewer markets if the API rejects a combination."""
    # Some markets (btts) may not be available depending on the plan/region.
    # Try in decreasing richness so we always get at least h2h.
    for markets in ["h2h,totals,btts", "h2h,totals", "h2h"]:
        print(f"[→] Fetching odds ({markets})…")
        try:
            return _get(
                f"/sports/{SPORT}/odds/",
                {"regions": "eu", "markets": markets, "oddsFormat": "decimal"},
            )
        except requests.exceptions.HTTPError as exc:
            if exc.response is not None and exc.response.status_code == 422:
                print(f"  [WARN] Market combo '{markets}' rejected (422) — trying fewer markets")
                continue
            raise
    return []


def fetch_scores() -> list:
    print("[→] Fetching scores (last 3 days)…")
    return _get(f"/sports/{SPORT}/scores/", {"daysFrom": 3})


# ── Odds extraction ───────────────────────────────────────────────────────────

def _best_bk(rows: list, key: str) -> str:
    """Title of the bookmaker with the highest (best for bettor) value for `key`."""
    return max(rows, key=lambda r: r[key])["title"]


def extract_h2h(bookmakers: list, home_api: str, away_api: str) -> dict | None:
    """
    Parse h2h market across all bookmakers.
    Returns best (highest) odds per outcome and the bookmaker behind each best.
    Also returns worst odds for the spread display.
    """
    rows = []
    for bk in bookmakers:
        for mkt in bk.get("markets", []):
            if mkt["key"] != "h2h":
                continue
            by_name = {o["name"]: o["price"] for o in mkt.get("outcomes", [])}
            draw_p  = by_name.get("Draw")
            home_p  = by_name.get(home_api)
            away_p  = by_name.get(away_api)
            # Positional fallback when team names don't match exactly
            if (home_p is None or away_p is None) and draw_p is not None:
                non_draw = [(k, v) for k, v in by_name.items() if k != "Draw"]
                if len(non_draw) == 2:
                    home_p, away_p = non_draw[0][1], non_draw[1][1]
            if home_p and draw_p and away_p:
                rows.append({
                    "key":   bk["key"],
                    "title": bk["title"],
                    "home":  home_p,
                    "draw":  draw_p,
                    "away":  away_p,
                })
    if not rows:
        return None
    return {
        "best_home":  max(r["home"] for r in rows),
        "best_draw":  max(r["draw"] for r in rows),
        "best_away":  max(r["away"] for r in rows),
        "worst_home": min(r["home"] for r in rows),
        "worst_draw": min(r["draw"] for r in rows),
        "worst_away": min(r["away"] for r in rows),
        "home_bk":    _best_bk(rows, "home"),
        "draw_bk":    _best_bk(rows, "draw"),
        "away_bk":    _best_bk(rows, "away"),
        "count":      len(rows),
        "rows":       rows,
    }


def extract_totals(bookmakers: list, point: float = TOTALS_POINT) -> dict | None:
    """Parse totals (over/under) market, filtered to the standard 2.5 line."""
    rows = []
    for bk in bookmakers:
        for mkt in bk.get("markets", []):
            if mkt["key"] != "totals":
                continue
            over_p = under_p = None
            for o in mkt.get("outcomes", []):
                if abs((o.get("point") or 0.0) - point) > 0.01:
                    continue
                if o["name"] == "Over":
                    over_p = o["price"]
                elif o["name"] == "Under":
                    under_p = o["price"]
            if over_p and under_p:
                rows.append({
                    "key":   bk["key"],
                    "title": bk["title"],
                    "over":  over_p,
                    "under": under_p,
                })
    if not rows:
        return None
    return {
        "best_over":  max(r["over"]  for r in rows),
        "best_under": max(r["under"] for r in rows),
        "over_bk":    _best_bk(rows, "over"),
        "under_bk":   _best_bk(rows, "under"),
        "rows":       rows,
    }


def extract_btts(bookmakers: list) -> dict | None:
    """Parse both-teams-to-score market."""
    rows = []
    for bk in bookmakers:
        for mkt in bk.get("markets", []):
            if mkt["key"] != "btts":
                continue
            yes_p = no_p = None
            for o in mkt.get("outcomes", []):
                if o["name"] == "Yes":
                    yes_p = o["price"]
                elif o["name"] == "No":
                    no_p = o["price"]
            if yes_p and no_p:
                rows.append({
                    "key":   bk["key"],
                    "title": bk["title"],
                    "yes":   yes_p,
                    "no":    no_p,
                })
    if not rows:
        return None
    return {
        "best_yes": max(r["yes"] for r in rows),
        "best_no":  max(r["no"]  for r in rows),
        "yes_bk":   _best_bk(rows, "yes"),
        "no_bk":    _best_bk(rows, "no"),
        "rows":     rows,
    }


def build_bk_rows(match_id: int, h2h: dict, totals: dict | None, btts: dict | None) -> list:
    """Flatten all bookmaker market rows into a list ready for upsert."""
    out = []
    for r in h2h["rows"]:
        for outcome, val in [("home", r["home"]), ("draw", r["draw"]), ("away", r["away"])]:
            out.append({
                "match_id":       match_id,
                "bookmaker_key":  r["key"],
                "bookmaker_title": r["title"],
                "market":         "h2h",
                "outcome":        outcome,
                "point":          None,
                "odds":           val,
            })
    if totals:
        for r in totals["rows"]:
            for outcome, val in [("over", r["over"]), ("under", r["under"])]:
                out.append({
                    "match_id":       match_id,
                    "bookmaker_key":  r["key"],
                    "bookmaker_title": r["title"],
                    "market":         "totals",
                    "outcome":        outcome,
                    "point":          TOTALS_POINT,
                    "odds":           val,
                })
    if btts:
        for r in btts["rows"]:
            for outcome, val in [("yes", r["yes"]), ("no", r["no"])]:
                out.append({
                    "match_id":       match_id,
                    "bookmaker_key":  r["key"],
                    "bookmaker_title": r["title"],
                    "market":         "btts",
                    "outcome":        outcome,
                    "point":          None,
                    "odds":           val,
                })
    return out


# ── DB helpers ────────────────────────────────────────────────────────────────

def has_recent_matches(sb) -> bool:
    """True if any match in our season has match_date within the last 3 days.
    Mirrors the Odds API scores endpoint's daysFrom=3 window."""
    three_days_ago = (date.today() - timedelta(days=3)).isoformat()
    today_str      = date.today().isoformat()
    res = (
        sb.from_("matches")
        .select("id")
        .eq("season", SEASON)
        .gte("match_date", three_days_ago)
        .lte("match_date", today_str)
        .limit(1)
        .execute()
    )
    return len(res.data) > 0


def next_jornada_days_away(sb) -> int | None:
    today_str = date.today().isoformat()
    res = (
        sb.from_("matches")
        .select("match_date")
        .eq("season", SEASON)
        .is_("home_goals", "null")
        .not_.is_("match_date", "null")
        .gte("match_date", today_str)
        .order("match_date")
        .limit(1)
        .execute()
    )
    if not res.data:
        return None
    return (date.fromisoformat(res.data[0]["match_date"]) - date.today()).days


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Sync La Liga odds and scores")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--preview", action="store_true",
                       help="Print report without writing to DB")
    group.add_argument("--upload",  action="store_true",
                       help="Write to Supabase")
    parser.add_argument("--auto", action="store_true",
                        help="Skip if next jornada is not within 5 days")
    args = parser.parse_args()

    sb = create_client(SUPABASE_URL, SUPABASE_KEY)

    # ── --auto gate: decide independently for each endpoint ──────────────────
    do_scores = True
    do_odds   = True

    if args.auto:
        # Scores: only useful when a match was played in the last 3 days
        do_scores = has_recent_matches(sb)

        # Odds: only useful when the next jornada is within 7 days
        days = next_jornada_days_away(sb)
        do_odds = (days is not None and 0 <= days <= 7)

        print("[AUTO] Endpoint check:")
        print(f"  Scores → {'YES' if do_scores else 'NO — no matches in last 3 days'}")
        if days is None:
            print("  Odds   → NO — no upcoming matches found")
        elif days < 0:
            print(f"  Odds   → NO — jornada already started ({abs(days)}d ago); run manually")
        elif days > 7:
            print(f"  Odds   → NO — next jornada in {days} day(s), outside 7-day window")
        else:
            print(f"  Odds   → YES — next jornada in {days} day(s)")

        if not do_scores and not do_odds:
            print("[AUTO] Nothing to fetch today — no API calls made.")
            return
        print()

    # ── Load DB reference data ───────────────────────────────────────────────
    db_teams = {
        t["name"]: t["id"]
        for t in sb.from_("teams").select("id, name").execute().data
    }
    unplayed_resp = (
        sb.from_("matches")
        .select("id, matchday, match_date, home_team_id, away_team_id")
        .eq("season", SEASON)
        .is_("home_goals", "null")
        .execute()
    )
    unplayed = {
        (r["home_team_id"], r["away_team_id"]): r
        for r in unplayed_resp.data
    }
    all_resp = (
        sb.from_("matches")
        .select("id, home_team_id, away_team_id, home_goals")
        .eq("season", SEASON)
        .execute()
    )
    all_by_pair = {
        (r["home_team_id"], r["away_team_id"]): r
        for r in all_resp.data
    }

    print(f"[DB] {len(db_teams)} teams  |  {len(unplayed)} unplayed {SEASON} matches\n")

    # ── Fetch from API (0–2 calls depending on --auto flags) ─────────────────
    events      = fetch_odds()   if do_odds   else []
    scores_data = fetch_scores() if do_scores else []
    completed   = [s for s in scores_data if s.get("completed")]
    print(
        f"\n  {len(events)} events with odds  |  "
        f"{len(completed)} completed in last 3 days\n"
    )

    # ── Process scores ───────────────────────────────────────────────────────
    score_updates = []
    score_skipped = []

    for ev in completed:
        api_home = ev.get("home_team", "")
        api_away = ev.get("away_team", "")
        db_home  = normalize(api_home, db_teams)
        db_away  = normalize(api_away, db_teams)
        home_id  = db_teams.get(db_home)
        away_id  = db_teams.get(db_away)

        if not home_id or not away_id:
            score_skipped.append(f"  Unknown: '{api_home}' vs '{api_away}'")
            continue

        match = all_by_pair.get((home_id, away_id))
        if not match or match["home_goals"] is not None:
            continue  # Not in DB for this season, or result already recorded

        raw_scores = ev.get("scores") or []
        by_sc      = {s["name"]: s["score"] for s in raw_scores}
        home_raw   = by_sc.get(api_home)
        away_raw   = by_sc.get(api_away)

        # Positional fallback (API lists home first)
        if (home_raw is None or away_raw is None) and len(raw_scores) >= 2:
            home_raw = raw_scores[0]["score"]
            away_raw = raw_scores[1]["score"]

        try:
            home_g = int(home_raw)
            away_g = int(away_raw)
        except (ValueError, TypeError):
            score_skipped.append(
                f"  Bad score data: {db_home} vs {db_away} → {raw_scores}"
            )
            continue

        score_updates.append({
            "id":         match["id"],
            "home_name":  db_home,
            "away_name":  db_away,
            "home_goals": home_g,
            "away_goals": away_g,
        })

    # ── Process odds ─────────────────────────────────────────────────────────
    odds_updates  = []
    bk_rows_queue = []
    odds_skipped  = []

    for ev in events:
        api_home = ev.get("home_team", "")
        api_away = ev.get("away_team", "")
        db_home  = normalize(api_home, db_teams)
        db_away  = normalize(api_away, db_teams)
        home_id  = db_teams.get(db_home)
        away_id  = db_teams.get(db_away)

        if not home_id or not away_id:
            odds_skipped.append(
                f"  Unknown team — API: '{api_home}' vs '{api_away}'"
                f"  →  normalized: '{db_home}' vs '{db_away}'"
            )
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

        odds_updates.append({
            "id":         match["id"],
            "matchday":   match["matchday"],
            "match_date": match.get("match_date"),  # display only — NEVER written to DB
            "home_name":  db_home,
            "away_name":  db_away,
            "h2h":        h2h,
            "totals":     totals,
            "btts":       btts,
        })
        bk_rows_queue.extend(
            build_bk_rows(match["id"], h2h, totals, btts)
        )

    # ── Console report ───────────────────────────────────────────────────────
    SEP = "─" * 84
    print(f"{SEP}")
    print(f"  ODDS UPDATE — {len(odds_updates)} matches  ({len(odds_skipped)} skipped)")
    print(SEP)
    for u in odds_updates:
        h = u["h2h"]
        t = u["totals"]
        b = u["btts"]
        print(
            f"\n  J{u['matchday']:>2}  {u['match_date'] or '??-??-??'}"
            f"  {u['home_name']:<22} vs {u['away_name']}"
        )
        print(
            f"    H2H    best   1={h['best_home']:.2f} [{h['home_bk']}]"
            f"   X={h['best_draw']:.2f} [{h['draw_bk']}]"
            f"   2={h['best_away']:.2f} [{h['away_bk']}]"
            f"   ({h['count']} bks)"
        )
        if h["count"] > 1:
            print(
                f"           worst  1={h['worst_home']:.2f}"
                f"   X={h['worst_draw']:.2f}"
                f"   2={h['worst_away']:.2f}"
            )
        if t:
            print(
                f"    O/U2.5         O={t['best_over']:.2f} [{t['over_bk']}]"
                f"   U={t['best_under']:.2f} [{t['under_bk']}]"
            )
        if b:
            print(
                f"    BTTS           Y={b['best_yes']:.2f} [{b['yes_bk']}]"
                f"   N={b['best_no']:.2f} [{b['no_bk']}]"
            )

    print(f"\n{SEP}")

    if odds_skipped:
        print("\n[!] Odds skipped:")
        for s in odds_skipped:
            print(s)

    if score_updates:
        print(f"\n{SEP}")
        print(f"  SCORES UPDATE — {len(score_updates)} results")
        print(SEP)
        for s in score_updates:
            print(
                f"  {s['home_name']:<22} {s['home_goals']} – {s['away_goals']}"
                f"  {s['away_name']}"
            )
    else:
        print("\n  [SCORES] No new completed results to write.")

    if score_skipped:
        print("\n[!] Scores skipped:")
        for s in score_skipped:
            print(s)

    print(f"\n  Bookmaker rows queued: {len(bk_rows_queue)}")
    print(f"  Total API calls this run: {_api_calls}\n")

    if args.preview:
        print("[PREVIEW] Nothing written. Re-run with --upload to save.")
        return

    # ── Upload ───────────────────────────────────────────────────────────────
    print("[→] Writing to Supabase…")

    # Odds (best per outcome) — match_date deliberately excluded from payload
    for u in odds_updates:
        h = u["h2h"]
        t = u["totals"]
        b = u["btts"]
        payload = {
            "home_odds": h["best_home"],
            "draw_odds": h["best_draw"],
            "away_odds": h["best_away"],
        }
        if t:
            payload["over25_odds"]  = t["best_over"]
            payload["under25_odds"] = t["best_under"]
        if b:
            payload["btts_yes_odds"] = b["best_yes"]
            payload["btts_no_odds"]  = b["best_no"]
        sb.from_("matches").update(payload).eq("id", u["id"]).execute()
    print(f"  [OK] {len(odds_updates)} match odds updated")

    # Bookmaker rows (upsert in batches to stay within request size limits)
    BATCH = 200
    for i in range(0, len(bk_rows_queue), BATCH):
        sb.from_("match_odds_bookmakers").upsert(
            bk_rows_queue[i : i + BATCH],
            on_conflict="match_id,bookmaker_key,market,outcome",
        ).execute()
    print(f"  [OK] {len(bk_rows_queue)} bookmaker rows upserted")

    # Scores (only for matches that had no result yet — already filtered above)
    for s in score_updates:
        sb.from_("matches").update({
            "home_goals": s["home_goals"],
            "away_goals": s["away_goals"],
        }).eq("id", s["id"]).execute()
    print(f"  [OK] {len(score_updates)} match results written")

    print(f"\n[DONE]  {_api_calls} API call(s) used this run.")


if __name__ == "__main__":
    main()
