"""
ml/backtest.py — Phase 3: Backtesting
=======================================

Validates whether the trained models have real edge against bookmakers.
Uses walk-forward cross-validation — always trains on older seasons and
tests on the next season (strictly chronological, no data leakage).

Walk-forward folds:
  Fold 1: Train 2021-22           → Test 2022-23
  Fold 2: Train 2021-22..2022-23  → Test 2023-24
  Fold 3: Train 2021-22..2023-24  → Test 2024-25  (gold standard)

For each +EV pick (model_prob x bookmaker_odds > 1 + threshold):
  Flat stake: bet 1 unit, return = odds-1 if correct, -1 if wrong
  Kelly stake: f = edge / (odds-1), half-Kelly = f * 0.5, capped at 20%

Markets with B365 closing odds in features.csv:
  - result  (h2h):   b365_home / b365_draw / b365_away
  - over25  (totals): b365_over25 / b365_under25

BTTS closing odds are not in features.csv → skipped in flat-stake sim
but model accuracy is still reported.

Usage:
    python ml/backtest.py
    python ml/backtest.py --threshold 0.05
    python ml/backtest.py --model rf
    python ml/backtest.py --market result over25
    python ml/backtest.py --all-models          # compare logistic vs rf
"""

import argparse
import os
import sys
import warnings
from pathlib import Path

import numpy as np
import pandas as pd

warnings.filterwarnings("ignore")

# ─────────────────────────────────────────────────────────────────────────────
# Configuration
# ─────────────────────────────────────────────────────────────────────────────

# Walk-forward folds: (train_leagues, test_league_id, label)
FOLDS = [
    ([13],          14, "Train:2021-22 -> Test:2022-23"),
    ([13, 14],      15, "Train:2021-23 -> Test:2023-24"),
    ([13, 14, 15],   1, "Train:2021-24 -> Test:2024-25"),
]

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
        "target":    "result",
        "multiclass": True,
        "outcomes": {0: "Home", 1: "Draw", 2: "Away"},
        "odds_cols": {0: "b365_home", 1: "b365_draw", 2: "b365_away"},
    },
    "over25": {
        "target":    "over25",
        "multiclass": False,
        "outcomes": {0: "Under", 1: "Over"},
        "odds_cols": {0: "b365_under25", 1: "b365_over25"},
    },
    "btts": {
        "target":    "btts",
        "multiclass": False,
        "outcomes": {0: "No", 1: "Yes"},
        "odds_cols": None,   # No B365 closing odds in features.csv
    },
}

HALF_KELLY_FRACTION = 0.5    # Conservative: bet half the Kelly stake
MAX_KELLY_STAKE     = 0.20   # Cap any single bet at 20% of bankroll


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

def build_and_train(train_df, model_name, multiclass):
    """Build and fit a fresh pipeline on train_df."""
    from sklearn.calibration import CalibratedClassifierCV
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.impute import SimpleImputer
    from sklearn.linear_model import LogisticRegression
    from sklearn.pipeline import Pipeline
    from sklearn.preprocessing import StandardScaler

    if model_name == "logistic":
        clf = LogisticRegression(max_iter=2000, C=1.0, solver="lbfgs", random_state=42)
    elif model_name == "rf":
        base_rf = RandomForestClassifier(
            n_estimators=200, max_depth=8, min_samples_leaf=10,
            random_state=42, n_jobs=-1,
        )
        clf = CalibratedClassifierCV(base_rf, cv=4, method="isotonic")
    else:
        raise ValueError(f"Unknown model: {model_name}")

    pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler",  StandardScaler()),
        ("clf",     clf),
    ])
    target = "result" if multiclass else None  # set by caller
    return pipeline


def simulate_bets(df_test, proba, market_info, threshold):
    """
    Simulate flat-stake and Kelly betting on +EV picks.

    Returns a DataFrame with one row per bet attempted, including:
    outcome, odds, model_prob, ev, stake_kelly, win, flat_pnl, kelly_pnl
    """
    odds_cols = market_info["odds_cols"]
    if odds_cols is None:
        return pd.DataFrame()   # No odds data for this market

    target   = market_info["target"]
    outcomes = market_info["outcomes"]

    bets = []
    for i, (idx, row) in enumerate(df_test.iterrows()):
        actual = int(row[target])
        for outcome_id, outcome_label in outcomes.items():
            odds_col = odds_cols[outcome_id]
            if odds_col not in row or pd.isna(row[odds_col]):
                continue
            odds      = float(row[odds_col])
            model_p   = float(proba[i, outcome_id])
            ev        = model_p * odds - 1.0

            if ev < threshold:
                continue   # No edge → skip

            # Kelly fraction = edge / (odds - 1)
            kelly_f   = ev / (odds - 1)
            kelly_f   = min(kelly_f * HALF_KELLY_FRACTION, MAX_KELLY_STAKE)
            win       = (actual == outcome_id)
            flat_pnl  = (odds - 1) if win else -1.0
            kelly_pnl = kelly_f * (odds - 1) if win else -kelly_f

            bets.append({
                "match_id":   row["match_id"],
                "outcome":    outcome_label,
                "odds":       odds,
                "model_prob": model_p,
                "ev":         ev,
                "kelly_f":    kelly_f,
                "win":        win,
                "flat_pnl":   flat_pnl,
                "kelly_pnl":  kelly_pnl,
            })

    return pd.DataFrame(bets)


def summarise(bets_df):
    """Return dict of summary stats for a bets DataFrame."""
    if bets_df.empty:
        return {"n_bets": 0, "hit_rate": float("nan"), "flat_roi": float("nan"),
                "kelly_roi": float("nan"), "flat_profit": 0.0}
    n = len(bets_df)
    return {
        "n_bets":     n,
        "hit_rate":   bets_df["win"].mean(),
        "flat_profit": bets_df["flat_pnl"].sum(),
        "flat_roi":   bets_df["flat_pnl"].sum() / n,
        "kelly_roi":  bets_df["kelly_pnl"].sum() / n,
        "avg_odds":   bets_df["odds"].mean(),
        "avg_ev":     bets_df["ev"].mean(),
    }


def print_summary(label, stats):
    if stats["n_bets"] == 0:
        print(f"  {label:<40s}  No bets (no +EV picks or no odds data)")
        return
    print(
        f"  {label:<40s}  "
        f"n={stats['n_bets']:3d}  "
        f"hit={stats['hit_rate']:.1%}  "
        f"flat_roi={stats['flat_roi']:+.1%}  "
        f"kelly_roi={stats['kelly_roi']:+.1%}  "
        f"avg_odds={stats['avg_odds']:.2f}"
    )


# ─────────────────────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Walk-forward backtest of ML models")
    parser.add_argument("--threshold", type=float, default=0.05,
                        help="Minimum EV to place a bet (default: 0.05 = 5%%)")
    parser.add_argument("--model", choices=["logistic", "rf", "all"], default="all",
                        help="Which model to backtest (default: all)")
    parser.add_argument("--market", nargs="+", default=["result", "over25", "btts"],
                        choices=["result", "over25", "btts"],
                        help="Markets to test (default: all)")
    parser.add_argument("--all-models", action="store_true",
                        help="Compare logistic vs rf side-by-side")
    args = parser.parse_args()

    model_names = ["logistic", "rf"] if (args.model == "all" or args.all_models) else [args.model]
    markets_to_test = {k: v for k, v in MARKETS.items() if k in args.market}
    threshold = args.threshold

    # ── Load features ────────────────────────────────────────────────────────
    features_path = Path("ml/data/features.csv")
    if not features_path.exists():
        print("ERROR: ml/data/features.csv not found. Run ml/build_features.py first.")
        sys.exit(1)

    df = pd.read_csv(features_path)
    print(f"Loaded {len(df):,} matches | threshold={threshold:.0%} EV")
    print()

    all_results = {}   # (model, market, fold_label) -> stats dict

    # ── Walk-forward folds ───────────────────────────────────────────────────
    for fold_idx, (train_leagues, test_league, fold_label) in enumerate(FOLDS, 1):
        print(f"{'='*70}")
        print(f"Fold {fold_idx}: {fold_label}")

        train_df = df[df["league_id"].isin(train_leagues)].copy()
        test_df  = df[df["league_id"] == test_league].copy()
        # Only rows with B365 odds for betting sim (all should have them for ids 1,13,14,15)
        print(f"  Train: {len(train_df)} | Test: {len(test_df)}")

        for market_name, market_info in markets_to_test.items():
            target      = market_info["target"]
            multiclass  = market_info["multiclass"]
            y_train     = train_df[target]
            y_test      = test_df[target]
            X_train     = train_df[FEATURE_COLS]
            X_test      = test_df[FEATURE_COLS]

            print(f"\n  Market: {market_name.upper()}")

            for model_name in model_names:
                # Train fresh on this fold's training data
                pipeline = build_and_train(train_df, model_name, multiclass)
                pipeline.named_steps["clf"]  # just access to confirm structure
                # Fit (need to pass target)
                pipeline.fit(X_train, y_train)

                # Accuracy
                from sklearn.metrics import accuracy_score
                preds = pipeline.predict(X_test)
                acc   = accuracy_score(y_test, preds)

                # Probability matrix
                proba = pipeline.predict_proba(X_test)
                # Ensure shape is (n, n_classes) aligned with outcome_ids
                classes = pipeline.classes_
                # Reorder columns to match outcome_ids (0, 1, 2 or 0, 1)
                max_class = max(market_info["outcomes"].keys())
                reordered = np.zeros((len(test_df), max_class + 1))
                for col_idx, cls in enumerate(classes):
                    if cls <= max_class:
                        reordered[:, cls] = proba[:, col_idx]
                proba = reordered

                # Simulate bets
                bets_df = simulate_bets(test_df, proba, market_info, threshold)
                stats   = summarise(bets_df)
                stats["accuracy"] = acc

                key = (model_name, market_name, fold_label)
                all_results[key] = stats

                label = f"{model_name}/{market_name}"
                print(f"    acc={acc:.3f}", end="  ")
                print_summary(label, stats)

    # ── Aggregate results across all folds ───────────────────────────────────
    print(f"\n{'='*70}")
    print(f"OVERALL SUMMARY (all folds combined)")
    print(f"{'='*70}")

    for model_name in model_names:
        for market_name in markets_to_test:
            fold_stats = [
                all_results[(model_name, market_name, fold_label)]
                for _, _, fold_label in FOLDS
                if (model_name, market_name, fold_label) in all_results
            ]
            total_bets   = sum(s["n_bets"] for s in fold_stats)
            total_profit = sum(s.get("flat_profit", 0) for s in fold_stats)
            avg_hit      = np.mean([s["hit_rate"] for s in fold_stats if s["n_bets"] > 0]) if total_bets > 0 else float("nan")
            flat_roi     = total_profit / total_bets if total_bets > 0 else float("nan")
            avg_acc      = np.mean([s["accuracy"] for s in fold_stats])

            flag = "+" if flat_roi > 0 else ""
            print(
                f"  {model_name}/{market_name:<12s}  "
                f"avg_acc={avg_acc:.3f}  "
                f"total_bets={total_bets:4d}  "
                f"hit={avg_hit:.1%}  "
                f"flat_roi={flag}{flat_roi:+.1%}"
                if total_bets > 0 else
                f"  {model_name}/{market_name:<12s}  "
                f"avg_acc={avg_acc:.3f}  no odds data for betting sim"
            )

    # ── EV calibration check ─────────────────────────────────────────────────
    print(f"\n{'='*70}")
    print("EV CALIBRATION  (model EV estimate vs actual return, Fold 3 only)")
    print("Positive = model overestimated edge | Negative = underestimated")
    print(f"{'='*70}")

    # Re-run fold 3 to collect all bets for calibration
    _, _, fold3_label = FOLDS[-1]
    train_df3 = df[df["league_id"].isin(FOLDS[-1][0])].copy()
    test_df3  = df[df["league_id"] == FOLDS[-1][1]].copy()

    for model_name in model_names:
        for market_name, market_info in markets_to_test.items():
            if market_info["odds_cols"] is None:
                continue
            target = market_info["target"]
            pipeline = build_and_train(train_df3, model_name, False)
            pipeline.fit(train_df3[FEATURE_COLS], train_df3[target])
            proba = pipeline.predict_proba(test_df3[FEATURE_COLS])
            classes = pipeline.classes_
            max_class = max(market_info["outcomes"].keys())
            reordered = np.zeros((len(test_df3), max_class + 1))
            for col_idx, cls in enumerate(classes):
                if cls <= max_class:
                    reordered[:, cls] = proba[:, col_idx]
            proba = reordered
            bets_df = simulate_bets(test_df3, proba, market_info, threshold)
            if bets_df.empty:
                continue
            # EV buckets
            buckets = pd.cut(bets_df["ev"], bins=[0.05, 0.10, 0.15, 0.20, 0.30, 1.0],
                             labels=["5-10%", "10-15%", "15-20%", "20-30%", ">30%"])
            cal_df = bets_df.copy()
            cal_df["ev_bucket"] = buckets
            g = cal_df.groupby("ev_bucket", observed=True).agg(
                n=("win","count"), actual_roi=("flat_pnl","mean"), avg_ev=("ev","mean")
            )
            print(f"\n  {model_name}/{market_name}:")
            for bucket, row in g.iterrows():
                gap = row["avg_ev"] - row["actual_roi"]
                print(f"    EV bucket {bucket}: n={int(row['n']):3d}  "
                      f"model_ev={row['avg_ev']:+.1%}  "
                      f"actual_roi={row['actual_roi']:+.1%}  "
                      f"gap={gap:+.1%}")

    print(f"\nPhase 3 complete. Run ml/predict.py to generate live predictions.")


if __name__ == "__main__":
    main()
