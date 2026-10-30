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

export type MentorNavigationItem = {
  label: string;
  icon: LucideIcon;
  to?: "/mentor";
  children?: MentorNavigationItem[];
};

export const adminNavigation: MentorNavigationItem[] = [
  {
    label: "Dashboard Mentorias",
    icon: LayoutDashboard,
    to: "/mentor",
  },
  {
    label: "Desenvolvimento",
    icon: Rocket,
    children: [
      { label: "Programas", icon: Package },
      { label: "Coachees", icon: Users },
      { label: "Book de Ações", icon: BookOpen },
      { label: "Ferramentas de Avaliação", icon: ClipboardList },
      { label: "Planos & Configurações", icon: Wrench },
      { label: "Configurações", icon: Settings },
    ],
  },
  {
    label: "Usuários",
    icon: Users,
  },
  {
    label: "Empresas",
    icon: Building2,
  },
  {
    label: "Biblioteca",
    icon: Library,
    children: [
      { label: "Citações", icon: Quote },
      { label: "Competências", icon: BookOpen },
      { label: "Páginas estáticas", icon: FileText },
      { label: "Recursos", icon: Network },
      { label: "Recursos públicos", icon: Archive },
      { label: "Templates de Atividades", icon: ClipboardList },
      { label: "Template de Ratings", icon: SlidersHorizontal },
    ],
  },
];
