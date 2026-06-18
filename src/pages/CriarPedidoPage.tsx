import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { PanelCard } from '../components/ui/PanelCard'
import { apiFetch } from '../lib/api'
import type { MecanicoSearchResult } from '../lib/schemas'
import './CriarPedidoPage.css'

const tiposServico = [
  'Troca de óleo',
  'Revisão completa',
  'Freios',
  'Suspensão',
  'Motor',
  'Elétrica',
  'Ar condicionado',
  'Funilaria e pintura',
  'Alinhamento e balanceamento',
  'Outro',
]

export function CriarPedidoPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedId = searchParams.get('mecanicoId')

  const [step, setStep] = useState(preselectedId ? 2 : 1)

  const [search, setSearch] = useState('')
  const [mecanicos, setMecanicos] = useState<MecanicoSearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [selectedMecanico, setSelectedMecanico] = useState<MecanicoSearchResult | null>(null)

  const [tipoServico, setTipoServico] = useState('')
  const [modeloCarro, setModeloCarro] = useState('')
  const [modeloMotor, setModeloMotor] = useState('')
  const [dataPretendida, setDataPretendida] = useState('')
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const searchMecanicos = useCallback(async (term: string) => {
    if (!term.trim()) {
      setMecanicos([])
      return
    }
    setSearching(true)
    try {
      const results = await apiFetch<MecanicoSearchResult[]>(
        `/mecanicos?endereco=${encodeURIComponent(term.trim())}`,
      )
      setMecanicos(results)
    } catch {
      setMecanicos([])
    } finally {
      setSearching(false)
    }
  }, [])

  useEffect(() => {
    if (preselectedId) {
      apiFetch<MecanicoSearchResult & { tiposServico?: string[] }>(
        `/mecanicos/${preselectedId}/perfil`,
      )
        .then((m) => {
          setSelectedMecanico({ ...m, isFavorito: false })
        })
        .catch(() => {})
    }
  }, [preselectedId])

  useEffect(() => {
    if (selectedMecanico || step !== 1) return
    const timer = setTimeout(() => searchMecanicos(search), 400)
    return () => clearTimeout(timer)
  }, [search, selectedMecanico, searchMecanicos, step])

  function selectMecanico(m: MecanicoSearchResult) {
    setSelectedMecanico(m)
    setStep(2)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!selectedMecanico) {
      setError('Selecione uma oficina')
      return
    }

    const valorNum = parseFloat(valor.replace(',', '.'))
    if (isNaN(valorNum) || valorNum <= 0) {
      setError('Valor inválido')
      return
    }

    setSaving(true)
    setError(null)
    try {
      await apiFetch('/me/pedidos', {
        method: 'POST',
        body: JSON.stringify({
          mecanicoId: selectedMecanico.id,
          descricao,
          tipoServico: tipoServico || undefined,
          modeloCarro: modeloCarro || undefined,
          modeloMotor: modeloMotor || undefined,
          dataPretendida: dataPretendida ? new Date(dataPretendida).toISOString() : undefined,
          valor: valorNum,
        }),
      })
      navigate('/pedidos', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar pedido')
    } finally {
      setSaving(false)
    }
  }

  const stepTitles = ['SELECIONAR OFICINA', 'DADOS DO VEÍCULO', 'DETALHES DO SERVIÇO']

  return (
    <PanelCard title="NOVO PEDIDO" titleId="criar-pedido-title">
      <div className="criar-pedido__steps">
        {stepTitles.map((t, i) => (
          <button
            key={i}
            type="button"
            className={`criar-pedido__step${step === i + 1 ? ' criar-pedido__step--active' : ''}${i + 1 < step ? ' criar-pedido__step--done' : ''}`}
            onClick={() => {
              if (i + 1 < step) setStep(i + 1)
            }}
            disabled={i + 1 > step}
          >
            <span className="criar-pedido__step-num">{i + 1}</span>
            <span className="criar-pedido__step-label">{t}</span>
          </button>
        ))}
      </div>

      {step === 1 && (
        <div className="criar-pedido__step-content">
          {!selectedMecanico ? (
            <>
              <label className="panel-card__field">
                <span className="visually-hidden">Buscar oficina</span>
                <input
                  type="text"
                  placeholder="BUSCAR OFICINA POR ENDEREÇO"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>

              {searching && <p className="panel-card__text">Buscando…</p>}

              {mecanicos.length > 0 && (
                <ul className="criar-pedido__mecanicos">
                  {mecanicos.map((m) => (
                    <li key={m.id} className="criar-pedido__mecanico">
                      <div>
                        <strong>{m.nome}</strong>
                        <p className="criar-pedido__esp">{m.especialidade}</p>
                        <p className="criar-pedido__end">{m.endereco}</p>
                      </div>
                      <button
                        type="button"
                        className="pedido-card__btn pedido-card__btn--accept"
                        onClick={() => selectMecanico(m)}
                      >
                        SELECIONAR
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <div className="criar-pedido__selected">
              <p>
                Oficina: <strong>{selectedMecanico.nome}</strong>
              </p>
              <button
                type="button"
                className="panel-card__link"
                onClick={() => {
                  setSelectedMecanico(null)
                  setStep(1)
                }}
              >
                Trocar
              </button>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="criar-pedido__step-content">
          {selectedMecanico && (
            <p className="criar-pedido__selected-info">
              Oficina: <strong>{selectedMecanico.nome}</strong>
            </p>
          )}

          <div className="panel-card__form">
            <label className="panel-card__field">
              <span className="visually-hidden">Tipo de serviço</span>
              <select
                value={tipoServico}
                onChange={(e) => setTipoServico(e.target.value)}
              >
                <option value="">TIPO DE SERVIÇO</option>
                {tiposServico.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>

            <label className="panel-card__field">
              <span className="visually-hidden">Modelo do carro</span>
              <input
                type="text"
                placeholder="MODELO DO CARRO"
                value={modeloCarro}
                onChange={(e) => setModeloCarro(e.target.value)}
              />
            </label>

            <label className="panel-card__field">
              <span className="visually-hidden">Modelo do motor</span>
              <input
                type="text"
                placeholder="MODELO DO MOTOR (opcional)"
                value={modeloMotor}
                onChange={(e) => setModeloMotor(e.target.value)}
              />
            </label>

            <label className="panel-card__field">
              <span className="visually-hidden">Data pretendida</span>
              <input
                type="date"
                value={dataPretendida}
                onChange={(e) => setDataPretendida(e.target.value)}
              />
            </label>

            <button
              type="button"
              className="panel-card__submit"
              onClick={() => setStep(3)}
            >
              PRÓXIMO
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <form className="criar-pedido__step-content panel-card__form" onSubmit={handleSubmit}>
          {selectedMecanico && (
            <p className="criar-pedido__selected-info">
              Oficina: <strong>{selectedMecanico.nome}</strong>
              {tipoServico && <> — {tipoServico}</>}
              {modeloCarro && <> — {modeloCarro}</>}
            </p>
          )}

          <label className="panel-card__field">
            <span className="visually-hidden">Descrição do serviço</span>
            <textarea
              placeholder="DESCREVA O SERVIÇO NECESSÁRIO"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              rows={4}
              disabled={saving}
            />
          </label>

          <label className="panel-card__field">
            <span className="visually-hidden">Valor estimado</span>
            <input
              type="text"
              placeholder="VALOR ESTIMADO (R$)"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              required
              disabled={saving}
            />
          </label>

          {error && (
            <p className="panel-card__error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="panel-card__submit" disabled={saving}>
            {saving ? 'ENVIANDO…' : 'ENVIAR PEDIDO'}
          </button>
        </form>
      )}

      <div className="panel-card__links">
        <Link to="/pedidos" className="panel-card__link">
          Voltar aos pedidos
        </Link>
      </div>
    </PanelCard>
  )
}
