import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    MessageSquare, ThumbsUp, Plus, X, Flame, Clock,
    AlertTriangle, ShieldBan, Send, Loader2, Trash2, Flag
} from 'lucide-react'
import SEO from '@/components/SEO'
import { useAuth } from '@/context/AuthContext'
import {
    useForumPosts, useCreatePost, useDeletePost,
    useReportContent, formatRelative,
} from '@/hooks/useForum'

// ── Small helpers ─────────────────────────────────────────────────────────────

function AuthorAvatar({ name }) {
    const initials = name
        ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : '?'
    return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 border border-primary/30 text-xs font-bold text-primary select-none">
            {initials}
        </div>
    )
}

// ── New post modal ────────────────────────────────────────────────────────────

function NewPostModal({ authorName, userId, onClose }) {
    const [title, setTitle] = useState('')
    const [body,  setBody]  = useState('')
    const createPost = useCreatePost()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!title.trim()) return
        await createPost.mutateAsync({ title: title.trim(), body: body.trim() || null, authorName, userId })
        onClose()
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
                className="w-full max-w-xl rounded-2xl border border-border/60 bg-card shadow-2xl"
            >
                <div className="flex items-center justify-between border-b border-border/40 px-6 py-4">
                    <h2 className="text-base font-black text-foreground">Nueva conversación</h2>
                    <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 p-6">
                    <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            Título <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            maxLength={200}
                            placeholder="¿De qué quieres hablar?"
                            className="w-full rounded-xl border border-border/60 bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            required
                        />
                        <p className="mt-1 text-right text-[10px] text-muted-foreground/60">{title.length}/200</p>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            Descripción <span className="text-muted-foreground/50">(opcional)</span>
                        </label>
                        <textarea
                            value={body}
                            onChange={e => setBody(e.target.value)}
                            maxLength={5000}
                            rows={5}
                            placeholder="Desarrolla tu idea, pregunta o análisis..."
                            className="w-full resize-none rounded-xl border border-border/60 bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <p className="mt-1 text-right text-[10px] text-muted-foreground/60">{body.length}/5000</p>
                    </div>

                    {createPost.error && (
                        <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs text-red-400">
                            {createPost.error.message || 'Error al publicar. Inténtalo de nuevo.'}
                        </p>
                    )}

                    <div className="flex justify-end gap-2 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-border/60 px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-secondary transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={!title.trim() || createPost.isPending}
                            className="inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ background: 'linear-gradient(135deg, #bc6c25, #dda15e)' }}
                        >
                            {createPost.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            Publicar
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
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
            postId:         target.id,
            commentId:      null,
            reason:         reason.trim(),
        })
        onClose()
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
                        <h2 className="text-base font-black text-foreground">Reportar publicación</h2>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary transition-colors">
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 p-6">
                    <p className="text-sm text-muted-foreground">
                        Explica brevemente por qué crees que esta publicación incumple las normas de la comunidad.
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
                            {report.error.message?.includes('duplicate') ? 'Ya has reportado esta publicación.' : 'Error al reportar.'}
                        </p>
                    )}
                    {report.isSuccess && (
                        <p className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-2.5 text-xs text-green-400">
                            Reporte enviado. Gracias por ayudar a mantener la comunidad.
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
                            Enviar reporte
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    )
}

// ── Post card ─────────────────────────────────────────────────────────────────

function PostCard({ post, currentUserId, isAdmin, onReport, onDelete }) {
    const bodyPreview = post.body?.slice(0, 160) + (post.body?.length > 160 ? '…' : '')
    const isOwner     = currentUserId === post.user_id

    return (
        <motion.article
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="group rounded-2xl border border-border/50 bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg"
        >
            <div className="flex items-start gap-3">
                <AuthorAvatar name={post.author_name} />
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-foreground">{post.author_name}</span>
                        <span className="text-[10px] text-muted-foreground/60">{formatRelative(post.created_at)}</span>
                    </div>

                    <Link to={`/plaza/${post.id}`} className="mt-1 block">
                        <h2 className="text-base font-black text-foreground transition-colors group-hover:text-primary line-clamp-2">
                            {post.title}
                        </h2>
                    </Link>

                    {bodyPreview && (
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                            {bodyPreview}
                        </p>
                    )}

                    <div className="mt-3 flex items-center gap-4">
                        {/* Stats */}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <ThumbsUp className="h-3.5 w-3.5" />
                            <span>{post.like_count}</span>
                        </div>
                        <Link
                            to={`/plaza/${post.id}`}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>{post.comment_count} comentario{post.comment_count !== 1 ? 's' : ''}</span>
                        </Link>

                        {/* Actions */}
                        <div className="ml-auto flex items-center gap-1">
                            {(isAdmin || isOwner) && (
                                <button
                                    onClick={() => onDelete(post.id)}
                                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
                                >
                                    <Trash2 className="h-3 w-3" />
                                    Eliminar
                                </button>
                            )}
                            {!isOwner && !isAdmin && (
                                <button
                                    onClick={() => onReport(post)}
                                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                                >
                                    <Flag className="h-3 w-3" />
                                    Reportar
                                </button>
                            )}
                            <Link
                                to={`/plaza/${post.id}`}
                                className="rounded-lg border border-border/50 px-3 py-1 text-[11px] font-bold text-foreground hover:bg-secondary transition-colors"
                            >
                                Ver →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </motion.article>
    )
}

// ── Main page ─────────────────────────────────────────────────────────────────

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

export default function LaPlaza() {
    const navigate = useNavigate()
    const { session, user, userProfile, isAdmin } = useAuth()
    const [sort, setSort]           = useState('date')
    const [showNewPost, setShowNewPost] = useState(false)
    const [reportTarget, setReportTarget] = useState(null)

    const { data: posts = [], isLoading, error } = useForumPosts(sort)
    const deletePost = useDeletePost()

    // Auth guard
    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
                <MessageSquare className="h-12 w-12 text-muted-foreground/40" />
                <h1 className="text-2xl font-black text-foreground">La Plaza es solo para miembros</h1>
                <p className="text-sm text-muted-foreground max-w-xs">
                    Inicia sesión para unirte a la conversación.
                </p>
                <Link
                    to="/iniciar-sesion"
                    className="mt-2 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow"
                    style={{ background: 'linear-gradient(135deg, #bc6c25, #dda15e)' }}
                >
                    Iniciar sesión
                </Link>
            </div>
        )
    }

    // Banned guard
    if (userProfile?.is_banned) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
                <ShieldBan className="h-12 w-12 text-red-400" />
                <h1 className="text-2xl font-black text-foreground">Cuenta suspendida</h1>
                <p className="text-sm text-muted-foreground max-w-sm">
                    Tu cuenta ha sido suspendida por incumplir las normas de la comunidad.
                    Si crees que es un error, contacta con el administrador.
                </p>
            </div>
        )
    }

    const authorName = userProfile?.display_name || user?.email?.split('@')[0] || 'Anónimo'

    const handleDelete = async (postId) => {
        if (!window.confirm('¿Eliminar esta publicación? Esta acción no se puede deshacer.')) return
        await deletePost.mutateAsync(postId)
    }

    return (
        <>
            <SEO
                title="La Plaza — Foro de la comunidad"
                description="Debate, comparte análisis y habla de fútbol con la comunidad de Análisis Fútbol."
                path="/plaza"
                noIndex={true}
            />

            <AnimatePresence>
                {showNewPost && (
                    <NewPostModal
                        authorName={authorName}
                        userId={user.id}
                        onClose={() => setShowNewPost(false)}
                    />
                )}
                {reportTarget && (
                    <ReportModal
                        target={reportTarget}
                        reporterUserId={user.id}
                        onClose={() => setReportTarget(null)}
                    />
                )}
            </AnimatePresence>

            <div className="space-y-6 pb-20">

                {/* ── Header ── */}
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={fadeUp}
                    className="relative overflow-hidden rounded-2xl p-8 sm:p-10"
                    style={{ background: 'linear-gradient(135deg, rgba(40,54,24,0.92) 0%, #1a2410 100%)' }}
                >
                    <div
                        aria-hidden
                        className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(221,161,94,0.18) 0%, transparent 70%)' }}
                    />
                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-widest"
                                style={{ borderColor: 'rgba(221,161,94,0.4)', background: 'rgba(221,161,94,0.08)', color: '#dda15e' }}>
                                <MessageSquare className="h-3.5 w-3.5" />
                                Comunidad
                            </div>
                            <h1 className="text-3xl font-black text-white sm:text-4xl">La Plaza</h1>
                            <p className="mt-1 text-sm text-white/60">
                                El espacio donde la comunidad debate, analiza y comparte su pasión por el fútbol.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowNewPost(true)}
                            className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl sm:self-auto"
                            style={{ background: 'linear-gradient(135deg, #bc6c25, #dda15e)' }}
                        >
                            <Plus className="h-4 w-4" />
                            Nueva conversación
                        </button>
                    </div>
                </motion.div>

                {/* ── Sort bar ── */}
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Ordenar:</span>
                    {[
                        { id: 'date',         label: 'Recientes', icon: Clock  },
                        { id: 'interactions', label: 'Más activas', icon: Flame },
                    ].map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setSort(id)}
                            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${sort === id
                                ? 'border-primary/40 bg-primary/10 text-primary'
                                : 'border-border/50 text-muted-foreground hover:border-border hover:text-foreground'
                            }`}
                        >
                            <Icon className="h-3.5 w-3.5" />
                            {label}
                        </button>
                    ))}
                    <span className="ml-auto text-xs text-muted-foreground">
                        {posts.length} conversación{posts.length !== 1 ? 'es' : ''}
                    </span>
                </div>

                {/* ── Post list ── */}
                {isLoading && (
                    <div className="flex items-center justify-center py-20 text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                )}

                {error && (
                    <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        Error al cargar las conversaciones. Recarga la página.
                    </div>
                )}

                {!isLoading && !error && posts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
                        <MessageSquare className="h-10 w-10 text-muted-foreground/30" />
                        <p className="font-black text-foreground">Aún no hay conversaciones</p>
                        <p className="text-sm text-muted-foreground">¡Sé el primero en abrir una!</p>
                        <button
                            onClick={() => setShowNewPost(true)}
                            className="mt-2 inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-bold text-primary hover:bg-primary/20 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Empezar conversación
                        </button>
                    </div>
                )}

                {!isLoading && !error && posts.length > 0 && (
                    <div className="space-y-3">
                        {posts.map((post, i) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: Math.min(i * 0.04, 0.4) }}
                            >
                                <PostCard
                                    post={post}
                                    currentUserId={user.id}
                                    isAdmin={isAdmin}
                                    onReport={setReportTarget}
                                    onDelete={handleDelete}
                                />
                            </motion.div>
                        ))}
                    </div>
                )}

            </div>
        </>
    )
}
