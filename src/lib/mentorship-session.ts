export type MentorshipSessionStatus = "Agendada" | "Concluída" | "Cancelada";

export type Mentorship = {
  mondayItemId: string;
  menteeName: string;
  portalUserId: string | null;
  status: string | null;
  sessions: MondayMentorshipSession[];
};

export type MondayMentorshipSession = {
  mondaySubitemId: string;
  mondayParentItemId: string;

  name: string;
  consultant: string[];

  scheduledDate: string | null;
  completedDate: string | null;
  deadline: string | null;

  status: string | null;

  plannedHours: number | null;
  completedHours: number | null;

  rescheduled: string | null;
  realization: string | null;

  comment: string | null;
  monitoring: string[];

  progress: number | null;
};

export type MentorshipSession = {
  mondayItemId: string;
  name: string;
  date: string | null;
  status: MentorshipSessionStatus;
  responsaveis: string[];
  empresa: string | null;
};
const sessions: MentorshipSession[] = [];

export function getMentorshipSessions(): MentorshipSession[] {
  return [...sessions];
}

export function getMentorshipSession(
  mondayItemId: string,
): MentorshipSession | undefined {
  return sessions.find((session) => session.mondayItemId === mondayItemId);
}

export function upsertMentorshipSession(
  session: MentorshipSession,
): MentorshipSession {
  const index = sessions.findIndex(
    (item) => item.mondayItemId === session.mondayItemId,
  );

  if (index === -1) {
    sessions.push(session);
    return session;
  }

  sessions[index] = session;
  return sessions[index];
}

export function updateMentorshipSession(
  mondayItemId: string,
  updates: Partial<Omit<MentorshipSession, "mondayItemId">>,
): MentorshipSession | undefined {
  const index = sessions.findIndex(
    (session) => session.mondayItemId === mondayItemId,
  );

  if (index === -1) {
    return undefined;
  }

  const currentSession = sessions[index];

  if (!currentSession) {
    return undefined;
  }

  const updatedSession: MentorshipSession = {
    ...currentSession,
    ...updates,
    mondayItemId: currentSession.mondayItemId,
  };

  sessions[index] = updatedSession;

  return updatedSession;
}
