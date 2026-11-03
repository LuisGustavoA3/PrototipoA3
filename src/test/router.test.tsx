import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { appRoutes } from "../router";
import { getLibraryContents } from "@/modules/mentorias/biblioteca/library-store";
import {
  DEFAULT_TRAIL,
  setSelectedTrail,
  initializeSelectedTrail,
  getSelectedTrail,
  hasSelectedTrailContent,
} from "@/modules/mentorias/trilhas/trail-store";
import {
  MENTORADO_TRAILS,
  updateOwnTrail,
} from "@/modules/mentorias/trilhas/trail-store";
import {
  getPdiActions,
  updatePdiAction,
} from "@/modules/mentorias/pdi/pdi-store";
import {
  getSharedFiles,
  updateSharedFile,
} from "@/modules/mentorias/arquivos-compartilhados/shared-files-store";
import { updateAssessment } from "@/modules/mentorias/assessment/assessment-store";
import {
  getEvaluationTools,
  saveEvaluationTool,
} from "@/modules/mentorias/assessment/evaluation-tools";
import {
  getCompanyTools,
  saveCompanyTools,
} from "@/modules/mentorias/assessment/company-tool-contracts";
import {
  defaultSettings,
  saveInstitutionSettings,
} from "@/shared/lib/institution-settings";

beforeEach(() => {
  setSelectedTrail(DEFAULT_TRAIL);
  saveInstitutionSettings(structuredClone(defaultSettings));
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
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  const view = render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
  return { router, ...view };
}

describe("rotas migradas", () => {
  it("mostra Usuários em tabela com ID e espaço para foto e permite buscar pelo ID", () => {
    open("/mentor/usuarios");
    const table = within(screen.getByRole("table", { name: "Usuários" }));
    expect(table.getByRole("columnheader", { name: "ID" })).toBeInTheDocument();
    expect(
      table.getByRole("columnheader", { name: "Foto" }),
    ).toBeInTheDocument();
    expect(
      table.getByRole("img", { name: "Sem foto de Ana Paula Martins" }),
    ).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Buscar usuários"), {
      target: { value: "1001" },
    });
    expect(table.getAllByRole("row")).toHaveLength(2);
    expect(
      table.getByRole("rowheader", { name: "Ana Paula Martins" }),
    ).toBeInTheDocument();
  });

  it("edita imagem, nome e atributos da ferramenta e oferece o formulário de adição", async () => {
    const previous = {
      ...getEvaluationTools().find((item) => item.id === "htm")!,
    };
    open("/mentor/ferramentas-de-avaliacao");
    fireEvent.click(
      screen.getByRole("button", { name: "Adicionar ferramenta" }),
    );
    expect(screen.getByLabelText("Nome da ferramenta")).toHaveValue("");
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    fireEvent.click(screen.getByRole("button", { name: "Editar HTM" }));
    fireEvent.change(screen.getByLabelText("Nome da ferramenta"), {
      target: { value: "HTM atualizado" },
    });
    fireEvent.change(
      screen.getByLabelText("Imagem da ferramenta (URL HTTPS)"),
      { target: { value: "https://example.com/htm.png" } },
    );
    fireEvent.click(screen.getByLabelText("Ferramenta gratuita"));
    fireEvent.click(screen.getByRole("button", { name: "Salvar ferramenta" }));
    try {
      expect(
        screen.getByRole("rowheader", { name: "HTM atualizado" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("img", { name: "Imagem de HTM atualizado" }),
      ).toHaveAttribute("src", "https://example.com/htm.png");
      expect(getEvaluationTools().find((item) => item.id === "htm")?.free).toBe(
        true,
      );
    } finally {
      await act(async () => {
        saveEvaluationTool(previous);
      });
    }
  });

  it("exibe em Mentorias apenas avaliações contratadas em processamento ou concluídas", async () => {
    const previous = getCompanyTools("testes");
    saveCompanyTools("testes", ["ancoras-carreira", "htm"]);
    open("/meu-assessment");
    try {
      expect(
        screen.getByRole("heading", { name: "Âncoras de Carreira" }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("heading", { name: "HTM" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("heading", { name: "CliftonStrengths" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/Tenho interesse em realizar/),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("Aguardando realização"),
      ).not.toBeInTheDocument();
      await act(async () => {
        saveCompanyTools("testes", ["clifton-strengths"]);
      });
      expect(
        screen.getByRole("heading", { name: "CliftonStrengths" }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("heading", { name: "Âncoras de Carreira" }),
      ).not.toBeInTheDocument();
    } finally {
      await act(async () => {
        saveCompanyTools("testes", previous);
      });
    }
  });
  it("usa as oito ferramentas informadas, todas ativas e somente Pipeline gratuito", () => {
    open("/mentor/ferramentas-de-avaliacao");
    const table = within(
      screen.getByRole("table", { name: "Ferramentas de Avaliação" }),
    );
    const names = [
      "Âncoras de Carreira",
      "CliftonStrengths",
      "HTM",
      "HumanGuide",
      "Janusian",
      "MBTI",
      "Perfil Caliper",
      "PERFIL DE GESTÃO: Pipeline de Liderança",
    ];
    expect(table.getAllByRole("row")).toHaveLength(9);
    for (const name of names) {
      const row = within(table.getByRole("rowheader", { name }).closest("tr")!);
      expect(row.getAllByRole("cell")[1]).toHaveTextContent("Sim");
      expect(row.getAllByRole("cell")[2]).toHaveTextContent(
        name.startsWith("PERFIL DE GESTÃO") ? "Sim" : "Não",
      );
    }
    fireEvent.change(screen.getByLabelText("Buscar ferramentas"), {
      target: { value: "HTM" },
    });
    expect(table.getAllByRole("row")).toHaveLength(2);
    expect(table.getByRole("rowheader", { name: "HTM" })).toBeInTheDocument();
  });
  it("compartilha a edição de assessments e a criação de itens da Jornada com o mentorado", async () => {
    const { router } = open(
      "/mentor/mentorados/luis-gustavo/trilhas/trilha-luis-601",
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: "Editar assessment Âncoras de Carreira",
      }),
    );
    const previous = (
      screen.getByLabelText("Descrição do assessment") as HTMLTextAreaElement
    ).value;
    fireEvent.change(screen.getByLabelText("Descrição do assessment"), {
      target: { value: "Descrição editada pela equipe A3" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Salvar assessment" }));
    try {
      await act(async () => {
        await router.navigate("/meu-assessment");
      });
      expect(
        screen.getByText("Descrição editada pela equipe A3"),
      ).toBeInTheDocument();
      await act(async () => {
        await router.navigate(
          "/mentor/mentorados/luis-gustavo/trilhas/trilha-luis-601?secao=Jornada",
        );
      });
      fireEvent.change(screen.getByLabelText("Novo item da Jornada"), {
        target: { value: "Entregável criado no acompanhamento administrativo" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Adicionar item" }));
      await act(async () => {
        await router.navigate("/jornada-de-desenvolvimento");
      });
      expect(
        screen.getByText("Entregável criado no acompanhamento administrativo"),
      ).toBeInTheDocument();
    } finally {
      await act(async () => {
        updateAssessment("Âncoras de Carreira", { description: previous });
      });
    }
  });
  it("inclui a trilha de Luis na Administração e compartilha sua edição com Mentorias", async () => {
    const original = { ...MENTORADO_TRAILS.find((item) => item.id === 601)! };
    const { router } = open("/mentor/trilhas");
    fireEvent.click(
      screen.getByRole("link", {
        name: "Abrir trilha Luis Gustavo Ribeiro — Ciclo 2026",
      }),
    );
    await waitFor(() =>
      expect(router.state.location.pathname).toBe(
        "/mentor/mentorados/luis-gustavo/trilhas/trilha-luis-601",
      ),
    );
    expect(
      screen.getByRole("heading", { name: "Âncoras de Carreira" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Editar trilha" }));
    fireEvent.change(screen.getByLabelText("Nome da trilha"), {
      target: { value: "Luis Gustavo Ribeiro — Ciclo atualizado" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Salvar trilha" }));
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Luis Gustavo Ribeiro — Ciclo atualizado",
      }),
    ).toBeInTheDocument();
    try {
      await act(async () => {
        await router.navigate("/dashboard");
      });
      fireEvent.click(
        screen.getByRole("button", { name: /^Minhas trilhas$/i }),
      );
      expect(
        screen.getByRole("button", {
          name: "Selecionar trilha Luis Gustavo Ribeiro — Ciclo atualizado",
          pressed: true,
        }),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(/Esta trilha ainda não possui/),
      ).not.toBeInTheDocument();
    } finally {
      await act(async () => {
        updateOwnTrail(601, original);
      });
    }
  });

  it("edita o mesmo PDI de Luis nos dois módulos sem expor as ações a outro mentorado", async () => {
    const previous = { ...getPdiActions()[0]! };
    const { router } = open(
      "/mentor/mentorados/luis-gustavo/trilhas/trilha-luis-601?secao=PDI",
    );
    fireEvent.click(
      screen.getByRole("button", { name: `Editar ação ${previous.name}` }),
    );
    fireEvent.change(screen.getByLabelText("Ação"), {
      target: { value: "Ação compartilhada entre os módulos" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Salvar ação" }));
    try {
      await act(async () => {
        await router.navigate("/plano-de-acao");
      });
      expect(
        screen.getByText("Ação compartilhada entre os módulos"),
      ).toBeInTheDocument();
      await act(async () => {
        await router.navigate(
          "/mentor/mentorados/demo-1/trilhas/trilha-demo-1?secao=PDI",
        );
      });
      expect(
        screen.queryByText("Ação compartilhada entre os módulos"),
      ).not.toBeInTheDocument();
    } finally {
      await act(async () => {
        updatePdiAction(previous.id, previous);
      });
    }
  });

  it("edita documentos da mesma fonte usada nos arquivos do mentorado", async () => {
    const previous = { ...getSharedFiles()[0]! };
    const { router } = open(
      "/mentor/mentorados/luis-gustavo/trilhas/trilha-luis-601?secao=Documentos",
    );
    fireEvent.click(
      screen.getByRole("button", { name: `Editar documento ${previous.name}` }),
    );
    fireEvent.change(screen.getByLabelText("Nome do documento"), {
      target: { value: "Documento atualizado pela Administração.pdf" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Salvar documento" }));
    try {
      await act(async () => {
        await router.navigate("/arquivos-compartilhados");
      });
      expect(
        screen.getByText("Documento atualizado pela Administração.pdf"),
      ).toBeInTheDocument();
    } finally {
      await act(async () => {
        updateSharedFile(previous.id, previous);
      });
    }
  });

  it("mantém anotações privadas fora da Jornada e publica somente quando compartilhadas", async () => {
    const { router } = open(
      "/mentor/mentorados/luis-gustavo/trilhas/trilha-luis-601?secao=Anota%C3%A7%C3%B5es",
    );
    fireEvent.change(screen.getByLabelText("Anotação do mentor"), {
      target: { value: "Registro privado do acompanhamento" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Salvar anotação" }));
    await act(async () => {
      await router.navigate("/jornada-de-desenvolvimento");
    });
    expect(
      screen.queryByText("Registro privado do acompanhamento"),
    ).not.toBeInTheDocument();
    await act(async () => {
      await router.navigate(
        "/mentor/mentorados/luis-gustavo/trilhas/trilha-luis-601?secao=Anota%C3%A7%C3%B5es",
      );
    });
    fireEvent.click(screen.getByRole("button", { name: "Editar anotação" }));
    fireEvent.click(
      screen.getByRole("checkbox", { name: "Compartilhar com mentorado" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Salvar anotação" }));
    await act(async () => {
      await router.navigate("/jornada-de-desenvolvimento");
    });
    expect(
      screen.getByText("Registro privado do acompanhamento"),
    ).toBeInTheDocument();
  });
  it("marca a trilha selecionada em Minhas trilhas e preserva a marcação ao reabrir", () => {
    open("/dashboard");
    fireEvent.click(screen.getByRole("button", { name: /^Minhas trilhas$/i }));
    expect(
      screen.getByRole("button", {
        name: "Selecionar trilha Luis Gustavo Ribeiro — Ciclo 2026",
        pressed: true,
      }),
    ).toHaveTextContent("Selecionada");
    fireEvent.click(screen.getByRole("button", { name: "2025" }));
    const previous = screen.getByRole("button", {
      name: "Selecionar trilha Luis Gustavo Ribeiro — Ciclo 2025",
      pressed: false,
    });
    expect(within(previous).queryByText("Selecionada")).not.toBeInTheDocument();
    fireEvent.click(previous);
    expect(
      screen.getByRole("button", {
        name: "Selecionar trilha Luis Gustavo Ribeiro — Ciclo 2025",
        pressed: true,
      }),
    ).toHaveTextContent("Selecionada");
    fireEvent.click(screen.getByRole("button", { name: /^Minhas trilhas$/i }));
    fireEvent.click(screen.getByRole("button", { name: /^Minhas trilhas$/i }));
    expect(
      screen.getByRole("button", {
        name: "Selecionar trilha Luis Gustavo Ribeiro — Ciclo 2025",
        pressed: true,
      }),
    ).toHaveTextContent("Selecionada");
  });
  it("mostra os campos de Informações Pessoais para o usuário selecionado sem copiar dados do operador", () => {
    open("/mentor/usuarios/demo-1?empresa=empresa-demo-1");
    const personal = within(
      screen.getByRole("region", { name: "Informações pessoais" }),
    );
    for (const field of [
      "Sobrenome",
      "Data de nascimento",
      "Sexo",
      "Estado civil",
      "CPF",
      "Telefone celular",
      "Telefone fixo",
      "Cargo",
      "Área",
      "LinkedIn",
      "CEP",
      "Logradouro",
      "Número",
      "Complemento",
      "Bairro",
      "Cidade",
      "Estado",
    ])
      expect(personal.getByText(field)).toBeInTheDocument();
    expect(personal.getByText("Ana")).toBeInTheDocument();
    expect(personal.getByText("Paula Martins")).toBeInTheDocument();
    expect(personal.getByText("participante1@example.com")).toBeInTheDocument();
    expect(
      personal.queryByText("luis.gustavo@a3digital.com.br"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Voltar à empresa/ }),
    ).not.toBeInTheDocument();
    const breadcrumb = within(
      screen.getByRole("navigation", { name: "Navegação estrutural" }),
    );
    expect(
      breadcrumb.getByRole("link", { name: "Empresa Exemplo" }),
    ).toBeInTheDocument();
  });
  it("mostra breadcrumbs de Mentorias no desenvolvimento e permite retornar ao dashboard", async () => {
    const { router } = open("/plano-de-acao");
    const nav = within(
      screen.getByRole("navigation", { name: "Navegação estrutural" }),
    );
    expect(nav.getByText("Meu Desenvolvimento")).not.toHaveAttribute("href");
    expect(nav.getByText("Plano de Ação (PDI)")).toHaveAttribute(
      "aria-current",
      "page",
    );
    fireEvent.click(nav.getByRole("link", { name: "Mentorias" }));
    await waitFor(() =>
      expect(router.state.location.pathname).toBe("/dashboard"),
    );
  });

  it("usa o título do conteúdo e o eixo da biblioteca no breadcrumb", () => {
    const content = getLibraryContents()[0]!;
    open(`/biblioteca/conteudo/${encodeURIComponent(content.id)}`);
    const nav = within(
      screen.getByRole("navigation", { name: "Navegação estrutural" }),
    );
    expect(nav.getByRole("link", { name: "Biblioteca" })).toHaveAttribute(
      "href",
      "/conteudo",
    );
    expect(nav.getByRole("link", { name: content.axis })).toHaveAttribute(
      "href",
      "/biblioteca-negocio",
    );
    expect(nav.getByText(content.name)).toHaveAttribute("aria-current", "page");
  });

  it("abre Informações Pessoais sem navegação de módulo e volta ao Hub", async () => {
    const { router } = open("/informacoes-pessoais?modulo=administracao");
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Perfil" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Voltar" })).toHaveAttribute(
      "href",
      "/hub",
    );
    fireEvent.click(screen.getByRole("link", { name: "Voltar" }));
    await waitFor(() => expect(router.state.location.pathname).toBe("/hub"));
  });

  it("lista capas, IDs, matrículas e filtra trilhas por status e nome da pessoa", () => {
    open("/mentor/trilhas");
    const table = within(
      screen.getByRole("table", { name: "Trilhas individuais" }),
    );
    expect(
      table.getByRole("columnheader", { name: "Matrículas atuais" }),
    ).toBeInTheDocument();
    const row = within(
      table.getByRole("row", { name: /501.*Ana Paula Martins — Ciclo 2026/ }),
    );
    expect(
      row.getByRole("img", {
        name: "Capa da trilha Ana Paula Martins — Ciclo 2026",
      }),
    ).toHaveAttribute("src", expect.stringContaining("trilha-cover.svg"));
    expect(row.getByText("1")).toBeInTheDocument();
    expect(row.getByText("Ativo")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Filtrar status das trilhas"), {
      target: { value: "inativo" },
    });
    expect(
      table.queryByText("Ana Paula Martins — Ciclo 2026"),
    ).not.toBeInTheDocument();
    expect(
      table.getByRole("cell", { name: "Ana Paula Martins — Ciclo 2024" }),
    ).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Buscar trilhas"), {
      target: { value: "Diego" },
    });
    expect(
      table.getByRole("cell", { name: "Diego Almeida — Ciclo 2025" }),
    ).toBeInTheDocument();
    expect(
      table.queryByRole("cell", { name: "Ana Paula Martins — Ciclo 2024" }),
    ).not.toBeInTheDocument();
  });

  it("usa o nome do usuário em Minhas trilhas e preserva a migração da seleção anterior", () => {
    localStorage.setItem("a3-selected-trail", "Gestão de Alta Performance");
    initializeSelectedTrail();
    expect(getSelectedTrail()).toBe("Luis Gustavo Ribeiro — Ciclo 2026");
    expect(hasSelectedTrailContent()).toBe(true);
    open("/dashboard");
    fireEvent.click(screen.getByRole("button", { name: /^Minhas trilhas$/i }));
    expect(
      screen.getByRole("img", {
        name: "Capa da trilha Luis Gustavo Ribeiro — Ciclo 2026",
      }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "2025" }));
    expect(
      screen.getByText("Luis Gustavo Ribeiro — Ciclo 2025"),
    ).toBeInTheDocument();
    expect(screen.getByText("Inativo")).toBeInTheDocument();
  });
  it("mostra a hierarquia da trilha e permite voltar pelo breadcrumb", async () => {
    const { router } = open(
      "/mentor/mentorados/demo-1/trilhas/trilha-demo-1?secao=PDI",
    );
    const breadcrumb = within(
      screen.getByRole("navigation", { name: "Navegação estrutural" }),
    );
    expect(
      breadcrumb.getByRole("link", { name: "Administração" }),
    ).toHaveAttribute("href", "/mentor");
    expect(
      breadcrumb.getByRole("link", { name: "Mentorados" }),
    ).toHaveAttribute("href", "/mentor/mentorados");
    expect(breadcrumb.getByText("PDI")).toHaveAttribute("aria-current", "page");
    fireEvent.click(
      breadcrumb.getByRole("link", { name: "Ana Paula Martins" }),
    );
    await waitFor(() =>
      expect(router.state.location.pathname).toBe("/mentor/mentorados/demo-1"),
    );
    expect(
      screen.getByRole("textbox", { name: "Buscar trilhas do mentorado" }),
    ).toBeInTheDocument();
  });

  it("preserva a empresa de origem no breadcrumb do usuário", () => {
    open("/mentor/usuarios/demo-1?empresa=empresa-demo-1");
    const breadcrumb = within(
      screen.getByRole("navigation", { name: "Navegação estrutural" }),
    );
    expect(
      breadcrumb.getByRole("link", { name: "Empresa Exemplo" }),
    ).toHaveAttribute("href", "/mentor/empresas/empresa-demo-1");
    expect(breadcrumb.getByText("Ana Paula Martins")).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(breadcrumb.getByText("Ana Paula Martins")).not.toHaveAttribute(
      "href",
    );
  });
  it("mostra todos os mentorados e suas sessões no quadro da empresa Testes", async () => {
    const session = (id: string) => ({
      id,
      name: `Sessão ${id}`,
      column_values: [{ id: "status", text: "Concluído", value: null }],
    });
    const board = {
      boardId: "18435417982",
      generatedAt: "2026-11-03T12:00:00.000Z",
      items: [
        {
          id: "luis",
          name: "Luis Gustavo",
          column_values: [],
          subitems: [session("1"), session("2")],
        },
        {
          id: "joao",
          name: "João Pedro",
          column_values: [],
          subitems: [session("3")],
        },
      ],
    };
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => board,
    } as Response);
    open("/mentor/empresas/testes");
    await waitFor(() =>
      expect(screen.getByText("João Pedro")).toBeInTheDocument(),
    );
    expect(screen.getByText("João Pedro")).toBeInTheDocument();
    expect(
      screen.getByText(/2 mentorado\(s\) · 3 sessões/),
    ).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Buscar mentorado no quadro"), {
      target: { value: "João" },
    });
    expect(
      Array.from(document.querySelectorAll("details summary")).some((node) =>
        node.textContent?.includes("Luis Gustavo"),
      ),
    ).toBe(false);
    expect(screen.getByText("João Pedro")).toBeInTheDocument();
    vi.mocked(fetch).mockRejectedValue(new Error("offline"));
    fireEvent.click(screen.getByRole("button", { name: "Atualizar sessões" }));
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Os últimos dados continuam disponíveis",
      ),
    );
    expect(screen.getByText("João Pedro")).toBeInTheDocument();
  });
  it("salva contatos e localização e publica na ajuda do mentorado", async () => {
    const { router } = open("/mentor/configuracoes");
    fireEvent.change(screen.getByLabelText("E-mail"), {
      target: { value: "atendimento@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Bairro, cidade e estado"), {
      target: { value: "Centro, Goiânia — GO" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Salvar alterações" }));
    expect(screen.getByRole("status")).toHaveTextContent("Alterações salvas.");
    await act(async () => {
      await router.navigate("/contatos-localizacao");
    });
    expect(screen.getByText("atendimento@example.com")).toBeInTheDocument();
    expect(screen.getByText("Centro, Goiânia — GO")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Enviar e-mail" })).toHaveAttribute(
      "href",
      "mailto:atendimento@example.com",
    );
  });

  it("edita perguntas e respostas e publica o FAQ", async () => {
    const { router } = open("/mentor/configuracoes");
    fireEvent.click(screen.getByRole("button", { name: "Ajuda e FAQ" }));
    expect(screen.getAllByRole("textbox")).toHaveLength(
      defaultSettings.faq.length * 2,
    );
    fireEvent.change(screen.getByLabelText("Pergunta 1 — Conta e acesso"), {
      target: { value: "Como atualizar meu perfil A3?" },
    });
    fireEvent.change(screen.getByLabelText("Resposta 1 — Conta e acesso"), {
      target: { value: "Acesse Perfil e Informações pessoais." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Salvar alterações" }));
    await act(async () => {
      await router.navigate("/faq");
    });
    fireEvent.click(
      screen.getByRole("button", { name: /Como atualizar meu perfil A3/ }),
    );
    expect(
      screen.getByText("Acesse Perfil e Informações pessoais."),
    ).toBeInTheDocument();
  });

  it("salva os canais escolhidos sem permitir desativar WhatsApp", async () => {
    const { router } = open("/mentor/configuracoes");
    fireEvent.click(
      screen.getAllByRole("button", { name: "Notificações" }).at(-1)!,
    );
    expect(
      screen
        .getByRole("combobox", { name: "Canais de notificação" })
        .querySelectorAll("option"),
    ).toHaveLength(3);
    fireEvent.change(screen.getByLabelText("Canais de notificação"), {
      target: { value: "email" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Salvar alterações" }));
    await act(async () => {
      await router.navigate("/mentor");
      await router.navigate("/mentor/configuracoes");
    });
    fireEvent.click(
      screen.getAllByRole("button", { name: "Notificações" }).at(-1)!,
    );
    expect(screen.getByLabelText("Canais de notificação")).toHaveValue("email");
    expect(
      screen.getByText(/mensagens pelo WhatsApp são obrigatórias/),
    ).toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("abre o usuário em página dedicada e mantém a lista sem detalhes expandidos", async () => {
    const { router } = open("/mentor/usuarios");
    expect(
      screen.queryByRole("heading", { name: "Informações pessoais" }),
    ).not.toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("link", { name: "Gerenciar usuário Ana Paula Martins" }),
    );
    await waitFor(() =>
      expect(router.state.location.pathname).toBe("/mentor/usuarios/demo-1"),
    );
    expect(
      screen.getByRole("heading", { name: "Informações pessoais" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", { name: "Buscar usuários" }),
    ).not.toBeInTheDocument();
  });
  it("abre a empresa em página própria, sem expandir detalhes na listagem", async () => {
    const { router } = open("/mentor/empresas");
    expect(
      screen.queryByRole("heading", { name: "Usuários associados" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/A3 Super Admin/)).not.toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("link", { name: "Abrir empresa Empresa Exemplo" }),
    );
    await waitFor(() =>
      expect(router.state.location.pathname).toBe(
        "/mentor/empresas/empresa-demo-1",
      ),
    );
    expect(
      screen.getByRole("heading", { name: "Usuários associados" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", { name: "Buscar empresas" }),
    ).not.toBeInTheDocument();
  });

  it("não mostra outras trilhas na página da trilha selecionada", () => {
    open("/mentor/mentorados/demo-1/trilhas/trilha-demo-1");
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Ana Paula Martins — Ciclo 2026",
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Ana Paula Martins — Ciclo 2024"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", { name: "Buscar trilhas do mentorado" }),
    ).not.toBeInTheDocument();
  });
  it("busca mentorados e abre a seleção de trilha sem passar pelo cadastro", async () => {
    const { router } = open("/mentor/mentorados");
    fireEvent.change(
      screen.getByRole("textbox", { name: "Buscar mentorados" }),
      { target: { value: "Ana Paula" } },
    );
    expect(screen.queryByText("Bruno Carvalho")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("link", { name: "Abrir acompanhamento" }));
    await waitFor(() =>
      expect(router.state.location.pathname).toBe("/mentor/mentorados/demo-1"),
    );
    expect(
      screen.getByText(/Selecione a trilha que deseja consultar/),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("link", {
        name: /Abrir trilha Ana Paula Martins — Ciclo 2026/,
      }),
    );
    await waitFor(() =>
      expect(router.state.location.pathname).toBe(
        "/mentor/mentorados/demo-1/trilhas/trilha-demo-1",
      ),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Associar assessment" }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Confirmar associação" }),
    );
    expect(screen.getByText(/Aguardando resultado da A3/)).toBeInTheDocument();
  });

  it("abre uma trilha por URL e mantém sessões sem edição manual", () => {
    open("/mentor/mentorados/demo-1/trilhas/trilha-demo-1?secao=Sess%C3%B5es");
    expect(
      screen.getByText(/Nenhuma sessão sincronizada nesta trilha/),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Editar sessão/ }),
    ).not.toBeInTheDocument();
  });

  it("permite acessar o usuário pela empresa e retornar ao contexto de origem", async () => {
    const { router } = open("/mentor/empresas/empresa-demo-1");
    fireEvent.click(
      screen.getAllByRole("link", { name: "Gerenciar usuário" })[0]!,
    );
    await waitFor(() =>
      expect(router.state.location.pathname).toBe("/mentor/usuarios/demo-1"),
    );
    expect(
      within(
        screen.getByRole("navigation", { name: "Navegação estrutural" }),
      ).getByRole("link", { name: "Empresa Exemplo" }),
    ).toHaveAttribute("href", "/mentor/empresas/empresa-demo-1");
    expect(
      screen.getByText(/Informações da conta selecionada/),
    ).toBeInTheDocument();
  });
  it("mantém o formulário pessoal acessível diretamente", () => {
    open("/informacoes-pessoais");
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Voltar" })).toHaveAttribute(
      "href",
      "/hub",
    );
    expect(
      screen.getByRole("heading", { name: "Informações Pessoais" }),
    ).toBeInTheDocument();
  });

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
