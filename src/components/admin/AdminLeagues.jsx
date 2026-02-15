import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { Loader2, Plus, Save, X } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'

export default function AdminLeagues() {
    const [leagues, setLeagues] = useState([
        { id: 1, name: 'La Liga', season: '2024-2025' }
        // Currently schema doesn't have Leagues table, so this is just UI placeholder
        // But user asked for it. I will implement UI for Seasons filter management if needed
        // Or actually, user said "add leagues". I assume they want to manage seasons/leagues text field in matches?
    ])

    return (
        <div className="text-center py-10 text-muted-foreground">
            Funcionalidad de Ligas en desarrollo. Por ahora el sistema soporta "La Liga 2024-2025" por defecto.
        </div>
    )
}
