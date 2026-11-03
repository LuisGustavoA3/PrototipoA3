import { updateMondaySessionComment } from "../../monday-api";

// Identificador fixo do acompanhamento de teste.
// SerÃ¡ substituÃ­do pela identificaÃ§Ã£o do usuÃ¡rio autenticado.
const TEST_MENTORSHIP_ID = "13286629656";

export const handlers = {
  POST: async ({ request }: { request: Request }) => {
    // A gravaÃ§Ã£o permanece restrita ao ambiente de desenvolvimento.
    if (process.env["NODE_ENV"] !== "development") {
      return Response.json(
        { message: "OperaÃ§Ã£o indisponÃ­vel." },
        { status: 403 },
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return Response.json({ message: "JSON invÃ¡lido." }, { status: 400 });
    }

    if (
      typeof body !== "object" ||
      body === null ||
      !("mondaySubitemId" in body) ||
      !("comment" in body) ||
      typeof body.mondaySubitemId !== "string" ||
      typeof body.comment !== "string"
    ) {
      return Response.json(
        { message: "Dados do comentÃ¡rio invÃ¡lidos." },
        { status: 400 },
      );
    }

    const mondaySubitemId = body.mondaySubitemId;
    const comment = body.comment.trim();

    if (!/^\d+$/.test(mondaySubitemId)) {
      return Response.json(
        { message: "Identificador da sessÃ£o invÃ¡lido." },
        { status: 400 },
      );
    }

    if (comment.length > 5000) {
      return Response.json(
        { message: "O comentÃ¡rio excede 5000 caracteres." },
        { status: 400 },
      );
    }

    try {
      await updateMondaySessionComment(
        TEST_MENTORSHIP_ID,
        mondaySubitemId,
        comment,
      );

      return Response.json({
        success: true,
        mondaySubitemId,
        comment,
      });
    } catch (error) {
      console.error("Erro ao atualizar comentÃ¡rio no Monday:", error);

      return Response.json(
        { message: "NÃ£o foi possÃ­vel salvar o comentÃ¡rio." },
        { status: 500 },
      );
    }
  },
};
