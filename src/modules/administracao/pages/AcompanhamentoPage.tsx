import { useEvaluationTools } from "@/modules/mentorias/assessment/evaluation-tools";
import { OwnTrailEditor } from "../components/OwnTrailEditor";
import { LuisTrailContent } from "../components/LuisTrailContent";
import { TrailStatusBadge } from "@/shared/components/TrailStatusBadge";
import { currentEnrollmentCount } from "../lib/development-demo";
import { useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ManagementShell, EmptySection } from "../components/ManagementShell";
import {
  demoPeople,
  useAdminTrails,
  companyName,
} from "../lib/development-demo";

const sections = [
  "Assessments",
  "Jornada",
  "PDI",
  "Sessões",
  "Documentos",
  "Anotações",
];
export default function AcompanhamentoPage() {
  const demoTools = useEvaluationTools();
  const demoTrails = useAdminTrails();
  const { personId, trailId } = useParams();
  const [params] = useSearchParams();
  const [trailSearch, setTrailSearch] = useState("");
  const person = demoPeople.find((item) => item.id === personId);
  const trails = demoTrails.filter((item) => item.personId === personId);
  const trail = trails.find((item) => item.id === trailId);
  const section = sections.includes(params.get("secao") ?? "")
    ? params.get("secao")!
    : "Assessments";
  const [tool, setTool] = useState(demoTools[0]!.id);
  const [associations, setAssociations] = useState<
    { id: string; trailId: string; name: string }[]
  >([]);
  const [dialog, setDialog] = useState(false);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<{ trailId: string; text: string }[]>([]);
  if (!person)
    return (
      <ManagementShell
        title="Mentorado não encontrado"
        description="Confira o endereço ou volte à listagem."
      >
        <Link to="/mentor/mentorados">Voltar aos mentorados</Link>
      </ManagementShell>
    );
  if (!trailId && params.get("trilha"))
    return (
      <Navigate
        replace
        to={`/mentor/mentorados/${person.id}/trilhas/${encodeURIComponent(params.get("trilha")!)}?secao=${encodeURIComponent(section)}`}
      />
    );
  return (
    <ManagementShell
      title={trail?.name ?? person.name}
      description={`${person.name} · ${companyName(person.companyId)} · ${person.email}`}
    >
      <Link to="/mentor/mentorados" className="text-sm text-primary">
        ← Mentorados
      </Link>
      {!trailId && (
        <>
          <h2 className="label-caps text-lg">Trilhas do mentorado</h2>
          <Input
            aria-label="Buscar trilhas do mentorado"
            value={trailSearch}
            onChange={(event) => setTrailSearch(event.target.value)}
            placeholder="Buscar por trilha ou situação"
          />
          <div className="space-y-3">
            {trails
              .filter((item) =>
                `${item.name} ${item.status === "Ativa" ? "Ativo" : "Inativo"} ${item.displayId}`
                  .toLocaleLowerCase()
                  .includes(trailSearch.toLocaleLowerCase()),
              )
              .map((item) => (
                <article
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-border bg-card p-5"
                >
                  <img
                    src={item.image}
                    alt={`Capa da trilha ${item.name}`}
                    className="h-24 w-16 rounded-md object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="mt-2 text-xs text-muted-foreground">
                      ID {item.displayId} · {currentEnrollmentCount(item.id)}{" "}
                      matrícula(s)
                      <span className="ml-2">
                        <TrailStatusBadge active={item.status === "Ativa"} />
                      </span>
                    </p>
                  </div>
                  <Link
                    className="text-sm text-primary"
                    to={`/mentor/mentorados/${person.id}/trilhas/${item.id}`}
                  >
                    Abrir trilha<span className="sr-only"> {item.name}</span>
                  </Link>
                </article>
              ))}
          </div>
        </>
      )}
      {trailId && (
        <Link
          className="text-sm text-primary"
          to={`/mentor/mentorados/${person.id}`}
        >
          ← Trilhas de {person.name}
        </Link>
      )}
      {!trail ? (
        <EmptySection>
          {trailId
            ? "Trilha não encontrada para este mentorado."
            : "Selecione a trilha que deseja consultar."}
        </EmptySection>
      ) : (
        <section className="space-y-5 rounded-md border border-border bg-card p-5">
          <div>
            <h2 className="text-lg font-semibold">{trail.name}</h2>
            <div className="mt-3 flex items-center gap-4">
              <img
                src={trail.image}
                alt={`Capa da trilha ${trail.name}`}
                className="h-24 w-16 rounded-md object-cover"
              />
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  ID {trail.displayId} · {currentEnrollmentCount(trail.id)}{" "}
                  matrícula(s) atuais
                </p>
                <TrailStatusBadge active={trail.status === "Ativa"} />
              </div>
            </div>
          </div>
          {trail.ownTrailId && (
            <OwnTrailEditor key={trail.id} id={trail.ownTrailId} />
          )}
          <nav
            aria-label="Seções do acompanhamento"
            className="flex flex-wrap gap-2 border-b border-border pb-4"
          >
            {sections.map((item) => (
              <Link
                key={item}
                aria-current={section === item ? "page" : undefined}
                className={`rounded-md px-3 py-2 text-sm ${section === item ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                to={`?secao=${encodeURIComponent(item)}`}
              >
                {item}
              </Link>
            ))}
          </nav>
          {trail.ownTrailId ? (
            trail.ownTrailId === 601 ? (
              <LuisTrailContent
                section={section}
                editable={trail.status === "Ativa"}
              />
            ) : (
              <EmptySection>
                Nenhuma informação registrada neste ciclo.
              </EmptySection>
            )
          ) : (
            <>
              {section === "Assessments" && (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-semibold">Aplicações nesta trilha</h3>
                    <Button
                      disabled={trail.status !== "Ativa"}
                      onClick={() => setDialog(true)}
                    >
                      Associar assessment
                    </Button>
                  </div>
                  {dialog && (
                    <form
                      className="space-y-3 rounded-md border border-border p-4"
                      onSubmit={(event) => {
                        event.preventDefault();
                        setAssociations((items) => [
                          ...items,
                          {
                            id: crypto.randomUUID(),
                            trailId: trail.id,
                            name: demoTools.find((item) => item.id === tool)!
                              .name,
                          },
                        ]);
                        setDialog(false);
                      }}
                    >
                      <label className="block text-sm">
                        Ferramenta disponível para a empresa
                        <select
                          value={tool}
                          onChange={(event) => setTool(event.target.value)}
                          className="mt-2 block w-full rounded-md border border-input bg-background p-2"
                        >
                          {demoTools
                            .filter((item) => item.active)
                            .map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                        </select>
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Selecione a ferramenta para esta trilha.
                      </p>
                      <div className="flex gap-2">
                        <Button type="submit">Confirmar associação</Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setDialog(false)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  )}
                  {associations
                    .filter((item) => item.trailId === trail.id)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="rounded-md border border-border p-4"
                      >
                        <p>{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Aguardando resultado da A3
                        </p>
                      </div>
                    ))}
                  {!associations.some((item) => item.trailId === trail.id) && (
                    <EmptySection>
                      Nenhuma aplicação registrada nesta trilha.
                    </EmptySection>
                  )}
                </>
              )}
              {section === "Sessões" && (
                <EmptySection>
                  Nenhuma sessão sincronizada nesta trilha.
                </EmptySection>
              )}
              {section === "Jornada" && (
                <EmptySection>
                  Nenhuma etapa cadastrada nesta trilha.
                </EmptySection>
              )}
              {section === "PDI" && (
                <EmptySection>
                  Nenhuma ação cadastrada nesta trilha.
                </EmptySection>
              )}
              {section === "Documentos" && (
                <EmptySection>Nenhum documento associado.</EmptySection>
              )}
              {section === "Anotações" && (
                <>
                  <p className="text-xs text-muted-foreground">
                    Anotações privadas.
                  </p>
                  <form
                    className="flex gap-2"
                    onSubmit={(event) => {
                      event.preventDefault();
                      if (note.trim()) {
                        setNotes((items) => [
                          ...items,
                          { trailId: trail.id, text: note.trim() },
                        ]);
                        setNote("");
                      }
                    }}
                  >
                    <Input
                      aria-label="Nova anotação"
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      placeholder="Registrar anotação privada"
                      required
                    />
                    <Button type="submit">Adicionar</Button>
                  </form>
                  {notes
                    .filter((item) => item.trailId === trail.id)
                    .map((item, i) => (
                      <p
                        key={i}
                        className="rounded-md border border-border p-4 text-sm"
                      >
                        {item.text}
                      </p>
                    ))}
                </>
              )}
            </>
          )}
        </section>
      )}
    </ManagementShell>
  );
}
