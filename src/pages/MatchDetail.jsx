import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useMatch } from '@/hooks/useMatches'
import { useMatchPlayerStats } from '@/hooks/usePlayerStats'
import { useAuth } from '@/context/AuthContext'
import {
    useMatchComments, useAddComment, useReportComment,
    useDeleteComment, useHideComment, useExpertReview,
    useUpsertExpertReview, useAIBetForMatch, useBanUser
} from '@/hooks/useMatchReviews'
import { validateComment } from '@/lib/spamFilter'
import MatchEditForm from '@/components/matches/MatchEditForm'
import StatBar from '@/components/matches/StatBar'
import GoalTimeline from '@/components/matches/GoalTimeline'
import SEO from '@/components/SEO'
import { matchStructuredData } from '@/components/SEO'
import {
    ArrowLeft, Calendar, MapPin, User, Users, Edit, BarChart2, UserCheck,
    Bot, CheckCircle, XCircle, MessageSquare, ShieldCheck, Flag, Trash2,
    Ban, Send, Loader2, AlertTriangle, Star, ChevronDown, ChevronUp,
    Sparkles, BookOpen
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const BET_LABELS = { home: 'Local', draw: 'Empate', away: 'Visitante' }

const DETAIL_TABS = [
    { id: 'stats', label: 'Estadísticas', icon: BarChart2 },
    { id: 'players', label: 'Jugadores', icon: UserCheck },
    { id: 'analysis', label: 'Análisis IA', icon: Bot },
    { id: 'comments', label: 'Comentarios', icon: MessageSquare },
]

// ─── Player Table ────────────────────────────────────────────────────────────

function PlayerTable({ players, teamName }) {
    if (!players.length) return null
    const starters = players.filter(p => p.is_starter !== false)
    const subs = players.filter(p => p.is_starter === false)

    const Row = ({ p, isSub }) => (
        <tr className="border-b border-border/20 transition-colors hover:bg-primary/5">
            <td className="py-2 pl-3 pr-2">
                <div className="flex items-center gap-2">
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold
                        ${isSub ? 'bg-secondary text-muted-foreground' : 'bg-primary/15 text-primary'}`}>
                        {p.shirt_number ?? p.player_name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground leading-tight">{p.player_name}</p>
                        <p className="text-[10px] text-muted-foreground">{p.position || (isSub ? 'SUB' : '—')}</p>
                    </div>
                    {p.minutes != null && (
                        <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">{p.minutes}'</span>
                    )}
                </div>
            </td>
            <td className="px-2 py-2 text-center text-sm">
                {p.goals > 0 ? <span className="font-bold text-win">⚽ {p.goals}</span> : <span className="text-muted-foreground/40">—</span>}
            </td>
            <td className="px-2 py-2 text-center text-sm">
                {p.assists > 0 ? <span className="font-bold text-primary">{p.assists}</span> : <span className="text-muted-foreground/40">—</span>}
            </td>
            <td className="px-2 py-2 text-center text-xs text-muted-foreground">{p.shots || '—'}</td>
            <td className="px-2 py-2 text-center">
                <span className="inline-flex gap-1">
                    {Array.from({ length: p.yellow_cards || 0 }).map((_, i) => (
                        <span key={i} className="inline-block h-3 w-2 rounded-sm bg-yellow-400" />
                    ))}
                    {Array.from({ length: p.red_cards || 0 }).map((_, i) => (
                        <span key={i} className="inline-block h-3 w-2 rounded-sm bg-red-500" />
                    ))}
                    {!p.yellow_cards && !p.red_cards && <span className="text-muted-foreground/30 text-xs">—</span>}
                </span>
            </td>
            <td className="px-2 py-2 text-center text-xs text-muted-foreground">
                {p.gk_saves != null ? (
                    <span className="font-semibold text-primary">{p.gk_saves} ({p.gk_shots_faced})</span>
                ) : '—'}
            </td>
        </tr>
    )

    return (
        <div className="overflow-hidden rounded-xl border border-border/50 bg-card">
            <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
                <h4 className="text-sm font-bold text-foreground">{teamName}</h4>
                <span className="text-xs text-muted-foreground">{starters.length} titulares · {subs.length} suplentes</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border/30 text-[10px] uppercase tracking-wider text-muted-foreground">
                            <th className="py-2 pl-3 text-left font-semibold">Jugador</th>
                            <th className="px-2 py-2 text-center font-semibold">G</th>
                            <th className="px-2 py-2 text-center font-semibold">A</th>
                            <th className="px-2 py-2 text-center font-semibold">Tiros</th>
                            <th className="px-2 py-2 text-center font-semibold">Tarj.</th>
                            <th className="px-2 py-2 text-center font-semibold">Paradas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {starters.map(p => <Row key={p.id} p={p} isSub={false} />)}
                        {subs.length > 0 && (
                            <tr>
                                <td colSpan={6} className="bg-secondary/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                                    Suplentes
                                </td>
                            </tr>
                        )}
                        {subs.map(p => <Row key={p.id} p={p} isSub={true} />)}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

// ─── AI Analysis Section ─────────────────────────────────────────────────────

function AIAnalysisSection({ matchId, match }) {
    const { data: aiBet, isLoading } = useAIBetForMatch(matchId)

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        )
    }

    if (!aiBet) {
        return (
            <div className="rounded-2xl border border-border/40 bg-card/60 py-12 text-center">
                <Bot className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                <p className="text-muted-foreground text-sm">La IA no apostó en este partido.</p>
            </div>
        )
    }

    const isSettled = aiBet.status === 'won' || aiBet.status === 'lost'
    const isWon = aiBet.status === 'won'
    const homeGoals = match?.home_goals
    const awayGoals = match?.away_goals
    const hasResult = homeGoals != null

    // Generate analysis of why the prediction was correct or wrong
    const getAnalysis = () => {
        if (!hasResult) return null

        const predicted = aiBet.bet_type
        let actualResult = 'draw'
        if (homeGoals > awayGoals) actualResult = 'home'
        else if (awayGoals > homeGoals) actualResult = 'away'

        const homeTeam = match?.home_team?.short_name || match?.home_team?.name || 'Local'
        const awayTeam = match?.away_team?.short_name || match?.away_team?.name || 'Visitante'
        const score = `${homeGoals}-${awayGoals}`

        if (isWon) {
            const reasons = []
            if (predicted === 'home') {
                reasons.push(`La IA predijo correctamente la victoria local de ${homeTeam}.`)
                if (homeGoals - awayGoals >= 2) reasons.push(`Victoria contundente por ${score}, lo que indica que el análisis de la forma local era acertado.`)
                else reasons.push(`Victoria ajustada ${score}, pero el análisis identificó correctamente la ventaja local.`)
            } else if (predicted === 'away') {
                reasons.push(`La IA acertó con la victoria visitante de ${awayTeam}.`)
                reasons.push(`Resultado final ${score}. Los factores clave identificados se cumplieron.`)
            } else {
                reasons.push(`La IA predijo correctamente el empate.`)
                reasons.push(`Resultado final ${score}. El análisis de igualdad entre ambos equipos fue preciso.`)
            }
            return reasons.join(' ')
        } else {
            const reasons = []
            reasons.push(`La IA predijo ${BET_LABELS[predicted]} pero el resultado fue ${score} (${BET_LABELS[actualResult]}).`)

            if (predicted === 'home' && actualResult === 'away') {
                reasons.push(`${awayTeam} sorprendió fuera de casa. Posiblemente la IA sobrevaloró la ventaja local o no consideró cambios tácticos recientes.`)
            } else if (predicted === 'home' && actualResult === 'draw') {
                reasons.push(`${homeTeam} no logró imponerse como esperaba la IA. El empate sugiere que la defensa visitante fue más sólida de lo estimado.`)
            } else if (predicted === 'away' && actualResult === 'home') {
                reasons.push(`${homeTeam} fue más fuerte de lo esperado. La IA subestimó el factor campo o la forma reciente del local.`)
            } else if (predicted === 'away' && actualResult === 'draw') {
                reasons.push(`${awayTeam} no logró la victoria como predijo la IA. Posible partido más equilibrado de lo anticipado.`)
            } else if (predicted === 'draw') {
                reasons.push(`El partido no fue tan equilibrado como estimó la IA. ${actualResult === 'home' ? homeTeam : awayTeam} demostró superioridad.`)
            }
            return reasons.join(' ')
        }
    }

    const analysis = aiBet.post_analysis || getAnalysis()

    return (
        <div className="space-y-4">
            {/* AI Prediction Card */}
            <div className={`rounded-2xl border overflow-hidden ${isSettled
                ? isWon
                    ? 'border-green-500/30 bg-green-500/5'
                    : 'border-red-500/30 bg-red-500/5'
                : 'border-primary/30 bg-primary/5'
                }`}>
                <div className="flex items-center justify-between border-b border-border/30 px-5 py-3">
                    <div className="flex items-center gap-2">
                        <Bot className="h-5 w-5 text-primary" />
                        <span className="text-sm font-bold text-foreground">Predicción IA</span>
                    </div>
                    {isSettled && (
                        <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${isWon
                            ? 'border-green-500/30 bg-green-500/15 text-green-400'
                            : 'border-red-500/30 bg-red-500/15 text-red-400'
                            }`}>
                            {isWon ? <CheckCircle className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                            {isWon ? 'Acertó' : 'Falló'}
                        </span>
                    )}
                    {!isSettled && (
                        <span className="rounded-full border border-yellow-500/30 bg-yellow-500/15 px-3 py-1 text-xs font-bold text-yellow-400">
                            Pendiente
                        </span>
                    )}
                </div>

                <div className="px-5 py-4 space-y-3">
                    {/* Prediction details */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-lg border border-primary/30 bg-primary/15 px-3 py-1.5 text-sm font-bold text-primary">
                            🤖 {BET_LABELS[aiBet.bet_type]} @{aiBet.odds}
                        </span>
                        <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${aiBet.confidence === 'alta'
                            ? 'border-green-500/40 bg-green-500/15 text-green-400'
                            : aiBet.confidence === 'media'
                                ? 'border-yellow-500/40 bg-yellow-500/15 text-yellow-400'
                                : 'border-red-500/40 bg-red-500/15 text-red-400'
                            }`}>
                            Confianza {aiBet.confidence}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            🪙 {aiBet.stake} apostadas
                        </span>
                    </div>

                    {/* Original reasoning */}
                    {aiBet.reasoning && (
                        <div className="rounded-xl border border-border/30 bg-background/50 p-3">
                            <div className="flex items-start gap-2">
                                <Sparkles className="h-4 w-4 text-primary/60 shrink-0 mt-0.5" />
                                <p className="text-sm text-muted-foreground leading-relaxed">{aiBet.reasoning}</p>
                            </div>
                        </div>
                    )}

                    {/* Key factors */}
                    {aiBet.key_factors?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {aiBet.key_factors.map((f, i) => (
                                <span key={i} className="rounded-full border border-border/40 bg-secondary/60 px-2.5 py-0.5 text-[11px] text-muted-foreground">
                                    {f}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Post-match analysis */}
                    {analysis && isSettled && (
                        <div className={`rounded-xl border p-4 ${isWon
                            ? 'border-green-500/20 bg-green-500/5'
                            : 'border-red-500/20 bg-red-500/5'
                            }`}>
                            <div className="flex items-start gap-2">
                                <BookOpen className={`h-4 w-4 shrink-0 mt-0.5 ${isWon ? 'text-green-400' : 'text-red-400'}`} />
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                                        {isWon ? '¿Por qué acertó?' : '¿Por qué falló?'}
                                    </p>
                                    <p className="text-sm text-foreground/80 leading-relaxed">{analysis}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// ─── Expert Review Section ───────────────────────────────────────────────────

function ExpertReviewSection({ matchId }) {
    const { isAdmin } = useAuth()
    const { data: review, isLoading } = useExpertReview(matchId)
    const { mutate: upsertReview, isPending: saving } = useUpsertExpertReview()
    const [editing, setEditing] = useState(false)
    const [content, setContent] = useState('')

    const handleStartEdit = () => {
        setContent(review?.content || '')
        setEditing(true)
    }

    const handleSave = () => {
        if (!content.trim()) return
        upsertReview(
            { matchId: Number(matchId), content },
            {
                onSuccess: () => setEditing(false),
            }
        )
    }

    return (
        <div className="rounded-2xl border border-border/40 bg-card/70 overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/30 px-5 py-3">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-green-400" />
                    <span className="text-sm font-bold text-foreground">Análisis del Experto</span>
                </div>
                {isAdmin && !editing && (
                    <button
                        onClick={handleStartEdit}
                        className="flex items-center gap-1.5 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-400 hover:bg-green-500/20 transition-colors"
                    >
                        <Edit className="h-3 w-3" />
                        {review ? 'Editar' : 'Añadir análisis'}
                    </button>
                )}
            </div>

            <div className="p-5">
                {isLoading ? (
                    <div className="flex justify-center py-6">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                ) : editing ? (
                    <div className="space-y-3">
                        <textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            placeholder="Escribe tu análisis experto del partido... (sin límite de caracteres)"
                            rows={8}
                            className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground placeholder-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-y"
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => setEditing(false)}
                                className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !content.trim()}
                                className="flex items-center gap-1.5 rounded-lg bg-green-500/20 border border-green-500/30 px-4 py-2 text-sm font-semibold text-green-400 hover:bg-green-500/30 transition-colors disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                                Guardar
                            </button>
                        </div>
                    </div>
                ) : review ? (
                    <div className="space-y-2">
                        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{review.content}</p>
                        <div className="flex items-center gap-2 pt-2 text-[11px] text-muted-foreground/60">
                            <ShieldCheck className="h-3 w-3 text-green-400/60" />
                            <span>Por {review.admin?.display_name || 'Admin'}</span>
                            <span>·</span>
                            <span>{new Date(review.updated_at || review.created_at).toLocaleDateString('es-ES', {
                                day: 'numeric', month: 'long', year: 'numeric'
                            })}</span>
                        </div>
                    </div>
                ) : (
                    <div className="py-6 text-center">
                        <ShieldCheck className="mx-auto mb-2 h-8 w-8 text-muted-foreground/20" />
                        <p className="text-sm text-muted-foreground/60">Aún no hay análisis del experto para este partido.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── Comments Section ────────────────────────────────────────────────────────

function CommentsSection({ matchId }) {
    const { session, isAdmin } = useAuth()
    const { data: comments = [], isLoading } = useMatchComments(matchId)
    const { mutate: addComment, isPending: adding } = useAddComment()
    const { mutate: reportComment } = useReportComment()
    const { mutate: deleteComment } = useDeleteComment()
    const { mutate: hideComment } = useHideComment()
    const { mutate: banUser } = useBanUser()
    const [newComment, setNewComment] = useState('')
    const [error, setError] = useState(null)
    const [reportedIds, setReportedIds] = useState(new Set())

    const handleSubmit = () => {
        setError(null)
        const validation = validateComment(newComment)
        if (!validation.valid) {
            setError(validation.reason)
            return
        }

        addComment(
            { matchId: Number(matchId), content: newComment },
            {
                onSuccess: () => {
                    setNewComment('')
                    setError(null)
                },
                onError: (err) => setError(err.message),
            }
        )
    }

    const handleReport = (commentId) => {
        reportComment(
            { commentId },
            {
                onSuccess: () => setReportedIds(prev => new Set([...prev, commentId])),
                onError: (err) => { if (err.message.includes('Ya has')) setReportedIds(prev => new Set([...prev, commentId])) }
            }
        )
    }

    return (
        <div className="space-y-4">
            <div className="rounded-2xl border border-border/40 bg-card/70 overflow-hidden">
                <div className="flex items-center justify-between border-b border-border/30 px-5 py-3">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        <span className="text-sm font-bold text-foreground">Comentarios</span>
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                            {comments.length}
                        </span>
                    </div>
                </div>

                <div className="divide-y divide-border/20">
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="py-8 text-center">
                            <MessageSquare className="mx-auto mb-2 h-8 w-8 text-muted-foreground/20" />
                            <p className="text-sm text-muted-foreground/60">Sé el primero en comentar este partido.</p>
                        </div>
                    ) : (
                        comments.map(comment => (
                            <div key={comment.id} className="px-5 py-3 hover:bg-primary/3 transition-colors">
                                <div className="flex items-start gap-3">
                                    {/* Avatar */}
                                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${comment.user_profile?.is_admin
                                        ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                                        : 'bg-primary/15 border border-primary/20 text-primary'
                                        }`}>
                                        {comment.user_profile?.display_name?.[0]?.toUpperCase() || '?'}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-sm font-semibold text-foreground">
                                                {comment.user_profile?.display_name || 'Usuario'}
                                            </span>
                                            {comment.user_profile?.is_admin && (
                                                <span className="rounded-full bg-green-500/15 border border-green-500/20 px-1.5 py-0.5 text-[9px] font-bold text-green-400">
                                                    ADMIN
                                                </span>
                                            )}
                                            <span className="text-[11px] text-muted-foreground/50">
                                                {new Date(comment.created_at).toLocaleDateString('es-ES', {
                                                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                                            {comment.content}
                                        </p>

                                        {/* Actions */}
                                        <div className="mt-2 flex items-center gap-2">
                                            {session && !comment.user_profile?.is_admin && (
                                                <button
                                                    onClick={() => handleReport(comment.id)}
                                                    disabled={reportedIds.has(comment.id)}
                                                    className="flex items-center gap-1 text-[11px] text-muted-foreground/50 hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                    title="Reportar comentario"
                                                >
                                                    <Flag className="h-3 w-3" />
                                                    {reportedIds.has(comment.id) ? 'Reportado' : 'Reportar'}
                                                </button>
                                            )}
                                            {isAdmin && (
                                                <>
                                                    <button
                                                        onClick={() => hideComment({ commentId: comment.id })}
                                                        className="flex items-center gap-1 text-[11px] text-muted-foreground/50 hover:text-orange-400 transition-colors"
                                                        title="Ocultar comentario"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                        Ocultar
                                                    </button>
                                                    <button
                                                        onClick={() => deleteComment({ commentId: comment.id })}
                                                        className="flex items-center gap-1 text-[11px] text-muted-foreground/50 hover:text-red-400 transition-colors"
                                                        title="Eliminar comentario"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                        Eliminar
                                                    </button>
                                                    {!comment.user_profile?.is_admin && (
                                                        <button
                                                            onClick={() => banUser({ userId: comment.user_id, ban: true, reason: 'Comentario inapropiado' })}
                                                            className="flex items-center gap-1 text-[11px] text-muted-foreground/50 hover:text-red-500 transition-colors"
                                                            title="Banear usuario"
                                                        >
                                                            <Ban className="h-3 w-3" />
                                                            Banear
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                            {comment.reported_count > 0 && isAdmin && (
                                                <span className="text-[10px] text-red-400/60">
                                                    ⚠ {comment.reported_count} reportes
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Add comment form */}
                {session ? (
                    <div className="border-t border-border/30 p-4">
                        <div className="space-y-2">
                            <textarea
                                value={newComment}
                                onChange={e => { setNewComment(e.target.value); setError(null) }}
                                placeholder="Escribe un comentario sobre el partido..."
                                rows={2}
                                maxLength={2000}
                                className="w-full rounded-xl border border-border bg-background/80 px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                                onKeyDown={e => {
                                    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
                                        e.preventDefault()
                                        handleSubmit()
                                    }
                                }}
                            />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-muted-foreground/40">
                                        {newComment.length}/2000
                                    </span>
                                    {error && (
                                        <span className="flex items-center gap-1 text-[11px] text-red-400">
                                            <AlertTriangle className="h-3 w-3" /> {error}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={handleSubmit}
                                    disabled={adding || !newComment.trim()}
                                    className="flex items-center gap-1.5 rounded-lg bg-primary/15 border border-primary/20 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/25 transition-colors disabled:opacity-40"
                                >
                                    {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                    Comentar
                                </button>
                            </div>
                            <p className="text-[10px] text-muted-foreground/40 text-center">
                                No se permiten enlaces, URLs ni documentos · Máx. 2000 caracteres
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="border-t border-border/30 p-4 text-center">
                        <p className="text-sm text-muted-foreground">
                            <Link to="/iniciar-sesion" className="text-primary hover:underline font-medium">
                                Inicia sesión
                            </Link>
                            {' '}para dejar un comentario.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function MatchDetail() {
    const { matchId } = useParams()
    const navigate = useNavigate()
    const { data: match, isLoading, error } = useMatch(matchId)
    const { data: playerStats = [] } = useMatchPlayerStats(matchId)
    const { session, isAdmin } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [activeTab, setActiveTab] = useState('stats')

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
        )
    }

    if (error || !match) {
        return (
            <div className="py-20 text-center">
                <p className="text-muted-foreground">Partido no encontrado</p>
                <button onClick={() => navigate('/')} className="mt-4 inline-block text-sm text-primary hover:underline">
                    ← Volver al Dashboard
                </button>
            </div>
        )
    }

    if (isEditing) {
        return (
            <div className="max-w-2xl mx-auto py-10">
                <MatchEditForm match={match} onClose={() => setIsEditing(false)} />
            </div>
        )
    }

    const homeTeam = match.home_team?.name || 'Local'
    const awayTeam = match.away_team?.name || 'Visitante'
    const homeShort = match.home_team?.short_name || homeTeam
    const awayShort = match.away_team?.short_name || awayTeam
    const isHomeWin = match.home_goals > match.away_goals
    const isAwayWin = match.away_goals > match.home_goals

    const matchDate = match.match_date
        ? new Date(match.match_date).toLocaleDateString('es-ES', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        })
        : ''

    const homePlayers = playerStats.filter(p => p.is_home)
    const awayPlayers = playerStats.filter(p => !p.is_home)
    const homeCorners = match.home_corners
    const awayCorners = match.away_corners

    // SEO
    const seoTitle = `${homeShort} vs ${awayShort} · Jornada ${match.matchday || ''} La Liga`
    const seoDesc = match.home_goals != null
        ? `Resultado ${homeShort} ${match.home_goals}-${match.away_goals} ${awayShort}. Estadísticas completas, análisis IA y comentarios del partido de La Liga 2025-2026.`
        : `Previa ${homeShort} vs ${awayShort} en La Liga 2025-2026. Estadísticas, predicciones y análisis.`

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <SEO
                title={seoTitle}
                description={seoDesc}
                path={`/partido/${matchId}`}
                type="article"
                structuredData={matchStructuredData(match)}
            />

            {/* Header Actions */}
            <div className="flex justify-between items-center">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver
                </button>
                {session && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar Partido
                    </Button>
                )}
            </div>

            {/* Scoreboard */}
            <div className="rounded-2xl border border-border/50 bg-gradient-to-b from-card to-background p-6 sm:p-8">
                <div className="mb-6 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
                    {match.matchday && (
                        <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
                            Jornada {match.matchday}
                        </span>
                    )}
                    {matchDate && (
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {matchDate}
                        </span>
                    )}
                    {match.kick_off_time && <span>{match.kick_off_time}</span>}
                </div>

                <div className="flex items-center justify-center gap-4 sm:gap-8">
                    <div className="flex flex-1 flex-col items-center gap-4 text-center">
                        {match.home_team?.logo_url && (
                            <img src={match.home_team.logo_url} alt={homeTeam} className="h-16 w-16 object-contain drop-shadow-md sm:h-20 sm:w-20" />
                        )}
                        <div>
                            <h2 className={`text-xl font-black sm:text-2xl ${isHomeWin ? 'text-foreground' : 'text-muted-foreground'}`}>{homeTeam}</h2>
                            {match.home_formation && <p className="mt-1 text-xs text-muted-foreground">{match.home_formation}</p>}
                            {match.home_coach && <p className="mt-0.5 text-[11px] text-muted-foreground/60">{match.home_coach}</p>}
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 text-4xl font-black tabular-nums sm:text-5xl">
                            <span className={isHomeWin ? 'text-win' : 'text-muted-foreground'}>{match.home_goals}</span>
                            <span className="text-2xl text-muted-foreground/30">-</span>
                            <span className={isAwayWin ? 'text-win' : 'text-muted-foreground'}>{match.away_goals}</span>
                        </div>
                        {(match.home_xg != null || match.away_xg != null) && (
                            <p className="mt-1 text-xs text-muted-foreground/60">
                                xG: {Number(match.home_xg || 0).toFixed(2)} - {Number(match.away_xg || 0).toFixed(2)}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-1 flex-col items-center gap-4 text-center">
                        {match.away_team?.logo_url && (
                            <img src={match.away_team.logo_url} alt={awayTeam} className="h-16 w-16 object-contain drop-shadow-md sm:h-20 sm:w-20" />
                        )}
                        <div>
                            <h2 className={`text-xl font-black sm:text-2xl ${isAwayWin ? 'text-foreground' : 'text-muted-foreground'}`}>{awayTeam}</h2>
                            {match.away_formation && <p className="mt-1 text-xs text-muted-foreground">{match.away_formation}</p>}
                            {match.away_coach && <p className="mt-0.5 text-[11px] text-muted-foreground/60">{match.away_coach}</p>}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground/60">
                    {match.stadium && (
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{match.stadium}</span>
                    )}
                    {(match.referee_data?.name || match.referee) && (
                        <span className="flex items-center gap-1"><User className="h-3 w-3" />{match.referee_data?.name || match.referee}</span>
                    )}
                    {match.attendance && (
                        <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {Number(match.attendance).toLocaleString('es-ES')} espectadores
                        </span>
                    )}
                </div>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-1 overflow-x-auto rounded-xl border border-border/50 bg-card/50 p-1">
                {DETAIL_TABS.map(tab => {
                    const Icon = tab.icon
                    const active = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-all
                                ${active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {active && (
                                <motion.div
                                    layoutId="match-tab-bg"
                                    className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20"
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                                />
                            )}
                            <Icon className="relative h-4 w-4" />
                            <span className="relative">{tab.label}</span>
                        </button>
                    )
                })}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
                {activeTab === 'stats' && (
                    <motion.div
                        key="stats"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="grid gap-6 lg:grid-cols-2"
                    >
                        <div className="rounded-xl border border-border/50 bg-card p-5">
                            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                Estadísticas del Partido
                            </h3>
                            <div className="space-y-1">
                                {match.home_possession != null && (
                                    <StatBar label="Posesión" homeValue={match.home_possession} awayValue={match.away_possession} format="percent" />
                                )}
                                {match.home_shots != null && (
                                    <StatBar label="Tiros" homeValue={match.home_shots} awayValue={match.away_shots} />
                                )}
                                {match.home_shots_on_target != null && (
                                    <StatBar label="Tiros a puerta" homeValue={match.home_shots_on_target} awayValue={match.away_shots_on_target} />
                                )}
                                {match.home_shots_off_target != null && (
                                    <StatBar label="Tiros fuera" homeValue={match.home_shots_off_target} awayValue={match.away_shots_off_target} />
                                )}
                                {match.home_saves != null && (
                                    <StatBar label="Paradas" homeValue={match.home_saves} awayValue={match.away_saves} />
                                )}
                                {homeCorners != null && (
                                    <StatBar label="Córners" homeValue={homeCorners} awayValue={awayCorners} />
                                )}
                                {match.home_crosses != null && (
                                    <StatBar label="Centros" homeValue={match.home_crosses} awayValue={match.away_crosses} />
                                )}
                                {match.home_interceptions != null && (
                                    <StatBar label="Intercepciones" homeValue={match.home_interceptions} awayValue={match.away_interceptions} />
                                )}
                                {match.home_fouls != null && (
                                    <StatBar label="Faltas" homeValue={match.home_fouls} awayValue={match.away_fouls} highlight="lower" />
                                )}
                                {match.home_yellow_cards != null && (
                                    <StatBar label="Tarjetas amarillas" homeValue={match.home_yellow_cards} awayValue={match.away_yellow_cards} highlight="lower" />
                                )}
                                {match.home_red_cards != null && (
                                    <StatBar label="Tarjetas rojas" homeValue={match.home_red_cards} awayValue={match.away_red_cards} highlight="lower" />
                                )}
                                {match.home_offsides != null && (
                                    <StatBar label="Fueras de juego" homeValue={match.home_offsides} awayValue={match.away_offsides} highlight="lower" />
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <GoalTimeline
                                homeGoalMinutes={match.home_goal_minutes}
                                awayGoalMinutes={match.away_goal_minutes}
                                homeTeam={homeTeam}
                                awayTeam={awayTeam}
                            />
                            {match.home_odds && (
                                <div className="rounded-xl border border-border/50 bg-card/50 p-4">
                                    <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Cuotas</h4>
                                    <div className="grid grid-cols-3 gap-3 text-center">
                                        <div className="rounded-lg bg-secondary/50 p-3">
                                            <p className="text-[10px] font-medium text-muted-foreground">Local</p>
                                            <p className="mt-1 text-lg font-bold text-foreground">{Number(match.home_odds).toFixed(2)}</p>
                                        </div>
                                        <div className="rounded-lg bg-secondary/50 p-3">
                                            <p className="text-[10px] font-medium text-muted-foreground">Empate</p>
                                            <p className="mt-1 text-lg font-bold text-foreground">{Number(match.draw_odds).toFixed(2)}</p>
                                        </div>
                                        <div className="rounded-lg bg-secondary/50 p-3">
                                            <p className="text-[10px] font-medium text-muted-foreground">Visitante</p>
                                            <p className="mt-1 text-lg font-bold text-foreground">{Number(match.away_odds).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'players' && (
                    <motion.div
                        key="players"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="grid gap-6 lg:grid-cols-2"
                    >
                        {homePlayers.length > 0
                            ? <PlayerTable players={homePlayers} teamName={homeTeam} />
                            : <div className="flex items-center justify-center rounded-xl border border-dashed border-border/50 py-12 text-muted-foreground text-sm">Sin datos de jugadores</div>
                        }
                        {awayPlayers.length > 0
                            ? <PlayerTable players={awayPlayers} teamName={awayTeam} />
                            : <div className="flex items-center justify-center rounded-xl border border-dashed border-border/50 py-12 text-muted-foreground text-sm">Sin datos de jugadores</div>
                        }
                    </motion.div>
                )}

                {activeTab === 'analysis' && (
                    <motion.div
                        key="analysis"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="space-y-6"
                    >
                        <AIAnalysisSection matchId={Number(matchId)} match={match} />
                        <ExpertReviewSection matchId={Number(matchId)} />
                    </motion.div>
                )}

                {activeTab === 'comments' && (
                    <motion.div
                        key="comments"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                    >
                        <CommentsSection matchId={Number(matchId)} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
