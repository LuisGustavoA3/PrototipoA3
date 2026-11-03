import type { MondayMentorshipSession } from "./mentorship-session";

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

function parseColumnValue(column: MondayColumnValue | undefined): unknown {
  if (!column?.value) return null;

  try {
    return JSON.parse(column.value);
  } catch {
    return null;
  }
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

export type MondaySubitem = {
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

    progress: null,
  };
}
