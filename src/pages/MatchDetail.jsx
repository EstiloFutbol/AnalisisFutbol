import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useMatch } from '@/hooks/useMatches'
import { useAuth } from '@/context/AuthContext'
import MatchEditForm from '@/components/matches/MatchEditForm'
import StatBar from '@/components/matches/StatBar'
import GoalTimeline from '@/components/matches/GoalTimeline'
import { ArrowLeft, Calendar, MapPin, User, Users, Shield, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function MatchDetail() {
    const { matchId } = useParams()
    const navigate = useNavigate()
    const { data: match, isLoading, error } = useMatch(matchId)
    const { session } = useAuth()
    const [isEditing, setIsEditing] = useState(false)

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
        )
    }

    if (error || !match) {
        return (
            <div className="py-20 text-center">
                <p className="text-muted-foreground">Partido no encontrado</p>
                <button onClick={() => navigate('/matches')} className="mt-4 inline-block text-sm text-primary hover:underline">
                    ← Volver a partidos
                </button>
            </div>
        )
    }

    if (isEditing) {
        return (
            <div className="max-w-2xl mx-auto py-10">
                <MatchEditForm match={match} onClose={() => setIsEditing(false)} />
            </div>
        )
    }

    const homeTeam = match.home_team?.name || 'Local'
    const awayTeam = match.away_team?.name || 'Visitante'
    const isHomeWin = match.home_goals > match.away_goals
    const isAwayWin = match.away_goals > match.home_goals

    const matchDate = match.match_date
        ? new Date(match.match_date).toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
        : ''

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            {/* Header Actions */}
            <div className="flex justify-between items-center">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a partidos
                </button>

                {session && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar Partido
                    </Button>
                )}
            </div>

            {/* Match header — scoreboard */}
            <div className="rounded-2xl border border-border/50 bg-gradient-to-b from-card to-background p-6 sm:p-8">
                {/* Meta info */}
                <div className="mb-6 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
                    {match.matchday && (
                        <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
                            Jornada {match.matchday}
                        </span>
                    )}
                    {matchDate && (
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {matchDate}
                        </span>
                    )}
                    {match.kick_off_time && <span>{match.kick_off_time}</span>}
                </div>

                {/* Teams and score */}
                <div className="flex items-center justify-center gap-4 sm:gap-8">
                    <div className="flex flex-1 flex-col items-center gap-4 text-center">
                        {match.home_team?.logo_url && (
                            <img src={match.home_team.logo_url} alt={homeTeam} className="h-16 w-16 object-contain drop-shadow-md sm:h-20 sm:w-20" />
                        )}
                        <div>
                            <h2 className={`text-xl font-black sm:text-2xl ${isHomeWin ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {homeTeam}
                            </h2>
                            {match.home_formation && (
                                <p className="mt-1 text-xs text-muted-foreground">{match.home_formation}</p>
                            )}
                            {match.home_coach && (
                                <p className="mt-0.5 text-[11px] text-muted-foreground/60">{match.home_coach}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 text-4xl font-black tabular-nums sm:text-5xl">
                            <span className={isHomeWin ? 'text-win' : 'text-muted-foreground'}>{match.home_goals}</span>
                            <span className="text-2xl text-muted-foreground/30">-</span>
                            <span className={isAwayWin ? 'text-win' : 'text-muted-foreground'}>{match.away_goals}</span>
                        </div>
                        {(match.home_xg != null || match.away_xg != null) && (
                            <p className="mt-1 text-xs text-muted-foreground/60">
                                xG: {Number(match.home_xg || 0).toFixed(2)} - {Number(match.away_xg || 0).toFixed(2)}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-1 flex-col items-center gap-4 text-center">
                        {match.away_team?.logo_url && (
                            <img src={match.away_team.logo_url} alt={awayTeam} className="h-16 w-16 object-contain drop-shadow-md sm:h-20 sm:w-20" />
                        )}
                        <div>
                            <h2 className={`text-xl font-black sm:text-2xl ${isAwayWin ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {awayTeam}
                            </h2>
                            {match.away_formation && (
                                <p className="mt-1 text-xs text-muted-foreground">{match.away_formation}</p>
                            )}
                            {match.away_coach && (
                                <p className="mt-0.5 text-[11px] text-muted-foreground/60">{match.away_coach}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Venue info */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground/60">
                    {match.stadium && (
                        <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {match.stadium}
                        </span>
                    )}
                    {match.referee && (
                        <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {match.referee}
                        </span>
                    )}
                    {match.attendance && (
                        <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {Number(match.attendance).toLocaleString('es-ES')} espectadores
                        </span>
                    )}
                </div>
            </div>

            {/* Stats and Goals in 2-column layout */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Match Stats */}
                <div className="rounded-xl border border-border/50 bg-card p-5">
                    <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Estadísticas del Partido
                    </h3>
                    <div className="space-y-1">
                        {match.home_possession != null && (
                            <StatBar label="Posesión" homeValue={match.home_possession} awayValue={match.away_possession} format="percent" />
                        )}
                        {match.home_shots != null && (
                            <StatBar label="Tiros" homeValue={match.home_shots} awayValue={match.away_shots} />
                        )}
                        {match.home_shots_on_target != null && (
                            <StatBar label="Tiros a puerta" homeValue={match.home_shots_on_target} awayValue={match.away_shots_on_target} />
                        )}
                        {match.home_shots_off_target != null && (
                            <StatBar label="Tiros fuera" homeValue={match.home_shots_off_target} awayValue={match.away_shots_off_target} />
                        )}
                        {match.home_corners_1h != null && (
                            <StatBar
                                label="Corners"
                                homeValue={(match.home_corners_1h || 0) + (match.home_corners_2h || 0)}
                                awayValue={(match.away_corners_1h || 0) + (match.away_corners_2h || 0)}
                            />
                        )}
                        {match.home_fouls != null && (
                            <StatBar label="Faltas" homeValue={match.home_fouls} awayValue={match.away_fouls} highlight="lower" />
                        )}
                        {match.home_cards != null && (
                            <StatBar label="Tarjetas" homeValue={match.home_cards} awayValue={match.away_cards} highlight="lower" />
                        )}
                        {match.home_offsides != null && (
                            <StatBar label="Fueras de juego" homeValue={match.home_offsides} awayValue={match.away_offsides} highlight="lower" />
                        )}
                    </div>
                </div>

                {/* Goals + Odds */}
                <div className="space-y-4">
                    {/* Goal Timeline */}
                    <GoalTimeline
                        homeGoalMinutes={match.home_goal_minutes}
                        awayGoalMinutes={match.away_goal_minutes}
                        homeTeam={homeTeam}
                        awayTeam={awayTeam}
                    />

                    {/* Betting Odds */}
                    {match.home_odds && (
                        <div className="rounded-xl border border-border/50 bg-card/50 p-4">
                            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                Cuotas
                            </h4>
                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div className="rounded-lg bg-secondary/50 p-3">
                                    <p className="text-[10px] font-medium text-muted-foreground">Local</p>
                                    <p className="mt-1 text-lg font-bold text-foreground">{Number(match.home_odds).toFixed(2)}</p>
                                </div>
                                <div className="rounded-lg bg-secondary/50 p-3">
                                    <p className="text-[10px] font-medium text-muted-foreground">Empate</p>
                                    <p className="mt-1 text-lg font-bold text-foreground">{Number(match.draw_odds).toFixed(2)}</p>
                                </div>
                                <div className="rounded-lg bg-secondary/50 p-3">
                                    <p className="text-[10px] font-medium text-muted-foreground">Visitante</p>
                                    <p className="mt-1 text-lg font-bold text-foreground">{Number(match.away_odds).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Corners breakdown */}
                    {match.home_corners_1h != null && (
                        <div className="rounded-xl border border-border/50 bg-card/50 p-4">
                            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                Corners por Parte
                            </h4>
                            <div className="space-y-1">
                                <StatBar label="1ª Parte" homeValue={match.home_corners_1h} awayValue={match.away_corners_1h} />
                                <StatBar label="2ª Parte" homeValue={match.home_corners_2h} awayValue={match.away_corners_2h} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
