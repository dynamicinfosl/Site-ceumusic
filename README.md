# Site Céu Music

Aplicação front-end construída com React 19 + Vite para apresentar o catálogo da gravadora fictícia Céu Music. O projeto prioriza animações suaves, uso de vídeo em tela cheia e seções temáticas que destacam artistas, lançamentos, notícias e contato.

## Visão geral

- **Framework**: React 19 com Vite 7 (SWC) e TypeScript.
- **Estilo**: Tailwind CSS com utilitários customizados (`glass-card`, `scroll-reveal`, divisórias animadas e vídeo de fundo).
- **Navegação**: `react-router-dom` 7 com `BrowserRouter` configurável via `__BASE_PATH__`.
- **Internacionalização**: i18next com detecção automática de idioma e carregamento dinâmico de módulos.
- **Mock de dados**: páginas utilizam conteúdo estático/ilustrativo hospedado em `readdy.ai` até integração com APIs reais.

## Scripts NPM

| Script | Descrição |
| --- | --- |
| `npm run dev` | Sobe o servidor de desenvolvimento Vite em `http://localhost:3000`. |
| `npm run build` | Gera build de produção em `out/` com sourcemaps. |
| `npm run preview` | Servidor local para inspecionar o build produzido. |

## Estrutura principal

```
src/
├── App.tsx                # Injeta i18n + BrowserRouter
├── router/                # Configuração e hook de rotas
├── pages/                 # Home, artistas, notícias, releases, contato…
│   └── home/components/   # Seções (Hero, About, Artists, etc.)
├── components/feature/    # Navbar e Footer compartilhados
├── i18n/                  # Setup do i18next e carregamento dinâmico de traduções
├── index.css              # Tailwind + animações customizadas
└── main.tsx               # Bootstrap React/Vite
```

## Fluxo de navegação

- `AppRoutes` combina `useRoutes` com um `navigatePromise` global, permitindo disparar navegação programática fora de componentes React.
- `src/router/config.tsx` (não exibido acima) centraliza o mapeamento `path → page` (home, artistas, releases, notícias, contato e 404).
- Cada página importa `Navbar` e `Footer` para manter consistência visual.

## Estilização e animações

- Tailwind é extendido com utilitários personalizados (animações `fadeInUp`, `scrollHorizontal`, `liquidFlow`, divisórias animadas e `scroll-reveal`).
- A página inicial aplica `IntersectionObserver` para adicionar a classe `revealed` e disparar animações no scroll.
- Componentes como `HeroSection` possuem vídeo de fundo (`<video>` em loop) e modais de player YouTube.

## Internacionalização

- `src/i18n/index.ts` registra `LanguageDetector` e carrega `messages` via `import.meta.glob`.  
- Para adicionar traduções, crie arquivos `src/i18n/local/<locale>/<namespace>.ts` exportando um objeto `default` com as chaves. O mecanismo mescla automaticamente os namespaces por idioma.

## Integrações previstas

- Dependências como `firebase`, `@supabase/supabase-js`, `@stripe/react-stripe-js` e `recharts` já estão disponíveis no `package.json`, mas ainda não são utilizadas nos componentes.  
- Recomendação: centralizar chaves/API em `.env` e expor serviços via hooks (ex.: `useSupabase`, `useStripe`) à medida que as integrações forem implementadas.

## Configuração e execução local

1. **Instalar dependências**
   ```bash
   npm install
   ```
2. **Executar ambiente de desenvolvimento**
   ```bash
   npm run dev
   ```
3. **Gerar build de produção**
   ```bash
   npm run build
   ```
4. (Opcional) Validar build gerado:
   ```bash
   npm run preview
   ```

## Variáveis de ambiente relevantes

| Variável | Exemplo | Uso |
| --- | --- | --- |
| `BASE_PATH` | `/ceumusic` | Define `base` do Vite e `basename` do `BrowserRouter`, útil para deploy em subpastas (ex.: GitHub Pages). |
| `IS_PREVIEW` | `true` | Injeta `__IS_PREVIEW__` nos builds; pode ser utilizado para condicionar banners/avisos em ambientes temporários. |
| `VITE_YOUTUBE_API_KEY` | `AIzaSy...` | Chave da API do YouTube Data API v3. Necessária para buscar vídeos do canal na seção de lançamentos e hero. |

> Crie um arquivo `.env` ou defina as variáveis diretamente no ambiente (CLI/CI).  
> Para GitHub Pages, defina `BASE_PATH=/Site-ceumusic` (ou similar) antes do `npm run build`.  
> Para obter uma API Key do YouTube: acesse [Google Cloud Console](https://console.cloud.google.com/), crie um projeto, habilite a YouTube Data API v3 e gere uma chave de API.

## Conteúdo e próximos passos

- Os dados de artistas, shows e notícias estão hardcoded. Substitua por chamadas reais (REST, Supabase ou Firebase) quando as APIs forem disponibilizadas.
- As imagens usam endpoints gerados dinamicamente no `readdy.ai`; considere migrar para ativos hospedados pela própria gravadora para evitar indisponibilidade.
- Adicionar testes (unitários ou visuais) e mecanismos de CMS agiliza atualizações frequentes de conteúdo.

---

Em caso de dúvidas ou para expandir funcionalidades (ex.: fluxo de contato integrado, autenticação ou dashboard administrativo), utilize este README como ponto de partida para entender o stack e tomar decisões de arquitetura.

