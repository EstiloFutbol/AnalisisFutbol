# ⚽ AnalisisFutbol B44

A football analytics platform for La Liga and international competitions. Combines 5 seasons of historical data, daily live odds, and AI-powered analysis to help users make **informed** betting decisions — responsibly.

> **Responsible gambling**: This is an analytical tool. It does not guarantee results. Betting involves financial risk. +18. Help: [JugarBien.es](https://www.jugarbien.es) · 900 200 225

---

## Features

- **Mercados** — historical betting market statistics (goals, BTTS, over/under, corners, cards) with probability bars
- **Clasificación** — La Liga standings computed from results; WC 2026 shows 12 separate group tables
- **Partidos** — match browser with WC round labels (Octavos, Semis, Final…), group badges, upcoming fixtures
- **Jugadores** — player leaderboards (goals, assists, cards, shots on target, GK saves)
- **IA Bet Assistant** — Gemini 2.5 Flash powered assistant that analyses patterns and suggests picks with transparent reasoning
- **Mis Apuestas** — personal bet tracker (pre-match or live at minute X), ROI history
- **Admin panel** — manage matches, teams, referees, coaches, expert match reviews

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS + shadcn/ui + Recharts + Framer Motion |
| State / Data | TanStack Query (React Query v5) |
| Backend | Supabase (PostgreSQL + Auth + RLS + Edge Functions) |
| AI Assistant | Google Gemini 2.5 Flash via Supabase Edge Function |
| ML Model | Python + scikit-learn (in development — `ml/` directory) |
| Data Pipeline | Python scripts (`.github/`) + GitHub Actions (daily 09:00 UTC) |
| Hosting | Cloudflare Pages (frontend) + Supabase (backend) |

---

## Project Structure

```
AnalisisFutbol_B44/
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx        # Tabs: Mercados · Jugadores · Partidos · Clasificación
│   │   ├── Matches.jsx          # Full match browser (WC round labels + group badges)
│   │   ├── MatchDetail.jsx      # Single match: stats, odds, player lineups, timeline
│   │   ├── Players.jsx          # Player leaderboards
│   │   ├── Betting.jsx          # Bet tracker (real bets + AI picks)
│   │   ├── AIAssistant.jsx      # Gemini chat UI (20 msgs/day per user)
│   │   ├── Admin.jsx            # Admin panel
│   │   └── Landing.jsx          # Public landing page (responsible gambling section)
│   ├── components/
│   │   ├── matches/             # MatchCard, GoalTimeline, StatBar, MatchEditForm
│   │   ├── charts/              # GoalTimeChart, StatDistributionChart
│   │   └── ui/                  # shadcn/ui components
│   ├── hooks/
│   │   ├── useMatches.js        # useMatches, useLeagues, useGroupStandings, useMatchdays
│   │   ├── usePlayerStats.js    # usePlayerLeaderboard, useMatchPlayerStats
│   │   ├── useBetting.js        # useRealBets, useAIBets, useAddRealBet
│   │   ├── useAI.js             # Gemini assistant
│   │   └── useMatchReviews.js
│   ├── context/                 # AuthContext, ThemeContext
│   └── lib/supabase.js
│
├── .github/
│   ├── workflows/
│   │   └── fetch_odds.yml              # Daily GitHub Action (09:00 UTC)
│   ├── fetch_odds_api.py               # The Odds API → Supabase (live odds + scores)
│   ├── sync_match_dates.py             # football-data.org → Supabase (dates + results + WC standings)
│   ├── import_world_cup.py             # One-time WC 2026 import (48 teams · 104 matches · standings)
│   └── import_historical_laliga.py     # One-time historical La Liga import (3 seasons + odds)
│
├── ml/                          # Machine learning prediction model
│   ├── build_features.py        # Phase 1: rolling form · Elo · H2H → features.csv
│   ├── train_model.py           # Phase 2: logistic regression / random forest / XGBoost
│   ├── backtest.py              # Phase 3: ROI simulation vs bookmaker closing odds
│   └── predict.py              # Phase 4: generate predictions for upcoming matches
│
├── supabase/
│   └── functions/ai-assistant/  # Gemini Edge Function
│
├── database/                    # SQL migrations v1–v17 (gitignored — run in Supabase SQL Editor)
└── tools/                       # Local-only data import scripts (gitignored)
```

---

## Database Schema

### Core tables

| Table | Key columns | Purpose |
|-------|-------------|---------|
| `leagues` | `id`, `code` (PD/WC), `season`, `is_default` | Competition records |
| `teams` | `id`, `name`, `team_type` (club/national), `logo_url` | Clubs + national teams |
| `matches` | see below | Central fact table |
| `match_player_stats` | `player_name`, `goals`, `assists`, `shots`, `gk_saves`… | Per-player per-match |
| `match_odds_bookmakers` | `bookmaker_key`, `market`, `outcome`, `odds` | Multi-bookmaker odds store |
| `tournament_standings` | `league_id`, `group_name`, `team_id`, `points`… | WC / tournament group tables |

### Auth & user tables

| Table | Purpose |
|-------|---------|
| `user_profiles` | Supabase Auth users + `is_admin` flag |
| `real_bets` | User bet tracker with `bet_timing`, `bet_minute` |
| `ai_bets` | AI-generated picks with reasoning, auto-settled on result |
| `chat_usage` | Rate limiting: 20 AI messages/day per user |
| `match_expert_reviews` | Admin match analysis + public comments |

### `matches` — key columns

```sql
-- Identity
league_id, season, matchday, match_date, kick_off_time, group_name

-- Teams
home_team_id, away_team_id

-- Results
home_goals, away_goals, home_ht_goals, away_ht_goals, btts

-- Stats
home_shots, away_shots, home_shots_on_target, away_shots_on_target,
home_corners, away_corners, total_corners,
home_yellow_cards, away_yellow_cards, home_red_cards, away_red_cards,
home_fouls, away_fouls, home_xg, away_xg, home_possession, away_possession

-- Odds (best live / B365 closing for historical seasons)
home_odds, draw_odds, away_odds, over25_odds, under25_odds, btts_yes_odds, btts_no_odds
```

---

## Data Sources & Pipeline

| Source | What we get | When |
|--------|-------------|------|
| [football-data.org](https://www.football-data.org) | Match dates, kick-off times, results, WC teams + schedule | Daily (GitHub Actions) |
| [The Odds API](https://the-odds-api.com) | Live pre-match odds — 1X2, over/under, BTTS | Daily (GitHub Actions) |
| [football-data.co.uk](https://www.football-data.co.uk) | Historical La Liga CSVs: full stats + B365 + Pinnacle closing odds | One-time import |
| FBRef (Excel exports) | Detailed player stats, xG, lineups (current season) | Manual via `tools/` |

### Data in DB (May 2026)

| Competition | Season | Matches | Played | Odds coverage |
|-------------|--------|---------|--------|---------------|
| La Liga | 2021-22 | 380 | 380 | B365 + Pinnacle closing |
| La Liga | 2022-23 | 380 | 380 | B365 + Pinnacle closing |
| La Liga | 2023-24 | 380 | 380 | B365 + Pinnacle closing |
| La Liga | 2024-25 | 380 | 380 | FBRef + Odds API |
| La Liga | 2025-26 | 380 | ~90 live | The Odds API (live) |
| FIFA WC 2026 | 2026 | 104 | 0 (not started) | The Odds API (live) |

### Daily automation (`.github/workflows/fetch_odds.yml`)

```
09:00 UTC daily:
  1. sync_match_dates.py --upload --scores
       La Liga: sync dates + write scores for FINISHED matches
       WC:      sync dates + scores + recalculate group standings

  2. fetch_odds_api.py --auto --upload
       detect_active_sport():
         WC match within ±7 days? → fetch soccer_fifa_world_cup
         otherwise               → fetch soccer_spain_la_liga
       Scores: only if match played in last 3 days (saves API quota)
       Odds:   only if next fixture within 7 days  (saves API quota)
```

---

## ML Prediction Model

**Goal**: find +EV bets — where the model's probability exceeds the bookmaker's implied probability.

```
EV = model_probability × decimal_odds − 1
Bet when EV > 0.05 (5% edge)
```

### Development phases

| Phase | Script | Description | Status |
|-------|--------|-------------|--------|
| 0 — Data | `import_historical_laliga.py` | 5 seasons · 1,900 matches · B365 + Pinnacle closing odds | ✅ Done |
| 1 — Features | `ml/build_features.py` | Rolling form · Elo ratings · H2H · season position | 🚧 Active |
| 2 — Train | `ml/train_model.py` | Logistic regression → Random Forest → XGBoost | ⏳ Next |
| 3 — Backtest | `ml/backtest.py` | Flat stake + Kelly ROI simulation vs historical odds | ⏳ Planned |
| 4 — Integrate | `ml/predict.py` | Write predictions to Supabase; show in app | ⏳ Planned |

### Features computed per match (before kick-off)

- **Rolling form** — last 5 + last 10 games: goals scored, conceded, wins, pts per game
- **Venue-split form** — last 5 home games (home team) / last 5 away games (away team)
- **Elo ratings** — updated after every result, K=20, home advantage built in
- **Head-to-head** — last 5 meetings: win/draw/loss counts, avg goals
- **Season position** — pts per game accumulated to date
- **Bookmaker odds** — B365 + Pinnacle closing odds for calibration + EV

### Target markets

| Market | Target variable | Approach |
|--------|----------------|----------|
| 1X2 | `result` (H/D/A) | 3-class logistic regression |
| BTTS | `btts` (0/1) | Binary classifier |
| Over 2.5 | `over25` (0/1) | Binary classifier |
| Asian handicap | — | Phase 5+ (needs more data) |

---

## Environment Variables

```bash
# Frontend (Vite)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Python scripts + Edge Functions
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Data APIs
ODDS_API_KEY=            # The Odds API
FOOTBALL_DATA_API_KEY=   # football-data.org (optional — needed for WC + date sync)
GEMINI_API_KEY=          # Google Gemini AI
```

**GitHub Secrets** (required for Actions): `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ODDS_API_KEY`, `FOOTBALL_DATA_API_KEY`

---

## Local Setup

```bash
# Clone and install
git clone https://github.com/EstiloFutbol/AnalisisFutbol.git
cd AnalisisFutbol_B44
npm install

# Start dev server
npm run dev

# Python scripts (install deps first)
pip install requests supabase python-dotenv

# Preview historical import
python .github/import_historical_laliga.py --preview

# Run ML feature engineering
python ml/build_features.py
```

---

## Migrations

SQL migrations live in `database/migration_v{N}_*.sql` (gitignored). Run each one manually in **Supabase SQL Editor** in order. Current highest: **v17**.

---

Developed with ❤️ for football analytics. Apuesta con responsabilidad.
