import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Bot, MapPin, Search, SearchX, X } from "lucide-react";
import { useMemo, useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { useSidebarOpen } from "@/hooks/use-sidebar";
import { faqCategories, faqQuestions, normalizeHelpText } from "@/lib/faq-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [{ title: "FAQ | A3 Digital" }] }),
  component: FAQ,
});

function FAQ() {
  const [sidebarOpen, toggleSidebar] = useSidebarOpen();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const normalizedSearch = normalizeHelpText(search.trim());
  const filteredQuestions = useMemo(
    () =>
      faqQuestions.filter((question) => {
        const matchesCategory =
          !selectedCategory || question.categoryId === selectedCategory;
        const matchesSearch =
          !normalizedSearch ||
          normalizeHelpText(
            `${question.question} ${question.categoryName} ${question.categoryDescription}`,
          ).includes(normalizedSearch);

        return matchesCategory && matchesSearch;
      }),
    [normalizedSearch, selectedCategory],
  );
  const hasActiveFilters = Boolean(search || selectedCategory);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory(null);
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-background">
      <TopBar onToggleSidebar={toggleSidebar} />
      <AppSidebar open={sidebarOpen} />
      <main
        className={cn(
          "h-full overflow-y-auto pt-16 transition-[padding-left] duration-300",
          sidebarOpen ? "pl-[264px]" : "pl-0",
        )}
      >
        <div className="mx-auto max-w-6xl space-y-12 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <header className="max-w-3xl space-y-3">
            <p className="label-caps text-xs text-primary">Central de ajuda</p>
            <h1 className="text-3xl text-foreground sm:text-4xl">
              Como podemos ajudar?
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground">
              Encontre respostas para suas dúvidas sobre o A3 Digital.
            </p>
          </header>

          <section aria-label="Buscar no FAQ" className="max-w-3xl">
            <label htmlFor="faq-search" className="sr-only">
              Busque por uma dúvida ou funcionalidade
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="faq-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Busque por uma dúvida ou funcionalidade..."
                className="h-14 rounded-md border-border bg-card pl-12 pr-12 text-base shadow-[var(--shadow-card)] placeholder:text-muted-foreground/80"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Limpar busca"
                  className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </section>

          <section aria-labelledby="categories-heading" className="space-y-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="label-caps text-xs text-primary">
                  Navegue por tema
                </p>
                <h2
                  id="categories-heading"
                  className="mt-1 text-2xl text-foreground"
                >
                  Explore por categoria.
                </h2>
              </div>
              {selectedCategory && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Limpar categoria
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {faqCategories.map((category) => {
                const selected = selectedCategory === category.id;

                return (
                  <button
                    key={category.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      setSelectedCategory(selected ? null : category.id)
                    }
                    className={cn(
                      "flex min-h-28 items-start gap-4 rounded-md border bg-card p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      selected
                        ? "border-primary bg-accent/50"
                        : "border-border hover:border-primary/50 hover:bg-muted/40",
                    )}
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <category.icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-foreground">
                        {category.name}
                      </span>
                      <span className="mt-1 block text-sm leading-5 text-muted-foreground">
                        {category.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="questions-heading" className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="label-caps text-xs text-primary">
                  {selectedCategory
                    ? faqCategories.find(
                        (category) => category.id === selectedCategory,
                      )?.name
                    : "Respostas para suas dúvidas"}
                </p>
                <h2
                  id="questions-heading"
                  className="mt-1 text-2xl text-foreground"
                >
                  Perguntas frequentes.
                </h2>
              </div>
              {hasActiveFilters && (
                <p className="text-sm text-muted-foreground" aria-live="polite">
                  {filteredQuestions.length} resultado
                  {filteredQuestions.length === 1 ? "" : "s"}
                </p>
              )}
            </div>

            {filteredQuestions.length > 0 ? (
              <Accordion
                type="multiple"
                className="divide-y divide-border border-y border-border"
              >
                {filteredQuestions.map(({ id, question, categoryName }) => (
                  <AccordionItem key={id} value={id} className="border-0">
                    <AccordionTrigger className="gap-4 py-5 text-left text-base font-medium text-foreground hover:no-underline sm:text-lg">
                      <span className="min-w-0 flex-1">
                        <span className="block">{question}</span>
                        <span className="mt-1 block text-xs font-normal text-muted-foreground">
                          {categoryName}
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="max-w-3xl pb-5 pr-8 text-sm leading-6 text-muted-foreground">
                      Resposta pendente de definição e validação.
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="flex min-h-52 flex-col items-center justify-center border-y border-border px-6 py-10 text-center">
                <SearchX
                  className="size-9 text-muted-foreground"
                  aria-hidden="true"
                />
                <h3 className="mt-3 font-semibold text-foreground">
                  Nenhuma pergunta encontrada
                </h3>
                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  Tente buscar por outros termos ou limpe os filtros para ver
                  todas as perguntas.
                </p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-4 text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
            )}
          </section>

          <section
            aria-labelledby="help-forward-heading"
            className="flex flex-col gap-5 border-y border-border bg-secondary/70 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-7"
          >
            <div>
              <h2 id="help-forward-heading" className="text-xl text-foreground">
                Não encontrou o que procura?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Converse com o Assistente ou acesse nossos canais de
                atendimento.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <Link
                to="/assistente"
                className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Bot className="size-4" aria-hidden="true" />
                Assistente
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                to="/contatos-localizacao"
                className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <MapPin className="size-4" aria-hidden="true" />
                Contatos
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
