-- =============================================================
-- Patch: Add kick-off time check to place_bet()
-- Run this in the Supabase SQL Editor
-- =============================================================
-- This replaces the place_bet function with a stricter version
-- that also blocks bets once the match kick-off time has passed,
-- even if the result hasn't been entered yet.
-- =============================================================

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
    v_user_id   UUID := auth.uid();
    v_match     matches%ROWTYPE;
    v_odds      NUMERIC;
    v_payout    NUMERIC;
    v_balance   NUMERIC;
    v_kickoff   TIMESTAMPTZ;
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

    -- ── Check result not yet entered ─────────────────────────
    IF v_match.home_goals IS NOT NULL AND v_match.away_goals IS NOT NULL THEN
        RETURN json_build_object('error', 'Las apuestas para este partido ya están cerradas (resultado registrado).');
    END IF;

    -- ── Check kick-off time hasn't passed (Spain timezone) ───
    -- Build a timestamp from match_date + kick_off_time interpreted
    -- as Spain local time (Europe/Madrid = CET/CEST).
    IF v_match.match_date IS NOT NULL THEN
        BEGIN
            IF v_match.kick_off_time IS NOT NULL THEN
                -- Combine date + time string → timestamptz in Spain local time
                v_kickoff := (v_match.match_date::TEXT || ' ' || v_match.kick_off_time)::TIMESTAMP
                             AT TIME ZONE 'Europe/Madrid';
            ELSE
                -- No kick-off time stored: use start of the match day
                v_kickoff := (v_match.match_date::TEXT || ' 00:00:00')::TIMESTAMP
                             AT TIME ZONE 'Europe/Madrid';
            END IF;

            IF NOW() >= v_kickoff THEN
                RETURN json_build_object('error', 'El partido ya ha comenzado. Las apuestas están cerradas.');
            END IF;
        EXCEPTION WHEN OTHERS THEN
            -- If time parsing fails, fall back to date-only check
            IF v_match.match_date < CURRENT_DATE THEN
                RETURN json_build_object('error', 'Las apuestas para este partido ya están cerradas.');
            END IF;
        END;
    END IF;

    -- ── Odds must exist ──────────────────────────────────────
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
        RETURN json_build_object('error', 'Ya tienes una apuesta en este partido.');
    WHEN OTHERS THEN
        RETURN json_build_object('error', 'Error al procesar la apuesta: ' || SQLERRM);
END;
$$;

GRANT EXECUTE ON FUNCTION place_bet(INTEGER, TEXT, NUMERIC) TO authenticated;
