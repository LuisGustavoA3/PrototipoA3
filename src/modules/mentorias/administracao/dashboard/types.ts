export type AdminDashboardMetric = {
  label: string;
  value: number;
  detail: string;
  icon: "mentees" | "trails" | "sessions";
};

export type AdminDashboardPerson = {
  id: string;
  name: string;
  trail: string;
  status: "Em andamento" | "Atenção" | "Concluído";
};
