import Link from "next/link";
import { Icon } from "./icons";
import type { Tema } from "@/lib/content";
import { ARTICOLE } from "@/lib/content";
import { OrTodo } from "./todo";

const temaIcon: Record<string, string> = {
  "strazi-si-trotuare": "road", "parcari-si-trafic": "car", "parcuri-si-spatii-verzi": "tree",
  educatie: "school", social: "hand", siguranta: "shield",
};

export function TemaCard({ tema }: { tema: Tema }) {
  return (
    <Link href={`/program/${tema.slug}`} className="card group flex h-full flex-col gap-4 p-7 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] md:p-8">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand"><Icon name={temaIcon[tema.slug] ?? "dots"} /></span>
      <h3 className="text-h3">{tema.titlu}</h3>
      <p className="text-ink-2">{tema.subtitlu}</p>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-2 font-semibold text-brand">
        Vezi propunerile <Icon name="arrow" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

type Articol = (typeof ARTICOLE)[number];
export function ArticolCard({ a }: { a: Articol }) {
  return (
    <Link href={`/noutati/${a.slug}`} className="card group flex h-full flex-col gap-3 p-7 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
      <div className="flex flex-wrap items-center gap-2 text-small text-ink-3">
        {a.exemplu && <span className="todo">EXEMPLU</span>}
        <span>{a.categorie}</span>
        <span aria-hidden="true">·</span>
        <span><OrTodo value={a.data} label="[DATA]" /></span>
      </div>
      <h3 className="text-h3">{a.titlu}</h3>
      <p className="text-ink-2"><OrTodo value={a.rezumat} /></p>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-2 font-semibold text-brand">Citește <Icon name="arrow" className="h-5 w-5 transition-transform group-hover:translate-x-1" /></span>
    </Link>
  );
}
