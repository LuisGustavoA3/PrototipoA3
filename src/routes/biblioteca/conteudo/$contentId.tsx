import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Download,
  Expand,
  Maximize,
  Minus,
  Pause,
  Play,
  Plus,
  Volume2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { useSidebarOpen } from "@/hooks/use-sidebar";
import {
  getActivePublicContentsForAxis,
  getLibraryContent,
  setLibraryContentFinished,
  useLibraryContents,
  type LibraryContent,
} from "@/lib/library-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/biblioteca/conteudo/$contentId")({
  component: ContentReaderPage,
});

function ContentReaderPage() {
  const { contentId } = Route.useParams();
  const [sidebarOpen, toggleSidebar] = useSidebarOpen();
  const contents = useLibraryContents();
  const content = getLibraryContent(contentId);
  const navigate = useNavigate({ from: "/biblioteca/conteudo/$contentId" });

  const axisContents = useMemo(
    () => (content ? getActivePublicContentsForAxis(content.axis) : []),
    [content, contents],
  );
  const currentIndex = axisContents.findIndex((item) => item.id === contentId);

  useEffect(() => {
    if (content && !content.finished) setLibraryContentFinished(content.id, true);
  }, [content]);

  if (!content || !content.public || !content.active) {
    return (
      <ReaderShell sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}>
        <div className="rounded-md border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
          Conteúdo não encontrado.
        </div>
      </ReaderShell>
    );
  }

  const previousContent = currentIndex > 0 ? axisContents[currentIndex - 1] : undefined;
  const nextContent = currentIndex >= 0 && currentIndex < axisContents.length - 1 ? axisContents[currentIndex + 1] : undefined;

  const goTo = (item: LibraryContent | undefined) => {
    if (item) navigate({ params: { contentId: item.id } });
  };

  return (
    <ReaderShell sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}>
      <div className="space-y-5">
        <header>
          <p className="label-caps text-xs text-primary">{content.type}</p>
          <h1 className="mt-1 text-2xl text-foreground">
            {content.type} - {content.name}
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{content.topic}</p>
          {content.description ? (
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{content.description}</p>
          ) : null}
        </header>

        <ContentViewer content={content} />

        <nav className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="outline" disabled={!previousContent} onClick={() => goTo(previousContent)}>
            <ChevronLeft className="size-4" /> Anterior
          </Button>
          <Button variant="outline" disabled={!nextContent} onClick={() => goTo(nextContent)}>
            Próximo <ChevronRight className="size-4" />
          </Button>
        </nav>
      </div>
    </ReaderShell>
  );
}

function ReaderShell({
  children,
  sidebarOpen,
  toggleSidebar,
}: {
  children: React.ReactNode;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}) {
  return (
    <div className="h-screen w-full overflow-hidden bg-background">
      <TopBar onToggleSidebar={toggleSidebar} />
      <AppSidebar open={sidebarOpen} />
      <main className={cn("h-full overflow-y-auto pt-16 transition-[padding-left] duration-300", sidebarOpen ? "pl-[264px]" : "pl-0")}>
        <div className="mx-auto w-full max-w-6xl space-y-6 p-6">{children}</div>
      </main>
    </div>
  );
}

function ContentViewer({ content }: { content: LibraryContent }) {
  if (content.format === "video") return <VideoPlayer />;
  if (content.format === "audio") return <AudioPlayer />;
  return <PDFViewer content={content} />;
}

function PDFViewer({ content }: { content: LibraryContent }) {
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const viewerRef = useRef<HTMLDivElement>(null);
  const totalPages = 3;

  const toggleFullscreen = () => viewerRef.current?.requestFullscreen?.();
  const download = () => {
    const blob = new Blob([`Documento mockado: ${content.name}`], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${content.name}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div ref={viewerRef} className="overflow-hidden rounded-md border border-border bg-card shadow-[var(--shadow-card)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-3">
        <div className="flex items-center gap-1">
          <ViewerButton label="Primeira página" onClick={() => setPage(1)}><ChevronsLeft /></ViewerButton>
          <ViewerButton label="Página anterior" onClick={() => setPage(Math.max(1, page - 1))}><ChevronLeft /></ViewerButton>
          <span className="px-3 text-xs text-muted-foreground">{page} de {totalPages}</span>
          <ViewerButton label="Próxima página" onClick={() => setPage(Math.min(totalPages, page + 1))}><ChevronRight /></ViewerButton>
          <ViewerButton label="Última página" onClick={() => setPage(totalPages)}><ChevronsRight /></ViewerButton>
        </div>
        <div className="flex items-center gap-1">
          <ViewerButton label="Diminuir zoom" onClick={() => setZoom(Math.max(60, zoom - 10))}><Minus /></ViewerButton>
          <span className="min-w-12 text-center text-xs text-muted-foreground">{zoom}%</span>
          <ViewerButton label="Aumentar zoom" onClick={() => setZoom(Math.min(160, zoom + 10))}><Plus /></ViewerButton>
          <ViewerButton label="Ajustar visualização" onClick={() => setZoom(100)}><Expand /></ViewerButton>
          <ViewerButton label="Tela cheia" onClick={toggleFullscreen}><Maximize /></ViewerButton>
          <ViewerButton label="Baixar conteúdo" onClick={download} disabled={!content.permitirDownload}><Download /></ViewerButton>
        </div>
      </div>
      <div className="flex min-h-[520px] items-start justify-center overflow-auto bg-muted/40 p-6 sm:p-10">
        <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }} className="w-full max-w-3xl bg-card p-8 shadow-lg transition-transform sm:p-14">
          <p className="label-caps text-xs text-primary">{content.type}</p>
          <h2 className="mt-5 text-3xl text-foreground">{content.name}</h2>
          <div className="mt-8 space-y-4 text-sm leading-7 text-muted-foreground">
            <p>Este é um documento demonstrativo da Biblioteca A3 Digital.</p>
            <p>O conteúdo mockado representa a área em que o arquivo real será exibido posteriormente.</p>
            <p className="pt-10 text-center text-xs text-muted-foreground">Página {page}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoPlayer() {
  return <MockMediaPlayer kind="video" duration={180} />;
}

function AudioPlayer() {
  return <MockMediaPlayer kind="audio" duration={1930} />;
}

function MockMediaPlayer({ kind, duration }: { kind: "video" | "audio"; duration: number }) {
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [volume, setVolume] = useState(80);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setCurrent((value) => value >= duration ? 0 : value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [duration, playing]);

  const toggleFullscreen = () => mediaRef.current?.requestFullscreen?.();

  return (
    <div ref={mediaRef} className="overflow-hidden rounded-md border border-border bg-card shadow-[var(--shadow-card)]">
      <div className={cn("flex items-center justify-center bg-foreground/90", kind === "video" ? "aspect-video" : "min-h-64")}>{kind === "video" ? <Play className="size-16 text-primary-foreground/80" /> : <Volume2 className="size-16 text-primary-foreground/80" />}</div>
      <div className="space-y-3 p-4">
        <input type="range" min="0" max={duration} value={current} onChange={(event) => setCurrent(Number(event.target.value))} className="w-full accent-primary" aria-label="Progresso do conteúdo" />
        <div className="flex flex-wrap items-center gap-3">
          <ViewerButton label={playing ? "Pausar" : "Reproduzir"} onClick={() => setPlaying(!playing)}>{playing ? <Pause /> : <Play />}</ViewerButton>
          <span className="text-xs text-muted-foreground">{formatTime(current)} / {formatTime(duration)}</span>
          <Volume2 className="ml-auto size-4 text-muted-foreground" />
          <input type="range" min="0" max="100" value={volume} onChange={(event) => setVolume(Number(event.target.value))} className="w-24 accent-primary" aria-label="Volume" />
          {kind === "video" && <ViewerButton label="Tela cheia" onClick={toggleFullscreen}><Maximize /></ViewerButton>}
        </div>
      </div>
    </div>
  );
}

function ViewerButton({ label, onClick, disabled = false, children }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return <button type="button" aria-label={label} title={label} onClick={onClick} disabled={disabled} className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-primary"><span className="size-4">{children}</span></button>;
}

function formatTime(value: number) {
  const minutes = Math.floor(value / 60).toString().padStart(2, "0");
  const seconds = Math.floor(value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}