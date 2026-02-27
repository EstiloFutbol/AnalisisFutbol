import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMatches, useLeagues } from '@/hooks/useMatches'
import { usePlayerLeaderboard } from '@/hooks/usePlayerStats'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Legend, PieChart, Pie, Cell
} from 'recharts'
import { TrendingUp, Users, Trophy, BarChart2 } from 'lucide-react'

const CHART_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const STAT_TABS = [
    { id: 'teams', label: 'Equipos', icon: BarChart2 },
    { id: 'players', label: 'Jugadores', icon: Users },
]

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-xl">
            <p className="font-semibold text-foreground">{label}</p>
            {payload.map((entry, i) => (
                <p key={i} style={{ color: entry.color }} className="mt-0.5">
                    {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
                </p>
            ))}
        </div>
    )
}

function MiniLeaderboard({ title, data, valueKey, valueLabel, color = '#22c55e', icon: Icon = Trophy }) {
    return (
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
                <Icon className="h-4 w-4" style={{ color }} />
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</h3>
            </div>
            <div className="divide-y divide-border/20">
                {data.slice(0, 8).map((p, i) => (
                    <motion.div
                        key={`${p.player_name}-${p.team?.id}`}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary/5 transition-colors"
                    >
                        <span className={`w-5 text-center text-xs font-bold tabular-nums
                            ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-orange-400' : 'text-muted-foreground'}`}>
                            {i + 1}
                        </span>
                        {p.team?.logo_url && (
                            <img src={p.team.logo_url} alt="" className="h-5 w-5 object-contain shrink-0" />
                        )}
                        <span className="flex-1 truncate text-sm font-medium text-foreground">{p.player_name}</span>
                        <span className="text-xs text-muted-foreground shrink-0">{p.team?.short_name}</span>
                        <span className="min-w-[32px] text-right text-sm font-black tabular-nums" style={{ color }}>
                            {p[valueKey]}
                        </span>
                    </motion.div>
                ))}
                {data.length === 0 && (
                    <p className="px-4 py-8 text-center text-sm text-muted-foreground">Sin datos</p>
                )}
            </div>
        </div>
    )
}

export default function Statistics() {
    const { data: leagues = [] } = useLeagues()
    const [selectedLeagueId, setSelectedLeagueId] = useState(null)
    const [activeTab, setActiveTab] = useState('teams')

    const defaultLeague = leagues.find(l => l.is_default) || leagues[0]
    const activeLeagueId = selectedLeagueId || (defaultLeague ? String(defaultLeague.id) : null)
    const { data: matches = [], isLoading: matchesLoading } = useMatches(activeLeagueId, { playedOnly: true })
    const { data: players = [], isLoading: playersLoading } = usePlayerLeaderboard(activeLeagueId)

    const isLoading = matchesLoading || playersLoading

    // ── Team stats ────────────────────────────────────────────────────────────
    const teamStats = useMemo(() => {
        if (!matches.length) return []
        const stats = {}
        matches.forEach(match => {
            const home = match.home_team?.name
            const away = match.away_team?.name
            if (!home || !away) return

            if (!stats[home]) stats[home] = { name: home, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, xgf: 0, xga: 0, points: 0 }
            if (!stats[away]) stats[away] = { name: away, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, xgf: 0, xga: 0, points: 0 }

            const hg = match.home_goals || 0
            const ag = match.away_goals || 0

            stats[home].played++; stats[home].gf += hg; stats[home].ga += ag
            stats[home].xgf += Number(match.home_xg) || 0; stats[home].xga += Number(match.away_xg) || 0
            stats[away].played++; stats[away].gf += ag; stats[away].ga += hg
            stats[away].xgf += Number(match.away_xg) || 0; stats[away].xga += Number(match.home_xg) || 0

            if (hg > ag) { stats[home].won++; stats[home].points += 3; stats[away].lost++ }
            else if (hg < ag) { stats[away].won++; stats[away].points += 3; stats[home].lost++ }
            else { stats[home].drawn++; stats[home].points += 1; stats[away].drawn++; stats[away].points += 1 }
        })
        return Object.values(stats)
            .map(t => ({ ...t, gd: t.gf - t.ga, xgDiff: (t.xgf - t.xga).toFixed(2) }))
            .sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf)
    }, [matches])

    const goalsPerMatchday = useMemo(() => {
        if (!matches.length) return []
        const byMd = {}
        matches.forEach(m => {
            const md = m.matchday || 0
            if (!byMd[md]) byMd[md] = { matchday: `J${md}`, goals: 0, matches: 0, xg: 0 }
            byMd[md].goals += (m.home_goals || 0) + (m.away_goals || 0)
            byMd[md].xg += (Number(m.home_xg) || 0) + (Number(m.away_xg) || 0)
            byMd[md].matches++
        })
        return Object.values(byMd)
            .sort((a, b) => parseInt(a.matchday.slice(1)) - parseInt(b.matchday.slice(1)))
            .map(d => ({ ...d, avgGoals: Number((d.goals / d.matches).toFixed(2)), avgXg: Number((d.xg / d.matches).toFixed(2)) }))
    }, [matches])

    const resultDistribution = useMemo(() => {
        if (!matches.length) return []
        return [
            { name: 'Victoria Local', value: matches.filter(m => m.home_goals > m.away_goals).length, color: '#22c55e' },
            { name: 'Empate', value: matches.filter(m => m.home_goals === m.away_goals).length, color: '#94a3b8' },
            { name: 'Victoria Visitante', value: matches.filter(m => m.away_goals > m.home_goals).length, color: '#3b82f6' },
        ]
    }, [matches])

    // ── Player leaderboards ───────────────────────────────────────────────────
    const topScorers = useMemo(() => [...players].filter(p => p.goals > 0).sort((a, b) => b.goals - a.goals || b.assists - a.assists), [players])
    const topAssists = useMemo(() => [...players].filter(p => p.assists > 0).sort((a, b) => b.assists - a.assists || b.goals - a.goals), [players])
    const topShots = useMemo(() => [...players].filter(p => p.shots > 0).sort((a, b) => b.shots - a.shots), [players])
    const topYellows = useMemo(() => [...players].filter(p => p.yellow_cards > 0).sort((a, b) => b.yellow_cards - a.yellow_cards), [players])
    const topGKSaves = useMemo(() => [...players].filter(p => p.gk_saves > 0 || p.gk_shots_faced > 0).sort((a, b) => b.gk_saves - a.gk_saves), [players])

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">Estadísticas</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Análisis completo de la temporada</p>
                </div>
                <div className="flex items-center gap-3">
                    {leagues.length > 0 && (
                        <select
                            value={activeLeagueId || ''}
                            onChange={(e) => setSelectedLeagueId(e.target.value)}
                            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            {leagues.map(l => (
                                <option key={l.id} value={l.id}>{l.name} {l.season}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 rounded-xl border border-border/50 bg-card/50 p-1">
                {STAT_TABS.map(tab => {
                    const Icon = tab.icon
                    const active = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all
                                ${active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {active && (
                                <motion.div
                                    layoutId="stat-tab-bg"
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

            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
            )}

            <AnimatePresence mode="wait">
                {/* ── TEAMS tab ── */}
                {activeTab === 'teams' && teamStats.length > 0 && (
                    <motion.div
                        key="teams"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="space-y-6"
                    >
                        {/* Charts */}
                        <div className="grid gap-6 lg:grid-cols-2">
                            <div className="rounded-xl border border-border/50 bg-card p-5">
                                <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Goles por Jornada (media)</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={goalsPerMatchday}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 17%)" />
                                        <XAxis dataKey="matchday" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                        <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend wrapperStyle={{ fontSize: 11 }} />
                                        <Line type="monotone" dataKey="avgGoals" name="Goles" stroke="#22c55e" strokeWidth={2} dot={false} />
                                        <Line type="monotone" dataKey="avgXg" name="xG" stroke="#3b82f6" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="rounded-xl border border-border/50 bg-card p-5">
                                <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Distribución de Resultados</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie data={resultDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%"
                                            outerRadius={80} innerRadius={50} paddingAngle={2}
                                            label={({ name, value }) => `${name}: ${value}`}>
                                            {resultDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Standings */}
                        <div className="overflow-hidden rounded-xl border border-border/50 bg-card">
                            <div className="p-5 pb-3">
                                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Clasificación</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border/50 text-xs text-muted-foreground">
                                            {['#', 'Equipo', 'PJ', 'G', 'E', 'P', 'GF', 'GC', 'DG', 'xGD', 'Pts'].map(h => (
                                                <th key={h} className={`whitespace-nowrap px-4 py-2 font-medium ${h === 'Equipo' ? 'text-left' : 'text-center'}`}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {teamStats.map((team, i) => (
                                            <motion.tr
                                                key={team.name}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: i * 0.02 }}
                                                className={`border-b border-border/30 transition-colors hover:bg-secondary/30 ${i < 4 ? 'border-l-2 border-l-primary' : ''}`}
                                            >
                                                <td className="whitespace-nowrap px-4 py-2.5 text-center text-muted-foreground">{i + 1}</td>
                                                <td className="whitespace-nowrap px-4 py-2.5 font-semibold">{team.name}</td>
                                                <td className="whitespace-nowrap px-4 py-2.5 text-center text-muted-foreground">{team.played}</td>
                                                <td className="whitespace-nowrap px-4 py-2.5 text-center text-win">{team.won}</td>
                                                <td className="whitespace-nowrap px-4 py-2.5 text-center text-draw">{team.drawn}</td>
                                                <td className="whitespace-nowrap px-4 py-2.5 text-center text-loss">{team.lost}</td>
                                                <td className="whitespace-nowrap px-4 py-2.5 text-center">{team.gf}</td>
                                                <td className="whitespace-nowrap px-4 py-2.5 text-center text-muted-foreground">{team.ga}</td>
                                                <td className={`whitespace-nowrap px-4 py-2.5 text-center font-medium ${team.gd > 0 ? 'text-win' : team.gd < 0 ? 'text-loss' : 'text-muted-foreground'}`}>
                                                    {team.gd > 0 ? `+${team.gd}` : team.gd}
                                                </td>
                                                <td className={`whitespace-nowrap px-4 py-2.5 text-center text-xs ${Number(team.xgDiff) > 0 ? 'text-win' : Number(team.xgDiff) < 0 ? 'text-loss' : 'text-muted-foreground'}`}>
                                                    {Number(team.xgDiff) > 0 ? `+${team.xgDiff}` : team.xgDiff}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-2.5 text-center text-lg font-black">{team.points}</td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── PLAYERS tab ── */}
                {activeTab === 'players' && (
                    <motion.div
                        key="players"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                    >
                        <MiniLeaderboard
                            title="Goleadores"
                            data={topScorers}
                            valueKey="goals"
                            color="#22c55e"
                            icon={Trophy}
                        />
                        <MiniLeaderboard
                            title="Asistencias"
                            data={topAssists}
                            valueKey="assists"
                            color="#3b82f6"
                            icon={TrendingUp}
                        />
                        <MiniLeaderboard
                            title="Tiros totales"
                            data={topShots}
                            valueKey="shots"
                            color="#f59e0b"
                            icon={TrendingUp}
                        />
                        <MiniLeaderboard
                            title="Tarjetas amarillas"
                            data={topYellows}
                            valueKey="yellow_cards"
                            color="#eab308"
                            icon={TrendingUp}
                        />
                        <MiniLeaderboard
                            title="Porteros — Paradas"
                            data={topGKSaves}
                            valueKey="gk_saves"
                            color="#8b5cf6"
                            icon={TrendingUp}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Empty state */}
            {!isLoading && teamStats.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/50 py-20 text-center">
                    <TrendingUp className="h-12 w-12 text-muted-foreground/30" />
                    <h3 className="mt-4 text-lg font-semibold text-muted-foreground">Sin datos</h3>
                    <p className="mt-1 text-sm text-muted-foreground/60">Añade partidos para ver estadísticas</p>
                </div>
            )}
        </div>
    )
}
