import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Bot, Send, Loader2, TrendingUp, TrendingDown, Minus,
    Trophy, Wallet, Target, Zap, CheckCircle,
    AlertCircle, Clock, ChevronDown, ChevronUp, Sparkles, TriangleAlert,
    ExternalLink
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useAIBets, useAIBotStats, useGenerateAIBets, useAIChat } from '@/hooks/useAI'
import { matchHasStarted } from '@/hooks/useBetting'
import SEO from '@/components/SEO'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCoins(n) {
    if (n == null) return '—'
    return Number(n).toLocaleString('es-ES', { maximumFractionDigits: 0 })
}

function formatDate(d) {
    if (!d) return ''
    return new Date(d).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
}

const BET_LABELS  = { home: 'Local', draw: 'Empate', away: 'Visitante' }
const CONF_STYLES = {
    alta:  'border-green-500/40 bg-green-500/15 text-green-400',
    media: 'border-yellow-500/40 bg-yellow-500/15 text-yellow-400',
    baja:  'border-red-500/40 bg-red-500/15 text-red-400',
}
const STATUS_STYLES = {
    pending: 'text-yellow-400',
    won:     'text-green-400',
    lost:    'text-red-400',
    void:    'text-muted-foreground',
}
const STATUS_LABELS = { pending: 'Pendiente', won: '✅ Ganada', lost: '❌ Perdida', void: 'Anulada' }

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub = null, accent = false }) {
    return (
        <div className={`rounded-xl border px-4 py-3 ${accent
            ? 'border-primary/30 bg-primary/10'
            : 'border-border/40 bg-card/60'}`
        }>
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Icon className={`h-3.5 w-3.5 ${accent ? 'text-primary' : ''}`} />
                <span className="text-[11px] uppercase tracking-wide">{label}</span>
            </div>
            <p className={`text-xl font-black ${accent ? 'text-primary' : 'text-foreground'}`}>{value}</p>
            {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
        </div>
    )
}

// ─── AI Bet Card ─────────────────────────────────────────────────────────────

function AIBetCard({ bet }) {
    const [expanded, setExpanded] = useState(false)
    const navigate = useNavigate()
    const m = bet.match
    const started = matchHasStarted(m?.match_date, m?.kick_off_time)
    const isSettled = bet.status === 'won' || bet.status === 'lost'

    const handleCardClick = () => {
        if (m?.id) navigate(`/partido/${m.id}`)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border border-border/40 bg-card/70 backdrop-blur-sm overflow-hidden transition-all ${
                isSettled ? 'cursor-pointer hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5' : ''
            }`}
            onClick={isSettled ? handleCardClick : undefined}
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/30 px-4 py-2.5">
                <div className="flex items-center gap-2">
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                        J{m?.matchday}
                    </span>
                    {started && bet.status === 'pending' && (
                        <span className="flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-[10px] font-bold text-orange-400">
                            <Clock className="h-2.5 w-2.5" /> En curso
                        </span>
                    )}
                    {isSettled && (
                        <span className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                            bet.status === 'won'
                                ? 'border-green-500/30 bg-green-500/10 text-green-400'
                                : 'border-red-500/30 bg-red-500/10 text-red-400'
                        }`}>
                            {bet.status === 'won' ? <CheckCircle className="h-2.5 w-2.5" /> : <AlertCircle className="h-2.5 w-2.5" />}
                            {bet.status === 'won' ? 'Acertó' : 'Falló'}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground">
                        {formatDate(m?.match_date)}
                        {m?.kick_off_time && ` · ${m.kick_off_time.slice(0, 5)}`}
                    </span>
                    {isSettled && (
                        <ExternalLink className="h-3.5 w-3.5 text-primary/50" />
                    )}
                </div>
            </div>

            <div className="px-4 py-3 space-y-3">
                {/* Teams */}
                <div className="flex items-center gap-2">
                    <div className="flex flex-1 flex-col items-center gap-1 text-center">
                        {m?.home_team?.logo_url
                            ? <img src={m.home_team.logo_url} alt="" className="h-8 w-8 object-contain" />
                            : <div className="h-8 w-8 rounded-full bg-secondary" />
                        }
                        <span className="text-xs font-semibold text-foreground leading-tight">
                            {m?.home_team?.short_name || m?.home_team?.name}
                        </span>
                        {m?.home_goals != null && (
                            <span className="text-lg font-black text-foreground">{m.home_goals}</span>
                        )}
                    </div>
                    <span className="text-sm font-black text-muted-foreground/40">
                        {m?.home_goals != null ? '—' : 'VS'}
                    </span>
                    <div className="flex flex-1 flex-col items-center gap-1 text-center">
                        {m?.away_team?.logo_url
                            ? <img src={m.away_team.logo_url} alt="" className="h-8 w-8 object-contain" />
                            : <div className="h-8 w-8 rounded-full bg-secondary" />
                        }
                        <span className="text-xs font-semibold text-foreground leading-tight">
                            {m?.away_team?.short_name || m?.away_team?.name}
                        </span>
                        {m?.away_goals != null && (
                            <span className="text-lg font-black text-foreground">{m.away_goals}</span>
                        )}
                    </div>
                </div>

                {/* Bet info row */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="rounded-lg border border-primary/30 bg-primary/15 px-2.5 py-1 text-xs font-bold text-primary">
                        🤖 {BET_LABELS[bet.bet_type]} @{bet.odds}
                    </span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${CONF_STYLES[bet.confidence]}`}>
                        Confianza {bet.confidence}
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground">
                        🪙 {formatCoins(bet.stake)} → <span className={`font-semibold ${STATUS_STYLES[bet.status]}`}>
                            {bet.status === 'won'
                                ? `+${formatCoins(bet.potential_payout - bet.stake)}`
                                : bet.status === 'lost'
                                    ? `-${formatCoins(bet.stake)}`
                                    : STATUS_LABELS[bet.status]
                            }
                        </span>
                    </span>
                </div>

                {/* Expandable reasoning */}
                {bet.reasoning && (
                    <button
                        onClick={(e) => { e.stopPropagation(); setExpanded(e2 => !expanded) }}
                        className="flex w-full items-center gap-1.5 text-left text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Sparkles className="h-3 w-3 text-primary/60 shrink-0" />
                        <span className={expanded ? '' : 'line-clamp-1'}>{bet.reasoning}</span>
                        {expanded ? <ChevronUp className="h-3 w-3 shrink-0" /> : <ChevronDown className="h-3 w-3 shrink-0" />}
                    </button>
                )}

                {/* Key factors */}
                <AnimatePresence>
                    {expanded && bet.key_factors?.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="flex flex-wrap gap-1.5 pt-1">
                                {bet.key_factors.map((f, i) => (
                                    <span key={i} className="rounded-full border border-border/40 bg-secondary/60 px-2 py-0.5 text-[10px] text-muted-foreground">
                                        {f}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* CTA for settled bets */}
                {isSettled && (
                    <div className="flex items-center justify-center gap-1.5 rounded-lg border border-primary/15 bg-primary/5 py-1.5 text-[11px] font-medium text-primary/70">
                        <ExternalLink className="h-3 w-3" />
                        Ver análisis completo del partido
                    </div>
                )}
            </div>
        </motion.div>
    )
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

function ChatMessage({ role, content }) {
    const isBot = role === 'assistant'
    return (
        <div className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'}`}>
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isBot
                ? 'border border-primary/30 bg-primary/15 text-primary'
                : 'bg-secondary text-muted-foreground'
            }`}>
                {isBot ? <Bot className="h-4 w-4" /> : 'Tú'}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${isBot
                ? 'rounded-tl-none border border-border/40 bg-card/80 text-foreground'
                : 'rounded-tr-none bg-primary/15 text-foreground border border-primary/20'
            }`}>
                {content}
            </div>
        </div>
    )
}

function ChatSection() {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: '¡Hola! 👋 Soy el asistente IA de Análisis Fútbol. Puedo responder preguntas sobre los equipos, partidos y estadísticas de La Liga 2025-26. ¿Qué quieres saber?'
        }
    ])
    const [input, setInput] = useState('')
    const [remaining, setRemaining] = useState(20) // optimistic default until first response
    const { mutate: _sendMsg, isPending } = useAIChat()

    // Wrap mutate in promise so we can use try/catch
    const sendMessage = (args) => new Promise((resolve, reject) => {
        _sendMsg(args, { onSuccess: resolve, onError: reject })
    })
    const bottomRef = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isPending])

    const handleSend = () => {
        const msg = input.trim()
        if (!msg || isPending || remaining === 0) return
        setInput('')

        const history = messages
            .slice(1)  // skip welcome message
            .map(m => ({ role: m.role, content: m.content }))

        setMessages(prev => [...prev, { role: 'user', content: msg }])

        sendMessage({ message: msg, history })
            .then(data => {
                if (data.remaining !== undefined) setRemaining(data.remaining)
                setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
            })
            .catch(err => {
                const isRateLimit = err.message?.includes('límite diario')
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: isRateLimit
                        ? '⚠️ ' + err.message
                        : '❌ Error al conectar con el asistente: ' + err.message
                }])
                if (isRateLimit) setRemaining(0)
            })
    }

    return (
        <div className="flex flex-col rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border/30 px-4 py-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-primary/30 bg-primary/15">
                    <Bot className="h-4 w-4 text-primary" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-foreground">Asistente IA</p>
                    <p className="text-[10px] text-muted-foreground">Pregunta sobre equipos, estadísticas y más</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <span className={`text-[10px] font-medium ${
                        remaining <= 5 ? 'text-red-400' : remaining <= 10 ? 'text-yellow-400' : 'text-muted-foreground'
                    }`}>
                        {remaining}/{20} msgs hoy
                    </span>
                    <div className="flex h-2 w-2 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]" />
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4" style={{ maxHeight: '360px' }}>
                {messages.map((m, i) => (
                    <ChatMessage key={i} role={m.role} content={m.content} />
                ))}
                {isPending && (
                    <div className="flex gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/15">
                            <Bot className="h-4 w-4 text-primary" />
                        </div>
                        <div className="rounded-2xl rounded-tl-none border border-border/40 bg-card/80 px-4 py-3">
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border/30 p-3">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                        placeholder={remaining === 0 ? 'L\u00edmite diario alcanzado' : 'Pregunta algo sobre La Liga...'}
                        className="flex-1 rounded-xl border border-border bg-background/80 px-4 py-2 text-sm text-foreground placeholder-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                        disabled={isPending || remaining === 0}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isPending || remaining === 0}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
                    >
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </button>
                </div>
                <p className="mt-1.5 text-[10px] text-muted-foreground/50 text-center">
                    Solo usa datos reales de la base de datos &nbsp;&middot;&nbsp; L\u00edmite: 20 mensajes/d\u00eda
                </p>
            </div>
        </div>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AIAssistant() {
    const { isAdmin } = useAuth()
    const { data: bets = [], isLoading } = useAIBets()
    const { mutate: generateBets, isPending: isGenerating, error: genError, isSuccess: genSuccess, data: genData } = useGenerateAIBets()
    const stats = useAIBotStats(bets)
    const [betsTab, setBetsTab] = useState('pending')

    const pendingBets  = bets.filter(b => b.status === 'pending')
    const settledBets  = bets.filter(b => b.status !== 'pending' && b.status !== 'void')

    const roiPositive = parseFloat(stats.roi) >= 0

    return (
        <div className="space-y-8">
            <SEO
                title="Predicciones IA La Liga · Robot de Apuestas"
                description="Robot de apuestas con inteligencia artificial para La Liga 2025-2026. Predicciones automáticas, análisis de resultados, chat IA y estadísticas de rendimiento."
                path="/ia-bet"
            />
            {/* ⚠️ Disclaimer banner */}
            <div className="flex items-start gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3">
                <TriangleAlert className="h-4 w-4 shrink-0 text-yellow-400 mt-0.5" />
                <p className="text-xs text-yellow-300/90 leading-relaxed">
                    <span className="font-semibold">Aviso importante:</span> Las predicciones de la IA son experimentales y pueden fallar.
                    Este sistema usa <em>monedas virtuales</em> sin valor real.
                    <span className="font-semibold"> No uses estas recomendaciones para apuestas con dinero real.</span>
                    Apostar puede causar adicción — juega de forma responsable.
                </p>
            </div>
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/15">
                            <Bot className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-foreground">IA Bet</h1>
                            <p className="text-sm text-muted-foreground">Predicciones y apuestas automáticas con Inteligencia Artificial</p>
                        </div>
                    </div>
                </div>

                {/* Admin: Generate button */}
                {isAdmin && (
                    <div className="flex flex-col items-end gap-1 shrink-0">
                        <button
                            onClick={() => generateBets()}
                            disabled={isGenerating}
                            className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
                        >
                            {isGenerating
                                ? <><Loader2 className="h-4 w-4 animate-spin" /> Analizando con Gemini...</>
                                : <><Sparkles className="h-4 w-4" /> Generar apuestas IA</>
                            }
                        </button>
                        {genSuccess && (
                            <p className={`text-xs flex items-center gap-1 ${
                                genData?.alreadyGenerated ? 'text-yellow-400' : 'text-green-400'
                            }`}>
                                <CheckCircle className="h-3 w-3" />
                                {genData?.alreadyGenerated
                                    ? `Ya generadas (${genData.count} apuestas). Genera cuando haya nueva jornada.`
                                    : 'Apuestas generadas y guardadas'}
                            </p>
                        )}
                        {genError && (
                            <p className="text-xs text-red-400 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" /> {genError.message}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Bot Stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                <div className="col-span-2 sm:col-span-2 lg:col-span-2">
                    <StatCard
                        icon={Wallet}
                        label="Saldo del Bot"
                        value={`🪙 ${formatCoins(stats.balance)}`}
                        sub="Empezó con 1,000 monedas"
                        accent
                    />
                </div>
                <StatCard icon={Trophy}    label="Ganadas"       value={stats.won}       sub={`de ${stats.totalBets} apuestas`} />
                <StatCard icon={Minus}     label="Perdidas"      value={stats.lost}      sub={`${stats.pending} pendientes`} />
                <StatCard
                    icon={roiPositive ? TrendingUp : TrendingDown}
                    label="ROI"
                    value={`${roiPositive ? '+' : ''}${stats.roi}%`}
                    sub={`${roiPositive ? '+' : ''}${formatCoins(stats.profit)} monedas`}
                />
                <StatCard icon={Target}    label="Win Rate"      value={`${stats.winRate}%`} />
                <StatCard icon={Zap}       label="Racha actual"  value={`${stats.streak} 🔥`} sub="victorias seguidas" />
            </div>

            {/* Bets + Chat grid */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Left: AI Bets */}
                <div className="space-y-4">
                    {/* Tab selector */}
                    <div className="flex rounded-lg border border-border/50 bg-background/50 p-1 w-fit">
                        {[
                            { id: 'pending', label: `Próximas (${pendingBets.length})` },
                            { id: 'settled', label: `Historial (${settledBets.length})` },
                        ].map(t => (
                            <button
                                key={t.id}
                                onClick={() => setBetsTab(t.id)}
                                className={`relative rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${betsTab === t.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {betsTab === t.id && (
                                    <motion.div
                                        layoutId="ai-bet-tab"
                                        className="absolute inset-0 rounded-md bg-primary/10 border border-primary/20"
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                                    />
                                )}
                                <span className="relative">{t.label}</span>
                            </button>
                        ))}
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : betsTab === 'pending' ? (
                        pendingBets.length === 0 ? (
                            <div className="rounded-2xl border border-border/40 bg-card/60 py-12 text-center">
                                <Bot className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                                <p className="text-muted-foreground text-sm">El bot aún no tiene apuestas activas.</p>
                                {isAdmin && (
                                    <p className="mt-1 text-xs text-muted-foreground/60">
                                        Usa el botón "Generar apuestas IA" para analizar los próximos partidos.
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {pendingBets.map(bet => <AIBetCard key={bet.id} bet={bet} />)}
                            </div>
                        )
                    ) : (
                        settledBets.length === 0 ? (
                            <div className="rounded-2xl border border-border/40 bg-card/60 py-12 text-center">
                                <p className="text-muted-foreground text-sm">Sin historial de apuestas aún.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {settledBets.map(bet => <AIBetCard key={bet.id} bet={bet} />)}
                            </div>
                        )
                    )}
                </div>

                {/* Right: Chat */}
                <ChatSection />
            </div>
        </div>
    )
}
