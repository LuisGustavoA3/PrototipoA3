import { useMentorNotes } from "../trilhas/mentor-notes-store";
export function SharedMentorNotes() {
  const notes = useMentorNotes().filter((note) => note.shared);
  if (!notes.length) return null;
  return (
    <section className="space-y-3 rounded-md border border-border bg-card p-5">
      <h2 className="text-lg font-semibold">
        Anotações compartilhadas do mentor
      </h2>
      {notes.map((note) => (
        <p
          key={note.id}
          className="whitespace-pre-line border-t border-border pt-3 text-sm"
        >
          {note.text}
        </p>
      ))}
    </section>
  );
}
