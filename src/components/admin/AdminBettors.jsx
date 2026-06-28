import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, X, ChevronDown, ChevronUp, Loader2, AlertCircle, CheckCircle, Trash2, ExternalLink, Pencil } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    useBettorProfiles,
    useCreateBettorProfile,
    useUpdateBettorProfile,
    useDeactivateBettorProfile,
    useAddBettorBet,
    useUpdateBettorBet,
    useDeleteBettorBet,
    useBettorBets,
} from '@/hooks/useBettorProfiles'
import { useLeagues } from '@/hooks/useMatches'
import { useSeasons, useMatchesByJornada, useMatchesBySeason } from '@/hooks/useBetting'

// ─── Constants ────────────────────────────────────────────────────────────────

const BET_TYPES = [
    'Combinada',
    '1X2', 'Más/Menos Goles', 'BTTS', 'Córners', 'Tarjetas',
    'Hándicap', 'Doble Oportunidad',
    'Resultado Exacto', 'Resultado al Descanso', 'Más/Menos (1ª parte)', 'Goleador',
    'Otro',
]
const SINGLE_BET_TYPES = BET_TYPES.filter(t => t !== 'Combinada')

const BOOKMAKERS = ['Bet365', 'William Hill', 'Betway', 'Codere', 'Marca Apuestas', 'Bwin', 'Betfair', 'Sportium', '888sport', 'Unibet', 'Winamax', 'Betclic', 'Pinnacle', 'Otro']

const STATUS_STYLES = {
    pending: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
    won:     'border-green-500/30  bg-green-500/10  text-green-400',
    lost:    'border-red-500/30    bg-red-500/10    text-red-400',
    void:    'border-border/40     bg-secondary      text-muted-foreground',
}
const STATUS_LABELS = { pending: 'Pendiente', won: 'Ganada', lost: 'Perdida', void: 'Anulada' }

// Shared empty state for a single pick (used both in AddBetForm and combined legs)
const EMPTY_PICK = {
    league_id: '', season: '', matchday: '', match_id: '',
    match_info: '', league_name: '', match_date: '',
    home_team_name: '', away_team_name: '',
    bet_type: '1X2',
    outcome: '', direction: 'Más de', amount: '', hand_team: 'Local', hand_value: '-1', free_text: '',
    home_goals_sel: '', away_goals_sel: '',
    goal_scorer: '', goal_timing: 'en cualquier momento',
    odds: '',
}

const EMPTY_BET = {
    ...EMPTY_PICK,
    stake: '', bookmaker: '',
    bet_timing: 'pre', bet_minute: '',
    currency: 'EUR', status: 'won',
}

function formatDate(dateStr) {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ─── Reusable match picker (league → season → jornada → match dropdown) ───────

function MatchPickerFields({ form, onChange, leagues, inputCls }) {
    const isWC = leagues.find(l => String(l.id) === String(form.league_id))?.code === 'WC'

    const { data: seasons = [] } = useSeasons(form.league_id || null)
    const { data: wcMatches = [], isLoading: loadingWC } = useMatchesBySeason(
        isWC && form.season ? form.league_id : null,
        isWC && form.season ? form.season      : null,
    )
    const { data: jornadaMatches = [], isLoading: loadingJornada } = useMatchesByJornada(
        !isWC && form.matchday ? form.league_id : null,
        form.season,
        form.matchday,
    )

    const loading  = isWC ? loadingWC : loadingJornada
    const matches  = isWC ? wcMatches : jornadaMatches
    const showPicker = (isWC && form.season) || (!isWC && form.matchday)

    const handleLeague = (e) => {
        const lg = leagues.find(l => String(l.id) === String(e.target.value))
        onChange({
            league_id: e.target.value, league_name: lg?.name || '',
            season: '', matchday: '', match_id: '', match_info: '',
            match_date: '', home_team_name: '', away_team_name: '',
        })
    }
    const handleSeason  = (e) => onChange({ season: e.target.value, matchday: '', match_id: '', match_info: '', match_date: '', home_team_name: '', away_team_name: '' })
    const handleMatchday = (e) => onChange({ matchday: e.target.value, match_id: '', match_info: '', match_date: '', home_team_name: '', away_team_name: '' })
    const handleMatch   = (e) => {
        const m = matches.find(x => String(x.id) === String(e.target.value))
        onChange({
            match_id:       e.target.value,
            match_info:     m ? `${m.home_team?.name || '?'} vs ${m.away_team?.name || '?'}` : '',
            match_date:     m?.match_date || '',
            home_team_name: m?.home_team?.name || '',
            away_team_name: m?.away_team?.name || '',
        })
    }

    return (
        <div className="space-y-1.5">
            <div className="grid gap-1.5 grid-cols-2 sm:grid-cols-3">
                <select value={form.league_id} onChange={handleLeague} className={inputCls}>
                    <option value="">Liga…</option>
                    {leagues.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
                {form.league_id && (
                    <select value={form.season} onChange={handleSeason} className={inputCls}>
                        <option value="">Temporada…</option>
                        {seasons.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                )}
                {!isWC && form.season && (
                    <select value={form.matchday} onChange={handleMatchday} className={inputCls}>
                        <option value="">Jornada…</option>
                        {Array.from({ length: 38 }, (_, i) => i + 1).map(j => (
                            <option key={j} value={j}>J{j}</option>
                        ))}
                    </select>
                )}
            </div>

            {showPicker && (
                loading ? (
                    <div className="flex items-center gap-2 py-1 text-xs text-muted-foreground">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Cargando partidos…
                    </div>
                ) : (
                    <>
                        <select value={form.match_id} onChange={handleMatch}
                            className={`${inputCls} ${!form.match_id ? 'border-amber-500/50' : 'border-green-500/50'}`}>
                            <option value="">— Selecciona partido —</option>
                            {matches.map(m => (
                                <option key={m.id} value={m.id}>
                                    {m.group_name ? `Gr. ${m.group_name} · ` : ''}
                                    {m.home_team?.name} vs {m.away_team?.name} · {formatDate(m.match_date)}
                                </option>
                            ))}
                        </select>
                        {form.match_info && (
                            <p className="text-[11px] text-green-400 font-medium">✓ {form.match_info}</p>
                        )}
                    </>
                )
            )}
        </div>
    )
}

// ─── Adaptive selection fields ────────────────────────────────────────────────

function AdaptiveFields({ form, set, inputCls }) {
    const homeTeam = form.home_team_name || 'Local'
    const awayTeam = form.away_team_name || 'Visitante'

    switch (form.bet_type) {
        case '1X2':
            return (
                <select value={form.outcome} onChange={e => set('outcome', e.target.value)} className={inputCls}>
                    <option value="">Resultado…</option>
                    <option value={`${homeTeam} gana`}>{homeTeam} gana</option>
                    <option value="Empate">Empate</option>
                    <option value={`${awayTeam} gana`}>{awayTeam} gana</option>
                </select>
            )
        case 'Más/Menos Goles':
        case 'Más/Menos (1ª parte)': {
            const isHalf  = form.bet_type === 'Más/Menos (1ª parte)'
            const amounts = isHalf ? ['0.5','1.5','2.5'] : ['0.5','1.5','2.5','3.5','4.5','5.5']
            return (
                <div className="flex gap-1.5">
                    <select value={form.direction} onChange={e => set('direction', e.target.value)} className={`${inputCls} flex-1`}>
                        <option>Más de</option><option>Menos de</option>
                    </select>
                    <select value={form.amount} onChange={e => set('amount', e.target.value)} className={`${inputCls} flex-1`}>
                        <option value="">{isHalf ? 'Goles 1T…' : 'Goles…'}</option>
                        {amounts.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                </div>
            )
        }
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
                <div className="flex gap-1.5">
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
                <div className="flex gap-1.5">
                    <select value={form.hand_team} onChange={e => set('hand_team', e.target.value)} className={`${inputCls} flex-1`}>
                        <option value="Local">{homeTeam}</option>
                        <option value="Visitante">{awayTeam}</option>
                    </select>
                    <select value={form.hand_value} onChange={e => set('hand_value', e.target.value)} className={`${inputCls} w-20`}>
                        {['-5','-4.5','-4','-3.5','-3','-2.5','-2','-1.5','-1','-0.5','0','+0.5','+1','+1.5','+2','+2.5','+3','+3.5','+4','+4.5','+5'].map(v => <option key={v}>{v}</option>)}
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
        case 'Resultado Exacto':
            return (
                <div className="flex items-center gap-1.5">
                    <input type="number" min="0" max="20" value={form.home_goals_sel}
                        onChange={e => set('home_goals_sel', e.target.value)}
                        placeholder="0" className={`${inputCls} w-14 text-center`} />
                    <span className="text-muted-foreground font-bold shrink-0">—</span>
                    <input type="number" min="0" max="20" value={form.away_goals_sel}
                        onChange={e => set('away_goals_sel', e.target.value)}
                        placeholder="0" className={`${inputCls} w-14 text-center`} />
                </div>
            )
        case 'Resultado al Descanso':
            return (
                <select value={form.outcome} onChange={e => set('outcome', e.target.value)} className={inputCls}>
                    <option value="">Resultado en HT…</option>
                    <option value={`${homeTeam} gana (1T)`}>{homeTeam} gana en el descanso</option>
                    <option value="Empate (1T)">Empate en el descanso</option>
                    <option value={`${awayTeam} gana (1T)`}>{awayTeam} gana en el descanso</option>
                </select>
            )
        case 'Más/Menos (1ª parte)':
            return (
                <div className="flex gap-1.5">
                    <select value={form.direction} onChange={e => set('direction', e.target.value)} className={`${inputCls} flex-1`}>
                        <option>Más de</option><option>Menos de</option>
                    </select>
                    <select value={form.amount} onChange={e => set('amount', e.target.value)} className={`${inputCls} flex-1`}>
                        <option value="">Goles 1T…</option>
                        {['0.5','1.5','2.5'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                </div>
            )
        case 'Goleador':
            return (
                <div className="space-y-1.5">
                    <input value={form.goal_scorer} onChange={e => set('goal_scorer', e.target.value)}
                        placeholder="Nombre del jugador" className={inputCls} />
                    <select value={form.goal_timing} onChange={e => set('goal_timing', e.target.value)} className={inputCls}>
                        <option value="en cualquier momento">En cualquier momento</option>
                        <option value="primero">Primer goleador</option>
                        <option value="último">Último goleador</option>
                    </select>
                </div>
            )
        default:
            return (
                <input value={form.free_text} onChange={e => set('free_text', e.target.value)}
                    placeholder="Describe tu selección" className={inputCls} />
            )
    }
}

function buildSelection(form) {
    const home = form.home_team_name || 'Local'
    const away = form.away_team_name || 'Visitante'
    switch (form.bet_type) {
        case '1X2':               return form.outcome
        case 'Más/Menos Goles':   return form.amount ? `${form.direction} ${form.amount} goles` : ''
        case 'BTTS':              return form.outcome ? `Ambos marcan: ${form.outcome}` : ''
        case 'Córners':           return form.amount ? `${form.direction} ${form.amount} córners` : ''
        case 'Tarjetas':          return form.amount ? `${form.direction} ${form.amount} tarjetas` : ''
        case 'Hándicap':          return `${form.hand_team === 'Local' ? home : away} ${form.hand_value}`
        case 'Doble Oportunidad': return form.outcome
        case 'Resultado Exacto':  return form.home_goals_sel !== '' && form.away_goals_sel !== '' ? `${form.home_goals_sel}-${form.away_goals_sel}` : ''
        case 'Resultado al Descanso': return form.outcome
        case 'Más/Menos (1ª parte)': return form.amount ? `${form.direction} ${form.amount} goles (1T)` : ''
        case 'Goleador':          return form.goal_scorer ? `${form.goal_scorer} (${form.goal_timing})` : ''
        default:                  return form.free_text
    }
}

function resetSelectionFields(form) {
    return { ...form, outcome: '', amount: '', free_text: '', home_goals_sel: '', away_goals_sel: '', goal_scorer: '' }
}

// ─── Combined bet legs form ───────────────────────────────────────────────────

function CombinedLegsForm({ legs, setLegs, leagues, inputCls }) {
    const patchLeg = (idx, updates) => {
        setLegs(prev => prev.map((leg, i) => {
            if (i !== idx) return leg
            const next = { ...leg, ...updates }
            if (updates.bet_type !== undefined) {
                next.outcome = ''; next.amount = ''; next.free_text = ''
                next.home_goals_sel = ''; next.away_goals_sel = ''; next.goal_scorer = ''
            }
            return next
        }))
    }
    const addLeg    = () => setLegs(prev => [...prev, { ...EMPTY_PICK }])
    const removeLeg = (idx) => setLegs(prev => prev.filter((_, i) => i !== idx))

    const combinedOdds = legs.reduce((acc, leg) => {
        const o = parseFloat(leg.odds)
        return (isNaN(o) || o < 1) ? acc : Math.round(acc * o * 1000) / 1000
    }, 1)

    return (
        <div className="space-y-2">
            {legs.map((leg, idx) => (
                <div key={idx} className="rounded-lg border border-primary/15 bg-background/60 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Pick {idx + 1}</span>
                        {legs.length > 2 && (
                            <button type="button" onClick={() => removeLeg(idx)}
                                className="rounded p-0.5 text-muted-foreground hover:text-red-400 transition-colors">
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Match picker per leg */}
                    <MatchPickerFields
                        form={leg}
                        onChange={updates => patchLeg(idx, updates)}
                        leagues={leagues}
                        inputCls={inputCls}
                    />

                    {/* Bet type + selection */}
                    <div className="grid grid-cols-2 gap-1.5">
                        <div>
                            <label className="block text-[10px] text-muted-foreground mb-1">Tipo</label>
                            <select value={leg.bet_type} onChange={e => patchLeg(idx, { bet_type: e.target.value })} className={inputCls}>
                                {SINGLE_BET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] text-muted-foreground mb-1">Selección</label>
                            <AdaptiveFields form={leg} set={(k, v) => patchLeg(idx, { [k]: v })} inputCls={inputCls} />
                        </div>
                    </div>

                    {/* Odds */}
                    <div className="flex items-center gap-2">
                        <label className="text-[10px] text-muted-foreground shrink-0">Cuota:</label>
                        <input type="number" step="0.01" min="1.01" value={leg.odds}
                            onChange={e => patchLeg(idx, { odds: e.target.value })}
                            placeholder="1.85" className={`${inputCls} w-28`} />
                    </div>
                </div>
            ))}

            <div className="flex items-center justify-between pt-1">
                <button type="button" onClick={addLeg}
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                    <Plus className="h-3.5 w-3.5" /> Añadir pick
                </button>
                {combinedOdds > 1 && (
                    <p className="text-xs text-muted-foreground">
                        Cuota combinada: <span className="font-bold text-foreground">{combinedOdds.toFixed(2)}</span>
                    </p>
                )}
            </div>
        </div>
    )
}

// ─── Inline edit form for a single bet ───────────────────────────────────────

function EditBetRow({ bet, profileId, onClose }) {
    const [ef, setEf] = useState({
        bet_type:   bet.bet_type,
        selection:  bet.selection,
        odds:       String(bet.odds),
        stake:      String(bet.stake),
        currency:   bet.currency || 'EUR',
        bookmaker:  bet.bookmaker || '',
        bet_timing: bet.bet_timing || 'pre',
        bet_minute: bet.bet_minute != null ? String(bet.bet_minute) : '',
        status:     bet.status,
    })
    const { mutate: update, isPending } = useUpdateBettorBet()
    const inputCls = 'w-full rounded-lg border border-border bg-background py-1.5 px-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

    const handleSave = () => {
        update({ id: bet.id, bettor_profile_id: profileId, ...ef }, { onSuccess: () => onClose() })
    }

    return (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-2 text-xs">
            <div className="grid gap-2 sm:grid-cols-2">
                <div>
                    <label className="block text-[10px] text-muted-foreground mb-1">Tipo</label>
                    <select value={ef.bet_type} onChange={e => setEf(f => ({ ...f, bet_type: e.target.value }))} className={inputCls}>
                        {SINGLE_BET_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] text-muted-foreground mb-1">Selección</label>
                    <input value={ef.selection} onChange={e => setEf(f => ({ ...f, selection: e.target.value }))} className={inputCls} />
                </div>
            </div>
            <div className="grid gap-2 grid-cols-4">
                <div>
                    <label className="block text-[10px] text-muted-foreground mb-1">Cuota</label>
                    <input type="number" step="0.01" min="1.01" value={ef.odds} onChange={e => setEf(f => ({ ...f, odds: e.target.value }))} className={inputCls} />
                </div>
                <div>
                    <label className="block text-[10px] text-muted-foreground mb-1">Stake</label>
                    <input type="number" step="0.01" min="0.01" value={ef.stake} onChange={e => setEf(f => ({ ...f, stake: e.target.value }))} className={inputCls} />
                </div>
                <div>
                    <label className="block text-[10px] text-muted-foreground mb-1">Divisa</label>
                    <select value={ef.currency} onChange={e => setEf(f => ({ ...f, currency: e.target.value }))} className={inputCls}>
                        <option value="EUR">EUR</option><option value="USD">USD</option>
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] text-muted-foreground mb-1">Resultado</label>
                    <select value={ef.status} onChange={e => setEf(f => ({ ...f, status: e.target.value }))} className={inputCls}>
                        <option value="won">Ganada</option><option value="lost">Perdida</option>
                        <option value="void">Anulada</option><option value="pending">Pendiente</option>
                    </select>
                </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
                <div>
                    <label className="block text-[10px] text-muted-foreground mb-1">Casa</label>
                    <select value={ef.bookmaker} onChange={e => setEf(f => ({ ...f, bookmaker: e.target.value }))} className={inputCls}>
                        <option value="">Sin especificar</option>
                        {BOOKMAKERS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] text-muted-foreground mb-1">Timing</label>
                    <select value={ef.bet_timing} onChange={e => setEf(f => ({ ...f, bet_timing: e.target.value }))} className={inputCls}>
                        <option value="pre">Pre-partido</option><option value="live">En vivo</option>
                    </select>
                </div>
                {ef.bet_timing === 'live' && (
                    <div>
                        <label className="block text-[10px] text-muted-foreground mb-1">Minuto</label>
                        <input type="number" min="1" max="120" value={ef.bet_minute} onChange={e => setEf(f => ({ ...f, bet_minute: e.target.value }))} className={inputCls} />
                    </div>
                )}
            </div>
            <div className="flex gap-2 pt-1">
                <button onClick={handleSave} disabled={isPending}
                    className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1 text-[11px] font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity">
                    {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />} Guardar
                </button>
                <button onClick={onClose}
                    className="rounded-lg border border-border/50 px-3 py-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                    Cancelar
                </button>
            </div>
        </div>
    )
}

// ─── Bet list for a profile ───────────────────────────────────────────────────

function BettorBetList({ profileId }) {
    const { data: bets = [], isLoading } = useBettorBets(profileId)
    const { mutate: deleteBet, isPending: deleting } = useDeleteBettorBet()
    const [editingId, setEditingId] = useState(null)

    if (isLoading) return <div className="py-4 text-center"><Loader2 className="h-5 w-5 animate-spin text-primary mx-auto" /></div>
    if (!bets.length) return <p className="py-4 text-sm text-muted-foreground text-center">Sin picks registrados.</p>

    return (
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {bets.map(bet => (
                <div key={bet.id}>
                    {editingId === bet.id ? (
                        <EditBetRow bet={bet} profileId={profileId} onClose={() => setEditingId(null)} />
                    ) : (
                        <div className="flex items-center gap-3 rounded-lg border border-border/30 bg-background/60 p-2.5 text-xs">
                            <div className="flex-1 min-w-0">
                                <span className="font-semibold text-foreground/90 truncate block">{bet.match_info}</span>
                                <span className="text-muted-foreground line-clamp-1">
                                    {bet.bet_type} · {bet.selection} · @{Number(bet.odds).toFixed(2)} · {bet.currency}{Number(bet.stake).toFixed(2)}
                                    {bet.match_date && ` · ${formatDate(bet.match_date)}`}
                                </span>
                            </div>
                            <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${STATUS_STYLES[bet.status]}`}>
                                {STATUS_LABELS[bet.status]}
                            </span>
                            <button onClick={() => setEditingId(bet.id)}
                                className="shrink-0 rounded p-1 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                                title="Editar pick">
                                <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                                onClick={() => deleteBet({ id: bet.id, bettor_profile_id: profileId })}
                                disabled={deleting}
                                className="shrink-0 rounded p-1 text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-colors">
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

// ─── Add bet form ─────────────────────────────────────────────────────────────

function AddBetForm({ profileId, onClose }) {
    const [form, setForm] = useState(EMPTY_BET)
    const [legs, setLegs] = useState([{ ...EMPTY_PICK }, { ...EMPTY_PICK }])
    const [error, setError] = useState('')
    const { mutate: addBet, isPending } = useAddBettorBet()
    const { data: leagues = [] } = useLeagues()

    const isCombined = form.bet_type === 'Combinada'

    const set = (k, v) => setForm(f => {
        const next = { ...f, [k]: v }
        if (k === 'bet_type') return resetSelectionFields(next)
        return next
    })

    const handleMatchPickerChange = (updates) => setForm(f => ({ ...f, ...updates }))

    const inputCls = 'w-full rounded-lg border border-border bg-background py-1.5 px-2.5 text-sm text-foreground placeholder-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

    const handleSubmit = () => {
        const stake = parseFloat(form.stake)
        if (!form.stake || isNaN(stake) || stake <= 0) { setError('Completa: stake > 0.'); return }

        // ── Combined bet ──────────────────────────────────────────────────────
        if (isCombined) {
            const validLegs = legs.filter(leg => {
                const sel = buildSelection(leg)
                return leg.match_info.trim() && sel && parseFloat(leg.odds) >= 1.01
            })
            if (validLegs.length < 2) {
                setError('Una combinada necesita al menos 2 picks completos (partido, selección y cuota ≥ 1.01).')
                return
            }
            const combinedOdds = Math.round(
                validLegs.reduce((acc, leg) => acc * parseFloat(leg.odds), 1) * 100
            ) / 100
            const selectionText = validLegs
                .map(leg => `${leg.match_info}: ${buildSelection(leg)} @${parseFloat(leg.odds).toFixed(2)}`)
                .join(' + ')
            setError('')
            addBet({
                bettor_profile_id: profileId,
                match_id:   null,
                match_info: `Combinada ${validLegs.length} picks`,
                league:     null,
                bet_type:   'Combinada',
                selection:  selectionText,
                odds:       combinedOdds,
                stake,
                bookmaker:  form.bookmaker || null,
                match_date: null,
                bet_timing: form.bet_timing,
                bet_minute: form.bet_timing === 'live' && form.bet_minute ? parseInt(form.bet_minute, 10) : null,
                currency:   form.currency,
                status:     form.status,
            }, {
                onSuccess: () => { setForm(EMPTY_BET); setLegs([{ ...EMPTY_PICK }, { ...EMPTY_PICK }]); onClose() },
                onError:   (e) => setError(e.message),
            })
            return
        }

        // ── Single bet ────────────────────────────────────────────────────────
        const selection = buildSelection(form)
        const missing = []
        if (!form.match_info) missing.push('partido')
        if (!selection)       missing.push('selección')
        if (!form.odds)       missing.push('cuota')
        if (missing.length) { setError(`Completa: ${missing.join(', ')}.`); return }
        const odds = parseFloat(form.odds)
        if (isNaN(odds) || odds < 1.01) { setError('Cuota ≥ 1.01.'); return }
        setError('')
        addBet({
            bettor_profile_id: profileId,
            match_id:   form.match_id || null,
            match_info: form.match_info,
            league:     form.league_name || null,
            bet_type:   form.bet_type,
            selection,
            odds,
            stake,
            bookmaker:  form.bookmaker || null,
            match_date: form.match_date || null,
            bet_timing: form.bet_timing,
            bet_minute: form.bet_timing === 'live' && form.bet_minute ? parseInt(form.bet_minute, 10) : null,
            currency:   form.currency,
            status:     form.status,
        }, {
            onSuccess: () => { setForm(EMPTY_BET); onClose() },
            onError:   (e) => setError(e.message),
        })
    }

    return (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
            <p className="text-xs font-bold text-foreground uppercase tracking-wide">Nuevo pick</p>

            {/* Bet type first — determines single vs combined layout */}
            <div>
                <label className="block text-[10px] text-muted-foreground mb-1">Tipo de apuesta</label>
                <select value={form.bet_type} onChange={e => set('bet_type', e.target.value)} className={inputCls}>
                    {BET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>

            {/* Combined bet — legs, each with their own match picker */}
            {isCombined && (
                <div>
                    <label className="block text-[10px] text-muted-foreground mb-1">Picks de la combinada</label>
                    <CombinedLegsForm legs={legs} setLegs={setLegs} leagues={leagues} inputCls={inputCls} />
                </div>
            )}

            {/* Single bet — match picker + selection */}
            {!isCombined && (
                <>
                    <div>
                        <label className="block text-[10px] text-muted-foreground mb-1">Partido <span className="text-red-400">*</span></label>
                        <MatchPickerFields form={form} onChange={handleMatchPickerChange} leagues={leagues} inputCls={inputCls} />
                    </div>
                    <div>
                        <label className="block text-[10px] text-muted-foreground mb-1">Selección</label>
                        <AdaptiveFields form={form} set={set} inputCls={inputCls} />
                    </div>
                    <div className="w-40">
                        <label className="block text-[10px] text-muted-foreground mb-1">Cuota</label>
                        <input type="number" step="0.01" min="1.01" value={form.odds}
                            onChange={e => set('odds', e.target.value)}
                            placeholder="1.85" className={inputCls} />
                    </div>
                </>
            )}

            {/* Stake / currency / resultado — always shown */}
            <div className="grid gap-2 sm:grid-cols-3">
                <div>
                    <label className="block text-[10px] text-muted-foreground mb-1">Stake</label>
                    <input type="number" step="0.01" min="0.01" value={form.stake}
                        onChange={e => set('stake', e.target.value)}
                        placeholder="10.00" className={inputCls} />
                </div>
                <div>
                    <label className="block text-[10px] text-muted-foreground mb-1">Divisa</label>
                    <select value={form.currency} onChange={e => set('currency', e.target.value)} className={inputCls}>
                        <option value="EUR">EUR €</option>
                        <option value="USD">USD $</option>
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] text-muted-foreground mb-1">Resultado</label>
                    <select value={form.status} onChange={e => set('status', e.target.value)} className={inputCls}>
                        <option value="won">Ganada</option>
                        <option value="lost">Perdida</option>
                        <option value="void">Anulada</option>
                        <option value="pending">Pendiente</option>
                    </select>
                </div>
            </div>

            {/* Bookmaker / timing — always shown */}
            <div className="grid gap-2 sm:grid-cols-3">
                <div>
                    <label className="block text-[10px] text-muted-foreground mb-1">Casa de apuestas</label>
                    <select value={form.bookmaker} onChange={e => set('bookmaker', e.target.value)} className={inputCls}>
                        <option value="">Sin especificar</option>
                        {BOOKMAKERS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] text-muted-foreground mb-1">Timing</label>
                    <select value={form.bet_timing} onChange={e => set('bet_timing', e.target.value)} className={inputCls}>
                        <option value="pre">Pre-partido</option>
                        <option value="live">En vivo</option>
                    </select>
                </div>
                {form.bet_timing === 'live' && (
                    <div>
                        <label className="block text-[10px] text-muted-foreground mb-1">Minuto</label>
                        <input type="number" min="1" max="120" value={form.bet_minute}
                            onChange={e => set('bet_minute', e.target.value)}
                            placeholder="45" className={inputCls} />
                    </div>
                )}
            </div>

            {error && (
                <p className="flex items-center gap-1.5 text-xs text-red-400">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />{error}
                </p>
            )}

            <div className="flex gap-2">
                <button onClick={handleSubmit} disabled={isPending}
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
                    {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                    Guardar pick
                </button>
                <button onClick={onClose}
                    className="flex items-center gap-1.5 rounded-lg border border-border/50 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <X className="h-3.5 w-3.5" /> Cancelar
                </button>
            </div>
        </div>
    )
}

// ─── Edit profile form ────────────────────────────────────────────────────────

function EditProfileForm({ profile, onClose }) {
    const [form, setForm] = useState({
        display_name: profile.display_name,
        avatar_url:   profile.avatar_url   || '',
        description:  profile.description  || '',
        currency:     profile.currency     || 'EUR',
    })
    const [error, setError] = useState('')
    const { mutate: update, isPending } = useUpdateBettorProfile()

    const inputCls = 'w-full rounded-lg border border-border bg-background/80 py-2 px-3 text-sm text-foreground placeholder-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

    const handleSave = () => {
        if (!form.display_name.trim()) { setError('El nombre es obligatorio.'); return }
        setError('')
        update({ id: profile.id, ...form }, {
            onSuccess: () => onClose(),
            onError:   (e) => setError(e.message),
        })
    }

    return (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
            <p className="text-xs font-bold text-foreground uppercase tracking-wide">Editar perfil</p>
            <div className="grid gap-3 sm:grid-cols-2">
                <div>
                    <label className="block text-[11px] text-muted-foreground mb-1">Nombre *</label>
                    <input value={form.display_name} onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))}
                        placeholder="Nombre del streamer" className={inputCls} />
                </div>
                <div>
                    <label className="block text-[11px] text-muted-foreground mb-1">Avatar URL</label>
                    <input value={form.avatar_url} onChange={e => setForm(f => ({ ...f, avatar_url: e.target.value }))}
                        placeholder="https://..." className={inputCls} />
                </div>
            </div>
            <div>
                <label className="block text-[11px] text-muted-foreground mb-1">Descripción</label>
                <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Tipster especializado en La Liga" className={inputCls} />
            </div>
            <div>
                <label className="block text-[11px] text-muted-foreground mb-1">Divisa base</label>
                <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} className={`${inputCls} w-32`}>
                    <option value="EUR">EUR €</option>
                    <option value="USD">USD $</option>
                </select>
            </div>
            {error && (
                <p className="flex items-center gap-1.5 text-sm text-red-400">
                    <AlertCircle className="h-4 w-4 shrink-0" />{error}
                </p>
            )}
            <div className="flex gap-2">
                <button onClick={handleSave} disabled={isPending}
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity">
                    {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                    Guardar cambios
                </button>
                <button onClick={onClose}
                    className="flex items-center gap-1.5 rounded-lg border border-border/50 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <X className="h-3.5 w-3.5" /> Cancelar
                </button>
            </div>
        </div>
    )
}

// ─── Single profile card ──────────────────────────────────────────────────────

function ProfileCard({ profile }) {
    const [expanded, setExpanded]   = useState(false)
    const [addingBet, setAddingBet] = useState(false)
    const [editing, setEditing]     = useState(false)
    const { mutate: deactivate, isPending: deactivating } = useDeactivateBettorProfile()

    return (
        <div className="rounded-xl border border-border/40 bg-card/70 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3">
                {profile.avatar_url
                    ? <img src={profile.avatar_url} alt={profile.display_name} className="h-9 w-9 rounded-full object-cover border border-border/50 shrink-0" />
                    : <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-sm font-black text-primary shrink-0">
                        {profile.display_name?.[0]?.toUpperCase() || '?'}
                      </div>
                }
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground text-sm">{profile.display_name}</span>
                        <span className={`rounded-full border px-1.5 py-0.5 text-[10px] font-bold ${profile.currency === 'USD' ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' : 'border-primary/30 bg-primary/10 text-primary'}`}>
                            {profile.currency || 'EUR'}
                        </span>
                        {!profile.is_active && (
                            <span className="rounded-full border border-red-500/30 bg-red-500/10 px-1.5 py-0.5 text-[10px] text-red-400">inactivo</span>
                        )}
                    </div>
                    {profile.description && <p className="text-xs text-muted-foreground truncate">{profile.description}</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => { setEditing(v => !v); setExpanded(true) }} title="Editar perfil"
                        className={`p-1.5 rounded transition-colors ${editing ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                        <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <Link to={`/apuestas/bettor/${profile.id}`} className="p-1.5 rounded text-muted-foreground hover:text-primary transition-colors" title="Ver perfil público">
                        <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                    <button onClick={() => setExpanded(v => !v)} className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors">
                        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {expanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-border/30">
                        <div className="px-4 py-3 space-y-3">
                            {editing && <EditProfileForm profile={profile} onClose={() => setEditing(false)} />}
                            {!editing && (
                                <div className="flex flex-wrap gap-2">
                                    <button onClick={() => setAddingBet(v => !v)}
                                        className="flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors">
                                        {addingBet ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                                        {addingBet ? 'Cancelar' : 'Añadir pick'}
                                    </button>
                                    {profile.is_active && (
                                        <button onClick={() => { if (confirm(`¿Desactivar a ${profile.display_name}?`)) deactivate(profile.id) }}
                                            disabled={deactivating}
                                            className="flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors">
                                            Desactivar perfil
                                        </button>
                                    )}
                                </div>
                            )}
                            {!editing && addingBet && <AddBetForm profileId={profile.id} onClose={() => setAddingBet(false)} />}
                            {!editing && <BettorBetList profileId={profile.id} />}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// ─── Create profile form ──────────────────────────────────────────────────────

function CreateProfileForm({ onClose }) {
    const [form, setForm] = useState({ display_name: '', avatar_url: '', description: '', currency: 'EUR' })
    const [error, setError] = useState('')
    const { mutate: create, isPending } = useCreateBettorProfile()

    const inputCls = 'w-full rounded-lg border border-border bg-background/80 py-2 px-3 text-sm text-foreground placeholder-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

    const handleCreate = () => {
        if (!form.display_name.trim()) { setError('El nombre es obligatorio.'); return }
        setError('')
        create(form, {
            onSuccess: () => onClose(),
            onError:   (e) => setError(e.message),
        })
    }

    return (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
            <p className="text-sm font-bold text-foreground">Nuevo perfil de apostador</p>
            <div className="grid gap-3 sm:grid-cols-2">
                <div>
                    <label className="block text-[11px] text-muted-foreground mb-1">Nombre *</label>
                    <input value={form.display_name} onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))}
                        placeholder="Nombre del streamer" className={inputCls} />
                </div>
                <div>
                    <label className="block text-[11px] text-muted-foreground mb-1">Avatar URL</label>
                    <input value={form.avatar_url} onChange={e => setForm(f => ({ ...f, avatar_url: e.target.value }))}
                        placeholder="https://..." className={inputCls} />
                </div>
            </div>
            <div>
                <label className="block text-[11px] text-muted-foreground mb-1">Descripción</label>
                <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Tipster especializado en La Liga" className={inputCls} />
            </div>
            <div>
                <label className="block text-[11px] text-muted-foreground mb-1">Divisa base</label>
                <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} className={`${inputCls} w-32`}>
                    <option value="EUR">EUR €</option>
                    <option value="USD">USD $</option>
                </select>
            </div>
            {error && (
                <p className="flex items-center gap-1.5 text-sm text-red-400">
                    <AlertCircle className="h-4 w-4 shrink-0" />{error}
                </p>
            )}
            <div className="flex gap-2">
                <button onClick={handleCreate} disabled={isPending}
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity">
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                    Crear perfil
                </button>
                <button onClick={onClose}
                    className="flex items-center gap-1.5 rounded-lg border border-border/50 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <X className="h-4 w-4" /> Cancelar
                </button>
            </div>
        </div>
    )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminBettors() {
    const [showCreate, setShowCreate] = useState(false)
    const { data: profiles = [], isLoading } = useBettorProfiles()

    const active   = profiles.filter(p => p.is_active !== false)
    const inactive = profiles.filter(p => p.is_active === false)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-foreground">Perfiles de apostadores</h2>
                    <p className="text-sm text-muted-foreground">Crea y gestiona perfiles de streamers para el leaderboard.</p>
                </div>
                <button onClick={() => setShowCreate(v => !v)}
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                    {showCreate ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {showCreate ? 'Cancelar' : 'Nuevo perfil'}
                </button>
            </div>

            <AnimatePresence>
                {showCreate && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                        <CreateProfileForm onClose={() => setShowCreate(false)} />
                    </motion.div>
                )}
            </AnimatePresence>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-7 w-7 animate-spin text-primary" />
                </div>
            ) : profiles.length === 0 ? (
                <div className="rounded-xl border border-border/40 bg-card/60 py-14 text-center">
                    <p className="text-muted-foreground text-sm">No hay perfiles creados todavía.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {active.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Activos ({active.length})</p>
                            {active.map(p => <ProfileCard key={p.id} profile={p} />)}
                        </div>
                    )}
                    {inactive.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Inactivos ({inactive.length})</p>
                            {inactive.map(p => <ProfileCard key={p.id} profile={p} />)}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
