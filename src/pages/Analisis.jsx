import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Brain, TrendingUp, TrendingDown, Target, Database, ChevronDown, ChevronUp,
    AlertCircle, CalendarDays, Zap, BarChart2, Info, CheckCircle, CheckCircle2,
    FlaskConical, ShieldCheck, Wallet, Trophy, Minus, Clock, Sparkles,
    ExternalLink, BarChart3, LineChart as LineIcon, PieChart, Activity,
    Filter, Settings2, TriangleAlert, Loader2,
} from 'lucide-react'
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, ScatterChart, Scatter, AreaChart, Area,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useLeagues, useMatches, useTeams } from '@/hooks/useMatches'
import { useMLPredictions, getProb, getEV, isRecommended } from '@/hooks/useMLPredictions'
import { useAIBets, useAIBotStats } from '@/hooks/useAI'
import { matchHasStarted } from '@/hooks/useBetting'
import BettingCalculator from '@/components/BettingCalculator'
import SEO from '@/components/SEO'

// ─── Tab configuration ────────────────────────────────────────────────────────

const TABS = [
    { id: 'picks',       label: 'Picks IA',    icon: Zap },
    { id: 'explorar',    label: 'Explorar',    icon: BarChart3 },
    { id: 'rendimiento', label: 'Rendimiento', icon: TrendingUp },
    { id: 'modelo',      label: 'El Modelo',   icon: FlaskConical },
]

// ─── Backtest constants ────────────────────────────────────────────────────────

const BACKTEST_STATS = [
    { label: 'Precisión 1X2',  value: '51.6%', sub: 'vs 44.5% baseline', good: true },
    { label: 'ROI histórico',  value: '+3.8%',  sub: 'Fold 3 — Random Forest', good: true },
    { label: 'Apuestas test',  value: '379',    sub: 'temporada 2024-25', good: null },
    { label: 'Hit rate 1X2',   value: '35.6%',  sub: '1 de cada 2.8 picks', good: null },
    { label: 'Partidos train', value: '1.140',  sub: '3 temporadas', good: null },
    { label: 'Precisión O/U',  value: '55.5%',  sub: 'vs 51.3% baseline', good: true },
]

const WALK_FORWARD_FOLDS = [
    { fold: 'Fold 1', train: '2021-22', test: '2022-23', roi: '-4.9%',  good: false },
    { fold: 'Fold 2', train: '2021-23', test: '2023-24', roi: '-15.8%', good: false },
    { fold: 'Fold 3', train: '2021-24', test: '2024-25', roi: '+3.8%',  good: true  },
]

const FEATURES = [
    { name: 'Elo ratings',        desc: 'Rating dinámico que captura la fortaleza relativa de cada equipo — el predictor más importante.' },
    { name: 'Forma reciente',     desc: 'Goles marcados/encajados y puntos en los últimos 5 y 10 partidos (todos los escenarios + local/visitante).' },
    { name: 'Historial H2H',      desc: 'Últimos 5 enfrentamientos directos: resultados y goles.' },
    { name: 'Stats de temporada', desc: 'Puntos por partido y diferencia de goles acumulados hasta la fecha del partido.' },
]

// ─── Explorar: axis options ────────────────────────────────────────────────────

const CHART_TYPES = [
    { id: 'bar',     label: 'Barras',     icon: BarChart3 },
    { id: 'line',    label: 'Líneas',     icon: LineIcon },
    { id: 'area',    label: 'Área',       icon: Activity },
    { id: 'scatter', label: 'Dispersión', icon: PieChart },
]

const X_AXIS_OPTIONS = [
    { id: 'match_date',         label: 'Fecha' },
    { id: 'matchday',           label: 'Jornada' },
    { id: 'home_team.name',     label: 'Equipo Local' },
    { id: 'away_team.name',     label: 'Equipo Visitante' },
    { id: 'referee',            label: 'Árbitro' },
    { id: 'stadium',            label: 'Estadio' },
    { id: 'home_coach',         label: 'Entrenador Local' },
    { id: 'away_coach',         label: 'Entrenador Visitante' },
    { id: 'day_of_week',        label: 'Día de la Semana' },
    { id: 'minute_interval',    label: 'Minuto de Juego (Intervalo 5m)' },
]

const Y_AXIS_OPTIONS = [
    { id: 'total_goals',          label: 'Goles Totales',       derive: (m) => (m.home_goals || 0) + (m.away_goals || 0) },
    { id: 'home_goals',           label: 'Goles Local' },
    { id: 'away_goals',           label: 'Goles Visitante' },
    { id: 'total_xg',             label: 'xG Total',            derive: (m) => (m.home_xg || 0) + (m.away_xg || 0) },
    { id: 'home_xg',              label: 'xG Local' },
    { id: 'away_xg',              label: 'xG Visitante' },
    { id: 'total_corners',        label: 'Córners Totales' },
    { id: 'home_corners_total',   label: 'Córners Local',       derive: (m) => m.home_corners || 0 },
    { id: 'away_corners_total',   label: 'Córners Visitante',   derive: (m) => m.away_corners || 0 },
    { id: 'total_cards',          label: 'Tarjetas Totales',    derive: (m) => (m.home_cards || 0) + (m.away_cards || 0) },
    { id: 'home_cards',           label: 'Tarjetas Local' },
    { id: 'away_cards',           label: 'Tarjetas Visitante' },
    { id: 'home_possession',      label: 'Posesión Local (%)' },
    { id: 'away_possession',      label: 'Posesión Visitante (%)' },
    { id: 'attendance',           label: 'Asistencia' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(d) {
    if (!d) return ''
    return new Date(d).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
}

function formatCoins(n) {
    if (n == null) return '—'
    return Number(n).toLocaleString('es-ES', { maximumFractionDigits: 0 })
}

// ─── Picks sub-components ────────────────────────────────────────────────────

function ProbBar({ label, prob, recommended, ev, color = 'bg-primary' }) {
    const pct = prob != null ? Math.round(prob * 100) : null
    return (
        <div className="flex items-center gap-2">
            <span className="w-14 shrink-0 text-right text-xs text-muted-foreground font-medium">{label}</span>
            <div className="relative flex-1 h-5 rounded-full bg-muted overflow-hidden">
                {pct != null && (
                    <motion.div
                        className={`h-full rounded-full ${recommended ? 'bg-emerald-500' : color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                )}
            </div>
            <span className={`w-10 shrink-0 text-xs font-bold tabular-nums ${recommended ? 'text-emerald-500' : 'text-foreground'}`}>
                {pct != null ? `${pct}%` : '—'}
            </span>
            {recommended && ev != null && (
                <span className="shrink-0 rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-500 border border-emerald-500/30">
                    EV {ev >= 0 ? '+' : ''}{(ev * 100).toFixed(1)}%
                </span>
            )}
        </div>
    )
}

function PredictionCard({ match }) {
    const [expanded, setExpanded] = useState(false)
    const preds = match.predictions
    const hasAny = preds.length > 0

    const homeP  = getProb(preds, 'result', 'Home')
    const drawP  = getProb(preds, 'result', 'Draw')
    const awayP  = getProb(preds, 'result', 'Away')
    const homeRec = isRecommended(preds, 'result', 'Home')
    const drawRec = isRecommended(preds, 'result', 'Draw')
    const awayRec = isRecommended(preds, 'result', 'Away')

    const overP  = getProb(preds, 'over25', 'Over')
    const underP = getProb(preds, 'over25', 'Under')
    const overRec = isRecommended(preds, 'over25', 'Over')

    const bttsP  = getProb(preds, 'btts', 'Yes')
    const bttsRec = isRecommended(preds, 'btts', 'Yes')

    const anyRec = preds.some(p => p.recommended)

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl border bg-card shadow-sm overflow-hidden ${anyRec ? 'border-emerald-500/40' : 'border-border'}`}
        >
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border/50">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                        {match.home_team?.logo_url && (
                            <img src={match.home_team.logo_url} alt="" className="w-6 h-6 object-contain" />
                        )}
                        <span className="text-sm font-semibold truncate">{match.home_team?.short_name || match.home_team?.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium shrink-0">vs</span>
                    <div className="flex items-center gap-2 min-w-0">
                        {match.away_team?.logo_url && (
                            <img src={match.away_team.logo_url} alt="" className="w-6 h-6 object-contain" />
                        )}
                        <span className="text-sm font-semibold truncate">{match.away_team?.short_name || match.away_team?.name}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {anyRec && (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-500 border border-emerald-500/30">
                            <Zap className="w-2.5 h-2.5" />VALOR
                        </span>
                    )}
                    <span className="text-xs text-muted-foreground">{formatDate(match.match_date)}</span>
                </div>
            </div>

            <div className="px-4 py-3 space-y-2">
                {!hasAny ? (
                    <p className="text-xs text-muted-foreground text-center py-2">Predicciones no disponibles aún</p>
                ) : (
                    <>
                        <div className="space-y-1.5">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">1X2</p>
                            <ProbBar
                                label={match.home_team?.short_name?.substring(0, 3) || 'Local'}
                                prob={homeP} recommended={homeRec} ev={getEV(preds, 'result', 'Home')}
                                color="bg-primary"
                            />
                            <ProbBar label="X" prob={drawP} recommended={drawRec} ev={getEV(preds, 'result', 'Draw')} color="bg-muted-foreground/60" />
                            <ProbBar
                                label={match.away_team?.short_name?.substring(0, 3) || 'Visit'}
                                prob={awayP} recommended={awayRec} ev={getEV(preds, 'result', 'Away')}
                                color="bg-orange-500"
                            />
                        </div>

                        {(overP != null || bttsP != null) && (
                            <button
                                onClick={() => setExpanded(e => !e)}
                                className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors mt-1"
                            >
                                {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                {expanded ? 'Menos mercados' : 'O/U · BTTS'}
                            </button>
                        )}

                        {expanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-1.5 pt-1 border-t border-border/50"
                            >
                                {overP != null && (
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Más/Menos 2.5</p>
                                        <ProbBar label="Más" prob={overP} recommended={overRec} ev={getEV(preds, 'over25', 'Over')} color="bg-blue-500" />
                                        <ProbBar label="Menos" prob={underP} color="bg-slate-400" />
                                    </div>
                                )}
                                {bttsP != null && (
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Ambos Marcan</p>
                                        <ProbBar label="Sí" prob={bttsP} recommended={bttsRec} ev={getEV(preds, 'btts', 'Yes')} color="bg-violet-500" />
                                        <ProbBar label="No" prob={bttsP != null ? 1 - bttsP : null} color="bg-slate-400" />
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </motion.div>
    )
}

function PicksEmptyState() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6 py-16 text-center"
        >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <CalendarDays className="w-10 h-10 text-primary/60" />
            </div>
            <div className="space-y-2 max-w-md">
                <h3 className="text-xl font-bold">Temporada 2025-26 completada</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                    No hay partidos próximos en este momento. Las predicciones para la
                    temporada <strong>2026-27</strong> estarán disponibles cuando arranque
                    la liga en agosto.
                </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
                <Info className="w-4 h-4 shrink-0" />
                <span>El modelo se re-entrena automáticamente con cada nuevo partido disputado.</span>
            </div>
        </motion.div>
    )
}

// ─── Tab 1: Picks ─────────────────────────────────────────────────────────────

function PicksTab() {
    const { data: leagues = [] } = useLeagues()
    const laLigaLeagues = leagues.filter(l => l.code === 'PD' || l.code === null)
    const defaultLeague = laLigaLeagues.find(l => l.is_default) || laLigaLeagues[0]
    const [activeLeagueId, setActiveLeagueId] = useState(null)
    const leagueId = activeLeagueId ?? defaultLeague?.id ?? null

    const { data: matches = [], isLoading, error } = useMLPredictions({ leagueId, upcoming: true })

    return (
        <div className="space-y-6">
            {/* Stats strip */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {BACKTEST_STATS.map(({ label, value, sub, good }) => (
                    <div key={label} className="rounded-xl border border-border bg-card p-3 text-center shadow-sm">
                        <div className={`text-xl font-black ${good === true ? 'text-emerald-500' : good === false ? 'text-red-500' : 'text-foreground'}`}>
                            {value}
                        </div>
                        <div className="text-xs font-semibold text-foreground mt-0.5">{label}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>
                    </div>
                ))}
            </div>

            {/* ROI notice */}
            <div className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm">
                <ShieldCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                    <p className="font-semibold">Qué significa el ROI histórico de +3.8%</p>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                        En la validación más rigurosa (entrenado en 2021-24, probado en 2024-25 sin ver esos datos),
                        apostar 1€ en cada pick con valor esperado positivo habría retornado{' '}
                        <strong className="text-emerald-500">3.8 céntimos de ganancia por euro apostado</strong>.
                        Las temporadas anteriores del test mostraron ROI negativo — el modelo mejora con más datos de entrenamiento.
                        Las predicciones son orientativas, no garantías.
                    </p>
                </div>
            </div>

            {/* League selector */}
            {laLigaLeagues.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                    {laLigaLeagues.map(l => (
                        <button
                            key={l.id}
                            onClick={() => setActiveLeagueId(l.id)}
                            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors border ${
                                (leagueId === l.id)
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-card text-muted-foreground border-border hover:border-primary/50'
                            }`}
                        >
                            {l.season}
                        </button>
                    ))}
                </div>
            )}

            {/* Predictions grid */}
            {isLoading ? (
                <div className="flex justify-center py-16">
                    <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </div>
            ) : error ? (
                <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    No se pudieron cargar las predicciones. Es posible que la tabla aún no exista — ejecuta la migración v18.
                </div>
            ) : matches.length === 0 ? (
                <PicksEmptyState />
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {matches.map(m => <PredictionCard key={m.id} match={m} />)}
                </div>
            )}
        </div>
    )
}

// ─── Tab 2: Explorar ──────────────────────────────────────────────────────────

function ExplorarTab() {
    const { data: matches = [], isLoading: loadingMatches } = useMatches()
    const { data: leagues = [] } = useLeagues()
    const { data: teams = [] } = useTeams()

    const [chartType, setChartType] = useState('bar')
    const [xAxis, setXAxis] = useState('match_date')
    const [yAxes, setYAxes] = useState(['total_goals'])
    const [aggregation, setAggregation] = useState('sum')

    const [selectedLeague, setSelectedLeague] = useState('')
    const [selectedTeam, setSelectedTeam] = useState('')
    const [selectedReferee, setSelectedReferee] = useState('')
    const [selectedCoach, setSelectedCoach] = useState('')

    const { referees, coaches } = useMemo(() => {
        const refs = new Set()
        const coachSet = new Set()
        matches.forEach(m => {
            if (m.referee) refs.add(m.referee)
            if (m.home_coach) coachSet.add(m.home_coach)
            if (m.away_coach) coachSet.add(m.away_coach)
        })
        return { referees: [...refs].sort(), coaches: [...coachSet].sort() }
    }, [matches])

    const filteredMatches = useMemo(() => {
        if (!matches.length) return []
        return matches.filter(m => {
            if (m.home_goals === null) return false
            if (selectedLeague) {
                const league = leagues.find(l => String(l.id) === selectedLeague)
                if (league && m.season !== league.season) return false
            }
            if (selectedReferee && m.referee !== selectedReferee) return false
            if (selectedCoach && m.home_coach !== selectedCoach && m.away_coach !== selectedCoach) return false
            if (selectedTeam) {
                const teamId = parseInt(selectedTeam)
                if (m.home_team_id !== teamId && m.away_team_id !== teamId) return false
            }
            return true
        })
    }, [matches, selectedLeague, selectedTeam, selectedReferee, selectedCoach, leagues])

    const processedData = useMemo(() => {
        if (!filteredMatches.length) return []
        let filtered = filteredMatches

        if (xAxis === 'minute_interval') {
            const buckets = {}
            for (let i = 0; i < 90; i += 5) {
                const label = `${i}-${i + 5}`
                buckets[label] = {
                    [xAxis]: label,
                    count: 0,
                    total_goals: 0,
                    home_goals: 0,
                    away_goals: 0,
                    ...Object.fromEntries(Y_AXIS_OPTIONS.filter(o => !['total_goals', 'home_goals', 'away_goals'].includes(o.id)).map(opt => [opt.id, 0]))
                }
            }
            buckets['90+'] = {
                [xAxis]: '90+',
                count: 0,
                total_goals: 0,
                home_goals: 0,
                away_goals: 0,
                ...Object.fromEntries(Y_AXIS_OPTIONS.filter(o => !['total_goals', 'home_goals', 'away_goals'].includes(o.id)).map(opt => [opt.id, 0]))
            }

            filtered.forEach(m => {
                if (Array.isArray(m.home_goal_minutes)) {
                    m.home_goal_minutes.forEach(minStr => {
                        const min = parseInt(minStr)
                        if (!isNaN(min)) {
                            let bucketKey = '90+'
                            if (min < 90) {
                                const start = Math.floor(min / 5) * 5
                                bucketKey = `${start}-${start + 5}`
                            }
                            if (buckets[bucketKey]) {
                                buckets[bucketKey].total_goals++
                                buckets[bucketKey].home_goals++
                                buckets[bucketKey].count++
                            }
                        }
                    })
                }
                if (Array.isArray(m.away_goal_minutes)) {
                    m.away_goal_minutes.forEach(minStr => {
                        const min = parseInt(minStr)
                        if (!isNaN(min)) {
                            let bucketKey = '90+'
                            if (min < 90) {
                                const start = Math.floor(min / 5) * 5
                                bucketKey = `${start}-${start + 5}`
                            }
                            if (buckets[bucketKey]) {
                                buckets[bucketKey].total_goals++
                                buckets[bucketKey].away_goals++
                                buckets[bucketKey].count++
                            }
                        }
                    })
                }
            })
            return Object.values(buckets)
        }

        let mapped = filtered.map(m => {
            const item = { ...m }
            if (xAxis.includes('.')) {
                const parts = xAxis.split('.')
                item[xAxis] = item[parts[0]]?.[parts[1]] || 'N/A'
            } else {
                item[xAxis] = m[xAxis]
            }
            Y_AXIS_OPTIONS.forEach(opt => {
                if (opt.derive) {
                    item[opt.id] = Number(opt.derive(m).toFixed(2))
                } else {
                    item[opt.id] = Number(m[opt.id] || 0)
                }
            })
            return item
        })

        if (aggregation === 'none') {
            return mapped.sort((a, b) => new Date(a.match_date) - new Date(b.match_date))
        }

        const grouped = {}
        mapped.forEach(item => {
            const key = item[xAxis]
            if (!grouped[key]) {
                grouped[key] = {
                    [xAxis]: key,
                    count: 0,
                    ...Object.fromEntries(Y_AXIS_OPTIONS.map(opt => [opt.id, 0]))
                }
            }
            grouped[key].count += 1
            Y_AXIS_OPTIONS.forEach(opt => {
                grouped[key][opt.id] += item[opt.id] || 0
            })
        })

        return Object.values(grouped).map(item => {
            if (aggregation === 'avg') {
                Y_AXIS_OPTIONS.forEach(opt => {
                    item[opt.id] = Number((item[opt.id] / item.count).toFixed(2))
                })
            } else {
                Y_AXIS_OPTIONS.forEach(opt => {
                    item[opt.id] = Number(item[opt.id].toFixed(2))
                })
            }
            return item
        }).sort((a, b) => {
            if (!isNaN(a[xAxis]) && !isNaN(b[xAxis])) return Number(a[xAxis]) - Number(b[xAxis])
            return String(a[xAxis]).localeCompare(String(b[xAxis]))
        })
    }, [filteredMatches, xAxis, aggregation])

    const toggleYAxis = (id) => {
        setYAxes(prev =>
            prev.includes(id) ? prev.filter(y => y !== id) : [...prev, id]
        )
    }

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

    return (
        <div className="space-y-6">
            <BettingCalculator matches={filteredMatches} />

            <div className="grid gap-6 lg:grid-cols-4">
                {/* Controls Panel */}
                <Card className="lg:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Settings2 className="h-5 w-5" />
                            Configuración
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Chart type */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Tipo de Gráfico</label>
                            <div className="grid grid-cols-4 gap-2">
                                {CHART_TYPES.map(type => (
                                    <button
                                        key={type.id}
                                        onClick={() => setChartType(type.id)}
                                        className={cn(
                                            'flex flex-col items-center justify-center p-2 rounded-md border transition-colors',
                                            chartType === type.id
                                                ? 'bg-primary text-primary-foreground border-primary'
                                                : 'bg-secondary/50 border-input hover:bg-secondary hover:text-foreground'
                                        )}
                                        title={type.label}
                                    >
                                        <type.icon className="h-5 w-5" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* X axis */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Eje X (Dimensión)</label>
                            <select
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                value={xAxis}
                                onChange={(e) => setXAxis(e.target.value)}
                            >
                                {X_AXIS_OPTIONS.map(opt => (
                                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Y axis */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground flex justify-between">
                                Eje Y (Métricas)
                                <span className="text-xs text-muted-foreground">{yAxes.length} selec.</span>
                            </label>
                            <div className="h-40 overflow-y-auto rounded-md border border-input bg-background/50 p-2 space-y-1">
                                {Y_AXIS_OPTIONS.map(opt => (
                                    <label key={opt.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-secondary/50 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={yAxes.includes(opt.id)}
                                            onChange={() => toggleYAxis(opt.id)}
                                            className="rounded border-slate-600 bg-slate-900 text-primary focus:ring-primary"
                                        />
                                        <span className="text-sm">{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Aggregation */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Agregación</label>
                            <div className="flex rounded-md shadow-sm">
                                {['sum', 'avg', 'none'].map((mode) => (
                                    <button
                                        key={mode}
                                        onClick={() => setAggregation(mode)}
                                        className={cn(
                                            'flex-1 px-3 py-1.5 text-xs font-medium border first:rounded-l-md last:rounded-r-md focus:z-10',
                                            aggregation === mode
                                                ? 'bg-primary text-primary-foreground border-primary z-10'
                                                : 'bg-background border-input hover:bg-secondary text-muted-foreground'
                                        )}
                                    >
                                        {mode === 'sum' ? 'Suma' : mode === 'avg' ? 'Promedio' : 'Sin Agrupar'}
                                    </button>
                                ))}
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                                {aggregation === 'none'
                                    ? 'Muestra cada partido individualmente (bueno para Fechas).'
                                    : 'Agrupa los datos por el Eje X (bueno para Equipos/Árbitros).'}
                            </p>
                        </div>

                        <div className="h-px bg-border/50" />

                        {/* Filters */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                                <Filter className="h-4 w-4" /> Filtros Globales
                            </h3>

                            <select
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={selectedLeague}
                                onChange={(e) => setSelectedLeague(e.target.value)}
                            >
                                <option value="">Todas las Ligas</option>
                                {leagues.map(l => <option key={l.id} value={l.id}>{l.name} {l.season}</option>)}
                            </select>

                            <select
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={selectedTeam}
                                onChange={(e) => setSelectedTeam(e.target.value)}
                            >
                                <option value="">Todos los Equipos</option>
                                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>

                            <select
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={selectedReferee}
                                onChange={(e) => setSelectedReferee(e.target.value)}
                            >
                                <option value="">Todos los Árbitros</option>
                                {referees.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>

                            <select
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={selectedCoach}
                                onChange={(e) => setSelectedCoach(e.target.value)}
                            >
                                <option value="">Todos los Entrenadores</option>
                                {coaches.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Visualization */}
                <Card className="lg:col-span-3 min-h-[500px] flex flex-col">
                    <CardHeader>
                        <CardTitle>Visualización</CardTitle>
                        <CardDescription>
                            Mostrando {processedData.length} registros · Agrupado por: {X_AXIS_OPTIONS.find(x => x.id === xAxis)?.label}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-[400px]">
                        {loadingMatches ? (
                            <div className="h-full flex items-center justify-center text-muted-foreground">Cargando datos...</div>
                        ) : processedData.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-muted-foreground">No hay datos para esta selección.</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                {chartType === 'bar' ? (
                                    <BarChart data={processedData}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                        <XAxis dataKey={xAxis} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} itemStyle={{ color: '#f8fafc' }} />
                                        <Legend />
                                        {yAxes.map((key, index) => (
                                            <Bar key={key} dataKey={key} fill={COLORS[index % COLORS.length]} radius={[4, 4, 0, 0]} name={Y_AXIS_OPTIONS.find(y => y.id === key)?.label} />
                                        ))}
                                    </BarChart>
                                ) : chartType === 'line' ? (
                                    <LineChart data={processedData}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                        <XAxis dataKey={xAxis} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                                        <Legend />
                                        {yAxes.map((key, index) => (
                                            <Line key={key} type="monotone" dataKey={key} stroke={COLORS[index % COLORS.length]} strokeWidth={2} dot={false} name={Y_AXIS_OPTIONS.find(y => y.id === key)?.label} />
                                        ))}
                                    </LineChart>
                                ) : chartType === 'area' ? (
                                    <AreaChart data={processedData}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                        <XAxis dataKey={xAxis} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                                        <Legend />
                                        {yAxes.map((key, index) => (
                                            <Area key={key} type="monotone" dataKey={key} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} fillOpacity={0.3} name={Y_AXIS_OPTIONS.find(y => y.id === key)?.label} />
                                        ))}
                                    </AreaChart>
                                ) : (
                                    <ScatterChart>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                        <XAxis type="category" dataKey={xAxis} name={xAxis} stroke="#888888" />
                                        <YAxis type="number" dataKey={yAxes[0]} name={yAxes[0]} stroke="#888888" />
                                        <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                                        <Legend />
                                        {yAxes.map((key, index) => (
                                            <Scatter key={key} name={Y_AXIS_OPTIONS.find(y => y.id === key)?.label} data={processedData} fill={COLORS[index % COLORS.length]} line={aggregation === 'none'} />
                                        ))}
                                    </ScatterChart>
                                )}
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

// ─── Rendimiento: AI Bet card ─────────────────────────────────────────────────

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
const STATUS_LABELS = { pending: 'Pendiente', won: 'Ganada', lost: 'Perdida', void: 'Anulada' }

function StatCard({ icon: Icon, label, value, sub = null, accent = false }) {
    return (
        <div className={`rounded-xl border px-4 py-3 ${accent ? 'border-primary/30 bg-primary/10' : 'border-border/40 bg-card/60'}`}>
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Icon className={`h-3.5 w-3.5 ${accent ? 'text-primary' : ''}`} />
                <span className="text-[11px] uppercase tracking-wide">{label}</span>
            </div>
            <p className={`text-xl font-black ${accent ? 'text-primary' : 'text-foreground'}`}>{value}</p>
            {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
        </div>
    )
}

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
                    {isSettled && <ExternalLink className="h-3.5 w-3.5 text-primary/50" />}
                </div>
            </div>

            <div className="px-4 py-3 space-y-3">
                <div className="flex items-center gap-2">
                    <div className="flex flex-1 flex-col items-center gap-1 text-center">
                        {m?.home_team?.logo_url
                            ? <img src={m.home_team.logo_url} alt="" className="h-8 w-8 object-contain" />
                            : <div className="h-8 w-8 rounded-full bg-secondary" />}
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
                            : <div className="h-8 w-8 rounded-full bg-secondary" />}
                        <span className="text-xs font-semibold text-foreground leading-tight">
                            {m?.away_team?.short_name || m?.away_team?.name}
                        </span>
                        {m?.away_goals != null && (
                            <span className="text-lg font-black text-foreground">{m.away_goals}</span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <span className="rounded-lg border border-primary/30 bg-primary/15 px-2.5 py-1 text-xs font-bold text-primary">
                        {BET_LABELS[bet.bet_type]} @{bet.odds}
                    </span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${CONF_STYLES[bet.confidence]}`}>
                        Confianza {bet.confidence}
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground">
                        {formatCoins(bet.stake)} pts {' '}
                        <span className={`font-semibold ${STATUS_STYLES[bet.status]}`}>
                            {bet.status === 'won'
                                ? `+${formatCoins(bet.potential_payout - bet.stake)}`
                                : bet.status === 'lost'
                                    ? `-${formatCoins(bet.stake)}`
                                    : STATUS_LABELS[bet.status]
                            }
                        </span>
                    </span>
                </div>

                {bet.reasoning && (
                    <button
                        onClick={(e) => { e.stopPropagation(); setExpanded(prev => !prev) }}
                        className="flex w-full items-center gap-1.5 text-left text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Sparkles className="h-3 w-3 text-primary/60 shrink-0" />
                        <span className={expanded ? '' : 'line-clamp-1'}>{bet.reasoning}</span>
                        {expanded ? <ChevronUp className="h-3 w-3 shrink-0" /> : <ChevronDown className="h-3 w-3 shrink-0" />}
                    </button>
                )}

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

// ─── Tab 3: Rendimiento ───────────────────────────────────────────────────────

function RendimientoTab() {
    const { data: bets = [], isLoading } = useAIBets()
    const stats = useAIBotStats(bets)
    const [betsTab, setBetsTab] = useState('pending')

    const pendingBets = bets.filter(b => b.status === 'pending')
    const settledBets = bets.filter(b => b.status !== 'pending' && b.status !== 'void')
    const roiPositive = parseFloat(stats.roi) >= 0

    return (
        <div className="space-y-6">
            {/* Disclaimer */}
            <div className="flex items-start gap-3 rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3">
                <TriangleAlert className="h-4 w-4 shrink-0 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <p className="text-xs text-yellow-900 dark:text-yellow-300/90 leading-relaxed">
                    <span className="font-semibold">Aviso:</span> Las predicciones del sistema son experimentales y pueden fallar.
                    Este historial usa <em>puntuación virtual</em> sin valor real.
                    <span className="font-semibold"> No uses estas recomendaciones para apuestas con dinero real.</span>
                </p>
            </div>

            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/15">
                    <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h2 className="text-2xl font-black tracking-tight">Rendimiento del Sistema</h2>
                    <p className="text-sm text-muted-foreground">Historial de picks automáticos del modelo</p>
                </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                <div className="col-span-2 sm:col-span-2 lg:col-span-2">
                    <StatCard
                        icon={Wallet}
                        label="Saldo del Sistema"
                        value={`${formatCoins(stats.balance)} pts`}
                        sub="Empezó con 1,000 puntos"
                        accent
                    />
                </div>
                <StatCard icon={Trophy}    label="Ganadas"      value={stats.won}      sub={`de ${stats.totalBets} picks`} />
                <StatCard icon={Minus}     label="Perdidas"     value={stats.lost}     sub={`${stats.pending} pendientes`} />
                <StatCard
                    icon={roiPositive ? TrendingUp : TrendingDown}
                    label="ROI"
                    value={`${roiPositive ? '+' : ''}${stats.roi}%`}
                    sub={`${roiPositive ? '+' : ''}${formatCoins(stats.profit)} pts`}
                />
                <StatCard icon={Target}   label="Win Rate"     value={`${stats.winRate}%`} />
                <StatCard icon={Zap}      label="Racha actual" value={`${stats.streak}`} sub="victorias seguidas" />
            </div>

            {/* Picks section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Picks del Sistema</h3>

                {/* Tab selector */}
                <div className="flex rounded-lg border border-border/50 bg-background/50 p-1 w-fit">
                    {[
                        { id: 'pending', label: `Próximos (${pendingBets.length})` },
                        { id: 'settled', label: `Historial (${settledBets.length})` },
                    ].map(t => (
                        <button
                            key={t.id}
                            onClick={() => setBetsTab(t.id)}
                            className={`relative rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                                betsTab === t.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {betsTab === t.id && (
                                <motion.div
                                    layoutId="rendimiento-tab"
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
                            <TrendingUp className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                            <p className="text-muted-foreground text-sm">El sistema aún no tiene picks activos.</p>
                        </div>
                    ) : (
                        <div className="grid gap-3 sm:grid-cols-2">
                            {pendingBets.map(bet => <AIBetCard key={bet.id} bet={bet} />)}
                        </div>
                    )
                ) : (
                    settledBets.length === 0 ? (
                        <div className="rounded-2xl border border-border/40 bg-card/60 py-12 text-center">
                            <p className="text-muted-foreground text-sm">Sin historial de picks aún.</p>
                        </div>
                    ) : (
                        <div className="grid gap-3 sm:grid-cols-2">
                            {settledBets.map(bet => <AIBetCard key={bet.id} bet={bet} />)}
                        </div>
                    )
                )}
            </div>
        </div>
    )
}

// ─── Tab 4: Modelo ────────────────────────────────────────────────────────────

function ModeloTab() {
    return (
        <div className="space-y-8 max-w-4xl">
            {/* Intro */}
            <div className="space-y-2">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <FlaskConical className="w-6 h-6 text-primary" />
                    Metodología del Modelo
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                    Un modelo de Machine Learning entrenado con 5 temporadas de La Liga (2021-2026),
                    diseñado para encontrar apuestas con valor esperado positivo.
                </p>
            </div>

            {/* Features */}
            <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                    <Database className="w-5 h-5 text-primary" />
                    Variables de entrada (31 indicadores pre-partido)
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                    {FEATURES.map(f => (
                        <div key={f.name} className="rounded-lg bg-muted/40 border border-border/50 p-4">
                            <p className="text-sm font-semibold">{f.name}</p>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4 leading-relaxed p-3 rounded-lg bg-muted/20 border border-border/30">
                    <strong>Importante:</strong> Las cuotas de las casas de apuestas NO se usan como input del modelo.
                    Solo se usan para calcular el valor esperado (EV) después de generar la predicción.
                    Esto evita la circularidad y permite detectar cuando el modelo diverge del mercado.
                </p>
            </div>

            {/* Algorithm */}
            <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                    <Brain className="w-5 h-5 text-primary" />
                    Algoritmo
                </h3>
                <div className="rounded-lg bg-muted/40 border border-border/50 p-4 space-y-3">
                    <p className="text-sm"><strong>Random Forest</strong> calibrado con isotonic regression — produce probabilidades bien calibradas para 1X2, BTTS y Más/Menos 2.5 goles.</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        El predictor más importante en todos los mercados es la <strong>diferencia de Elo</strong> entre los equipos,
                        seguido de los Elos individuales y las estadísticas de temporada.
                        La calibración isotónica corrige el sobreajuste típico de los Random Forests en predicciones de probabilidad.
                    </p>
                </div>
            </div>

            {/* Walk-forward table */}
            <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                    <BarChart2 className="w-5 h-5 text-primary" />
                    Validación walk-forward (mercado 1X2)
                </h3>
                <div className="overflow-x-auto rounded-lg border border-border bg-card">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-border bg-muted/30">
                                <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Fold</th>
                                <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Entrenamiento</th>
                                <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Test</th>
                                <th className="text-right px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">ROI (stake plana)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {WALK_FORWARD_FOLDS.map(row => (
                                <tr key={row.fold} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-4 py-3 text-sm font-medium">{row.fold}</td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">{row.train}</td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">{row.test}</td>
                                    <td className={`px-4 py-3 text-sm font-bold text-right ${row.good ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {row.roi}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                    El modelo mejora claramente con más datos de entrenamiento. El Fold 3 (el más realista,
                    con 1.140 partidos de entrenamiento) es el único con ROI positivo. La varianza estadística
                    en muestras de ~380 partidos es alta — el +3.8% no es estadísticamente significativo por sí solo.
                </p>
            </div>

            {/* EV formula */}
            <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Valor Esperado (EV)
                </h3>
                <div className="rounded-lg bg-muted/40 border border-border/50 p-4 space-y-3">
                    <div className="font-mono text-sm bg-background rounded-lg p-3 border border-border">
                        EV = probabilidad_modelo × cuota_decimal − 1
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Un pick se marca como <strong className="text-emerald-500">recomendado</strong> cuando EV ≥ 5%.
                        Significa que el modelo estima un precio más alto que el de la casa de apuestas.
                    </p>
                    <div className="rounded-lg bg-background border border-border/50 p-3">
                        <p className="text-xs text-muted-foreground font-medium mb-1">Ejemplo:</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Si el modelo da <strong>40% de probabilidad</strong> y la cuota implica 33%
                            (cuota 3.00), el EV = 0.40 × 3.0 − 1 = <strong className="text-emerald-500">+20%</strong>.
                            Un EV positivo sugiere que la apuesta tiene valor a largo plazo.
                        </p>
                    </div>
                </div>
            </div>

            {/* Backtest stats */}
            <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                    <Target className="w-5 h-5 text-primary" />
                    Resultados del Backtest
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {BACKTEST_STATS.map(({ label, value, sub, good }) => (
                        <div key={label} className="rounded-xl border border-border bg-card p-4 text-center shadow-sm">
                            <div className={`text-2xl font-black ${good === true ? 'text-emerald-500' : good === false ? 'text-red-500' : 'text-foreground'}`}>
                                {value}
                            </div>
                            <div className="text-xs font-semibold text-foreground mt-1">{label}</div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-4">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div className="space-y-1">
                    <p className="text-sm font-semibold text-amber-900 dark:text-amber-300">Aviso de responsabilidad</p>
                    <p className="text-xs text-amber-800 dark:text-amber-400/90 leading-relaxed">
                        Las predicciones son orientativas y no constituyen consejo financiero.
                        El rendimiento pasado no garantiza resultados futuros.
                        Las apuestas conllevan riesgo de pérdida. Juega con responsabilidad.
                        Mayores de 18 años. Si tienes problemas con el juego, llama al <strong>900 200 225</strong> (JugarBien.es, gratuito y confidencial).
                    </p>
                </div>
            </div>
        </div>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Analisis() {
    const [activeTab, setActiveTab] = useState('picks')

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Análisis IA | AnalisisFutbol"
                description="Predicciones ML, explorador de datos, rendimiento del sistema y metodología del modelo de machine learning para La Liga."
            />

            <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
                {/* Page header */}
                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-1"
                >
                    <div className="flex items-center gap-2">
                        <Brain className="w-6 h-6 text-primary" />
                        <h1 className="text-2xl font-bold">Análisis IA</h1>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        Predicciones del modelo ML, explorador de datos, historial del sistema y metodología.
                    </p>
                </motion.div>

                {/* Tab bar */}
                <div className="relative flex gap-1 rounded-xl border border-border/50 bg-muted/30 p-1 w-full sm:w-fit">
                    {TABS.map(tab => {
                        const Icon = tab.icon
                        const isActive = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'text-primary-foreground'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="analisis-tab"
                                        className="absolute inset-0 rounded-lg bg-primary"
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                                    />
                                )}
                                <Icon className="w-4 h-4 relative z-10" />
                                <span className="relative z-10">{tab.label}</span>
                            </button>
                        )
                    })}
                </div>

                {/* Tab content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18 }}
                    >
                        {activeTab === 'picks'       && <PicksTab />}
                        {activeTab === 'explorar'    && <ExplorarTab />}
                        {activeTab === 'rendimiento' && <RendimientoTab />}
                        {activeTab === 'modelo'      && <ModeloTab />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
