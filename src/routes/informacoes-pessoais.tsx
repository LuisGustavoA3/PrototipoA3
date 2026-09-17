import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, UserCircle2 } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { useSidebarOpen } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/informacoes-pessoais")({
  head: () => ({
    meta: [{ title: "Informações pessoais | A3 Digital" }],
  }),
  component: InformacoesPessoais,
});

function InformacoesPessoais() {
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
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="size-4" /> Voltar ao dashboard
          </Link>
          <header>
            <p className="label-caps text-xs text-primary">Perfil</p>
            <h1 className="mt-1 text-2xl text-foreground">Informações pessoais</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              A área de edição dos seus dados pessoais será disponibilizada aqui.
            </p>
          </header>
          <section className="flex min-h-48 items-center justify-center rounded-md border border-dashed border-border bg-card p-6 text-center shadow-[var(--shadow-card)]">
            <div>
              <UserCircle2 className="mx-auto size-12 text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">Tela de informações pessoais em preparação.</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
