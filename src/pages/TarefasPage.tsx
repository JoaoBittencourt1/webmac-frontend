import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { PanelCard } from '../components/ui/PanelCard'
import { apiFetch } from '../lib/api'
import type { TarefaSemanal } from '../lib/schemas'
import './TarefasPage.css'

const diasSemana = [
  { value: 'SEGUNDA', label: 'Segunda' },
  { value: 'TERCA', label: 'Terça' },
  { value: 'QUARTA', label: 'Quarta' },
  { value: 'QUINTA', label: 'Quinta' },
  { value: 'SEXTA', label: 'Sexta' },
  { value: 'SABADO', label: 'Sábado' },
  { value: 'DOMINGO', label: 'Domingo' },
]

const prioridadeLabels: Record<string, string> = {
  BAIXA: 'Baixa',
  MEDIA: 'Média',
  ALTA: 'Alta',
}

const prioridadeColors: Record<string, string> = {
  BAIXA: '#2e7d32',
  MEDIA: '#e6a817',
  ALTA: '#b00020',
}

export function TarefasPage() {
  const [tarefas, setTarefas] = useState<TarefaSemanal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [diaSemana, setDiaSemana] = useState('SEGUNDA')
  const [prioridade, setPrioridade] = useState('MEDIA')
  const [saving, setSaving] = useState(false)

  const loadTarefas = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiFetch<TarefaSemanal[]>('/me/tarefas-semanais')
      setTarefas(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar tarefas')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTarefas()
  }, [loadTarefas])

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await apiFetch('/me/tarefas-semanais', {
        method: 'POST',
        body: JSON.stringify({ titulo, descricao, diaSemana, prioridade }),
      })
      setTitulo('')
      setDescricao('')
      setDiaSemana('SEGUNDA')
      setPrioridade('MEDIA')
      setShowForm(false)
      loadTarefas()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar tarefa')
    } finally {
      setSaving(false)
    }
  }

  async function toggleConcluida(tarefa: TarefaSemanal) {
    try {
      await apiFetch(`/me/tarefas-semanais/${tarefa.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ concluida: !tarefa.concluida }),
      })
      loadTarefas()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar tarefa')
    }
  }

  async function removeTarefa(id: string) {
    try {
      await apiFetch(`/me/tarefas-semanais/${id}`, { method: 'DELETE' })
      setTarefas((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover tarefa')
    }
  }

  const tarefasPorDia = diasSemana.map((dia) => ({
    ...dia,
    tarefas: tarefas.filter((t) => t.diaSemana === dia.value),
  }))

  return (
    <PanelCard title="TAREFAS SEMANAIS" titleId="tarefas-title">
      <button
        type="button"
        className="panel-card__submit"
        onClick={() => setShowForm(!showForm)}
        style={{ marginBottom: '1rem' }}
      >
        {showForm ? 'CANCELAR' : 'NOVA TAREFA'}
      </button>

      {showForm && (
        <form className="panel-card__form tarefas-form" onSubmit={handleCreate}>
          <label className="panel-card__field">
            <input
              type="text"
              placeholder="TÍTULO"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              disabled={saving}
            />
          </label>
          <label className="panel-card__field">
            <textarea
              placeholder="DESCRIÇÃO"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              rows={2}
              disabled={saving}
            />
          </label>
          <label className="panel-card__field">
            <select
              value={diaSemana}
              onChange={(e) => setDiaSemana(e.target.value)}
              disabled={saving}
            >
              {diasSemana.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </label>
          <label className="panel-card__field">
            <select
              value={prioridade}
              onChange={(e) => setPrioridade(e.target.value)}
              disabled={saving}
            >
              <option value="BAIXA">Baixa</option>
              <option value="MEDIA">Média</option>
              <option value="ALTA">Alta</option>
            </select>
          </label>
          <button type="submit" className="panel-card__submit" disabled={saving}>
            {saving ? 'SALVANDO…' : 'ADICIONAR'}
          </button>
        </form>
      )}

      {loading && <p className="panel-card__text">Carregando…</p>}
      {error && (
        <p className="panel-card__error" role="alert">
          {error}
        </p>
      )}

      {!loading && (
        <div className="tarefas-semana">
          {tarefasPorDia.map(
            (dia) =>
              dia.tarefas.length > 0 && (
                <section key={dia.value} className="tarefas-dia">
                  <h2 className="tarefas-dia__title">{dia.label}</h2>
                  <ul className="tarefas-dia__list">
                    {dia.tarefas.map((t) => (
                      <li
                        key={t.id}
                        className={`tarefa-item${t.concluida ? ' tarefa-item--done' : ''}`}
                      >
                        <div className="tarefa-item__header">
                          <button
                            type="button"
                            className="tarefa-item__check"
                            onClick={() => toggleConcluida(t)}
                            aria-label={t.concluida ? 'Desmarcar' : 'Concluir'}
                          >
                            {t.concluida ? '☑' : '☐'}
                          </button>
                          <strong className="tarefa-item__titulo">{t.titulo}</strong>
                          <span
                            className="tarefa-item__prioridade"
                            style={{ color: prioridadeColors[t.prioridade] }}
                          >
                            {prioridadeLabels[t.prioridade]}
                          </span>
                        </div>
                        <p className="tarefa-item__descricao">{t.descricao}</p>
                        <button
                          type="button"
                          className="panel-card__link"
                          onClick={() => removeTarefa(t.id)}
                        >
                          Remover
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ),
          )}

          {tarefas.length === 0 && !loading && (
            <p className="panel-card__text">Nenhuma tarefa cadastrada.</p>
          )}
        </div>
      )}
    </PanelCard>
  )
}
