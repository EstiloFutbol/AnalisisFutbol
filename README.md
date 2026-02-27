# ⚽ AnalisisFutbol

A premium football data analytics platform for La Liga, built for fans and bettors who want a statistical edge.

## Features

- **Betting Dashboard** — betting insights: Over/Under, BTTS, corner and card rates with historical win rates
- **Match Reports** — full stats per match: xG, possession, shots, corners, cards, goal timelines, and player lineups
- **Statistics** — team standings, xG leaderboards, goals and possession charts
- **Self-Service Tool** — filter by team / referee / coach / league and run the built-in Betting Calculator
- **Admin Panel** — create and edit matches, teams, leagues, referees and coaches
- **Data Import** — upload match data via CSV or FBRef Excel files

## Quick Start

### Prerequisites
- Node.js v18+
- A [Supabase](https://supabase.com) project

### Installation

```bash
git clone https://github.com/EstiloFutbol/AnalisisFutbol.git
cd AnalisisFutbol
npm install
```

### Environment Variables

Create `.env.local`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Run locally
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

## Tech Stack

| | |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Data | TanStack React Query + Supabase (PostgreSQL) |
| Charts | Recharts + Framer Motion |
| Hosting | Cloudflare Pages |

---
Developed with ❤️ for football analytics.
