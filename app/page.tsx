import Link from "next/link";
import { Page, Section } from "@/components/page";
import { PhotoPlaceholder } from "@/components/photo-placeholder";
import { Photo } from "@/components/photo";
import { CountUp } from "@/components/count-up";
import { Icon } from "@/components/icons";
import { TemaCard, ArticolCard } from "@/components/cards";
import { Newsletter } from "@/components/newsletter";
import { ARTICOLE, CIFRE, SITE, TEME } from "@/lib/content";

export default function Home() {
  const principale = TEME.filter((t) => t.principala).slice(0, 3);
  return (
    <Page>
      {/* Hero: un singur mesaj, portret mare, CTA dublu */}
      <section aria-labelledby="hero-title" className="overflow-hidden">
        <div className="container-x grid items-center gap-10 pt-10 pb-16 md:pt-16 md:pb-24 lg:grid-cols-[1.5fr_0.7fr] lg:gap-12 lg:pt-20 lg:pb-28">
          <div className="order-2 lg:order-1">
            <p className="eyebrow mb-4">{SITE.nume} · {SITE.rol}</p>
            <h1 id="hero-title" className="text-hero max-w-[16ch]">{SITE.slogan.replace("Sectorul 4", "Sectorul\u00a04")}</h1>
            <p className="measure mt-6 text-lead text-ink-2">
              Spune-mi ce nu merge pe strada ta. Fiecare sesizare primește un cod de referință, ca s-o poți urmări.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/spune-mi-problema" className="btn btn-primary">Spune-mi problema ta <Icon name="arrow" className="h-5 w-5" /></Link>
              <Link href="/implica-te" className="btn btn-secondary">Alătură-te</Link>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <Photo k="hero" priority ratio="4 / 5" position="50% 22%" sizes="(min-width: 1280px) 400px, (min-width: 1024px) 31vw, (min-width: 448px) 448px, 100vw" className="mx-auto max-h-[42svh] w-full max-w-md lg:max-h-none lg:max-w-none" />
          </div>
        </div>
      </section>

      {/* Cifre-cheie: doar cele de pe site-ul actual */}
      <Section tone="gray" labelledBy="cifre-title">
        <h2 id="cifre-title" className="text-h2 max-w-[20ch]">Experiență care se poate număra.</h2>
        <dl className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {CIFRE.map((c) => (
            <div key={c.id} className="reveal border-t border-black/10 pt-6">
              <dt className="sr-only">{c.eticheta}</dt>
              <dd className="whitespace-nowrap text-[clamp(2.5rem,1.9rem+2vw,3.75rem)] font-semibold leading-none tracking-tight text-brand">
                <CountUp value={c.valoare} prefix={c.prefix} suffix={c.sufix} />
              </dd>
              <dd className="mt-3 text-ink-2" aria-hidden="true">{c.eticheta}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Video de prezentare (placeholder) */}
      <Section labelledBy="video-title">
        <div className="grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div>
            <h2 id="video-title" className="text-h2">Cine sunt, în două minute.</h2>
            <p className="measure mt-5 text-lead text-ink-2">Un scurt video de prezentare va sta aici.</p>
          </div>
          <div className="reveal relative">
            <PhotoPlaceholder label="VIDEO DE ÎNLOCUIT" hint="Video de prezentare, 16:9, cu subtitrare" ratio="16 / 9" align="bottom" />
            <span aria-hidden="true" className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-[var(--shadow-lift)]">
              <Icon name="play" className="ml-1 h-7 w-7" fill="currentColor" />
            </span>
          </div>
        </div>
      </Section>

      {/* Teme principale */}
      <Section tone="gray" labelledBy="teme-title">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 id="teme-title" className="text-h2 max-w-[16ch]">Ce schimbăm în Sectorul 4.</h2>
          <Link href="/program" className="btn btn-quiet self-start md:self-auto">Tot programul <Icon name="arrow" className="h-5 w-5" /></Link>
        </div>
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {principale.map((t) => <li key={t.slug} className="reveal"><TemaCard tema={t} /></li>)}
        </ul>
      </Section>

      {/* Apel la acțiune: funcția centrală */}
      <Section tone="brand" labelledBy="problema-title">
        <div className="grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-end">
          <div>
            <h2 id="problema-title" className="text-h2 max-w-[18ch]">Ce nu merge în cartierul tău?</h2>
            <p className="measure mt-5 text-lead text-white/85">Groapă, stâlp stins, parc neîngrijit. Alegi categoria, pui pinul pe hartă și scrii o propoziție. Durează un minut.</p>
          </div>
          <div className="md:justify-self-end">
            <Link href="/spune-mi-problema" className="btn bg-white text-brand hover:bg-brand-soft">Spune-mi problema ta <Icon name="arrow" className="h-5 w-5" /></Link>
          </div>
        </div>
      </Section>

      {/* Noutăți */}
      <Section labelledBy="noutati-title">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 id="noutati-title" className="text-h2">Ultimele noutăți.</h2>
          <Link href="/noutati" className="btn btn-quiet self-start md:self-auto">Toate noutățile <Icon name="arrow" className="h-5 w-5" /></Link>
        </div>
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {ARTICOLE.slice(0, 3).map((a) => <li key={a.slug} className="reveal"><ArticolCard a={a} /></li>)}
        </ul>
      </Section>

      {/* Newsletter */}
      <Section tone="gray" labelledBy="nl-title">
        <div className="text-center">
          <h2 id="nl-title" className="text-h2">Află primul ce se întâmplă.</h2>
          <p className="mx-auto mt-4 max-w-xl text-lead text-ink-2">Un email scurt, doar când avem ceva important de spus.</p>
        </div>
        <div className="mt-10"><Newsletter /></div>
      </Section>
    </Page>
  );
}
