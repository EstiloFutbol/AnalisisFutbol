import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { parseMatchesCSV } from '@/lib/csvParser'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Upload, CheckCircle, AlertCircle, FileSpreadsheet, LogOut, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function DataImport() {
    const [status, setStatus] = useState('idle') // idle, parsing, uploading, success, error
    const [message, setMessage] = useState('')
    const [stats, setStats] = useState({ total: 0, imported: 0, errors: 0 })
    const [session, setSession] = useState(null)
    const [loadingSession, setLoadingSession] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                navigate('/login')
            } else {
                setSession(session)
            }
            setLoadingSession(false)
        }
        checkSession()
    }, [navigate])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/login')
    }

    if (loadingSession) {
        return <div className="flex justify-center items-center min-h-[50vh]"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    if (!session) return null // Should redirect

    const handleFileUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setStatus('parsing')
        setMessage('Leyendo archivo...')

        const reader = new FileReader()
        reader.onload = async (event) => {
            try {
                const text = event.target.result
                const matches = parseMatchesCSV(text)

                if (matches.length === 0) {
                    setStatus('error')
                    setMessage('No se encontraron partidos válidos en el archivo.')
                    return
                }

                setStatus('uploading')
                setMessage(`Subiendo ${matches.length} partidos a Supabase...`)
                setStats({ total: matches.length, imported: 0, errors: 0 })

                // Batch insert logic to show progress
                let successCount = 0
                let errorCount = 0

                // Chunk size for Supabase
                const CHUNK_SIZE = 50
                for (let i = 0; i < matches.length; i += CHUNK_SIZE) {
                    const chunk = matches.slice(i, i + CHUNK_SIZE)

                    const { error } = await supabase
                        .from('matches')
                        .upsert(chunk, { onConflict: 'id' })

                    if (error) {
                        console.error('Error importing chunk:', error)
                        errorCount += chunk.length
                    } else {
                        successCount += chunk.length
                    }

                    setStats(prev => ({ ...prev, imported: successCount, errors: errorCount }))
                }

                if (errorCount === 0) {
                    setStatus('success')
                    setMessage(`¡Éxito! Se han importado ${successCount} partidos correctamente.`)
                } else {
                    setStatus('warning')
                    setMessage(`Proceso terminado. ${successCount} importados, ${errorCount} fallidos. Revisa la consola para detalles.`)
                }

            } catch (err) {
                console.error(err)
                setStatus('error')
                setMessage(`Error de importación: ${err.message}`)
            }
        }

        reader.onerror = () => {
            setStatus('error')
            setMessage('Error al leer el archivo.')
        }

        reader.readAsText(file)
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight text-white">Importar Datos</h1>
                    <button onClick={handleLogout} className="text-sm flex items-center gap-1 text-red-400 hover:text-red-300">
                        <LogOut className="h-4 w-4" /> Salir
                    </button>
                </div>
                <p className="text-muted-foreground">
                    Sube tu archivo CSV (formato <code>af_th_partidos.csv</code>) para actualizar la base de datos.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileSpreadsheet className="h-5 w-5 text-green-500" />
                        Subida de Archivo
                    </CardTitle>
                    <CardDescription>
                        Selecciona un archivo .csv de tu ordenador. Los partidos existentes (por ID) se actualizarán.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary/50 border-gray-600 bg-background/50">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Haz clic para subir</span> o arrastra y suelta</p>
                                <p className="text-xs text-gray-500">CSV (formato de punto y coma)</p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
                        </label>
                    </div>

                    {status !== 'idle' && (
                        <div className={`p-4 rounded-md border ${status === 'success' ? 'bg-green-900/20 border-green-900 text-green-200' :
                            status === 'error' ? 'bg-red-900/20 border-red-900 text-red-200' :
                                status === 'warning' ? 'bg-yellow-900/20 border-yellow-900 text-yellow-200' :
                                    'bg-blue-900/20 border-blue-900 text-blue-200'
                            }`}>
                            <div className="flex items-center gap-2 mb-2">
                                {status === 'success' ? <CheckCircle className="h-5 w-5" /> :
                                    status === 'error' ? <AlertCircle className="h-5 w-5" /> :
                                        <Upload className="h-5 w-5 animate-bounce" />}
                                <span className="font-semibold">{message}</span>
                            </div>

                            {(status === 'uploading' || status === 'success' || status === 'warning') && (
                                <div className="text-sm space-y-1 mt-2">
                                    <div className="flex justify-between">
                                        <span>Total registros detectados:</span>
                                        <span>{stats.total}</span>
                                    </div>
                                    <div className="flex justify-between text-green-400">
                                        <span>Importados:</span>
                                        <span>{stats.imported}</span>
                                    </div>
                                    {stats.errors > 0 && (
                                        <div className="flex justify-between text-red-400">
                                            <span>Errores:</span>
                                            <span>{stats.errors}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                </CardContent>
            </Card>
        </div>
    )
}
