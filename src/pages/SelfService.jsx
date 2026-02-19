import { useState, useMemo } from 'react'
import { useMatches, useLeagues, useTeams } from '@/hooks/useMatches'
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    ScatterChart, Scatter, AreaChart, Area, ComposedChart
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Filter, Settings2, BarChart3, LineChart as LineIcon, PieChart, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

// Configuration constants
const CHART_TYPES = [
    { id: 'bar', label: 'Barras', icon: BarChart3 },
    { id: 'line', label: 'Líneas', icon: LineIcon },
    { id: 'area', label: 'Área', icon: Activity },
    { id: 'scatter', label: 'Dispersión', icon: PieChart }, // Using PieChart icon as close enough for scatter
]

const X_AXIS_OPTIONS = [
    { id: 'match_date', label: 'Fecha' },
    { id: 'matchday', label: 'Jornada' },
    { id: 'home_team.name', label: 'Equipo Local' },
    { id: 'away_team.name', label: 'Equipo Visitante' },
    { id: 'referee', label: 'Árbitro' },
    { id: 'stadium', label: 'Estadio' },
    { id: 'home_coach', label: 'Entrenador Local' },
    { id: 'away_coach', label: 'Entrenador Visitante' },
    { id: 'day_of_week', label: 'Día de la Semana' },
    { id: 'minute_interval', label: 'Minuto de Juego (Intervalo 5m)' },
]

const Y_AXIS_OPTIONS = [
    { id: 'total_goals', label: 'Goles Totales', derive: (m) => (m.home_goals || 0) + (m.away_goals || 0) },
    { id: 'home_goals', label: 'Goles Local' },
    { id: 'away_goals', label: 'Goles Visitante' },
    { id: 'total_xg', label: 'xG Total', derive: (m) => (m.home_xg || 0) + (m.away_xg || 0) },
    { id: 'home_xg', label: 'xG Local' },
    { id: 'away_xg', label: 'xG Visitante' },
    { id: 'total_corners', label: 'Córners Totales' },
    { id: 'home_corners_total', label: 'Córners Local', derive: (m) => (m.home_corners_1h || 0) + (m.home_corners_2h || 0) },
    { id: 'away_corners_total', label: 'Córners Visitante', derive: (m) => (m.away_corners_1h || 0) + (m.away_corners_2h || 0) },
    { id: 'total_cards', label: 'Tarjetas Totales', derive: (m) => (m.home_cards || 0) + (m.away_cards || 0) },
    { id: 'home_cards', label: 'Tarjetas Local' },
    { id: 'away_cards', label: 'Tarjetas Visitante' },
    { id: 'home_possession', label: 'Posesión Local (%)' },
    { id: 'away_possession', label: 'Posesión Visitante (%)' },
    { id: 'attendance', label: 'Asistencia' },
]

export default function SelfService() {
    // Queries
    const { data: matches = [], isLoading: loadingMatches } = useMatches()
    const { data: leagues = [] } = useLeagues()
    const { data: teams = [] } = useTeams()

    // State
    const [chartType, setChartType] = useState('bar')
    const [xAxis, setXAxis] = useState('match_date')
    const [yAxes, setYAxes] = useState(['total_goals']) // Array of selected Y keys
    const [aggregation, setAggregation] = useState('sum') // 'sum', 'avg', 'none'

    // Filters State
    const [selectedLeague, setSelectedLeague] = useState('')
    const [selectedTeam, setSelectedTeam] = useState('')
    const [selectedReferee, setSelectedReferee] = useState('')
    const [selectedCoach, setSelectedCoach] = useState('')

    // Unique arrays for filters
    const { referees, coaches } = useMemo(() => {
        const refs = new Set()
        const coachSet = new Set()
        matches.forEach(m => {
            if (m.referee) refs.add(m.referee)
            if (m.home_coach) coachSet.add(m.home_coach)
            if (m.away_coach) coachSet.add(m.away_coach)
        })
        return {
            referees: [...refs].sort(),
            coaches: [...coachSet].sort()
        }
    }, [matches])

    // Data Processing
    const processedData = useMemo(() => {
        if (!matches.length) return []

        // 1. Filter
        let filtered = matches.filter(m => {
            if (selectedLeague) {
                const league = leagues.find(l => String(l.id) === selectedLeague)
                if (league && m.season !== league.season) return false
            }
            if (selectedReferee && m.referee !== selectedReferee) return false
            if (selectedCoach && m.home_coach !== selectedCoach && m.away_coach !== selectedCoach) return false
            if (selectedTeam) {
                const homeId = m.home_team_id
                const awayId = m.away_team_id
                const teamId = parseInt(selectedTeam)
                if (homeId !== teamId && awayId !== teamId) return false
            }
            return true
        })

        // 2. Map / Derive Values
        // Special Case: Minute Interval (Goals Aggregation)
        if (xAxis === 'minute_interval') {
            // Initialize buckets
            const buckets = {}
            // 0-5, 6-10 ... 86-90, 90+
            for (let i = 0; i < 90; i += 5) {
                const label = `${i}-${i + 5}`
                buckets[label] = {
                    [xAxis]: label,
                    count: 0,
                    total_goals: 0,
                    home_goals: 0,
                    away_goals: 0,
                    // Other metrics 0
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

            // Iterate Matches
            filtered.forEach(m => {
                // Process Home Goals
                if (Array.isArray(m.home_goal_minutes)) {
                    m.home_goal_minutes.forEach(minStr => {
                        const min = parseInt(minStr)
                        if (!isNaN(min)) {
                            let bucketKey = '90+'
                            if (min < 90) {
                                const start = Math.floor(min / 5) * 5
                                // Handle 0-5 bucket logic if match minute is 5, usually 5 is inclusive in 0-5 or 5-10? 
                                // Let's stick to 0-4, 5-9 style OR 1-5 style.
                                // But my buckets are 0-5.
                                // Simple logic: key = floor(min/5)*5.
                                bucketKey = `${start}-${start + 5}`
                            }
                            if (buckets[bucketKey]) {
                                buckets[bucketKey].total_goals++
                                buckets[bucketKey].home_goals++
                                buckets[bucketKey].count++ // Count of events
                            }
                        }
                    })
                }
                // Process Away Goals
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

        // Standard Logic (Match Level)
        let mapped = filtered.map(m => {
            const item = { ...m }

            // Resolve X Axis Value
            if (xAxis.includes('.')) {
                const parts = xAxis.split('.')
                item[xAxis] = item[parts[0]]?.[parts[1]] || 'N/A'
            } else {
                item[xAxis] = m[xAxis]
            }

            // Resolve Y Axis Values (Derivations)
            Y_AXIS_OPTIONS.forEach(opt => {
                if (opt.derive) {
                    item[opt.id] = Number(opt.derive(m).toFixed(2))
                } else {
                    item[opt.id] = Number(m[opt.id] || 0)
                }
            })

            return item
        })

        // 3. Aggregate (if needed)
        // If aggregation is 'none', we just sort and return (good for scatter/line over time)
        if (aggregation === 'none') {
            return mapped.sort((a, b) => new Date(a.match_date) - new Date(b.match_date))
        }

        // Group by X
        const grouped = {}
        mapped.forEach(item => {
            const key = item[xAxis]
            if (!grouped[key]) {
                grouped[key] = {
                    [xAxis]: key,
                    count: 0,
                    ...Object.fromEntries(Y_AXIS_OPTIONS.map(opt => [opt.id, 0])) // Init all Ys to 0
                }
            }
            grouped[key].count += 1

            Y_AXIS_OPTIONS.forEach(opt => {
                grouped[key][opt.id] += item[opt.id] || 0
            })
        })

        // Finalize Aggregation (Avg if needed)
        return Object.values(grouped).map(item => {
            if (aggregation === 'avg') {
                Y_AXIS_OPTIONS.forEach(opt => {
                    item[opt.id] = Number((item[opt.id] / item.count).toFixed(2))
                })
            } else {
                // Round sums to 2 decimals usually not needed for count but good for xG
                Y_AXIS_OPTIONS.forEach(opt => {
                    item[opt.id] = Number(item[opt.id].toFixed(2))
                })
            }
            return item
        }).sort((a, b) => {
            // Smart sort: if X is number, sort numeric, else alphabetic
            if (!isNaN(a[xAxis]) && !isNaN(b[xAxis])) return Number(a[xAxis]) - Number(b[xAxis])
            return String(a[xAxis]).localeCompare(String(b[xAxis]))
        })

    }, [matches, xAxis, selectedLeague, selectedTeam, selectedReferee, aggregation])

    // Toggle Y Axis Selection
    const toggleYAxis = (id) => {
        setYAxes(prev =>
            prev.includes(id)
                ? prev.filter(y => y !== id)
                : [...prev, id]
        )
    }

    // Chart Colors
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">Self-Service Data</h1>
                <p className="text-muted-foreground">Explora, filtra y crea tus propios gráficos personalizados.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-4">

                {/* Controls Panel (Left) */}
                <Card className="lg:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Settings2 className="h-5 w-5" />
                            Configuración
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        {/* 1. Chart Type */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Tipo de Gráfico</label>
                            <div className="grid grid-cols-4 gap-2">
                                {CHART_TYPES.map(type => (
                                    <button
                                        key={type.id}
                                        onClick={() => setChartType(type.id)}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-2 rounded-md border transition-colors",
                                            chartType === type.id
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-secondary/50 border-input hover:bg-secondary hover:text-foreground"
                                        )}
                                        title={type.label}
                                    >
                                        <type.icon className="h-5 w-5" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. Dimensions & Metrics */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Eje X (Dimensión)</label>
                            <select
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                value={xAxis}
                                onChange={(e) => setXAxis(e.target.value)}
                            >
                                {X_AXIS_OPTIONS.map(opt => (
                                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 flex justify-between">
                                Eje Y (Métricas)
                                <span className="text-xs text-muted-foreground">{yAxes.length} selec.</span>
                            </label>
                            <div className="h-40 overflow-y-auto rounded-md border border-input bg-background/50 p-2 space-y-1 custom-scrollbar">
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

                        {/* 3. Aggregation */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Agregación</label>
                            <div className="flex rounded-md shadow-sm">
                                {['sum', 'avg', 'none'].map((mode, i) => (
                                    <button
                                        key={mode}
                                        onClick={() => setAggregation(mode)}
                                        className={cn(
                                            "flex-1 px-3 py-1.5 text-xs font-medium border first:rounded-l-md last:rounded-r-md focus:z-10",
                                            aggregation === mode
                                                ? "bg-primary text-primary-foreground border-primary z-10"
                                                : "bg-background border-input hover:bg-secondary text-muted-foreground"
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

                        <div className="h-px bg-border/50 my-4" />

                        {/* 4. Filters */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
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

                {/* Visualization Area (Right) */}
                <Card className="lg:col-span-3 min-h-[500px] flex flex-col">
                    <CardHeader>
                        <CardTitle>Visualización</CardTitle>
                        <CardDescription>
                            Mostrando {processedData.length} registros • Agrupado por: {X_AXIS_OPTIONS.find(x => x.id === xAxis)?.label}
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
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                            itemStyle={{ color: '#f8fafc' }}
                                        />
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
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                        />
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
