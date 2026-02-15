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
                    home_corners_1h: formData.home_corners_1h,
                    home_corners_2h: formData.home_corners_2h,
                    away_corners_1h: formData.away_corners_1h,
                    away_corners_2h: formData.away_corners_2h,
                    referee: formData.referee,
                    stadium: formData.stadium,
                    attendance: formData.attendance,
                    matchday: formData.matchday,
                    home_odds: formData.home_odds,
                    draw_odds: formData.draw_odds,
                    away_odds: formData.away_odds
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

    return (
        <Card className="border-primary/50 shadoaw-lg animate-in fade-in zoom-in-95 duration-200">
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <CardTitle>Editar Partido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 max-h-[70vh] overflow-y-auto">

                    {/* Score & xG */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4 border p-4 rounded-md">
                            <h3 className="font-semibold text-center">{match.home_team?.name}</h3>
                            <div className="space-y-2">
                                <Label>Goles</Label>
                                <Input type="number" name="home_goals" value={formData.home_goals} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label>xG</Label>
                                <Input type="number" step="0.01" name="home_xg" value={formData.home_xg} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="space-y-4 border p-4 rounded-md">
                            <h3 className="font-semibold text-center">{match.away_team?.name}</h3>
                            <div className="space-y-2">
                                <Label>Goles</Label>
                                <Input type="number" name="away_goals" value={formData.away_goals} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label>xG</Label>
                                <Input type="number" step="0.01" name="away_xg" value={formData.away_xg} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Posesión Local (%)</Label>
                            <Input type="number" name="home_possession" value={formData.home_possession} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>Posesión Visitante (%)</Label>
                            <Input type="number" name="away_possession" value={formData.away_possession} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>Tiros Local</Label>
                            <Input type="number" name="home_shots" value={formData.home_shots} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>Tiros Visitante</Label>
                            <Input type="number" name="away_shots" value={formData.away_shots} onChange={handleChange} />
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
                            <div className="space-y-2">
                                <Label>Asistencia</Label>
                                <Input type="number" name="attendance" value={formData.attendance || ''} onChange={handleChange} />
                            </div>
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
