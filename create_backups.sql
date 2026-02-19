-- =============================================================
-- SQL Backup Script for AnálisisFútbol
-- Creates read-only snapshots of the main tables
-- =============================================================

-- 1. Create backup tables (copies data and structure, but not constraints/indexes)
-- We use DROP TABLE first to allow re-running the backup script

-- BACKUP: TEAMS
DROP TABLE IF EXISTS teams_backup;
CREATE TABLE teams_backup AS SELECT * FROM teams;

-- BACKUP: MATCHES
DROP TABLE IF EXISTS matches_backup;
CREATE TABLE matches_backup AS SELECT * FROM matches;

-- BACKUP: REFEREES
DROP TABLE IF EXISTS referees_backup;
CREATE TABLE referees_backup AS SELECT * FROM referees;

-- 2. Enable Row Level Security (RLS) to protect them
ALTER TABLE teams_backup ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches_backup ENABLE ROW LEVEL SECURITY;
ALTER TABLE referees_backup ENABLE ROW LEVEL SECURITY;

-- 3. Define Policies
-- We ONLY allow SELECT access. No INSERT, UPDATE, or DELETE policies will be created,
-- which means these operations will be denied by default for all non-admin users.

-- Teams Backup Policies
DROP POLICY IF EXISTS "Allow public read access on teams_backup" ON teams_backup;
CREATE POLICY "Allow public read access on teams_backup" ON teams_backup FOR SELECT USING (true);

-- Matches Backup Policies
DROP POLICY IF EXISTS "Allow public read access on matches_backup" ON matches_backup;
CREATE POLICY "Allow public read access on matches_backup" ON matches_backup FOR SELECT USING (true);

-- Referees Backup Policies
DROP POLICY IF EXISTS "Allow public read access on referees_backup" ON referees_backup;
CREATE POLICY "Allow public read access on referees_backup" ON referees_backup FOR SELECT USING (true);

-- 4. Add a comment to the tables to identify them
COMMENT ON TABLE teams_backup IS 'Read-only snapshot of the teams table. Changes via web are strictly prohibited.';
COMMENT ON TABLE matches_backup IS 'Read-only snapshot of the matches table. Changes via web are strictly prohibited.';
COMMENT ON TABLE referees_backup IS 'Read-only snapshot of the referees table. Changes via web are strictly prohibited.';
