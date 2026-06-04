import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { PanelCard } from '../components/ui/PanelCard'
import { useAuth } from '../context/AuthContext'
import { registerSchema } from '../lib/schemas'

export function SignUpPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isMechanic = searchParams.get('tipo') === 'mecanico'

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [telefone, setTelefone] = useState('')
  const [endereco, setEndereco] = useState('')
  const [cpf, setCpf] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [descricao, setDescricao] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    const payload = isMechanic
      ? {
          role: 'MECANICO' as const,
          nome,
          email,
          password,
          cnpj,
          telefone,
          endereco,
          descricao,
        }
      : {
          role: 'CLIENTE' as const,
          nome,
          email,
          password,
          cpf,
          telefone,
          endereco,
        }

    const parsed = registerSchema.safeParse(payload)
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Dados inválidos')
      return
    }

    setLoading(true)
    try {
      await register(parsed.data)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível criar a conta.')
    } finally {
      setLoading(false)
    }
  }

  const loginPath = isMechanic ? '/entrar/mecanico' : '/entrar'

  return (
    <PanelCard
      title={isMechanic ? 'CADASTRO MECÂNICO' : 'CADASTRE-SE'}
      titleId="signup-title"
    >
      <form className="panel-card__form" onSubmit={handleSubmit}>
        <label className="panel-card__field">
          <span className="visually-hidden">Nome</span>
          <input
            type="text"
            placeholder="NOME"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            disabled={loading}
          />
        </label>

        <label className="panel-card__field">
          <span className="visually-hidden">E-mail</span>
          <input
            type="email"
            placeholder="E-MAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </label>

        {isMechanic ? (
          <label className="panel-card__field">
            <span className="visually-hidden">CNPJ</span>
            <input
              type="text"
              placeholder="CNPJ"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              required
              disabled={loading}
            />
          </label>
        ) : (
          <label className="panel-card__field">
            <span className="visually-hidden">CPF</span>
            <input
              type="text"
              placeholder="CPF"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              required
              disabled={loading}
            />
          </label>
        )}

        <label className="panel-card__field">
          <span className="visually-hidden">Telefone</span>
          <input
            type="text"
            placeholder="TELEFONE"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
            disabled={loading}
          />
        </label>

        <label className="panel-card__field">
          <span className="visually-hidden">Endereço</span>
          <input
            type="text"
            placeholder="ENDEREÇO"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            required
            disabled={loading}
          />
        </label>

        {isMechanic && (
          <label className="panel-card__field">
            <span className="visually-hidden">Descrição</span>
            <textarea
              placeholder="DESCRIÇÃO DO SERVIÇO"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              disabled={loading}
              rows={3}
            />
          </label>
        )}

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

        {error && (
          <p className="panel-card__error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="panel-card__submit" disabled={loading}>
          {loading ? 'CRIANDO…' : 'CRIAR CONTA'}
        </button>
      </form>

      <div className="panel-card__links">
        <p className="panel-card__text">Já tem conta?</p>
        <Link to={loginPath} className="panel-card__link">
          Entrar
        </Link>
      </div>
    </PanelCard>
  )
}
