import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Presentation, UserSearch } from "lucide-react";

export const Route = createFileRoute("/hub")({
  head: () => ({
    meta: [
      { title: "Hub de Módulos | A3 Digital" },
      {
        name: "description",
        content:
          "Escolha um módulo da A3 Digital: Desenvolvimento Profissional, Treinamentos ou Administração.",
      },
      { property: "og:title", content: "Hub de Módulos | A3 Digital" },
      {
        property: "og:description",
        content: "Acesse os módulos da plataforma A3 Digital em um só lugar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Hub,
});

const modules = [
  {
    label: ["Desenvolvimento", "Profissional"],
    icon: Users,
    to: "/" as const,
  },
  {
    label: ["Treinamentos"],
    icon: Presentation,
    to: "/treinamentos" as const,
  },
  {
    label: ["Administração"],
    icon: UserSearch,
    to: "/administracao" as const,
  },
];

function Hub() {
  return (
    <div className="min-h-screen w-full bg-secondary">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-12 px-6 py-16">
        <div className="text-center">
          <span className="block text-6xl font-light tracking-widest text-foreground">A3</span>
          <span className="label-caps mt-1 block text-lg tracking-[0.4em] text-muted-foreground">
            Digital
          </span>
        </div>

        <h1 className="sr-only">Hub de módulos A3 Digital</h1>

        <div className="grid w-full grid-cols-1 justify-items-center gap-8 sm:grid-cols-2">
          {modules.map((m, i) => (
            <Link
              key={m.to}
              to={m.to}
              className={
                "group flex h-56 w-full max-w-[340px] flex-col items-center justify-center gap-6 rounded-xl bg-card shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" +
                (i === 2 ? " sm:col-span-2" : "")
              }
            >
              <m.icon className="size-16 stroke-[1.25] text-primary" />
              <span className="label-caps text-center text-sm leading-6 text-primary">
                {m.label.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
