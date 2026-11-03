import { companyBoards, getCompanyBoard } from "../company-boards";

export const handlers = {
  GET: async ({ request }: { request: Request }) => {
    const company = new URL(request.url).searchParams.get("empresa") ?? "";
    const boardId = companyBoards[company];
    if (!boardId)
      return Response.json(
        { message: "Empresa sem quadro de mentorias associado." },
        { status: 404 },
      );
    if (!process.env["MONDAY_API_TOKEN"])
      return Response.json(
        {
          message:
            "Integração Monday indisponível. Configure a credencial no servidor.",
        },
        { status: 503 },
      );
    try {
      return Response.json(await getCompanyBoard(boardId), {
        headers: { "Cache-Control": "no-store" },
      });
    } catch {
      return Response.json(
        {
          message:
            "Não foi possível atualizar as sessões da empresa. Tente novamente.",
        },
        { status: 502 },
      );
    }
  },
};
