type NavigateFunction = (options: { to: never }) => void;

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

  navigate({ to: destination as never });
}

export function hasPreviousPage() {
  return navigationHistory.length > 0;
}
