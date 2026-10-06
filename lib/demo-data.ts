import { CARTIERE, CATEGORII, STATUSURI } from "./content";

// DATE FICTIVE pentru demo-ul /admin/sesizari. Generate determinist (aceleași la fiecare build).
// Nu conțin date personale; coordonatele sunt aleatoare în zona Sectorului 4.
function rng(seed: number) {
  return () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
}

const descrieri: Record<string, string[]> = {
  strazi: ["Groapă mare în carosabil", "Trotuar rupt lângă trecere", "Bordură căzută"],
  iluminat: ["Stâlp stins de o săptămână", "Bec care pâlpâie noaptea", "Alee fără lumină"],
  parcari: ["Mașini parcate pe trecere", "Semafor defect", "Indicator lipsă"],
  parcuri: ["Bănci rupte în parc", "Iarbă netăiată", "Loc de joacă deteriorat"],
  salubritate: ["Gunoi neridicat", "Pubele pline", "Moloz abandonat"],
  scoli: ["Gard deteriorat la școală", "Trecere nesemnalizată lângă grădiniță", "Curte fără umbră"],
  social: ["Vârstnic care are nevoie de ajutor", "Familie fără căldură", "Persoană fără adăpost"],
  siguranta: ["Zonă neluminată și nesigură", "Câini fără stăpân", "Clădire abandonată deschisă"],
  altele: ["Zgomot de la un șantier", "Panou publicitar căzut", "Altă problemă"],
};

export type SesizareDemo = { cod: string; data: string; categorie: string; cartier: string; status: string; titlu: string; lat: number; lng: number };

export function sesizariDemo(n = 64): SesizareDemo[] {
  const r = rng(42);
  const cartiere = CARTIERE.filter((c) => !c.startsWith("Altul"));
  const start = Date.UTC(2026, 8, 1);
  return Array.from({ length: n }, (_, i) => {
    const cat = CATEGORII[Math.floor(r() * CATEGORII.length)].id;
    const d = new Date(start + Math.floor(r() * 35) * 86400000);
    const st = STATUSURI[Math.min(STATUSURI.length - 1, Math.floor(r() * r() * 4.2))];
    return {
      cod: `S4-DEMO-${String(i + 1).padStart(3, "0")}`,
      data: d.toISOString().slice(0, 10),
      categorie: cat,
      cartier: cartiere[Math.floor(r() * cartiere.length)],
      status: st,
      titlu: descrieri[cat][Math.floor(r() * 3)],
      lat: 44.355 + r() * 0.055,
      lng: 26.085 + r() * 0.07,
    };
  }).sort((a, b) => b.data.localeCompare(a.data));
}
