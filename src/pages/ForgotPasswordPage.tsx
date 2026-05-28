import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { PanelCard } from '../components/ui/PanelCard'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSent(true)
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="panel-card__submit">
            ENVIAR LINK
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
