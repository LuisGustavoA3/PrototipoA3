import { useSyncExternalStore } from "react";

export type EditableSection =
  | "Entregáveis"
  | "Prioridades de desenvolvimento"
  | "Suporte ao desenvolvimento"
  | "Obstáculos ao desenvolvimento";

export type Section = EditableSection | "Resultados e progressos" | "Continuidade de desenvolvimento";

export type JourneyItem = {
  id: number;
  title: string;
  updatedAt: string;
};

export const initialJourneyItems: Record<Section, JourneyItem[]> = {
  Entregáveis: [],
  "Prioridades de desenvolvimento": [],
  "Suporte ao desenvolvimento": [],
  "Obstáculos ao desenvolvimento": [],
  "Resultados e progressos": [],
  "Continuidade de desenvolvimento": [],
};

let items = initialJourneyItems;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function subscribeJourney(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getJourneyItems() {
  return items;
}

export function useJourneyItems() {
  return useSyncExternalStore(subscribeJourney, getJourneyItems, getJourneyItems);
}

export function addJourneyItem(section: Section, title: string) {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) return;

  const newItem: JourneyItem = {
    id: Date.now(),
    title: trimmedTitle,
    updatedAt: new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date()),
  };

  items = {
    ...items,
    [section]: [...items[section], newItem],
  };
  notify();
}
