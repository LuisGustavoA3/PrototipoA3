import { createFileRoute } from "@tanstack/react-router";
import { JornadaDeDesenvolvimentoPage } from "@/modules/mentorias/mentorado/jornada";

export const Route = createFileRoute("/jornada-de-desenvolvimento")({
  head: () => ({
    meta: [
      { title: "Jornada de Desenvolvimento | A3 Digital" },
      {
        name: "description",
        content:
          "Organize os pontos de partida e acompanhamento da sua jornada de desenvolvimento.",
      },
    ],
  }),
  component: JornadaDeDesenvolvimentoPage,
});
