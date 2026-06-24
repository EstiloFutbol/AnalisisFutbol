import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Convert flat comments array into a nested tree by parent_comment_id. */
export function buildCommentTree(comments) {
    const byId = {}
    const roots = []
    comments.forEach(c => { byId[c.id] = { ...c, replies: [] } })
    comments.forEach(c => {
        if (c.parent_comment_id && byId[c.parent_comment_id]) {
            byId[c.parent_comment_id].replies.push(byId[c.id])
        } else {
            roots.push(byId[c.id])
        }
    })
    return roots
}

function formatRelative(isoString) {
    const diff = Date.now() - new Date(isoString).getTime()
    const mins  = Math.floor(diff / 60_000)
    const hours = Math.floor(diff / 3_600_000)
    const days  = Math.floor(diff / 86_400_000)
    if (mins  < 1)  return 'Ahora mismo'
    if (mins  < 60) return `Hace ${mins} min`
    if (hours < 24) return `Hace ${hours} h`
    if (days  < 7)  return `Hace ${days} día${days > 1 ? 's' : ''}`
    return new Date(isoString).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

export { formatRelative }

// ── Forum posts list ──────────────────────────────────────────────────────────

export function useForumPosts(sort = 'date') {
    return useQuery({
        queryKey: ['forum-posts', sort],
        queryFn: async () => {
            const { data: posts, error } = await supabase
                .from('forum_posts')
                .select('id, user_id, author_name, title, body, created_at, updated_at')
                .eq('is_deleted', false)
            if (error) throw error
            if (!posts.length) return []

            const postIds = posts.map(p => p.id)

            const [{ data: likes }, { data: comments }] = await Promise.all([
                supabase.from('forum_likes').select('post_id').in('post_id', postIds),
                supabase.from('forum_comments').select('post_id').in('post_id', postIds).eq('is_deleted', false),
            ])

            const likeMap    = {}
            const commentMap = {}
            likes?.forEach(l    => { likeMap[l.post_id]    = (likeMap[l.post_id]    || 0) + 1 })
            comments?.forEach(c => { commentMap[c.post_id] = (commentMap[c.post_id] || 0) + 1 })

            const result = posts.map(p => ({
                ...p,
                like_count:        likeMap[p.id]    || 0,
                comment_count:     commentMap[p.id] || 0,
                interaction_count: (likeMap[p.id] || 0) + (commentMap[p.id] || 0),
            }))

            if (sort === 'interactions') {
                result.sort((a, b) => b.interaction_count - a.interaction_count || new Date(b.created_at) - new Date(a.created_at))
            } else {
                result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            }

            return result
        },
        staleTime: 30_000,
    })
}

// ── Single post with nested comments ─────────────────────────────────────────

export function useForumPost(postId) {
    return useQuery({
        queryKey: ['forum-post', postId],
        queryFn: async () => {
            const [postRes, commentsRes, likesRes] = await Promise.all([
                supabase.from('forum_posts').select('*').eq('id', postId).eq('is_deleted', false).single(),
                supabase.from('forum_comments').select('*').eq('post_id', postId).eq('is_deleted', false).order('created_at', { ascending: true }),
                supabase.from('forum_likes').select('user_id').eq('post_id', postId),
            ])
            if (postRes.error) throw postRes.error
            return {
                ...postRes.data,
                comments:    buildCommentTree(commentsRes.data || []),
                likes:       likesRes.data || [],
                like_count:  likesRes.data?.length || 0,
            }
        },
        enabled: !!postId,
        staleTime: 15_000,
    })
}

// ── User's like status for a post ─────────────────────────────────────────────

export function useUserLiked(postId, userId) {
    return useQuery({
        queryKey: ['forum-liked', postId, userId],
        queryFn: async () => {
            const { data } = await supabase
                .from('forum_likes')
                .select('post_id')
                .eq('post_id', postId)
                .eq('user_id', userId)
                .maybeSingle()
            return !!data
        },
        enabled: !!postId && !!userId,
    })
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useCreatePost() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async ({ title, body, authorName, userId }) => {
            const { data, error } = await supabase
                .from('forum_posts')
                .insert({ title, body: body || null, author_name: authorName, user_id: userId })
                .select()
                .single()
            if (error) throw error
            return data
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['forum-posts'] }),
    })
}

export function useCreateComment() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async ({ postId, body, authorName, userId, parentCommentId = null }) => {
            const { data, error } = await supabase
                .from('forum_comments')
                .insert({
                    post_id:           postId,
                    body,
                    author_name:       authorName,
                    user_id:           userId,
                    parent_comment_id: parentCommentId,
                })
                .select()
                .single()
            if (error) throw error
            return data
        },
        onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['forum-post', vars.postId] }),
    })
}

export function useToggleLike() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async ({ postId, userId, isLiked }) => {
            if (isLiked) {
                const { error } = await supabase.from('forum_likes').delete().eq('post_id', postId).eq('user_id', userId)
                if (error) throw error
            } else {
                const { error } = await supabase.from('forum_likes').insert({ post_id: postId, user_id: userId })
                if (error) throw error
            }
        },
        onSuccess: (_, vars) => {
            qc.invalidateQueries({ queryKey: ['forum-post', vars.postId] })
            qc.invalidateQueries({ queryKey: ['forum-posts'] })
            qc.invalidateQueries({ queryKey: ['forum-liked', vars.postId, vars.userId] })
        },
    })
}

export function useReportContent() {
    return useMutation({
        mutationFn: async ({ reporterUserId, reportedUserId, postId = null, commentId = null, reason = '' }) => {
            const { error } = await supabase
                .from('forum_reports')
                .insert({ reporter_user_id: reporterUserId, reported_user_id: reportedUserId, post_id: postId, comment_id: commentId, reason })
            if (error) throw error
        },
    })
}

export function useDeletePost() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async (postId) => {
            const { error } = await supabase.from('forum_posts').update({ is_deleted: true }).eq('id', postId)
            if (error) throw error
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['forum-posts'] })
        },
    })
}

export function useDeleteComment() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async ({ commentId, postId }) => {
            const { error } = await supabase.from('forum_comments').update({ is_deleted: true }).eq('id', commentId)
            if (error) throw error
        },
        onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['forum-post', vars.postId] }),
    })
}
