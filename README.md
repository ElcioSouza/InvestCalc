# InvestCalc

Simule e compare investimentos de renda fixa — CDB, LCI e LCA — com cálculos instantâneos de IR, IOF e rentabilidade líquida. Consulta a SELIC em tempo real via backend.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19 + TypeScript
- **Estilo:** Tailwind
- **Formulários:** React Hook Form + Zod
- **Ícones:** Lucide React
- **Fonte:** Inter (Google Fonts)

## Início Rápido

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar em produção
npm start
```

O app estará disponível em [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm start` | Servidor de produção |
| `npm run lint` | Verificação de lint (ESLint) |

## Variáveis de Ambiente

O projeto já possui um arquivo `.env.example` com as variáveis necessárias. Copie para criar seu `.env`:

```bash
cp .env.example .env
```

Ou crie manualmente o arquivo `.env` na raiz do projeto:

```env
INTERNAL_API_BASE_URL=https://apiapp.infinityfreeapp.com
NEXT_PUBLIC_SITE_URL=https://investcalc-chi.vercel.app
```

> O Next.js lê `.env` nativamente. Não é preciso instalar nenhuma biblioteca adicional.

| Variável | Escopo | Descrição |
|----------|--------|-----------|
| `INTERNAL_API_BASE_URL` | Servidor | URL do backend externo da API: `https://apiapp.infinityfreeapp.com` |
| `NEXT_PUBLIC_SITE_URL` | Cliente | URL do site em produção |

## Funcionalidades

### Tipos de Investimento

- **CDB** — Certificado de Depósito Bancário (tributado: IR + IOF)
- **LCI** — Letra de Crédito Imobiliário (isento de IR/IOF)
- **LCA** — Letra de Crédito do Agronegócio (isento de IR/IOF)

### Tipos de Taxa

- **Pós-fixado** — Atrelado à variação do CDI
- **Pré-fixado** — Taxa fixa anual (% a.a.)

### Abas

1. **Simular** — Preencha os parâmetros e obtenha o cálculo instantâneo
2. **Histórico** — Visualize investimentos salvos com paginação (10 por página), com opções de editar, visualizar detalhes e excluir

### Resultados Exibidos

Todos os valores vêm prontos do backend PHP — o frontend apenas exibe:

- Montante líquido final
- Lucro bruto e líquido
- Lucro mensal / diário
- IOF e Imposto de Renda (alíquota regressiva: 22,5% → 15%)
- Percentual de rendimento (`profit_percentage`)
- Alíquota do IR (`ir_aliquot`)
- Selo de isenção para LCI/LCA
- Gráfico de barras (Capital × Lucro × Impostos × Líquido)
- Datas de aplicação e resgate
- Dias úteis corridos

### Extras

- Consulta da **SELIC em tempo real** via API do Banco Central do Brasil (`/api/selic`)
- Validação de formulários com Zod
- Toast notifications para feedback
- Design responsivo com dark theme
- Código modular com padrão **Single Responsibility (SRP)**
- Mensagens de erro genéricas para segurança (sem expor detalhes internos)
- **Edição com recálculo** — ao editar um investimento salvo, os valores são recalculados automaticamente
- **Paginação no histórico** — 10 itens por página com navegação entre páginas via API

## Estrutura do Projeto

```
app/
├── layout.tsx                      # Root layout
├── globals.css                     # Estilos globais (Tailwind, animações)
├── error.tsx                       # Error boundary global
├── not-found.tsx                   # Página 404
├── (front)/
│   ├── layout.tsx                  # Provider tree (AppProviders)
│   ├── page.tsx                    # Dashboard principal
│   └── error.tsx                   # Error boundary do route group
└── (server)/
    └── api/
        ├── calculate/[[...slug]]/
        │   └── route.ts            # API catch-all (simular, CRUD)
        └── selic/
            └── route.ts            # Consulta SELIC (Banco Central)

src/
├── @front/                         # Código do frontend
│   ├── components/                 # 15 componentes UI
│   ├── constants/                  # Configs, defaults
│   ├── hooks/                      # useSelicRate
│   ├── integrations/               # InvestmentRepository (HTTP client)
│   ├── providers/                  # 5 React Context providers
│   ├── schemas/                    # Validação Zod
│   ├── services/                   # SimulatorService, HistoryService
│   ├── types/                      # Interfaces TypeScript
│   └── utils/                      # formatação BRL, %, datas
├── @server/                        # Código server-side
│   ├── controllers/                # CalculateController
│   ├── integrations/
│   │   └── investmentApi/          # Proxy API externa (modular)
│   │       ├── index.ts            # Ponto de entrada (fetchFromApi)
│   │       ├── constants.ts        # Constantes e configurações
│   │       ├── crypto.ts           # Resolução de desafio AES
│   │       ├── request.ts          # Helpers HTTP (safeFetch, forwardResponse)
│   │       └── challengeHandler.ts # Lógica de resolução de challenges
│   └── utils/                      # handleRoute, SystemError
├── @global/                        # Código compartilhado
│   └── utils/                      # DateUtil
└── @types/                         # Declarações de tipo globais
```

## Path Aliases

| Alias | Caminho |
|-------|---------|
| `@front/*` | `src/@front/*` |
| `@server/*` | `src/@server/*` |
| `@global/*` | `src/@global/*` |
| `@types/*` | `src/@types/*` |

## API

### `GET /api/selic`

Consulta a taxa SELIC em tempo real via API do Banco Central do Brasil.

| Método | URL | Descrição |
|--------|-----|-----------|
| `GET` | `/api/selic` | Retorna `{ "selic_meta": 14.25, "date": "05/08/2026", "source": "BCB/SGS Séries Temporais" }` |

O frontend consome essa rota automaticamente ao selecionar pós-fixado, preenchendo o campo "Selic Meta (%)" no formulário.

### `GET/POST/PUT/DELETE /api/calculate/[[...slug]]`

Rota catch-all que delega para o controller server-side. Endpoints consumidos pelo frontend:

| Método | URL | Descrição |
|--------|-----|-----------|
| `GET` | `/api/calculate` | Listar investimentos salvos |
| `GET` | `/api/calculate?page={n}&per_page={n}` | Listar com paginação (padrão: 10 por página) |
| `GET` | `/api/calculate?{params}` | Simular investimento |
| `GET` | `/api/calculate/{id}` | Buscar investimento por ID |
| `POST` | `/api/calculate` | Salvar novo investimento |
| `PUT` | `/api/calculate/{id}` | Atualizar investimento (edit com recálculo) |
| `DELETE` | `/api/calculate/{id}` | Excluir investimento |

### Fluxo de Dados

```
Frontend (React)
  → useSelicRate hook → fetch('/api/selic') → Backend PHP (Banco Central)
  → HistoryContext → fetchHistory(page) → InvestmentRepository
    → fetch('/api/calculate?page={n}&per_page=11') → Backend PHP (cálculos)
    ← { data: [...], current_page, last_page, per_page, total }

Backend PHP (apiapp.infinityfreeapp.com)
  → /api/selic → Banco Central do Brasil (SGS Séries Temporais)
  → /api/calculate?page={n}&per_page={n} → Cálculos financeiros (IR, IOF, rendimento)
```
