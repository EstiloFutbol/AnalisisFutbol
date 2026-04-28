import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Coins, Loader2, CheckCircle, AlertCircle, Lock, TrendingUp, Wallet, Clock, Plus, X, BarChart3, Euro } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useBettableMatches, useUserBets, usePlaceBet, useRealBets, useAddRealBet, useSettleRealBet, useSeasons, useMatchesByJornada } from '@/hooks/useBetting'
import { useLeagues } from '@/hooks/useMatches'
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

function formatEur(n) {
    if (n == null) return '—'
    return Number(n).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
}

const BET_TYPES   = ['1X2', 'Más/Menos Goles', 'BTTS', 'Córners', 'Tarjetas', 'Hándicap', 'Doble Oportunidad', 'Otro']
const BOOKMAKERS  = ['Bet365', 'William Hill', 'Betway', 'Codere', 'Marca Apuestas', 'Bwin', 'Betfair', 'Sportium', '888sport', 'Unibet', 'Winamax', 'Betclic', 'Pinnacle', 'Otro']
const EMPTY_FORM  = {
    league_id: '', season: '', matchday: '', match_id: '',
    match_info: '', league_name: '', match_date: '',
    bet_type: '1X2',
    outcome: '', direction: 'Más de', amount: '', hand_team: 'Local', hand_value: '-1', free_text: '',
    odds: '', stake: '', bookmaker: '',
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

function RealBetRow({ bet, onSettle }) {
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-border/40 bg-card/60 p-4 sm:flex-row sm:items-center">
            <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{bet.match_info}</span>
                    {bet.league && <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">{bet.league}</span>}
                    {bet.match_date && <span className="text-[11px] text-muted-foreground">{formatDate(bet.match_date)}</span>}
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground/80">{bet.bet_type} · {bet.selection}</span>
                    <span>@{Number(bet.odds).toFixed(2)}</span>
                    <span>{formatEur(bet.stake)}</span>
                    <span className="text-green-400/80">→ {formatEur(bet.potential_payout)}</span>
                    {bet.bookmaker && <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px]">{bet.bookmaker}</span>}
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

function RealBetsTab({ realBets, isLoading }) {
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState(EMPTY_FORM)
    const [error, setError] = useState(null)

    const { data: leagues = [] } = useLeagues()
    const { data: seasons = [] } = useSeasons(form.league_id)
    const { data: matchOptions = [], isLoading: matchesLoading } = useMatchesByJornada(form.league_id, form.season, form.matchday)
    const { mutate: addBet, isPending: isAdding } = useAddRealBet()
    const { mutate: settleBet } = useSettleRealBet()

    // ── Stats ──────────────────────────────────────────────────────────────────
    const settled       = realBets.filter(b => b.status !== 'pending')
    const won           = realBets.filter(b => b.status === 'won')
    const settledStaked = settled.reduce((s, b) => s + Number(b.stake), 0)
    const totalReturn   = won.reduce((s, b) => s + Number(b.potential_payout), 0)
    const netProfit     = totalReturn - settledStaked
    const winRate       = settled.length > 0 ? Math.round(won.length / settled.length * 100) : null
    const roi           = settledStaked > 0 ? ((netProfit / settledStaked) * 100).toFixed(1) : null

    const typeStats = Object.entries(
        realBets.reduce((acc, b) => {
            if (!acc[b.bet_type]) acc[b.bet_type] = { won: 0, settled: 0 }
            if (b.status !== 'pending') {
                acc[b.bet_type].settled++
                if (b.status === 'won') acc[b.bet_type].won++
            }
            return acc
        }, {})
    ).filter(([, s]) => s.settled > 0)
     .sort((a, b) => (b[1].won / b[1].settled) - (a[1].won / a[1].settled))

    // ── Form helpers ───────────────────────────────────────────────────────────
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    const handleLeagueChange = (leagueId) => {
        const league = leagues.find(l => String(l.id) === leagueId)
        setForm(f => ({ ...f, league_id: leagueId, league_name: league?.name || '', season: '', matchday: '', match_id: '', match_info: '', match_date: '' }))
    }
    const handleSeasonChange   = (v) => setForm(f => ({ ...f, season: v,   matchday: '', match_id: '', match_info: '', match_date: '' }))
    const handleMatchdayChange = (v) => setForm(f => ({ ...f, matchday: v, match_id: '', match_info: '', match_date: '' }))
    const handleMatchChange    = (matchId) => {
        const m = matchOptions.find(m => String(m.id) === matchId)
        setForm(f => ({ ...f, match_id: matchId, match_info: m ? `${m.home_team?.name} vs ${m.away_team?.name}` : '', match_date: m?.match_date || '' }))
    }
    const handleBetTypeChange  = (v) => setForm(f => ({
        ...f, bet_type: v, outcome: '', direction: 'Más de', amount: '', hand_team: 'Local', hand_value: '-1', free_text: '',
    }))

    const selectedMatch = matchOptions.find(m => String(m.id) === form.match_id)
    const homeTeam = selectedMatch?.home_team?.short_name || 'Local'
    const awayTeam = selectedMatch?.away_team?.short_name || 'Visitante'

    const handleAdd = () => {
        const selection = buildSelection(form, homeTeam, awayTeam)
        if (!form.match_info.trim() || !selection.trim() || !form.odds || !form.stake) {
            setError('Rellena todos los campos obligatorios.')
            return
        }
        addBet({
            match_info: form.match_info.trim(),
            league:     form.league_name || null,
            bet_type:   form.bet_type,
            selection:  selection.trim(),
            odds:       parseFloat(form.odds),
            stake:      parseFloat(form.stake),
            bookmaker:  form.bookmaker || null,
            match_date: form.match_date || null,
        }, {
            onSuccess: () => { setShowForm(false); setForm(EMPTY_FORM); setError(null) },
            onError:   (e) => setError(e.message),
        })
    }

    const inputCls = "w-full rounded-lg border border-border bg-background/80 px-3 py-2 text-sm text-foreground placeholder-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-40"
    const labelCls = "text-xs font-semibold text-muted-foreground mb-1 block"

    if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>

    return (
        <div className="space-y-6">
            {/* Stats summary */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                    { label: 'Picks registrados', value: realBets.length,                                icon: BarChart3,  cls: '' },
                    { label: 'Tasa de acierto',   value: winRate != null ? `${winRate}%` : '—',          icon: TrendingUp, cls: '' },
                    { label: 'ROI',               value: roi != null ? `${roi}%` : '—',                  icon: Coins,      cls: roi == null ? '' : Number(roi) >= 0 ? 'text-green-400' : 'text-red-400' },
                    { label: 'Beneficio neto',    value: settledStaked > 0 ? formatEur(netProfit) : '—', icon: Euro,       cls: netProfit >= 0 ? 'text-green-400' : 'text-red-400' },
                ].map(({ label, value, icon: Icon, cls }) => (
                    <div key={label} className="rounded-xl border border-border/40 bg-card/60 px-4 py-3">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Icon className="h-3.5 w-3.5" /><span className="text-[11px]">{label}</span>
                        </div>
                        <p className={`text-lg font-bold ${cls || 'text-foreground'}`}>{value}</p>
                    </div>
                ))}
            </div>

            {/* Performance by bet type */}
            {typeStats.length > 0 && (
                <div className="rounded-xl border border-border/40 bg-card/60 p-4">
                    <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Rendimiento por tipo de apuesta</h3>
                    <div className="space-y-2.5">
                        {typeStats.map(([type, s]) => {
                            const rate = Math.round(s.won / s.settled * 100)
                            return (
                                <div key={type} className="flex items-center gap-3">
                                    <span className="w-40 text-xs font-medium text-foreground truncate">{type}</span>
                                    <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${rate}%` }} />
                                    </div>
                                    <span className="w-10 text-right text-xs font-bold text-foreground">{rate}%</span>
                                    <span className="w-10 text-right text-[11px] text-muted-foreground">{s.won}/{s.settled}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Header + add button */}
            <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">
                    {realBets.length > 0 ? `${realBets.length} picks registrados` : 'Sin picks registrados aún'}
                </p>
                {!showForm && (
                    <button onClick={() => setShowForm(true)}
                        className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
                        <Plus className="h-4 w-4" /> Añadir pick
                    </button>
                )}
            </div>

            {/* Add form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="rounded-2xl border border-border/50 bg-card/80 p-5 space-y-5">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-foreground">Nuevo pick real</h3>
                                <button onClick={() => { setShowForm(false); setError(null) }}
                                    className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {/* ── Partido ── */}
                            <div className="space-y-3">
                                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Partido</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelCls}>Liga <span className="text-red-400">*</span></label>
                                        <select value={form.league_id} onChange={e => handleLeagueChange(e.target.value)} className={inputCls}>
                                            <option value="">Selecciona liga…</option>
                                            {leagues.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Temporada <span className="text-red-400">*</span></label>
                                        <select value={form.season} onChange={e => handleSeasonChange(e.target.value)} className={inputCls} disabled={!form.league_id}>
                                            <option value="">Selecciona temporada…</option>
                                            {seasons.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelCls}>Jornada <span className="text-red-400">*</span></label>
                                    <select value={form.matchday} onChange={e => handleMatchdayChange(e.target.value)} className={inputCls} disabled={!form.season}>
                                        <option value="">Selecciona jornada…</option>
                                        {Array.from({ length: 38 }, (_, i) => i + 1).map(j => (
                                            <option key={j} value={j}>Jornada {j}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelCls}>Partido <span className="text-red-400">*</span></label>
                                    <select value={form.match_id} onChange={e => handleMatchChange(e.target.value)} className={inputCls} disabled={!form.matchday || matchesLoading}>
                                        <option value="">
                                            {matchesLoading ? 'Cargando partidos…' : matchOptions.length === 0 && form.matchday ? 'Sin partidos para esta jornada' : 'Selecciona partido…'}
                                        </option>
                                        {matchOptions.map(m => (
                                            <option key={m.id} value={m.id}>{m.home_team?.name} vs {m.away_team?.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* ── Apuesta ── */}
                            <div className="space-y-3">
                                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Apuesta</p>
                                <div>
                                    <label className={labelCls}>Tipo <span className="text-red-400">*</span></label>
                                    <select value={form.bet_type} onChange={e => handleBetTypeChange(e.target.value)} className={inputCls}>
                                        {BET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelCls}>Selección <span className="text-red-400">*</span></label>
                                    <AdaptiveFields form={form} set={set} homeTeam={homeTeam} awayTeam={awayTeam} inputCls={inputCls} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelCls}>Cuota <span className="text-red-400">*</span></label>
                                        <input type="number" step="0.01" min="1" value={form.odds} onChange={e => set('odds', e.target.value)} placeholder="ej. 1.85" className={inputCls} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Apuesta (€) <span className="text-red-400">*</span></label>
                                        <input type="number" step="0.01" min="0.01" value={form.stake} onChange={e => set('stake', e.target.value)} placeholder="ej. 10.00" className={inputCls} />
                                    </div>
                                </div>
                            </div>

                            {/* ── Casa de apuestas ── */}
                            <div className="space-y-2">
                                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Casa de apuestas</p>
                                <select value={form.bookmaker} onChange={e => set('bookmaker', e.target.value)} className={inputCls}>
                                    <option value="">Sin especificar</option>
                                    {BOOKMAKERS.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>

                            {/* Payout preview */}
                            {form.odds && form.stake && parseFloat(form.odds) > 0 && parseFloat(form.stake) > 0 && (
                                <p className="text-xs text-muted-foreground">
                                    Ganancia potencial: <strong className="text-green-400">
                                        {formatEur(Math.round(parseFloat(form.stake) * parseFloat(form.odds) * 100) / 100)}
                                    </strong>
                                </p>
                            )}

                            {error && (
                                <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                                    <AlertCircle className="h-4 w-4 shrink-0" />{error}
                                </div>
                            )}
                            <button onClick={handleAdd} disabled={isAdding}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50">
                                {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                Guardar pick
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* History */}
            {realBets.length === 0 ? (
                <div className="rounded-2xl border border-border/40 bg-card/60 py-16 text-center">
                    <BarChart3 className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                    <p className="text-muted-foreground">Aún no has registrado ningún pick real.</p>
                    <p className="mt-1 text-sm text-muted-foreground/60">Añade tus apuestas para analizar tu rendimiento.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {realBets.map(bet => <RealBetRow key={bet.id} bet={bet} onSettle={settleBet} />)}
                </div>
            )}
        </div>
    )
}

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
    const { data: realBets = [], isLoading: realBetsLoading } = useRealBets()
    const [tab, setTab] = useState('available') // 'available' | 'mybets' | 'real_bets'

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
                    <h1 className="text-3xl font-black tracking-tight title-contrast">Mis Apuestas</h1>
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
                    { id: 'available',  label: `Disponibles (${openMatches.length})` },
                    { id: 'mybets',    label: `Virtuales (${userBets.length})` },
                    { id: 'real_bets', label: `Picks Reales (${realBets.length})` },
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

            {tab === 'real_bets' && (
                <RealBetsTab realBets={realBets} isLoading={realBetsLoading} />
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
