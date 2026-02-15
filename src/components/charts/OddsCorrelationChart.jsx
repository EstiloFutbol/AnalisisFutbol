import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function OddsCorrelationChart({ matches }) {
    const data = useMemo(() => {
        if (!matches || matches.length === 0) return []

        // Bucket by Home Odds: <1.5, 1.5-2.0, 2.0-2.5, 2.5-3.0, >3.0
        const buckets = {
            '<1.50': { total: 0, wins: 0 },
            '1.50-2.00': { total: 0, wins: 0 },
            '2.00-2.50': { total: 0, wins: 0 },
            '2.50-3.00': { total: 0, wins: 0 },
            '>3.00': { total: 0, wins: 0 }
        }

        matches.forEach(match => {
            const odds = parseFloat(match.home_odds)
            if (!odds) return

            const isHomeWin = match.home_goals > match.away_goals

            let key = ''
            if (odds < 1.5) key = '<1.50'
            else if (odds < 2.0) key = '1.50-2.00'
            else if (odds < 2.5) key = '2.00-2.50'
            else if (odds < 3.0) key = '2.50-3.00'
            else key = '>3.00'

            buckets[key].total++
            if (isHomeWin) buckets[key].wins++
        })

        return Object.entries(buckets).map(([range, stats]) => {
            const winRate = stats.total > 0 ? (stats.wins / stats.total) * 100 : 0
            return {
                range,
                winRate: Number(winRate.toFixed(1)),
                total: stats.total // Keep for tooltip context
            }
        })
    }, [matches])

    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <CardTitle>Fiabilidad de Cuotas</CardTitle>
                <CardDescription>% Victoria Local según cuota inicial</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.2)" />
                            <XAxis
                                dataKey="range"
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                unit="%"
                            />
                            <Tooltip
                                cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    borderColor: 'hsl(var(--border))',
                                    borderRadius: '8px',
                                    color: 'hsl(var(--foreground))',
                                }}
                                formatter={(value, name, props) => {
                                    if (name === 'winRate') return [`${value}%`, '% Victoria']
                                    return [value, name]
                                }}
                                labelFormatter={(label) => `Cuota: ${label}`}
                            />
                            <Bar dataKey="winRate" fill="#10b981" radius={[4, 4, 0, 0]} name="WinRate" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
