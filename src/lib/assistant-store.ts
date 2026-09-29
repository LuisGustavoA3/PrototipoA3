import { useSyncExternalStore } from "react";
import { faqQuestions, getFAQQuestion } from "@/lib/faq-data";

const NO_ANSWER_TEXT =
  "Ainda não temos uma resposta oficial cadastrada para esta pergunta.\nVocê pode consultar o FAQ ou entrar em contato com nossa equipe para obter ajuda.";

const UNKNOWN_QUESTION_TEXT =
  "Não consegui entender sua pergunta. Tente utilizar palavras-chave diferentes ou reformular sua dúvida.\nVocê também pode entrar em contato com nossa equipe se preferir.";

const UNMATCHED_QUESTION_TEXT =
  "Não foi possível localizar uma resposta compatível. Tente reformular sua pergunta utilizando outras palavras-chave.";

const STOP_WORDS = new Set([
  "a",
  "as",
  "ao",
  "aos",
  "com",
  "como",
  "da",
  "das",
  "de",
  "do",
  "dos",
  "e",
  "em",
  "eu",
  "fazer",
  "foi",
  "minha",
  "minhas",
  "meu",
  "meus",
  "na",
  "nas",
  "no",
  "nos",
  "o",
  "os",
  "ou",
  "para",
  "pela",
  "pelas",
  "pelo",
  "pelos",
  "por",
  "posso",
  "qual",
  "quando",
  "que",
  "se",
  "um",
  "uma",
  "umas",
  "uns",
]);

const SYNONYMS: Record<string, string[]> = {
  acessar: ["acesso", "entrar", "login"],
  acesso: ["acessar", "entrar", "login"],
  acompanho: ["acompanhar", "evolucao", "progresso"],
  acompanhar: ["acompanho", "evolucao", "progresso"],
  consulto: ["consultar", "visualizar", "acessar"],
  consultar: ["consulto", "visualizar", "acessar"],
  encontro: ["encontrar", "localizar"],
  senha: ["recuperar", "esqueci", "redefinir"],
  ver: ["visualizar", "consultar"],
};

export type AssistantMessage = {
  id: number;
  role: "user" | "assistant";
  text: string;
  kind?: "suggestions" | "unrecognized" | "unmatched" | "answer";
  questionIds?: string[];
  selectedQuestionId?: string;
  relatedQuestionIds?: string[];
  helpLinks?: "contacts" | "faq-and-contacts";
};

const emptyConversation: AssistantMessage[] = [];
let conversation = emptyConversation;
let nextMessageId = 0;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function subscribeAssistantConversation(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getAssistantConversation() {
  return conversation;
}

export function useAssistantConversation() {
  return useSyncExternalStore(
    subscribeAssistantConversation,
    getAssistantConversation,
    () => emptyConversation,
  );
}

function addMessage(message: Omit<AssistantMessage, "id">) {
  conversation = [...conversation, { ...message, id: nextMessageId++ }];
  notify();
}

function getTokens(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

function tokensMatch(left: string, right: string) {
  if (left === right) return true;
  return (
    Math.min(left.length, right.length) >= 4 &&
    (left.startsWith(right) || right.startsWith(left))
  );
}

function getQuestionMatches(text: string) {
  const queryTokens = Array.from(
    new Set(
      getTokens(text).flatMap((token) => [token, ...(SYNONYMS[token] ?? [])]),
    ),
  );

  const rankedQuestions = faqQuestions
    .map((question) => {
      const matchedTokens = queryTokens.filter((token) =>
        question.keywords.some((keyword) => tokensMatch(token, keyword)),
      ).length;

      return {
        question,
        matchedTokens,
        score: queryTokens.length ? matchedTokens / queryTokens.length : 0,
      };
    })
    .filter((result) => result.matchedTokens > 0)
    .sort(
      (left, right) =>
        right.matchedTokens - left.matchedTokens || right.score - left.score,
    );

  const strongMatches = rankedQuestions.filter(
    (result) => result.score >= 0.35 || result.matchedTokens >= 2,
  );
  const suggestions = (strongMatches.length ? strongMatches : rankedQuestions)
    .slice(0, 4)
    .map(({ question }) => question.id);

  return { hasRecognizedKeyword: rankedQuestions.length > 0, suggestions };
}

export function submitAssistantQuestion(text: string) {
  const trimmedText = text.trim();
  if (!trimmedText) return;

  addMessage({ role: "user", text: trimmedText });
  const { hasRecognizedKeyword, suggestions } = getQuestionMatches(trimmedText);

  if (!hasRecognizedKeyword) {
    addMessage({
      role: "assistant",
      kind: "unrecognized",
      text: UNKNOWN_QUESTION_TEXT,
      helpLinks: "contacts",
    });
    return;
  }

  if (suggestions.length === 0) {
    addMessage({
      role: "assistant",
      kind: "unmatched",
      text: UNMATCHED_QUESTION_TEXT,
      helpLinks: "faq-and-contacts",
    });
    return;
  }

  addMessage({
    role: "assistant",
    kind: "suggestions",
    text: "Encontrei estas perguntas que podem ajudar. Selecione uma para consultar a orientação disponível:",
    questionIds: suggestions,
    helpLinks: "faq-and-contacts",
  });
}

export function selectKnowledgeQuestion(questionId: string) {
  const question = getFAQQuestion(questionId);
  if (!question) return;

  addMessage({ role: "user", text: question.question });
  addMessage({
    role: "assistant",
    kind: "answer",
    text: NO_ANSWER_TEXT,
    selectedQuestionId: question.id,
    relatedQuestionIds: faqQuestions
      .filter(
        (relatedQuestion) =>
          relatedQuestion.categoryId === question.categoryId &&
          relatedQuestion.id !== question.id,
      )
      .slice(0, 3)
      .map((relatedQuestion) => relatedQuestion.id),
    helpLinks: "faq-and-contacts",
  });
}
