import { useParams } from "react-router-dom";

import { ConteudoReaderPage } from "@/modules/mentorias/biblioteca/conteudo";

export default BibliotecaConteudoRoute;

function BibliotecaConteudoRoute() {
  const { contentId } = useParams();

  return <ConteudoReaderPage contentId={contentId ?? ""} />;
}
