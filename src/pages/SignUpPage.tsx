import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PanelCard } from '../components/ui/PanelCard'

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
          />
        </label>
        {password && confirmPassword && password !== confirmPassword && (
          <p className="panel-card__error" role="alert">
            As senhas não coincidem.
          </p>
        )}
        <button
          type="submit"
          className="panel-card__submit"
          disabled={!password || password !== confirmPassword}
        >
          CRIAR CONTA
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
