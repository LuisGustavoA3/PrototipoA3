import { createFileRoute } from "@tanstack/react-router";
import { Plus, Route as RouteIcon, X } from "lucide-react";
import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSidebarOpen } from "@/hooks/use-sidebar";
import {
  addJourneyItem,
  type EditableSection,
  type JourneyItem,
  type Section,
  useJourneyItems,
} from "@/lib/journey-store";
import { cn } from "@/lib/utils";

const startingPointSections: EditableSection[] = [
  "Entregáveis",
  "Prioridades de desenvolvimento",
  "Suporte ao desenvolvimento",
  "Obstáculos ao desenvolvimento",
];

const checkpointSections: Section[] = [
  "Resultados e progressos",
  "Continuidade de desenvolvimento",
];

const maxJourneyItemTitleLength = 50;

export const Route = createFileRoute("/jornada-de-desenvolvimento")({
  head: () => ({
    meta: [
      { title: "Jornada de Desenvolvimento | A3 Digital" },
      {
        name: "description",
        content: "Organize os pontos de partida e acompanhamento da sua jornada de desenvolvimento.",
      },
    ],
  }),
  component: JornadaDeDesenvolvimento,
});

function JornadaDeDesenvolvimento() {
  const [sidebarOpen, toggleSidebar] = useSidebarOpen();
  const items = useJourneyItems();
  const [selectedSection, setSelectedSection] = useState<EditableSection | null>(null);
  const [title, setTitle] = useState("");

  const openNewItem = (section: EditableSection) => {
    setSelectedSection(section);
    setTitle("");
  };

  const closeNewItem = () => {
    setSelectedSection(null);
    setTitle("");
  };

  const createItem = () => {
    if (!selectedSection || !title.trim()) return;

    addJourneyItem(selectedSection, title);
    closeNewItem();
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
        <div className="space-y-6 p-6">
          <header>
            <p className="label-caps text-xs text-primary">Meu desenvolvimento</p>
            <h1 className="mt-1 text-2xl text-foreground">Jornada de Desenvolvimento</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Registre os pontos que orientam seu desenvolvimento e acompanhe sua evolução.
            </p>
          </header>

          <JourneyBoard
            title="Ponto de partida"
            sections={startingPointSections}
            items={items}
            onNewItem={openNewItem}
          />

          <JourneyBoard title="Pontos de verificação" sections={checkpointSections} items={items} />
        </div>
      </main>

      <Dialog open={selectedSection !== null} onOpenChange={(open) => !open && closeNewItem()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="label-caps mb-2 block text-xs text-muted-foreground">Tipo</label>
              <Input value={selectedSection ?? ""} readOnly aria-label="Tipo do item" />
            </div>
            <div>
              <label htmlFor="journey-item-title" className="label-caps mb-2 block text-xs text-muted-foreground">
                Título
              </label>
              <Input
                id="journey-item-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Digite o título do item"
                maxLength={maxJourneyItemTitleLength}
                autoFocus
              />
              <p className="mt-1 text-right text-xs text-muted-foreground">
                {title.length}/{maxJourneyItemTitleLength}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeNewItem}>
              Fechar
            </Button>
            <Button type="button" onClick={createItem} disabled={!title.trim()}>
              Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function JourneyBoard({
  title,
  sections,
  items,
  onNewItem,
}: {
  title: string;
  sections: Section[];
  items: Record<Section, JourneyItem[]>;
  onNewItem?: (section: EditableSection) => void;
}) {
  return (
    <section className="rounded-md border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="mb-5 flex items-center justify-between gap-4 border-b border-border pb-4">
        <h2 className="label-caps text-sm text-foreground">{title}</h2>
        <RouteIcon className="size-5 text-primary" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {sections.map((section) => (
          <JourneySection
            key={section}
            title={section}
            items={items[section]}
            canCreate={Boolean(onNewItem)}
            onNewItem={onNewItem}
          />
        ))}
      </div>
    </section>
  );
}

function JourneySection({
  title,
  items,
  canCreate,
  onNewItem,
}: {
  title: Section;
  items: JourneyItem[];
  canCreate: boolean;
  onNewItem?: (section: EditableSection) => void;
}) {
  return (
    <div className="rounded-md border border-border bg-background p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {canCreate && onNewItem && (
          <button
            type="button"
            onClick={() => onNewItem(title as EditableSection)}
            className="inline-flex shrink-0 items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="size-3.5" />
            Novo
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="mt-5 rounded-md bg-muted px-3 py-4 text-center text-sm text-muted-foreground">
          Nenhum dado
        </p>
      ) : (
        <div className="mt-4 space-y-2">
          {items.map((item) => (
            <div key={item.id} className="rounded-md border border-border bg-card px-3 py-3">
              <p className="text-sm text-foreground">{item.title}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Última atualização: {item.updatedAt}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}