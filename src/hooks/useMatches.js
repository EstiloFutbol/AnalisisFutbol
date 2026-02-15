import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useMatches(seasonId) {
    return useQuery({
        queryKey: ['matches', seasonId],
        queryFn: async () => {
            let query = supabase
                .from('matches')
                .select(`
                    *,
                    home_team:teams!matches_home_team_id_fkey(id, name, short_name, logo_url),
                    away_team:teams!matches_away_team_id_fkey(id, name, short_name, logo_url)
                `)
                .order('match_date', { ascending: false })

            if (seasonId) {
                query = query.eq('season', seasonId)
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
                    home_team:teams!matches_home_team_id_fkey(id, name, short_name, logo_url),
                    away_team:teams!matches_away_team_id_fkey(id, name, short_name, logo_url)
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

export function useMatchdays(seasonId) {
    return useQuery({
        queryKey: ['matchdays', seasonId],
        queryFn: async () => {
            let query = supabase
                .from('matches')
                .select('matchday')
                .order('matchday', { ascending: true })

            if (seasonId) {
                query = query.eq('season', seasonId)
            }

            const { data, error } = await query
            if (error) throw error

            const matchdays = [...new Set(data.map(d => d.matchday))].filter(Boolean).sort((a, b) => a - b)
            return matchdays
        },
        enabled: true,
    })
}
