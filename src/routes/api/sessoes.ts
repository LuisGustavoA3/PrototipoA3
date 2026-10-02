import { createFileRoute } from "@tanstack/react-router";
import { getMondayMentorshipSessions } from "@/lib/monday-api";

export const Route = createFileRoute("/api/sessoes")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const sessoes = await getMondayMentorshipSessions();

          return Response.json({
            total: sessoes.length,
            sessoes,
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
