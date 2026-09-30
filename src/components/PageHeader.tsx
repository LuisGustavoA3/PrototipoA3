import { ChevronLeft } from "lucide-react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { goBack } from "@/lib/navigation-history";

interface PageHeaderProps {
  section?: string;
  title: string;
  description?: string;
}

export function PageHeader({ section, title, description }: PageHeaderProps) {
  const navigate = useNavigate();

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const isHub = pathname === "/hub";

  return (
    <div className="mb-6">
      {!isHub && (
        <button
          type="button"
          onClick={() => goBack(navigate)}
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Voltar</span>
        </button>
      )}

      {section && <p className="label-caps text-xs text-primary">{section}</p>}
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>

      {description && (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
