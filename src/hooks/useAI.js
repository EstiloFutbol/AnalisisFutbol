/**
 * useAI.js — AI bets hooks
 *
 * The Gemini chat and generation hooks (useAIChat, useGenerateAIBets)
 * have been removed. The platform now uses a custom ML model (ml/ directory)
 * instead of Gemini. See ml/predict.py and src/pages/Analisis.jsx.
 *
 * Kept: useAIBets + useAIBotStats — read historical picks from ai_bets table.
 */
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

// ── AI Bets — historical picks stored in ai_bets table ───────────────────────

export function useAIBets() {
    return useQuery({
        queryKey: ['ai-bets'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('ai_bets')
                .select(`
                    *,
                    match:matches(
                        id, matchday, match_date, kick_off_time,
                        home_goals, away_goals,
                        home_odds, draw_odds, away_odds,
                        home_team:teams!matches_home_team_id_fkey(name, short_name, logo_url),
                        away_team:teams!matches_away_team_id_fkey(name, short_name, logo_url)
                    )
                `)
                .order('created_at', { ascending: false })

            if (error) throw error
            return data || []
        },
        staleTime: 5 * 60 * 1000,
    })
}

/** Derived stats from the ai_bets list (won/lost/ROI/streak) */
export function useAIBotStats(bets = []) {
    const STARTING_BALANCE = 1000

    const settled = bets.filter(b => b.status !== 'pending' && b.status !== 'void')
    const pending  = bets.filter(b => b.status === 'pending')
    const won      = bets.filter(b => b.status === 'won')
    const lost     = bets.filter(b => b.status === 'lost')

    const totalStaked   = settled.reduce((s, b) => s + Number(b.stake), 0)
    const totalReturned = won.reduce((s, b) => s + Number(b.potential_payout), 0)
    const profit = totalReturned - totalStaked
    const roi    = totalStaked > 0 ? ((profit / totalStaked) * 100).toFixed(1) : '0.0'

    const pendingStaked  = pending.reduce((s, b) => s + Number(b.stake), 0)
    const currentBalance = STARTING_BALANCE + profit - pendingStaked

    let streak = 0
    for (const b of [...settled].reverse()) {
        if (b.status === 'won') streak++
        else break
    }

    return {
        balance:    Math.max(0, currentBalance),
        totalBets:  bets.length,
        won:        won.length,
        lost:       lost.length,
        pending:    pending.length,
        winRate:    settled.length > 0 ? ((won.length / settled.length) * 100).toFixed(0) : '0',
        roi,
        streak,
        profit,
    }
}
