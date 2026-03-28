-- =============================================================
-- Migration v8: Betting Game
-- Run this in the Supabase SQL Editor
-- =============================================================

-- ── 1. Add balance to user_profiles ──────────────────────────
ALTER TABLE user_profiles
    ADD COLUMN IF NOT EXISTS balance NUMERIC(12,2) NOT NULL DEFAULT 1000.00;

-- ── 2. Create bets table ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS bets (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    match_id         INTEGER NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    -- 1X2 outcome
    bet_type         TEXT NOT NULL CHECK (bet_type IN ('home', 'draw', 'away')),
    -- Snapshot of odds at the time the bet was placed
    odds             NUMERIC(6,2) NOT NULL CHECK (odds > 1),
    stake            NUMERIC(10,2) NOT NULL CHECK (stake > 0),
    potential_payout NUMERIC(10,2) NOT NULL CHECK (potential_payout > 0),
    -- 'pending' → 'won' | 'lost' | 'void'
    status           TEXT NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending', 'won', 'lost', 'void')),
    created_at       TIMESTAMPTZ DEFAULT now(),
    settled_at       TIMESTAMPTZ,
    -- One bet per user per match (can't replace stake mid-game)
    UNIQUE (user_id, match_id)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_bets_user_id   ON bets(user_id);
CREATE INDEX IF NOT EXISTS idx_bets_match_id  ON bets(match_id);
CREATE INDEX IF NOT EXISTS idx_bets_status    ON bets(status);

-- ── 3. RLS for bets ───────────────────────────────────────────
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;

-- Users can read their own bets
DROP POLICY IF EXISTS "Users can read own bets" ON bets;
CREATE POLICY "Users can read own bets" ON bets
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

-- Users cannot directly INSERT/UPDATE/DELETE bets
-- (all mutations go through the place_bet() RPC function which is SECURITY DEFINER)

-- ── 4. RPC: place_bet() ───────────────────────────────────────
-- Atomic bet placement: validates, deducts balance, inserts bet.
-- Called from the client as: supabase.rpc('place_bet', { p_match_id, p_bet_type, p_stake })
CREATE OR REPLACE FUNCTION place_bet(
    p_match_id  INTEGER,
    p_bet_type  TEXT,
    p_stake     NUMERIC
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id  UUID := auth.uid();
    v_match    matches%ROWTYPE;
    v_odds     NUMERIC;
    v_payout   NUMERIC;
    v_balance  NUMERIC;
BEGIN
    -- ── Input validation ─────────────────────────────────────
    IF v_user_id IS NULL THEN
        RETURN json_build_object('error', 'Debes iniciar sesión para apostar.');
    END IF;

    IF p_bet_type NOT IN ('home', 'draw', 'away') THEN
        RETURN json_build_object('error', 'Tipo de apuesta inválido.');
    END IF;

    IF p_stake IS NULL OR p_stake <= 0 THEN
        RETURN json_build_object('error', 'La apuesta debe ser mayor que 0.');
    END IF;

    -- ── Fetch match ──────────────────────────────────────────
    SELECT * INTO v_match FROM matches WHERE id = p_match_id;
    IF NOT FOUND THEN
        RETURN json_build_object('error', 'Partido no encontrado.');
    END IF;

    -- ── Check match is still open for betting ─────────────────
    -- Match closes once goals are recorded (result is in)
    IF v_match.home_goals IS NOT NULL AND v_match.away_goals IS NOT NULL THEN
        RETURN json_build_object('error', 'Las apuestas para este partido ya están cerradas (partido finalizado).');
    END IF;

    -- Match must have odds available
    IF v_match.home_odds IS NULL OR v_match.draw_odds IS NULL OR v_match.away_odds IS NULL THEN
        RETURN json_build_object('error', 'Este partido no tiene cuotas disponibles.');
    END IF;

    -- ── Get relevant odds ────────────────────────────────────
    IF    p_bet_type = 'home' THEN v_odds := v_match.home_odds;
    ELSIF p_bet_type = 'draw' THEN v_odds := v_match.draw_odds;
    ELSE                            v_odds := v_match.away_odds;
    END IF;

    v_payout := ROUND(p_stake * v_odds, 2);

    -- ── Check balance ────────────────────────────────────────
    SELECT balance INTO v_balance FROM user_profiles WHERE id = v_user_id;
    IF v_balance IS NULL THEN
        RETURN json_build_object('error', 'Perfil de usuario no encontrado.');
    END IF;
    IF v_balance < p_stake THEN
        RETURN json_build_object(
            'error', format('Saldo insuficiente. Tu saldo: %.0f monedas.', v_balance)
        );
    END IF;

    -- ── Deduct stake and insert bet (atomic) ─────────────────
    -- If the INSERT fails (e.g. UNIQUE violation), PostgreSQL rolls
    -- back the UPDATE automatically via implicit savepoint.
    UPDATE user_profiles SET balance = balance - p_stake WHERE id = v_user_id;

    INSERT INTO bets (user_id, match_id, bet_type, odds, stake, potential_payout, status)
    VALUES (v_user_id, p_match_id, p_bet_type, v_odds, p_stake, v_payout, 'pending');

    RETURN json_build_object(
        'success',          true,
        'odds',             v_odds,
        'stake',            p_stake,
        'potential_payout', v_payout
    );

EXCEPTION
    WHEN unique_violation THEN
        -- Balance UPDATE is auto-rolled back by the savepoint
        RETURN json_build_object('error', 'Ya tienes una apuesta en este partido.');
    WHEN OTHERS THEN
        RETURN json_build_object('error', 'Error al procesar la apuesta: ' || SQLERRM);
END;
$$;

-- ── 5. Trigger: auto-settle bets when result is entered ───────
CREATE OR REPLACE FUNCTION settle_match_bets()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_result TEXT;
    v_bet    RECORD;
BEGIN
    -- Only fire when both goals become non-null
    IF NEW.home_goals IS NULL OR NEW.away_goals IS NULL THEN
        RETURN NEW;
    END IF;

    -- Only fire when goals actually changed (avoids re-settling on other updates)
    IF OLD.home_goals IS NOT DISTINCT FROM NEW.home_goals
       AND OLD.away_goals IS NOT DISTINCT FROM NEW.away_goals THEN
        RETURN NEW;
    END IF;

    -- Determine winning outcome
    IF    NEW.home_goals > NEW.away_goals THEN v_result := 'home';
    ELSIF NEW.away_goals > NEW.home_goals THEN v_result := 'away';
    ELSE                                        v_result := 'draw';
    END IF;

    -- Settle every pending bet on this match
    FOR v_bet IN
        SELECT * FROM bets WHERE match_id = NEW.id AND status = 'pending'
    LOOP
        IF v_bet.bet_type = v_result THEN
            -- Won: credit full payout (stake already deducted, now return stake + profit)
            UPDATE user_profiles
               SET balance = balance + v_bet.potential_payout
             WHERE id = v_bet.user_id;

            UPDATE bets
               SET status = 'won', settled_at = now()
             WHERE id = v_bet.id;
        ELSE
            -- Lost: stake already gone, just mark it
            UPDATE bets
               SET status = 'lost', settled_at = now()
             WHERE id = v_bet.id;
        END IF;
    END LOOP;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_match_result_updated ON matches;
CREATE TRIGGER on_match_result_updated
    AFTER UPDATE ON matches
    FOR EACH ROW
    EXECUTE FUNCTION settle_match_bets();

-- ── 6. Grant execute on place_bet to authenticated users ─────
GRANT EXECUTE ON FUNCTION place_bet(INTEGER, TEXT, NUMERIC) TO authenticated;

-- =============================================================
-- Done! The betting system is ready.
-- New users get 1000 monedas automatically (DEFAULT 1000 on balance).
-- Existing users: run this to give them their starting balance:
--   UPDATE user_profiles SET balance = 1000 WHERE balance = 0;
-- =============================================================
