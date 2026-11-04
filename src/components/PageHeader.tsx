import type { ReactNode } from "react";

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
  return (
    <header className="mb-8 border-b border-border/80 pb-6">
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
