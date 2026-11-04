import {
  evaluationTools,
  getEvaluationTools,
  useEvaluationTools,
} from "./evaluation-tools";
import { useSyncExternalStore, useMemo } from "react";
export type AssessmentStatus = "completed" | "processing" | "not-started";

export type Assessment = {
  associated?: boolean;
  performed?: boolean;
  resultUrl?: string;
  resultFileName?: string;
  toolId?: string;
  name: string;
  description: string;
  status: AssessmentStatus;
};

const initialAssessments: Assessment[] = [
  {
    name: evaluationTools[0]!.name,
    description:
      "Identifique os valores, motivações e prioridades que orientam suas escolhas profissionais.",
    status: "completed",
  },
  {
    name: evaluationTools[1]!.name,
    description:
      "Conheça seus talentos naturais e descubra como usá-los para trabalhar com mais confiança.",
    status: "processing",
  },
  {
    name: evaluationTools[2]!.name,
    description:
      "Amplie sua percepção sobre comportamentos e preferências que influenciam sua atuação.",
    status: "not-started",
  },
  {
    name: evaluationTools[3]!.name,
    description:
      "Explore seu perfil comportamental e encontre caminhos para relações profissionais mais produtivas.",
    status: "not-started",
  },
  {
    name: evaluationTools[4]!.name,
    description:
      "Observe como você pensa, cria alternativas e lida com diferentes perspectivas.",
    status: "completed",
  },
  {
    name: evaluationTools[5]!.name,
    description:
      "Entenda suas preferências de personalidade e os contextos em que você tende a se desenvolver melhor.",
    status: "not-started",
  },
  {
    name: evaluationTools[6]!.name,
    description:
      "Reconheça características que impactam seu potencial, sua performance e seu estilo de trabalho.",
    status: "processing",
  },
  {
    name: evaluationTools[7]!.name,
    description:
      "Avalie competências essenciais para cada etapa da sua jornada de liderança.",
    status: "not-started",
  },
];

let assessments = initialAssessments.map((item, index) => ({
  ...item,
  toolId: evaluationTools[index]!.id,
})) as Assessment[];
const listeners = new Set<() => void>();
function displayName(item: Assessment) {
  return (
    getEvaluationTools().find((tool) => tool.id === item.toolId)?.name ??
    item.name
  );
}
export function useAssessments() {
  const tools = useEvaluationTools();
  const entries = useSyncExternalStore(
    (notify) => {
      listeners.add(notify);
      return () => {
        listeners.delete(notify);
      };
    },
    () => assessments,
    () => assessments,
  );
  return useMemo(
    () =>
      entries
        .filter((entry) => entry.associated !== false)
        .map((entry) => ({
          ...entry,
          name:
            tools.find((tool) => tool.id === entry.toolId)?.name ?? entry.name,
        })),
    [entries, tools],
  );
}
export function updateAssessment(name: string, changes: Partial<Assessment>) {
  const previous = assessments.find(
    (item) => item.name === name || displayName(item) === name,
  );
  if (!previous) throw new Error("Aplicação não encontrada.");
  const tool = getEvaluationTools().find(
    (item) => item.name === (changes.name ?? displayName(previous)),
  );
  if (!tool) throw new Error("Selecione uma ferramenta do catálogo.");
  if (assessments.some((item) => item !== previous && item.toolId === tool.id))
    throw new Error("Já existe uma aplicação dessa ferramenta.");
  assessments = assessments.map((item) =>
    item === previous
      ? { ...item, ...changes, name: tool.name, toolId: tool.id }
      : item,
  );
  listeners.forEach((notify) => notify());
}
export function addAssessment(item: Assessment) {
  const tool = getEvaluationTools().find((tool) => tool.name === item.name);
  if (!tool) throw new Error("Selecione uma ferramenta do catálogo.");
  if (
    assessments.some(
      (entry) => entry.toolId === tool.id && entry.associated !== false,
    )
  )
    throw new Error("Já existe uma aplicação dessa ferramenta.");
  const existing = assessments.find((entry) => entry.toolId === tool.id);
  if (existing)
    assessments = assessments.map((entry) =>
      entry === existing
        ? {
            ...entry,
            ...item,
            name: tool.name,
            toolId: tool.id,
            associated: true,
          }
        : entry,
    );
  else
    assessments = [
      ...assessments,
      { ...item, name: tool.name, toolId: tool.id, associated: true },
    ];
  listeners.forEach((notify) => notify());
}

export function disassociateAssessment(name: string) {
  assessments = assessments.map((entry) =>
    entry.name === name || displayName(entry) === name
      ? { ...entry, associated: false }
      : entry,
  );
  listeners.forEach((notify) => notify());
}

export function associateAssessment(toolId: string) {
  const tool = getEvaluationTools().find((item) => item.id === toolId);
  if (!tool) return;
  const existing = assessments.find((item) => item.toolId === toolId);
  if (existing) {
    assessments = assessments.map((item) =>
      item === existing ? { ...item, associated: true } : item,
    );
    listeners.forEach((notify) => notify());
  } else
    addAssessment({
      toolId,
      name: tool.name,
      description: "",
      status: "not-started",
    });
}

export function getAssessmentDisplayStatus(item: Assessment): AssessmentStatus {
  if (item.resultUrl) return "completed";
  return (item.performed ?? item.status !== "not-started")
    ? "processing"
    : "not-started";
}
