import { apiRequest } from './http'

export type PedidoStatus =
  | 'PENDENTE'
  | 'EM_ANDAMENTO'
  | 'CONCLUIDO'
  | 'CANCELADO'

export interface Pedido {
  id: string
  descricao: string
  status: PedidoStatus
  valor: number
  createdAt: string
  mecanico: {
    id: string
    nome: string
    especialidade: string
  }
  avaliacoes: Array<{ nota: number; comentario: string | null }>
}

export function fetchMyPedidos(token: string) {
  return apiRequest<Pedido[]>('/pedidos/me', { token })
}
