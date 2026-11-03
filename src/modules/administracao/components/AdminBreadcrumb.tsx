import { Fragment } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  demoCompanies,
  demoPeople,
  useAdminTrails,
} from "../lib/development-demo";

type Crumb = { label: string; to: string };

export function AdminBreadcrumb() {
  const demoTrails = useAdminTrails();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const parts = pathname.split("/").filter(Boolean);
  const crumbs: Crumb[] = [{ label: "Administração", to: "/mentor" }];
  const page = parts[1];
  if (pathname === "/informacoes-pessoais") {
    crumbs.push({
      label: "Informações pessoais",
      to: pathname + "?modulo=administracao",
    });
  } else if (!page) {
    crumbs.push({ label: "Dashboard", to: "/mentor" });
  } else if (page === "mentorados") {
    crumbs.push({ label: "Mentorados", to: "/mentor/mentorados" });
    const person = demoPeople.find((item) => item.id === parts[2]);
    if (parts[2])
      crumbs.push({
        label: person?.name ?? "Mentorado não encontrado",
        to: `/mentor/mentorados/${parts[2]}`,
      });
    if (parts[3] === "trilhas" && parts[4]) {
      const trail = demoTrails.find(
        (item) => item.id === parts[4] && item.personId === person?.id,
      );
      crumbs.push({
        label: trail?.name ?? "Trilha não encontrada",
        to: pathname,
      });
      const section = params.get("secao");
      if (
        trail &&
        section &&
        [
          "Assessments",
          "Jornada",
          "PDI",
          "Sessões",
          "Documentos",
          "Anotações",
        ].includes(section)
      )
        crumbs.push({ label: section, to: pathname + "?" + params.toString() });
    }
  } else if (page === "empresas") {
    crumbs.push({ label: "Empresas", to: "/mentor/empresas" });
    if (parts[2])
      crumbs.push({
        label:
          demoCompanies.find((item) => item.id === parts[2])?.name ??
          "Empresa não encontrada",
        to: pathname,
      });
  } else if (page === "usuarios") {
    const person = demoPeople.find((item) => item.id === parts[2]);
    const company = demoCompanies.find(
      (item) =>
        item.id === params.get("empresa") && item.id === person?.companyId,
    );
    if (company) {
      crumbs.push(
        { label: "Empresas", to: "/mentor/empresas" },
        { label: company.name, to: `/mentor/empresas/${company.id}` },
      );
    } else crumbs.push({ label: "Usuários", to: "/mentor/usuarios" });
    if (parts[2])
      crumbs.push({
        label: person?.name ?? "Usuário não encontrado",
        to: pathname + "?" + params.toString(),
      });
  } else {
    const labels: Record<string, string> = {
      trilhas: "Trilhas",
      "banco-de-acoes": "Banco de Ações",
      "ferramentas-de-avaliacao": "Ferramentas de Avaliação",
      configuracoes: "Configurações",
    };
    crumbs.push({ label: labels[page] ?? "Página", to: pathname });
  }
  return (
    <Breadcrumb
      aria-label="Navegação estrutural"
      className="border-b border-border bg-muted/30 px-6 py-3 md:px-8"
    >
      <BreadcrumbList className="gap-2 text-sm sm:gap-3">
        {crumbs.map((crumb, index) => (
          <Fragment key={`${index}-${crumb.to}`}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem className="min-w-0 max-w-full">
              {index === crumbs.length - 1 ? (
                <BreadcrumbPage className="break-words font-medium">
                  {crumb.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  asChild
                  className="rounded-sm hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Link to={crumb.to}>{crumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
