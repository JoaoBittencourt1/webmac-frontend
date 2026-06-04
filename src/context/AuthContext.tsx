import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { authClient, type AuthUser } from '../lib/auth-client'
import { apiFetch } from '../lib/api'
import type { RegisterInput } from '../lib/schemas'

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterInput) => Promise<void>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshSession = useCallback(async () => {
    const { data } = await authClient.getSession()
    if (!data?.user) {
      setUser(null)
      return
    }

    try {
      const me = await apiFetch<{ id: string; name: string; email: string; role: AuthUser['role'] }>(
        '/me',
      )
      setUser({
        id: me.id,
        name: me.name,
        email: me.email,
        role: me.role,
        emailVerified: data.user.emailVerified,
        image: data.user.image,
      })
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    refreshSession().finally(() => setLoading(false))
  }, [refreshSession])

  const login = useCallback(async (email: string, password: string) => {
    const trimmedEmail = email.trim()
    if (!trimmedEmail || !password.trim()) {
      throw new Error('Preencha e-mail e senha.')
    }

    const { error } = await authClient.signIn.email({
      email: trimmedEmail,
      password,
    })

    if (error) {
      throw new Error(error.message ?? 'Não foi possível entrar.')
    }

    await refreshSession()
  }, [refreshSession])

  const register = useCallback(async (data: RegisterInput) => {
    await apiFetch('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    await refreshSession()
  }, [refreshSession])

  const logout = useCallback(async () => {
    await authClient.signOut()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refreshSession }),
    [user, loading, login, register, logout, refreshSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
