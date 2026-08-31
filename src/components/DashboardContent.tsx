import { Trophy, FileText, CalendarCheck, UserCircle2 } from "lucide-react";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-md border border-border bg-card p-5 shadow-[var(--shadow-card)] ${className}`}>
      {children}
    </div>
  );
}

function CardTitle({ children, action }: { children: React.ReactNode; action?: string }) {
  return (
    <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
      <h2 className="label-caps text-sm text-foreground">{children}</h2>
      {action && (
        <button className="label-caps rounded bg-primary px-2.5 py-1 text-[10px] text-primary-foreground transition-opacity hover:opacity-90">
          {action}
        </button>
      )}
    </div>
  );
}

export function DashboardContent() {
  return (
    <div className="space-y-5 p-6">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="flex items-center justify-between rounded-md bg-primary p-5 text-primary-foreground">
          <div>
            <p className="label-caps text-xs">Progresso de desenvolvimento</p>
            <p className="mt-6 text-sm">Não incluso</p>
          </div>
          <Trophy className="size-10 opacity-90" />
        </div>

        <div className="rounded-md bg-primary p-5 text-primary-foreground">
          <p className="label-caps text-xs">Progresso das sessões</p>
          <p className="mt-4 text-sm">0/10 sessões realizadas</p>
          <div className="mt-2 h-4 rounded-full border border-primary-foreground/60 bg-primary-foreground/20" />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.6fr_1.6fr]">
        <Card>
          <CardTitle>Próximo atendimento</CardTitle>
          <div className="flex items-center gap-6 py-4">
            <CalendarCheck className="size-12 text-primary" />
            <span className="text-muted-foreground">-</span>
          </div>
        </Card>

        <Card>
          <CardTitle action="Ver conteúdo">Conteúdo do dia!</CardTitle>
          <div className="flex gap-4">
            <FileText className="size-12 shrink-0 text-primary" />
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Artigo - Como o líder pode ajudar os funcionários a combater o status quo no dia a dia
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                A liderança é essencial para criar uma cultura de inovação porque um líder visionário
                é capaz de inspirar uma equipe e mantê-la engajada em alcançar...
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
            <h2 className="label-caps text-sm text-foreground">Meus dados</h2>
            <UserCircle2 className="size-5 text-primary" />
          </div>
          <div className="flex gap-5">
            <div className="flex size-24 shrink-0 items-center justify-center rounded bg-muted">
              <UserCircle2 className="size-12 text-muted-foreground" />
            </div>
            <dl className="grid flex-1 grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {[
                ["Nome", "Luis Gustavo Ribeiro"],
                ["Área", "-"],
                ["Empresa", "A3 Consultoria"],
                ["Coach/Mentor(a)", "Juliano Ribeiro"],
                ["Cargo", "-"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="label-caps text-[10px] text-muted-foreground">{k}</dt>
                  <dd className="text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="mt-5 border-t border-border pt-3">
            <div className="flex justify-between text-sm text-foreground">
              <span>Conteúdos da biblioteca acessados</span>
              <span>15%</span>
            </div>
            <div className="mt-1 h-4 rounded-full border border-primary/40">
              <div className="h-full w-[15%] rounded-full bg-primary" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="lg:max-w-[calc(50%-0.625rem)]">
        <CardTitle action="Ver plano de ação">Minhas ações</CardTitle>
        <p className="rounded bg-primary-soft/60 px-4 py-4 text-sm text-foreground">Nenhum dado.</p>
      </Card>
    </div>
  );
}