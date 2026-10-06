import { readFile } from "node:fs/promises";
import path from "node:path";

export const LEGAL = {
  "termeni-si-conditii": "Termeni și condiții",
  "politica-de-confidentialitate": "Politica de confidențialitate",
  "politica-de-cookies": "Politica de cookies",
} as const;
export type LegalSlug = keyof typeof LEGAL;

// Citește Markdown-ul scrapat. Front matter simplu (cheie: valoare), corp în paragrafe și titluri.
export async function getLegal(slug: LegalSlug) {
  const raw = await readFile(path.join(process.cwd(), "content/legal", `${slug}.md`), "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const meta = Object.fromEntries((m?.[1] ?? "").split("\n").filter(Boolean).map((l) => [l.slice(0, l.indexOf(":")), l.slice(l.indexOf(":") + 1).trim()]));
  const body = (m?.[2] ?? raw).trim();
  const blocks = body.split(/\n{2,}/).map((b) => {
    const h = b.match(/^(#{2,3})\s+(.*)$/);
    if (h) return { type: h[1].length === 2 ? "h2" : "h3", text: h[2] } as const;
    if (/^[-*]\s/.test(b)) return { type: "ul", items: b.split("\n").map((l) => l.replace(/^[-*]\s+/, "")) } as const;
    return { type: "p", text: b.replace(/\n/g, " ") } as const;
  });
  return { title: meta.titlu ?? LEGAL[slug], source: meta.sursa, blocks };
}
