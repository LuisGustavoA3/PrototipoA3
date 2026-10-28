const STORAGE_KEY = "a3-selected-trail";

export const DEFAULT_TRAIL = "Gestão de Alta Performance";

const listeners = new Set<() => void>();

let selectedTrail = DEFAULT_TRAIL;

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

  if (stored) {
    selectedTrail = stored;
  } else {
    window.localStorage.setItem(STORAGE_KEY, DEFAULT_TRAIL);
  }

  listeners.forEach((listener) => listener());
}

export function hasSelectedTrailContent() {
  return selectedTrail === DEFAULT_TRAIL;
}
