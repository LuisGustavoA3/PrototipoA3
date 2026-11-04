# Migração para a base do Portal A3

## Estado em 30/10/2026

A base foi alinhada às famílias de versões informadas do Portal: React/React DOM 18,
React Router DOM 6, Vite 5 com React SWC, Tailwind 3, TanStack Query 5, date-fns 3,
DayPicker 8, painéis redimensionáveis 2, Sonner 1, tailwind-merge 2 e Vaul 0.9.
O lockfile npm registra as versões resolvidas. Vitest 3 e Testing Library validam a migração.

As 23 URLs foram preservadas. Os componentes continuam em `src/routes/`, registrados
em `src/router.tsx`; a biblioteca usa `:contentId`. `src/main.tsx` fornece QueryClient
e RouterProvider. O formulário mantém o bloqueio de navegação e o aviso ao fechar/recarregar.
Administração permanece separada de Mentorias em `src/modules/administracao/`.

Tailwind usa configuração própria e PostCSS. Os tokens OKLCH e as fontes foram
preservados; modificadores de opacidade usam os canais da mesma cor. Calendário,
painéis e classes exclusivas do Tailwind 4 foram adaptados.

## APIs e Monday

- Os quatro handlers foram preservados em `server/api/`, sem dependência do Start.
- `server/vite-api.ts` os conecta ao servidor de desenvolvimento do Vite.
- As consultas/mutações estão em `server/monday-api.ts`. O frontend importa somente
  o mapeamento puro de `src/lib/monday-mapping.ts`.
- `MONDAY_API_TOKEN` permanece no processo Node, vindo do ambiente ou dos arquivos
  `.env` carregados pelo Vite. Nunca usar o prefixo `VITE_` para esse token.
- A escrita de comentários continua permitida somente em desenvolvimento.
- Produção continua consumindo `public/data/monday-snapshot.json`, gerado pelo
  script existente. O build estático não cria um backend de produção.
- Este checkout não contém o snapshot. Para visualizar sessões no build local de
  produção, gerar o arquivo com `MONDAY_API_TOKEN` configurado; o workflow já faz
  essa geração usando o secret existente. Não foram fabricados dados do Monday.
- Na integração real, os handlers precisam ser hospedados/adaptados ao backend do
  Portal. A identificação fixa de teste e os dados mockados continuam existentes.
- Consultas reais exigem credenciais; os testes simulam respostas e não gravam no Monday.

## Executar e publicar

Usar npm e `package-lock.json` como referência de instalação.

```sh
npm ci
npm run dev
npm run lint
npx tsc --noEmit
npm test
npm run build
```

`npm run dev:local` conserva o modo `localdocker`, sem criar infraestrutura Docker.
`npm run build` gera a SPA em `dist/`, na raiz `/`. O servidor de produção do Portal
precisa encaminhar URLs de páginas para `index.html`, preservando endpoints de API.

`npm run build:pages` usa `/PrototipoA3/` e gera `dist/404.html` para acesso direto às
rotas no GitHub Pages. O Pages retorna HTTP 404 nesse fallback, embora a SPA carregue
a página solicitada. O workflow agora publica `dist/` e continua gerando o snapshot.
`npm run preview` serve o build estático, sem habilitar endpoints de escrita.

## Limites da integração

A migração prepara o protótipo; ainda não o incorpora ao repositório do Portal.
As versões foram recuperadas da conversa anterior, sem acesso à configuração completa
de autenticação, backend e hospedagem do Portal. Não foram adicionadas dependências
de funcionalidades que o protótipo não utiliza. ExcelJS e Framer Motion permanecem
por terem consumidores existentes; Framer Motion usa a série 12, compatível com React 18.

O plano `PLANO_REESTRUTURACAO_MONOLITO_MODULAR.md` registra o contexto anterior com
TanStack Start. Para entrada, navegação e build atuais, prevalecem este documento e
o código. A organização por domínios e as fronteiras modulares continuam válidas.

Os testes cobrem renderização das rotas, redirecionamento inicial, parâmetro de conteúdo,
base do Pages, 404, saída com alterações e contratos dos handlers. Não substituem
revisão visual em navegador nem validação com o Monday real.

## Simplificação do módulo em 03/11/2026

O conteúdo de `src/modules/mentorias/mentorado/` passou diretamente para
`src/modules/mentorias/`, mantendo a divisão existente por funcionalidades.
O estado e a API pública antes em `mentorias/shared/biblioteca/` foram incorporados
a `mentorias/biblioteca/`, pois seus consumidores pertencem a este módulo.
Os imports foram atualizados sem alterar URLs, regras ou layouts. A adoção de
`pages/` e a reorganização interna por tipo de arquivo ficam para outra etapa.
As referências a `mentorado/` no plano arquitetural anterior representam a proposta
histórica; para a estrutura atual, prevalecem esta decisão e o código.

## Organização de páginas em 03/11/2026

As telas de Mentorias ficam em `src/modules/mentorias/pages/`; as de Administração,
em `src/modules/administracao/pages/`. As páginas completas antes implementadas nas
rotas de dashboard, informações pessoais, avaliação e Administração também passaram
para essas pastas. Os registros e adaptadores em `src/routes/` preservam as URLs e
os parâmetros existentes. Hub e Treinamentos continuam como páginas gerais.

Stores, hooks, dados e componentes auxiliares permanecem nas pastas de suas
funcionalidades. Os exports públicos existentes foram mantidos e apontam para as
novas localizações. A criação de `pages/` não implica mover esses auxiliares nem
introduzir `menu.ts`, `routes.tsx` ou novas camadas nesta etapa.

## Validação executada

- 33 testes aprovados; TypeScript e `git diff --check` aprovados.
- Lint sem erros, com o aviso preexistente de Fast Refresh em `PersonalInfoForm.tsx`.
- Build padrão e build Pages aprovados; permanece o aviso de chunks grandes.
- HTTP local: páginas, health, métodos inválidos, endpoints inexistentes e validação
  de comentários/origem aprovados, sem operações no Monday real.
- Lockfile coerente; fallback Pages e animações conferidos; o JavaScript de produção
  não contém o token nem o cliente de consultas do Monday.
- Sem commit/push; a branch permaneceu `inicioMentor`, no commit `26d6f0f`.
