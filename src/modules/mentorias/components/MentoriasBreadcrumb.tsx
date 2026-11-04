import { useSharedFiles } from "../arquivos-compartilhados/shared-files-store";
import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getLibraryContent } from "../biblioteca";

type Crumb = { label: string; to?: string };
export function MentoriasBreadcrumb() {
  const { pathname } = useLocation();
  const files = useSharedFiles();
  const crumbs: Crumb[] = [{ label: "Mentorias", to: "/dashboard" }];
  const development: Record<string, string> = {
    "/meu-assessment": "Meu Assessment",
    "/jornada-de-desenvolvimento": "Jornada de Desenvolvimento",
    "/plano-de-acao": "Plano de Ação (PDI)",
    "/arquivos-compartilhados": "Arquivos Compartilhados",
  };
  const help: Record<string, string> = {
    "/faq": "FAQ",
    "/assistente": "Assistente",
    "/contatos-localizacao": "Contatos e Localização",
  };
  const axes: Record<string, { label: string; to: string }> = {
    Indivíduo: { label: "Indivíduo", to: "/biblioteca-individuo" },
    Equipe: { label: "Equipe", to: "/biblioteca-equipe" },
    Mercado: { label: "Mercado", to: "/biblioteca-mercado" },
    Negócio: { label: "Negócio", to: "/biblioteca-negocio" },
  };
  if (pathname.startsWith("/arquivos-compartilhados/")) {
    const id = pathname.split("/")[2];
    const file = files.find((item) => item.id === id);
    crumbs.push(
      { label: "Meu Desenvolvimento" },
      { label: "Arquivos Compartilhados", to: "/arquivos-compartilhados" },
      { label: file?.name ?? "Arquivo não disponível" },
    );
  } else if (development[pathname])
    crumbs.push(
      { label: "Meu Desenvolvimento" },
      { label: development[pathname]! },
    );
  else if (help[pathname])
    crumbs.push({ label: "Ajuda" }, { label: help[pathname]! });
  else if (pathname.startsWith("/biblioteca/conteudo/")) {
    const encoded = pathname.slice("/biblioteca/conteudo/".length);
    let id = encoded;
    try {
      id = decodeURIComponent(encoded);
    } catch {
      /* URL inválida: mantém o fallback. */
    }
    const content = getLibraryContent(id);
    crumbs.push({ label: "Biblioteca", to: "/conteudo" });
    if (content && axes[content.axis]) crumbs.push(axes[content.axis]!);
    crumbs.push({ label: content?.name ?? "Conteúdo não encontrado" });
  } else if (pathname.startsWith("/biblioteca-")) {
    crumbs.push({ label: "Biblioteca", to: "/conteudo" });
    const axis = Object.values(axes).find((item) => item.to === pathname);
    crumbs.push({ label: axis?.label ?? "Conteúdos" });
  } else {
    const labels: Record<string, string> = {
      "/dashboard": "Dashboard",
      "/sessoes-mentoria": "Atendimentos de Mentoria",
      "/conteudo": "Biblioteca",
      "/informacoes-pessoais": "Informações Pessoais",
      "/minhas-estatisticas": "Minhas Estatísticas",
      "/avalie-nos": "Avalie-nos",
    };
    crumbs.push({ label: labels[pathname] ?? "Página" });
  }
  return (
    <Breadcrumb
      aria-label="Navegação estrutural"
      className="shrink-0 border-b border-border bg-muted/30 px-6 py-3 md:px-8"
    >
      <BreadcrumbList className="gap-2 text-sm sm:gap-3">
        {crumbs.map((crumb, index) => (
          <Fragment key={`${index}-${crumb.label}`}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem className="min-w-0 max-w-full">
              {index === crumbs.length - 1 ? (
                <BreadcrumbPage className="break-words font-medium">
                  {crumb.label}
                </BreadcrumbPage>
              ) : crumb.to ? (
                <BreadcrumbLink
                  asChild
                  className="rounded-sm hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Link to={crumb.to}>{crumb.label}</Link>
                </BreadcrumbLink>
              ) : (
                <span>{crumb.label}</span>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
