import { createContext, useContext, useState } from 'react'

export const TIMEZONE_OPTIONS = [
    { value: 'Europe/Madrid',                   label: 'Madrid'    },
    { value: 'UTC',                             label: 'UTC'       },
    { value: 'America/Mexico_City',             label: 'México'    },
    { value: 'America/Argentina/Buenos_Aires',  label: 'Argentina' },
    { value: 'America/Bogota',                  label: 'Colombia'  },
]

// kick_off_time is stored as Europe/Madrid local time.
// To display in another timezone: treat stored time + date as Madrid local,
// derive the UTC equivalent, then format in the target zone.
export function convertKickOff(kickOffTime, matchDate, timezone) {
    if (!kickOffTime) return null
    const raw = kickOffTime.slice(0, 5) // "HH:MM"
    if (!timezone || timezone === 'Europe/Madrid') return raw
    try {
        const dateStr = matchDate || new Date().toISOString().split('T')[0]
        // Step 1: treat raw time as fake UTC to probe Madrid's offset on this date
        const fakeUtc = new Date(`${dateStr}T${raw}:00Z`)
        const madridParts = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Europe/Madrid',
            hour: 'numeric', minute: 'numeric', hour12: false,
        }).formatToParts(fakeUtc)
        const madH = Number(madridParts.find(p => p.type === 'hour').value)
        const madM = Number(madridParts.find(p => p.type === 'minute').value)
        // Step 2: compute Madrid's offset from the difference
        const [h, m] = raw.split(':').map(Number)
        const offsetMins = (madH * 60 + madM) - (h * 60 + m)
        // Step 3: actual UTC = stored Madrid time − offset
        const actualUtc = new Date(fakeUtc.getTime() - offsetMins * 60_000)
        // Step 4: format in target timezone
        return new Intl.DateTimeFormat('es-ES', {
            timeZone: timezone,
            hour: '2-digit', minute: '2-digit', hour12: false,
        }).format(actualUtc)
    } catch {
        return raw
    }
}

const TimezoneContext = createContext({
    timezone: 'Europe/Madrid',
    setTimezone: () => {},
    formatKickOff: (t) => t?.slice(0, 5) ?? '',
})

export function TimezoneProvider({ children }) {
    const [timezone, setTz] = useState(() =>
        localStorage.getItem('timezone') || 'Europe/Madrid'
    )

    const setTimezone = (tz) => {
        setTz(tz)
        localStorage.setItem('timezone', tz)
    }

    const formatKickOff = (kickOffTime, matchDate) =>
        convertKickOff(kickOffTime, matchDate, timezone) ?? ''

    return (
        <TimezoneContext.Provider value={{ timezone, setTimezone, formatKickOff }}>
            {children}
        </TimezoneContext.Provider>
    )
}

export function useTimezone() {
    return useContext(TimezoneContext)
}
