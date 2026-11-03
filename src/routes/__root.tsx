import { useEffect } from "react";
import {
  Link,
  Outlet,
  ScrollRestoration,
  useLocation,
  useMatches,
  useRouteError,
} from "react-router-dom";
import { recordNavigation } from "@/lib/navigation-history";
import { reportLovableError } from "@/lib/lovable-error-reporting";

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
      <h1 className="text-7xl">404</h1>
      <p>Página não encontrada.</p>
      <Link to="/">Voltar ao início</Link>
    </main>
  );
}

export function ErrorPage() {
  const error = useRouteError();
  useEffect(() => {
    reportLovableError(error, { boundary: "react_router_root" });
  }, [error]);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
      <h1>Não foi possível carregar a página.</h1>
      <button onClick={() => window.location.reload()}>Tentar novamente</button>
      <Link to="/">Voltar ao início</Link>
    </main>
  );
}

export default function RootLayout() {
  const location = useLocation();
  const matches = useMatches();
  const handle = matches.at(-1)?.handle as
    | {
        title?: string;
        meta?: { name?: string; property?: string; content?: string }[];
      }
    | undefined;
  const title = handle?.title ?? "A3 Digital";
  const metadata = handle?.meta;
  useEffect(() => {
    recordNavigation(location.pathname);
  }, [location.pathname]);
  useEffect(() => {
    document.title = title;
  }, [title]);
  useEffect(() => {
    const cleanups: (() => void)[] = [];
    for (const entry of metadata ?? []) {
      const attribute = entry.name ? "name" : "property";
      const key = entry.name ?? entry.property;
      if (!key || entry.content === undefined) continue;
      const existing = Array.from(document.head.querySelectorAll("meta")).find(
        (node) => node.getAttribute(attribute) === key,
      );
      const node = existing ?? document.createElement("meta");
      const previous = node.getAttribute("content");
      node.setAttribute(attribute, key);
      node.setAttribute("content", entry.content);
      if (!existing) document.head.append(node);
      cleanups.push(() => {
        if (!existing) node.remove();
        else if (previous === null) node.removeAttribute("content");
        else node.setAttribute("content", previous);
      });
    }
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [metadata]);
  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  );
}
