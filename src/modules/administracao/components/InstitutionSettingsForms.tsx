import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  saveInstitutionSettings,
  useInstitutionSettings,
  type InstitutionSettings,
} from "@/shared/lib/institution-settings";
import { faqCategories } from "@/modules/mentorias/ajuda/faq-data";

const fields: {
  key: keyof InstitutionSettings["contacts"];
  label: string;
  type?: string;
}[] = [
  { key: "whatsapp", label: "WhatsApp (com código do país)", type: "tel" },
  { key: "phone", label: "Telefone (com código do país)", type: "tel" },
  { key: "email", label: "E-mail", type: "email" },
  { key: "days", label: "Dias de atendimento" },
  { key: "hours", label: "Horário de atendimento" },
  { key: "name", label: "Nome da unidade" },
  { key: "building", label: "Edifício / complemento" },
  { key: "street", label: "Logradouro, número e sala" },
  { key: "city", label: "Bairro, cidade e estado" },
  { key: "postal", label: "CEP e país" },
  { key: "maps", label: "Link do Google Maps", type: "url" },
  { key: "embed", label: "URL de incorporação do Google Maps", type: "url" },
];
export function InstitutionSettingsForms({ section }: { section: string }) {
  const saved = useInstitutionSettings();
  const [draft, setDraft] = useState(() => structuredClone(saved));
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  function submit() {
    try {
      saveInstitutionSettings({
        ...saved,
        ...(section === "Contatos e localização"
          ? { contacts: draft.contacts }
          : section === "Ajuda e FAQ"
            ? { faq: draft.faq }
            : { notifications: draft.notifications }),
      });
      setError("");
      setMessage("Alterações salvas.");
    } catch {
      setMessage("");
      setError(
        "Não foi possível salvar. Confira os campos, os endereços HTTPS do Google Maps e o armazenamento do navegador.",
      );
    }
  }
  return (
    <form
      className="space-y-5"
      onChange={() => {
        setMessage("");
        setError("");
      }}
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      {section === "Contatos e localização" ? (
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <label key={field.key} className="space-y-2 text-sm">
              <span>{field.label}</span>
              <Input
                required
                type={field.type ?? "text"}
                value={draft.contacts[field.key]}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    contacts: {
                      ...draft.contacts,
                      [field.key]: event.target.value,
                    },
                  })
                }
              />
            </label>
          ))}
        </div>
      ) : section === "Ajuda e FAQ" ? (
        <div className="space-y-8">
          {faqCategories.map((category) => (
            <fieldset key={category.id} className="space-y-4">
              <legend className="mb-3 font-semibold">{category.name}</legend>
              {draft.faq
                .filter((item) => item.id.startsWith(category.id + "-"))
                .map((item, index) => (
                  <div
                    key={item.id}
                    className="space-y-3 rounded-md border border-border p-4"
                  >
                    <label className="block space-y-2 text-sm">
                      <span>
                        Pergunta {index + 1} — {category.name}
                      </span>
                      <Input
                        required
                        value={item.question}
                        onChange={(event) =>
                          setDraft({
                            ...draft,
                            faq: draft.faq.map((entry) =>
                              entry.id === item.id
                                ? { ...entry, question: event.target.value }
                                : entry,
                            ),
                          })
                        }
                      />
                    </label>
                    <label className="block space-y-2 text-sm">
                      <span>
                        Resposta {index + 1} — {category.name}
                      </span>
                      <Textarea
                        rows={4}
                        placeholder="Escreva a resposta"
                        value={item.answer}
                        onChange={(event) =>
                          setDraft({
                            ...draft,
                            faq: draft.faq.map((entry) =>
                              entry.id === item.id
                                ? { ...entry, answer: event.target.value }
                                : entry,
                            ),
                          })
                        }
                      />
                    </label>
                  </div>
                ))}
            </fieldset>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <label className="block space-y-2 text-sm">
            <span>Canais de notificação</span>
            <select
              className="block w-full rounded-md border border-input bg-background p-2"
              value={draft.notifications}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  notifications: event.target
                    .value as InstitutionSettings["notifications"],
                })
              }
            >
              <option value="push-email">Push e e-mail</option>
              <option value="push">Somente push</option>
              <option value="email">Somente e-mail</option>
            </select>
          </label>
          <p className="rounded-md border border-primary/30 bg-primary/5 p-4 text-sm">
            As mensagens pelo WhatsApp são obrigatórias, independentemente da
            opção selecionada.
          </p>
        </div>
      )}
      <Button type="submit">Salvar alterações</Button>
      {message && (
        <p role="status" className="text-sm text-primary">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </form>
  );
}
