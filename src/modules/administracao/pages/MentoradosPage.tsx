import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ManagementShell, EmptySection } from "../components/ManagementShell";
import {
  demoCompanies,
  demoPeople,
  useAdminTrails,
  companyName,
} from "../lib/development-demo";

export default function MentoradosPage() {
  const demoTrails = useAdminTrails();
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState("");
  const people = demoPeople.filter(
    (person) =>
      (!company || person.companyId === company) &&
      `${person.name} ${person.email} ${companyName(person.companyId)}`
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase()),
  );
  return (
    <ManagementShell
      title="Mentorados"
      description="Selecione uma pessoa para acessar suas trilhas e trabalhar no desenvolvimento."
    >
      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-64 flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            aria-label="Buscar mentorados"
            placeholder="Buscar por nome, e-mail ou empresa"
            className="pl-9"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <select
          aria-label="Filtrar por empresa"
          className="rounded-md border border-input bg-background px-3 text-sm"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
        >
          <option value="">Todas as empresas</option>
          {demoCompanies.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {people.length} mentorado(s)
      </p>
      <div className="space-y-3">
        {people.map((person) => {
          const trails = demoTrails.filter(
            (trail) => trail.personId === person.id,
          );
          return (
            <article
              key={person.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-border bg-card p-5"
            >
              <div>
                <h2 className="font-semibold">{person.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {person.email} · {companyName(person.companyId)}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {trails.length} trilha(s) ·{" "}
                  {trails.filter((trail) => trail.status === "Ativa").length}{" "}
                  ativa(s)
                </p>
              </div>
              <Link
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
                to={`/mentor/mentorados/${person.id}`}
              >
                Abrir acompanhamento
                <ArrowRight className="size-4" />
              </Link>
            </article>
          );
        })}
        {!people.length && (
          <EmptySection>
            Nenhum mentorado encontrado. Ajuste a busca ou o filtro.
          </EmptySection>
        )}
      </div>
    </ManagementShell>
  );
}
