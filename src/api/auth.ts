import { apiRequest } from './http'

export interface AuthUserResponse {
  id: string
  nome: string
  email: string
  role: string
  document: string
  clienteId: string | null
}

export interface LoginResponse {
  token: string
  user: AuthUserResponse
}

export interface MeResponse {
  id: string
  nome: string
  email: string
  role: string
  document: string
  cliente: {
    id: string
    cpf: string
    nome: string
    telefone: string | null
    endereco: string | null
  } | null
}

export function login(document: string, password: string) {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { document, password },
  })
}

export function register(document: string, password: string) {
  return apiRequest<LoginResponse>('/auth/register', {
    method: 'POST',
    body: { document, password },
  })
}

export function forgotPassword(identifier: string) {
  return apiRequest<{ message: string }>('/auth/forgot-password', {
    method: 'POST',
    body: { identifier },
  })
}

export function fetchMe(token: string) {
  return apiRequest<MeResponse>('/auth/me', { token })
}
