import { createFileRoute } from "@tanstack/react-router";
import { getMondayMentorshipByItemId } from "@/lib/monday-api";

// Identificador provisório do acompanhamento no Monday.
// Será substituído pela associação com o usuário autenticado
// quando o Portal A3 implementar cadastro e login.
const TEST_MENTORSHIP_ID = "13286629656";

export const Route = createFileRoute("/api/sessoes")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const mentorship =
            await getMondayMentorshipByItemId(TEST_MENTORSHIP_ID);

          if (!mentorship) {
            return Response.json(
              {
                message: "Acompanhamento não encontrado.",
              },
              { status: 404 },
            );
          }

          return Response.json({
            mentorship: {
              mondayItemId: mentorship.mondayItemId,
              menteeName: mentorship.menteeName,
              status: mentorship.status,
            },
            total: mentorship.sessions.length,
            sessoes: mentorship.sessions,
          });
        } catch (error) {
          console.error("Erro ao buscar sessões no Monday:", error);

          return Response.json(
            {
              message: "Não foi possível buscar as sessões no Monday.",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
