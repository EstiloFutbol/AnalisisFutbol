-- Migration to associate stadiums with teams and create referees table

-- 1. Add stadium to teams table
ALTER TABLE teams ADD COLUMN IF NOT EXISTS stadium TEXT;

-- 2. Create referees table
CREATE TABLE IF NOT EXISTS referees (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Add referee_id to matches table
ALTER TABLE matches ADD COLUMN IF NOT EXISTS referee_id INTEGER REFERENCES referees(id);

-- 4. Enable RLS for referees
ALTER TABLE referees ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on referees" ON referees;
CREATE POLICY "Allow public read access on referees" ON referees FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow authenticated insert on referees" ON referees;
CREATE POLICY "Allow authenticated insert on referees" ON referees FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated update on referees" ON referees;
CREATE POLICY "Allow authenticated update on referees" ON referees FOR UPDATE TO authenticated USING (true);

-- 5. Build initial referees from existing match data
INSERT INTO referees (name)
SELECT DISTINCT referee FROM matches WHERE referee IS NOT NULL AND referee != ''
ON CONFLICT (name) DO NOTHING;

-- 6. Update matches with referee_id
UPDATE matches m
SET referee_id = r.id
FROM referees r
WHERE m.referee = r.name;

-- 7. Update teams with stadium from their home matches (best guess)
WITH team_stadiums AS (
    SELECT home_team_id, stadium, 
           ROW_NUMBER() OVER(PARTITION BY home_team_id ORDER BY COUNT(*) DESC) as rank
    FROM matches
    WHERE stadium IS NOT NULL AND stadium != ''
    GROUP BY home_team_id, stadium
)
UPDATE teams t
SET stadium = ts.stadium
FROM team_stadiums ts
WHERE t.id = ts.home_team_id AND ts.rank = 1;

-- 8. Note: You can eventually drop the 'referee' column from 'matches' if all data is moved,
-- but keeping it for now is safer.
