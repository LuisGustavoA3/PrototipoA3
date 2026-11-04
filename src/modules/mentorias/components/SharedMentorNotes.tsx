import { MentorNoteCard } from "./MentorNoteCard";
import { useMentorNotes } from "../trilhas/mentor-notes-store";
export function SharedMentorNotes() {
  const notes = useMentorNotes().filter((note) => note.shared);
  if (!notes.length) return null;
  return (
    <section className="space-y-3 rounded-md border border-border bg-card p-5">
      <h2 className="text-lg font-semibold">
        Anotações compartilhadas do mentor
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {notes.map((note, index) => (
          <MentorNoteCard key={note.id} text={note.text} shared index={index} />
        ))}
      </div>
    </section>
  );
}
