import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BookOpen, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { Input } from "@/components/ui/input";
import { useSidebarOpen } from "@/hooks/use-sidebar";
import {
  type LibraryContent,
  setLibraryContentFinished,
  useLibraryContents,
} from "@/lib/library-store";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "finished" | "unfinished";

const statusFilters: { label: string; value: StatusFilter }[] = [
  { label: "Todos", value: "all" },
  { label: "Finalizado", value: "finished" },
  { label: "Não finalizado", value: "unfinished" },
];

export const Route = createFileRoute("/biblioteca-equipe")({
  head: () => ({
    meta: [
      { title: "Biblioteca: Equipe | A3 Digital" },
      {
        name: "description",
        content: "Explore conteúdos do eixo Equipe e acompanhe seu progresso na Biblioteca.",
      },
    ],
  }),
  component: BibliotecaEquipe,
});

function BibliotecaEquipe() {
  const [sidebarOpen, toggleSidebar] = useSidebarOpen();
  const contents = useLibraryContents();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const navigate = useNavigate({ from: "/biblioteca-equipe" });

  const activePublicContents = contents.filter((content) => content.public && content.active);
  const teamContents = activePublicContents.filter((content) => content.axis === "Equipe");
  const finishedLibrary = activePublicContents.filter((content) => content.finished).length;
  const finishedTeam = teamContents.filter((content) => content.finished).length;
  const libraryProgress = percentage(finishedLibrary, activePublicContents.length);
  const teamProgress = percentage(finishedTeam, teamContents.length);

  const visibleContents = useMemo(() => {
    const query = search.toLowerCase().trim();
    return teamContents.filter((content) => {
      const matchesSearch = [content.name, content.type, content.topic].some((value) =>
        value.toLowerCase().includes(query),
      );
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "finished" && content.finished) ||
        (statusFilter === "unfinished" && !content.finished);
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, teamContents]);

  const groupedContents = useMemo(() => {
    const groups = new Map<string, LibraryContent[]>();
    visibleContents.forEach((content) => {
      groups.set(content.topic, [...(groups.get(content.topic) ?? []), content]);
    });
    return [...groups.entries()];
  }, [visibleContents]);

  const openContent = (content: LibraryContent) => {
    if (!content.finished) setLibraryContentFinished(content.id, true);
    navigate({ to: "/biblioteca/conteudo/$contentId", params: { contentId: content.id } });
  };

  const toggleFinished = (content: LibraryContent) => {
    setLibraryContentFinished(content.id, !content.finished);
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
            <p className="label-caps text-xs text-primary">Biblioteca</p>
            <h1 className="mt-1 text-2xl text-foreground">Equipe</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Desenvolva sua comunicação, colaboração e liderança para fortalecer o trabalho em equipe.
            </p>
          </header>

          <section className="grid gap-4 lg:grid-cols-2">
            <ProgressCard
              label="Progresso na Biblioteca"
              value={libraryProgress}
              description={`${libraryProgress}% dos conteúdos finalizados`}
            />
            <ProgressCard
              label="Progresso no eixo Equipe"
              value={teamProgress}
              description={`${teamProgress}% dos conteúdos finalizados`}
            />
          </section>

          <p className="rounded-md border border-border bg-card px-4 py-3 text-xs text-muted-foreground">
            Seu progresso considera todos os conteúdos públicos da Biblioteca e pode ser alterado caso o total de conteúdos seja atualizado.
          </p>

          <section className="space-y-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <label className="relative block w-full md:max-w-xl">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Pesquisar na biblioteca..."
                  aria-label="Pesquisar na biblioteca"
                  className="pl-9"
                />
              </label>
              <div className="flex flex-wrap gap-2">
                {statusFilters.map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setStatusFilter(filter.value)}
                    className={cn(
                      "label-caps rounded-md px-4 py-2 text-xs transition-colors",
                      statusFilter === filter.value
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-card text-foreground hover:bg-accent",
                    )}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {teamContents.length === 0 ? (
              <EmptyState text="Ainda não há conteúdos disponíveis neste eixo." />
            ) : visibleContents.length === 0 ? (
              <EmptyState text="Não encontramos conteúdos que correspondam aos filtros ou termos pesquisados." />
            ) : (
              <div className="space-y-6">
                {groupedContents.map(([topic, topicContents]) => (
                  <section key={topic}>
                    <h2 className="mb-3 text-lg text-foreground">{topic}</h2>
                    <div className="space-y-2">
                      {topicContents.map((content) => (
                        <ContentItem
                          key={content.id}
                          content={content}
                          onOpen={() => openContent(content)}
                          onToggle={() => toggleFinished(content)}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function ProgressCard({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-md border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="label-caps text-xs text-muted-foreground">{label}</p>
          <p className="mt-2 text-sm text-foreground">{description}</p>
        </div>
        <BookOpen className="size-7 shrink-0 text-primary" />
      </div>
      <div className="mt-4 h-2 rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function ContentItem({
  content,
  onOpen,
  onToggle,
}: {
  content: LibraryContent;
  onOpen: () => void;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-border bg-card px-4 py-3 shadow-[var(--shadow-card)]">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onToggle();
        }}
        aria-label={
          content.finished
            ? `Marcar ${content.name} como não finalizado`
            : `Marcar ${content.name} como finalizado`
        }
        className="flex size-7 shrink-0 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary-soft/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span
          aria-hidden="true"
          className={cn(
            "size-4 rounded-full border-2 border-primary",
            content.finished && "bg-primary",
          )}
        />
      </button>
      <button
        type="button"
        onClick={onOpen}
        className="min-w-0 flex-1 cursor-pointer rounded-sm px-2 py-1 text-left transition-colors hover:bg-primary-soft/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span className="label-caps text-[10px] text-muted-foreground">{content.type}</span>
        <span className="mx-2 text-xs text-muted-foreground">—</span>
        <span className="text-sm text-foreground">{content.name}</span>
      </button>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-md border border-dashed border-border bg-card px-6 py-12 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}

function percentage(finished: number, total: number) {
  return total === 0 ? 0 : Math.round((finished / total) * 100);
}