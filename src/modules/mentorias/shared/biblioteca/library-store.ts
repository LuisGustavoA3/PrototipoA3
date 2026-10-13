import { useSyncExternalStore } from "react";

export type LibraryContentType =
  | "Artigo"
  | "Capítulo de livro"
  | "Vídeo"
  | "Infográfico"
  | "Ferramenta"
  | "Podcast";

export type LibraryAxis = "Negócio" | "Equipe" | "Mercado" | "Indivíduo";

export type LibraryCompetency =
  | "Autoconhecimento"
  | "Capacidade Analítica"
  | "Comunicação"
  | "Foco em Resultados"
  | "Gestão do Tempo"
  | "Inovação e Criatividade"
  | "Liderança e Gestão"
  | "Negociação"
  | "Planejamento e Organização"
  | "Proatividade"
  | "Relacionamento Interpessoal"
  | "Resiliência"
  | "Resolução de Problemas"
  | "Tomada de Decisão"
  | "Visão de Negócio"
  | "Visão Estratégica"
  | "Visão Integrada";
export type LibraryContent = {
  id: string;
  name: string;
  type: LibraryContentType;

  axis: LibraryAxis;
  competency: LibraryCompetency;
  description: string;
  format: "pdf" | "video" | "audio";
  reference: string;
  permitirDownload: boolean;
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
    competency: "Visão Estratégica",
    axis: "Negócio",
    description:
      "Uma introdução prática à ambidestria e às escolhas estratégicas das organizações.",
    format: "pdf",
    reference: "A3 Digital",
    permitirDownload: true,
    public: true,
    active: true,
    finished: true,
    finishedAt: "2026-09-03T10:00:00",
  },
  {
    id: "negocio-02",
    name: "Sua parte no quadro geral",
    type: "Capítulo de livro",
    competency: "Visão Estratégica",
    axis: "Negócio",
    description:
      "Capítulo sobre como reconhecer sua contribuição dentro de uma visão estratégica maior.",
    format: "pdf",
    reference: "Biblioteca A3",
    permitirDownload: false,
    public: true,
    active: true,
    finished: false,
  },
  {
    id: "negocio-03",
    name: "Dirigindo em duas pistas",
    type: "Capítulo de livro",
    competency: "Visão Estratégica",
    axis: "Negócio",
    description:
      "Uma leitura sobre equilibrar a operação atual e a construção do futuro.",
    format: "pdf",
    reference: "Biblioteca A3",
    permitirDownload: false,
    public: true,
    active: true,
    finished: true,
    finishedAt: "2026-08-28T15:30:00",
  },
  {
    id: "negocio-04",
    name: "Pensamento sistêmico nas decisões",
    type: "Vídeo",
    competency: "Visão Integrada",
    axis: "Negócio",
    description:
      "Vídeo mockado para explorar relações e efeitos sistêmicos nas decisões.",
    format: "video",
    reference: "A3 Digital Academy",
    permitirDownload: false,
    public: true,
    active: true,
    finished: false,
  },
  {
    id: "negocio-05",
    name: "Mapa de stakeholders",
    type: "Ferramenta",
    competency: "Visão Integrada",
    axis: "Negócio",
    description:
      "Uma ferramenta para mapear pessoas e grupos impactados por uma decisão.",
    format: "pdf",
    reference: "A3 Digital",
    permitirDownload: true,
    public: true,
    active: true,
    finished: true,
    finishedAt: "2026-08-22T09:15:00",
  },
  {
    id: "negocio-06",
    name: "Cadeia de valor em foco",
    type: "Infográfico",
    competency: "Visão Integrada",
    axis: "Negócio",
    description:
      "Infográfico sobre os principais elos que formam uma cadeia de valor.",
    format: "pdf",
    reference: "A3 Digital",
    permitirDownload: true,
    public: true,
    active: true,
    finished: false,
  },
  {
    id: "negocio-07",
    name: "Escolhas que geram impacto",
    type: "Artigo",
    competency: "Tomada de Decisão",
    axis: "Negócio",
    description:
      "Artigo sobre escolhas conscientes e decisões conectadas aos resultados esperados.",
    format: "pdf",
    reference: "A3 Digital",
    permitirDownload: true,
    public: true,
    active: true,
    finished: true,
    finishedAt: "2026-08-18T11:45:00",
  },
  {
    id: "negocio-08",
    name: "Critérios para decisões melhores",
    type: "Ferramenta",
    competency: "Tomada de Decisão",
    axis: "Negócio",
    description:
      "Ferramenta prática para organizar critérios antes de decidir.",
    format: "pdf",
    reference: "Biblioteca A3",
    permitirDownload: false,
    public: true,
    active: true,
    finished: false,
  },
  {
    id: "negocio-09",
    name: "Indicadores que contam histórias",
    type: "Vídeo",
    competency: "Foco em Resultados",
    axis: "Negócio",
    description:
      "Vídeo mockado sobre indicadores e a leitura de sinais importantes do negócio.",
    format: "video",
    reference: "A3 Digital Academy",
    permitirDownload: false,
    public: true,
    active: true,
    finished: false,
  },
  {
    id: "negocio-10",
    name: "Decisões que movem o negócio",
    type: "Podcast",
    competency: "Foco em Resultados",
    axis: "Negócio",
    description:
      "Episódio mockado sobre transformar objetivos em resultados acompanháveis.",
    format: "audio",
    reference: "A3 Digital",
    permitirDownload: true,
    public: true,
    active: true,
    finished: false,
  },
];

const teamContents: LibraryContent[] = [
  {
    id: "equipe-01",
    name: "Conversas que aproximam",
    type: "Artigo",
    competency: "Relacionamento Interpessoal",
    axis: "Equipe",
    description:
      "Práticas para criar conversas mais claras, abertas e produtivas no dia a dia.",
    format: "pdf",
    reference: "A3 Digital",
    permitirDownload: true,
    public: true,
    active: true,
    finished: true,
    finishedAt: "2026-09-05T10:00:00",
  },
  {
    id: "equipe-02",
    name: "Feedback como ferramenta de desenvolvimento",
    type: "Vídeo",
    competency: "Relacionamento Interpessoal",
    axis: "Equipe",
    description:
      "Vídeo de exemplo sobre como transformar feedback em aprendizado compartilhado.",
    format: "video",
    reference: "A3 Digital Academy",
    permitirDownload: false,
    public: true,
    active: true,
    finished: false,
  },
  {
    id: "equipe-03",
    name: "Rituais de colaboração",
    type: "Capítulo de livro",
    competency: "Relacionamento Interpessoal",
    axis: "Equipe",
    description:
      "Uma leitura sobre acordos e rituais que fortalecem a colaboração entre pessoas.",
    format: "pdf",
    reference: "Biblioteca A3",
    permitirDownload: false,
    public: true,
    active: true,
    finished: false,
  },
  {
    id: "equipe-04",
    name: "Mapa de forças do time",
    type: "Ferramenta",
    competency: "Relacionamento Interpessoal",
    axis: "Equipe",
    description:
      "Ferramenta para identificar talentos, contribuições e oportunidades de parceria.",
    format: "pdf",
    reference: "A3 Digital",
    permitirDownload: true,
    public: true,
    active: true,
    finished: true,
    finishedAt: "2026-08-26T14:20:00",
  },
  {
    id: "equipe-05",
    name: "Liderança que desenvolve pessoas",
    type: "Podcast",
    competency: "Liderança e Gestão",
    axis: "Equipe",
    description:
      "Episódio de exemplo sobre liderança, autonomia e crescimento do time.",
    format: "audio",
    reference: "A3 Digital Academy",
    permitirDownload: false,
    public: true,
    active: true,
    finished: false,
  },
  {
    id: "equipe-06",
    name: "Delegação com clareza",
    type: "Infográfico",
    competency: "Liderança e Gestão",

    axis: "Equipe",
    description:
      "Resumo visual para apoiar uma delegação mais clara e orientada a resultados.",
    format: "pdf",
    reference: "A3 Digital",
    permitirDownload: true,
    public: true,
    active: true,
    finished: false,
  },
];

const marketContents: LibraryContent[] = [
  {
    id: "mercado-01",
    name: "Leitura de cenário e tendências",
    type: "Artigo",
    competency: "Visão de Negócio",
    axis: "Mercado",
    description:
      "Práticas para observar mudanças e reconhecer oportunidades no ambiente externo.",
    format: "pdf",
    reference: "A3 Digital",
    permitirDownload: true,
    public: true,
    active: true,
    finished: true,
    finishedAt: "2026-09-06T10:00:00",
  },
  {
    id: "mercado-02",
    name: "Radar de oportunidades",
    type: "Ferramenta",
    competency: "Visão de Negócio",
    axis: "Mercado",
    description:
      "Ferramenta de exemplo para organizar sinais, oportunidades e hipóteses de mercado.",
    format: "pdf",
    reference: "Biblioteca A3",
    permitirDownload: false,
    public: true,
    active: true,
    finished: false,
  },
  {
    id: "mercado-03",
    name: "Comportamento do consumidor",
    type: "Vídeo",
    competency: "Visão de Negócio",
    axis: "Mercado",
    description:
      "Vídeo de exemplo sobre necessidades, escolhas e mudanças no comportamento do consumidor.",
    format: "video",
    reference: "A3 Digital Academy",
    permitirDownload: false,
    public: true,
    active: true,
    finished: false,
  },
  {
    id: "mercado-04",
    name: "Jornada de valor para o cliente",
    type: "Infográfico",
    competency: "Visão de Negócio",
    axis: "Mercado",
    description:
      "Resumo visual para analisar os principais pontos de contato com o cliente.",
    format: "pdf",
    reference: "A3 Digital",
    permitirDownload: true,
    public: true,
    active: true,
    finished: true,
    finishedAt: "2026-08-30T14:20:00",
  },
  {
    id: "mercado-05",
    name: "Inovação conectada ao mercado",
    type: "Podcast",
    competency: "Inovação e Criatividade",
    axis: "Mercado",
    description:
      "Episódio de exemplo sobre inovação, diferenciação e posicionamento competitivo.",
    format: "audio",
    reference: "A3 Digital Academy",
    permitirDownload: false,
    public: true,
    active: true,
    finished: false,
  },
  {
    id: "mercado-06",
    name: "Matriz de diferenciação",
    type: "Capítulo de livro",
    competency: "Inovação e Criatividade",
    axis: "Mercado",
    description:
      "Uma leitura de exemplo sobre escolhas que ajudam a construir diferenciação.",
    format: "pdf",
    reference: "Biblioteca A3",
    permitirDownload: false,
    public: true,
    active: true,
    finished: false,
  },
];

const individualContents: LibraryContent[] = [
  {
    id: "individuo-01",
    name: "Autoconhecimento na prática",
    type: "Artigo",
    competency: "Autoconhecimento",
    axis: "Indivíduo",
    description:
      "Reflexões práticas para reconhecer padrões, valores e motivações pessoais.",
    format: "pdf",
    reference: "A3 Digital",
    permitirDownload: true,
    public: true,
    active: true,
    finished: true,
    finishedAt: "2026-09-07T10:00:00",
  },
  {
    id: "individuo-02",
    name: "Diário de pontos fortes",
    type: "Ferramenta",
    competency: "Autoconhecimento",
    axis: "Indivíduo",
    description:
      "Ferramenta de exemplo para identificar talentos e situações em que você rende melhor.",
    format: "pdf",
    reference: "Biblioteca A3",
    permitirDownload: false,
    public: true,
    active: true,
    finished: false,
  },
  {
    id: "individuo-03",
    name: "Organização e foco no dia a dia",
    type: "Vídeo",
    competency: "Gestão do Tempo",
    axis: "Indivíduo",
    description:
      "Vídeo de exemplo com práticas para organizar prioridades e proteger o foco.",
    format: "video",
    reference: "A3 Digital Academy",
    permitirDownload: false,
    public: true,
    active: true,
    finished: false,
  },
  {
    id: "individuo-04",
    name: "Matriz de prioridades pessoais",
    type: "Infográfico",
    competency: "Gestão do Tempo",
    axis: "Indivíduo",
    description:
      "Resumo visual para apoiar decisões sobre urgência, importância e energia disponível.",
    format: "pdf",
    reference: "A3 Digital",
    permitirDownload: true,
    public: true,
    active: true,
    finished: true,
    finishedAt: "2026-08-31T14:20:00",
  },
  {
    id: "individuo-05",
    name: "Resiliência em movimento",
    type: "Podcast",
    competency: "Resiliência",
    axis: "Indivíduo",
    description:
      "Episódio de exemplo sobre adaptação, aprendizados e continuidade em momentos difíceis.",
    format: "audio",
    reference: "A3 Digital Academy",
    permitirDownload: false,
    public: true,
    active: true,
    finished: false,
  },
  {
    id: "individuo-06",
    name: "Aprender com experiências",
    type: "Capítulo de livro",
    competency: "Resiliência",
    axis: "Indivíduo",
    description:
      "Uma leitura de exemplo sobre transformar experiências em desenvolvimento contínuo.",
    format: "pdf",
    reference: "Biblioteca A3",
    permitirDownload: false,
    public: true,
    active: true,
    finished: false,
  },
];
const competencyGroups: Array<{
  competency: LibraryCompetency;
  axis: LibraryAxis;
}> = [
  { competency: "Capacidade Analítica", axis: "Negócio" },
  { competency: "Resolução de Problemas", axis: "Negócio" },
  { competency: "Negociação", axis: "Equipe" },
  { competency: "Planejamento e Organização", axis: "Indivíduo" },
  { competency: "Proatividade", axis: "Indivíduo" },
];

const otherAxisContents: LibraryContent[] = [
  ...Array.from({ length: 30 }, (_, index) => {
    const { competency, axis } = competencyGroups[Math.floor(index / 6)]!;

    return {
      id: `biblioteca-${index + 1}`,
      name: `Conteúdo de desenvolvimento ${index + 1}`,
      type: "Artigo" as const,
      axis,
      competency,
      description:
        "Conteúdo de exemplo da Biblioteca para cálculo do progresso geral.",
      format: index % 3 === 0 ? "video" : ("pdf" as LibraryContent["format"]),
      reference: "Biblioteca A3",
      permitirDownload: false,
      public: true,
      active: true,
      finished: index < 5,
    };
  }),
];

const STORAGE_KEY = "a3:library-content-status";
let contents: LibraryContent[] = [
  ...businessContents,
  ...teamContents,
  ...marketContents,
  ...individualContents,
  ...otherAxisContents,
];
let hasReadStoredStatus = false;
const listeners = new Set<() => void>();

function readStoredStatus() {
  if (typeof window === "undefined" || hasReadStoredStatus) return;

  hasReadStoredStatus = true;
  try {
    const stored = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? "{}",
    ) as Record<string, { finished: boolean; finishedAt?: string }>;
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

export function getLibraryContent(id: string) {
  return getLibraryContents().find((content) => content.id === id);
}

export function getActivePublicContentsForAxis(axis: LibraryAxis) {
  return getLibraryContents().filter(
    (content) => content.axis === axis && content.public && content.active,
  );
}

export function getCompetencyProgress() {
  const contents = getLibraryContents();

  const competencies: LibraryCompetency[] = [
    "Autoconhecimento",
    "Capacidade Analítica",
    "Comunicação",
    "Foco em Resultados",
    "Gestão do Tempo",
    "Inovação e Criatividade",
    "Liderança e Gestão",
    "Negociação",
    "Planejamento e Organização",
    "Proatividade",
    "Relacionamento Interpessoal",
    "Resiliência",
    "Resolução de Problemas",
    "Tomada de Decisão",
    "Visão de Negócio",
    "Visão Estratégica",
    "Visão Integrada",
  ];

  const progress = competencies.map((competency) => {
    const competencyContents = contents.filter(
      (content) => content.competency === competency,
    );

    const total = competencyContents.length;

    if (total === 0) {
      return {
        competency,
        total: 0,
        finished: 0,
        percentage: 100,
      };
    }

    const finished = competencyContents.filter(
      (content) => content.finished,
    ).length;

    return {
      competency,
      total,
      finished,
      percentage: Math.round((finished / total) * 100),
    };
  });

  return progress;
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
    const current = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? "{}",
    ) as Record<string, unknown>;

    current[id] = { finished, finishedAt };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  }

  notify();
}
