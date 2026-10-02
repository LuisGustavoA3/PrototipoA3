import type { MentorshipSession } from "@/lib/mentorship-session";

const MONDAY_API_URL = "https://api.monday.com/v2";
const MENTORSHIP_BOARD_ID = "18432549548";

type MondayColumnValue = {
  id: string;
  text: string | null;
  value: string | null;
};

type MondayItem = {
  id: string;
  name: string;
  column_values: MondayColumnValue[];
};

type MondayResponse = {
  data?: {
    boards: {
      items_page: {
        items: MondayItem[];
      };
    }[];
  };
  errors?: { message: string }[];
};

const COLUMN_IDS = {
  status: "project_status",
  date: "date_mm7qs30c",
  responsaveis: "dropdown_mm7qy39a",
  empresa: "dropdown_mm7qfc14",
} as const;

function getColumn(
  item: MondayItem,
  columnId: string,
): MondayColumnValue | undefined {
  return item.column_values.find((column) => column.id === columnId);
}

function parseColumnValue(column: MondayColumnValue | undefined): unknown {
  if (!column?.value) return null;

  try {
    return JSON.parse(column.value);
  } catch {
    return null;
  }
}

function parseResponsaveis(column: MondayColumnValue | undefined): string[] {
  if (!column) return [];

  const value = parseColumnValue(column);

  if (
    typeof value === "object" &&
    value !== null &&
    "chosenValues" in value &&
    Array.isArray(value.chosenValues)
  ) {
    return value.chosenValues
      .map((option: { name?: unknown }) => option.name)
      .filter((name: unknown): name is string => typeof name === "string");
  }

  return column.text
    ? column.text
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean)
    : [];
}

function parseDropdownNames(column: MondayColumnValue | undefined): string[] {
  const value = parseColumnValue(column);

  if (
    typeof value === "object" &&
    value !== null &&
    "chosenValues" in value &&
    Array.isArray(value.chosenValues)
  ) {
    return value.chosenValues
      .map((option: { name?: unknown }) => option.name)
      .filter((name: unknown): name is string => typeof name === "string");
  }

  return column?.text
    ? column.text
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean)
    : [];
}

function mapMondayItem(item: MondayItem): MentorshipSession {
  const statusText = getColumn(item, COLUMN_IDS.status)?.text;

  const status =
    statusText === "Concluída" || statusText === "Cancelada"
      ? statusText
      : "Agendada";

  const dateValue = parseColumnValue(getColumn(item, COLUMN_IDS.date));
  const date =
    typeof dateValue === "object" &&
    dateValue !== null &&
    "date" in dateValue &&
    typeof dateValue.date === "string"
      ? dateValue.date
      : null;

  const responsaveisColumn = getColumn(item, COLUMN_IDS.responsaveis);
  const empresaColumn = getColumn(item, COLUMN_IDS.empresa);

  return {
    mondayItemId: item.id,
    name: item.name,
    date,
    status,
    responsaveis: parseResponsaveis(responsaveisColumn),
    empresa: parseDropdownNames(empresaColumn)[0] ?? null,
  };
}

export async function getMondayMentorshipSession(
  mondayItemId: string,
): Promise<MentorshipSession | null> {
  const token = process.env["MONDAY_API_TOKEN"];

  if (!token) {
    throw new Error("MONDAY_API_TOKEN não está configurado.");
  }

  const query = `
    query {
      boards(ids: [${MENTORSHIP_BOARD_ID}]) {
        items_page(limit: 100) {
          items {
            id
            name
            column_values {
              id
              text
              value
            }
          }
        }
      }
    }
  `;

  const response = await fetch(MONDAY_API_URL, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const result = (await response.json()) as MondayResponse;

  if (!response.ok || result.errors?.length) {
    throw new Error(
      `Erro ao consultar Monday: ${
        result.errors?.map((error) => error.message).join("; ") ??
        response.statusText
      }`,
    );
  }

  const items = result.data?.boards[0]?.items_page.items ?? [];

  const item = items.find((entry) => entry.id === mondayItemId);

  return item ? mapMondayItem(item) : null;
}

export async function getMondayMentorshipSessions(): Promise<
  MentorshipSession[]
> {
  const token = process.env["MONDAY_API_TOKEN"];

  if (!token) {
    throw new Error("MONDAY_API_TOKEN não está configurado.");
  }

  const query = `
    query {
      boards(ids: [${MENTORSHIP_BOARD_ID}]) {
        items_page(limit: 100) {
          items {
            id
            name
            column_values {
              id
              text
              value
            }
          }
        }
      }
    }
  `;

  const response = await fetch(MONDAY_API_URL, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const result = (await response.json()) as MondayResponse;

  if (!response.ok || result.errors?.length) {
    throw new Error(
      `Erro ao consultar Monday: ${
        result.errors?.map((error) => error.message).join("; ") ??
        response.statusText
      }`,
    );
  }

  const items = result.data?.boards[0]?.items_page.items ?? [];

  return items.map(mapMondayItem);
}
