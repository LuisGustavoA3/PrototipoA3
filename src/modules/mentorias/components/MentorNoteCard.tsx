import { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function MentorNoteCard({
  text,
  shared,
  index,
  onEdit,
}: {
  text: string;
  shared: boolean;
  index: number;
  onEdit?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const title = `Anotação do mentor ${index + 1}`;
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Abrir ${title.toLowerCase()}`}
        className="flex w-full items-center gap-4 rounded-md border border-border bg-card p-5 text-left transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <FileText className="size-8 shrink-0 text-primary" />
        <span>
          <span className="block font-semibold">{title}</span>
          <span className="mt-1 block text-xs text-muted-foreground">
            {shared ? "Compartilhada com mentorado" : "Privada"}
          </span>
          <span className="mt-3 block text-sm text-primary">
            Abrir anotação
          </span>
        </span>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            {text}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Fechar
            </Button>
            {onEdit && (
              <Button
                onClick={() => {
                  setOpen(false);
                  onEdit();
                }}
              >
                Editar anotação
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
