import { useSyncExternalStore } from "react";

export type ActionStatus =
  | "Concluído"
  | "Em andamento"
  | "Não iniciado"
  | "Parado"
  | "Cancelado";

export type PdiAction = {
  id: string;
  name: string;
  competency: string;
  startDate: string;
  endDate: string;
  status: ActionStatus;
  details: string;
  evidence: string;
  createdAt: string;
  author: string;
};

export function isValidPdiDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

const initialActions: PdiAction[] = [
  {
    id: "pdi-1",
    name: "Praticar escuta ativa em reuniões",
    competency: "Comunicação",
    startDate: "2026-08-27",
    endDate: "2026-09-27",
    status: "Em andamento",
    details: "Registrar pelo menos uma reflexão após cada reunião de equipe.",
    evidence: "",
    createdAt: "2026-09-04T10:30:00",
    author: "Luis Gustavo Ribeiro",
  },
  {
    id: "pdi-2",
    name: "Concluir leitura sobre autoconhecimento",
    competency: "Autoconhecimento",
    startDate: "2026-08-15",
    endDate: "2026-08-29",
    status: "Concluído",
    details: "Ler o material recomendado e anotar os principais aprendizados.",
    evidence: "Resumo compartilhado na sessão de mentoria.",
    createdAt: "2026-08-12T14:15:00",
    author: "Juliano Ribeiro",
  },
  {
    id: "pdi-3",
    name: "Mapear decisões recorrentes do time",
    competency: "Capacidade Analítica",
    startDate: "2026-09-10",
    endDate: "2026-10-10",
    status: "Não iniciado",
    details: "",
    evidence: "",
    createdAt: "2026-08-10T09:00:00",
    author: "Luis Gustavo Ribeiro",
  },
];

let actions = initialActions;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function subscribePdi(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getPdiActions() {
  return actions;
}

export function usePdiActions() {
  return useSyncExternalStore(subscribePdi, getPdiActions, getPdiActions);
}

export function addPdiAction(action: Omit<PdiAction, "id" | "createdAt">) {
  if (!isValidPdiDate(action.startDate) || !isValidPdiDate(action.endDate)) {
    return;
  }

  actions = [
    ...actions,
    {
      ...action,
      id: `pdi-${Date.now()}`,
      createdAt: new Date().toISOString(),
    },
  ];
  notify();
}

export function updatePdiAction(id: string, changes: Partial<PdiAction>) {
  if (
    (changes.startDate !== undefined && !isValidPdiDate(changes.startDate)) ||
    (changes.endDate !== undefined && !isValidPdiDate(changes.endDate))
  ) {
    return;
  }

  actions = actions.map((action) =>
    action.id === id ? { ...action, ...changes } : action,
  );
  notify();
}