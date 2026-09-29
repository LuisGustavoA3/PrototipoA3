import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Bot,
  ChevronRight,
  CircleHelp,
  MapPin,
  Send,
  UserRound,
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSidebarOpen } from "@/hooks/use-sidebar";
import { getFAQQuestion } from "@/lib/faq-data";
import {
  selectKnowledgeQuestion,
  submitAssistantQuestion,
  useAssistantConversation,
} from "@/lib/assistant-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assistente")({
  head: () => ({ meta: [{ title: "Assistente | A3 Digital" }] }),
  component: Assistente,
});

function Assistente() {
  const [sidebarOpen, toggleSidebar] = useSidebarOpen();
  const [draft, setDraft] = useState("");
  const messages = useAssistantConversation();
  const conversationEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.trim()) return;
    submitAssistantQuestion(draft);
    setDraft("");
  };

  const initialSuggestions = [
    "Como acesso meu plano de ação?",
    "Como consulto meu assessment?",
    "Como acompanho minha evolução?",
    "Onde encontro meus arquivos compartilhados?",
  ];

  return (
    <div className="h-screen w-full overflow-hidden bg-background">
      <TopBar onToggleSidebar={toggleSidebar} />
      <AppSidebar open={sidebarOpen} />
      <main
        className={cn(
          "h-screen overflow-hidden pt-16 transition-[padding-left] duration-300",
          sidebarOpen ? "pl-[264px]" : "pl-0",
        )}
      >
        <div className="mx-auto flex h-full max-w-4xl flex-col px-4 sm:px-6">
          <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border py-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bot className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h1 className="text-xl text-foreground">Assistente A3</h1>
                <p className="text-xs text-muted-foreground">
                  Atendimento automatizado
                </p>
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
              <span className="size-2 rounded-full bg-emerald-500" />
              Disponível
            </span>
          </header>

          <section
            aria-label="Conversa com o Assistente"
            className="min-h-0 flex-1 overflow-y-auto py-6"
          >
            {messages.length === 0 ? (
              <div className="mx-auto flex min-h-full max-w-2xl flex-col justify-center py-8">
                <div className="mb-8 flex gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Bot className="size-5" aria-hidden="true" />
                  </span>
                  <div className="rounded-md border border-border bg-card p-4 shadow-[var(--shadow-card)]">
                    <h2 className="text-lg font-semibold text-foreground">
                      Olá! Como posso ajudar?
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Posso ajudar você a encontrar informações sobre sua
                      jornada de desenvolvimento no A3 Digital. Escolha um
                      assunto ou digite sua dúvida.
                    </p>
                  </div>
                </div>
                <div className="pl-12">
                  <p className="mb-3 text-xs font-medium text-muted-foreground">
                    Sugestões para começar
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {initialSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => submitAssistantQuestion(suggestion)}
                        className="group flex min-h-12 items-center justify-between gap-3 rounded-md border border-border bg-card px-4 py-3 text-left text-sm text-foreground transition-colors hover:border-primary/50 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span>{suggestion}</span>
                        <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mx-auto flex max-w-2xl flex-col gap-5">
                {messages.map((message) => {
                  const isUser = message.role === "user";
                  const selectedQuestion = message.selectedQuestionId
                    ? getFAQQuestion(message.selectedQuestionId)
                    : undefined;

                  return (
                    <article
                      key={message.id}
                      aria-label={
                        isUser ? "Sua mensagem" : "Resposta do Assistente"
                      }
                      className={cn(
                        "flex min-w-0 gap-3",
                        isUser && "justify-end",
                      )}
                    >
                      {!isUser && (
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Bot className="size-4" aria-hidden="true" />
                        </span>
                      )}
                      <div
                        className={cn(
                          "min-w-0 max-w-[88%] rounded-md p-4 sm:max-w-[80%]",
                          isUser
                            ? "bg-primary text-primary-foreground"
                            : "border border-border bg-card text-foreground shadow-[var(--shadow-card)]",
                        )}
                      >
                        {selectedQuestion && (
                          <p className="mb-2 text-xs font-medium text-muted-foreground">
                            {selectedQuestion.categoryName}
                          </p>
                        )}
                        <p className="whitespace-pre-line break-words text-sm leading-6">
                          {message.text}
                        </p>

                        {message.questionIds && (
                          <div className="mt-4 grid gap-2">
                            {message.questionIds.map((questionId) => {
                              const question = getFAQQuestion(questionId);
                              if (!question) return null;

                              return (
                                <button
                                  key={question.id}
                                  type="button"
                                  onClick={() =>
                                    selectKnowledgeQuestion(question.id)
                                  }
                                  className="flex min-h-12 items-center justify-between gap-3 rounded-sm border border-border bg-background px-3 py-2 text-left text-sm transition-colors hover:border-primary/50 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                  <span className="min-w-0">
                                    <span className="block text-foreground">
                                      {question.question}
                                    </span>
                                    <span className="mt-1 block text-xs text-muted-foreground">
                                      {question.categoryName}
                                    </span>
                                  </span>
                                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {message.helpLinks && (
                          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                            {message.helpLinks === "faq-and-contacts" && (
                              <Link
                                to="/faq"
                                className="inline-flex min-h-9 items-center gap-2 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              >
                                <CircleHelp
                                  className="size-4"
                                  aria-hidden="true"
                                />
                                Acessar FAQ
                                <ArrowRight
                                  className="size-3.5"
                                  aria-hidden="true"
                                />
                              </Link>
                            )}
                            <Link
                              to="/contatos-localizacao"
                              className="inline-flex min-h-9 items-center gap-2 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <MapPin className="size-4" aria-hidden="true" />
                              Contatos
                              <ArrowRight
                                className="size-3.5"
                                aria-hidden="true"
                              />
                            </Link>
                          </div>
                        )}

                        {message.relatedQuestionIds && (
                          <div className="mt-5 border-t border-border pt-4">
                            <p className="mb-2 text-xs font-medium text-muted-foreground">
                              Perguntas relacionadas
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {message.relatedQuestionIds.map((questionId) => {
                                const question = getFAQQuestion(questionId);
                                if (!question) return null;

                                return (
                                  <button
                                    key={question.id}
                                    type="button"
                                    onClick={() =>
                                      selectKnowledgeQuestion(question.id)
                                    }
                                    className="min-h-9 rounded-sm border border-border bg-background px-3 py-2 text-left text-xs text-foreground transition-colors hover:border-primary/50 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                  >
                                    {question.question}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                      {isUser && (
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                          <UserRound className="size-4" aria-hidden="true" />
                        </span>
                      )}
                    </article>
                  );
                })}
                <div ref={conversationEndRef} />
              </div>
            )}
          </section>

          <form
            onSubmit={handleSubmit}
            className="shrink-0 border-t border-border bg-background py-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
          >
            <div className="mx-auto flex max-w-2xl items-center gap-2">
              <label htmlFor="assistant-message" className="sr-only">
                Digite sua dúvida
              </label>
              <Input
                id="assistant-message"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Digite sua dúvida..."
                autoComplete="off"
                className="h-12 min-w-0 flex-1 bg-card px-4 text-sm"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!draft.trim()}
                aria-label="Enviar pergunta"
                className="size-12 shrink-0"
              >
                <Send className="size-4" aria-hidden="true" />
              </Button>
            </div>
            <p className="mx-auto mt-2 max-w-2xl px-1 text-xs text-muted-foreground">
              Respostas baseadas em perguntas cadastradas.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
