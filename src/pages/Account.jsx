import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, ShieldCheck, LogOut, Pencil, Check, X, Loader2, KeyRound, Eye, EyeOff, ChevronDown } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

function validatePassword(password) {
    if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.'
    if (!/[a-zA-Z]/.test(password)) return 'La contraseña debe contener al menos una letra.'
    if (!/[0-9]/.test(password)) return 'La contraseña debe contener al menos un número.'
    return null
}

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
    const location = useLocation()

    // True when user arrived via a password-reset email link
    const isRecovery = location.state?.recovery === true

    const [editing, setEditing] = useState(false)
    const [displayName, setDisplayName] = useState('')
    const [saving, setSaving] = useState(false)
    const [saveError, setSaveError] = useState(null)
    const [signingOut, setSigningOut] = useState(false)

    // ── Change password ───────────────────────────────────────────────────────
    const [showPwForm, setShowPwForm] = useState(isRecovery)
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showNewPw, setShowNewPw] = useState(false)
    const [showConfirmPw, setShowConfirmPw] = useState(false)
    const [pwLoading, setPwLoading] = useState(false)
    const [pwError, setPwError] = useState(null)
    const [pwSuccess, setPwSuccess] = useState(false)

    const handleChangePassword = async () => {
        setPwError(null)
        const err = validatePassword(newPassword)
        if (err) { setPwError(err); return }
        if (newPassword !== confirmPassword) { setPwError('Las contraseñas no coinciden.'); return }

        setPwLoading(true)
        const { error } = await supabase.auth.updateUser({ password: newPassword })
        setPwLoading(false)

        if (error) {
            setPwError('No se pudo actualizar la contraseña. Inténtalo de nuevo.')
        } else {
            setPwSuccess(true)
            setNewPassword('')
            setConfirmPassword('')
            setTimeout(() => { setShowPwForm(false); setPwSuccess(false) }, 2500)
        }
    }

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

            {/* ── Change password card ─────────────────────────────────────── */}
            <div className="rounded-2xl border border-border/60 bg-card/80 shadow-lg backdrop-blur-sm overflow-hidden">

                {/* Recovery notice */}
                {isRecovery && (
                    <div className="flex items-start gap-3 border-b border-primary/20 bg-primary/10 px-6 py-4">
                        <KeyRound className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <p className="text-sm text-primary">
                            Has accedido mediante un enlace de recuperación. Establece una nueva contraseña para tu cuenta.
                        </p>
                    </div>
                )}

                {/* Header / toggle */}
                <button
                    type="button"
                    onClick={() => { setShowPwForm(v => !v); setPwError(null) }}
                    className="flex w-full items-center justify-between px-6 py-4 text-left"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
                            <KeyRound className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-foreground">Cambiar contraseña</p>
                            <p className="text-xs text-muted-foreground">Actualiza tu contraseña de acceso</p>
                        </div>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showPwForm ? 'rotate-180' : ''}`} />
                </button>

                {/* Form */}
                <AnimatePresence>
                    {showPwForm && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="space-y-4 border-t border-border/40 px-6 pb-6 pt-4">

                                {pwSuccess && (
                                    <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-500">
                                        <Check className="h-4 w-4 shrink-0" />
                                        Contraseña actualizada correctamente.
                                    </div>
                                )}

                                {pwError && (
                                    <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                        {pwError}
                                    </div>
                                )}

                                {/* New password */}
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-muted-foreground">
                                        Nueva contraseña
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showNewPw ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            placeholder="Mínimo 8 caracteres"
                                            className="w-full rounded-lg border border-border bg-card/60 py-2.5 pl-4 pr-10 text-sm text-foreground placeholder-muted-foreground/40 transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPw(v => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground"
                                        >
                                            {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {/* Live hints */}
                                    <ul className="space-y-0.5 text-[11px]">
                                        <li className={newPassword.length >= 8 ? 'text-green-500' : 'text-muted-foreground/60'}>✓ Mínimo 8 caracteres</li>
                                        <li className={/[a-zA-Z]/.test(newPassword) ? 'text-green-500' : 'text-muted-foreground/60'}>✓ Al menos una letra</li>
                                        <li className={/[0-9]/.test(newPassword) ? 'text-green-500' : 'text-muted-foreground/60'}>✓ Al menos un número</li>
                                    </ul>
                                </div>

                                {/* Confirm password */}
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-muted-foreground">
                                        Confirmar contraseña
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPw ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            placeholder="Repite la contraseña"
                                            className="w-full rounded-lg border border-border bg-card/60 py-2.5 pl-4 pr-10 text-sm text-foreground placeholder-muted-foreground/40 transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPw(v => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground"
                                        >
                                            {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {confirmPassword && (
                                        <p className={`text-[11px] ${newPassword === confirmPassword ? 'text-green-500' : 'text-red-400'}`}>
                                            {newPassword === confirmPassword ? '✓ Las contraseñas coinciden' : '✗ Las contraseñas no coinciden'}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={handleChangePassword}
                                    disabled={pwLoading || pwSuccess}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
                                >
                                    {pwLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                                    Actualizar contraseña
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}
