import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

// ── Match Comments ───────────────────────────────────────────────────────────

export function useMatchComments(matchId) {
    return useQuery({
        queryKey: ['match-comments', matchId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('match_comments')
                .select(`
                    id, content, created_at, reported_count, is_hidden, user_id,
                    user_profile:user_profiles!match_comments_user_id_fkey(
                        display_name, is_admin, is_banned
                    )
                `)
                .eq('match_id', matchId)
                .eq('is_hidden', false)
                .order('created_at', { ascending: true })

            if (error) throw error
            return data || []
        },
        enabled: !!matchId,
    })
}

export function useAddComment() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async ({ matchId, content }) => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Debes iniciar sesión para comentar.')

            const { data, error } = await supabase
                .from('match_comments')
                .insert({
                    match_id: matchId,
                    user_id: user.id,
                    content: content.trim(),
                })
                .select()
                .single()

            if (error) {
                if (error.message?.includes('is_banned')) {
                    throw new Error('Tu cuenta ha sido suspendida.')
                }
                throw error
            }
            return data
        },
        onSuccess: (_, { matchId }) => {
            qc.invalidateQueries({ queryKey: ['match-comments', matchId] })
        },
    })
}

export function useReportComment() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async ({ commentId, reason = 'spam' }) => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Debes iniciar sesión para reportar.')

            const { error } = await supabase
                .from('comment_reports')
                .insert({
                    comment_id: commentId,
                    reporter_id: user.id,
                    reason,
                })

            if (error) {
                if (error.code === '23505') { // unique violation
                    throw new Error('Ya has reportado este comentario.')
                }
                throw error
            }
        },
        onSuccess: () => {
            // Refresh all comment lists
            qc.invalidateQueries({ queryKey: ['match-comments'] })
        },
    })
}

export function useDeleteComment() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async ({ commentId }) => {
            const { error } = await supabase
                .from('match_comments')
                .delete()
                .eq('id', commentId)

            if (error) throw error
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['match-comments'] })
        },
    })
}

export function useHideComment() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async ({ commentId }) => {
            const { error } = await supabase
                .from('match_comments')
                .update({ is_hidden: true })
                .eq('id', commentId)

            if (error) throw error
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['match-comments'] })
        },
    })
}

// ── Expert Reviews ───────────────────────────────────────────────────────────

export function useExpertReview(matchId) {
    return useQuery({
        queryKey: ['expert-review', matchId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('match_expert_reviews')
                .select(`
                    id, content, created_at, updated_at,
                    admin:user_profiles!match_expert_reviews_admin_id_fkey(
                        display_name
                    )
                `)
                .eq('match_id', matchId)
                .maybeSingle()

            if (error) throw error
            return data
        },
        enabled: !!matchId,
    })
}

export function useUpsertExpertReview() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async ({ matchId, content }) => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Authentication required')

            const { data, error } = await supabase
                .from('match_expert_reviews')
                .upsert(
                    {
                        match_id: matchId,
                        admin_id: user.id,
                        content: content.trim(),
                        updated_at: new Date().toISOString(),
                    },
                    { onConflict: 'match_id' }
                )
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: (_, { matchId }) => {
            qc.invalidateQueries({ queryKey: ['expert-review', matchId] })
        },
    })
}

// ── AI Bet for a specific match ──────────────────────────────────────────────

export function useAIBetForMatch(matchId) {
    return useQuery({
        queryKey: ['ai-bet-match', matchId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('ai_bets')
                .select('*')
                .eq('match_id', matchId)
                .maybeSingle()

            if (error) throw error
            return data
        },
        enabled: !!matchId,
    })
}

// ── Admin: Ban/Unban user ────────────────────────────────────────────────────

export function useBanUser() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async ({ userId, ban = true, reason = '' }) => {
            const { error } = await supabase
                .from('user_profiles')
                .update({
                    is_banned: ban,
                    banned_at: ban ? new Date().toISOString() : null,
                    ban_reason: ban ? reason : null,
                })
                .eq('id', userId)

            if (error) throw error
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['match-comments'] })
        },
    })
}

// ── Admin: Reported comments ─────────────────────────────────────────────────

export function useReportedComments() {
    return useQuery({
        queryKey: ['reported-comments'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('match_comments')
                .select(`
                    id, content, created_at, reported_count, is_hidden, match_id, user_id,
                    user_profile:user_profiles!match_comments_user_id_fkey(
                        display_name, is_admin, is_banned
                    )
                `)
                .gt('reported_count', 0)
                .order('reported_count', { ascending: false })
                .limit(50)

            if (error) throw error
            return data || []
        },
    })
}
