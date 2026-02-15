import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AdminMatches from '@/components/admin/AdminMatches'
import AdminTeams from '@/components/admin/AdminTeams'
import AdminLeagues from '@/components/admin/AdminLeagues'
import { Shield, Database, Users, Calendar, Settings } from 'lucide-react'

export default function Admin() {
    const { session, loading } = useAuth()
    const [activeTab, setActiveTab] = useState('matches')

    if (loading) return null

    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Shield className="h-12 w-12 text-muted-foreground/50" />
                <h2 className="text-xl font-semibold">Acceso Restringido</h2>
                <p className="text-muted-foreground text-center max-w-sm">
                    Esta sección es solo para administradores. Por favor inicia sesión para continuar.
                </p>
                <Link to="/login">
                    <Button>Iniciar Sesión</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Panel de Administración</h1>
                    <p className="text-muted-foreground">
                        Gestiona partidos, equipos y configuraciones del sistema.
                    </p>
                </div>
            </div>

            <Tabs defaultValue="matches" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="matches">Partidos</TabsTrigger>
                    <TabsTrigger value="teams">Equipos</TabsTrigger>
                    <TabsTrigger value="leagues">Ligas</TabsTrigger>
                </TabsList>

                <TabsContent value="matches" className="space-y-4">
                    <AdminMatches />
                </TabsContent>

                <TabsContent value="teams" className="space-y-4">
                    <AdminTeams />
                </TabsContent>

                <TabsContent value="leagues" className="space-y-4">
                    <AdminLeagues />
                </TabsContent>
            </Tabs>
        </div>
    )
}
