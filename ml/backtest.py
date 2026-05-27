"""
ml/backtest.py — Phase 3: Backtesting
=======================================

Simulates betting on historical matches using model probabilities
vs bookmaker closing odds. Answers the key question:
  "Would this model have made money over 5 seasons?"

Metrics computed:
  - Accuracy per market (% correct predictions)
  - Calibration (Brier score, reliability diagram)
  - Flat stake ROI   — bet 1 unit on every +EV pick
  - Kelly ROI        — size bets proportional to edge
  - EV distribution  — histogram of EV values across all picks

+EV definition:
  EV = model_probability × decimal_odds - 1
  Pick flagged when EV > threshold (default 0.05 = 5% edge)

Usage:
    python ml/backtest.py
    python ml/backtest.py --threshold 0.05
    python ml/backtest.py --market result btts over25

TODO: implement — run train_model.py first.
"""

print("Phase 3 (backtest.py) not yet implemented.")
print("Run ml/train_model.py first to generate trained models.")
