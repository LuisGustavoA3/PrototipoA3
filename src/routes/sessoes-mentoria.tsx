import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/PageHeader";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { useSidebarOpen } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";

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
  const [sidebarOpen, toggleSidebar] = useSidebarOpen();
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let isFetching = false;

    async function loadSessions(manual = false) {
      if (isFetching) return;

      isFetching = true;

      if (manual && isMounted) {
        setRefreshing(true);
      }

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
        isFetching = false;

        if (isMounted) {
          setLoading(false);
          setRefreshing(false);
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
    <div className="h-screen w-full overflow-hidden bg-background">
      <TopBar onToggleSidebar={toggleSidebar} />
      <AppSidebar open={sidebarOpen} />
      <main
        className={cn(
          "h-full overflow-y-auto pt-16 transition-[padding-left] duration-300",
          sidebarOpen ? "pl-[264px]" : "pl-0",
        )}
      >
        <div className="space-y-5 p-6">
          <header className="flex flex-wrap items-start justify-between gap-4">
            <PageHeader
              title="Sessões de Mentoria"
              description="Acompanhe as sessões de mentoria cadastradas no Monday."
            />
            <Button
              type="button"
              onClick={() => window.location.reload()}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="size-4" />
              Atualizar
            </Button>
          </header>

          <section className="rounded-md border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <p className="label-caps text-xs text-muted-foreground">
              Total de sessões
            </p>
            <p className="mt-2 text-3xl font-semibold">
              {loading ? "—" : sessions.length}
            </p>
          </section>

          {error && (
            <div
              role="alert"
              className="rounded-md border border-destructive/30 bg-card p-4 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          <section className="overflow-hidden rounded-md border border-border bg-card shadow-[var(--shadow-card)]">
            <div className="border-b border-border px-5 py-4">
              <h2 className="label-caps text-sm text-foreground">
                Todas as sessões
              </h2>
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
                      <tr
                        key={session.mondayItemId}
                        className="hover:bg-muted/30"
                      >
                        <td className="px-5 py-4 font-medium">
                          {session.name}
                        </td>
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
        </div>
      </main>
    </div>
  );
}
