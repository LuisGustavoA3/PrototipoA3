import { afterEach, describe, expect, it, vi } from "vitest";
import { handlers as health } from "../../server/api/health";
import { handlers as sessions } from "../../server/api/sessoes";
import { handlers as comment } from "../../server/api/sessoes/comentario";
import { handlers as webhook } from "../../server/api/monday/webhook";
import {
  getMondayMentorshipByItemId,
  updateMondaySessionComment,
} from "../../server/monday-api";

vi.mock("../../server/monday-api", () => ({
  getMondayMentorshipByItemId: vi.fn(),
  updateMondaySessionComment: vi.fn(),
  getMondayMentorshipSession: vi.fn(),
}));
afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});
const request = (body: unknown) =>
  new Request("http://localhost/api/test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

describe("APIs preservadas fora do frontend", () => {
  it("responde ao health check", async () => {
    expect(await (await health.GET()).json()).toEqual({ status: "ok" });
  });
  it("mantém o 404 para acompanhamento inexistente", async () => {
    vi.mocked(getMondayMentorshipByItemId).mockResolvedValue(null);
    expect((await sessions.GET()).status).toBe(404);
  });
  it("preserva a estrutura da resposta de sessões", async () => {
    vi.mocked(getMondayMentorshipByItemId).mockResolvedValue({
      mondayItemId: "123",
      menteeName: "Teste",
      portalUserId: null,
      status: null,
      manager: [],
      monitoring: [],
      attendance: [],
      contractDeadline: null,
      schedule: null,
      sessions: [],
    });
    const response = await sessions.GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      total: 0,
      sessoes: [],
      mentorship: { mondayItemId: "123" },
    });
  });
  it("proíbe escrita de comentário em produção", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const response = await comment.POST({
      request: request({ mondaySubitemId: "123", comment: "Teste" }),
    });
    expect(response.status).toBe(403);
    expect(updateMondaySessionComment).not.toHaveBeenCalled();
  });
  it("valida identificadores antes de gravar no Monday", async () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(
      (
        await comment.POST({
          request: request({ mondaySubitemId: "inválido", comment: "Teste" }),
        })
      ).status,
    ).toBe(400);
    expect(updateMondaySessionComment).not.toHaveBeenCalled();
  });
  it("mantém a escrita de comentários no desenvolvimento", async () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(
      (
        await comment.POST({
          request: request({ mondaySubitemId: "123", comment: " Teste " }),
        })
      ).status,
    ).toBe(200);
    expect(updateMondaySessionComment).toHaveBeenCalledWith(
      "13286629656",
      "123",
      "Teste",
    );
  });
  it("responde ao desafio do webhook e rejeita eventos inválidos", async () => {
    expect(
      await (
        await webhook.POST({ request: request({ challenge: "abc" }) })
      ).json(),
    ).toEqual({ challenge: "abc" });
    expect((await webhook.POST({ request: request({}) })).status).toBe(400);
  });
});
