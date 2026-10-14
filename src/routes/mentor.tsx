import { createFileRoute } from "@tanstack/react-router";
import { MentorDashboardPage } from "@/modules/mentorias/mentor/dashboard";

export const Route = createFileRoute("/mentor")({
  head: () => ({
    meta: [
      { title: "Dashboard do Mentor | A3 Digital" },
      {
        name: "description",
        content: "Acompanhe mentorados, trilhas e sessões de mentoria.",
      },
    ],
  }),
  component: MentorDashboardPage,
});
