import { useSyncExternalStore } from "react";
import { z } from "zod";
import { trailCoverUrl } from "@/shared/lib/trail-presentation";
const STORAGE_KEY = "a3-selected-trail";

export const DEFAULT_TRAIL = "Luis Gustavo Ribeiro — Ciclo 2026";
const initialTrails = [
  { id: 601, name: DEFAULT_TRAIL, progress: "75%", year: 2026, active: true },
  {
    id: 602,
    name: "Luis Gustavo Ribeiro — Ciclo 2025",
    progress: "15%",
    year: 2025,
    active: false,
  },
  {
    id: 603,
    name: "Luis Gustavo Ribeiro — Ciclo 2024",
    progress: "30%",
    year: 2024,
    active: false,
  },
];
const ownTrailSchema = z.object({
  id: z.number(),
  name: z.string().trim().min(1),
  progress: z.string(),
  year: z.number(),
  active: z.boolean(),
  image: z.string(),
});
export type OwnTrail = z.infer<typeof ownTrailSchema>;
const catalogKey = "a3-luis-trails-v1";
export let MENTORADO_TRAILS: OwnTrail[] = initialTrails.map((trail) => ({
  ...trail,
  image: trailCoverUrl,
}));
try {
  const parsed = z
    .array(ownTrailSchema)
    .safeParse(JSON.parse(localStorage.getItem(catalogKey) ?? "null"));
  if (
    parsed.success &&
    parsed.data.length === initialTrails.length &&
    initialTrails.every(
      (trail) =>
        parsed.data.filter((entry) => entry.id === trail.id).length === 1,
    ) &&
    parsed.data.filter((trail) => trail.active).length <= 1
  )
    MENTORADO_TRAILS = parsed.data;
} catch {
  /* Mantém o catálogo inicial se o armazenamento estiver indisponível. */
}
export function useOwnTrails() {
  return useSyncExternalStore(
    subscribeTrail,
    () => MENTORADO_TRAILS,
    () => MENTORADO_TRAILS,
  );
}
export function updateOwnTrail(
  id: number,
  values: Pick<OwnTrail, "name" | "active" | "image">,
) {
  const trail = MENTORADO_TRAILS.find((item) => item.id === id);
  if (!trail) throw new Error("Trilha não encontrada.");
  const next = ownTrailSchema.parse({ ...trail, ...values });
  if (
    next.active &&
    MENTORADO_TRAILS.some((item) => item.id !== id && item.active)
  )
    throw new Error("Luis já possui outra trilha ativa.");
  const url = new URL(next.image, window.location.origin);
  if (
    !next.image.startsWith(import.meta.env.BASE_URL + "images/") &&
    url.protocol !== "https:" &&
    !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(
      next.image,
    )
  )
    throw new Error(
      "Use uma imagem PNG, JPG ou WebP, uma imagem local da aplicação ou uma URL HTTPS.",
    );
  const updated = MENTORADO_TRAILS.map((item) =>
    item.id === id ? next : item,
  );
  localStorage.setItem(catalogKey, JSON.stringify(updated));
  MENTORADO_TRAILS = updated;
  if (selectedTrail === trail.name) setSelectedTrail(next.name);
  listeners.forEach((notify) => notify());
}
const legacyNames = [
  "Liderança Inspiradora",
  "Comunicação Estratégica",
  "Cultura de Inovação",
  "Visão Estratégica",
  "Inovação e Criatividade",
];

const listeners = new Set<() => void>();

let selectedTrail = MENTORADO_TRAILS[0]!.name;

export function getSelectedTrail() {
  return selectedTrail;
}

export function setSelectedTrail(trail: string) {
  if (selectedTrail === trail) return;

  selectedTrail = trail;

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, trail);
  }

  listeners.forEach((listener) => listener());
}

export function subscribeTrail(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function initializeSelectedTrail() {
  if (typeof window === "undefined") return;

  const stored = window.localStorage.getItem(STORAGE_KEY);

  selectedTrail =
    stored === "Gestão de Alta Performance" || !stored
      ? MENTORADO_TRAILS[0]!.name
      : legacyNames.includes(stored)
        ? MENTORADO_TRAILS[1]!.name
        : MENTORADO_TRAILS.some((trail) => trail.name === stored)
          ? stored
          : MENTORADO_TRAILS[0]!.name;
  window.localStorage.setItem(STORAGE_KEY, selectedTrail);

  listeners.forEach((listener) => listener());
}

export function hasSelectedTrailContent() {
  return (
    selectedTrail === MENTORADO_TRAILS.find((trail) => trail.id === 601)?.name
  );
}
