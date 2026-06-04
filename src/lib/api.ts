const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers)
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const res = await fetch(`${API_URL}/api${path}`, {
    ...options,
    credentials: 'include',
    headers,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erro na requisição' }))
    throw new ApiError(err.error ?? 'Erro na requisição', res.status)
  }

  if (res.status === 204) return null as T
  return res.json() as Promise<T>
}

export { API_URL }
