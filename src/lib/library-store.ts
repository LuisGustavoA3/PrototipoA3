import { useSyncExternalStore } from "react";

export type LibraryContentType =
  | "Artigo"
  | "Capítulo de livro"
  | "Vídeo"
  | "Infográfico"
  | "Ferramenta";

export type LibraryContent = {
  id: string;
  name: string;
  type: LibraryContentType;
  topic: string;
  axis: "Negócio" | "Equipe" | "Mercado" | "Indivíduo";
  reference: string;
  public: boolean;
  active: boolean;
  finished: boolean;
  finishedAt?: string;
};

const businessContents: LibraryContent[] = [
  {
    id: "negocio-01",
    name: "Ambidestria Organizacional",
    type: "Artigo",
    topic: "Posicionamento Estratégico",
    axis: "Negócio",
    reference: "A3 Digital",
    public: true,
    active: true,
    finished: true,
    finishedAt: "2026-09-03T10:00:00",
  },
  {
    id: "negocio-02",
    name: "Sua parte no quadro geral",
    type: "Capítulo de livro",
    topic: "Posicionamento Estratégico",
    axis: "Negócio",
    reference: "Biblioteca A3",
    public: true,
    active: true,
    finished: false,
  },
  {
    id: "negocio-03",
    name: "Dirigindo em duas pistas",
    type: "Capítulo de livro",
    topic: "Posicionamento Estratégico",
    axis: "Negócio",
    reference: "Biblioteca A3",
    public: true,
    active: true,
    finished: true,
    finishedAt: "2026-08-28T15:30:00",
  },
  {
    id: "negocio-04",
    name: "Pensamento sistêmico nas decisões",
    type: "Vídeo",
    topic: "Visão Integrada & Sistêmica",
    axis: "Negócio",
    reference: "A3 Digital Academy",
    public: true,
    active: true,
    finished: false,
  },
  {
    id: "negocio-05",
    name: "Mapa de stakeholders",
    type: "Ferramenta",
    topic: "Visão Integrada & Sistêmica",
    axis: "Negócio",
    reference: "A3 Digital",
    public: true,
    active: true,
    finished: true,
    finishedAt: "2026-08-22T09:15:00",
  },
  {
    id: "negocio-06",
    name: "Cadeia de valor em foco",
    type: "Infográfico",
    topic: "Visão Integrada & Sistêmica",
    axis: "Negócio",
    reference: "A3 Digital",
    public: true,
    active: true,
    finished: false,
  },
  {
    id: "negocio-07",
    name: "Escolhas que geram impacto",
    type: "Artigo",
    topic: "Tomada de Decisão",
    axis: "Negócio",
    reference: "A3 Digital",
    public: true,
    active: true,
    finished: true,
    finishedAt: "2026-08-18T11:45:00",
  },
  {
    id: "negocio-08",
    name: "Critérios para decisões melhores",
    type: "Ferramenta",
    topic: "Tomada de Decisão",
    axis: "Negócio",
    reference: "Biblioteca A3",
    public: true,
    active: true,
    finished: false,
  },
  {
    id: "negocio-09",
    name: "Indicadores que contam histórias",
    type: "Vídeo",
    topic: "Gestão por Resultados",
    axis: "Negócio",
    reference: "A3 Digital Academy",
    public: true,
    active: true,
    finished: false,
  },
  {
    id: "negocio-10",
    name: "Da meta ao resultado",
    type: "Artigo",
    topic: "Gestão por Resultados",
    axis: "Negócio",
    reference: "A3 Digital",
    public: true,
    active: true,
    finished: false,
  },
];

const otherAxisContents: LibraryContent[] = [
  ...Array.from({ length: 30 }, (_, index) => ({
    id: `biblioteca-${index + 1}`,
    name: `Conteúdo de desenvolvimento ${index + 1}`,
    type: "Artigo" as const,
    topic: index % 2 === 0 ? "Desenvolvimento profissional" : "Aprendizado contínuo",
    axis: ["Equipe", "Mercado", "Indivíduo"][index % 3] as LibraryContent["axis"],
    reference: "Biblioteca A3",
    public: true,
    active: true,
    finished: index < 5,
  })),
];

const STORAGE_KEY = "a3:library-content-status";
let contents = [...businessContents, ...otherAxisContents];
let hasReadStoredStatus = false;
const listeners = new Set<() => void>();

function readStoredStatus() {
  if (typeof window === "undefined" || hasReadStoredStatus) return;

  hasReadStoredStatus = true;
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as Record<
      string,
      { finished: boolean; finishedAt?: string }
    >;
    contents = contents.map((content) =>
      stored[content.id] ? { ...content, ...stored[content.id] } : content,
    );
  } catch {
    // Use the mock defaults when local storage is unavailable or invalid.
  }
}

function notify() {
  listeners.forEach((listener) => listener());
}

export function subscribeLibrary(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getLibraryContents() {
  readStoredStatus();
  return contents;
}

export function useLibraryContents() {
  return useSyncExternalStore(
    subscribeLibrary,
    getLibraryContents,
    () => contents,
  );
}

export function setLibraryContentFinished(id: string, finished: boolean) {
  const finishedAt = finished ? new Date().toISOString() : undefined;
  contents = contents.map((content) =>
    content.id === id
      ? {
          ...content,
          finished,
          ...(finishedAt ? { finishedAt } : {}),
        }
      : content,
  );

  if (typeof window !== "undefined") {
    const current = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as Record<
      string,
      unknown
    >;
    current[id] = { finished, finishedAt };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  }
  notify();
}
