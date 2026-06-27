import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Coins, Loader2, CheckCircle, AlertCircle, Lock, TrendingUp, Wallet, Clock, Plus, X, BarChart3, Euro, Medal, Users, TrendingDown, ExternalLink } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useBettableMatches, useUserBets, usePlaceBet, useRealBets, useAddRealBet, useSettleRealBet, useSeasons, useMatchesByJornada, useMatchesBySeason } from '@/hooks/useBetting'
import { useLeagues } from '@/hooks/useMatches'
import { useLeaderboard, formatAmount, toEUR, useUpdatePreferredCurrency } from '@/hooks/useBettorProfiles'
import SEO from '@/components/SEO'
import { useTimezone } from '@/context/TimezoneContext'

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

const BET_TYPES   = ['1X2', 'Más/Menos Goles', 'BTTS', 'Córners', 'Tarjetas', 'Hándicap', 'Doble Oportunidad', 'Otro']
const BOOKMAKERS  = ['Bet365', 'William Hill', 'Betway', 'Codere', 'Marca Apuestas', 'Bwin', 'Betfair', 'Sportium', '888sport', 'Unibet', 'Winamax', 'Betclic', 'Pinnacle', 'Otro']
const EMPTY_FORM  = {
    league_id: '', season: '', matchday: '', match_id: '',
    match_info: '', league_name: '', match_date: '',
    bet_type: '1X2',
    outcome: '', direction: 'Más de', amount: '', hand_team: 'Local', hand_value: '-1', free_text: '',
    odds: '', stake: '', bookmaker: '',
    bet_timing: 'pre', bet_minute: '',
    currency: 'EUR', status: 'pending',
}

function buildSelection(form, homeTeam = 'Local', awayTeam = 'Visitante') {
    switch (form.bet_type) {
        case '1X2':               return form.outcome
        case 'Más/Menos Goles':   return form.amount   ? `${form.direction} ${form.amount} goles`    : ''
        case 'BTTS':              return form.outcome   ? `Ambos marcan: ${form.outcome}`             : ''
        case 'Córners':           return form.amount   ? `${form.direction} ${form.amount} córners`   : ''
        case 'Tarjetas':          return form.amount   ? `${form.direction} ${form.amount} tarjetas`  : ''
        case 'Hándicap':          return `${form.hand_team === 'Local' ? homeTeam : awayTeam} ${form.hand_value}`
        case 'Doble Oportunidad': return form.outcome
        default:                  return form.free_text
    }
}

function AdaptiveFields({ form, set, homeTeam, awayTeam, inputCls }) {
    switch (form.bet_type) {
        case '1X2':
            return (
                <select value={form.outcome} onChange={e => set('outcome', e.target.value)} className={inputCls}>
                    <option value="">Selecciona resultado…</option>
                    <option value={`${homeTeam} gana`}>{homeTeam} gana (Local)</option>
                    <option value="Empate">Empate</option>
                    <option value={`${awayTeam} gana`}>{awayTeam} gana (Visitante)</option>
                </select>
            )
        case 'Más/Menos Goles':
            return (
                <div className="flex gap-2">
                    <select value={form.direction} onChange={e => set('direction', e.target.value)} className={`${inputCls} flex-1`}>
                        <option>Más de</option><option>Menos de</option>
                    </select>
                    <select value={form.amount} onChange={e => set('amount', e.target.value)} className={`${inputCls} flex-1`}>
                        <option value="">Goles…</option>
                        {['0.5','1.5','2.5','3.5','4.5','5.5'].map(v => <option key={v} value={v}>{v} goles</option>)}
                    </select>
                </div>
            )
        case 'BTTS':
            return (
                <select value={form.outcome} onChange={e => set('outcome', e.target.value)} className={inputCls}>
                    <option value="">Selecciona…</option>
                    <option value="Sí">Sí — Ambos marcan</option>
                    <option value="No">No</option>
                </select>
            )
        case 'Córners':
        case 'Tarjetas': {
            const unit = form.bet_type === 'Córners' ? 'córners' : 'tarjetas'
            return (
                <div className="flex gap-2">
                    <select value={form.direction} onChange={e => set('direction', e.target.value)} className={`${inputCls} flex-1`}>
                        <option>Más de</option><option>Menos de</option><option>Exactamente</option>
                    </select>
                    <input type="number" step="0.5" min="0" value={form.amount}
                        onChange={e => set('amount', e.target.value)}
                        placeholder={`Núm. ${unit}`} className={`${inputCls} flex-1`} />
                </div>
            )
        }
        case 'Hándicap':
            return (
                <div className="flex gap-2">
                    <select value={form.hand_team} onChange={e => set('hand_team', e.target.value)} className={`${inputCls} flex-1`}>
                        <option value="Local">{homeTeam} (Local)</option>
                        <option value="Visitante">{awayTeam} (Visitante)</option>
                    </select>
                    <select value={form.hand_value} onChange={e => set('hand_value', e.target.value)} className={`${inputCls} w-28`}>
                        {['-3','-2.5','-2','-1.5','-1','-0.5','0','+0.5','+1','+1.5','+2','+2.5','+3'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                </div>
            )
        case 'Doble Oportunidad':
            return (
                <select value={form.outcome} onChange={e => set('outcome', e.target.value)} className={inputCls}>
                    <option value="">Selecciona…</option>
                    <option value="1X">1X — {homeTeam} o Empate</option>
                    <option value="X2">X2 — Empate o {awayTeam}</option>
                    <option value="12">12 — {homeTeam} o {awayTeam}</option>
                </select>
            )
        default:
            return (
                <input value={form.free_text} onChange={e => set('free_text', e.target.value)}
                    placeholder="Describe tu selección" className={inputCls} />
            )
    }
}

const BET_LABELS = { home: 'Local', draw: 'Empate', away: 'Visitante' }
const STATUS_STYLES = {
    pending: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
    won: 'border-green-500/30 bg-green-500/10 text-green-400',
    lost: 'border-red-500/30 bg-red-500/10 text-red-400',
    void: 'border-border/40 bg-secondary text-muted-foreground',
}
const STATUS_LABELS = { pending: 'Pendiente', won: '¡Ganada!', lost: 'Perdida', void: 'Anulada' }

// ─── Real Bets ────────────────────────────────────────────────────────────────

function RealBetRow({ bet, onSettle, preferredCurrency = 'EUR' }) {
    const stakeEur   = toEUR(bet.stake, bet.currency)
    const payoutEur  = toEUR(bet.potential_payout, bet.currency)
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-border/40 bg-card/60 p-4 sm:flex-row sm:items-center">
            <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{bet.match_info}</span>
                    {bet.league && <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">{bet.league}</span>}
                    {bet.match_date && <span className="text-[11px] text-muted-foreground">{formatDate(bet.match_date)}</span>}
                    <span className={`rounded-full border px-1.5 py-0.5 text-[10px] font-bold ${bet.currency === 'USD' ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' : 'border-primary/30 bg-primary/10 text-primary'}`}>
                        {bet.currency}
                    </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground/80">{bet.bet_type} · {bet.selection}</span>
                    <span>@{Number(bet.odds).toFixed(2)}</span>
                    <span>{formatAmount(stakeEur, preferredCurrency)}</span>
                    <span className="text-green-400/80">→ {formatAmount(payoutEur, preferredCurrency)}</span>
                    {bet.bookmaker && <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px]">{bet.bookmaker}</span>}
                    {bet.bet_minute != null
                        ? <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-[10px] text-orange-400">⚡ En vivo · min. {bet.bet_minute}</span>
                        : <span className="rounded-full border border-border/40 bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">Pre-partido</span>
                    }
                </div>
            </div>
            {bet.status === 'pending' ? (
                <div className="flex gap-1.5 shrink-0">
                    <button onClick={() => onSettle({ id: bet.id, status: 'won' })}
                        className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-[11px] font-bold text-green-400 hover:bg-green-500/20 transition-colors">
                        Ganada
                    </button>
                    <button onClick={() => onSettle({ id: bet.id, status: 'lost' })}
                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-[11px] font-bold text-red-400 hover:bg-red-500/20 transition-colors">
                        Perdida
                    </button>
                    <button onClick={() => onSettle({ id: bet.id, status: 'void' })}
                        className="rounded-lg border border-border/40 bg-secondary px-3 py-1.5 text-[11px] font-bold text-muted-foreground hover:bg-secondary/80 transition-colors">
                        Anulada
                    </button>
                </div>
            ) : (
                <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${STATUS_STYLES[bet.status]}`}>
                    {STATUS_LABELS[bet.status]}
                </span>
            )}
        </div>
    )
}

function RealBetsTab({ realBets, isLoading, preferredCurrency = 'EUR' }) {
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState(EMPTY_FORM)
    const [error, setError] = useState('')
    const { mutate: addBet, isPending: adding } = useAddRealBet()
    const { mutate: settleBet } = useSettleRealBet()
    const { data: leagues = [] } = useLeagues()
    const { data: seasons = [] } = useSeasons(form.league_id || null)
    const isWCLeague = useMemo(() => {
        const lg = leagues.find(l => String(l.id) === String(form.league_id))
        return lg?.code === 'WC'
    }, [leagues, form.league_id])
    const { data: allSeasonMatches = [] } = useMatchesBySeason(
        isWCLeague ? form.league_id : null,
        isWCLeague ? form.season : null,
    )
    const { data: matchesForJornada = [] } = useMatchesByJornada(
        isWCLeague ? null : form.league_id,
        form.season,
        form.matchday,
    )
    const activeMatches = isWCLeague ? allSeasonMatches : matchesForJornada

    const set = (k, v) => setForm(f => {
        const next = { ...f, [k]: v }
        if (k === 'league_id') { next.season = ''; next.matchday = ''; next.match_id = ''; next.match_info = ''; next.league_name = '' }
        if (k === 'season')    { next.matchday = ''; next.match_id = ''; next.match_info = '' }
        if (k === 'matchday')  { next.match_id = ''; next.match_info = '' }
        if (k === 'match_id') {
            const m = activeMatches.find(x => x.id === v)
            if (m) {
                next.match_info = `${m.home_team?.name || '?'} vs ${m.away_team?.name || '?'}`
                next.match_date = m.match_date || ''
            }
        }
        if (k === 'league_id') {
            const lg = leagues.find(x => String(x.id) === String(v))
            if (lg) next.league_name = lg.name || lg.code || ''
        }
        return next
    })

    const handleAdd = () => {
        const selection = buildSelection(form,
            activeMatches.find(m => m.id === form.match_id)?.home_team?.name || 'Local',
            activeMatches.find(m => m.id === form.match_id)?.away_team?.name || 'Visitante',
        )
        if (!form.match_info || !selection || !form.odds || !form.stake) {
            setError('Completa: partido, selección, cuota y stake.')
            return
        }
        const oddsNum  = parseFloat(form.odds)
        const stakeNum = parseFloat(form.stake)
        if (isNaN(oddsNum) || oddsNum < 1.01 || isNaN(stakeNum) || stakeNum <= 0) {
            setError('Cuota debe ser ≥ 1.01 y stake > 0.')
            return
        }
        setError('')
        addBet({
            match_id:   form.match_id || null,
            match_info: form.match_info,
            league:     form.league_name || null,
            bet_type:   form.bet_type,
            selection,
            odds:       oddsNum,
            stake:      stakeNum,
            bookmaker:  form.bookmaker || null,
            match_date: form.match_date || null,
            bet_timing: form.bet_timing,
            bet_minute: form.bet_timing === 'live' && form.bet_minute ? parseInt(form.bet_minute, 10) : null,
            currency:   form.currency,
            status:     form.status,
        }, {
            onSuccess: () => { setForm(EMPTY_FORM); setShowForm(false) },
            onError:   (e) => setError(e.message),
        })
    }

    // Stats (only won+lost count toward ROI denominator)
    const settled    = realBets.filter(b => b.status === 'won' || b.status === 'lost')
    const totalStake = settled.reduce((s, b) => s + toEUR(b.stake, b.currency), 0)
    const totalProfit = realBets.reduce((s, b) => {
        if (b.status === 'won')  return s + toEUR(b.potential_payout - b.stake, b.currency)
        if (b.status === 'lost') return s - toEUR(b.stake, b.currency)
        return s
    }, 0)
    const roi     = totalStake > 0 ? (totalProfit / totalStake) * 100 : 0
    const wonCount  = realBets.filter(b => b.status === 'won').length
    const lostCount = realBets.filter(b => b.status === 'lost').length

    const inputCls = 'w-full rounded-lg border border-border bg-background/80 py-2 px-3 text-sm text-foreground placeholder-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

    const maxMatchdays = 38
    const matchdayOptions = Array.from({ length: maxMatchdays }, (_, i) => i + 1)

    return (
        <div className="space-y-4">
            {/* Stats summary */}
            {realBets.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                        { label: 'Total picks', value: realBets.length },
                        { label: 'Ganadas / Perdidas', value: `${wonCount} / ${lostCount}` },
                        { label: 'ROI', value: `${roi >= 0 ? '+' : ''}${roi.toFixed(1)}%`, color: roi >= 0 ? 'text-green-400' : 'text-red-400' },
                        { label: 'Beneficio', value: formatAmount(totalProfit, preferredCurrency), color: totalProfit >= 0 ? 'text-green-400' : 'text-red-400' },
                    ].map(({ label, value, color }) => (
                        <div key={label} className="rounded-xl border border-border/40 bg-card/60 px-4 py-3">
                            <p className="text-[11px] text-muted-foreground mb-1">{label}</p>
                            <p className={`text-lg font-bold ${color || 'text-foreground'}`}>{value}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Performance by type */}
            {realBets.length > 0 && (() => {
                const byType = {}
                realBets.forEach(b => {
                    if (!byType[b.bet_type]) byType[b.bet_type] = { won: 0, lost: 0, stake: 0, profit: 0 }
                    const s = byType[b.bet_type]
                    const stakeEur = toEUR(b.stake, b.currency)
                    if (b.status === 'won')  { s.won++;  s.profit += toEUR(b.potential_payout - b.stake, b.currency); s.stake += stakeEur }
                    if (b.status === 'lost') { s.lost++; s.profit -= stakeEur; s.stake += stakeEur }
                })
                const entries = Object.entries(byType).filter(([, v]) => v.won + v.lost > 0)
                if (!entries.length) return null
                return (
                    <div className="rounded-xl border border-border/40 bg-card/60 p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-semibold text-foreground">Rendimiento por mercado</span>
                        </div>
                        <div className="space-y-2">
                            {entries.map(([type, stats]) => {
                                const typeRoi = stats.stake > 0 ? (stats.profit / stats.stake) * 100 : 0
                                return (
                                    <div key={type} className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground w-36 truncate">{type}</span>
                                        <span className="text-foreground">{stats.won}G / {stats.lost}P</span>
                                        <span className={typeRoi >= 0 ? 'text-green-400' : 'text-red-400'}>
                                            {typeRoi >= 0 ? '+' : ''}{typeRoi.toFixed(1)}% ROI
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            })()}

            {/* Header + add button */}
            <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-foreground">Historial de picks reales</h2>
                <button
                    onClick={() => setShowForm(v => !v)}
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                    {showForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    {showForm ? 'Cancelar' : 'Añadir pick'}
                </button>
            </div>

            {/* Add form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-4">
                            <p className="text-sm font-semibold text-foreground">Nuevo pick</p>

                            {/* League / season / matchday */}
                            <div className="grid gap-3 sm:grid-cols-3">
                                <div>
                                    <label className="block text-[11px] text-muted-foreground mb-1">Liga</label>
                                    <select value={form.league_id} onChange={e => set('league_id', e.target.value)} className={inputCls}>
                                        <option value="">Manual / sin liga</option>
                                        {leagues.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                    </select>
                                </div>
                                {form.league_id && (
                                    <div>
                                        <label className="block text-[11px] text-muted-foreground mb-1">Temporada</label>
                                        <select value={form.season} onChange={e => set('season', e.target.value)} className={inputCls}>
                                            <option value="">Elige temporada</option>
                                            {seasons.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                )}
                                {/* Jornada only for non-WC leagues */}
                                {!isWCLeague && form.season && (
                                    <div>
                                        <label className="block text-[11px] text-muted-foreground mb-1">Jornada</label>
                                        <select value={form.matchday} onChange={e => set('matchday', e.target.value)} className={inputCls}>
                                            <option value="">Elige jornada</option>
                                            {matchdayOptions.map(j => <option key={j} value={j}>J{j}</option>)}
                                        </select>
                                    </div>
                                )}
                            </div>

                            {/* Match picker */}
                            {isWCLeague && form.season ? (
                                <div>
                                    <label className="block text-[11px] text-muted-foreground mb-1">Partido</label>
                                    <select value={form.match_id} onChange={e => set('match_id', e.target.value)} className={inputCls}>
                                        <option value="">Selecciona partido</option>
                                        {allSeasonMatches.map(m => (
                                            <option key={m.id} value={m.id}>
                                                {m.group_name ? `Gr. ${m.group_name} · ` : ''}{m.home_team?.name} vs {m.away_team?.name} · {formatDate(m.match_date)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : form.matchday && matchesForJornada.length > 0 ? (
                                <div>
                                    <label className="block text-[11px] text-muted-foreground mb-1">Partido</label>
                                    <select value={form.match_id} onChange={e => set('match_id', e.target.value)} className={inputCls}>
                                        <option value="">Selecciona partido</option>
                                        {matchesForJornada.map(m => (
                                            <option key={m.id} value={m.id}>
                                                {m.home_team?.name} vs {m.away_team?.name} · {formatDate(m.match_date)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-[11px] text-muted-foreground mb-1">Partido (texto)</label>
                                        <input value={form.match_info} onChange={e => set('match_info', e.target.value)}
                                            placeholder="Ej: Real Madrid vs Barça" className={inputCls} />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] text-muted-foreground mb-1">Fecha del partido</label>
                                        <input type="date" value={form.match_date} onChange={e => set('match_date', e.target.value)} className={inputCls} />
                                    </div>
                                </div>
                            )}

                            {/* Bet type + selection */}
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="block text-[11px] text-muted-foreground mb-1">Tipo de apuesta</label>
                                    <select value={form.bet_type} onChange={e => set('bet_type', e.target.value)} className={inputCls}>
                                        {BET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] text-muted-foreground mb-1">Selección</label>
                                    <AdaptiveFields form={form} set={set}
                                        homeTeam={activeMatches.find(m => m.id === form.match_id)?.home_team?.name || 'Local'}
                                        awayTeam={activeMatches.find(m => m.id === form.match_id)?.away_team?.name || 'Visitante'}
                                        inputCls={inputCls}
                                    />
                                </div>
                            </div>

                            {/* Odds / stake / currency */}
                            <div className="grid gap-3 sm:grid-cols-4">
                                <div>
                                    <label className="block text-[11px] text-muted-foreground mb-1">Cuota</label>
                                    <input type="number" step="0.01" min="1.01" value={form.odds}
                                        onChange={e => set('odds', e.target.value)} placeholder="1.85" className={inputCls} />
                                </div>
                                <div>
                                    <label className="block text-[11px] text-muted-foreground mb-1">Stake</label>
                                    <input type="number" step="0.01" min="0.01" value={form.stake}
                                        onChange={e => set('stake', e.target.value)} placeholder="10.00" className={inputCls} />
                                </div>
                                <div>
                                    <label className="block text-[11px] text-muted-foreground mb-1">Divisa</label>
                                    <select value={form.currency} onChange={e => set('currency', e.target.value)} className={inputCls}>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="USD">USD ($)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] text-muted-foreground mb-1">Resultado</label>
                                    <select value={form.status} onChange={e => set('status', e.target.value)} className={inputCls}>
                                        <option value="pending">Pendiente</option>
                                        <option value="won">Ganada</option>
                                        <option value="lost">Perdida</option>
                                        <option value="void">Anulada</option>
                                    </select>
                                </div>
                            </div>

                            {/* Bookmaker / timing */}
                            <div className="grid gap-3 sm:grid-cols-3">
                                <div>
                                    <label className="block text-[11px] text-muted-foreground mb-1">Casa de apuestas</label>
                                    <select value={form.bookmaker} onChange={e => set('bookmaker', e.target.value)} className={inputCls}>
                                        <option value="">Sin especificar</option>
                                        {BOOKMAKERS.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] text-muted-foreground mb-1">Timing</label>
                                    <select value={form.bet_timing} onChange={e => set('bet_timing', e.target.value)} className={inputCls}>
                                        <option value="pre">Pre-partido</option>
                                        <option value="live">En vivo</option>
                                    </select>
                                </div>
                                {form.bet_timing === 'live' && (
                                    <div>
                                        <label className="block text-[11px] text-muted-foreground mb-1">Minuto</label>
                                        <input type="number" min="1" max="120" value={form.bet_minute}
                                            onChange={e => set('bet_minute', e.target.value)} placeholder="45" className={inputCls} />
                                    </div>
                                )}
                            </div>

                            {/* Payout preview */}
                            {form.odds && form.stake && parseFloat(form.odds) >= 1.01 && parseFloat(form.stake) > 0 && (
                                <p className="text-[11px] text-muted-foreground">
                                    Retorno potencial: <strong className="text-foreground">
                                        {form.currency === 'USD' ? '$' : '€'}{(parseFloat(form.stake) * parseFloat(form.odds)).toFixed(2)} {form.currency}
                                    </strong>
                                    {' '}· Beneficio: <strong className="text-green-400">
                                        {form.currency === 'USD' ? '+$' : '+€'}{(parseFloat(form.stake) * (parseFloat(form.odds) - 1)).toFixed(2)} {form.currency}
                                    </strong>
                                </p>
                            )}

                            {error && (
                                <p className="flex items-center gap-1.5 text-sm text-red-400">
                                    <AlertCircle className="h-4 w-4 shrink-0" />{error}
                                </p>
                            )}

                            <button onClick={handleAdd} disabled={adding}
                                className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
                                {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                                Guardar pick
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* History */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : realBets.length === 0 ? (
                <div className="rounded-2xl border border-border/40 bg-card/60 py-16 text-center">
                    <Euro className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                    <p className="text-muted-foreground">Aún no has registrado ningún pick real.</p>
                    <p className="mt-1 text-sm text-muted-foreground/60">Añade tus apuestas para llevar el control de tu rendimiento.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {realBets.map(bet => (
                        <RealBetRow key={bet.id} bet={bet} onSettle={v => settleBet(v)} preferredCurrency={preferredCurrency} />
                    ))}
                </div>
            )}
        </div>
    )
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

const MEDAL_COLORS = [
    'text-yellow-400 border-yellow-400/40 bg-yellow-400/10',
    'text-slate-400 border-slate-400/40 bg-slate-400/10',
    'text-amber-600 border-amber-600/40 bg-amber-600/10',
]

function LeaderboardTab({ preferredCurrency = 'EUR' }) {
    const { data: rows = [], isLoading, error } = useLeaderboard()

    if (isLoading) return (
        <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )

    if (error) return (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center text-sm text-red-400">
            No se pudo cargar el ranking. Inténtalo de nuevo.
        </div>
    )

    if (rows.length === 0) return (
        <div className="rounded-2xl border border-border/40 bg-card/60 py-16 text-center">
            <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
            <p className="text-muted-foreground">Aún no hay datos de rendimiento.</p>
            <p className="mt-1 text-sm text-muted-foreground/60">Añade picks reales para aparecer en el ranking.</p>
        </div>
    )

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Medal className="h-5 w-5 text-yellow-400" />
                <h2 className="text-base font-bold text-foreground">Clasificación de apostadores</h2>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">{rows.length} apostadores</span>
            </div>

            {/* Podium cards for top 3 */}
            {rows.length >= 1 && (
                <div className="grid gap-3 sm:grid-cols-3">
                    {rows.slice(0, Math.min(3, rows.length)).map((row, i) => {
                        const profitEur  = Number(row.profit_eur || 0)
                        const profitDisp = formatAmount(profitEur, preferredCurrency)
                        const roi        = Number(row.roi || 0)
                        return (
                            <div key={row.display_name + i} className={`relative rounded-2xl border p-4 text-center ${i === 0 ? 'border-yellow-400/30 bg-yellow-400/5' : 'border-border/40 bg-card/60'}`}>
                                {/* Rank badge */}
                                <div className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full border text-sm font-black ${MEDAL_COLORS[i] || 'border-border/40 bg-secondary text-muted-foreground'}`}>
                                    {i + 1}
                                </div>
                                <p className="text-sm font-bold text-foreground truncate">{row.display_name}</p>
                                <p className={`text-xl font-black mt-1 ${roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {roi >= 0 ? '+' : ''}{roi.toFixed(1)}%
                                </p>
                                <p className="text-xs text-muted-foreground">ROI</p>
                                <p className={`text-sm font-semibold mt-1 ${profitEur >= 0 ? 'text-green-400/80' : 'text-red-400/80'}`}>
                                    {profitEur >= 0 ? '+' : ''}{profitDisp}
                                </p>
                                <p className="text-[11px] text-muted-foreground mt-1">{row.total_bets} picks · {row.won_bets}G/{row.lost_bets}P</p>
                                {row.bettor_profile_id && (
                                    <Link to={`/apuestas/bettor/${row.bettor_profile_id}`}
                                        className="mt-2 flex items-center justify-center gap-1 text-[11px] text-primary hover:underline">
                                        Ver picks <ExternalLink className="h-3 w-3" />
                                    </Link>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Full table */}
            {rows.length > 3 && (
                <div className="rounded-xl border border-border/40 bg-card/60 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border/40 text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                                <th className="px-4 py-3 w-10">#</th>
                                <th className="px-4 py-3">Apostador</th>
                                <th className="px-4 py-3 text-right">ROI</th>
                                <th className="px-4 py-3 text-right">Beneficio</th>
                                <th className="px-4 py-3 text-right hidden sm:table-cell">Picks</th>
                                <th className="px-4 py-3 text-right hidden sm:table-cell">G/P</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.slice(3).map((row, i) => {
                                const profitEur  = Number(row.profit_eur || 0)
                                const roi        = Number(row.roi || 0)
                                return (
                                    <tr key={row.display_name + i} className="border-b border-border/20 last:border-0 hover:bg-secondary/30 transition-colors">
                                        <td className="px-4 py-3 text-muted-foreground font-semibold">{i + 4}</td>
                                        <td className="px-4 py-3">
                                            <span className="font-semibold text-foreground">{row.display_name}</span>
                                            {row.bettor_profile_id && (
                                                <Link to={`/apuestas/bettor/${row.bettor_profile_id}`}
                                                    className="ml-2 text-primary hover:underline text-[11px]">
                                                    ver picks
                                                </Link>
                                            )}
                                        </td>
                                        <td className={`px-4 py-3 text-right font-bold ${roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {roi >= 0 ? '+' : ''}{roi.toFixed(1)}%
                                        </td>
                                        <td className={`px-4 py-3 text-right font-semibold ${profitEur >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {profitEur >= 0 ? '+' : ''}{formatAmount(profitEur, preferredCurrency)}
                                        </td>
                                        <td className="px-4 py-3 text-right text-muted-foreground hidden sm:table-cell">{row.total_bets}</td>
                                        <td className="px-4 py-3 text-right text-muted-foreground hidden sm:table-cell">
                                            <span className="text-green-400">{row.won_bets}</span>/{row.lost_bets}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

// ─── Virtual bet card ─────────────────────────────────────────────────────────

function MatchBetCard({ match, existingBet, onBetPlaced = null }) {
    const [selected, setSelected] = useState(null)
    const [stake, setStake] = useState('')
    const [result, setResult] = useState(null)
    const { isPending, mutate: _mutate } = usePlaceBet()
    const { refreshProfile } = useAuth()
    const { formatKickOff } = useTimezone()
    const locked = match.hasStarted

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
                        {match.kick_off_time && ` · ${formatKickOff(match.kick_off_time, match.match_date)}`}
                    </span>
                </div>
            </div>

            <div className="px-4 py-4 space-y-4">
                {/* Teams */}
                <div className="flex items-center gap-3">
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

                {locked && (
                    <div className="flex items-center gap-2 rounded-lg border border-orange-500/20 bg-orange-500/10 px-3 py-2 text-sm text-orange-400">
                        <Lock className="h-4 w-4 shrink-0" />
                        <span>Apuestas cerradas — el partido ya ha comenzado</span>
                    </div>
                )}

                {existingBet && (
                    <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 text-sm text-primary">
                        <CheckCircle className="h-4 w-4 shrink-0" />
                        <span>Apostaste <strong>{formatCoins(existingBet.stake)}</strong> a <strong>{BET_LABELS[existingBet.bet_type]}</strong> · Ganancia posible: <strong>{formatCoins(existingBet.potential_payout)}</strong></span>
                    </div>
                )}

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
    const { data: realBets = [], isLoading: realBetsLoading } = useRealBets()
    const { mutate: updateCurrency } = useUpdatePreferredCurrency()
    const [tab, setTab] = useState('available')
    const [preferredCurrency, setPreferredCurrency] = useState('EUR')

    useEffect(() => {
        if (userProfile?.preferred_currency) setPreferredCurrency(userProfile.preferred_currency)
    }, [userProfile?.preferred_currency])

    const betByMatchId = Object.fromEntries(userBets.map(b => [b.match_id, b]))
    const openMatches    = matches.filter(m => !m.hasStarted)
    const startedMatches = matches.filter(m => m.hasStarted)

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
                title="Apuestas — Picks Reales y Virtuales"
                description="Apuesta con monedas virtuales en La Liga, lleva el control de tus picks reales y consulta el ranking de apostadores."
                path="/apuestas"
            />
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight title-contrast">Apuestas</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Apuestas virtuales, picks reales y ranking de apostadores</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    {/* Currency toggle */}
                    {userProfile && (
                        <div className="flex items-center gap-1 rounded-lg border border-border/50 bg-card/60 p-1">
                            {['EUR', 'USD'].map(c => (
                                <button key={c}
                                    onClick={() => { setPreferredCurrency(c); updateCurrency(c) }}
                                    className={`rounded-md px-2.5 py-1 text-xs font-bold transition-colors ${preferredCurrency === c ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    {c === 'EUR' ? '€ EUR' : '$ USD'}
                                </button>
                            ))}
                        </div>
                    )}
                    {/* Balance card */}
                    {userProfile && (
                        <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3">
                            <Wallet className="h-5 w-5 text-primary" />
                            <div>
                                <p className="text-[11px] text-muted-foreground">Tu saldo</p>
                                <p className="text-lg font-black text-primary">{formatCoins(userProfile.balance)}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Virtual bet stats bar */}
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
            <div className="flex flex-wrap rounded-lg border border-border/50 bg-background/50 p-1 w-fit gap-0.5">
                {[
                    { id: 'available',   label: `Disponibles (${openMatches.length})` },
                    { id: 'mybets',      label: `Virtuales (${userBets.length})` },
                    { id: 'real_bets',   label: `Picks Reales (${realBets.length})` },
                    { id: 'leaderboard', label: 'Clasificación' },
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

            {tab === 'real_bets' && (
                <RealBetsTab realBets={realBets} isLoading={realBetsLoading} preferredCurrency={preferredCurrency} />
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

            {tab === 'leaderboard' && (
                <LeaderboardTab preferredCurrency={preferredCurrency} />
            )}
        </div>
    )
}
