import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  saveEvaluationTool,
  type EvaluationTool,
} from "@/modules/mentorias/assessment/evaluation-tools";

export function EvaluationToolEditor({
  tool,
  onClose,
  onSaved,
}: {
  tool: EvaluationTool;
  onClose: () => void;
  onSaved?: () => void;
}) {
  const [draft, setDraft] = useState(tool);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <form
      aria-label="Editar ferramenta de avaliação"
      className="space-y-4 rounded-md border border-primary/30 bg-card p-5"
      onSubmit={(event) => {
        event.preventDefault();
        try {
          saveEvaluationTool(draft);
          onSaved?.();
          onClose();
        } catch (error) {
          setError(
            error instanceof Error ? error.message : "Não foi possível salvar.",
          );
        }
      }}
    >
      <h2 className="font-semibold">Dados da ferramenta</h2>
      <label className="block space-y-2 text-sm">
        <span>Nome da ferramenta</span>
        <Input
          required
          value={draft.name}
          onChange={(event) => setDraft({ ...draft, name: event.target.value })}
        />
      </label>
      <label className="block space-y-2 text-sm">
        <span>Imagem da ferramenta (URL HTTPS)</span>
        <Input
          value={draft.image.startsWith("data:") ? "" : draft.image}
          onChange={(event) =>
            setDraft({ ...draft, image: event.target.value })
          }
        />
      </label>
      <label className="block space-y-2 text-sm">
        <span>Enviar imagem (PNG, JPG ou WebP, até 1 MB)</span>
        <Input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            if (
              !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
              file.size > 1024 * 1024
            ) {
              setError("Use PNG, JPG ou WebP de até 1 MB.");
              return;
            }
            setError("");
            setLoading(true);
            const reader = new FileReader();
            reader.onload = () => {
              setDraft((current) => ({
                ...current,
                image: String(reader.result),
              }));
              setLoading(false);
            };
            reader.onerror = () => {
              setError("Não foi possível ler a imagem.");
              setLoading(false);
            };
            reader.readAsDataURL(file);
          }}
        />
      </label>
      {draft.image && (
        <div className="flex items-center gap-3">
          <img
            src={draft.image}
            alt="Prévia da ferramenta"
            className="h-20 w-20 rounded-md border border-border object-contain"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => setDraft({ ...draft, image: "" })}
          >
            Remover imagem
          </Button>
        </div>
      )}
      <div className="flex gap-6 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={draft.active}
            onChange={(event) =>
              setDraft({ ...draft, active: event.target.checked })
            }
          />
          Ferramenta ativa
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={draft.free}
            onChange={(event) =>
              setDraft({ ...draft, free: event.target.checked })
            }
          />
          Ferramenta gratuita
        </label>
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          Salvar ferramenta
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
