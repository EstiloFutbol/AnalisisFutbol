import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { Loader2, Save, X } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'

export default function MatchEditForm({ match, onClose }) {
    const [formData, setFormData] = useState({ ...match })
    const [loading, setLoading] = useState(false)
    const queryClient = useQueryClient()

    const handleChange = (e) => {
        const { name, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? (value === '' ? null : Number(value)) : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Function to parse goal minutes string to array
            const parseMinutes = (str) => {
                if (!str) return []
                // If it's already an array (from initial load), verify it matches
                if (Array.isArray(str)) return str
                return str.split(',').map(m => m.trim().replace(/'|"/g, '')).filter(Boolean)
            }

            const { error } = await supabase
                .from('matches')
                .update({
                    home_goals: formData.home_goals,
                    away_goals: formData.away_goals,
                    home_xg: formData.home_xg,
                    away_xg: formData.away_xg,
                    home_possession: formData.home_possession,
                    away_possession: formData.away_possession,
                    home_shots: formData.home_shots,
                    away_shots: formData.away_shots,
                    home_shots_on_target: formData.home_shots_on_target,
                    away_shots_on_target: formData.away_shots_on_target,
                    home_fouls: formData.home_fouls,
                    away_fouls: formData.away_fouls,
                    home_cards: formData.home_cards,
                    away_cards: formData.away_cards,
                    home_red_cards: formData.home_red_cards,
                    away_red_cards: formData.away_red_cards,
                    home_offsides: formData.home_offsides,
                    away_offsides: formData.away_offsides,
                    home_corners_1h: formData.home_corners_1h,
                    home_corners_2h: formData.home_corners_2h,
                    away_corners_1h: formData.away_corners_1h,
                    away_corners_2h: formData.away_corners_2h,
                    total_corners: (Number(formData.home_corners_1h || 0) + Number(formData.home_corners_2h || 0) + Number(formData.away_corners_1h || 0) + Number(formData.away_corners_2h || 0)),
                    referee: formData.referee,
                    stadium: formData.stadium,
                    attendance: formData.attendance,
                    matchday: formData.matchday,
                    home_goal_minutes: parseMinutes(formData.home_goal_minutes_text || JSON.stringify(formData.home_goal_minutes || [])),
                    away_goal_minutes: parseMinutes(formData.away_goal_minutes_text || JSON.stringify(formData.away_goal_minutes || [])),
                })
                .eq('id', match.id)

            if (error) throw error

            // Invalidate cache to refresh UI
            queryClient.invalidateQueries(['match', String(match.id)])
            queryClient.invalidateQueries(['matches'])
            onClose()

        } catch (error) {
            console.error('Error updating match:', error)
            alert('Error al guardar: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    // Helper to format array to string for input
    const formatMinutes = (minutes) => {
        if (!minutes) return ''
        if (typeof minutes === 'string') return minutes // already editing
        if (Array.isArray(minutes)) return minutes.join(', ')
        return String(minutes)
    }

    return (
        <Card className="border-primary/50 shadoaw-lg animate-in fade-in zoom-in-95 duration-200">
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <CardTitle>Editar Partido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 max-h-[70vh] overflow-y-auto">

                    {/* Score, xG & Goals */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4 border p-4 rounded-md">
                            <h3 className="font-semibold text-center">{match.home_team?.name} (Local)</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <Label className="text-xs">Goles</Label>
                                    <Input type="number" name="home_goals" value={formData.home_goals} onChange={handleChange} />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">xG</Label>
                                    <Input type="number" step="0.01" name="home_xg" value={formData.home_xg} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Minutos Goles (ej: 12, 45, 90)</Label>
                                <Input
                                    name="home_goal_minutes_text"
                                    defaultValue={formatMinutes(formData.home_goal_minutes)}
                                    onChange={(e) => setFormData({ ...formData, home_goal_minutes_text: e.target.value })}
                                    placeholder="Minutos separados por coma"
                                />
                            </div>
                        </div>
                        <div className="space-y-4 border p-4 rounded-md">
                            <h3 className="font-semibold text-center">{match.away_team?.name} (Visitante)</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <Label className="text-xs">Goles</Label>
                                    <Input type="number" name="away_goals" value={formData.away_goals} onChange={handleChange} />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">xG</Label>
                                    <Input type="number" step="0.01" name="away_xg" value={formData.away_xg} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Minutos Goles (ej: 12, 45, 90)</Label>
                                <Input
                                    name="away_goal_minutes_text"
                                    defaultValue={formatMinutes(formData.away_goal_minutes)}
                                    onChange={(e) => setFormData({ ...formData, away_goal_minutes_text: e.target.value })}
                                    placeholder="Minutos separados por coma"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Main Stats */}
                    <div className="grid grid-cols-2 gap-4 border-t pt-4">
                        <div className="space-y-2">
                            <Label>Posesión (%) L / V</Label>
                            <div className="flex gap-2">
                                <Input type="number" name="home_possession" value={formData.home_possession} onChange={handleChange} placeholder="Local" />
                                <Input type="number" name="away_possession" value={formData.away_possession} onChange={handleChange} placeholder="Visitante" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Tiros (Total) L / V</Label>
                            <div className="flex gap-2">
                                <Input type="number" name="home_shots" value={formData.home_shots} onChange={handleChange} placeholder="Local" />
                                <Input type="number" name="away_shots" value={formData.away_shots} onChange={handleChange} placeholder="Visitante" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Tiros a Puerta L / V</Label>
                            <div className="flex gap-2">
                                <Input type="number" name="home_shots_on_target" value={formData.home_shots_on_target} onChange={handleChange} placeholder="Local" />
                                <Input type="number" name="away_shots_on_target" value={formData.away_shots_on_target} onChange={handleChange} placeholder="Visitante" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Fueras de Juego L / V</Label>
                            <div className="flex gap-2">
                                <Input type="number" name="home_offsides" value={formData.home_offsides} onChange={handleChange} placeholder="Local" />
                                <Input type="number" name="away_offsides" value={formData.away_offsides} onChange={handleChange} placeholder="Visitante" />
                            </div>
                        </div>
                    </div>

                    {/* Discipline */}
                    <div className="grid grid-cols-2 gap-4 border-t pt-4">
                        <div className="space-y-2">
                            <Label>Faltas L / V</Label>
                            <div className="flex gap-2">
                                <Input type="number" name="home_fouls" value={formData.home_fouls} onChange={handleChange} placeholder="Local" />
                                <Input type="number" name="away_fouls" value={formData.away_fouls} onChange={handleChange} placeholder="Visitante" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Tarjetas Amarillas L / V</Label>
                            <div className="flex gap-2">
                                <Input type="number" name="home_cards" value={formData.home_cards} onChange={handleChange} placeholder="Local" />
                                <Input type="number" name="away_cards" value={formData.away_cards} onChange={handleChange} placeholder="Visitante" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Tarjetas Rojas L / V</Label>
                            <div className="flex gap-2">
                                <Input type="number" name="home_red_cards" value={formData.home_red_cards} onChange={handleChange} placeholder="Local" />
                                <Input type="number" name="away_red_cards" value={formData.away_red_cards} onChange={handleChange} placeholder="Visitante" />
                            </div>
                        </div>
                    </div>

                    {/* Corners */}
                    <div className="space-y-2 border-t pt-4">
                        <Label className="font-semibold block mb-2">Córners</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs">Local: 1ª Parte / 2ª Parte</Label>
                                <div className="flex gap-2">
                                    <Input type="number" name="home_corners_1h" value={formData.home_corners_1h} onChange={handleChange} placeholder="1H" />
                                    <Input type="number" name="home_corners_2h" value={formData.home_corners_2h} onChange={handleChange} placeholder="2H" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs">Visitante: 1ª Parte / 2ª Parte</Label>
                                <div className="flex gap-2">
                                    <Input type="number" name="away_corners_1h" value={formData.away_corners_1h} onChange={handleChange} placeholder="1H" />
                                    <Input type="number" name="away_corners_2h" value={formData.away_corners_2h} onChange={handleChange} placeholder="2H" />
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Details */}
                    <div className="space-y-4 border-t pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Jornada</Label>
                                <Input type="number" name="matchday" value={formData.matchday || ''} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label>Estadio</Label>
                                <Input name="stadium" value={formData.stadium || ''} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label>Árbitro</Label>
                                <Input name="referee" value={formData.referee || ''} onChange={handleChange} />
                            </div>
                            {/* Attendance removed as per user request "I dont need the assistenace" but I will keeping it in state just in case, or remove from UI? User said "I dont need the assistenace". I will remove from UI. */}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                        <X className="mr-2 h-4 w-4" /> Cancelar
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Guardar
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
