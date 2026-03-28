import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Mail, User, Loader2, CheckCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

// ─── Validation ───────────────────────────────────────────────────────────────
// NOTE: SQL injection is NOT possible here. Supabase JS uses parameterized queries
// for all DB calls, and Supabase Auth handles credentials server-side with bcrypt.
// The checks below enforce good password quality and sanitize display names for UX.

function validatePassword(password) {
    if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.'
    if (!/[a-zA-Z]/.test(password)) return 'La contraseña debe contener al menos una letra.'
    if (!/[0-9]/.test(password)) return 'La contraseña debe contener al menos un número.'
    return null // valid
}

function sanitizeDisplayName(name) {
    // Allow: letters (incl. accented), numbers, spaces, hyphens, apostrophes, underscores
    // Strip anything else (no HTML, no SQL-looking characters like quotes, semicolons, etc.)
    return name
        .trim()
        .replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9 '_-]/g, '')
        .slice(0, 30)
}

// Translate Supabase errors into friendly Spanish
function translateError(msg) {
    if (!msg) return 'Ha ocurrido un error. Inténtalo de nuevo.'
    if (msg.includes('Invalid login credentials')) return 'Email o contraseña incorrectos.'
    if (msg.includes('Email not confirmed')) return 'Por favor, confirma tu email antes de entrar. Revisa tu bandeja de entrada.'
    if (msg.includes('User already registered')) return 'Este email ya está registrado. Inicia sesión.'
    if (msg.includes('Password should be at least')) return 'La contraseña debe tener al menos 8 caracteres.'
    if (msg.includes('rate limit') || msg.includes('too many')) return 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.'
    if (msg.includes('Unable to validate email')) return 'El formato del email no es válido.'
    return 'Ha ocurrido un error. Inténtalo de nuevo.'
}


function InputField({ id, label, type = 'text', value, onChange, placeholder, icon: Icon, required = true, rightElement = null }) {
    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="block text-sm font-medium text-muted-foreground">
                {label}
            </label>
            <div className="relative">
                {Icon && (
                    <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                )}
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className={`w-full rounded-lg border border-border bg-card/60 py-2.5 text-sm text-foreground placeholder-muted-foreground/40 transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${Icon ? 'pl-10' : 'pl-4'} ${rightElement ? 'pr-10' : 'pr-4'}`}
                />
                {rightElement && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {rightElement}
                    </div>
                )}
            </div>
        </div>
    )
}

export default function Login() {
    const [mode, setMode] = useState('login') // 'login' | 'signup' | 'forgot'
    const [successMessage, setSuccessMessage] = useState(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const navigate = useNavigate()
    const location = useLocation()
    const { session } = useAuth()

    // Where to go after login (if came from a protected page)
    const from = location.state?.from || '/'

    useEffect(() => {
        if (session) navigate(from, { replace: true })
    }, [session, navigate, from])

    const clearForm = () => {
        setError(null)
        setSuccessMessage(null)
    }

    const switchMode = (newMode) => {
        clearForm()
        setMode(newMode)
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setError(null)

        // Client-side password check (saves a round-trip for obvious mistakes)
        const pwErr = validatePassword(password)
        if (pwErr) { setError(pwErr); return }

        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            setError(translateError(error.message))
            setLoading(false)
        }
        // On success: session change → useEffect redirect
    }

    const handleSignup = async (e) => {
        e.preventDefault()
        setError(null)

        // Client-side validation
        const pwErr = validatePassword(password)
        if (pwErr) { setError(pwErr); return }

        // Sanitize display name: strip unsafe characters before sending to Supabase
        const safeName = sanitizeDisplayName(displayName) || email.split('@')[0].slice(0, 30)

        setLoading(true)
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    display_name: safeName
                }
            }
        })

        setLoading(false)
        if (error) {
            setError(translateError(error.message))
        } else {
            setSuccessMessage(`Hemos enviado un email de confirmación a ${email}. Revisa tu bandeja de entrada (y la carpeta de spam) y haz clic en el enlace para activar tu cuenta.`)
        }
    }

    const handleForgotPassword = async (e) => {
        e.preventDefault()
        if (!email) {
            setError('Introduce tu email primero.')
            return
        }
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/login`
        })

        setLoading(false)
        if (error) {
            setError(translateError(error.message))
        } else {
            setSuccessMessage(`Hemos enviado un enlace de recuperación a ${email}. Revisa tu bandeja de entrada.`)
        }
    }

    const eyeToggle = (
        <button
            type="button"
            onClick={() => setShowPassword(p => !p)}
            className="text-muted-foreground/60 hover:text-muted-foreground transition-colors"
        >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
    )

    return (
        <div className="flex min-h-[75vh] items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="w-full max-w-md"
            >
                {/* Card */}
                <div className="rounded-2xl border border-border/60 bg-card/80 p-8 shadow-2xl backdrop-blur-sm">

                    {/* Logo + header */}
                    <div className="mb-6 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                            <Lock className="h-7 w-7 text-primary" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-foreground">
                            {mode === 'login' && 'Bienvenido de vuelta'}
                            {mode === 'signup' && 'Crear cuenta'}
                            {mode === 'forgot' && 'Recuperar contraseña'}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {mode === 'login' && 'Inicia sesión para acceder a tu cuenta'}
                            {mode === 'signup' && 'Crea tu cuenta gratuita'}
                            {mode === 'forgot' && 'Te enviaremos un enlace de recuperación'}
                        </p>
                    </div>

                    {/* Mode tabs (only for login/signup) */}
                    {mode !== 'forgot' && (
                        <div className="mb-6 flex rounded-lg border border-border/50 bg-background/50 p-1">
                            {[
                                { id: 'login', label: 'Iniciar sesión' },
                                { id: 'signup', label: 'Crear cuenta' },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => switchMode(tab.id)}
                                    className={`relative flex-1 rounded-md py-2 text-sm font-medium transition-colors ${mode === tab.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    {mode === tab.id && (
                                        <motion.div
                                            layoutId="auth-tab-bg"
                                            className="absolute inset-0 rounded-md bg-primary/10 border border-primary/20"
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                                        />
                                    )}
                                    <span className="relative">{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Back link for forgot mode */}
                    {mode === 'forgot' && (
                        <button
                            type="button"
                            onClick={() => switchMode('login')}
                            className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver al inicio de sesión
                        </button>
                    )}

                    {/* Success message */}
                    <AnimatePresence mode="wait">
                        {successMessage && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-4 flex gap-3 rounded-lg border border-green-500/20 bg-green-500/10 p-4"
                            >
                                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                                <p className="text-sm text-green-500">{successMessage}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Error message */}
                    {error && (
                        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    {/* Forms */}
                    <AnimatePresence mode="wait">
                        {mode === 'login' && (
                            <motion.form
                                key="login"
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 8 }}
                                transition={{ duration: 0.2 }}
                                onSubmit={handleLogin}
                                className="space-y-4"
                            >
                                <InputField
                                    id="login-email"
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="tu@email.com"
                                    icon={Mail}
                                />
                                <InputField
                                    id="login-password"
                                    label="Contraseña"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    icon={Lock}
                                    rightElement={eyeToggle}
                                />

                                <div className="text-right">
                                    <button
                                        type="button"
                                        onClick={() => switchMode('forgot')}
                                        className="text-xs text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
                                >
                                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                    Iniciar sesión
                                </button>
                            </motion.form>
                        )}

                        {mode === 'signup' && (
                            <motion.form
                                key="signup"
                                initial={{ opacity: 0, x: 8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                transition={{ duration: 0.2 }}
                                onSubmit={handleSignup}
                                className="space-y-4"
                            >
                                <InputField
                                    id="signup-name"
                                    label="Nombre de usuario (opcional)"
                                    value={displayName}
                                    onChange={e => setDisplayName(e.target.value)}
                                    placeholder="Ej: Jose, Carlos_10..."
                                    icon={User}
                                    required={false}
                                />
                                <InputField
                                    id="signup-email"
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="tu@email.com"
                                    icon={Mail}
                                />
                                <InputField
                                    id="signup-password"
                                    label="Contraseña"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Mínimo 8 caracteres"
                                    icon={Lock}
                                    rightElement={eyeToggle}
                                />

                                {/* Password requirements hint */}
                                <ul className="space-y-0.5 text-[11px]">
                                    <li className={password.length >= 8 ? 'text-green-500' : 'text-muted-foreground/60'}>
                                        ✓ Mínimo 8 caracteres
                                    </li>
                                    <li className={/[a-zA-Z]/.test(password) ? 'text-green-500' : 'text-muted-foreground/60'}>
                                        ✓ Al menos una letra
                                    </li>
                                    <li className={/[0-9]/.test(password) ? 'text-green-500' : 'text-muted-foreground/60'}>
                                        ✓ Al menos un número
                                    </li>
                                </ul>

                                <p className="text-[11px] text-muted-foreground/60">
                                    Al crear una cuenta, recibirás un email de confirmación. Debes confirmar tu dirección antes de poder iniciar sesión.
                                </p>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
                                >
                                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                    Crear cuenta
                                </button>
                            </motion.form>
                        )}

                        {mode === 'forgot' && !successMessage && (
                            <motion.form
                                key="forgot"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.2 }}
                                onSubmit={handleForgotPassword}
                                className="space-y-4"
                            >
                                <InputField
                                    id="forgot-email"
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="tu@email.com"
                                    icon={Mail}
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
                                >
                                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                    Enviar enlace
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    )
}
