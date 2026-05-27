# DEPRECATED — Gemini AI Assistant Edge Function

This Edge Function (Gemini 2.5 Flash chat + bet generation) has been removed.

**Replaced by:** A custom ML model trained on 5 seasons of La Liga data.
See `ml/` directory and `src/pages/Analisis.jsx`.

## What to clean up

1. **Supabase secrets** — remove `GEMINI_API_KEY` from your Supabase project:
   - Go to Supabase Dashboard → Edge Functions → Secrets
   - Delete `GEMINI_API_KEY`

2. **Google AI Studio** — revoke the Gemini API key at https://aistudio.google.com/

3. **Supabase Edge Function** — undeploy if still live:
   ```bash
   supabase functions delete ai-assistant
   ```

## New architecture

| Before | After |
|--------|-------|
| Gemini 2.5 Flash API | Custom scikit-learn Random Forest |
| Cloud AI per-request | Pre-trained model (ml/data/models/*.pkl) |
| 20 msg/day rate limit | Unlimited (model runs locally/in CI) |
| `GEMINI_API_KEY` needed | No external AI API needed |

To generate new predictions:
```bash
python ml/predict.py   # writes to ai_model_predictions table
```
