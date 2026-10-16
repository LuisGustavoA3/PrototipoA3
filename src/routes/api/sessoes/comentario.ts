import { createFileRoute } from "@tanstack/react-router";
import { updateMondaySessionComment } from "@/lib/monday-api";

// Identificador fixo do acompanhamento de teste.
// Será substituído pela identificação do usuário autenticado.
const TEST_MENTORSHIP_ID = "13286629656";

export const Route = createFileRoute("/api/sessoes/comentario")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // A gravação permanece restrita ao ambiente de desenvolvimento.
        if (process.env["NODE_ENV"] !== "development") {
          return Response.json(
            { message: "Operação indisponível." },
            { status: 403 },
          );
        }

        let body: unknown;

        try {
          body = await request.json();
        } catch {
          return Response.json({ message: "JSON inválido." }, { status: 400 });
        }

        if (
          typeof body !== "object" ||
          body === null ||
          !("mondaySubitemId" in body) ||
          !("comment" in body) ||
          typeof body.mondaySubitemId !== "string" ||
          typeof body.comment !== "string"
        ) {
          return Response.json(
            { message: "Dados do comentário inválidos." },
            { status: 400 },
          );
        }

        const mondaySubitemId = body.mondaySubitemId;
        const comment = body.comment.trim();

        if (!/^\d+$/.test(mondaySubitemId)) {
          return Response.json(
            { message: "Identificador da sessão inválido." },
            { status: 400 },
          );
        }

        if (comment.length > 5000) {
          return Response.json(
            { message: "O comentário excede 5000 caracteres." },
            { status: 400 },
          );
        }

        try {
          await updateMondaySessionComment(
            TEST_MENTORSHIP_ID,
            mondaySubitemId,
            comment,
          );

          return Response.json({
            success: true,
            mondaySubitemId,
            comment,
          });
        } catch (error) {
          console.error("Erro ao atualizar comentário no Monday:", error);

          return Response.json(
            { message: "Não foi possível salvar o comentário." },
            { status: 500 },
          );
        }
      },
    },
  },
});
