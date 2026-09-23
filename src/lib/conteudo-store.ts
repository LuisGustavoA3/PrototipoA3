export type Conteudo = {
  id: string;
  title: string;
  type: "Artigo" | "Vídeo" | "Podcast";
  axis: "Negócio" | "Equipe" | "Mercado" | "Indivíduo";
  description: string;
  format: "pdf" | "video" | "audio";
  reference: string;
  duration: string;
  finished: boolean;
};

const contents: Conteudo[] = [
  {
    id: "conteudo-01",
    title: "Ambidestria Organizacional",
    type: "Artigo",
    axis: "Negócio",
    description:
      "Uma introdução prática à ambidestria e às escolhas estratégicas das organizações.",
    format: "pdf",
    reference: "A3 Digital",
    duration: "8 min de leitura",
    finished: false,
  },
  {
    id: "conteudo-02",
    title: "Pensamento sistêmico nas decisões",
    type: "Vídeo",
    axis: "Negócio",
    description:
      "Vídeo sobre relações e efeitos sistêmicos nas decisões.",
    format: "video",
    reference: "A3 Digital Academy",
    duration: "12 min",
    finished: false,
  },
  {
    id: "conteudo-03",
    title: "Liderança que desenvolve pessoas",
    type: "Podcast",
    axis: "Equipe",
    description:
      "Episódio sobre liderança, autonomia e crescimento do time.",
    format: "audio",
    reference: "A3 Digital Academy",
    duration: "24 min",
    finished: false,
  },
];
export function getConteudos() {
  return contents;
}