import {
  BookOpen,
  Building2,
  ClipboardList,
  LayoutDashboard,
  Rocket,
  Settings,
  Users,
  Package,
  type LucideIcon,
} from "lucide-react";
export const adminPaths = {
  dashboard: "/mentor",
  mentorados: "/mentor/mentorados",
  trilhas: "/mentor/trilhas",
  bookAcoes: "/mentor/banco-de-acoes",
  ferramentasAvaliacao: "/mentor/ferramentas-de-avaliacao",
  usuarios: "/mentor/usuarios",
  empresas: "/mentor/empresas",
  configuracoes: "/mentor/configuracoes",
} as const;
export type AdminPath = (typeof adminPaths)[keyof typeof adminPaths];
export type AdminNavigationItem = {
  label: string;
  icon: LucideIcon;
  to?: AdminPath;
  children?: AdminNavigationItem[];
};
export const adminNavigation: AdminNavigationItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, to: adminPaths.dashboard },
  {
    label: "Desenvolvimento",
    icon: Rocket,
    children: [
      { label: "Mentorados", icon: Users, to: adminPaths.mentorados },
      { label: "Trilhas", icon: Package, to: adminPaths.trilhas },
      { label: "Banco de Ações", icon: BookOpen, to: adminPaths.bookAcoes },
      {
        label: "Ferramentas de Avaliação",
        icon: ClipboardList,
        to: adminPaths.ferramentasAvaliacao,
      },
    ],
  },
  { label: "Usuários", icon: Users, to: adminPaths.usuarios },
  { label: "Empresas", icon: Building2, to: adminPaths.empresas },
  { label: "Configurações", icon: Settings, to: adminPaths.configuracoes },
];
