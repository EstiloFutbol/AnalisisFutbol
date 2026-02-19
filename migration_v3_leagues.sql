-- =============================================================
-- Migration V3: Multi-League System
-- Run this in the Supabase SQL Editor
-- =============================================================

-- 1. Create leagues table
CREATE TABLE IF NOT EXISTS leagues (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,                    -- e.g. "La Liga"
    country TEXT,                          -- e.g. "España"
    season TEXT NOT NULL,                  -- e.g. "2025-2026"
    logo_url TEXT,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(name, season)                   -- Can't have duplicate league+season combos
);

-- 2. Add league_id to matches
ALTER TABLE matches ADD COLUMN IF NOT EXISTS league_id INTEGER REFERENCES leagues(id);

-- 3. Enable RLS for leagues
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on leagues" ON leagues;
CREATE POLICY "Allow public read access on leagues" ON leagues FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert on leagues" ON leagues;
CREATE POLICY "Allow authenticated insert on leagues" ON leagues FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update on leagues" ON leagues;
CREATE POLICY "Allow authenticated update on leagues" ON leagues FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated delete on leagues" ON leagues;
CREATE POLICY "Allow authenticated delete on leagues" ON leagues FOR DELETE TO authenticated USING (true);

-- 4. Seed initial leagues
INSERT INTO leagues (name, country, season, is_default) VALUES
    ('La Liga', 'España', '2024-2025', false),
    ('La Liga', 'España', '2025-2026', true)
ON CONFLICT (name, season) DO NOTHING;

-- 5. Link existing matches to La Liga 2024-2025
UPDATE matches
SET league_id = (SELECT id FROM leagues WHERE name = 'La Liga' AND season = '2024-2025')
WHERE season = '2024-2025' AND league_id IS NULL;

-- 6. Create index for league_id lookups
CREATE INDEX IF NOT EXISTS idx_matches_league_id ON matches(league_id);
