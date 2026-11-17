import type { SharedFile } from "./shared-files-store";

export const mockFileContents: Record<
  string,
  { title: string; paragraphs: string[] }
> = {
  "ARQ-001": {
    title: "Relatório de competências",
    paragraphs: [
      "Luis Gustavo Ribeiro · Ciclo 2026",
      "Comunicação: destaque na escuta e na clareza das orientações.",
      "Planejamento: desenvolver a priorização das atividades e o acompanhamento de prazos.",
      "Próximos passos: praticar escuta ativa e registrar uma reflexão após cada reunião.",
    ],
  },
  "ARQ-002": {
    title: "Plano de desenvolvimento",
    paragraphs: [
      "Objetivo: fortalecer a comunicação e a organização da rotina.",
      "Ação 1: reservar quinze minutos ao início do dia para definir prioridades.",
      "Ação 2: solicitar feedback ao final das reuniões da equipe.",
      "Acompanhamento: revisar os avanços no próximo atendimento de mentoria.",
    ],
  },
  "ARQ-003": {
    title: "Acompanhamento de metas",
    paragraphs: [
      "Meta;Responsável;Prazo;Progresso;Status",
      "Praticar escuta ativa;Luis Gustavo;27/09/2026;75%;Em andamento",
      "Leitura sobre autoconhecimento;Luis Gustavo;29/08/2026;100%;Concluído",
      "Mapear decisões do time;Luis Gustavo;10/10/2026;0%;Não iniciado",
    ],
  },
  "ARQ-004": {
    title: "Resultados da jornada",
    paragraphs: [
      "Comunicação: escuta ativa e conversas mais objetivas.",
      "Autoconhecimento: reconhecimento dos pontos fortes e das oportunidades de desenvolvimento.",
      "Próximo ciclo: consolidar hábitos e acompanhar a evolução das metas.",
    ],
  },
  "ARQ-005": {
    title: "Anotações da mentoria",
    paragraphs: [
      "Escutar antes de responder",
      "Definir três prioridades por dia",
      "Pedir feedback à equipe",
      "Registrar os aprendizados da semana",
    ],
  },
  "ARQ-006": {
    title: "Atendimento de mentoria",
    paragraphs: [
      "Abertura: revisão das metas do ciclo.",
      "Desenvolvimento: reflexão sobre comunicação e prioridades.",
      "Encerramento: acordos para o próximo encontro.",
    ],
  },
  "ARQ-007": {
    title: "Feedback do atendimento",
    paragraphs: [
      "Luis, você avançou na escuta da equipe. Continue registrando suas reflexões após as reuniões. No próximo encontro, vamos revisar as prioridades e os resultados dessas mudanças.",
    ],
  },
  "ARQ-008": {
    title: "Materiais de apoio",
    paragraphs: [
      "Roteiro_de_reflexao.txt",
      "Checklist_semanal.txt",
      "Orientacoes_do_PDI.txt",
    ],
  },
  "ARQ-009": {
    title: "Observações da mentoria",
    paragraphs: [
      "Manter a prática de reflexão semanal.",
      "Compartilhar situações em que a escuta ativa ajudou a equipe.",
      "Revisar os prazos das ações antes do próximo atendimento.",
    ],
  },
  "ARQ-010": {
    title: "Plano de Desenvolvimento Individual",
    paragraphs: [
      "Objetivo: desenvolver liderança com foco em pessoas e resultados.",
      "Competências prioritárias: comunicação, autoconhecimento e planejamento.",
      "Ações: praticar escuta ativa, concluir a leitura recomendada e mapear decisões recorrentes.",
      "Evidências: registros das reuniões, resumo da leitura e mapa de decisões.",
    ],
  },
};

export function downloadSharedFile(file: SharedFile) {
  if (file.allowDownload === false) return;
  const link = document.createElement("a");
  if (file.contentUrl) {
    link.href = file.contentUrl;
    link.download = file.name;
    link.click();
    return;
  }
  const content = mockFileContents[file.id];
  const text = [
    content?.title ?? file.name,
    ...(content?.paragraphs ?? [file.description]),
  ].join("\n\n");
  const url = URL.createObjectURL(
    new Blob([text], { type: "text/plain;charset=utf-8" }),
  );
  link.href = url;
  link.download = `${file.name.replace(/\.[^.]+$/, "")}.txt`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
