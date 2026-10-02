import { createFileRoute } from "@tanstack/react-router";
import { getMentorshipSessions } from "@/lib/mentorship-session";

export const Route = createFileRoute("/api/sessoes")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json({
          total: getMentorshipSessions().length,
          sessoes: getMentorshipSessions(),
        });
      },
    },
  },
});
