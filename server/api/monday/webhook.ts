import { getMondayMentorshipSession } from "../../monday-api";
import {
  getMentorshipSessions,
  upsertMentorshipSession,
} from "../../../src/lib/mentorship-session";

export const handlers = {
  POST: async ({ request }: { request: Request }) => {
    const body: unknown = await request.json();

    // Responde ao desafio de validaÃ§Ã£o do Monday.
    if (
      typeof body === "object" &&
      body !== null &&
      "challenge" in body &&
      typeof body.challenge === "string"
    ) {
      return Response.json({
        challenge: body.challenge,
      });
    }

    if (typeof body !== "object" || body === null || !("event" in body)) {
      return Response.json(
        { received: false, message: "Evento invÃ¡lido" },
        { status: 400 },
      );
    }

    const event = body.event;

    if (
      typeof event !== "object" ||
      event === null ||
      !("boardId" in event) ||
      !("pulseId" in event) ||
      !("type" in event)
    ) {
      return Response.json(
        { received: false, message: "Dados do evento incompletos" },
        { status: 400 },
      );
    }

    // Ignora eventos de outros quadros.
    if (String(event.boardId) !== "18432549548") {
      return Response.json({ received: true, ignored: true });
    }

    // Por enquanto, processa alteraÃ§Ãµes de colunas.
    if (event.type !== "update_column_value") {
      return Response.json({ received: true, ignored: true });
    }

    try {
      const itemId = String(event.pulseId);

      console.log("Buscando item completo no Monday:", itemId);

      const session = await getMondayMentorshipSession(itemId);

      if (!session) {
        console.warn("Item nÃ£o encontrado no Monday:", itemId);

        return Response.json({
          received: true,
          updated: false,
          message: "Item nÃ£o encontrado no quadro",
        });
      }

      upsertMentorshipSession(session);

      console.log("SessÃ£o sincronizada:", session);
      console.log(
        "Total de sessÃµes em memÃ³ria:",
        getMentorshipSessions().length,
      );

      return Response.json({
        received: true,
        updated: true,
        mondayItemId: session.mondayItemId,
      });
    } catch (error) {
      console.error("Erro ao sincronizar sessÃ£o do Monday:", error);

      return Response.json(
        {
          received: false,
          message: "Falha ao sincronizar sessÃ£o",
        },
        { status: 500 },
      );
    }
  },
};
