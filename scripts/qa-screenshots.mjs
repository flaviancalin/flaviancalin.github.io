// Capturi de ecran la 5 lățimi + verificare scroll orizontal și erori de consolă.
// Rulare: node scripts/qa-screenshots.mjs [baseUrl]
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.argv[2] ?? "http://localhost:3000";
const WIDTHS = [360, 390, 768, 1024, 1440];
const PAGES = {
  acasa: "/", despre: "/despre-mine", cv: "/despre-mine/cv", program: "/program", tema: "/program/strazi-si-trotuare",
  problema: "/spune-mi-problema", implica: "/implica-te", noutati: "/noutati", articol: "/noutati/articol-exemplu-1",
  contact: "/contact", termeni: "/termeni-si-conditii", admin: "/admin/sesizari", "404": "/nu-exista",
};
const only = process.env.ONLY?.split(",");
mkdirSync("qa/screenshots", { recursive: true });
const browser = await chromium.launch();
const problems = [];
for (const [name, path] of Object.entries(PAGES)) {
  if (only && !only.includes(name)) continue;
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 768 ? 800 : 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    const errs = [];
    page.on("console", (m) => m.type() === "error" && !/tile\.openstreetmap|ERR_TUNNEL|403/.test(m.text()) && errs.push(m.text()));
    page.on("pageerror", (e) => errs.push(String(e)));
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    const overflow = await page.evaluate(() => {
      const dw = document.documentElement.clientWidth;
      if (document.documentElement.scrollWidth <= dw) return null;
      const bad = [...document.querySelectorAll("body *")].filter((el) => { const r = el.getBoundingClientRect(); return r.right > dw + 1 && !el.closest(".overflow-x-auto,.leaflet-container"); }).slice(0, 5);
      return { scrollWidth: document.documentElement.scrollWidth, el: bad.map((e) => e.tagName + "." + String(e.className).slice(0, 60)) };
    });
    if (overflow) problems.push({ name, w, overflow });
    if (errs.length) problems.push({ name, w, errs });
    await page.screenshot({ path: `qa/screenshots/${name}-${w}.jpg`, fullPage: true, type: "jpeg", quality: 70 });
    await ctx.close();
  }
}
await browser.close();
console.log(problems.length ? JSON.stringify(problems, null, 1) : "Fără scroll orizontal și fără erori de consolă.");
