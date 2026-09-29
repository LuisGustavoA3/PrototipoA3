# PrototipoA3

Protótipo da nova Plataforma de Desenvolvimento Profissional da A3, desenvolvido para validar a experiência do usuário, a navegação e as funcionalidades da plataforma.

O projeto reúne as principais áreas de desenvolvimento profissional em uma interface integrada, com foco em usabilidade, organização e acompanhamento da jornada de desenvolvimento.

## Tecnologias

- **React 19** — construção da interface.
- **TypeScript** — tipagem estática.
- **TanStack Start** — estrutura da aplicação e gerenciamento de rotas.
- **TanStack Router** — navegação baseada em arquivos.
- **Vite** — ambiente de desenvolvimento e build.
- **Tailwind CSS 4** — estilização.
- **shadcn/ui e Radix UI** — componentes de interface.
- **Lucide React** — ícones.
- **Recharts** — visualização de dados e gráficos.

## Arquitetura

A aplicação é organizada em uma arquitetura frontend baseada em componentes e rotas.

- `src/routes/` — páginas e rotas da aplicação.
- `src/components/` — componentes reutilizáveis, como navegação, barra superior e elementos da interface.
- `src/components/ui/` — componentes de interface baseados em Radix UI.
- `src/lib/` — dados de demonstração, stores e funções auxiliares.
- `src/hooks/` — hooks reutilizáveis.
- `src/router.tsx` — configuração do roteador.
- `src/routeTree.gen.ts` — árvore de rotas gerada automaticamente pelo TanStack Router.

## Funcionamento atual

O protótipo permite navegar pelas principais áreas da plataforma, incluindo:

- **Meu Desenvolvimento:** jornada de desenvolvimento, assessment e plano de ação.
- **Biblioteca:** conteúdos organizados por eixos de desenvolvimento.
- **Arquivos Compartilhados:** interface para visualização e gerenciamento de documentos.
- **Ajuda:** FAQ, assistente, contatos e localização.
- **Estatísticas:** visualização de indicadores e evolução do desenvolvimento.
- **Administração:** área de interface administrativa.

Os dados de demonstração são organizados em stores no frontend, permitindo simular interações e validar os fluxos da aplicação.

## Estado do projeto

O sistema está em fase de prototipação e validação da interface.

O repositório não representa, neste estágio, uma plataforma completa com backend e persistência centralizada de dados. As funcionalidades dependentes de serviços externos e infraestrutura de produção ainda precisam ser integradas e validadas.

## Executar localmente

Requisitos: Node.js e npm.

```bash
npm install
npm run dev
```

O servidor de desenvolvimento será iniciado pelo Vite.

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o ambiente de desenvolvimento |
| `npm run build` | Gera a versão de produção |
| `npm run preview` | Executa uma prévia do build |
| `npm run lint` | Executa a análise estática do código |
| `npm run format:check` | Verifica a formatação dos arquivos |

