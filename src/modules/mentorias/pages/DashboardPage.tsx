import { MentoriasBreadcrumb } from "@/modules/mentorias/components/MentoriasBreadcrumb";
import { AppSidebar } from "@/components/AppSidebar";
import { useSidebarOpen } from "@/hooks/use-sidebar";
import { TopBar } from "@/components/TopBar";
import { DashboardContent } from "@/modules/mentorias/dashboard";
import { PageHeader } from "@/components/PageHeader";
import { cn } from "@/lib/utils";

export default Index;

function Index() {
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
        <MentoriasBreadcrumb />
        <div className="px-6 pt-6">
          <PageHeader
            title="Dashboard"
            description="Acompanhe seu progresso, suas sessões, conteúdos e principais atividades de desenvolvimento."
          />
        </div>

        <DashboardContent />
      </main>
    </div>
  );
}
