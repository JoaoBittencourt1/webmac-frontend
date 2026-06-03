# WebMec Frontend

Interface web da **WebMec**, construída com React, TypeScript e Vite. O projeto inclui o fluxo inicial de autenticação (login, cadastro e recuperação de senha) e o layout base (header, footer e área logada).

## Stack

- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite 8](https://vite.dev/)
- [React Router](https://reactrouter.com/)

## Pré-requisitos

- [Node.js](https://nodejs.org/) 20+
- npm 10+

## Como rodar

```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento (http://localhost:5173)
npm run dev

# Build de produção
npm run build

# Pré-visualizar o build
npm run preview

# Lint
npm run lint
```

## Rotas

| Rota | Descrição | Acesso |
|------|-----------|--------|
| `/entrar` | Login (CPF/CNPJ e senha) | Público |
| `/cadastro` | Criação de conta | Público |
| `/esqueci-senha` | Recuperação de senha | Público |
| `/` | Painel pós-login (menu + sair) | Autenticado |
| `/pedidos` | Meus pedidos | Autenticado |
| `/orcamentos` | Orçamentos | Autenticado |
| `/perfil` | Meu cadastro | Autenticado |
| `/saq` | Perguntas frequentes | Público (placeholder) |
| `/parceiro` | Seja um parceiro | Público (placeholder) |

Usuários não autenticados que acessam `/` são redirecionados para `/entrar`.

## Autenticação

A autenticação usa a API do backend (`webmec-backend`):

- Login e cadastro por CPF/CNPJ + senha (`POST /api/auth/login`, `POST /api/auth/register`).
- Sessão JWT em `localStorage` (chave `webmac-auth`).
- Em desenvolvimento, o Vite faz proxy de `/api` para `http://localhost:3000`.

**Credenciais de teste** (após `npm run db:seed` no backend, senha `123456`):

- Carlos: `12345678901` ou `123.456.789-01`
- Ana: `23456789012` ou `234.567.890-12`

## Estrutura do projeto

```
src/
├── assets/              # Imagens e ícones estáticos
├── components/
│   ├── auth/            # Proteção de rotas
│   ├── layout/          # Header, Footer, MainLayout
│   └── login/           # Formulário de login
├── context/             # Estado global de autenticação
├── pages/               # Páginas por rota
├── App.tsx              # Definição de rotas
├── main.tsx             # Entrada da aplicação
└── index.css            # Estilos globais e variáveis CSS
```

## Variáveis de ambiente

Em desenvolvimento não é obrigatório configurar nada (proxy no `vite.config.ts`).

Para produção, crie `.env.local`:

```env
VITE_API_URL=https://api.seudominio.com/api
```

Variáveis expostas ao cliente devem usar o prefixo `VITE_`. Não commite arquivos `.env` com credenciais.

## Scripts npm

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o Vite em modo desenvolvimento |
| `npm run build` | Compila TypeScript e gera `dist/` |
| `npm run preview` | Serve o build de produção localmente |
| `npm run lint` | Executa o ESLint |

## Próximos passos

- [x] Integrar API de autenticação
- [ ] Validar CPF/CNPJ no formulário
- [ ] Implementar páginas SAQ e Parceiro
- [ ] Substituir logo placeholder pelo asset oficial

## Licença

Projeto privado — WebMec, Inc.
