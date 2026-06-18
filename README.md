# integrantes:

Celso Teixeira de Oliveira Júnior  UC25101390

Lara Rodrigues Holanda Leal UC25104130

Paulo José Higa Freitas UC24101911

Joao Vitor Alves Bittencourt UC24100506


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

cp .env.example .env

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

## Autenticação (desenvolvimento)

A autenticação atual é **simulada** para desenvolvimento local:

- Qualquer CPF/CNPJ e senha não vazios permitem o login.
- A sessão é persistida em `localStorage` (chave `webmac-auth`).
- O botão **SAIR** na home remove a sessão.

A integração com a API real deve substituir a lógica em `src/context/AuthContext.tsx`.

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

Nenhuma variável é obrigatória no momento. Quando a API estiver disponível, crie um arquivo `.env.local` na raiz do projeto, por exemplo:

```env
VITE_API_URL=https://api.exemplo.com
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

- [ ] Integrar API de autenticação
- [ ] Validar CPF/CNPJ no formulário
- [ ] Implementar páginas SAQ e Parceiro
- [ ] Substituir logo placeholder pelo asset oficial

## Licença

Projeto privado — WebMec, Inc.
