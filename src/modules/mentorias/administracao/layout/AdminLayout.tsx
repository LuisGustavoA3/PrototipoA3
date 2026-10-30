import { useCallback, useState, type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";
import { cn } from "@/lib/utils";

type AdminLayoutProps = {
  title: string;
  children: ReactNode;
};

export function AdminLayout({ title, children }: AdminLayoutProps) {
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
      if (path === "/mentor") {
        navigate({ to: "/mentor" });
      }
    },
    [navigate],
  );

  const handleBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: "/hub" });
    }
  }, [navigate]);

  const handleReturnToHub = useCallback(() => {
    navigate({ to: "/hub" });
  }, [navigate]);

  const handleProfile = useCallback(() => {
    navigate({ to: "/informacoes-pessoais" });
  }, [navigate]);

  return (
    <div className="h-screen w-full overflow-hidden bg-background">
      <AdminTopBar
        title={title}
        onToggleSidebar={toggleSidebar}
        onBack={handleBack}
        onProfile={handleProfile}
        onReturnToHub={handleReturnToHub}
      />

      <AdminSidebar
        open={sidebarOpen}
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onClose={closeSidebar}
      />

      <main
        className={cn(
          "h-full overflow-y-auto pt-16 transition-[padding-left] duration-300",
          sidebarOpen ? "pl-[264px]" : "pl-0",
        )}
      >
        {children}
      </main>
    </div>
  );
}
