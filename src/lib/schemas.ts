import { z } from 'zod'

export const registerClienteSchema = z.object({
  role: z.literal('CLIENTE'),
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
  cpf: z.string().min(11, 'CPF inválido'),
  telefone: z.string().min(8, 'Telefone inválido'),
  endereco: z.string().min(5, 'Endereço inválido'),
})

export const registerMecanicoSchema = z.object({
  role: z.literal('MECANICO'),
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
  cnpj: z.string().min(14, 'CNPJ inválido'),
  telefone: z.string().min(8, 'Telefone inválido'),
  endereco: z.string().min(5, 'Endereço inválido'),
  descricao: z.string().min(2, 'Descrição deve ter ao menos 2 caracteres'),
  especialidade: z.string().min(2).optional(),
})

export const registerSchema = z.discriminatedUnion('role', [
  registerClienteSchema,
  registerMecanicoSchema,
])

export type RegisterInput = z.infer<typeof registerSchema>

export interface MecanicoSearchResult {
  id: string
  nome: string
  descricao: string
  endereco: string
  especialidade: string
  telefone: string
  isFavorito: boolean
}

export interface FavoritoItem {
  id: string
  mecanico: {
    id: string
    nome: string
    descricao: string
    endereco: string
    especialidade: string
  }
  createdAt: string
}

export interface Agendamento {
  id: string
  titulo: string
  descricao: string | null
  dataInicio: string
  dataFim: string
}

export interface MeProfile {
  id: string
  name: string
  email: string
  role: string
  image: string | null
  profile: {
    id: string
    nome: string
    email: string
    telefone: string
    cpf?: string
    cnpj?: string
    endereco?: string
    especialidade?: string
    descricao?: string | null
    hasFoto: boolean
  } | null
}
