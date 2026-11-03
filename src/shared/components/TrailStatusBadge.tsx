export function TrailStatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
    >
      {active ? "Ativo" : "Inativo"}
    </span>
  );
}
