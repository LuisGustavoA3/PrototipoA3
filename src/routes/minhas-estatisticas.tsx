import { createFileRoute } from "@tanstack/react-router";
import { MinhasEstatisticasPage } from "@/modules/mentorias/mentorado/estatisticas";

export const Route = createFileRoute("/minhas-estatisticas")({
  head: () => ({
    meta: [
      { title: "Minhas Estatísticas | A3 Digital" },
      {
        name: "description",
        content:
          "Visualize suas estatísticas de desenvolvimento por eixo: Indivíduo, Equipe, Negócio e Mercado.",
      },
      { property: "og:title", content: "Minhas Estatísticas | A3 Digital" },
      {
        property: "og:description",
        content:
          "Acompanhe seu progresso em autoconhecimento, liderança, negócio e visão de mercado.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MinhasEstatisticasPage,
});
