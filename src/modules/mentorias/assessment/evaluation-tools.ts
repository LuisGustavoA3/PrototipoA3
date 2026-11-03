import { useSyncExternalStore } from "react";
import { z } from "zod";
export const evaluationTools = [
  {
    id: "ancoras-carreira",
    name: "Âncoras de Carreira",
    active: true,
    free: false,
  },
  {
    id: "clifton-strengths",
    name: "CliftonStrengths",
    active: true,
    free: false,
  },
  { id: "htm", name: "HTM", active: true, free: false },
  { id: "human-guide", name: "HumanGuide", active: true, free: false },
  { id: "janusian", name: "Janusian", active: true, free: false },
  { id: "mbti", name: "MBTI", active: true, free: false },
  { id: "perfil-caliper", name: "Perfil Caliper", active: true, free: false },
  {
    id: "perfil-gestao",
    name: "PERFIL DE GESTÃO: Pipeline de Liderança",
    active: true,
    free: true,
  },
];

const schema = z.object({
  id: z.string(),
  name: z.string().trim().min(1),
  active: z.boolean(),
  free: z.boolean(),
  image: z.string(),
});
export type EvaluationTool = z.infer<typeof schema>;
const key = "a3-evaluation-tools-v1";
let tools: EvaluationTool[] = evaluationTools.map((tool) => ({
  ...tool,
  image: "",
}));
try {
  const parsed = z
    .array(schema)
    .safeParse(JSON.parse(localStorage.getItem(key) ?? "null"));
  if (
    parsed.success &&
    parsed.data.length &&
    new Set(parsed.data.map((tool) => tool.id)).size === parsed.data.length
  )
    tools = parsed.data;
} catch {
  /* Usa o catálogo inicial. */
}
const listeners = new Set<() => void>();
export function getEvaluationTools() {
  return tools;
}
export function useEvaluationTools() {
  return useSyncExternalStore(
    (notify) => {
      listeners.add(notify);
      return () => {
        listeners.delete(notify);
      };
    },
    getEvaluationTools,
    getEvaluationTools,
  );
}
export function saveEvaluationTool(tool: EvaluationTool) {
  const parsed = schema.parse(tool);
  if (
    tools.some(
      (item) =>
        item.id !== parsed.id &&
        item.name.toLocaleLowerCase() === parsed.name.toLocaleLowerCase(),
    )
  )
    throw new Error("Já existe uma ferramenta com esse nome.");
  if (
    parsed.image &&
    !parsed.image.startsWith("https://") &&
    !/^data:image\/(png|jpeg|webp);base64,/.test(parsed.image)
  )
    throw new Error("Use imagem PNG, JPG ou WebP, ou uma URL HTTPS.");
  const next = tools.some((item) => item.id === parsed.id)
    ? tools.map((item) => (item.id === parsed.id ? parsed : item))
    : [...tools, parsed];
  localStorage.setItem(key, JSON.stringify(next));
  tools = next;
  listeners.forEach((notify) => notify());
}
