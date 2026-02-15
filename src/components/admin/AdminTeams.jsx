import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { Loader2, Plus, Save, X } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'

export default function AdminTeams() {
    const [teams, setTeams] = useState([])
    const [isCreating, setIsCreating] = useState(false)
    const [formData, setFormData] = useState({ name: '', short_name: '', logo_url: '' })
    const [loading, setLoading] = useState(false)
    const queryClient = useQueryClient()

    // Load teams
    useState(() => {
        supabase.from('teams').select('*').order('name').then(({ data }) => setTeams(data || []))
    }, [])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            // Workaround for sequence sync issue: Calculate next ID manually
            const { data: maxIdData } = await supabase
                .from('teams')
                .select('id')
                .order('id', { ascending: false })
                .limit(1)

            const nextId = (maxIdData?.[0]?.id || 0) + 1

            const { error } = await supabase.from('teams').insert([{ ...formData, id: nextId }])
            if (error) throw error
            alert('Equipo creado exitosamente')
            setIsCreating(false)
            setFormData({ name: '', short_name: '', logo_url: '' })
            queryClient.invalidateQueries(['teams'])
            // Refresh list casually
            const { data } = await supabase.from('teams').select('*').order('name')
            setTeams(data || [])
        } catch (error) {
            console.error('Error creating team:', error)
            alert('Error: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Equipos ({teams.length})</h3>
                <Button onClick={() => setIsCreating(true)} size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Equipo
                </Button>
            </div>

            {isCreating && (
                <Card className="border-primary/50 shadoaw-lg animate-in fade-in zoom-in-95 duration-200">
                    <form onSubmit={handleSubmit}>
                        <CardHeader>
                            <CardTitle>Agregar Nuevo Equipo</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nombre</Label>
                                    <Input name="name" value={formData.name} onChange={handleChange} placeholder="Ej: Real Madrid" required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Abreviatura</Label>
                                    <Input name="short_name" value={formData.short_name} onChange={handleChange} placeholder="Ej: RMA" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Logo URL</Label>
                                <Input name="logo_url" value={formData.logo_url} onChange={handleChange} placeholder="https://..." />
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
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {teams.map(team => (
                    <div key={team.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card/50">
                        {team.logo_url ? <img src={team.logo_url} className="h-8 w-8 object-contain" /> : <div className="h-8 w-8 bg-muted rounded-full" />}
                        <div className="overflow-hidden">
                            <p className="font-medium truncate">{team.name}</p>
                            <p className="text-xs text-muted-foreground">{team.short_name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
