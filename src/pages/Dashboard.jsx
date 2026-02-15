import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useMatches, useSeasons } from '@/hooks/useMatches'
import { Trophy, Goal, Target, Users, TrendingUp, Activity, PieChart, BarChart3, Clock } from 'lucide-react'
import GoalTimeChart from '@/components/charts/GoalTimeChart'
import CornerHalfChart from '@/components/charts/CornerHalfChart'
import StatDistributionChart from '@/components/charts/StatDistributionChart'

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
        const totalGoals = matches.reduce((acc, m) => acc + (m.home_goals || 0) + (m.away_goals || 0), 0)
        const avgGoals = totalGoals / totalMatches
        const homeWins = matches.filter(m => m.home_goals > m.away_goals).length
        const draws = matches.filter(m => m.home_goals === m.away_goals).length
        const awayWins = matches.filter(m => m.away_goals > m.home_goals).length
        const bttsCount = matches.filter(m => m.home_goals > 0 && m.away_goals > 0).length
        const avgAttendance = matches.reduce((acc, m) => acc + (m.attendance || 0), 0) / matches.filter(m => m.attendance).length || 0

        return {
            totalMatches,
            totalGoals,
            avgGoals: avgGoals.toFixed(2),
            homeWins,
            draws,
            awayWins,
            bttsCount,
            bttsPercent: ((bttsCount / totalMatches) * 100).toFixed(0),
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
                        Análisis avanzado de la temporada
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

            {/* Stats grid */}
            {stats && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    <StatCard icon={Trophy} label="Partidos" value={stats.totalMatches} />
                    <StatCard icon={Goal} label="Goles" value={stats.totalGoals} sublabel={`${stats.avgGoals} por partido`} />
                    <StatCard icon={TrendingUp} label="Victoria Local" value={stats.homeWins} sublabel={`${((stats.homeWins / stats.totalMatches) * 100).toFixed(0)}%`} />
                    <StatCard icon={Activity} label="Empates" value={stats.draws} sublabel={`${((stats.draws / stats.totalMatches) * 100).toFixed(0)}%`} />
                    <StatCard icon={Target} label="BTTS" value={`${stats.bttsPercent}%`} sublabel={`${stats.bttsCount} partidos`} />
                    <StatCard icon={Users} label="Asistencia" value={stats.avgAttendance} sublabel="media" />
                </div>
            )}

            {/* Charts Section */}
            {matches.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

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
                                dataKey="total_corners"
                                title="Córners Totales"
                                description="Frecuencia de córners por partido"
                                color="#3b82f6"
                            />
                            <StatDistributionChart
                                matches={matches}
                                dataKey="home_fouls"
                                title="Faltas (Local)"
                                description="Faltas habituales equipo local"
                                color="#f97316"
                            />
                            <StatDistributionChart
                                matches={matches}
                                dataKey="home_cards"
                                title="Tarjetas Amarillas (Local)"
                                description="Tarjetas mostradas al local"
                                color="#eab308"
                            />
                        </div>
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
