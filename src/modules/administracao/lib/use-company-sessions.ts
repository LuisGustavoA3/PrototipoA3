import { useQuery } from "@tanstack/react-query";
import { companyBoardSchema } from "@/lib/company-sessions";
export function useCompanySessions(companyId: string) {
  return useQuery({
    queryKey: ["company-sessions", companyId],
    retry: false,
    refetchInterval: 60_000,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const url = import.meta.env.PROD
        ? `${import.meta.env.BASE_URL}data/monday-snapshot.json`
        : `${import.meta.env.BASE_URL}api/empresas/sessoes?empresa=${encodeURIComponent(companyId)}`;
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok)
        throw new Error("Não foi possível consultar o quadro da empresa.");
      const board = companyBoardSchema.parse(await response.json());
      if (companyId !== "testes" || board.boardId !== "18435417982")
        throw new Error("Quadro não associado a esta empresa.");
      return board;
    },
  });
}
