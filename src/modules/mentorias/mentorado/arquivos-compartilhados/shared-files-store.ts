import { useSyncExternalStore } from "react";

export type SharedFile = {
  id: string;
  name: string;
  description: string;
  author: string;
  date: string;
  dateLabel: string;
  direction: "received" | "sent";
  format:
    | "pdf"
    | "doc"
    | "docx"
    | "odt"
    | "rtf"
    | "txt"
    | "xls"
    | "xlsx"
    | "ods"
    | "csv"
    | "ppt"
    | "pptx"
    | "odp"
    | "key"
    | "png"
    | "jpg"
    | "jpeg"
    | "gif"
    | "svg"
    | "webp"
    | "mp4"
    | "mov"
    | "avi"
    | "webm"
    | "mp3"
    | "wav"
    | "ogg"
    | "m4a"
    | "zip"
    | "rar"
    | "7z"
    | "tar.gz";
};

const initialSharedFiles: SharedFile[] = [
  {
    id: "ARQ-001",
    name: "Relatorio_Assessment.pdf",
    description: "Relatório de resultados do assessment de competências.",
    author: "Mariana Costa",
    date: "2026-09-25",
    dateLabel: "25/09/2026",
    direction: "received",
    format: "pdf",
  },
  {
    id: "ARQ-002",
    name: "Plano_de_Desenvolvimento.docx",
    description: "Plano de desenvolvimento individual do mentorado.",
    author: "Carlos Mendes",
    date: "2026-09-24",
    dateLabel: "24/09/2026",
    direction: "received",
    format: "docx",
  },
  {
    id: "ARQ-003",
    name: "Acompanhamento_de_Metas.xlsx",
    description: "Planilha de acompanhamento das metas de desenvolvimento.",
    author: "Ana Paula",
    date: "2026-09-23",
    dateLabel: "23/09/2026",
    direction: "sent",
    format: "xlsx",
  },
  {
    id: "ARQ-004",
    name: "Apresentacao_de_Resultados.pptx",
    description: "Apresentação dos resultados da jornada de desenvolvimento.",
    author: "Roberto Lima",
    date: "2026-09-22",
    dateLabel: "22/09/2026",
    direction: "received",
    format: "pptx",
  },
  {
    id: "ARQ-005",
    name: "Anotacoes_da_Mentoria.png",
    description: "Imagem com anotações compartilhadas durante a mentoria.",
    author: "Mariana Costa",
    date: "2026-09-21",
    dateLabel: "21/09/2026",
    direction: "sent",
    format: "png",
  },
  {
    id: "ARQ-006",
    name: "Gravacao_da_Sessao.mp4",
    description: "Gravação da sessão de mentoria.",
    author: "Carlos Mendes",
    date: "2026-09-20",
    dateLabel: "20/09/2026",
    direction: "received",
    format: "mp4",
  },
  {
    id: "ARQ-007",
    name: "Feedback_da_Sessao.mp3",
    description: "Áudio com feedback complementar da sessão.",
    author: "Ana Paula",
    date: "2026-09-19",
    dateLabel: "19/09/2026",
    direction: "received",
    format: "mp3",
  },
  {
    id: "ARQ-008",
    name: "Materiais_de_Apoio.zip",
    description: "Pacote compactado com materiais de apoio.",
    author: "Roberto Lima",
    date: "2026-09-18",
    dateLabel: "18/09/2026",
    direction: "sent",
    format: "zip",
  },
  {
    id: "ARQ-009",
    name: "Observacoes_da_Mentoria.txt",
    description: "Arquivo de texto com observações da mentoria.",
    author: "Mariana Costa",
    date: "2026-09-17",
    dateLabel: "17/09/2026",
    direction: "sent",
    format: "txt",
  },
  {
    id: "ARQ-010",
    name: "Plano de Desenvolvimento Individual.pdf",
    description: "Plano de desenvolvimento compartilhado com o mentorado.",
    author: "Você",
    date: new Date().toISOString(),
    dateLabel: "Hoje",
    direction: "sent",
    format: "pdf",
  },
];

let sharedFiles = [...initialSharedFiles];

const listeners = new Set<() => void>();

export function getSharedFiles(): SharedFile[] {
  return sharedFiles;
}

export function subscribeSharedFiles(listener: () => void): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function useSharedFiles(): SharedFile[] {
  return useSyncExternalStore(
    subscribeSharedFiles,
    getSharedFiles,
    getSharedFiles,
  );
}

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export function addSharedFile(file: SharedFile): void {
  sharedFiles = [file, ...sharedFiles];
  notifyListeners();
}

export function removeSharedFile(id: string): void {
  sharedFiles = sharedFiles.filter((file) => file.id !== id);
  notifyListeners();
}
