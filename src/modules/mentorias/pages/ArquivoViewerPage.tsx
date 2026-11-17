import { FilePreview } from "../arquivos-compartilhados/FilePreview";
import { useParams } from "react-router-dom";
import { Download } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { useSidebarOpen } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { MentoriasBreadcrumb } from "../components/MentoriasBreadcrumb";
import { useSelectedTrail } from "../trilhas/use-selected-trail";
import { useSharedFiles } from "../arquivos-compartilhados/shared-files-store";
import { downloadSharedFile } from "../arquivos-compartilhados/file-preview-data";

export default function ArquivoViewerPage() {
  const { fileId } = useParams();
  const files = useSharedFiles();
  const { hasContent } = useSelectedTrail();
  const file = hasContent
    ? files.find((item) => item.id === fileId)
    : undefined;
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
        <div className="space-y-6 p-6">
          {file ? (
            <>
              <header className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="break-all text-2xl font-semibold">
                    {file.name}
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    {file.description}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {file.author} · {file.dateLabel}
                  </p>
                </div>
                <Button
                  variant="outline"
                  disabled={file.allowDownload === false}
                  onClick={() => downloadSharedFile(file)}
                >
                  <Download className="size-4" />
                  Baixar arquivo
                </Button>
              </header>
              <FilePreview
                key={`${file.id}-${file.contentUrl ?? "example"}`}
                file={file}
              />
            </>
          ) : (
            <div className="rounded-md border bg-card p-8">
              <h1 className="text-xl">Arquivo não disponível</h1>
              <p className="mt-2 text-muted-foreground">
                Confira a trilha selecionada e os arquivos compartilhados.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
