import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, ChevronRight, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
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
  type ActionStatus,
  addPdiAction,
  type PdiAction,
  updatePdiAction,
  usePdiActions,
  isValidPdiDate,
} from "@/lib/pdi-store";
import { cn } from "@/lib/utils";

const competencies = [
  "Autoconhecimento",
  "Capacidade Analítica",
  "Comunicação",
  "Foco em Resultados",
  "Gestão do Tempo",
  "Governança e Sucessão",
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

const statuses: ActionStatus[] = [
  "Concluído",
  "Em andamento",
  "Não iniciado",
  "Parado",
  "Cancelado",
];

const statusStyles: Record<ActionStatus, string> = {
  Concluído: "bg-emerald-100 text-emerald-700",
  "Em andamento": "bg-blue-100 text-blue-700",
  "Não iniciado": "bg-muted text-muted-foreground",
  Parado: "bg-amber-100 text-amber-700",
  Cancelado: "bg-red-100 text-red-700",
};

type FormValues = Omit<PdiAction, "id" | "createdAt" | "author">;

const emptyForm: FormValues = {
  name: "",
  competency: "",
  startDate: "",
  endDate: "",
  status: "Não iniciado",
  details: "",
  evidence: "",
};

export const Route = createFileRoute("/plano-de-acao")({
  head: () => ({
    meta: [
      { title: "Plano de Ação (PDI) | A3 Digital" },
      {
        name: "description",
        content: "Organize e acompanhe suas ações de desenvolvimento no PDI.",
      },
    ],
  }),
  component: PlanoDeAcao,
});

function PlanoDeAcao() {
  const [sidebarOpen, toggleSidebar] = useSidebarOpen();
  const actions = usePdiActions();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Todos" | ActionStatus>("Todos");
  const [modal, setModal] = useState<"create" | "details" | "edit" | null>(null);
  const [selectedAction, setSelectedAction] = useState<PdiAction | null>(null);
  const [form, setForm] = useState<FormValues>(emptyForm);

  const filteredActions = useMemo(() => {
    const query = search.toLowerCase().trim();
    return [...actions]
      .filter((action) => statusFilter === "Todos" || action.status === statusFilter)
      .filter((action) =>
        [action.name, action.author, action.competency].some((value) =>
          value.toLowerCase().includes(query),
        ),
      )
      .sort((first, second) => second.createdAt.localeCompare(first.createdAt));
  }, [actions, search, statusFilter]);

  const openCreate = () => {
    setForm(emptyForm);
    setSelectedAction(null);
    setModal("create");
  };

  const openDetails = (action: PdiAction) => {
    setSelectedAction(action);
    setModal("details");
  };

  const openEdit = () => {
    if (!selectedAction) return;
    setForm({
      name: selectedAction.name,
      competency: selectedAction.competency,
      startDate: selectedAction.startDate,
      endDate: selectedAction.endDate,
      status: selectedAction.status,
      details: selectedAction.details,
      evidence: selectedAction.evidence,
    });
    setModal("edit");
  };

  const saveAction = () => {
    if (
      !form.name.trim() ||
      !form.competency ||
      !form.startDate ||
      !form.endDate ||
      (form.status === "Concluído" && !form.evidence.trim())
    ) {
      return;
    }

    if (modal === "create") {
      addPdiAction({
        ...form,
        name: form.name.trim(),
        details: form.details.trim(),
        evidence: form.evidence.trim(),
        author: "Luis Gustavo Ribeiro",
      });
    } else if (selectedAction) {
      updatePdiAction(selectedAction.id, {
        ...form,
        name: form.name.trim(),
        details: form.details.trim(),
        evidence: form.evidence.trim(),
      });
      setSelectedAction({ ...selectedAction, ...form });
    }
    setModal(null);
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
            <h1 className="mt-1 text-2xl text-foreground">Plano de Ação (PDI)</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Crie, organize e acompanhe suas ações de desenvolvimento em um só lugar.
            </p>
          </header>

          <section className="flex flex-col gap-4 rounded-md border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="label-caps text-sm text-foreground">Adicionar ação</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Registre uma ação para acompanhar seu desenvolvimento.
              </p>
            </div>
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              Adicionar ação
            </Button>
          </section>

          <section className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <label className="relative block w-full lg:max-w-xl">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Pesquisar por ação, autor ou competência..."
                  aria-label="Pesquisar ações"
                  className="pl-9"
                />
              </label>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as "Todos" | ActionStatus)}
                aria-label="Filtrar por status"
                className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="Todos">Todos</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {actions.length === 0 ? (
              <EmptyState onAdd={openCreate} message="Você ainda não possui ações no seu PDI." />
            ) : filteredActions.length === 0 ? (
              <EmptyState onAdd={() => { setSearch(""); setStatusFilter("Todos"); }} message="Nenhuma ação encontrada." />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredActions.map((action) => (
                  <ActionCard key={action.id} action={action} onClick={() => openDetails(action)} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Dialog open={modal !== null} onOpenChange={(open) => !open && setModal(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {modal === "details" && selectedAction ? (
            <DetailsContent action={selectedAction} onEdit={openEdit} />
          ) : (
            <ActionForm
              form={form}
              setForm={setForm}
              isEditing={modal === "edit"}
              dateError={
                (form.startDate.length > 0 && !isValidPdiDate(form.startDate)) ||
                (form.endDate.length > 0 && !isValidPdiDate(form.endDate))
              }
              onCancel={() => setModal(modal === "edit" ? "details" : null)}
              onSave={saveAction}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ActionCard({ action, onClick }: { action: PdiAction; onClick: () => void }) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => event.key === "Enter" && onClick()}
      className="cursor-pointer rounded-md border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30"
    >
      <div className="flex items-start justify-between gap-4">
        <span className={cn("label-caps rounded px-2.5 py-1 text-[10px]", statusStyles[action.status])}>
          {action.status}
        </span>
        <ChevronRight className="size-5 text-muted-foreground" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-foreground">{action.name}</h2>
      <p className="mt-1 text-sm text-primary">{action.competency}</p>
      <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
        <CalendarDays className="size-4 text-primary" />
        Prazo: {formatDate(action.startDate)} → {formatDate(action.endDate)}
      </div>
      <div className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
        <p>Criado em {formatDate(action.createdAt)}</p>
        <p className="mt-1">Autor: {action.author}</p>
      </div>
    </article>
  );
}

function ActionForm({
  form,
  setForm,
  isEditing,
  dateError,
  onCancel,
  onSave,
}: {
  form: FormValues;
  setForm: (form: FormValues) => void;
  isEditing: boolean;
  dateError: boolean;
  onCancel: () => void;
  onSave: () => void;
}) {
  const update = (changes: Partial<FormValues>) => setForm({ ...form, ...changes });
  const invalid =
    !form.name.trim() ||
    !form.competency ||
    !form.startDate ||
    !form.endDate ||
    dateError ||
    (form.status === "Concluído" && !form.evidence.trim());

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEditing ? "Editar ação" : "Nova ação"}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-2 sm:grid-cols-2">
        <Field label="Nome da ação *" className="sm:col-span-2">
          <Input value={form.name} onChange={(event) => update({ name: event.target.value })} />
        </Field>
        <Field label="Competência *">
          <select
            value={form.competency}
            onChange={(event) => update({ competency: event.target.value })}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">Selecione</option>
            {competencies.map((competency) => <option key={competency}>{competency}</option>)}
          </select>
        </Field>
        <Field label="Status *">
          <select
            value={form.status}
            onChange={(event) => update({ status: event.target.value as ActionStatus })}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
          >
            {statuses.map((status) => <option key={status}>{status}</option>)}
          </select>
        </Field>
        <Field label="Início *">
          <Input
            type="date"
            max="9999-12-31"
            value={form.startDate}
            onChange={(event) => update({ startDate: event.target.value })}
          />
        </Field>
        <Field label="Fim *">
          <Input
            type="date"
            max="9999-12-31"
            value={form.endDate}
            onChange={(event) => update({ endDate: event.target.value })}
          />
        </Field>
        {dateError && (
          <p className="text-sm text-destructive sm:col-span-2">
            Informe datas válidas com ano de até 4 dígitos.
          </p>
        )}
        <Field label="Detalhes" className="sm:col-span-2">
          <textarea
            value={form.details}
            onChange={(event) => update({ details: event.target.value })}
            className="min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
          />
        </Field>
        {form.status === "Concluído" && (
          <Field label="Evidência *" className="sm:col-span-2">
            <textarea
              value={form.evidence}
              onChange={(event) => update({ evidence: event.target.value })}
              className="min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
            />
          </Field>
        )}
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="button" onClick={onSave} disabled={invalid}>Salvar</Button>
      </DialogFooter>
    </>
  );
}

function DetailsContent({ action, onEdit }: { action: PdiAction; onEdit: () => void }) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>{action.name}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-2 text-sm">
        <div className="flex flex-wrap gap-2">
          <span className={cn("label-caps rounded px-2.5 py-1 text-[10px]", statusStyles[action.status])}>{action.status}</span>
          <span className="rounded bg-primary-soft px-2.5 py-1 text-xs text-primary">{action.competency}</span>
        </div>
        <Detail label="Início" value={formatDate(action.startDate)} />
        <Detail label="Fim" value={formatDate(action.endDate)} />
        <Detail label="Criado em" value={formatDate(action.createdAt)} />
        <Detail label="Autor" value={action.author} />
        <Detail label="Detalhes" value={action.details || "Nenhum detalhe informado."} />
        {action.evidence && <Detail label="Evidência" value={action.evidence} />}
      </div>
      <DialogFooter>
        <Button type="button" onClick={onEdit}>Editar ação</Button>
      </DialogFooter>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><p className="label-caps text-[10px] text-muted-foreground">{label}</p><p className="mt-1 text-foreground">{value}</p></div>;
}

function Field({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return <label className={cn("block", className)}><span className="label-caps mb-2 block text-xs text-muted-foreground">{label}</span>{children}</label>;
}

function EmptyState({ message, onAdd }: { message: string; onAdd: () => void }) {
  return <div className="rounded-md border border-dashed border-border bg-card px-6 py-12 text-center"><p className="text-sm text-muted-foreground">{message}</p><Button className="mt-4" onClick={onAdd}><Plus className="size-4" />Adicionar ação</Button></div>;
}

function formatDate(value: string) {
  if (!isValidPdiDate(value)) return "Data inválida";
  return new Intl.DateTimeFormat("pt-BR").format(new Date(`${value}T12:00:00`));
}