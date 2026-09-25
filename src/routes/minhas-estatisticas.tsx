import { useMemo, useState } from "react";
import { useSidebarOpen } from "@/hooks/use-sidebar";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  MessageCircle,
  Plus,
  User,
  Video,
  FileText,
  Headphones,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Axis = "individuo" | "equipe" | "negocio" | "mercado";

type Recommendation = {
  id: string;
  type: "artigo" | "video" | "podcast";
  title: string;
  source: string;
  competency: string;
};

const axes: { key: Axis; label: string }[] = [
  { key: "individuo", label: "Indivíduo" },
  { key: "equipe", label: "Equipe" },
  { key: "negocio", label: "Negócio" },
  { key: "mercado", label: "Mercado" },
];

const dataByAxis: Record<
  Axis,
  { subject: string; value: number; fullMark: number }[]
> = {
  individuo: [
    { subject: "Autoconhecimento", value: 100, fullMark: 100 },
    { subject: "Gestão do Tempo", value: 70, fullMark: 100 },
    { subject: "Planejamento e Organização", value: 78, fullMark: 100 },
    { subject: "Proatividade", value: 92, fullMark: 100 },
    { subject: "Resiliência", value: 88, fullMark: 100 },
  ],
  equipe: [
    { subject: "Comunicação", value: 82, fullMark: 100 },
    { subject: "Liderança e Gestão", value: 75, fullMark: 100 },
    { subject: "Relacionamento Interpessoal", value: 90, fullMark: 100 },
    { subject: "Negociação", value: 68, fullMark: 100 },
  ],
  negocio: [
    { subject: "Capacidade Analítica", value: 80, fullMark: 100 },
    { subject: "Foco em Resultados", value: 86, fullMark: 100 },
    { subject: "Resolução de Problemas", value: 74, fullMark: 100 },
    { subject: "Tomada de Decisão", value: 79, fullMark: 100 },
    { subject: "Visão Integrada", value: 65, fullMark: 100 },
  ],
  mercado: [
    { subject: "Visão de Negócio", value: 77, fullMark: 100 },
    { subject: "Visão Estratégica", value: 72, fullMark: 100 },
    { subject: "Inovação e Criatividade", value: 85, fullMark: 100 },
  ],
};

const recommendations: Recommendation[] = [
  {
    id: "rec-1",
    type: "artigo",
    title: "Como desenvolver autoconhecimento no dia a dia",
    source: "Harvard Business Review Brasil",
    competency: "Autoconhecimento",
  },
  {
    id: "rec-2",
    type: "video",
    title: "Técnicas de gestão do tempo para líderes",
    source: "A3 Digital Academy",
    competency: "Gestão do Tempo",
  },
  {
    id: "rec-3",
    type: "podcast",
    title: "Comunicação assertiva em equipes remotas",
    source: "Liderança em Foco",
    competency: "Comunicação",
  },
  {
    id: "rec-4",
    type: "artigo",
    title: "Tomada de decisão baseada em dados",
    source: "MIT Sloan Management Review",
    competency: "Tomada de Decisão",
  },
  {
    id: "rec-5",
    type: "video",
    title: "Inovação disruptiva: cases de mercado",
    source: "A3 Digital Academy",
    competency: "Inovação e Criatividade",
  },
];

const typeConfig = {
  artigo: { icon: FileText, label: "Artigo", color: "text-blue-500" },
  video: { icon: Video, label: "Vídeo", color: "text-red-500" },
  podcast: { icon: Headphones, label: "Podcast", color: "text-amber-500" },
};

export const Route = createFileRoute("/minhas-estatisticas")({
  head: () => ({
    meta: [
      { title: "Minhas Estatísticas | A3 Digital" },
      {
        name: "description",
        content:
          "Visualize suas estatísticas de desenvolvimento por eixo: Indivíduo, Equipe, Negócio e Mercado.",
      },
      { property: "og:title", content: "Minhas Estatísticas | A3 Digital" },
      {
        property: "og:description",
        content:
          "Acompanhe seu progresso em autoconhecimento, liderança, negócio e visão de mercado.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MinhasEstatisticas,
});

function MinhasEstatisticas() {
  const [sidebarOpen, toggleSidebar] = useSidebarOpen();
  const [selectedAxis, setSelectedAxis] = useState<Axis>("individuo");
  const [addedToPdi, setAddedToPdi] = useState<Set<string>>(new Set());

  const chartData = dataByAxis[selectedAxis];

  const allCompetencies = useMemo(
    () =>
      Object.values(dataByAxis)
        .flat()
        .sort((a, b) => a.subject.localeCompare(b.subject)),
    [],
  );

  const togglePdi = (id: string) => {
    setAddedToPdi((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <TooltipProvider delayDuration={150}>
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
                to="/"
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <ArrowLeft className="size-4" />
                Voltar
              </Link>
              <h1 className="label-caps text-lg text-foreground">
                Minhas Estatísticas
              </h1>
            </div>

            <section className="flex flex-col items-center gap-4 rounded-md border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:flex-row sm:items-start">
              <div className="flex size-24 shrink-0 items-center justify-center rounded-full bg-muted">
                <User className="size-12 text-muted-foreground" />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-semibold text-foreground">
                  Luis Gustavo Ribeiro
                </h2>
                <p className="text-sm text-muted-foreground">
                  Gerente de Projetos
                </p>
              </div>
            </section>

            <section className="rounded-md border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <h2 className="label-caps mb-4 text-sm text-foreground">
                Selecione o eixo
              </h2>
              <div className="flex flex-wrap gap-2">
                {axes.map((axis) => (
                  <button
                    key={axis.key}
                    onClick={() => setSelectedAxis(axis.key)}
                    className={cn(
                      "label-caps rounded-md px-4 py-2 text-xs transition-colors",
                      selectedAxis === axis.key
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-background text-foreground hover:bg-accent",
                    )}
                  >
                    {axis.label}
                  </button>
                ))}
              </div>

              <div className="mt-6 h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    data={chartData}
                    margin={{ top: 24, right: 24, bottom: 24, left: 24 }}
                  >
                    <PolarGrid />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "var(--foreground)", fontSize: 12 }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    />
                    <Radar
                      name={axes.find((a) => a.key === selectedAxis)?.label}
                      dataKey="value"
                      stroke="var(--primary)"
                      fill="var(--primary)"
                      fillOpacity={0.35}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="rounded-md border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <h2 className="label-caps mb-6 text-sm text-foreground">
                Todas as competências
              </h2>
              <div className="grid gap-5">
                {allCompetencies.map((comp) => (
                  <div
                    key={comp.subject}
                    className="grid items-center gap-3 sm:grid-cols-[1fr_auto_120px]"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {comp.subject}
                    </span>
                    <span className="text-xs text-muted-foreground sm:text-right">
                      Nível atual: {comp.value}%
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${comp.value}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-xs font-semibold text-foreground">
                        {comp.value}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-md border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="mb-6">
                <h2 className="label-caps text-sm text-foreground">
                  Recomendações
                </h2>
                <p className="text-sm text-muted-foreground">
                  Conteúdos recomendados
                </p>
              </div>

              <div className="grid gap-4">
                {recommendations.map((rec) => {
                  const { icon: Icon, label, color } = typeConfig[rec.type];
                  const isAdded = addedToPdi.has(rec.id);

                  return (
                    <div
                      key={rec.id}
                      className={cn(
                        "flex flex-col gap-3 rounded-md border p-4 transition-colors sm:flex-row sm:items-center sm:justify-between",
                        isAdded
                          ? "border-primary/30 bg-primary/5"
                          : "border-border bg-background",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "flex size-10 shrink-0 items-center justify-center rounded-md bg-muted",
                            color,
                          )}
                        >
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="label-caps text-[10px] text-muted-foreground">
                              {label}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              • {rec.competency}
                            </span>
                          </div>
                          <h3 className="text-sm font-semibold text-foreground">
                            {rec.title}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {rec.source}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:justify-end">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant={isAdded ? "default" : "outline"}
                              onClick={() => togglePdi(rec.id)}
                              aria-label="Adicionar ao meu PDI"
                              className={cn(
                                "size-9 transition-all",
                                isAdded && "bg-primary text-primary-foreground",
                              )}
                            >
                              {isAdded ? (
                                <Check className="size-4" />
                              ) : (
                                <Plus className="size-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>
                              {isAdded
                                ? "Remover do meu PDI"
                                : "Adicionar ao meu PDI"}
                            </p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="outline"
                              aria-label="Discutir com meu mentor"
                              className="size-9"
                            >
                              <MessageCircle className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>Discutir com meu mentor</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
