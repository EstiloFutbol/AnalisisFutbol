export default function GoalTimeline({ homeGoalMinutes = [], awayGoalMinutes = [], homeTeam, awayTeam }) {
    // Parse goal minute arrays (could be JSON strings or arrays)
    const parseMinutes = (mins) => {
        if (!mins) return []
        let parsed = mins;
        if (typeof mins === 'string') {
            try {
                parsed = JSON.parse(mins)
            } catch {
                // If parse fails, maybe it's a comma separated string?
                parsed = mins.split(',').map(m => m.trim())
            }
        }
        if (!Array.isArray(parsed)) return []

        return parsed
            .map(m => String(m).replace(/['"\[\]]/g, '').trim()) // Remove quotes and brackets
            .filter(m => m !== '' && m !== 'NULL' && !isNaN(parseInt(m))) // Must be number-ish
    }

    const homeGoals = parseMinutes(homeGoalMinutes)
    const awayGoals = parseMinutes(awayGoalMinutes)

    if (homeGoals.length === 0 && awayGoals.length === 0) return null

    // Combine all goals and sort by minute for timeline
    const allGoals = [
        ...homeGoals.map(min => ({ minute: min, team: 'home', teamName: homeTeam })),
        ...awayGoals.map(min => ({ minute: min, team: 'away', teamName: awayTeam })),
    ].sort((a, b) => {
        const parseMin = (m) => parseInt(String(m).replace(/[^0-9]/g, '')) || 0
        return parseMin(a.minute) - parseMin(b.minute)
    })

    return (
        <div className="rounded-xl border border-border/50 bg-card/50 p-4">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Goles
            </h4>
            <div className="space-y-2">
                {allGoals.map((goal, i) => (
                    <div
                        key={i}
                        className={`flex items-center gap-3 text-sm ${goal.team === 'home' ? 'flex-row' : 'flex-row-reverse text-right'
                            }`}
                    >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-goal/20 text-[10px] font-bold text-goal">
                            ⚽
                        </span>
                        <div className={`flex-1 ${goal.team === 'away' ? 'text-right' : ''}`}>
                            <span className="font-medium text-foreground">{goal.teamName}</span>
                            <span className="ml-2 text-xs text-muted-foreground">{goal.minute}'</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
