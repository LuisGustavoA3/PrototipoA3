import type { NavigateFunction } from "react-router-dom";

const navigationHistory: string[] = [];

let currentPath: string | null = null;

export function recordNavigation(path: string) {
  if (!path || path === currentPath) return;

  if (currentPath) {
    navigationHistory.push(currentPath);
  }

  currentPath = path;
}

export function goBack(navigate: NavigateFunction) {
  const previousPath = navigationHistory.pop();

  const destination = previousPath ?? "/hub";

  currentPath = destination;

  navigate(destination);
}

export function hasPreviousPage() {
  return navigationHistory.length > 0;
}
