import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function GoalTimeChart({ matches }) {
    const data = useMemo(() => {
        if (!matches) return []

        const intervals = {
            '0-15': 0,
            '16-30': 0,
            '31-45': 0,
            '45+': 0,
            '46-60': 0,
            '61-75': 0,
            '76-90': 0,
            '90+': 0
        }

        matches.forEach(match => {
            const processGoals = (minutes) => {
                if (!minutes || !Array.isArray(minutes)) return
                minutes.forEach(m => {
                    const min = parseInt(m)
                    if (isNaN(min)) return

                    if (min <= 15) intervals['0-15']++
                    else if (min <= 30) intervals['16-30']++
                    else if (min <= 45) intervals['31-45']++
                    else if (min > 45 && min < 46) intervals['45+']++ // Adjust logic if 45+ is marked differently, e.g. 45 but period 1
                    else if (min <= 60) intervals['46-60']++
                    else if (min <= 75) intervals['61-75']++
                    else if (min <= 90) intervals['76-90']++
                    else intervals['90+']++
                })
            }

            // Parse JSON if string
            let homeGoals = match.home_goal_minutes
            let awayGoals = match.away_goal_minutes

            if (typeof homeGoals === 'string') {
                try { homeGoals = JSON.parse(homeGoals) } catch (e) { homeGoals = [] }
            }
            if (typeof awayGoals === 'string') {
                try { awayGoals = JSON.parse(awayGoals) } catch (e) { awayGoals = [] }
            }

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
                <CardDescription>Distribución de goles por tramos de 15 minutos</CardDescription>
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
