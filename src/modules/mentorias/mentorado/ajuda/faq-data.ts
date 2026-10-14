import {
  BookOpen,
  BriefcaseBusiness,
  CircleUserRound,
  ClipboardCheck,
  FileStack,
  GraduationCap,
} from "lucide-react";

export const faqCategories = [
  {
    id: "conta-acesso",
    name: "Conta e acesso",
    description: "Login, senha, perfil e acesso à plataforma.",
    icon: CircleUserRound,
    keywords: ["login", "entrar", "senha", "perfil", "acesso", "conta"],
    questions: [
      "Como faço para acessar minha conta?",
      "Esqueci minha senha. Como posso recuperá-la?",
      "Como posso atualizar meus dados de perfil?",
      "O que fazer se não conseguir acessar minha conta?",
    ],
  },
  {
    id: "mentoria",
    name: "Mentoria",
    description:
      "Encontros, acompanhamento e relacionamento entre mentor e mentorado.",
    icon: GraduationCap,
    keywords: ["mentoria", "mentor", "mentorado", "encontros", "evolução"],
    questions: [
      "Como posso visualizar minhas informações de mentoria?",
      "Onde encontro os detalhes dos meus encontros?",
      "Como acompanho minha evolução na mentoria?",
      "Onde posso consultar o histórico dos meus encontros?",
    ],
  },
  {
    id: "assessment",
    name: "Assessment",
    description: "Avaliações, resultados e competências.",
    icon: ClipboardCheck,
    keywords: ["assessment", "avaliação", "resultado", "competências"],
    questions: [
      "Como faço para acessar meu assessment?",
      "Onde posso visualizar os resultados da minha avaliação?",
      "Como posso acompanhar minha evolução nas competências?",
      "O que fazer se não conseguir acessar ou concluir uma avaliação?",
    ],
  },
  {
    id: "plano-de-acao",
    name: "Plano de ação",
    description: "Metas, atividades e acompanhamento do desenvolvimento.",
    icon: BriefcaseBusiness,
    keywords: ["plano", "ação", "metas", "atividades", "progresso"],
    questions: [
      "Onde encontro meu plano de ação?",
      "Como posso visualizar minhas metas e atividades?",
      "Como atualizo o status de uma atividade?",
      "Como acompanho o progresso do meu plano de desenvolvimento?",
    ],
  },
  {
    id: "biblioteca",
    name: "Biblioteca",
    description: "Conteúdos, materiais e recursos de desenvolvimento.",
    icon: BookOpen,
    keywords: ["conteúdos", "materiais", "recursos", "metodológicos"],
    questions: [
      "Como encontro conteúdos relacionados ao meu desenvolvimento?",
      "Como posso acessar um conteúdo da Biblioteca?",
      "Onde encontro as competências e os materiais metodológicos da A3?",
    ],
  },
  {
    id: "arquivos-compartilhados",
    name: "Arquivos compartilhados",
    description: "Documentos, relatórios e materiais enviados e recebidos.",
    icon: FileStack,
    keywords: ["arquivo", "documento", "relatório", "compartilhado", "baixar"],
    questions: [
      "Onde encontro meus arquivos compartilhados?",
      "Como faço para baixar um arquivo?",
      "Como sei quem compartilhou um documento comigo?",
      "Posso excluir um arquivo compartilhado?",
    ],
  },
];

export const normalizeHelpText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");

const toKeywords = (value: string) =>
  normalizeHelpText(value)
    .split(/[^a-z0-9]+/)
    .filter((keyword) => keyword.length > 2);

export const faqQuestions = faqCategories.flatMap((category) =>
  category.questions.map((question, index) => ({
    id: `${category.id}-${index}`,
    question,
    categoryId: category.id,
    categoryName: category.name,
    categoryDescription: category.description,
    keywords: Array.from(
      new Set([
        ...category.keywords.flatMap(toKeywords),
        ...toKeywords(question),
      ]),
    ),
  })),
);

export type FAQQuestion = (typeof faqQuestions)[number];

export function getFAQQuestion(id: string) {
  return faqQuestions.find((question) => question.id === id);
}
