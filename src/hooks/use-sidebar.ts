import { useEffect, useState } from "react";
import {
  getSidebarGroups,
  getSidebarOpen,
  setSidebarGroup,
  setSidebarOpen,
  subscribeSidebar,
} from "@/lib/sidebar-store";

/** Persisted sidebar open/closed state, shared across routes. */
export function useSidebarOpen(): [boolean, () => void] {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(getSidebarOpen());
    return subscribeSidebar(() => setOpen(getSidebarOpen()));
  }, []);

  const toggle = () => setSidebarOpen(!getSidebarOpen());

  return [open, toggle];
}

/** Persisted expanded state of sidebar dropdown groups. */
export function useSidebarGroups(): [
  Record<string, boolean>,
  (label: string) => void,
] {
  const [groups, setGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setGroups(getSidebarGroups());
    return subscribeSidebar(() => setGroups(getSidebarGroups()));
  }, []);

  const toggleGroup = (label: string) =>
    setSidebarGroup(label, !getSidebarGroups()[label]);

  return [groups, toggleGroup];
}
