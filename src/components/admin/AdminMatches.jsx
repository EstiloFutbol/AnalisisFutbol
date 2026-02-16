import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { Loader2, Save, X, Plus, Search } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'

export default function AdminMatches({ onClose }) {
    const [matches, setMatches] = useState([]) // For listing/editing in future
    const [isCreating, setIsCreating] = useState(false)
    const [formData, setFormData] = useState({
        season: '2024-2025',
        matchday: 1,
        match_date: new Date().toISOString().split('T')[0],
        home_team_id: '',
        away_team_id: '',
        stadium: '',
        referee_id: '',
        home_goals: 0,
        away_goals: 0
    })
    const [loading, setLoading] = useState(false)
    const queryClient = useQueryClient()
    const [teams, setTeams] = useState([])
    const [referees, setReferees] = useState([])
    const [isAddingReferee, setIsAddingReferee] = useState(false)
    const [newRefereeName, setNewRefereeName] = useState('')

    // Load data on mount
    useState(() => {
        const loadInitialData = async () => {
            const [teamsRes, refereesRes] = await Promise.all([
                supabase.from('teams').select('*').order('name'),
                supabase.from('referees').select('*').order('name')
            ])
            setTeams(teamsRes.data || [])
            setReferees(refereesRes.data || [])
        }
        loadInitialData()
    }, [])

    const handleChange = (e) => {
        const { name, value, type } = e.target
        const val = type === 'number' ? (value === '' ? '' : Number(value)) : value

        setFormData(prev => {
            const newData = { ...prev, [name]: val }

            // Auto-fill stadium when home team changes
            if (name === 'home_team_id' && val) {
                const team = teams.find(t => t.id === Number(val))
                if (team?.stadium) {
                    newData.stadium = team.stadium
                }
            }

            return newData
        })
    }

    const handleAddReferee = async () => {
        if (!newRefereeName.trim()) return
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('referees')
                .insert([{ name: newRefereeName.trim() }])
                .select()

            if (error) throw error

            const newRef = data[0]
            setReferees(prev => [...prev, newRef].sort((a, b) => a.name.localeCompare(b.name)))
            setFormData(prev => ({ ...prev, referee_id: newRef.id }))
            setNewRefereeName('')
            setIsAddingReferee(false)
        } catch (error) {
            alert('Error al crear árbitro: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Workaround for match sequence sync issue
            const { data: maxIdData } = await supabase
                .from('matches')
                .select('id')
                .order('id', { ascending: false })
                .limit(1)

            const nextId = (maxIdData?.[0]?.id || 0) + 1
            const referee = referees.find(r => r.id === Number(formData.referee_id))
            const matchToInsert = {
                ...formData,
                id: nextId,
                referee: referee?.name || '' // Sync string name for backward compat
            }

            const { error } = await supabase.from('matches').insert([matchToInsert])
            if (error) throw error

            alert('Partido creado exitosamente')
            setIsCreating(false)
            // Reset form
            setFormData({
                season: '2024-2025',
                matchday: 1,
                match_date: new Date().toISOString().split('T')[0],
                home_team_id: '',
                away_team_id: '',
                stadium: '',
                referee_id: '',
                home_goals: 0,
                away_goals: 0
            })
            queryClient.invalidateQueries(['matches'])
        } catch (error) {
            console.error('Error creating match:', error)
            alert('Error: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    if (!isCreating) {
        return (
            <div className="space-y-4">
                <Button onClick={() => setIsCreating(true)} className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Agregar Nuevo Partido
                </Button>
                {/* Future: List existing matches to edit/delete */}
                <div className="text-center text-sm text-muted-foreground py-4">
                    Para editar partidos existentes, búscalos en la sección "Partidos".
                </div>
            </div>
        )
    }

    return (
        <Card className="border-primary/50 shadow-lg">
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <CardTitle>Agregar Nuevo Partido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Temporada</Label>
                            <select
                                name="season"
                                value={formData.season}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            >
                                <option value="2025-2026">2025-2026</option>
                                <option value="2024-2025">2024-2025</option>
                                <option value="2023-2024">2023-2024</option>
                                <option value="2022-2023">2022-2023</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Fecha</Label>
                            <Input type="date" name="match_date" value={formData.match_date} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Equipo Local</Label>
                            <select
                                name="home_team_id"
                                value={formData.home_team_id}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                required
                            >
                                <option value="">Seleccionar...</option>
                                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Equipo Visitante</Label>
                            <select
                                name="away_team_id"
                                value={formData.away_team_id}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                required
                            >
                                <option value="">Seleccionar...</option>
                                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Estadio</Label>
                            <Input
                                name="stadium"
                                value={formData.stadium}
                                onChange={handleChange}
                                placeholder="Estadio del partido"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Árbitro</Label>
                            <div className="flex gap-2">
                                {isAddingReferee ? (
                                    <div className="flex w-full gap-2">
                                        <Input
                                            value={newRefereeName}
                                            onChange={(e) => setNewRefereeName(e.target.value)}
                                            placeholder="Nombre del árbitro"
                                            className="flex-1"
                                        />
                                        <Button type="button" size="icon" onClick={handleAddReferee} disabled={loading}>
                                            <Save className="h-4 w-4" />
                                        </Button>
                                        <Button type="button" size="icon" variant="ghost" onClick={() => setIsAddingReferee(false)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <select
                                            name="referee_id"
                                            value={formData.referee_id}
                                            onChange={handleChange}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm flex-1"
                                            required
                                        >
                                            <option value="">Seleccionar...</option>
                                            {referees.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                        </select>
                                        <Button type="button" size="icon" variant="outline" onClick={() => setIsAddingReferee(true)}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Goles Local</Label>
                            <Input type="number" name="home_goals" value={formData.home_goals} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>Goles Visitante</Label>
                            <Input type="number" name="away_goals" value={formData.away_goals} onChange={handleChange} />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Guardar
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
