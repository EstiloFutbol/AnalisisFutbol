import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { queryClient } from '@/lib/query-client'
import Navbar from '@/components/layout/Navbar'
import Landing from '@/pages/Landing'
import Dashboard from '@/pages/Dashboard'
import MatchDetail from '@/pages/MatchDetail'

import SelfService from '@/pages/SelfService'
import Login from '@/pages/Login'
import Admin from '@/pages/Admin'
import Account from '@/pages/Account'
import Betting from '@/pages/Betting'
import AIAssistant from '@/pages/AIAssistant'

import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'

function App() {
    return (
        <HelmetProvider>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <AuthProvider>
                        <BrowserRouter>
                            <div className="min-h-screen bg-background">
                                <Navbar />
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

                                        {/* AI Bet — Spanish SEO route */}
                                        <Route path="/ia-bet" element={<AIAssistant />} />
                                        <Route path="/ai" element={<Navigate to="/ia-bet" replace />} />

                                        {/* Explorar — Spanish SEO route */}
                                        <Route path="/explorar" element={<SelfService />} />
                                        <Route path="/self-service" element={<Navigate to="/explorar" replace />} />

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
