import { useEffect, useSyncExternalStore } from "react";

import {
  getSelectedTrail,
  initializeSelectedTrail,
  subscribeTrail,
  hasSelectedTrailContent,
} from "./trail-store";

export function useSelectedTrail() {
  const selectedTrail = useSyncExternalStore(
    subscribeTrail,
    getSelectedTrail,
    getSelectedTrail,
  );

  useEffect(() => {
    initializeSelectedTrail();
  }, []);

  return {
    selectedTrail,
    hasContent: hasSelectedTrailContent(),
  };
}
