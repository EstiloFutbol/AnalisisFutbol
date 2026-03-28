-- =============================================================
-- Migration v7: User Profiles + Security Hardening
-- Run this in the Supabase SQL Editor
-- =============================================================

-- ── 1. Create user_profiles table ────────────────────────────
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    is_admin BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ── 2. Enable RLS on user_profiles ───────────────────────────
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
CREATE POLICY "Users can read own profile" ON user_profiles
    FOR SELECT TO authenticated
    USING (auth.uid() = id);

-- Users can update their own profile BUT cannot change is_admin
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id
        -- Prevent escalating or demoting is_admin (must stay the same value)
        AND is_admin = (SELECT upp.is_admin FROM user_profiles upp WHERE upp.id = auth.uid())
    );

-- Users cannot insert directly (only the trigger does this)
-- Admins cannot be created by users, only by you via the Supabase dashboard

-- ── 3. Auto-create profile on signup (trigger) ────────────────
CREATE OR REPLACE FUNCTION public.create_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER  -- runs with elevated privileges to bypass RLS on insert
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, display_name, is_admin)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'display_name',
            split_part(NEW.email, '@', 1)
        ),
        false  -- all new users are non-admin by default
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.create_user_profile();

-- ── 4. Tighten write access on matches and teams ──────────────
-- Previously any authenticated user could write. Now only admins.

-- Drop old permissive write policies
DROP POLICY IF EXISTS "Allow authenticated insert on teams" ON teams;
DROP POLICY IF EXISTS "Allow authenticated update on teams" ON teams;
DROP POLICY IF EXISTS "Allow authenticated insert on matches" ON matches;
DROP POLICY IF EXISTS "Allow authenticated update on matches" ON matches;

-- Also drop from match_player_stats if they exist
DROP POLICY IF EXISTS "Allow authenticated insert on match_player_stats" ON match_player_stats;
DROP POLICY IF EXISTS "Allow authenticated update on match_player_stats" ON match_player_stats;

-- New admin-only write policies (using subquery check against user_profiles)
CREATE POLICY "Allow admin insert on teams" ON teams
    FOR INSERT TO authenticated
    WITH CHECK (
        (SELECT is_admin FROM user_profiles WHERE id = auth.uid()) = true
    );

CREATE POLICY "Allow admin update on teams" ON teams
    FOR UPDATE TO authenticated
    USING (
        (SELECT is_admin FROM user_profiles WHERE id = auth.uid()) = true
    );

CREATE POLICY "Allow admin delete on teams" ON teams
    FOR DELETE TO authenticated
    USING (
        (SELECT is_admin FROM user_profiles WHERE id = auth.uid()) = true
    );

CREATE POLICY "Allow admin insert on matches" ON matches
    FOR INSERT TO authenticated
    WITH CHECK (
        (SELECT is_admin FROM user_profiles WHERE id = auth.uid()) = true
    );

CREATE POLICY "Allow admin update on matches" ON matches
    FOR UPDATE TO authenticated
    USING (
        (SELECT is_admin FROM user_profiles WHERE id = auth.uid()) = true
    );

CREATE POLICY "Allow admin delete on matches" ON matches
    FOR DELETE TO authenticated
    USING (
        (SELECT is_admin FROM user_profiles WHERE id = auth.uid()) = true
    );

-- match_player_stats write policies (admin only)
CREATE POLICY "Allow admin insert on match_player_stats" ON match_player_stats
    FOR INSERT TO authenticated
    WITH CHECK (
        (SELECT is_admin FROM user_profiles WHERE id = auth.uid()) = true
    );

CREATE POLICY "Allow admin update on match_player_stats" ON match_player_stats
    FOR UPDATE TO authenticated
    USING (
        (SELECT is_admin FROM user_profiles WHERE id = auth.uid()) = true
    );

-- ── 5. Create your admin profile ─────────────────────────────
-- After running this script, run the following query separately
-- to set YOUR account as admin (replace with your actual email):
--
-- UPDATE user_profiles
-- SET is_admin = true
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL_HERE');
--
-- Or if you haven't signed up through the app yet, go to:
-- Supabase Dashboard → Authentication → Users → Add user
-- Then run the UPDATE above.

-- =============================================================
-- Done! Now go to: Authentication → Settings in Supabase
-- and enable "Enable email confirmations"
-- =============================================================
