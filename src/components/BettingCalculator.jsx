import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calculator, TrendingUp, Target, AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

// Bet types with their historical win condition checker
const BET_TYPES = [
    {
        id: 'home_win', label: 'Victoria Local (1)',
        check: (m) => (m.home_goals || 0) > (m.away_goals || 0),
    },
    {
        id: 'draw', label: 'Empate (X)',
        check: (m) => (m.home_goals || 0) === (m.away_goals || 0),
    },
    {
        id: 'away_win', label: 'Victoria Visitante (2)',
        check: (m) => (m.home_goals || 0) < (m.away_goals || 0),
    },
    {
        id: 'over_1_5', label: 'Más de 1.5 goles',
        check: (m) => ((m.home_goals || 0) + (m.away_goals || 0)) > 1.5,
    },
    {
        id: 'under_1_5', label: 'Menos de 1.5 goles',
        check: (m) => ((m.home_goals || 0) + (m.away_goals || 0)) < 1.5,
    },
    {
        id: 'over_2_5', label: 'Más de 2.5 goles',
        check: (m) => ((m.home_goals || 0) + (m.away_goals || 0)) > 2.5,
    },
    {
        id: 'under_2_5', label: 'Menos de 2.5 goles',
        check: (m) => ((m.home_goals || 0) + (m.away_goals || 0)) < 2.5,
    },
    {
        id: 'over_3_5', label: 'Más de 3.5 goles',
        check: (m) => ((m.home_goals || 0) + (m.away_goals || 0)) > 3.5,
    },
    {
        id: 'under_3_5', label: 'Menos de 3.5 goles',
        check: (m) => ((m.home_goals || 0) + (m.away_goals || 0)) < 3.5,
    },
    {
        id: 'btts_yes', label: 'Ambos Marcan (Sí)',
        check: (m) => (m.home_goals || 0) > 0 && (m.away_goals || 0) > 0,
    },
    {
        id: 'btts_no', label: 'Ambos Marcan (No)',
        check: (m) => (m.home_goals || 0) === 0 || (m.away_goals || 0) === 0,
    },
    {
        id: 'over_8_5_corners', label: 'Más de 8.5 córners',
        check: (m) => (m.total_corners || 0) > 8.5,
    },
    {
        id: 'under_8_5_corners', label: 'Menos de 8.5 córners',
        check: (m) => (m.total_corners || 0) < 8.5,
    },
    {
        id: 'over_10_5_corners', label: 'Más de 10.5 córners',
        check: (m) => (m.total_corners || 0) > 10.5,
    },
    {
        id: 'over_3_5_cards', label: 'Más de 3.5 tarjetas',
        check: (m) => ((m.home_cards || 0) + (m.away_cards || 0)) > 3.5,
    },
    {
        id: 'under_3_5_cards', label: 'Menos de 3.5 tarjetas',
        check: (m) => ((m.home_cards || 0) + (m.away_cards || 0)) < 3.5,
    },
]

export default function BettingCalculator({ matches = [] }) {
    const [betType, setBetType] = useState('over_2_5')
    const [betAmount, setBetAmount] = useState(10)
    const [bookmakerOdds, setBookmakerOdds] = useState('')

    const stats = useMemo(() => {
        if (!matches.length) return null

        const selectedBet = BET_TYPES.find(b => b.id === betType)
        if (!selectedBet) return null

        // Count matches where this bet type has valid data
        let totalMatches = 0
        let wins = 0

        matches.forEach(m => {
            // Skip matches without score data
            if (m.home_goals === null && m.away_goals === null) return
            // For corner bets, skip matches without corner data
            if (betType.includes('corners') && !m.total_corners) return
            // For card bets, skip matches without card data
            if (betType.includes('cards') && m.home_cards === null && m.away_cards === null) return

            totalMatches++
            if (selectedBet.check(m)) wins++
        })

        if (totalMatches === 0) return null

        const winRate = wins / totalMatches
        const minOdds = winRate > 0 ? (1 / winRate) : Infinity
        // Add a small margin (5%) for safety
        const safeMinOdds = winRate > 0 ? (1 / winRate) * 1.05 : Infinity

        return {
            totalMatches,
            wins,
            losses: totalMatches - wins,
            winRate,
            minOdds,
            safeMinOdds,
        }
    }, [matches, betType])

    // Profit calculations
    const profitCalc = useMemo(() => {
        if (!stats || !betAmount) return null

        const odds = bookmakerOdds ? Number(bookmakerOdds) : stats.safeMinOdds
        const profit = (odds * betAmount) - betAmount
        const expectedValue = (stats.winRate * profit) - ((1 - stats.winRate) * betAmount)
        const roi = (expectedValue / betAmount) * 100

        // Simulate 100 bets
        const totalBets = 100
        const expectedWins = Math.round(stats.winRate * totalBets)
        const expectedLosses = totalBets - expectedWins
        const totalProfit = (expectedWins * profit) - (expectedLosses * betAmount)

        return {
            odds,
            profit,
            expectedValue,
            roi,
            totalBets,
            expectedWins,
            expectedLosses,
            totalProfit,
            isValueBet: bookmakerOdds ? Number(bookmakerOdds) > stats.minOdds : false,
        }
    }, [stats, betAmount, bookmakerOdds])

    const selectClass = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"

    return (
        <Card className="border-amber-500/20 bg-gradient-to-br from-background to-amber-950/10">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-amber-400" />
                    Calculadora de Apuestas
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    Calcula la cuota mínima necesaria para obtener beneficio a largo plazo basándose en datos históricos.
                </p>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Inputs */}
                <div className="grid gap-4 sm:grid-cols-3">
                    {/* Bet Type */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-300">Tipo de Apuesta</Label>
                        <select
                            className={selectClass}
                            value={betType}
                            onChange={(e) => setBetType(e.target.value)}
                        >
                            <optgroup label="Resultado">
                                {BET_TYPES.filter(b => ['home_win', 'draw', 'away_win'].includes(b.id)).map(b => (
                                    <option key={b.id} value={b.id}>{b.label}</option>
                                ))}
                            </optgroup>
                            <optgroup label="Goles">
                                {BET_TYPES.filter(b => b.id.includes('over_') && b.id.includes('goles') || b.id.includes('under_') && b.id.includes('goles') || b.id === 'over_1_5' || b.id === 'under_1_5' || b.id === 'over_2_5' || b.id === 'under_2_5' || b.id === 'over_3_5' || b.id === 'under_3_5').map(b => (
                                    <option key={b.id} value={b.id}>{b.label}</option>
                                ))}
                            </optgroup>
                            <optgroup label="Ambos Marcan (BTTS)">
                                {BET_TYPES.filter(b => b.id.includes('btts')).map(b => (
                                    <option key={b.id} value={b.id}>{b.label}</option>
                                ))}
                            </optgroup>
                            <optgroup label="Córners">
                                {BET_TYPES.filter(b => b.id.includes('corners')).map(b => (
                                    <option key={b.id} value={b.id}>{b.label}</option>
                                ))}
                            </optgroup>
                            <optgroup label="Tarjetas">
                                {BET_TYPES.filter(b => b.id.includes('cards')).map(b => (
                                    <option key={b.id} value={b.id}>{b.label}</option>
                                ))}
                            </optgroup>
                        </select>
                    </div>

                    {/* Bet Amount */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-300">Cantidad a Apostar (€)</Label>
                        <Input
                            type="number"
                            min="1"
                            step="1"
                            value={betAmount}
                            onChange={(e) => setBetAmount(Number(e.target.value) || 0)}
                            placeholder="10"
                        />
                    </div>

                    {/* Bookmaker Odds (optional) */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-300">Cuota del Bookmaker (opcional)</Label>
                        <Input
                            type="number"
                            min="1"
                            step="0.01"
                            value={bookmakerOdds}
                            onChange={(e) => setBookmakerOdds(e.target.value)}
                            placeholder="Ej: 1.85"
                        />
                    </div>
                </div>

                {/* Results */}
                {stats && (
                    <div className="space-y-4">
                        {/* Historical Stats */}
                        <div className="grid gap-3 sm:grid-cols-4">
                            <div className="rounded-lg bg-slate-800/60 border border-slate-700/50 p-3 text-center">
                                <p className="text-xs text-muted-foreground mb-1">Partidos Analizados</p>
                                <p className="text-2xl font-bold text-white">{stats.totalMatches}</p>
                            </div>
                            <div className="rounded-lg bg-slate-800/60 border border-slate-700/50 p-3 text-center">
                                <p className="text-xs text-muted-foreground mb-1">Aciertos / Fallos</p>
                                <p className="text-2xl font-bold">
                                    <span className="text-green-400">{stats.wins}</span>
                                    <span className="text-slate-500 mx-1">/</span>
                                    <span className="text-red-400">{stats.losses}</span>
                                </p>
                            </div>
                            <div className="rounded-lg bg-slate-800/60 border border-slate-700/50 p-3 text-center">
                                <p className="text-xs text-muted-foreground mb-1">Tasa de Acierto</p>
                                <p className="text-2xl font-bold text-amber-400">{(stats.winRate * 100).toFixed(1)}%</p>
                            </div>
                            <div className="rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 p-3 text-center">
                                <p className="text-xs text-amber-300/80 mb-1">Cuota Mínima Rentable</p>
                                <p className="text-2xl font-bold text-amber-400">{stats.safeMinOdds === Infinity ? '∞' : stats.safeMinOdds.toFixed(2)}</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">Incluye 5% margen seguridad</p>
                            </div>
                        </div>

                        {/* Win Rate Bar */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Distribución histórica</span>
                                <span>{(stats.winRate * 100).toFixed(1)}% acierto</span>
                            </div>
                            <div className="h-3 rounded-full bg-slate-700/50 overflow-hidden flex">
                                <div
                                    className="bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500 rounded-l-full"
                                    style={{ width: `${stats.winRate * 100}%` }}
                                />
                                <div
                                    className="bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500 rounded-r-full"
                                    style={{ width: `${(1 - stats.winRate) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Bookmaker Odds Analysis */}
                        {bookmakerOdds && profitCalc && (
                            <div className={cn(
                                "rounded-lg border p-4 space-y-3",
                                profitCalc.isValueBet
                                    ? "bg-green-500/5 border-green-500/30"
                                    : "bg-red-500/5 border-red-500/30"
                            )}>
                                <div className="flex items-center gap-2">
                                    {profitCalc.isValueBet ? (
                                        <>
                                            <CheckCircle2 className="h-5 w-5 text-green-400" />
                                            <span className="font-semibold text-green-400">¡Apuesta de Valor! (Value Bet)</span>
                                        </>
                                    ) : (
                                        <>
                                            <AlertTriangle className="h-5 w-5 text-red-400" />
                                            <span className="font-semibold text-red-400">No es apuesta de valor</span>
                                        </>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {profitCalc.isValueBet
                                        ? `La cuota ${Number(bookmakerOdds).toFixed(2)} es mayor que la cuota justa (${stats.minOdds.toFixed(2)}). Históricamente, esta apuesta tiene valor esperado positivo.`
                                        : `La cuota ${Number(bookmakerOdds).toFixed(2)} es menor que la cuota justa (${stats.minOdds.toFixed(2)}). A largo plazo, perderías dinero con esta apuesta.`
                                    }
                                </p>

                                <div className="grid gap-3 sm:grid-cols-3 pt-2">
                                    <div className="text-center">
                                        <p className="text-xs text-muted-foreground">Beneficio por Acierto</p>
                                        <p className="text-lg font-bold text-white">+{profitCalc.profit.toFixed(2)}€</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-muted-foreground">Valor Esperado por Apuesta</p>
                                        <p className={cn("text-lg font-bold", profitCalc.expectedValue >= 0 ? "text-green-400" : "text-red-400")}>
                                            {profitCalc.expectedValue >= 0 ? '+' : ''}{profitCalc.expectedValue.toFixed(2)}€
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-muted-foreground">ROI Esperado</p>
                                        <p className={cn("text-lg font-bold", profitCalc.roi >= 0 ? "text-green-400" : "text-red-400")}>
                                            {profitCalc.roi >= 0 ? '+' : ''}{profitCalc.roi.toFixed(1)}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 100-Bet Simulation */}
                        {profitCalc && bookmakerOdds && (
                            <div className="rounded-lg bg-slate-800/40 border border-slate-700/50 p-4 space-y-2">
                                <h4 className="text-sm font-medium flex items-center gap-2 text-slate-300">
                                    <TrendingUp className="h-4 w-4" />
                                    Simulación: 100 apuestas de {betAmount}€ a cuota {Number(bookmakerOdds).toFixed(2)}
                                </h4>
                                <div className="grid gap-3 sm:grid-cols-4 text-center">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Inversión Total</p>
                                        <p className="text-lg font-semibold text-white">{(betAmount * 100).toFixed(0)}€</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Aciertos Esperados</p>
                                        <p className="text-lg font-semibold text-green-400">{profitCalc.expectedWins}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Fallos Esperados</p>
                                        <p className="text-lg font-semibold text-red-400">{profitCalc.expectedLosses}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Beneficio Neto</p>
                                        <p className={cn("text-lg font-bold", profitCalc.totalProfit >= 0 ? "text-green-400" : "text-red-400")}>
                                            {profitCalc.totalProfit >= 0 ? '+' : ''}{profitCalc.totalProfit.toFixed(2)}€
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Info Note */}
                        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
                            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <div>
                                <p>La <strong>cuota mínima rentable</strong> se calcula como <code className="text-amber-400">1 / tasa_acierto × 1.05</code> (con 5% de margen de seguridad).</p>
                                <p className="mt-1">Solo deberías apostar cuando la cuota del bookmaker sea <strong>mayor</strong> que la cuota mínima rentable. Los filtros de la página afectan el análisis — filtra por equipo o liga para datos más específicos.</p>
                            </div>
                        </div>
                    </div>
                )}

                {!stats && matches.length > 0 && (
                    <div className="text-center text-muted-foreground py-8">
                        No hay datos suficientes para este tipo de apuesta.
                    </div>
                )}

                {matches.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                        Cargando datos de partidos...
                    </div>
                )}

            </CardContent>
        </Card>
    )
}
