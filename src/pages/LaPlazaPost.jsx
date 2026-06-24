import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft, ThumbsUp, MessageSquare, Send, Flag, Trash2,
    Loader2, AlertTriangle, X, CornerDownRight, ShieldBan
} from 'lucide-react'
import SEO from '@/components/SEO'
import { useAuth } from '@/context/AuthContext'
import {
    useForumPost, useUserLiked, useToggleLike,
    useCreateComment, useDeletePost, useDeleteComment,
    useReportContent, formatRelative,
} from '@/hooks/useForum'

const MAX_DEPTH = 4  // visual indent limit

// ── Avatar ────────────────────────────────────────────────────────────────────

function AuthorAvatar({ name, size = 8 }) {
    const initials = name
        ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : '?'
    return (
        <div className={`flex h-${size} w-${size} shrink-0 items-center justify-center rounded-full bg-primary/20 border border-primary/30 text-[11px] font-bold text-primary select-none`}>
            {initials}
        </div>
    )
}

// ── Report modal ──────────────────────────────────────────────────────────────

function ReportModal({ target, reporterUserId, onClose }) {
    const [reason, setReason] = useState('')
    const report = useReportContent()

    const handleSubmit = async (e) => {
        e.preventDefault()
        await report.mutateAsync({
            reporterUserId,
            reportedUserId: target.user_id,
            postId:         target.postId || null,
            commentId:      target.commentId || null,
            reason:         reason.trim(),
        })
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-md rounded-2xl border border-border/60 bg-card shadow-2xl"
            >
                <div className="flex items-center justify-between border-b border-border/40 px-6 py-4">
                    <div className="flex items-center gap-2">
                        <Flag className="h-4 w-4 text-amber-400" />
                        <h2 className="text-base font-black text-foreground">Reportar contenido</h2>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary transition-colors">
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 p-6">
                    <p className="text-sm text-muted-foreground">
                        Si este contenido infringe las normas de la comunidad, explícanos por qué.
                    </p>
                    <textarea
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                        maxLength={500}
                        rows={3}
                        placeholder="Motivo del reporte (opcional)..."
                        className="w-full resize-none rounded-xl border border-border/60 bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                    {report.error && (
                        <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs text-red-400">
                            {report.error.message?.includes('duplicate') ? 'Ya has reportado este contenido.' : 'Error al reportar.'}
                        </p>
                    )}
                    {report.isSuccess && (
                        <p className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-2.5 text-xs text-green-400">
                            Reporte enviado. Gracias por mantener la comunidad sana.
                        </p>
                    )}
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="rounded-xl border border-border/60 px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-secondary transition-colors">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={report.isPending || report.isSuccess}
                            className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors disabled:opacity-50"
                        >
                            {report.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Flag className="h-3.5 w-3.5" />}
                            Reportar
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    )
}

// ── Reply / comment form ──────────────────────────────────────────────────────

function CommentForm({ postId, parentCommentId = null, authorName, userId, onSuccess, autoFocus = false }) {
    const [body, setBody] = useState('')
    const create = useCreateComment()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!body.trim()) return
        await create.mutateAsync({ postId, body: body.trim(), authorName, userId, parentCommentId })
        setBody('')
        onSuccess?.()
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                maxLength={2000}
                rows={2}
                autoFocus={autoFocus}
                placeholder={parentCommentId ? 'Escribe tu respuesta…' : 'Añade un comentario…'}
                className="flex-1 resize-none rounded-xl border border-border/60 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
                type="submit"
                disabled={!body.trim() || create.isPending}
                className="self-end inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-white shadow transition-all hover:-translate-y-0.5 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #bc6c25, #dda15e)' }}
            >
                {create.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                Enviar
            </button>
        </form>
    )
}

// ── Single comment (recursive) ────────────────────────────────────────────────

function Comment({ comment, postId, depth, currentUserId, isAdmin, authorName, onReport, onDelete }) {
    const [showReply, setShowReply] = useState(false)

    const handleDelete = () => {
        if (!window.confirm('¿Eliminar este comentario?')) return
        onDelete({ commentId: comment.id, postId })
    }

    const isOwner = currentUserId === comment.user_id
    const indent  = Math.min(depth, MAX_DEPTH) * 20

    return (
        <div style={{ marginLeft: indent }}>
            <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative rounded-xl border border-border/40 bg-card/60 p-4 transition-colors hover:bg-card"
            >
                {/* Thread line */}
                {depth > 0 && (
                    <div
                        className="absolute -left-3 top-5 bottom-0 w-px bg-border/40"
                        aria-hidden
                    />
                )}

                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                    <AuthorAvatar name={comment.author_name} size={6} />
                    <span className="text-xs font-bold text-foreground">{comment.author_name}</span>
                    <span className="text-[10px] text-muted-foreground/60">{formatRelative(comment.created_at)}</span>
                    {depth > 0 && (
                        <CornerDownRight className="h-3 w-3 text-muted-foreground/30 ml-auto" />
                    )}
                </div>

                {/* Body */}
                <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap break-words">
                    {comment.body}
                </p>

                {/* Actions */}
                <div className="mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => setShowReply(r => !r)}
                        className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    >
                        <MessageSquare className="h-3 w-3" />
                        Responder
                    </button>
                    {!isOwner && !isAdmin && (
                        <button
                            onClick={() => onReport({ user_id: comment.user_id, commentId: comment.id, postId: null })}
                            className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                        >
                            <Flag className="h-3 w-3" />
                            Reportar
                        </button>
                    )}
                    {(isOwner || isAdmin) && (
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                            <Trash2 className="h-3 w-3" />
                            Eliminar
                        </button>
                    )}
                </div>
            </motion.div>

            {/* Inline reply form */}
            <AnimatePresence>
                {showReply && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-2"
                        style={{ marginLeft: 8 }}
                    >
                        <CommentForm
                            postId={postId}
                            parentCommentId={comment.id}
                            authorName={authorName}
                            userId={currentUserId}
                            onSuccess={() => setShowReply(false)}
                            autoFocus
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Nested replies */}
            {comment.replies?.length > 0 && (
                <div className="mt-2 space-y-2 relative">
                    {comment.replies.map(reply => (
                        <Comment
                            key={reply.id}
                            comment={reply}
                            postId={postId}
                            depth={depth + 1}
                            currentUserId={currentUserId}
                            isAdmin={isAdmin}
                            authorName={authorName}
                            onReport={onReport}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function LaPlazaPost() {
    const { postId }  = useParams()
    const navigate    = useNavigate()
    const { session, user, userProfile, isAdmin } = useAuth()
    const [reportTarget, setReportTarget] = useState(null)

    const { data: post, isLoading, error } = useForumPost(postId)
    const { data: isLiked = false }        = useUserLiked(postId, user?.id)
    const toggleLike  = useToggleLike()
    const deletePost  = useDeletePost()
    const deleteComment = useDeleteComment()

    // Auth guard
    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
                <MessageSquare className="h-12 w-12 text-muted-foreground/40" />
                <h1 className="text-2xl font-black text-foreground">Sólo para miembros</h1>
                <Link to="/iniciar-sesion" className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow"
                    style={{ background: 'linear-gradient(135deg, #bc6c25, #dda15e)' }}>
                    Iniciar sesión
                </Link>
            </div>
        )
    }

    if (userProfile?.is_banned) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
                <ShieldBan className="h-12 w-12 text-red-400" />
                <h1 className="text-2xl font-black text-foreground">Cuenta suspendida</h1>
                <p className="text-sm text-muted-foreground max-w-sm">Tu cuenta ha sido suspendida. No puedes participar en La Plaza.</p>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (error || !post) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
                <AlertTriangle className="h-10 w-10 text-red-400" />
                <p className="text-foreground font-black">Conversación no encontrada</p>
                <Link to="/plaza" className="text-sm text-primary hover:underline">← Volver a La Plaza</Link>
            </div>
        )
    }

    const authorName = userProfile?.display_name || user?.email?.split('@')[0] || 'Anónimo'
    const isOwner    = user.id === post.user_id

    const handleLike = () => {
        toggleLike.mutate({ postId: post.id, userId: user.id, isLiked })
    }

    const handleDeletePost = async () => {
        if (!window.confirm('¿Eliminar esta conversación?')) return
        await deletePost.mutateAsync(post.id)
        navigate('/plaza')
    }

    const totalComments = (function count(tree) {
        return tree.reduce((n, c) => n + 1 + count(c.replies || []), 0)
    })(post.comments)

    return (
        <>
            <SEO
                title={`${post.title} — La Plaza`}
                description={post.body?.slice(0, 150) || 'Conversación en La Plaza de Análisis Fútbol.'}
                path={`/plaza/${postId}`}
                noIndex={true}
            />

            <AnimatePresence>
                {reportTarget && (
                    <ReportModal
                        target={reportTarget}
                        reporterUserId={user.id}
                        onClose={() => setReportTarget(null)}
                    />
                )}
            </AnimatePresence>

            <div className="mx-auto max-w-3xl space-y-6 pb-20">

                {/* Back */}
                <Link
                    to="/plaza"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    La Plaza
                </Link>

                {/* ── Post ── */}
                <motion.article
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8"
                >
                    {/* Author + date */}
                    <div className="flex items-center gap-3 mb-4">
                        <AuthorAvatar name={post.author_name} size={9} />
                        <div>
                            <p className="text-sm font-bold text-foreground">{post.author_name}</p>
                            <p className="text-xs text-muted-foreground">{formatRelative(post.created_at)}</p>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                        {post.title}
                    </h1>

                    {/* Body */}
                    {post.body && (
                        <p className="mt-4 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                            {post.body}
                        </p>
                    )}

                    {/* Actions bar */}
                    <div className="mt-6 flex items-center gap-3 border-t border-border/40 pt-4">
                        {/* Like */}
                        <button
                            onClick={handleLike}
                            disabled={toggleLike.isPending}
                            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm font-bold transition-all ${
                                isLiked
                                    ? 'border-primary/50 bg-primary/15 text-primary'
                                    : 'border-border/60 text-muted-foreground hover:border-primary/30 hover:text-primary'
                            }`}
                        >
                            <ThumbsUp className={`h-4 w-4 transition-transform ${isLiked ? 'scale-110' : ''}`} />
                            {post.like_count}
                        </button>

                        {/* Comment count */}
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MessageSquare className="h-4 w-4" />
                            {totalComments} comentario{totalComments !== 1 ? 's' : ''}
                        </div>

                        <div className="ml-auto flex items-center gap-2">
                            {!isOwner && !isAdmin && (
                                <button
                                    onClick={() => setReportTarget({ user_id: post.user_id, postId: post.id, commentId: null })}
                                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-muted-foreground hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                                >
                                    <Flag className="h-3.5 w-3.5" />
                                    Reportar
                                </button>
                            )}
                            {(isOwner || isAdmin) && (
                                <button
                                    onClick={handleDeletePost}
                                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Eliminar
                                </button>
                            )}
                        </div>
                    </div>
                </motion.article>

                {/* ── New comment form ── */}
                <div className="rounded-2xl border border-border/50 bg-card p-5">
                    <h2 className="mb-3 text-sm font-black text-foreground">Añade tu comentario</h2>
                    <CommentForm
                        postId={post.id}
                        authorName={authorName}
                        userId={user.id}
                    />
                </div>

                {/* ── Comments ── */}
                {post.comments.length > 0 && (
                    <div className="space-y-3">
                        <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                            {totalComments} comentario{totalComments !== 1 ? 's' : ''}
                        </h2>
                        {post.comments.map(comment => (
                            <Comment
                                key={comment.id}
                                comment={comment}
                                postId={post.id}
                                depth={0}
                                currentUserId={user.id}
                                isAdmin={isAdmin}
                                authorName={authorName}
                                onReport={setReportTarget}
                                onDelete={deleteComment.mutate}
                            />
                        ))}
                    </div>
                )}

                {post.comments.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground/50 text-sm">
                        Aún no hay comentarios. ¡Sé el primero!
                    </div>
                )}

            </div>
        </>
    )
}
