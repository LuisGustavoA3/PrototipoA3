import { ArrowLeft, LogOut, Menu, UserRound } from "lucide-react";

type AdminTopBarProps = {
  title: string;
  onToggleSidebar: () => void;
  onBack: () => void;
  onProfile: () => void;
  onReturnToHub: () => void;
  onLogout?: () => void;
};

export function AdminTopBar({
  title,
  onToggleSidebar,
  onBack,
  onProfile,
  onReturnToHub,
  onLogout,
}: AdminTopBarProps) {
  const buttonClass =
    "flex h-9 items-center justify-center rounded-md px-2 " +
    "text-muted-foreground transition-colors " +
    "hover:bg-accent hover:text-foreground";

  return (
    <header className="fixed inset-x-0 top-0 z-[60] flex h-16 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          data-sidebar-toggle
          onClick={onToggleSidebar}
          aria-label="Abrir ou fechar menu do Mentor"
          className={buttonClass}
        >
          <Menu className="size-5" />
        </button>

        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar à página anterior"
          className={buttonClass}
        >
          <ArrowLeft className="size-5" />
        </button>

        <span className="truncate px-2 text-sm font-medium text-foreground">
          {title}
        </span>
      </div>

      <div className="flex items-center gap-1 sm:gap-3">
        <button
          type="button"
          onClick={onProfile}
          className={buttonClass}
          aria-label="Acessar perfil"
        >
          <UserRound className="size-4 sm:hidden" />
          <span className="hidden text-xs sm:inline">PERFIL</span>
        </button>

        <button
          type="button"
          onClick={onReturnToHub}
          className={buttonClass}
          aria-label="Voltar ao Ambiente A3"
        >
          <span className="text-xs">AMBIENTE A3</span>
        </button>

        <button
          type="button"
          onClick={onLogout}
          disabled={!onLogout}
          aria-label="Sair"
          title={onLogout ? "Sair" : "Logout indisponível"}
          className={`${buttonClass} disabled:cursor-not-allowed disabled:opacity-40`}
        >
          <LogOut className="size-4" />
        </button>
      </div>
    </header>
  );
}
