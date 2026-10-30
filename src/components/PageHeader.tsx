import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { goBack } from "@/lib/navigation-history";

interface PageHeaderProps {
  section?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({
  section,
  title,
  description,
  actions,
}: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    goBack(navigate);
  };

  return (
    <header className="mb-8 border-b border-border/80 pb-6">
      <button
        type="button"
        onClick={handleBack}
        aria-label="Voltar"
        className="mb-4 inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
      >
        <ChevronLeft className="size-4" />
        <span>Voltar</span>
      </button>

      {section && <p className="label-caps text-xs text-primary">{section}</p>}

      <div className="mt- flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground sm:text-4xl">
            {title}
          </h1>

          {description && (
            <p className="mt-2 text-base text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {actions}
      </div>
    </header>
  );
}
