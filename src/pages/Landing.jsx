import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart3, Trophy, Bot, Search, TrendingUp, Shield, ArrowRight, Activity } from 'lucide-react'
import SEO from '@/components/SEO'

const features = [
    {
        icon: BarChart3,
        title: 'Estadísticas en Tiempo Real',
        description: 'Accede a datos actualizados de goles, córners, tarjetas y mucho más para cada jornada de la liga.',
        link: '/dashboard',
        linkLabel: 'Ver Dashboard',
        color: 'terra',
    },
    {
        icon: Trophy,
        title: 'Mis Apuestas',
        description: 'Registra y gestiona tus apuestas deportivas. Lleva un histórico de tus picks y analiza tu rendimiento.',
        link: '/mis-apuestas',
        linkLabel: 'Mis Apuestas',
        color: 'sand',
    },
    {
        icon: Bot,
        title: 'IA Bet Assistant',
        description: 'Nuestro asistente de inteligencia artificial analiza patrones históricos y te sugiere picks razonados.',
        link: '/ia-bet',
        linkLabel: 'Probar IA',
        color: 'olive',
    },
    {
        icon: Search,
        title: 'Explorar Datos',
        description: 'Filtra y cruza estadísticas por equipo, jornada o mercado. Crea tu propio análisis personalizado.',
        link: '/explorar',
        linkLabel: 'Explorar',
        color: 'forest',
    },
]

const stats = [
    { value: '+380', label: 'Partidos analizados' },
    { value: '7', label: 'Mercados de apuestas' },
    { value: '99%', label: 'Datos verificados' },
    { value: 'IA', label: 'Asistente inteligente' },
]

const colorMap = {
    terra: {
        bg: 'bg-[#bc6c25]/10 dark:bg-[#bc6c25]/15',
        border: 'border-[#bc6c25]/30',
        icon: 'text-[#bc6c25]',
        hover: 'hover:border-[#bc6c25]/60 hover:shadow-[#bc6c25]/10',
    },
    sand: {
        bg: 'bg-[#dda15e]/10 dark:bg-[#dda15e]/15',
        border: 'border-[#dda15e]/30',
        icon: 'text-[#dda15e]',
        hover: 'hover:border-[#dda15e]/60 hover:shadow-[#dda15e]/10',
    },
    olive: {
        bg: 'bg-[#283618]/10 dark:bg-[#283618]/15',
        border: 'border-[#283618]/30',
        icon: 'text-[#283618] dark:text-[#4a5c2e]',
        hover: 'hover:border-[#283618]/60 hover:shadow-[#283618]/10',
    },
    forest: {
        bg: 'bg-[#283618]/10 dark:bg-[#283618]/30',
        border: 'border-[#283618]/30 dark:border-[#283618]/40',
        icon: 'text-[#283618] dark:text-[#4a5c2e]',
        hover: 'hover:border-[#283618]/60 hover:shadow-[#283618]/10',
    },
}

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
}

export default function Landing() {
    return (
        <>
            <SEO
                title="Inicio — Análisis Fútbol"
                description="Plataforma de análisis de fútbol con estadísticas avanzadas, asistente IA de apuestas y explorador de datos para La Liga 2025-2026."
                path="/"
            />

            <div className="space-y-20 pb-20">

                {/* ── HERO ── */}
                <section className="relative overflow-hidden pt-10 pb-4">
                    {/* Decorative background blobs */}
                    <div
                        aria-hidden
                        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(96,108,56,0.18) 0%, transparent 70%)' }}
                    />
                    <div
                        aria-hidden
                        className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(188,108,37,0.15) 0%, transparent 70%)' }}
                    />

                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={stagger}
                        className="relative flex flex-col items-center text-center gap-6 px-4"
                    >
                        {/* Badge */}
                        <motion.div variants={fadeUp}>
                            <span
                                className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
                                style={{
                                    borderColor: 'rgba(188,108,37,0.4)',
                                    background: 'rgba(188,108,37,0.08)',
                                    color: '#bc6c25',
                                }}
                            >
                                <Activity className="h-3.5 w-3.5" />
                                Temporada 2025 · 2026
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            variants={fadeUp}
                            className="text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl text-foreground"
                        >
                            Análisis Fútbol{' '}
                            <span
                                className="block"
                                style={{
                                    background: 'linear-gradient(135deg, #bc6c25 0%, #dda15e 50%, #283618 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                con Datos Puros
                            </span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            variants={fadeUp}
                            className="max-w-xl text-base font-medium text-muted-foreground sm:text-lg"
                        >
                            Estadísticas avanzadas de La Liga, asistente de inteligencia artificial para apuestas y
                            un explorador de datos para que tomes decisiones fundamentadas.
                        </motion.p>

                        {/* CTAs */}
                        <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3 pt-2">
                            <Link
                                to="/dashboard"
                                id="cta-dashboard"
                                className="group inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
                                style={{
                                    background: 'linear-gradient(135deg, #bc6c25, #dda15e)',
                                    boxShadow: '0 4px 24px rgba(188,108,37,0.35)',
                                }}
                            >
                                Ver Dashboard
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link
                                to="/ia-bet"
                                id="cta-ia"
                                className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-bold transition-all hover:-translate-y-0.5"
                                style={{
                                    borderColor: 'rgba(40,54,24,0.5)',
                                    color: '#283618',
                                }}
                            >
                                <Bot className="h-4 w-4" />
                                Probar IA
                            </Link>
                        </motion.div>
                    </motion.div>
                </section>

                {/* ── STATS STRIP ── */}
                <motion.section
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-60px' }}
                    variants={stagger}
                    className="grid grid-cols-2 gap-4 sm:grid-cols-4"
                >
                    {stats.map(({ value, label }) => (
                        <motion.div
                            key={label}
                            variants={fadeUp}
                            className="flex flex-col items-center justify-center rounded-2xl border p-6 text-center"
                            style={{
                                borderColor: 'rgba(96,108,56,0.25)',
                                background: 'rgba(96,108,56,0.06)',
                            }}
                        >
                            <span
                                className="text-3xl font-black tabular-nums"
                                style={{
                                    background: 'linear-gradient(135deg, #bc6c25, #dda15e)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                {value}
                            </span>
                            <span className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                {label}
                            </span>
                        </motion.div>
                    ))}
                </motion.section>

                {/* ── FEATURES ── */}
                <section className="space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-black tracking-tight sm:text-3xl text-black dark:text-white">
                            Todo lo que necesitas en un solo lugar
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Desde estadísticas brutas hasta recomendaciones de IA
                        </p>
                    </div>

                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: '-60px' }}
                        variants={stagger}
                        className="grid gap-4 sm:grid-cols-2"
                    >
                        {features.map(({ icon: Icon, title, description, link, linkLabel, color }) => {
                            const c = colorMap[color]
                            return (
                                <motion.div
                                    key={title}
                                    variants={fadeUp}
                                    className={`group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${c.border} ${c.hover}`}
                                    style={{ background: 'hsl(var(--card))' }}
                                >
                                    {/* Glow blob */}
                                    <div
                                        aria-hidden
                                        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                        style={{ background: `radial-gradient(circle, rgba(188,108,37,0.12) 0%, transparent 70%)` }}
                                    />
                                    <div className={`mb-4 inline-flex rounded-xl border p-3 ${c.bg} ${c.border}`}>
                                        <Icon className={`h-5 w-5 ${c.icon}`} />
                                    </div>
                                    <h3 className="mb-2 text-base font-black text-foreground">{title}</h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                                    <Link
                                        to={link}
                                        className={`mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${c.icon} hover:opacity-80`}
                                    >
                                        {linkLabel}
                                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                </section>

                {/* ── HOW IT WORKS ── */}
                <section className="space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-black tracking-tight sm:text-3xl text-foreground">¿Cómo funciona?</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Tres pasos para mejorar tus análisis
                        </p>
                    </div>

                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: '-60px' }}
                        variants={stagger}
                        className="grid gap-4 sm:grid-cols-3"
                    >
                        {[
                            { step: '01', icon: TrendingUp, title: 'Explora los datos', desc: 'Consulta estadísticas históricas de partidos, equipos y jugadores de la temporada.' },
                            { step: '02', icon: Bot, title: 'Consulta la IA', desc: 'El asistente analiza los patrones y te ofrece picks razonados para la próxima jornada.' },
                            { step: '03', icon: Shield, title: 'Registra tus apuestas', desc: 'Guarda tus picks, sigue tu rendimiento y aprende de cada resultado.' },
                        ].map(({ step, icon: Icon, title, desc }) => (
                            <motion.div
                                key={step}
                                variants={fadeUp}
                                className="relative rounded-2xl border border-border/50 p-6"
                                style={{ background: 'hsl(var(--card))' }}
                            >
                                <span
                                    className="absolute right-5 top-5 text-5xl font-black opacity-10 select-none"
                                    style={{ color: '#bc6c25' }}
                                >
                                    {step}
                                </span>
                                <div
                                    className="mb-3 inline-flex rounded-xl p-2.5"
                                    style={{ background: 'rgba(188,108,37,0.1)', border: '1px solid rgba(188,108,37,0.25)' }}
                                >
                                    <Icon className="h-5 w-5" style={{ color: '#bc6c25' }} />
                                </div>
                                <h3 className="mb-1.5 text-sm font-black text-foreground">{title}</h3>
                                <p className="text-xs leading-relaxed text-muted-foreground">{desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* ── BOTTOM CTA ── */}
                <motion.section
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="relative overflow-hidden rounded-3xl p-10 text-center"
                    style={{
                        background: 'linear-gradient(135deg, #283618 0%, #283618 60%, #bc6c25 100%)',
                    }}
                >
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0"
                        style={{ background: 'radial-gradient(circle at 70% 40%, rgba(221,161,94,0.25) 0%, transparent 60%)' }}
                    />
                    <h2 className="relative text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                        ¿Listo para analizar como un profesional?
                    </h2>
                    <p className="relative mt-3 text-sm font-medium text-muted-foreground">
                        Accede gratis a todas las estadísticas de La Liga 2025-2026
                    </p>
                    <div className="relative mt-6 flex flex-wrap justify-center gap-3">
                        <Link
                            to="/dashboard"
                            id="cta-bottom-dashboard"
                            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#283618] shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
                        >
                            <BarChart3 className="h-4 w-4" />
                            Ir al Dashboard
                        </Link>
                        <Link
                            to="/iniciar-sesion"
                            id="cta-bottom-login"
                            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/10 px-6 py-3 text-sm font-bold text-foreground backdrop-blur-sm transition-all hover:bg-background/20"
                        >
                            Crear cuenta
                        </Link>
                    </div>
                </motion.section>

            </div>
        </>
    )
}
