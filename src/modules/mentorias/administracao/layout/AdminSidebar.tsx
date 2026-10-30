import { useEffect, useRef, useState } from "react";
import { ChevronDown, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminNavigation } from "./admin-navigation";

type AdminSidebarProps = {
  open: boolean;
  currentPath: string;
  onNavigate: (path: string) => void;
  onClose: () => void;
};

export function AdminSidebar({
  open,
  currentPath,
  onNavigate,
  onClose,
}: AdminSidebarProps) {
  const sidebarRef = useRef<HTMLElement>(null);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (!(target instanceof Element)) return;

      if (target.closest("[data-sidebar-toggle]")) return;

      if (sidebarRef.current?.contains(target)) return;

      onClose();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  function toggleGroup(label: string) {
    setExpandedGroups((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label],
    );
  }

  return (
    <aside
      ref={sidebarRef}
      aria-label="Menu de navegação da Administração de Mentorias"
      aria-hidden={!open}
      inert={!open}
      className={cn(
        "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)]",
        "overflow-hidden border-r border-sidebar-border",
        "bg-sidebar transition-[width] duration-300",
        open ? "w-[264px]" : "w-0 border-r-0",
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

        <nav
          aria-label="Administração de Mentorias"
          className="flex-1 overflow-y-auto py-2"
        >
          <p className="px-5 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Mentorias
          </p>
          {adminNavigation.map((item) => {
            const isExpanded = expandedGroups.includes(item.label);
            const isActive = item.to === currentPath;
            const hasChildren = Boolean(item.children?.length);

            const itemClassName = cn(
              "flex w-full items-center gap-3 px-5 py-3",
              "text-left text-xs transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/60",
            );

            return (
              <div key={item.label}>
                {hasChildren ? (
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    onClick={() => toggleGroup(item.label)}
                    className={itemClassName}
                  >
                    <item.icon className="size-5 text-primary/70" />

                    <span className="flex-1">{item.label}</span>

                    <ChevronDown
                      className={cn(
                        "size-4 transition-transform",
                        isExpanded && "rotate-180",
                      )}
                    />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!item.to}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => {
                      if (item.to) {
                        onNavigate(item.to);
                        onClose();
                      }
                    }}
                    className={cn(
                      itemClassName,
                      !item.to && "cursor-not-allowed opacity-60",
                    )}
                  >
                    <item.icon className="size-5" />
                    <span>{item.label}</span>
                  </button>
                )}

                {hasChildren && isExpanded && (
                  <div className="ml-7 border-l-2 border-primary/30">
                    {item.children?.map((child) => (
                      <button
                        key={child.label}
                        type="button"
                        disabled={!child.to}
                        onClick={() => {
                          if (child.to) {
                            onNavigate(child.to);
                            onClose();
                          }
                        }}
                        className={cn(
                          "flex w-full items-center gap-2 px-4 py-2.5",
                          "text-left text-[11px] text-sidebar-foreground",
                          "transition-colors",
                          child.to
                            ? "hover:bg-sidebar-accent/60"
                            : "cursor-not-allowed opacity-60",
                        )}
                      >
                        <child.icon className="size-4 text-primary/70" />
                        <span>{child.label}</span>
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
