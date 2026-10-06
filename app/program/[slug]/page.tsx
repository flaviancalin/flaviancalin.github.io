import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Page, Section } from "@/components/page";
import { Icon } from "@/components/icons";
import { OrTodo } from "@/components/todo";
import { getTema, TEME } from "@/lib/content";

export function generateStaticParams() {
  return TEME.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata(props: PageProps<"/program/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const t = getTema(slug);
  if (!t) return {};
  return { title: `${t.titlu}: program`, description: `${t.subtitlu} Problema, soluția și angajamentul pentru Sectorul 4.`, alternates: { canonical: `/program/${t.slug}` } };
}

export default async function TemaPage(props: PageProps<"/program/[slug]">) {
  const { slug } = await props.params;
  const t = getTema(slug);
  if (!t) notFound();
  const i = TEME.indexOf(t);
  const next = TEME[(i + 1) % TEME.length];

  const blocuri = [
    { titlu: "Problema", text: t.problema },
    { titlu: "Soluția", text: t.solutie },
  ];

  return (
    <Page>
      <header className="container-x pt-10 pb-12 md:pt-16 md:pb-20">
        <Link href="/program" className="btn btn-quiet -ml-2"><Icon name="back" className="h-5 w-5" /> Program</Link>
        <p className="eyebrow mt-8 mb-3 tabular-nums">Tema {i + 1} din {TEME.length}</p>
        <h1 className="text-h2 md:text-hero max-w-[16ch]">{t.titlu}</h1>
        <p className="measure mt-5 text-lead text-ink-2">{t.subtitlu}</p>
      </header>

      <Section tone="gray" labelledBy="ps-title" className="!py-14 md:!py-20">
        <h2 id="ps-title" className="sr-only">Problema și soluția</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {blocuri.map((b) => (
            <div key={b.titlu} className="card reveal p-7 md:p-9">
              <h3 className="eyebrow">{b.titlu}</h3>
              <p className="mt-4 text-lead"><OrTodo value={b.text} /></p>
            </div>
          ))}
        </div>
      </Section>

      <Section labelledBy="ang-title">
        <h2 id="ang-title" className="text-h2">Ce mă angajez să fac.</h2>
        <ol className="measure mt-10 grid gap-5">
          {t.angajamente.map((a, k) => (
            <li key={k} className="flex gap-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-soft font-semibold text-brand tabular-nums">{k + 1}</span>
              <p className="pt-1 text-lead"><OrTodo value={a} /></p>
            </li>
          ))}
        </ol>
        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-10 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/spune-mi-problema" className="btn btn-primary">Semnalează o problemă <Icon name="arrow" className="h-5 w-5" /></Link>
          <Link href={`/program/${next.slug}`} className="btn btn-quiet">Tema următoare: {next.titlu} <Icon name="arrow" className="h-5 w-5" /></Link>
        </div>
      </Section>
    </Page>
  );
}
