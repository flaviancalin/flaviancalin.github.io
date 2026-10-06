# Preview catalinrenghea.ro: raport

Stare la 6 octombrie 2026. Branch: `claude/catalin-renghea-site-preview-6ttrc9`.

## Pe scurt

- **Gata:**
  - toate paginile din brief, plus CV complet, pagină de articol și 404;
  - conținutul real importat din site-ul actual: cronologia cu 12 roluri, studiile, povestea, FAQ-ul, cifrele, paginile legale, CV-ul PDF;
  - 5 fotografii reale și logo-ul vectorizat;
  - paleta de brand extrasă din CSS;
  - formularul „Spune-mi problema ta” în 5 pași și demo-ul `/admin/sesizari`;
  - SEO tehnic, QA la 5 lățimi, Lighthouse.
- **Placeholder:**
  - Programul (cele 6 teme): pe site-ul actual e doar conținut demo al temei;
  - Noutățile: 3 articole exemplu;
  - videoclipul de prezentare;
  - canalul de WhatsApp.
- **Blocat:** publicarea pe Vercel, pentru că mediul de lucru nu ajunge la `api.vercel.com`. Vezi „Cum se publică”.

## Pași și commit-uri

| Pas | Stare | Ce s-a făcut |
|---|---|---|
| 0. Pregătire | gata | Next.js 16.3 (App Router), React 19.2, TypeScript, Tailwind 4, `next/font`, `next/image`, zod 4, Leaflet. Fără biblioteci UI. |
| 1. Scraping | gata | Site-ul nu era accesibil din mediu, așa că s-a folosit bookmarklet-ul din `tools/scraper/`, rulat de agenție. Exportul a fost importat cu `tools/import/import.mjs`. |
| 2. Conținut | gata, cu excepția Programului | `/content` din textul real, deduplicat, cu greșelile corectate. |
| 3. Design | gata | Tokens în `app/globals.css`, paleta reală, contrast verificat. |
| 4. Pagini | gata | Vezi lista de mai sus. |
| 5. QA | gata | 75 de capturi, test cap-coadă pentru formular, Lighthouse. |
| 6. Publicare | **blocat** | Vezi „Cum se publică”. |

## Pasul 1: ce a ieșit din scraping

Sursa: exportul `catalinrenghea-export-2026-10-06.zip`, făcut cu bookmarklet-ul (API WordPress + HTML randat + CSS + fișierele din `wp-content/uploads`).

| | Număr |
|---|---|
| Pagini HTML descărcate | 15 (8 pagini reale + 6 articole + 1 pagină de autor) |
| Pagini cu conținut real al clientului | 6: Acasă, Despre mine, Contact și cele 3 pagini legale |
| Pagini cu conținut demo al temei | 2 (Program, News) + cele 6 articole din 2023 |
| Imagini găsite în `wp-content/uploads` | 92 |
| Imagini unice după dedup (sha256 + hash perceptual) | 87 |
| Duplicate eliminate | 5 |
| Imagini demo ale temei BeTheme (`politics3-*`) | 36, inventariate dar necopiate în `public/images` |
| **Imagini ale clientului** în `public/images` | **51** |
| din care low-res (sub 1200px lățime) | 24 |
| exporturi WhatsApp | 8 (4 dintre ele trec de 1200px) |
| PDF-uri | 1 (CV-ul, copiat în `public/docs/`) |
| Adrese eșuate la scraping | 1 (`munca-mea-background.png`, 404 și pe site) |

Ce a trebuit corectat la import:

- **Tema BeTheme (page builder Muffin) ține conținutul în afara API-ului WordPress.** API-ul dădea pagini aproape goale. Scriptul de import ia acum conținutul din HTML-ul randat când API-ul are sub 40 de cuvinte.
- Importul se limitează la fișierele urcate de client (`wp-content/uploads`). Iconițele și fundalurile temei sunt excluse.

Fișiere rezultate:

- `content/raw/*.md` și `*.json`: textul original al fiecărei pagini, neprelucrat.
- `content/images.json`: inventarul, cu sursă, cale, dimensiuni, pagina unde apărea, duplicate, `lowRes`, `whatsapp`, `demoTema`, `folosita` și `altPropus` în română. Alt-urile sunt scrise manual pentru fotografiile clientului.
- `content/raw/brand.json`: culori și fonturi extrase din CSS.
- `content/raw/import-stats.json`: statisticile de mai sus.

## Pasul 2: conținut

- **Cronologie** (`content/timeline.json`): 12 roluri, 2014 – prezent, fiecare o singură dată. Pe pagina veche erau 6 blocuri duplicate. Gruparea în 4 etape:
  - **Guvern și ministere:** Guvernul României (2020–2021), Ministerul Economiei (2014).
  - **Parlament:** Senat, consilier parlamentar (2024); Camera Deputaților (2019–2021); Senat, șef de cabinet (2017–2019); Camera Deputaților (2015–2016).
  - **Administrație locală și instituții:** AMEPIP (2025 – prezent); DGASPC Sector 4, șef serviciu (2024–2025); DGASPC Sector 4, Corp Control (2024).
  - **Consultanță și proiecte:** DO MI NO CR Consulting (2022–2024), BEST SMART DIGITAL (2022–2023), Public Affairs Solutions (2021–2022).
  - Fiecare card are maximum 3 responsabilități și 2 realizări, citate din textul original.
- **CV complet** (`content/cv.json`, pagina `/despre-mine/cv`): toate responsabilitățile și realizările, plus PDF-ul original de descărcat.
- **Studii** (din CV-ul PDF):
  - Doctorat în Științe Politice, Universitatea din București (2018–2021);
  - Master în Relații Internaționale și Integrare Europeană, SNSPA (2016–2018);
  - Licență în Comunicare și Relații Publice, SNSPA (2013–2016).
- **Poveste:** 4 paragrafe, din textul paginilor Acasă și Despre mine, scurtate și trecute la persoana I. Fără afirmații noi.
- **FAQ:** 4 din cele 5 întrebări de pe Acasă, scurtate. Prima („Care sunt principalele atribuții în cadrul Guvernului României?”) e o definiție generală a Guvernului, nu spune nimic despre candidat, așa că am scos-o.
- **Cifre-cheie:** 3 prim-miniștri, Nokian 2 mld € (Bihor), Clariant 200 mil € (Craiova), 350 de IMM-uri. Câmpul `sursa` e gol, de completat cu linkuri.
- **Corecturi:**
  - „Consiler” → „Consilier”;
  - „Ministrul Economiei” → „Ministerul Economiei”;
  - titlul tăiat „Generală de Asistență…” → „Șef Serviciu Logistic, Direcția Generală de Asistență Socială și Protecția Copilului (DGASPC) Sector 4”;
  - „Agenția Pentru” → „Agenția pentru”;
  - diacritice cu virgulă (ș, ț).
- **Pagini legale:** textul scrapat, neschimbat, cu marcajul „DE REVIZUIT DE JURIST”.
- **Kitul de presă:**
  - biografie scurtă compusă din textul site-ului (marcată „DE APROBAT”);
  - portretul de studio de descărcat;
  - logo-ul în SVG și PNG.

## Decizii luate (fără să întreb)

1. **Paleta:**
   - albastrul din site-ul actual `#2461a2` ca primar (6,35:1 pe alb) și bleumarinul `#123f70` pentru hover;
   - tricolorul (galbenul `#fcd116` și roșul din CSS-ul vechi) apare doar ca o bandă subțire deasupra footer-ului;
   - roșul `#eb3e40`, cea mai frecventă culoare din CSS, vine din tema demo și nu e folosit ca text (contrast insuficient).
2. **Tipografie:** site-ul vechi folosea Poppins. Brief-ul cere stack-ul Apple (SF), cu Inter ca fallback, deci l-am urmat. Inter nu se preîncarcă, pentru că pe dispozitivele Apple nu e folosit.
3. **Logo:** monograma „C/R” cu săgeată (`logofinal`) e logo-ul actual. Emblema rotundă cu siluetă pare o versiune mai veche și nu e folosită. Pentru că nu exista SVG, am vectorizat monograma automat (`public/brand/monogram.svg`) și am verificat-o vizual față de original. Favicon-ul e monograma albă pe albastru.
4. **Fotografii** (5 + logo, sub limita de 6–8):

   | Unde | Fișier | Dimensiune |
   |---|---|---|
   | Hero, imaginea Open Graph | `whatsapp-image-2026-02-16-at-09.16.11.jpeg` | 1366×2048 |
   | Despre mine | `whatsapp-image-2026-02-16-at-09.16.12.jpeg` (la birou, cu drapelul) | 2048×2048 |
   | Parcurs | `whatsapp-image-2025-09-17-at-10.50.37_…jpg` (la masa unei ședințe) | 1080×1620, low-res, folosit mic |
   | Implică-te | `whatsapp-image-2025-09-18-at-13.29.36_…jpg` (brațe deschise) | 1366×2048 |
   | Kit de presă | `alx4486-transformed.jpeg` (studio) | 1740×1902 |

   Hero-ul e servit la 37 KB (AVIF/WebP prin `next/image`).
5. **Program:** paginile vechi Program și News sunt **conținut demo al temei**, în engleză și latină, cu cifre false („48600 People have joined the campaign”, „$58,466 strânși”). Nu am preluat nimic. Temele rămân `[DE COMPLETAT DE CLIENT]`.
6. **Fără dark mode:** brandul e pe fond deschis, iar o temă întunecată ar dubla verificările de contrast.
7. **Mișcare:**
   - reveal la scroll doar cu CSS (`animation-timeline: view()`);
   - cifre care cresc (server-ul randează valoarea finală);
   - `<ViewTransition>` între pagini;
   - expand cu `grid-template-rows`, declanșat doar de utilizator.
   - Toată mișcarea e oprită la `prefers-reduced-motion`.
8. **zod se încarcă la trimitere** în formularele simple. Pe Acasă, asta a dus Performance de la 79 la 97–100 (înainte de pozele reale).
9. **Sloganul** („Sectorul 4 merită o primărie care ascultă și rezolvă.”) și subtitlurile temelor sunt propuneri ale agenției, marcate `"propunere-agentie"` în JSON.
10. **Formularul de sesizări:**
    - pinul pornește din centrul Sectorului 4, ca pasul 2 să se poată face și de la tastatură;
    - poza rămâne local, nu se urcă;
    - codul are formatul `S4-AALLZZ-XXXX`;
    - API-ul doar validează;
    - consimțământul GDPR e nebifat implicit și obligatoriu.
11. **Footer** fără ANPC/ODR. Preview-ul întreg e `noindex` (meta + `robots.txt`).
12. **Admin demo:** 64 de sesizări fictive generate determinist, cu banner „DEMO”.

## Contrast (WCAG AA)

`node scripts/contrast.mjs --md`. Toate perechile folosite trec AA.

| Text | Fundal | Raport | AA |
|---|---|---|---|
| ink #1d1d1f | canvas #ffffff | 16.83:1 | da |
| ink-2 #4a4a4f | canvas #ffffff | 8.81:1 | da |
| ink-3 #6e6e73 | canvas #ffffff | 5.07:1 | da |
| ink-3 #6e6e73 | canvas-2 #f5f5f7 | 4.66:1 | da |
| brand #2461a2 | canvas #ffffff | 6.35:1 | da |
| brand #2461a2 | canvas-2 #f5f5f7 | 5.83:1 | da |
| brand #2461a2 | brand-soft #e8f0f8 | 5.52:1 | da |
| canvas #ffffff | brand #2461a2 | 6.35:1 | da |
| canvas #ffffff | brand-strong #123f70 | 10.66:1 | da |
| todo-ink #6b4a00 | todo #fff4d6 | 7.36:1 | da |
| danger #b42318 | canvas #ffffff | 6.57:1 | da |
| ok #1f7a3a | canvas #ffffff | 5.38:1 | da |

## Lighthouse (mobil, build de producție, local, cu pozele reale)

| Pagină | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Acasă `/` | 95–98 (85 la prima rulare, înainte ca imaginea să fie în cache) | 100 | 100 | 66* |
| Formular `/spune-mi-problema` | 92–95 | 100 | 100 | 69* |
| Despre mine `/despre-mine` | 96 | 100 | 100 | 69* |

\* Singurul audit SEO picat e `is-crawlable`, din cauza `noindex` pus intenționat pe preview. Rapoartele sunt în `qa/lighthouse/`. Pe Vercel, cifrele se re-măsoară: imaginile optimizate stau în cache pe CDN, iar tile-urile de hartă (blocate în mediul de lucru) vor apărea.

## QA vizual

- `node scripts/qa-screenshots.mjs`: 13 pagini × 5 lățimi (360, 390, 768, 1024, 1440), în `qa/screenshots/`. **Fără scroll orizontal** și fără erori de consolă, în afară de 404-ul așteptat.
- `node scripts/qa-wizard.mjs`: fluxul de sesizare, pe mobil și pe desktop. Verifică erorile de validare, consimțământul, codul de referință și focusul.
- Ce am reparat după ce m-am uitat la capturi:
  - titlul din hero se rupea în 5 rânduri;
  - „200 mil €” trecea pe două rânduri;
  - butonul de play acoperea eticheta video;
  - pe mobil și tabletă, portretul împingea mesajul sub fold;
  - un card din timeline se întindea pe verticală;
  - „Altele” rămânea singur pe rând;
  - la „Parcurs” era o poză de la alt eveniment, cu alt-ul greșit.
- `qa/og-image.png`: imaginea de partajare generată.

## Skill-uri

Skill-urile din brief (`frontend-design`, `vercel-react-best-practices`, `vercel-composition-patterns`, `react-view-transitions`, `web-design-guidelines`, `writing-guidelines`, `vercel-deploy-claimable`) **nu sunt instalate** în acest mediu:

```bash
npx skills add vercel-labs/agent-skills
```

Am aplicat manual principiile lor:

- componente server implicit; Leaflet și zod încărcate dinamic;
- `ViewTransition` după ghidul din `node_modules/next/dist/docs`;
- accesibilitate: skip link, focus vizibil, `aria-current`, `aria-expanded`, `aria-invalid` + `aria-describedby`, ținte ≥ 44px, zoom permis, `lang="ro"`.

Auditul formal `web-design-guidelines` trebuie rulat după instalare.

## De verificat cu clientul

1. **Date suprapuse:**
   - „Consilier, Serviciul Corp Control” (DGASPC S4) și „Consilier parlamentar” (Senat) sunt ambele **02.07.2024 – 31.07.2024**;
   - „Consilier, Guvernul României” (01.05.2020 – 15.03.2021) se suprapune cu „Consilier, Camera Deputaților” (01.08.2019 – 15.03.2021);
   - „DO MI NO CR Consulting” (25.10.2022 – 01.07.2024) se suprapune cu „BEST SMART DIGITAL” (18.10.2022 – 01.03.2023).
2. **„Coordonator la Comisia Europeană”** apare în FAQ (proiectul de digitalizare a energiei, 350 de IMM-uri), dar nu și în cronologie sau în CV. E proiectul de la BEST SMART DIGITAL? Până la confirmare, am scos din FAQ formularea „în calitate de Coordonator la Comisia Europeană”.
3. **Nokian:** pe Acasă scrie „facilitarea investiției”, iar în FAQ „am coordonat și implementat investiția”. Care e formularea corectă? La fel pentru Clariant. Fiecare cifră are câmpul `sursa`, pentru un link verificabil.
4. **Experiența:** „aproximativ 10 ani” (Despre mine) față de „peste un deceniu” (titlul de pe Acasă). Cronologia începe în 2014.
5. **CV-ul PDF public** conține emailul personal `catalin.renghea@gmail.com`. Rămâne public sau facem o versiune doar cu `office@`?
6. **Pe site-ul actual sunt acum online** pagini demo cu cifre false (Program: „48600 People have joined”, „$58,466 strânși prin contribuții”; News: 6 articole lorem ipsum) și pagina de autor `securmenow`. Recomand scoaterea lor imediat, independent de preview.
7. **Termenii și condițiile** conțin încă placeholder-ele șablonului: „[Numele Politicianului]” și „[link către Politica de Confidențialitate]”. Le preia juristul.
8. **Sloganul**, subtitlurile temelor și biografia scurtă din kitul de presă sunt propuneri care trebuie aprobate.
9. **Lista de cartiere** din formular (exemplu: Berceni, Brâncoveanu, Olteniței, Tineretului, Văcărești, Giurgiului, Progresul, Apărătorii Patriei, Timpuri Noi).
10. **LinkedIn:** URL-ul e construit din handle (`/in/cătălin-renghea/`). De confirmat.
11. **Logo:** există un SVG original al monogramei? Cel din preview e vectorizat automat.

## Ce lipsește (de primit de la client)

- **Program:** problema, soluția și 3 angajamente pentru fiecare dintre cele 6 teme (`content/program.json`).
- **Video** de prezentare.
- **Articole reale** pentru Noutăți (cele 3 de acum sunt exemple marcate).
- **Linkul canalului de WhatsApp.**
- **Fotografii de calitate din Sectorul 4**, opțional. Trei dintre cele 4 exporturi WhatsApp folosite trec de 1200px; poza de la „Parcurs” are 1080px. Originalele de la fotograf ar fi mai bune.

## Cum se publică

Mediul de lucru nu ajunge la Vercel. Variante:

1. **Din calculatorul agenției:** `npx vercel` în acest repo (framework detectat automat), apoi `vercel --prod` sau doar URL-ul de preview.
2. **Din acest mediu:** se adaugă `vercel.com` și `api.vercel.com` în setările de rețea ale mediului (Network access → Custom → Allowed domains) și un `VERCEL_TOKEN` ca secret.

După publicare, `NEXT_PUBLIC_SITE_URL` se setează la URL-ul real (pentru Open Graph și sitemap).

## Structură pentru Webflow

| Fișier | Conține | În Webflow CMS |
|---|---|---|
| `content/site.json` | nume, rol, slogan, contact, rețele sociale | setări globale |
| `content/cifre.json` | valoare, sufix, etichetă, sursă | colecția Cifre |
| `content/timeline.json` | etape → joburi | colecțiile Etape și Joburi (referință) |
| `content/cv.json` | CV complet | rich text |
| `content/studii.json`, `content/despre.json` | studii, poveste, FAQ, link CV | |
| `content/program.json` | slug, titlu, subtitlu, problemă, soluție, angajamente | colecția Teme |
| `content/noutati.json` | articole, kit de presă | colecția Articole |
| `content/media.json`, `content/images.json` | fotografiile folosite, inventarul complet | |
| `content/legal/*.md` | paginile legale | |
| `content/raw/` | textele originale scrapate | |
