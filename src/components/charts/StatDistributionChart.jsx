import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function StatDistributionChart({ matches, dataKey, title, description, color = "#22c55e" }) {
    const data = useMemo(() => {
        if (!matches || matches.length === 0) return []

        // Calculate frequency map
        const distribution = {}
        let min = Infinity
        let max = -Infinity

        matches.forEach(match => {
            const value = match[dataKey]
            if (value != null) {
                const numVal = Number(value)
                distribution[numVal] = (distribution[numVal] || 0) + 1
                if (numVal < min) min = numVal
                if (numVal > max) max = numVal
            }
        })

        // Fill missing values for continuous x-axis
        const chartData = []
        if (min !== Infinity) {
            for (let i = min; i <= max; i++) {
                chartData.push({
                    value: i,
                    count: distribution[i] || 0
                })
            }
        }

        return chartData
    }, [matches, dataKey])

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="pl-0">
                <div className="h-[200px] w-full">
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
                            <Bar dataKey="count" fill={color} radius={[4, 4, 0, 0]} name="Partidos" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
