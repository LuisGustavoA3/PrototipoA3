import { z } from "zod";
import { mapMondaySubitem } from "./monday-mapping";

const columns = z.array(
  z.object({
    id: z.string(),
    text: z.string().nullable(),
    value: z.string().nullable(),
  }),
);
const item = z.object({
  id: z.string(),
  name: z.string(),
  column_values: columns,
});
export const companyBoardSchema = z.object({
  boardId: z.string(),
  generatedAt: z.string().datetime(),
  items: z.array(item.extend({ subitems: z.array(item) })),
});
export type CompanyBoard = z.infer<typeof companyBoardSchema>;
export function companyMentorships(board: CompanyBoard) {
  return board.items.map((person) => ({
    id: person.id,
    name: person.name,
    status:
      person.column_values.find((column) => column.id === "status")?.text ??
      "Não informado",
    deadline:
      person.column_values.find((column) => column.id === "date_mm84z7j0")
        ?.text ?? "Não informado",
    sessions: person.subitems.map((session) =>
      mapMondaySubitem(session, person.id),
    ),
  }));
}
