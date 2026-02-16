import { useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useMatches, useSeasons } from '@/hooks/useMatches'
import MatchCard from '@/components/matches/MatchCard'
import { Search, Filter, CalendarDays } from 'lucide-react'

export default function Matches() {
    const [searchParams, setSearchParams] = useSearchParams()
    const { data: seasons = [] } = useSeasons()

    // Get filter values from URL params
    const selectedSeason = searchParams.get('season')
    const selectedMatchday = searchParams.get('matchday')
    const searchTerm = searchParams.get('q') || ''

    // Determine active season (URL param > first available season)
    // We only set default if seasons are loaded and no param is present
    const activeSeason = selectedSeason || (seasons.length > 0 ? seasons[0] : null)

    // Sync default season to URL if not present
    useEffect(() => {
        if (!selectedSeason && seasons.length > 0) {
            setSearchParams(prev => {
                prev.set('season', seasons[0])
                return prev
            }, { replace: true })
        }
    }, [selectedSeason, seasons, setSearchParams])

    const { data: matches = [], isLoading } = useMatches(activeSeason)

    // Calculate available matchdays from the fetched matches
    const availableMatchdays = useMemo(() => {
        const mds = new Set(matches.map(m => m.matchday).filter(Boolean))
        return Array.from(mds).sort((a, b) => a - b)
    }, [matches])

    const filteredMatches = useMemo(() => {
        let filtered = matches

        if (selectedMatchday) {
            filtered = filtered.filter(m => m.matchday === Number(selectedMatchday))
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            filtered = filtered.filter(m =>
                (m.home_team?.name || '').toLowerCase().includes(term) ||
                (m.away_team?.name || '').toLowerCase().includes(term) ||
                (m.stadium || '').toLowerCase().includes(term) ||
                (m.referee || '').toLowerCase().includes(term) ||
                (m.referee_data?.name || '').toLowerCase().includes(term)
            )
        }

        return filtered
    }, [matches, selectedMatchday, searchTerm])

    // Handlers for updating URL params
    const handleSeasonChange = (season) => {
        setSearchParams(prev => {
            prev.set('season', season)
            prev.delete('matchday') // Reset matchday on season change
            return prev
        })
    }

    const handleMatchdayChange = (matchday) => {
        setSearchParams(prev => {
            if (matchday) prev.set('matchday', matchday)
            else prev.delete('matchday')
            return prev
        })
    }

    const handleSearchChange = (term) => {
        setSearchParams(prev => {
            if (term) prev.set('q', term)
            else prev.delete('q')
            return prev
        }, { replace: true }) // Replace history for search typing
    }


    // Group matches by matchday (for display)
    const matchesByMatchday = useMemo(() => {
        const groups = {}
        const sorted = [...filteredMatches].sort((a, b) => {
            // If filtered by specific matchday, sort by date? 
            // Default sort by matchday desc
            if (b.matchday !== a.matchday) return Number(b.matchday || 0) - Number(a.matchday || 0)
            return new Date(a.match_date).getTime() - new Date(b.match_date).getTime()
        })

        sorted.forEach(match => {
            const md = match.matchday || 'Pendiente'
            if (!groups[md]) groups[md] = []
            groups[md].push(match)
        })

        return Object.entries(groups)
    }, [filteredMatches])

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black tracking-tight text-foreground">
                    Partidos
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    {filteredMatches.length} partidos encontrados
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Buscar equipo, estadio, árbitro..."
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full rounded-lg border border-border bg-card py-2 pl-10 pr-4 text-sm text-foreground placeholder-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>

                {/* Season selector */}
                {seasons.length > 0 && (
                    <select
                        value={activeSeason || ''}
                        onChange={(e) => handleSeasonChange(e.target.value)}
                        className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                        {seasons.map((season) => (
                            <option key={season} value={season}>{season}</option>
                        ))}
                    </select>
                )}

                {/* Matchday selector */}
                <select
                    value={selectedMatchday || ''}
                    onChange={(e) => handleMatchdayChange(e.target.value)}
                    className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                    <option value="">Todas las jornadas</option>
                    {availableMatchdays.map((md) => (
                        <option key={md} value={md}>Jornada {md}</option>
                    ))}
                </select>
            </div>

            {/* Matchday chips (horizontal scroll) - only show if no specific matchday selected */}
            {!selectedMatchday && availableMatchdays.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {availableMatchdays.map((md) => (
                        <button
                            key={md}
                            onClick={() => handleMatchdayChange(String(md))}
                            className="flex-none rounded-full border border-border/50 bg-card px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                        >
                            J{md}
                        </button>
                    ))}
                </div>
            )}

            {/* Loading */}
            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
            )}

            {/* Match list grouped by matchday */}
            {matchesByMatchday.map(([matchday, mdMatches]) => (
                <div key={matchday}>
                    <div className="mb-3 flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        <h2 className="text-sm font-bold text-foreground">
                            Jornada {matchday}
                        </h2>
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                            {mdMatches.length} partidos
                        </span>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {mdMatches.map((match, i) => (
                            <MatchCard key={match.id} match={match} index={i} />
                        ))}
                    </div>
                </div>
            ))}

            {/* No results */}
            {!isLoading && filteredMatches.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/50 py-20 text-center">
                    <Filter className="h-12 w-12 text-muted-foreground/30" />
                    <h3 className="mt-4 text-lg font-semibold text-muted-foreground">
                        No se encontraron partidos
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground/60">
                        Prueba con otros filtros
                    </p>
                </div>
            )}
        </div>
    )
}
