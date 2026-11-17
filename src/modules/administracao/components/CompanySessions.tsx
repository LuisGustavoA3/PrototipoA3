import { useState } from "react";
import { useCompanySessions } from "../lib/use-company-sessions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { companyMentorships } from "@/lib/company-sessions";
import { EmptySection } from "./ManagementShell";

export function CompanySessions({ companyId }: { companyId: string }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const query = useCompanySessions(companyId);
  const people = query.data ? companyMentorships(query.data) : [];
  const statuses = Array.from(
    new Set(
      people.flatMap((person) =>
        person.sessions.map((session) => session.status ?? "Não informado"),
      ),
    ),
  );
  const visible = people.filter(
    (person) =>
      person.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) &&
      (!status ||
        person.sessions.some(
          (session) => (session.status ?? "Não informado") === status,
        )),
  );
  return (
    <section className="space-y-4 rounded-md border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Atendimentos de mentoria</h2>
          <p className="text-sm text-muted-foreground">
            Quadro da empresa no Monday · Consulta por mentorado
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={query.isFetching}
          onClick={() => void query.refetch()}
        >
          {query.isFetching ? "Atualizando…" : "Atualizar sessões"}
        </Button>
      </div>
      {query.data && (
        <p className="text-xs text-muted-foreground">
          Última sincronização:{" "}
          {new Date(query.data.generatedAt).toLocaleString("pt-BR")} ·{" "}
          {people.length} mentorado(s) ·{" "}
          {people.reduce((total, person) => total + person.sessions.length, 0)}{" "}
          sessões
        </p>
      )}
      {query.isError && (
        <p
          role="alert"
          className="rounded-md border border-destructive/30 p-3 text-sm text-destructive"
        >
          Não foi possível atualizar o quadro.{" "}
          {query.data
            ? "Os últimos dados continuam disponíveis."
            : "Verifique a integração com o Monday."}{" "}
          Use Atualizar sessões para tentar novamente.
        </p>
      )}
      {query.isPending && (
        <p role="status" className="text-sm text-muted-foreground">
          Buscando mentorados e sessões…
        </p>
      )}
      {query.data && (
        <>
          <div className="flex flex-wrap gap-3">
            <Input
              className="min-w-48 flex-1"
              aria-label="Buscar mentorado no quadro"
              placeholder="Buscar mentorado"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select
              className="rounded-md border border-input bg-background p-2 text-sm"
              aria-label="Situação das sessões"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="">Todas as situações</option>
              {statuses.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          {visible.map((person) => (
            <details
              key={person.id}
              className="rounded-md border border-border p-4"
            >
              <summary className="cursor-pointer">
                <span className="font-semibold">{person.name}</span>
                <span className="ml-3 text-sm text-muted-foreground">
                  {person.status} · {person.sessions.length} sessões
                </span>
              </summary>
              <p className="my-3 text-xs text-muted-foreground">
                Prazo do contrato: {person.deadline}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-left text-sm">
                  <caption className="sr-only">
                    Sessões de {person.name}
                  </caption>
                  <thead>
                    <tr className="border-b border-border">
                      {[
                        "Sessão",
                        "Consultor",
                        "Data prevista",
                        "Situação",
                        "Data realizada",
                        "Prazo limite",
                        "CH prevista",
                        "CH realizada",
                      ].map((label) => (
                        <th key={label} className="p-2 font-medium">
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {person.sessions
                      .filter(
                        (session) =>
                          !status ||
                          (session.status ?? "Não informado") === status,
                      )
                      .map((session) => (
                        <tr
                          key={session.mondaySubitemId}
                          className="border-b border-border"
                        >
                          <td className="p-2">{session.name}</td>
                          <td className="p-2">
                            {session.consultant.join(", ") || "—"}
                          </td>
                          <td className="p-2">
                            {session.scheduledDate ?? "—"}
                          </td>
                          <td className="p-2">{session.status ?? "—"}</td>
                          <td className="p-2">
                            {session.completedDate ?? "—"}
                          </td>
                          <td className="p-2">{session.deadline ?? "—"}</td>
                          <td className="p-2">
                            {session.plannedHours == null
                              ? "—"
                              : `${session.plannedHours.toLocaleString("pt-BR")} h`}
                          </td>
                          <td className="p-2">
                            {session.completedHours == null
                              ? "—"
                              : `${session.completedHours.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} h`}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!person.sessions.length && (
                <p className="mt-3 text-sm text-muted-foreground">
                  Nenhuma sessão cadastrada no quadro para este mentorado.
                </p>
              )}
            </details>
          ))}
          {!visible.length && (
            <EmptySection>
              Nenhum mentorado encontrado no quadro com os filtros atuais.
            </EmptySection>
          )}
        </>
      )}
    </section>
  );
}
