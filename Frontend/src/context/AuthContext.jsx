import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { authApi } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // true while we check for an existing session

  const refresh = useCallback(async () => {
    try {
      const { data } = await authApi.me()
      setUser(data.user)
      return data.user
    } catch {
      setUser(null)
      return null
    }
  }, [])

  useEffect(() => {
    refresh().finally(() => setLoading(false))
  }, [refresh])

  async function login(credentials) {
    const { data } = await authApi.login(credentials)
    // login response includes the user, but re-fetch through /me so we always
    // have one source of truth for shape { id, name, email, role, verified }
    if (data.user) setUser(data.user)
    else await refresh()
    return data
  }

  async function logout() {
    await authApi.logout()
    setUser(null)
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isInstructor: user?.role === 'instructor',
    login,
    logout,
    refresh,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
