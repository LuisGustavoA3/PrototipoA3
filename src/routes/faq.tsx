import { createFileRoute } from "@tanstack/react-router";
import { FAQPage } from "@/modules/mentorias/mentorado/ajuda/faq";

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [{ title: "FAQ | A3 Digital" }] }),
  component: FAQPage,
});
