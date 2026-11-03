import Page0 from "./routes/index";
import Page1 from "@/modules/administracao/pages/AdministracaoPage";
import Page2 from "./routes/arquivos-compartilhados";
import Page3 from "./routes/assistente";
import Page4 from "@/modules/mentorias/pages/AvalieNosPage";
import Page5 from "./routes/biblioteca-equipe";
import Page6 from "./routes/biblioteca-individuo";
import Page7 from "./routes/biblioteca-mercado";
import Page8 from "./routes/biblioteca-negocio";
import Page9 from "./routes/biblioteca/conteudo/$contentId";
import Page10 from "./routes/contatos-localizacao";
import Page11 from "./routes/conteudo";
import Page12 from "@/modules/mentorias/pages/DashboardPage";
import Page13 from "./routes/faq";
import Page14 from "./routes/hub";
import Page15 from "@/shared/pages/InformacoesPessoaisPage";
import Page16 from "./routes/jornada-de-desenvolvimento";
import Page17 from "@/modules/administracao/pages/AdministracaoMentoriasPage";
import Page18 from "./routes/meu-assessment";
import Page19 from "./routes/minhas-estatisticas";
import Page20 from "./routes/plano-de-acao";
import Page21 from "./routes/sessoes-mentoria";
import Page22 from "./routes/treinamentos";
import { createBrowserRouter } from "react-router-dom";
import RootLayout, { ErrorPage, NotFoundPage } from "./routes/__root";

export const appRoutes = [
  {
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Page0 />, handle: { title: "A3 Digital" } },
      {
        path: "/administracao",
        element: <Page1 />,
        handle: {
          meta: [
            { title: "Administração | A3 Digital" },
            {
              name: "description",
              content:
                "Módulo de Administração da A3 Digital: usuários, permissões e configurações.",
            },
            { property: "og:title", content: "Administração | A3 Digital" },
            {
              property: "og:description",
              content:
                "Administre usuários, permissões e configurações da plataforma A3 Digital.",
            },
            { property: "og:type", content: "website" },
            { name: "twitter:card", content: "summary_large_image" },
          ],
          title: "Administração | A3 Digital",
        },
      },
      {
        path: "/arquivos-compartilhados",
        element: <Page2 />,
        handle: {
          meta: [
            { title: "Arquivos Compartilhados | A3 Digital" },
            {
              name: "description",
              content:
                "Compartilhe e acompanhe arquivos entre mentor e mentorado na A3 Digital.",
            },
          ],
          title: "Arquivos Compartilhados | A3 Digital",
        },
      },
      {
        path: "/assistente",
        element: <Page3 />,
        handle: {
          meta: [{ title: "Assistente | A3 Digital" }],
          title: "Assistente | A3 Digital",
        },
      },
      {
        path: "/avalie-nos",
        element: <Page4 />,
        handle: {
          meta: [{ title: "Avalie-nos | A3 Digital" }],
          title: "Avalie-nos | A3 Digital",
        },
      },
      {
        path: "/biblioteca-equipe",
        element: <Page5 />,
        handle: {
          meta: [
            { title: "Biblioteca: Equipe | A3 Digital" },
            {
              name: "description",
              content:
                "Explore conteúdos do eixo Equipe e acompanhe seu progresso na Biblioteca.",
            },
          ],
          title: "Biblioteca: Equipe | A3 Digital",
        },
      },
      {
        path: "/biblioteca-individuo",
        element: <Page6 />,
        handle: {
          meta: [
            { title: "Biblioteca: Indivíduo | A3 Digital" },
            {
              name: "description",
              content:
                "Explore conteúdos do eixo Indivíduo e acompanhe seu progresso na Biblioteca.",
            },
          ],
          title: "Biblioteca: Indivíduo | A3 Digital",
        },
      },
      {
        path: "/biblioteca-mercado",
        element: <Page7 />,
        handle: {
          meta: [
            { title: "Biblioteca: Mercado | A3 Digital" },
            {
              name: "description",
              content:
                "Explore conteúdos do eixo Mercado e acompanhe seu progresso na Biblioteca.",
            },
          ],
          title: "Biblioteca: Mercado | A3 Digital",
        },
      },
      {
        path: "/biblioteca-negocio",
        element: <Page8 />,
        handle: {
          meta: [
            { title: "Biblioteca: Negócio | A3 Digital" },
            {
              name: "description",
              content:
                "Explore conteúdos do eixo Negócio e acompanhe seu progresso na Biblioteca.",
            },
          ],
          title: "Biblioteca: Negócio | A3 Digital",
        },
      },
      {
        path: "/biblioteca/conteudo/:contentId",
        element: <Page9 />,
        handle: { title: "A3 Digital" },
      },
      {
        path: "/contatos-localizacao",
        element: <Page10 />,
        handle: {
          meta: [{ title: "Contatos e localização | A3 Digital" }],
          title: "Contatos e localização | A3 Digital",
        },
      },
      {
        path: "/conteudo",
        element: <Page11 />,
        handle: {
          meta: [
            { title: "Conteúdo | A3 Digital" },
            {
              name: "description",
              content:
                "Acesse conteúdos para apoiar sua jornada de desenvolvimento na A3 Digital.",
            },
          ],
          title: "Conteúdo | A3 Digital",
        },
      },
      {
        path: "/dashboard",
        element: <Page12 />,
        handle: {
          meta: [
            { title: "Dashboard | A3 Digital - Mentoria e Assessment" },
            {
              name: "description",
              content:
                "Acompanhe suas trilhas, sessões de mentoria, assessment e plano de ação na plataforma A3 Digital.",
            },
            { property: "og:title", content: "Dashboard | A3 Digital" },
            {
              property: "og:description",
              content:
                "Plataforma de mentoria e assessment: trilhas, sessões, PDI e biblioteca.",
            },
            { property: "og:type", content: "website" },
            { name: "twitter:card", content: "summary_large_image" },
          ],
          title: "Dashboard | A3 Digital - Mentoria e Assessment",
        },
      },
      {
        path: "/faq",
        element: <Page13 />,
        handle: {
          meta: [{ title: "FAQ | A3 Digital" }],
          title: "FAQ | A3 Digital",
        },
      },
      {
        path: "/hub",
        element: <Page14 />,
        handle: {
          meta: [
            { title: "Hub de Módulos | A3 Digital" },
            {
              name: "description",
              content:
                "Escolha um módulo da A3 Digital: Desenvolvimento Profissional, Treinamentos ou Administração.",
            },
            { property: "og:title", content: "Hub de Módulos | A3 Digital" },
            {
              property: "og:description",
              content:
                "Acesse os módulos da plataforma A3 Digital em um só lugar.",
            },
            { property: "og:type", content: "website" },
            { name: "twitter:card", content: "summary_large_image" },
          ],
          title: "Hub de Módulos | A3 Digital",
        },
      },
      {
        path: "/informacoes-pessoais",
        element: <Page15 />,
        handle: {
          meta: [
            { title: "Informações Pessoais | A3 Digital" },
            {
              name: "description",
              content:
                "Visualize e edite seus dados de perfil, endereço e senha na plataforma A3 Digital.",
            },
            {
              property: "og:title",
              content: "Informações Pessoais | A3 Digital",
            },
            {
              property: "og:description",
              content:
                "Atualize perfil, foto, endereço e senha em uma única tela da A3 Digital.",
            },
            { property: "og:type", content: "website" },
            { name: "twitter:card", content: "summary_large_image" },
          ],
          title: "Informações Pessoais | A3 Digital",
        },
      },
      {
        path: "/jornada-de-desenvolvimento",
        element: <Page16 />,
        handle: {
          meta: [
            { title: "Jornada de Desenvolvimento | A3 Digital" },
            {
              name: "description",
              content:
                "Organize os pontos de partida e acompanhamento da sua jornada de desenvolvimento.",
            },
          ],
          title: "Jornada de Desenvolvimento | A3 Digital",
        },
      },
      {
        path: "/mentor",
        element: <Page17 />,
        handle: {
          meta: [
            { title: "Administração de Mentorias | A3 Digital" },
            {
              name: "description",
              content: "Gerencie os recursos administrativos de Mentorias.",
            },
          ],
          title: "Administração de Mentorias | A3 Digital",
        },
      },
      {
        path: "/meu-assessment",
        element: <Page18 />,
        handle: {
          meta: [
            { title: "Meu Assessment | A3 Digital" },
            {
              name: "description",
              content:
                "Acompanhe seus testes de assessment e acesse seus resultados na A3 Digital.",
            },
          ],
          title: "Meu Assessment | A3 Digital",
        },
      },
      {
        path: "/minhas-estatisticas",
        element: <Page19 />,
        handle: {
          meta: [
            { title: "Minhas Estatísticas | A3 Digital" },
            {
              name: "description",
              content:
                "Visualize suas estatísticas de desenvolvimento por eixo: Indivíduo, Equipe, Negócio e Mercado.",
            },
            {
              property: "og:title",
              content: "Minhas Estatísticas | A3 Digital",
            },
            {
              property: "og:description",
              content:
                "Acompanhe seu progresso em autoconhecimento, liderança, negócio e visão de mercado.",
            },
            { property: "og:type", content: "website" },
            { name: "twitter:card", content: "summary_large_image" },
          ],
          title: "Minhas Estatísticas | A3 Digital",
        },
      },
      {
        path: "/plano-de-acao",
        element: <Page20 />,
        handle: {
          meta: [
            { title: "Plano de Ação (PDI) | A3 Digital" },
            {
              name: "description",
              content:
                "Organize e acompanhe suas ações de desenvolvimento no PDI.",
            },
          ],
          title: "Plano de Ação (PDI) | A3 Digital",
        },
      },
      {
        path: "/sessoes-mentoria",
        element: <Page21 />,
        handle: { title: "A3 Digital" },
      },
      {
        path: "/treinamentos",
        element: <Page22 />,
        handle: {
          meta: [
            { title: "Treinamentos | A3 Digital" },
            {
              name: "description",
              content:
                "Módulo de Treinamentos da A3 Digital: turmas, cursos e capacitações.",
            },
            { property: "og:title", content: "Treinamentos | A3 Digital" },
            {
              property: "og:description",
              content:
                "Gerencie e acompanhe treinamentos e capacitações na A3 Digital.",
            },
            { property: "og:type", content: "website" },
            { name: "twitter:card", content: "summary_large_image" },
          ],
          title: "Treinamentos | A3 Digital",
        },
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];

export const getRouter = () =>
  createBrowserRouter(appRoutes, {
    basename: import.meta.env.BASE_URL.replace(/\/$/, "") || "/",
  });
