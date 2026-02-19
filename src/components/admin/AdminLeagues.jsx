import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { Loader2, Plus, Save, X, Trash2, Star, Trophy } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useLeagues } from '@/hooks/useMatches'

export default function AdminLeagues() {
    const queryClient = useQueryClient()
    const { data: leagues = [], isLoading } = useLeagues()
    const [isCreating, setIsCreating] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        country: '',
        season: '2025-2026',
        logo_url: '',
        is_default: false
    })

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const resetForm = () => {
        setFormData({
            name: '',
            country: '',
            season: '2025-2026',
            logo_url: '',
            is_default: false
        })
        setIsCreating(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.name || !formData.season) {
            alert('Nombre y temporada son obligatorios')
            return
        }

        setLoading(true)
        try {
            // If marking as default, unmark all others first
            if (formData.is_default) {
                await supabase
                    .from('leagues')
                    .update({ is_default: false })
                    .eq('is_default', true)
            }

            const { error } = await supabase
                .from('leagues')
                .insert([formData])

            if (error) throw error

            queryClient.invalidateQueries({ queryKey: ['leagues'] })
            resetForm()
        } catch (err) {
            alert('Error al crear liga: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de que quieres eliminar esta liga?')) return

        try {
            const { error } = await supabase
                .from('leagues')
                .delete()
                .eq('id', id)

            if (error) throw error
            queryClient.invalidateQueries({ queryKey: ['leagues'] })
        } catch (err) {
            alert('Error al eliminar liga: ' + err.message)
        }
    }

    const handleSetDefault = async (id) => {
        try {
            // Unmark all
            await supabase
                .from('leagues')
                .update({ is_default: false })
                .eq('is_default', true)

            // Mark selected
            const { error } = await supabase
                .from('leagues')
                .update({ is_default: true })
                .eq('id', id)

            if (error) throw error
            queryClient.invalidateQueries({ queryKey: ['leagues'] })
        } catch (err) {
            alert('Error: ' + err.message)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Ligas y Temporadas</h2>
                {!isCreating && (
                    <Button onClick={() => setIsCreating(true)} size="sm">
                        <Plus className="mr-2 h-4 w-4" /> Nueva Liga
                    </Button>
                )}
            </div>

            {/* Create Form */}
            {isCreating && (
                <Card>
                    <form onSubmit={handleSubmit}>
                        <CardHeader>
                            <CardTitle className="text-base">Crear Nueva Liga</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nombre *</Label>
                                    <Input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Ej: La Liga"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Temporada *</Label>
                                    <Input
                                        name="season"
                                        value={formData.season}
                                        onChange={handleChange}
                                        placeholder="Ej: 2025-2026"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>País</Label>
                                    <Input
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        placeholder="Ej: España"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Logo URL</Label>
                                    <Input
                                        name="logo_url"
                                        value={formData.logo_url}
                                        onChange={handleChange}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_default"
                                    checked={formData.is_default}
                                    onChange={handleChange}
                                    className="rounded border-slate-600"
                                />
                                <span className="text-sm">Establecer como liga por defecto</span>
                            </label>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={resetForm}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Guardar
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            )}

            {/* Leagues List */}
            {leagues.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                    <Trophy className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p>No hay ligas registradas. Crea la primera.</p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {leagues.map(league => (
                        <Card key={league.id} className={`transition-colors ${league.is_default ? 'border-primary/50 bg-primary/5' : ''}`}>
                            <CardContent className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    {league.logo_url ? (
                                        <img src={league.logo_url} alt={league.name} className="h-8 w-8 rounded object-contain" />
                                    ) : (
                                        <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                                            <Trophy className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    )}
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">{league.name}</span>
                                            <span className="text-sm text-muted-foreground">{league.season}</span>
                                            {league.is_default && (
                                                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/20">
                                                    POR DEFECTO
                                                </span>
                                            )}
                                        </div>
                                        {league.country && (
                                            <span className="text-xs text-muted-foreground">{league.country}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!league.is_default && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleSetDefault(league.id)}
                                            title="Establecer como predeterminada"
                                        >
                                            <Star className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(league.id)}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
