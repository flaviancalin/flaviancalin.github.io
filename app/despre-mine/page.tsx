import type { Metadata } from "next";
import Link from "next/link";
import { Page, PageIntro, Section } from "@/components/page";
import { Photo } from "@/components/photo";
import { Timeline } from "@/components/timeline";
import { Icon } from "@/components/icons";
import { OrTodo, Todo } from "@/components/todo";
import { DESPRE, ETAPE, STUDII } from "@/lib/content";

export const metadata: Metadata = {
  title: "Despre mine",
  description: "Parcursul lui Cătălin Renghea: Guvern, Parlament, administrație locală în Sectorul 4 și proiecte de investiții. Studii și CV complet.",
  alternates: { canonical: "/despre-mine" },
};

export default function DesprePage() {
  return (
    <Page>
      <PageIntro eyebrow="Despre mine" title="De la Guvern, la Sectorul 4." />

      <Section labelledBy="poveste-title" className="!pt-0">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
          <Photo k="despre" ratio="1 / 1" position="55% 40%" sizes="(min-width: 1216px) 520px, (min-width: 768px) 42vw, 100vw" />
          <div>
            <h2 id="poveste-title" className="sr-only">Povestea mea</h2>
            <div className="measure grid gap-5 text-lead text-ink-2">
              {DESPRE.paragrafe.map((p, i) => (
                <p key={i}><OrTodo value={p.text} label="[PARAGRAF DIN PAGINA „DESPRE MINE” ACTUALĂ]" /></p>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section tone="gray" labelledBy="parcurs-title">
        <div className="grid items-end gap-8 md:grid-cols-[1.4fr_0.6fr]">
          <div>
            <h2 id="parcurs-title" className="text-h2">Parcurs profesional.</h2>
            <p className="measure mt-4 text-lead text-ink-2">Peste zece ani, în patru etape. Apasă pe un rol ca să vezi ce a presupus.</p>
          </div>
          <Photo k="parcurs" ratio="4 / 3" position="50% 35%" sizes="(min-width: 768px) 30vw, 100vw" className="hidden md:block" />
        </div>
        <div className="mt-14"><Timeline etape={ETAPE} /></div>
      </Section>

      <Section labelledBy="studii-title">
        <h2 id="studii-title" className="text-h2">Studii.</h2>
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {STUDII.map((s) => (
            <li key={s.nivel} className="reveal card p-7">
              <p className="eyebrow">{s.nivel}</p>
              <p className="mt-3 text-h3">{s.domeniu ?? <Todo>[DOMENIU]</Todo>}</p>
              <p className="mt-3 text-ink-2"><OrTodo value={s.institutie} label="[INSTITUȚIE]" /></p>
              <p className="mt-1 text-small text-ink-3 tabular-nums"><OrTodo value={s.ani} label="[ANI]" /></p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="gray" labelledBy="faq-title">
        <h2 id="faq-title" className="text-h2">Întrebări frecvente.</h2>
        <div className="measure mt-10 grid gap-3">
          {DESPRE.faq.map((f) => (
            <details key={f.q} className="card group p-0 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 font-semibold">
                {f.q}
                <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-canvas-2 text-ink-2 transition-transform duration-300 group-open:rotate-45"><Icon name="plus" className="h-5 w-5" /></span>
              </summary>
              <p className="px-6 pb-6 text-ink-2">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section labelledBy="cv-title">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 id="cv-title" className="text-h2">CV complet.</h2>
            <p className="mt-3 text-ink-2">Toate rolurile, cu date și toate responsabilitățile.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/despre-mine/cv" className="btn btn-primary">Vezi CV-ul complet <Icon name="arrow" className="h-5 w-5" /></Link>
            {DESPRE.cvPdf ? (
              <a href={DESPRE.cvPdf} className="btn btn-secondary" download><Icon name="download" className="h-5 w-5" /> Descarcă CV-ul (PDF)</a>
            ) : (
              <span className="btn btn-secondary" aria-disabled="true"><Icon name="download" className="h-5 w-5" /> PDF de primit de la client</span>
            )}
          </div>
        </div>
      </Section>
    </Page>
  );
}
