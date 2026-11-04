import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { assessmentImages } from "@/modules/mentorias/assessment/assessment-images";
import { useState } from "react";
import { CheckCircle2, XCircle, ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useEvaluationTools,
  type EvaluationTool,
} from "@/modules/mentorias/assessment/evaluation-tools";
import { EvaluationToolEditor } from "../components/EvaluationToolEditor";
import { ManagementShell, EmptySection } from "../components/ManagementShell";

export default function EvaluationToolsPage() {
  const tools = useEvaluationTools();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<EvaluationTool | null>(null);
  const [message, setMessage] = useState("");
  const filtered = tools.filter((tool) =>
    tool.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
  );
  return (
    <ManagementShell
      title="Ferramentas de Avaliação"
      description="Cadastro e manutenção do catálogo de assessments."
    >
      <div className="flex flex-wrap gap-3">
        <Input
          aria-label="Buscar ferramentas"
          className="flex-1"
          placeholder="Buscar ferramenta"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Button
          onClick={() => {
            setEditing({
              id: crypto.randomUUID(),
              name: "",
              image: "",
              active: true,
              free: false,
            });
            setMessage("");
          }}
        >
          Adicionar ferramenta
        </Button>
      </div>
      <Dialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editing?.name ? "Editar ferramenta" : "Adicionar ferramenta"}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <EvaluationToolEditor
              key={editing.id}
              tool={editing}
              onClose={() => setEditing(null)}
              onSaved={() => setMessage("Ferramenta salva.")}
            />
          )}
        </DialogContent>
      </Dialog>
      {message && <p role="status">{message}</p>}
      <div className="overflow-x-auto rounded-md border border-border bg-card">
        <table className="w-full min-w-[650px] text-left text-sm">
          <caption className="sr-only">Ferramentas de Avaliação</caption>
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {["Imagem", "Nome", "Ativo", "Gratuito", "Ação"].map((label) => (
                <th key={label} scope="col" className="px-5 py-3 font-medium">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((tool) => (
              <tr
                key={tool.id}
                className="border-b border-border last:border-0"
              >
                <td className="px-5 py-4">
                  {tool.image || assessmentImages[tool.id] ? (
                    <img
                      src={
                        tool.image ||
                        `${import.meta.env.BASE_URL}images/${encodeURIComponent(assessmentImages[tool.id]!)}`
                      }
                      alt={`Imagem de ${tool.name}`}
                      className="size-16 rounded-md border border-border bg-white p-1 object-contain"
                    />
                  ) : (
                    <span className="flex size-16 items-center justify-center rounded-md border border-dashed border-border bg-muted">
                      <ImageIcon
                        aria-hidden="true"
                        className="size-6 text-muted-foreground"
                      />
                      <span className="sr-only">Sem imagem</span>
                    </span>
                  )}
                </td>
                <th scope="row" className="px-5 py-4 font-medium">
                  {tool.name}
                </th>
                <td className="px-5 py-4">
                  <Flag value={tool.active} />
                </td>
                <td className="px-5 py-4">
                  <Flag value={tool.free} />
                </td>
                <td className="px-5 py-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditing({ ...tool });
                      setMessage("");
                    }}
                  >
                    Editar<span className="sr-only"> {tool.name}</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!filtered.length && (
        <EmptySection>Nenhuma ferramenta encontrada.</EmptySection>
      )}
    </ManagementShell>
  );
}
function Flag({ value }: { value: boolean }) {
  return value ? (
    <span className="inline-flex items-center gap-2 text-green-700">
      <CheckCircle2 aria-hidden="true" className="size-4" />
      Sim
    </span>
  ) : (
    <span className="inline-flex items-center gap-2 text-red-700">
      <XCircle aria-hidden="true" className="size-4" />
      Não
    </span>
  );
}
