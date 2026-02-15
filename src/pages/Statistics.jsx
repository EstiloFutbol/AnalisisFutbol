import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useMatches, useSeasons } from '@/hooks/useMatches'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Legend, PieChart, Pie, Cell
} from 'recharts'
import { TrendingUp, Target, Shield } from 'lucide-react'

const CHART_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

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

export default function Statistics() {
    const { data: seasons = [] } = useSeasons()
    const [selectedSeason, setSelectedSeason] = useState(null)

    const activeSeason = selectedSeason || seasons[0]
    const { data: matches = [], isLoading } = useMatches(activeSeason)

    // Team statistics
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

            stats[home].played++
            stats[home].gf += hg
            stats[home].ga += ag
            stats[home].xgf += Number(match.home_xg) || 0
            stats[home].xga += Number(match.away_xg) || 0

            stats[away].played++
            stats[away].gf += ag
            stats[away].ga += hg
            stats[away].xgf += Number(match.away_xg) || 0
            stats[away].xga += Number(match.home_xg) || 0

            if (hg > ag) {
                stats[home].won++; stats[home].points += 3
                stats[away].lost++
            } else if (hg < ag) {
                stats[away].won++; stats[away].points += 3
                stats[home].lost++
            } else {
                stats[home].drawn++; stats[home].points += 1
                stats[away].drawn++; stats[away].points += 1
            }
        })

        return Object.values(stats)
            .map(t => ({
                ...t,
                gd: t.gf - t.ga,
                xgDiff: (t.xgf - t.xga).toFixed(2),
                avgGoals: (t.gf / t.played).toFixed(2),
            }))
            .sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf)
    }, [matches])

    // Goals per matchday chart data
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
            .map(d => ({
                ...d,
                avgGoals: Number((d.goals / d.matches).toFixed(2)),
                avgXg: Number((d.xg / d.matches).toFixed(2)),
            }))
    }, [matches])

    // Result distribution
    const resultDistribution = useMemo(() => {
        if (!matches.length) return []
        const homeWins = matches.filter(m => m.home_goals > m.away_goals).length
        const draws = matches.filter(m => m.home_goals === m.away_goals).length
        const awayWins = matches.filter(m => m.away_goals > m.home_goals).length
        return [
            { name: 'Victoria Local', value: homeWins, color: '#22c55e' },
            { name: 'Empate', value: draws, color: '#94a3b8' },
            { name: 'Victoria Visitante', value: awayWins, color: '#3b82f6' },
        ]
    }, [matches])

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">Estadísticas</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Análisis de la temporada</p>
                </div>
                {seasons.length > 0 && (
                    <select
                        value={activeSeason || ''}
                        onChange={(e) => setSelectedSeason(e.target.value)}
                        className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                        {seasons.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                )}
            </div>

            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
            )}

            {teamStats.length > 0 && (
                <>
                    {/* Charts row */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Goals per matchday chart */}
                        <div className="rounded-xl border border-border/50 bg-card p-5">
                            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                Goles por Jornada (media)
                            </h3>
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

                        {/* Result distribution */}
                        <div className="rounded-xl border border-border/50 bg-card p-5">
                            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                Distribución de Resultados
                            </h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={resultDistribution}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        innerRadius={50}
                                        paddingAngle={2}
                                        label={({ name, value }) => `${name}: ${value}`}
                                    >
                                        {resultDistribution.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Standings table */}
                    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
                        <div className="p-5 pb-3">
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                Clasificación
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border/50 text-xs text-muted-foreground">
                                        <th className="whitespace-nowrap px-4 py-2 text-left font-medium">#</th>
                                        <th className="whitespace-nowrap px-4 py-2 text-left font-medium">Equipo</th>
                                        <th className="whitespace-nowrap px-4 py-2 text-center font-medium">PJ</th>
                                        <th className="whitespace-nowrap px-4 py-2 text-center font-medium">G</th>
                                        <th className="whitespace-nowrap px-4 py-2 text-center font-medium">E</th>
                                        <th className="whitespace-nowrap px-4 py-2 text-center font-medium">P</th>
                                        <th className="whitespace-nowrap px-4 py-2 text-center font-medium">GF</th>
                                        <th className="whitespace-nowrap px-4 py-2 text-center font-medium">GC</th>
                                        <th className="whitespace-nowrap px-4 py-2 text-center font-medium">DG</th>
                                        <th className="whitespace-nowrap px-4 py-2 text-center font-medium">xGD</th>
                                        <th className="whitespace-nowrap px-4 py-2 text-center font-medium font-bold">Pts</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {teamStats.map((team, i) => (
                                        <motion.tr
                                            key={team.name}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.02 }}
                                            className={`border-b border-border/30 transition-colors hover:bg-secondary/30 ${i < 4 ? 'border-l-2 border-l-primary' : ''
                                                }`}
                                        >
                                            <td className="whitespace-nowrap px-4 py-2.5 text-muted-foreground">{i + 1}</td>
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
                </>
            )}

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
