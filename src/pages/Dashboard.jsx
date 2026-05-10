import { useMemo, useEffect, useState, lazy, Suspense } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useMatches, useLeagues } from '@/hooks/useMatches'
import { usePlayerLeaderboard } from '@/hooks/usePlayerStats'
import {
    Trophy, Goal, Target, TrendingUp, Activity,
    BarChart3, Clock, Shield, CreditCard,
    AlertTriangle, Zap, Info, Users, Crosshair,
    ArrowUpRight, Minus, ArrowDownRight, Star, Timer,
    CalendarDays, ShieldCheck
} from 'lucide-react'
import GoalTimeChart from '@/components/charts/GoalTimeChart'
import StatDistributionChart from '@/components/charts/StatDistributionChart'
import SEO from '@/components/SEO'

// Lazy-load the sub-tab content
import MatchesTab from '@/pages/Matches'
import PlayersTab from '@/pages/Players'

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
            <span className="text-sm text-foreground">{label}</span>
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

// ─── Dashboard Sub-Tabs ──────────────────────────────────────────────────────

const DASHBOARD_TABS = [
    { id: 'mercados', label: 'Mercados', icon: BarChart3 },
    { id: 'jugadores', label: 'Jugadores', icon: Users },
    { id: 'partidos', label: 'Partidos', icon: CalendarDays },
    { id: 'clasificacion', label: 'Clasificación', icon: ShieldCheck },
]

// ─── Main component ──────────────────────────────────────────────────────────

export default function Dashboard() {
    const [searchParams, setSearchParams] = useSearchParams()
    const { data: leagues = [] } = useLeagues()

    const selectedLeagueId = searchParams.get('league')
    const activeTab = searchParams.get('tab') || 'mercados'
    const defaultLeague = leagues.find(l => l.is_default) || leagues[0]
    const activeLeagueId = selectedLeagueId || (defaultLeague ? String(defaultLeague.id) : null)

    // Derive the active league object to split name + season for the two dropdowns
    const activeLeagueObj = leagues.find(l => String(l.id) === activeLeagueId) || null

    // Unique league names in the order they first appear
    const uniqueLeagueNames = useMemo(() => {
        const seen = new Set()
        return leagues.filter(l => {
            if (seen.has(l.name)) return false
            seen.add(l.name)
            return true
        }).map(l => l.name)
    }, [leagues])

    // Seasons available for the currently selected league name
    const selectedLeagueName = activeLeagueObj?.name || uniqueLeagueNames[0] || ''
    const seasonsForName = useMemo(
        () => leagues.filter(l => l.name === selectedLeagueName).map(l => l.season),
        [leagues, selectedLeagueName]
    )

    const handleLeagueNameChange = (name) => {
        // Pick the first league entry that matches the new name
        const match = leagues.find(l => l.name === name)
        if (match) {
            setSearchParams(prev => { prev.set('league', String(match.id)); return prev })
        }
    }

    const handleSeasonChange = (season) => {
        // Find the league entry with the current name + new season
        const match = leagues.find(l => l.name === selectedLeagueName && l.season === season)
        if (match) {
            setSearchParams(prev => { prev.set('league', String(match.id)); return prev })
        }
    }

    useEffect(() => {
        if (!selectedLeagueId && defaultLeague) {
            setSearchParams(prev => {
                prev.set('league', String(defaultLeague.id))
                return prev
            }, { replace: true })
        }
    }, [selectedLeagueId, defaultLeague, setSearchParams])

    const { data: matches = [], isLoading } = useMatches(activeLeagueId, { playedOnly: activeTab === 'mercados' })
    const { data: players = [] } = usePlayerLeaderboard(activeLeagueId)

    const handleTabChange = (tabId) => {
        setSearchParams(prev => {
            prev.set('tab', tabId)
            return prev
        })
    }

    // ── SEO description based on active tab ──
    const seoDescriptions = {
        mercados: 'Análisis completo de La Liga: goles, córners, tarjetas y mercados de apuestas con datos reales de la temporada 2025-2026.',
        jugadores: 'Estadísticas de jugadores de La Liga 2025-2026: goleadores, asistencias, tarjetas, tiros y porteros.',
        partidos: 'Resultados y estadísticas de todos los partidos de La Liga 2025-2026.',
        clasificacion: 'Clasificación de La Liga 2025-2026: posiciones, puntos y estadísticas por equipo.',
    }

    // ── Core computed stats (for mercados tab) ──
    const s = useMemo(() => {
        if (!matches.length || activeTab !== 'mercados') return null
        const playedMatches = matches.filter(m => m.home_goals != null)
        if (!playedMatches.length) return null
        const n = playedMatches.length

        // Goals
        const goals = playedMatches.map(m => (m.home_goals || 0) + (m.away_goals || 0))
        const totalGoals = goals.reduce((a, b) => a + b, 0)
        const over05 = goals.filter(g => g > 0.5).length
        const over15 = goals.filter(g => g > 1.5).length
        const over25 = goals.filter(g => g > 2.5).length
        const over35 = goals.filter(g => g > 3.5).length
        const over45 = goals.filter(g => g > 4.5).length
        const btts = playedMatches.filter(m => (m.home_goals || 0) > 0 && (m.away_goals || 0) > 0).length
        const homeWins = playedMatches.filter(m => (m.home_goals || 0) > (m.away_goals || 0)).length
        const draws = playedMatches.filter(m => (m.home_goals || 0) === (m.away_goals || 0)).length
        const awayWins = playedMatches.filter(m => (m.away_goals || 0) > (m.home_goals || 0)).length

        // Exact scores
        const scoreCounts = {}
        playedMatches.forEach(m => {
            const key = `${m.home_goals || 0}-${m.away_goals || 0}`
            scoreCounts[key] = (scoreCounts[key] || 0) + 1
        })
        const topScores = Object.entries(scoreCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([score, count]) => ({ score, count, pct: pct(count, n) }))

        // First team to score
        const homeScoresFirst = playedMatches.filter(m => {
            const hMin = m.home_goal_minutes?.[0] ?? 999
            const aMin = m.away_goal_minutes?.[0] ?? 999
            return hMin < aMin
        }).length
        const awayScoresFirst = playedMatches.filter(m => {
            const hMin = m.home_goal_minutes?.[0] ?? 999
            const aMin = m.away_goal_minutes?.[0] ?? 999
            return aMin < hMin
        }).length

        // First goal minute buckets
        const firstGoalMins = []
        playedMatches.forEach(m => {
            const allMins = [...(m.home_goal_minutes || []), ...(m.away_goal_minutes || [])].filter(Boolean)
            if (allMins.length) firstGoalMins.push(Math.min(...allMins))
        })
        const fgUnder30 = firstGoalMins.filter(m => m <= 30).length
        const fg3060 = firstGoalMins.filter(m => m > 30 && m <= 60).length
        const fgOver60 = firstGoalMins.filter(m => m > 60).length

        // Corners
        const totalCorners = playedMatches.reduce((a, m) => a + (m.total_corners || 0), 0)
        const homeCorners = playedMatches.reduce((a, m) => a + (m.home_corners || 0), 0)
        const awayCorners = playedMatches.reduce((a, m) => a + (m.away_corners || 0), 0)
        const over85c = playedMatches.filter(m => (m.total_corners || 0) > 8.5).length
        const over105c = playedMatches.filter(m => (m.total_corners || 0) > 10.5).length

        // Cards
        const yc = playedMatches.reduce((a, m) => a + (m.home_yellow_cards || m.home_cards || 0) + (m.away_yellow_cards || m.away_cards || 0), 0)
        const rc = playedMatches.reduce((a, m) => a + (m.home_red_cards || 0) + (m.away_red_cards || 0), 0)
        const over35yc = playedMatches.filter(m => ((m.home_yellow_cards || m.home_cards || 0) + (m.away_yellow_cards || m.away_cards || 0)) > 3.5).length
        const over15yc = playedMatches.filter(m => ((m.home_yellow_cards || m.home_cards || 0) + (m.away_yellow_cards || m.away_cards || 0)) > 1.5).length
        const matchesWithRed = playedMatches.filter(m => (m.home_red_cards || 0) + (m.away_red_cards || 0) > 0).length

        // HT data
        const htGoals = playedMatches.map(m => {
            const allMins = [...(m.home_goal_minutes || []), ...(m.away_goal_minutes || [])]
            return allMins.filter(min => min != null && min <= 45).length
        })
        const avgHtGoals = htGoals.reduce((a, b) => a + b, 0) / (n || 1)

        // Shots
        const totalShots = playedMatches.reduce((a, m) => a + (m.home_shots || 0) + (m.away_shots || 0), 0)
        const matchesWithShots = playedMatches.filter(m => m.home_shots != null).length

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
            x1, x2, playedMatches,
        }
    }, [matches, activeTab])

    // ── Player leaderboards ──
    const topScorers = useMemo(() => [...players].filter(p => p.goals > 0).sort((a, b) => b.goals - a.goals).slice(0, 5), [players])
    const topAssists = useMemo(() => [...players].filter(p => p.assists > 0).sort((a, b) => b.assists - a.assists).slice(0, 5), [players])
    const topShots = useMemo(() => [...players].filter(p => p.shots_on_target_per_90 > 0 && p.minutes >= 90).sort((a, b) => b.shots_on_target_per_90 - a.shots_on_target_per_90).slice(0, 5), [players])
    const topYellows = useMemo(() => [...players].filter(p => p.yellow_cards > 0).sort((a, b) => b.yellow_cards - a.yellow_cards).slice(0, 5), [players])

    if (isLoading) return (
        <div className="flex items-center justify-center py-32">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent shadow-lg shadow-primary/20" />
        </div>
    )

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <SEO
                title={activeTab === 'mercados' ? 'Estadísticas La Liga 2025-26' : DASHBOARD_TABS.find(t => t.id === activeTab)?.label}
                description={seoDescriptions[activeTab]}
                path={`/?tab=${activeTab}`}
            />

            {/* ── Header ── */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-1">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight title-contrast sm:text-5xl">Dashboard</h1>
                    <p className="text-sm font-medium text-muted-foreground/80 flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" />
                        Análisis completo de La Liga · Temporada 2025-2026
                    </p>
                </div>
                {leagues.length > 0 && (
                    <div className="flex items-center gap-2">
                        {/* League name selector */}
                        <div className="relative inline-block">
                            <select
                                value={selectedLeagueName}
                                onChange={e => handleLeagueNameChange(e.target.value)}
                                className="appearance-none rounded-xl border border-border bg-card/50 px-4 py-3 pr-9 text-sm font-bold text-foreground transition-all hover:bg-card hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                {uniqueLeagueNames.map(name => (
                                    <option key={name} value={name}>{name}</option>
                                ))}
                            </select>
                            <Clock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        </div>
                        {/* Season selector — only shows seasons for the selected league */}
                        <div className="relative inline-block">
                            <select
                                value={activeLeagueObj?.season || ''}
                                onChange={e => handleSeasonChange(e.target.value)}
                                className="appearance-none rounded-xl border border-border bg-card/50 px-4 py-3 pr-9 text-sm font-bold text-foreground transition-all hover:bg-card hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                {seasonsForName.map(season => (
                                    <option key={season} value={season}>{season}</option>
                                ))}
                            </select>
                            <Clock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>
                )}
            </div>

            {/* ── Sub-tabs ── */}
            <div className="flex gap-1 overflow-x-auto rounded-xl border border-border/50 bg-card/50 p-1">
                {DASHBOARD_TABS.map(tab => {
                    const Icon = tab.icon
                    const active = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`relative flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-all
                                ${active ? 'text-primary' : 'text-foreground/60 hover:text-foreground'}`}
                        >
                            {active && (
                                <motion.div
                                    layoutId="dashboard-tab-bg"
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

            {/* ── Tab Content ── */}
            {activeTab === 'mercados' && <MercadosContent s={s} matches={s?.playedMatches || matches} />}
            {activeTab === 'jugadores' && <PlayersTab hideLeagueSelector leagueId={activeLeagueId} />}
            {activeTab === 'partidos' && <MatchesTab hideLeagueSelector leagueId={activeLeagueId} />}
            {activeTab === 'clasificacion' && <TeamsTab matches={matches} />}
        </div>
    )
}

// ─── Mercados redesign ───────────────────────────────────────────────────────

// Colour helpers for probability bars and text
function probColor(p) {
    const n = parseInt(p, 10)
    if (n >= 65) return { bar: 'bg-green-500', text: 'text-green-500 dark:text-green-400' }
    if (n >= 45) return { bar: 'bg-amber-500', text: 'text-amber-500 dark:text-amber-400' }
    return { bar: 'bg-slate-400', text: 'text-muted-foreground' }
}

// Hero metric card — big number, label, icon
function HeroCard({ icon: Icon, label, value, iconColor = 'text-primary' }) {
    return (
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
            <div className={`rounded-xl bg-primary/10 p-2.5 ${iconColor}`}>
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className="text-4xl font-black tracking-tight text-foreground">{value}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
            </div>
        </div>
    )
}

// Single market row: label | bar | pct / count
function ProbRow({ label, pctVal, count, total, isNumStat = false }) {
    const { bar, text } = probColor(pctVal)
    const width = Math.min(100, Math.max(0, parseInt(pctVal, 10)))
    return (
        <div className="flex items-center gap-4 px-4 py-3.5 border-b border-border/30 last:border-0 hover:bg-primary/5 transition-colors">
            <span className="w-52 shrink-0 text-sm font-medium text-foreground">{label}</span>
            {isNumStat ? (
                <div className="flex-1" />
            ) : (
                <div className="flex-1 rounded-full bg-border/30 h-2 overflow-hidden">
                    <div
                        className={`h-full rounded-full ${bar} transition-all duration-500`}
                        style={{ width: `${width}%` }}
                    />
                </div>
            )}
            <div className="w-20 text-right shrink-0">
                <p className={`text-sm font-black tabular-nums ${isNumStat ? 'text-foreground' : text}`}>{pctVal}{isNumStat ? '' : '%'}</p>
                {count != null && total != null && !isNumStat && (
                    <p className="text-[10px] text-muted-foreground tabular-nums">{count}/{total}</p>
                )}
            </div>
        </div>
    )
}

const MARKET_TABS = [
    { id: 'resultado', label: 'Resultado' },
    { id: 'goles', label: 'Goles' },
    { id: 'corners', label: 'Córners' },
    { id: 'tarjetas', label: 'Tarjetas' },
    { id: 'especiales', label: 'Especiales' },
]

function MercadosContent({ s, matches }) {
    const [activeMarket, setActiveMarket] = useState('resultado')

    if (!s) return (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/50 py-32 text-center">
            <Trophy className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-bold text-foreground">Sin datos todavía</h3>
            <p className="mt-2 max-w-[280px] text-sm text-muted-foreground/60">Añade partidos para ver estadísticas aquí.</p>
        </div>
    )

    const n = s.n

    return (
        <div className="space-y-6">
            {/* ── Hero strip ── */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <HeroCard icon={Goal} label="Goles / Partido" value={avg(s.totalGoals, n)} iconColor="text-green-500 dark:text-green-400" />
                <HeroCard icon={Target} label="BTTS" value={`${pct(s.btts, n)}%`} iconColor="text-violet-500 dark:text-violet-400" />
                <HeroCard icon={ArrowUpRight} label="Victoria Local" value={`${pct(s.homeWins, n)}%`} iconColor="text-amber-500 dark:text-amber-400" />
                <HeroCard icon={TrendingUp} label="Over 2.5" value={`${pct(s.over25, n)}%`} iconColor="text-blue-500 dark:text-blue-400" />
            </div>

            {/* ── Market tabs ── */}
            <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
                {/* Tab bar */}
                <div className="flex overflow-x-auto border-b border-border/50 bg-secondary/20">
                    {MARKET_TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveMarket(tab.id)}
                            className={`whitespace-nowrap px-5 py-3.5 text-sm font-semibold transition-all border-b-2
                                ${activeMarket === tab.id
                                    ? 'border-primary text-primary bg-primary/5'
                                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-primary/5'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <div className="divide-y-0">

                    {/* RESULTADO */}
                    {activeMarket === 'resultado' && (
                        <div>
                            <ProbRow label="1 Local" pctVal={pct(s.homeWins, n)} count={s.homeWins} total={n} />
                            <ProbRow label="X Empate" pctVal={pct(s.draws, n)} count={s.draws} total={n} />
                            <ProbRow label="2 Visitante" pctVal={pct(s.awayWins, n)} count={s.awayWins} total={n} />
                            <ProbRow label="Doble oportunidad 1X" pctVal={pct(s.x1, n)} count={s.x1} total={n} />
                            <ProbRow label="Doble oportunidad X2" pctVal={pct(s.x2, n)} count={s.x2} total={n} />
                            <ProbRow label="Doble oportunidad 12" pctVal={pct(s.homeWins + s.awayWins, n)} count={s.homeWins + s.awayWins} total={n} />
                            <ProbRow label="Local anota primero" pctVal={pct(s.homeScoresFirst, n)} count={s.homeScoresFirst} total={n} />
                            <ProbRow label="Visitante anota primero" pctVal={pct(s.awayScoresFirst, n)} count={s.awayScoresFirst} total={n} />
                        </div>
                    )}

                    {/* GOLES */}
                    {activeMarket === 'goles' && (
                        <div>
                            <ProbRow label="Over 0.5" pctVal={pct(s.over05, n)} count={s.over05} total={n} />
                            <ProbRow label="Over 1.5" pctVal={pct(s.over15, n)} count={s.over15} total={n} />
                            <ProbRow label="Over 2.5" pctVal={pct(s.over25, n)} count={s.over25} total={n} />
                            <ProbRow label="Over 3.5" pctVal={pct(s.over35, n)} count={s.over35} total={n} />
                            <ProbRow label="Over 4.5" pctVal={pct(s.over45, n)} count={s.over45} total={n} />
                            <ProbRow label="BTTS Si" pctVal={pct(s.btts, n)} count={s.btts} total={n} />
                            <ProbRow label="BTTS No" pctVal={pct(n - s.btts, n)} count={n - s.btts} total={n} />

                            {/* Top 5 exact scores */}
                            {s.topScores.length > 0 && (
                                <div className="px-4 py-4 border-t border-border/30">
                                    <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Top 5 resultados exactos</p>
                                    <div className="flex flex-wrap gap-2">
                                        {s.topScores.map(({ score, count: c, pct: p }) => (
                                            <div key={score} className="flex flex-col items-center rounded-xl border border-border/40 bg-secondary/30 px-4 py-2.5 min-w-[64px]">
                                                <span className="text-base font-black text-foreground">{score}</span>
                                                <span className="text-xs font-bold text-primary">{p}%</span>
                                                <span className="text-[10px] text-muted-foreground">{c}x</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Goal time chart */}
                            <div className="px-4 py-4 border-t border-border/30">
                                <GoalTimeChart matches={matches} />
                            </div>
                        </div>
                    )}

                    {/* CORNERS */}
                    {activeMarket === 'corners' && (
                        <div>
                            <ProbRow label="Over 8.5 Córners" pctVal={pct(s.over85c, n)} count={s.over85c} total={n} />
                            <ProbRow label="Over 10.5 Córners" pctVal={pct(s.over105c, n)} count={s.over105c} total={n} />
                            <ProbRow
                                label="Córners local > visitante"
                                pctVal={pct(matches.filter(m => (m.home_corners || 0) > (m.away_corners || 0)).length, n)}
                                count={matches.filter(m => (m.home_corners || 0) > (m.away_corners || 0)).length}
                                total={n}
                            />
                            <ProbRow label="Avg córners / partido" pctVal={avg(s.totalCorners, n)} isNumStat />
                        </div>
                    )}

                    {/* TARJETAS */}
                    {activeMarket === 'tarjetas' && (
                        <div>
                            <ProbRow label="Over 1.5 Tarjetas" pctVal={pct(s.over15yc, n)} count={s.over15yc} total={n} />
                            <ProbRow label="Over 3.5 Tarjetas" pctVal={pct(s.over35yc, n)} count={s.over35yc} total={n} />
                            <ProbRow label="Roja en el partido" pctVal={pct(s.matchesWithRed, n)} count={s.matchesWithRed} total={n} />
                            <ProbRow label="Avg tarjetas / partido" pctVal={avg(s.yc, n)} isNumStat />
                        </div>
                    )}

                    {/* ESPECIALES */}
                    {activeMarket === 'especiales' && (
                        <div>
                            <ProbRow
                                label="Primer gol antes del min 30"
                                pctVal={pct(s.fgUnder30, s.firstGoalMinsCount)}
                                count={s.fgUnder30}
                                total={s.firstGoalMinsCount}
                            />
                            <ProbRow
                                label="Primer gol min 31–60"
                                pctVal={pct(s.fg3060, s.firstGoalMinsCount)}
                                count={s.fg3060}
                                total={s.firstGoalMinsCount}
                            />
                            <ProbRow
                                label="Primer gol tras el min 60"
                                pctVal={pct(s.fgOver60, s.firstGoalMinsCount)}
                                count={s.fgOver60}
                                total={s.firstGoalMinsCount}
                            />
                            <ProbRow
                                label="Local anota primero"
                                pctVal={pct(s.homeScoresFirst, n)}
                                count={s.homeScoresFirst}
                                total={n}
                            />
                            <ProbRow
                                label="Visitante anota primero"
                                pctVal={pct(s.awayScoresFirst, n)}
                                count={s.awayScoresFirst}
                                total={n}
                            />
                            <ProbRow label="Avg goles 1a parte" pctVal={s.avgHtGoals} isNumStat />
                        </div>
                    )}

                </div>
            </div>

            {/* Sample size footnote */}
            <p className="text-center text-[11px] text-muted-foreground/60">
                Basado en {n} partido{n === 1 ? '' : 's'} jugado{n === 1 ? '' : 's'}
            </p>
        </div>
    )
}

// ─── Teams Tab ───────────────────────────────────────────────────────────────

function TeamsTab({ matches = [] }) {
    const teamStats = useMemo(() => {
        const played = matches.filter(m => m.home_goals != null)
        if (!played.length) return []
        const stats = {}

        played.forEach(m => {
            const hName = m.home_team?.name
            const aName = m.away_team?.name
            if (!hName || !aName) return

            if (!stats[hName]) stats[hName] = { name: hName, logo: m.home_team?.logo_url, short: m.home_team?.short_name, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 }
            if (!stats[aName]) stats[aName] = { name: aName, logo: m.away_team?.logo_url, short: m.away_team?.short_name, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 }

            const hg = m.home_goals || 0
            const ag = m.away_goals || 0

            // Home team
            stats[hName].played++
            stats[hName].gf += hg
            stats[hName].ga += ag
            if (hg > ag) { stats[hName].won++; stats[hName].pts += 3 }
            else if (hg === ag) { stats[hName].drawn++; stats[hName].pts += 1 }
            else { stats[hName].lost++ }

            // Away team
            stats[aName].played++
            stats[aName].gf += ag
            stats[aName].ga += hg
            if (ag > hg) { stats[aName].won++; stats[aName].pts += 3 }
            else if (ag === hg) { stats[aName].drawn++; stats[aName].pts += 1 }
            else { stats[aName].lost++ }
        })

        return Object.values(stats).sort((a, b) => {
            if (b.pts !== a.pts) return b.pts - a.pts
            const gdA = a.gf - a.ga
            const gdB = b.gf - b.ga
            if (gdB !== gdA) return gdB - gdA
            return b.gf - a.gf
        })
    }, [matches])

    return (
        <div className="space-y-4">
            <div className="overflow-hidden rounded-xl border border-border/50 bg-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border/50 bg-secondary/30 text-xs text-muted-foreground">
                                <th className="whitespace-nowrap px-4 py-3 text-center font-semibold uppercase tracking-wider w-10">#</th>
                                <th className="whitespace-nowrap px-4 py-3 text-left font-semibold uppercase tracking-wider">Equipo</th>
                                <th className="whitespace-nowrap px-3 py-3 text-center font-semibold uppercase tracking-wider">PJ</th>
                                <th className="whitespace-nowrap px-3 py-3 text-center font-semibold uppercase tracking-wider">G</th>
                                <th className="whitespace-nowrap px-3 py-3 text-center font-semibold uppercase tracking-wider">E</th>
                                <th className="whitespace-nowrap px-3 py-3 text-center font-semibold uppercase tracking-wider">P</th>
                                <th className="whitespace-nowrap px-3 py-3 text-center font-semibold uppercase tracking-wider">GF</th>
                                <th className="whitespace-nowrap px-3 py-3 text-center font-semibold uppercase tracking-wider">GC</th>
                                <th className="whitespace-nowrap px-3 py-3 text-center font-semibold uppercase tracking-wider">DG</th>
                                <th className="whitespace-nowrap px-3 py-3 text-center font-semibold uppercase tracking-wider text-primary">Pts</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teamStats.map((t, i) => (
                                <motion.tr
                                    key={t.name}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.02 }}
                                    className="group border-b border-border/30 transition-colors hover:bg-primary/5"
                                >
                                    <td className="px-4 py-3 text-center">
                                        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold
                                            ${i < 4 ? 'bg-green-500/20 text-green-400' :
                                            i < 6 ? 'bg-blue-500/20 text-blue-400' :
                                            i >= teamStats.length - 3 ? 'bg-red-500/20 text-red-400' :
                                            'text-muted-foreground'}`}
                                        >
                                            {i + 1}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {t.logo && <img src={t.logo} alt="" className="h-6 w-6 object-contain" />}
                                            <span className="text-sm font-semibold text-foreground">{t.short || t.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-3 text-center text-xs text-muted-foreground">{t.played}</td>
                                    <td className="px-3 py-3 text-center text-xs font-medium text-green-400">{t.won}</td>
                                    <td className="px-3 py-3 text-center text-xs text-muted-foreground">{t.drawn}</td>
                                    <td className="px-3 py-3 text-center text-xs font-medium text-red-400">{t.lost}</td>
                                    <td className="px-3 py-3 text-center text-xs text-muted-foreground">{t.gf}</td>
                                    <td className="px-3 py-3 text-center text-xs text-muted-foreground">{t.ga}</td>
                                    <td className="px-3 py-3 text-center text-xs font-medium">
                                        <span className={t.gf - t.ga > 0 ? 'text-green-400' : t.gf - t.ga < 0 ? 'text-red-400' : 'text-muted-foreground'}>
                                            {t.gf - t.ga > 0 ? '+' : ''}{t.gf - t.ga}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3 text-center text-base font-black text-primary">{t.pts}</td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
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
