import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarDays,
  Download,
  FileText,
  Search,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSidebarOpen } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";

type FileFilter = "all" | "received" | "sent";

type SharedFile = {
  id: string;
  name: string;
  description: string;
  author: string;
  date: string;
  dateLabel: string;
  direction: "received" | "sent";
};

const currentUser = "Luis Gustavo";

const initialFiles: SharedFile[] = [
  {
    id: "ARQ-001",
    name: "Plano de desenvolvimento.pdf",
    description: "Plano inicial compartilhado para acompanhamento da jornada.",
    author: "Juliano Ribeiro",
    date: "2026-09-08",
    dateLabel: "08/09/2026",
    direction: "received",
  },
  {
    id: "ARQ-002",
    name: "Anotações da sessão.docx",
    description: "Anotações e próximos passos da última sessão.",
    author: currentUser,
    date: "2026-09-06",
    dateLabel: "06/09/2026",
    direction: "sent",
  },
  {
    id: "ARQ-003",
    name: "Feedback de liderança.pdf",
    description: "Material de apoio para a próxima conversa de desenvolvimento.",
    author: "Juliano Ribeiro",
    date: "2026-09-04",
    dateLabel: "04/09/2026",
    direction: "received",
  },
];

const filters: { label: string; value: FileFilter }[] = [
  { label: "Todos", value: "all" },
  { label: "Recebidos", value: "received" },
  { label: "Enviados", value: "sent" },
];

export const Route = createFileRoute("/arquivos-compartilhados")({
  head: () => ({
    meta: [
      { title: "Arquivos Compartilhados | A3 Digital" },
      {
        name: "description",
        content: "Compartilhe e acompanhe arquivos entre mentor e mentorado na A3 Digital.",
      },
    ],
  }),
  component: ArquivosCompartilhados,
});

function ArquivosCompartilhados() {
  const [sidebarOpen, toggleSidebar] = useSidebarOpen();
  const [files, setFiles] = useState(initialFiles);
  const [filter, setFilter] = useState<FileFilter>("all");
  const [search, setSearch] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const visibleFiles = useMemo(() => {
    const query = search.toLowerCase().trim();

    return files
      .filter((file) => filter === "all" || file.direction === filter)
      .filter((file) =>
        [file.id, file.name, file.author, file.dateLabel].some((value) =>
          value.toLowerCase().includes(query),
        ),
      )
      .sort((first, second) => second.date.localeCompare(first.date));
  }, [files, filter, search]);

  const groupedFiles = useMemo(() => {
    const groups = new Map<string, SharedFile[]>();

    visibleFiles.forEach((file) => {
      const groupKey = filter === "all" ? file.date : `${file.author} - ${file.dateLabel}`;
      groups.set(groupKey, [...(groups.get(groupKey) ?? []), file]);
    });

    return [...groups.entries()];
  }, [filter, visibleFiles]);

  const resetUpload = () => {
    setUploadOpen(false);
    setSelectedFile(null);
    setTitle("");
    setDescription("");
    setIsDragging(false);
  };

  const chooseFile = (file: File | undefined) => {
    if (!file) return;
    setSelectedFile(file);
    if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ""));
  };

  const sendFile = () => {
    if (!selectedFile || !title.trim()) return;

    const now = new Date();
    const newFile: SharedFile = {
      id: `ARQ-${String(files.length + 1).padStart(3, "0")}`,
      name: selectedFile.name,
      description: description.trim() || "Arquivo compartilhado.",
      author: currentUser,
      date: now.toISOString().slice(0, 10),
      dateLabel: new Intl.DateTimeFormat("pt-BR").format(now),
      direction: "sent",
    };

    setFiles((currentFiles) => [newFile, ...currentFiles]);
    resetUpload();
  };

  const downloadFile = (file: SharedFile) => {
    const blob = new Blob([`Arquivo demonstrativo: ${file.name}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(url);
  };

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
            <p className="label-caps text-xs text-primary">Meu desenvolvimento</p>
            <h1 className="mt-1 text-2xl text-foreground">Arquivos Compartilhados</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Compartilhe documentos e mantenha os materiais da sua jornada organizados.
            </p>
          </header>

          <section className="rounded-md border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="label-caps text-sm text-foreground">Enviar um documento</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Compartilhe um material com seu mentor para manter o acompanhamento atualizado.
                </p>
              </div>
              <Button onClick={() => setUploadOpen(true)}>
                <UploadCloud className="size-4" />
                Enviar arquivo
              </Button>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="label-caps text-sm text-foreground">Arquivos compartilhados</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {visibleFiles.length} arquivo{visibleFiles.length === 1 ? "" : "s"} encontrado
                  {visibleFiles.length === 1 ? "" : "s"}
                </p>
              </div>
              <label className="relative block w-full lg:max-w-sm">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Pesquisar por ID, nome, autor ou data"
                  aria-label="Pesquisar arquivos"
                  className="pl-9"
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-2">
              {filters.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value)}
                  className={cn(
                    "label-caps rounded-md px-4 py-2 text-xs transition-colors",
                    filter === item.value
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card text-foreground hover:bg-accent",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {groupedFiles.length === 0 ? (
              <div className="rounded-md border border-dashed border-border bg-card px-6 py-12 text-center text-sm text-muted-foreground">
                Nenhum arquivo encontrado.
              </div>
            ) : (
              <div className="space-y-5">
                {groupedFiles.map(([group, groupFiles]) => (
                  <div key={group}>
                    <div className="mb-2 flex items-center gap-2">
                      {filter === "all" ? (
                        <CalendarDays className="size-4 text-primary" />
                      ) : (
                        <FileText className="size-4 text-primary" />
                      )}
                      <h3 className="label-caps text-xs text-muted-foreground">
                        {filter === "all" ? groupFiles[0].dateLabel : group}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {groupFiles.map((file) => (
                        <FileCard
                          key={file.id}
                          file={file}
                          canDelete={file.author === currentUser}
                          onDownload={downloadFile}
                          onDelete={(id) =>
                            setFiles((currentFiles) => currentFiles.filter((item) => item.id !== id))
                          }
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Dialog open={uploadOpen} onOpenChange={(open) => !open && resetUpload()}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Enviar arquivo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label htmlFor="file-title" className="label-caps mb-2 block text-xs text-muted-foreground">
                Título
              </label>
              <Input
                id="file-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Dê um título para o arquivo"
              />
            </div>
            <div>
              <label htmlFor="file-description" className="label-caps mb-2 block text-xs text-muted-foreground">
                Descrição
              </label>
              <textarea
                id="file-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Descreva brevemente este arquivo"
                className="min-h-20 w-full resize-y rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div>
              <span className="label-caps mb-2 block text-xs text-muted-foreground">Arquivo</span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setIsDragging(false);
                  chooseFile(event.dataTransfer.files[0]);
                }}
                className={cn(
                  "flex min-h-32 w-full flex-col items-center justify-center rounded-md border border-dashed px-5 py-6 text-center transition-colors",
                  isDragging
                    ? "border-primary bg-primary-soft/50"
                    : "border-border bg-muted/40 hover:border-primary hover:bg-primary-soft/30",
                )}
              >
                <UploadCloud className="size-8 text-primary" />
                <span className="mt-2 text-sm font-medium text-foreground">
                  {selectedFile ? selectedFile.name : "Selecione ou arraste um arquivo aqui"}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  Formatos aceitos: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG e PNG. Máximo de 10 MB.
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                onChange={(event) => chooseFile(event.target.files?.[0])}
                className="sr-only"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={resetUpload}>
              Cancelar
            </Button>
            <Button type="button" onClick={sendFile} disabled={!selectedFile || !title.trim()}>
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FileCard({
  file,
  canDelete,
  onDownload,
  onDelete,
}: {
  file: SharedFile;
  canDelete: boolean;
  onDownload: (file: SharedFile) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <article className="flex flex-col gap-4 rounded-md border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary-soft/50">
          <FileText className="size-5 text-primary" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h4 className="truncate text-sm font-medium text-foreground">{file.name}</h4>
            <span className="font-mono text-[10px] text-muted-foreground">{file.id}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{file.description}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Autor: <span className="text-foreground">{file.author}</span> · {file.dateLabel}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
        <button
          type="button"
          onClick={() => onDownload(file)}
          aria-label={`Baixar ${file.name}`}
          className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
        >
          <Download className="size-4" />
        </button>
        {canDelete && (
          <button
            type="button"
            onClick={() => onDelete(file.id)}
            aria-label={`Excluir ${file.name}`}
            className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>
    </article>
  );
}
