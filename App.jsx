import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { queryClient } from '@/lib/query-client'
import Navbar from '@/components/layout/Navbar'
import Dashboard from '@/pages/Dashboard'
import Matches from '@/pages/Matches'
import MatchDetail from '@/pages/MatchDetail'
import Statistics from '@/pages/Statistics'

import SelfService from '@/pages/SelfService'
import DataImport from '@/pages/DataImport'
import Login from '@/pages/Login'

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <div className="min-h-screen bg-background">
                    <Navbar />
                    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/matches" element={<Matches />} />
                            <Route path="/matches/:matchId" element={<MatchDetail />} />
                            <Route path="/statistics" element={<Statistics />} />
                            <Route path="/self-service" element={<SelfService />} />
                            <Route path="/import" element={<DataImport />} />
                            <Route path="/login" element={<Login />} />
                        </Routes>
                    </main>
                </div>
            </BrowserRouter>
        </QueryClientProvider>
    )
}

export default App
