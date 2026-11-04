import { User } from "lucide-react";
import { useProfilePhoto } from "@/shared/informacoes-pessoais/profile-photo-store";
import { CompanyToolsEditor } from "../components/CompanyToolsEditor";
import { CompanySessions } from "../components/CompanySessions";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { ManagementShell, EmptySection } from "../components/ManagementShell";
import {
  demoCompanies,
  demoPeople,
  useAdminTrails,
} from "../lib/development-demo";

export default function EmpresaPage() {
  const demoTrails = useAdminTrails();
  const profilePhoto = useProfilePhoto();
  const { companyId } = useParams();
  const [search, setSearch] = useState("");
  const company = demoCompanies.find((item) => item.id === companyId);
  if (!company)
    return (
      <ManagementShell
        title="Empresa não encontrada"
        description="Confira o endereço ou retorne à listagem."
      >
        {null}
      </ManagementShell>
    );
  const people = demoPeople.filter((person) => person.companyId === company.id);
  const trails = demoTrails.filter((trail) =>
    people.some((person) => person.id === trail.personId),
  );
  const used = new Set(trails.map((trail) => trail.personId)).size;
  const filtered = people.filter((person) =>
    `${person.name} ${person.email}`
      .toLocaleLowerCase()
      .includes(search.toLocaleLowerCase()),
  );
  return (
    <ManagementShell
      title={company.name}
      description="Usuários associados e utilização das trilhas contratadas."
    >
      <section className="rounded-md border border-border bg-card p-5">
        <h2 className="font-semibold">Trilhas contratadas</h2>
        <p className="mt-3 text-2xl">
          {company.contracted == null
            ? "Não informado"
            : `${used}/${company.contracted} utilizadas`}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {company.contracted == null
            ? ""
            : `${Math.max(0, company.contracted - used)} disponíveis.`}
          Conclusões não liberam vagas para reutilização.
        </p>
      </section>
      <CompanyToolsEditor key={company.id} companyId={company.id} />
      {company.id === "testes" && <CompanySessions companyId={company.id} />}
      <h2 className="label-caps text-lg">Usuários associados</h2>
      <Input
        aria-label="Buscar usuários da empresa"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Buscar por nome ou e-mail"
      />
      <div className="space-y-3">
        {filtered.map((person) => (
          <article
            key={person.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-border bg-card p-5"
          >
            <div className="flex items-center gap-3">
              {(person.id === "luis-gustavo" ? profilePhoto : person.photo) ? (
                <img
                  src={
                    (person.id === "luis-gustavo"
                      ? profilePhoto
                      : person.photo)!
                  }
                  alt={`Foto de ${person.name}`}
                  className="size-14 shrink-0 rounded-full border border-border object-cover"
                />
              ) : (
                <span
                  className="flex size-14 shrink-0 items-center justify-center rounded-full bg-muted"
                  aria-label={`Sem foto de ${person.name}`}
                >
                  <User className="size-7 text-muted-foreground" />
                </span>
              )}
              <div>
                <h3 className="font-semibold">{person.name}</h3>
                <p className="text-sm text-muted-foreground">{person.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-primary">
              <Link to={`/mentor/usuarios/${person.id}?empresa=${company.id}`}>
                Gerenciar usuário
              </Link>
              <Link to={`/mentor/mentorados/${person.id}`}>
                Abrir acompanhamento
              </Link>
            </div>
          </article>
        ))}
        {!filtered.length && (
          <EmptySection>Nenhum usuário encontrado.</EmptySection>
        )}
      </div>
    </ManagementShell>
  );
}
