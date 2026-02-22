-- Migration v4: Create coaches table
-- Run this in Supabase SQL Editor

-- 1. Create coaches table
CREATE TABLE IF NOT EXISTS coaches (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
CREATE POLICY "Coaches visible to all" ON coaches FOR SELECT USING (true);
CREATE POLICY "Coaches insertable by authenticated" ON coaches FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Coaches deletable by authenticated" ON coaches FOR DELETE USING (auth.role() = 'authenticated');

-- 4. Seed coaches from existing match data
INSERT INTO coaches (name)
SELECT DISTINCT home_coach FROM matches WHERE home_coach IS NOT NULL AND home_coach != ''
UNION
SELECT DISTINCT away_coach FROM matches WHERE away_coach IS NOT NULL AND away_coach != ''
ON CONFLICT (name) DO NOTHING;

-- 5. Add coach_id foreign keys to matches (optional, for future use)
-- ALTER TABLE matches ADD COLUMN home_coach_id INTEGER REFERENCES coaches(id);
-- ALTER TABLE matches ADD COLUMN away_coach_id INTEGER REFERENCES coaches(id);
