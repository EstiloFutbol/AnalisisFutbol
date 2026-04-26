import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, CalendarDays, LayoutDashboard, Menu, X, ShieldCheck, Users, UserCircle, LogOut, ChevronDown, Trophy, Bot, Sun, Moon } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/mis-apuestas', label: 'Mis Apuestas', icon: Trophy },
    { path: '/ia-bet', label: 'IA Bet', icon: Bot },
    { path: '/explorar', label: 'Explorar', icon: BarChart3 },
]

function UserAvatar({ name, email }) {
    const initials = name
        ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : (email ? email[0].toUpperCase() : '?')
    return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 border border-primary/30 text-xs font-bold text-primary">
            {initials}
        </div>
    )
}

export default function Navbar() {
    const location = useLocation()
    const navigate = useNavigate()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const userMenuRef = useRef(null)
    const { session, user, userProfile, isAdmin, signOut } = useAuth()
    const { theme, toggleTheme } = useTheme()

    // Close user menu on outside click
    useEffect(() => {
        function handleClickOutside(e) {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setUserMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSignOut = async () => {
        setUserMenuOpen(false)
        await signOut()
        navigate('/')
    }

    return (
        <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <img
                        src="/logo.png"
                        alt="Análisis Fútbol"
                        className="h-9 w-9 rounded-lg object-contain transition-transform group-hover:scale-110"
                    />
                    <div className="flex flex-col">
                        <span className="text-lg font-bold tracking-tight text-foreground">
                            Análisis Fútbol
                        </span>
                        <span className="hidden text-[10px] font-medium uppercase tracking-widest text-muted-foreground sm:block">
                            Datos Puros
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden items-center gap-1 md:flex">
                    {navItems.map(({ path, label, icon: Icon }) => {
                        const isActive = location.pathname === path
                        return (
                            <Link
                                key={path}
                                to={path}
                                className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${isActive
                                    ? 'text-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {label}
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-indicator"
                                        className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20"
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                                    />
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Right side: user area */}
                <div className="flex items-center gap-2">
                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        id="theme-toggle-btn"
                        aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-card/60 text-muted-foreground transition-all hover:border-primary/40 hover:bg-card hover:text-primary"
                    >
                        {theme === 'dark'
                            ? <Sun className="h-4 w-4" />
                            : <Moon className="h-4 w-4" />}
                    </button>

                    {/* Admin badge (only for admins) */}
                    {isAdmin && (
                        <Link
                            to="/admin"
                            className="hidden md:flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500 border border-green-500/20 hover:bg-green-500/20 transition-colors"
                        >
                            <ShieldCheck className="h-3 w-3" />
                            <span>Admin</span>
                        </Link>
                    )}

                    {session ? (
                        /* Logged-in user dropdown */
                        <div className="relative hidden md:block" ref={userMenuRef}>
                            <button
                                onClick={() => setUserMenuOpen(o => !o)}
                                className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/60 px-2.5 py-1.5 text-sm font-medium text-foreground hover:bg-card transition-colors"
                            >
                                <UserAvatar name={userProfile?.display_name} email={user?.email} />
                                <span className="max-w-[120px] truncate text-xs">
                                    {userProfile?.display_name || user?.email?.split('@')[0]}
                                </span>
                                <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {userMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 mt-2 w-52 rounded-xl border border-border/60 bg-card shadow-xl overflow-hidden"
                                    >
                                        <div className="border-b border-border/40 px-4 py-3">
                                            <p className="text-xs font-semibold text-foreground truncate">
                                                {userProfile?.display_name || 'Mi cuenta'}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
                                            {userProfile?.balance != null && (
                                                <p className="mt-1 text-[11px] font-semibold text-primary">
                                                    🪙 {Number(userProfile.balance).toLocaleString('es-ES', { maximumFractionDigits: 0 })} monedas
                                                </p>
                                            )}
                                        </div>
                                        <div className="py-1">
                                            <Link
                                                to="/cuenta"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                                            >
                                                <UserCircle className="h-4 w-4 text-muted-foreground" />
                                                Mi cuenta
                                            </Link>
                                            <button
                                                onClick={handleSignOut}
                                                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Cerrar sesión
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        /* Not logged in: show login button */
                        <Link
                            to="/iniciar-sesion"
                            className="hidden md:flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
                        >
                            Iniciar sesión
                        </Link>
                    )}

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground md:hidden"
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.nav
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-t border-border/40 md:hidden"
                    >
                        <div className="space-y-1 px-4 py-3">
                            {navItems.map(({ path, label, icon: Icon }) => {
                                const isActive = location.pathname === path
                                return (
                                    <Link
                                        key={path}
                                        to={path}
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {label}
                                    </Link>
                                )
                            })}
                            {/* Mobile auth links */}
                            <div className="border-t border-border/40 pt-2 mt-2">
                                {session ? (
                                    <>
                                        <Link
                                            to="/cuenta"
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                                        >
                                            <UserCircle className="h-4 w-4" />
                                            Mi cuenta
                                            {userProfile?.balance != null && (
                                                <span className="ml-auto text-xs font-semibold text-primary">
                                                    🪙 {Number(userProfile.balance).toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                                                </span>
                                            )}
                                        </Link>
                                        <button
                                            onClick={() => { setMobileOpen(false); handleSignOut() }}
                                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Cerrar sesión
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to="/iniciar-sesion"
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                                    >
                                        Iniciar sesión
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
    )
}
