// Associação explícita: o quadro de teste representa a empresa Testes.
// IDs de quadro não são aceitos livremente pelo frontend.
export const companyBoards: Record<string, string> = { testes: "18435417982" };

export async function getCompanyBoard(boardId: string) {
  const token = process.env["MONDAY_API_TOKEN"];
  if (!token) throw new Error("Credencial Monday indisponível.");
  const fields =
    "id name column_values { id text value } subitems { id name column_values { id text value } }";
  type Item = {
    id: string;
    name: string;
    column_values: unknown[];
    subitems: unknown[];
  };
  type Page = { cursor: string | null; items: Item[] };
  async function query(
    queryText: string,
    variables: Record<string, unknown>,
  ): Promise<{ boards?: { items_page: Page }[]; next_items_page?: Page }> {
    const response = await fetch("https://api.monday.com/v2", {
      method: "POST",
      headers: { Authorization: token!, "Content-Type": "application/json" },
      body: JSON.stringify({ query: queryText, variables }),
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) throw new Error("Falha ao consultar Monday.");
    const result = await response.json();
    if (result.errors?.length || !result.data)
      throw new Error("Falha ao consultar quadro.");
    return result.data;
  }
  const first = await query(
    `query ($boardIds: [ID!]!) { boards(ids: $boardIds) { items_page(limit: 100) { cursor items { ${fields} } } } }`,
    { boardIds: [boardId] },
  );
  const page = first.boards?.[0]?.items_page;
  if (!page) throw new Error("Quadro não encontrado.");
  const items = [...page.items];
  let cursor = page.cursor;
  const seen = new Set<string>();
  while (cursor) {
    if (seen.has(cursor)) throw new Error("Paginação inválida.");
    seen.add(cursor);
    const next = (
      await query(
        `query ($cursor: String!) { next_items_page(limit: 100, cursor: $cursor) { cursor items { ${fields} } } }`,
        { cursor },
      )
    ).next_items_page;
    if (!next) throw new Error("Página de mentorados indisponível.");
    items.push(...next.items);
    cursor = next.cursor;
  }
  return { boardId, generatedAt: new Date().toISOString(), items };
}
