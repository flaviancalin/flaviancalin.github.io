import type { Metadata } from "next";
import { ChapterHead, Page, PageIntro, Section } from "@/components/page";
import { ArticolCard } from "@/components/cards";
import { Photo, LOGO } from "@/components/photo";
import Image from "next/image";
import { Icon } from "@/components/icons";
import { OrTodo } from "@/components/todo";
import { ARTICOLE, KIT_PRESA } from "@/lib/content";

export const metadata: Metadata = {
  title: "Noutăți și presă",
  description: "Comunicate, noutăți din campanie și kitul de presă: biografie scurtă, portret și logo.",
  alternates: { canonical: "/noutati" },
};

export default function NoutatiPage() {
  return (
    <Page>
      <PageIntro title="Noutăți și presă." lead="Ce se mai întâmplă în campanie și materialele pentru jurnaliști." />
      <Section labelledBy="art-title" className="!pt-4">
        <h2 id="art-title" className="sr-only">Articole</h2>
        <ul className="grid gap-5 md:grid-cols-3">
          {ARTICOLE.map((a) => <li key={a.slug}><ArticolCard a={a} /></li>)}
        </ul>
      </Section>
      <Section tone="gray" labelledBy="kit-title" id="kit-presa">
        <ChapterHead id="kit-title" title="Kit de presă." lead="Biografie, portret oficial și logo, gata de folosit." />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <div className="tile-white p-8">
            <h3 className="text-h3">Biografie scurtă</h3>
            <p className="mt-4"><OrTodo value={KIT_PRESA.bioScurta} label="[BIO DE 80–100 DE CUVINTE, APROBATĂ DE CLIENT]" /></p>
            <p className="mt-3 text-small text-ink-3">Compusă din textul site-ului actual. <span className="todo">DE APROBAT</span></p>
          </div>
          <div className="tile-white p-8">
            <h3 className="text-h3">Portret oficial</h3>
            <Photo k="presa" className="mt-4" ratio="4 / 5" position="50% 25%" sizes="(min-width: 768px) 30vw, 100vw" />
            <a href={KIT_PRESA.portret} download className="btn btn-quiet mt-3 -ml-2"><Icon name="download" className="h-5 w-5" /> Descarcă portretul (JPG)</a>
          </div>
          <div className="tile-white p-8">
            <h3 className="text-h3">Logo</h3>
            <div className="mt-4 grid aspect-[4/3] place-items-center rounded-[var(--radius-card)] bg-canvas-2">
              <Image src={LOGO.monograma} alt={LOGO.alt} width={88} height={105} unoptimized />
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4">
              <a href={KIT_PRESA.logoSvg} download className="btn btn-quiet -ml-2"><Icon name="download" className="h-5 w-5" /> SVG</a>
              <a href={KIT_PRESA.logo} download className="btn btn-quiet"><Icon name="download" className="h-5 w-5" /> PNG</a>
            </div>
            <p className="mt-4 text-small text-ink-2">Contact presă: <a className="font-semibold underline underline-offset-2" href={`mailto:${KIT_PRESA.contactPresa}`}>{KIT_PRESA.contactPresa}</a></p>
          </div>
        </div>
      </Section>
    </Page>
  );
}
