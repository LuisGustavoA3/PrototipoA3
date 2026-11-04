import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { useSidebarOpen } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { MentoriasBreadcrumb } from "../components/MentoriasBreadcrumb";
import { MentorshipSessionsBoard } from "../sessoes/MentorshipSessionsBoard";

export function SessoesMentoriaPage() {
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
        <div className="p-6">
          <MentorshipSessionsBoard />
        </div>
      </main>
    </div>
  );
}
