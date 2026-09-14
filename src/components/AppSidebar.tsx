import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ListChecks,
  UserSearch,
  Map,
  ClipboardCheck,
  Paperclip,
  Lightbulb,
  LifeBuoy,
  Star,
  MessageSquare,
  ChevronDown,
  Briefcase,
  Users,
  TrendingUp,
  User,
  Sprout,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarGroups } from "@/hooks/use-sidebar";

type Item = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  to?: "/";
  children?: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
};

const items: Item[] = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/" },
  {
    label: "Meu Desenvolvimento",
    icon: Sprout,
    children: [
      { label: "Conteúdo", icon: ListChecks },
      { label: "Meu Assessment", icon: UserSearch },
      { label: "Jornada de Desenvolvimento", icon: Map },
      { label: "Plano de Ação (PDI)", icon: ClipboardCheck },
      { label: "Arquivos Compartilhados", icon: Paperclip },
    ],
  },
  {
    label: "Biblioteca",
    icon: Lightbulb,
    children: [
      { label: "Eixo: Negócio", icon: Briefcase },
      { label: "Eixo: Equipe", icon: Users },
      { label: "Eixo: Mercado", icon: TrendingUp },
      { label: "Eixo: Indivíduo", icon: User },
    ],
  },
  { label: "Ajuda", icon: LifeBuoy },
  { label: "Avalie-nos", icon: Star },
  { label: "Fale com a A3", icon: MessageSquare },
];

export function AppSidebar({ open }: { open: boolean }) {
  const [active, setActive] = useState("Dashboard");
  const [openGroups, toggleGroup] = useSidebarGroups();
  const location = useLocation();

  const isGroupActive = (item: Item) =>
    item.children?.some((child) => child.label === active) ?? false;

  return (
    <aside
      className={cn(
        "fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] overflow-hidden border-r border-sidebar-border bg-sidebar transition-[width] duration-300",
        open ? "w-[264px]" : "w-0",
      )}
    >
      <div className="flex h-full w-[264px] flex-col">
        <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-4">
          <div className="flex size-9 items-center justify-center rounded-full bg-muted">
            <User className="size-5 text-muted-foreground" />
          </div>
          <span className="text-sm font-medium text-foreground">
            Luis Gustavo
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {items.map((item) => {
            const isActive =
              active === item.label ||
              (item.label === "Dashboard" && location.pathname === "/") ||
              isGroupActive(item);
            const groupOpen = openGroups[item.label] || isGroupActive(item);
            const itemClassName = cn(
              "label-caps flex w-full items-center gap-3 px-5 py-3 text-left text-xs transition-colors",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/60",
            );

            if (item.to) {
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setActive(item.label)}
                  className={itemClassName}
                >
                  <item.icon
                    className={cn(
                      "size-5",
                      isActive ? "text-primary" : "text-primary/70",
                    )}
                  />
                  <span className="flex-1">{item.label}</span>
                </Link>
              );
            }

            return (
              <div key={item.label}>
                <button
                  onClick={() => {
                    setActive(item.label);
                    if (item.children) toggleGroup(item.label);
                  }}
                  className={itemClassName}
                >
                  <item.icon
                    className={cn(
                      "size-5",
                      isActive ? "text-primary" : "text-primary/70",
                    )}
                  />
                  <span className="flex-1">{item.label}</span>
                  {item.children && (
                    <ChevronDown
                      className={cn(
                        "size-4 transition-transform",
                        groupOpen && "rotate-180",
                      )}
                    />
                  )}
                </button>

                {item.children && groupOpen && (
                  <div className="border-l-2 border-primary/30 ml-7">
                    {item.children.map((child) => {
                      const childActive =
                        active === child.label ||
                        (child.label === "Conteúdo" &&
                          location.pathname === "/conteudo") ||
                        (child.label === "Meu Assessment" &&
                          location.pathname === "/meu-assessment") ||
                        (child.label === "Arquivos Compartilhados" &&
                          location.pathname === "/arquivos-compartilhados") ||
                        (child.label === "Plano de Ação (PDI)" &&
                          location.pathname === "/plano-de-acao") ||
                        (child.label === "Eixo: Negócio" &&
                          location.pathname === "/biblioteca-negocio") ||
                        (child.label === "Eixo: Equipe" &&
                          location.pathname === "/biblioteca-equipe") ||
                        (child.label === "Eixo: Mercado" &&
                          location.pathname === "/biblioteca-mercado");
                      const childClassName = cn(
                        "label-caps flex w-full items-center gap-2 px-4 py-2.5 text-left text-[11px] transition-colors",
                        childActive
                          ? "bg-sidebar-accent/70 text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                      );

                      if (
                        child.label === "Conteúdo" ||
                          child.label === "Meu Assessment" ||
                          child.label === "Jornada de Desenvolvimento" ||
                          child.label === "Arquivos Compartilhados" ||
                          child.label === "Plano de Ação (PDI)" ||
                          child.label === "Eixo: Negócio" ||
                          child.label === "Eixo: Equipe" ||
                          child.label === "Eixo: Mercado"
                      ) {
                        return (
                          <Link
                            key={child.label}
                            to={
                              child.label === "Conteúdo"
                                ? "/conteudo"
                                  : child.label === "Meu Assessment"
                                    ? "/meu-assessment"
                                    : child.label === "Jornada de Desenvolvimento"
                                      ? "/jornada-de-desenvolvimento"
                                      : child.label === "Arquivos Compartilhados"
                                        ? "/arquivos-compartilhados"
                                        : child.label === "Plano de Ação (PDI)"
                                          ? "/plano-de-acao"
                                          : child.label === "Eixo: Negócio"
                                            ? "/biblioteca-negocio"
                                            : child.label === "Eixo: Equipe"
                                              ? "/biblioteca-equipe"
                                              : "/biblioteca-mercado"
                            }
                            onClick={() => setActive(child.label)}
                            className={childClassName}
                          >
                            <child.icon
                              className={cn(
                                "size-4",
                                childActive
                                  ? "text-primary"
                                  : "text-primary/70",
                              )}
                            />
                            {child.label}
                          </Link>
                        );
                      }

                      return (
                        <button
                          key={child.label}
                          onClick={() => setActive(child.label)}
                          className={childClassName}
                        >
                          <child.icon
                            className={cn(
                              "size-4",
                              childActive ? "text-primary" : "text-primary/70",
                            )}
                          />
                          {child.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
