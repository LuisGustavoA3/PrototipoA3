import { createFileRoute } from "@tanstack/react-router";
import { MeuAssessmentPage } from "@/modules/mentorias/mentorado/assessment";

export const Route = createFileRoute("/meu-assessment")({
  head: () => ({
    meta: [
      { title: "Meu Assessment | A3 Digital" },
      {
        name: "description",
        content:
          "Acompanhe seus testes de assessment e acesse seus resultados na A3 Digital.",
      },
    ],
  }),
  component: MeuAssessmentPage,
});
