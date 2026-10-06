import { z } from "zod";
import sesizari from "@/content/sesizari.json";

// Scheme comune client + server. Mesajele sunt în română.
const categorii = sesizari.categorii.map((c) => c.id) as [string, ...string[]];

const telefonRe = /^(\+4|0040)?0?7\d{8}$|^(\+4|0040)?0[23]\d{8}$/;
const curatTel = (s: string) => s.replace(/[\s.\-()]/g, "");

export const consimtamant = z.literal(true, { error: "Bifează acordul ca să putem trimite." });
const honeypot = z.string().max(0, { error: "Câmp invalid." }).optional();

export const contactPersoana = z
  .object({
    nume: z.string().trim().max(80).optional(),
    email: z.union([z.literal(""), z.email({ error: "Adresa de email nu pare corectă." })]).optional(),
    telefon: z
      .string()
      .optional()
      .refine((v) => !v || telefonRe.test(curatTel(v)), { error: "Numărul de telefon nu pare corect. Exemplu: 0712 345 678." }),
  })
  .refine((v) => !!(v.email || v.telefon), { error: "Lasă un email sau un număr de telefon.", path: ["email"] });

export const sesizareSchema = z.object({
  categorie: z.enum(categorii, { error: "Alege o categorie." }),
  lat: z.number({ error: "Alege locul pe hartă." }).min(44.3).max(44.5),
  lng: z.number({ error: "Alege locul pe hartă." }).min(26.0).max(26.25),
  cartier: z.string().min(1, { error: "Alege cartierul." }),
  adresa: z.string().trim().max(160).optional(),
  descriere: z
    .string()
    .trim()
    .min(10, { error: "Scrie cel puțin o propoziție (10 caractere)." })
    .max(500, { error: "Maximum 500 de caractere." }),
  areFoto: z.boolean().optional(),
  contact: contactPersoana,
  consimtamant,
  website: honeypot,
});
export type Sesizare = z.infer<typeof sesizareSchema>;

export const pasiSesizare = {
  1: sesizareSchema.pick({ categorie: true }),
  2: sesizareSchema.pick({ lat: true, lng: true, cartier: true, adresa: true }),
  3: sesizareSchema.pick({ descriere: true }),
  4: sesizareSchema.pick({ contact: true, consimtamant: true }),
} as const;

export const implicareSchema = z.object({
  tip: z.enum(["voluntar", "sustinator", "ambasador"], { error: "Alege cum vrei să te implici." }),
  nume: z.string().trim().min(2, { error: "Scrie-ți numele." }).max(80),
  email: z.email({ error: "Adresa de email nu pare corectă." }),
  telefon: z.string().optional().refine((v) => !v || telefonRe.test(curatTel(v)), { error: "Numărul de telefon nu pare corect." }),
  cartier: z.string().optional(),
  consimtamant,
  website: honeypot,
});

export const contactSchema = z.object({
  motiv: z.enum(["intrebare", "problema", "presa"], { error: "Alege motivul." }),
  nume: z.string().trim().min(2, { error: "Scrie-ți numele." }).max(80),
  email: z.email({ error: "Adresa de email nu pare corectă." }),
  mesaj: z.string().trim().min(10, { error: "Mesajul e prea scurt (minimum 10 caractere)." }).max(2000),
  consimtamant,
  website: honeypot,
});

export const newsletterSchema = z.object({
  email: z.email({ error: "Adresa de email nu pare corectă." }),
  consimtamant,
  website: honeypot,
});

export const formulare = { implicare: implicareSchema, contact: contactSchema, newsletter: newsletterSchema } as const;
export type TipFormular = keyof typeof formulare;

export function eroriPeCampuri(err: z.ZodError) {
  const out: Record<string, string> = {};
  for (const i of err.issues) {
    const k = i.path.join(".") || "_";
    if (!out[k]) out[k] = i.message;
  }
  return out;
}
