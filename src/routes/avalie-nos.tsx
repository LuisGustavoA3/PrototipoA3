import { useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/PageHeader";
import { TopBar } from "@/components/TopBar";
import { useSidebarOpen } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/avalie-nos")({
  head: () => ({ meta: [{ title: "Avalie-nos | A3 Digital" }] }),
  component: AvalieNosPage,
});

function AvalieNosPage() {
  const [sidebarOpen, toggleSidebar] = useSidebarOpen();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const script = document.createElement("script");
    script.src = "https://www.cognitoforms.com/f/seamless.js";
    script.dataset["key"] = "5lGlxjltkkWiY-uiQ0p1gg";
    script.dataset["form"] = "32";
    container.appendChild(script);

    return () => container.replaceChildren();
  }, []);

  return (
    <div className="h-screen w-full overflow-hidden bg-background">
      <TopBar onToggleSidebar={toggleSidebar} />
      <AppSidebar open={sidebarOpen} />
      <main
        className={cn(
          "h-full overflow-y-auto pt-16 transition-[padding-left] duration-300",
          sidebarOpen ? "pl-[264px]" : "pl-0",
        )}
      >
        <div className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6">
          <PageHeader
            section="Sua opinião"
            title="Avalie-nos"
            description="Conte para nós como podemos melhorar sua experiência no A3 Digital."
          />
          <section
            aria-label="Formulário de avaliação"
            className="max-w-3xl rounded-md border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:p-6"
          >
            <div ref={containerRef} />
          </section>
        </div>
      </main>
    </div>
  );
}
