import { createFileRoute } from "@tanstack/react-router";
import { BibliotecaEquipePage } from "@/modules/mentorias/mentorado/biblioteca/equipe";

export const Route = createFileRoute("/biblioteca-equipe")({
  head: () => ({
    meta: [
      { title: "Biblioteca: Equipe | A3 Digital" },
      {
        name: "description",
        content:
          "Explore conteúdos do eixo Equipe e acompanhe seu progresso na Biblioteca.",
      },
    ],
  }),
  component: BibliotecaEquipePage,
});
