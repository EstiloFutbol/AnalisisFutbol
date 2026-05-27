/**
 * LeagueContext — global active league selection.
 *
 * Persists the selected league ID in localStorage so the choice
 * survives navigation between Dashboard, Analisis, and other pages.
 *
 * Dashboard writes here whenever the user changes league (via URL params).
 * Analisis reads here on mount so the selection is already in sync.
 */
import { createContext, useContext, useState, useCallback } from 'react'

const LeagueContext = createContext(null)

const STORAGE_KEY = 'af_activeLeagueId'

function readStored() {
    try {
        const v = localStorage.getItem(STORAGE_KEY)
        return v ? parseInt(v, 10) : null
    } catch {
        return null
    }
}

export function LeagueProvider({ children }) {
    const [activeLeagueId, _setActiveLeagueId] = useState(readStored)

    const setActiveLeagueId = useCallback((id) => {
        _setActiveLeagueId(id)
        try {
            if (id != null) localStorage.setItem(STORAGE_KEY, String(id))
            else localStorage.removeItem(STORAGE_KEY)
        } catch { /* ignore */ }
    }, [])

    return (
        <LeagueContext.Provider value={{ activeLeagueId, setActiveLeagueId }}>
            {children}
        </LeagueContext.Provider>
    )
}

export function useLeagueContext() {
    const ctx = useContext(LeagueContext)
    if (!ctx) throw new Error('useLeagueContext must be used inside <LeagueProvider>')
    return ctx
}
