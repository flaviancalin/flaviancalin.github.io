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
      <header className="container-x pt-8 pb-14 md:pt-12 md:pb-24">
        <Link href="/program" className="btn btn-quiet -ml-2"><Icon name="back" className="h-5 w-5" /> Program</Link>
        <div className="mt-10 text-center md:mt-16">
          <p className="text-small text-ink-3 tabular-nums">Tema {i + 1} din {TEME.length}</p>
          <h1 className="mx-auto mt-3 max-w-[14ch] text-h2 md:text-hero">{t.titlu}</h1>
          <p className="mx-auto mt-5 max-w-[36ch] text-tagline text-ink-2">{t.subtitlu}</p>
        </div>
      </header>

      <Section tone="gray" labelledBy="ps-title">
        <h2 id="ps-title" className="sr-only">Problema și soluția</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {blocuri.map((b) => (
            <div key={b.titlu} className="tile-white p-8 md:p-12">
              <h3 className="text-h3">{b.titlu}</h3>
              <p className="mt-5 text-lead text-ink-2"><OrTodo value={b.text} /></p>
            </div>
          ))}
        </div>
      </Section>

      <Section labelledBy="ang-title">
        <h2 id="ang-title" className="text-center text-h2">Ce mă angajez să fac.</h2>
        <ol className="mx-auto mt-12 grid max-w-2xl gap-6">
          {t.angajamente.map((a, k) => (
            <li key={k} className="flex gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand text-[1.0625rem] font-semibold text-white tabular-nums">{k + 1}</span>
              <p className="pt-1 text-lead"><OrTodo value={a} /></p>
            </li>
          ))}
        </ol>
        <div className="mx-auto mt-16 flex max-w-2xl flex-col gap-3 border-t border-line pt-10 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/spune-mi-problema" className="btn btn-primary">Semnalează o problemă</Link>
          <Link href={`/program/${next.slug}`} className="link-more">Tema următoare: {next.titlu}</Link>
        </div>
      </Section>
    </Page>
  );
}
