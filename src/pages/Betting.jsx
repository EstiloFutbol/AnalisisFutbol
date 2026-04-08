import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Coins, Loader2, CheckCircle, AlertCircle, Lock, TrendingUp, Wallet, Clock } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useBettableMatches, useUserBets, usePlaceBet } from '@/hooks/useBetting'
import SEO from '@/components/SEO'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCoins(n) {
    if (n == null) return '—'
    return Number(n).toLocaleString('es-ES', { maximumFractionDigits: 0 }) + ' 🪙'
}

function formatDate(dateStr) {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('es-ES', {
        weekday: 'short', day: 'numeric', month: 'short'
    })
}

const BET_LABELS = { home: 'Local', draw: 'Empate', away: 'Visitante' }
const STATUS_STYLES = {
    pending: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
    won: 'border-green-500/30 bg-green-500/10 text-green-400',
    lost: 'border-red-500/30 bg-red-500/10 text-red-400',
    void: 'border-border/40 bg-secondary text-muted-foreground',
}
const STATUS_LABELS = { pending: 'Pendiente', won: '¡Ganada!', lost: 'Perdida', void: 'Anulada' }

// ─── Match Card ───────────────────────────────────────────────────────────────

function MatchBetCard({ match, existingBet, onBetPlaced = null }) {
    const [selected, setSelected] = useState(null)
    const [stake, setStake] = useState('')
    const [result, setResult] = useState(null)
    const { isPending, mutate: _mutate } = usePlaceBet()
    const { refreshProfile } = useAuth()
    const locked = match.hasStarted  // kick-off passed — no more bets

    const placeBet = (args) => new Promise((resolve, reject) => {
        _mutate(args, { onSuccess: resolve, onError: reject })
    })

    const stakeNum = parseFloat(stake) || 0
    const currentOdds = selected ? match[`${selected}_odds`] : null
    const payout = currentOdds && stakeNum > 0
        ? Math.round(stakeNum * currentOdds * 100) / 100
        : null

    const handleSelect = (type) => {
        if (existingBet || locked) return
        setSelected(s => s === type ? null : type)
        setResult(null)
    }

    const handlePlaceBet = async () => {
        if (!selected || stakeNum <= 0) return
        try {
            const data = await placeBet({ matchId: match.id, betType: selected, stake: stakeNum })
            await refreshProfile()
            setResult({ type: 'success', msg: `¡Apuesta de ${formatCoins(stakeNum)} registrada! Posible ganancia: ${formatCoins(data.potential_payout)}` })
            setSelected(null)
            setStake('')
            onBetPlaced?.()
        } catch (err) {
            setResult({ type: 'error', msg: err.message })
        }
    }

    const oddsBtn = (type, odds, label) => {
        const isSelected = selected === type
        const isExisting = existingBet?.bet_type === type
        return (
            <button
                key={type}
                onClick={() => handleSelect(type)}
                disabled={!!existingBet || isPending || locked}
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl border py-2.5 px-2 text-xs font-semibold transition-all disabled:cursor-not-allowed
                    ${locked
                        ? 'border-border/20 bg-secondary/30 text-muted-foreground/40 opacity-50'
                        : isExisting
                            ? 'border-primary/60 bg-primary/20 text-primary'
                            : isSelected
                                ? 'border-primary/50 bg-primary/15 text-primary shadow-[0_0_12px_rgba(34,197,94,0.2)]'
                                : 'border-border/40 bg-card/60 text-muted-foreground hover:border-primary/30 hover:text-foreground'
                    }`}
            >
                <span className="text-[10px] uppercase tracking-wide opacity-70">{label}</span>
                <span className={`text-base font-black ${isSelected || isExisting ? 'text-primary' : ''}`}>{odds}</span>
            </button>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border bg-card/80 backdrop-blur-sm overflow-hidden transition-opacity ${
                locked ? 'border-border/30 opacity-60' : 'border-border/50'
            }`}
        >
            {/* Match header */}
            <div className="flex items-center justify-between border-b border-border/30 px-4 py-2.5">
                <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                    J{match.matchday}
                </span>
                <div className="flex items-center gap-2">
                    {locked && (
                        <span className="flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-[10px] font-bold text-orange-400">
                            <Clock className="h-3 w-3" /> En curso
                        </span>
                    )}
                    <span className="text-[11px] text-muted-foreground">
                        {formatDate(match.match_date)}
                        {match.kick_off_time && ` · ${match.kick_off_time.slice(0, 5)}`}
                    </span>
                </div>
            </div>

            <div className="px-4 py-4 space-y-4">
                {/* Teams */}
                <div className="flex items-center gap-3">
                    {/* Home */}
                    <div className="flex flex-1 flex-col items-center gap-1.5 text-center">
                        {match.home_team?.logo_url
                            ? <img src={match.home_team.logo_url} alt="" className="h-10 w-10 object-contain" />
                            : <div className="h-10 w-10 rounded-full bg-secondary" />
                        }
                        <span className="text-sm font-semibold text-foreground leading-tight">
                            {match.home_team?.short_name || match.home_team?.name}
                        </span>
                    </div>
                    <span className="text-lg font-black text-muted-foreground/40">VS</span>
                    {/* Away */}
                    <div className="flex flex-1 flex-col items-center gap-1.5 text-center">
                        {match.away_team?.logo_url
                            ? <img src={match.away_team.logo_url} alt="" className="h-10 w-10 object-contain" />
                            : <div className="h-10 w-10 rounded-full bg-secondary" />
                        }
                        <span className="text-sm font-semibold text-foreground leading-tight">
                            {match.away_team?.short_name || match.away_team?.name}
                        </span>
                    </div>
                </div>

                {/* Odds buttons */}
                <div className="flex gap-2">
                    {oddsBtn('home', match.home_odds, match.home_team?.short_name || 'Local')}
                    {oddsBtn('draw', match.draw_odds, 'X')}
                    {oddsBtn('away', match.away_odds, match.away_team?.short_name || 'Visitante')}
                </div>

                {/* Locked banner */}
                {locked && (
                    <div className="flex items-center gap-2 rounded-lg border border-orange-500/20 bg-orange-500/10 px-3 py-2 text-sm text-orange-400">
                        <Lock className="h-4 w-4 shrink-0" />
                        <span>Apuestas cerradas — el partido ya ha comenzado</span>
                    </div>
                )}

                {/* Existing bet badge */}
                {existingBet && (
                    <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 text-sm text-primary">
                        <CheckCircle className="h-4 w-4 shrink-0" />
                        <span>Apostaste <strong>{formatCoins(existingBet.stake)}</strong> a <strong>{BET_LABELS[existingBet.bet_type]}</strong> · Ganancia posible: <strong>{formatCoins(existingBet.potential_payout)}</strong></span>
                    </div>
                )}

                {/* Stake input */}
                <AnimatePresence>
                    {selected && !existingBet && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-2 overflow-hidden"
                        >
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">🪙</span>
                                    <input
                                        type="number"
                                        min="1"
                                        value={stake}
                                        onChange={e => setStake(e.target.value)}
                                        placeholder="Cantidad a apostar"
                                        className="w-full rounded-lg border border-border bg-background/80 py-2 pl-8 pr-3 text-sm text-foreground placeholder-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        onKeyDown={e => e.key === 'Enter' && handlePlaceBet()}
                                    />
                                </div>
                                <button
                                    onClick={handlePlaceBet}
                                    disabled={isPending || stakeNum <= 0}
                                    className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                                >
                                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trophy className="h-4 w-4" />}
                                    Apostar
                                </button>
                            </div>
                            {payout && (
                                <p className="text-[11px] text-muted-foreground">
                                    A cuota <strong className="text-foreground">{currentOdds}</strong> →
                                    ganancia potencial: <strong className="text-green-400">{formatCoins(payout)}</strong>
                                </p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Result message */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${result.type === 'success'
                                ? 'border-green-500/20 bg-green-500/10 text-green-400'
                                : 'border-red-500/20 bg-red-500/10 text-red-400'}`}
                        >
                            {result.type === 'success'
                                ? <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                            }
                            {result.msg}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Betting() {
    const { session, userProfile, loading } = useAuth()
    const { data: matches = [], isLoading: matchesLoading } = useBettableMatches()
    const { data: userBets = [], isLoading: betsLoading } = useUserBets()
    const [tab, setTab] = useState('available') // 'available' | 'mybets'

    // Map match_id → user's existing bet for quick lookup
    const betByMatchId = Object.fromEntries(userBets.map(b => [b.match_id, b]))

    // Split matches: open for betting vs already started (no result yet)
    const openMatches    = matches.filter(m => !m.hasStarted)
    const startedMatches = matches.filter(m => m.hasStarted)

    // Stats
    const wonBets     = userBets.filter(b => b.status === 'won').length
    const pendingBets = userBets.filter(b => b.status === 'pending').length
    const totalWon    = userBets.filter(b => b.status === 'won').reduce((s, b) => s + Number(b.potential_payout), 0)

    if (!loading && !session) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                    <Lock className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-2xl font-black text-foreground">Inicia sesión para apostar</h1>
                <p className="text-sm text-muted-foreground">Regístrate gratis y recibe 1,000 monedas de bienvenida</p>
                <Link
                    to="/iniciar-sesion"
                    className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                    Iniciar sesión
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <SEO
                title="Mis Apuestas Virtuales La Liga"
                description="Apuesta con monedas virtuales en los partidos de La Liga 2025-2026. Consulta cuotas, realiza pronósticos y sigue tus resultados."
                path="/mis-apuestas"
            />
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">Mis Apuestas</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Apuesta con monedas virtuales en los próximos partidos</p>
                </div>
                {/* Balance card */}
                {userProfile && (
                    <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 shrink-0">
                        <Wallet className="h-5 w-5 text-primary" />
                        <div>
                            <p className="text-[11px] text-muted-foreground">Tu saldo</p>
                            <p className="text-lg font-black text-primary">{formatCoins(userProfile.balance)}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Stats bar */}
            {userBets.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                        { label: 'Apuestas totales', value: userBets.length, icon: Trophy },
                        { label: 'Pendientes', value: pendingBets, icon: TrendingUp },
                        { label: 'Ganadas', value: wonBets, icon: CheckCircle },
                        { label: 'Ganado total', value: formatCoins(totalWon), icon: Coins },
                    ].map(({ label, value, icon: Icon }) => (
                        <div key={label} className="rounded-xl border border-border/40 bg-card/60 px-4 py-3">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <Icon className="h-3.5 w-3.5" />
                                <span className="text-[11px]">{label}</span>
                            </div>
                            <p className="text-lg font-bold text-foreground">{value}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Tabs */}
            <div className="flex rounded-lg border border-border/50 bg-background/50 p-1 w-fit">
                {[
                    { id: 'available', label: `Disponibles (${openMatches.length})` },
                    { id: 'mybets', label: `Mis apuestas (${userBets.length})` },
                ].map(t => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`relative rounded-md px-4 py-2 text-sm font-medium transition-colors ${tab === t.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        {tab === t.id && (
                            <motion.div
                                layoutId="bet-tab"
                                className="absolute inset-0 rounded-md bg-primary/10 border border-primary/20"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                            />
                        )}
                        <span className="relative">{t.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab content */}
            {tab === 'available' && (
                <>
                    {matchesLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : openMatches.length === 0 && startedMatches.length === 0 ? (
                        <div className="rounded-2xl border border-border/40 bg-card/60 py-16 text-center">
                            <Trophy className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                            <p className="text-muted-foreground">No hay partidos disponibles para apostar en este momento.</p>
                            <p className="mt-1 text-sm text-muted-foreground/60">Las cuotas se publican antes de cada jornada.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Open matches — betting allowed */}
                            {openMatches.length > 0 && (
                                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                    {openMatches.map(match => (
                                        <MatchBetCard
                                            key={match.id}
                                            match={match}
                                            existingBet={betByMatchId[match.id] || null}
                                        />
                                    ))}
                                </div>
                            )}
                            {/* Started matches — locked */}
                            {startedMatches.length > 0 && (
                                <div className="space-y-3">
                                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
                                        <Clock className="h-3.5 w-3.5" /> Partidos en curso (apuestas cerradas)
                                    </p>
                                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                        {startedMatches.map(match => (
                                            <MatchBetCard
                                                key={match.id}
                                                match={match}
                                                existingBet={betByMatchId[match.id] || null}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {tab === 'mybets' && (
                <>
                    {betsLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : userBets.length === 0 ? (
                        <div className="rounded-2xl border border-border/40 bg-card/60 py-16 text-center">
                            <Trophy className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                            <p className="text-muted-foreground">Aún no has realizado ninguna apuesta.</p>
                            <button onClick={() => setTab('available')} className="mt-3 text-sm text-primary hover:underline">
                                Ver partidos disponibles →
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {userBets.map(bet => {
                                const m = bet.match
                                return (
                                    <div key={bet.id} className="flex items-center gap-4 rounded-xl border border-border/40 bg-card/60 p-4">
                                        {/* Teams */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                                                <span className="truncate">{m?.home_team?.short_name || '?'}</span>
                                                <span className="text-muted-foreground/50 shrink-0">vs</span>
                                                <span className="truncate">{m?.away_team?.short_name || '?'}</span>
                                                <span className="ml-1 shrink-0 rounded-full bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">J{m?.matchday}</span>
                                            </div>
                                            <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                                                <span>{BET_LABELS[bet.bet_type]} · @{bet.odds}</span>
                                                <span>{formatCoins(bet.stake)} apostados</span>
                                                <span className="text-green-400/80">→ {formatCoins(bet.potential_payout)}</span>
                                            </div>
                                        </div>
                                        {/* Result badge */}
                                        <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${STATUS_STYLES[bet.status]}`}>
                                            {STATUS_LABELS[bet.status]}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
