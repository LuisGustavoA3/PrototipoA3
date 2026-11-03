import { useMemo } from "react";
import {
  MENTORADO_TRAILS,
  useOwnTrails,
} from "@/modules/mentorias/trilhas/trail-store";
import { initialProfile } from "@/shared/informacoes-pessoais/personal-info";
import { trailCoverUrl } from "@/shared/lib/trail-presentation";
import { adminDashboardDemoPeople } from "../dashboard/adminDashboard.mock";

export const demoCompanies: {
  id: string;
  name: string;
  contracted: number | null;
}[] = [
  { id: "testes", name: "Testes", contracted: null },
  { id: "empresa-demo-1", name: "Empresa Exemplo", contracted: 10 },
  { id: "empresa-demo-2", name: "Empresa Horizonte", contracted: 5 },
];
export const demoPeople = adminDashboardDemoPeople.map((person, index) => ({
  id: person.id,
  displayId: 1001 + index,
  photo: "",
  name: person.name,
  email: `participante${index + 1}@example.com`,
  companyId: index < 3 ? "empresa-demo-1" : "empresa-demo-2",
  role: "Usuário",
}));
demoPeople.push({
  id: "luis-gustavo",
  displayId: 1005,
  photo: "",
  name: "Luis Gustavo Ribeiro",
  email: initialProfile.email,
  companyId: "testes",
  role: "Consultor A3",
});
const baseTrails: AdminTrail[] = adminDashboardDemoPeople.map(
  (person, index) => ({
    id: `trilha-demo-${index + 1}`,
    displayId: 501 + index,
    image: trailCoverUrl,
    slug: person.trail
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-$/, ""),
    personId: person.id,
    name: person.trail,
    status: person.status === "Concluído" ? "Concluída" : "Ativa",
  }),
);
baseTrails.push({
  id: "trilha-demo-historico",
  displayId: 505,
  image: trailCoverUrl,
  slug: "ana-paula-martins-ciclo-2024",
  personId: "demo-1",
  name: "Ana Paula Martins — Ciclo 2024",
  status: "Concluída",
});

// Fixtures de interface. Não representam contratos, contas ou resultados reais.
export function companyName(id: string) {
  return (
    demoCompanies.find((company) => company.id === id)?.name ?? "Sem empresa"
  );
}

export type AdminTrail = {
  id: string;
  displayId: number;
  image: string;
  slug: string;
  personId: string;
  name: string;
  status: string;
  ownTrailId?: number;
};
export function getAdminTrails(own = MENTORADO_TRAILS): AdminTrail[] {
  return [
    ...baseTrails,
    ...own.map((trail) => ({
      id: `trilha-luis-${trail.id}`,
      ownTrailId: trail.id,
      displayId: trail.id,
      image: trail.image,
      slug: "",
      personId: "luis-gustavo",
      name: trail.name,
      status: trail.active ? "Ativa" : "Inativa",
    })),
  ];
}
export function useAdminTrails() {
  const own = useOwnTrails();
  return useMemo(() => getAdminTrails(own), [own]);
}
export const demoEnrollments = getAdminTrails().map((trail) => ({
  id: `matricula-${trail.id}`,
  trailId: trail.id,
  userId: trail.personId,
  active: true,
}));
export function currentEnrollmentCount(trailId: string) {
  return demoEnrollments.filter(
    (item) => item.trailId === trailId && item.active,
  ).length;
}
