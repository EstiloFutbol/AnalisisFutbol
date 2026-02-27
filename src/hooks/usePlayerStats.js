import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

/** All player stats for a single match */
export function useMatchPlayerStats(matchId) {
    return useQuery({
        queryKey: ['match_player_stats', matchId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('match_player_stats')
                .select('*')
                .eq('match_id', matchId)
                .order('is_home', { ascending: false })
                .order('is_starter', { ascending: false })
                .order('minutes', { ascending: false })
            if (error) throw error
            return data || []
        },
        enabled: !!matchId,
    })
}

/** Aggregated player stats across all matches in a league */
export function usePlayerLeaderboard(leagueId) {
    return useQuery({
        queryKey: ['player_leaderboard', leagueId],
        queryFn: async () => {
            // We join via matches to filter by league
            let query = supabase
                .from('match_player_stats')
                .select(`
                    player_name,
                    position,
                    goals,
                    assists,
                    shots,
                    shots_on_target,
                    yellow_cards,
                    red_cards,
                    fouls_committed,
                    minutes,
                    gk_saves,
                    gk_shots_faced,
                    gk_save_pct,
                    team:teams(id, name, short_name, logo_url),
                    match:matches!inner(id, league_id, home_goals)
                `)
                .not('match.home_goals', 'is', null)

            if (leagueId) {
                query = query.eq('match.league_id', leagueId)
            }

            const { data, error } = await query
            if (error) throw error

            // Aggregate per player (same name + same team)
            const map = {}
            for (const row of data || []) {
                const team = Array.isArray(row.team) ? row.team[0] : row.team
                const key = `${row.player_name}__${team?.id || 'unknown'}`
                if (!map[key]) {
                    map[key] = {
                        player_name: row.player_name,
                        position: row.position,
                        team: team,
                        appearances: 0,
                        minutes: 0,
                        goals: 0,
                        assists: 0,
                        shots: 0,
                        shots_on_target: 0,
                        yellow_cards: 0,
                        red_cards: 0,
                        fouls_committed: 0,
                        gk_saves: 0,
                        gk_shots_faced: 0,
                    }
                }
                const p = map[key]
                p.appearances++
                p.minutes += row.minutes || 0
                p.goals += row.goals || 0
                p.assists += row.assists || 0
                p.shots += row.shots || 0
                p.shots_on_target += row.shots_on_target || 0
                p.yellow_cards += row.yellow_cards || 0
                p.red_cards += row.red_cards || 0
                p.fouls_committed += row.fouls_committed || 0
                p.gk_saves += row.gk_saves || 0
                p.gk_shots_faced += row.gk_shots_faced || 0
            }

            return Object.values(map)
        },
        enabled: true,
    })
}
