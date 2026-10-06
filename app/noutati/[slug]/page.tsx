import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Page } from "@/components/page";
import { Icon } from "@/components/icons";
import { OrTodo } from "@/components/todo";
import { PhotoPlaceholder } from "@/components/photo-placeholder";
import { ARTICOLE, getArticol } from "@/lib/content";

export function generateStaticParams() {
  return ARTICOLE.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(props: PageProps<"/noutati/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const a = getArticol(slug);
  return a ? { title: a.titlu, description: `${a.categorie}: articol exemplu, de înlocuit.`, alternates: { canonical: `/noutati/${a.slug}` } } : {};
}

export default async function ArticolPage(props: PageProps<"/noutati/[slug]">) {
  const { slug } = await props.params;
  const a = getArticol(slug);
  if (!a) notFound();
  return (
    <Page>
      <article className="container-x pt-10 pb-24 md:pt-16">
        <Link href="/noutati" className="btn btn-quiet -ml-2"><Icon name="back" className="h-5 w-5" /> Noutăți</Link>
        <header className="mt-8 max-w-3xl">
          <p className="flex flex-wrap items-center gap-2 text-small text-ink-3">
            {a.exemplu && <span className="todo">ARTICOL EXEMPLU</span>}
            <span>{a.categorie}</span><span aria-hidden="true">·</span><OrTodo value={a.data} label="[DATA]" />
          </p>
          <h1 className="mt-4 text-h2">{a.titlu}</h1>
        </header>
        <PhotoPlaceholder className="mt-10 max-w-4xl" ratio="16 / 9" hint="Fotografie de articol" />
        <div className="measure mt-10 grid gap-5 text-lead">
          {a.corp.map((p, i) => <p key={i}><OrTodo value={p} /></p>)}
        </div>
      </article>
    </Page>
  );
}
