import { createFileRoute } from "@tanstack/react-router";
import { BibliotecaMercadoPage } from "@/modules/mentorias/mentorado/biblioteca/mercado";

export const Route = createFileRoute("/biblioteca-mercado")({
  head: () => ({
    meta: [
      { title: "Biblioteca: Mercado | A3 Digital" },
      {
        name: "description",
        content:
          "Explore conteúdos do eixo Mercado e acompanhe seu progresso na Biblioteca.",
      },
    ],
  }),
  component: BibliotecaMercadoPage,
});
