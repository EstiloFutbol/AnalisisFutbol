import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Renamed internally but keeping the export name so the import in Dashboard doesn't break
export default function CornerHalfChart({ matches }) {
    const data = useMemo(() => {
        if (!matches || matches.length === 0) return []

        const distribution = {}
        let max = 0

        matches.forEach(match => {
            const total = match.total_corners ?? ((match.home_corners || 0) + (match.away_corners || 0))
            if (total == null) return
            distribution[total] = (distribution[total] || 0) + 1
            if (total > max) max = total
        })

        const chartData = []
        for (let i = 0; i <= max; i++) {
            chartData.push({ corners: i, partidos: distribution[i] || 0 })
        }
        return chartData
    }, [matches])

    if (!data.length) return null

    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <CardTitle>Distribución de Córners Totales</CardTitle>
                <CardDescription>Número de partidos según los córners totales del encuentro</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 16, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.2)" />
                            <XAxis
                                dataKey="corners"
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                label={{ value: 'Nº Córners totales', position: 'insideBottom', offset: -8, fontSize: 11 }}
                            />
                            <YAxis
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                allowDecimals={false}
                            />
                            <Tooltip
                                cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    borderColor: 'hsl(var(--border))',
                                    borderRadius: '8px',
                                    color: 'hsl(var(--foreground))',
                                }}
                                formatter={(value) => [value, 'Partidos']}
                                labelFormatter={(label) => `${label} córners`}
                            />
                            <Bar dataKey="partidos" name="Partidos" radius={[4, 4, 0, 0]}>
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.corners > 10.5 ? '#22c55e' : entry.corners > 8.5 ? '#3b82f6' : '#6366f1'}
                                        fillOpacity={entry.partidos === 0 ? 0.2 : 0.85}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-2 flex gap-4 text-xs text-muted-foreground justify-center">
                    <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 rounded-sm bg-indigo-500" /> Menos de 8.5</span>
                    <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 rounded-sm bg-blue-500" /> 8.5–10.5</span>
                    <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 rounded-sm bg-green-500" /> Más de 10.5</span>
                </div>
            </CardContent>
        </Card>
    )
}
