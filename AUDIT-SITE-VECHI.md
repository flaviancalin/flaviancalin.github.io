# Audit catalinrenghea.ro (site-ul vechi)

Scanat pe 6 octombrie 2026, din exportul complet: 15 pagini HTML, API-ul WordPress, CSS-ul și imaginile. Ordinea e după cât de urgent e de rezolvat.

## 1. De scos acum (se vede prost și poate face probleme)

| Ce e | Unde | De ce contează | Ce facem |
|---|---|---|---|
| Pagina **Program** e demo-ul temei, în engleză: „It's Morning Again in America!”, „48600 People have joined the campaign”, „76420 issues solved”, „1000000+ followers”, „$58,466 strânși prin contribuții” cu butoane de donație de $5/$25/$50/$100 | `/program/` | Cifrele sunt inventate și apar pe site-ul unui candidat. Butoanele de donație în dolari, pe un site de campanie din România, sunt o problemă și juridic (finanțarea campaniilor e reglementată de AEP). | Pagina trece în ciornă (draft) azi. |
| **6 articole lorem ipsum** din 2023 („Curabitur dolor aliquet…”) cu poze stock ale temei, plus pagina `/news/` cu titlul „Blogs” | `/news/`, `/2023/...` | Arată ca un site neterminat. Google le indexează (sunt în sitemap). | Le ștergem, sau le punem în draft. |
| Pagina de autor **`/author/securmenow/`** și sitemap-ul de utilizatori | `/author/securmenow/`, `wp-sitemap-users-1.xml` | Expune public numele de utilizator al contului de admin: e jumătate din ce-i trebuie cuiva care vrea să spargă site-ul. | Dezactivăm arhivele de autor și sitemap-ul de users (Yoast/RankMath sau un snippet). Contul admin redenumit sau înlocuit. |
| **Bannerul agenției vechi (securmenow)** în footer, pe toate paginile | footer | E reclamă la altcineva pe site-ul candidatului. | Îl scoatem. |
| **Logo-urile ANPC SAL și SOL/ODR** în footer | footer | Sunt obligatorii pentru magazine online, nu pentru un politician. Arată a șablon copiat. | Le scoatem. |

## 2. Lipsește complet mesajul de campanie

- Pe Acasă, Despre mine și Contact **nu apare nicăieri că e candidat** la Primăria Sectorului 4. Cuvintele „candidat”, „Primăria”, „primar” nu există pe site. Sectorul 4 apare doar în titlul jobului de la DGASPC.
- Mesajul principal e „Peste un Deceniu de Experiență în Politică!”, adică un CV, nu o promisiune pentru oameni.
- Nu există niciun mod de implicare: voluntar, newsletter, sesizări, WhatsApp.
- Meniul are doar Acasă / Despre mine / Contact. Program și News există, dar nu sunt în meniu.

**Sugestie:** e exact ce rezolvă preview-ul nou: slogan de campanie, „Spune-mi problema ta”, „Implică-te”, Program pe teme.

## 3. Texte și greșeli

| Problemă | Unde | Fix |
|---|---|---|
| „**Consiler**” în loc de „Consilier” | Acasă (Munca mea), Despre mine | corectat în preview |
| „**Ministrul** Economiei” în loc de „Ministerul” | Acasă | corectat în preview |
| Titlul de la DGASPC tăiat: „Generală de Asistență Socială…” | Despre mine | corectat în preview |
| **Blocuri duplicate**: 6 joburi apar de două ori, identic (DGASPC, Senat, BEST SMART, Guvern, Șef Cabinet, Min. Economiei) | Despre mine | deduplicat în preview |
| „**Catalin**” fără diacritice în titlul paginilor, logo text și footer | toate paginile | „Cătălin” peste tot |
| Etichete în engleză: „Home” (titlul paginii), „News”, „Blogs”, „Q&A”, „Read more”, „Other News” | mai multe | traduse |
| Majuscule englezești în română: „Peste un Deceniu de Experiență în Politică”, „Realizări Notabile”, „Întrebări Frecvente” | Acasă | în română doar primul cuvânt are majusculă |
| Persoana I și a III-a amestecate („Mihai-Cătălin RENGHEA este…”, apoi „am demonstrat abilități remarcabile…”) | Despre mine | o singură voce (persoana I) |
| „Aproximativ 10 ani” într-un loc, „peste un deceniu” în altul | Acasă / Despre | „peste zece ani” (cronologia începe în 2014) |
| Formulări de CV corporate („Profesionist executiv tenace”, „am demonstrat abilități remarcabile de leadership”) | Despre mine | ton mai direct, de om, nu de LinkedIn |
| Prima întrebare din FAQ („Care sunt principalele atribuții în cadrul Guvernului României?”) e o definiție de manual, nu spune nimic despre el | Acasă | scoasă în preview |
| Contact: „București, România”, fără Sector 4 | Contact | „București, Sector 4” |

## 4. GDPR și legal (de văzut cu juristul)

- **Niciun banner de cookies**, deși Politica de cookies spune că există unul și că site-ul folosește cookies de **publicitate** și de **direcționare**. Ori nu e adevărat, ori lipsește consimțământul. Una dintre ele trebuie reparată.
- **Google reCAPTCHA** se încarcă pe **toate paginile**, iar **Google Fonts** e încărcat direct de la Google. Amândouă trimit IP-ul vizitatorului către Google fără consimțământ. Politica de confidențialitate nu le pomenește.
- **Formularul de contact nu are bifă de acord** și nici link spre politica de confidențialitate. Cere nume, prenume, email, telefon. Nu are nici etichete (doar placeholdere), deci e greu de folosit cu cititor de ecran.
- **Politica de confidențialitate nu spune cine e operatorul** (nume, adresă), nu are perioada de păstrare a datelor și nu pomenește ANSPDCP (unde te poți plânge). Contactul e „adresa specificată pe site”.
- **Termenii** conțin încă placeholder-ele din șablon: „[Numele Politicianului]” și „[link către Politica de Confidențialitate]”.
- Linkul „GDPR” din footer duce la `gdpr.eu`, un site generic, nu la politica proprie.

**Sugestie:**
- de scos cookies-urile de care nu e nevoie (în preview nu există niciunul);
- reCAPTCHA înlocuit cu honeypot sau cu Cloudflare Turnstile, doar pe pagina cu formular;
- fonturile servite local;
- textele legale trecute prin jurist, cu operatorul numit.

## 5. Tehnic și SEO

| Problemă | Detaliu | Fix |
|---|---|---|
| `lang="en-US"` pe tot site-ul | Google și cititoarele de ecran cred că site-ul e în engleză | `lang="ro"` |
| **Zoom blocat** pe mobil (`maximum-scale=1`) | problemă de accesibilitate; oamenii mai în vârstă nu pot mări textul | scos |
| **Aceeași meta descriere pe toate paginile** („Cătălin Renghea - Peste un Deceniu…”) | Google arată același text la fiecare rezultat | descriere proprie pe fiecare pagină |
| **Nicio imagine de partajare** (og:image) pe paginile reale. Doar articolele demo au, cu poze stock. | Pe Facebook/WhatsApp linkul apare fără poză | imagine OG cu portretul (făcută în preview) |
| H1 greșit sau lipsă: pe Acasă H1-ul e „Munca mea!”; Despre mine și News nu au H1 | SEO și accesibilitate | un H1 clar pe fiecare pagină |
| **~95% din imagini n-au text alternativ** (ex.: 28 din 29 pe Despre mine) | accesibilitate, SEO pe imagini | alt scris pentru toate |
| **Acasă are ~8 MB**: un fundal PNG de **3,3 MB** (`muncabg.png`, o pată albastră estompată) și PNG-uri de 0,5–0,9 MB | se încarcă greu pe 4G | imagini WebP/AVIF redimensionate (preview: hero de 37 KB) |
| 11–14 fișiere CSS și 18–21 scripturi pe fiecare pagină (BeTheme + jQuery + jPlayer + reCAPTCHA) | lent pe mobil | — (preview: un singur CSS, JS minim) |
| Titlul și logo-ul text sunt randate de două ori (versiune mobil + desktop în HTML) | cititoarele de ecran citesc dublu | — |
| Un fundal care nu mai există: `munca-mea-background.png` (404) | eroare în consolă | — |
| WordPress expune versiunea (`WordPress 7.1.2` în meta generator) | informație utilă pentru atacatori | ascunsă, plus update-uri la zi |
| Linkuri sociale cu parametri de tracking (`?_t=…&_r=1` la TikTok, `?originalSubdomain=ro` la LinkedIn, `?locale=ro_RO` la Facebook) | URL-uri urâte, nu e grav | linkuri curate |

## 6. Imagini

- **Logo-ul există în ~15 variante** (PNG-uri, JPG-uri, „removebg-preview”, „ezgif-resize”), dar niciuna în SVG. Emblema rotundă cu silueta și monograma C/R sunt folosite amestecat. **Sugestie:** un singur logo (monograma), cerut în SVG de la designer.
- Ședința foto profesională (ALX44xx, fundal albastru) e folosită doar în bucăți mici. Pozele cele mai noi și mai vii (stradă, birou, conferință) sunt **exporturi WhatsApp**: merg, dar originalele de la fotograf ar fi mult mai bune.
- 36 de imagini din Media Library sunt demo-uri ale temei (`politics3-*`). Ocupă loc și unele apar public (pe News și în articolele demo).

## Prioritizare rapidă

1. **Azi, 15 minute în wp-admin:**
   - Program, News și articolele demo trecute în draft;
   - scos bannerul securmenow și logo-urile ANPC din footer;
   - dezactivată pagina de autor.
2. **Săptămâna asta:** banner de cookies sau scoaterea reCAPTCHA, bifă de acord în formular, corecturile de text din secțiunea 3. Asta dacă site-ul vechi mai rămâne online până la lansare.
3. **La lansarea site-ului nou:** restul e deja rezolvat în preview (structură, mesaj de campanie, SEO, performanță, accesibilitate, imagini).
