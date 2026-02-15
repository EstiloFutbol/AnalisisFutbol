import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function CornerHalfChart({ matches }) {
    const data = useMemo(() => {
        if (!matches || matches.length === 0) return []

        const distribution = {}
        let min = 0
        let max = 0

        matches.forEach(match => {
            // Count distribution for 1st Half
            const c1 = (match.home_corners_1h || 0) + (match.away_corners_1h || 0)
            if (!distribution[c1]) distribution[c1] = { corners: c1, half1: 0, half2: 0 }
            distribution[c1].half1++
            if (c1 > max) max = c1

            // Count distribution for 2nd Half
            const c2 = (match.home_corners_2h || 0) + (match.away_corners_2h || 0)
            if (!distribution[c2]) distribution[c2] = { corners: c2, half1: 0, half2: 0 }
            distribution[c2].half2++
            if (c2 > max) max = c2
        })

        // Fill gaps
        const chartData = []
        for (let i = 0; i <= max; i++) {
            chartData.push(distribution[i] || { corners: i, half1: 0, half2: 0 })
        }

        return chartData
    }, [matches])

    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <CardTitle>Distribución de Córners (Por Parte)</CardTitle>
                <CardDescription>Frecuencia de número de córners en 1ª vs 2ª parte</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.2)" />
                            <XAxis
                                dataKey="corners"
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                label={{ value: 'Nº Córners', position: 'insideBottom', offset: -5 }}
                            />
                            <YAxis
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    borderColor: 'hsl(var(--border))',
                                    borderRadius: '8px',
                                    color: 'hsl(var(--foreground))',
                                }}
                            />
                            <Legend />
                            <Bar dataKey="half1" name="1ª Parte" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                            <Bar dataKey="half2" name="2ª Parte" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
