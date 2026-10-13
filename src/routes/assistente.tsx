import { createFileRoute } from "@tanstack/react-router";
import { AssistantPage } from "@/modules/mentorias/mentorado/ajuda/assistente";

export const Route = createFileRoute("/assistente")({
  head: () => ({ meta: [{ title: "Assistente | A3 Digital" }] }),
  component: AssistantPage,
});
