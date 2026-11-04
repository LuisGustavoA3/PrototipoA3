import { useBankActions } from "@/modules/mentorias/pdi/pdi-store";
import { User } from "lucide-react";
import { TrailStatusBadge } from "@/shared/components/TrailStatusBadge";
import { currentEnrollmentCount } from "../lib/development-demo";
import { InstitutionSettingsForms } from "../components/InstitutionSettingsForms";
import { useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { ManagementShell, EmptySection } from "../components/ManagementShell";
import {
  demoCompanies,
  demoPeople,
  useAdminTrails,
  companyName,
} from "../lib/development-demo";

export function TrilhasPage() {
  const demoTrails = useAdminTrails();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const trails = demoTrails.filter(
    (trail) =>
      `${trail.displayId} ${trail.name}`
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase()) &&
      (!status || (trail.status === "Ativa" ? "ativo" : "inativo") === status),
  );
  return (
    <ManagementShell
      title="Trilhas"
      description="Trilhas individuais de desenvolvimento e suas matrículas."
    >
      <div className="flex flex-wrap gap-3">
        <Input
          className="min-w-56 flex-1"
          aria-label="Buscar trilhas"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por nome ou ID"
        />
        <select
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          aria-label="Filtrar status das trilhas"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="">Todos os status</option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>
      </div>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {trails.length} trilha(s) encontrada(s)
      </p>
      <div className="overflow-x-auto rounded-md border border-border bg-card">
        <table className="w-full min-w-[700px] text-left text-sm">
          <caption className="sr-only">Trilhas individuais</caption>
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {[
                "ID",
                "Imagem",
                "Título",
                "Matrículas atuais",
                "Status",
                "Ação",
              ].map((label) => (
                <th key={label} scope="col" className="px-4 py-3 font-medium">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trails.map((trail) => (
              <tr
                key={trail.id}
                className="border-b border-border last:border-0"
              >
                <td className="px-4 py-4 text-muted-foreground">
                  {trail.displayId}
                </td>
                <td className="px-4 py-4">
                  <img
                    src={trail.image}
                    alt={`Capa da trilha ${trail.name}`}
                    className="h-28 w-20 rounded-md object-cover"
                    loading="lazy"
                  />
                </td>
                <td className="px-4 py-4 font-medium">{trail.name}</td>
                <td className="px-4 py-4 tabular-nums">
                  {currentEnrollmentCount(trail.id)}
                </td>
                <td className="px-4 py-4">
                  <TrailStatusBadge active={trail.status === "Ativa"} />
                </td>
                <td className="px-4 py-4">
                  <Link
                    className="whitespace-nowrap text-primary hover:underline"
                    to={`/mentor/mentorados/${trail.personId}/trilhas/${trail.id}`}
                  >
                    Abrir trilha<span className="sr-only"> {trail.name}</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!trails.length && (
        <EmptySection>Nenhuma trilha encontrada.</EmptySection>
      )}
    </ManagementShell>
  );
}

export function EmpresasPage() {
  const demoTrails = useAdminTrails();
  const [params] = useSearchParams();
  const [search, setSearch] = useState("");
  const companies = demoCompanies.filter((item) =>
    item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
  );
  if (params.get("empresa"))
    return (
      <Navigate
        replace
        to={`/mentor/empresas/${encodeURIComponent(params.get("empresa")!)}`}
      />
    );
  return (
    <ManagementShell
      title="Empresas"
      description="Consulte as empresas, seus usuários e as trilhas contratadas."
    >
      <Input
        aria-label="Buscar empresas"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Buscar empresa"
      />
      <div className="space-y-3">
        {companies.map((company) => {
          const people = demoPeople.filter(
            (person) => person.companyId === company.id,
          );
          const used = new Set(
            demoTrails
              .filter((trail) =>
                people.some((person) => person.id === trail.personId),
              )
              .map((trail) => trail.personId),
          ).size;
          return (
            <article
              key={company.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-border bg-card p-5"
            >
              <div>
                <h2 className="font-semibold">{company.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {people.length} usuários ·{" "}
                  {company.contracted == null
                    ? "Limite de trilhas não informado"
                    : `${used}/${company.contracted} trilhas utilizadas`}
                </p>
              </div>
              <Link
                className="text-sm text-primary"
                to={`/mentor/empresas/${company.id}`}
              >
                Abrir empresa<span className="sr-only"> {company.name}</span>
              </Link>
            </article>
          );
        })}
        {!companies.length && (
          <EmptySection>Nenhuma empresa encontrada.</EmptySection>
        )}
      </div>
    </ManagementShell>
  );
}

export function UsuariosPage() {
  const [params] = useSearchParams();
  const [search, setSearch] = useState("");
  if (params.get("usuario"))
    return (
      <Navigate
        replace
        to={`/mentor/usuarios/${encodeURIComponent(params.get("usuario")!)}${params.get("empresa") ? `?empresa=${encodeURIComponent(params.get("empresa")!)}` : ""}`}
      />
    );
  const people = demoPeople.filter((item) =>
    `${item.displayId} ${item.name} ${item.email}`
      .toLocaleLowerCase()
      .includes(search.toLocaleLowerCase()),
  );
  return (
    <ManagementShell
      title="Usuários"
      description="Dados de conta e acessos separados do desenvolvimento."
    >
      <Input
        aria-label="Buscar usuários"
        placeholder="Buscar por nome, e-mail ou ID"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <div className="overflow-x-auto rounded-md border border-border bg-card">
        <table className="w-full min-w-[900px] text-left text-sm">
          <caption className="sr-only">Usuários</caption>
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {[
                "ID",
                "Foto",
                "Nome",
                "E-mail",
                "Empresa",
                "Perfil",
                "Ação",
              ].map((label) => (
                <th scope="col" key={label} className="px-4 py-3 font-medium">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {people.map((item) => (
              <tr
                key={item.id}
                className="border-b border-border last:border-0"
              >
                <td className="px-4 py-4 text-muted-foreground">
                  {item.displayId}
                </td>
                <td className="px-4 py-4">
                  {item.photo ? (
                    <img
                      src={item.photo}
                      alt={`Foto de ${item.name}`}
                      className="size-12 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      role="img"
                      aria-label={`Sem foto de ${item.name}`}
                      className="flex size-12 items-center justify-center rounded-full border border-border bg-muted"
                    >
                      <User
                        aria-hidden="true"
                        className="size-6 text-muted-foreground"
                      />
                    </span>
                  )}
                </td>
                <th scope="row" className="px-4 py-4 font-semibold">
                  {item.name}
                </th>
                <td className="px-4 py-4">{item.email}</td>
                <td className="px-4 py-4">{companyName(item.companyId)}</td>
                <td className="px-4 py-4">{item.role}</td>
                <td className="px-4 py-4">
                  <Link
                    className="whitespace-nowrap text-primary hover:underline"
                    to={`/mentor/usuarios/${item.id}`}
                  >
                    Gerenciar usuário
                    <span className="sr-only"> {item.name}</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!people.length && (
        <EmptySection>Nenhum usuário encontrado.</EmptySection>
      )}
    </ManagementShell>
  );
}

export { default as FerramentasAvaliacaoPage } from "./EvaluationToolsPage";

export function BancoAcoesPage() {
  const actions = useBankActions();
  const trails = useAdminTrails();
  const [search, setSearch] = useState("");
  const filtered = actions.filter((action) =>
    [
      action.name,
      action.competency,
      action.details,
      action.evidence,
      action.author,
      demoPeople.find((person) => person.id === action.personId)?.name ?? "",
    ].some((value) =>
      value.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()),
    ),
  );
  return (
    <ManagementShell
      title="Banco de Ações"
      description="Repositório de cópias das ações criadas nos PDIs, com autoria e origem."
    >
      <Input
        aria-label="Buscar ações no banco"
        placeholder="Buscar por ação, competência, autoria ou mentorado"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <p className="text-sm text-muted-foreground">
        {filtered.length} ação(ões) encontrada(s)
      </p>
      {filtered.length ? (
        <div className="overflow-x-auto rounded-md border border-border bg-card">
          <table className="w-full min-w-[1200px] text-left text-sm">
            <caption className="sr-only">Banco de Ações</caption>
            <thead className="bg-muted/40">
              <tr>
                {[
                  "Competência",
                  "Ação",
                  "Detalhes",
                  "Evidência",
                  "Autoria",
                  "Mentorado",
                  "Empresa",
                  "Trilha de origem",
                  "Criado em",
                ].map((label) => (
                  <th key={label} scope="col" className="px-5 py-3 font-medium">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((action) => {
                const person = demoPeople.find(
                  (item) => item.id === action.personId,
                );
                const trail = trails.find(
                  (item) => item.ownTrailId === action.trailId,
                );
                return (
                  <tr
                    key={action.id}
                    className="border-t border-border align-top"
                  >
                    <td className="px-5 py-4">{action.competency}</td>
                    <th
                      scope="row"
                      className="min-w-56 whitespace-pre-wrap px-5 py-4 font-medium"
                    >
                      {action.name}
                    </th>
                    <td className="min-w-56 whitespace-pre-wrap px-5 py-4">
                      {action.details || "—"}
                    </td>
                    <td className="min-w-56 whitespace-pre-wrap px-5 py-4">
                      {action.evidence || "—"}
                    </td>
                    <td className="px-5 py-4">{action.author}</td>
                    <td className="px-5 py-4">{person?.name ?? "—"}</td>
                    <td className="px-5 py-4">
                      {person ? companyName(person.companyId) : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        className="text-primary hover:underline"
                        to={`/mentor/mentorados/${action.personId}/trilhas/trilha-luis-${action.trailId}?secao=PDI`}
                      >
                        {trail?.name ?? `Trilha ${action.trailId}`}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      {new Date(action.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptySection>Nenhuma ação encontrada no banco.</EmptySection>
      )}
    </ManagementShell>
  );
}

export function ConfiguracoesPage() {
  const [section, setSection] = useState("Contatos e localização");
  return (
    <ManagementShell
      title="Configurações"
      description="Dados institucionais, conteúdo de ajuda e comunicação da A3."
    >
      <nav
        aria-label="Seções de configurações"
        className="flex flex-wrap gap-2"
      >
        {["Contatos e localização", "Ajuda e FAQ", "Notificações"].map(
          (item) => (
            <button
              type="button"
              key={item}
              aria-pressed={section === item}
              onClick={() => setSection(item)}
              className={`rounded-md px-4 py-2 text-sm ${section === item ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              {item}
            </button>
          ),
        )}
      </nav>
      <section className="space-y-4 rounded-md border border-border bg-card p-5">
        <h2 className="text-lg font-semibold">{section}</h2>
        <InstitutionSettingsForms key={section} section={section} />
      </section>
    </ManagementShell>
  );
}
