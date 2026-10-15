import type {
  Mentorship,
  MentorshipSession,
  MondayMentorshipSession,
} from "@/lib/mentorship-session";

const MONDAY_API_URL = "https://api.monday.com/v2";
const MENTORSHIP_BOARD_ID = "18432549548";
const NEW_MENTORSHIP_BOARD_ID = "18435417982";

const SUBITEM_COLUMN_IDS = {
  consultant: "dropdown_mm84vfed",
  scheduledDate: "date_mm84c3xg",
  status: "status",
  completedDate: "date0",
  deadline: "date_mm84q8q4",
  plannedHours: "numeric_mm84pxr4",
  completedHours: "duration_mm84p16x",
  rescheduled: "color_mm84ddf4",
  realization: "color_mm84z8kf",
  comment: "text_mm84trs9",
  monitoring: "dropdown_mm8470tq",
  progress: "columns_battery_mm842nq9",
} as const;

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
        cursor: string | null;
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

  const sessions: MentorshipSession[] = [];
  let cursor: string | null = null;
  let hasMore = true;

  while (hasMore) {
    const query = cursor
      ? `
        query {
          next_items_page(limit: 100, cursor: "${cursor}") {
            cursor
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
      `
      : `
        query {
          boards(ids: [${MENTORSHIP_BOARD_ID}]) {
            items_page(limit: 100) {
              cursor
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

    const result = (await response.json()) as MondayResponse & {
      data?: {
        next_items_page?: {
          cursor: string | null;
          items: MondayItem[];
        };
      };
    };

    if (!response.ok || result.errors?.length) {
      throw new Error(
        `Erro ao consultar Monday: ${
          result.errors?.map((error) => error.message).join("; ") ??
          response.statusText
        }`,
      );
    }

    const page:
      | {
          cursor: string | null;
          items: MondayItem[];
        }
      | undefined = cursor
      ? result.data?.next_items_page
      : result.data?.boards[0]?.items_page;

    if (!page) {
      throw new Error("A resposta do Monday não contém os itens esperados.");
    }

    sessions.push(...page.items.map(mapMondayItem));
    cursor = page.cursor;
    hasMore = cursor !== null;
  }

  return sessions;
}

type MondaySubitem = {
  id: string;
  name: string;
  column_values: MondayColumnValue[];
};

function getSubitemColumn(
  item: MondaySubitem,
  columnId: string,
): MondayColumnValue | undefined {
  return item.column_values.find((column) => column.id === columnId);
}

function getSubitemText(item: MondaySubitem, columnId: string): string | null {
  return getSubitemColumn(item, columnId)?.text ?? null;
}

function getSubitemDate(item: MondaySubitem, columnId: string): string | null {
  const column = getSubitemColumn(item, columnId);
  const value = parseColumnValue(column);

  if (
    typeof value === "object" &&
    value !== null &&
    "date" in value &&
    typeof value.date === "string"
  ) {
    return value.date;
  }

  return null;
}

function getSubitemNumber(
  item: MondaySubitem,
  columnId: string,
): number | null {
  const text = getSubitemText(item, columnId);

  if (!text) return null;

  const number = Number(text.replace(",", "."));

  return Number.isFinite(number) ? number : null;
}

function getSubitemTrackedHours(
  item: MondaySubitem,
  columnId: string,
): number | null {
  const column = getSubitemColumn(item, columnId);
  const value = parseColumnValue(column);

  if (
    typeof value !== "object" ||
    value === null ||
    !("duration" in value) ||
    typeof value.duration !== "number" ||
    !Number.isFinite(value.duration) ||
    value.duration <= 0
  ) {
    return null;
  }

  // O Monday retorna a duração em segundos.
  return value.duration / 3600;
}

export function mapMondaySubitem(
  item: MondaySubitem,
  parentItemId: string,
): MondayMentorshipSession {
  return {
    mondaySubitemId: item.id,
    mondayParentItemId: parentItemId,

    name: item.name,

    consultant: parseDropdownNames(
      getSubitemColumn(item, SUBITEM_COLUMN_IDS.consultant),
    ),

    scheduledDate: getSubitemDate(item, SUBITEM_COLUMN_IDS.scheduledDate),

    completedDate: getSubitemDate(item, SUBITEM_COLUMN_IDS.completedDate),

    deadline: getSubitemDate(item, SUBITEM_COLUMN_IDS.deadline),

    status: getSubitemText(item, SUBITEM_COLUMN_IDS.status),

    plannedHours: getSubitemNumber(item, SUBITEM_COLUMN_IDS.plannedHours),

    completedHours: getSubitemTrackedHours(
      item,
      SUBITEM_COLUMN_IDS.completedHours,
    ),

    rescheduled: getSubitemText(item, SUBITEM_COLUMN_IDS.rescheduled),

    realization: getSubitemText(item, SUBITEM_COLUMN_IDS.realization),

    comment: getSubitemText(item, SUBITEM_COLUMN_IDS.comment),

    monitoring: parseDropdownNames(
      getSubitemColumn(item, SUBITEM_COLUMN_IDS.monitoring),
    ),

    // O formato da coluna progress também
    // precisa ser confirmado com dados reais.
    progress: null,
  };
}

export async function getMondayMentorshipByItemId(
  mondayItemId: string,
): Promise<Mentorship | null> {
  const token = process.env["MONDAY_API_TOKEN"];

  if (!token) {
    throw new Error("MONDAY_API_TOKEN não está configurado.");
  }

  if (!/^\d+$/.test(mondayItemId)) {
    throw new Error("ID do acompanhamento inválido.");
  }

  const query = `
    query GetMentorship($itemIds: [ID!]!) {
      items(ids: $itemIds) {
        id
        name
        board {
          id
        }
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
      }
    }
  `;

  const response = await fetch(MONDAY_API_URL, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        itemIds: [mondayItemId],
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Erro HTTP ao consultar Monday: ${response.status}`);
  }

  type MondayMentorshipItem = {
    id: string;
    name: string;
    board: {
      id: string;
    } | null;
    column_values: MondayColumnValue[];
    subitems: MondaySubitem[];
  };

  type MondayMentorshipResponse = {
    data?: {
      items: MondayMentorshipItem[];
    };
    errors?: Array<{
      message: string;
    }>;
  };

  const result = (await response.json()) as MondayMentorshipResponse;

  if (result.errors?.length) {
    throw new Error(result.errors.map((error) => error.message).join("; "));
  }

  const item = result.data?.items?.[0];

  if (!item) {
    return null;
  }

  if (String(item.board?.id) !== NEW_MENTORSHIP_BOARD_ID) {
    throw new Error("O acompanhamento não pertence ao novo quadro.");
  }

  const status =
    item.column_values.find((column) => column.id === "status")?.text ?? null;

  const mentorship: Mentorship = {
    mondayItemId: item.id,
    menteeName: item.name,
    portalUserId: null,
    status,
    sessions: (item.subitems ?? []).map((subitem) =>
      mapMondaySubitem(subitem, item.id),
    ),
  };

  return mentorship;
}
