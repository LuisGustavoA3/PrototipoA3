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
  updateAssessment,
  addAssessment,
  type Assessment,
  type AssessmentStatus,
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
import { useMentorshipSessions } from "@/modules/mentorias/sessoes/use-mentorship-sessions";
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
  if (section === "Sessões") return <Sessions />;
  if (section === "Documentos") return <Documents editable={editable} />;
  return <Notes editable={editable} />;
}

function Assessments({ editable }: { editable: boolean }) {
  const items = useAssessments();
  const tools = useEvaluationTools();
  const [editing, setEditing] = useState<Assessment | null>(null);
  const [original, setOriginal] = useState("");
  const [error, setError] = useState("");
  return (
    <div className="space-y-4">
      <Button
        disabled={!editable}
        onClick={() => {
          setEditing({ name: "", description: "", status: "not-started" });
          setOriginal("");
          setError("");
        }}
      >
        Associar assessment
      </Button>
      {editing && (
        <form
          className="space-y-3 rounded-md border border-border p-4"
          onSubmit={(event) => {
            event.preventDefault();
            try {
              if (original) updateAssessment(original, editing);
              else addAssessment(editing);
              setEditing(null);
              setError("");
            } catch (error) {
              setError(
                error instanceof Error
                  ? error.message
                  : "Não foi possível salvar.",
              );
            }
          }}
        >
          <label className="block text-sm">
            Nome do assessment
            <select
              required
              className="mt-2 block w-full rounded-md border border-input bg-background p-2"
              value={editing.toolId ?? ""}
              onChange={(event) => {
                const tool = tools.find(
                  (item) => item.id === event.target.value,
                );
                if (tool)
                  setEditing({ ...editing, toolId: tool.id, name: tool.name });
              }}
            >
              <option value="" disabled>
                Selecione a ferramenta
              </option>
              {tools
                .filter((tool) => tool.active || tool.id === editing.toolId)
                .map((tool) => (
                  <option key={tool.id} value={tool.id}>
                    {tool.name}
                  </option>
                ))}
            </select>
          </label>
          <label className="block text-sm">
            Descrição do assessment
            <Textarea
              value={editing.description}
              onChange={(event) =>
                setEditing({ ...editing, description: event.target.value })
              }
            />
          </label>
          <label className="block text-sm">
            Situação do assessment
            <select
              className="ml-3 rounded-md border border-input bg-background p-2"
              value={editing.status}
              onChange={(event) =>
                setEditing({
                  ...editing,
                  status: event.target.value as AssessmentStatus,
                })
              }
            >
              <option value="completed">Resultado disponível</option>
              <option value="processing">Resultado em processamento</option>
              <option value="not-started">Teste ainda não realizado</option>
            </select>
          </label>
          {error && (
            <p role="alert" className="text-destructive">
              {error}
            </p>
          )}
          <div className="flex gap-2">
            <Button type="submit">Salvar assessment</Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => setEditing(null)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      )}
      {items.map((item) => (
        <article
          key={item.name}
          className="space-y-3 rounded-md border border-border p-4"
        >
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-sm text-muted-foreground">{item.description}</p>
          <p className="text-sm">
            {item.status === "completed"
              ? "Resultado disponível"
              : item.status === "processing"
                ? "Resultado em processamento"
                : "Teste ainda não realizado"}
          </p>
          <Button
            variant="outline"
            disabled={!editable}
            onClick={() => {
              setEditing({ ...item });
              setOriginal(item.name);
              setError("");
            }}
          >
            Editar assessment<span className="sr-only"> {item.name}</span>
          </Button>
        </article>
      ))}
    </div>
  );
}

function Journey({ editable }: { editable: boolean }) {
  const items = useJourneyItems();
  const [section, setSection] = useState<Section>("Entregáveis");
  const [text, setText] = useState("");
  return (
    <div className="space-y-5">
      <form
        className="flex flex-wrap gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          addJourneyItem(section, text);
          setText("");
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
        <Button disabled={!editable || !text.trim()} type="submit">
          Adicionar item
        </Button>
      </form>
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

function Sessions() {
  const { sessions, loading, error, reload } = useMentorshipSessions();
  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        disabled={loading}
        onClick={() => void reload()}
      >
        Atualizar sessões
      </Button>
      {loading && <p role="status">Carregando sessões…</p>}
      {error && <p role="alert">{error}</p>}
      {sessions.map((session) => (
        <article
          key={session.mondaySubitemId}
          className="rounded-md border border-border p-4"
        >
          <h3 className="font-semibold">{session.name}</h3>
          <p className="text-sm">
            {session.status ?? "Não informado"} ·{" "}
            {session.scheduledDate ?? "Sem data prevista"}
          </p>
          <p className="text-sm text-muted-foreground">
            Consultor: {session.consultant.join(", ") || "Não informado"}
          </p>
        </article>
      ))}
      {!loading && !error && !sessions.length && (
        <EmptySection>Nenhuma sessão sincronizada.</EmptySection>
      )}
    </div>
  );
}
function Documents({ editable }: { editable: boolean }) {
  const files = useSharedFiles();
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
          });
          setSelected(null);
          setError("");
        }}
      >
        Adicionar documento
      </Button>
      {editing && (
        <form
          className="space-y-3 rounded-md border border-border p-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (!editing.id && !selected) {
              setError("Selecione um arquivo.");
              return;
            }
            const extension = selected?.name.split(".").pop()?.toLowerCase();
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
              setError("Use um formato de documento suportado com até 10 MB.");
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
      {files.map((file) => (
        <article
          key={file.id}
          className="space-y-2 rounded-md border border-border p-4"
        >
          <h3 className="font-semibold">{file.name}</h3>
          <p className="text-sm">{file.description}</p>
          <p className="text-xs text-muted-foreground">
            {file.author} · {file.dateLabel} ·{" "}
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
          {file.contentUrl && (
            <a
              className="ml-4 text-sm text-primary"
              href={file.contentUrl}
              download={file.name}
            >
              Baixar documento
            </a>
          )}
        </article>
      ))}
    </div>
  );
}
function Notes({ editable }: { editable: boolean }) {
  const notes = useMentorNotes();
  const [id, setId] = useState("");
  const [text, setText] = useState("");
  const [shared, setShared] = useState(false);
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Anotações privadas por padrão. Somente as compartilhadas aparecem na
        Jornada do mentorado.
      </p>
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          saveMentorNote({ id: id || crypto.randomUUID(), text, shared });
          setId("");
          setText("");
          setShared(false);
        }}
      >
        <label className="block text-sm">
          Anotação do mentor
          <Textarea
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
        <Button type="submit" disabled={!editable || !text.trim()}>
          Salvar anotação
        </Button>
      </form>
      {notes.map((note) => (
        <article
          key={note.id}
          className="space-y-2 rounded-md border border-border p-4"
        >
          <p className="whitespace-pre-line text-sm">{note.text}</p>
          <p className="text-xs text-muted-foreground">
            {note.shared ? "Compartilhada com mentorado" : "Privada"}
          </p>
          <Button
            variant="outline"
            disabled={!editable}
            onClick={() => {
              setId(note.id);
              setText(note.text);
              setShared(note.shared);
            }}
          >
            Editar anotação
          </Button>
        </article>
      ))}
    </div>
  );
}
