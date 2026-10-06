# catalinrenghea.ro: preview

Preview funcțional al noului site de campanie (Next.js 16, App Router). Conținutul stă în `/content`, separat de cod, pentru portarea în Webflow CMS. Raportul complet e în [PREVIEW-REPORT.md](PREVIEW-REPORT.md).

```bash
npm install
npm run dev            # http://localhost:3000
npm run build && npm start
```

Unelte:

- `tools/scraper/`: bookmarklet care exportă site-ul actual într-un ZIP (`install.html` are instrucțiunile).
- `node tools/import/import.mjs <export-dezarhivat>`: importă exportul în `/content` și `/public/images`.
- `node scripts/qa-screenshots.mjs`: capturi la 360/390/768/1024/1440 și verificarea scroll-ului orizontal (serverul trebuie să ruleze).
- `node scripts/qa-wizard.mjs`: test cap-coadă pentru „Spune-mi problema ta”.
- `node scripts/contrast.mjs`: contrastul WCAG al tokenurilor.

Preview-ul e `noindex` și nu salvează date: rutele `/api/*` doar validează.
