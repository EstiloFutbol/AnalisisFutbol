-- =============================================================
-- Migration v10: AI chat rate limiting
-- Run this in the Supabase SQL Editor
-- =============================================================

-- ── 1. Usage tracking table ───────────────────────────────────
-- Tracks daily chat message count per user (by user ID or IP).
-- Written only from the Edge Function via service role.
CREATE TABLE IF NOT EXISTS ai_chat_usage (
    id          SERIAL PRIMARY KEY,
    user_key    TEXT    NOT NULL,       -- "user:<uuid>" or "ip:<ip>"
    usage_date  DATE    NOT NULL DEFAULT CURRENT_DATE,
    msg_count   INTEGER NOT NULL DEFAULT 0,
    UNIQUE (user_key, usage_date)
);

CREATE INDEX IF NOT EXISTS idx_ai_chat_usage_key_date
    ON ai_chat_usage(user_key, usage_date);

-- No public access — service role only (Edge Function)
ALTER TABLE ai_chat_usage ENABLE ROW LEVEL SECURITY;

-- ── 2. Atomic increment RPC ───────────────────────────────────
-- Returns the NEW count after increment. Called from the Edge Function.
-- If count > DAILY_LIMIT the Edge Function rejects the request.
CREATE OR REPLACE FUNCTION increment_chat_usage(
    p_user_key  TEXT,
    p_date      DATE
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_count INTEGER;
BEGIN
    INSERT INTO ai_chat_usage (user_key, usage_date, msg_count)
    VALUES (p_user_key, p_date, 1)
    ON CONFLICT (user_key, usage_date)
    DO UPDATE SET msg_count = ai_chat_usage.msg_count + 1
    RETURNING msg_count INTO v_count;

    RETURN v_count;
END;
$$;

-- Grant to service role (called from Edge Function with service role key)
GRANT EXECUTE ON FUNCTION increment_chat_usage(TEXT, DATE) TO service_role;

-- =============================================================
-- Done! Daily limit is enforced in the Edge Function code:
--   DAILY_CHAT_LIMIT = 20 messages per user per day
-- =============================================================
