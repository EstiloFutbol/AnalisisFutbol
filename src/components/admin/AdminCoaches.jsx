import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { Loader2, Plus, Save, X, Trash2 } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'

export default function AdminCoaches() {
    const [coaches, setCoaches] = useState([])
    const [isCreating, setIsCreating] = useState(false)
    const [formData, setFormData] = useState({ name: '' })
    const [loading, setLoading] = useState(false)
    const queryClient = useQueryClient()

    // Load coaches
    useEffect(() => {
        fetchCoaches()
    }, [])

    const fetchCoaches = async () => {
        const { data } = await supabase.from('coaches').select('*').order('name')
        setCoaches(data || [])
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { error } = await supabase.from('coaches').insert([formData])
            if (error) throw error
            alert('Entrenador creado exitosamente')
            setIsCreating(false)
            setFormData({ name: '' })
            queryClient.invalidateQueries(['coaches'])
            fetchCoaches()
        } catch (error) {
            console.error('Error creating coach:', error)
            alert('Error: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este entrenador?')) return
        try {
            const { error } = await supabase.from('coaches').delete().eq('id', id)
            if (error) throw error
            fetchCoaches()
        } catch (error) {
            alert('Error eliminando entrenador: ' + error.message)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Entrenadores ({coaches.length})</h3>
                <Button onClick={() => setIsCreating(true)} size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Entrenador
                </Button>
            </div>

            {isCreating && (
                <Card className="border-primary/50 shadow-lg animate-in fade-in zoom-in-95 duration-200">
                    <form onSubmit={handleSubmit}>
                        <CardHeader>
                            <CardTitle>Agregar Nuevo Entrenador</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Nombre Completo</Label>
                                <Input name="name" value={formData.name} onChange={handleChange} placeholder="Ej: Carlo Ancelotti" required />
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {coaches.map(coach => (
                    <div key={coach.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                        <span className="font-medium truncate">{coach.name}</span>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(coach.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}
