export default function StatBar({ label, homeValue, awayValue, homeLabel, awayLabel, format = 'number', highlight = 'higher' }) {
    const hVal = Number(homeValue) || 0
    const aVal = Number(awayValue) || 0
    const total = hVal + aVal || 1
    const homePercent = (hVal / total) * 100
    const awayPercent = (aVal / total) * 100

    const homeWins = highlight === 'higher' ? hVal > aVal : hVal < aVal
    const awayWins = highlight === 'higher' ? aVal > hVal : aVal < hVal

    const formatValue = (val) => {
        if (format === 'percent') return `${val}%`
        if (format === 'decimal') return Number(val).toFixed(2)
        return val
    }

    return (
        <div className="py-2">
            <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className={`font-semibold tabular-nums ${homeWins ? 'text-primary' : 'text-muted-foreground'}`}>
                    {formatValue(hVal)}
                </span>
                <span className="text-[11px] font-medium text-muted-foreground/80 uppercase tracking-wider">
                    {label}
                </span>
                <span className={`font-semibold tabular-nums ${awayWins ? 'text-primary' : 'text-muted-foreground'}`}>
                    {formatValue(aVal)}
                </span>
            </div>
            <div className="flex h-1.5 gap-0.5 overflow-hidden rounded-full">
                <div
                    className={`rounded-l-full transition-all duration-500 ${homeWins ? 'bg-primary' : 'bg-muted-foreground/30'
                        }`}
                    style={{ width: `${homePercent}%` }}
                />
                <div
                    className={`rounded-r-full transition-all duration-500 ${awayWins ? 'bg-primary' : 'bg-muted-foreground/30'
                        }`}
                    style={{ width: `${awayPercent}%` }}
                />
            </div>
        </div>
    )
}
