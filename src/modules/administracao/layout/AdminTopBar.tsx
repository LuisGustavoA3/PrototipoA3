import { Bell, IdCard, LogOut, Menu, User } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type AdminTopBarProps = {
  onToggleSidebar: () => void;
  onReturnToHub: () => void;
  onProfile: () => void;
  onLogout?: () => void;
};

const notifications = [
  { title: "Nova atividade administrativa", time: "há 2 horas" },
  { title: "Atualização de conteúdo disponível", time: "ontem" },
];

export function AdminTopBar({
  onToggleSidebar,
  onReturnToHub,
  onProfile,
  onLogout,
}: AdminTopBarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-[60] flex h-16 items-center gap-6 border-b border-border bg-card px-4">
      <button
        type="button"
        data-sidebar-toggle
        onClick={onToggleSidebar}
        aria-label="Alternar menu lateral"
        className="flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
      >
        <Menu className="size-5" />
      </button>

      <button
        type="button"
        onClick={onReturnToHub}
        className="label-caps rounded-md bg-primary px-4 py-2 text-xs text-primary-foreground transition-opacity hover:opacity-90"
      >
        A3 Digital
      </button>

      <p
        className="max-w-[min(40vw,20rem)] truncate text-sm font-medium text-foreground"
        title="Administração A3 Digital"
      >
        Administração A3 Digital
      </p>

      <div className="flex-1" />

      <Popover>
        <PopoverTrigger
          aria-label="Notificações"
          className="relative flex size-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
        >
          <Bell className="size-5" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
        </PopoverTrigger>

        <PopoverContent align="end" className="w-80 p-0">
          <p className="label-caps border-b border-border px-4 py-3 text-xs text-foreground">
            Notificações
          </p>

          <ul>
            {notifications.map((notification) => (
              <li
                key={notification.title}
                className="border-b border-border px-4 py-3 last:border-0"
              >
                <p className="text-sm text-foreground">{notification.title}</p>
                <p className="text-xs text-muted-foreground">
                  {notification.time}
                </p>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>

      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Perfil"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-muted">
            <User className="size-4" />
          </span>
          <span className="label-caps hidden text-xs sm:inline">Perfil</span>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onSelect={onProfile}>
            <IdCard className="size-4 text-primary" />
            Informações pessoais
          </DropdownMenuItem>

          <DropdownMenuItem disabled={!onLogout} onSelect={() => onLogout?.()}>
            <LogOut className="size-4 text-primary" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
