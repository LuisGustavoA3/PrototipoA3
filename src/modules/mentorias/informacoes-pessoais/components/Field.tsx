import { useState, type ReactNode } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type FieldBase = {
  id: string;
  label: string;
  required?: boolean | undefined;
  hint?: string | undefined;
  error?: string | undefined;
  flashing?: boolean | undefined;
  className?: string | undefined;
  containerRef?: ((el: HTMLDivElement | null) => void) | undefined;
};

export function Field({
  id,
  label,
  required,
  hint,
  error,
  className,
  containerRef,
  children,
}: FieldBase & { children: ReactNode }) {
  return (
    <div ref={containerRef} className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
        {required && (
          <span className="text-primary" aria-hidden>
            *
          </span>
        )}
        {required && <span className="sr-only">(obrigatório)</span>}
      </Label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

const flashClass = "field-flash";

export function TextField({
  value,
  onChange,
  locked,
  type = "text",
  inputMode,
  maxLength,
  placeholder,
  ...field
}: FieldBase & {
  value: string;
  onChange: (value: string) => void;
  locked?: boolean;
  type?: string;
  inputMode?: "text" | "numeric" | "tel" | "url" | "email";
  maxLength?: number;
  placeholder?: string;
}) {
  const input = (
    <Input
      id={field.id}
      type={type}
      value={value}
      inputMode={inputMode}
      maxLength={maxLength}
      placeholder={placeholder}
      disabled={locked}
      readOnly={locked}
      aria-invalid={!!field.error}
      aria-describedby={field.error ? `${field.id}-error` : undefined}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        locked && "cursor-not-allowed opacity-70",
        field.flashing && flashClass,
      )}
    />
  );

  return (
    <Field {...field}>
      {locked ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative">
              {input}
              <Lock
                className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>não pode ser alterado</TooltipContent>
        </Tooltip>
      ) : (
        input
      )}
    </Field>
  );
}

export function SelectField({
  value,
  onChange,
  options,
  placeholder = "Selecione",
  ...field
}: FieldBase & {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <Field {...field}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id={field.id}
          aria-invalid={!!field.error}
          aria-describedby={field.error ? `${field.id}-error` : undefined}
          className={cn("w-full", field.flashing && flashClass)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}

export function PasswordField({
  value,
  onChange,
  autoComplete,
  ...field
}: FieldBase & {
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <Field {...field}>
      <div className="relative">
        <Input
          id={field.id}
          type={visible ? "text" : "password"}
          value={value}
          autoComplete={autoComplete}
          aria-invalid={!!field.error}
          aria-describedby={field.error ? `${field.id}-error` : undefined}
          onChange={(e) => onChange(e.target.value)}
          className={cn("pr-10", field.flashing && flashClass)}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          className="absolute right-1 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </Field>
  );
}
