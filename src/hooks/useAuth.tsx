import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User, UserRole } from '../types'
import { demoBuyer, demoSeller, demoAdmin } from '../lib/demo-data'
import { applyTheme } from '../lib/theme'

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (role: UserRole) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const DEMO_USERS: Record<UserRole, User> = {
  buyer: demoBuyer,
  seller: demoSeller,
  admin: demoAdmin,
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('pm_demo_role') as UserRole | null
    if (stored && DEMO_USERS[stored]) {
      setUser(DEMO_USERS[stored])
      applyTheme(stored)
    }
    setLoading(false)
  }, [])

  const login = (role: UserRole) => {
    localStorage.setItem('pm_demo_role', role)
    setUser(DEMO_USERS[role])
    applyTheme(role)
  }

  const logout = () => {
    localStorage.removeItem('pm_demo_role')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
