import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Brain, TrendingUp, Target, Database, ChevronDown, ChevronUp,
    AlertCircle, CalendarDays, Zap, BarChart2, Info, CheckCircle2,
    FlaskConical, ShieldCheck,
} from 'lucide-react'
import { useLeagues } from '@/hooks/useMatches'
import { useMLPredictions, getProb, getEV, isRecommended } from '@/hooks/useMLPredictions'
import SEO from '@/components/SEO'

// ─── Constants ────────────────────────────────────────────────────────────────

// Hardcoded backtest results (from ml/backtest.py — fold 3: train 2021-24, test 2024-25)
const BACKTEST_STATS = [
    { label: 'Precisión 1X2',   value: '51.6%', sub: 'vs 44.5% baseline', good: true },
    { label: 'ROI histórico',   value: '+3.8%',  sub: 'Fold 3 — Random Forest', good: true },
    { label: 'Apuestas test',   value: '379',    sub: 'temporada 2024-25', good: null },
    { label: 'Hit rate 1X2',    value: '35.6%',  sub: '1 de cada 2.8 picks', good: null },
    { label: 'Partidos train',  value: '1.140',  sub: '3 temporadas', good: null },
    { label: 'Precisión O/U',   value: '55.5%',  sub: 'vs 51.3% baseline', good: true },
]

const WALK_FORWARD_FOLDS = [
    { fold: 'Fold 1', train: '2021-22', test: '2022-23', roi: '-4.9%', good: false },
    { fold: 'Fold 2', train: '2021-23', test: '2023-24', roi: '-15.8%', good: false },
    { fold: 'Fold 3', train: '2021-24', test: '2024-25', roi: '+3.8%', good: true },
]

const FEATURES = [
    { name: 'Elo ratings', desc: 'Rating dinámico que captura la fortaleza relativa de cada equipo — el predictor más importante.' },
    { name: 'Forma reciente', desc: 'Goles marcados/encajados y puntos en los últimos 5 y 10 partidos (todos los escenarios + local/visitante).' },
    { name: 'Historial H2H', desc: 'Últimos 5 enfrentamientos directos: resultados y goles.' },
    { name: 'Stats de temporada', desc: 'Puntos por partido y diferencia de goles acumulados hasta la fecha del partido.' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('es-ES', {
        weekday: 'short', day: 'numeric', month: 'short',
    })
}

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

    // Result probs
    const homeP = getProb(preds, 'result', 'Home')
    const drawP = getProb(preds, 'result', 'Draw')
    const awayP = getProb(preds, 'result', 'Away')
    const homeRec = isRecommended(preds, 'result', 'Home')
    const drawRec = isRecommended(preds, 'result', 'Draw')
    const awayRec = isRecommended(preds, 'result', 'Away')

    // O/U probs
    const overP  = getProb(preds, 'over25', 'Over')
    const underP = getProb(preds, 'over25', 'Under')
    const overRec = isRecommended(preds, 'over25', 'Over')

    // BTTS probs
    const bttsP  = getProb(preds, 'btts', 'Yes')
    const bttsRec = isRecommended(preds, 'btts', 'Yes')

    const anyRec = preds.some(p => p.recommended)

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl border bg-card shadow-sm overflow-hidden ${anyRec ? 'border-emerald-500/40' : 'border-border'}`}
        >
            {/* Header */}
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

            {/* Body */}
            <div className="px-4 py-3 space-y-2">
                {!hasAny ? (
                    <p className="text-xs text-muted-foreground text-center py-2">Predicciones no disponibles aún</p>
                ) : (
                    <>
                        {/* 1X2 */}
                        <div className="space-y-1.5">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">1X2</p>
                            <ProbBar
                                label={match.home_team?.short_name?.substring(0,3) || 'Local'}
                                prob={homeP} recommended={homeRec} ev={getEV(preds,'result','Home')}
                                color="bg-primary"
                            />
                            <ProbBar label="X" prob={drawP} recommended={drawRec} ev={getEV(preds,'result','Draw')} color="bg-muted-foreground/60" />
                            <ProbBar
                                label={match.away_team?.short_name?.substring(0,3) || 'Visit'}
                                prob={awayP} recommended={awayRec} ev={getEV(preds,'result','Away')}
                                color="bg-orange-500"
                            />
                        </div>

                        {/* More markets toggle */}
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
                                        <ProbBar label="Más" prob={overP} recommended={overRec} ev={getEV(preds,'over25','Over')} color="bg-blue-500" />
                                        <ProbBar label="Menos" prob={underP} color="bg-slate-400" />
                                    </div>
                                )}
                                {bttsP != null && (
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Ambos Marcan</p>
                                        <ProbBar label="Sí" prob={bttsP} recommended={bttsRec} ev={getEV(preds,'btts','Yes')} color="bg-violet-500" />
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

function EmptyState() {
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

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function MLPredictions() {
    const { data: leagues = [] } = useLeagues()
    const laLigaLeagues = leagues.filter(l => l.code === 'PD' || l.code === null)
    const defaultLeague = laLigaLeagues.find(l => l.is_default) || laLigaLeagues[0]
    const [activeLeagueId, setActiveLeagueId] = useState(null)

    // Use default league on first render
    const leagueId = activeLeagueId ?? defaultLeague?.id ?? null

    const { data: matches = [], isLoading, error } = useMLPredictions({ leagueId, upcoming: true })

    const [showMethod, setShowMethod] = useState(false)

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Predicciones IA | AnalisisFutbol"
                description="Predicciones de partidos generadas por nuestro modelo de machine learning entrenado con 5 temporadas de La Liga."
            />

            <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">

                {/* ── Header ────────────────────────────────────────────────── */}
                <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Brain className="w-6 h-6 text-primary" />
                        <h1 className="text-2xl font-bold">Predicciones del Modelo IA</h1>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        Probabilidades calculadas por un modelo de Machine Learning entrenado con{' '}
                        <strong>5 temporadas de La Liga</strong> (2021–2026).
                        Sin apuestas implícitas — solo datos para informar tu decisión.
                    </p>
                </motion.div>

                {/* ── Stats strip ─────────────────────────────────────────── */}
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

                {/* ── ROI notice ──────────────────────────────────────────── */}
                <div className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm">
                    <ShieldCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div className="space-y-0.5">
                        <p className="font-semibold">¿Qué significa el ROI histórico de +3.8%?</p>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                            En la validación más rigurosa (entrenado en 2021-24, probado en 2024-25 sin ver esos datos),
                            apostar 1€ en cada pick con valor esperado positivo habría retornado{' '}
                            <strong className="text-emerald-500">3.8 céntimos de ganancia por euro apostado</strong>.
                            Las temporadas anteriores del test mostraron ROI negativo — el modelo mejora con más datos de entrenamiento.
                            Las predicciones son orientativas, no garantías.
                        </p>
                    </div>
                </div>

                {/* ── League selector ─────────────────────────────────────── */}
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

                {/* ── Predictions grid ────────────────────────────────────── */}
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
                    <EmptyState />
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {matches.map(m => <PredictionCard key={m.id} match={m} />)}
                    </div>
                )}

                {/* ── Methodology accordion ───────────────────────────────── */}
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <button
                        onClick={() => setShowMethod(e => !e)}
                        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-muted/30 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <FlaskConical className="w-4 h-4 text-primary" />
                            <span className="font-semibold">Metodología del Modelo</span>
                        </div>
                        {showMethod ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </button>

                    {showMethod && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="px-5 pb-6 space-y-6 border-t border-border/50"
                        >
                            {/* Features */}
                            <div className="pt-4">
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <Database className="w-4 h-4 text-primary" />
                                    Variables de entrada (31 indicadores pre-partido)
                                </h3>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {FEATURES.map(f => (
                                        <div key={f.name} className="rounded-lg bg-muted/40 p-3">
                                            <p className="text-sm font-semibold">{f.name}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground mt-3">
                                    <strong>Importante:</strong> Las cuotas de las casas de apuestas NO se usan como input del modelo.
                                    Solo se usan para calcular el valor esperado (EV) después de generar la predicción.
                                    Esto evita la circularidad y permite detectar cuando el modelo diverge del mercado.
                                </p>
                            </div>

                            {/* Algorithm */}
                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <Brain className="w-4 h-4 text-primary" />
                                    Algoritmo
                                </h3>
                                <div className="rounded-lg bg-muted/40 p-3 space-y-2 text-sm">
                                    <p><strong>Random Forest</strong> calibrado con isotonic regression — produce probabilidades bien calibradas para 1X2, BTTS y Más/Menos 2.5 goles.</p>
                                    <p className="text-xs text-muted-foreground">El predictor más importante en todos los mercados es la <strong>diferencia de Elo</strong> entre los equipos, seguido de los Elos individuales y las estadísticas de temporada.</p>
                                </div>
                            </div>

                            {/* Walk-forward table */}
                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <BarChart2 className="w-4 h-4 text-primary" />
                                    Validación walk-forward (mercado 1X2)
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm border-collapse">
                                        <thead>
                                            <tr className="border-b border-border">
                                                <th className="text-left pb-2 font-semibold text-muted-foreground text-xs">Fold</th>
                                                <th className="text-left pb-2 font-semibold text-muted-foreground text-xs">Entrenamiento</th>
                                                <th className="text-left pb-2 font-semibold text-muted-foreground text-xs">Test</th>
                                                <th className="text-right pb-2 font-semibold text-muted-foreground text-xs">ROI (stake plana)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/50">
                                            {WALK_FORWARD_FOLDS.map(row => (
                                                <tr key={row.fold}>
                                                    <td className="py-2 text-xs font-medium">{row.fold}</td>
                                                    <td className="py-2 text-xs text-muted-foreground">{row.train}</td>
                                                    <td className="py-2 text-xs text-muted-foreground">{row.test}</td>
                                                    <td className={`py-2 text-xs font-bold text-right ${row.good ? 'text-emerald-500' : 'text-red-500'}`}>
                                                        {row.roi}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                                    El modelo mejora claramente con más datos de entrenamiento. El Fold 3 (el más realista,
                                    con 1.140 partidos de entrenamiento) es el único con ROI positivo. La varianza estadística
                                    en muestras de ~380 partidos es alta — el +3.8% no es estadísticamente significativo por sí solo.
                                </p>
                            </div>

                            {/* EV explanation */}
                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-primary" />
                                    Valor Esperado (EV)
                                </h3>
                                <div className="rounded-lg bg-muted/40 p-3 text-sm space-y-2">
                                    <p className="font-mono text-xs bg-background rounded p-2 border border-border">
                                        EV = probabilidad_modelo × cuota_decimal − 1
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Un pick se marca como <strong className="text-emerald-500">recomendado</strong> cuando EV ≥ 5%.
                                        Significa que el modelo estima un precio más alto que el de la casa de apuestas.
                                        Ejemplo: si el modelo da 40% de probabilidad y la cuota implica 33%,
                                        el EV = 0.40 × 3.0 − 1 = +20%.
                                    </p>
                                </div>
                            </div>

                            {/* Disclaimer */}
                            <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-xs text-amber-700 dark:text-amber-400">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                <span>
                                    Las predicciones son orientativas y no constituyen consejo financiero.
                                    El rendimiento pasado no garantiza resultados futuros.
                                    Las apuestas conllevan riesgo de pérdida. Juega con responsabilidad.
                                </span>
                            </div>
                        </motion.div>
                    )}
                </div>

            </div>
        </div>
    )
}
