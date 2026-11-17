import { Switch } from "@/components/ui/switch";
import { assessmentImages } from "@/modules/mentorias/assessment/assessment-images";
import { MentorNoteCard } from "@/modules/mentorias/components/MentorNoteCard";
import { CURRENT_USER_COMPANY_ID } from "@/shared/lib/current-user-company";
import { useCompanyTools } from "@/modules/mentorias/assessment/company-tool-contracts";
import { FilePreview } from "@/modules/mentorias/arquivos-compartilhados/FilePreview";
import { downloadSharedFile } from "@/modules/mentorias/arquivos-compartilhados/file-preview-data";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEvaluationTools } from "@/modules/mentorias/assessment/evaluation-tools";
import {
  useMentorNotes,
  saveMentorNote,
} from "@/modules/mentorias/trilhas/mentor-notes-store";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useAssessments,
  getAssessmentDisplayStatus,
  updateAssessment,
  associateAssessment,
  disassociateAssessment,
  type Assessment,
} from "@/modules/mentorias/assessment/assessment-store";
import {
  useJourneyItems,
  addJourneyItem,
  updateJourneyItem,
  type Section,
} from "@/modules/mentorias/jornada/journey-store";
import {
  usePdiActions,
  updatePdiAction,
  addPdiAction,
  isValidPdiDateRange,
  type PdiAction,
  type ActionStatus,
} from "@/modules/mentorias/pdi/pdi-store";
import {
  useSharedFiles,
  addSharedFile,
  updateSharedFile,
  type SharedFile,
} from "@/modules/mentorias/arquivos-compartilhados/shared-files-store";
import { MentorshipSessionsBoard } from "@/modules/mentorias/sessoes/MentorshipSessionsBoard";
import { EmptySection } from "./ManagementShell";

export function LuisTrailContent({
  section,
  editable,
}: {
  section: string;
  editable: boolean;
}) {
  if (section === "Assessments") return <Assessments editable={editable} />;
  if (section === "Jornada") return <Journey editable={editable} />;
  if (section === "PDI") return <Pdi editable={editable} />;
  if (section === "Sessões") return <MentorshipSessionsBoard readOnly />;
  if (section === "Documentos") return <Documents editable={editable} />;
  return <Notes editable={editable} />;
}

function Assessments({ editable }: { editable: boolean }) {
  const items = useAssessments();
  const tools = useEvaluationTools();
  const contracted = useCompanyTools(CURRENT_USER_COMPANY_ID);
  const [upload, setUpload] = useState<Assessment | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tools
          .filter((tool) => contracted.includes(tool.id))
          .map((tool) => {
            const item = items.find((entry) => entry.toolId === tool.id);
            const image =
              tool.image ||
              (assessmentImages[tool.id]
                ? `${import.meta.env.BASE_URL}images/${encodeURIComponent(assessmentImages[tool.id]!)}`
                : "");
            return (
              <article
                key={tool.id}
                className="space-y-4 rounded-md border border-border bg-card p-5"
              >
                <div className="flex items-center gap-3">
                  {image ? (
                    <img
                      src={image}
                      alt={tool.name}
                      className="size-16 shrink-0 rounded-md border bg-white p-1 object-contain"
                    />
                  ) : (
                    <span
                      className="flex size-16 shrink-0 items-center justify-center rounded-md border bg-muted text-xl"
                      aria-hidden="true"
                    >
                      {tool.name.slice(0, 1)}
                    </span>
                  )}
                  <h3 className="font-semibold">{tool.name}</h3>
                </div>
                <label className="flex items-center justify-between gap-3 text-sm">
                  <span>{item ? "Associado" : "Não associado"}</span>
                  <Switch
                    aria-label={`Associar ${tool.name}`}
                    checked={!!item}
                    disabled={!editable || (!item && !tool.active)}
                    onCheckedChange={(checked) => {
                      if (checked) associateAssessment(tool.id);
                      else if (item) disassociateAssessment(item.name);
                    }}
                  />
                </label>
                {item && (
                  <>
                    <label className="flex items-center justify-between gap-3 text-sm">
                      <span>
                        {(item.performed ?? item.status !== "not-started")
                          ? "Feito"
                          : "Não feito"}
                      </span>
                      <Switch
                        aria-label={`Assessment feito: ${tool.name}`}
                        checked={
                          item.performed ?? item.status !== "not-started"
                        }
                        disabled={!editable}
                        onCheckedChange={(checked) =>
                          updateAssessment(item.name, { performed: checked })
                        }
                      />
                    </label>
                    <p className="text-sm text-muted-foreground">
                      {getAssessmentDisplayStatus(item) === "completed"
                        ? "Resultado enviado"
                        : getAssessmentDisplayStatus(item) === "processing"
                          ? "Aguardando resultado"
                          : "Teste ainda não realizado"}
                    </p>
                    <Button
                      variant="outline"
                      disabled={!editable}
                      onClick={() => {
                        setUpload(item);
                        setFile(null);
                        setError("");
                      }}
                      aria-label={`Enviar resultado ${tool.name}`}
                    >
                      Enviar resultado
                    </Button>
                    {item.resultUrl && (
                      <a
                        className="block text-sm text-primary underline"
                        href={item.resultUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Ver arquivo do resultado
                      </a>
                    )}
                  </>
                )}
              </article>
            );
          })}
      </div>
      <Dialog
        open={upload !== null}
        onOpenChange={(open) => !open && setUpload(null)}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Enviar resultado · {upload?.name}</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (!upload || !file) return;
              updateAssessment(upload.name, {
                resultUrl: URL.createObjectURL(file),
                resultFileName: file.name,
                performed: true,
                status: "completed",
              });
              setUpload(null);
              setFile(null);
            }}
          >
            <label className="block space-y-2 text-sm">
              Arquivo do resultado (PDF, PNG ou JPG, até 10 MB)
              <Input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(event) => {
                  const selected = event.target.files?.[0];
                  setFile(null);
                  if (!selected) return;
                  if (
                    selected.size > 10 * 1024 * 1024 ||
                    !["application/pdf", "image/png", "image/jpeg"].includes(
                      selected.type,
                    )
                  ) {
                    setError("Envie PDF, PNG ou JPG de até 10 MB.");
                    return;
                  }
                  setError("");
                  setFile(selected);
                }}
              />
            </label>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setUpload(null)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={!file}>
                Salvar resultado
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Journey({ editable }: { editable: boolean }) {
  const items = useJourneyItems();
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<Section>("Entregáveis");
  const [text, setText] = useState("");
  return (
    <div className="space-y-5">
      <Button
        disabled={!editable}
        onClick={() => {
          setText("");
          setOpen(true);
        }}
      >
        Adicionar item
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adicionar item da Jornada</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              addJourneyItem(section, text);
              setText("");
              setOpen(false);
            }}
          >
            <select
              disabled={!editable}
              aria-label="Seção da Jornada"
              className="rounded-md border border-input bg-background p-2 text-sm"
              value={section}
              onChange={(event) => setSection(event.target.value as Section)}
            >
              {Object.keys(items).map((key) => (
                <option key={key}>{key}</option>
              ))}
            </select>
            <Input
              disabled={!editable}
              aria-label="Novo item da Jornada"
              placeholder="Descreva o item"
              required
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button disabled={!editable || !text.trim()} type="submit">
                Salvar item
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {(Object.entries(items) as [Section, (typeof items)[Section]][]).map(
        ([key, entries]) => (
          <section key={key} className="space-y-3">
            <h3 className="font-semibold">{key}</h3>
            {entries.length ? (
              entries.map((item) => (
                <JourneyEditor
                  key={item.id}
                  id={item.id}
                  section={key}
                  title={item.title}
                  editable={editable}
                />
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum item registrado.
              </p>
            )}
          </section>
        ),
      )}
    </div>
  );
}
function JourneyEditor({
  id,
  section,
  title,
  editable,
}: {
  id: number;
  section: Section;
  title: string;
  editable: boolean;
}) {
  const [text, setText] = useState(title);
  return (
    <form
      className="flex gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        updateJourneyItem(section, id, text);
      }}
    >
      <Input
        disabled={!editable}
        aria-label={`Editar item ${title}`}
        required
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <Button type="submit" disabled={!editable || !text.trim()}>
        Salvar item
      </Button>
    </form>
  );
}

function Pdi({ editable }: { editable: boolean }) {
  const actions = usePdiActions();
  const [editing, setEditing] = useState<PdiAction | null>(null);
  const [error, setError] = useState("");
  function field(key: keyof PdiAction, value: string) {
    if (editing) setEditing({ ...editing, [key]: value });
  }
  return (
    <div className="space-y-4">
      <Button
        disabled={!editable}
        onClick={() => {
          setEditing({
            id: "",
            name: "",
            competency: "",
            startDate: "",
            endDate: "",
            status: "Não iniciado",
            details: "",
            evidence: "",
            author: "A3",
            createdAt: "",
          });
          setError("");
        }}
      >
        Adicionar ação
      </Button>
      <Dialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adicionar ação</DialogTitle>
          </DialogHeader>
          {editing && (
            <form
              className="space-y-3 rounded-md border border-primary/30 p-4"
              onSubmit={(event) => {
                event.preventDefault();
                if (!isValidPdiDateRange(editing.startDate, editing.endDate)) {
                  setError(
                    "Informe datas válidas, com término a partir do início.",
                  );
                  return;
                }
                if (editing.id) updatePdiAction(editing.id, editing);
                else addPdiAction(editing);
                setEditing(null);
              }}
            >
              <label className="block text-sm">
                Ação
                <Input
                  required
                  value={editing.name}
                  onChange={(event) => field("name", event.target.value)}
                />
              </label>
              <label className="block text-sm">
                Competência
                <Input
                  required
                  value={editing.competency}
                  onChange={(event) => field("competency", event.target.value)}
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm">
                  Início
                  <Input
                    required
                    type="date"
                    value={editing.startDate}
                    onChange={(event) => field("startDate", event.target.value)}
                  />
                </label>
                <label className="text-sm">
                  Término
                  <Input
                    required
                    type="date"
                    value={editing.endDate}
                    onChange={(event) => field("endDate", event.target.value)}
                  />
                </label>
              </div>
              <label className="block text-sm">
                Situação da ação
                <select
                  className="ml-3 rounded-md border border-input bg-background p-2"
                  value={editing.status}
                  onChange={(event) =>
                    field("status", event.target.value as ActionStatus)
                  }
                >
                  {[
                    "Concluído",
                    "Em andamento",
                    "Não iniciado",
                    "Parado",
                    "Cancelado",
                    "Atrasado",
                  ].map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                Detalhes
                <Textarea
                  value={editing.details}
                  onChange={(event) => field("details", event.target.value)}
                />
              </label>
              <label className="block text-sm">
                Evidência
                <Textarea
                  value={editing.evidence}
                  onChange={(event) => field("evidence", event.target.value)}
                />
              </label>
              {error && (
                <p role="alert" className="text-destructive">
                  {error}
                </p>
              )}
              <div className="flex gap-2">
                <Button type="submit">Salvar ação</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditing(null)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
      {actions.map((action) => (
        <article
          className="space-y-2 rounded-md border border-border p-4"
          key={action.id}
        >
          <h3 className="font-semibold">{action.name}</h3>
          <p className="text-sm text-muted-foreground">
            {action.competency} · {action.status} · {action.startDate} a{" "}
            {action.endDate}
          </p>
          <p className="text-sm">{action.details}</p>
          <p className="text-sm">
            Evidência: {action.evidence || "Não informada"}
          </p>
          <p className="text-xs text-muted-foreground">
            Autoria: {action.author}
          </p>
          <Button
            variant="outline"
            disabled={!editable}
            onClick={() => {
              setEditing({ ...action });
              setError("");
            }}
          >
            Editar ação<span className="sr-only"> {action.name}</span>
          </Button>
        </article>
      ))}
    </div>
  );
}

function Documents({ editable }: { editable: boolean }) {
  const files = useSharedFiles();
  const [preview, setPreview] = useState<SharedFile | null>(null);
  const [editing, setEditing] = useState<SharedFile | null>(null);
  const [selected, setSelected] = useState<File | null>(null);
  const [error, setError] = useState("");
  return (
    <div className="space-y-3">
      <Button
        disabled={!editable}
        onClick={() => {
          setEditing({
            id: "",
            name: "",
            description: "",
            author: "A3",
            date: "",
            dateLabel: "",
            direction: "received",
            format: "pdf",
            allowDownload: true,
          });
          setSelected(null);
          setError("");
        }}
      >
        Adicionar documento
      </Button>
      <Dialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editing?.id ? "Editar documento" : "Enviar documento"}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <form
              className="space-y-4 py-2"
              onSubmit={(event) => {
                event.preventDefault();
                if (!editing.id && !selected) {
                  setError("Selecione um arquivo.");
                  return;
                }
                const extension = selected?.name
                  .split(".")
                  .pop()
                  ?.toLowerCase();
                if (
                  selected &&
                  (selected.size > 10 * 1024 * 1024 ||
                    ![
                      "pdf",
                      "doc",
                      "docx",
                      "txt",
                      "xls",
                      "xlsx",
                      "csv",
                      "ppt",
                      "pptx",
                      "png",
                      "jpg",
                      "jpeg",
                      "zip",
                      "mp4",
                      "mp3",
                    ].includes(extension ?? ""))
                ) {
                  setError(
                    "Use um formato de documento suportado com até 10 MB.",
                  );
                  return;
                }
                const content = selected
                  ? { contentUrl: URL.createObjectURL(selected) }
                  : {};
                const now = new Date();
                if (editing.id)
                  updateSharedFile(editing.id, {
                    name: editing.name,
                    description: editing.description,
                    allowDownload: editing.allowDownload !== false,
                    ...content,
                    ...(selected
                      ? { format: extension as SharedFile["format"] }
                      : {}),
                  });
                else
                  addSharedFile({
                    ...editing,
                    ...content,
                    id: crypto.randomUUID(),
                    format: extension as SharedFile["format"],
                    date: now.toISOString().slice(0, 10),
                    dateLabel: now.toLocaleDateString("pt-BR"),
                  });
                setEditing(null);
                setSelected(null);
                setError("");
              }}
            >
              <label className="block text-sm">
                Arquivo (até 10 MB)
                <Input
                  type="file"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    setSelected(file);
                    if (file) setEditing({ ...editing, name: file.name });
                  }}
                />
              </label>
              <label className="block text-sm">
                Nome do documento
                <Input
                  required
                  value={editing.name}
                  onChange={(event) =>
                    setEditing({ ...editing, name: event.target.value })
                  }
                />
              </label>
              <label className="block text-sm">
                Descrição do documento
                <Textarea
                  value={editing.description}
                  onChange={(event) =>
                    setEditing({ ...editing, description: event.target.value })
                  }
                />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.allowDownload !== false}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      allowDownload: event.target.checked,
                    })
                  }
                />
                Permitir download
              </label>
              {error && (
                <p role="alert" className="text-destructive">
                  {error}
                </p>
              )}
              <div className="flex gap-2">
                <Button type="submit">Salvar documento</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditing(null)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={preview !== null}
        onOpenChange={(open) => !open && setPreview(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>{preview?.name}</DialogTitle>
          </DialogHeader>
          {preview && (
            <>
              <FilePreview file={preview} />
              <DialogFooter>
                <Button
                  variant="outline"
                  disabled={preview.allowDownload === false}
                  onClick={() => downloadSharedFile(preview)}
                >
                  Baixar documento
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      {files.map((file) => (
        <article
          key={file.id}
          className="space-y-2 rounded-md border border-border p-4"
        >
          <h3 className="font-semibold">{file.name}</h3>
          <p className="text-sm">{file.description}</p>
          <p className="text-xs text-muted-foreground">
            Autor: {file.author} · Data de compartilhamento: {file.dateLabel} ·{" "}
            {file.direction === "received"
              ? "Recebido pelo mentorado"
              : "Enviado pelo mentorado"}
          </p>
          <Button
            variant="outline"
            disabled={!editable}
            onClick={() => {
              setEditing({ ...file });
              setSelected(null);
              setError("");
            }}
          >
            Editar documento<span className="sr-only"> {file.name}</span>
          </Button>
          <Button variant="outline" onClick={() => setPreview(file)}>
            Visualizar documento<span className="sr-only"> {file.name}</span>
          </Button>
          <Button
            variant="outline"
            disabled={file.allowDownload === false}
            onClick={() => downloadSharedFile(file)}
          >
            Baixar documento
          </Button>
          <p className="text-xs text-muted-foreground">
            {file.allowDownload === false
              ? "Download desabilitado"
              : "Download permitido"}
          </p>
        </article>
      ))}
    </div>
  );
}
function Notes({ editable }: { editable: boolean }) {
  const notes = useMentorNotes();
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [text, setText] = useState("");
  const [shared, setShared] = useState(false);
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Anotações privadas por padrão. Somente as compartilhadas aparecem na
        Jornada do mentorado.
      </p>
      <Button
        disabled={!editable}
        onClick={() => {
          setId("");
          setText("");
          setShared(false);
          setOpen(true);
        }}
      >
        Nova anotação
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {id ? "Editar anotação" : "Nova anotação"}
            </DialogTitle>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              saveMentorNote({ id: id || crypto.randomUUID(), text, shared });
              setId("");
              setText("");
              setShared(false);
              setOpen(false);
            }}
          >
            <label className="block text-sm">
              Anotação
              <Textarea
                className="min-h-64 resize-y"
                disabled={!editable}
                required
                value={text}
                onChange={(event) => setText(event.target.value)}
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                disabled={!editable}
                checked={shared}
                onChange={(event) => setShared(event.target.checked)}
              />
              Compartilhar com mentorado
            </label>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={!editable || !text.trim()}>
                Salvar anotação
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <div className="grid gap-4 sm:grid-cols-2">
        {notes.map((note, index) => (
          <MentorNoteCard
            key={note.id}
            text={note.text}
            shared={note.shared}
            index={index}
            {...(editable
              ? {
                  onEdit: () => {
                    setOpen(true);
                    setId(note.id);
                    setText(note.text);
                    setShared(note.shared);
                  },
                }
              : {})}
          />
        ))}
      </div>
    </div>
  );
}
