import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  updateOwnTrail,
  useOwnTrails,
} from "@/modules/mentorias/trilhas/trail-store";

export function OwnTrailEditor({ id }: { id: number }) {
  const trail = useOwnTrails().find((item) => item.id === id)!;
  const [loadingImage, setLoadingImage] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(trail.name);
  const [image, setImage] = useState(trail.image);
  const [active, setActive] = useState(trail.active);
  const [message, setMessage] = useState("");
  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        onClick={() => {
          setName(trail.name);
          setImage(trail.image);
          setActive(trail.active);
          setMessage("");
          setEditing(true);
        }}
      >
        Editar trilha
      </Button>
      {editing && (
        <form
          className="space-y-4 rounded-md border border-border p-4"
          onSubmit={(event) => {
            event.preventDefault();
            try {
              updateOwnTrail(id, { name, image, active });
              setEditing(false);
              setMessage("Trilha atualizada.");
            } catch (error) {
              setMessage(
                error instanceof Error
                  ? error.message
                  : "Não foi possível salvar.",
              );
            }
          }}
        >
          <label className="block space-y-2 text-sm">
            <span>Nome da trilha</span>
            <Input
              value={name}
              required
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label className="block space-y-2 text-sm">
            <span>Imagem da trilha (URL)</span>
            <Input
              value={image.startsWith("data:") ? "" : image}
              placeholder={
                image.startsWith("data:")
                  ? "Imagem enviada selecionada"
                  : "URL da imagem"
              }
              onChange={(event) => setImage(event.target.value)}
            />
          </label>
          <label className="block space-y-2 text-sm">
            <span>Enviar imagem da trilha (PNG, JPG ou WebP, até 1 MB)</span>
            <Input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              disabled={loadingImage}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                if (
                  !["image/png", "image/jpeg", "image/webp"].includes(
                    file.type,
                  ) ||
                  file.size > 1024 * 1024
                ) {
                  setMessage("Envie PNG, JPG ou WebP de até 1 MB.");
                  return;
                }
                setMessage("");
                setLoadingImage(true);
                const reader = new FileReader();
                reader.onload = () => {
                  setImage(String(reader.result));
                  setLoadingImage(false);
                };
                reader.onerror = () => {
                  setMessage("Não foi possível ler a imagem.");
                  setLoadingImage(false);
                };
                reader.readAsDataURL(file);
              }}
            />
          </label>
          {image && (
            <img
              src={image}
              alt="Prévia da capa da trilha"
              className="h-40 w-28 rounded-md border border-border object-cover"
            />
          )}
          <label className="block space-y-2 text-sm">
            <span>Status da trilha</span>
            <select
              className="block rounded-md border border-input bg-background p-2"
              value={active ? "ativo" : "inativo"}
              onChange={(event) => setActive(event.target.value === "ativo")}
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </label>
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={loadingImage || !image || !name.trim()}
            >
              Salvar trilha
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditing(false);
                setMessage("");
              }}
            >
              Cancelar
            </Button>
          </div>
        </form>
      )}
      {message && (
        <p role="status" className="text-sm">
          {message}
        </p>
      )}
    </div>
  );
}
