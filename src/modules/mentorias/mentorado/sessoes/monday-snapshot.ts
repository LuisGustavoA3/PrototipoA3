import type { Mentorship } from "@/lib/mentorship-session";
import { mapMondaySubitem } from "@/lib/monday-api";

const DEMO_MENTORSHIP_ID = "13286629656";

type MondayColumn = {
  id: string;
  text: string | null;
  value: string | null;
};

type MondaySnapshotItem = {
  id: string;
  name: string;
  column_values: MondayColumn[];
  subitems: MondaySnapshotItem[];
};

type MondaySnapshot = {
  generatedAt: string;
  boardId: string;
  items: MondaySnapshotItem[];
};

function getColumn(
  item: MondaySnapshotItem,
  id: string,
): MondayColumn | undefined {
  return item.column_values.find((column) => column.id === id);
}

function parseValue(column?: MondayColumn): unknown {
  if (!column?.value) return null;

  try {
    return JSON.parse(column.value);
  } catch {
    return null;
  }
}

function getPeople(item: MondaySnapshotItem, id: string): string[] {
  return (
    getColumn(item, id)
      ?.text?.split(",")
      .map((name) => name.trim())
      .filter(Boolean) ?? []
  );
}

function getDate(item: MondaySnapshotItem, id: string): string | null {
  const value = parseValue(getColumn(item, id));

  if (
    value &&
    typeof value === "object" &&
    "date" in value &&
    typeof value.date === "string"
  ) {
    return value.date;
  }

  return null;
}

function getTimeline(
  item: MondaySnapshotItem,
  id: string,
): Mentorship["schedule"] {
  const value = parseValue(getColumn(item, id));

  if (
    value &&
    typeof value === "object" &&
    "from" in value &&
    "to" in value &&
    typeof value.from === "string" &&
    typeof value.to === "string"
  ) {
    return { from: value.from, to: value.to };
  }

  return null;
}

export async function loadMondaySnapshot(): Promise<{
  mentorship: Mentorship;
  generatedAt: string;
}> {
  const response = await fetch(
    `${import.meta.env.BASE_URL}data/monday-snapshot.json`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error(`Erro ao carregar snapshot: HTTP ${response.status}`);
  }

  const snapshot = (await response.json()) as MondaySnapshot;

  const item = snapshot.items.find((entry) => entry.id === DEMO_MENTORSHIP_ID);

  if (!item) {
    throw new Error(
      `Acompanhamento ${DEMO_MENTORSHIP_ID} não encontrado no snapshot.`,
    );
  }

  const mentorship: Mentorship = {
    mondayItemId: item.id,
    menteeName: item.name,
    portalUserId: null,

    status: getColumn(item, "status")?.text ?? null,

    manager: getPeople(item, "person"),
    monitoring: getPeople(item, "multiple_person_mm84d7pe"),
    attendance: getPeople(item, "multiple_person_mm849v3a"),

    contractDeadline: getDate(item, "date_mm84z7j0"),
    schedule: getTimeline(item, "timerange_mm841xvq"),

    sessions: (item.subitems ?? []).map((subitem) =>
      mapMondaySubitem(subitem, item.id),
    ),
  };

  return {
    mentorship,
    generatedAt: snapshot.generatedAt,
  };
}
