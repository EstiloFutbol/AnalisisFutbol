import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useLeagues() {
    return useQuery({
        queryKey: ['leagues'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('leagues')
                .select('*')
                .order('is_default', { ascending: false })
                .order('season', { ascending: false })

            if (error) throw error
            return data || []
        },
    })
}

export function useMatches(leagueId, { playedOnly = false } = {}) {
    return useQuery({
        queryKey: ['matches', leagueId, playedOnly],
        queryFn: async () => {
            let query = supabase
                .from('matches')
                .select(`
                    *,
                    home_team:teams!matches_home_team_id_fkey(id, name, short_name, logo_url, stadium),
                    away_team:teams!matches_away_team_id_fkey(id, name, short_name, logo_url, stadium),
                    referee_data:referees(id, name)
                `)
                .order('match_date', { ascending: false })

            if (leagueId) {
                query = query.eq('league_id', leagueId)
            }
            // Exclude fixture rows: played matches always have a score
            if (playedOnly) {
                query = query.not('home_goals', 'is', null)
            }

            const { data, error } = await query
            if (error) throw error
            return data || []
        },
        enabled: true,
    })
}

export function useMatch(matchId) {
    return useQuery({
        queryKey: ['match', matchId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('matches')
                .select(`
                    *,
                    home_team:teams!matches_home_team_id_fkey(id, name, short_name, logo_url, stadium),
                    away_team:teams!matches_away_team_id_fkey(id, name, short_name, logo_url, stadium),
                    referee_data:referees(id, name)
                `)
                .eq('id', matchId)
                .single()

            if (error) throw error
            return data
        },
        enabled: !!matchId,
    })
}

export function useSeasons() {
    return useQuery({
        queryKey: ['seasons'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('matches')
                .select('season')
                .order('season', { ascending: false })

            if (error) throw error

            // Get unique seasons
            const seasons = [...new Set(data.map(d => d.season))].filter(Boolean)
            return seasons
        },
    })
}

export function useTeams() {
    return useQuery({
        queryKey: ['teams'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('teams')
                .select('*')
                .order('name')

            if (error) throw error
            return data || []
        },
    })
}

export function useMatchdays(leagueId) {
    return useQuery({
        queryKey: ['matchdays', leagueId],
        queryFn: async () => {
            let query = supabase
                .from('matches')
                .select('matchday')
                .order('matchday', { ascending: true })

            if (leagueId) {
                query = query.eq('league_id', leagueId)
            }

            const { data, error } = await query
            if (error) throw error

            const matchdays = [...new Set(data.map(d => d.matchday))].filter(Boolean).sort((a, b) => a - b)
            return matchdays
        },
        enabled: true,
    })
}
