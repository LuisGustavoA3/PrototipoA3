import { createFileRoute } from "@tanstack/react-router";
import { ArquivosCompartilhadosPage } from "@/modules/mentorias/mentorado/arquivos-compartilhados";

export const Route = createFileRoute("/arquivos-compartilhados")({
  head: () => ({
    meta: [
      { title: "Arquivos Compartilhados | A3 Digital" },
      {
        name: "description",
        content:
          "Compartilhe e acompanhe arquivos entre mentor e mentorado na A3 Digital.",
      },
    ],
  }),
  component: ArquivosCompartilhadosPage,
});
