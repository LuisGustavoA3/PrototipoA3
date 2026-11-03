import { AdminLayout } from "@/modules/administracao/layout/AdminLayout";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { PersonalInfoForm } from "@/shared/informacoes-pessoais";
import { useSidebarOpen } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";

export default InformacoesPessoais;

function InformacoesPessoais() {
  const [sidebarOpen, toggleSidebar] = useSidebarOpen();

  const [params] = useSearchParams();
  const isAdmin = params.get("modulo") === "administracao";
  if (isAdmin)
    return (
      <AdminLayout>
        <div className="space-y-6 p-6">
          <Link
            to="/mentor"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground"
          >
            <ArrowLeft className="size-4" />
            Voltar
          </Link>
          <h1 className="label-caps text-lg text-foreground">
            Informações Pessoais
          </h1>
          <PersonalInfoForm />
        </div>
      </AdminLayout>
    );
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
              to="/dashboard"
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
