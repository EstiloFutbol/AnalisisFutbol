-- =============================================================
-- Supabase SQL Migration for AnálisisFútbol
-- Run this in the Supabase SQL Editor (supabase.com → your project → SQL Editor)
-- =============================================================

-- 1. Teams table
CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    short_name TEXT,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Matches table (based on af_th_partidos.csv structure)
CREATE TABLE IF NOT EXISTS matches (
    id SERIAL PRIMARY KEY,
    season TEXT NOT NULL DEFAULT '2024-2025',
    matchday INTEGER,
    day_of_week TEXT,
    match_date DATE,
    kick_off_time TEXT,
    
    -- Teams (foreign keys)
    home_team_id INTEGER REFERENCES teams(id),
    away_team_id INTEGER REFERENCES teams(id),
    
    -- Result
    home_goals INTEGER DEFAULT 0,
    away_goals INTEGER DEFAULT 0,
    btts BOOLEAN DEFAULT false,
    
    -- Expected Goals
    home_xg NUMERIC(5,2),
    away_xg NUMERIC(5,2),
    
    -- Betting Odds
    home_odds NUMERIC(6,2),
    draw_odds NUMERIC(6,2),
    away_odds NUMERIC(6,2),
    
    -- Match info
    attendance INTEGER,
    stadium TEXT,
    referee TEXT,
    home_coach TEXT,
    away_coach TEXT,
    
    -- Possession
    home_possession INTEGER,
    away_possession INTEGER,
    
    -- Shots
    home_shots INTEGER,
    away_shots INTEGER,
    home_shots_on_target INTEGER,
    away_shots_on_target INTEGER,
    home_shots_off_target INTEGER,
    away_shots_off_target INTEGER,
    
    -- Cards
    home_cards INTEGER,
    away_cards INTEGER,
    home_red_cards INTEGER DEFAULT 0,
    away_red_cards INTEGER DEFAULT 0,
    first_red_card_minute TEXT,
    
    -- Corners
    home_corners_1h INTEGER,
    away_corners_1h INTEGER,
    home_corners_2h INTEGER,
    away_corners_2h INTEGER,
    total_corners INTEGER,
    
    -- Fouls & Offsides
    home_fouls INTEGER,
    away_fouls INTEGER,
    home_offsides INTEGER,
    away_offsides INTEGER,
    
    -- Formations
    home_formation TEXT,
    away_formation TEXT,
    
    -- Goal minutes (stored as JSON arrays)
    home_goal_minutes JSONB DEFAULT '[]'::jsonb,
    away_goal_minutes JSONB DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_matches_season ON matches(season);
CREATE INDEX IF NOT EXISTS idx_matches_matchday ON matches(matchday);
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(match_date);
CREATE INDEX IF NOT EXISTS idx_matches_home_team ON matches(home_team_id);
CREATE INDEX IF NOT EXISTS idx_matches_away_team ON matches(away_team_id);

-- 4. Row Level Security (RLS)
-- Enable RLS but allow public read access (anon key can read, only authenticated can write)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to allow re-running the script
DROP POLICY IF EXISTS "Allow public read access on teams" ON teams;
DROP POLICY IF EXISTS "Allow authenticated insert on teams" ON teams;
DROP POLICY IF EXISTS "Allow authenticated update on teams" ON teams;

DROP POLICY IF EXISTS "Allow public read access on matches" ON matches;
DROP POLICY IF EXISTS "Allow authenticated insert on matches" ON matches;
DROP POLICY IF EXISTS "Allow authenticated update on matches" ON matches;

-- Public read access for both tables
CREATE POLICY "Allow public read access on teams" ON teams
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access on matches" ON matches
    FOR SELECT USING (true);

-- For now, also allow insert/update/delete for authenticated users (you via Supabase dashboard)
-- You can tighten these policies later
CREATE POLICY "Allow authenticated insert on teams" ON teams
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update on teams" ON teams
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert on matches" ON matches
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update on matches" ON matches
    FOR UPDATE TO authenticated USING (true);

-- 5. Auto-update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_matches_updated_at ON matches;
CREATE TRIGGER update_matches_updated_at
    BEFORE UPDATE ON matches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================================
-- 6. Insert La Liga teams for 2024-2025 season
-- =============================================================
INSERT INTO teams (id, name, short_name) VALUES
    (1, 'Athletic Club', 'ATH'),
    (2, 'Getafe', 'GET'),
    (3, 'Real Betis', 'BET'),
    (4, 'Girona', 'GIR'),
    (5, 'Celta Vigo', 'CEL'),
    (6, 'Alavés', 'ALA'),
    (7, 'Las Palmas', 'LPA'),
    (8, 'Sevilla', 'SEV'),
    (9, 'Osasuna', 'OSA'),
    (10, 'Leganés', 'LEG'),
    (11, 'Valencia', 'VAL'),
    (12, 'Barcelona', 'BAR'),
    (13, 'Real Sociedad', 'RSO'),
    (14, 'Rayo Vallecano', 'RAY'),
    (15, 'Mallorca', 'MLL'),
    (16, 'Real Madrid', 'RMA'),
    (17, 'Valladolid', 'VLL'),
    (18, 'Espanyol', 'ESP'),
    (19, 'Villarreal', 'VIL'),
    (20, 'Atlético Madrid', 'ATM')
ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- 7. Insert sample matches (first 5 from your CSV to test)
-- =============================================================
INSERT INTO matches (id, season, matchday, day_of_week, match_date, kick_off_time, home_team_id, away_team_id, home_goals, away_goals, btts, home_xg, away_xg, home_odds, draw_odds, away_odds, attendance, stadium, referee, home_coach, away_coach, home_possession, away_possession, home_shots, away_shots, home_shots_on_target, away_shots_on_target, home_shots_off_target, away_shots_off_target, home_cards, away_cards, home_corners_1h, away_corners_1h, home_corners_2h, away_corners_2h, total_corners, home_fouls, away_fouls, home_offsides, away_offsides, home_formation, away_formation, home_goal_minutes, away_goal_minutes) VALUES
(1, '2024-2025', 1, 'jueves', '2024-08-15', '19:00', 1, 2, 1, 1, true, 0.83, 0.73, 1.41, 4.06, 6.85, 47845, 'San Mamés', 'Alejandro Muñoz', 'Ernesto Valverde', 'Pepe Bordalás', 69, 31, 5, 7, 4, 2, 1, 5, 4, 1, 0, 1, 5, 5, 11, 15, 12, 2, 6, '4-2-3-1', '4-1-4-1', '[27]', '[64]'),
(2, '2024-2025', 1, 'jueves', '2024-08-15', '21:30', 3, 4, 1, 1, true, 1.46, 1.13, 2.73, 3.12, 2.42, 54084, 'Estadio Benito Villamarín', 'Miguel Ángel Ortiz Arias', 'Manuel Pellegrini', 'Michel', 39, 61, 19, 13, 4, 2, 15, 11, 2, 0, 3, 1, 1, 3, 8, 11, 7, 1, 3, '4-2-3-1', '4-4-3', '[6]', '[72]'),
(3, '2024-2025', 1, 'viernes', '2024-08-16', '19:00', 5, 6, 2, 1, true, 0.94, 0.85, 1.92, 3.44, 4.12, 22477, 'Estadio Abanca Balaídos', 'Alejandro Quintero', 'Claudio Giráldez', 'Luis García', 64, 36, 6, 10, 4, 2, 2, 8, 2, 2, 1, 1, 2, 2, 6, 8, 23, 4, 3, '4-4-2', '4-2-3-1', '[66, 84]', '[17]'),
(4, '2024-2025', 1, 'viernes', '2024-08-16', '21:30', 7, 8, 2, 2, true, 1.31, 1.57, 2.85, 3.14, 2.61, 24843, 'Estadio de Gran Canaria', 'Francisco Hernández', 'Luis Miguel Carrión', 'García Pimienta', 48, 52, 11, 15, 5, 5, 6, 10, 2, 2, 3, 3, 3, 0, 9, 14, 15, 1, 2, '4-2-3-1', '4-5-1', '[42, 71]', '[25, 61]'),
(5, '2024-2025', 1, 'sábado', '2024-08-17', '19:00', 9, 10, 1, 1, true, 1.70, 0.81, 1.65, 3.90, 5.25, 19561, 'Estadio El Sadar', 'Juan Pulido', 'Vicente Moreno', 'Borja Jiménez', 61, 39, 12, 6, 6, 4, 6, 2, 3, 2, 0, 3, 6, 1, 10, 14, 12, 1, 2, '4-3-3', '4-2-3-1', '[79]', '[22]')
ON CONFLICT (id) DO NOTHING;
