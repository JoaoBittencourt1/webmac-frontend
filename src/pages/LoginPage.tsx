import { Navigate, useLocation } from 'react-router-dom'
import { LoginForm } from '../components/login/LoginForm'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const { user } = useAuth()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } } | null)?.from
    ?.pathname

  if (user) {
    return <Navigate to={from ?? '/'} replace />
  }

  return <LoginForm />
}
