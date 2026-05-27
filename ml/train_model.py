"""
ml/train_model.py — Phase 2: Model Training
============================================

Reads ml/data/features.csv (output of build_features.py) and trains
separate classifiers for each betting market:

  Market        Model                    Target
  ──────────────────────────────────────────────────────────
  1X2 result    LogisticRegression       result (0=H, 1=D, 2=A)
  1X2 result    RandomForest (calib.)    result
  BTTS          LogisticRegression       btts   (0/1)
  BTTS          RandomForest (calib.)    btts
  Over 2.5      LogisticRegression       over25 (0/1)
  Over 2.5      RandomForest (calib.)    over25

Time-based split (NEVER random — prevents leakage of future form data):
  Train: 2021-22, 2022-23, 2023-24  (league_ids 13, 14, 15 → 1,140 matches)
  Test:  2024-25                     (league_id 1  → 380 matches)

Features: form, Elo, H2H, season stats — NO bookmaker odds.
Bookmaker odds are reserved for EV calculation AFTER prediction.

Outputs: ml/data/models/{market}_{model}.pkl   (joblib Pipeline)
         ml/data/models/training_report.txt     (metrics summary)

Usage:
    python ml/train_model.py
    python ml/train_model.py --model logistic
    python ml/train_model.py --model rf
    python ml/train_model.py --verbose
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

TRAIN_LEAGUES = [13, 14, 15]   # 2021-22, 2022-23, 2023-24
TEST_LEAGUES  = [1]            # 2024-25

# Model features — strictly pre-match signals; no bookmaker odds.
# Bookmaker odds are only used in backtest.py for EV calculation.
FEATURE_COLS = [
    # Elo ratings
    "home_elo", "away_elo", "elo_diff",
    # Rolling form — all venues, last 5 and 10 games
    "home_form_gf_5", "home_form_ga_5", "home_form_gf_10", "home_form_ga_10",
    "home_form_wins_5", "home_form_pts_5",
    "away_form_gf_5", "away_form_ga_5", "away_form_gf_10", "away_form_ga_10",
    "away_form_wins_5", "away_form_pts_5",
    # Venue-split form (home team's home record, away team's away record)
    "home_home_gf_5", "home_home_ga_5",
    "away_away_gf_5", "away_away_ga_5",
    # Season PPG and GD/game accumulated to match date
    "home_season_ppg", "away_season_ppg",
    "home_season_gd_pg", "away_season_gd_pg",
    "home_season_games", "away_season_games",
    # Head-to-head (last 5 meetings)
    "h2h_home_wins", "h2h_draws", "h2h_away_wins",
    "h2h_home_gf_avg", "h2h_away_gf_avg", "h2h_games",
]

MARKETS = {
    "result": {"target": "result", "multiclass": True,  "classes": [0, 1, 2]},
    "btts":   {"target": "btts",   "multiclass": False, "classes": [0, 1]},
    "over25": {"target": "over25", "multiclass": False, "classes": [0, 1]},
}


# ─────────────────────────────────────────────────────────────────────────────
# Metrics
# ─────────────────────────────────────────────────────────────────────────────

def ranked_probability_score(y_true, proba):
    """
    RPS for ordered outcomes (H > D > A). Lower = better.
    Measures how well-distributed the probability mass is across outcomes.
    Fairer than log loss for 1X2 because it rewards "almost correct" predictions.
    """
    n = len(y_true)
    n_classes = proba.shape[1]
    rps_total = 0.0
    for i in range(n):
        label = y_true.iloc[i] if hasattr(y_true, "iloc") else y_true[i]
        actual_cum = np.zeros(n_classes)
        actual_cum[label:] = 1.0
        pred_cum = np.cumsum(proba[i])
        rps_total += np.sum((pred_cum[:-1] - actual_cum[:-1]) ** 2)
    return rps_total / (n * (n_classes - 1))


def brier_multiclass(y_true, proba):
    """Average Brier score across classes (one-vs-rest)."""
    from sklearn.preprocessing import label_binarize
    classes = np.unique(y_true)
    y_bin = label_binarize(y_true, classes=classes)
    return np.mean(np.sum((proba - y_bin) ** 2, axis=1)) / proba.shape[1]


def evaluate_model(pipeline, X_test, y_test, market_info):
    """Return metrics dict for a fitted pipeline on the test split."""
    from sklearn.metrics import accuracy_score, log_loss, brier_score_loss

    proba = pipeline.predict_proba(X_test)
    preds = pipeline.predict(X_test)

    metrics = {
        "accuracy": accuracy_score(y_test, preds),
        "log_loss": log_loss(y_test, proba),
    }

    if market_info["multiclass"]:
        metrics["rps"]   = ranked_probability_score(y_test, proba)
        metrics["brier"] = brier_multiclass(y_test, proba)
    else:
        # For binary: proba[:,1] = P(Yes)
        metrics["brier"] = brier_score_loss(y_test, proba[:, 1])

    return metrics, proba, preds


# ─────────────────────────────────────────────────────────────────────────────
# Model builders
# ─────────────────────────────────────────────────────────────────────────────

def build_pipeline(model_name, multiclass=False):
    """Return a sklearn Pipeline for the given model type."""
    from sklearn.calibration import CalibratedClassifierCV
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.impute import SimpleImputer
    from sklearn.linear_model import LogisticRegression
    from sklearn.pipeline import Pipeline
    from sklearn.preprocessing import StandardScaler

    if model_name == "logistic":
        clf = LogisticRegression(
            max_iter=2000,
            C=1.0,
            solver="lbfgs",
            random_state=42,
        )
    elif model_name == "rf":
        base_rf = RandomForestClassifier(
            n_estimators=300,
            max_depth=8,
            min_samples_leaf=10,
            random_state=42,
            n_jobs=-1,
        )
        # Calibrate so probabilities match real frequencies
        clf = CalibratedClassifierCV(base_rf, cv=5, method="isotonic")
    else:
        raise ValueError(f"Unknown model: {model_name}")

    return Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler",  StandardScaler()),
        ("clf",     clf),
    ])


# ─────────────────────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Train ML models for match prediction")
    parser.add_argument(
        "--model", choices=["logistic", "rf", "all"], default="all",
        help="Which model type to train (default: all)"
    )
    parser.add_argument("--verbose", action="store_true", help="Show feature importances")
    args = parser.parse_args()

    model_names = ["logistic", "rf"] if args.model == "all" else [args.model]

    # ── Load data ────────────────────────────────────────────────────────────
    features_path = Path("ml/data/features.csv")
    if not features_path.exists():
        print("ERROR: ml/data/features.csv not found. Run ml/build_features.py first.")
        sys.exit(1)

    df = pd.read_csv(features_path)
    print(f"Loaded {len(df):,} matches from features.csv")

    train_df = df[df["league_id"].isin(TRAIN_LEAGUES)].copy()
    test_df  = df[df["league_id"].isin(TEST_LEAGUES)].copy()
    print(f"  Train: {len(train_df):,} matches (leagues {TRAIN_LEAGUES})")
    print(f"  Test:  {len(test_df):,} matches  (leagues {TEST_LEAGUES})")

    # Validate features exist
    missing = [c for c in FEATURE_COLS if c not in df.columns]
    if missing:
        print(f"ERROR: missing feature columns: {missing}")
        sys.exit(1)

    X_train = train_df[FEATURE_COLS]
    X_test  = test_df[FEATURE_COLS]

    os.makedirs("ml/data/models", exist_ok=True)
    report_lines = [
        "=" * 70,
        "AnalisisFutbol B44 — Model Training Report",
        f"Train: {len(train_df)} matches (seasons 2021-22, 2022-23, 2023-24)",
        f"Test:  {len(test_df)} matches  (season 2024-25)",
        f"Features: {len(FEATURE_COLS)}",
        "=" * 70,
    ]

    # ── Train per market ─────────────────────────────────────────────────────
    for market_name, market_info in MARKETS.items():
        target = market_info["target"]
        y_train = train_df[target]
        y_test  = test_df[target]

        dist = y_train.value_counts(normalize=True).sort_index()
        label_map = {0: "Home", 1: "Draw", 2: "Away"} if market_name == "result" else {0: "No", 1: "Yes"}

        print(f"\n{'-'*60}")
        print(f"Market: {market_name.upper()}")
        print(f"  Train distribution: {', '.join(f'{label_map.get(k,k)}={v:.1%}' for k,v in dist.items())}")
        report_lines += [f"\n{'-'*60}", f"MARKET: {market_name.upper()}",
                         f"  Train distribution: {', '.join(f'{label_map.get(k,k)}={v:.1%}' for k,v in dist.items())}"]

        for model_name in model_names:
            print(f"  Training {model_name}...", end=" ", flush=True)
            pipeline = build_pipeline(model_name, multiclass=market_info["multiclass"])
            pipeline.fit(X_train, y_train)
            print("done.")

            metrics, proba, preds = evaluate_model(pipeline, X_test, y_test, market_info)

            # Display metrics
            metric_str = f"acc={metrics['accuracy']:.3f}  log_loss={metrics['log_loss']:.4f}  brier={metrics['brier']:.4f}"
            if "rps" in metrics:
                metric_str += f"  rps={metrics['rps']:.4f}"
            print(f"  [{model_name:8s}] {metric_str}")
            report_lines.append(f"  [{model_name:8s}] {metric_str}")

            # Feature importances for RF
            if args.verbose and model_name == "rf":
                clf_step = pipeline.named_steps["clf"]
                # CalibratedClassifierCV wraps the base estimator
                if hasattr(clf_step, "calibrated_classifiers_"):
                    importances = np.mean([
                        est.estimator.feature_importances_
                        for est in clf_step.calibrated_classifiers_
                    ], axis=0)
                    top_idx = np.argsort(importances)[::-1][:10]
                    print("    Top 10 features (RF):")
                    for rank, idx in enumerate(top_idx, 1):
                        print(f"      {rank:2d}. {FEATURE_COLS[idx]:<30s} {importances[idx]:.4f}")

            # Save model
            model_path = f"ml/data/models/{market_name}_{model_name}.pkl"
            import joblib
            joblib.dump(pipeline, model_path)
            print(f"  Saved → {model_path}")

    # ── Baseline comparison (always predict majority class) ─────────────────
    print(f"\n{'-'*60}")
    print("Naive baseline (always predict majority class):")
    report_lines += [f"\n{'-'*60}", "Naive baseline (majority class):"]
    for market_name, market_info in MARKETS.items():
        from sklearn.metrics import accuracy_score
        target = market_info["target"]
        y_train = train_df[target]
        y_test  = test_df[target]
        majority = y_train.mode()[0]
        baseline_acc = accuracy_score(y_test, np.full(len(y_test), majority))
        line = f"  {market_name:<8s}: {baseline_acc:.3f} accuracy (always predicts {majority})"
        print(line)
        report_lines.append(line)

    # ── Save report ──────────────────────────────────────────────────────────
    report_lines.append(f"\n{'='*70}")
    report_path = "ml/data/models/training_report.txt"

    with open(report_path, "w") as f:
        f.write("\n".join(report_lines))
    print(f"\nReport saved → {report_path}")
    print("\nPhase 2 complete. Run ml/backtest.py next.")


if __name__ == "__main__":
    main()
