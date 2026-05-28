import { Link, useLocation } from 'react-router-dom'
import logo from '../../assets/logo.svg'
import './Header.css'

const navLinks = [
  { label: 'SAQ', to: '/saq' },
  { label: 'SEJA UM PARCEIRO', to: '/parceiro' },
  { label: 'ENTRAR', to: '/entrar' },
] as const

export function Header() {
  const { pathname } = useLocation()

  return (
    <header className="header">
      <Link to="/" className="header__logo" aria-label="WebMec — início">
        <img src={logo} alt="" width={48} height={48} />
      </Link>
      <nav className="header__nav" aria-label="Principal">
        {navLinks.map(({ label, to }) => (
          <Link
            key={to}
            to={to}
            className={`header__link${pathname === to ? ' header__link--active' : ''}`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
