import { createFileRoute } from "@tanstack/react-router";
import { ConteudoReaderPage } from "@/modules/mentorias/mentorado/biblioteca/conteudo";

export const Route = createFileRoute("/biblioteca/conteudo/$contentId")({
  component: BibliotecaConteudoRoute,
});

function BibliotecaConteudoRoute() {
  const { contentId } = Route.useParams();

  return <ConteudoReaderPage contentId={contentId} />;
}
