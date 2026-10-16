import { useCallback, useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";

import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/PageHeader";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { useSidebarOpen } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";
import type { MondayMentorshipSession } from "@/lib/mentorship-session";

type SessionsResponse = {
  mentorship: {
    mondayItemId: string;
    menteeName: string;
    status: string | null;

    manager: string[];
    monitoring: string[];
    attendance: string[];

    contractDeadline: string | null;
    schedule: {
      from: string;
      to: string;
    } | null;

    progress: number | null;
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

function getContractDaysRemaining(deadline: string | null): number | null {
  if (!deadline) return null;

  const [year, month, day] = deadline.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  const deadlineUtc = Date.UTC(year, month - 1, day);

  const now = new Date();
  const todayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

  return Math.round((deadlineUtc - todayUtc) / (1000 * 60 * 60 * 24));
}

function formatHours(hours: number | null) {
  if (hours === null) return "—";

  return `${hours.toLocaleString("pt-BR")} h`;
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

  const [commentSessionId, setCommentSessionId] = useState<string | null>(null);
  const [commentDraft, setCommentDraft] = useState("");
  const isFetchingRef = useRef(false);
  function openCommentDialog(session: MondayMentorshipSession) {
    setCommentSessionId(session.mondaySubitemId);
    setCommentDraft(session.comment ?? "");
  }
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

          <section className="rounded-md border border-border bg-card p-5">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold">
                  Progresso geral das sessões
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  Percentual de sessões concluídas em relação ao total de
                  sessões cadastradas.
                </p>
              </div>

              <span className="text-xl font-semibold">
                {mentorship?.progress != null ? `${mentorship.progress}%` : "—"}
              </span>
            </div>

            <div
              className="h-3 w-full overflow-hidden rounded-full bg-muted"
              role={mentorship?.progress != null ? "progressbar" : undefined}
              aria-label="Progresso geral das sessões"
              aria-valuenow={mentorship?.progress ?? undefined}
              aria-valuemin={mentorship?.progress != null ? 0 : undefined}
              aria-valuemax={mentorship?.progress != null ? 100 : undefined}
            >
              {mentorship?.progress != null && (
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, mentorship.progress),
                    )}%`,
                  }}
                />
              )}
            </div>
          </section>

          <section className="rounded-md border border-border bg-card p-5">
            <h2 className="mb-4 text-sm font-semibold">
              Informações do acompanhamento
            </h2>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Gestor</p>
                <p className="mt-1 text-sm font-medium">
                  {mentorship?.manager.join(", ") || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Monitoramento</p>
                <p className="mt-1 text-sm font-medium">
                  {mentorship?.monitoring.join(", ") || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Atendimento</p>
                <p className="mt-1 text-sm font-medium">
                  {mentorship?.attendance.join(", ") || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Prazo do contrato
                </p>
                <p className="mt-1 text-sm font-medium">
                  {formatDate(mentorship?.contractDeadline ?? null)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Dias restantes do contrato
                </p>

                <p className="mt-1 text-sm font-medium">
                  {(() => {
                    const days = getContractDaysRemaining(
                      mentorship?.contractDeadline ?? null,
                    );

                    if (days === null) return "—";
                    if (days < 0) return `Vencido há ${Math.abs(days)} dias`;
                    if (days === 0) return "Vence hoje";

                    return `${days} dias restantes`;
                  })()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Cronograma</p>
                <p className="mt-1 text-sm font-medium">
                  {mentorship?.schedule
                    ? `${formatDate(mentorship.schedule.from)} até ${formatDate(mentorship.schedule.to)}`
                    : "—"}
                </p>
              </div>
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

            <div
              className="w-full overflow-x-auto"
              role="region"
              aria-label="Tabela de sessões com rolagem horizontal"
              tabIndex={0}
            >
              <table className="min-w-[1650px] w-full text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="whitespace-nowrap px-5 py-3 font-medium">
                      Sessão
                    </th>
                    <th className="whitespace-nowrap px-5 py-3 font-medium">
                      Consultor
                    </th>
                    <th className="whitespace-nowrap px-5 py-3 font-medium">
                      Data prevista
                    </th>
                    <th className="whitespace-nowrap px-5 py-3 font-medium">
                      Data realizada
                    </th>
                    <th className="whitespace-nowrap px-5 py-3 font-medium">
                      Prazo limite
                    </th>
                    <th className="whitespace-nowrap px-5 py-3 font-medium">
                      Status
                    </th>
                    <th className="whitespace-nowrap px-5 py-3 font-medium">
                      CH prevista
                    </th>
                    <th className="whitespace-nowrap px-5 py-3 font-medium">
                      CH realizada
                    </th>
                    <th className="whitespace-nowrap px-5 py-3 font-medium">
                      Reagendamento
                    </th>
                    <th className="whitespace-nowrap px-5 py-3 font-medium">
                      Realização
                    </th>
                    <th className="whitespace-nowrap px-5 py-3 font-medium">
                      Acompanhamento
                    </th>
                    <th className="whitespace-nowrap px-5 py-3 text-center font-medium">
                      Comentário
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={12}
                        className="px-5 py-8 text-center text-muted-foreground"
                      >
                        Carregando sessões...
                      </td>
                    </tr>
                  ) : sessions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={12}
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
                        <td className="whitespace-nowrap px-5 py-4 font-medium">
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

                        <td className="whitespace-nowrap px-5 py-4">
                          {formatDate(session.deadline)}
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex whitespace-nowrap rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                            {session.status ?? "—"}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          {formatHours(session.plannedHours)}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          {formatHours(session.completedHours)}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          {session.rescheduled ?? "—"}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          {session.realization ?? "—"}
                        </td>

                        <td className="px-5 py-4">
                          {session.monitoring.join(", ") || "—"}
                        </td>

                        <td className="px-5 py-4 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => openCommentDialog(session)}
                            aria-label={`Comentar a sessão ${session.name}`}
                            title="Mande um comentário sobre a sessão, ele será visível para o gestor e monitoramento do acompanhamento."
                            className="transition-colors hover:bg-muted"
                          >
                            <MessageSquare className="size-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <Dialog
            open={commentSessionId !== null}
            onOpenChange={(open) => {
              if (!open) {
                setCommentSessionId(null);
                setCommentDraft("");
              }
            }}
          >
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Comentário da sessão</DialogTitle>

                <DialogDescription>
                  Mande um comentário sobre a sessão de mentoria, ele será
                  visível para o gestor e monitoramento do acompanhamento.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-2">
                <p className="text-sm font-medium">
                  {sessions.find(
                    (session) => session.mondaySubitemId === commentSessionId,
                  )?.name ?? "Sessão"}
                </p>

                <Textarea
                  value={commentDraft}
                  onChange={(event) => setCommentDraft(event.target.value)}
                  placeholder="Escreva seu comentário..."
                  rows={5}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setCommentSessionId(null);
                    setCommentDraft("");
                  }}
                >
                  Cancelar
                </Button>

                <Button type="button" disabled>
                  Salvar comentário
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}
