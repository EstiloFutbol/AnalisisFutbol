import { useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useMatches, useLeagues, useGroupStandings } from '@/hooks/useMatches'
import MatchCard from '@/components/matches/MatchCard'
import { Search, Filter, CalendarDays, Trophy } from 'lucide-react'

// ── WC R32 slot labels (kept in sync with Dashboard.jsx)
// SF-101 half: pos 0-7 (France + Spain same side); SF-102 half: pos 8-15 (Argentina)
const WC_R32_BRACKET_ORDER = [
    2985, 2988, 2984, 2987, 2994, 2995, 2992, 2993,
    2986, 2989, 2990, 2991, 2997, 2998, 2996, 2999,
]
const WC_R32_SLOT_LABELS = [
    { home: '1° Gr. E', away: '3° Gr. D' },  // pos 0:  DB 2985 Match 74 Germany vs Paraguay
    { home: '1° Gr. I', away: '3° Gr. F' },  // pos 1:  DB 2988 Match 77 France vs Sweden
    { home: '2° Gr. A', away: '2° Gr. B' },  // pos 2:  DB 2984 Match 73 South Africa vs Canada
    { home: '1° Gr. F', away: '2° Gr. C' },  // pos 3:  DB 2987 Match 75 Netherlands vs Morocco
    { home: '2° Gr. K', away: '2° Gr. L' },  // pos 4:  DB 2994 Match 83 Portugal vs Croatia
    { home: '1° Gr. H', away: '2° Gr. J' },  // pos 5:  DB 2995 Match 84 Spain vs Austria
    { home: '1° Gr. D', away: '3° Gr. B' },  // pos 6:  DB 2992 Match 81 USA vs Bosnia
    { home: '1° Gr. G', away: '3° Gr. I' },  // pos 7:  DB 2993 Match 82 Belgium vs Senegal
    { home: '1° Gr. C', away: '2° Gr. F' },  // pos 8:  DB 2986 Match 76 Brazil vs Japan
    { home: '2° Gr. E', away: '2° Gr. I' },  // pos 9:  DB 2989 Match 78 Ivory Coast vs Norway
    { home: '1° Gr. A', away: '3° Gr. E' },  // pos 10: DB 2990 Match 79 Mexico vs Ecuador
    { home: '1° Gr. L', away: '3° Gr. K' },  // pos 11: DB 2991 Match 80 England vs DR Congo
    { home: '1° Gr. J', away: '2° Gr. H' },  // pos 12: DB 2997 Match 86 Argentina vs Cape Verde
    { home: '2° Gr. D', away: '2° Gr. G' },  // pos 13: DB 2998 Match 88 Australia vs Egypt
    { home: '1° Gr. B', away: '3° Gr. J' },  // pos 14: DB 2996 Match 85 Switzerland vs Algeria
    { home: '1° Gr. K', away: '3° Gr. L' },  // pos 15: DB 2999 Match 87 Colombia vs Ghana
]

// ── World Cup round labels ────────────────────────────────────────────────────
const WC_ROUND_LABELS = {
    1: 'Fase de Grupos · J1',
    2: 'Fase de Grupos · J2',
    3: 'Fase de Grupos · J3',
    4: 'Ronda de 32',
    5: 'Octavos de Final',
    6: 'Cuartos de Final',
    7: 'Semifinales',
    8: '3er y 4to Puesto',
    9: 'Final',
}

const WC_CHIP_LABELS = {
    1: 'GF·J1',
    2: 'GF·J2',
    3: 'GF·J3',
    4: 'R32',
    5: 'Octavos',
    6: 'Cuartos',
    7: 'Semis',
    8: '3°/4°',
    9: 'Final',
}

export default function Matches({ hideLeagueSelector = false, leagueId = null }) {
    const [searchParams, setSearchParams] = useSearchParams()
    const { data: leagues = [] } = useLeagues()

    // Get filter values from URL params
    const selectedLeagueId = searchParams.get('league')
    const selectedMatchday = searchParams.get('matchday')
    const searchTerm = searchParams.get('q') || ''

    // Parent leagueId takes priority; otherwise fall back to URL param or default
    const defaultLeague = leagues.find(l => l.is_default) || leagues[0]
    const activeLeagueId = leagueId || selectedLeagueId || (defaultLeague ? String(defaultLeague.id) : null)
    const activeLeagueObj = leagues.find(l => String(l.id) === String(activeLeagueId)) || null
    const isWC = activeLeagueObj?.code === 'WC'

    // Only sync URL when running standalone (no parent leagueId)
    useEffect(() => {
        if (leagueId) return
        if (!selectedLeagueId && defaultLeague) {
            setSearchParams(prev => {
                prev.set('league', String(defaultLeague.id))
                return prev
            }, { replace: true })
        }
    }, [leagueId, selectedLeagueId, defaultLeague, setSearchParams])

    const { data: matches = [], isLoading } = useMatches(activeLeagueId)

    // WC group standings — used to resolve slot labels to confirmed team names
    const { data: standingsRaw = [] } = useGroupStandings(isWC ? activeLeagueId : null)

    const { groupWinners, groupRunnerUps, groupThirds, completedGroups } = useMemo(() => {
        const byGroup = {}
        standingsRaw.forEach(r => {
            if (!r.group_name) return
            if (!byGroup[r.group_name]) byGroup[r.group_name] = []
            byGroup[r.group_name].push(r)
        })
        const winners = {}, runners = {}, thirds = {}
        Object.entries(byGroup).forEach(([g, rows]) => {
            if (rows[0]) winners[g] = rows[0]
            if (rows[1]) runners[g] = rows[1]
            if (rows[2]) thirds[g]  = rows[2]
        })
        const done = new Set()
        Object.entries(byGroup).forEach(([g, rows]) => {
            if (rows.length >= 4 && rows.every(r => (r.played || 0) >= 3)) done.add(g)
        })
        return { groupWinners: winners, groupRunnerUps: runners, groupThirds: thirds, completedGroups: done }
    }, [standingsRaw])

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
    const handleLeagueChange = (lId) => {
        setSearchParams(prev => {
            prev.set('league', lId)
            prev.delete('matchday')
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
        }, { replace: true })
    }

    // Group matches by matchday
    // WC: sort ascending (group stage → knockouts); league: sort descending (latest first)
    const matchesByMatchday = useMemo(() => {
        const groups = {}
        const sorted = [...filteredMatches].sort((a, b) => {
            if (a.matchday !== b.matchday) {
                return isWC
                    ? Number(a.matchday || 0) - Number(b.matchday || 0)
                    : Number(b.matchday || 0) - Number(a.matchday || 0)
            }
            const dA = a.match_date ? new Date(a.match_date).getTime() : 0
            const dB = b.match_date ? new Date(b.match_date).getTime() : 0
            return dA - dB
        })

        sorted.forEach(match => {
            const md = match.matchday || 'Pendiente'
            if (!groups[md]) groups[md] = []
            groups[md].push(match)
        })

        return Object.entries(groups)
    }, [filteredMatches, isWC])

    const getRoundLabel = (md) => isWC ? (WC_ROUND_LABELS[md] || `Ronda ${md}`) : `Jornada ${md}`
    const getChipLabel  = (md) => isWC ? (WC_CHIP_LABELS[md]  || `R${md}`)      : `J${md}`

    // For WC R32 matches: resolve slot labels to team names + logos when group is confirmed
    const r32SlotLabels = useMemo(() => {
        if (!isWC) return {}

        function resolveEntry(label) {
            if (!label) return { name: label, logo: null }
            // "3° Gr. X" — specific group's 3rd-place finisher
            const m3 = label.match(/^3° Gr\. ([A-L])$/)
            if (m3) {
                const [, group] = m3
                if (!completedGroups.has(group)) return { name: label, logo: null }
                const row = groupThirds[group]
                return { name: row?.team?.name || label, logo: row?.team?.logo_url || null }
            }
            // "1° Gr. X" or "2° Gr. X"
            const mm = label.match(/^([12])° Gr\. ([A-L])$/)
            if (!mm) return { name: label, logo: null }
            const [, pos, group] = mm
            if (!completedGroups.has(group)) return { name: label, logo: null }
            const row = pos === '1' ? groupWinners[group] : groupRunnerUps[group]
            return { name: row?.team?.name || label, logo: row?.team?.logo_url || null }
        }

        const map = {}
        WC_R32_BRACKET_ORDER.forEach((id, pos) => {
            const labels = WC_R32_SLOT_LABELS[pos] || {}
            const h = resolveEntry(labels.home)
            const a = resolveEntry(labels.away)
            map[id] = { home: h.name, homeLogo: h.logo, away: a.name, awayLogo: a.logo }
        })
        return map
    }, [isWC, completedGroups, groupWinners, groupRunnerUps, groupThirds])

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black tracking-tight title-contrast">
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

                {/* League selector — hidden when rendered as a Dashboard sub-tab */}
                {!hideLeagueSelector && leagues.length > 0 && (
                    <select
                        value={activeLeagueId || ''}
                        onChange={(e) => handleLeagueChange(e.target.value)}
                        className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                        {leagues.map((league) => (
                            <option key={league.id} value={league.id}>{league.name} {league.season}</option>
                        ))}
                    </select>
                )}

                {/* Matchday / round selector */}
                <select
                    value={selectedMatchday || ''}
                    onChange={(e) => handleMatchdayChange(e.target.value)}
                    className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                    <option value="">{isWC ? 'Todas las rondas' : 'Todas las jornadas'}</option>
                    {availableMatchdays.map((md) => (
                        <option key={md} value={md}>{getRoundLabel(md)}</option>
                    ))}
                </select>
            </div>

            {/* Round chips (horizontal scroll) */}
            {availableMatchdays.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <button
                        onClick={() => handleMatchdayChange('')}
                        className={`flex-none rounded-full border px-3 py-1 text-xs font-medium transition-colors ${!selectedMatchday
                            ? 'bg-primary/20 text-primary border-primary/40'
                            : 'border-border/50 bg-card text-muted-foreground hover:border-primary/30 hover:text-primary'}`}
                    >
                        Todas
                    </button>
                    {availableMatchdays.map((md) => {
                        const isActive = selectedMatchday === String(md)
                        return (
                            <button
                                key={md}
                                onClick={() => handleMatchdayChange(String(md))}
                                className={`flex-none rounded-full border px-3 py-1 text-xs font-medium transition-colors ${isActive
                                    ? 'bg-primary/20 text-primary border-primary/40'
                                    : 'border-border/50 bg-card text-muted-foreground hover:border-primary/30 hover:text-primary'}`}
                            >
                                {getChipLabel(md)}
                            </button>
                        )
                    })}
                </div>
            )}

            {/* Loading */}
            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
            )}

            {/* Match list grouped by round / matchday */}
            {matchesByMatchday.map(([matchday, mdMatches]) => (
                <div key={matchday}>
                    <div className="mb-3 flex items-center gap-2">
                        {isWC
                            ? <Trophy className="h-4 w-4 text-primary" />
                            : <CalendarDays className="h-4 w-4 text-primary" />
                        }
                        <h2 className="text-sm font-bold text-foreground">
                            {matchday === 'Pendiente' ? 'Pendiente' : getRoundLabel(Number(matchday))}
                        </h2>
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                            {mdMatches.length} partido{mdMatches.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {mdMatches.map((match, i) => {
                            const slots = r32SlotLabels[match.id] || {}
                            return (
                                <MatchCard
                                    key={match.id}
                                    match={match}
                                    index={i}
                                    isWC={isWC}
                                    homeLabel={slots.home}
                                    awayLabel={slots.away}
                                    homeLogo={slots.homeLogo}
                                    awayLogo={slots.awayLogo}
                                />
                            )
                        })}
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
