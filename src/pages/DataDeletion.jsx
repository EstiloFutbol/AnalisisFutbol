import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trash2, AlertTriangle, Check, Loader2, X } from 'lucide-react'

export default function DataDeletion() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const token = searchParams.get('token')

    const [step, setStep] = useState('confirm') // 'confirm' | 'loading' | 'success' | 'error'
    const [errorMsg, setErrorMsg] = useState('')

    const handleConfirm = async () => {
        if (!token) {
            setErrorMsg('Enlace inválido. No se encontró el token de eliminación.')
            setStep('error')
            return
        }
        setStep('loading')
        try {
            const res = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/confirm-deletion`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
                        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                    },
                    body: JSON.stringify({ token }),
                }
            )
            const body = await res.json().catch(() => ({}))
            if (!res.ok) {
                setErrorMsg(body.error || body.message || `Error ${res.status}. Comprueba que la función está desplegada.`)
                setStep('error')
            } else {
                setStep('success')
            }
        } catch {
            setErrorMsg('Error de red. Inténtalo de nuevo.')
            setStep('error')
        }
    }

    return (
        <div className="flex min-h-[75vh] items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="w-full max-w-md"
            >
                <div className="rounded-2xl border border-border/60 bg-card/80 p-8 shadow-2xl backdrop-blur-sm">

                    {step === 'success' && (
                        <div className="text-center space-y-4">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20">
                                <Check className="h-7 w-7 text-green-500" />
                            </div>
                            <h1 className="text-2xl font-black tracking-tight text-foreground">
                                Datos eliminados
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Todos tus datos han sido eliminados permanentemente de nuestros sistemas.
                            </p>
                            <button
                                onClick={() => navigate('/')}
                                className="mt-2 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                            >
                                Ir al inicio
                            </button>
                        </div>
                    )}

                    {step === 'error' && (
                        <div className="text-center space-y-4">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
                                <X className="h-7 w-7 text-red-400" />
                            </div>
                            <h1 className="text-2xl font-black tracking-tight text-foreground">
                                Error
                            </h1>
                            <p className="text-sm text-red-400">{errorMsg}</p>
                            <button
                                onClick={() => navigate('/')}
                                className="mt-2 w-full rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Ir al inicio
                            </button>
                        </div>
                    )}

                    {(step === 'confirm' || step === 'loading') && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
                                    <Trash2 className="h-7 w-7 text-red-400" />
                                </div>
                                <h1 className="text-2xl font-black tracking-tight text-foreground">
                                    Eliminar todos mis datos
                                </h1>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Esta acción es permanente e irreversible
                                </p>
                            </div>

                            <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
                                <AlertTriangle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                                <p className="text-sm text-red-400">
                                    Se eliminarán permanentemente tu email y todos los datos asociados a tu cuenta de nuestros registros. No podremos recuperarlos.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <button
                                    onClick={handleConfirm}
                                    disabled={step === 'loading'}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                                >
                                    {step === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
                                    Sí, eliminar todos mis datos
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    disabled={step === 'loading'}
                                    className="w-full rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-60"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}
