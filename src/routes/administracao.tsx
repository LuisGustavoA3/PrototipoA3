import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/administracao")({
  head: () => ({
    meta: [
      { title: "Administração | A3 Digital" },
      {
        name: "description",
        content: "Módulo de Administração da A3 Digital: usuários, permissões e configurações.",
      },
      { property: "og:title", content: "Administração | A3 Digital" },
      {
        property: "og:description",
        content: "Administre usuários, permissões e configurações da plataforma A3 Digital.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Administracao,
});

function Administracao() {
  return (
    <div className="min-h-screen bg-background p-6">
      <Link
        to="/hub"
        className="label-caps inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" /> Voltar ao hub
      </Link>
      <h1 className="label-caps mt-6 text-lg text-foreground">Administração</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Módulo em construção. Em breve você poderá administrar usuários e permissões aqui.
      </p>
    </div>
  );
}
