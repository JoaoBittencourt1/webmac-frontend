import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PanelCard } from '../components/ui/PanelCard'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../lib/api'
import type { MecanicoSearchResult } from '../lib/schemas'
import './HomePage.css'

const clientMenuItems = [
  { label: 'MEUS PEDIDOS', to: '/pedidos' },
  { label: 'ORÇAMENTOS', to: '/orcamentos' },
  { label: 'MEU CADASTRO', to: '/perfil' },
] as const

const mechanicMenuItems = [{ label: 'MEU PERFIL', to: '/perfil' }] as const

export function HomePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [mecanicos, setMecanicos] = useState<MecanicoSearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  const isCliente = user?.role === 'CLIENTE'
  const isMecanico = user?.role === 'MECANICO'
  const menuItems = isMecanico ? mechanicMenuItems : clientMenuItems

  const searchMecanicos = useCallback(async (term: string) => {
    if (!term.trim()) {
      setMecanicos([])
      return
    }

    setSearching(true)
    setSearchError(null)
    try {
      const results = await apiFetch<MecanicoSearchResult[]>(
        `/mecanicos?endereco=${encodeURIComponent(term.trim())}`,
      )
      setMecanicos(results)
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Erro na busca')
      setMecanicos([])
    } finally {
      setSearching(false)
    }
  }, [])

  useEffect(() => {
    if (!isCliente) return

    const timer = setTimeout(() => {
      searchMecanicos(search)
    }, 400)

    return () => clearTimeout(timer)
  }, [search, isCliente, searchMecanicos])

  async function toggleFavorito(mecanicoId: string, isFavorito: boolean) {
    try {
      if (isFavorito) {
        await apiFetch(`/me/favoritos/${mecanicoId}`, { method: 'DELETE' })
      } else {
        await apiFetch(`/me/favoritos/${mecanicoId}`, { method: 'POST' })
      }
      setMecanicos((prev) =>
        prev.map((m) =>
          m.id === mecanicoId ? { ...m, isFavorito: !isFavorito } : m,
        ),
      )
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Erro ao favoritar')
    }
  }

  async function handleLogout() {
    await logout()
    navigate('/entrar', { replace: true })
  }

  return (
    <PanelCard title="PAINEL" titleId="home-title">
      <p className="panel-card__greeting">
        Olá, <strong>{user?.name}</strong>
      </p>

      {isCliente && (
        <section className="home-search" aria-label="Buscar mecânicos">
          <label className="panel-card__field">
            <span className="visually-hidden">Buscar por endereço</span>
            <input
              type="text"
              placeholder="BUSCAR MECÂNICO POR ENDEREÇO"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>

          {searching && <p className="panel-card__text">Buscando…</p>}
          {searchError && (
            <p className="panel-card__error" role="alert">
              {searchError}
            </p>
          )}

          {mecanicos.length > 0 && (
            <ul className="home-mecanicos-list">
              {mecanicos.map((m) => (
                <li key={m.id} className="home-mecanico-card">
                  <strong>{m.nome}</strong>
                  <p>{m.descricao}</p>
                  <p className="home-mecanico-card__endereco">{m.endereco}</p>
                  <button
                    type="button"
                    className="panel-card__submit home-mecanico-card__fav"
                    onClick={() => toggleFavorito(m.id, m.isFavorito)}
                  >
                    {m.isFavorito ? 'DESFAVORITAR' : 'FAVORITAR'}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {search.trim() && !searching && mecanicos.length === 0 && !searchError && (
            <p className="panel-card__text">Nenhum mecânico encontrado neste endereço.</p>
          )}
        </section>
      )}

      {isMecanico && (
        <p className="panel-card__text">
          Gerencie sua agenda e perfil na página de cadastro.
        </p>
      )}

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
