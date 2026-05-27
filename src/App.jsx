import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { queryClient } from '@/lib/query-client'
import Navbar from '@/components/layout/Navbar'
import Landing from '@/pages/Landing'
import Dashboard from '@/pages/Dashboard'
import MatchDetail from '@/pages/MatchDetail'

import Analisis from '@/pages/Analisis'
import Login from '@/pages/Login'
import Admin from '@/pages/Admin'
import Account from '@/pages/Account'
import Betting from '@/pages/Betting'

import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import CookieConsent from '@/components/CookieConsent'

function App() {
    return (
        <HelmetProvider>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <AuthProvider>
                        <BrowserRouter>
                            <div className="min-h-screen bg-background">
                                <Navbar />
                                <CookieConsent />
                                <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                                    <Routes>
                                        {/* Landing page */}
                                        <Route path="/" element={<Landing />} />

                                        {/* Analytics Dashboard */}
                                        <Route path="/dashboard" element={<Dashboard />} />

                                        {/* Match detail — Spanish SEO route */}
                                        <Route path="/partido/:matchId" element={<MatchDetail />} />
                                        {/* Legacy route redirect */}
                                        <Route path="/matches/:matchId" element={<Navigate to={window.location.pathname.replace('/matches/', '/partido/')} replace />} />

                                        {/* Betting — Spanish SEO route */}
                                        <Route path="/mis-apuestas" element={<Betting />} />
                                        <Route path="/betting" element={<Navigate to="/mis-apuestas" replace />} />

                                        {/* Análisis IA — unified page */}
                                        <Route path="/analisis" element={<Analisis />} />
                                        {/* Legacy redirects → /analisis */}
                                        <Route path="/predicciones" element={<Navigate to="/analisis" replace />} />
                                        <Route path="/ml-predictions" element={<Navigate to="/analisis" replace />} />
                                        <Route path="/ia-bet" element={<Navigate to="/analisis" replace />} />
                                        <Route path="/ai" element={<Navigate to="/analisis" replace />} />
                                        <Route path="/explorar" element={<Navigate to="/analisis" replace />} />
                                        <Route path="/self-service" element={<Navigate to="/analisis" replace />} />

                                        {/* Auth & Admin */}
                                        <Route path="/iniciar-sesion" element={<Login />} />
                                        <Route path="/login" element={<Navigate to="/iniciar-sesion" replace />} />
                                        <Route path="/admin" element={<Admin />} />
                                        <Route path="/cuenta" element={<Account />} />
                                        <Route path="/account" element={<Navigate to="/cuenta" replace />} />

                                        {/* Legacy route redirects */}
                                        <Route path="/matches" element={<Navigate to="/dashboard?tab=partidos" replace />} />
                                        <Route path="/players" element={<Navigate to="/dashboard?tab=jugadores" replace />} />
                                    </Routes>
                                </main>
                            </div>
                        </BrowserRouter>
                    </AuthProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </HelmetProvider>
    )
}

export default App
