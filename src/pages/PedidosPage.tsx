import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { PanelCard } from '../components/ui/PanelCard'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../lib/api'
import type { Pedido } from '../lib/schemas'
import './PedidosPage.css'

const statusLabels: Record<string, string> = {
  PENDENTE: 'Pendente',
  EM_ANDAMENTO: 'Em andamento',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado',
}

const statusColors: Record<string, string> = {
  PENDENTE: '#e6a817',
  EM_ANDAMENTO: '#6b84e4',
  CONCLUIDO: '#2e7d32',
  CANCELADO: '#b00020',
}

function AvaliacaoForm({ pedidoId, onDone }: { pedidoId: string; onDone: () => void }) {
  const [nota, setNota] = useState(5)
  const [comentario, setComentario] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await apiFetch(`/me/pedidos/${pedidoId}/avaliacao`, {
        method: 'POST',
        body: JSON.stringify({ nota, comentario: comentario || undefined }),
      })
      onDone()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao avaliar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="avaliacao-form" onSubmit={handleSubmit}>
      <div className="avaliacao-form__stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`avaliacao-form__star${n <= nota ? ' avaliacao-form__star--active' : ''}`}
            onClick={() => setNota(n)}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        className="avaliacao-form__comment"
        placeholder="Comentário (opcional)"
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        rows={2}
      />
      {error && <p className="panel-card__error">{error}</p>}
      <button type="submit" className="panel-card__submit" disabled={saving}>
        {saving ? 'ENVIANDO…' : 'AVALIAR'}
      </button>
    </form>
  )
}

export function PedidosPage() {
  const { user } = useAuth()
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [avaliarId, setAvaliarId] = useState<string | null>(null)

  const isCliente = user?.role === 'CLIENTE'
  const isMecanico = user?.role === 'MECANICO'

  const loadPedidos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiFetch<Pedido[]>('/me/pedidos')
      setPedidos(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pedidos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPedidos()
  }, [loadPedidos])

  async function updateStatus(pedidoId: string, status: string) {
    try {
      await apiFetch(`/me/pedidos/${pedidoId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      loadPedidos()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status')
    }
  }

  return (
    <PanelCard title={isCliente ? 'MEUS PEDIDOS' : 'PEDIDOS RECEBIDOS'} titleId="pedidos-title">
      {isCliente && (
        <Link to="/pedidos/novo" className="panel-card__submit pedidos-new-link">
          NOVO PEDIDO
        </Link>
      )}

      {loading && <p className="panel-card__text">Carregando…</p>}
      {error && (
        <p className="panel-card__error" role="alert">
          {error}
        </p>
      )}

      {!loading && pedidos.length === 0 && (
        <p className="panel-card__text">
          Nenhum pedido encontrado.
          {isCliente && (
            <>
              {' '}
              <Link to="/pedidos/novo" className="panel-card__link">
                Criar um pedido
              </Link>
            </>
          )}
        </p>
      )}

      <ul className="pedidos-list">
        {pedidos.map((p) => (
          <li key={p.id} className="pedido-card">
            <div className="pedido-card__header">
              <span
                className="pedido-card__status"
                style={{ background: statusColors[p.status] }}
              >
                {statusLabels[p.status]}
              </span>
              <span className="pedido-card__valor">
                R$ {Number(p.valor).toFixed(2).replace('.', ',')}
              </span>
            </div>

            {(p.tipoServico || p.modeloCarro) && (
              <p className="pedido-card__vehicle">
                {p.tipoServico && <span className="pedido-card__tag">{p.tipoServico}</span>}
                {p.modeloCarro && <span className="pedido-card__tag">{p.modeloCarro}</span>}
              </p>
            )}

            <p className="pedido-card__descricao">{p.descricao}</p>

            {p.dataPretendida && (
              <p className="pedido-card__info">
                Data pretendida: {new Date(p.dataPretendida).toLocaleDateString('pt-BR')}
              </p>
            )}

            {isCliente && p.mecanico && (
              <p className="pedido-card__info">
                Mecânico:{' '}
                <Link to={`/mecanico/${p.mecanico.id}`} className="panel-card__link">
                  {p.mecanico.nome}
                </Link>
              </p>
            )}

            {isMecanico && p.cliente && (
              <p className="pedido-card__info">Cliente: {p.cliente.nome}</p>
            )}

            <p className="pedido-card__date">
              {new Date(p.createdAt).toLocaleDateString('pt-BR')}
            </p>

            <div className="pedido-card__actions">
              {isMecanico && p.status === 'PENDENTE' && (
                <>
                  <button
                    type="button"
                    className="pedido-card__btn pedido-card__btn--accept"
                    onClick={() => updateStatus(p.id, 'EM_ANDAMENTO')}
                  >
                    ACEITAR
                  </button>
                  <button
                    type="button"
                    className="pedido-card__btn pedido-card__btn--cancel"
                    onClick={() => updateStatus(p.id, 'CANCELADO')}
                  >
                    RECUSAR
                  </button>
                </>
              )}

              {isMecanico && p.status === 'EM_ANDAMENTO' && (
                <button
                  type="button"
                  className="pedido-card__btn pedido-card__btn--accept"
                  onClick={() => updateStatus(p.id, 'CONCLUIDO')}
                >
                  CONCLUIR
                </button>
              )}

              {isCliente && p.status === 'PENDENTE' && (
                <button
                  type="button"
                  className="pedido-card__btn pedido-card__btn--cancel"
                  onClick={() => updateStatus(p.id, 'CANCELADO')}
                >
                  CANCELAR
                </button>
              )}

              {isCliente &&
                p.status === 'CONCLUIDO' &&
                p.avaliacoes.length === 0 &&
                avaliarId !== p.id && (
                  <button
                    type="button"
                    className="pedido-card__btn pedido-card__btn--accept"
                    onClick={() => setAvaliarId(p.id)}
                  >
                    AVALIAR
                  </button>
                )}

              {p.status !== 'CANCELADO' && (
                <Link
                  to={`/chat/${p.id}`}
                  className="pedido-card__btn pedido-card__btn--chat"
                >
                  CHAT
                </Link>
              )}

              {p.avaliacoes.length > 0 && (
                <span className="pedido-card__rated">
                  {'★'.repeat(p.avaliacoes[0].nota)}
                  {'☆'.repeat(5 - p.avaliacoes[0].nota)}
                </span>
              )}
            </div>

            {avaliarId === p.id && (
              <AvaliacaoForm
                pedidoId={p.id}
                onDone={() => {
                  setAvaliarId(null)
                  loadPedidos()
                }}
              />
            )}
          </li>
        ))}
      </ul>
    </PanelCard>
  )
}
