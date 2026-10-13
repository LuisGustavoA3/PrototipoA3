import { createFileRoute } from "@tanstack/react-router";
import { BibliotecaIndividuoPage } from "@/modules/mentorias/mentorado/biblioteca/individuo";

export const Route = createFileRoute("/biblioteca-individuo")({
  head: () => ({
    meta: [
      { title: "Biblioteca: Indivíduo | A3 Digital" },
      {
        name: "description",
        content:
          "Explore conteúdos do eixo Indivíduo e acompanhe seu progresso na Biblioteca.",
      },
    ],
  }),
  component: BibliotecaIndividuoPage,
});
