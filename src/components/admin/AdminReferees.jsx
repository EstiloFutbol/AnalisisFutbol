import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { Loader2, Plus, Save, X, Trash2 } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'

export default function AdminReferees() {
    const [referees, setReferees] = useState([])
    const [isCreating, setIsCreating] = useState(false)
    const [formData, setFormData] = useState({ name: '' })
    const [loading, setLoading] = useState(false)
    const queryClient = useQueryClient()

    // Load referees
    useEffect(() => {
        fetchReferees()
    }, [])

    const fetchReferees = async () => {
        const { data } = await supabase.from('referees').select('*').order('name')
        setReferees(data || [])
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { error } = await supabase.from('referees').insert([formData])
            if (error) throw error
            alert('Árbitro creado exitosamente')
            setIsCreating(false)
            setFormData({ name: '' })
            queryClient.invalidateQueries(['referees'])
            fetchReferees()
        } catch (error) {
            console.error('Error creating referee:', error)
            alert('Error: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este árbitro?')) return
        try {
            const { error } = await supabase.from('referees').delete().eq('id', id)
            if (error) throw error
            fetchReferees()
        } catch (error) {
            alert('Error deleting referee: ' + error.message)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Árbitros ({referees.length})</h3>
                <Button onClick={() => setIsCreating(true)} size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Árbitro
                </Button>
            </div>

            {isCreating && (
                <Card className="border-primary/50 shadow-lg animate-in fade-in zoom-in-95 duration-200">
                    <form onSubmit={handleSubmit}>
                        <CardHeader>
                            <CardTitle>Agregar Nuevo Árbitro</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Nombre Completo</Label>
                                <Input name="name" value={formData.name} onChange={handleChange} placeholder="Ej: Jesús Gil Manzano" required />
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
                {referees.map(referee => (
                    <div key={referee.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                        <span className="font-medium truncate">{referee.name}</span>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(referee.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}
