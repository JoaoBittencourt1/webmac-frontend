import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PanelCard } from '../ui/PanelCard'
import { useAuth } from '../../context/AuthContext'

export function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [document, setDocument] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await login(document, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PanelCard title="ENTRAR" titleId="login-title">
      <form className="panel-card__form" onSubmit={handleSubmit} noValidate>
        <label className="panel-card__field">
          <span className="visually-hidden">CPF ou CNPJ</span>
          <input
            type="text"
            name="document"
            placeholder="CPF ou CNPJ"
            autoComplete="username"
            value={document}
            onChange={(e) => setDocument(e.target.value)}
            disabled={loading}
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
        <Link to="/cadastro" className="panel-card__link">
          Cadastre-se
        </Link>
      </div>
    </PanelCard>
  )
}
