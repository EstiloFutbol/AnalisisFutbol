"""
ml/predict.py — Phase 4: Generate Predictions
===============================================

Loads trained models and generates predictions for upcoming La Liga matches
(matches with match_date in the future and home_goals IS NULL).

For each upcoming match:
  1. Build the same feature vector used in training (rolling form, Elo, H2H…)
  2. Run each trained model to get probabilities
  3. Compare to bookmaker implied probabilities
  4. Calculate EV for each market
  5. Write predictions to Supabase table `ai_model_predictions`

Supabase table (created in migration_v18):
  match_id, model_version, market, outcome,
  model_prob, bookmaker_odds, ev, recommended (bool),
  created_at

Usage:
    python ml/predict.py
    python ml/predict.py --dry-run      # print predictions, don't write to DB
    python ml/predict.py --jornada 30   # predict specific matchday only

TODO: implement — run backtest.py first to validate model quality.
"""

print("Phase 4 (predict.py) not yet implemented.")
print("Run ml/backtest.py first to validate model quality before going live.")
