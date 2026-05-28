import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.svg'
import { useAuth } from '../../context/AuthContext'
import './Header.css'

const publicNavLinks = [
  { label: 'SAQ', to: '/saq' },
  { label: 'SEJA UM PARCEIRO', to: '/parceiro' },
] as const

export function Header() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/entrar', { replace: true })
  }

  return (
    <header className="header">
      <Link to={user ? '/' : '/entrar'} className="header__logo" aria-label="WebMec — início">
        <img src={logo} alt="WebMec" width={52} height={52} />
      </Link>
      <nav className="header__nav" aria-label="Principal">
        {publicNavLinks.map(({ label, to }) => (
          <Link
            key={to}
            to={to}
            className={`header__link${pathname === to ? ' header__link--active' : ''}`}
          >
            {label}
          </Link>
        ))}
        {user ? (
          <button type="button" className="header__link header__logout" onClick={handleLogout}>
            SAIR
          </button>
        ) : (
          <Link
            to="/entrar"
            className={`header__link${pathname === '/entrar' ? ' header__link--active' : ''}`}
          >
            ENTRAR
          </Link>
        )}
      </nav>
    </header>
  )
}
