import { useAuth } from '../context/AuthContext'
import './HomePage.css'

export function HomePage() {
  const { user, logout } = useAuth()

  return (
    <section className="home-panel">
      <h1 className="home-panel__title">Bem-vindo à WebMec</h1>
      <p className="home-panel__text">
        Você está autenticado como <strong>{user?.document}</strong>.
      </p>
      <button type="button" className="home-panel__logout" onClick={logout}>
        SAIR
      </button>
    </section>
  )
}
