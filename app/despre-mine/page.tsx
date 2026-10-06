import type { Metadata } from "next";
import Link from "next/link";
import { ChapterHead, Page, Section } from "@/components/page";
import { Photo } from "@/components/photo";
import { Timeline } from "@/components/timeline";
import { Icon } from "@/components/icons";
import { DESPRE, ETAPE, STUDII } from "@/lib/content";

export const metadata: Metadata = {
  title: "Despre mine",
  description: "Parcursul lui Cătălin Renghea: Guvern, Parlament, administrație locală în Sectorul 4 și proiecte de investiții. Studii și CV complet.",
  alternates: { canonical: "/despre-mine" },
};

export default function DesprePage() {
  const [intro, ...rest] = DESPRE.paragrafe;
  return (
    <Page>
      <section aria-labelledby="despre-title" className="overflow-hidden pt-16 pb-16 md:pt-28 md:pb-24">
        <div className="container-x">
          <ChapterHead as="h1" id="despre-title" title="De la Guvern, la Sectorul 4." lead="Peste zece ani în Guvern, în Parlament și în instituțiile Sectorului 4." />
        </div>
        <div className="container-x mt-12 md:mt-16">
          <Photo k="despre" priority ratio="var(--r)" position="55% 18%" sizes="(min-width: 1200px) 1120px, 100vw" className="media-settle [--r:1/1] sm:[--r:3/2] lg:[--r:16/9]" />
        </div>
      </section>

      <Section labelledBy="poveste-title" className="!pt-0">
        <div className="container-narrow !px-0">
          <h2 id="poveste-title" className="sr-only">Povestea mea</h2>
          <p className="text-tagline font-medium text-ink">{intro.text}</p>
          <div className="mt-8 grid gap-6 text-lead text-ink-2 md:grid-cols-3 md:gap-10">
            {rest.map((p, i) => <p key={i}>{p.text}</p>)}
          </div>
        </div>
      </Section>

      <Section tone="gray" labelledBy="parcurs-title">
        <ChapterHead id="parcurs-title" title="Parcurs profesional." lead="Douăsprezece roluri, în patru etape. Apasă pe un rol ca să vezi ce a presupus." />
        <div className="mt-16"><Timeline etape={ETAPE} /></div>
      </Section>

      <Section labelledBy="studii-title">
        <ChapterHead id="studii-title" title="Studii." />
        <ol className="mx-auto mt-14 grid max-w-5xl gap-10 md:grid-cols-3 md:gap-8">
          {STUDII.map((s) => (
            <li key={s.nivel} className="border-t border-line pt-6">
              <p className="text-small text-ink-3 tabular-nums">{s.ani}</p>
              <h3 className="mt-2 text-h3">{s.nivel}</h3>
              <p className="mt-1 text-lead font-medium">{s.domeniu}</p>
              <p className="mt-2 text-ink-2">{s.institutie}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="gray" labelledBy="faq-title">
        <ChapterHead id="faq-title" title="Întrebări frecvente." />
        <div className="mx-auto mt-14 max-w-3xl divide-y divide-line border-y border-line">
          {DESPRE.faq.map((f) => (
            <details key={f.q} className="group [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex min-h-18 cursor-pointer list-none items-center justify-between gap-6 py-5 text-lead font-semibold">
                {f.q}
                <Icon name="plus" aria-hidden="true" className="h-6 w-6 shrink-0 text-ink-3 transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="max-w-[62ch] pb-6 text-lead text-ink-2">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section labelledBy="cv-title">
        <ChapterHead id="cv-title" title="CV complet." lead="Toate rolurile, cu date și toate responsabilitățile." />
        <div className="mt-10 flex flex-col items-center justify-center gap-x-6 gap-y-2 sm:flex-row">
          <Link href="/despre-mine/cv" className="btn btn-primary">Vezi CV-ul complet</Link>
          {DESPRE.cvPdf && <a href={DESPRE.cvPdf} className="link-more" download>Descarcă PDF</a>}
        </div>
      </Section>
    </Page>
  );
}
