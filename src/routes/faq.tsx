import { createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { useSidebarOpen } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [{ title: "FAQ | A3 Digital" }] }),
  component: FAQ,
});

function FAQ() {
  const [sidebarOpen, toggleSidebar] = useSidebarOpen();

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
        <div className="space-y-6 p-6">
          <header>
            <h1 className="text-2xl text-foreground">FAQ</h1>
          </header>
          <section className="flex min-h-48 items-center justify-center rounded-md border border-dashed border-border bg-card p-6 text-center shadow-[var(--shadow-card)]">
            <p className="text-sm text-muted-foreground">
              Conteúdo em preparação.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
