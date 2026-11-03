import { useSyncExternalStore } from "react";
import { z } from "zod";
import { faqQuestions } from "@/modules/mentorias/ajuda/faq-data";

const mapUrl = z
  .string()
  .url()
  .refine((value) => {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      ["www.google.com", "maps.google.com"].includes(url.hostname)
    );
  }, "Use um endereço HTTPS do Google Maps.");
const phoneNumber = z
  .string()
  .trim()
  .refine(
    (value) =>
      /^[+\d\s().-]+$/.test(value) &&
      /^\d{8,15}$/.test(value.replace(/\D/g, "")),
    "Informe um telefone válido com código do país.",
  );
export const settingsSchema = z.object({
  contacts: z.object({
    whatsapp: phoneNumber,
    phone: phoneNumber,
    email: z.string().trim().email(),
    days: z.string().trim().min(1),
    hours: z.string().trim().min(1),
    name: z.string().trim().min(1),
    building: z.string().trim().min(1),
    street: z.string().trim().min(1),
    city: z.string().trim().min(1),
    postal: z.string().trim().min(1),
    maps: mapUrl,
    embed: mapUrl,
  }),
  faq: z.array(
    z.object({
      id: z.string(),
      question: z.string().trim().min(1),
      answer: z.string().trim(),
    }),
  ),
  notifications: z.enum(["push-email", "push", "email"]),
});
export type InstitutionSettings = z.infer<typeof settingsSchema>;
export const defaultSettings: InstitutionSettings = {
  contacts: {
    whatsapp: "+55 (62) 9 9973-7666",
    phone: "+55 (62) 3942-1882",
    email: "falecoma3@a3consultoria.com.br",
    days: "Segunda a sexta-feira",
    hours: "Das 8h às 18h",
    name: "A3 Consultoria",
    building: "Brookfield Towers",
    street: "Av. Dep. Jamel Cecílio, 2929 — Sala 714",
    city: "Jardim Goiás, Goiânia — GO",
    postal: "CEP 74810-100, Brasil",
    maps: "https://www.google.com/maps?q=-16.7047327,-49.2401969",
    embed:
      "https://www.google.com/maps?q=-16.7047327,-49.2401969&z=17&output=embed",
  },
  faq: faqQuestions.map((item) => ({
    id: item.id,
    question: item.question,
    answer: "",
  })),
  notifications: "push-email",
};
const key = "a3-institution-settings-v1";
const listeners = new Set<() => void>();
function read(): InstitutionSettings {
  try {
    const result = settingsSchema.safeParse(
      JSON.parse(localStorage.getItem(key) ?? "null"),
    );
    return result.success
      ? {
          ...result.data,
          faq: defaultSettings.faq.map(
            (item) =>
              result.data.faq.find((saved) => saved.id === item.id) ?? item,
          ),
        }
      : defaultSettings;
  } catch {
    return defaultSettings;
  }
}
let current = read();
export function saveInstitutionSettings(value: InstitutionSettings) {
  const parsed = settingsSchema.parse(value);
  localStorage.setItem(key, JSON.stringify(parsed));
  current = parsed;
  listeners.forEach((notify) => notify());
}
function subscribe(notify: () => void) {
  listeners.add(notify);
  return () => {
    listeners.delete(notify);
  };
}
export function useInstitutionSettings() {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => defaultSettings,
  );
}
export function usePublishedFAQ() {
  const settings = useInstitutionSettings();
  return settings.faq.map((item) => ({
    ...faqQuestions.find((original) => original.id === item.id)!,
    ...item,
  }));
}
