import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { PersonalInfoForm } from "@/components/personal-info/PersonalInfoForm";
import { useSidebarOpen } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/informacoes-pessoais")({
  head: () => ({
    meta: [
      { title: "Informações Pessoais | A3 Digital" },
      {
        name: "description",
        content:
          "Visualize e edite seus dados de perfil, endereço e senha na plataforma A3 Digital.",
      },
      { property: "og:title", content: "Informações Pessoais | A3 Digital" },
      {
        property: "og:description",
        content:
          "Atualize perfil, foto, endereço e senha em uma única tela da A3 Digital.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
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
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Voltar
            </Link>
            <h1 className="label-caps text-lg text-foreground">
              Informações Pessoais
            </h1>
          </div>

          <PersonalInfoForm />
        </div>
      </main>
    </div>
  );
}
