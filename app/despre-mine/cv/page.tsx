import type { Metadata } from "next";
import Link from "next/link";
import { Page, PageIntro } from "@/components/page";
import { Icon } from "@/components/icons";
import { CV, DESPRE, STUDII, SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "CV complet",
  description: "CV-ul complet al lui Mihai-Cătălin Renghea: experiență profesională din 2014 până azi și studii.",
  alternates: { canonical: "/despre-mine/cv" },
};

export default function CvPage() {
  return (
    <Page>
      <PageIntro eyebrow="Despre mine" title="CV complet" lead="Versiunea integrală, cu toate responsabilitățile și realizările.">
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/despre-mine" className="btn btn-quiet -ml-2"><Icon name="back" className="h-5 w-5" /> Înapoi la Despre mine</Link>
          {DESPRE.cvPdf && <a href={DESPRE.cvPdf} download className="btn btn-secondary"><Icon name="download" className="h-5 w-5" /> Descarcă PDF</a>}
        </div>
      </PageIntro>
      <div className="container-x pb-24">
        <article className="measure">
          <h2 className="text-h3">{SITE.numeComplet}</h2>
          <p className="text-ink-2">{SITE.oras} · {SITE.contact.email}</p>

          <h2 className="mt-14 text-h3">Experiență profesională</h2>
          <ol className="mt-6 grid gap-10">
            {CV.map((j) => (
              <li key={j.perioada + j.rol} className="border-l-2 border-line pl-5">
                <p className="text-small font-semibold text-brand tabular-nums">{j.perioada}</p>
                <h3 className="mt-1 text-[1.1875rem] font-semibold">{j.rol}</h3>
                <p className="text-ink-2">{j.organizatie}</p>
                {j.sectiuni.map((sec) => (
                  <div key={sec.titlu} className="mt-4">
                    <p className="text-small font-semibold text-ink-3">{sec.titlu}</p>
                    <ul className="mt-1.5 grid list-disc gap-1 pl-5 text-ink-2">
                      {sec.puncte.map((p) => <li key={p}>{p}</li>)}
                    </ul>
                  </div>
                ))}
              </li>
            ))}
          </ol>

          <h2 className="mt-14 text-h3">Studii</h2>
          <ul className="mt-6 grid gap-5">
            {STUDII.map((s) => (
              <li key={s.nivel} className="border-l-2 border-line pl-5">
                <p className="text-small font-semibold text-brand tabular-nums">{s.ani}</p>
                <p className="font-semibold">{s.nivel} în {s.domeniu}</p>
                <p className="text-ink-2">{s.institutie}</p>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </Page>
  );
}
