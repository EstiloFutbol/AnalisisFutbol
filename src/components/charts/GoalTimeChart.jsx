import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function GoalTimeChart({ matches }) {
    const data = useMemo(() => {
        if (!matches) return []

        const intervals = {}
        // Initialize 5-minute intervals
        for (let i = 0; i < 90; i += 5) {
            const start = i
            const end = i + 5
            intervals[`${start}-${end}`] = 0
        }
        intervals['90+'] = 0

        matches.forEach(match => {
            const processGoals = (minutes) => {
                if (!minutes || !Array.isArray(minutes)) return
                minutes.forEach(m => {
                    const min = parseInt(m)
                    if (isNaN(min)) return

                    if (min > 90) {
                        intervals['90+']++
                    } else {
                        // Bucket 0-5 covers 1,2,3,4,5. 
                        // Logic: ceil(min / 5) * 5? 
                        // Let's use 0-5 for [0, 5], 5-10 for (5, 10]...
                        // Simple bucket: floor((min-1)/5)*5
                        let bucketStart = Math.floor((min - 1) / 5) * 5
                        if (bucketStart < 0) bucketStart = 0
                        const bucketEnd = bucketStart + 5

                        // Cap at 90
                        if (bucketStart >= 90) {
                            intervals['90+']++
                        } else {
                            const key = `${bucketStart}-${bucketEnd}`
                            if (intervals[key] !== undefined) {
                                intervals[key]++
                            } else {
                                intervals['90+']++
                            }
                        }
                    }
                })
            }

            // Parse JSON if string
            let homeGoals = match.home_goal_minutes
            let awayGoals = match.away_goal_minutes

            if (typeof homeGoals === 'string') {
                try {
                    homeGoals = JSON.parse(homeGoals)
                } catch (e) {
                    homeGoals = homeGoals.split(',')
                }
            }
            if (homeGoals && !Array.isArray(homeGoals)) homeGoals = [homeGoals]

            if (typeof awayGoals === 'string') {
                try {
                    awayGoals = JSON.parse(awayGoals)
                } catch (e) {
                    awayGoals = awayGoals.split(',')
                }
            }
            if (awayGoals && !Array.isArray(awayGoals)) awayGoals = [awayGoals]

            processGoals(homeGoals)
            processGoals(awayGoals)
        })

        return Object.entries(intervals).map(([range, count]) => ({
            range,
            count
        }))
    }, [matches])

    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <CardTitle>Momentos de Gol</CardTitle>
                <CardDescription>Distribución de goles por tramos de 5 minutos</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.2)" />
                            <XAxis
                                dataKey="range"
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                interval={0}
                                angle={-45}
                                textAnchor="end"
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
                            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Goles" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
