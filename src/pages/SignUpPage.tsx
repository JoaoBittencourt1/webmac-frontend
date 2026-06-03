import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PanelCard } from '../components/ui/PanelCard'
import { register } from '../api/auth'
import { ApiError } from '../api/http'

export function SignUpPage() {
  const navigate = useNavigate()
  const [document, setDocument] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (password !== confirmPassword) return

    setError(null)
    setLoading(true)

    try {
      await register(document.trim(), password)
      navigate('/entrar', { replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Não foi possível conectar ao servidor.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <PanelCard title="CADASTRE-SE" titleId="signup-title">
      <form className="panel-card__form" onSubmit={handleSubmit}>
        <label className="panel-card__field">
          <span className="visually-hidden">CPF ou CNPJ</span>
          <input
            type="text"
            placeholder="CPF ou CNPJ"
            value={document}
            onChange={(e) => setDocument(e.target.value)}
            required
            disabled={loading}
          />
        </label>
        <label className="panel-card__field">
          <span className="visually-hidden">Senha</span>
          <input
            type="password"
            placeholder="SENHA"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={loading}
          />
        </label>
        <label className="panel-card__field">
          <span className="visually-hidden">Confirmar senha</span>
          <input
            type="password"
            placeholder="CONFIRMAR SENHA"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            disabled={loading}
          />
        </label>
        {password && confirmPassword && password !== confirmPassword && (
          <p className="panel-card__error" role="alert">
            As senhas não coincidem.
          </p>
        )}
        {error && (
          <p className="panel-card__error" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="panel-card__submit"
          disabled={loading || !password || password !== confirmPassword}
        >
          {loading ? 'CRIANDO…' : 'CRIAR CONTA'}
        </button>
      </form>

      <div className="panel-card__links">
        <p className="panel-card__text">Já tem conta?</p>
        <Link to="/entrar" className="panel-card__link">
          Entrar
        </Link>
      </div>
    </PanelCard>
  )
}
