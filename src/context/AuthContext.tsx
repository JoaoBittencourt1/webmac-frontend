import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import * as authApi from '../api/auth'
import { ApiError } from '../api/http'

export interface AuthUser {
  id: string
  document: string
  nome: string
  token: string
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  login: (document: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'webmac-auth'

interface StoredAuth {
  token: string
  user: AuthUser
}

function loadStoredAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as StoredAuth
  } catch {
    return null
  }
}

function persistAuth(auth: StoredAuth | null) {
  if (auth) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

function toAuthUser(response: authApi.AuthUserResponse, token: string): AuthUser {
  return {
    id: response.id,
    document: response.document,
    nome: response.nome,
    token,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const stored = loadStoredAuth()
  const [user, setUser] = useState<AuthUser | null>(stored?.user ?? null)
  const [loading, setLoading] = useState(Boolean(stored?.token))

  useEffect(() => {
    const session = loadStoredAuth()
    if (!session?.token) {
      setLoading(false)
      return
    }

    let cancelled = false

    authApi
      .fetchMe(session.token)
      .then((profile) => {
        if (cancelled) return
        const nextUser: AuthUser = {
          id: profile.id,
          document: profile.document,
          nome: profile.nome,
          token: session.token,
        }
        persistAuth({ token: session.token, user: nextUser })
        setUser(nextUser)
      })
      .catch(() => {
        if (cancelled) return
        persistAuth(null)
        setUser(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (document: string, password: string) => {
    const trimmed = document.trim()
    if (!trimmed || !password.trim()) {
      throw new Error('Preencha CPF/CNPJ e senha.')
    }

    try {
      const { token, user: apiUser } = await authApi.login(trimmed, password)
      const nextUser = toAuthUser(apiUser, token)
      persistAuth({ token, user: nextUser })
      setUser(nextUser)
    } catch (err) {
      if (err instanceof ApiError) {
        throw new Error(err.message)
      }
      throw new Error('Não foi possível conectar ao servidor.')
    }
  }, [])

  const logout = useCallback(() => {
    persistAuth(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout],
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
