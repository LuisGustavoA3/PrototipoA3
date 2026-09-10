import { createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/AppSidebar";
import { useSidebarOpen } from "@/hooks/use-sidebar";
import { TopBar } from "@/components/TopBar";
import { DashboardContent } from "@/components/DashboardContent";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | A3 Digital - Mentoria e Assessment" },
      {
        name: "description",
        content:
          "Acompanhe suas trilhas, sessões de mentoria, assessment e plano de ação na plataforma A3 Digital.",
      },
      { property: "og:title", content: "Dashboard | A3 Digital" },
      {
        property: "og:description",
        content:
          "Plataforma de mentoria e assessment: trilhas, sessões, PDI e biblioteca.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

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
        <h1 className="label-caps px-6 pt-6 text-lg text-foreground">
          Dashboard
        </h1>
        <DashboardContent />
      </main>
    </div>
  );
}
