import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { PanelCard } from '../components/ui/PanelCard'
import { forgotPassword } from '../api/auth'
import { ApiError } from '../api/http'

export function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await forgotPassword(identifier.trim())
      setSent(true)
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
    <PanelCard title="RECUPERAR SENHA" titleId="forgot-title">
      {sent ? (
        <p className="panel-card__text">
          Se existir uma conta com esses dados, você receberá instruções por e-mail.
        </p>
      ) : (
        <form className="panel-card__form" onSubmit={handleSubmit}>
          <label className="panel-card__field">
            <span className="visually-hidden">CPF, CNPJ ou e-mail</span>
            <input
              type="text"
              placeholder="CPF, CNPJ ou e-mail"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              disabled={loading}
            />
          </label>
          {error && (
            <p className="panel-card__error" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="panel-card__submit"
            disabled={loading}
          >
            {loading ? 'ENVIANDO…' : 'ENVIAR LINK'}
          </button>
        </form>
      )}

      <div className="panel-card__links">
        <Link to="/entrar" className="panel-card__link">
          Voltar para entrar
        </Link>
      </div>
    </PanelCard>
  )
}
