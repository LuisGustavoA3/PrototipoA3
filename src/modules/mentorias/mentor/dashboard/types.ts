export type MentorDashboardMetric = {
  label: string;
  value: number;
  detail: string;
  icon: "mentees" | "trails" | "sessions";
};

export type MentorDashboardPerson = {
  id: string;
  name: string;
  trail: string;
  status: "Em andamento" | "Atenção" | "Concluído";
};
