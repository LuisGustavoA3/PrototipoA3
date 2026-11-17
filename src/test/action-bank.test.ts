import { describe, expect, it } from "vitest";
import {
  addPdiAction,
  getPdiActions,
  getBankActions,
  updatePdiAction,
} from "@/modules/mentorias/pdi/pdi-store";

describe("Banco de Ações", () => {
  it("inclui ações existentes e copia novas ações preservando autoria e origem", () => {
    expect(getBankActions()).toHaveLength(getPdiActions().length);
    const original = getPdiActions()[0]!;
    const count = getBankActions().length;
    addPdiAction({
      ...original,
      name: "Ação criada para o banco",
      author: "A3",
    });
    const created = getPdiActions().at(-1)!;
    const copy = getBankActions().at(-1)!;
    expect(getBankActions()).toHaveLength(count + 1);
    expect(copy).toMatchObject({
      name: "Ação criada para o banco",
      author: "A3",
      sourceActionId: created.id,
      personId: "luis-gustavo",
      trailId: 601,
    });
    updatePdiAction(created.id, { name: "Ação alterada depois" });
    expect(getBankActions().at(-1)!.name).toBe("Ação criada para o banco");
    expect(getBankActions()).toHaveLength(count + 1);
  });
  it("não copia ações rejeitadas por datas inválidas", () => {
    const count = getBankActions().length;
    addPdiAction({
      ...getPdiActions()[0]!,
      startDate: "2026-10-10",
      endDate: "2026-01-01",
    });
    expect(getBankActions()).toHaveLength(count);
  });
});
