-- =============================================================
-- Migration v5: New match columns + player stats table
-- Run this in Supabase SQL Editor BEFORE running limpieza_datos.py --upload
-- =============================================================

-- ── 1. Add missing columns to matches table ──────────────────────────────────

-- Total corners (simpler than 1h/2h split for FBref data)
ALTER TABLE matches ADD COLUMN IF NOT EXISTS home_corners INTEGER;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS away_corners INTEGER;

-- Saves
ALTER TABLE matches ADD COLUMN IF NOT EXISTS home_saves INTEGER;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS away_saves INTEGER;

-- Crosses
ALTER TABLE matches ADD COLUMN IF NOT EXISTS home_crosses INTEGER;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS away_crosses INTEGER;

-- Interceptions
ALTER TABLE matches ADD COLUMN IF NOT EXISTS home_interceptions INTEGER;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS away_interceptions INTEGER;

-- Yellow cards (distinct from home_cards/away_cards totals from old CSV)
ALTER TABLE matches ADD COLUMN IF NOT EXISTS home_yellow_cards INTEGER;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS away_yellow_cards INTEGER;

-- ── 2. Create match_player_stats table ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS match_player_stats (
    id           SERIAL PRIMARY KEY,
    match_id     INTEGER NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    team_id      INTEGER NOT NULL REFERENCES teams(id),
    is_home      BOOLEAN NOT NULL,

    -- Player identity
    player_name  TEXT NOT NULL,
    shirt_number INTEGER,
    position     TEXT,
    is_starter   BOOLEAN NOT NULL DEFAULT true,
    minutes      INTEGER,

    -- Attacking
    goals             INTEGER NOT NULL DEFAULT 0,
    assists           INTEGER NOT NULL DEFAULT 0,
    shots             INTEGER NOT NULL DEFAULT 0,
    shots_on_target   INTEGER NOT NULL DEFAULT 0,
    pk_scored         INTEGER NOT NULL DEFAULT 0,
    pk_attempted      INTEGER NOT NULL DEFAULT 0,
    own_goals         INTEGER NOT NULL DEFAULT 0,

    -- Discipline
    yellow_cards      INTEGER NOT NULL DEFAULT 0,
    red_cards         INTEGER NOT NULL DEFAULT 0,
    fouls_committed   INTEGER NOT NULL DEFAULT 0,
    fouls_drawn       INTEGER NOT NULL DEFAULT 0,

    -- Defensive / Other
    tackles_won       INTEGER NOT NULL DEFAULT 0,
    interceptions     INTEGER NOT NULL DEFAULT 0,
    offsides          INTEGER NOT NULL DEFAULT 0,
    crosses           INTEGER NOT NULL DEFAULT 0,

    -- Goalkeeper-specific (NULL for outfield players)
    gk_shots_faced    INTEGER,
    gk_goals_against  INTEGER,
    gk_saves          INTEGER,
    gk_save_pct       NUMERIC(5,2),

    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_player_stats_match  ON match_player_stats(match_id);
CREATE INDEX IF NOT EXISTS idx_player_stats_team   ON match_player_stats(team_id);
CREATE INDEX IF NOT EXISTS idx_player_stats_player ON match_player_stats(player_name);

-- ── 3. RLS for match_player_stats ────────────────────────────────────────────

ALTER TABLE match_player_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Player stats readable by all"       ON match_player_stats;
DROP POLICY IF EXISTS "Player stats insertable by service" ON match_player_stats;
DROP POLICY IF EXISTS "Player stats updatable by service"  ON match_player_stats;
DROP POLICY IF EXISTS "Player stats deletable by service"  ON match_player_stats;

CREATE POLICY "Player stats readable by all"
    ON match_player_stats FOR SELECT USING (true);

CREATE POLICY "Player stats insertable by service"
    ON match_player_stats FOR INSERT WITH CHECK (true);

CREATE POLICY "Player stats updatable by service"
    ON match_player_stats FOR UPDATE USING (true);

CREATE POLICY "Player stats deletable by service"
    ON match_player_stats FOR DELETE USING (true);
