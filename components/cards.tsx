import Link from "next/link";
import { Icon } from "./icons";
import type { Tema } from "@/lib/content";
import { ARTICOLE } from "@/lib/content";
import { OrTodo } from "./todo";

const temaIcon: Record<string, string> = {
  "strazi-si-trotuare": "road", "parcari-si-trafic": "car", "parcuri-si-spatii-verzi": "tree",
  educatie: "school", social: "hand", siguranta: "shield",
};

/** Placă de temă. `surface` alege contrastul cu fundalul secțiunii. */
export function TemaCard({ tema, surface = "gray" }: { tema: Tema; surface?: "gray" | "white" }) {
  return (
    <Link href={`/program/${tema.slug}`} className={`${surface === "gray" ? "tile" : "tile-white"} flex h-full flex-col p-8 md:p-10`}>
      <Icon name={temaIcon[tema.slug] ?? "dots"} className="h-9 w-9 text-brand" strokeWidth={1.5} />
      <h3 className="mt-10 text-h3">{tema.titlu}</h3>
      <p className="mt-3 text-ink-2">{tema.subtitlu}</p>
      <span className="mt-auto pt-8 font-medium text-brand">Vezi propunerile</span>
    </Link>
  );
}

type Articol = (typeof ARTICOLE)[number];
export function ArticolCard({ a, surface = "gray" }: { a: Articol; surface?: "gray" | "white" }) {
  return (
    <Link href={`/noutati/${a.slug}`} className={`${surface === "gray" ? "tile" : "tile-white"} flex h-full flex-col p-8`}>
      <p className="flex flex-wrap items-center gap-2 text-small text-ink-3">
        {a.exemplu && <span className="todo">EXEMPLU</span>}
        <span>{a.categorie}</span>
        <OrTodo value={a.data} label="[DATA]" />
      </p>
      <h3 className="mt-6 text-h3">{a.titlu}</h3>
      <p className="mt-3 text-ink-2"><OrTodo value={a.rezumat} /></p>
      <span className="mt-auto pt-8 font-medium text-brand">Citește articolul</span>
    </Link>
  );
}
