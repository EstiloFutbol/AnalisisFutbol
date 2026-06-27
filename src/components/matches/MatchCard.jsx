import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, MapPin } from 'lucide-react'

function ResultBadge({ homeGoals, awayGoals, kickOffTime }) {
    const hasScore = homeGoals != null && awayGoals != null
    if (!hasScore) {
        // Upcoming match: show kick-off time or VS
        return (
            <div className="flex flex-col items-center gap-0.5">
                <span className="text-lg font-black text-muted-foreground/40 tracking-widest">VS</span>
                {kickOffTime && (
                    <span className="text-[11px] font-semibold text-primary/70">{kickOffTime}</span>
                )}
            </div>
        )
    }

    const isHomeWin = homeGoals > awayGoals
    const isAwayWin = awayGoals > homeGoals
    const isDraw    = homeGoals === awayGoals

    return (
        <div className="flex items-center gap-1 text-2xl font-black tabular-nums">
            <span className={isHomeWin ? 'text-win' : isDraw ? 'text-draw' : 'text-muted-foreground'}>
                {homeGoals}
            </span>
            <span className="text-muted-foreground/40 text-lg">-</span>
            <span className={isAwayWin ? 'text-win' : isDraw ? 'text-draw' : 'text-muted-foreground'}>
                {awayGoals}
            </span>
        </div>
    )
}

export default function MatchCard({ match, index = 0, isWC = false, homeLabel = null, awayLabel = null }) {
    const homeTeamName = match.home_team?.name || homeLabel || (isWC ? 'Por definir' : 'Local')
    const awayTeamName = match.away_team?.name || awayLabel || (isWC ? 'Por definir' : 'Visitante')
    const isTBD = !match.home_team || !match.away_team

    const matchDate = match.match_date
        ? new Date(match.match_date).toLocaleDateString('es-ES', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
        })
        : ''

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03, duration: 0.2 }}
        >
            <Link
                to={`/partido/${match.id}`}
                className="group block rounded-xl border border-border/50 bg-card p-4 transition-all hover:border-primary/30 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5"
            >
                {/* WC group badge */}
                {isWC && match.group_name && (
                    <div className="mb-2 flex justify-center">
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20">
                            Grupo {match.group_name}
                        </span>
                    </div>
                )}

                <div className="flex items-center justify-between gap-4">
                    {/* Home team */}
                    <div className="flex flex-1 items-center justify-end gap-3 text-right">
                        <div>
                            <p className={`text-sm font-semibold sm:text-base ${
                                !match.home_team && homeLabel ? 'text-muted-foreground font-medium' :
                                isTBD ? 'text-muted-foreground/50 italic' :
                                match.home_goals != null && match.home_goals > match.away_goals
                                    ? 'text-foreground'
                                    : 'text-muted-foreground'
                            }`}>
                                {homeTeamName}
                            </p>
                            {match.home_xg != null && (
                                <p className="text-xs text-muted-foreground/60 mt-0.5">
                                    xG {Number(match.home_xg).toFixed(2)}
                                </p>
                            )}
                        </div>
                        {match.home_team?.logo_url && (
                            <img src={match.home_team.logo_url} alt={homeTeamName} className="h-8 w-8 object-contain" />
                        )}
                        {!match.home_team?.logo_url && !isTBD && (
                            <div className="h-8 w-8 rounded-full bg-secondary/50 flex items-center justify-center text-xs font-bold text-muted-foreground">
                                ?
                            </div>
                        )}
                    </div>

                    {/* Score / VS */}
                    <div className="flex flex-col items-center">
                        <ResultBadge
                            homeGoals={match.home_goals}
                            awayGoals={match.away_goals}
                            kickOffTime={match.kick_off_time}
                        />
                    </div>

                    {/* Away team */}
                    <div className="flex flex-1 items-center justify-start gap-3 text-left">
                        {match.away_team?.logo_url && (
                            <img src={match.away_team.logo_url} alt={awayTeamName} className="h-8 w-8 object-contain" />
                        )}
                        {!match.away_team?.logo_url && !isTBD && (
                            <div className="h-8 w-8 rounded-full bg-secondary/50 flex items-center justify-center text-xs font-bold text-muted-foreground">
                                ?
                            </div>
                        )}
                        <div>
                            <p className={`text-sm font-semibold sm:text-base ${
                                !match.away_team && awayLabel ? 'text-muted-foreground font-medium' :
                                isTBD ? 'text-muted-foreground/50 italic' :
                                match.away_goals != null && match.away_goals > match.home_goals
                                    ? 'text-foreground'
                                    : 'text-muted-foreground'
                            }`}>
                                {awayTeamName}
                            </p>
                            {match.away_xg != null && (
                                <p className="text-xs text-muted-foreground/60 mt-0.5">
                                    xG {Number(match.away_xg).toFixed(2)}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom info */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground/60">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        <span>{matchDate || 'Fecha TBD'}</span>
                    </div>
                    {match.home_team?.stadium && !isWC && (
                        <div className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate max-w-[140px]">{match.home_team.stadium}</span>
                        </div>
                    )}
                    {/* For La Liga: show matchday chip. For WC: no extra chip (round shown in section header) */}
                    {!isWC && match.matchday && (
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium">
                            J{match.matchday}
                        </span>
                    )}
                </div>
            </Link>
        </motion.div>
    )
}
