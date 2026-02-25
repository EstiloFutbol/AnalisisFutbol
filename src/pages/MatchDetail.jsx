import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useMatch } from '@/hooks/useMatches'
import { useMatchPlayerStats } from '@/hooks/usePlayerStats'
import { useAuth } from '@/context/AuthContext'
import MatchEditForm from '@/components/matches/MatchEditForm'
import StatBar from '@/components/matches/StatBar'
import GoalTimeline from '@/components/matches/GoalTimeline'
import { ArrowLeft, Calendar, MapPin, User, Users, Edit, BarChart2, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

const DETAIL_TABS = [
    { id: 'stats', label: 'Estadísticas', icon: BarChart2 },
    { id: 'players', label: 'Jugadores', icon: UserCheck },
]

function PlayerTable({ players, teamName }) {
    if (!players.length) return null
    const starters = players.filter(p => p.is_starter !== false)
    const subs = players.filter(p => p.is_starter === false)

    const Row = ({ p, isSub }) => (
        <tr className="border-b border-border/20 transition-colors hover:bg-primary/5">
            <td className="py-2 pl-3 pr-2">
                <div className="flex items-center gap-2">
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold
                        ${isSub ? 'bg-secondary text-muted-foreground' : 'bg-primary/15 text-primary'}`}>
                        {p.shirt_number ?? p.player_name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground leading-tight">{p.player_name}</p>
                        <p className="text-[10px] text-muted-foreground">{p.position || (isSub ? 'SUB' : '—')}</p>
                    </div>
                    {p.minutes != null && (
                        <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">{p.minutes}'</span>
                    )}
                </div>
            </td>
            {/* Goals */}
            <td className="px-2 py-2 text-center text-sm">
                {p.goals > 0 ? <span className="font-bold text-win">⚽ {p.goals}</span> : <span className="text-muted-foreground/40">—</span>}
            </td>
            {/* Assists */}
            <td className="px-2 py-2 text-center text-sm">
                {p.assists > 0 ? <span className="font-bold text-primary">{p.assists}</span> : <span className="text-muted-foreground/40">—</span>}
            </td>
            {/* Shots */}
            <td className="px-2 py-2 text-center text-xs text-muted-foreground">{p.shots || '—'}</td>
            {/* Cards */}
            <td className="px-2 py-2 text-center">
                <span className="inline-flex gap-1">
                    {Array.from({ length: p.yellow_cards || 0 }).map((_, i) => (
                        <span key={i} className="inline-block h-3 w-2 rounded-sm bg-yellow-400" />
                    ))}
                    {Array.from({ length: p.red_cards || 0 }).map((_, i) => (
                        <span key={i} className="inline-block h-3 w-2 rounded-sm bg-red-500" />
                    ))}
                    {!p.yellow_cards && !p.red_cards && <span className="text-muted-foreground/30 text-xs">—</span>}
                </span>
            </td>
            {/* GK stats */}
            <td className="px-2 py-2 text-center text-xs text-muted-foreground">
                {p.gk_saves != null ? (
                    <span className="font-semibold text-primary">{p.gk_saves} ({p.gk_shots_faced})</span>
                ) : '—'}
            </td>
        </tr>
    )

    return (
        <div className="overflow-hidden rounded-xl border border-border/50 bg-card">
            <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
                <h4 className="text-sm font-bold text-foreground">{teamName}</h4>
                <span className="text-xs text-muted-foreground">{starters.length} titulares · {subs.length} suplentes</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border/30 text-[10px] uppercase tracking-wider text-muted-foreground">
                            <th className="py-2 pl-3 text-left font-semibold">Jugador</th>
                            <th className="px-2 py-2 text-center font-semibold">G</th>
                            <th className="px-2 py-2 text-center font-semibold">A</th>
                            <th className="px-2 py-2 text-center font-semibold">Tiros</th>
                            <th className="px-2 py-2 text-center font-semibold">Tarj.</th>
                            <th className="px-2 py-2 text-center font-semibold">Paradas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {starters.map(p => <Row key={p.id} p={p} isSub={false} />)}
                        {subs.length > 0 && (
                            <tr>
                                <td colSpan={6} className="bg-secondary/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                                    Suplentes
                                </td>
                            </tr>
                        )}
                        {subs.map(p => <Row key={p.id} p={p} isSub={true} />)}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default function MatchDetail() {
    const { matchId } = useParams()
    const navigate = useNavigate()
    const { data: match, isLoading, error } = useMatch(matchId)
    const { data: playerStats = [] } = useMatchPlayerStats(matchId)
    const { session } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [activeTab, setActiveTab] = useState('stats')

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
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        })
        : ''

    // Split player stats by team
    const homePlayers = playerStats.filter(p => p.is_home)
    const awayPlayers = playerStats.filter(p => !p.is_home)

    // Corner total: prefer half-by-half, fall back to total
    const homeCorners = match.home_corners_1h != null
        ? (match.home_corners_1h || 0) + (match.home_corners_2h || 0)
        : match.home_corners
    const awayCorners = match.away_corners_1h != null
        ? (match.away_corners_1h || 0) + (match.away_corners_2h || 0)
        : match.away_corners

    const hasPerHalfCorners = match.home_corners_1h != null

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
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

            {/* Scoreboard */}
            <div className="rounded-2xl border border-border/50 bg-gradient-to-b from-card to-background p-6 sm:p-8">
                {/* Meta */}
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
                            <h2 className={`text-xl font-black sm:text-2xl ${isHomeWin ? 'text-foreground' : 'text-muted-foreground'}`}>{homeTeam}</h2>
                            {match.home_formation && <p className="mt-1 text-xs text-muted-foreground">{match.home_formation}</p>}
                            {match.home_coach && <p className="mt-0.5 text-[11px] text-muted-foreground/60">{match.home_coach}</p>}
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
                            <h2 className={`text-xl font-black sm:text-2xl ${isAwayWin ? 'text-foreground' : 'text-muted-foreground'}`}>{awayTeam}</h2>
                            {match.away_formation && <p className="mt-1 text-xs text-muted-foreground">{match.away_formation}</p>}
                            {match.away_coach && <p className="mt-0.5 text-[11px] text-muted-foreground/60">{match.away_coach}</p>}
                        </div>
                    </div>
                </div>

                {/* Venue */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground/60">
                    {match.stadium && (
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{match.stadium}</span>
                    )}
                    {(match.referee_data?.name || match.referee) && (
                        <span className="flex items-center gap-1"><User className="h-3 w-3" />{match.referee_data?.name || match.referee}</span>
                    )}
                    {match.attendance && (
                        <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {Number(match.attendance).toLocaleString('es-ES')} espectadores
                        </span>
                    )}
                </div>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-1 rounded-xl border border-border/50 bg-card/50 p-1">
                {DETAIL_TABS.map(tab => {
                    const Icon = tab.icon
                    const active = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all
                                ${active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {active && (
                                <motion.div
                                    layoutId="match-tab-bg"
                                    className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20"
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                                />
                            )}
                            <Icon className="relative h-4 w-4" />
                            <span className="relative">{tab.label}</span>
                        </button>
                    )
                })}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
                {activeTab === 'stats' && (
                    <motion.div
                        key="stats"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="grid gap-6 lg:grid-cols-2"
                    >
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
                                {match.home_saves != null && (
                                    <StatBar label="Paradas" homeValue={match.home_saves} awayValue={match.away_saves} />
                                )}
                                {homeCorners != null && (
                                    <StatBar label="Córners" homeValue={homeCorners} awayValue={awayCorners} />
                                )}
                                {match.home_crosses != null && (
                                    <StatBar label="Centros" homeValue={match.home_crosses} awayValue={match.away_crosses} />
                                )}
                                {match.home_interceptions != null && (
                                    <StatBar label="Intercepciones" homeValue={match.home_interceptions} awayValue={match.away_interceptions} />
                                )}
                                {match.home_fouls != null && (
                                    <StatBar label="Faltas" homeValue={match.home_fouls} awayValue={match.away_fouls} highlight="lower" />
                                )}
                                {match.home_yellow_cards != null && (
                                    <StatBar label="Tarjetas amarillas" homeValue={match.home_yellow_cards} awayValue={match.away_yellow_cards} highlight="lower" />
                                )}
                                {match.home_red_cards != null && (
                                    <StatBar label="Tarjetas rojas" homeValue={match.home_red_cards} awayValue={match.away_red_cards} highlight="lower" />
                                )}
                                {match.home_offsides != null && (
                                    <StatBar label="Fueras de juego" homeValue={match.home_offsides} awayValue={match.away_offsides} highlight="lower" />
                                )}
                            </div>
                        </div>

                        {/* Goals + Odds + Corners */}
                        <div className="space-y-4">
                            <GoalTimeline
                                homeGoalMinutes={match.home_goal_minutes}
                                awayGoalMinutes={match.away_goal_minutes}
                                homeTeam={homeTeam}
                                awayTeam={awayTeam}
                            />

                            {/* Corners per half — only show if we have half data */}
                            {hasPerHalfCorners && (
                                <div className="rounded-xl border border-border/50 bg-card/50 p-4">
                                    <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Córners por Parte</h4>
                                    <div className="space-y-1">
                                        <StatBar label="1ª Parte" homeValue={match.home_corners_1h} awayValue={match.away_corners_1h} />
                                        <StatBar label="2ª Parte" homeValue={match.home_corners_2h} awayValue={match.away_corners_2h} />
                                    </div>
                                </div>
                            )}

                            {/* Betting Odds */}
                            {match.home_odds && (
                                <div className="rounded-xl border border-border/50 bg-card/50 p-4">
                                    <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Cuotas</h4>
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
                        </div>
                    </motion.div>
                )}

                {activeTab === 'players' && (
                    <motion.div
                        key="players"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="grid gap-6 lg:grid-cols-2"
                    >
                        {homePlayers.length > 0
                            ? <PlayerTable players={homePlayers} teamName={homeTeam} />
                            : <div className="flex items-center justify-center rounded-xl border border-dashed border-border/50 py-12 text-muted-foreground text-sm">Sin datos de jugadores</div>
                        }
                        {awayPlayers.length > 0
                            ? <PlayerTable players={awayPlayers} teamName={awayTeam} />
                            : <div className="flex items-center justify-center rounded-xl border border-dashed border-border/50 py-12 text-muted-foreground text-sm">Sin datos de jugadores</div>
                        }
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
