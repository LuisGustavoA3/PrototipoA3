import { useCallback, useState, type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";
import { cn } from "@/lib/utils";

type AdminLayoutProps = {
  children: ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const currentPath = useRouterState({
    select: (state) => state.location.pathname,
  });

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((current) => !current);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const handleNavigate = useCallback(
    (path: string) => {
      navigate({ to: path });
      closeSidebar();
    },
    [navigate, closeSidebar],
  );

  const handleReturnToHub = useCallback(() => {
    navigate({ to: "/hub" });
  }, [navigate]);

  const handleProfile = useCallback(() => {
    navigate({ to: "/informacoes-pessoais" });
  }, [navigate]);

  return (
    <div className="h-screen w-full overflow-hidden bg-background">
      <AdminTopBar
        onToggleSidebar={toggleSidebar}
        onProfile={handleProfile}
        onReturnToHub={handleReturnToHub}
      />

      <AdminSidebar
        open={sidebarOpen}
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onClose={closeSidebar}
      />

      {/* Sobreposição para dispositivos móveis */}
      {sidebarOpen && (
        <div
          className="fixed inset-x-0 bottom-0 top-16 z-30 bg-black/40 md:hidden"
          aria-hidden="true"
          onClick={closeSidebar}
        />
      )}

      <main
        className={cn(
          "h-full min-w-0 overflow-y-auto pt-16",
          "transition-[padding-left] duration-300",
          sidebarOpen ? "md:pl-[264px]" : "md:pl-0",
        )}
      >
        {children}
      </main>
    </div>
  );
}
