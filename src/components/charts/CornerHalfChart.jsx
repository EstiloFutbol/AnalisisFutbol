import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function CornerHalfChart({ matches }) {
    const data = useMemo(() => {
        if (!matches) return []

        let total1H = 0
        let total2H = 0

        matches.forEach(match => {
            total1H += (match.home_corners_1h || 0) + (match.away_corners_1h || 0)
            total2H += (match.home_corners_2h || 0) + (match.away_corners_2h || 0)
        })

        const avg1H = matches.length ? (total1H / matches.length).toFixed(1) : 0
        const avg2H = matches.length ? (total2H / matches.length).toFixed(1) : 0

        return [
            { name: '1ª Parte', corners: Number(avg1H), fill: '#3b82f6' }, // Blue
            { name: '2ª Parte', corners: Number(avg2H), fill: '#f59e0b' }  // Amber
        ]
    }, [matches])

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Córners por Parte</CardTitle>
                <CardDescription>Promedio de córners en 1ª vs 2ª parte</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--muted-foreground)/0.2)" />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                width={60}
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
                            <Bar dataKey="corners" radius={[0, 4, 4, 0]} barSize={32}>
                                {/* Fill color comes from data payload */}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
