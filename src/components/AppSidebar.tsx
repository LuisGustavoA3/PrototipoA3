import { useState } from "react";
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
  children?: { label: string; icon: React.ComponentType<{ className?: string }> }[];
};

const items: Item[] = [
  { label: "Dashboard", icon: LayoutDashboard },
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
          <span className="text-sm font-medium text-foreground">Luis Gustavo</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {items.map((item) => {
            const isActive = active === item.label || isGroupActive(item);
            const groupOpen = openGroups[item.label] || isGroupActive(item);

            return (
              <div key={item.label}>
                <button
                  onClick={() => {
                    setActive(item.label);
                    if (item.children) toggleGroup(item.label);
                  }}
                  className={cn(
                    "label-caps flex w-full items-center gap-3 px-5 py-3 text-left text-xs transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/60",
                  )}
                >
                  <item.icon
                    className={cn("size-5", isActive ? "text-primary" : "text-primary/70")}
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
                    {item.children.map((child) => (
                      <button
                        key={child.label}
                        onClick={() => setActive(child.label)}
                        className={cn(
                          "label-caps flex w-full items-center gap-2 px-4 py-2.5 text-left text-[11px] transition-colors",
                          active === child.label
                            ? "bg-sidebar-accent/70 text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                        )}
                      >
                        <child.icon
                          className={cn(
                            "size-4",
                            active === child.label ? "text-primary" : "text-primary/70",
                          )}
                        />
                        {child.label}
                      </button>
                    ))}
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
