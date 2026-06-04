import { createAuthClient } from 'better-auth/react'
import { API_URL } from './api'

export const authClient = createAuthClient({
  baseURL: API_URL,
})

export type AuthUser = {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'CLIENTE' | 'MECANICO'
  emailVerified: boolean
  image?: string | null
}
