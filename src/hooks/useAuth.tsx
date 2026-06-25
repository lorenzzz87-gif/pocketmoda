import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User } from '../types'
import { supabase } from '../lib/supabase'
import { applyTheme } from '../lib/theme'

interface AuthContextValue {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string, role: 'buyer' | 'seller', company?: string, whatsapp?: string) => Promise<string | null>
  signIn: (email: string, password: string) => Promise<string | null>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = async (uid: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .single()
    if (data) {
      setUser(data as User)
      applyTheme(data.role)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadProfile(session.user.id).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user.id)
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: 'buyer' | 'seller',
    company?: string,
    whatsapp?: string
  ): Promise<string | null> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    })
    if (error) return error.message

    // 更新额外字段
    if (company || whatsapp) {
      const { data: { user: u } } = await supabase.auth.getUser()
      if (u) {
        await supabase.from('profiles').update({ company, whatsapp }).eq('id', u.id)
      }
    }
    return null
  }

  const signIn = async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error ? error.message : null
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
