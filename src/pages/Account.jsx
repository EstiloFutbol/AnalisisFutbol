import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, ShieldCheck, LogOut, Pencil, Check, X, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

function Avatar({ name, email, size = 'lg' }) {
    const initials = name
        ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : (email ? email[0].toUpperCase() : '?')
    const sz = size === 'lg' ? 'h-20 w-20 text-2xl' : 'h-10 w-10 text-sm'
    return (
        <div className={`${sz} flex items-center justify-center rounded-full bg-primary/20 border-2 border-primary/30 font-bold text-primary`}>
            {initials}
        </div>
    )
}

export default function Account() {
    const { session, user, userProfile, isAdmin, loading, signOut, refreshProfile } = useAuth()
    const navigate = useNavigate()

    const [editing, setEditing] = useState(false)
    const [displayName, setDisplayName] = useState('')
    const [saving, setSaving] = useState(false)
    const [saveError, setSaveError] = useState(null)
    const [signingOut, setSigningOut] = useState(false)

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!loading && !session) {
            navigate('/login', { replace: true, state: { from: '/account' } })
        }
    }, [session, loading, navigate])

    // Initialise displayName once when the profile first loads (not on every render)
    const [initialised, setInitialised] = useState(false)
    useEffect(() => {
        if (userProfile?.display_name && !initialised) {
            setDisplayName(userProfile.display_name)
            setInitialised(true)
        }
    }, [userProfile, initialised])

    const handleSaveName = async () => {
        const trimmed = displayName.trim()
        if (!trimmed) return
        setSaving(true)
        setSaveError(null)

        const { error } = await supabase
            .from('user_profiles')
            .update({ display_name: trimmed })
            .eq('id', user.id)

        setSaving(false)
        if (error) {
            setSaveError('No se pudo guardar el nombre.')
        } else {
            setEditing(false)
            setDisplayName(trimmed)   // keep local state in sync
            await refreshProfile()    // update AuthContext + Navbar avatar
        }
    }

    const handleSignOut = async () => {
        setSigningOut(true)
        await signOut()
        navigate('/')
    }

    if (loading || !session) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-lg space-y-6"
        >
            <div>
                <h1 className="text-3xl font-black tracking-tight title-contrast">Mi cuenta</h1>
                <p className="mt-1 text-sm text-muted-foreground">Gestiona tu perfil e información personal</p>
            </div>

            {/* Profile card */}
            <div className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-lg backdrop-blur-sm">

                {/* Avatar + name */}
                <div className="flex items-center gap-5 pb-6 border-b border-border/40">
                    <Avatar name={userProfile?.display_name} email={user?.email} />
                    <div className="flex-1 min-w-0">
                        {editing ? (
                            <div className="flex items-center gap-2">
                                <input
                                    value={displayName}
                                    onChange={e => setDisplayName(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') setEditing(false) }}
                                    className="flex-1 rounded-lg border border-primary bg-background px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                    maxLength={40}
                                    autoFocus
                                />
                                <button onClick={handleSaveName} disabled={saving} className="rounded-lg bg-primary/10 p-1.5 text-primary hover:bg-primary/20 transition-colors">
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                </button>
                                <button onClick={() => setEditing(false)} className="rounded-lg bg-secondary p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-foreground truncate">
                                    {userProfile?.display_name || 'Sin nombre'}
                                </h2>
                                <button
                                    onClick={() => setEditing(true)}
                                    className="shrink-0 rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors"
                                    title="Editar nombre"
                                >
                                    <Pencil className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        )}
                        {saveError && <p className="mt-1 text-xs text-red-400">{saveError}</p>}
                        {isAdmin && (
                            <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-[11px] font-semibold text-green-400">
                                <ShieldCheck className="h-3 w-3" />
                                Administrador
                            </span>
                        )}
                    </div>
                </div>

                {/* Info rows */}
                <div className="space-y-4 py-5 border-b border-border/40">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Email</p>
                            <p className="text-sm font-medium text-foreground">{user?.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
                            <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Miembro desde</p>
                            <p className="text-sm font-medium text-foreground">
                                {user?.created_at
                                    ? new Date(user.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
                                    : '—'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sign out */}
                <div className="pt-5">
                    <button
                        onClick={handleSignOut}
                        disabled={signingOut}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-60"
                    >
                        {signingOut
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <LogOut className="h-4 w-4" />
                        }
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </motion.div>
    )
}
