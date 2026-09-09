import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/treinamentos")({
  head: () => ({
    meta: [
      { title: "Treinamentos | A3 Digital" },
      {
        name: "description",
        content: "Módulo de Treinamentos da A3 Digital: turmas, cursos e capacitações.",
      },
      { property: "og:title", content: "Treinamentos | A3 Digital" },
      {
        property: "og:description",
        content: "Gerencie e acompanhe treinamentos e capacitações na A3 Digital.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Treinamentos,
});

function Treinamentos() {
  return (
    <div className="min-h-screen bg-background p-6">
      <Link
        to="/hub"
        className="label-caps inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" /> Voltar ao hub
      </Link>
      <h1 className="label-caps mt-6 text-lg text-foreground">Treinamentos</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Módulo em construção. Em breve você poderá gerenciar turmas e capacitações aqui.
      </p>
    </div>
  );
}
