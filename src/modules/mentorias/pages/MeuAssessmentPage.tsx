import { CURRENT_USER_COMPANY_ID } from "@/shared/lib/current-user-company";
import { useCompanyTools } from "../assessment/company-tool-contracts";
import {
  useAssessments,
  type AssessmentStatus,
  type Assessment,
} from "../assessment/assessment-store";
import { MentoriasBreadcrumb } from "@/modules/mentorias/components/MentoriasBreadcrumb";
import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  FileQuestion,
  LoaderCircle,
} from "lucide-react";
import { useSelectedTrail } from "@/modules/mentorias/trilhas/use-selected-trail";
import { TrailEmptyState } from "@/modules/mentorias/trilhas/TrailEmptyState";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { useSidebarOpen } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/PageHeader";

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
} satisfies Record<
  AssessmentStatus,
  { label: string; icon: typeof CheckCircle2; color: string }
>;

const statusPriority: Record<AssessmentStatus, number> = {
  completed: 0,
  processing: 1,
  "not-started": 2,
};

export function MeuAssessmentPage() {
  const applications = useAssessments();
  const contracted = useCompanyTools(CURRENT_USER_COMPANY_ID);
  const assessments = applications.filter(
    (item) =>
      item.toolId &&
      contracted.includes(item.toolId) &&
      (item.status === "completed" || item.status === "processing"),
  );
  const [sidebarOpen, toggleSidebar] = useSidebarOpen();
  const [activeFilter, setActiveFilter] = useState<"all" | AssessmentStatus>(
    "all",
  );
  const { selectedTrail, hasContent } = useSelectedTrail();

  const orderedAssessments = [...assessments].sort(
    (first, second) =>
      statusPriority[first.status] - statusPriority[second.status],
  );

  const filteredAssessments =
    activeFilter === "all"
      ? orderedAssessments
      : orderedAssessments.filter(
          (assessment) => assessment.status === activeFilter,
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
        <MentoriasBreadcrumb />
        <div className="space-y-6 p-6">
          <PageHeader
            section="Meu Desenvolvimento"
            title="Meu Assessment"
            description="Acompanhe suas avaliações em processamento e seus resultados disponíveis."
          />

          {!hasContent ? (
            <TrailEmptyState trailName={selectedTrail} />
          ) : (
            <>
              <section className="grid gap-4 sm:grid-cols-3">
                <SummaryCard
                  label="Minhas avaliações"
                  value={assessments.length}
                  icon={BarChart3}
                  active={activeFilter === "all"}
                  onClick={() => setActiveFilter("all")}
                />
                <SummaryCard
                  label="Resultados prontos"
                  value={
                    assessments.filter(
                      (assessment) => assessment.status === "completed",
                    ).length
                  }
                  icon={CheckCircle2}
                  active={activeFilter === "completed"}
                  onClick={() => setActiveFilter("completed")}
                />
                <SummaryCard
                  label="Em processamento"
                  value={
                    assessments.filter(
                      (assessment) => assessment.status === "processing",
                    ).length
                  }
                  icon={Clock3}
                  active={activeFilter === "processing"}
                  onClick={() => setActiveFilter("processing")}
                />
              </section>

              <section>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h2 className="label-caps text-sm text-foreground">
                    Testes de assessment
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    {assessments.length} avaliações
                  </span>
                </div>

                {!filteredAssessments.length && (
                  <p className="rounded-md border border-border bg-card p-6 text-sm text-muted-foreground">
                    Nenhuma avaliação contratada em processamento ou com
                    resultado disponível.
                  </p>
                )}
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredAssessments.map((assessment) => (
                    <AssessmentCard
                      key={assessment.name}
                      assessment={assessment}
                    />
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  value: number;
  icon: typeof BarChart3;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-md border bg-card p-5 text-left shadow-[var(--shadow-card)] transition-colors",
        active
          ? "border-primary ring-1 ring-primary/20"
          : "border-border hover:border-primary/50",
      )}
    >
      <div>
        <p className="label-caps text-[10px] text-muted-foreground">{label}</p>
        <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
      </div>
      <Icon className="size-8 text-primary" />
    </button>
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
          <h3 className="text-lg leading-tight text-foreground">
            {assessment.name}
          </h3>
          <p className="mt-2 text-sm leading-5 text-muted-foreground">
            {assessment.description}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-1 flex-col justify-end border-t border-border pt-4">
        <div className={cn("flex items-center gap-2 text-sm", status.color)}>
          <StatusIcon
            className={cn(
              "size-4",
              assessment.status === "processing" && "animate-spin",
            )}
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
            Assim que a análise for concluída, seu resultado estará disponível
            aqui.
          </p>
        )}
      </div>
    </article>
  );
}
