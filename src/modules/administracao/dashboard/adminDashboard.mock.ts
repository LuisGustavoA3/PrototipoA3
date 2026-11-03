import type { AdminDashboardMetric, AdminDashboardPerson } from "./types";

export const adminDashboardDemoMetrics: AdminDashboardMetric[] = [
  {
    label: "Mentorados",
    value: 12,
    detail: "no acompanhamento",
    icon: "mentees",
  },
  {
    label: "Trilhas",
    value: 3,
    detail: "no acompanhamento",
    icon: "trails",
  },
  {
    label: "Sessões",
    value: 8,
    detail: "no acompanhamento",
    icon: "sessions",
  },
];

export const adminDashboardDemoPeople: AdminDashboardPerson[] = [
  {
    id: "demo-1",
    name: "Ana Paula Martins",
    trail: "Ana Paula Martins — Ciclo 2026",
    status: "Em andamento",
  },
  {
    id: "demo-2",
    name: "Bruno Carvalho",
    trail: "Bruno Carvalho — Ciclo 2026",
    status: "Atenção",
  },
  {
    id: "demo-3",
    name: "Camila Ferreira",
    trail: "Camila Ferreira — Ciclo 2026",
    status: "Em andamento",
  },
  {
    id: "demo-4",
    name: "Diego Almeida",
    trail: "Diego Almeida — Ciclo 2025",
    status: "Concluído",
  },
];
