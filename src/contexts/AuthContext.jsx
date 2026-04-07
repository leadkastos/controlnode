import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
const AuthContext = createContext({})
export const useAuth = () => useContext(AuthContext)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (error) console.error('Profile fetch error:', error)
      setProfile(data ?? null)
    } catch (e) {
      console.error('Profile fetch exception:', e)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        setLoading(true)
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })
    return () => subscription.unsubscribe()
  }, [])
  const signUp = async (email, password, fullName) => {
    return await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } })
  }
  const signIn = async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password })
  }
  const signOut = async () => {
    await supabase.auth.signOut()
  }
  const isAdmin = profile?.role === 'super_admin'
  const isActive = profile?.subscription_status === 'active' || profile?.subscription_status === 'trial'
  const isBanned = profile?.is_banned === true
  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, isAdmin, isActive, isBanned }}>
      {children}
    </AuthContext.Provider>
  )
}
