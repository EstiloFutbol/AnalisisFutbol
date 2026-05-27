"""
ml/train_model.py — Phase 2: Model Training
============================================

Reads ml/data/features.csv (output of build_features.py) and trains
separate classifiers for each betting market:

  Market        Model              Target
  ─────────────────────────────────────────
  1X2 result    LogisticRegression result (0=H, 1=D, 2=A)
  BTTS          LogisticRegression btts   (0/1)
  Over 2.5      LogisticRegression over25 (0/1)

Progression path:
  1. LogisticRegression   — baseline; well-calibrated probabilities
  2. RandomForest         — captures non-linear patterns
  3. XGBoost / LightGBM   — state-of-the-art for tabular data

Outputs: ml/data/models/  (joblib files, one per market)

Usage:
    python ml/train_model.py
    python ml/train_model.py --model logistic
    python ml/train_model.py --model rf
    python ml/train_model.py --seasons 2021-2022 2022-2023 2023-2024

TODO: implement — run build_features.py first.
"""

print("Phase 2 (train_model.py) not yet implemented.")
print("Run ml/build_features.py first to generate ml/data/features.csv")
