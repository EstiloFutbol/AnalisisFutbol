# AnalisisFutbol B44

AnalisisFutbol is a React football analytics application for European club competitions and the five major domestic leagues: Spain, England, France, Germany and Italy. It provides market analytics, player data, fixtures and standings. Betting-related information is analytical only and is never a guarantee of results.

## Current product state

- The landing page focuses on European football. Champions League, Europa League and Conference League entry points are present even when their next season has no imported data yet.
- The dashboard can analyse one or several competitions and seasons at once. It separates **Clubes** from **Selecciones** and keeps selections in the URL.
- Upcoming fixtures are deliberately included in the dashboard data flow so future seasons can show fixtures, teams, markets and player rows with zero statistics.
- La Liga 2026-2027 fixtures are imported. The first manually imported squad is Athletic Club; its roster records include player photos.
- European-competition data for the new season still requires a suitable provider or an authorised import source.

Detailed local handoff documentation is in `docs/`. It is intentionally not committed because it may describe local operational details. Start with:

- `docs/NEW_CONVERSATION_PROMPT.md` for a current handoff.
- `docs/ARCHITECTURE.md` for routes, query parameters and data flow.
- `docs/DATA_PIPELINE.md` for fixture and roster imports.
- `docs/DATABASE.md` for schema and migrations.

## Stack

React 18, Vite, JavaScript, Tailwind CSS, shadcn/ui, TanStack Query v5, Recharts, Supabase and Cloudflare Pages.

## Local development

```powershell
npm install
cmd /c "npm run dev"
cmd /c "npm run build"
```

On this Windows machine, use `http://127.0.0.1:5173/`, not `localhost`; see `docs/LOCAL_DEV_PROCEDURE.md` for the reason and the preview workflow.

## Security

Keep credentials only in `.env.local`. Browser code may use the Supabase anon key; service-role credentials are for trusted local tools and server-side work only.
