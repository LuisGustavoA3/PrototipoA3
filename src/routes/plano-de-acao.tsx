import { createFileRoute } from "@tanstack/react-router";
import { PlanoDeAcaoPage } from "@/modules/mentorias/mentorado/pdi";

export const Route = createFileRoute("/plano-de-acao")({
  head: () => ({
    meta: [
      { title: "Plano de Ação (PDI) | A3 Digital" },
      {
        name: "description",
        content: "Organize e acompanhe suas ações de desenvolvimento no PDI.",
      },
    ],
  }),
  component: PlanoDeAcaoPage,
});
