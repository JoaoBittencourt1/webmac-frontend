import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { fetchMyPedidos, type Pedido } from '../api/pedidos'
import { ApiError } from '../api/http'
import { useAuth } from '../context/AuthContext'

export function usePedidos(enabled = true) {
  const { user } = useAuth()
  const location = useLocation()
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const shouldFetch = enabled && location.pathname === '/pedidos'

  useEffect(() => {
    if (!shouldFetch || !user?.token) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    let cancelled = false

    fetchMyPedidos(user.token)
      .then((data) => {
        if (!cancelled) setPedidos(data)
      })
      .catch((err) => {
        if (cancelled) return
        setError(
          err instanceof ApiError
            ? err.message
            : 'Não foi possível carregar os pedidos.',
        )
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [shouldFetch, user?.token])

  return { pedidos, loading: shouldFetch && loading, error }
}
