import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Trophy, TrendingUp, TrendingDown, Loader2, AlertCircle } from 'lucide-react'
import { useBettorProfile, useBettorBets, toEUR, formatAmount } from '@/hooks/useBettorProfiles'
import { useAuth } from '@/context/AuthContext'
import SEO from '@/components/SEO'

function formatDate(dateStr) {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('es-ES', {
        day: 'numeric', month: 'short', year: 'numeric'
    })
}

const STATUS_STYLES = {
    pending: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
    won:     'border-green-500/30  bg-green-500/10  text-green-400',
    lost:    'border-red-500/30    bg-red-500/10    text-red-400',
    void:    'border-border/40     bg-secondary      text-muted-foreground',
}
const STATUS_LABELS = { pending: 'Pendiente', won: '¡Ganada!', lost: 'Perdida', void: 'Anulada' }

export default function BettorProfile() {
    const { id } = useParams()
    const { userProfile } = useAuth()
    const preferredCurrency = userProfile?.preferred_currency || 'EUR'

    const { data: profile, isLoading: profileLoading, error: profileError } = useBettorProfile(id)
    const { data: bets = [], isLoading: betsLoading } = useBettorBets(id)

    if (profileLoading) return (
        <div className="flex justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )

    if (profileError || !profile) return (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-muted-foreground">Perfil no encontrado.</p>
            <Link to="/apuestas" className="text-sm text-primary hover:underline">← Volver a Apuestas</Link>
        </div>
    )

    // Stats
    const settled     = bets.filter(b => b.status === 'won' || b.status === 'lost')
    const totalStake  = settled.reduce((s, b) => s + toEUR(b.stake, b.currency), 0)
    const totalProfit = bets.reduce((s, b) => {
        if (b.status === 'won')  return s + toEUR(b.potential_payout - b.stake, b.currency)
        if (b.status === 'lost') return s - toEUR(b.stake, b.currency)
        return s
    }, 0)
    const roi       = totalStake > 0 ? (totalProfit / totalStake) * 100 : 0
    const wonCount  = bets.filter(b => b.status === 'won').length
    const lostCount = bets.filter(b => b.status === 'lost').length
    const voidCount = bets.filter(b => b.status === 'void').length

    return (
        <div className="space-y-6">
            <SEO
                title={`${profile.display_name} — Picks`}
                description={`Historial de picks y estadísticas de ${profile.display_name} en Análisis Fútbol.`}
                path={`/apuestas/bettor/${id}`}
            />

            {/* Back */}
            <Link to="/apuestas" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" /> Volver a Apuestas
            </Link>

            {/* Profile header */}
            <div className="flex items-start gap-4">
                {profile.avatar_url
                    ? <img src={profile.avatar_url} alt={profile.display_name} className="h-16 w-16 rounded-2xl object-cover border border-border/50" />
                    : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-2xl font-black text-primary">
                            {profile.display_name?.[0]?.toUpperCase() || '?'}
                        </div>
                    )
                }
                <div>
                    <h1 className="text-2xl font-black tracking-tight title-contrast">{profile.display_name}</h1>
                    {profile.description && (
                        <p className="mt-1 text-sm text-muted-foreground max-w-lg">{profile.description}</p>
                    )}
                    <p className="mt-1 text-[11px] text-muted-foreground/60">
                        Miembro desde {formatDate(profile.created_at)}
                        {profile.currency && ` · Opera en ${profile.currency}`}
                    </p>
                </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                    { label: 'Total picks',   value: bets.length,                      icon: Trophy },
                    { label: 'Ganadas / Perdidas / Anuladas', value: `${wonCount} / ${lostCount} / ${voidCount}`, icon: TrendingUp },
                    { label: 'ROI',           value: `${roi >= 0 ? '+' : ''}${roi.toFixed(1)}%`,
                      color: roi >= 0 ? 'text-green-400' : 'text-red-400',             icon: roi >= 0 ? TrendingUp : TrendingDown },
                    { label: 'Beneficio',     value: `${totalProfit >= 0 ? '+' : ''}${formatAmount(totalProfit, preferredCurrency)}`,
                      color: totalProfit >= 0 ? 'text-green-400' : 'text-red-400',     icon: Trophy },
                ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="rounded-xl border border-border/40 bg-card/60 px-4 py-3">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Icon className="h-3.5 w-3.5" />
                            <span className="text-[11px]">{label}</span>
                        </div>
                        <p className={`text-lg font-bold ${color || 'text-foreground'}`}>{value}</p>
                    </div>
                ))}
            </div>

            {/* Bet history */}
            <div className="space-y-3">
                <h2 className="text-base font-bold text-foreground">Historial de picks</h2>
                {betsLoading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                ) : bets.length === 0 ? (
                    <div className="rounded-2xl border border-border/40 bg-card/60 py-14 text-center">
                        <Trophy className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                        <p className="text-muted-foreground">Sin picks registrados.</p>
                    </div>
                ) : (
                    bets.map(bet => {
                        const stakeEur  = toEUR(bet.stake, bet.currency)
                        const payoutEur = toEUR(bet.potential_payout, bet.currency)
                        return (
                            <div key={bet.id} className="flex flex-col gap-2 rounded-xl border border-border/40 bg-card/60 p-4 sm:flex-row sm:items-center">
                                <div className="flex-1 min-w-0 space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-sm font-semibold text-foreground">{bet.match_info}</span>
                                        {bet.league && (
                                            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">{bet.league}</span>
                                        )}
                                        {bet.match_date && (
                                            <span className="text-[11px] text-muted-foreground">{formatDate(bet.match_date)}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                                        <span className="font-semibold text-foreground/80">{bet.bet_type} · {bet.selection}</span>
                                        <span>@{Number(bet.odds).toFixed(2)}</span>
                                        <span>{formatAmount(stakeEur, preferredCurrency)}</span>
                                        <span className="text-green-400/80">→ {formatAmount(payoutEur, preferredCurrency)}</span>
                                        {bet.bookmaker && (
                                            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px]">{bet.bookmaker}</span>
                                        )}
                                        {bet.bet_minute != null
                                            ? <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-[10px] text-orange-400">⚡ min. {bet.bet_minute}</span>
                                            : <span className="rounded-full border border-border/40 bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">Pre</span>
                                        }
                                    </div>
                                </div>
                                <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${STATUS_STYLES[bet.status] || STATUS_STYLES.void}`}>
                                    {STATUS_LABELS[bet.status] || bet.status}
                                </span>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
