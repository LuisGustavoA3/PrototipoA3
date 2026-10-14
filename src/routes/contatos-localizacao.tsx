import { createFileRoute } from "@tanstack/react-router";
import { ContatosLocalizacaoPage } from "@/modules/mentorias/mentorado/ajuda/contatos-localizacao";

export const Route = createFileRoute("/contatos-localizacao")({
  head: () => ({
    meta: [{ title: "Contatos e localização | A3 Digital" }],
  }),
  component: ContatosLocalizacaoPage,
});
