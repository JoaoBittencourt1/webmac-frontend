import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PanelCard } from '../ui/PanelCard'
import { useAuth } from '../../context/AuthContext'

interface LoginFormProps {
  isMechanic?: boolean
}

export function LoginForm({ isMechanic = false }: LoginFormProps) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar.')
    } finally {
      setLoading(false)
    }
  }

  const signupPath = isMechanic ? '/cadastro?tipo=mecanico' : '/cadastro'

  return (
    <PanelCard
      title={isMechanic ? 'ENTRAR COMO MECÂNICO' : 'ENTRAR'}
      titleId="login-title"
    >
      <form className="panel-card__form" onSubmit={handleSubmit} noValidate>
        <label className="panel-card__field">
          <span className="visually-hidden">E-mail</span>
          <input
            type="email"
            name="email"
            placeholder="E-MAIL"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </label>

        <label className="panel-card__field">
          <span className="visually-hidden">Senha</span>
          <input
            type="password"
            name="password"
            placeholder="SENHA"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </label>

        {error && (
          <p className="panel-card__error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="panel-card__submit" disabled={loading}>
          {loading ? 'ENTRANDO…' : 'ENTRAR'}
        </button>
      </form>

      <div className="panel-card__links">
        <Link to="/esqueci-senha" className="panel-card__link">
          Esqueceu a senha?
        </Link>
        <p className="panel-card__text">Não tem conta?</p>
        <Link to={signupPath} className="panel-card__link">
          Cadastre-se
        </Link>
        {!isMechanic ? (
          <Link to="/entrar/mecanico" className="panel-card__link">
            É mecânico?
          </Link>
        ) : (
          <Link to="/entrar" className="panel-card__link">
            Sou cliente
          </Link>
        )}
      </div>
    </PanelCard>
  )
}
