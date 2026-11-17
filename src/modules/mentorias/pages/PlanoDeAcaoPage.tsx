import { MentoriasBreadcrumb } from "@/modules/mentorias/components/MentoriasBreadcrumb";
import { CalendarDays, ChevronRight, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { useSelectedTrail } from "@/modules/mentorias/trilhas/use-selected-trail";
import { TrailEmptyState } from "@/modules/mentorias/trilhas/TrailEmptyState";

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
  isValidPdiDateRange,
} from "@/modules/mentorias/pdi/pdi-store";
import { cn } from "@/lib/utils";

const competencies = [
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
] as const;
type Competency = (typeof competencies)[number];

type CompetencyAxis = "Negócio" | "Equipe" | "Mercado" | "Indivíduo";

const competencyAxis: Record<Competency, CompetencyAxis> = {
  Autoconhecimento: "Indivíduo",
  "Gestão do Tempo": "Indivíduo",
  "Planejamento e Organização": "Indivíduo",
  Proatividade: "Indivíduo",
  Resiliência: "Indivíduo",

  Comunicação: "Equipe",
  "Liderança e Gestão": "Equipe",
  "Relacionamento Interpessoal": "Equipe",
  Negociação: "Equipe",

  "Capacidade Analítica": "Negócio",
  "Foco em Resultados": "Negócio",
  "Resolução de Problemas": "Negócio",
  "Tomada de Decisão": "Negócio",
  "Visão Integrada": "Negócio",

  "Visão de Negócio": "Mercado",
  "Visão Estratégica": "Mercado",
  "Inovação e Criatividade": "Mercado",
};

const statuses: ActionStatus[] = [
  "Concluído",
  "Em andamento",
  "Não iniciado",
  "Parado",
  "Cancelado",
  "Atrasado",
];

const statusStyles: Record<ActionStatus, string> = {
  Concluído: "bg-emerald-100 text-emerald-700",
  "Em andamento": "bg-blue-100 text-blue-700",
  "Não iniciado": "bg-muted text-muted-foreground",
  Parado: "bg-amber-100 text-amber-700",
  Cancelado: "bg-red-100 text-red-700",
  Atrasado: "bg-orange-100 text-orange-700",
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

export function PlanoDeAcaoPage() {
  const [sidebarOpen, toggleSidebar] = useSidebarOpen();
  const actions = usePdiActions();
  const { selectedTrail, hasContent } = useSelectedTrail();
  const [search, setSearch] = useState("");
  const [axisFilter, setAxisFilter] = useState<"Todos" | CompetencyAxis>(
    "Todos",
  );
  const [statusFilter, setStatusFilter] = useState<"Todos" | ActionStatus>(
    "Todos",
  );
  const [modal, setModal] = useState<"create" | "details" | "edit" | null>(
    null,
  );
  const [selectedAction, setSelectedAction] = useState<PdiAction | null>(null);
  const [form, setForm] = useState<FormValues>(emptyForm);

  const filteredActions = useMemo(() => {
    const query = search.toLowerCase().trim();

    return [...actions]
      .filter(
        (action) =>
          axisFilter === "Todos" ||
          competencyAxis[action.competency as Competency] === axisFilter,
      )
      .filter(
        (action) => statusFilter === "Todos" || action.status === statusFilter,
      )
      .filter((action) =>
        [action.name, action.author, action.competency].some((value) =>
          value.toLowerCase().includes(query),
        ),
      )
      .sort((first, second) => second.createdAt.localeCompare(first.createdAt));
  }, [actions, search, axisFilter, statusFilter]);

  const openCreate = () => {
    setForm(emptyForm);
    setSelectedAction(null);
    setModal("create");
  };

  const openDetails = (action: PdiAction) => {
    setSelectedAction(action);
    setModal("details");
  };

  const openEdit = (action: PdiAction) => {
    setSelectedAction(action);
    setForm({
      name: action.name,
      competency: action.competency,
      startDate: action.startDate,
      endDate: action.endDate,
      status: action.status,
      details: action.details,
      evidence: action.evidence,
    });
    setModal("edit");
  };
  const saveAction = () => {
    if (
      !hasContent ||
      !form.name.trim() ||
      !form.competency ||
      !isValidPdiDate(form.startDate) ||
      !isValidPdiDate(form.endDate) ||
      !isValidPdiDateRange(form.startDate, form.endDate)
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
        <MentoriasBreadcrumb />
        <div className="space-y-6 p-6">
          <PageHeader
            section="Meu Desenvolvimento"
            title="Plano de Ação (PDI)"
            description="Crie, organize e acompanhe suas ações de desenvolvimento em um só lugar."
          />

          {!hasContent ? (
            <TrailEmptyState trailName={selectedTrail} />
          ) : (
            <>
              <section className="flex flex-col gap-4 rounded-md border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="label-caps text-sm text-foreground">
                    Adicionar ação
                  </h2>
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

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={axisFilter}
                      onChange={(event) =>
                        setAxisFilter(
                          event.target.value as "Todos" | CompetencyAxis,
                        )
                      }
                      aria-label="Filtrar por eixo"
                      className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
                    >
                      <option value="Todos">Todos os eixos</option>
                      <option value="Negócio">Negócio</option>
                      <option value="Equipe">Equipe</option>
                      <option value="Mercado">Mercado</option>
                      <option value="Indivíduo">Indivíduo</option>
                    </select>

                    <select
                      value={statusFilter}
                      onChange={(event) =>
                        setStatusFilter(
                          event.target.value as "Todos" | ActionStatus,
                        )
                      }
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
                </div>
                {actions.length === 0 ? (
                  <EmptyState
                    onAdd={openCreate}
                    message="Você ainda não possui ações no seu PDI."
                  />
                ) : filteredActions.length === 0 ? (
                  <EmptyState
                    onAdd={() => {
                      setSearch("");
                      setAxisFilter("Todos");
                      setStatusFilter("Todos");
                    }}
                    message="Nenhuma ação encontrada."
                  />
                ) : (
                  <div className="space-y-8">
                    <section
                      aria-labelledby="pdi-table-heading"
                      className="space-y-4"
                    >
                      <h2
                        id="pdi-table-heading"
                        className="text-lg font-semibold"
                      >
                        Ações em tabela
                      </h2>
                      <div className="overflow-x-auto rounded-md border border-border bg-card">
                        <table className="w-full min-w-[1500px] text-left text-sm">
                          <caption className="sr-only">
                            Todas as informações das ações do PDI
                          </caption>
                          <thead className="bg-muted text-muted-foreground">
                            <tr>
                              {[
                                "Ação",
                                "Eixo",
                                "Competência",
                                "Status",
                                "Início",
                                "Fim",
                                "Autor",
                                "Criado em",
                                "Detalhes",
                                "Evidência",
                                "Editar",
                              ].map((label) => (
                                <th
                                  key={label}
                                  scope="col"
                                  className="px-4 py-3 font-medium"
                                >
                                  {label}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {filteredActions.map((action) => (
                              <tr
                                key={action.id}
                                className="border-t border-border align-top"
                              >
                                <th
                                  scope="row"
                                  className="min-w-56 whitespace-pre-wrap break-words px-4 py-4 font-medium"
                                >
                                  {action.name}
                                </th>
                                <td className="px-4 py-4">
                                  {competencyAxis[
                                    action.competency as Competency
                                  ] ?? "—"}
                                </td>
                                <td className="px-4 py-4">
                                  {action.competency}
                                </td>
                                <td className="px-4 py-4">
                                  <span
                                    className={cn(
                                      "inline-block whitespace-nowrap rounded px-2.5 py-1 text-xs",
                                      statusStyles[action.status],
                                    )}
                                  >
                                    {action.status}
                                  </span>
                                </td>
                                <td className="whitespace-nowrap px-4 py-4">
                                  {formatDate(action.startDate)}
                                </td>
                                <td className="whitespace-nowrap px-4 py-4">
                                  {formatDate(action.endDate)}
                                </td>
                                <td className="px-4 py-4">{action.author}</td>
                                <td className="whitespace-nowrap px-4 py-4">
                                  {formatCreatedAt(action.createdAt)}
                                </td>
                                <td className="min-w-64 whitespace-pre-wrap break-words px-4 py-4">
                                  {action.details ||
                                    "Nenhum detalhe informado."}
                                </td>
                                <td className="min-w-64 whitespace-pre-wrap break-words px-4 py-4">
                                  {action.evidence ||
                                    "Nenhuma evidência informada."}
                                </td>
                                <td className="px-4 py-4">
                                  <Button
                                    variant="outline"
                                    onClick={() => openEdit(action)}
                                    aria-label={`Editar ação: ${action.name}`}
                                  >
                                    Editar
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                    <section
                      aria-labelledby="pdi-cards-heading"
                      className="space-y-4"
                    >
                      <h2
                        id="pdi-cards-heading"
                        className="text-lg font-semibold"
                      >
                        Ações em cards
                      </h2>
                      <div className="grid gap-4 md:grid-cols-2">
                        {filteredActions.map((action) => (
                          <ActionCard
                            key={action.id}
                            action={action}
                            onClick={() => openDetails(action)}
                          />
                        ))}
                      </div>
                    </section>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>

      <Dialog
        open={modal !== null}
        onOpenChange={(open) => !open && setModal(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {modal === "details" && selectedAction ? (
            <DetailsContent
              action={selectedAction}
              onEdit={() => openEdit(selectedAction)}
            />
          ) : (
            <ActionForm
              form={form}
              setForm={setForm}
              isEditing={modal === "edit"}
              dateError={
                (form.startDate.length > 0 &&
                  !isValidPdiDate(form.startDate)) ||
                (form.endDate.length > 0 && !isValidPdiDate(form.endDate)) ||
                (form.startDate.length > 0 &&
                  form.endDate.length > 0 &&
                  !isValidPdiDateRange(form.startDate, form.endDate))
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

function ActionCard({
  action,
  onClick,
}: {
  action: PdiAction;
  onClick: () => void;
}) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => event.key === "Enter" && onClick()}
      className="cursor-pointer rounded-md border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30"
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className={cn(
            "label-caps rounded px-2.5 py-1 text-[10px]",
            statusStyles[action.status],
          )}
        >
          {action.status}
        </span>
        <ChevronRight className="size-5 text-muted-foreground" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-foreground">
        {action.name}
      </h2>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        {action.competency in competencyAxis && (
          <span className="label-caps rounded border border-border bg-muted px-2 py-1 text-[10px] text-muted-foreground">
            {competencyAxis[action.competency as Competency]}
          </span>
        )}

        <span className="label-caps text-xs uppercase text-muted-foreground">
          {action.competency}
        </span>
      </div>
      <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
        <CalendarDays className="size-4 text-primary" />
        Prazo: {formatDate(action.startDate)} → {formatDate(action.endDate)}
      </div>
      <div className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
        <p>Criado em {formatCreatedAt(action.createdAt)}</p>
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
  const update = (changes: Partial<FormValues>) =>
    setForm({ ...form, ...changes });
  const invalid =
    !form.name.trim() ||
    !form.competency ||
    !form.startDate ||
    !form.endDate ||
    dateError;
  const dateErrorMessage =
    form.startDate.length > 0 &&
    form.endDate.length > 0 &&
    isValidPdiDate(form.startDate) &&
    isValidPdiDate(form.endDate) &&
    !isValidPdiDateRange(form.startDate, form.endDate)
      ? "A data de fim deve ser igual ou posterior à data de início."
      : dateError
        ? "Informe datas válidas com ano de até 4 dígitos."
        : "";

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEditing ? "Editar ação" : "Nova ação"}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-2 sm:grid-cols-2">
        <Field label="Nome da ação *" className="sm:col-span-2">
          <Input
            value={form.name}
            onChange={(event) => update({ name: event.target.value })}
          />
        </Field>
        <Field label="Competência *">
          <select
            value={form.competency}
            onChange={(event) => update({ competency: event.target.value })}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">Selecione</option>
            {competencies.map((competency) => (
              <option key={competency}>{competency}</option>
            ))}
          </select>
        </Field>
        <Field label="Status *">
          <select
            value={form.status}
            onChange={(event) =>
              update({ status: event.target.value as ActionStatus })
            }
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
          >
            {statuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </Field>
        <Field label="Início *">
          <Input
            type="date"
            max="9999-12-31"
            value={form.startDate}
            onChange={(event) => {
              const newStartDate = event.target.value;

              update({
                startDate: newStartDate,
                endDate:
                  !newStartDate || (form.endDate && form.endDate < newStartDate)
                    ? ""
                    : form.endDate,
              });
            }}
          />
        </Field>
        <Field label="Fim *">
          <Input
            type="date"
            min={form.startDate || undefined}
            max="9999-12-31"
            value={form.endDate}
            disabled={!form.startDate}
            onChange={(event) => update({ endDate: event.target.value })}
          />
        </Field>
        {dateErrorMessage && (
          <p className="text-sm text-destructive sm:col-span-2">
            {dateErrorMessage}
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
          <Field label="Evidência (opcional)" className="sm:col-span-2">
            <textarea
              value={form.evidence}
              onChange={(event) => update({ evidence: event.target.value })}
              className="min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
            />
          </Field>
        )}
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="button" onClick={onSave} disabled={invalid}>
          Salvar
        </Button>
      </DialogFooter>
    </>
  );
}

function DetailsContent({
  action,
  onEdit,
}: {
  action: PdiAction;
  onEdit: () => void;
}) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>{action.name}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-2 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "label-caps inline-flex items-center rounded px-2.5 py-1 text-[10px]",
              statusStyles[action.status],
            )}
          >
            {action.status}
          </span>

          {action.competency in competencyAxis && (
            <span className="label-caps inline-flex items-center rounded border border-border bg-muted px-2 py-1 text-[10px] text-muted-foreground">
              {competencyAxis[action.competency as Competency]}
            </span>
          )}

          <span className="label-caps inline-flex items-center text-xs uppercase text-muted-foreground">
            {action.competency}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Detail label="Início" value={formatDate(action.startDate)} />
          <Detail label="Fim" value={formatDate(action.endDate)} />
          <Detail label="Criado em" value={formatCreatedAt(action.createdAt)} />
          <Detail label="Autor" value={action.author} />
        </div>
        <Detail
          label="Detalhes"
          value={action.details || "Nenhum detalhe informado."}
        />
        {action.evidence && (
          <Detail label="Evidência" value={action.evidence} />
        )}
      </div>
      <DialogFooter>
        <Button type="button" onClick={onEdit}>
          Editar ação
        </Button>
      </DialogFooter>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="label-caps text-[10px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-foreground">{value}</p>
    </div>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="label-caps mb-2 block text-xs text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function EmptyState({
  message,
  onAdd,
}: {
  message: string;
  onAdd: () => void;
}) {
  return (
    <div className="rounded-md border border-dashed border-border bg-card px-6 py-12 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button className="mt-4" onClick={onAdd}>
        <Plus className="size-4" />
        Adicionar ação
      </Button>
    </div>
  );
}

function formatDate(value: string) {
  if (!isValidPdiDate(value)) return "Data inválida";
  return new Intl.DateTimeFormat("pt-BR").format(new Date(`${value}T12:00:00`));
}
function formatCreatedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Data inválida";

  return new Intl.DateTimeFormat("pt-BR").format(date);
}
