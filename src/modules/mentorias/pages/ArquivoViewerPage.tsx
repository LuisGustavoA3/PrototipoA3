import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Download, Pause, Play, Volume2 } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { useSidebarOpen } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { MentoriasBreadcrumb } from "../components/MentoriasBreadcrumb";
import { useSelectedTrail } from "../trilhas/use-selected-trail";
import {
  useSharedFiles,
  type SharedFile,
} from "../arquivos-compartilhados/shared-files-store";
import {
  downloadSharedFile,
  mockFileContents,
} from "../arquivos-compartilhados/file-preview-data";

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
          <Button asChild variant="outline">
            <Link to="/arquivos-compartilhados">
              Voltar aos arquivos compartilhados
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}

function FilePreview({ file }: { file: SharedFile }) {
  if (file.contentUrl) {
    if (["png", "jpg", "jpeg", "gif", "webp"].includes(file.format))
      return (
        <img
          src={file.contentUrl}
          alt={file.description || file.name}
          className="mx-auto max-h-[75vh] max-w-full rounded-md border bg-card object-contain"
        />
      );
    if (["mp4", "webm", "mov"].includes(file.format))
      return (
        <video
          controls
          src={file.contentUrl}
          className="max-h-[75vh] w-full rounded-md bg-black"
        />
      );
    if (["mp3", "wav", "ogg", "m4a"].includes(file.format))
      return <audio controls src={file.contentUrl} className="w-full" />;
    if (["pdf", "txt"].includes(file.format))
      return (
        <iframe
          title={`Conteúdo de ${file.name}`}
          src={file.contentUrl}
          sandbox=""
          className="h-[75vh] w-full rounded-md border bg-white"
        />
      );
    return (
      <div className="rounded-md border bg-card p-8">
        Este formato está disponível para download. A visualização no navegador
        requer conversão do arquivo.
      </div>
    );
  }
  const content = mockFileContents[file.id];
  if (!content)
    return (
      <p>Prévia indisponível. Utilize o download para acessar o arquivo.</p>
    );
  if (file.format === "xlsx")
    return (
      <div className="overflow-x-auto rounded-md border bg-card">
        <table className="w-full text-left text-sm">
          <caption className="p-4 text-left text-lg font-semibold">
            {content.title}
          </caption>
          <thead className="bg-muted">
            <tr>
              {content.paragraphs[0]!.split(";").map((cell) => (
                <th scope="col" className="px-5 py-3" key={cell}>
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {content.paragraphs.slice(1).map((row) => (
              <tr key={row} className="border-t">
                {row.split(";").map((cell, index) => (
                  <td key={index} className="px-5 py-4">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  if (file.format === "pptx")
    return <Slides title={content.title} slides={content.paragraphs} />;
  if (["mp4", "mp3"].includes(file.format))
    return (
      <MediaPreview
        title={content.title}
        paragraphs={content.paragraphs}
        video={file.format === "mp4"}
      />
    );
  if (file.format === "png")
    return (
      <div
        role="img"
        aria-label="Anotações da mentoria: escutar, priorizar, pedir feedback e registrar aprendizados"
        className="mx-auto max-w-4xl rounded-md border bg-orange-50 p-8 text-slate-900"
      >
        <h2 className="text-2xl font-semibold">{content.title}</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {content.paragraphs.map((text, index) => (
            <div
              key={text}
              className="min-h-32 rotate-1 border border-orange-200 bg-yellow-100 p-6 shadow-sm"
            >
              <span className="text-orange-700">0{index + 1}</span>
              <p className="mt-3 text-lg">{text}</p>
            </div>
          ))}
        </div>
      </div>
    );
  if (file.format === "zip")
    return (
      <section className="rounded-md border bg-card p-6">
        <h2 className="text-xl font-semibold">{content.title}</h2>
        <ul className="mt-5 divide-y">
          {content.paragraphs.map((name) => (
            <li className="py-4" key={name}>
              {name}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted-foreground">
          3 arquivos no pacote de apoio.
        </p>
      </section>
    );
  return (
    <article className="mx-auto min-h-[60vh] max-w-3xl space-y-6 rounded-md border bg-card p-8 shadow-sm sm:p-12">
      <p className="text-sm font-semibold text-primary">
        A3 DIGITAL · DESENVOLVIMENTO
      </p>
      <h2 className="text-2xl font-semibold">{content.title}</h2>
      {content.paragraphs.map((text) => (
        <p key={text} className="whitespace-pre-wrap leading-8">
          {text}
        </p>
      ))}
    </article>
  );
}

function Slides({ title, slides }: { title: string; slides: string[] }) {
  const [index, setIndex] = useState(0);
  return (
    <section className="overflow-hidden rounded-md border bg-card">
      <div className="flex aspect-video flex-col justify-center gap-8 bg-orange-50 p-8 text-slate-900 sm:p-16">
        <p className="text-orange-700">A3 DIGITAL · {title}</p>
        <h2 className="text-2xl font-semibold sm:text-4xl">{slides[index]}</h2>
      </div>
      <div className="flex items-center justify-between gap-3 p-4">
        <Button
          variant="outline"
          disabled={index === 0}
          onClick={() => setIndex(index - 1)}
        >
          Anterior
        </Button>
        <span>
          Slide {index + 1} de {slides.length}
        </span>
        <Button
          variant="outline"
          disabled={index === slides.length - 1}
          onClick={() => setIndex(index + 1)}
        >
          Próximo
        </Button>
      </div>
    </section>
  );
}

function MediaPreview({
  title,
  paragraphs,
  video,
}: {
  title: string;
  paragraphs: string[];
  video: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const duration = 30;
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(
      () => setPosition((value) => Math.min(value + 1, duration)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [playing]);
  useEffect(() => {
    if (position === duration) setPlaying(false);
  }, [position]);
  return (
    <section className="overflow-hidden rounded-md border bg-card">
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-6 bg-slate-900 p-8 text-center text-white",
          video ? "aspect-video" : "min-h-64",
        )}
      >
        <Volume2 className="size-12 text-orange-400" />
        <h2 className="text-2xl">{title}</h2>
        <p className="max-w-xl text-lg">
          {
            paragraphs[
              Math.min(
                paragraphs.length - 1,
                Math.floor(position / (duration / paragraphs.length)),
              )
            ]
          }
        </p>
      </div>
      <div className="space-y-4 p-4">
        <input
          aria-label="Progresso do conteúdo"
          type="range"
          min="0"
          max={duration}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => {
              if (position === duration) setPosition(0);
              setPlaying(!playing);
            }}
          >
            {playing ? (
              <Pause className="size-4" />
            ) : (
              <Play className="size-4" />
            )}
            {playing ? "Pausar" : "Reproduzir"}
          </Button>
          <span className="text-sm">
            00:{String(position).padStart(2, "0")} / 00:30
          </span>
        </div>
        <details>
          <summary className="cursor-pointer text-sm text-muted-foreground">
            Transcrição
          </summary>
          <div className="mt-3 space-y-2">
            {paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
        </details>
      </div>
    </section>
  );
}
