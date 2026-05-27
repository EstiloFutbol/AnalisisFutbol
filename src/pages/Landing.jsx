import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    BarChart3, Trophy, Bot, Search, TrendingUp, Shield,
    ArrowRight, Activity, Heart, AlertTriangle, BookOpen, Phone
} from 'lucide-react'
import SEO from '@/components/SEO'

const features = [
    {
        icon: BarChart3,
        title: 'Estadísticas Históricas',
        description: 'Datos de goles, córners, tarjetas y xG actualizados con cada jornada. Toma decisiones con contexto real, no con suposiciones.',
        link: '/dashboard',
        linkLabel: 'Ver Dashboard',
        color: 'terra',
    },
    {
        icon: Trophy,
        title: 'Seguimiento de Apuestas',
        description: 'Registra tus picks y analiza tu rendimiento histórico. Detecta qué mercados te funcionan y cuáles no.',
        link: '/mis-apuestas',
        linkLabel: 'Mis Apuestas',
        color: 'sand',
    },
    {
        icon: Bot,
        title: 'IA Bet Assistant',
        description: 'Asistente de inteligencia artificial que analiza patrones históricos y sugiere picks razonados con argumentos transparentes.',
        link: '/ia-bet',
        linkLabel: 'Probar IA',
        color: 'olive',
    },
    {
        icon: Search,
        title: 'Explorar Datos',
        description: 'Filtra y cruza estadísticas por equipo, jornada o mercado. El análisis que hagas aquí es tuyo — nosotros solo te damos los datos.',
        link: '/explorar',
        linkLabel: 'Explorar',
        color: 'forest',
    },
]

const stats = [
    { value: '+380', label: 'Partidos analizados' },
    { value: '7',    label: 'Mercados de apuestas' },
    { value: '99%',  label: 'Datos verificados' },
    { value: 'IA',   label: 'Asistente inteligente' },
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
        icon: 'text-[#606c38] dark:text-[#dda15e]',
        hover: 'hover:border-[#283618]/60 hover:shadow-[#283618]/10',
    },
    forest: {
        bg: 'bg-[#283618]/10 dark:bg-[#283618]/30',
        border: 'border-[#283618]/30 dark:border-[#283618]/40',
        icon: 'text-[#606c38] dark:text-[#dda15e]',
        hover: 'hover:border-[#283618]/60 hover:shadow-[#283618]/10',
    },
}

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const stagger = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.12 } },
}

export default function Landing() {
    return (
        <>
            <SEO
                title="Inicio — Análisis Fútbol"
                description="Plataforma de análisis de fútbol con estadísticas avanzadas y asistente IA para tomar decisiones de apuestas informadas. Apuesta con responsabilidad."
                path="/"
            />

            <div className="space-y-20 pb-20">

                {/* ── HERO ── */}
                <section className="relative overflow-hidden pt-10 pb-4">
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
                                    background:  'rgba(188,108,37,0.08)',
                                    color:        '#bc6c25',
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
                            Apuesta con{' '}
                            <span
                                className="block"
                                style={{
                                    background: 'linear-gradient(135deg, #bc6c25 0%, #dda15e 50%, #283618 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                Datos Reales
                            </span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            variants={fadeUp}
                            className="max-w-xl text-base font-medium text-muted-foreground sm:text-lg"
                        >
                            Estadísticas avanzadas de La Liga y asistente IA para que tomes{' '}
                            <strong className="text-foreground">decisiones fundamentadas</strong>, no impulsivas.
                            La información es poder — úsala con responsabilidad.
                        </motion.p>

                        {/* CTAs */}
                        <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3 pt-2">
                            <Link
                                to="/dashboard"
                                id="cta-dashboard"
                                className="group inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
                                style={{
                                    background:  'linear-gradient(135deg, #bc6c25, #dda15e)',
                                    boxShadow:   '0 4px 24px rgba(188,108,37,0.35)',
                                }}
                            >
                                Ver Dashboard
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link
                                to="/ia-bet"
                                id="cta-ia"
                                className="inline-flex items-center gap-2 rounded-xl border border-foreground/20 px-6 py-3 text-sm font-bold text-foreground transition-all hover:-translate-y-0.5 hover:bg-foreground/5"
                            >
                                <Bot className="h-4 w-4" />
                                Probar IA
                            </Link>
                        </motion.div>
                    </motion.div>
                </section>

                {/* ── PURPOSE STATEMENT ── */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="rounded-2xl border border-primary/20 bg-primary/5 px-6 py-8 sm:px-10"
                >
                    <div className="mx-auto max-w-2xl text-center space-y-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                            <BookOpen className="h-3.5 w-3.5" />
                            Nuestra filosofía
                        </div>
                        <h2 className="text-xl font-black text-foreground sm:text-2xl">
                            Datos para decidir mejor, no para apostar más
                        </h2>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            Esta plataforma existe para que comprendas el fútbol en profundidad y puedas
                            evaluar una apuesta con contexto real. <strong className="text-foreground">No predecimos resultados
                            garantizados</strong> — nadie puede hacerlo. Lo que ofrecemos son tendencias,
                            patrones y probabilidades históricas que te ayudan a razonar mejor.
                        </p>
                        <p className="text-sm font-semibold text-foreground/80">
                            Un análisis sólido no elimina el riesgo, pero sí reduce las decisiones impulsivas.
                        </p>
                    </div>
                </motion.section>

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
                                background:  'rgba(96,108,56,0.06)',
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
                                    <div
                                        aria-hidden
                                        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                        style={{ background: 'radial-gradient(circle, rgba(188,108,37,0.12) 0%, transparent 70%)' }}
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
                            { step: '01', icon: TrendingUp, title: 'Explora los datos', desc: 'Consulta estadísticas históricas de partidos, equipos y jugadores. Entiende el contexto antes de decidir.' },
                            { step: '02', icon: Bot,        title: 'Consulta la IA',    desc: 'El asistente analiza los patrones y te ofrece picks razonados con argumentos claros y transparentes.' },
                            { step: '03', icon: Shield,     title: 'Decide con cabeza', desc: 'Registra tus picks, sigue tu rendimiento y aprende de cada resultado. La disciplina es tu mejor herramienta.' },
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

                {/* ── RESPONSIBLE GAMBLING ── */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-8 sm:p-10"
                >
                    <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
                        {/* Icon */}
                        <div className="shrink-0 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10">
                            <Heart className="h-8 w-8 text-amber-500" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-3">
                            <h2 className="text-xl font-black text-foreground sm:text-2xl">
                                Las apuestas pueden ser un problema
                            </h2>
                            <p className="text-sm leading-relaxed text-muted-foreground max-w-2xl">
                                Las apuestas deportivas son una forma de entretenimiento, pero para algunas personas
                                pueden convertirse en una adicción. Si sientes que estás apostando más de lo que puedes
                                permitirte, que tus apuestas afectan tu vida personal o económica, o que es difícil
                                parar — <strong className="text-foreground">busca ayuda ahora</strong>.
                            </p>

                            {/* Warning signs */}
                            <div className="grid gap-2 sm:grid-cols-3 pt-1">
                                {[
                                    'Apostas para recuperar pérdidas',
                                    'Piensas en apuestas constantemente',
                                    'Mientes sobre cuánto apuestas',
                                ].map(sign => (
                                    <div key={sign} className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2.5 text-left">
                                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                                        <span className="text-xs text-muted-foreground">{sign}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Help resources */}
                            <div className="flex flex-wrap gap-3 pt-2">
                                <a
                                    href="https://www.ordenacionjuego.es/participantes-juego/juego-seguro/comportamientos-riesgo"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-600 dark:text-amber-400 transition-colors hover:bg-amber-500/20"
                                >
                                    <BookOpen className="h-3.5 w-3.5" />
                                    Juego Responsable
                                </a>
                                <a
                                    href="tel:900200225"
                                    className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-600 dark:text-amber-400 transition-colors hover:bg-amber-500/20"
                                >
                                    <Phone className="h-3.5 w-3.5" />
                                    900 200 225 · Ayuda gratuita 24h
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ── BOTTOM CTA ── */}
                <motion.section
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="cta-section relative overflow-hidden rounded-3xl p-10 text-center"
                >
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 hidden dark:block"
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
                            className="inline-flex items-center gap-2 rounded-xl border border-foreground/20 bg-white/60 dark:bg-background/10 px-6 py-3 text-sm font-bold text-foreground backdrop-blur-sm transition-all hover:bg-white/90 dark:hover:bg-background/20"
                        >
                            Crear cuenta
                        </Link>
                    </div>

                    {/* Responsible gambling footer note */}
                    <p className="relative mt-8 text-[11px] text-muted-foreground/50 max-w-md mx-auto leading-relaxed">
                        Esta plataforma es una herramienta de análisis. No garantiza resultados ni ganancias.
                        Las apuestas implican riesgo económico. Apuesta solo lo que puedas permitirte perder.
                        +18 · Juega con responsabilidad.
                    </p>
                </motion.section>

            </div>
        </>
    )
}
