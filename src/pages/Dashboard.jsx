import { useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useMatches, useLeagues } from '@/hooks/useMatches'
import {
    Trophy, Goal, Target, Users, TrendingUp, Activity,
    PieChart, BarChart3, Clock, Shield, CreditCard,
    AlertTriangle, Zap, CheckCircle2, Info
} from 'lucide-react'
import GoalTimeChart from '@/components/charts/GoalTimeChart'
import CornerHalfChart from '@/components/charts/CornerHalfChart'
import StatDistributionChart from '@/components/charts/StatDistributionChart'
import OddsCorrelationChart from '@/components/charts/OddsCorrelationChart'

function StatCard({ icon: Icon, label, value, sublabel = null, color = 'primary' }) {
    const colorClasses = {
        'green-500': 'text-green-500 bg-green-500/10 border-green-500/20',
        'emerald-500': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        'orange-500': 'text-orange-500 bg-orange-500/10 border-orange-500/20',
        'blue-500': 'text-blue-500 bg-blue-500/10 border-blue-500/20',
        'violet-500': 'text-violet-500 bg-violet-500/10 border-violet-500/20',
        'indigo-500': 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
        'yellow-500': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
        'primary': 'text-primary bg-primary/10 border-primary/20',
    }[color] || 'text-primary bg-primary/10 border-primary/20'

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
        >
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                        {label}
                    </p>
                    <div className="flex items-baseline gap-1">
                        <p className="text-2xl font-black tracking-tight text-foreground">
                            {value}
                        </p>
                    </div>
                    {sublabel && (
                        <p className="text-[10px] font-medium text-muted-foreground">{sublabel}</p>
                    )}
                </div>
                <div className={`rounded-xl p-2 md:p-2.5 ${colorClasses} border`}>
                    <Icon className="h-4 w-4 md:h-5 md:w-5" />
                </div>
            </div>
            <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-primary/5 blur-2xl transition-opacity opacity-0 group-hover:opacity-100" />
        </motion.div>
    )
}

function InsightItem({ icon: Icon, title, description, badgeValue, color = 'primary' }) {
    const badgeColors = {
        'green': 'bg-green-500/10 text-green-500 border-green-500/20',
        'blue': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        'orange': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
        'primary': 'bg-primary/10 text-primary border-primary/20',
    }[color] || 'bg-primary/10 text-primary border-primary/20'

    return (
        <div className="flex gap-4 rounded-xl border border-border/40 bg-card/30 p-4 transition-colors hover:bg-card/50">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${badgeColors} border`}>
                <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-foreground">{title}</h4>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${badgeColors} border`}>
                        {badgeValue}
                    </span>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                    {description}
                </p>
            </div>
        </div>
    )
}

export default function Dashboard() {
    const [searchParams, setSearchParams] = useSearchParams()
    const { data: leagues = [] } = useLeagues()

    const selectedLeagueId = searchParams.get('league')
    const defaultLeague = leagues.find(l => l.is_default) || leagues[0]
    const activeLeagueId = selectedLeagueId || (defaultLeague ? String(defaultLeague.id) : null)
    const activeLeague = leagues.find(l => String(l.id) === activeLeagueId)

    useEffect(() => {
        if (!selectedLeagueId && defaultLeague) {
            setSearchParams({ league: String(defaultLeague.id) }, { replace: true })
        }
    }, [selectedLeagueId, defaultLeague, setSearchParams])

    const { data: matches = [], isLoading } = useMatches(activeLeagueId)

    const bettingInsights = useMemo(() => {
        if (!matches.length) return []

        const total = matches.length
        const stats = {
            over25: (matches.filter(m => ((m.home_goals || 0) + (m.away_goals || 0)) > 2.5).length / total * 100).toFixed(0),
            btts: (matches.filter(m => (m.home_goals || 0) > 0 && (m.away_goals || 0) > 0).length / total * 100).toFixed(0),
            homeWin: (matches.filter(m => (m.home_goals || 0) > (m.away_goals || 0)).length / total * 100).toFixed(0),
            avgCorners: (matches.reduce((acc, m) => acc + (m.total_corners || 0), 0) / total).toFixed(1),
        }

        const insights = []
        if (Number(stats.over25) > 55) {
            insights.push({
                icon: Goal,
                title: "Festival de Goles",
                description: `El ${stats.over25}% de los partidos superan los 2.5 goles. Ideal para mercados 'Over'.`,
                badgeValue: "Alta Probabilidad",
                color: "green"
            })
        }
        if (Number(stats.btts) > 50) {
            insights.push({
                icon: Target,
                title: "Ambos Equipos Anotan",
                description: `Tendencia fuerte de BTTS (${stats.btts}%). Los ataques superan a las defensas esta temporada.`,
                badgeValue: "Tendencia",
                color: "blue"
            })
        }
        if (Number(stats.homeWin) > 45) {
            insights.push({
                icon: Shield,
                title: "Fortaleza Local",
                description: `Los equipos locales ganan el ${stats.homeWin}% de las veces. Factor campo determinante.`,
                badgeValue: "Localía",
                color: "primary"
            })
        }
        if (Number(stats.avgCorners) > 9.5) {
            insights.push({
                icon: Zap,
                title: "Mercado de Córners",
                description: `Promedio elevado de ${stats.avgCorners} córners por partido. Juego abierto por bandas.`,
                badgeValue: "Corners",
                color: "orange"
            })
        }

        return insights
    }, [matches])

    const stats = useMemo(() => {
        if (!matches.length) return null

        const totalMatches = matches.length
        const totalGoals = matches.reduce((acc, m) => acc + (m.home_goals || 0) + (m.away_goals || 0), 0)
        const avgGoals = totalMatches ? (totalGoals / totalMatches).toFixed(2) : 0
        const bttsCount = matches.filter(m => (m.home_goals || 0) > 0 && (m.away_goals || 0) > 0).length
        const bttsPercent = totalMatches ? ((bttsCount / totalMatches) * 100).toFixed(0) : 0
        const over25Count = matches.filter(m => ((m.home_goals || 0) + (m.away_goals || 0)) > 2.5).length
        const over25Percent = totalMatches ? ((over25Count / totalMatches) * 100).toFixed(0) : 0

        const cleanSheetHome = matches.filter(m => (m.away_goals || 0) === 0).length
        const homeWins = matches.filter(m => (m.home_goals || 0) > (m.away_goals || 0)).length
        const draws = matches.filter(m => (m.home_goals || 0) === (m.away_goals || 0)).length
        const awayWins = matches.filter(m => (m.away_goals || 0) > (m.home_goals || 0)).length

        const totalCorners = matches.reduce((acc, m) => acc + (m.total_corners || 0), 0)
        const avgCorners = totalMatches ? (totalCorners / totalMatches).toFixed(2) : 0
        const totalCards = matches.reduce((acc, m) => acc + (m.home_cards || 0) + (m.away_cards || 0), 0)
        const avgCards = totalMatches ? (totalCards / totalMatches).toFixed(2) : 0

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
            bttsPercent,
            over25Percent,
            cleanSheetHome,
            avgCorners,
            avgCards,
        }
    }, [matches])

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between px-1">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
                        Dashboard
                    </h1>
                    <p className="text-sm font-medium text-muted-foreground/80 flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" />
                        Smart Analytics para Apuestas Deportivas
                    </p>
                </div>

                {leagues.length > 0 && (
                    <div className="relative inline-block">
                        <select
                            value={activeLeagueId || ''}
                            onChange={(e) => setSearchParams({ league: e.target.value })}
                            className="appearance-none rounded-xl border border-border bg-card/50 px-6 py-3 pr-10 text-sm font-bold text-foreground transition-all hover:bg-card hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 backdrop-blur-xl"
                        >
                            {leagues.map((league) => (
                                <option key={league.id} value={league.id}>{league.name} {league.season}</option>
                            ))}
                        </select>
                        <Clock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                )}
            </div>

            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent shadow-lg shadow-primary/20" />
                </div>
            )}

            {stats && (
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 px-1">
                                <Trophy className="h-3 w-3" /> Resultados 1X2
                            </h3>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
                                <StatCard icon={Trophy} label="Partidos" value={stats.totalMatches} sublabel="Jugados" />
                                <StatCard icon={TrendingUp} label="Gana Local" value={`${stats.homeWinPercent}%`} sublabel={`${stats.homeWins}V`} color="green-500" />
                                <StatCard icon={Activity} label="Empate" value={`${stats.drawPercent}%`} sublabel={`${stats.draws}X`} color="orange-500" />
                                <StatCard icon={TrendingUp} label="Gana Visitante" value={`${stats.awayWinPercent}%`} sublabel={`${stats.awayWins}V`} color="blue-500" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 px-1">
                                <Goal className="h-3 w-3" /> Mercado de Goles
                            </h3>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
                                <StatCard icon={Goal} label="Goles Avg" value={stats.avgGoals} sublabel="por partido" />
                                <StatCard icon={Target} label="Over 2.5" value={`${stats.over25Percent}%`} sublabel="Probabilidad" color="emerald-500" />
                                <StatCard icon={PieChart} label="BTTS Yes" value={`${stats.bttsPercent}%`} sublabel="Ambos marcan" color="violet-500" />
                                <StatCard icon={Shield} label="Clean Sheet L" value={stats.cleanSheetHome} sublabel="Partidos" color="indigo-500" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 px-1">
                                <Zap className="h-3 w-3" /> Córners y Tarjetas
                            </h3>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
                                <StatCard icon={CreditCard} label="Córners Avg" value={stats.avgCorners} sublabel="Totales" color="indigo-500" />
                                <StatCard icon={AlertTriangle} label="Tarjetas Avg" value={stats.avgCards} sublabel="Totales" color="yellow-500" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <Zap className="h-4 w-4 text-primary animate-pulse" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
                                Betting Insights
                            </h3>
                        </div>
                        <div className="flex flex-col gap-3">
                            {bettingInsights.length > 0 ? (
                                bettingInsights.map((insight, i) => (
                                    <InsightItem key={i} {...insight} />
                                ))
                            ) : (
                                <div className="rounded-xl border border-dashed border-border/50 p-6 text-center">
                                    <Info className="mx-auto h-6 w-6 text-muted-foreground/30 mb-2" />
                                    <p className="text-xs text-muted-foreground">Analizando tendencias...</p>
                                </div>
                            )}
                            <div className="mt-2 rounded-xl bg-primary/5 p-4 border border-primary/10">
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Tip Pro</p>
                                <p className="text-[11px] leading-relaxed text-muted-foreground italic">
                                    "Fíjate en la distribución de goles por tiempo. Si hay muchos goles al final (+80'), los mercados de 'Next Goal' son lucrativos."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {matches.length > 0 && (
                <div className="space-y-8 pt-8">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <div className="md:col-span-2">
                            <GoalTimeChart matches={matches} />
                        </div>
                        <div className="md:col-span-1">
                            <CornerHalfChart matches={matches} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-3 px-1">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            <h2 className="text-xl font-black tracking-tight text-foreground">
                                Distribuciones Avanzadas
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                                description="Distribución de faltas"
                            />
                            <StatDistributionChart
                                matches={matches}
                                homeKey="home_cards"
                                awayKey="away_cards"
                                title="Tarjetas Amarillas"
                                description="Distribución de amonestaciones"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <OddsCorrelationChart matches={matches} />
                    </div>
                </div>
            )}

            {!isLoading && matches.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/50 py-32 text-center backdrop-blur-sm">
                    <div className="mb-4 rounded-full bg-muted/20 p-6">
                        <Trophy className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                        Sin datos todavía
                    </h3>
                    <p className="mt-2 max-w-[280px] text-sm text-muted-foreground/60">
                        Añade partidos en Supabase para verlos aquí.
                    </p>
                </div>
            )}
        </div>
    )
}
