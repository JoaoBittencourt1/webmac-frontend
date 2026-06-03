import { Link } from 'react-router-dom'
import { PanelCard } from '../components/ui/PanelCard'
import { usePedidos } from '../hooks/usePedidos'

interface PlaceholderPageProps {
  title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  const isPedidos = title === 'MEUS PEDIDOS'
  const { pedidos, loading, error } = usePedidos(isPedidos)

  return (
    <PanelCard title={title}>
      {isPedidos ? (
        <>
          {loading && <p className="panel-card__text">Carregando pedidos…</p>}
          {error && (
            <p className="panel-card__error" role="alert">
              {error}
            </p>
          )}
          {!loading && !error && pedidos.length === 0 && (
            <p className="panel-card__text">Nenhum pedido encontrado.</p>
          )}
          {!loading &&
            !error &&
            pedidos.map((pedido) => (
              <p key={pedido.id} className="panel-card__text">
                {pedido.descricao} — {pedido.status} — R${' '}
                {pedido.valor.toFixed(2)}
              </p>
            ))}
        </>
      ) : (
        <p className="panel-card__text">Conteúdo em breve.</p>
      )}
      <div className="panel-card__links">
        <Link to="/" className="panel-card__link">
          Voltar ao painel
        </Link>
      </div>
    </PanelCard>
  )
}
