// Verifică contrastul WCAG al perechilor de culori din tokens (app/globals.css).
import { readFileSync } from 'node:fs';
const css = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');
const t = Object.fromEntries([...css.matchAll(/--color-([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]));
const lum = (h) => { const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const pairs = [['ink', 'canvas'], ['ink-2', 'canvas'], ['ink-3', 'canvas'], ['ink-3', 'canvas-2'], ['brand', 'canvas'], ['brand', 'canvas-2'], ['brand', 'brand-soft'], ['canvas', 'brand'], ['canvas', 'brand-strong'], ['todo-ink', 'todo'], ['danger', 'canvas'], ['ok', 'canvas'], ['ink', 'canvas-3']];
const rows = pairs.map(([f, b]) => { const r = ratio(t[f], t[b]); return { text: `${f} ${t[f]}`, fundal: `${b} ${t[b]}`, raport: r.toFixed(2) + ':1', AA: r >= 4.5 ? 'da' : r >= 3 ? 'doar text mare' : 'NU' }; });
console.table(rows);
if (process.argv[2] === '--md') console.log(rows.map((r) => `| ${r.text} | ${r.fundal} | ${r.raport} | ${r.AA} |`).join('\n'));
