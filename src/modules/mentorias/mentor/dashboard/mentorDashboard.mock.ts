import type { MentorDashboardMetric, MentorDashboardPerson } from "./types";

export const mentorDashboardDemoMetrics: MentorDashboardMetric[] = [
  {
    label: "Mentorados",
    value: 12,
    detail: "na demonstração",
    icon: "mentees",
  },
  {
    label: "Trilhas",
    value: 3,
    detail: "na demonstração",
    icon: "trails",
  },
  {
    label: "Sessões",
    value: 8,
    detail: "na demonstração",
    icon: "sessions",
  },
];

export const mentorDashboardDemoPeople: MentorDashboardPerson[] = [
  {
    id: "demo-1",
    name: "Ana Paula Martins",
    trail: "Liderança e Gestão",
    status: "Em andamento",
  },
  {
    id: "demo-2",
    name: "Bruno Carvalho",
    trail: "Comunicação Estratégica",
    status: "Atenção",
  },
  {
    id: "demo-3",
    name: "Camila Ferreira",
    trail: "Visão de Negócio",
    status: "Em andamento",
  },
  {
    id: "demo-4",
    name: "Diego Almeida",
    trail: "Liderança e Gestão",
    status: "Concluído",
  },
];
