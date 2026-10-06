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
      <PageIntro eyebrow="Program" title="Șase teme. Probleme reale, soluții concrete." lead={<>Fiecare temă are problema, soluția și angajamentul meu. <Todo /></>} />
      <Section tone="gray" labelledBy="teme-lista" className="!pt-14">
        <h2 id="teme-lista" className="sr-only">Temele programului</h2>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TEME.map((t) => <li key={t.slug} className="reveal"><TemaCard tema={t} /></li>)}
        </ul>
      </Section>
    </Page>
  );
}
