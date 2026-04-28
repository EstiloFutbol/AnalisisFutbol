import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

/**
 * Returns true if the match kick-off time has already passed.
 * match_date: "2026-03-22"  kick_off_time: "21:00" or "21:00:00"
 * Times stored in Spain local time (CET/CEST). The browser also runs in
 * Spain time for this app's users, so parsing as local time is correct.
 */
export function matchHasStarted(matchDate, kickOffTime) {
    if (!matchDate) return false
    const now = new Date()
    try {
        // Use kickoff time, or end-of-day if missing
        const time = kickOffTime ? kickOffTime.slice(0, 5) : '23:59'
        // Parsing "2026-03-22T21:00" without timezone → interpreted as LOCAL time
        const kickoff = new Date(`${matchDate}T${time}:00`)
        return now >= kickoff
    } catch {
        // Fallback: just compare dates
        return matchDate < now.toISOString().slice(0, 10)
    }
}

/** Matches that have odds set and no result yet — tagged with hasStarted */
export function useBettableMatches(leagueId) {
    return useQuery({
        queryKey: ['bettable-matches', leagueId],
        queryFn: async () => {
            let q = supabase
                .from('matches')
                .select(`
                    id, matchday, match_date, kick_off_time,
                    home_goals, away_goals,
                    home_odds, draw_odds, away_odds,
                    home_team:teams!matches_home_team_id_fkey(id, name, short_name, logo_url),
                    away_team:teams!matches_away_team_id_fkey(id, name, short_name, logo_url)
                `)
                .not('home_odds', 'is', null)
                .not('draw_odds', 'is', null)
                .not('away_odds', 'is', null)
                .is('home_goals', null)            // only unplayed matches
                .order('matchday', { ascending: true })
                .order('kick_off_time', { ascending: true })

            if (leagueId) q = q.eq('league_id', leagueId)

            const { data, error } = await q
            if (error) throw error

            // Tag each match with whether its kick-off has passed
            return (data || []).map(m => ({
                ...m,
                hasStarted: matchHasStarted(m.match_date, m.kick_off_time),
            }))
        },
        // Re-run every minute so cards lock automatically as kick-off passes
        refetchInterval: 60_000,
    })
}

/** All bets for the current user */
export function useUserBets() {
    const { user } = useAuth()
    return useQuery({
        queryKey: ['user-bets', user?.id],
        enabled: !!user,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('bets')
                .select(`
                    *,
                    match:matches(
                        id, matchday, match_date, home_goals, away_goals,
                        home_team:teams!matches_home_team_id_fkey(name, short_name, logo_url),
                        away_team:teams!matches_away_team_id_fkey(name, short_name, logo_url)
                    )
                `)
                .order('created_at', { ascending: false })

            if (error) throw error
            return data || []
        },
    })
}

/** All real (bookmaker) bets for the current user */
export function useRealBets() {
    const { user } = useAuth()
    return useQuery({
        queryKey: ['real-bets', user?.id],
        enabled: !!user,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('real_bets')
                .select('*')
                .order('created_at', { ascending: false })
            if (error) throw error
            return data || []
        },
    })
}

/** Insert a new real bet */
export function useAddRealBet() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async (bet) => {
            const { data, error } = await supabase
                .from('real_bets')
                .insert([{ ...bet, potential_payout: Math.round(bet.stake * bet.odds * 100) / 100 }])
                .select()
                .single()
            if (error) throw new Error(error.message)
            return data
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['real-bets'] }),
    })
}

/** Mark a real bet as won / lost / void */
export function useSettleRealBet() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, status }) => {
            const { data, error } = await supabase
                .from('real_bets')
                .update({ status, settled_at: status !== 'pending' ? new Date().toISOString() : null })
                .eq('id', id)
                .select()
                .single()
            if (error) throw new Error(error.message)
            return data
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['real-bets'] }),
    })
}

/** Place a bet — calls the secure place_bet() RPC */
export function usePlaceBet() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async ({ matchId, betType, stake }) => {
            const { data, error } = await supabase.rpc('place_bet', {
                p_match_id: matchId,
                p_bet_type: betType,
                p_stake:    Number(stake),
            })
            if (error) throw new Error(error.message)
            if (data?.error) throw new Error(data.error)
            return data
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['user-bets'] })
            qc.invalidateQueries({ queryKey: ['bettable-matches'] })
        },
    })
}
