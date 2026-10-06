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
4. **Fotografii** (versiunea 1; în versiunea 2 au rămas 4, vezi „Restilizarea”):

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

## Restilizarea (versiunea 2, după feedback)

Referința din brief e stilul Apple. Prima versiune era corectă, dar generică: carduri identice cu umbră, eyebrow deasupra fiecărui titlu și reveal pe fiecare secțiune, adică exact tiparele pe care `frontend-design` le enumeră ca semne de design generat. Ce s-a schimbat:

- **Capitole**, ca pe paginile de produs Apple: titlu centrat (până la 88px), o singură frază dedesubt, apoi o imagine mare cu colțuri de 28px. Alternanță alb / gri `#f5f5f7`.
- **Un singur moment îndrăzneț:** cifrele-cheie pe un capitol bleumarin (`#0b1f35`), cu cifre de până la 112px și unitățile (mld €, mil €) la jumătate de mărime, ca în specificațiile Apple.
- **Plăci plate** în loc de carduri cu umbră. Umbra rămâne doar pe suprafețele de formular și pe panoul admin.
- **Nav subțire** (52px, linkuri de 14px, buton mic pe fundal plin), translucid. Meniul mobil ocupă tot ecranul, cu linkuri de 28px.
- **Butoane și linkuri:** butonul principal plin și linkuri text („Alătură-te campaniei”, „Tot programul”), fără săgeți adăugate.
- **Mișcare:** doar două momente automate:
  - imaginea mare „se așază” (scale 0.92 → 1) când intră în ecran, doar cu CSS;
  - cifrele cresc.
  - Tranziția între pagini și expand-urile rămân.
- **Elementul specific acestui site:** pe Acasă, cele 9 categorii reale de sesizări sunt butoane. Fiecare deschide formularul direct la pasul 2, cu categoria aleasă (`/spune-mi-problema?categorie=iluminat`).
- **Despre mine:**
  - deschidere cu portretul de la birou pe toată lățimea;
  - povestea: un paragraf mare, urmat de trei coloane;
  - studiile ca specificații cu filet, nu carduri;
  - FAQ ca listă cu separatoare.
- **Fotografii:** poza de la masa ședinței (1080px) nu mai e folosită. Au rămas 4 fotografii: hero, Despre mine, Implică-te, kitul de presă.

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

## Lighthouse (mobil, build de producție, local, după restilizare)

| Pagină | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Acasă `/` | 96 | 100 | 100 | 66* |
| Formular `/spune-mi-problema` | 94 | 100 | 100 | 69* |
| Despre mine `/despre-mine` | 97 | 100 | 100 | 69* |

Măsurat la a doua rulare, cu imaginile optimizate deja în cache. CLS = 0 pe toate.

\* Singurul audit SEO picat e `is-crawlable`, din cauza `noindex` pus intenționat pe preview. Rapoartele sunt în `qa/lighthouse/`.

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

- **Folosite din sistem** (`/mnt/skills/public`): `frontend-design`, pentru direcția estetică și auto-critica de design.
- **Instalate în proiect** (`.claude/skills/`, versiunile fixate în `skills-lock.json`) cu `npx skills add vercel-labs/agent-skills`:
  - `vercel-react-best-practices`, `vercel-composition-patterns`, `vercel-react-view-transitions`;
  - `web-design-guidelines`, `writing-guidelines`;
  - `vercel-cli-with-tokens`, pentru publicare când există un token.
- **`web-design-guidelines`**, rulat cu regulile la zi. Am aplicat:
  - `spellCheck={false}` pe câmpurile de email;
  - `name` pe toate câmpurile;
  - placeholdere care se termină cu „…”;
  - `touch-action: manipulation` pe butoane;
  - `overscroll-behavior` (pagina pe pointer fin, meniul mobil);
  - culori explicite pe `<select>`;
  - `translate="no"` pe numele candidatului.
- Regulile din aceeași listă pe care le-am lăsat deliberat deoparte:
  - „Title Case” pentru titluri: e o convenție din engleză; în română se scrie normal.
  - „evită persoana I”: vocea campaniei e chiar persoana I a candidatului.
  - starea filtrelor din admin în URL: e doar un demo.

## De verificat cu clientul

Rezolvate de client pe 6 octombrie:

- Perioadele care se suprapun sunt corecte (funcții simultane). Rămân așa.
- Formularea „În calitate de Coordonator la Comisia Europeană…” din FAQ rămâne.
- Pentru Nokian și Clariant formularea e „am coordonat și implementat”.
- CV-ul PDF rămâne cum e, cu emailul personal.

Încă deschise:

1. **Pe site-ul actual sunt acum online** pagini demo cu cifre false (Program: „48600 People have joined”, „$58,466 strânși prin contribuții”; News: 6 articole lorem ipsum) și pagina de autor `securmenow`. Recomand scoaterea lor imediat, independent de preview.
2. **Termenii și condițiile** conțin încă placeholder-ele șablonului: „[Numele Politicianului]” și „[link către Politica de Confidențialitate]”. Le preia juristul.
3. **„Aproximativ 10 ani”** (Despre mine) față de **„peste un deceniu”** (titlul de pe Acasă). Cronologia începe în 2014, deci „peste zece ani” e corect. Preview-ul folosește „peste zece ani” în titluri și păstrează „aproximativ 10 ani” în textul citat.
4. **Sloganul**, subtitlurile temelor și biografia scurtă din kitul de presă sunt propuneri care trebuie aprobate.
5. **Lista de cartiere** din formular (exemplu: Berceni, Brâncoveanu, Olteniței, Tineretului, Văcărești, Giurgiului, Progresul, Apărătorii Patriei, Timpuri Noi).
6. **LinkedIn:** URL-ul e construit din handle (`/in/cătălin-renghea/`). De confirmat.
7. **Logo:** există un SVG original al monogramei? Cel din preview e vectorizat automat.

## Ce lipsește (de primit de la client)

- **Program:** problema, soluția și 3 angajamente pentru fiecare dintre cele 6 teme (`content/program.json`).
- **Video** de prezentare.
- **Articole reale** pentru Noutăți (cele 3 de acum sunt exemple marcate).
- **Linkul canalului de WhatsApp.**
- **Fotografii de calitate din Sectorul 4**, opțional. Trei dintre cele 4 exporturi WhatsApp folosite trec de 1200px; poza de la „Parcurs” are 1080px. Originalele de la fotograf ar fi mai bune.

## Cum se publică

Repo-ul e conectat la Vercel (proiect creat din GitHub, 6 octombrie). Fiecare push pe branch-ul `claude/catalin-renghea-site-preview-6ttrc9` creează automat un **Preview Deployment**. URL-ul apare în Vercel → proiect → Deployments, la acest branch.

- `main` conține site-ul vechi de GitHub Pages, de aceea deploy-ul de producție al proiectului dă 404. Pentru lansare, branch-ul se unește în `main` (sau se setează în Vercel ca Production Branch).
- Variabila `NEXT_PUBLIC_SITE_URL` se setează în Vercel → Settings → Environment Variables cu URL-ul final (pentru Open Graph și sitemap).

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
