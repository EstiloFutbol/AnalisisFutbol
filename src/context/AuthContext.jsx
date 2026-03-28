import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext({
    session: null,
    user: null,
    userProfile: null,
    isAdmin: false,
    loading: true,
    signOut: async () => { },
    refreshProfile: async () => { },
})


export function AuthProvider({ children }) {
    const [session, setSession] = useState(null)
    const [userProfile, setUserProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchProfile = useCallback(async (userId) => {
        if (!userId) {
            setUserProfile(null)
            return
        }
        const { data } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', userId)
            .single()
        setUserProfile(data || null)
    }, [])

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            fetchProfile(session?.user?.id).finally(() => setLoading(false))
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            fetchProfile(session?.user?.id)
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [fetchProfile])

    const signOut = useCallback(async () => {
        await supabase.auth.signOut()
        setUserProfile(null)
    }, [])

    const value = {
        session,
        user: session?.user ?? null,
        userProfile,
        isAdmin: userProfile?.is_admin === true,
        loading,
        signOut,
        refreshProfile: () => fetchProfile(session?.user?.id),
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
