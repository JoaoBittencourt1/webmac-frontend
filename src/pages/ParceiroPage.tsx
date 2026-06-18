import { Link } from 'react-router-dom'
import { PanelCard } from '../components/ui/PanelCard'
import './ParceiroPage.css'

const beneficios = [
  'Visibilidade para clientes da sua região',
  'Gerenciamento de agenda e tarefas',
  'Receba avaliações e construa sua reputação',
  'Sistema de pedidos simplificado',
  'Cadastro gratuito',
]

export function ParceiroPage() {
  return (
    <PanelCard title="SEJA UM PARCEIRO" titleId="parceiro-title">
      <p className="panel-card__text parceiro-subtitle">
        Cadastre-se como mecânico parceiro e amplie sua clientela
      </p>

      <ul className="parceiro-beneficios">
        {beneficios.map((b, i) => (
          <li key={i} className="parceiro-beneficio">
            <span className="parceiro-beneficio__icon">✓</span>
            {b}
          </li>
        ))}
      </ul>

      <div className="parceiro-steps">
        <div className="parceiro-step">
          <span className="parceiro-step__number">1</span>
          <p>Crie sua conta como mecânico</p>
        </div>
        <div className="parceiro-step">
          <span className="parceiro-step__number">2</span>
          <p>Preencha seu perfil e especialidade</p>
        </div>
        <div className="parceiro-step">
          <span className="parceiro-step__number">3</span>
          <p>Comece a receber pedidos de serviço</p>
        </div>
      </div>

      <Link to="/cadastro?tipo=mecanico" className="panel-card__submit parceiro-cta">
        CADASTRAR COMO MECÂNICO
      </Link>

      <div className="panel-card__links">
        <p className="panel-card__text">Já tem conta?</p>
        <Link to="/entrar/mecanico" className="panel-card__link">
          Entrar como mecânico
        </Link>
      </div>
    </PanelCard>
  )
}
