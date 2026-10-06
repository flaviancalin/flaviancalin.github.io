import type { Metadata } from "next";
import Link from "next/link";
import { Page, PageIntro } from "@/components/page";
import { Icon } from "@/components/icons";
import { OrTodo, Todo } from "@/components/todo";
import { ETAPE, STUDII, SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "CV complet",
  description: "CV-ul complet al lui Cătălin Renghea: experiență profesională și studii.",
  alternates: { canonical: "/despre-mine/cv" },
};

export default function CvPage() {
  return (
    <Page>
      <PageIntro eyebrow="Despre mine" title="CV complet" lead={<>Versiunea integrală, fără prescurtări. <Todo>[TEXTUL COMPLET SE IMPORTĂ DIN SITE-UL ACTUAL]</Todo></>}>
        <Link href="/despre-mine" className="btn btn-quiet mt-6 -ml-2"><Icon name="back" className="h-5 w-5" /> Înapoi la Despre mine</Link>
      </PageIntro>
      <div className="container-x pb-24">
        <article className="measure">
          <h2 className="text-h3">{SITE.nume}</h2>
          <p className="text-ink-2">{SITE.contact.email} · {SITE.contact.telefon}</p>
          <h2 className="mt-12 text-h3">Experiență profesională</h2>
          {ETAPE.map((e) => (
            <section key={e.id} className="mt-8">
              <h3 className="font-semibold text-brand">{e.titlu}</h3>
              <ul className="mt-3 grid gap-4">
                {e.joburi.map((j) => (
                  <li key={j.id} className="border-l-2 border-line pl-4">
                    <p className="font-semibold"><OrTodo value={j.rol} label="[ROL]" />, <OrTodo value={j.organizatie} label="[INSTITUȚIE]" /></p>
                    <p className="text-small text-ink-3"><OrTodo value={j.perioada} label="[PERIOADA]" /></p>
                    <p className="mt-1 text-ink-2"><Todo>[DESCRIERE INTEGRALĂ DIN SITE]</Todo></p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <h2 className="mt-12 text-h3">Studii</h2>
          <ul className="mt-4 grid gap-3">
            {STUDII.map((s) => (
              <li key={s.nivel}><span className="font-semibold">{s.nivel}</span>{s.domeniu ? ` în ${s.domeniu}` : ""}, <OrTodo value={s.institutie} label="[INSTITUȚIE]" /> <span className="text-ink-3">(<OrTodo value={s.ani} label="[ANI]" />)</span></li>
            ))}
          </ul>
        </article>
      </div>
    </Page>
  );
}
