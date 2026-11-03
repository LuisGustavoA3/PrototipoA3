# Rotas

As páginas são componentes React exportados por padrão. O registro explícito de URLs,
componentes e títulos fica em `src/router.tsx`, com React Router DOM 6.

- `src/main.tsx`: entrada SPA, QueryClientProvider e RouterProvider.
- `__root.tsx`: layout raiz, histórico, título, restauração de rolagem e erros.
- `biblioteca/conteudo/$contentId.tsx`: registrada como `/biblioteca/conteudo/:contentId`, com `useParams`.
- `/`: redireciona para `/hub` substituindo a entrada no histórico.
- URLs desconhecidas: página 404.

Os nomes existentes foram mantidos para reduzir movimentações. Não há geração de
rotas por arquivos, SSR, TanStack Start ou `routeTree.gen.ts`.
Os endpoints antigos estão em `server/api/`; não são rotas de frontend.
