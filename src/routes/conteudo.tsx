import { createFileRoute } from "@tanstack/react-router";
import { ConteudoPage } from "@/modules/mentorias/mentorado/conteudo";

export const Route = createFileRoute("/conteudo")({
  head: () => ({
    meta: [
      { title: "Conteúdo | A3 Digital" },
      {
        name: "description",
        content:
          "Acesse conteúdos para apoiar sua jornada de desenvolvimento na A3 Digital.",
      },
    ],
  }),
  component: ConteudoPage,
});
