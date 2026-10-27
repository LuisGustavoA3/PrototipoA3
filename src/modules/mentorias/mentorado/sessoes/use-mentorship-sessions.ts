import { useCallback, useEffect, useState } from "react";

import type { MondayMentorshipSession } from "@/lib/mentorship-session";
import { getMentorshipSessionProgress } from "@/lib/mentorship-session";
import { loadMondaySnapshot } from "./monday-snapshot";

type SessionsApiResponse = {
  sessoes: MondayMentorshipSession[];
};

export function useMentorshipSessions() {
  const [sessions, setSessions] = useState<MondayMentorshipSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = useCallback(async () => {
    try {
      let loadedSessions: MondayMentorshipSession[];

      if (import.meta.env.PROD) {
        const snapshot = await loadMondaySnapshot();
        loadedSessions = snapshot.mentorship.sessions;
      } else {
        const response = await fetch(`${import.meta.env.BASE_URL}api/sessoes`);

        if (!response.ok) {
          throw new Error("Não foi possível carregar as sessões.");
        }

        const data = (await response.json()) as SessionsApiResponse;

        loadedSessions = data.sessoes;
      }

      setSessions(loadedSessions);
      setError(null);
    } catch (err) {
      console.error("Erro ao carregar sessões:", err);
      setError("Não foi possível carregar as sessões.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSessions();

    const interval = window.setInterval(() => {
      void loadSessions();
    }, 30_000);

    return () => window.clearInterval(interval);
  }, [loadSessions]);

  const progress = getMentorshipSessionProgress(sessions);

  return {
    sessions,
    progress,
    loading,
    error,
    reload: loadSessions,
  };
}
