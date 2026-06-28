import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

// Fixed conversion rate: 1 EUR = USD_RATE USD
export const USD_RATE = 1.09

export function toEUR(amount, currency) {
    return currency === 'USD' ? amount / USD_RATE : amount
}

export function fromEUR(amountEur, preferredCurrency) {
    return preferredCurrency === 'USD' ? amountEur * USD_RATE : amountEur
}

export function formatAmount(amountEur, preferredCurrency = 'EUR') {
    const amount = fromEUR(amountEur, preferredCurrency)
    const abs = Math.abs(amount).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    const symbol = preferredCurrency === 'USD' ? '$' : '€'
    return (amount < 0 ? '-' : '') + symbol + abs
}

// ── Bettor profiles ───────────────────────────────────────────────────────────

export function useBettorProfiles() {
    return useQuery({
        queryKey: ['bettor-profiles'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('bettor_profiles')
                .select('*')
                .order('created_at', { ascending: false })
            if (error) throw error
            return data || []
        },
    })
}

export function useBettorProfile(id) {
    return useQuery({
        queryKey: ['bettor-profile', id],
        enabled: !!id,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('bettor_profiles')
                .select('*')
                .eq('id', id)
                .single()
            if (error) throw error
            return data
        },
    })
}

/** All settled bets for a bettor profile */
export function useBettorBets(profileId) {
    return useQuery({
        queryKey: ['bettor-bets', profileId],
        enabled: !!profileId,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('real_bets')
                .select('*')
                .eq('bettor_profile_id', profileId)
                .order('created_at', { ascending: false })
            if (error) throw error
            return data || []
        },
    })
}

/** Virtual leaderboard — users ranked by coin balance */
export function useVirtualLeaderboard() {
    return useQuery({
        queryKey: ['virtual-leaderboard'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('id, display_name, balance')
                .order('balance', { ascending: false })
                .limit(25)
            if (error) throw error
            return data || []
        },
        staleTime: 2 * 60_000,
    })
}

/** Combined leaderboard via SQL function (bypasses RLS for aggregate stats) */
export function useLeaderboard() {
    return useQuery({
        queryKey: ['leaderboard'],
        queryFn: async () => {
            const { data, error } = await supabase.rpc('get_leaderboard')
            if (error) throw error
            return data || []
        },
        staleTime: 2 * 60_000,
    })
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useCreateBettorProfile() {
    const qc = useQueryClient()
    const { user } = useAuth()
    return useMutation({
        mutationFn: async ({ display_name, avatar_url, description, currency }) => {
            const { data, error } = await supabase
                .from('bettor_profiles')
                .insert([{ display_name, avatar_url: avatar_url || null, description: description || null, currency: currency || 'EUR', created_by: user?.id }])
                .select()
                .single()
            if (error) throw new Error(error.message)
            return data
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['bettor-profiles'] }),
    })
}

export function useUpdateBettorProfile() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, ...fields }) => {
            const { data, error } = await supabase
                .from('bettor_profiles')
                .update({ ...fields, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single()
            if (error) throw new Error(error.message)
            return data
        },
        onSuccess: (_, vars) => {
            qc.invalidateQueries({ queryKey: ['bettor-profiles'] })
            qc.invalidateQueries({ queryKey: ['bettor-profile', vars.id] })
        },
    })
}

export function useDeactivateBettorProfile() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async (id) => {
            const { error } = await supabase
                .from('bettor_profiles')
                .update({ is_active: false })
                .eq('id', id)
            if (error) throw new Error(error.message)
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['bettor-profiles'] }),
    })
}

/** Admin adds a bet to a bettor profile */
export function useAddBettorBet() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async (bet) => {
            const isSettled = bet.status && bet.status !== 'pending'
            const { data, error } = await supabase
                .from('real_bets')
                .insert([{
                    bettor_profile_id:  bet.bettor_profile_id,
                    user_id:           null,
                    match_info:        bet.match_info,
                    league:            bet.league || null,
                    bet_type:          bet.bet_type,
                    selection:         bet.selection,
                    odds:              parseFloat(bet.odds),
                    stake:             parseFloat(bet.stake),
                    potential_payout:  Math.round(parseFloat(bet.stake) * parseFloat(bet.odds) * 100) / 100,
                    bookmaker:         bet.bookmaker || null,
                    match_date:        bet.match_date || null,
                    bet_minute:        bet.bet_timing === 'live' && bet.bet_minute ? parseInt(bet.bet_minute, 10) : null,
                    currency:          bet.currency || 'EUR',
                    status:            bet.status || 'pending',
                    settled_at:        isSettled ? new Date().toISOString() : null,
                }])
                .select()
                .single()
            if (error) throw new Error(error.message)
            return data
        },
        onSuccess: (_, vars) => {
            qc.invalidateQueries({ queryKey: ['bettor-bets', vars.bettor_profile_id] })
            qc.invalidateQueries({ queryKey: ['leaderboard'] })
        },
    })
}

export function useUpdateBettorBet() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, bettor_profile_id, stake, odds, status, ...rest }) => {
            const stakeNum = parseFloat(stake)
            const oddsNum  = parseFloat(odds)
            const payload  = { ...rest, status }
            if (!isNaN(stakeNum) && !isNaN(oddsNum)) {
                payload.stake            = stakeNum
                payload.odds             = oddsNum
                payload.potential_payout = Math.round(stakeNum * oddsNum * 100) / 100
            }
            payload.settled_at = status && status !== 'pending' ? new Date().toISOString() : null
            const { data, error } = await supabase
                .from('real_bets').update(payload).eq('id', id).select().single()
            if (error) throw new Error(error.message)
            return { ...data, bettor_profile_id }
        },
        onSuccess: (data) => {
            qc.invalidateQueries({ queryKey: ['bettor-bets', data.bettor_profile_id] })
            qc.invalidateQueries({ queryKey: ['leaderboard'] })
        },
    })
}

export function useDeleteBettorBet() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, bettor_profile_id }) => {
            const { error } = await supabase.from('real_bets').delete().eq('id', id)
            if (error) throw new Error(error.message)
            return { bettor_profile_id }
        },
        onSuccess: (_, vars) => {
            qc.invalidateQueries({ queryKey: ['bettor-bets', vars.bettor_profile_id] })
            qc.invalidateQueries({ queryKey: ['leaderboard'] })
        },
    })
}

/** Update the logged-in user's preferred display currency */
export function useUpdatePreferredCurrency() {
    const qc = useQueryClient()
    const { user } = useAuth()
    return useMutation({
        mutationFn: async (preferred_currency) => {
            const { error } = await supabase
                .from('user_profiles')
                .update({ preferred_currency })
                .eq('id', user.id)
            if (error) throw new Error(error.message)
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }),
    })
}
