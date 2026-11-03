import { afterEach, describe, expect, it, vi } from "vitest";
import { getCompanyBoard } from "../../server/company-boards";
import { handlers } from "../../server/api/company-sessions";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
describe("quadro de sessões por empresa", () => {
  it("percorre o quadro inteiro e preserva subitens de todos os mentorados", async () => {
    vi.stubEnv("MONDAY_API_TOKEN", "token-de-teste");
    vi.stubGlobal("AbortSignal", { timeout: () => undefined });
    const first = {
      id: "1",
      name: "Luis Gustavo",
      column_values: [],
      subitems: [{ id: "s1", name: "Sessão 1", column_values: [] }],
    };
    const second = {
      id: "2",
      name: "João Pedro",
      column_values: [],
      subitems: [],
    };
    const request = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            boards: [{ items_page: { cursor: "proxima", items: [first] } }],
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: { next_items_page: { cursor: null, items: [second] } },
        }),
      });
    vi.stubGlobal("fetch", request);
    const board = await getCompanyBoard("18435417982");
    expect(board.items).toEqual([first, second]);
    expect(request).toHaveBeenCalledTimes(2);
    expect(JSON.parse(request.mock.calls[0]![1].body).variables).toEqual({
      boardIds: ["18435417982"],
    });
    expect(JSON.parse(request.mock.calls[1]![1].body).variables).toEqual({
      cursor: "proxima",
    });
  });
  it("não aceita empresa sem vínculo nem permite escolher um quadro arbitrário", async () => {
    const response = await handlers.GET({
      request: new Request(
        "http://localhost/api/empresas/sessoes?empresa=outra&boardId=18435417982",
      ),
    });
    expect(response.status).toBe(404);
  });
  it("informa falta de credencial sem expor segredos", async () => {
    vi.stubEnv("MONDAY_API_TOKEN", "");
    const response = await handlers.GET({
      request: new Request(
        "http://localhost/api/empresas/sessoes?empresa=testes",
      ),
    });
    expect(response.status).toBe(503);
  });
  it("rejeita respostas parciais do Monday", async () => {
    vi.stubEnv("MONDAY_API_TOKEN", "token-de-teste");
    vi.stubGlobal("AbortSignal", { timeout: () => undefined });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          data: { boards: [] },
          errors: [{ message: "erro" }],
        }),
      }),
    );
    await expect(getCompanyBoard("18435417982")).rejects.toThrow();
  });
});
