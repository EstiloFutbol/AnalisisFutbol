import { useMemo, useEffect, useState, lazy, Suspense } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLeagueContext } from '@/context/LeagueContext'
import { motion } from 'framer-motion'
import { useMatches, useLeagues, useGroupStandings, useWCKnockoutMatches, useWCGroupMatches } from '@/hooks/useMatches'
import { usePlayerLeaderboard } from '@/hooks/usePlayerStats'
import {
    Trophy, Goal, Target, TrendingUp, Activity,
    BarChart3, Clock, Shield, CreditCard,
    AlertTriangle, Zap, Info, Users, Crosshair,
    ArrowUpRight, Minus, ArrowDownRight, Star, Timer,
    CalendarDays, ShieldCheck, Calculator, Swords, RotateCcw
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
    const { setActiveLeagueId: setGlobalLeagueId } = useLeagueContext()
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

    // Sync active league to global context so other pages (Analisis) remember it
    useEffect(() => {
        if (activeLeagueId) setGlobalLeagueId(parseInt(activeLeagueId, 10))
    }, [activeLeagueId, setGlobalLeagueId])

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
            {activeTab === 'mercados' && <MercadosContent s={s} matches={s?.playedMatches || matches} leagueObj={activeLeagueObj} />}
            {activeTab === 'jugadores' && <PlayersTab hideLeagueSelector leagueId={activeLeagueId} />}
            {activeTab === 'partidos' && <MatchesTab hideLeagueSelector leagueId={activeLeagueId} />}
            {activeTab === 'clasificacion' && <TeamsTab matches={matches} leagueObj={activeLeagueObj} activeLeagueId={activeLeagueId} />}
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

function MercadosContent({ s, matches, leagueObj }) {
    const [activeMarket, setActiveMarket] = useState('resultado')
    const isWC = leagueObj?.code === 'WC'

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
                            {!isWC && <ProbRow label="Local anota primero" pctVal={pct(s.homeScoresFirst, n)} count={s.homeScoresFirst} total={n} />}
                            {!isWC && <ProbRow label="Visitante anota primero" pctVal={pct(s.awayScoresFirst, n)} count={s.awayScoresFirst} total={n} />}
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
                            {!isWC && <ProbRow
                                label="Local anota primero"
                                pctVal={pct(s.homeScoresFirst, n)}
                                count={s.homeScoresFirst}
                                total={n}
                            />}
                            {!isWC && <ProbRow
                                label="Visitante anota primero"
                                pctVal={pct(s.awayScoresFirst, n)}
                                count={s.awayScoresFirst}
                                total={n}
                            />}
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

function TeamsTab({ matches = [], leagueObj, activeLeagueId }) {
    const isWC = leagueObj?.code === 'WC'

    if (isWC) {
        return <WCClassificacion leagueId={activeLeagueId} />
    }

    return <LeagueStandingsTable matches={matches} />
}

// ─── WC Clasificación: Grupos + Eliminatorias tabs ──────────────────────────

function WCClassificacion({ leagueId }) {
    const [tab, setTab] = useState('grupos')
    return (
        <div className="space-y-4">
            <div className="flex rounded-xl overflow-hidden border border-border/50">
                {[['grupos', 'Grupos'], ['bracket', 'Eliminatorias']].map(([v, label]) => (
                    <button
                        key={v}
                        onClick={() => setTab(v)}
                        className={`flex-1 py-2 text-sm font-semibold transition-colors
                            ${tab === v
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted/40'}`}
                    >
                        {label}
                    </button>
                ))}
            </div>
            {tab === 'grupos'
                ? <WCGruposView leagueId={leagueId} />
                : <WCEliminatorias leagueId={leagueId} />
            }
        </div>
    )
}

// ─── WC Eliminatorias: third-place tracker + round bracket + simulator ───────

const WC_ROUNDS = [
    { md: 4, label: 'R32', full: 'Copa del Mundo (32)' },
    { md: 5, label: 'Octavos', full: 'Octavos de Final' },
    { md: 6, label: 'Cuartos', full: 'Cuartos de Final' },
    { md: 7, label: 'Semis', full: 'Semifinales' },
    { md: 8, label: '3er lugar', full: 'Tercer Lugar' },
    { md: 9, label: 'Final', full: 'Final' },
]

function computeWCQualifiers(standings) {
    const byGroup = {}
    standings.forEach(r => {
        const g = r.group_name || '?'
        if (!byGroup[g]) byGroup[g] = []
        byGroup[g].push(r)
    })

    const groupWinners = {}
    const groupRunnerUps = {}
    const allThirds = []

    Object.keys(byGroup).sort().forEach(g => {
        const sorted = [...byGroup[g]].sort((a, b) => {
            const pd = (b.points || 0) - (a.points || 0)
            if (pd !== 0) return pd
            const gdA = (a.goals_for || 0) - (a.goals_against || 0)
            const gdB = (b.goals_for || 0) - (b.goals_against || 0)
            if (gdB !== gdA) return gdB - gdA
            return (b.goals_for || 0) - (a.goals_for || 0)
        })
        groupWinners[g] = sorted[0]
        groupRunnerUps[g] = sorted[1]
        if (sorted[2]) allThirds.push({ ...sorted[2], _group: g })
    })

    allThirds.sort((a, b) => {
        const pd = (b.points || 0) - (a.points || 0)
        if (pd !== 0) return pd
        const gdA = (a.goals_for || 0) - (a.goals_against || 0)
        const gdB = (b.goals_for || 0) - (b.goals_against || 0)
        if (gdB !== gdA) return gdB - gdA
        return (b.goals_for || 0) - (a.goals_for || 0)
    })

    return { groupWinners, groupRunnerUps, allThirds }
}

function simulateStandings(standings, unplayed, simScores) {
    const byTeamId = {}
    standings.forEach(r => { byTeamId[r.team_id] = { ...r } })

    unplayed.forEach(m => {
        const sim = simScores[m.id]
        if (!sim || sim.h === '' || sim.a === '') return
        const h = parseInt(sim.h) || 0
        const a = parseInt(sim.a) || 0
        const hr = byTeamId[m.home_team_id]
        const ar = byTeamId[m.away_team_id]
        if (!hr || !ar) return
        hr.played = (hr.played || 0) + 1; ar.played = (ar.played || 0) + 1
        hr.goals_for = (hr.goals_for || 0) + h; hr.goals_against = (hr.goals_against || 0) + a
        ar.goals_for = (ar.goals_for || 0) + a; ar.goals_against = (ar.goals_against || 0) + h
        if (h > a) { hr.won = (hr.won || 0) + 1; hr.points = (hr.points || 0) + 3; ar.lost = (ar.lost || 0) + 1 }
        else if (h < a) { ar.won = (ar.won || 0) + 1; ar.points = (ar.points || 0) + 3; hr.lost = (hr.lost || 0) + 1 }
        else { hr.drawn = (hr.drawn || 0) + 1; hr.points = (hr.points || 0) + 1; ar.drawn = (ar.drawn || 0) + 1; ar.points = (ar.points || 0) + 1 }
    })

    return Object.values(byTeamId)
}

function WCEliminatorias({ leagueId }) {
    const { data: standings = [] } = useGroupStandings(leagueId)
    const { data: knockoutMatches = [], isLoading: koLoading } = useWCKnockoutMatches(leagueId)
    const { data: groupMatches = [] } = useWCGroupMatches(leagueId)

    const [simMode, setSimMode] = useState(false)
    const [simScores, setSimScores] = useState({})

    const unplayed = useMemo(() => groupMatches.filter(m => m.home_goals == null), [groupMatches])

    const effectiveStandings = useMemo(() => {
        if (!simMode || !Object.keys(simScores).length) return standings
        return simulateStandings(standings, unplayed, simScores)
    }, [simMode, simScores, standings, unplayed])

    const { allThirds } = useMemo(() => computeWCQualifiers(effectiveStandings), [effectiveStandings])

    function toggleSim() {
        if (simMode) setSimScores({})
        setSimMode(s => !s)
    }

    return (
        <div className="space-y-6">
            {/* Header + simulator toggle */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Swords className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold text-foreground">Cuadro Eliminatorio</span>
                </div>
                <button
                    onClick={toggleSim}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all
                        ${simMode
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'border border-border text-muted-foreground hover:border-primary hover:text-primary'}`}
                >
                    <Calculator className="h-3 w-3" />
                    {simMode ? 'Simulador activo' : 'Simular'}
                </button>
            </div>

            {/* Simulator panel */}
            {simMode && (
                <SimulatorPanel
                    unplayed={unplayed}
                    simScores={simScores}
                    onScoreChange={(id, h, a) => setSimScores(prev => ({ ...prev, [id]: { h, a } }))}
                    onReset={() => setSimScores({})}
                />
            )}

            {/* Classic visual bracket */}
            {koLoading ? (
                <div className="flex justify-center py-10">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
            ) : (
                <WCBracket knockoutMatches={knockoutMatches} standings={effectiveStandings} />
            )}

            {/* Third-place tracker — below bracket */}
            {allThirds.length > 0 && (
                <ThirdPlaceTracker allThirds={allThirds} simMode={simMode} />
            )}
        </div>
    )
}

// ─── Third-place tracker ─────────────────────────────────────────────────────

function ThirdPlaceTracker({ allThirds, simMode }) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Ranking de Terceros
                </span>
                {simMode && (
                    <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                        Simulado
                    </span>
                )}
            </div>
            <div className="overflow-hidden rounded-xl border border-border/50 bg-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="text-[10px] text-muted-foreground/70 border-b border-border/50 bg-secondary/30">
                                <th className="px-2 py-2 text-center">#</th>
                                <th className="px-2 py-2 text-left">Equipo</th>
                                <th className="px-1 py-2 text-center w-7">Gr</th>
                                <th className="px-1 py-2 text-center w-7">PJ</th>
                                <th className="px-1 py-2 text-center w-8">Pts</th>
                                <th className="px-1 py-2 text-center w-12">GF:GC</th>
                                <th className="px-1 py-2 text-center w-8">DG</th>
                                <th className="px-2 py-2 text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allThirds.map((t, i) => {
                                const qualified = i < 8
                                const gd = (t.goals_for || 0) - (t.goals_against || 0)
                                const team = t.team || {}
                                return (
                                    <tr
                                        key={t.team_id || i}
                                        className={`border-b border-border/20 last:border-0 transition-colors
                                            ${qualified
                                                ? 'border-l-2 border-l-green-500/60 hover:bg-green-500/5'
                                                : 'border-l-2 border-l-red-500/40 opacity-60 hover:bg-red-500/5'}`}
                                    >
                                        <td className="px-2 py-2 text-center">
                                            <span className={`inline-flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold
                                                ${qualified ? 'bg-green-500/20 text-green-400' : 'text-muted-foreground'}`}>
                                                {i + 1}
                                            </span>
                                        </td>
                                        <td className="px-2 py-2">
                                            <div className="flex items-center gap-1.5">
                                                {team.logo_url && (
                                                    <img src={team.logo_url} alt="" className="h-4 w-4 object-contain shrink-0" />
                                                )}
                                                <span className={`font-medium truncate max-w-[80px] ${qualified ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                    {team.short_name || team.name || '—'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-1 py-2 text-center font-mono text-muted-foreground">{t._group || t.group_name}</td>
                                        <td className="px-1 py-2 text-center text-muted-foreground">{t.played || 0}</td>
                                        <td className="px-1 py-2 text-center font-black text-primary">{t.points || 0}</td>
                                        <td className="px-1 py-2 text-center text-muted-foreground">{t.goals_for || 0}:{t.goals_against || 0}</td>
                                        <td className={`px-1 py-2 text-center text-[10px] font-semibold
                                            ${gd > 0 ? 'text-green-400' : gd < 0 ? 'text-red-400' : 'text-muted-foreground/50'}`}>
                                            {gd > 0 ? `+${gd}` : gd}
                                        </td>
                                        <td className="px-2 py-2 text-center">
                                            {qualified ? (
                                                <span className="text-[9px] font-bold text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                                                    Clasificado
                                                </span>
                                            ) : (
                                                <span className="text-[9px] font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                                                    Eliminado
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="px-3 py-1.5 border-t border-border/30 bg-secondary/10 flex items-center gap-4 text-[10px] text-muted-foreground/60">
                    <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-green-500/60 inline-block" />
                        Top 8 clasifican (de 12 grupos)
                    </span>
                </div>
            </div>
        </div>
    )
}

// ─── Classic visual bracket ──────────────────────────────────────────────────

// WC 2026 R32 bracket position order: DB match IDs sorted by official bracket position
// (derived from consecutive football-data.org API IDs 537415–537430; consecutive pairs → same R16)
const WC_R32_BRACKET_ORDER = [
    2986, 2989,  // bracket pair 1 → R16: Match 76 (1C vs 2F) + Match 78 (2E vs 2I)
    2984, 2987,  // bracket pair 2 → R16: Match 73 (2A vs 2B) + Match 75 (1F vs 2C)
    2995, 2994,  // bracket pair 3 → R16: Match 84 (1H vs 2J) + Match 83 (2K vs 2L)
    2993, 2992,  // bracket pair 4 → R16: Match 82 (1G vs best3) + Match 81 (1D vs best3)
    2985, 2988,  // bracket pair 5 → R16: Match 74 (1E vs best3) + Match 77 (1I vs best3)
    2990, 2991,  // bracket pair 6 → R16: Match 79 (1A vs best3) + Match 80 (1L vs best3)
    2998, 2997,  // bracket pair 7 → R16: Match 88 (2D vs 2G) + Match 86 (1J vs 2H)
    2996, 2999,  // bracket pair 8 → R16: Match 85 (1B vs best3) + Match 87 (1K vs best3)
]

// Group-position labels for each R32 slot (shown when team_id is not yet set)
const WC_R32_SLOT_LABELS = [
    { home: '1° Gr. C', away: '2° Gr. F' },  // bracket pos 0
    { home: '2° Gr. E', away: '2° Gr. I' },  // bracket pos 1
    { home: '2° Gr. A', away: '2° Gr. B' },  // bracket pos 2
    { home: '1° Gr. F', away: '2° Gr. C' },  // bracket pos 3
    { home: '1° Gr. H', away: '2° Gr. J' },  // bracket pos 4
    { home: '2° Gr. K', away: '2° Gr. L' },  // bracket pos 5
    { home: '1° Gr. G', away: 'Mejor 3°' },  // bracket pos 6
    { home: '1° Gr. D', away: 'Mejor 3°' },  // bracket pos 7
    { home: '1° Gr. E', away: 'Mejor 3°' },  // bracket pos 8
    { home: '1° Gr. I', away: 'Mejor 3°' },  // bracket pos 9
    { home: '1° Gr. A', away: 'Mejor 3°' },  // bracket pos 10
    { home: '1° Gr. L', away: 'Mejor 3°' },  // bracket pos 11
    { home: '2° Gr. D', away: '2° Gr. G' },  // bracket pos 12
    { home: '1° Gr. J', away: '2° Gr. H' },  // bracket pos 13
    { home: '1° Gr. B', away: 'Mejor 3°' },  // bracket pos 14
    { home: '1° Gr. K', away: 'Mejor 3°' },  // bracket pos 15
]

// Parse "1° Gr. C" → team object from standings (null if not found or not confirmed)
function getSlotProjection(label, groupWinners, groupRunnerUps) {
    if (!label) return null
    const m = label.match(/^([12])° Gr\. ([A-L])$/)
    if (!m) return null
    const [, pos, group] = m
    return pos === '1' ? (groupWinners[group] || null) : (groupRunnerUps[group] || null)
}

const BK_MATCH_H = 56       // height of each match card (px)
const BK_MATCH_GAP = 6      // gap between consecutive matches (px)
const BK_UNIT = BK_MATCH_H + BK_MATCH_GAP
const BK_COL_W = 152        // width of each match card
const BK_COL_GAP = 26       // space between columns (for connector lines)
const BK_COL_STEP = BK_COL_W + BK_COL_GAP
const BK_LABEL_H = 24       // height of round label row
const BK_TOTAL_H = 16 * BK_UNIT  // total bracket height

// round index → top of match card (px, relative to bracket area)
function bkMatchTop(ri, mi) {
    const span = Math.pow(2, ri)
    return mi * span * BK_UNIT + (span - 1) * BK_UNIT / 2
}
function bkMatchCenterY(ri, mi) { return bkMatchTop(ri, mi) + BK_MATCH_H / 2 }

const BK_ROUNDS = [
    { md: 4, label: 'Copa del Mundo (R32)' },
    { md: 5, label: 'Octavos de Final' },
    { md: 6, label: 'Cuartos de Final' },
    { md: 7, label: 'Semifinales' },
    { md: 9, label: 'Final' },
]

function WCBracket({ knockoutMatches, standings = [] }) {
    const { groupWinners, groupRunnerUps } = useMemo(
        () => computeWCQualifiers(standings),
        [standings]
    )

    const byRound = useMemo(() => {
        const r = {}
        BK_ROUNDS.forEach(({ md }) => { r[md] = [] })
        knockoutMatches.forEach(m => {
            if (r[m.matchday] !== undefined) r[m.matchday].push(m)
        })
        // Sort R32 by true bracket position (based on official FIFA draw via API ID order)
        if (r[4].length > 0) {
            const orderMap = {}
            WC_R32_BRACKET_ORDER.forEach((dbId, pos) => { orderMap[dbId] = pos })
            r[4].sort((a, b) => {
                const pa = orderMap[a.id] ?? 999
                const pb = orderMap[b.id] ?? 999
                return pa - pb
            })
        }
        return r
    }, [knockoutMatches])

    const thirdPlaceMatch = knockoutMatches.find(m => m.matchday === 8)

    const lines = useMemo(() => {
        const ls = []
        BK_ROUNDS.forEach(({ md }, ri) => {
            if (ri >= BK_ROUNDS.length - 1) return
            const matches = byRound[md] || []
            matches.forEach((_, mi) => {
                const x1 = ri * BK_COL_STEP + BK_COL_W
                const y1 = bkMatchCenterY(ri, mi)
                const xMid = x1 + BK_COL_GAP / 2

                ls.push([x1, y1, xMid, y1])                  // horizontal out of card

                if (mi % 2 === 0) {
                    const partner = byRound[md][mi + 1]
                    if (partner !== undefined) {
                        const y2 = bkMatchCenterY(ri, mi + 1)
                        ls.push([xMid, y1, xMid, y2])         // vertical connector
                    }
                    const nextY = bkMatchCenterY(ri + 1, Math.floor(mi / 2))
                    ls.push([xMid, nextY, (ri + 1) * BK_COL_STEP, nextY]) // horizontal into next card
                }
            })
        })
        return ls
    }, [byRound])

    const totalWidth = BK_ROUNDS.length * BK_COL_W + (BK_ROUNDS.length - 1) * BK_COL_GAP

    // For R32 slots, resolve labels + projected teams from standings
    function r32SlotProps(matchId) {
        const bPos = WC_R32_BRACKET_ORDER.indexOf(matchId)
        if (bPos < 0) return {}
        const labels = WC_R32_SLOT_LABELS[bPos] || {}
        return {
            homeLabel: labels.home,
            awayLabel: labels.away,
            homeProj: getSlotProjection(labels.home, groupWinners, groupRunnerUps),
            awayProj: getSlotProjection(labels.away, groupWinners, groupRunnerUps),
        }
    }

    return (
        <div className="space-y-3">
            {/* Scrollable bracket */}
            <div className="overflow-x-auto rounded-xl border border-border/30 bg-card/30 p-4 pb-5">
                <div style={{ position: 'relative', width: totalWidth, height: BK_TOTAL_H + BK_LABEL_H }}>
                    {/* Round column labels */}
                    {BK_ROUNDS.map(({ md, label }, ri) => (
                        <div
                            key={md}
                            style={{ position: 'absolute', left: ri * BK_COL_STEP, top: 0, width: BK_COL_W }}
                            className="text-center text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 truncate"
                        >
                            {label}
                        </div>
                    ))}

                    {/* SVG connector lines */}
                    <svg
                        style={{ position: 'absolute', top: BK_LABEL_H, left: 0, width: totalWidth, height: BK_TOTAL_H }}
                        className="pointer-events-none text-border/70"
                    >
                        {lines.map(([x1, y1, x2, y2], i) => (
                            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                                stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
                        ))}
                    </svg>

                    {/* Match cards */}
                    {BK_ROUNDS.map(({ md }, ri) =>
                        (byRound[md] || []).map((m, mi) => (
                            <div
                                key={m.id}
                                style={{
                                    position: 'absolute',
                                    left: ri * BK_COL_STEP,
                                    top: BK_LABEL_H + bkMatchTop(ri, mi),
                                    width: BK_COL_W,
                                    height: BK_MATCH_H,
                                }}
                            >
                                <BracketMatchSlot match={m} {...(md === 4 ? r32SlotProps(m.id) : {})} />
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Third-place match */}
            {thirdPlaceMatch && (
                <div className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                    <Trophy className="h-4 w-4 text-amber-400 shrink-0" />
                    <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400/80 mb-1.5">
                            Tercer Lugar
                        </p>
                        <div style={{ width: BK_COL_W }}>
                            <BracketMatchSlot match={thirdPlaceMatch} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function BracketMatchSlot({ match, homeLabel, awayLabel, homeProj, awayProj }) {
    const played = match.home_goals != null
    const homeWon = played && match.home_goals > match.away_goals
    const awayWon = played && match.away_goals > match.home_goals

    return (
        <div className="h-full flex flex-col rounded-lg border border-border/60 bg-card overflow-hidden shadow-sm">
            <BracketTeamSlot
                team={match.home_team} goals={played ? match.home_goals : null}
                winner={homeWon} played={played} label={homeLabel} proj={homeProj}
            />
            <div className="h-px bg-border/40 shrink-0" />
            <BracketTeamSlot
                team={match.away_team} goals={played ? match.away_goals : null}
                winner={awayWon} played={played} label={awayLabel} proj={awayProj}
            />
        </div>
    )
}

function BracketTeamSlot({ team, goals, winner, played, label, proj }) {
    // proj = standing row from computeWCQualifiers (has .team sub-object)
    const projTeam = proj?.team || null
    const displayTeam = team || projTeam
    const isProj = !team && !!projTeam

    return (
        <div className={`flex flex-1 items-center gap-1.5 px-1.5 min-h-0
            ${winner ? 'bg-primary/10' : ''}`}
        >
            {displayTeam?.logo_url ? (
                <img src={displayTeam.logo_url} alt=""
                    className={`h-4 w-4 object-contain shrink-0 ${isProj ? 'opacity-60' : ''}`} />
            ) : (
                <div className="h-4 w-4 rounded-full bg-muted/20 shrink-0" />
            )}
            <span className={`text-[10px] flex-1 truncate leading-tight
                ${winner ? 'font-bold text-foreground'
                    : played ? 'text-muted-foreground'
                    : isProj ? 'text-muted-foreground/70 italic'
                    : displayTeam ? 'text-muted-foreground/60'
                    : 'text-muted-foreground/40 italic'}`}
            >
                {displayTeam
                    ? (displayTeam.short_name || displayTeam.name)
                    : (label || '?')}
            </span>
            {goals != null && (
                <span className={`text-[11px] font-black tabular-nums shrink-0
                    ${winner ? 'text-primary' : 'text-muted-foreground/70'}`}
                >
                    {goals}
                </span>
            )}
        </div>
    )
}

// ─── Simulator panel ─────────────────────────────────────────────────────────

function SimulatorPanel({ unplayed, simScores, onScoreChange, onReset }) {
    const byGroup = useMemo(() => {
        const g = {}
        unplayed.forEach(m => {
            const key = m.group_name || '?'
            if (!g[key]) g[key] = []
            g[key].push(m)
        })
        return g
    }, [unplayed])

    if (!unplayed.length) {
        return (
            <div className="rounded-xl border border-dashed border-border/50 py-6 text-center">
                <p className="text-sm text-muted-foreground">No hay partidos pendientes en la fase de grupos</p>
            </div>
        )
    }

    return (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Calculator className="h-3.5 w-3.5 text-primary" />
                    <span className="text-sm font-bold text-primary">Simula los resultados pendientes</span>
                </div>
                <button
                    onClick={onReset}
                    className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                >
                    <RotateCcw className="h-3 w-3" />
                    Reiniciar
                </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.keys(byGroup).sort().map(g => (
                    <div key={g}>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                            Grupo {g}
                        </div>
                        <div className="space-y-2">
                            {byGroup[g].map(m => {
                                const sim = simScores[m.id] || { h: '', a: '' }
                                return (
                                    <div key={m.id} className="flex items-center gap-1.5 bg-card rounded-lg px-2 py-1.5 border border-border/40">
                                        <div className="flex items-center gap-1 flex-1 min-w-0">
                                            {m.home_team?.logo_url && (
                                                <img src={m.home_team.logo_url} alt="" className="h-4 w-4 object-contain shrink-0" />
                                            )}
                                            <span className="text-[11px] truncate font-medium">
                                                {m.home_team?.short_name || m.home_team?.name || '?'}
                                            </span>
                                        </div>
                                        <input
                                            type="number" min="0" max="20"
                                            value={sim.h}
                                            onChange={e => onScoreChange(m.id, e.target.value, sim.a)}
                                            className="w-7 text-center bg-background border border-border/60 rounded text-sm font-black text-primary py-0.5 focus:outline-none focus:border-primary"
                                            placeholder="0"
                                        />
                                        <span className="text-muted-foreground/50 text-xs font-bold">–</span>
                                        <input
                                            type="number" min="0" max="20"
                                            value={sim.a}
                                            onChange={e => onScoreChange(m.id, sim.h, e.target.value)}
                                            className="w-7 text-center bg-background border border-border/60 rounded text-sm font-black text-primary py-0.5 focus:outline-none focus:border-primary"
                                            placeholder="0"
                                        />
                                        <div className="flex items-center gap-1 flex-1 min-w-0 justify-end">
                                            <span className="text-[11px] truncate font-medium text-right">
                                                {m.away_team?.short_name || m.away_team?.name || '?'}
                                            </span>
                                            {m.away_team?.logo_url && (
                                                <img src={m.away_team.logo_url} alt="" className="h-4 w-4 object-contain shrink-0" />
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-[10px] text-muted-foreground/60 text-center">
                Los cambios se reflejan en tiempo real en el ranking de terceros
            </p>
        </div>
    )
}

// World Cup: 12 group tables from tournament_standings
function WCGruposView({ leagueId }) {
    const { data: rows = [], isLoading } = useGroupStandings(leagueId)

    if (isLoading) return (
        <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
    )

    if (!rows.length) return (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/50 py-20 text-center">
            <Trophy className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No hay datos de clasificación disponibles</p>
        </div>
    )

    // Group rows by group_name
    const byGroup = {}
    rows.forEach(r => {
        if (!byGroup[r.group_name]) byGroup[r.group_name] = []
        byGroup[r.group_name].push(r)
    })

    const groups = Object.keys(byGroup).sort()

    return (
        <div className="space-y-4">
            {/* Compact legend */}
            <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground px-1">
                <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500/60 inline-block" />
                    Clasificado directamente
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60 inline-block" />
                    Posible clasificado (3°)
                </span>
            </div>

            {/* 12 groups in a responsive grid */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {groups.map(g => {
                    const gRows = byGroup[g]
                    return (
                        <div key={g} className="overflow-hidden rounded-xl border border-border/50 bg-card">
                            {/* Group header */}
                            <div className="flex items-center gap-2 border-b border-border/50 bg-secondary/30 px-4 py-2.5">
                                <Trophy className="h-3.5 w-3.5 text-primary" />
                                <span className="text-xs font-black uppercase tracking-widest text-foreground">
                                    Grupo {g}
                                </span>
                            </div>
                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="text-[10px] text-muted-foreground/70">
                                            <th className="px-3 py-2 text-left font-semibold uppercase tracking-wider w-6">#</th>
                                            <th className="px-2 py-2 text-left font-semibold uppercase tracking-wider">Equipo</th>
                                            <th className="px-2 py-2 text-center font-semibold uppercase tracking-wider w-7">PJ</th>
                                            <th className="px-2 py-2 text-center font-semibold uppercase tracking-wider w-7">G</th>
                                            <th className="px-2 py-2 text-center font-semibold uppercase tracking-wider w-7">E</th>
                                            <th className="px-2 py-2 text-center font-semibold uppercase tracking-wider w-7">P</th>
                                            <th className="px-2 py-2 text-center font-semibold uppercase tracking-wider w-12">GF:GC</th>
                                            <th className="px-2 py-2 text-center font-semibold uppercase tracking-wider text-primary w-8">Pts</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {gRows.map((r, i) => {
                                            const team = r.team || {}
                                            const gd = r.goals_for - r.goals_against
                                            // Top 2 advance; 3rd may advance as best 3rd
                                            const rowBg = i < 2
                                                ? 'border-l-2 border-l-green-500/60'
                                                : i === 2
                                                    ? 'border-l-2 border-l-amber-500/40'
                                                    : ''
                                            return (
                                                <tr key={r.team_id || i}
                                                    className={`border-b border-border/20 last:border-0 hover:bg-primary/5 transition-colors ${rowBg}`}
                                                >
                                                    <td className="px-3 py-2 text-center">
                                                        <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold
                                                            ${i < 2 ? 'bg-green-500/20 text-green-400' :
                                                            i === 2 ? 'bg-amber-500/15 text-amber-400' :
                                                            'text-muted-foreground'}`}
                                                        >
                                                            {i + 1}
                                                        </span>
                                                    </td>
                                                    <td className="px-2 py-2">
                                                        <div className="flex items-center gap-2">
                                                            {team.logo_url && (
                                                                <img src={team.logo_url} alt="" className="h-5 w-5 object-contain shrink-0" />
                                                            )}
                                                            <span className="font-medium text-foreground truncate max-w-[90px]">
                                                                {team.short_name || team.name || '—'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-2 py-2 text-center text-muted-foreground">{r.played}</td>
                                                    <td className="px-2 py-2 text-center font-medium text-green-400">{r.won}</td>
                                                    <td className="px-2 py-2 text-center text-muted-foreground">{r.drawn}</td>
                                                    <td className="px-2 py-2 text-center font-medium text-red-400">{r.lost}</td>
                                                    <td className="px-2 py-2 text-center text-muted-foreground">
                                                        {r.goals_for}:{r.goals_against}
                                                        <span className={`ml-1 text-[10px] ${gd > 0 ? 'text-green-400' : gd < 0 ? 'text-red-400' : 'text-muted-foreground/50'}`}>
                                                            ({gd > 0 ? '+' : ''}{gd})
                                                        </span>
                                                    </td>
                                                    <td className="px-2 py-2 text-center font-black text-primary">{r.points}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// Regular league: compute standings from match results
function LeagueStandingsTable({ matches = [] }) {
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

            stats[hName].played++
            stats[hName].gf += hg
            stats[hName].ga += ag
            if (hg > ag) { stats[hName].won++; stats[hName].pts += 3 }
            else if (hg === ag) { stats[hName].drawn++; stats[hName].pts += 1 }
            else { stats[hName].lost++ }

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
