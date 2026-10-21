import { mkdir, writeFile } from "node:fs/promises";

const token = process.env.MONDAY_API_TOKEN;
const boardId = "18435417982";
const output = "public/data/monday-snapshot.json";

if (!token) {
  throw new Error("MONDAY_API_TOKEN não configurado.");
}

async function queryMonday(query, variables = {}) {
  const response = await fetch("https://api.monday.com/v2", {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Falha na API Monday: HTTP ${response.status}`);
  }

  const result = await response.json();

  if (result.errors?.length) {
    throw new Error("A API Monday retornou erros na consulta.");
  }

  return result.data;
}

const fields = `
  id
  name
  column_values {
    id
    text
    value
  }
  subitems {
    id
    name
    column_values {
      id
      text
      value
    }
  }
`;

const initialQuery = `
  query ($boardIds: [ID!]!) {
    boards(ids: $boardIds) {
      items_page(limit: 100) {
        cursor
        items {
          ${fields}
        }
      }
    }
  }
`;

const nextQuery = `
  query ($cursor: String!) {
    next_items_page(limit: 100, cursor: $cursor) {
      cursor
      items {
        ${fields}
      }
    }
  }
`;

const initialData = await queryMonday(initialQuery, {
  boardIds: [boardId],
});

const board = initialData?.boards?.[0];

if (!board?.items_page) {
  throw new Error("Quadro de mentorias não encontrado.");
}

const items = [...board.items_page.items];
let cursor = board.items_page.cursor;

while (cursor) {
  const data = await queryMonday(nextQuery, { cursor });

  if (!data?.next_items_page) {
    throw new Error("Falha ao recuperar a próxima página.");
  }

  items.push(...data.next_items_page.items);
  cursor = data.next_items_page.cursor;
}

const snapshot = {
  generatedAt: new Date().toISOString(),
  boardId,
  items,
};

await mkdir("public/data", { recursive: true });
await writeFile(output, JSON.stringify(snapshot, null, 2), "utf8");

console.log(`Snapshot gerado: ${items.length} acompanhamentos.`);
