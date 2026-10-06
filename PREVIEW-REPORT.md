# Preview catalinrenghea.ro: raport

Stare la 6 octombrie 2026. Branch: `claude/catalin-renghea-site-preview-6ttrc9`.

## Pe scurt

- **Gata:** toate paginile din brief (plus CV complet, pagină de articol și 404), sistemul de design, formularul „Spune-mi problema ta” în 5 pași, demo-ul `/admin/sesizari`, SEO tehnic, QA la 5 lățimi, Lighthouse.
- **Blocat:** scraping-ul site-ului actual (Pasul 1) și publicarea pe Vercel (Pasul 6). Din mediul de lucru, `catalinrenghea.ro` nu se rezolvă prin DNS, iar `api.vercel.com`, `web.archive.org` și `cdnjs` sunt blocate de politica de rețea.
- **Soluția pentru scraping:** bookmarklet-ul din `tools/scraper/` rulează în browserul agenției și produce un ZIP. `tools/import/import.mjs` îl transformă în `/content` și `/public/images` (testat pe un export simulat).
- Până la import, tot ce depinde de site-ul actual apare pe pagină cu marcaj galben `[DE COMPLETAT …]`. Nu s-a inventat nimic.

## Pași și commit-uri

| Pas | Stare | Ce s-a făcut |
|---|---|---|
| 0. Pregătire | gata | Next.js 16.3 (App Router), React 19.2, TypeScript, Tailwind 4, `next/font`, zod 4, Leaflet. Fără biblioteci UI. |
| 1. Scraping | **blocat, unealtă livrată** | Bookmarklet (`tools/scraper/`), pagină de instalare pentru telefon, script de import cu dedup sha256 + dHash, low-res, `images.json`, paletă și fonturi din CSS. |
| 2. Conținut | parțial | `/content/*.json` doar din faptele confirmate în brief. Joburile, studiile și cifrele sunt structurate; detaliile vin din scraping. |
| 3. Design | gata, cu paletă provizorie | Tokens în `app/globals.css`; contrast verificat (tabelul de mai jos). |
| 4. Pagini | gata | Toate paginile din brief, plus CV complet, articol, 404. |
| 5. QA | gata | 75 de capturi în `qa/screenshots/`, Lighthouse în `qa/lighthouse/`. |
| 6. Publicare | **blocat** | Vercel nu e accesibil din mediu. Vezi „Cum se publică”. |

## Decizii luate (fără să întreb)

1. **Scraping prin bookmarklet.** Site-ul nu e accesibil de aici, așa că scriptul rulează în browserul agenției. Nu are dependențe externe (ZIP scris de mână), deci merge și cu CSP strict.
2. **Paleta e provizorie:** albastru `#1747b0` + neutre „Apple” (`#1d1d1f`, `#f5f5f7`). Se înlocuiește dintr-un singur loc (`--color-brand*` în `app/globals.css`) după ce `import.mjs` extrage paleta reală în `content/raw/brand.json`.
3. **Fără dark mode** în preview: brandul nu e încă stabilit, iar o temă întunecată ar dubla munca de verificare a contrastului.
4. **Tipografie:** stack-ul de sistem (SF pe Apple), cu Inter (latin + latin-ext, pentru ș, ț, ă) ca fallback. Inter nu se preîncarcă, pentru că pe dispozitivele Apple nu e folosit. Asta a contat pentru LCP.
5. **Reveal la scroll doar cu CSS** (`animation-timeline: view()`), fără JavaScript. Unde nu e suportat, conținutul e pur și simplu vizibil. Cifrele cresc la intrarea în ecran; server-ul randează valoarea finală.
6. **Tranziții între pagini** cu `<ViewTransition>` din React (suportat nativ de Next 16): un fade scurt. Toată mișcarea e oprită la `prefers-reduced-motion`.
7. **Expand/collapse în timeline** cu `grid-template-rows` 0fr → 1fr. E o schimbare de layout, dar o declanșează doar utilizatorul, deci nu contează la CLS.
8. **zod se încarcă la trimitere** în formularele simple (newsletter, contact, implicare). Pe Acasă, asta a dus Performance de la 79 la 97–100. Formularul de sesizări îl încarcă de la început, pentru validarea pe pași.
9. **Sloganul** („Sectorul 4 merită o primărie care ascultă și rezolvă.”) și subtitlurile temelor din Program sunt propuneri ale agenției, marcate în JSON cu `"propunere-agentie"`. Nu sunt fapte și trebuie aprobate.
10. **„Spune-mi problema ta”:** pinul pornește din centrul Sectorului 4, deci pasul 2 se poate completa și doar de la tastatură. Există și butonul „Mută pinul în centrul hărții”. Poza rămâne local (`blob:`), nu se urcă nicăieri.
11. **Codul de referință** are formatul `S4-AALLZZ-XXXX`. API-ul doar validează și răspunde, nu stochează nimic.
12. **Consimțământul GDPR** e nebifat implicit, obligatoriu, și are text despre scop și retragere.
13. **Footer** fără ANPC/ODR, conform brief-ului.
14. **Preview-ul întreg e `noindex`** (meta `robots` + `robots.txt` cu `Disallow: /`). Din cauza asta Lighthouse SEO iese 63–66: singurul audit picat e `is-crawlable`. La lansare se scoate `noindex`.
15. **Admin demo:** 64 de sesizări fictive generate determinist, în zona Sectorului 4, cu banner „DEMO” pe toată lățimea.

## Inventar imagini

**Încă nu există.** Se generează la import:

```bash
unzip catalinrenghea-export-*.zip -d /tmp/export
node tools/import/import.mjs /tmp/export
```

Rezultatul: `content/images.json` (sursă, cale, dimensiuni, pagini, duplicate, `lowRes`, `whatsapp`, `altPropus`) și `content/raw/import-stats.json` (pagini, imagini unice, duplicate eliminate, low-res). Pe site, toate pozele sunt deocamdată placeholdere gri „FOTO DE ÎNLOCUIT”, cu formatul cerut scris pe ele.

## Contrast (WCAG AA)

Generat cu `node scripts/contrast.mjs --md`. Toate perechile folosite trec AA (4.5:1 pentru text normal).

| Text | Fundal | Raport | AA |
|---|---|---|---|
| ink #1d1d1f | canvas #ffffff | 16.83:1 | da |
| ink-2 #4a4a4f | canvas #ffffff | 8.81:1 | da |
| ink-3 #6e6e73 | canvas #ffffff | 5.07:1 | da |
| ink-3 #6e6e73 | canvas-2 #f5f5f7 | 4.66:1 | da |
| brand #1747b0 | canvas #ffffff | 8.19:1 | da |
| brand #1747b0 | canvas-2 #f5f5f7 | 7.52:1 | da |
| brand #1747b0 | brand-soft #e9effb | 7.10:1 | da |
| canvas #ffffff | brand #1747b0 | 8.19:1 | da |
| canvas #ffffff | brand-strong #0f347f | 11.55:1 | da |
| todo-ink #6b4a00 | todo #fff4d6 | 7.36:1 | da |
| danger #b42318 | canvas #ffffff | 6.57:1 | da |
| ok #1f7a3a | canvas #ffffff | 5.38:1 | da |

## Lighthouse (mobil, build de producție, local)

| Pagină | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Acasă `/` | 97–100 (3 rulări) | 100 | 100 | 63* |
| Formular `/spune-mi-problema` | 96 (3 rulări) | 100 | 100 | 66* |

\* Singurul audit SEO picat este `is-crawlable`, din cauza `noindex`, pus intenționat. Titlurile, descrierile, `lang`, linkurile și `robots.txt` valid trec. Rapoartele complete sunt în `qa/lighthouse/*.report.html`.

Măsurat local, fără tile-uri de hartă (OpenStreetMap e blocat în mediu). Pe Vercel, cifrele se re-măsoară.

## QA vizual

- `node scripts/qa-screenshots.mjs`: 13 pagini × 5 lățimi (360, 390, 768, 1024, 1440). **Fără scroll orizontal** la nicio lățime și fără erori de consolă, în afară de 404-ul așteptat pe pagina 404.
- `node scripts/qa-wizard.mjs`: parcurge fluxul de sesizare pe mobil și pe desktop. Verifică eroarea la pasul 1, eroarea de consimțământ la pasul 4, codul de referință și focusul pe titlul pasului.
- Ce am reparat după ce m-am uitat la capturi:
  - titlul din hero se rupea în 5 rânduri; acum e pe 3, cu „Sectorul 4” nedespărțit;
  - „200 mil €” trecea pe două rânduri;
  - butonul de play acoperea eticheta video;
  - pe mobil și tabletă, portretul împingea mesajul sub fold (acum e limitat la 40% din ecran);
  - un card din timeline se întindea pe verticală;
  - „Altele” rămânea singur pe rând în grila de categorii.
- În capturi, harta apare gri pentru că tile-urile OSM sunt blocate în mediul de lucru. Pinul și punctele se văd.

## Skill-uri

Skill-urile cerute în brief (`frontend-design`, `vercel-react-best-practices`, `vercel-composition-patterns`, `react-view-transitions`, `web-design-guidelines`, `writing-guidelines`, `vercel-deploy-claimable`) **nu sunt instalate** în acest mediu. Instalare:

```bash
npx skills add vercel-labs/agent-skills
```

Am aplicat manual principiile lor: componente server implicit, client doar unde e nevoie; încărcare dinamică pentru Leaflet și zod; `ViewTransition` după ghidul oficial din `node_modules/next/dist/docs`; audit de accesibilitate (focus vizibil, skip link, `aria-current`, `aria-expanded`, `aria-invalid` + `aria-describedby`, ținte ≥ 44px, zoom permis, `lang="ro"`). Auditul formal `web-design-guidelines` trebuie rulat după instalare.

## De verificat cu clientul

1. **Date suprapuse:** „Corp de control” și „Consilier parlamentar” sunt ambele 02–31.07.2024. Au fost simultane?
2. **„Coordonator la Comisia Europeană”** apare în FAQ, dar nu și în cronologie. Îl adăugăm (cu perioadă) sau îl scoatem din FAQ?
3. **Grupări de verificat în timeline:** „Șef de cabinet” (la ce instituție?) și „Corp de control” (al cui?) au fost puse provizoriu la „Guvern și ministere”.
4. **Contextul cifrelor:** ce rol a avut în investițiile Nokian (2 mld €) și Clariant (200 mil €, Craiova)? Formularea finală trebuie să spună exact ce a făcut. Fiecare cifră are câmpul `sursa`, pentru un link verificabil.
5. **Sloganul** și subtitlurile temelor (propuneri ale agenției).
6. **Lista de cartiere** din formular (exemplu: Berceni, Brâncoveanu, Olteniței, Tineretului, Văcărești, Giurgiului, Progresul, Apărătorii Patriei, Timpuri Noi).
7. **LinkedIn:** URL-ul e construit din handle (`/in/cătălin-renghea/`). De confirmat.

## Ce lipsește (de primit de la client)

- Exportul site-ului actual (ZIP prin bookmarklet sau export WordPress), din care vin textele, cronologia completă, studiile și pozele.
- Portret principal (vertical, minimum 1600px), portret de presă, 4–6 fotografii bune (nu exporturi WhatsApp).
- Logo vectorial (SVG) și paleta oficială, dacă există.
- Video de prezentare.
- Program: problema, soluția și 3 angajamente pentru fiecare dintre cele 6 teme (`content/program.json`).
- Biografie scurtă pentru presă (80–100 de cuvinte) și CV-ul în PDF.
- Linkul canalului de WhatsApp.
- Articole reale pentru Noutăți (cele 3 de acum sunt exemple marcate).
- Revizuirea juridică a celor 3 pagini legale (se vor completa cu textul scrapat).

## Cum se publică

Mediul de lucru nu ajunge la Vercel. Variante:

1. **Din calculatorul agenției:** `npx vercel` în acest repo (proiect nou, framework detectat automat). Apoi `vercel --prod` sau doar URL-ul de preview.
2. **Din acest mediu:** se adaugă `vercel.com` și `api.vercel.com` în setările de rețea ale mediului (Network access → Custom → Allowed domains) și un `VERCEL_TOKEN` ca secret.

După publicare, `NEXT_PUBLIC_SITE_URL` se setează la URL-ul real (pentru Open Graph și sitemap).

## Structură pentru Webflow

- `content/site.json`: nume, rol, slogan, contact, rețele sociale.
- `content/cifre.json`: cifre-cheie (valoare, sufix, etichetă, sursă).
- `content/timeline.json`: etape → joburi (rol, organizație, perioadă, responsabilități ≤ 3, realizări ≤ 2). Se mapează pe 2 colecții CMS: Etape și Joburi.
- `content/studii.json`, `content/despre.json`.
- `content/program.json`: colecția Teme (slug, titlu, subtitlu, problemă, soluție, angajamente).
- `content/noutati.json`: colecția Articole + kitul de presă.
- `content/sesizari.json`, `content/cartiere.json`: opțiunile formularului.
- `content/legal/*.md`: paginile legale.
- `content/raw/`: textele originale scrapate, neprelucrate (după import).
