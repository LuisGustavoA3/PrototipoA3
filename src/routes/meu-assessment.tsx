import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  FileQuestion,
  LoaderCircle,
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { useSidebarOpen } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";

type AssessmentStatus = "completed" | "processing" | "not-started";

type Assessment = {
  name: string;
  description: string;
  status: AssessmentStatus;
};

const assessments: Assessment[] = [
  {
    name: "Âncoras de Carreira",
    description:
      "Identifique os valores, motivações e prioridades que orientam suas escolhas profissionais.",
    status: "completed",
  },
  {
    name: "Clifton Strengths",
    description:
      "Conheça seus talentos naturais e descubra como usá-los para trabalhar com mais confiança.",
    status: "processing",
  },
  {
    name: "HTM",
    description:
      "Amplie sua percepção sobre comportamentos e preferências que influenciam sua atuação.",
    status: "not-started",
  },
  {
    name: "HumanGuide",
    description:
      "Explore seu perfil comportamental e encontre caminhos para relações profissionais mais produtivas.",
    status: "not-started",
  },
  {
    name: "Janusian",
    description:
      "Observe como você pensa, cria alternativas e lida com diferentes perspectivas.",
    status: "completed",
  },
  {
    name: "MBTI",
    description:
      "Entenda suas preferências de personalidade e os contextos em que você tende a se desenvolver melhor.",
    status: "not-started",
  },
  {
    name: "Perfil Caliper",
    description:
      "Reconheça características que impactam seu potencial, sua performance e seu estilo de trabalho.",
    status: "processing",
  },
  {
    name: "Perfil de Gestão: Pipeline de Liderança",
    description:
      "Avalie competências essenciais para cada etapa da sua jornada de liderança.",
    status: "not-started",
  },
];

const statusConfig = {
  completed: {
    label: "Resultado disponível",
    icon: CheckCircle2,
    color: "text-emerald-600",
  },
  processing: {
    label: "Resultado em processamento",
    icon: LoaderCircle,
    color: "text-primary",
  },
  "not-started": {
    label: "Teste ainda não realizado",
    icon: FileQuestion,
    color: "text-muted-foreground",
  },
} satisfies Record<AssessmentStatus, { label: string; icon: typeof CheckCircle2; color: string }>;

const statusPriority: Record<AssessmentStatus, number> = {
  completed: 0,
  processing: 1,
  "not-started": 2,
};

export const Route = createFileRoute("/meu-assessment")({
  head: () => ({
    meta: [
      { title: "Meu Assessment | A3 Digital" },
      {
        name: "description",
        content:
          "Acompanhe seus testes de assessment e acesse seus resultados na A3 Digital.",
      },
    ],
  }),
  component: MeuAssessment,
});

function MeuAssessment() {
  const [sidebarOpen, toggleSidebar] = useSidebarOpen();
  const orderedAssessments = [...assessments].sort(
    (first, second) => statusPriority[first.status] - statusPriority[second.status],
  );

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
            <h1 className="mt-1 text-2xl text-foreground">Meu Assessment</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Acompanhe os testes realizados e descubra quais avaliações podem apoiar sua jornada.
            </p>
          </header>

          <section className="grid gap-4 sm:grid-cols-3">
            <SummaryCard
              label="Testes disponíveis"
              value={assessments.length}
              icon={BarChart3}
            />
            <SummaryCard
              label="Resultados prontos"
              value={assessments.filter((assessment) => assessment.status === "completed").length}
              icon={CheckCircle2}
            />
            <SummaryCard
              label="Aguardando realização"
              value={assessments.filter((assessment) => assessment.status === "not-started").length}
              icon={Clock3}
            />
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="label-caps text-sm text-foreground">Testes de assessment</h2>
              <span className="text-xs text-muted-foreground">
                {assessments.length} avaliações
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {orderedAssessments.map((assessment) => (
                <AssessmentCard key={assessment.name} assessment={assessment} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof BarChart3;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div>
        <p className="label-caps text-[10px] text-muted-foreground">{label}</p>
        <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
      </div>
      <Icon className="size-8 text-primary" />
    </div>
  );
}

function AssessmentCard({ assessment }: { assessment: Assessment }) {
  const status = statusConfig[assessment.status];
  const StatusIcon = status.icon;

  return (
    <article className="flex flex-col rounded-md border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="flex gap-4">
        <div className="flex size-20 shrink-0 items-center justify-center rounded-md border border-dashed border-primary/40 bg-primary-soft/40">
          <FileQuestion className="size-8 text-primary" />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg leading-tight text-foreground">{assessment.name}</h3>
          <p className="mt-2 text-sm leading-5 text-muted-foreground">{assessment.description}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-1 flex-col justify-end border-t border-border pt-4">
        <div className={cn("flex items-center gap-2 text-sm", status.color)}>
          <StatusIcon
            className={cn("size-4", assessment.status === "processing" && "animate-spin")}
          />
          <span>{status.label}</span>
        </div>

        {assessment.status === "completed" && (
          <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-xs text-primary-foreground transition-opacity hover:opacity-90">
            Ver resultados
            <ArrowRight className="size-4" />
          </button>
        )}

        {assessment.status === "processing" && (
          <p className="mt-3 text-xs text-muted-foreground">
            Assim que a análise for concluída, seu resultado estará disponível aqui.
          </p>
        )}

        {assessment.status === "not-started" && (
          <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md border border-primary px-4 py-2.5 text-xs text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
            Tenho interesse em realizar o &quot;{assessment.name}&quot;
          </button>
        )}
      </div>
    </article>
  );
}