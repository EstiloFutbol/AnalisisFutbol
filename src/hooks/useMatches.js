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

// Reliable YYYY-MM-DD string from a Date using local calendar date
function _localDateStr(d) {
    return [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, '0'),
        String(d.getDate()).padStart(2, '0'),
    ].join('-')
}

// Today's, yesterday's and tomorrow's matches across La Liga 2025-26 (id 2) and WC 2026 (id 12)
export function useTodayMatches() {
    return useQuery({
        queryKey: ['matches-today-yesterday-tomorrow'],
        queryFn: async () => {
            // Use Date.now() (a plain number) so + and - are numeric, not string concatenation
            const nowMs        = Date.now()
            const todayStr     = _localDateStr(new Date(nowMs))
            const yesterdayStr = _localDateStr(new Date(nowMs - 86_400_000))
            const tomorrowStr  = _localDateStr(new Date(nowMs + 86_400_000))

            const { data, error } = await supabase
                .from('matches')
                .select(`
                    id, match_date, kick_off_time, matchday, group_name,
                    home_goals, away_goals, league_id,
                    home_team:teams!matches_home_team_id_fkey(id, name, short_name, logo_url),
                    away_team:teams!matches_away_team_id_fkey(id, name, short_name, logo_url),
                    league:leagues(id, code, name)
                `)
                .in('league_id', [2, 12])
                .in('match_date', [yesterdayStr, todayStr, tomorrowStr])
                .not('home_team_id', 'is', null)
                .not('away_team_id', 'is', null)
                .order('kick_off_time', { ascending: true })

            if (error) throw error
            const rows = data || []
            return {
                todayStr,
                yesterdayStr,
                tomorrowStr,
                today:     rows.filter(m => m.match_date === todayStr),
                yesterday: rows.filter(m => m.match_date === yesterdayStr),
                tomorrow:  rows.filter(m => m.match_date === tomorrowStr),
            }
        },
        staleTime: 3 * 60_000,
        refetchInterval: 5 * 60_000,
    })
}

// Group standings for tournament formats (World Cup, etc.)
export function useGroupStandings(leagueId) {
    return useQuery({
        queryKey: ['group_standings', leagueId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('tournament_standings')
                .select(`
                    *,
                    team:teams(id, name, short_name, logo_url)
                `)
                .eq('league_id', leagueId)
                .order('group_name', { ascending: true })
                .order('points', { ascending: false })
                .order('goals_for', { ascending: false })
            if (error) throw error
            return data || []
        },
        enabled: !!leagueId,
    })
}
