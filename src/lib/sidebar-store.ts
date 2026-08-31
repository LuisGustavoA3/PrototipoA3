const SIDEBAR_OPEN_KEY = "a3:sidebar-open";
const SIDEBAR_GROUPS_KEY = "a3:sidebar-groups";

type Listener = () => void;

const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function subscribeSidebar(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSidebarOpen(): boolean {
  if (typeof window === "undefined") return true;
  const stored = window.localStorage.getItem(SIDEBAR_OPEN_KEY);
  return stored === null ? true : stored === "true";
}

export function setSidebarOpen(open: boolean) {
  window.localStorage.setItem(SIDEBAR_OPEN_KEY, String(open));
  notify();
}

export function getSidebarGroups(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const stored = window.localStorage.getItem(SIDEBAR_GROUPS_KEY);
    return stored ? (JSON.parse(stored) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

export function setSidebarGroup(label: string, open: boolean) {
  const groups = { ...getSidebarGroups(), [label]: open };
  window.localStorage.setItem(SIDEBAR_GROUPS_KEY, JSON.stringify(groups));
  notify();
}
