import { Link } from 'react-router-dom'
import { PanelCard } from '../components/ui/PanelCard'

interface PlaceholderPageProps {
  title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <PanelCard title={title}>
      <p className="panel-card__text">Conteúdo em breve.</p>
      <div className="panel-card__links">
        <Link to="/" className="panel-card__link">
          Voltar ao painel
        </Link>
      </div>
    </PanelCard>
  )
}
