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
            // Get total count first to parallelize requests
            let countQuery = supabase
                .from('match_player_stats')
                .select('id, match:matches!inner(id, league_id, home_goals)', { count: 'exact', head: true })
                .not('match.home_goals', 'is', null)

            if (leagueId) {
                countQuery = countQuery.eq('match.league_id', leagueId)
            }

            const { count, error: countError } = await countQuery
            if (countError) throw countError
            if (!count) return []

            const PAGE_SIZE = 1000
            const numPages = Math.ceil(count / PAGE_SIZE)
            const fetchPromises = []

            for (let page = 0; page < numPages; page++) {
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
                    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

                if (leagueId) {
                    query = query.eq('match.league_id', leagueId)
                }

                fetchPromises.push(query.then(res => {
                    if (res.error) throw res.error
                    return res.data || []
                }))
            }

            const pages = await Promise.all(fetchPromises)
            const allData = pages.flat()

            // Aggregate per player (same name + same team)
            const map = {}
            for (const row of allData) {
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

            // Calculate per 90 metrics
            const resultList = Object.values(map)
            resultList.forEach(p => {
                p.shots_on_target_per_90 = p.minutes > 0
                    ? Number(((p.shots_on_target / p.minutes) * 90).toFixed(2))
                    : 0
            })

            return resultList
        },
        enabled: true,
    })
}
