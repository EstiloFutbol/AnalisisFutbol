import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, CalendarDays, LayoutDashboard, Menu, X, TrendingUp } from 'lucide-react'

const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/matches', label: 'Partidos', icon: CalendarDays },
    { path: '/statistics', label: 'Estadísticas', icon: TrendingUp },
]

export default function Navbar() {
    const location = useLocation()
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <img
                        src="/src/frontend/assets/Logo_web/Logo.png"
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

                {/* Mobile Toggle */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground md:hidden"
                >
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
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
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
    )
}
