import type { Metadata } from "next";
import { Page, PageIntro, Section } from "@/components/page";
import { TemaCard } from "@/components/cards";
import { Todo } from "@/components/todo";
import { TEME } from "@/lib/content";

export const metadata: Metadata = {
  title: "Program",
  description: "Programul pentru Sectorul 4, pe teme: străzi și trotuare, parcări și trafic, parcuri, educație, social și siguranță.",
  alternates: { canonical: "/program" },
};

export default function ProgramPage() {
  return (
    <Page>
      <PageIntro title="Șase teme. Probleme reale, soluții concrete." lead={<>Pentru fiecare: problema, soluția și angajamentul meu. <Todo /></>} />
      <Section labelledBy="teme-lista" className="!pt-4">
        <h2 id="teme-lista" className="sr-only">Temele programului</h2>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TEME.map((t) => <li key={t.slug}><TemaCard tema={t} /></li>)}
        </ul>
      </Section>
    </Page>
  );
}
