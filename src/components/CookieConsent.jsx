import { useState, useEffect } from 'react'
import { X, Cookie, Shield, Settings } from 'lucide-react'

const COOKIE_CONSENT_KEY = 'af_cookie_consent'
const COOKIE_EXPIRY_DAYS = 365

// Cookie categories with Spanish descriptions
const COOKIE_CATEGORIES = {
    necessary: {
        name: 'Essenciales',
        description: 'Necesarias para el funcionamiento básico del sitio web.',
        required: true,
    },
    analytics: {
        name: 'Analíticas',
        description: 'Nos permiten analizar el tráfico y mejorar nuestro servicio.',
        required: false,
    },
    marketing: {
        name: 'Marketing',
        description: 'Usadas para mostrar publicidad relevante.',
        required: false,
    },
}

export default function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const [consent, setConsent] = useState(null)

    useEffect(() => {
        // Check if user has already made a choice
        const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY)
        if (!storedConsent) {
            setShowBanner(true)
        } else {
            setConsent(JSON.parse(storedConsent))
        }
    }, [])

    const saveConsent = (preferences) => {
        const consentData = {
            ...preferences,
            timestamp: new Date().toISOString(),
        }
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData))
        setConsent(consentData)
        setShowBanner(false)
        setShowSettings(false)

        // If analytics cookies are accepted, initialize analytics
        if (preferences.analytics) {
            initializeAnalytics()
        }
    }

    const initializeAnalytics = () => {
        // Placeholder for analytics initialization (e.g., Google Analytics)
        // Add your analytics code here when needed
        console.log('Analytics cookies accepted')
    }

    const acceptAll = () => {
        saveConsent({
            necessary: true,
            analytics: true,
            marketing: true,
        })
    }

    const rejectAll = () => {
        saveConsent({
            necessary: true,
            analytics: false,
            marketing: false,
        })
    }

    const handleSaveSettings = () => {
        const preferences = {
            necessary: true,
            analytics: document.getElementById('cookie-analytics')?.checked || false,
            marketing: document.getElementById('cookie-marketing')?.checked || false,
        }
        saveConsent(preferences)
    }

    // Main banner
    if (!showBanner) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
            {!showSettings ? (
                // Main consent banner
                <div className="mx-auto max-w-4xl rounded-2xl bg-card border border-border p-6 shadow-2xl animate-in slide-in-from-bottom-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex gap-4">
                            <div className="hidden shrink-0 sm:flex">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <Cookie className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-xl font-bold text-foreground">
                                    🍪 Política de Cookies
                                </h2>
                                <p className="text-sm text-muted-foreground max-w-2xl">
                                    Utilizamos cookies propias y de terceros para mejorar tu experiencia de navegación, 
                                    mostrarte contenido personalizado, analizar nuestro tráfico y proporcionar funciones de redes sociales. 
                                    Según el <a href="https://www.aepd.es/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">RGPD</a> y la 
                                    <a href="https://www.mindef.gob.es/portal/delegacionprotecciondedatos/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"> LOPDGDD</a>, 
                                    necesitamos tu consentimiento explícito para usar cookies no esenciales.
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Puedes aceptar todas, rechazar las no esenciales o personalizar tu preferencias.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">
                            <button
                                onClick={() => setShowSettings(true)}
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                            >
                                <Settings className="h-4 w-4" />
                                Personalizar
                            </button>
                            <button
                                onClick={rejectAll}
                                className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                            >
                                Rechazar
                            </button>
                            <button
                                onClick={acceptAll}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                                <Shield className="h-4 w-4" />
                                Aceptar todo
                            </button>
                        </div>
                    </div>

                    {/* Cookie categories preview */}
                    <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-border">
                        {Object.entries(COOKIE_CATEGORIES).map(([key, category]) => (
                            <span
                                key={key}
                                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                                    category.required
                                        ? 'bg-primary/10 text-primary'
                                        : 'bg-muted text-muted-foreground'
                                }`}
                            >
                                {category.required && <Shield className="h-3 w-3" />}
                                {category.name}
                            </span>
                        ))}
                    </div>
                </div>
            ) : (
                // Settings panel
                <div className="mx-auto max-w-2xl rounded-2xl bg-card border border-border p-6 shadow-2xl animate-in slide-in-from-bottom-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-foreground">
                            Configuración de Cookies
                        </h2>
                        <button
                            onClick={() => setShowSettings(false)}
                            className="rounded-lg p-2 hover:bg-muted"
                        >
                            <X className="h-5 w-5 text-muted-foreground" />
                        </button>
                    </div>

                    <p className="text-sm text-muted-foreground mb-6">
                        Gestiona qué cookies quieres aceptar. Las cookies esenciales son necesarias 
                        para el funcionamiento del sitio y no pueden desactivarse.
                    </p>

                    <div className="space-y-4">
                        {Object.entries(COOKIE_CATEGORIES).map(([key, category]) => (
                            <div
                                key={key}
                                className="flex items-start gap-4 rounded-lg border border-border p-4"
                            >
                                <div className="flex h-5 items-center">
                                    <input
                                        id={`cookie-${key}`}
                                        type="checkbox"
                                        defaultChecked={category.required}
                                        disabled={category.required}
                                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label
                                        htmlFor={`cookie-${key}`}
                                        className="flex items-center gap-2 font-medium text-foreground"
                                    >
                                        {category.name}
                                        {category.required && (
                                            <span className="text-xs text-muted-foreground">
                                                (obligatoria)
                                            </span>
                                        )}
                                    </label>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {category.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex gap-3">
                        <button
                            onClick={() => setShowSettings(false)}
                            className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSaveSettings}
                            className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            Guardar preferencias
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

// Helper hook to check consent status
export function useCookieConsent() {
    const [consent, setConsent] = useState(null)

    useEffect(() => {
        const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
        if (stored) {
            setConsent(JSON.parse(stored))
        }
    }, [])

    const hasConsent = (category) => {
        if (!consent) return false
        return consent[category] === true
    }

    return { consent, hasConsent }
}