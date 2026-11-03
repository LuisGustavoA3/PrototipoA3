import type { ReactNode } from "react";
import { AdminLayout } from "../layout/AdminLayout";

export function ManagementShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-6 p-6 md:p-8">
        <header className="space-y-2 border-b border-border pb-5">
          <h1 className="label-caps text-2xl text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </header>
        {children}
      </div>
    </AdminLayout>
  );
}

export function EmptySection({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}
