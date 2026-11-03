import { useSyncExternalStore } from "react";
type Note = { id: string; text: string; shared: boolean };
let notes: Note[] = [];
const listeners = new Set<() => void>();
export function useMentorNotes() {
  return useSyncExternalStore(
    (notify) => {
      listeners.add(notify);
      return () => {
        listeners.delete(notify);
      };
    },
    () => notes,
    () => notes,
  );
}
export function saveMentorNote(note: Note) {
  if (!note.text.trim()) return;
  notes = notes.some((item) => item.id === note.id)
    ? notes.map((item) =>
        item.id === note.id ? { ...note, text: note.text.trim() } : item,
      )
    : [...notes, { ...note, text: note.text.trim() }];
  listeners.forEach((notify) => notify());
}
