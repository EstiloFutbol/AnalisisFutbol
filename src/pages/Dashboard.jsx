import { useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useMatches, useLeagues } from '@/hooks/useMatches'
import { usePlayerLeaderboard } from '@/hooks/usePlayerStats'
import {
    Trophy, Goal, Target, TrendingUp, Activity,
    BarChart3, Clock, Shield, CreditCard,
    AlertTriangle, Zap, Info, Users, Crosshair,
    ArrowUpRight, Minus, ArrowDownRight, Star, Timer
} from 'lucide-react'
import GoalTimeChart from '@/components/charts/GoalTimeChart'
import StatDistributionChart from '@/components/charts/StatDistributionChart'

// ─── Helpers ────────────────────────────────────────────────────────────────

function pct(count, total) {
    if (!total) return '0'
    return ((count / total) * 100).toFixed(0)
}

function avg(sum, count) {
    if (!count) return '0.0'
    return (sum / count).toFixed(1)
}

// ─── UI atoms ───────────────────────────────────────────────────────────────

const COLORS = {
    green: 'text-green-400 bg-green-500/10 border-green-500/20',
    blue: 'text-blue-400  bg-blue-500/10  border-blue-500/20',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    yellow: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    red: 'text-red-400   bg-red-500/10   border-red-500/20',
    primary: 'text-primary   bg-primary/10   border-primary/20',
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
}

function StatCard({ icon: Icon, label, value, sublabel, color = 'primary' }) {
    const cls = COLORS[color] || COLORS.primary
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
        >
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">{label}</p>
                    <p className="text-2xl font-black tracking-tight text-foreground">{value}</p>
                    {sublabel && <p className="text-[10px] font-medium text-muted-foreground">{sublabel}</p>}
                </div>
                <div className={`rounded-xl border p-2 md:p-2.5 ${cls}`}>
                    <Icon className="h-4 w-4 md:h-5 md:w-5" />
                </div>
            </div>
            <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-primary/5 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
        </motion.div>
    )
}

function SectionHeader({ icon: Icon, title, subtitle }) {
    return (
        <div className="flex items-center gap-3 px-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <Icon className="h-4 w-4 text-primary" />
            </div>
            <div>
                <h2 className="text-sm font-black uppercase tracking-[0.15em] text-foreground">{title}</h2>
                {subtitle && <p className="text-[10px] text-muted-foreground">{subtitle}</p>}
            </div>
        </div>
    )
}

function MarketRow({ label, value, sublabel = null, trend = null, color = 'primary' }) {
    const cls = COLORS[color] || COLORS.primary
    const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus
    return (
        <div className="flex items-center justify-between rounded-xl border border-border/30 bg-card/40 px-4 py-3 transition-colors hover:bg-card/70">
            <span className="text-sm text-muted-foreground">{label}</span>
            <div className="flex items-center gap-2">
                {sublabel && <span className="text-xs text-muted-foreground/60">{sublabel}</span>}
                <span className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-0.5 text-sm font-black ${cls}`}>
                    {trend && <TrendIcon className="h-3 w-3" />}
                    {value}
                </span>
            </div>
        </div>
    )
}

function InsightBadge({ title, description, color = 'primary' }) {
    const cls = COLORS[color] || COLORS.primary
    return (
        <div className={`rounded-xl border p-4 ${cls.split(' ').slice(1).join(' ')}`}>
            <p className={`text-xs font-black uppercase tracking-wider ${cls.split(' ')[0]}`}>{title}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{description}</p>
        </div>
    )
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function Dashboard() {
    const [searchParams, setSearchParams] = useSearchParams()
    const { data: leagues = [] } = useLeagues()

    const selectedLeagueId = searchParams.get('league')
    const defaultLeague = leagues.find(l => l.is_default) || leagues[0]
    const activeLeagueId = selectedLeagueId || (defaultLeague ? String(defaultLeague.id) : null)

    useEffect(() => {
        if (!selectedLeagueId && defaultLeague) {
            setSearchParams({ league: String(defaultLeague.id) }, { replace: true })
        }
    }, [selectedLeagueId, defaultLeague, setSearchParams])

    const { data: matches = [], isLoading } = useMatches(activeLeagueId, { playedOnly: true })
    const { data: players = [] } = usePlayerLeaderboard(activeLeagueId)

    // ── Core computed stats ──────────────────────────────────────────────────
    const s = useMemo(() => {
        if (!matches.length) return null
        const n = matches.length

        // Goals
        const goals = matches.map(m => (m.home_goals || 0) + (m.away_goals || 0))
        const totalGoals = goals.reduce((a, b) => a + b, 0)
        const over05 = goals.filter(g => g > 0.5).length
        const over15 = goals.filter(g => g > 1.5).length
        const over25 = goals.filter(g => g > 2.5).length
        const over35 = goals.filter(g => g > 3.5).length
        const over45 = goals.filter(g => g > 4.5).length
        const btts = matches.filter(m => (m.home_goals || 0) > 0 && (m.away_goals || 0) > 0).length
        const homeWins = matches.filter(m => (m.home_goals || 0) > (m.away_goals || 0)).length
        const draws = matches.filter(m => (m.home_goals || 0) === (m.away_goals || 0)).length
        const awayWins = matches.filter(m => (m.away_goals || 0) > (m.home_goals || 0)).length

        // Exact scores
        const scoreCounts = {}
        matches.forEach(m => {
            const key = `${m.home_goals || 0}-${m.away_goals || 0}`
            scoreCounts[key] = (scoreCounts[key] || 0) + 1
        })
        const topScores = Object.entries(scoreCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([score, count]) => ({ score, count, pct: pct(count, n) }))

        // First team to score
        const homeScoresFirst = matches.filter(m => {
            const hMin = m.home_goal_minutes?.[0] ?? 999
            const aMin = m.away_goal_minutes?.[0] ?? 999
            return hMin < aMin
        }).length
        const awayScoresFirst = matches.filter(m => {
            const hMin = m.home_goal_minutes?.[0] ?? 999
            const aMin = m.away_goal_minutes?.[0] ?? 999
            return aMin < hMin
        }).length

        // First goal minute buckets
        const firstGoalMins = []
        matches.forEach(m => {
            const allMins = [...(m.home_goal_minutes || []), ...(m.away_goal_minutes || [])].filter(Boolean)
            if (allMins.length) firstGoalMins.push(Math.min(...allMins))
        })
        const firstGoalMinsCount = firstGoalMins.length
        const fgUnder30 = firstGoalMins.filter(m => m <= 30).length
        const fg3060 = firstGoalMins.filter(m => m > 30 && m <= 60).length
        const fgOver60 = firstGoalMins.filter(m => m > 60).length

        // Corners
        const totalCorners = matches.reduce((a, m) => a + (m.total_corners || 0), 0)
        const homeCorners = matches.reduce((a, m) => a + (m.home_corners || 0), 0)
        const awayCorners = matches.reduce((a, m) => a + (m.away_corners || 0), 0)
        const over85c = matches.filter(m => (m.total_corners || 0) > 8.5).length
        const over105c = matches.filter(m => (m.total_corners || 0) > 10.5).length

        // Cards
        const yc = matches.reduce((a, m) => a + (m.home_yellow_cards || m.home_cards || 0) + (m.away_yellow_cards || m.away_cards || 0), 0)
        const rc = matches.reduce((a, m) => a + (m.home_red_cards || 0) + (m.away_red_cards || 0), 0)
        const over35yc = matches.filter(m => ((m.home_yellow_cards || m.home_cards || 0) + (m.away_yellow_cards || m.away_cards || 0)) > 3.5).length
        const over15yc = matches.filter(m => ((m.home_yellow_cards || m.home_cards || 0) + (m.away_yellow_cards || m.away_cards || 0)) > 1.5).length
        const matchesWithRed = matches.filter(m => (m.home_red_cards || 0) + (m.away_red_cards || 0) > 0).length

        // HT data
        const htGoals = matches.map(m => {
            const allMins = [...(m.home_goal_minutes || []), ...(m.away_goal_minutes || [])]
            return allMins.filter(min => min != null && min <= 45).length
        })
        const avgHtGoals = htGoals.reduce((a, b) => a + b, 0) / (n || 1)

        // Shots (FBref data)
        const totalShots = matches.reduce((a, m) => a + (m.home_shots || 0) + (m.away_shots || 0), 0)
        const matchesWithShots = matches.filter(m => m.home_shots != null).length

        // Doble oportunidad
        const x1 = homeWins + draws
        const x2 = awayWins + draws

        return {
            n, totalGoals, over05, over15, over25, over35, over45,
            btts, homeWins, draws, awayWins, topScores,
            homeScoresFirst, awayScoresFirst,
            fgUnder30, fg3060, fgOver60, firstGoalMinsCount: firstGoalMins.length,
            totalCorners, homeCorners, awayCorners, over85c, over105c,
            yc, rc, over35yc, over15yc, matchesWithRed,
            avgHtGoals: avgHtGoals.toFixed(2),
            totalShots, matchesWithShots,
            x1, x2,
        }
    }, [matches])

    // ── Player leaderboards ──────────────────────────────────────────────────
    const topScorers = useMemo(() => [...players].filter(p => p.goals > 0).sort((a, b) => b.goals - a.goals).slice(0, 5), [players])
    const topAssists = useMemo(() => [...players].filter(p => p.assists > 0).sort((a, b) => b.assists - a.assists).slice(0, 5), [players])
    const topShots = useMemo(() => [...players].filter(p => p.shots > 0).sort((a, b) => b.shots - a.shots).slice(0, 5), [players])
    const topYellows = useMemo(() => [...players].filter(p => p.yellow_cards > 0).sort((a, b) => b.yellow_cards - a.yellow_cards).slice(0, 5), [players])

    if (isLoading) return (
        <div className="flex items-center justify-center py-32">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent shadow-lg shadow-primary/20" />
        </div>
    )

    if (!s) return (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/50 py-32 text-center">
            <Trophy className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-bold text-foreground">Sin datos todavía</h3>
            <p className="mt-2 max-w-[280px] text-sm text-muted-foreground/60">Añade partidos en Supabase para verlos aquí.</p>
        </div>
    )

    const n = s.n

    return (
        <div className="space-y-10 animate-fade-in pb-12">

            {/* ── Header ── */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-1">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">Dashboard</h1>
                    <p className="text-sm font-medium text-muted-foreground/80 flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" />
                        Bet365 · Análisis de mercados sobre {n} partido{n !== 1 ? 's' : ''}
                    </p>
                </div>
                {leagues.length > 0 && (
                    <div className="relative inline-block">
                        <select
                            value={activeLeagueId || ''}
                            onChange={e => setSearchParams({ league: e.target.value })}
                            className="appearance-none rounded-xl border border-border bg-card/50 px-6 py-3 pr-10 text-sm font-bold text-foreground transition-all hover:bg-card hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            {leagues.map(l => <option key={l.id} value={l.id}>{l.name} {l.season}</option>)}
                        </select>
                        <Clock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                )}
            </div>

            {/* ══════════════════════════════════════════════════════════════
                1. APUESTAS AL RESULTADO
            ══════════════════════════════════════════════════════════════ */}
            <section className="space-y-4">
                <SectionHeader icon={Trophy} title="1 · Apuestas al Resultado" subtitle="1X2 · Doble oportunidad · Empate no válida" />

                {/* 1X2 */}
                <div className="grid grid-cols-3 gap-3">
                    <StatCard icon={ArrowUpRight} label="1 — Gana Local" value={`${pct(s.homeWins, n)}%`} sublabel={`${s.homeWins} de ${n}`} color="green" />
                    <StatCard icon={Minus} label="X — Empate" value={`${pct(s.draws, n)}%`} sublabel={`${s.draws} de ${n}`} color="orange" />
                    <StatCard icon={ArrowDownRight} label="2 — Gana Visitante" value={`${pct(s.awayWins, n)}%`} sublabel={`${s.awayWins} de ${n}`} color="blue" />
                </div>

                {/* Doble oportunidad */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <MarketRow label="Doble oportunidad 1X" value={`${pct(s.x1, n)}%`} sublabel={`${s.x1}/${n}`} color="green" trend="up" />
                    <MarketRow label="Doble oportunidad 12" value={`${pct(s.homeWins + s.awayWins, n)}%`} sublabel={`${s.homeWins + s.awayWins}/${n}`} color="primary" trend="up" />
                    <MarketRow label="Doble oportunidad X2" value={`${pct(s.x2, n)}%`} sublabel={`${s.x2}/${n}`} color="blue" trend="up" />
                </div>

                {/* Empate no válida */}
                <div className="grid grid-cols-2 gap-2">
                    <MarketRow label="Draw No Bet — Local gana (excl. empates)" value={`${pct(s.homeWins, s.homeWins + s.awayWins)}%`} color="green" />
                    <MarketRow label="Draw No Bet — Visitante gana (excl. empates)" value={`${pct(s.awayWins, s.homeWins + s.awayWins)}%`} color="blue" />
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
                2. APUESTAS DE GOLES
            ══════════════════════════════════════════════════════════════ */}
            <section className="space-y-4">
                <SectionHeader icon={Goal} title="2 · Apuestas de Goles" subtitle="Over/Under · BTTS · Resultado exacto · Primer gol" />

                {/* Over/Under multi-línea */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                    {[
                        { line: '0.5', over: s.over05, color: 'green' },
                        { line: '1.5', over: s.over15, color: 'green' },
                        { line: '2.5', over: s.over25, color: 'primary' },
                        { line: '3.5', over: s.over35, color: 'orange' },
                        { line: '4.5', over: s.over45, color: 'red' },
                    ].map(({ line, over, color }) => (
                        <div key={line} className={`rounded-xl border p-3 text-center ${COLORS[color].split(' ').slice(1).join(' ')}`}>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Over {line}</p>
                            <p className={`text-xl font-black ${COLORS[color].split(' ')[0]}`}>{pct(over, n)}%</p>
                            <p className="text-[10px] text-muted-foreground">{over}/{n}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <StatCard icon={Target} label="BTTS Sí" value={`${pct(s.btts, n)}%`} sublabel={`${s.btts}/${n} partidos`} color="violet" />
                    <StatCard icon={Shield} label="BTTS No" value={`${pct(n - s.btts, n)}%`} sublabel={`${n - s.btts}/${n} partidos`} color="indigo" />
                    <StatCard icon={Goal} label="Goles Avg" value={avg(s.totalGoals, n)} sublabel="por partido" color="green" />
                    <StatCard icon={TrendingUp} label="Total Goles" value={s.totalGoals} sublabel="en la temporada" />
                </div>

                {/* Resultado exacto top 5 */}
                <div className="rounded-xl border border-border/50 bg-card p-4">
                    <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Resultado Exacto — Más Frecuentes</p>
                    <div className="grid gap-2 sm:grid-cols-5">
                        {s.topScores.map(({ score, count, pct: p }) => (
                            <div key={score} className="rounded-xl border border-border/40 bg-secondary/30 p-3 text-center">
                                <p className="text-lg font-black text-foreground">{score}</p>
                                <p className="text-xs text-primary font-bold">{p}%</p>
                                <p className="text-[10px] text-muted-foreground">{count}x</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Primer equipo en marcar */}
                <div className="grid grid-cols-2 gap-2">
                    <MarketRow label="Primer gol — Local" value={`${pct(s.homeScoresFirst, n)}%`} sublabel={`${s.homeScoresFirst}/${n}`} color="green" trend="up" />
                    <MarketRow label="Primer gol — Visitante" value={`${pct(s.awayScoresFirst, n)}%`} sublabel={`${s.awayScoresFirst}/${n}`} color="blue" trend="up" />
                </div>

                {/* Minuto del primer gol */}
                <div className="rounded-xl border border-border/50 bg-card p-4">
                    <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Minuto Primer Gol</p>
                    <div className="grid grid-cols-3 gap-3">
                        <MarketRow label="0'–30'" value={`${pct(s.fgUnder30, s.firstGoalMinsCount)}%`} color="green" />
                        <MarketRow label="31'–60'" value={`${pct(s.fg3060, s.firstGoalMinsCount)}%`} color="orange" />
                        <MarketRow label="+60'" value={`${pct(s.fgOver60, s.firstGoalMinsCount)}%`} color="red" />
                    </div>
                </div>

                {/* Charts */}
                <div className="grid gap-4 md:grid-cols-1">
                    <GoalTimeChart matches={matches} />
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
                3. APUESTAS DE JUGADORES
            ══════════════════════════════════════════════════════════════ */}
            {(topScorers.length > 0 || topShots.length > 0) && (
                <section className="space-y-4">
                    <SectionHeader icon={Users} title="3 · Apuestas de Jugadores" subtitle="Goleadores · Tiros · Asistencias · Tarjetas" />
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {/* Top Goleadores */}
                        <PlayerLeaderCard title="Marcador (cualquier momento)" players={topScorers} valueKey="goals" label="goles" color="green" />
                        {/* Top Asistencias */}
                        <PlayerLeaderCard title="Asistencias" players={topAssists} valueKey="assists" label="asist." color="blue" />
                        {/* Top Tiros a puerta */}
                        <PlayerLeaderCard title="Tiros a Puerta" players={topShots} valueKey="shots_on_target" label="tiros" color="violet" />
                        {/* Tarjetas */}
                        <PlayerLeaderCard title="Jugador Amonestado" players={topYellows} valueKey="yellow_cards" label="amarillas" color="yellow" />
                    </div>
                </section>
            )}

            {/* ══════════════════════════════════════════════════════════════
                4. APUESTAS DE CÓRNERS
            ══════════════════════════════════════════════════════════════ */}
            <section className="space-y-4">
                <SectionHeader icon={Zap} title="4 · Apuestas de Córners" subtitle="Totales · Por equipo · Hándicap · Primer córner" />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <StatCard icon={BarChart3} label="Córners Avg" value={avg(s.totalCorners, n)} sublabel="por partido" color="blue" />
                    <StatCard icon={Zap} label="Over 8.5 Córners" value={`${pct(s.over85c, n)}%`} sublabel={`${s.over85c}/${n}`} color="primary" />
                    <StatCard icon={Zap} label="Over 10.5 Córners" value={`${pct(s.over105c, n)}%`} sublabel={`${s.over105c}/${n}`} color="orange" />
                    <StatCard icon={CreditCard} label="Total Córners" value={s.totalCorners} sublabel="temporada" />
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                    <MarketRow label="Avg Córners — Local" value={avg(s.homeCorners, n)} sublabel="por partido" color="green" />
                    <MarketRow label="Avg Córners — Visitante" value={avg(s.awayCorners, n)} sublabel="por partido" color="blue" />
                    <MarketRow label="Hándicap Córners (Local -2)"
                        value={`${pct(matches.filter(m => {
                            const hc = m.home_corners || 0
                            const ac = m.away_corners || 0
                            return hc - 2 > ac
                        }).length, n)}%`}
                        color="indigo" />
                </div>
                <div className="grid gap-4 sm:grid-cols-1">
                    <StatDistributionChart
                        matches={matches}
                        homeKey="total_corners"
                        title="Distribución Total de Córners"
                        description="Cuántos partidos terminaron con X córners"
                        color="#3b82f6"
                    />
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
                5. APUESTAS DE TARJETAS
            ══════════════════════════════════════════════════════════════ */}
            <section className="space-y-4">
                <SectionHeader icon={AlertTriangle} title="5 · Apuestas de Tarjetas" subtitle="Totales · Por equipo · Roja en el partido" />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <StatCard icon={AlertTriangle} label="Amarillas Avg" value={avg(s.yc, n)} sublabel="por partido" color="yellow" />
                    <StatCard icon={AlertTriangle} label="Over 1.5 Tarj." value={`${pct(s.over15yc, n)}%`} sublabel={`${s.over15yc}/${n}`} color="orange" />
                    <StatCard icon={AlertTriangle} label="Over 3.5 Tarj." value={`${pct(s.over35yc, n)}%`} sublabel={`${s.over35yc}/${n}`} color="red" />
                    <StatCard icon={CreditCard} label="Roja en partido" value={`${pct(s.matchesWithRed, n)}%`} sublabel={`${s.matchesWithRed}/${n}`} color="red" />
                </div>
                <StatDistributionChart
                    matches={matches}
                    homeKey="home_yellow_cards"
                    awayKey="away_yellow_cards"
                    title="Amarillas por Equipo"
                    description="Local vs Visitante — distribución por partido"
                />
            </section>

            {/* ══════════════════════════════════════════════════════════════
                6. APUESTAS COMBINADAS
            ══════════════════════════════════════════════════════════════ */}
            <section className="space-y-4">
                <SectionHeader icon={Star} title="6 · Apuestas Combinadas" subtitle="Victoria + Goles · Victoria + BTTS" />
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                        {
                            label: "Local gana + Over 2.5",
                            value: pct(matches.filter(m => (m.home_goals || 0) > (m.away_goals || 0) && (m.home_goals || 0) + (m.away_goals || 0) > 2.5).length, n),
                            count: matches.filter(m => (m.home_goals || 0) > (m.away_goals || 0) && (m.home_goals || 0) + (m.away_goals || 0) > 2.5).length,
                            color: 'green',
                        },
                        {
                            label: "Local gana + BTTS",
                            value: pct(matches.filter(m => (m.home_goals || 0) > (m.away_goals || 0) && (m.home_goals || 0) > 0 && (m.away_goals || 0) > 0).length, n),
                            count: matches.filter(m => (m.home_goals || 0) > (m.away_goals || 0) && (m.home_goals || 0) > 0 && (m.away_goals || 0) > 0).length,
                            color: 'green',
                        },
                        {
                            label: "Visitante gana + Over 2.5",
                            value: pct(matches.filter(m => (m.away_goals || 0) > (m.home_goals || 0) && (m.home_goals || 0) + (m.away_goals || 0) > 2.5).length, n),
                            count: matches.filter(m => (m.away_goals || 0) > (m.home_goals || 0) && (m.home_goals || 0) + (m.away_goals || 0) > 2.5).length,
                            color: 'blue',
                        },
                        {
                            label: "Visitante gana + BTTS",
                            value: pct(matches.filter(m => (m.away_goals || 0) > (m.home_goals || 0) && (m.home_goals || 0) > 0 && (m.away_goals || 0) > 0).length, n),
                            count: matches.filter(m => (m.away_goals || 0) > (m.home_goals || 0) && (m.home_goals || 0) > 0 && (m.away_goals || 0) > 0).length,
                            color: 'blue',
                        },
                        {
                            label: "BTTS + Over 2.5",
                            value: pct(matches.filter(m => (m.home_goals || 0) > 0 && (m.away_goals || 0) > 0 && (m.home_goals || 0) + (m.away_goals || 0) > 2.5).length, n),
                            count: matches.filter(m => (m.home_goals || 0) > 0 && (m.away_goals || 0) > 0 && (m.home_goals || 0) + (m.away_goals || 0) > 2.5).length,
                            color: 'violet',
                        },
                        {
                            label: "BTTS + Under 3.5",
                            value: pct(matches.filter(m => (m.home_goals || 0) > 0 && (m.away_goals || 0) > 0 && (m.home_goals || 0) + (m.away_goals || 0) <= 3).length, n),
                            count: matches.filter(m => (m.home_goals || 0) > 0 && (m.away_goals || 0) > 0 && (m.home_goals || 0) + (m.away_goals || 0) <= 3).length,
                            color: 'indigo',
                        },
                    ].map(({ label, value, count, color }) => (
                        <MarketRow key={label} label={label} value={`${value}%`} sublabel={`${count}/${n}`} color={color} />
                    ))}
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
                7. APUESTAS ESPECIALES
            ══════════════════════════════════════════════════════════════ */}
            <section className="space-y-4">
                <SectionHeader icon={Timer} title="7 · Apuestas Especiales" subtitle="HT/FT · Hándicap asiático · Intervalos · Tiros" />

                {/* HT goal avg */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <StatCard icon={Timer} label="Avg Goles 1ª Parte" value={s.avgHtGoals} sublabel="por partido" color="orange" />
                    <StatCard icon={Crosshair} label="Avg Tiros Total" value={s.matchesWithShots > 0 ? avg(s.totalShots, s.matchesWithShots) : '—'} sublabel="por partido" color="primary" />
                    <StatCard icon={TrendingUp} label="Hándicap Asiático Local -0.5" value={`${pct(s.homeWins, n)}%`} sublabel="(= local gana)" color="green" />
                    <StatCard icon={TrendingUp} label="Hándicap Asiático Visit. -0.5" value={`${pct(s.awayWins, n)}%`} sublabel="(= visit. gana)" color="blue" />
                </div>

                {/* Intervalos de tiempo (based on goal distribution) */}
                <div className="rounded-xl border border-border/50 bg-card p-4">
                    <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Goles por Intervalo de Tiempo</p>
                    <GoalIntervalBars matches={matches} />
                </div>

                {/* Distribución de tiros */}
                {s.matchesWithShots > 0 && (
                    <StatDistributionChart
                        matches={matches.filter(m => m.home_shots != null)}
                        homeKey="home_shots"
                        awayKey="away_shots"
                        title="Tiros Totales por Partido"
                        description="Local vs Visitante — distribución"
                    />
                )}

                {/* Resultado al descanso / final (HT/FT) */}
                <div className="rounded-xl border border-border/50 bg-card p-4">
                    <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Resultado Descanso / Final (HT/FT)</p>
                    <HtFtTable matches={matches} />
                </div>
            </section>

        </div>
    )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function PlayerLeaderCard({ title, players, valueKey, label, color = 'primary' }) {
    const cls = COLORS[color] || COLORS.primary
    return (
        <div className="overflow-hidden rounded-xl border border-border/50 bg-card">
            <div className={`border-b border-border/50 px-4 py-3 ${cls.split(' ').slice(1).join(' ')}`}>
                <p className={`text-[10px] font-black uppercase tracking-widest ${cls.split(' ')[0]}`}>{title}</p>
            </div>
            <div className="divide-y divide-border/20">
                {players.map((p, i) => (
                    <div key={`${p.player_name}-${i}`} className="flex items-center gap-3 px-4 py-2 hover:bg-primary/5 transition-colors">
                        <span className={`w-5 text-center text-xs font-black tabular-nums ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-orange-400' : 'text-muted-foreground'}`}>{i + 1}</span>
                        {p.team?.logo_url && <img src={p.team.logo_url} alt="" className="h-5 w-5 object-contain shrink-0" />}
                        <span className="flex-1 truncate text-xs font-medium text-foreground">{p.player_name}</span>
                        <span className={`text-sm font-black tabular-nums ${cls.split(' ')[0]}`}>{p[valueKey]} <span className="text-[10px] font-normal text-muted-foreground">{label}</span></span>
                    </div>
                ))}
                {players.length === 0 && (
                    <p className="px-4 py-6 text-center text-xs text-muted-foreground">Sin datos</p>
                )}
            </div>
        </div>
    )
}

function GoalIntervalBars({ matches }) {
    const intervals = [
        { label: "0'–15'", min: 0, max: 15 },
        { label: "16'–30'", min: 16, max: 30 },
        { label: "31'–45'", min: 31, max: 45 },
        { label: "46'–60'", min: 46, max: 60 },
        { label: "61'–75'", min: 61, max: 75 },
        { label: "76'–90'", min: 76, max: 999 },
    ]
    const counts = intervals.map(({ min, max }) => {
        let c = 0
        matches.forEach(m => {
            const all = [...(m.home_goal_minutes || []), ...(m.away_goal_minutes || [])].filter(Boolean)
            c += all.filter(t => t > min - 1 && t <= max).length
        })
        return c
    })
    const maxCount = Math.max(...counts, 1)
    return (
        <div className="flex items-end gap-2 h-24">
            {intervals.map(({ label }, i) => (
                <div key={label} className="flex flex-1 flex-col items-center gap-1">
                    <div
                        className="w-full rounded-t-md bg-primary/60 transition-all duration-700"
                        style={{ height: `${(counts[i] / maxCount) * 80}px`, minHeight: counts[i] > 0 ? '4px' : '0' }}
                    />
                    <span className="text-[9px] text-muted-foreground text-center leading-tight">{label}</span>
                    <span className="text-[10px] font-bold text-primary">{counts[i]}</span>
                </div>
            ))}
        </div>
    )
}

function HtFtTable({ matches }) {
    const getHtResult = m => {
        const ht_h = ((m.home_goal_minutes || []).filter(t => t != null && t <= 45)).length
        const ht_a = ((m.away_goal_minutes || []).filter(t => t != null && t <= 45)).length
        if (ht_h > ht_a) return '1'
        if (ht_a > ht_h) return '2'
        return 'X'
    }
    const getFtResult = m => {
        if ((m.home_goals || 0) > (m.away_goals || 0)) return '1'
        if ((m.away_goals || 0) > (m.home_goals || 0)) return '2'
        return 'X'
    }
    const combos = {}
    matches.forEach(m => {
        const key = `${getHtResult(m)}/${getFtResult(m)}`
        combos[key] = (combos[key] || 0) + 1
    })
    const rows = Object.entries(combos).sort((a, b) => b[1] - a[1])
    const n = matches.length
    return (
        <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {rows.map(([combo, count]) => (
                <div key={combo} className="rounded-lg border border-border/40 bg-secondary/30 p-3 text-center">
                    <p className="text-base font-black text-foreground">{combo}</p>
                    <p className="text-xs font-bold text-primary">{pct(count, n)}%</p>
                    <p className="text-[10px] text-muted-foreground">{count}x</p>
                </div>
            ))}
        </div>
    )
}
