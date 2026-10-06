// Importă exportul făcut de bookmarklet (ZIP dezarhivat) în /content și /public/images.
// Rulare: node tools/import/import.mjs <folder-export-dezarhivat>
//
// Face:
//  - texte: fiecare pagină → content/raw/<slug>.md (+ .json cu HTML-ul original)
//  - imagini: dedup (sha256 + hash perceptual dHash), marcaj low-res (<1200px), copiere în public/images,
//    content/images.json cu sursă, dimensiuni, pagini, alt propus
//  - brand: culori și fonturi din CSS → content/raw/brand.json
//  - statistici → content/raw/import-stats.json
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync, copyFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import TurndownService from "turndown";
import * as cheerio from "cheerio";

const SRC = process.argv[2];
if (!SRC || !existsSync(SRC)) { console.error("Folosire: node tools/import/import.mjs <folder-export>"); process.exit(1); }
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const OUT_RAW = path.join(ROOT, "content/raw");
const OUT_IMG = path.join(ROOT, "public/images");
mkdirSync(OUT_RAW, { recursive: true });
mkdirSync(OUT_IMG, { recursive: true });

const readJson = (p, d) => { try { return JSON.parse(readFileSync(path.join(SRC, p), "utf8")); } catch { return d; } };
const manifest = readJson("manifest.json", { pages: [], assets: [], failed: [] });
const td = new TurndownService({ headingStyle: "atx", bulletListMarker: "-" });
td.remove(["script", "style", "noscript", "iframe", "form"]);

// ---------- 1) Texte ----------
const pages = [...readJson("api/pages.json", []), ...readJson("api/posts.json", []).map((p) => ({ ...p, _post: true }))];
const textStats = [];
const slugFromUrl = (u) => new URL(u).pathname.replace(/^\/|\/$/g, "").replace(/\//g, "__") || "acasa";

function cleanHtml(html) {
  const $ = cheerio.load(html);
  // Elementor/WP: scoate butoane de share, meniuri, footere din conținut
  $("nav, footer, header, .elementor-share-buttons, .sharedaddy, .wp-block-buttons").remove();
  return $.html();
}

if (pages.length) {
  for (const p of pages) {
    const slug = p.slug || slugFromUrl(p.link);
    const title = cheerio.load(p.title?.rendered ?? "").text();
    const md = `---\ntitlu: ${JSON.stringify(title)}\nsursa: ${p.link}\nmodificat: ${p.modified ?? ""}\ntip: ${p._post ? "articol" : "pagina"}\n---\n\n# ${title}\n\n${td.turndown(cleanHtml(p.content?.rendered ?? ""))}\n`;
    writeFileSync(path.join(OUT_RAW, `${slug}.md`), md);
    writeFileSync(path.join(OUT_RAW, `${slug}.json`), JSON.stringify({ id: p.id, slug, title, link: p.link, date: p.date, modified: p.modified, html: p.content?.rendered, excerpt: p.excerpt?.rendered }, null, 1));
    textStats.push({ slug, sursa: "api", cuvinte: md.split(/\s+/).length });
  }
}
// Completează din HTML paginile pe care API-ul nu le-a dat (sau toate, dacă API-ul a fost blocat).
for (const pg of manifest.pages ?? []) {
  const slug = slugFromUrl(pg.url);
  if (existsSync(path.join(OUT_RAW, `${slug}.md`))) continue;
  const file = path.join(SRC, pg.file);
  if (!existsSync(file)) continue;
  const $ = cheerio.load(readFileSync(file, "utf8"));
  const title = $("h1").first().text().trim() || $("title").text().trim();
  const main = $("main").length ? $("main") : $(".entry-content, .elementor-section-wrap, #content, body").first();
  main.find("script, style, nav, footer, header, form").remove();
  const md = `---\ntitlu: ${JSON.stringify(title)}\nsursa: ${pg.url}\ntip: pagina-html\n---\n\n${td.turndown(main.html() ?? "")}\n`;
  writeFileSync(path.join(OUT_RAW, `${slug}.md`), md);
  textStats.push({ slug, sursa: "html", cuvinte: md.split(/\s+/).length });
}

// ---------- 2) Imagini ----------
function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((f) => { const p = path.join(dir, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
}
const imgFiles = walk(path.join(SRC, "files")).filter((f) => /\.(jpe?g|png|webp|gif|avif|svg)$/i.test(f));
const assetBy = new Map((manifest.assets ?? []).map((a) => [a.file, a]));
const mediaApi = readJson("api/media.json", []);
const altByUrl = new Map(mediaApi.map((m) => [m.source_url, m.alt_text || cheerio.load(m.title?.rendered ?? "").text()]));

async function dhash(file) {
  const buf = await sharp(file).grayscale().resize(9, 8, { fit: "fill" }).raw().toBuffer();
  let h = 0n;
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) h = (h << 1n) | (buf[y * 9 + x] > buf[y * 9 + x + 1] ? 1n : 0n);
  return h;
}
const hamming = (a, b) => { let x = a ^ b, n = 0; while (x) { n += Number(x & 1n); x >>= 1n; } return n; };

function altPropus(rel, apiAlt) {
  if (apiAlt && !/^(whatsapp|img|dsc|image)[-_ ]/i.test(apiAlt)) return apiAlt;
  const base = path.basename(rel).replace(/\.[^.]+$/, "");
  if (/logo/i.test(base)) return "Logo Cătălin Renghea";
  if (/whatsapp|img|dsc|image/i.test(base)) return "[ALT DE SCRIS: descrie ce se vede în fotografie]";
  return base.replace(/[-_]+/g, " ").replace(/\b\d{2,}\b/g, "").trim();
}

const items = [];
for (const f of imgFiles) {
  const rel = path.relative(path.join(SRC, "files"), f);
  const buf = readFileSync(f);
  const sha = createHash("sha256").update(buf).digest("hex");
  let width = null, height = null, ph = null;
  try {
    const meta = await sharp(f).metadata();
    width = meta.width; height = meta.height;
    if (!/\.svg$/i.test(f)) ph = await dhash(f);
  } catch { /* fișier corupt sau format nesuportat */ }
  const asset = assetBy.get(`files/${rel}`) ?? {};
  items.push({ f, rel, sha, ph, width, height, bytes: buf.length, url: asset.url ?? null, foundOn: asset.foundOn ?? [], apiAlt: altByUrl.get(asset.url) });
}

// Dedup: același sha256, sau dHash cu distanță ≤ 4 (aceeași poză, alt export/compresie). Păstrăm varianta cea mai mare.
const groups = [];
// Ordine: rezoluție, apoi nume non-WhatsApp, apoi dimensiunea fișierului (calitate JPEG mai mare).
const score = (x) => [(x.width ?? 0) * (x.height ?? 0), /whatsapp/i.test(x.rel) ? 0 : 1, x.bytes];
const necitite = items.filter((x) => x.width === null && !/\.svg$/i.test(x.rel));
for (const it of items.filter((x) => !necitite.includes(x)).sort((a, b) => { const [p, q] = [score(a), score(b)]; return q[0] - p[0] || q[1] - p[1] || q[2] - p[2]; })) {
  const g = groups.find((g) => g.keep.sha === it.sha || (g.keep.ph !== null && it.ph !== null && hamming(g.keep.ph, it.ph) <= 4));
  if (g) g.dupes.push(it); else groups.push({ keep: it, dupes: [] });
}

const images = [];
for (const { keep, dupes } of groups) {
  const name = path.basename(keep.rel).toLowerCase().replace(/[^a-z0-9.\-_]+/g, "-");
  let dest = name;
  for (let i = 2; images.some((x) => x.cale === `/images/${dest}`); i++) dest = name.replace(/(\.[^.]+)$/, `-${i}$1`);
  copyFileSync(keep.f, path.join(OUT_IMG, dest));
  images.push({
    cale: `/images/${dest}`,
    sursa: keep.url,
    latime: keep.width,
    inaltime: keep.height,
    kb: Math.round(keep.bytes / 1024),
    lowRes: keep.width !== null && keep.width < 1200 && !/logo|icon|favicon/i.test(keep.rel),
    whatsapp: /whatsapp/i.test(keep.rel),
    pagini: [...new Set([...keep.foundOn, ...dupes.flatMap((d) => d.foundOn)])],
    duplicate: dupes.map((d) => d.url ?? d.rel),
    sha256: keep.sha,
    altPropus: altPropus(keep.rel, keep.apiAlt),
  });
}
writeFileSync(path.join(ROOT, "content/images.json"), JSON.stringify({ _nota: "Inventar generat de tools/import/import.mjs. altPropus se verifică manual.", imagini: images }, null, 2));

// ---------- 3) Brand: culori, fonturi, logo ----------
const cssDir = path.join(SRC, "css");
const css = existsSync(cssDir) ? readdirSync(cssDir).map((f) => readFileSync(path.join(cssDir, f), "utf8")).join("\n") : "";
const inlineCss = (manifest.pages ?? []).map((p) => { try { return cheerio.load(readFileSync(path.join(SRC, p.file), "utf8"))("style").text(); } catch { return ""; } }).join("\n");
const allCss = css + "\n" + inlineCss;
const norm = (c) => { c = c.toLowerCase(); if (/^#[0-9a-f]{3}$/.test(c)) c = "#" + [...c.slice(1)].map((x) => x + x).join(""); return c; };
const colorCount = {};
for (const m of allCss.matchAll(/#[0-9a-f]{6}\b|#[0-9a-f]{3}\b/gi)) { const c = norm(m[0]); colorCount[c] = (colorCount[c] ?? 0) + 1; }
for (const m of allCss.matchAll(/--e-global-color-(\w+):\s*(#[0-9a-f]{3,6})/gi)) colorCount[`${norm(m[2])} (elementor ${m[1]})`] = 999;
const fonts = {};
for (const m of allCss.matchAll(/font-family:\s*([^;}]+)/gi)) { const f = m[1].split(",")[0].replace(/["']/g, "").trim(); fonts[f] = (fonts[f] ?? 0) + 1; }
const isGray = (c) => { const h = c.slice(0, 7); if (!/^#[0-9a-f]{6}$/.test(h)) return false; const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); return Math.max(r, g, b) - Math.min(r, g, b) < 16; };
const top = Object.entries(colorCount).sort((a, b) => b[1] - a[1]);
const brand = {
  culoriCromatice: top.filter(([c]) => !isGray(c)).slice(0, 12),
  neutre: top.filter(([c]) => isGray(c)).slice(0, 8),
  fonturi: Object.entries(fonts).sort((a, b) => b[1] - a[1]).slice(0, 8),
  logo: images.filter((i) => /logo/i.test(i.cale)).map((i) => i.cale),
};
writeFileSync(path.join(OUT_RAW, "brand.json"), JSON.stringify(brand, null, 2));

// ---------- 4) Statistici ----------
const stats = {
  pagini: textStats.length,
  paginiDetaliu: textStats,
  imaginiGasite: items.length,
  imaginiUnice: images.length,
  duplicateEliminate: items.length - necitite.length - images.length,
  necitite: necitite.map((x) => x.rel),
  lowRes: images.filter((i) => i.lowRes).length,
  whatsapp: images.filter((i) => i.whatsapp).length,
  adreseEsuate: (manifest.failed ?? []).length,
};
writeFileSync(path.join(OUT_RAW, "import-stats.json"), JSON.stringify(stats, null, 2));
console.log(JSON.stringify({ ...stats, paginiDetaliu: undefined, brand: { culori: brand.culoriCromatice.slice(0, 5), fonturi: brand.fonturi.slice(0, 3), logo: brand.logo } }, null, 1));
