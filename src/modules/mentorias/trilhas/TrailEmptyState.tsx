import { BookOpen } from "lucide-react";

type TrailEmptyStateProps = {
  trailName: string;
};

export function TrailEmptyState({ trailName }: TrailEmptyStateProps) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-md border border-border bg-card p-8 text-center">
      <BookOpen className="mb-4 size-10 text-muted-foreground" />

      <h2 className="text-lg font-semibold text-foreground">
        Nenhum conteúdo disponível
      </h2>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        A trilha "{trailName}" ainda não possui conteúdos de desenvolvimento
        cadastrados.
      </p>
    </div>
  );
}
