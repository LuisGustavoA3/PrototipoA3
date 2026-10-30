import { ArrowRight, CalendarCheck2, Route, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  adminDashboardDemoMetrics,
  adminDashboardDemoPeople,
} from "./adminDashboard.mock";

import type { AdminDashboardMetric, AdminDashboardPerson } from "./types";
const metricIcons = {
  mentees: UsersRound,
  trails: Route,
  sessions: CalendarCheck2,
};

const statusStyles: Record<AdminDashboardPerson["status"], string> = {
  "Em andamento": "border-teal-200 bg-teal-50 text-teal-800",
  Atenção: "border-amber-200 bg-amber-50 text-amber-800",
  Concluído: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

function MetricCard({ metric }: { metric: AdminDashboardMetric }) {
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

function PersonRow({ person }: { person: AdminDashboardPerson }) {
  return (
    <li className="grid grid-cols-1 gap-4 border-t border-border/80 px-4 py-4 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto_auto] sm:items-center sm:gap-5 sm:px-5">
      <div className="min-w-0">
        <p className="font-medium text-foreground">{person.name}</p>
        <p className="mt-1 text-xs text-muted-foreground sm:hidden">
          Mentorado demonstrativo
        </p>
      </div>

      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground sm:hidden">Trilha</p>
        <p className="truncate text-sm text-foreground">{person.trail}</p>
      </div>

      <div>
        <p className="mb-1 text-[11px] text-muted-foreground sm:hidden">
          Status
        </p>
        <span
          className={`inline-flex rounded-sm border px-2 py-1 text-xs font-medium ${statusStyles[person.status]}`}
        >
          {person.status}
        </span>
      </div>

      <div className="sm:justify-self-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled
          aria-label={`Acesso ao perfil demonstrativo de ${person.name} indisponível`}
        >
          Acessar
          <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </li>
  );
}

export function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 border-b border-border/80 pb-6">
          <p className="label-caps text-xs text-primary">Área do mentor</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl text-foreground sm:text-4xl">
                Dashboard do Mentor
              </h1>
              <p className="mt-2 text-base text-muted-foreground">
                Olá, Mentor. Veja um panorama das suas atividades.
              </p>
            </div>
            <span className="rounded-sm border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
              Dados demonstrativos
            </span>
          </div>
        </header>

        <section aria-label="Indicadores demonstrativos">
          <div className="mb-3 flex items-baseline justify-between gap-4">
            <h2 className="text-lg font-semibold text-foreground">
              Visão geral
            </h2>
            <p className="text-xs text-muted-foreground">Valores de exemplo</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {adminDashboardDemoMetrics.map((metric) => (
              <MetricCard key={metric.icon} metric={metric} />
            ))}
          </div>
        </section>

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
                Lista de exemplo para apresentação da experiência.
              </p>
            </div>
            <span className="text-xs text-muted-foreground">
              {adminDashboardDemoPeople.length} registros demonstrativos
            </span>
          </div>

          <Card className="overflow-hidden rounded-md border-border/80 shadow-none">
            <div className="hidden grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto_auto] gap-5 bg-secondary/70 px-5 py-3 text-[11px] font-semibold uppercase text-muted-foreground sm:grid">
              <span>Mentorado</span>
              <span>Trilha</span>
              <span>Status demonstrativo</span>
              <span className="text-right">Ação</span>
            </div>
            <ul aria-label="Mentorados demonstrativos">
              {adminDashboardDemoPeople.map((person) => (
                <PersonRow key={person.id} person={person} />
              ))}
            </ul>
          </Card>
        </section>
      </div>
    </div>
  );
}
