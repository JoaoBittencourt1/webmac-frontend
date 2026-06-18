import { useState } from 'react'
import { PanelCard } from '../components/ui/PanelCard'
import './SAQPage.css'

const faqs = [
  {
    pergunta: 'Como faço para encontrar um mecânico?',
    resposta:
      'Na página inicial, use a barra de busca para procurar mecânicos pelo endereço. Você pode favoritar mecânicos para encontrá-los facilmente depois.',
  },
  {
    pergunta: 'Como funciona o pedido de serviço?',
    resposta:
      'Após encontrar um mecânico, clique em "Solicitar Serviço" no perfil dele. Descreva o que precisa e informe o valor. O mecânico receberá o pedido e poderá aceitar ou recusar.',
  },
  {
    pergunta: 'Como acompanho meu pedido?',
    resposta:
      'Acesse "Meus Pedidos" no painel. Lá você verá o status de cada pedido: Pendente, Em andamento, Concluído ou Cancelado.',
  },
  {
    pergunta: 'Posso cancelar um pedido?',
    resposta:
      'Sim, pedidos com status "Pendente" podem ser cancelados pelo cliente. Após o mecânico aceitar, entre em contato diretamente.',
  },
  {
    pergunta: 'Como avalio um mecânico?',
    resposta:
      'Após a conclusão do serviço, um botão "Avaliar" aparecerá no pedido. Dê uma nota de 1 a 5 estrelas e deixe um comentário opcional.',
  },
  {
    pergunta: 'Sou mecânico, como me cadastro?',
    resposta:
      'Acesse a página "Seja um Parceiro" ou vá direto ao cadastro como mecânico. Preencha seus dados, CNPJ e descrição dos serviços.',
  },
  {
    pergunta: 'Como gerencio minha agenda?',
    resposta:
      'Mecânicos podem gerenciar agendamentos e tarefas semanais pelo painel. Acesse "Meu Perfil" para criar e editar agendamentos.',
  },
]

export function SAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <PanelCard title="SAQ" titleId="saq-title">
      <p className="panel-card__text" style={{ marginBottom: '1.5rem' }}>
        Perguntas frequentes sobre o WebMec
      </p>

      <dl className="saq-list">
        {faqs.map((faq, i) => (
          <div key={i} className="saq-item">
            <dt>
              <button
                type="button"
                className={`saq-item__question${openIndex === i ? ' saq-item__question--open' : ''}`}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
              >
                {faq.pergunta}
                <span className="saq-item__icon">{openIndex === i ? '−' : '+'}</span>
              </button>
            </dt>
            {openIndex === i && (
              <dd className="saq-item__answer">{faq.resposta}</dd>
            )}
          </div>
        ))}
      </dl>
    </PanelCard>
  )
}
