import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function StatDistributionChart({ matches, homeKey, awayKey = null, title, description, maxVal = null, color = "#3b82f6" }) {
    const data = useMemo(() => {
        if (!matches || matches.length === 0) return []

        const distribution = {}
        let localMax = 0

        matches.forEach(match => {
            const hVal = Number(match[homeKey] || 0)

            // If awayKey is present, track separately. If not, just track homeKey as "value" (or total)
            if (awayKey) {
                const aVal = Number(match[awayKey] || 0)

                if (!distribution[hVal]) distribution[hVal] = { value: hVal, home: 0, away: 0, count: 0 }
                distribution[hVal].home++

                if (!distribution[aVal]) distribution[aVal] = { value: aVal, home: 0, away: 0, count: 0 }
                distribution[aVal].away++

                if (hVal > localMax) localMax = hVal
                if (aVal > localMax) localMax = aVal
            } else {
                // Single series mode
                if (!distribution[hVal]) distribution[hVal] = { value: hVal, count: 0 }
                distribution[hVal].count++
                if (hVal > localMax) localMax = hVal
            }
        })

        const limit = maxVal !== null ? maxVal : localMax
        const chartData = []
        for (let i = 0; i <= limit; i++) {
            if (awayKey) {
                chartData.push(distribution[i] || { value: i, home: 0, away: 0 })
            } else {
                chartData.push(distribution[i] || { value: i, count: 0 })
            }
        }

        return chartData
    }, [matches, homeKey, awayKey, maxVal])

    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.2)" />
                            <XAxis
                                dataKey="value"
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
                            {awayKey && <Legend />}

                            {awayKey ? (
                                <>
                                    <Bar dataKey="home" name="Local" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="away" name="Visitante" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                </>
                            ) : (
                                <Bar dataKey="count" name="Partidos" fill={color} radius={[4, 4, 0, 0]} />
                            )}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
