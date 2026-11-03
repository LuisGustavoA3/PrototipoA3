import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  useCompanyTools,
  saveCompanyTools,
} from "@/modules/mentorias/assessment/company-tool-contracts";
import { useEvaluationTools } from "@/modules/mentorias/assessment/evaluation-tools";

export function CompanyToolsEditor({ companyId }: { companyId: string }) {
  const tools = useEvaluationTools();
  const saved = useCompanyTools(companyId);
  const [draft, setDraft] = useState(saved);
  const [message, setMessage] = useState("");
  return (
    <form
      className="space-y-4 rounded-md border border-border bg-card p-5"
      onSubmit={(event) => {
        event.preventDefault();
        try {
          saveCompanyTools(companyId, draft);
          setMessage("Ferramentas contratadas atualizadas.");
        } catch {
          setMessage("Não foi possível salvar as ferramentas contratadas.");
        }
      }}
    >
      <h2 className="text-lg font-semibold">
        Ferramentas de avaliação contratadas
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {tools.map((tool) => (
          <label key={tool.id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.includes(tool.id)}
              onChange={(event) => {
                setDraft(
                  event.target.checked
                    ? [...draft, tool.id]
                    : draft.filter((id) => id !== tool.id),
                );
                setMessage("");
              }}
            />
            {tool.name}
          </label>
        ))}
      </div>
      <Button type="submit">Salvar ferramentas contratadas</Button>
      {message && (
        <p role="status" className="text-sm">
          {message}
        </p>
      )}
    </form>
  );
}
