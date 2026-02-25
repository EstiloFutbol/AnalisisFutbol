import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLeagues } from '@/hooks/useMatches'
import { usePlayerLeaderboard } from '@/hooks/usePlayerStats'
import { Target, Trophy, Zap, Shield, AlertTriangle, Activity, ChevronUp, ChevronDown } from 'lucide-react'

const TABS = [
    { id: 'goals', label: 'Goleadores', icon: Trophy, sortKey: 'goals', secondary: 'assists' },
    { id: 'assists', label: 'Asistencias', icon: Zap, sortKey: 'assists', secondary: 'goals' },
    { id: 'shots', label: 'Tiros', icon: Target, sortKey: 'shots', secondary: 'shots_on_target' },
    { id: 'discipline', label: 'Disciplina', icon: AlertTriangle, sortKey: 'yellow_cards', secondary: 'red_cards' },
    { id: 'gk', label: 'Porteros', icon: Shield, sortKey: 'gk_saves', secondary: 'gk_shots_faced' },
]

function SortableHeader({ label, sortKey, currentSort, onSort }) {
    const active = currentSort.key === sortKey
    return (
        <th
            onClick={() => onSort(sortKey)}
            className="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
        >
            <span className="inline-flex items-center gap-1">
                {label}
                {active
                    ? currentSort.asc
                        ? <ChevronUp className="h-3 w-3 text-primary" />
                        : <ChevronDown className="h-3 w-3 text-primary" />
                    : <ChevronDown className="h-3 w-3 opacity-30" />
                }
            </span>
        </th>
    )
}

function PlayerRow({ player, rank, tab, delay }) {
    const savePct = player.gk_shots_faced > 0
        ? ((player.gk_saves / player.gk_shots_faced) * 100).toFixed(1)
        : null

    return (
        <motion.tr
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay }}
            className="group border-b border-border/30 transition-colors hover:bg-primary/5"
        >
            {/* Rank */}
            <td className="whitespace-nowrap px-4 py-3 text-center">
                <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold
                    ${rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                        rank === 2 ? 'bg-slate-400/20 text-slate-300' :
                            rank === 3 ? 'bg-orange-600/20 text-orange-400' :
                                'text-muted-foreground'}`}>
                    {rank}
                </span>
            </td>

            {/* Player */}
            <td className="whitespace-nowrap px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {player.player_name.charAt(0)}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-foreground">{player.player_name}</p>
                        <p className="text-[11px] text-muted-foreground">{player.position || '—'}</p>
                    </div>
                </div>
            </td>

            {/* Team */}
            <td className="whitespace-nowrap px-4 py-3">
                <div className="flex items-center gap-2">
                    {player.team?.logo_url && (
                        <img src={player.team.logo_url} alt="" className="h-5 w-5 object-contain" />
                    )}
                    <span className="text-xs text-muted-foreground">{player.team?.short_name || player.team?.name || '—'}</span>
                </div>
            </td>

            {/* App / Min */}
            <td className="whitespace-nowrap px-4 py-3 text-center text-xs text-muted-foreground">{player.appearances}</td>
            <td className="whitespace-nowrap px-4 py-3 text-center text-xs text-muted-foreground">{player.minutes}'</td>

            {/* Tab-specific stats */}
            {tab === 'goals' && <>
                <td className="whitespace-nowrap px-4 py-3 text-center text-lg font-black text-foreground">{player.goals}</td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-primary">{player.assists}</td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-xs text-muted-foreground">{player.shots}</td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-xs text-muted-foreground">{player.shots_on_target}</td>
            </>}
            {tab === 'assists' && <>
                <td className="whitespace-nowrap px-4 py-3 text-center text-lg font-black text-foreground">{player.assists}</td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-primary">{player.goals}</td>
            </>}
            {tab === 'shots' && <>
                <td className="whitespace-nowrap px-4 py-3 text-center text-lg font-black text-foreground">{player.shots}</td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-primary">{player.shots_on_target}</td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-xs text-muted-foreground">
                    {player.shots > 0 ? ((player.shots_on_target / player.shots) * 100).toFixed(0) + '%' : '—'}
                </td>
            </>}
            {tab === 'discipline' && <>
                <td className="whitespace-nowrap px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-yellow-400">
                        <span className="inline-block h-3.5 w-2.5 rounded-sm bg-yellow-400" />
                        {player.yellow_cards}
                    </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-red-400">
                        <span className="inline-block h-3.5 w-2.5 rounded-sm bg-red-500" />
                        {player.red_cards}
                    </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-xs text-muted-foreground">{player.fouls_committed}</td>
            </>}
            {tab === 'gk' && <>
                <td className="whitespace-nowrap px-4 py-3 text-center text-lg font-black text-foreground">{player.gk_saves}</td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-muted-foreground">{player.gk_shots_faced}</td>
                <td className="whitespace-nowrap px-4 py-3 text-center">
                    <span className={savePct ? 'text-sm font-semibold text-primary' : 'text-muted-foreground'}>
                        {savePct ? `${savePct}%` : '—'}
                    </span>
                </td>
            </>}
        </motion.tr>
    )
}

export default function Players() {
    const { data: leagues = [] } = useLeagues()
    const [selectedLeagueId, setSelectedLeagueId] = useState(null)
    const [activeTab, setActiveTab] = useState('goals')
    const [sort, setSort] = useState({ key: 'goals', asc: false })
    const [search, setSearch] = useState('')

    const defaultLeague = leagues.find(l => l.is_default) || leagues[0]
    const activeLeagueId = selectedLeagueId || (defaultLeague ? String(defaultLeague.id) : null)
    const { data: players = [], isLoading } = usePlayerLeaderboard(activeLeagueId)

    const currentTab = TABS.find(t => t.id === activeTab) || TABS[0]

    const handleSort = (key) => {
        setSort(prev => prev.key === key ? { key, asc: !prev.asc } : { key, asc: false })
    }

    const filtered = useMemo(() => {
        let list = [...players]

        // Filter by tab (GK tab shows only goalkeepers)
        if (activeTab === 'gk') {
            list = list.filter(p => p.position === 'GK' || p.gk_shots_faced > 0)
        } else if (activeTab !== 'discipline') {
            list = list.filter(p => p[currentTab.sortKey] > 0)
        }

        // Search filter
        if (search) {
            const q = search.toLowerCase()
            list = list.filter(p =>
                p.player_name.toLowerCase().includes(q) ||
                p.team?.name?.toLowerCase().includes(q)
            )
        }

        // Sort
        list.sort((a, b) => {
            const va = a[sort.key] ?? 0
            const vb = b[sort.key] ?? 0
            return sort.asc ? va - vb : vb - va
        })

        return list
    }, [players, activeTab, sort, search, currentTab])

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">Jugadores</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Estadísticas individuales de la temporada</p>
                </div>
                <div className="flex items-center gap-3">
                    {leagues.length > 0 && (
                        <select
                            value={activeLeagueId || ''}
                            onChange={(e) => setSelectedLeagueId(e.target.value)}
                            className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground focus:border-primary focus:outline-none"
                        >
                            {leagues.map(l => (
                                <option key={l.id} value={l.id}>{l.name} {l.season}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 overflow-x-auto rounded-xl border border-border/50 bg-card/50 p-1">
                {TABS.map(tab => {
                    const Icon = tab.icon
                    const active = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setSort({ key: tab.sortKey, asc: false }) }}
                            className={`relative flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-all
                                ${active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {active && (
                                <motion.div
                                    layoutId="tab-bg"
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

            {/* Search */}
            <div className="relative">
                <Activity className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Buscar jugador o equipo..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
            </div>

            {/* Table */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-border/50 bg-card">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border/50 bg-secondary/30 text-xs text-muted-foreground">
                                    <th className="whitespace-nowrap px-4 py-3 text-center font-semibold uppercase tracking-wider">#</th>
                                    <SortableHeader label="Jugador" sortKey="player_name" currentSort={sort} onSort={handleSort} />
                                    <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">Equipo</th>
                                    <SortableHeader label="PJ" sortKey="appearances" currentSort={sort} onSort={handleSort} />
                                    <SortableHeader label="Min" sortKey="minutes" currentSort={sort} onSort={handleSort} />

                                    {activeTab === 'goals' && <>
                                        <SortableHeader label="Goles" sortKey="goals" currentSort={sort} onSort={handleSort} />
                                        <SortableHeader label="Asist" sortKey="assists" currentSort={sort} onSort={handleSort} />
                                        <SortableHeader label="Tiros" sortKey="shots" currentSort={sort} onSort={handleSort} />
                                        <SortableHeader label="A Puerta" sortKey="shots_on_target" currentSort={sort} onSort={handleSort} />
                                    </>}
                                    {activeTab === 'assists' && <>
                                        <SortableHeader label="Asist" sortKey="assists" currentSort={sort} onSort={handleSort} />
                                        <SortableHeader label="Goles" sortKey="goals" currentSort={sort} onSort={handleSort} />
                                    </>}
                                    {activeTab === 'shots' && <>
                                        <SortableHeader label="Tiros" sortKey="shots" currentSort={sort} onSort={handleSort} />
                                        <SortableHeader label="A Puerta" sortKey="shots_on_target" currentSort={sort} onSort={handleSort} />
                                        <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">Precisión</th>
                                    </>}
                                    {activeTab === 'discipline' && <>
                                        <SortableHeader label="Amarillas" sortKey="yellow_cards" currentSort={sort} onSort={handleSort} />
                                        <SortableHeader label="Rojas" sortKey="red_cards" currentSort={sort} onSort={handleSort} />
                                        <SortableHeader label="Faltas" sortKey="fouls_committed" currentSort={sort} onSort={handleSort} />
                                    </>}
                                    {activeTab === 'gk' && <>
                                        <SortableHeader label="Paradas" sortKey="gk_saves" currentSort={sort} onSort={handleSort} />
                                        <SortableHeader label="Tiros Rec." sortKey="gk_shots_faced" currentSort={sort} onSort={handleSort} />
                                        <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">% Paradas</th>
                                    </>}
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence mode="wait">
                                    {filtered.slice(0, 50).map((player, i) => (
                                        <PlayerRow
                                            key={`${player.player_name}-${player.team?.id}`}
                                            player={player}
                                            rank={i + 1}
                                            tab={activeTab}
                                            delay={i * 0.02}
                                        />
                                    ))}
                                </AnimatePresence>
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={12} className="py-16 text-center text-muted-foreground">
                                            <Trophy className="mx-auto mb-3 h-10 w-10 opacity-20" />
                                            <p className="text-sm">No hay datos de jugadores todavía</p>
                                            <p className="mt-1 text-xs opacity-60">Importa partidos con FBref para ver estadísticas individuales</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {filtered.length > 50 && (
                        <p className="px-4 py-3 text-center text-xs text-muted-foreground border-t border-border/30">
                            Mostrando top 50 de {filtered.length} jugadores
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}
