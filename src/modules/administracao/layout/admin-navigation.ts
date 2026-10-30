import {
  Archive,
  BookOpen,
  Building2,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Library,
  Network,
  Package,
  Quote,
  Rocket,
  Settings,
  SlidersHorizontal,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const adminPaths = {
  dashboard: "/mentor",
  programas: "/mentor/desenvolvimento/programas",
  coachees: "/mentor/desenvolvimento/coachees",
  bookAcoes: "/mentor/desenvolvimento/book-de-acoes",
  ferramentasAvaliacao: "/mentor/desenvolvimento/ferramentas-de-avaliacao",
  planosConfiguracoes: "/mentor/desenvolvimento/planos-configuracoes",
  configuracoes: "/mentor/desenvolvimento/configuracoes",
  usuarios: "/mentor/usuarios",
  empresas: "/mentor/empresas",
  citacoes: "/mentor/biblioteca/citacoes",
  competencias: "/mentor/biblioteca/competencias",
  paginasEstaticas: "/mentor/biblioteca/paginas-estaticas",
  recursos: "/mentor/biblioteca/recursos",
  recursosPublicos: "/mentor/biblioteca/recursos-publicos",
  templatesAtividades: "/mentor/biblioteca/templates-atividades",
  templateRatings: "/mentor/biblioteca/template-ratings",
} as const;

export type AdminPath = (typeof adminPaths)[keyof typeof adminPaths];

export type AdminNavigationItem = {
  label: string;
  icon: LucideIcon;
  to?: AdminPath;
  children?: AdminNavigationItem[];
};

export const adminNavigation: AdminNavigationItem[] = [
  {
    label: "Dashboard Mentorias",
    icon: LayoutDashboard,
    to: adminPaths.dashboard,
  },
  {
    label: "Desenvolvimento",
    icon: Rocket,
    children: [
      {
        label: "Programas",
        icon: Package,
        to: adminPaths.programas,
      },
      {
        label: "Coachees",
        icon: Users,
        to: adminPaths.coachees,
      },
      {
        label: "Book de Ações",
        icon: BookOpen,
        to: adminPaths.bookAcoes,
      },
      {
        label: "Ferramentas de Avaliação",
        icon: ClipboardList,
        to: adminPaths.ferramentasAvaliacao,
      },
      {
        label: "Planos & Configurações",
        icon: Wrench,
        to: adminPaths.planosConfiguracoes,
      },
      {
        label: "Configurações",
        icon: Settings,
        to: adminPaths.configuracoes,
      },
    ],
  },
  {
    label: "Usuários",
    icon: Users,
    to: adminPaths.usuarios,
  },
  {
    label: "Empresas",
    icon: Building2,
    to: adminPaths.empresas,
  },
  {
    label: "Biblioteca",
    icon: Library,
    children: [
      {
        label: "Citações",
        icon: Quote,
        to: adminPaths.citacoes,
      },
      {
        label: "Competências",
        icon: BookOpen,
        to: adminPaths.competencias,
      },
      {
        label: "Páginas estáticas",
        icon: FileText,
        to: adminPaths.paginasEstaticas,
      },
      {
        label: "Recursos",
        icon: Network,
        to: adminPaths.recursos,
      },
      {
        label: "Recursos públicos",
        icon: Archive,
        to: adminPaths.recursosPublicos,
      },
      {
        label: "Templates de Atividades",
        icon: ClipboardList,
        to: adminPaths.templatesAtividades,
      },
      {
        label: "Template de Ratings",
        icon: SlidersHorizontal,
        to: adminPaths.templateRatings,
      },
    ],
  },
];
