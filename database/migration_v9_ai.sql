-- =============================================================
-- Migration v9: AI Betting Bot
-- Run this in the Supabase SQL Editor
-- =============================================================

-- ── 1. AI Bets table ──────────────────────────────────────────
-- Tracks the AI bot's betting history. Separate from the user
-- bets table to avoid needing a real auth.users entry for the bot.
CREATE TABLE IF NOT EXISTS ai_bets (
    id               SERIAL PRIMARY KEY,
    match_id         INTEGER NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    bet_type         TEXT NOT NULL CHECK (bet_type IN ('home', 'draw', 'away')),
    odds             NUMERIC(6,2) NOT NULL,
    stake            NUMERIC(10,2) NOT NULL,        -- 150/100/50 based on confidence
    potential_payout NUMERIC(10,2) NOT NULL,
    reasoning        TEXT,                           -- AI explanation in Spanish
    key_factors      TEXT[],                         -- List of decisive factors
    confidence       TEXT NOT NULL DEFAULT 'media'
                     CHECK (confidence IN ('alta', 'media', 'baja')),
    status           TEXT NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending', 'won', 'lost', 'void')),
    created_at       TIMESTAMPTZ DEFAULT now(),
    settled_at       TIMESTAMPTZ,
    UNIQUE (match_id)       -- one AI bet per match
);

CREATE INDEX IF NOT EXISTS idx_ai_bets_match   ON ai_bets(match_id);
CREATE INDEX IF NOT EXISTS idx_ai_bets_status  ON ai_bets(status);

-- ── 2. RLS: public read, no direct writes ────────────────────
ALTER TABLE ai_bets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ai_bets_public_read" ON ai_bets;
CREATE POLICY "ai_bets_public_read" ON ai_bets
    FOR SELECT USING (true);

-- ── 3. Auto-settlement trigger ────────────────────────────────
-- Fires when home_goals / away_goals are set on a match.
-- Marks the AI bet as won or lost automatically.
CREATE OR REPLACE FUNCTION settle_ai_bets()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_result TEXT;
BEGIN
    -- Only when both goals become non-null
    IF NEW.home_goals IS NULL OR NEW.away_goals IS NULL THEN
        RETURN NEW;
    END IF;
    -- Only when goals actually changed
    IF OLD.home_goals IS NOT DISTINCT FROM NEW.home_goals
       AND OLD.away_goals IS NOT DISTINCT FROM NEW.away_goals THEN
        RETURN NEW;
    END IF;

    IF    NEW.home_goals > NEW.away_goals THEN v_result := 'home';
    ELSIF NEW.away_goals > NEW.home_goals THEN v_result := 'away';
    ELSE                                        v_result := 'draw';
    END IF;

    UPDATE ai_bets
       SET status     = CASE WHEN bet_type = v_result THEN 'won' ELSE 'lost' END,
           settled_at = now()
     WHERE match_id = NEW.id
       AND status    = 'pending';

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_match_result_for_ai_bets ON matches;
CREATE TRIGGER on_match_result_for_ai_bets
    AFTER UPDATE ON matches
    FOR EACH ROW
    EXECUTE FUNCTION settle_ai_bets();

-- =============================================================
-- Done! The AI bot table is ready.
-- Next step: deploy the Supabase Edge Function (see walkthrough).
-- =============================================================
