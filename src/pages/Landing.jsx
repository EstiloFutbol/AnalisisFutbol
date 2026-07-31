import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    ArrowRight, BarChart3, Bot, CalendarDays, ChartNoAxesCombined,
    ChevronRight, Goal, ShieldCheck, Sparkles, Trophy, UsersRound,
} from 'lucide-react'
import SEO from '@/components/SEO'

const europeanCompetitions = [
    { name: 'Champions League', shortName: 'UCL', description: 'La élite europea, jornada a jornada.', accent: '#2f5bd3', glow: 'rgba(47, 91, 211, 0.22)', icon: Trophy },
    { name: 'Europa League', shortName: 'UEL', description: 'Análisis de la competición que nunca baja el ritmo.', accent: '#e56620', glow: 'rgba(229, 102, 32, 0.22)', icon: Goal },
    { name: 'Conference League', shortName: 'UECL', description: 'Más clubes, más historias, más datos que descubrir.', accent: '#27a76d', glow: 'rgba(39, 167, 109, 0.22)', icon: Sparkles },
]

const leagues = [
    { country: 'España', competition: 'LaLiga', mark: 'ES', accent: '#ef3340' },
    { country: 'Inglaterra', competition: 'Premier League', mark: 'EN', accent: '#7b1fa2' },
    { country: 'Italia', competition: 'Serie A', mark: 'IT', accent: '#1677c8' },
    { country: 'Alemania', competition: 'Bundesliga', mark: 'DE', accent: '#e32219' },
    { country: 'Francia', competition: 'Ligue 1', mark: 'FR', accent: '#123f86' },
]

const platformFeatures = [
    { icon: ChartNoAxesCombined, title: 'Datos que cuentan la historia', description: 'Goles, xG, córners, tarjetas y tendencias para entender cada partido con contexto.' },
    { icon: CalendarDays, title: 'Sigue toda la temporada', description: 'Partidos, clasificaciones y rendimiento de equipos en las grandes ligas y Europa.' },
    { icon: Bot, title: 'Análisis asistido por IA', description: 'Consulta patrones y mercados con explicaciones claras, no con promesas vacías.' },
]

const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AnálisisFútbol',
    url: 'https://analisisfutbol.com/',
    description: 'Estadísticas, partidos y análisis de las grandes ligas europeas y competiciones UEFA.',
    about: ['UEFA Champions League', 'UEFA Europa League', 'UEFA Conference League', 'LaLiga', 'Premier League', 'Serie A', 'Bundesliga', 'Ligue 1'],
}

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function Landing() {
    return (
        <>
            <SEO
                title="Estadísticas y análisis de fútbol europeo"
                description="Sigue la Champions League, Europa League, Conference League y las cinco grandes ligas europeas con datos, estadísticas y análisis de fútbol."
                path="/"
                keywords="Champions League, Europa League, Conference League, LaLiga, Premier League, Serie A, Bundesliga, Ligue 1, estadísticas de fútbol, análisis de fútbol"
                structuredData={structuredData}
            />

            <div className="space-y-20 pb-20 sm:space-y-28">
                <section className="relative isolate overflow-hidden rounded-[2rem] border border-border/60 bg-card px-6 py-14 sm:px-10 sm:py-20 lg:px-16">
                    <div aria-hidden className="absolute -left-24 -top-28 h-80 w-80 rounded-full blur-3xl" style={{ background: 'rgba(47, 91, 211, 0.18)' }} />
                    <div aria-hidden className="absolute -bottom-36 right-0 h-96 w-96 rounded-full blur-3xl" style={{ background: 'rgba(188, 108, 37, 0.16)' }} />
                    <div aria-hidden className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:32px_32px]" />

                    <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }} className="relative max-w-3xl">
                        <motion.div variants={fadeUp} className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-primary">
                            <Sparkles className="h-3.5 w-3.5" /> El fútbol europeo, en profundidad
                        </motion.div>
                        <motion.h1 variants={fadeUp} className="max-w-3xl text-4xl font-black leading-[1.02] tracking-tight text-foreground sm:text-6xl">
                            Toda Europa.<span className="block text-primary">Un solo lugar para entenderla.</span>
                        </motion.h1>
                        <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                            Datos, partidos y tendencias de la Champions, Europa y Conference League, junto a las cinco grandes ligas. Menos ruido. Mejor contexto.
                        </motion.p>
                        <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
                            <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5">Explorar competiciones <ArrowRight className="h-4 w-4" /></Link>
                            <Link to="/analisis" className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/60 px-5 py-3 text-sm font-bold text-foreground transition-colors hover:bg-muted">Ver análisis <BarChart3 className="h-4 w-4" /></Link>
                        </motion.div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.55 }} className="relative mt-12 grid max-w-3xl grid-cols-3 divide-x divide-border/60 rounded-2xl border border-border/60 bg-background/50 p-4 backdrop-blur sm:mt-16 sm:p-5">
                        {[['3', 'Competiciones UEFA'], ['5', 'Grandes ligas'], ['1', 'Visión completa']].map(([value, label]) => (
                            <div key={label} className="px-2 text-center sm:px-5"><p className="text-2xl font-black text-foreground sm:text-3xl">{value}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground sm:text-xs">{label}</p></div>
                        ))}
                    </motion.div>
                </section>

                <section>
                    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div><p className="text-xs font-black uppercase tracking-[0.16em] text-[#bc6c25]">Noches europeas</p><h2 className="mt-2 text-3xl font-black tracking-tight text-foreground sm:text-4xl">Las competiciones que mueven Europa</h2></div>
                        <Link to="/dashboard?tab=partidos" className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">Ver todos los partidos <ChevronRight className="h-4 w-4" /></Link>
                    </div>
                    <div className="grid gap-4 lg:grid-cols-3">
                        {europeanCompetitions.map(({ name, shortName, description, accent, glow, icon: Icon }, index) => (
                            <motion.article key={name} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ delay: index * 0.08 }} className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-xl">
                                <div aria-hidden className="absolute -right-10 -top-10 h-36 w-36 rounded-full blur-2xl" style={{ background: glow }} />
                                <div className="relative flex items-start justify-between gap-4"><div><span className="text-xs font-black tracking-[0.18em]" style={{ color: accent }}>{shortName}</span><h3 className="mt-3 text-xl font-black text-foreground">{name}</h3></div><div className="rounded-xl p-3" style={{ background: glow, color: accent }}><Icon className="h-5 w-5" /></div></div>
                                <p className="relative mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>
                                <Link to="/dashboard" className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-foreground transition-colors group-hover:text-primary">Descubrir datos <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
                            </motion.article>
                        ))}
                    </div>
                </section>

                <section className="rounded-3xl border border-border/60 bg-muted/35 p-6 sm:p-10">
                    <div className="max-w-2xl"><p className="text-xs font-black uppercase tracking-[0.16em] text-[#bc6c25]">La élite doméstica</p><h2 className="mt-2 text-3xl font-black tracking-tight text-foreground sm:text-4xl">Las cinco grandes ligas, conectadas</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">Sigue el pulso de cada campeonato y pon sus tendencias en perspectiva europea.</p></div>
                    <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                        {leagues.map(({ country, competition, mark, accent }) => (
                            <Link key={competition} to="/dashboard" className="group rounded-2xl border border-border/60 bg-card p-4 transition-all hover:-translate-y-1 hover:border-primary/35 hover:shadow-lg"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl text-xs font-black text-white" style={{ background: accent }}>{mark}</span><span className="min-w-0"><span className="block truncate text-sm font-black text-foreground">{competition}</span><span className="block text-xs text-muted-foreground">{country}</span></span></div></Link>
                        ))}
                    </div>
                </section>

                <section>
                    <div className="mx-auto max-w-2xl text-center"><p className="text-xs font-black uppercase tracking-[0.16em] text-[#bc6c25]">Hecho para analizar</p><h2 className="mt-2 text-3xl font-black tracking-tight text-foreground sm:text-4xl">Mira el fútbol con más contexto</h2></div>
                    <div className="mt-10 grid gap-4 md:grid-cols-3">
                        {platformFeatures.map(({ icon: Icon, title, description }) => (
                            <article key={title} className="rounded-2xl border border-border/60 bg-card p-6"><div className="inline-flex rounded-xl bg-primary/10 p-3 text-primary"><Icon className="h-5 w-5" /></div><h3 className="mt-5 text-lg font-black text-foreground">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p></article>
                        ))}
                    </div>
                </section>

                <section className="relative overflow-hidden rounded-3xl bg-[#283618] px-6 py-12 text-center text-white sm:px-10 sm:py-16">
                    <div aria-hidden className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#dda15e]/15 blur-3xl" />
                    <div className="relative mx-auto max-w-2xl"><ShieldCheck className="mx-auto h-7 w-7 text-[#dda15e]" /><h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Analiza con datos. Decide con cabeza.</h2><p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base">AnálisisFútbol es una herramienta de información. Las estadísticas ayudan a entender el juego, pero no garantizan resultados.</p><div className="mt-7 flex flex-wrap justify-center gap-3"><Link to="/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#283618] transition-transform hover:-translate-y-0.5">Empezar a explorar <ArrowRight className="h-4 w-4" /></Link><Link to="/iniciar-sesion" className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"><UsersRound className="h-4 w-4" /> Crear cuenta</Link></div><p className="mt-8 text-xs leading-relaxed text-white/45">Las apuestas implican riesgo económico. Juega solo si eres mayor de edad y con responsabilidad.</p></div>
                </section>
            </div>
        </>
    )
}
