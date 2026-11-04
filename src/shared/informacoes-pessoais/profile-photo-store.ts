import { useSyncExternalStore } from "react";
const key = "a3-profile-photo-v1";
let photo: string | null = null;
try {
  photo = localStorage.getItem(key);
} catch {
  /* Usa o avatar padrão. */
}
const listeners = new Set<() => void>();
export function getProfilePhoto() {
  return photo;
}
export function saveProfilePhoto(value: string | null) {
  if (value) localStorage.setItem(key, value);
  else localStorage.removeItem(key);
  photo = value;
  listeners.forEach((notify) => notify());
}
export function useProfilePhoto() {
  return useSyncExternalStore(
    (notify) => {
      listeners.add(notify);
      return () => {
        listeners.delete(notify);
      };
    },
    getProfilePhoto,
    getProfilePhoto,
  );
}
