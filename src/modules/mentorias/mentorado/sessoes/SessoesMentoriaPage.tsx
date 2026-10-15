import { useCallback, useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";

import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/PageHeader";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { useSidebarOpen } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";

import type { MondayMentorshipSession } from "@/lib/mentorship-session";

type SessionsResponse = {
  mentorship: {
    mondayItemId: string;
    menteeName: string;
    status: string | null;
  };
  total: number;
  sessoes: MondayMentorshipSession[];
};

function formatDate(date: string | null) {
  if (!date) return "—";

  const [year, month, day] = date.split("-");
  if (!year || !month || !day) return "—";

  return `${day}/${month}/${year}`;
}

function formatHours(hours: number | null) {
  if (hours === null) return "—";

  return `${hours.toLocaleString("pt-BR")} h`;
}

function SessionProgress({ progress }: { progress: number | null }) {
  const valid = progress !== null && Number.isFinite(progress);

  const percentage = valid ? Math.min(100, Math.max(0, progress)) : 0;

  return (
    <div className="flex min-w-32 items-center gap-3">
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
        role={valid ? "progressbar" : undefined}
        aria-valuenow={valid ? percentage : undefined}
        aria-valuemin={valid ? 0 : undefined}
        aria-valuemax={valid ? 100 : undefined}
        aria-label="Progresso da sessão"
      >
        {valid && (
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>

      <span className="min-w-10 text-right text-xs text-muted-foreground">
        {valid ? `${Math.round(percentage)}%` : "—"}
      </span>
    </div>
  );
}

export function SessoesMentoriaPage() {
  const [sidebarOpen, toggleSidebar] = useSidebarOpen();

  const [sessions, setSessions] = useState<MondayMentorshipSession[]>([]);

  const [mentorship, setMentorship] = useState<
    SessionsResponse["mentorship"] | null
  >(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const isFetchingRef = useRef(false);

  const loadSessions = useCallback(async () => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsFetching(true);

    try {
      const response = await fetch("/PrototipoA3/api/sessoes");

      if (!response.ok) {
        throw new Error("Não foi possível carregar as sessões.");
      }

      const data: SessionsResponse = await response.json();

      setSessions(data.sessoes);
      setMentorship(data.mentorship);
      setError(null);
      setLastUpdated(new Date());
    } catch {
      setError("Não foi possível carregar as sessões. Tente novamente.");
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    void loadSessions();

    const interval = window.setInterval(() => {
      void loadSessions();
    }, 30_000);

    return () => {
      window.clearInterval(interval);
    };
  }, [loadSessions]);

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
              description="Acompanhe suas sessões de mentoria."
            />

            <Button
              type="button"
              onClick={() => void loadSessions()}
              variant="outline"
              size="sm"
              disabled={isFetching}
            >
              <RefreshCw
                className={cn("size-4", isFetching && "animate-spin")}
              />
              {isFetching ? "Atualizando..." : "Atualizar"}
            </Button>
          </header>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-md border border-border bg-card p-5">
              <p className="text-xs text-muted-foreground">Total de sessões</p>

              <p className="mt-2 text-3xl font-semibold">
                {loading ? "—" : sessions.length}
              </p>
            </div>

            <div className="rounded-md border border-border bg-card p-5">
              <p className="text-xs text-muted-foreground">
                Status do acompanhamento
              </p>

              <p className="mt-2 text-xl font-semibold">
                {mentorship?.status ?? "—"}
              </p>
            </div>
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
              <h2 className="text-sm font-semibold">Minhas sessões</h2>

              {mentorship && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {mentorship.menteeName}
                </p>
              )}

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
                    <th className="px-5 py-3 font-medium">Consultor</th>
                    <th className="px-5 py-3 font-medium">Data prevista</th>
                    <th className="px-5 py-3 font-medium">Data realizada</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">CH prevista</th>
                    <th className="px-5 py-3 font-medium">CH realizada</th>
                    <th className="px-5 py-3 font-medium">Progresso</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-5 py-8 text-center text-muted-foreground"
                      >
                        Carregando sessões...
                      </td>
                    </tr>
                  ) : sessions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-5 py-8 text-center text-muted-foreground"
                      >
                        Nenhuma sessão encontrada.
                      </td>
                    </tr>
                  ) : (
                    sessions.map((session) => (
                      <tr
                        key={session.mondaySubitemId}
                        className="hover:bg-muted/30"
                      >
                        <td className="px-5 py-4 font-medium">
                          {session.name}
                        </td>

                        <td className="px-5 py-4">
                          {session.consultant.join(", ") || "—"}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          {formatDate(session.scheduledDate)}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          {formatDate(session.completedDate)}
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                            {session.status ?? "—"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          {formatHours(session.plannedHours)}
                        </td>

                        <td className="px-5 py-4">
                          {formatHours(session.completedHours)}
                        </td>

                        <td className="px-5 py-4">
                          <SessionProgress progress={session.progress} />
                        </td>
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
