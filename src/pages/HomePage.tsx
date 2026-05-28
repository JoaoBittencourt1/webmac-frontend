import { Link, useNavigate } from 'react-router-dom'
import { PanelCard } from '../components/ui/PanelCard'
import { useAuth } from '../context/AuthContext'
import { formatDocument } from '../utils/formatDocument'

const menuItems = [
  { label: 'MEUS PEDIDOS', to: '/pedidos' },
  { label: 'ORÇAMENTOS', to: '/orcamentos' },
  { label: 'MEU CADASTRO', to: '/perfil' },
] as const

export function HomePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/entrar', { replace: true })
  }

  return (
    <PanelCard title="PAINEL" titleId="home-title">
      <p className="panel-card__greeting">
        Olá, <strong>{formatDocument(user?.document)}</strong>
      </p>

      <nav className="panel-card__menu" aria-label="Menu principal">
        {menuItems.map(({ label, to }) => (
          <Link key={to} to={to} className="panel-card__menu-item">
            {label}
          </Link>
        ))}
      </nav>

      <button type="button" className="panel-card__submit" onClick={handleLogout}>
        SAIR
      </button>
    </PanelCard>
  )
}
