import { createFileRoute } from "@tanstack/react-router";
import { getMondayMentorshipSession } from "@/lib/monday-api";
import {
  getMentorshipSessions,
  upsertMentorshipSession,
} from "@/lib/mentorship-session";

export const Route = createFileRoute("/api/monday/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body: unknown = await request.json();

        // Responde ao desafio de validação do Monday.
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
            { received: false, message: "Evento inválido" },
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

        // Por enquanto, processa alterações de colunas.
        if (event.type !== "update_column_value") {
          return Response.json({ received: true, ignored: true });
        }

        try {
          const itemId = String(event.pulseId);

          console.log("Buscando item completo no Monday:", itemId);

          const session = await getMondayMentorshipSession(itemId);

          if (!session) {
            console.warn("Item não encontrado no Monday:", itemId);

            return Response.json({
              received: true,
              updated: false,
              message: "Item não encontrado no quadro",
            });
          }

          upsertMentorshipSession(session);

          console.log("Sessão sincronizada:", session);
          console.log(
            "Total de sessões em memória:",
            getMentorshipSessions().length,
          );

          return Response.json({
            received: true,
            updated: true,
            mondayItemId: session.mondayItemId,
          });
        } catch (error) {
          console.error("Erro ao sincronizar sessão do Monday:", error);

          return Response.json(
            {
              received: false,
              message: "Falha ao sincronizar sessão",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
