"""
ml/build_features.py — Phase 1: Feature Engineering
=====================================================

Pulls all La Liga match data from Supabase and builds a feature matrix
for ML model training. All features are computed from data available
strictly BEFORE the match kick-off (no look-ahead bias).

Output: ml/data/features.csv  (one row per played match)

Features per match
------------------
Rolling form (computed over all-venue games):
  home_form_gf_5 / _10     avg goals scored last 5/10 games
  home_form_ga_5 / _10     avg goals conceded last 5/10 games
  home_form_wins_5         win rate last 5 games
  home_form_pts_5          points per game last 5 games
  (same set for away team)

Venue-split form:
  home_home_gf_5           avg goals scored last 5 HOME games (home team)
  home_home_ga_5           avg goals conceded last 5 HOME games
  away_away_gf_5           avg goals scored last 5 AWAY games (away team)
  away_away_ga_5           avg goals conceded last 5 AWAY games

Elo ratings (updated match-by-match throughout all 5 seasons):
  home_elo / away_elo      Elo rating before the match
  elo_diff                 home_elo - away_elo

Head-to-head (last 5 meetings before this match):
  h2h_home_wins, h2h_draws, h2h_away_wins
  h2h_home_gf_avg, h2h_away_gf_avg

Season position at time of match:
  home_season_ppg          home team points per game so far this season
  away_season_ppg
  home_season_gd_pg        home team goal difference per game this season
  away_season_gd_pg

Target variables:
  result     0=Home Win, 1=Draw, 2=Away Win
  btts       1 if both teams scored, 0 otherwise
  over25     1 if total goals > 2.5, 0 otherwise
  home_goals, away_goals   exact score

Bookmaker odds (for EV calculation at backtest time):
  b365_home, b365_draw, b365_away
  b365_over25, b365_under25
  b365_home_implied        1 / b365_home (implied prob, no margin removal)

Usage:
    python ml/build_features.py              # uses .env.local
    python ml/build_features.py --seasons 1 2 13 14 15   # specific league IDs
    python ml/build_features.py --output ml/data/my_features.csv
"""

import os, sys, io, argparse
from datetime import date
from collections import defaultdict
from dotenv import load_dotenv
from supabase import create_client

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(_ROOT, ".env.local"))

SUPABASE_URL = os.environ.get("SUPABASE_URL") or os.environ["VITE_SUPABASE_URL"]
SUPABASE_KEY = (os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
                or os.environ["VITE_SUPABASE_SERVICE_ROLE_KEY"])

# La Liga league IDs (code=PD)
DEFAULT_LEAGUE_IDS = [1, 2, 13, 14, 15]  # 24-25, 25-26, 21-22, 22-23, 23-24

# Elo parameters
ELO_K        = 20      # standard K-factor
ELO_HOME_ADV = 100    # points added to home team expected score
ELO_INIT     = 1500   # starting Elo for all teams
ELO_D        = 400    # scaling factor (standard)


# ── Elo helpers ───────────────────────────────────────────────────────────────

def expected_score(rating_a: float, rating_b: float, home_adv: float = 0) -> float:
    """Expected score for team A vs team B (with optional home advantage)."""
    return 1 / (1 + 10 ** ((rating_b - rating_a - home_adv) / ELO_D))


def update_elo(home_r: float, away_r: float, home_goals: int, away_goals: int):
    """Return (new_home_elo, new_away_elo)."""
    exp_home = expected_score(home_r, away_r, home_adv=ELO_HOME_ADV)
    exp_away = 1 - exp_home
    actual_home = 1 if home_goals > away_goals else (0.5 if home_goals == away_goals else 0)
    actual_away = 1 - actual_home
    return (
        round(home_r + ELO_K * (actual_home - exp_home), 2),
        round(away_r + ELO_K * (actual_away - exp_away), 2),
    )


# ── Rolling helpers ───────────────────────────────────────────────────────────

def _rolling(history: list[dict], n: int, key: str, default=0.0) -> float:
    """Average `key` over the last n entries in history."""
    recent = history[-n:]
    if not recent:
        return default
    return round(sum(r[key] for r in recent) / len(recent), 4)


def _win_rate(history: list[dict], n: int) -> float:
    recent = history[-n:]
    if not recent:
        return 0.0
    return round(sum(1 for r in recent if r["pts"] == 3) / len(recent), 4)


def _ppg(history: list[dict], n: int) -> float:
    recent = history[-n:]
    if not recent:
        return 0.0
    return round(sum(r["pts"] for r in recent) / len(recent), 4)


# ── Main ──────────────────────────────────────────────────────────────────────

def build_features(league_ids: list[int], output_path: str):
    sb = create_client(SUPABASE_URL, SUPABASE_KEY)

    # ── 1. Fetch all played matches for these leagues ─────────────────────────
    print(f"[DB] Fetching matches for league IDs: {league_ids}...")
    all_matches = []
    for lid in league_ids:
        rows = (sb.from_("matches")
                .select("id,league_id,season,match_date,home_team_id,away_team_id,"
                        "home_goals,away_goals,home_odds,draw_odds,away_odds,"
                        "over25_odds,under25_odds")
                .eq("league_id", lid)
                .not_.is_("home_goals", "null")
                .not_.is_("away_goals", "null")
                .order("match_date", desc=False)
                .execute().data)
        all_matches.extend(rows)
        print(f"  league_id={lid}: {len(rows)} played matches")

    # Sort globally by date (important: Elo updates must be chronological)
    all_matches.sort(key=lambda m: (m["match_date"] or "0000-00-00", m["id"]))
    print(f"\n[INFO] Total matches to process: {len(all_matches)}")

    # ── 2. Initialise state dictionaries ──────────────────────────────────────
    elo: dict[int, float]               = defaultdict(lambda: ELO_INIT)
    all_history:  dict[int, list]       = defaultdict(list)   # all-venue game log
    home_history: dict[int, list]       = defaultdict(list)   # home games only
    away_history: dict[int, list]       = defaultdict(list)   # away games only
    season_log:   dict[tuple, list]     = defaultdict(list)   # (team_id, season) log
    h2h_log:      dict[tuple, list]     = defaultdict(list)   # (teamA, teamB) sorted

    feature_rows = []

    # ── 3. Process each match ─────────────────────────────────────────────────
    for m in all_matches:
        hid     = m["home_team_id"]
        aid     = m["away_team_id"]
        hg      = m["home_goals"]
        ag      = m["away_goals"]
        season  = m["season"]

        if hid is None or aid is None:
            continue   # TBD knockout slot

        # Elo BEFORE the match
        home_elo_pre = elo[hid]
        away_elo_pre = elo[aid]

        # Rolling form (all-venue) — computed BEFORE updating histories
        row = {
            # ── Identity ──────────────────────────────────────────────────────
            "match_id":        m["id"],
            "league_id":       m["league_id"],
            "season":          season,
            "match_date":      m["match_date"],
            "home_team_id":    hid,
            "away_team_id":    aid,

            # ── Elo ───────────────────────────────────────────────────────────
            "home_elo":        home_elo_pre,
            "away_elo":        away_elo_pre,
            "elo_diff":        round(home_elo_pre - away_elo_pre, 2),

            # ── Home team all-venue form ──────────────────────────────────────
            "home_form_gf_5":  _rolling(all_history[hid], 5,  "gf"),
            "home_form_ga_5":  _rolling(all_history[hid], 5,  "ga"),
            "home_form_gf_10": _rolling(all_history[hid], 10, "gf"),
            "home_form_ga_10": _rolling(all_history[hid], 10, "ga"),
            "home_form_wins_5":_win_rate(all_history[hid], 5),
            "home_form_pts_5": _ppg(all_history[hid], 5),

            # ── Away team all-venue form ──────────────────────────────────────
            "away_form_gf_5":  _rolling(all_history[aid], 5,  "gf"),
            "away_form_ga_5":  _rolling(all_history[aid], 5,  "ga"),
            "away_form_gf_10": _rolling(all_history[aid], 10, "gf"),
            "away_form_ga_10": _rolling(all_history[aid], 10, "ga"),
            "away_form_wins_5":_win_rate(all_history[aid], 5),
            "away_form_pts_5": _ppg(all_history[aid], 5),

            # ── Venue-split form ─────────────────────────────────────────────
            "home_home_gf_5":  _rolling(home_history[hid], 5, "gf"),
            "home_home_ga_5":  _rolling(home_history[hid], 5, "ga"),
            "away_away_gf_5":  _rolling(away_history[aid], 5, "gf"),
            "away_away_ga_5":  _rolling(away_history[aid], 5, "ga"),

            # ── Season position (this season only) ───────────────────────────
            "home_season_ppg":     _ppg(season_log[(hid, season)], 999),
            "away_season_ppg":     _ppg(season_log[(aid, season)], 999),
            "home_season_gd_pg":   _rolling(season_log[(hid, season)], 999, "gd"),
            "away_season_gd_pg":   _rolling(season_log[(aid, season)], 999, "gd"),
            "home_season_games":   len(season_log[(hid, season)]),
            "away_season_games":   len(season_log[(aid, season)]),

            # ── Head-to-head (last 5 meetings) ───────────────────────────────
            **_h2h_features(h2h_log, hid, aid),

            # ── Bookmaker odds (for EV calculation) ──────────────────────────
            "b365_home":           m.get("home_odds"),
            "b365_draw":           m.get("draw_odds"),
            "b365_away":           m.get("away_odds"),
            "b365_over25":         m.get("over25_odds"),
            "b365_under25":        m.get("under25_odds"),
            "b365_home_implied":   round(1 / m["home_odds"], 4) if m.get("home_odds") else None,
            "b365_draw_implied":   round(1 / m["draw_odds"], 4) if m.get("draw_odds") else None,
            "b365_away_implied":   round(1 / m["away_odds"], 4) if m.get("away_odds") else None,

            # ── Targets ──────────────────────────────────────────────────────
            "home_goals":  hg,
            "away_goals":  ag,
            "result":      0 if hg > ag else (1 if hg == ag else 2),
            "btts":        1 if hg > 0 and ag > 0 else 0,
            "over25":      1 if (hg + ag) > 2.5 else 0,
            "total_goals": hg + ag,
        }
        feature_rows.append(row)

        # ── Update Elo AFTER recording pre-match values ───────────────────────
        new_home_elo, new_away_elo = update_elo(home_elo_pre, away_elo_pre, hg, ag)
        elo[hid] = new_home_elo
        elo[aid] = new_away_elo

        # ── Update form histories ─────────────────────────────────────────────
        h_pts = 3 if hg > ag else (1 if hg == ag else 0)
        a_pts = 3 if ag > hg else (1 if ag == hg else 0)
        h_gd  = hg - ag
        a_gd  = ag - hg

        all_history[hid].append({"gf": hg, "ga": ag, "pts": h_pts, "gd": h_gd})
        all_history[aid].append({"gf": ag, "ga": hg, "pts": a_pts, "gd": a_gd})
        home_history[hid].append({"gf": hg, "ga": ag, "pts": h_pts})
        away_history[aid].append({"gf": ag, "ga": hg, "pts": a_pts})
        season_log[(hid, season)].append({"gf": hg, "ga": ag, "pts": h_pts, "gd": h_gd})
        season_log[(aid, season)].append({"gf": ag, "ga": hg, "pts": a_pts, "gd": a_gd})

        # H2H: store as (min_id, max_id) so it's symmetric
        h2h_key = (min(hid, aid), max(hid, aid))
        h2h_log[h2h_key].append({
            "home_id": hid, "away_id": aid,
            "hg": hg, "ag": ag,
        })

    # ── 4. Write CSV ──────────────────────────────────────────────────────────
    if not feature_rows:
        print("[ERROR] No feature rows generated.")
        return

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    columns = list(feature_rows[0].keys())

    import csv
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=columns)
        writer.writeheader()
        writer.writerows(feature_rows)

    print(f"\n[DONE] {len(feature_rows)} rows written to {output_path}")
    _print_summary(feature_rows)


def _h2h_features(h2h_log: dict, hid: int, aid: int, n: int = 5) -> dict:
    """Last n meetings between hid and aid (before this match)."""
    key    = (min(hid, aid), max(hid, aid))
    recent = h2h_log[key][-n:]

    h_wins = draws = a_wins = 0
    h_gf_total = a_gf_total = 0

    for r in recent:
        if r["home_id"] == hid:
            hg, ag = r["hg"], r["ag"]
        else:
            hg, ag = r["ag"], r["hg"]   # flip perspective
        h_gf_total += hg
        a_gf_total += ag
        if hg > ag:   h_wins += 1
        elif hg == ag: draws += 1
        else:          a_wins += 1

    n_played = len(recent)
    return {
        "h2h_home_wins":    h_wins,
        "h2h_draws":        draws,
        "h2h_away_wins":    a_wins,
        "h2h_home_gf_avg":  round(h_gf_total / n_played, 4) if n_played else 0.0,
        "h2h_away_gf_avg":  round(a_gf_total / n_played, 4) if n_played else 0.0,
        "h2h_games":        n_played,
    }


def _print_summary(rows: list[dict]):
    """Print a quick sanity-check summary."""
    n = len(rows)
    results   = [r["result"]   for r in rows]
    btts_list = [r["btts"]     for r in rows]
    over_list = [r["over25"]   for r in rows]
    goals     = [r["total_goals"] for r in rows]
    with_odds = sum(1 for r in rows if r.get("b365_home"))

    print(f"\n{'─'*50}")
    print(f"  Matches:          {n}")
    print(f"  Home wins:        {results.count(0)} ({results.count(0)/n*100:.1f}%)")
    print(f"  Draws:            {results.count(1)} ({results.count(1)/n*100:.1f}%)")
    print(f"  Away wins:        {results.count(2)} ({results.count(2)/n*100:.1f}%)")
    print(f"  BTTS Yes:         {sum(btts_list)} ({sum(btts_list)/n*100:.1f}%)")
    print(f"  Over 2.5:         {sum(over_list)} ({sum(over_list)/n*100:.1f}%)")
    print(f"  Avg goals/match:  {sum(goals)/n:.2f}")
    print(f"  With B365 odds:   {with_odds} ({with_odds/n*100:.1f}%)")
    print(f"{'─'*50}")


# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--leagues", nargs="*", type=int, default=DEFAULT_LEAGUE_IDS,
                        help="League IDs to include (default: all 5 La Liga seasons)")
    parser.add_argument("--output", default=os.path.join(_ROOT, "ml", "data", "features.csv"),
                        help="Output CSV path")
    args = parser.parse_args()

    build_features(args.leagues, args.output)
