import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

// URL of the deployed Supabase Edge Function
const EDGE_FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`

async function callEdgeFunction(action, body = {}, withAuth = false) {
    // Supabase Edge Functions always require the anon key via 'apikey' header.
    // The Authorization header starts as the anon key (public access),
    // and is overridden with the user JWT when withAuth=true.
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    const headers = {
        'Content-Type': 'application/json',
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
    }
    if (withAuth) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.access_token) {
            headers['Authorization'] = `Bearer ${session.access_token}`
        }
    }
    const resp = await fetch(EDGE_FN_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({ action, ...body }),
    })
    let data
    try {
        data = await resp.json()
    } catch {
        throw new Error(`HTTP ${resp.status} — respuesta no válida de la función`)
    }
    if (!resp.ok) {
        // Supabase gateway errors use 'message'; our function errors use 'error'
        throw new Error(data.error || data.message || `Error HTTP ${resp.status}`)
    }
    return data
}

// ── AI Bets ──────────────────────────────────────────────────────────────────

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
        refetchInterval: 60_000,
    })
}

/** Derived AI bot stats from the ai_bets list */
export function useAIBotStats(bets = []) {
    const STARTING_BALANCE = 1000

    const settled = bets.filter(b => b.status !== 'pending' && b.status !== 'void')
    const pending = bets.filter(b => b.status === 'pending')
    const won = bets.filter(b => b.status === 'won')
    const lost = bets.filter(b => b.status === 'lost')

    const totalStaked = settled.reduce((s, b) => s + Number(b.stake), 0)
    const totalReturned = won.reduce((s, b) => s + Number(b.potential_payout), 0)
    const profit = totalReturned - totalStaked
    const roi = totalStaked > 0 ? ((profit / totalStaked) * 100).toFixed(1) : '0.0'

    // Current balance: start + all won payouts - all stakes on settled bets
    const balance = STARTING_BALANCE + profit
    // Add pending stakes (already "spent")
    const pendingStaked = pending.reduce((s, b) => s + Number(b.stake), 0)
    const currentBalance = balance - pendingStaked

    // Win streak (count back through latest settled bets)
    let streak = 0
    for (const b of [...settled].reverse()) {
        if (b.status === 'won') streak++
        else break
    }

    return {
        balance: Math.max(0, currentBalance),
        totalBets: bets.length,
        won: won.length,
        lost: lost.length,
        pending: pending.length,
        winRate: settled.length > 0 ? ((won.length / settled.length) * 100).toFixed(0) : '0',
        roi,
        streak,
        profit,
    }
}

// ── Analyze (admin) ──────────────────────────────────────────────────────────

export function useGenerateAIBets() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: () => callEdgeFunction('analyze', {}, true),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['ai-bets'] }),
    })
}

// ── Chat ─────────────────────────────────────────────────────────────────────

export function useAIChat() {
    const chat = useMutation({
        mutationFn: ({ message, history }) =>
            // withAuth=true so logged-in users get a per-user rate limit bucket
            callEdgeFunction('chat', { message, history }, true),
    })
    return chat
}
