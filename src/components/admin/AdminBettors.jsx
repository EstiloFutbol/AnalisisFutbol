import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, X, ChevronDown, ChevronUp, Loader2, AlertCircle, CheckCircle, Trash2, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    useBettorProfiles,
    useCreateBettorProfile,
    useUpdateBettorProfile,
    useDeactivateBettorProfile,
    useAddBettorBet,
    useDeleteBettorBet,
    useBettorBets,
    formatAmount,
    toEUR,
} from '@/hooks/useBettorProfiles'
import { useLeagues } from '@/hooks/useMatches'
import { useSeasons, useMatchesByJornada } from '@/hooks/useBetting'

// ─── Constants ────────────────────────────────────────────────────────────────

const BET_TYPES  = ['1X2', 'Más/Menos Goles', 'BTTS', 'Córners', 'Tarjetas', 'Hándicap', 'Doble Oportunidad', 'Otro']
const BOOKMAKERS = ['Bet365', 'William Hill', 'Betway', 'Codere', 'Marca Apuestas', 'Bwin', 'Betfair', 'Sportium', '888sport', 'Unibet', 'Winamax', 'Betclic', 'Pinnacle', 'Otro']

const STATUS_STYLES = {
    pending: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
    won:     'border-green-500/30  bg-green-500/10  text-green-400',
    lost:    'border-red-500/30    bg-red-500/10    text-red-400',
    void:    'border-border/40     bg-secondary      text-muted-foreground',
}
const STATUS_LABELS = { pending: 'Pendiente', won: 'Ganada', lost: 'Perdida', void: 'Anulada' }

const EMPTY_BET = {
    league_id: '', season: '', matchday: '', match_id: '',
    match_info: '', league_name: '', match_date: '',
    bet_type: '1X2', selection: '',
    odds: '', stake: '', bookmaker: '',
    bet_timing: 'pre', bet_minute: '',
    currency: 'EUR', status: 'won',
}

function formatDate(dateStr) {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ─── Bet list for a profile ────────────────────────────────────────────────────

function BettorBetList({ profileId }) {
    const { data: bets = [], isLoading } = useBettorBets(profileId)
    const { mutate: deleteBet, isPending: deleting } = useDeleteBettorBet()

    if (isLoading) return <div className="py-4 text-center"><Loader2 className="h-5 w-5 animate-spin text-primary mx-auto" /></div>
    if (!bets.length) return <p className="py-4 text-sm text-muted-foreground text-center">Sin picks registrados.</p>

    return (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {bets.map(bet => (
                <div key={bet.id} className="flex items-center gap-3 rounded-lg border border-border/30 bg-background/60 p-2.5 text-xs">
                    <div className="flex-1 min-w-0">
                        <span className="font-semibold text-foreground/90 truncate block">{bet.match_info}</span>
                        <span className="text-muted-foreground">
                            {bet.bet_type} · {bet.selection} · @{Number(bet.odds).toFixed(2)} · {bet.currency}{Number(bet.stake).toFixed(2)}
                            {bet.match_date && ` · ${formatDate(bet.match_date)}`}
                        </span>
                    </div>
                    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${STATUS_STYLES[bet.status]}`}>
                        {STATUS_LABELS[bet.status]}
                    </span>
                    <button
                        onClick={() => deleteBet({ id: bet.id, bettor_profile_id: profileId })}
                        disabled={deleting}
                        className="shrink-0 rounded p-1 text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                </div>
            ))}
        </div>
    )
}

// ─── Add bet form ─────────────────────────────────────────────────────────────

function AddBetForm({ profileId, onClose }) {
    const [form, setForm] = useState(EMPTY_BET)
    const [error, setError] = useState('')
    const { mutate: addBet, isPending } = useAddBettorBet()
    const { data: leagues = [] } = useLeagues()
    const { data: seasons = [] } = useSeasons(form.league_id || null)
    const { data: matchesForJornada = [] } = useMatchesByJornada(form.league_id, form.season, form.matchday)

    const set = (k, v) => setForm(f => {
        const next = { ...f, [k]: v }
        if (k === 'league_id') { next.season = ''; next.matchday = ''; next.match_id = ''; next.match_info = ''; next.league_name = '' }
        if (k === 'season')    { next.matchday = ''; next.match_id = ''; next.match_info = '' }
        if (k === 'matchday')  { next.match_id = ''; next.match_info = '' }
        if (k === 'match_id') {
            const m = matchesForJornada.find(x => x.id === v)
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

    const inputCls = 'w-full rounded-lg border border-border bg-background py-1.5 px-2.5 text-sm text-foreground placeholder-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

    const handleSubmit = () => {
        if (!form.match_info || !form.selection || !form.odds || !form.stake) {
            setError('Completa: partido, selección, cuota y stake.')
            return
        }
        const odds  = parseFloat(form.odds)
        const stake = parseFloat(form.stake)
        if (isNaN(odds) || odds < 1.01 || isNaN(stake) || stake <= 0) {
            setError('Cuota ≥ 1.01 y stake > 0.')
            return
        }
        setError('')
        addBet({
            bettor_profile_id: profileId,
            match_id:          form.match_id || null,
            match_info:        form.match_info,
            league:            form.league_name || null,
            bet_type:          form.bet_type,
            selection:         form.selection,
            odds,
            stake,
            bookmaker:         form.bookmaker || null,
            match_date:        form.match_date || null,
            bet_timing:        form.bet_timing,
            bet_minute:        form.bet_timing === 'live' && form.bet_minute ? parseInt(form.bet_minute, 10) : null,
            currency:          form.currency,
            status:            form.status,
        }, {
            onSuccess: () => { setForm(EMPTY_BET); onClose() },
            onError:   (e) => setError(e.message),
        })
    }

    return (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
            <p className="text-xs font-bold text-foreground uppercase tracking-wide">Nuevo pick</p>

            {/* League / season / matchday */}
            <div className="grid gap-2 sm:grid-cols-3">
                <div>
                    <label className="block text-[10px] text-muted-foreground mb-1">Liga</label>
                    <select value={form.league_id} onChange={e => set('league_id', e.target.value)} className={inputCls}>
                        <option value="">Manual</option>
                        {leagues.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                </div>
                {form.league_id && (
                    <div>
                        <label className="block text-[10px] text-muted-foreground mb-1">Temporada</label>
                        <select value={form.season} onChange={e => set('season', e.target.value)} className={inputCls}>
                            <option value="">Temporada</option>
                            {seasons.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                )}
                {form.season && (
                    <div>
                        <label className="block text-[10px] text-muted-foreground mb-1">Jornada</label>
                        <select value={form.matchday} onChange={e => set('matchday', e.target.value)} className={inputCls}>
                            <option value="">Jornada</option>
                            {Array.from({ length: 38 }, (_, i) => i + 1).map(j => <option key={j} value={j}>J{j}</option>)}
                        </select>
                    </div>
                )}
            </div>

            {/* Match */}
            {form.matchday && matchesForJornada.length > 0 ? (
                <div>
                    <label className="block text-[10px] text-muted-foreground mb-1">Partido</label>
                    <select value={form.match_id} onChange={e => set('match_id', e.target.value)} className={inputCls}>
                        <option value="">Selecciona partido</option>
                        {matchesForJornada.map(m => (
                            <option key={m.id} value={m.id}>{m.home_team?.name} vs {m.away_team?.name} · {formatDate(m.match_date)}</option>
                        ))}
                    </select>
                </div>
            ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                        <label className="block text-[10px] text-muted-foreground mb-1">Partido (texto)</label>
                        <input value={form.match_info} onChange={e => set('match_info', e.target.value)} placeholder="Real Madrid vs Barça" className={inputCls} />
                    </div>
                    <div>
                        <label className="block text-[10px] text-muted-foreground mb-1">Fecha</label>
                        <input type="date" value={form.match_date} onChange={e => set('match_date', e.target.value)} className={inputCls} />
                    </div>
                </div>
            )}

            {/* Bet type + selection */}
            <div className="grid gap-2 sm:grid-cols-2">
                <div>
                    <label className="block text-[10px] text-muted-foreground mb-1">Tipo</label>
                    <select value={form.bet_type} onChange={e => set('bet_type', e.target.value)} className={inputCls}>
                        {BET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] text-muted-foreground mb-1">Selección</label>
                    <input value={form.selection} onChange={e => set('selection', e.target.value)} placeholder="Ej: Real Madrid gana" className={inputCls} />
                </div>
            </div>

            {/* Odds / stake / currency / status */}
            <div className="grid gap-2 sm:grid-cols-4">
                <div>
                    <label className="block text-[10px] text-muted-foreground mb-1">Cuota</label>
                    <input type="number" step="0.01" min="1.01" value={form.odds} onChange={e => set('odds', e.target.value)} placeholder="1.85" className={inputCls} />
                </div>
                <div>
                    <label className="block text-[10px] text-muted-foreground mb-1">Stake</label>
                    <input type="number" step="0.01" min="0.01" value={form.stake} onChange={e => set('stake', e.target.value)} placeholder="10.00" className={inputCls} />
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

            {/* Bookmaker / timing */}
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
                        <input type="number" min="1" max="120" value={form.bet_minute} onChange={e => set('bet_minute', e.target.value)} placeholder="45" className={inputCls} />
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

// ─── Single profile card ──────────────────────────────────────────────────────

function ProfileCard({ profile }) {
    const [expanded, setExpanded]   = useState(false)
    const [addingBet, setAddingBet] = useState(false)
    const { mutate: deactivate, isPending: deactivating } = useDeactivateBettorProfile()

    return (
        <div className="rounded-xl border border-border/40 bg-card/70 overflow-hidden">
            {/* Header row */}
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
                <div className="flex items-center gap-2 shrink-0">
                    <Link to={`/apuestas/bettor/${profile.id}`} className="p-1.5 rounded text-muted-foreground hover:text-primary transition-colors" title="Ver perfil público">
                        <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                    <button onClick={() => setExpanded(v => !v)} className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors">
                        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            {/* Expanded section */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-border/30"
                    >
                        <div className="px-4 py-3 space-y-3">
                            {/* Action buttons */}
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

                            {/* Add bet form */}
                            {addingBet && <AddBetForm profileId={profile.id} onClose={() => setAddingBet(false)} />}

                            {/* Bet list */}
                            <BettorBetList profileId={profile.id} />
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
                <button
                    onClick={() => setShowCreate(v => !v)}
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                    {showCreate ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {showCreate ? 'Cancelar' : 'Nuevo perfil'}
                </button>
            </div>

            {/* Create form */}
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
                    {/* Active profiles */}
                    {active.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Activos ({active.length})</p>
                            {active.map(p => <ProfileCard key={p.id} profile={p} />)}
                        </div>
                    )}
                    {/* Inactive profiles */}
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
