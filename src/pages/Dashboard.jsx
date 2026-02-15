import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useMatches, useSeasons } from '@/hooks/useMatches'
import { Trophy, Goal, Target, Users, TrendingUp, Activity, PieChart, BarChart3, Clock, Shield, CreditCard, AlertTriangle } from 'lucide-react'
import GoalTimeChart from '@/components/charts/GoalTimeChart'
import CornerHalfChart from '@/components/charts/CornerHalfChart'
import StatDistributionChart from '@/components/charts/StatDistributionChart'
import OddsCorrelationChart from '@/components/charts/OddsCorrelationChart'
import MatchCard from '@/components/matches/MatchCard'

function StatCard({ icon: Icon, label, value, sublabel = null, color = 'primary' }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border/50 bg-card p-5 transition-colors hover:border-primary/20"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                        {label}
                    </p>
                    <p className="mt-2 text-3xl font-black tracking-tight text-foreground">
                        {value}
                    </p>
                    {sublabel && (
                        <p className="mt-1 text-xs text-muted-foreground">{sublabel}</p>
                    )}
                </div>
                <div className={`rounded-lg bg-${color}/10 p-2.5`}>
                    <Icon className={`h-5 w-5 text-${color}`} />
                </div>
            </div>
        </motion.div>
    )
}

export default function Dashboard() {
    const { data: seasons = [] } = useSeasons()
    const [selectedSeason, setSelectedSeason] = useState(null)

    // Use the first (most recent) season if none selected
    const activeSeason = selectedSeason || seasons[0]
    const { data: matches = [], isLoading } = useMatches(activeSeason)

    const stats = useMemo(() => {
        if (!matches.length) return null

        const totalMatches = matches.length

        // Goals
        const totalGoals = matches.reduce((acc, m) => acc + (m.home_goals || 0) + (m.away_goals || 0), 0)
        const avgGoals = totalMatches ? (totalGoals / totalMatches).toFixed(2) : 0
        const bttsCount = matches.filter(m => m.home_goals > 0 && m.away_goals > 0).length
        const bttsPercent = totalMatches ? ((bttsCount / totalMatches) * 100).toFixed(0) : 0
        const over25Count = matches.filter(m => (m.home_goals + m.away_goals) > 2.5).length
        const over25Percent = totalMatches ? ((over25Count / totalMatches) * 100).toFixed(0) : 0

        // First Half Goals (approximation if we assume we might parse minutes, but for now let's just use total goals logic if we had 1H/2H split... 
        // We actually only have 'home_corners_1h' etc, but not explicitly 1H goals in the main columns unless we parse 'home_goal_minutes'.
        // Let's stick to simple reliable stats first. 
        // Wait, we can count 0-0 draws to infer "No Goals".
        const cleanSheetHome = matches.filter(m => m.away_goals === 0).length
        const cleanSheetAway = matches.filter(m => m.home_goals === 0).length

        // Results
        const homeWins = matches.filter(m => m.home_goals > m.away_goals).length
        const draws = matches.filter(m => m.home_goals === m.away_goals).length
        const awayWins = matches.filter(m => m.away_goals > m.home_goals).length

        // Discipline & Corners
        const totalCorners = matches.reduce((acc, m) => acc + (m.total_corners || 0), 0)
        const avgCorners = totalMatches ? (totalCorners / totalMatches).toFixed(2) : 0

        const totalCards = matches.reduce((acc, m) => acc + (m.home_cards || 0) + (m.away_cards || 0), 0)
        const avgCards = totalMatches ? (totalCards / totalMatches).toFixed(2) : 0

        const avgAttendance = matches.reduce((acc, m) => acc + (m.attendance || 0), 0) / matches.filter(m => m.attendance).length || 0

        return {
            totalMatches,
            totalGoals,
            avgGoals,
            homeWins,
            draws,
            awayWins,
            homeWinPercent: totalMatches ? ((homeWins / totalMatches) * 100).toFixed(0) : 0,
            drawPercent: totalMatches ? ((draws / totalMatches) * 100).toFixed(0) : 0,
            awayWinPercent: totalMatches ? ((awayWins / totalMatches) * 100).toFixed(0) : 0,
            bttsCount,
            bttsPercent,
            over25Count,
            over25Percent,
            cleanSheetHome,
            cleanSheetAway,
            avgCorners,
            avgCards,
            avgAttendance: avgAttendance > 0 ? Math.round(avgAttendance).toLocaleString('es-ES') : 'N/D',
        }
    }, [matches])

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">
                        Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Insights y tendencias para apuestas
                    </p>
                </div>

                {/* Season selector */}
                {seasons.length > 0 && (
                    <select
                        value={activeSeason || ''}
                        onChange={(e) => setSelectedSeason(e.target.value)}
                        className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                        {seasons.map((season) => (
                            <option key={season} value={season}>
                                {season}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Loading state */}
            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
            )}

            {/* Betting Stats Grid */}
            {stats && (
                <div className="space-y-6">
                    {/* Section 1: Result Markets */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Trophy className="h-4 w-4" /> Mercados de Resultado
                        </h3>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                            <StatCard icon={Trophy} label="Partidos" value={stats.totalMatches} sublabel="Jugados" />
                            <StatCard icon={TrendingUp} label="Gana Local" value={`${stats.homeWinPercent}%`} sublabel={`${stats.homeWins} partidos`} color="green-500" />
                            <StatCard icon={Activity} label="Empate" value={`${stats.drawPercent}%`} sublabel={`${stats.draws} partidos`} color="orange-500" />
                            <StatCard icon={TrendingUp} label="Gana Visitante" value={`${stats.awayWinPercent}%`} sublabel={`${stats.awayWins} partidos`} color="blue-500" />
                        </div>
                    </div>

                    {/* Section 2: Goals Markets */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Goal className="h-4 w-4" /> Mercados de Goles
                        </h3>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                            <StatCard icon={Goal} label="Promedio Goles" value={stats.avgGoals} sublabel="por partido" />
                            <StatCard icon={Target} label="Más de 2.5" value={`${stats.over25Percent}%`} sublabel={`${stats.over25Count} partidos`} color="emerald-500" />
                            <StatCard icon={PieChart} label="Ambos Marcan" value={`${stats.bttsPercent}%`} sublabel={`${stats.bttsCount} partidos`} color="violet-500" />
                            <StatCard icon={Shield} label="Portería a 0 (L)" value={stats.cleanSheetHome} sublabel="Local Imbatido" color="indigo-500" />
                        </div>
                    </div>

                    {/* Section 3: Props & Stats */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" /> Córners y Tarjetas
                        </h3>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                            <StatCard icon={CreditCard} label="Promedio Córners" value={stats.avgCorners} sublabel="Total por partido" color="indigo-500" />
                            <StatCard icon={AlertTriangle} label="Promedio Tarjetas" value={stats.avgCards} sublabel="Total por partido" color="yellow-500" />
                        </div>
                    </div>
                </div>
            )}

            {/* Charts Section */}
            {matches.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-4">

                    {/* Full width: Goals Timeline */}
                    <div className="md:col-span-2 lg:col-span-2">
                        <GoalTimeChart matches={matches} />
                    </div>

                    {/* Side: Corner Halves */}
                    <CornerHalfChart matches={matches} />

                    {/* Row: Distributions */}
                    <div className="md:col-span-2 lg:col-span-3">
                        <h2 className="mb-4 mt-2 text-xl font-bold text-foreground flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            Distribución de Estadísticas
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <StatDistributionChart
                                matches={matches}
                                homeKey="total_corners"
                                title="Córners Totales"
                                description="Frecuencia de córners por partido"
                                color="#3b82f6"
                            />
                            <StatDistributionChart
                                matches={matches}
                                homeKey="home_fouls"
                                awayKey="away_fouls"
                                title="Faltas"
                                description="Distribución de faltas (Local vs Visitante)"
                            />
                            <StatDistributionChart
                                matches={matches}
                                homeKey="home_cards"
                                awayKey="away_cards"
                                title="Tarjetas Amarillas"
                                description="Distribución de tarjetas (Local vs Visitante)"
                            />
                        </div>
                    </div>

                    {/* New Row: Odds Analysis */}
                    <div className="md:col-span-2 lg:col-span-3">
                        <OddsCorrelationChart matches={matches} />
                    </div>
                </div>
            )}

            {/* Empty state */}
            {!isLoading && matches.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/50 py-20 text-center">
                    <Trophy className="h-12 w-12 text-muted-foreground/30" />
                    <h3 className="mt-4 text-lg font-semibold text-muted-foreground">
                        Sin datos todavía
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground/60">
                        Añade partidos en Supabase para verlos aquí
                    </p>
                </div>
            )}
        </div>
    )
}
