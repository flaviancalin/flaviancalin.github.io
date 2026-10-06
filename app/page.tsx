import Link from "next/link";
import { ChapterHead, Page, Section } from "@/components/page";
import { PhotoPlaceholder } from "@/components/photo-placeholder";
import { Photo } from "@/components/photo";
import { CountUp } from "@/components/count-up";
import { Icon } from "@/components/icons";
import { TemaCard, ArticolCard } from "@/components/cards";
import { Newsletter } from "@/components/newsletter";
import { ARTICOLE, CATEGORII, CIFRE, DESPRE, SITE, TEME } from "@/lib/content";

export default function Home() {
  const principale = TEME.filter((t) => t.principala).slice(0, 3);
  return (
    <Page>
      {/* Hero: un singur mesaj, centrat; portretul dedesubt, mare. */}
      <section aria-labelledby="hero-title" className="overflow-hidden pt-14 pb-16 md:pt-24 md:pb-24">
        <div className="container-x text-center">
          <p className="text-tagline font-semibold text-ink" translate="no">{SITE.nume}</p>
          <h1 id="hero-title" className="mx-auto mt-3 max-w-[15ch] text-hero">{SITE.slogan.replace("Sectorul 4", "Sectorul 4")}</h1>
          <p className="mx-auto mt-6 max-w-[34ch] text-tagline text-ink-2">
            Spune-mi ce nu merge pe strada ta. Fiecare sesizare primește un cod, ca s-o poți urmări.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-x-6 gap-y-2 sm:flex-row">
            <Link href="/spune-mi-problema" className="btn btn-primary">Spune-mi problema ta</Link>
            <Link href="/implica-te" className="link-more">Alătură-te campaniei</Link>
          </div>
        </div>
        <div className="container-x mt-12 md:mt-16">
          <Photo
            k="hero"
            priority
            ratio="var(--hero-ratio)"
            position="50% 8%"
            sizes="(min-width: 1200px) 1120px, 100vw"
            className="media-settle mx-auto [--hero-ratio:4/5] sm:[--hero-ratio:4/3] lg:[--hero-ratio:16/9]"
          />
        </div>
      </section>

      {/* Capitolul întunecat: singurul moment îndrăzneț al paginii. */}
      <Section tone="night" labelledBy="cifre-title">
        <ChapterHead id="cifre-title" title="Experiență care se poate număra." lead={`Peste zece ani în Guvern, Parlament și administrația Sectorului 4.`} />
        <dl className="mx-auto mt-16 grid max-w-5xl gap-px overflow-hidden rounded-[var(--radius-tile)] bg-white/10 sm:grid-cols-2">
          {CIFRE.map((c) => (
            <div key={c.id} className="flex flex-col bg-night-2 px-8 py-10 md:px-12 md:py-14">
              <dt className="order-2 mt-4 max-w-[24ch] text-lead text-white/72">{c.eticheta}</dt>
              <dd className="order-1 whitespace-nowrap text-figure font-semibold text-white">
                <CountUp value={c.valoare} prefix={c.prefix} suffix={c.sufix} />
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Cine sunt */}
      <Section labelledBy="cine-title">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
          <Photo k="despre" ratio="1 / 1" position="55% 40%" sizes="(min-width: 1200px) 520px, (min-width: 768px) 45vw, 100vw" />
          <div>
            <h2 id="cine-title" className="text-h2">De la Guvern, la Sectorul&nbsp;4.</h2>
            <p className="mt-6 text-lead text-ink-2">{DESPRE.paragrafe[0].text}</p>
            <Link href="/despre-mine" className="link-more mt-4">Povestea și parcursul complet</Link>
          </div>
        </div>
      </Section>

      {/* Video de prezentare (placeholder) */}
      <Section tone="gray" labelledBy="video-title">
        <ChapterHead id="video-title" title="Cine sunt, în două minute." lead="Un video scurt de prezentare va sta aici." />
        <div className="relative mt-14">
          <PhotoPlaceholder label="VIDEO DE ÎNLOCUIT" hint="Video de prezentare, 16:9, cu subtitrare" ratio="16 / 9" align="bottom" className="!rounded-[var(--radius-tile)] !bg-canvas-3" />
          <span aria-hidden="true" className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink">
            <Icon name="play" className="ml-1 h-8 w-8" fill="currentColor" />
          </span>
        </div>
      </Section>

      {/* Teme principale */}
      <Section labelledBy="teme-title">
        <ChapterHead id="teme-title" title="Ce schimbăm în Sectorul 4." lead="Șase teme. Mai jos, primele trei." />
        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {principale.map((t) => <li key={t.slug}><TemaCard tema={t} /></li>)}
        </ul>
        <p className="mt-10 text-center"><Link href="/program" className="link-more">Tot programul</Link></p>
      </Section>

      {/* Funcția centrală: categoriile reale, ca puncte de intrare directe în formular. */}
      <Section tone="gray" labelledBy="problema-title">
        <ChapterHead id="problema-title" title="Ce nu merge în cartierul tău?" lead="Alege categoria. Pui pinul pe hartă și scrii o propoziție. Durează un minut." />
        <ul className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-3">
          {CATEGORII.map((c) => (
            <li key={c.id}>
              <Link
                href={`/spune-mi-problema?categorie=${c.id}`}
                className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-white px-5 text-[1.0625rem] font-medium text-ink transition-colors hover:bg-brand hover:text-white"
              >
                <Icon name={c.icon} className="h-5 w-5" />
                {c.titlu}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* Noutăți */}
      <Section labelledBy="noutati-title">
        <ChapterHead id="noutati-title" title="Ultimele noutăți." />
        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {ARTICOLE.slice(0, 3).map((a) => <li key={a.slug}><ArticolCard a={a} /></li>)}
        </ul>
        <p className="mt-10 text-center"><Link href="/noutati" className="link-more">Toate noutățile</Link></p>
      </Section>

      {/* Newsletter */}
      <Section tone="gray" labelledBy="nl-title">
        <ChapterHead id="nl-title" title="Află primul ce se întâmplă." lead="Un email scurt, doar când avem ceva important de spus." />
        <div className="mt-10"><Newsletter /></div>
      </Section>
    </Page>
  );
}
