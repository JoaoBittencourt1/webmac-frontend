import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PanelCard } from '../components/ui/PanelCard'
import { apiFetch } from '../lib/api'
import type { MecanicoPublicProfile } from '../lib/schemas'
import './MecanicoPerfilPage.css'

export function MecanicoPerfilPage() {
  const { id } = useParams<{ id: string }>()
  const [profile, setProfile] = useState<MecanicoPublicProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await apiFetch<MecanicoPublicProfile>(`/mecanicos/${id}/perfil`)
      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar perfil')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return (
      <PanelCard title="MECÂNICO" titleId="mecanico-perfil-title">
        <p className="panel-card__text">Carregando…</p>
      </PanelCard>
    )
  }

  if (error || !profile) {
    return (
      <PanelCard title="MECÂNICO" titleId="mecanico-perfil-title">
        <p className="panel-card__error">{error ?? 'Mecânico não encontrado'}</p>
        <Link to="/" className="panel-card__link">
          Voltar
        </Link>
      </PanelCard>
    )
  }

  return (
    <PanelCard title={profile.nome.toUpperCase()} titleId="mecanico-perfil-title">
      {profile.fotoBase64 && (
        <img src={profile.fotoBase64} alt="" className="mecanico-perfil__foto" />
      )}

      <div className="mecanico-perfil__info">
        {profile.mediaAvaliacao !== null && (
          <div className="mecanico-perfil__rating">
            <span className="mecanico-perfil__stars">
              {'★'.repeat(Math.round(profile.mediaAvaliacao))}
              {'☆'.repeat(5 - Math.round(profile.mediaAvaliacao))}
            </span>
            <span className="mecanico-perfil__avg">
              {profile.mediaAvaliacao.toFixed(1)} ({profile.totalAvaliacoes} avaliações)
            </span>
          </div>
        )}

        <p className="mecanico-perfil__esp">{profile.especialidade}</p>
        <p className="mecanico-perfil__desc">{profile.descricao}</p>

        {profile.tiposServico.length > 0 && (
          <div className="mecanico-perfil__servicos">
            <strong>Serviços:</strong>
            <div className="mecanico-perfil__tags">
              {profile.tiposServico.map((s) => (
                <span key={s} className="mecanico-perfil__tag">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {profile.horarioFuncionamento && (
          <p className="mecanico-perfil__horario">
            <strong>Horário:</strong> {profile.horarioFuncionamento}
          </p>
        )}

        <div className="mecanico-perfil__details">
          <p>
            <strong>Endereço:</strong> {profile.endereco}
          </p>
          <p>
            <strong>Telefone:</strong> {profile.telefone}
          </p>
          {profile.whatsapp && (
            <p>
              <strong>WhatsApp:</strong> {profile.whatsapp}
            </p>
          )}
          <p>
            <strong>E-mail:</strong> {profile.email}
          </p>
        </div>
      </div>

      <Link
        to={`/pedidos/novo?mecanicoId=${profile.id}`}
        className="panel-card__submit mecanico-perfil__cta"
      >
        SOLICITAR SERVIÇO
      </Link>

      {profile.avaliacoes.length > 0 && (
        <section className="mecanico-perfil__avaliacoes">
          <h2 className="mecanico-perfil__avaliacoes-title">Avaliações</h2>
          <ul className="mecanico-perfil__avaliacoes-list">
            {profile.avaliacoes.map((a) => (
              <li key={a.id} className="mecanico-perfil__avaliacao">
                <div className="mecanico-perfil__avaliacao-header">
                  <span className="mecanico-perfil__avaliacao-stars">
                    {'★'.repeat(a.nota)}
                    {'☆'.repeat(5 - a.nota)}
                  </span>
                  <span className="mecanico-perfil__avaliacao-autor">{a.clienteNome}</span>
                </div>
                {a.comentario && <p className="mecanico-perfil__avaliacao-comment">{a.comentario}</p>}
                <p className="mecanico-perfil__avaliacao-date">
                  {new Date(a.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="panel-card__links">
        <Link to="/" className="panel-card__link">
          Voltar à busca
        </Link>
      </div>
    </PanelCard>
  )
}
