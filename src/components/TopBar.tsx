import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Menu,
  Bell,
  BarChart3,
  IdCard,
  LogOut,
  User,
  X,
  ImageIcon,
} from "lucide-react";
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
import { cn } from "@/lib/utils";

const notifications = [
  { title: "Nova sessão agendada", time: "há 2 horas" },
  { title: "Conteúdo do dia disponível", time: "há 5 horas" },
  { title: "Seu assessment foi liberado", time: "ontem" },
];

const trilhas = [
  { name: "Liderança Inspiradora", progress: "40%", year: 2026 },
  { name: "Gestão de Alta Performance", progress: "75%", year: 2026 },
  { name: "Comunicação Estratégica", progress: "55%", year: 2026 },
  { name: "Cultura de Inovação", progress: "30%", year: 2026 },
  { name: "Visão Estratégica", progress: "65%", year: 2026 },
  { name: "Comunicação Estratégica", progress: "15%", year: 2025 },
  { name: "Cultura de Inovação", progress: "60%", year: 2025 },
  { name: "Inovação e Criatividade", progress: "30%", year: 2024 },
];

const years = ["2026", "2025", "2024"];

export function TopBar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const navigate = useNavigate({ from: "/" });
  const [trilhasOpen, setTrilhasOpen] = useState(false);
  const [year, setYear] = useState("2026");
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const visible = trilhas.filter((t) => String(t.year) === year);

  useEffect(() => {
    if (!trilhasOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setTrilhasOpen(false);
    }

    function handlePointerDown(e: MouseEvent) {
      const target = e.target as Node;
      if (
        panelRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return;
      }
      setTrilhasOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [trilhasOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[60] flex h-16 items-center gap-6 border-b border-border bg-card px-4">
        <button
          onClick={onToggleSidebar}
          aria-label="Abrir ou fechar menu"
          className="flex size-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent"
        >
          <Menu className="size-5" />
        </button>

        <Link
          to="/hub"
          className="label-caps rounded-md bg-primary px-4 py-2 text-xs text-primary-foreground transition-opacity hover:opacity-90"
        >
          A3 Digital
        </Link>

        <div className="flex-1" />

        <button
          ref={triggerRef}
          onClick={() => setTrilhasOpen((v) => !v)}
          className={cn(
            "label-caps text-xs transition-colors",
            trilhasOpen
              ? "text-primary"
              : "text-muted-foreground hover:text-primary",
          )}
        >
          Minhas Trilhas
        </button>

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
              {notifications.map((n) => (
                <li
                  key={n.title}
                  className="border-b border-border px-4 py-3 last:border-0 hover:bg-accent/50"
                >
                  <p className="text-sm text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.time}</p>
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
            <span className="label-caps text-xs">Perfil</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              onSelect={() => navigate({ to: "/minhas-estatisticas" })}
            >
              <BarChart3 className="size-4 text-primary" /> Minhas estatísticas
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IdCard className="size-4 text-primary" /> Informações pessoais
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="size-4 text-primary" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {trilhasOpen && (
        <>
          <div
            className="fixed inset-0 z-[45] bg-black/20"
            onClick={() => setTrilhasOpen(false)}
          />
          <div
            ref={panelRef}
            className="fixed top-16 left-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 rounded-xl border border-border bg-card p-6 shadow-[0_8px_30px_rgb(0_0_0_/_12%)]"
          >
            <div className="flex items-center justify-between">
              <h2 className="label-caps text-sm text-foreground">
                Minhas Trilhas
              </h2>
              <button
                onClick={() => setTrilhasOpen(false)}
                aria-label="Fechar Minhas Trilhas"
                className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-4 flex justify-center gap-2">
              {years.map((y) => {
                const selected = y === year;
                return (
                  <button
                    key={y}
                    onClick={() => setYear(y)}
                    className={cn(
                      "label-caps rounded-md px-3 py-1.5 text-xs transition-colors",
                      selected
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    {y}
                  </button>
                );
              })}
            </div>

            {visible.length === 0 ? (
              <p className="mt-6 rounded-md bg-primary-soft/50 px-4 py-3 text-center text-sm text-foreground">
                Nenhum dado.
              </p>
            ) : (
              <CourseCarousel key={year} courses={visible} />
            )}
          </div>
        </>
      )}
    </>
  );
}

function CourseCarousel({
  courses,
}: {
  courses: { name: string; progress: string; year: number }[];
}) {
  const [index, setIndex] = useState(0);
  const len = courses.length;

  const cardWidth = 176;
  const gap = 16;

  return (
    <div className="relative mt-6 h-72 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        {courses.map((course, i) => {
          let dist = i - index;
          if (dist > len / 2) dist -= len;
          if (dist < -len / 2) dist += len;

          const isActive = dist === 0;
          const isVisible = Math.abs(dist) <= 1;
          const clamped = Math.max(-1, Math.min(1, dist));

          return (
            <motion.div
              key={i}
              className={cn(
                "absolute flex justify-center px-2",
                !isVisible && "pointer-events-none",
              )}
              style={{ width: cardWidth }}
              initial={false}
              animate={{
                x: clamped * (cardWidth + gap),
                scale: isActive ? 1 : isVisible ? 0.82 : 0.7,
                opacity: isActive ? 1 : isVisible ? 0.65 : 0,
                zIndex: isActive ? 10 : isVisible ? 5 : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              whileHover={isVisible ? { scale: isActive ? 1.02 : 0.84 } : {}}
              whileTap={isVisible ? { scale: isActive ? 0.98 : 0.8 } : {}}
            >
              <button
                onClick={() => setIndex(i)}
                className="w-full cursor-pointer rounded-xl border border-border bg-card p-4 text-left shadow-[var(--shadow-card)] transition-shadow hover:shadow-md"
              >
                <div className="flex aspect-[3/4] items-center justify-center rounded-md bg-muted">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ImageIcon className="size-10" />
                    <span className="label-caps text-[10px]">
                      Imagem do curso
                    </span>
                  </div>
                </div>
                <p className="label-caps mt-3 text-[10px] text-primary">
                  Curso
                </p>
                <p className="mt-1 line-clamp-2 text-sm font-medium text-foreground">
                  {course.name}
                </p>
                <div
                  className={cn(
                    "transition-opacity duration-200",
                    isActive ? "opacity-100" : "opacity-0",
                  )}
                >
                  <p className="mt-3 text-xs text-muted-foreground">
                    Progresso {course.progress}
                  </p>
                  <div className="mt-1 h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: course.progress }}
                    />
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
