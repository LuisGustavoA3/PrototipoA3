import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { appRoutes } from "../router";
import { getLibraryContents } from "@/modules/mentorias/shared/biblioteca/library-store";

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        sessoes: [],
        mentorship: {
          sessions: [],
          progress: 0,
          manager: [],
          monitoring: [],
          attendance: [],
          schedule: null,
        },
      }),
    }),
  );
});

function open(path: string, basename?: string) {
  const router = createMemoryRouter(appRoutes, {
    initialEntries: [path],
    ...(basename ? { basename } : {}),
  });
  const view = render(<RouterProvider router={router} />);
  return { router, ...view };
}

describe("rotas migradas", () => {
  for (const route of appRoutes[0]!.children) {
    if (!route.path || route.path === "*" || route.path.includes(":")) continue;
    it(`renderiza ${route.path}`, async () => {
      const { container, router, unmount } = open(route.path!);
      await waitFor(() => expect(container.textContent).not.toBe(""));
      expect(
        screen.queryByText("Não foi possível carregar a página."),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("Página não encontrada."),
      ).not.toBeInTheDocument();
      if (route.path === "/")
        await waitFor(() =>
          expect(router.state.location.pathname).toBe("/hub"),
        );
      unmount();
      router.dispose();
    });
  }

  it("abre conteúdo por parâmetro e funciona com a base do GitHub Pages", async () => {
    const content = getLibraryContents()[0]!;
    const { router } = open(
      `/PrototipoA3/biblioteca/conteudo/${encodeURIComponent(content.id)}`,
      "/PrototipoA3",
    );
    await waitFor(() =>
      expect(screen.getAllByText(content.name).length).toBeGreaterThan(0),
    );
    expect(router.state.errors).toBeNull();
  });

  it("mantém formulário alterado ao cancelar a saída e permite confirmar", async () => {
    const { container, router } = open("/informacoes-pessoais");
    const input = container.querySelector<HTMLInputElement>(
      'input:not([disabled]):not([type="file"]):not([type="password"])',
    )!;
    fireEvent.change(input, { target: { value: "Nome alterado" } });
    await act(async () => {
      await router.navigate("/hub");
    });
    expect(router.state.location.pathname).toBe("/informacoes-pessoais");
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Continuar editando" }));
    expect(router.state.location.pathname).toBe("/informacoes-pessoais");
    await act(async () => {
      await router.navigate("/hub");
    });
    fireEvent.click(screen.getByRole("button", { name: "Sair sem salvar" }));
    await waitFor(() => expect(router.state.location.pathname).toBe("/hub"));
  });

  it("mostra 404 para uma URL desconhecida", () => {
    open("/pagina-inexistente");
    expect(screen.getByText("Página não encontrada.")).toBeInTheDocument();
  });

  it("atualiza título e descrição ao navegar", async () => {
    const { router } = open("/dashboard");
    expect(document.title).toContain("Dashboard");
    const description = document.head
      .querySelector('meta[name="description"]')
      ?.getAttribute("content");
    expect(description).toBeTruthy();
    await act(async () => {
      await router.navigate("/hub");
    });
    expect(document.title).toContain("Hub de Módulos");
    expect(
      document.head
        .querySelector('meta[name="description"]')
        ?.getAttribute("content"),
    ).not.toBe(description);
  });
});
