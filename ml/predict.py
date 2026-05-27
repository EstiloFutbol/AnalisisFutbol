"""
ml/predict.py — Phase 4: Generate Predictions for Upcoming Matches
===================================================================

Loads the trained models (ml/data/models/) and generates predictions
for any upcoming La Liga matches (match_date >= today, home_goals IS NULL).

How it works:
  1. Load features.csv and replay all historical matches to reconstruct
     the current Elo rating and rolling form state for every team.
     (This avoids a full DB round-trip while keeping state accurate.)
  2. Query Supabase for upcoming La Liga matches.
  3. Build a feature vector for each upcoming match using current state.
  4. Run each trained model to get win/draw/lose + BTTS + over/under probs.
  5. Fetch current bookmaker odds from the matches table.
  6. Calculate EV = model_prob × decimal_odds - 1 for each outcome.
  7. Upsert predictions into `ai_model_predictions` (migration_v18).

Supabase table — create before first run:
  (copy the SQL block at the bottom into the Supabase SQL Editor)

Usage:
    python ml/predict.py                  # predict all upcoming matches
    python ml/predict.py --dry-run        # print predictions, skip DB write
    python ml/predict.py --model rf       # use RF models only
    python ml/predict.py --league 2       # specific league_id (default: 1 and 2)

Dependencies:
    pip install scikit-learn joblib supabase python-dotenv

migration_v18 SQL (run once in Supabase SQL Editor):
    ----------------------------------------------------------------
    CREATE TABLE IF NOT EXISTS ai_model_predictions (
        id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        match_id        INTEGER REFERENCES matches(id) ON DELETE CASCADE,
        model_version   TEXT NOT NULL,
        market          TEXT NOT NULL,
        outcome         TEXT NOT NULL,
        model_prob      FLOAT NOT NULL,
        bookmaker_odds  FLOAT,
        ev              FLOAT,
        recommended     BOOLEAN DEFAULT false,
        created_at      TIMESTAMPTZ DEFAULT now(),
        UNIQUE (match_id, model_version, market, outcome)
    );
    ALTER TABLE ai_model_predictions ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Public read" ON ai_model_predictions FOR SELECT USING (true);
    ----------------------------------------------------------------
"""

import argparse
import io
import os
import sys
import warnings
from collections import defaultdict
from datetime import date
from pathlib import Path

import numpy as np
import pandas as pd

warnings.filterwarnings("ignore")
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

# ─────────────────────────────────────────────────────────────────────────────
# Configuration
# ─────────────────────────────────────────────────────────────────────────────

_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_ROOT / "ml"))

# Import state-computation helpers from build_features (no DB connection here)
from build_features import (
    ELO_INIT, ELO_K, ELO_HOME_ADV, ELO_D,
    expected_score, update_elo,
    _rolling, _win_rate, _ppg, _h2h_features,
)

from dotenv import load_dotenv
load_dotenv(_ROOT / ".env.local")

SUPABASE_URL = os.environ.get("SUPABASE_URL") or os.environ.get("VITE_SUPABASE_URL")
SUPABASE_KEY = (os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
                or os.environ.get("VITE_SUPABASE_SERVICE_ROLE_KEY"))

# Model config
MODEL_VERSION    = "rf_v1"            # bump when models are retrained
EV_THRESHOLD     = 0.05              # 5% minimum EV to mark as recommended
DEFAULT_LEAGUES  = [1, 2]            # La Liga 24-25 and 25-26

FEATURE_COLS = [
    "home_elo", "away_elo", "elo_diff",
    "home_form_gf_5", "home_form_ga_5", "home_form_gf_10", "home_form_ga_10",
    "home_form_wins_5", "home_form_pts_5",
    "away_form_gf_5", "away_form_ga_5", "away_form_gf_10", "away_form_ga_10",
    "away_form_wins_5", "away_form_pts_5",
    "home_home_gf_5", "home_home_ga_5",
    "away_away_gf_5", "away_away_ga_5",
    "home_season_ppg", "away_season_ppg",
    "home_season_gd_pg", "away_season_gd_pg",
    "home_season_games", "away_season_games",
    "h2h_home_wins", "h2h_draws", "h2h_away_wins",
    "h2h_home_gf_avg", "h2h_away_gf_avg", "h2h_games",
]

MARKETS = {
    "result": {
        "model_file": "result_{model}.pkl",
        "outcomes":   {0: "Home", 1: "Draw", 2: "Away"},
        "multiclass": True,
    },
    "btts": {
        "model_file": "btts_{model}.pkl",
        "outcomes":   {0: "No", 1: "Yes"},
        "multiclass": False,
    },
    "over25": {
        "model_file": "over25_{model}.pkl",
        "outcomes":   {0: "Under", 1: "Over"},
        "multiclass": False,
    },
}


# ─────────────────────────────────────────────────────────────────────────────
# Step 1: Reconstruct current team state from features.csv
# ─────────────────────────────────────────────────────────────────────────────

def rebuild_state_from_csv(csv_path: Path) -> dict:
    """
    Replay all historical match results in chronological order to reconstruct:
      - Current Elo rating for every team
      - Rolling form history (all-venue, home-only, away-only)
      - Season game log
      - H2H game log

    Returns a dict with keys:
        elo, all_history, home_history, away_history, season_log, h2h_log
    """
    df = pd.read_csv(csv_path).sort_values(["match_date", "match_id"])
    df = df.dropna(subset=["home_goals", "away_goals"])

    elo          = defaultdict(lambda: ELO_INIT)
    all_history  = defaultdict(list)
    home_history = defaultdict(list)
    away_history = defaultdict(list)
    season_log   = defaultdict(list)
    h2h_log      = defaultdict(list)

    for _, row in df.iterrows():
        hid    = int(row["home_team_id"])
        aid    = int(row["away_team_id"])
        hg     = int(row["home_goals"])
        ag     = int(row["away_goals"])
        season = row["season"]

        # Update Elo
        new_home_elo, new_away_elo = update_elo(elo[hid], elo[aid], hg, ag)
        elo[hid] = new_home_elo
        elo[aid] = new_away_elo

        # Update form histories
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

        h2h_key = (min(hid, aid), max(hid, aid))
        h2h_log[h2h_key].append({"home_id": hid, "away_id": aid, "hg": hg, "ag": ag})

    print(f"[State] Reconstructed from {len(df)} played matches.")
    print(f"  Teams with Elo state: {len(elo)}")
    return {
        "elo": elo,
        "all_history": all_history,
        "home_history": home_history,
        "away_history": away_history,
        "season_log": season_log,
        "h2h_log": h2h_log,
    }


# ─────────────────────────────────────────────────────────────────────────────
# Step 2: Build feature vector for an upcoming match
# ─────────────────────────────────────────────────────────────────────────────

def build_feature_vector(match: dict, state: dict, season: str) -> dict:
    """
    Build a pre-match feature vector for an upcoming match.
    Uses the current state (Elo + form histories) to mirror build_features.py.
    """
    hid = match["home_team_id"]
    aid = match["away_team_id"]

    home_elo_pre = state["elo"][hid]
    away_elo_pre = state["elo"][aid]

    return {
        "home_elo":         home_elo_pre,
        "away_elo":         away_elo_pre,
        "elo_diff":         round(home_elo_pre - away_elo_pre, 2),

        "home_form_gf_5":   _rolling(state["all_history"][hid], 5,  "gf"),
        "home_form_ga_5":   _rolling(state["all_history"][hid], 5,  "ga"),
        "home_form_gf_10":  _rolling(state["all_history"][hid], 10, "gf"),
        "home_form_ga_10":  _rolling(state["all_history"][hid], 10, "ga"),
        "home_form_wins_5": _win_rate(state["all_history"][hid], 5),
        "home_form_pts_5":  _ppg(state["all_history"][hid], 5),

        "away_form_gf_5":   _rolling(state["all_history"][aid], 5,  "gf"),
        "away_form_ga_5":   _rolling(state["all_history"][aid], 5,  "ga"),
        "away_form_gf_10":  _rolling(state["all_history"][aid], 10, "gf"),
        "away_form_ga_10":  _rolling(state["all_history"][aid], 10, "ga"),
        "away_form_wins_5": _win_rate(state["all_history"][aid], 5),
        "away_form_pts_5":  _ppg(state["all_history"][aid], 5),

        "home_home_gf_5":   _rolling(state["home_history"][hid], 5, "gf"),
        "home_home_ga_5":   _rolling(state["home_history"][hid], 5, "ga"),
        "away_away_gf_5":   _rolling(state["away_history"][aid], 5, "gf"),
        "away_away_ga_5":   _rolling(state["away_history"][aid], 5, "ga"),

        "home_season_ppg":    _ppg(state["season_log"][(hid, season)], 999),
        "away_season_ppg":    _ppg(state["season_log"][(aid, season)], 999),
        "home_season_gd_pg":  _rolling(state["season_log"][(hid, season)], 999, "gd"),
        "away_season_gd_pg":  _rolling(state["season_log"][(aid, season)], 999, "gd"),
        "home_season_games":  len(state["season_log"][(hid, season)]),
        "away_season_games":  len(state["season_log"][(aid, season)]),

        **_h2h_features(state["h2h_log"], hid, aid),
    }


# ─────────────────────────────────────────────────────────────────────────────
# Step 3: Load models
# ─────────────────────────────────────────────────────────────────────────────

def load_models(model_name: str, models_dir: Path) -> dict:
    """Return {market_name: fitted_pipeline} for the requested model type."""
    import joblib
    loaded = {}
    for market_name, market_info in MARKETS.items():
        fname = market_info["model_file"].format(model=model_name)
        path  = models_dir / fname
        if not path.exists():
            print(f"  WARNING: model not found: {path}")
            continue
        loaded[market_name] = joblib.load(path)
    return loaded


# ─────────────────────────────────────────────────────────────────────────────
# Step 4: Predict + calculate EV
# ─────────────────────────────────────────────────────────────────────────────

def predict_match(match: dict, features: dict, models: dict, model_version: str) -> list[dict]:
    """
    Generate prediction rows for one upcoming match across all markets.
    Returns a list of dicts ready for insertion into ai_model_predictions.
    """
    X = pd.DataFrame([features])[FEATURE_COLS]
    predictions = []

    # Bookmaker odds from match row (stored in matches.home_odds etc.)
    bk_odds = {
        "result": {
            0: match.get("home_odds"),
            1: match.get("draw_odds"),
            2: match.get("away_odds"),
        },
        "over25": {
            0: match.get("under25_odds"),
            1: match.get("over25_odds"),
        },
        "btts": {0: None, 1: None},   # BTTS odds not stored in matches table
    }

    for market_name, pipeline in models.items():
        market_info = MARKETS[market_name]
        outcomes    = market_info["outcomes"]

        proba = pipeline.predict_proba(X)[0]  # 1-d array of class probs
        classes = pipeline.classes_

        for outcome_id, outcome_label in outcomes.items():
            # Map outcome_id → probability (handle class ordering)
            if outcome_id in classes:
                col = list(classes).index(outcome_id)
                model_p = float(proba[col])
            else:
                model_p = 0.0

            bk = bk_odds[market_name].get(outcome_id)
            ev = round(model_p * bk - 1, 4) if bk else None

            predictions.append({
                "match_id":       match["id"],
                "model_version":  model_version,
                "market":         market_name,
                "outcome":        outcome_label,
                "model_prob":     round(model_p, 4),
                "bookmaker_odds": bk,
                "ev":             ev,
                "recommended":    (ev is not None and ev >= EV_THRESHOLD),
            })

    return predictions


# ─────────────────────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Generate ML predictions for upcoming matches")
    parser.add_argument("--dry-run", action="store_true",
                        help="Print predictions without writing to DB")
    parser.add_argument("--model", choices=["logistic", "rf"], default="rf",
                        help="Which trained model to use (default: rf)")
    parser.add_argument("--league", type=int, nargs="+", default=DEFAULT_LEAGUES,
                        help="League IDs to predict (default: 1 2)")
    args = parser.parse_args()

    # ── Paths ────────────────────────────────────────────────────────────────
    csv_path    = _ROOT / "ml" / "data" / "features.csv"
    models_dir  = _ROOT / "ml" / "data" / "models"
    model_version = f"{args.model}_v1"

    if not csv_path.exists():
        print("ERROR: ml/data/features.csv not found. Run ml/build_features.py first.")
        sys.exit(1)

    missing_models = [
        m for m in MARKETS
        if not (models_dir / MARKETS[m]["model_file"].format(model=args.model)).exists()
    ]
    if missing_models:
        print(f"ERROR: Missing models for: {missing_models}")
        print("       Run ml/train_model.py first.")
        sys.exit(1)

    # ── Reconstruct current team state ───────────────────────────────────────
    print("Rebuilding team state from features.csv...")
    state = rebuild_state_from_csv(csv_path)

    # ── Load models ──────────────────────────────────────────────────────────
    print(f"\nLoading {args.model} models from {models_dir}...")
    models = load_models(args.model, models_dir)
    print(f"  Loaded models: {list(models.keys())}")

    # ── Query upcoming matches ────────────────────────────────────────────────
    print("\nQuerying upcoming matches from Supabase...")
    from supabase import create_client
    sb = create_client(SUPABASE_URL, SUPABASE_KEY)

    today_str = date.today().isoformat()
    upcoming = []
    for lid in args.league:
        rows = (sb.from_("matches")
                .select("id,league_id,season,match_date,matchday,"
                        "home_team_id,away_team_id,"
                        "home_odds,draw_odds,away_odds,"
                        "over25_odds,under25_odds")
                .eq("league_id", lid)
                .is_("home_goals", "null")
                .not_.is_("home_team_id", "null")   # skip TBD knockout slots
                .gte("match_date", today_str)
                .order("match_date", desc=False)
                .execute().data)
        upcoming.extend(rows)
        print(f"  League {lid}: {len(rows)} upcoming matches")

    if not upcoming:
        print("\nNo upcoming matches found. Nothing to predict.")
        print("(The season may be over — check back when the next season starts.)")
        sys.exit(0)

    # ── Generate predictions ──────────────────────────────────────────────────
    print(f"\nGenerating predictions for {len(upcoming)} matches...")
    all_predictions = []

    for match in upcoming:
        season = match.get("season") or "2025-2026"
        features = build_feature_vector(match, state, season)
        preds = predict_match(match, features, models, model_version)
        all_predictions.extend(preds)

        # Print summary
        result_preds = [p for p in preds if p["market"] == "result"]
        h_p = next((p["model_prob"] for p in result_preds if p["outcome"] == "Home"), 0)
        d_p = next((p["model_prob"] for p in result_preds if p["outcome"] == "Draw"), 0)
        a_p = next((p["model_prob"] for p in result_preds if p["outcome"] == "Away"), 0)
        rec = [p for p in preds if p["recommended"]]

        print(f"  Match {match['id']} ({match['match_date']}):")
        print(f"    H={h_p:.1%}  D={d_p:.1%}  A={a_p:.1%}", end="")
        if rec:
            rec_str = ", ".join(f"{r['market']}/{r['outcome']}@{r['bookmaker_odds']:.2f}(EV={r['ev']:+.1%})" for r in rec)
            print(f"  >> RECOMMENDED: {rec_str}", end="")
        print()

    # ── Write to Supabase (or dry-run) ────────────────────────────────────────
    if args.dry_run:
        print(f"\n[Dry run] Would write {len(all_predictions)} prediction rows.")
        print("  Re-run without --dry-run to commit to Supabase.")
    else:
        print(f"\nWriting {len(all_predictions)} rows to ai_model_predictions...")
        # Upsert in batches (avoid request size limits)
        batch_size = 100
        total_written = 0
        for i in range(0, len(all_predictions), batch_size):
            batch = all_predictions[i:i + batch_size]
            sb.from_("ai_model_predictions").upsert(
                batch,
                on_conflict="match_id,model_version,market,outcome"
            ).execute()
            total_written += len(batch)

        print(f"  Written: {total_written} rows")
        rec_count = sum(1 for p in all_predictions if p["recommended"])
        print(f"  Recommended bets: {rec_count}")

    print("\nPhase 4 complete.")


if __name__ == "__main__":
    main()
