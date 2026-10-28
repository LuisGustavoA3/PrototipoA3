import { Link, useNavigate } from "@tanstack/react-router";
import { useSelectedTrail } from "@/modules/mentorias/mentorado/trilhas/use-selected-trail";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  CircleUserRound,
  FileText,
  UserCircle2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  type ActionStatus,
  hidePdiActionFromDashboard,
  updatePdiAction,
  useHiddenDashboardActionIds,
  usePdiActions,
} from "@/modules/mentorias/mentorado/pdi";
import { useLibraryContents } from "@/modules/mentorias/shared/biblioteca";
import { useJourneyItems } from "@/modules/mentorias/mentorado/jornada";
import { useMentorshipSessions } from "@/modules/mentorias/mentorado/sessoes/use-mentorship-sessions";

const dailyContentStorageKey = "a3:dashboard-daily-content";
const statusConfig: Record<
  ActionStatus,
  {
    color: string;
    dotClass: string;
    description: string;
  }
> = {
  Concluído: {
    color: "#10b981",
    dotClass: "bg-emerald-500",
    description: "Ações finalizadas",
  },
  "Em andamento": {
    color: "#3b82f6",
    dotClass: "bg-blue-500",
    description: "Ações em execução",
  },
  "Não iniciado": {
    color: "#94a3b8",
    dotClass: "bg-slate-400",
    description: "Ações ainda não iniciadas",
  },
  Parado: {
    color: "#f59e0b",
    dotClass: "bg-amber-500",
    description: "Ações temporariamente interrompidas",
  },
  Atrasado: {
    color: "#f97316",
    dotClass: "bg-orange-500",
    description: "Ações fora do prazo",
  },
  Cancelado: {
    color: "#ef4444",
    dotClass: "bg-red-500",
    description: "Ações canceladas",
  },
};

const statusOrder: ActionStatus[] = [
  "Concluído",
  "Em andamento",
  "Não iniciado",
  "Parado",
  "Atrasado",
  "Cancelado",
];

const assessments = [
  { name: "Âncoras de Carreira", completed: true },
  { name: "Clifton Strengths", completed: false },
  { name: "HTM", completed: false },
  { name: "HumanGuide", completed: false },
  { name: "Janusian", completed: true },
  { name: "MBTI", completed: false },
  { name: "Perfil Caliper", completed: false },
  { name: "Perfil de Gestão", completed: false },
];

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-md border border-border bg-card p-5 shadow-[var(--shadow-card)] ${className}`}
    >
      {children}
    </section>
  );
}

function CardHeader({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3 border-b border-border pb-3">
      <h2 className="label-caps text-sm text-foreground">{title}</h2>
      {action}
    </div>
  );
}

function ProgressBar({
  value,
  light = false,
}: {
  value: number;
  light?: boolean;
}) {
  return (
    <div
      className={
        light
          ? "h-3 rounded-full border border-primary-foreground/60 bg-primary-foreground/20"
          : "h-3 rounded-full border border-primary/40 bg-background"
      }
    >
      <div
        className={
          light
            ? "h-full rounded-full bg-primary-foreground transition-[width] duration-500"
            : "h-full rounded-full bg-primary transition-[width] duration-500"
        }
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function DashboardContent() {
  const navigate = useNavigate({ from: "/" });
  const actions = usePdiActions();
  const contents = useLibraryContents();
  const journeyItems = useJourneyItems();
  const { hasContent } = useSelectedTrail();

  const {
    progress: sessionProgress,
    loading: sessionsLoading,
    error: sessionsError,
  } = useMentorshipSessions();

  const [evidenceAction, setEvidenceAction] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const hiddenActionIds = useHiddenDashboardActionIds();
  const [evidence, setEvidence] = useState("");

  useEffect(() => {
    if (!hasContent) {
      setEvidenceAction(null);
      setEvidence("");
    }
  }, [hasContent]);

  const activePublicContents = contents.filter(
    (content) => content.public && content.active,
  );
  const unfinishedContents = activePublicContents.filter(
    (content) => !content.finished,
  );
  const dailyContent = useMemo(() => {
    if (typeof window === "undefined") return unfinishedContents[0];
    const today = new Date().toISOString().slice(0, 10);
    const stored = JSON.parse(
      window.localStorage.getItem(dailyContentStorageKey) ?? "null",
    ) as { date?: string; id?: string } | null;
    const storedContent =
      stored?.date === today
        ? unfinishedContents.find((content) => content.id === stored.id)
        : undefined;
    if (storedContent) return storedContent;
    const next = unfinishedContents[0];
    if (next)
      window.localStorage.setItem(
        dailyContentStorageKey,
        JSON.stringify({ date: today, id: next.id }),
      );
    return next;
  }, [unfinishedContents]);
  const libraryProgress =
    activePublicContents.length === 0
      ? 0
      : Math.round(
          (activePublicContents.filter((content) => content.finished).length /
            activePublicContents.length) *
            100,
        );
  const completedActions = actions.filter(
    (action) => action.status === "Concluído",
  ).length;
  const developmentProgress =
    actions.length === 0
      ? 0
      : Math.round((completedActions / actions.length) * 100);

  const visibleActions = [...actions]
    .filter((action) => !hiddenActionIds.includes(action.id))
    .sort(
      (first, second) =>
        first.endDate.localeCompare(second.endDate) ||
        first.name.localeCompare(second.name),
    )
    .slice(0, 4);

  const journeyPriorities = journeyItems["Prioridades de desenvolvimento"];
  const statusSummary = statusOrder.map((status) => {
    const count = actions.filter((action) => action.status === status).length;

    return {
      status,
      count,
      percentage:
        actions.length > 0 ? Math.round((count / actions.length) * 100) : 0,
      ...statusConfig[status],
    };
  });

  const chartData = statusSummary
    .filter((item) => item.count > 0)
    .map((item) => ({
      name: item.status,
      value: item.count,
      color: item.color,
    }));

  const completeAction = () => {
    if (!hasContent || !evidenceAction) return;
    updatePdiAction(evidenceAction.id, {
      status: "Concluído",
      evidence: evidence.trim(),
    });
    setEvidenceAction(null);
    setEvidence("");
  };

  return (
    <div className="space-y-5 p-6">
      <div className="grid gap-5 lg:grid-cols-2">
        <Link
          to="/plano-de-acao"
          className="rounded-md bg-primary p-5 text-primary-foreground transition-opacity hover:opacity-95"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="label-caps text-xs">Progresso de desenvolvimento</p>

              <p className="mt-4 text-sm">
                {!hasContent
                  ? "Nenhuma ação disponível nesta trilha"
                  : actions.length
                    ? `${completedActions}/${actions.length} ações concluídas`
                    : "Nenhuma ação cadastrada"}
              </p>
            </div>

            <span className="text-3xl font-semibold">
              {!hasContent || actions.length === 0
                ? "—"
                : `${developmentProgress}%`}
            </span>
          </div>

          <div className="mt-4">
            <ProgressBar value={hasContent ? developmentProgress : 0} light />
          </div>
        </Link>

        <div className="rounded-md bg-primary p-5 text-primary-foreground">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="label-caps text-xs">Progresso das sessões</p>

              <p className="mt-4 text-sm">
                {sessionsLoading
                  ? "Carregando sessões..."
                  : sessionsError
                    ? "Não foi possível carregar as sessões."
                    : `${sessionProgress.completed}/${sessionProgress.total} sessões realizadas`}
              </p>
            </div>

            <span className="text-3xl font-semibold">
              {sessionsLoading || sessionsError
                ? "—"
                : sessionProgress.percentage === null
                  ? "—"
                  : `${sessionProgress.percentage}%`}
            </span>
          </div>

          <div className="mt-4">
            <ProgressBar
              value={
                sessionsLoading || sessionsError
                  ? 0
                  : (sessionProgress.percentage ?? 0)
              }
              light
            />
          </div>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-1">
        <Card className="min-h-[320px]">
          <CardHeader title="Progresso das ações" />

          {!hasContent ? (
            <EmptyState text="Nenhum dado disponível nesta trilha." />
          ) : actions.length === 0 ? (
            <EmptyState text="Nenhuma ação cadastrada." />
          ) : (
            <div className="grid items-center gap-6 lg:grid-cols-[minmax(240px,0.8fr)_minmax(0,2fr)]">
              {/* Gráfico */}
              <div className="flex items-center justify-center">
                <div className="relative h-[260px] w-full max-w-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={68}
                        outerRadius={100}
                        paddingAngle={2}
                        stroke="none"
                      >
                        {chartData.map((item) => (
                          <Cell key={item.name} fill={item.color} />
                        ))}
                      </Pie>

                      <Tooltip
                        formatter={(value, name) => [
                          `${value} ações`,
                          String(name),
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Total central */}
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-semibold text-foreground">
                      {actions.length}
                    </span>
                    <span className="text-center text-xs text-muted-foreground">
                      ações
                      <br />
                      no total
                    </span>
                  </div>
                </div>
              </div>

              {/* Índice com todos os status */}
              <div className="grid gap-3 sm:grid-cols-2">
                {statusSummary.map((item) => (
                  <div
                    key={item.status}
                    className="flex min-h-[88px] items-center gap-3 rounded-md border border-border bg-background px-4 py-3"
                  >
                    <span
                      className={`size-3.5 shrink-0 rounded-full ${item.dotClass}`}
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        {item.status}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-base font-semibold text-foreground">
                        {item.count}
                      </p>
                      <p
                        className="mt-1 text-xs font-semibold"
                        style={{ color: item.color }}
                      >
                        {item.percentage}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Minhas ações"
            action={
              <Link
                to="/plano-de-acao"
                className="label-caps rounded bg-primary px-2.5 py-1 text-[10px] text-primary-foreground"
              >
                Ver plano de ação
              </Link>
            }
          />
          {!hasContent ? (
            <EmptyState text="Nenhuma ação disponível nesta trilha." />
          ) : visibleActions.length === 0 ? (
            <EmptyState
              text={
                actions.length
                  ? "Todas as ações foram concluídas."
                  : "Nenhuma ação cadastrada."
              }
            />
          ) : (
            <div className="grid gap-2">
              {visibleActions.map((action) => (
                <div
                  key={action.id}
                  className="flex min-h-0 items-start gap-3 overflow-hidden rounded-md border border-border px-3 py-3 text-sm text-foreground transition-colors hover:bg-accent/50"
                >
                  <input
                    id={`action-checkbox-${action.id}`}
                    type="checkbox"
                    checked={action.status === "Concluído"}
                    className="mt-0.5 size-4 shrink-0 accent-primary"
                    onChange={(event) => {
                      if (event.target.checked) {
                        setEvidenceAction({
                          id: action.id,
                          name: action.name,
                        });
                      }
                    }}
                  />

                  <label
                    htmlFor={`action-checkbox-${action.id}`}
                    className="min-w-0 flex-1 cursor-pointer"
                  >
                    <span className="line-clamp-2">{action.name}</span>

                    <span className="mt-1 block text-xs font-medium text-primary">
                      Status: {action.status}
                    </span>

                    <span className="mt-1 block text-xs text-muted-foreground">
                      Prazo:{" "}
                      {new Intl.DateTimeFormat("pt-BR").format(
                        new Date(`${action.endDate}T00:00:00`),
                      )}
                    </span>
                  </label>

                  {action.status === "Concluído" && (
                    <button
                      type="button"
                      className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label={`Remover ${action.name} da lista`}
                      title="Remover da lista"
                      onClick={() => {
                        hidePdiActionFromDashboard(action.id);
                      }}
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card className="min-h-[280px]">
          <CardHeader
            title="Meus dados"
            action={
              <Link
                to="/informacoes-pessoais"
                className="label-caps rounded bg-primary px-2.5 py-1 text-[10px] text-primary-foreground"
              >
                Ver meus dados
              </Link>
            }
          />
          <div className="flex items-center gap-3">
            <div className="flex size-16 shrink-0 items-center justify-center rounded bg-muted">
              <UserCircle2 className="size-9 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                Luis Gustavo Ribeiro
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                A3 Consultoria
              </p>
              <p className="text-sm text-muted-foreground">
                Coach: Juliano Ribeiro
              </p>
            </div>
          </div>
          <Link
            to="/minhas-estatisticas"
            className="mt-5 flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Ver minhas estatísticas <ArrowRight className="size-4" />
          </Link>
          <div className="mt-4 max-w-md border-t border-border pt-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-foreground">
                Progresso geral da biblioteca
              </span>
              <span className="text-sm font-medium text-foreground">
                {libraryProgress}%
              </span>
            </div>

            <div className="mt-1.5">
              <ProgressBar value={libraryProgress} />
            </div>
          </div>
          <Link
            to="/biblioteca-negocio"
            className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
          >
            Ver biblioteca <ArrowRight className="size-3" />
          </Link>
        </Card>
        <Card>
          <CardHeader
            title="Prioridades da jornada"
            action={
              <Link
                to="/jornada-de-desenvolvimento"
                className="label-caps rounded bg-primary px-2.5 py-1 text-[10px] text-primary-foreground"
              >
                Ver jornada
              </Link>
            }
          />
          {!hasContent ? (
            <div className="flex items-center justify-center rounded-md bg-muted px-4 py-6 text-sm text-muted-foreground">
              Nenhuma prioridade disponível nesta trilha.
            </div>
          ) : journeyPriorities.length === 0 ? (
            <div className="flex items-center justify-center rounded-md bg-muted px-4 py-6 text-sm text-muted-foreground">
              Nenhuma prioridade cadastrada.
            </div>
          ) : (
            <ul className="space-y-3">
              {journeyPriorities.slice(0, 8).map((priority) => (
                <li key={priority.id}>
                  <Link
                    to="/jornada-de-desenvolvimento"
                    className="flex min-w-0 items-start gap-2 text-base text-foreground hover:text-primary"
                  >
                    <span className="mt-1 shrink-0 text-primary">•</span>
                    <span className="min-w-0 truncate whitespace-nowrap pt-1">
                      {priority.title}
                    </span>
                  </Link>
                </li>
              ))}
              {journeyPriorities.length > 8 && (
                <li className="pt-1 text-xs text-muted-foreground">
                  + {journeyPriorities.length - 8} prioridades de jornada
                </li>
              )}
            </ul>
          )}
        </Card>
        <Card className="min-h-[280px]">
          <CardHeader
            title="Conteúdo do dia!"
            action={
              dailyContent && (
                <Link
                  to="/biblioteca/conteudo/$contentId"
                  params={{ contentId: dailyContent.id }}
                  className="label-caps rounded bg-primary px-2.5 py-1 text-[10px] text-primary-foreground"
                >
                  Ver conteúdo
                </Link>
              )
            }
          />
          {dailyContent ? (
            <div className="flex gap-4">
              <FileText className="size-10 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="label-caps text-[10px] text-muted-foreground">
                  {dailyContent.type} · {dailyContent.axis}
                </p>
                <h3 className="mt-1 text-base font-semibold text-foreground">
                  {dailyContent.name}
                </h3>
                <p className="mt-2 line-clamp-4 text-sm leading-5 text-muted-foreground">
                  {dailyContent.description}
                </p>
                <p className="mt-3 text-xs text-primary">
                  {dailyContent.competency}
                </p>
              </div>
            </div>
          ) : (
            <EmptyState text="Você concluiu todos os conteúdos disponíveis!" />
          )}
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2"></div>

      <Dialog
        open={hasContent && evidenceAction !== null}
        onOpenChange={(open) => !open && setEvidenceAction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar evidência</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Você pode adicionar uma evidência para concluir “
            {evidenceAction?.name}”. Este campo é opcional.
          </p>
          <textarea
            value={evidence}
            onChange={(event) => setEvidence(event.target.value)}
            placeholder="Descreva a evidência da conclusão"
            className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEvidenceAction(null)}>
              Cancelar
            </Button>
            <Button onClick={completeAction}>
              <Check className="size-4" />
              Concluir ação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex min-h-[120px] items-center justify-center rounded-md bg-muted px-4 py-6 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}
