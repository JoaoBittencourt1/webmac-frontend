import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PanelCard } from '../components/ui/PanelCard'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../lib/api'
import type { Mensagem } from '../lib/schemas'
import './ChatPage.css'

export function ChatPage() {
  const { pedidoId } = useParams<{ pedidoId: string }>()
  const { user } = useAuth()
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [texto, setTexto] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const listRef = useRef<HTMLUListElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null)

  const loadMensagens = useCallback(async () => {
    if (!pedidoId) return
    try {
      const data = await apiFetch<Mensagem[]>(`/me/pedidos/${pedidoId}/mensagens`)
      setMensagens(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar mensagens')
    } finally {
      setLoading(false)
    }
  }, [pedidoId])

  useEffect(() => {
    loadMensagens()
    intervalRef.current = setInterval(loadMensagens, 5000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [loadMensagens])

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [mensagens])

  async function handleSend(e: FormEvent) {
    e.preventDefault()
    if (!texto.trim() || !pedidoId) return

    setSending(true)
    setError(null)
    try {
      await apiFetch(`/me/pedidos/${pedidoId}/mensagens`, {
        method: 'POST',
        body: JSON.stringify({ conteudo: texto.trim() }),
      })
      setTexto('')
      await loadMensagens()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar mensagem')
    } finally {
      setSending(false)
    }
  }

  return (
    <PanelCard title="CHAT" titleId="chat-title">
      {loading && <p className="panel-card__text">Carregando…</p>}

      {error && (
        <p className="panel-card__error" role="alert">
          {error}
        </p>
      )}

      <ul className="chat-messages" ref={listRef}>
        {mensagens.length === 0 && !loading && (
          <li className="chat-empty">Nenhuma mensagem ainda. Inicie a conversa!</li>
        )}
        {mensagens.map((m) => {
          const isMe = m.remetente.id === user?.id
          return (
            <li
              key={m.id}
              className={`chat-message${isMe ? ' chat-message--mine' : ' chat-message--other'}`}
            >
              <span className="chat-message__author">
                {isMe ? 'Você' : m.remetente.name}
              </span>
              <p className="chat-message__content">{m.conteudo}</p>
              <span className="chat-message__time">
                {new Date(m.createdAt).toLocaleString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: '2-digit',
                  month: '2-digit',
                })}
              </span>
            </li>
          )
        })}
      </ul>

      <form className="chat-input" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Digite sua mensagem…"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          disabled={sending}
          className="chat-input__field"
        />
        <button type="submit" className="chat-input__send" disabled={sending || !texto.trim()}>
          {sending ? '…' : '➤'}
        </button>
      </form>

      <div className="panel-card__links">
        <Link to="/pedidos" className="panel-card__link">
          Voltar aos pedidos
        </Link>
      </div>
    </PanelCard>
  )
}
