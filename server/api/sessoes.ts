import { getMondayMentorshipByItemId } from "../monday-api";
import { calculateMentorshipProgress } from "../../src/lib/mentorship-session";

// Identificador provisÃ³rio do acompanhamento no Monday.
// SerÃ¡ substituÃ­do pela associaÃ§Ã£o com o usuÃ¡rio autenticado
// quando o Portal A3 implementar cadastro e login.
const TEST_MENTORSHIP_ID = "13286629656";

export const handlers = {
  GET: async () => {
    try {
      const mentorship = await getMondayMentorshipByItemId(TEST_MENTORSHIP_ID);

      if (!mentorship) {
        return Response.json(
          {
            message: "Acompanhamento nÃ£o encontrado.",
          },
          { status: 404 },
        );
      }

      return Response.json({
        mentorship: {
          mondayItemId: mentorship.mondayItemId,
          menteeName: mentorship.menteeName,
          status: mentorship.status,

          manager: mentorship.manager,
          monitoring: mentorship.monitoring,
          attendance: mentorship.attendance,

          contractDeadline: mentorship.contractDeadline,
          schedule: mentorship.schedule,

          progress: calculateMentorshipProgress(mentorship.sessions),
        },

        total: mentorship.sessions.length,
        sessoes: mentorship.sessions,
      });
    } catch (error) {
      console.error("Erro ao buscar sessÃµes no Monday:", error);

      return Response.json(
        {
          message: "NÃ£o foi possÃ­vel buscar as sessÃµes no Monday.",
        },
        { status: 500 },
      );
    }
  },
};
