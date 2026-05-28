import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import '../components/login/LoginForm.css'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSent(true)
  }

  return (
    <section className="login-card" aria-labelledby="forgot-title">
      <h1 id="forgot-title" className="login-card__title">
        RECUPERAR SENHA
      </h1>

      {sent ? (
        <p className="login-card__signup" style={{ marginTop: 0 }}>
          Se existir uma conta com esses dados, você receberá instruções por e-mail.
        </p>
      ) : (
        <form className="login-card__form" onSubmit={handleSubmit}>
          <label className="login-card__field">
            <span className="visually-hidden">CPF, CNPJ ou e-mail</span>
            <input
              type="text"
              placeholder="CPF, CNPJ ou e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="login-card__submit">
            ENVIAR LINK
          </button>
        </form>
      )}

      <div className="login-card__links">
        <Link to="/entrar" className="login-card__link">
          Voltar para entrar
        </Link>
      </div>
    </section>
  )
}
