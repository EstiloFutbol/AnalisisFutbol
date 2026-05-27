import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

/**
 * Fetch ML model predictions from ai_model_predictions, joined with match + team info.
 * Groups predictions by match_id so the UI can render one card per match.
 *
 * @param {number|null} leagueId   — filter by league; null = all leagues
 * @param {boolean}     upcoming   — true = only unplayed (home_goals IS NULL)
 */
export function useMLPredictions({ leagueId = null, upcoming = true } = {}) {
    return useQuery({
        queryKey: ['ml_predictions', leagueId, upcoming],
        queryFn: async () => {
            // 1. Fetch match list (with team names/logos)
            let matchQuery = supabase
                .from('matches')
                .select(`
                    id, league_id, season, match_date, matchday, kick_off_time,
                    home_goals, away_goals,
                    home_odds, draw_odds, away_odds, over25_odds, under25_odds,
                    home_team:teams!matches_home_team_id_fkey(id, name, short_name, logo_url),
                    away_team:teams!matches_away_team_id_fkey(id, name, short_name, logo_url)
                `)
                .order('match_date', { ascending: true })

            if (leagueId) matchQuery = matchQuery.eq('league_id', leagueId)
            if (upcoming)  matchQuery = matchQuery.is('home_goals', null)

            const { data: matches, error: matchErr } = await matchQuery
            if (matchErr) throw matchErr
            if (!matches || matches.length === 0) return []

            // 2. Fetch predictions for those match IDs
            const matchIds = matches.map(m => m.id)
            const { data: preds, error: predErr } = await supabase
                .from('ai_model_predictions')
                .select('match_id, model_version, market, outcome, model_prob, bookmaker_odds, ev, recommended')
                .in('match_id', matchIds)
                .order('match_id')

            if (predErr) throw predErr

            // 3. Group predictions by match_id
            const predsByMatch = {}
            for (const p of (preds || [])) {
                if (!predsByMatch[p.match_id]) predsByMatch[p.match_id] = []
                predsByMatch[p.match_id].push(p)
            }

            // 4. Attach predictions to each match
            return matches.map(m => ({
                ...m,
                predictions: predsByMatch[m.id] || [],
            }))
        },
        staleTime: 5 * 60 * 1000,   // 5 min
    })
}

/**
 * Convenience: extract probability for a specific market + outcome from a match's predictions.
 * Returns null if not found.
 */
export function getProb(predictions, market, outcome) {
    const p = predictions?.find(p => p.market === market && p.outcome === outcome)
    return p ? p.model_prob : null
}

export function getEV(predictions, market, outcome) {
    const p = predictions?.find(p => p.market === market && p.outcome === outcome)
    return p ? p.ev : null
}

export function isRecommended(predictions, market, outcome) {
    const p = predictions?.find(p => p.market === market && p.outcome === outcome)
    return p?.recommended ?? false
}
