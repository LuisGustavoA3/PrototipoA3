import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  CircleUserRound,
  FileText,
  Map,
  UserCircle2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type ActionStatus, updatePdiAction, usePdiActions } from "@/lib/pdi-store";
import { useLibraryContents } from "@/lib/library-store";
import { useJourneyItems } from "@/lib/journey-store";

const sessionProgress = { completed: 3, total: 10 };
const dailyContentStorageKey = "a3:dashboard-daily-content";
const statusColors: Record<ActionStatus, string> = {
  Concluído: "#65c996",
  "Em andamento": "#f58a2a",
  "Não iniciado": "#cbd0d3",
  Parado: "#e8b44f",
  Cancelado: "#c96b6b",
};

const assessments = [
  { name: "Âncoras de Carreira", completed: true },
  { name: "Clifton Strengths", completed: false },
  { name: "HTM", completed: false },
  { name: "HumanGuide", completed: false },
  { name: "Janusian", completed: true },
  { name: "MBTI", completed: false },
  { name: "Perfil Caliper", completed: false },
  { name: "Perfil de Gestão", completed: false },
];

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-md border border-border bg-card p-5 shadow-[var(--shadow-card)] ${className}`}>{children}</section>;
}

function CardHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return <div className="mb-4 flex items-center justify-between gap-3 border-b border-border pb-3"><h2 className="label-caps text-sm text-foreground">{title}</h2>{action}</div>;
}

function ProgressBar({ value, light = false }: { value: number; light?: boolean }) {
  return <div className={light ? "h-3 rounded-full border border-primary-foreground/60 bg-primary-foreground/20" : "h-3 rounded-full border border-primary/40 bg-background"}><div className={light ? "h-full rounded-full bg-primary-foreground transition-[width] duration-500" : "h-full rounded-full bg-primary transition-[width] duration-500"} style={{ width: `${value}%` }} /></div>;
}

export function DashboardContent() {
  const navigate = useNavigate({ from: "/" });
  const actions = usePdiActions();
  const contents = useLibraryContents();
  const journeyItems = useJourneyItems();
  const [evidenceAction, setEvidenceAction] = useState<{ id: string; name: string } | null>(null);
  const [evidence, setEvidence] = useState("");

  const activePublicContents = contents.filter((content) => content.public && content.active);
  const unfinishedContents = activePublicContents.filter((content) => !content.finished);
  const dailyContent = useMemo(() => {
    if (typeof window === "undefined") return unfinishedContents[0];
    const today = new Date().toISOString().slice(0, 10);
    const stored = JSON.parse(window.localStorage.getItem(dailyContentStorageKey) ?? "null") as { date?: string; id?: string } | null;
    const storedContent = stored?.date === today ? unfinishedContents.find((content) => content.id === stored.id) : undefined;
    if (storedContent) return storedContent;
    const next = unfinishedContents[0];
    if (next) window.localStorage.setItem(dailyContentStorageKey, JSON.stringify({ date: today, id: next.id }));
    return next;
  }, [unfinishedContents]);
  const libraryProgress = activePublicContents.length === 0 ? 0 : Math.round((activePublicContents.filter((content) => content.finished).length / activePublicContents.length) * 100);
  const completedActions = actions.filter((action) => action.status === "Concluído").length;
  const developmentProgress = actions.length === 0 ? 0 : Math.round((completedActions / actions.length) * 100);
  const visibleActions = [...actions].filter((action) => action.status !== "Concluído").sort((first, second) => first.endDate.localeCompare(second.endDate) || first.name.localeCompare(second.name)).slice(0, 4);
  const journeyPriorities = journeyItems["Prioridades de desenvolvimento"];
  const statusData = (Object.keys(statusColors) as ActionStatus[]).map((status) => ({ name: status, value: actions.filter((action) => action.status === status).length })).filter((item) => item.value > 0);

  const completeAction = () => {
    if (!evidenceAction || !evidence.trim()) return;
    updatePdiAction(evidenceAction.id, { status: "Concluído", evidence: evidence.trim() });
    setEvidenceAction(null);
    setEvidence("");
  };

  return (
    <div className="space-y-5 p-6">
      <div className="grid gap-5 lg:grid-cols-2">
        <Link to="/plano-de-acao" className="rounded-md bg-primary p-5 text-primary-foreground transition-opacity hover:opacity-95"><div className="flex items-start justify-between gap-4"><div><p className="label-caps text-xs">Progresso de desenvolvimento</p><p className="mt-4 text-sm">{actions.length ? `${completedActions}/${actions.length} ações concluídas` : "Nenhuma ação cadastrada"}</p></div><span className="text-3xl font-semibold">{actions.length ? `${developmentProgress}%` : "-"}</span></div><div className="mt-4"><ProgressBar value={developmentProgress} light /></div></Link>
        <div className="rounded-md bg-primary p-5 text-primary-foreground"><div className="flex items-start justify-between gap-4"><div><p className="label-caps text-xs">Progresso das sessões</p><p className="mt-4 text-sm">{sessionProgress.completed}/{sessionProgress.total} sessões realizadas</p></div><span className="text-3xl font-semibold">{Math.round((sessionProgress.completed / sessionProgress.total) * 100)}%</span></div><div className="mt-4"><ProgressBar value={(sessionProgress.completed / sessionProgress.total) * 100} light /></div></div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1.35fr]">
        <Card className="min-h-[280px]"><CardHeader title="Meus dados" action={<UserCircle2 className="size-5 text-primary" />} /><div className="flex items-center gap-3"><div className="flex size-16 shrink-0 items-center justify-center rounded bg-muted"><UserCircle2 className="size-9 text-muted-foreground" /></div><div><p className="font-medium text-foreground">Luis Gustavo Ribeiro</p><p className="mt-1 text-sm text-muted-foreground">A3 Consultoria</p><p className="text-sm text-muted-foreground">Coach: Juliano Ribeiro</p></div></div><Link to="/minhas-estatisticas" className="mt-5 flex items-center gap-1 text-sm text-primary hover:underline">Ver minhas estatísticas <ArrowRight className="size-4" /></Link><div className="mt-4 border-t border-border pt-3"><div className="flex justify-between gap-3 text-sm text-foreground"><span>Progresso geral da biblioteca</span><span>{libraryProgress}%</span></div><div className="mt-2"><ProgressBar value={libraryProgress} /></div></div><Link to="/biblioteca-negocio" className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">Ver biblioteca <ArrowRight className="size-3" /></Link></Card>
        <Card className="min-h-[280px]"><CardHeader title="Conteúdo do dia!" action={dailyContent && <Link to="/biblioteca/conteudo/$contentId" params={{ contentId: dailyContent.id }} className="label-caps rounded bg-primary px-2.5 py-1 text-[10px] text-primary-foreground">Ver conteúdo</Link>} />{dailyContent ? <div className="flex gap-4"><FileText className="size-10 shrink-0 text-primary" /><div className="min-w-0"><p className="label-caps text-[10px] text-muted-foreground">{dailyContent.type} · {dailyContent.axis}</p><h3 className="mt-1 text-base font-semibold text-foreground">{dailyContent.name}</h3><p className="mt-2 line-clamp-4 text-sm leading-5 text-muted-foreground">{dailyContent.description}</p><p className="mt-3 text-xs text-primary">{dailyContent.topic}</p></div></div> : <EmptyState text="Você concluiu todos os conteúdos disponíveis!" />}</Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Card className="h-[430px]"><CardHeader title="Minhas ações" action={<Link to="/plano-de-acao" className="label-caps rounded bg-primary px-2.5 py-1 text-[10px] text-primary-foreground">Ver plano de ação</Link>} />{visibleActions.length === 0 ? <EmptyState text={actions.length ? "Todas as ações foram concluídas." : "Nenhuma ação cadastrada."} /> : <div className="grid h-[336px] grid-rows-4 gap-2">{visibleActions.map((action) => <label key={action.id} className="flex min-h-0 cursor-pointer items-start gap-3 overflow-hidden rounded-md border border-border px-3 py-3 text-sm text-foreground transition-colors hover:bg-accent/50"><input type="checkbox" className="mt-0.5 size-4 shrink-0 accent-primary" onChange={() => setEvidenceAction({ id: action.id, name: action.name })} /><span className="min-w-0 flex-1"><span className="line-clamp-2">{action.name}</span><span className="mt-1 block text-xs font-medium text-primary">Status: {action.status}</span><span className="mt-1 block text-xs text-muted-foreground">Prazo: {new Intl.DateTimeFormat("pt-BR").format(new Date(`${action.endDate}T00:00:00`))}</span></span></label>)}</div>}</Card>
        <Card className="h-[430px]"><CardHeader title="Prioridades da jornada" action={<Link to="/jornada-de-desenvolvimento" aria-label="Ver jornada" className="text-primary"><Map className="size-5" /></Link>} />{journeyPriorities.length === 0 ? <EmptyState text="Nenhuma prioridade cadastrada." /> : <ul className="space-y-3">{journeyPriorities.slice(0, 8).map((priority) => <li key={priority.id}><Link to="/jornada-de-desenvolvimento" className="flex items-start gap-2 text-sm text-foreground hover:text-primary"><span className="mt-1 text-primary">•</span>{priority.title}</Link></li>)}{journeyPriorities.length > 8 && <li className="pt-1 text-xs text-muted-foreground">+ {journeyPriorities.length - 8} prioridades de jornada</li>}</ul>}</Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-1">
        <Card className="min-h-[300px]"><CardHeader title="Status da jornada" />{statusData.length ? <div className="flex flex-col items-center justify-center gap-6 md:flex-row"><div className="h-48 w-48"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={statusData} dataKey="value" nameKey="name" innerRadius={54} outerRadius={84} paddingAngle={2}>{statusData.map((item) => <Cell key={item.name} fill={statusColors[item.name as ActionStatus]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div><div className="w-full max-w-sm space-y-3">{statusData.map((item) => <div key={item.name} className="flex items-center justify-between gap-3 text-sm"><span className="flex items-center gap-2 text-muted-foreground"><span className="size-2.5 rounded-full" style={{ backgroundColor: statusColors[item.name as ActionStatus] }} />{item.name}</span><strong className="text-foreground">{Math.round((item.value / actions.length) * 100)}%</strong></div>)}</div></div> : <EmptyState text="Nenhuma ação cadastrada." />}</Card>
      </div>

      <Dialog open={evidenceAction !== null} onOpenChange={(open) => !open && setEvidenceAction(null)}><DialogContent><DialogHeader><DialogTitle>Adicionar evidência</DialogTitle></DialogHeader><p className="text-sm text-muted-foreground">Informe a evidência para concluir “{evidenceAction?.name}”.</p><textarea value={evidence} onChange={(event) => setEvidence(event.target.value)} placeholder="Descreva a evidência da conclusão" className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring" /><DialogFooter><Button variant="outline" onClick={() => setEvidenceAction(null)}>Cancelar</Button><Button onClick={completeAction} disabled={!evidence.trim()}><Check className="size-4" />Concluir ação</Button></DialogFooter></DialogContent></Dialog>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="flex min-h-[120px] items-center justify-center rounded-md bg-muted px-4 py-6 text-center text-sm text-muted-foreground">{text}</div>;
}
