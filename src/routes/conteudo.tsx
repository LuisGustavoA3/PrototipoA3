import { createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  FileText,
  PlayCircle,
  Search,
} from "lucide-react";
import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { useSidebarOpen } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";

type Axis = "Todos" | "Indivíduo" | "Equipe" | "Negócio" | "Mercado";

const axes: Axis[] = ["Todos", "Indivíduo", "Equipe", "Negócio", "Mercado"];

const contents = [
  {
    title: "Como o líder pode ajudar os funcionários a combater o status quo",
    type: "Artigo",
    axis: "Equipe" as Axis,
    duration: "8 min de leitura",
    icon: FileText,
    description:
      "Práticas para criar uma cultura de inovação e manter o time engajado.",
  },
  {
    title: "Comunicação estratégica para momentos de mudança",
    type: "Vídeo",
    axis: "Indivíduo" as Axis,
    duration: "12 min",
    icon: PlayCircle,
    description:
      "Aprenda a organizar mensagens claras e conduzir conversas importantes.",
  },
  {
    title: "Visão de negócio: decisões que geram impacto",
    type: "Artigo",
    axis: "Negócio" as Axis,
    duration: "10 min de leitura",
    icon: FileText,
    description:
      "Uma leitura prática para conectar prioridades, pessoas e resultados.",
  },
  {
    title: "Inovação e criatividade no mercado atual",
    type: "Podcast",
    axis: "Mercado" as Axis,
    duration: "22 min",
    icon: BookOpen,
    description:
      "Ideias para observar oportunidades e transformar repertório em ação.",
  },
];

export const Route = createFileRoute("/conteudo")({
  head: () => ({
    meta: [
      { title: "Conteúdo | A3 Digital" },
      {
        name: "description",
        content:
          "Acesse conteúdos para apoiar sua jornada de desenvolvimento na A3 Digital.",
      },
    ],
  }),
  component: Conteudo,
});

function Conteudo() {
  const [sidebarOpen, toggleSidebar] = useSidebarOpen();
  const [selectedAxis, setSelectedAxis] = useState<Axis>("Todos");
  const [search, setSearch] = useState("");

  const filteredContents = contents.filter((content) => {
    const matchesAxis =
      selectedAxis === "Todos" || content.axis === selectedAxis;
    const query = search.toLowerCase();
    return (
      matchesAxis &&
      `${content.title} ${content.description}`.toLowerCase().includes(query)
    );
  });

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
            <p className="label-caps text-xs text-primary">
              Meu desenvolvimento
            </p>
            <h1 className="mt-1 text-2xl text-foreground">Conteúdo</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Encontre leituras, vídeos e áudios para continuar sua jornada.
            </p>
          </header>

          <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-md bg-primary p-6 text-primary-foreground">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="label-caps text-xs">Sua jornada de conteúdo</p>
                  <p className="mt-5 text-3xl font-semibold">15%</p>
                  <p className="mt-1 text-sm opacity-85">
                    dos conteúdos da biblioteca acessados
                  </p>
                </div>
                <BookOpen className="size-9 opacity-90" />
              </div>
              <div className="mt-6 h-2 rounded-full bg-primary-foreground/25">
                <div className="h-full w-[15%] rounded-full bg-primary-foreground" />
              </div>
            </div>
            <div className="rounded-md border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <p className="label-caps text-xs text-muted-foreground">
                Próxima recomendação
              </p>
              <div className="mt-4 flex items-center gap-4">
                <CheckCircle2 className="size-8 text-primary" />
                <div>
                  <p className="font-medium text-foreground">
                    Conteúdo do dia disponível
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Reserve alguns minutos para aprender.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h2 className="label-caps text-sm text-foreground">
                Explore conteúdos
              </h2>
              <label className="relative block w-full md:max-w-xs">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar conteúdo"
                  aria-label="Buscar conteúdo"
                  className="h-10 w-full rounded-md border border-input bg-card pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-2">
              {axes.map((axis) => (
                <button
                  key={axis}
                  onClick={() => setSelectedAxis(axis)}
                  className={cn(
                    "label-caps rounded-md px-4 py-2 text-xs transition-colors",
                    selectedAxis === axis
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card text-foreground hover:bg-accent",
                  )}
                >
                  {axis}
                </button>
              ))}
            </div>

            {filteredContents.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredContents.map((content) => (
                  <article
                    key={content.title}
                    className="rounded-md border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-transform hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <content.icon className="size-9 shrink-0 text-primary" />
                      <span className="label-caps rounded bg-primary-soft/60 px-2 py-1 text-[10px] text-accent-foreground">
                        {content.axis}
                      </span>
                    </div>
                    <p className="label-caps mt-5 text-[10px] text-muted-foreground">
                      {content.type}
                    </p>
                    <h3 className="mt-2 text-lg leading-tight text-foreground">
                      {content.title}
                    </h3>
                    <p className="mt-3 text-sm leading-5 text-muted-foreground">
                      {content.description}
                    </p>
                    <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock3 className="size-4 text-primary" />
                      {content.duration}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-md border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">
                Nenhum conteúdo encontrado.
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
