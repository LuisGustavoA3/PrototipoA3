import { createFileRoute } from "@tanstack/react-router";
import { SessoesMentoriaPage } from "@/modules/mentorias/mentorado/sessoes";

export const Route = createFileRoute("/sessoes-mentoria")({
  component: SessoesMentoriaPage,
});
