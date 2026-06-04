import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { PanelCard } from '../components/ui/PanelCard'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../lib/api'
import type { Agendamento, FavoritoItem, MeProfile } from '../lib/schemas'
import './ProfilePage.css'

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function ClientProfile() {
  const { user, refreshSession } = useAuth()
  const [favoritos, setFavoritos] = useState<FavoritoItem[]>([])
  const [nome, setNome] = useState('')
  const [fotoUrl, setFotoUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [me, favs] = await Promise.all([
        apiFetch<MeProfile>('/me'),
        apiFetch<FavoritoItem[]>('/me/favoritos'),
      ])
      setNome(me.profile?.nome ?? me.name)
      setFavoritos(favs)

      if (me.profile?.hasFoto) {
        try {
          const foto = await apiFetch<{ fotoBase64: string }>('/me/foto')
          setFotoUrl(foto.fotoBase64)
        } catch {
          setFotoUrl(null)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar perfil')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function handleSaveNome(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await apiFetch('/me', { method: 'PATCH', body: JSON.stringify({ nome }) })
      await refreshSession()
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  async function handleFotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const fotoBase64 = await fileToBase64(file)
      await apiFetch('/me/foto', {
        method: 'PUT',
        body: JSON.stringify({ fotoBase64 }),
      })
      setFotoUrl(fotoBase64)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar foto')
    }
  }

  async function removeFavorito(mecanicoId: string) {
    try {
      await apiFetch(`/me/favoritos/${mecanicoId}`, { method: 'DELETE' })
      setFavoritos((prev) => prev.filter((f) => f.mecanico.id !== mecanicoId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover favorito')
    }
  }

  if (loading) return <p className="panel-card__text">Carregando…</p>

  return (
    <>
      <div className="profile-header">
        {fotoUrl ? (
          <img src={fotoUrl} alt="" className="profile-photo" />
        ) : (
          <div className="profile-photo profile-photo--placeholder" aria-hidden />
        )}
        <label className="panel-card__link profile-photo-upload">
          Alterar foto
          <input type="file" accept="image/*" onChange={handleFotoChange} hidden />
        </label>
      </div>

      <form className="panel-card__form" onSubmit={handleSaveNome}>
        <label className="panel-card__field">
          <span className="visually-hidden">Nome</span>
          <input
            type="text"
            placeholder="NOME"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            disabled={saving}
          />
        </label>
        <button type="submit" className="panel-card__submit" disabled={saving}>
          {saving ? 'SALVANDO…' : 'SALVAR NOME'}
        </button>
      </form>

      <section className="profile-section">
        <h2 className="profile-section__title">Meus favoritos</h2>
        {favoritos.length === 0 ? (
          <p className="panel-card__text">
            Nenhum favorito ainda.{' '}
            <Link to="/" className="panel-card__link">
              Busque mecânicos na home
            </Link>
          </p>
        ) : (
          <ul className="profile-favoritos">
            {favoritos.map((f) => (
              <li key={f.id} className="profile-favorito">
                <strong>{f.mecanico.nome}</strong>
                <p>{f.mecanico.descricao}</p>
                <button
                  type="button"
                  className="panel-card__link"
                  onClick={() => removeFavorito(f.mecanico.id)}
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {error && (
        <p className="panel-card__error" role="alert">
          {error}
        </p>
      )}

      <p className="panel-card__text profile-email">{user?.email}</p>
    </>
  )
}

function MechanicProfile() {
  const { refreshSession } = useAuth()
  const [profile, setProfile] = useState<MeProfile | null>(null)
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [fotoUrl, setFotoUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [novoTitulo, setNovoTitulo] = useState('')
  const [novaDescricao, setNovaDescricao] = useState('')
  const [novaDataInicio, setNovaDataInicio] = useState('')
  const [novaDataFim, setNovaDataFim] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [me, agenda] = await Promise.all([
        apiFetch<MeProfile>('/me'),
        apiFetch<Agendamento[]>('/me/agendamentos'),
      ])
      setProfile(me)
      setNome(me.profile?.nome ?? me.name)
      setDescricao(me.profile?.descricao ?? '')
      setAgendamentos(agenda)

      if (me.profile?.hasFoto) {
        try {
          const foto = await apiFetch<{ fotoBase64: string }>('/me/foto')
          setFotoUrl(foto.fotoBase64)
        } catch {
          setFotoUrl(null)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar perfil')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function handleSaveProfile(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await apiFetch('/me', {
        method: 'PATCH',
        body: JSON.stringify({ nome, descricao }),
      })
      await refreshSession()
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  async function handleFotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const fotoBase64 = await fileToBase64(file)
      await apiFetch('/me/foto', {
        method: 'PUT',
        body: JSON.stringify({ fotoBase64 }),
      })
      setFotoUrl(fotoBase64)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar foto')
    }
  }

  async function handleCreateAgendamento(event: FormEvent) {
    event.preventDefault()
    setError(null)
    try {
      await apiFetch('/me/agendamentos', {
        method: 'POST',
        body: JSON.stringify({
          titulo: novoTitulo,
          descricao: novaDescricao || undefined,
          dataInicio: new Date(novaDataInicio).toISOString(),
          dataFim: new Date(novaDataFim).toISOString(),
        }),
      })
      setNovoTitulo('')
      setNovaDescricao('')
      setNovaDataInicio('')
      setNovaDataFim('')
      const agenda = await apiFetch<Agendamento[]>('/me/agendamentos')
      setAgendamentos(agenda)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar agendamento')
    }
  }

  async function removeAgendamento(id: string) {
    try {
      await apiFetch(`/me/agendamentos/${id}`, { method: 'DELETE' })
      setAgendamentos((prev) => prev.filter((a) => a.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover agendamento')
    }
  }

  if (loading) return <p className="panel-card__text">Carregando…</p>

  return (
    <>
      <div className="profile-header">
        {fotoUrl ? (
          <img src={fotoUrl} alt="" className="profile-photo" />
        ) : (
          <div className="profile-photo profile-photo--placeholder" aria-hidden />
        )}
        <label className="panel-card__link profile-photo-upload">
          Alterar foto
          <input type="file" accept="image/*" onChange={handleFotoChange} hidden />
        </label>
      </div>

      <form className="panel-card__form" onSubmit={handleSaveProfile}>
        <label className="panel-card__field">
          <span className="visually-hidden">Nome</span>
          <input
            type="text"
            placeholder="NOME"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            disabled={saving}
          />
        </label>
        <label className="panel-card__field">
          <span className="visually-hidden">Descrição</span>
          <textarea
            placeholder="DESCRIÇÃO"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            disabled={saving}
            rows={4}
          />
        </label>
        <button type="submit" className="panel-card__submit" disabled={saving}>
          {saving ? 'SALVANDO…' : 'SALVAR PERFIL'}
        </button>
      </form>

      <section className="profile-section">
        <h2 className="profile-section__title">Agenda</h2>
        <ul className="profile-agenda">
          {agendamentos.map((a) => (
            <li key={a.id} className="profile-agenda-item">
              <strong>{a.titulo}</strong>
              {a.descricao && <p>{a.descricao}</p>}
              <p className="profile-agenda-item__date">
                {new Date(a.dataInicio).toLocaleString('pt-BR')} —{' '}
                {new Date(a.dataFim).toLocaleString('pt-BR')}
              </p>
              <button
                type="button"
                className="panel-card__link"
                onClick={() => removeAgendamento(a.id)}
              >
                Remover
              </button>
            </li>
          ))}
        </ul>

        <form className="panel-card__form profile-agenda-form" onSubmit={handleCreateAgendamento}>
          <label className="panel-card__field">
            <input
              type="text"
              placeholder="TÍTULO"
              value={novoTitulo}
              onChange={(e) => setNovoTitulo(e.target.value)}
              required
            />
          </label>
          <label className="panel-card__field">
            <textarea
              placeholder="DESCRIÇÃO (opcional)"
              value={novaDescricao}
              onChange={(e) => setNovaDescricao(e.target.value)}
              rows={2}
            />
          </label>
          <label className="panel-card__field">
            <input
              type="datetime-local"
              value={novaDataInicio}
              onChange={(e) => setNovaDataInicio(e.target.value)}
              required
            />
          </label>
          <label className="panel-card__field">
            <input
              type="datetime-local"
              value={novaDataFim}
              onChange={(e) => setNovaDataFim(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="panel-card__submit">
            ADICIONAR AGENDAMENTO
          </button>
        </form>
      </section>

      {error && (
        <p className="panel-card__error" role="alert">
          {error}
        </p>
      )}

      <p className="panel-card__text profile-email">{profile?.email}</p>
    </>
  )
}

export function ProfilePage() {
  const { user } = useAuth()
  const isMecanico = user?.role === 'MECANICO'

  return (
    <PanelCard title="MEU CADASTRO" titleId="profile-title">
      {isMecanico ? <MechanicProfile /> : <ClientProfile />}
    </PanelCard>
  )
}
