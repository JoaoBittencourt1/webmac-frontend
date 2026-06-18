import { PanelCard } from '../components/ui/PanelCard'
import './TermosPage.css'

export function TermosPage() {
  return (
    <PanelCard title="TERMOS DE USO" titleId="termos-title">
      <div className="termos-content">
        <section>
          <h2>1. Aceitação dos Termos</h2>
          <p>
            Ao utilizar a plataforma WebMec, você concorda com estes Termos de Uso. Se não
            concordar, não utilize nossos serviços.
          </p>
        </section>

        <section>
          <h2>2. Descrição do Serviço</h2>
          <p>
            O WebMec é uma plataforma que conecta clientes a oficinas mecânicas. Facilitamos o
            contato, agendamento e acompanhamento de serviços automotivos.
          </p>
        </section>

        <section>
          <h2>3. Cadastro</h2>
          <p>
            Para utilizar a plataforma, é necessário criar uma conta com informações verdadeiras e
            atualizadas. Você é responsável por manter a confidencialidade de suas credenciais.
          </p>
        </section>

        <section>
          <h2>4. Responsabilidades do Cliente</h2>
          <p>
            O cliente deve fornecer informações precisas sobre o veículo e o serviço desejado.
            O pagamento e negociação ocorrem diretamente entre cliente e oficina.
          </p>
        </section>

        <section>
          <h2>5. Responsabilidades da Oficina</h2>
          <p>
            A oficina deve manter suas informações atualizadas, responder às solicitações em
            tempo hábil e prestar serviços com qualidade e profissionalismo.
          </p>
        </section>

        <section>
          <h2>6. Avaliações</h2>
          <p>
            Clientes podem avaliar oficinas após a conclusão do serviço. As avaliações devem ser
            honestas e baseadas na experiência real.
          </p>
        </section>

        <section>
          <h2>7. Privacidade</h2>
          <p>
            Seus dados pessoais são tratados conforme nossa política de privacidade. Não
            compartilhamos informações com terceiros sem seu consentimento.
          </p>
        </section>

        <section>
          <h2>8. Modificações</h2>
          <p>
            Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações
            significativas serão comunicadas aos usuários.
          </p>
        </section>
      </div>
    </PanelCard>
  )
}
