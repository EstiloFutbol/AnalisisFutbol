import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, MapPin } from 'lucide-react'

function ResultBadge({ homeGoals, awayGoals }) {
    const isHomeWin = homeGoals > awayGoals
    const isAwayWin = awayGoals > homeGoals
    const isDraw = homeGoals === awayGoals

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

export default function MatchCard({ match, index = 0 }) {
    const homeTeamName = match.home_team?.name || 'Local'
    const awayTeamName = match.away_team?.name || 'Visitante'
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
                to={`/matches/${match.id}`}
                className="group block rounded-xl border border-border/50 bg-card p-4 transition-all hover:border-primary/30 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5"
            >
                <div className="flex items-center justify-between gap-4">
                    {/* Home team */}
                    <div className="flex flex-1 items-center justify-end gap-3 text-right">
                        <div>
                            <p className={`text-sm font-semibold sm:text-base ${match.home_goals > match.away_goals ? 'text-foreground' : 'text-muted-foreground'
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
                    </div>

                    {/* Score */}
                    <div className="flex flex-col items-center">
                        <ResultBadge homeGoals={match.home_goals} awayGoals={match.away_goals} />
                        {match.kick_off_time && (
                            <span className="text-[10px] text-muted-foreground/50 mt-0.5">
                                {match.kick_off_time}
                            </span>
                        )}
                    </div>

                    {/* Away team */}
                    <div className="flex flex-1 items-center justify-start gap-3 text-left">
                        {match.away_team?.logo_url && (
                            <img src={match.away_team.logo_url} alt={awayTeamName} className="h-8 w-8 object-contain" />
                        )}
                        <div>
                            <p className={`text-sm font-semibold sm:text-base ${match.away_goals > match.home_goals ? 'text-foreground' : 'text-muted-foreground'
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
                        <span>{matchDate}</span>
                    </div>
                    {match.home_team?.stadium && (
                        <div className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate max-w-[140px]">{match.home_team.stadium}</span>
                        </div>
                    )}
                    {match.matchday && (
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium">
                            J{match.matchday}
                        </span>
                    )}
                </div>
            </Link>
        </motion.div>
    )
}
