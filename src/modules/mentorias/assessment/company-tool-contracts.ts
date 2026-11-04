import { CURRENT_USER_COMPANY_ID } from "@/shared/lib/current-user-company";
import { useSyncExternalStore } from "react";
import { getEvaluationTools } from "./evaluation-tools";

const key = "a3-company-assessment-contracts-v1";
let contracts: Record<string, string[]> = {
  [CURRENT_USER_COMPANY_ID]: getEvaluationTools().map((tool) => tool.id),
  testes: [
    "ancoras-carreira",
    "clifton-strengths",
    "janusian",
    "perfil-caliper",
  ],
};
try {
  const saved: unknown = JSON.parse(localStorage.getItem(key) ?? "null");
  if (
    saved &&
    typeof saved === "object" &&
    !Array.isArray(saved) &&
    Object.values(saved).every(
      (ids) => Array.isArray(ids) && ids.every((id) => typeof id === "string"),
    )
  )
    contracts = { ...contracts, ...(saved as Record<string, string[]>) };
} catch {
  /* Mantém os vínculos iniciais. */
}
const listeners = new Set<() => void>();
const empty: string[] = [];
export function getCompanyTools(companyId: string) {
  return [...(contracts[companyId] ?? empty)];
}
export function useCompanyTools(companyId: string) {
  const snapshot = useSyncExternalStore(
    (notify) => {
      listeners.add(notify);
      return () => {
        listeners.delete(notify);
      };
    },
    () => contracts,
    () => contracts,
  );
  return snapshot[companyId] ?? empty;
}
export function saveCompanyTools(companyId: string, ids: string[]) {
  const available = getEvaluationTools();
  const next = {
    ...contracts,
    [companyId]: Array.from(new Set(ids)).filter((id) =>
      available.some((tool) => tool.id === id),
    ),
  };
  localStorage.setItem(key, JSON.stringify(next));
  contracts = next;
  listeners.forEach((notify) => notify());
}
