import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

type MentorshipSession = {
  mondayItemId: string;
  name: string;
  date: string | null;
  status: "Agendada" | "Concluída" | "Cancelada";
  responsaveis: string[];
  empresa: string | null;
};

type SessionsResponse = {
  total: number;
  sessoes: MentorshipSession[];
};

export const Route = createFileRoute("/sessoes-mentoria")({
  component: SessoesMentoriaPage,
});

function formatDate(date: string | null) {
  if (!date) return "—";

  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

function SessoesMentoriaPage() {
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSessions() {
      try {
        const response = await fetch("/PrototipoA3/api/sessoes");

        if (!response.ok) {
          throw new Error("Não foi possível carregar as sessões.");
        }

        const data: SessionsResponse = await response.json();

        if (isMounted) {
          setSessions(data.sessoes);
          setError(null);
          setLastUpdated(new Date());
        }
      } catch {
        if (isMounted) {
          setError("Não foi possível carregar as sessões. Tente novamente.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadSessions();

    const interval = window.setInterval(() => {
      void loadSessions();
    }, 30_000);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <main className="space-y-6 p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Sessões de Mentoria
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Acompanhe as sessões de mentoria cadastradas no Monday.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted"
        >
          <RefreshCw className="size-4" />
          Atualizar
        </button>
      </header>

      <section className="rounded-lg border bg-card p-5">
        <p className="text-sm text-muted-foreground">Total de sessões</p>
        <p className="mt-2 text-3xl font-semibold">
          {loading ? "—" : sessions.length}
        </p>
      </section>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 p-4 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <section className="overflow-hidden rounded-lg border bg-card">
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold">Todas as sessões</h2>
          {lastUpdated && (
            <p className="mt-1 text-xs text-muted-foreground">
              Última consulta: {lastUpdated.toLocaleTimeString("pt-BR")}
            </p>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Sessão</th>
                <th className="px-5 py-3 font-medium">Data</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Responsáveis</th>
                <th className="px-5 py-3 font-medium">Empresa</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-8 text-center text-muted-foreground"
                  >
                    Carregando sessões...
                  </td>
                </tr>
              ) : sessions.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-8 text-center text-muted-foreground"
                  >
                    Nenhuma sessão encontrada.
                  </td>
                </tr>
              ) : (
                sessions.map((session) => (
                  <tr key={session.mondayItemId} className="hover:bg-muted/30">
                    <td className="px-5 py-4 font-medium">{session.name}</td>
                    <td className="whitespace-nowrap px-5 py-4">
                      {formatDate(session.date)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                        {session.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {session.responsaveis.length > 0
                        ? session.responsaveis.join(", ")
                        : "—"}
                    </td>
                    <td className="px-5 py-4">{session.empresa ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
