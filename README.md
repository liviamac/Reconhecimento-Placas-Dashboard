# PlateVision — Dashboard de Reconhecimento de Placas

Dashboard em React para interação com uma API de Visão Computacional que reconhece placas de veículos a partir de imagens.

## Funcionalidades

- **Upload de imagem** com drag & drop e preview
- **Integração com API** REST (`POST /api/recognize-plate`)
- **Painel de resultados** com placa lida e barra de confiança
- **Histórico de leituras** na sessão atual (tabela)
- **Gráfico de métricas** com média de confiança (Recharts)
- **Tratamento de erros** e estados de loading
- **Design responsivo** (mobile-first)

## Pré-requisitos

- **Node.js** ≥ 18
- **API Backend** rodando em `http://localhost:8000` (siga as instruções fornecidas para rodar o motor de IA)

## Instalação e Execução

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd <nome-do-projeto>

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173` (ou a porta indicada no terminal).

## Estrutura de Pastas

```
src/
├── components/
│   ├── dashboard/
│   │   ├── ImageUpload.tsx      # Componente de upload com drag & drop
│   │   ├── ResultPanel.tsx      # Painel de resultado (placa + confiança)
│   │   ├── HistoryTable.tsx     # Tabela de histórico de leituras
│   │   └── ConfidenceChart.tsx  # Gráfico de métricas (Recharts)
│   └── ui/                     # Componentes base (shadcn/ui)
├── hooks/
│   └── usePlateHistory.ts      # Hook customizado para gerenciar histórico
├── services/
│   └── plateApi.ts             # Serviço de consumo da API
├── types/
│   └── plate.ts                # Tipagens TypeScript
├── pages/
│   └── Index.tsx                # Página principal do dashboard
└── index.css                    # Design system (tokens, cores, fontes)
```

## Tecnologias

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** — design system com tokens customizados
- **Recharts** — gráficos de métricas
- **Lucide React** — ícones
- **shadcn/ui** — componentes base

## API

O frontend envia um `POST` com `FormData` (chave `file`) para:

```
http://localhost:8000/api/recognize-plate
```

Resposta esperada:
```json
{
  "status": "sucesso",
  "mensagem": "1 placa(s)/texto(s) detectado(s).",
  "dados": [
    {
      "placa": "CDV 2172",
      "confianca": 99.32
    }
  ]
}
```
