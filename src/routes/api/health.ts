import { createFileRoute } from "@tanstack/react-router";
import { getMondayMentorshipByItemId } from "@/lib/monday-api";

// ID do item principal do mentorado no Monday.
const TEST_MENTORSHIP_ID = "13286629656";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        // Permitir o diagnóstico somente em desenvolvimento.
        if (process.env["NODE_ENV"] !== "development") {
          return Response.json(
            { message: "Rota indisponível" },
            { status: 404 },
          );
        }

        try {
          const mentorship =
            await getMondayMentorshipByItemId(TEST_MENTORSHIP_ID);

          if (!mentorship) {
            return Response.json(
              { message: "Acompanhamento não encontrado" },
              { status: 404 },
            );
          }

          return Response.json({
            success: true,
            mentorship,
            totalSessions: mentorship.sessions.length,
          });
        } catch (error) {
          console.error("Erro ao consultar acompanhamento:", error);

          return Response.json(
            {
              success: false,
              message: "Falha ao consultar o Monday",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
