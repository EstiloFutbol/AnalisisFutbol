import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function GoalTimeChart({ matches, isWC = false }) {
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
                        let bucketStart = Math.floor((min - 1) / 5) * 5
                        if (bucketStart < 0) bucketStart = 0
                        const bucketEnd = bucketStart + 5

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

            let homeGoals = match.home_goal_minutes
            let awayGoals = match.away_goal_minutes

            if (typeof homeGoals === 'string') {
                try { homeGoals = JSON.parse(homeGoals) } catch (e) { homeGoals = homeGoals.split(',') }
            }
            if (homeGoals && !Array.isArray(homeGoals)) homeGoals = [homeGoals]

            if (typeof awayGoals === 'string') {
                try { awayGoals = JSON.parse(awayGoals) } catch (e) { awayGoals = awayGoals.split(',') }
            }
            if (awayGoals && !Array.isArray(awayGoals)) awayGoals = [awayGoals]

            processGoals(homeGoals)
            processGoals(awayGoals)
        })

        return Object.entries(intervals).map(([range, count]) => ({ range, count }))
    }, [matches])

    // Minute 23 → bucket "20-25", minute 45 → "40-45" (last 1H bar), minute 67 → "65-70"
    const htBucket = '40-45'
    const hyd1Bucket = '20-25'
    const hyd2Bucket = '65-70'

    const refLineStyle = { stroke: 'hsl(var(--muted-foreground))', strokeOpacity: 0.7, strokeDasharray: '4 3' }
    const hydLineStyle = { stroke: 'hsl(var(--primary))', strokeOpacity: 0.6, strokeDasharray: '2 3' }

    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <CardTitle>Momentos de Gol</CardTitle>
                <CardDescription>
                    Distribución de goles por tramos de 5 minutos
                    {isWC && (
                        <span className="ml-2 inline-flex items-center gap-2 text-[10px]">
                            <span className="inline-flex items-center gap-1">
                                <span className="inline-block h-3 w-4 border-t-2 border-dashed border-muted-foreground/70" />
                                <span className="text-muted-foreground">½ T (45')</span>
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <span className="inline-block h-3 w-4 border-t-2 border-dashed border-primary/60" />
                                <span className="text-muted-foreground">Pausa hid. (23' / 67')</span>
                            </span>
                        </span>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 20 }}>
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

                            {isWC && (
                                <>
                                    {/* Halftime */}
                                    <ReferenceLine
                                        x={htBucket}
                                        {...refLineStyle}
                                        label={{
                                            value: '½ T',
                                            position: 'insideTopRight',
                                            fill: 'hsl(var(--muted-foreground))',
                                            fontSize: 9,
                                            fontWeight: 'bold',
                                            offset: 4,
                                        }}
                                    />
                                    {/* Hydration break ~23' */}
                                    <ReferenceLine
                                        x={hyd1Bucket}
                                        {...hydLineStyle}
                                        label={{
                                            value: "23'",
                                            position: 'insideTopRight',
                                            fill: 'hsl(var(--primary))',
                                            fontSize: 8,
                                            offset: 2,
                                        }}
                                    />
                                    {/* Hydration break ~67' */}
                                    <ReferenceLine
                                        x={hyd2Bucket}
                                        {...hydLineStyle}
                                        label={{
                                            value: "67'",
                                            position: 'insideTopRight',
                                            fill: 'hsl(var(--primary))',
                                            fontSize: 8,
                                            offset: 2,
                                        }}
                                    />
                                </>
                            )}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
