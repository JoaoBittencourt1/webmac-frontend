import { Link } from 'react-router-dom'
import '../components/login/LoginForm.css'

interface PlaceholderPageProps {
  title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <section className="login-card">
      <h1 className="login-card__title">{title}</h1>
      <p className="login-card__signup">Conteúdo em breve.</p>
      <div className="login-card__links">
        <Link to="/" className="login-card__link">
          Voltar ao início
        </Link>
      </div>
    </section>
  )
}
