import { Link } from "react-router-dom";
import { ArrowRight, CalendarCheck2, Route, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { demoPeople, useAdminTrails } from "../lib/development-demo";
import { useCompanySessions } from "../lib/use-company-sessions";
import { companyMentorships } from "@/lib/company-sessions";
import type { AdminDashboardMetric } from "../dashboard/types";
type DashboardPerson = {
  id: string;
  name: string;
  trail: string;
  status: "Em andamento" | "Concluído" | "Parado";
};
const metricIcons = {
  mentees: UsersRound,
  trails: Route,
  sessions: CalendarCheck2,
};

const statusStyles: Record<DashboardPerson["status"], string> = {
  "Em andamento": "border-yellow-200 bg-yellow-50 text-yellow-800",
  Parado: "border-red-200 bg-red-50 text-red-800",
  Concluído: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

function MetricCard({
  metric,
}: {
  metric: Omit<AdminDashboardMetric, "value"> & { value: number | string };
}) {
  const Icon = metricIcons[metric.icon];

  return (
    <Card className="rounded-md border-border/80 p-5 shadow-none">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {metric.label}
          </p>
          <p className="mt-3 font-display text-4xl leading-none text-foreground">
            {metric.value}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">{metric.detail}</p>
        </div>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <Icon aria-hidden="true" className="size-5" />
        </span>
      </div>
    </Card>
  );
}

function PersonRow({ person }: { person: DashboardPerson }) {
  return (
    <tr className="border-t border-border/80">
      <th scope="row" className="px-5 py-4 text-left font-medium">
        {person.name}
      </th>
      <td className="px-5 py-4 text-sm">{person.trail}</td>
      <td className="px-5 py-4">
        <span
          className={`inline-flex whitespace-nowrap rounded-sm border px-2 py-1 text-xs font-medium ${statusStyles[person.status]}`}
        >
          {person.status}
        </span>
      </td>
      <td className="px-5 py-4">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/mentor/mentorados/${person.id}`}>
            Abrir acompanhamento
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </td>
    </tr>
  );
}

export function AdminDashboardPage() {
  const trails = useAdminTrails();
  const board = useCompanySessions("testes");
  const people: DashboardPerson[] = demoPeople
    .filter((person) => trails.some((trail) => trail.personId === person.id))
    .map((person) => {
      const own = trails.filter((trail) => trail.personId === person.id);
      const current = own.find((trail) => trail.status === "Ativa") ?? own[0]!;
      const status = own.some((trail) => trail.status === "Ativa")
        ? "Em andamento"
        : own.every((trail) => trail.status === "Concluída")
          ? "Concluído"
          : "Parado";
      return { id: person.id, name: person.name, trail: current.name, status };
    });
  const metrics: (Omit<AdminDashboardMetric, "value"> & {
    value: number | string;
  })[] = [
    {
      label: "Mentorados",
      value: people.length,
      detail: "Pessoas cadastradas com trilhas associadas",
      icon: "mentees",
    },
    {
      label: "Trilhas",
      value: trails.length,
      detail: "Trilhas cadastradas na Administração",
      icon: "trails",
    },
    {
      label: "Sessões",
      value: board.data
        ? companyMentorships(board.data).reduce(
            (total, person) => total + person.sessions.length,
            0,
          )
        : board.isPending
          ? "Carregando…"
          : "Indisponível",
      detail: board.isError
        ? "Falha ao atualizar o quadro Monday da empresa Testes"
        : "Sessões do quadro Monday vinculado à empresa Testes",
      icon: "sessions",
    },
  ];
  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 ">
          <PageHeader
            section="Administração de Mentorias"
            title="Dashboard"
            description="Acompanhe os indicadores e as principais atividades administrativas de Mentorias."
          />
        </div>

        <div className="mb-3 flex items-baseline justify-between gap-4">
          <h2 className="text-lg font-semibold text-foreground">Visão geral</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {metrics.map((metric) => (
            <MetricCard key={metric.icon} metric={metric} />
          ))}
        </div>

        <section className="mt-9" aria-labelledby="mentorados-heading">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <h2
                id="mentorados-heading"
                className="text-lg font-semibold text-foreground"
              >
                Mentorados
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Acesse as trilhas e acompanhe o desenvolvimento.
              </p>
            </div>
            <span className="text-xs text-muted-foreground">
              {people.length} mentorados na lista
            </span>
          </div>

          <Card className="overflow-x-auto rounded-md border-border/80 shadow-none">
            <table
              className="w-full min-w-[650px] text-left"
              aria-label="Mentorados"
            >
              <thead className="bg-secondary/70 text-xs uppercase text-muted-foreground">
                <tr>
                  {["Mentorado", "Trilha", "Status", "Ação"].map((label) => (
                    <th key={label} scope="col" className="px-5 py-3">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {people.map((person) => (
                  <PersonRow key={person.id} person={person} />
                ))}
              </tbody>
            </table>
          </Card>
        </section>
      </div>
    </div>
  );
}
