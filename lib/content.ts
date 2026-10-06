import site from "@/content/site.json";
import cifre from "@/content/cifre.json";
import timeline from "@/content/timeline.json";
import studii from "@/content/studii.json";
import despre from "@/content/despre.json";
import program from "@/content/program.json";
import noutati from "@/content/noutati.json";
import cartiere from "@/content/cartiere.json";
import sesizari from "@/content/sesizari.json";

// Conținutul stă în /content (JSON/Markdown), separat de cod, ca să fie portat ușor în Webflow CMS.
export const SITE = site;
export const CIFRE = cifre.cifre;
export const ETAPE = timeline.etape;
export const STUDII = studii.studii;
export const DESPRE = despre;
export const TEME = program.teme;
export const ARTICOLE = noutati.articole;
export const KIT_PRESA = noutati.kitPresa;
export const CARTIERE = cartiere.cartiere;
export const CATEGORII = sesizari.categorii;
export const STATUSURI = sesizari.statusuri;

export type Tema = (typeof TEME)[number];
export type Etapa = (typeof ETAPE)[number];
export type Job = Etapa["joburi"][number];
export type Categorie = (typeof CATEGORII)[number];

export const TODO = "[DE COMPLETAT DE CLIENT]";
export const TODO_SITE = "[DE COMPLETAT DIN SITE-UL ACTUAL]";

export const isTodo = (s: string | null | undefined) => !s || s.startsWith("[DE COMPLETAT");

export function getTema(slug: string) {
  return TEME.find((t) => t.slug === slug);
}
export function getArticol(slug: string) {
  return ARTICOLE.find((a) => a.slug === slug);
}

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://catalinrenghea-preview.vercel.app";
