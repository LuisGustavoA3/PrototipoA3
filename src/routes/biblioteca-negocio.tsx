import { createFileRoute } from "@tanstack/react-router";
import { BibliotecaNegocioPage } from "@/modules/mentorias/mentorado/biblioteca/negocio";

export const Route = createFileRoute("/biblioteca-negocio")({
  head: () => ({
    meta: [
      { title: "Biblioteca: Negócio | A3 Digital" },
      {
        name: "description",
        content:
          "Explore conteúdos do eixo Negócio e acompanhe seu progresso na Biblioteca.",
      },
    ],
  }),
  component: BibliotecaNegocioPage,
});
