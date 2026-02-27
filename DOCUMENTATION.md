# AnalisisFutbol — Technical Documentation

## Architecture

**Single Page Application** built with React 18 + Vite, backed by Supabase (PostgreSQL).

- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
- **Data Fetching**: TanStack React Query v5
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Hosting**: Cloudflare Pages

---

## Project Structure

```
/
├── tools/              Python data import scripts
├── database/           SQL migration files
├── data/               Raw CSV datasets (fixtures, legacy data)
├── src/
│   ├── App.jsx         Main React Component
│   ├── main.jsx        React Entry Point
│   ├── index.css       Global Styles
│   ├── pages/          Dashboard, Matches, MatchDetail, Statistics, SelfService, Admin, DataImport
│   ├── components/
│   │   ├── admin/      AdminMatches, AdminTeams, AdminLeagues, AdminReferees, AdminCoaches
│   │   ├── charts/     GoalTimeChart, CornerHalfChart, StatDistributionChart, OddsCorrelationChart
│   │   ├── matches/    MatchCard, MatchEditForm, StatBar, GoalTimeline
│   │   └── BettingCalculator.jsx
│   ├── hooks/          useMatches.js, usePlayerStats.js
│   ├── lib/            supabase.js, csvParser.js, query-client.js, utils.js
│   ├── context/        AuthContext.jsx
│   └── match_files/    FBRef Excel files — processed/ subfolder for uploaded files
└── package.json        Project dependencies

```

---

## Database

Built on **Supabase PostgreSQL**. Key tables:

| Table | Description |
|---|---|
| `leagues` | League definitions; `is_default=true` sets the default UI league |
| `teams` | Club names, logos (Supabase Storage), stadium |
| `matches` | ~50 columns — the heart of the app. `home_goals IS NULL` = unplayed |
| `referees` | Referee names |
| `coaches` | Coach names |
| `match_player_stats` | One row per player per match (goals, assists, cards, GK stats) |

**Corner data**: Only `home_corners`, `away_corners`, `total_corners`. Half-time split was removed in migration v6.

**Unplayed matches**: All analytics hooks use `{ playedOnly: true }` to exclude fixtures from stats.

**RLS Policy**: Public read. Authenticated write (admin UI). Service role key used only by Python tools.

---

## Data Import

Match data is imported using Python scripts in `tools/`. All scripts are run from the project root.

### Add match stats from FBRef
1. Download FBRef match Excel → place in `src/match_files/`
2. `python tools/limpieza_datos.py --preview`
3. `python tools/limpieza_datos.py --upload`
4. Processed files auto-move to `src/match_files/processed/`

### Import a new season's fixtures
```bash
python tools/import_fixtures_2526.py
```

### Update scores only
```bash
python tools/update_scores_2526.py
```

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Public read access (frontend) |
| `VITE_SUPABASE_SERVICE_ROLE_KEY` | Full write access (Python tools only — never expose to frontend) |

---

## Deployment

Deployed on **Cloudflare Pages** with continuous deployment from GitHub.

- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Cloudflare environment variables
- Build command: `npm run build`
- Output directory: `dist`

---

## Current Season

La Liga **2025-2026**, `league_id = 2`. Jornadas 1–25 uploaded with full stats and player data.
