import { useRef, useState } from "react";
import { Camera, Trash2, User, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

const CROP_SIZE = 256;

export function AvatarUploader({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (next: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  const [source, setSource] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [error, setError] = useState<string | null>(null);

  const pickFile = (file: File | undefined) => {
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Formato não aceito. Envie um arquivo JPG ou PNG.");
      return;
    }
    setError(null);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    const reader = new FileReader();
    reader.onload = () => setSource(String(reader.result));
    reader.readAsDataURL(file);
  };

  const applyCrop = () => {
    const img = imgRef.current;
    if (!img) return;
    const canvas = document.createElement("canvas");
    canvas.width = CROP_SIZE;
    canvas.height = CROP_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const base = Math.max(
      CROP_SIZE / img.naturalWidth,
      CROP_SIZE / img.naturalHeight,
    );
    const scale = base * zoom;
    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;
    const ratio = CROP_SIZE / 256;
    ctx.drawImage(
      img,
      CROP_SIZE / 2 - drawW / 2 + offset.x * ratio,
      CROP_SIZE / 2 - drawH / 2 + offset.y * ratio,
      drawW,
      drawH,
    );

    onChange(canvas.toDataURL("image/png"));
    setSource(null);
  };

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-5">
      <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
        {value ? (
          <img src={value} alt="Foto de perfil" className="size-full object-cover" />
        ) : (
          <User className="size-10 text-muted-foreground" aria-hidden />
        )}
      </div>

      <div className="flex flex-col items-center gap-2 sm:items-start">
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            <Camera className="size-4" />
            {value ? "Trocar foto" : "Enviar foto"}
          </Button>
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange(null)}
            >
              <Trash2 className="size-4" />
              Remover
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Formatos aceitos: JPG e PNG.</p>
        {error && (
          <p role="alert" className="text-xs text-destructive">
            {error}
          </p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="sr-only"
          aria-label="Selecionar foto de perfil"
          onChange={(e) => {
            pickFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>

      <Dialog open={!!source} onOpenChange={(open) => !open && setSource(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recortar foto</DialogTitle>
            <DialogDescription>
              Arraste a imagem para posicionar e use o controle de zoom.
            </DialogDescription>
          </DialogHeader>

          <div
            className="relative mx-auto size-64 cursor-grab overflow-hidden rounded-full border border-border bg-muted active:cursor-grabbing"
            onPointerDown={(e) => {
              dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!dragStart.current) return;
              setOffset({
                x: e.clientX - dragStart.current.x,
                y: e.clientY - dragStart.current.y,
              });
            }}
            onPointerUp={() => {
              dragStart.current = null;
            }}
          >
            {source && (
              <img
                ref={imgRef}
                src={source}
                alt="Pré-visualização da foto"
                draggable={false}
                className="absolute left-1/2 top-1/2 max-w-none select-none"
                style={{
                  transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${zoom})`,
                  width: 256,
                  height: 256,
                  objectFit: "cover",
                }}
              />
            )}
          </div>

          <div className="flex items-center gap-3 px-2">
            <ZoomIn className="size-4 text-muted-foreground" aria-hidden />
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.05}
              aria-label="Zoom da foto"
              onValueChange={([v]) => setZoom(v ?? 1)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setSource(null)}>
              Cancelar
            </Button>
            <Button type="button" onClick={applyCrop}>
              Aplicar recorte
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
