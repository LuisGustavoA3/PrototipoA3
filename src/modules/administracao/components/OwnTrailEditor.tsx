import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  updateOwnTrail,
  useOwnTrails,
} from "@/modules/mentorias/trilhas/trail-store";

export function OwnTrailEditor({ id }: { id: number }) {
  const trail = useOwnTrails().find((item) => item.id === id)!;
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
              value={image}
              required
              onChange={(event) => setImage(event.target.value)}
            />
          </label>
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
            <Button type="submit">Salvar trilha</Button>
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
