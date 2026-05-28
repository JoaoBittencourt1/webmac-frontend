import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../components/login/LoginForm.css'

export function SignUpPage() {
  const navigate = useNavigate()
  const [document, setDocument] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (password !== confirmPassword) return
    navigate('/entrar', { replace: true })
  }

  return (
    <section className="login-card" aria-labelledby="signup-title">
      <h1 id="signup-title" className="login-card__title">
        CADASTRE-SE
      </h1>

      <form className="login-card__form" onSubmit={handleSubmit}>
        <label className="login-card__field">
          <span className="visually-hidden">CPF ou CNPJ</span>
          <input
            type="text"
            placeholder="CPF ou CNPJ"
            value={document}
            onChange={(e) => setDocument(e.target.value)}
            required
          />
        </label>
        <label className="login-card__field">
          <span className="visually-hidden">Senha</span>
          <input
            type="password"
            placeholder="SENHA"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>
        <label className="login-card__field">
          <span className="visually-hidden">Confirmar senha</span>
          <input
            type="password"
            placeholder="CONFIRMAR SENHA"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>
        {password && confirmPassword && password !== confirmPassword && (
          <p className="login-card__error" role="alert">
            As senhas não coincidem.
          </p>
        )}
        <button
          type="submit"
          className="login-card__submit"
          disabled={!password || password !== confirmPassword}
        >
          CRIAR CONTA
        </button>
      </form>

      <div className="login-card__links">
        <p className="login-card__signup">
          Já tem conta?{' '}
          <Link to="/entrar" className="login-card__link">
            Entrar
          </Link>
        </p>
      </div>
    </section>
  )
}
