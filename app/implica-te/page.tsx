import type { Metadata } from "next";
import { Page, Section } from "@/components/page";
import { InvolveForm } from "@/components/forms/involve-form";
import { Icon } from "@/components/icons";
import { Todo } from "@/components/todo";
import { SITE } from "@/lib/content";
import { Photo } from "@/components/photo";

export const metadata: Metadata = {
  title: "Implică-te",
  description: "Devino voluntar, susținător sau ambasador de cartier în campania lui Cătălin Renghea pentru Sectorul 4.",
  alternates: { canonical: "/implica-te" },
};

export default function ImplicaPage() {
  return (
    <Page>
      <header className="container-x grid items-center gap-10 pt-14 pb-12 md:grid-cols-[1.3fr_0.7fr] md:pt-24 md:pb-16">
        <div>
          <p className="eyebrow mb-3">Implică-te</p>
          <h1 className="text-h2 md:text-hero max-w-[16ch]">Sectorul 4 se schimbă cu oamenii lui.</h1>
          <p className="measure mt-5 text-lead text-ink-2">Alege cât de mult vrei să te implici. Orice ajutor contează, de la o distribuire la o zi pe teren.</p>
        </div>
        <Photo k="implica" priority ratio="4 / 5" position="50% 30%" sizes="(min-width: 1216px) 400px, (min-width: 768px) 33vw, 100vw" className="max-h-[48svh] w-full md:max-h-none" />
      </header>
      <Section tone="gray" labelledBy="form-title" className="!pt-14">
        <div className="card mx-auto max-w-3xl p-6 sm:p-10">
          <h2 id="form-title" className="text-h3">Spune-ne cum vrei să ajuți.</h2>
          <p className="mt-2 mb-8 text-small text-ink-3">Formular demonstrativ: datele doar se validează, nu se salvează.</p>
          <InvolveForm />
        </div>
      </Section>
      <Section labelledBy="wa-title">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 id="wa-title" className="text-h2">Canalul de WhatsApp.</h2>
            <p className="mt-3 text-lead text-ink-2">Noutăți scurte, direct pe telefon.</p>
          </div>
          {SITE.whatsappCanal ? (
            <a href={SITE.whatsappCanal} className="btn btn-secondary" target="_blank" rel="noopener noreferrer"><Icon name="chat" className="h-5 w-5" /> Intră în canal</a>
          ) : (
            <p><Todo>[LINK CANAL WHATSAPP DE LA CLIENT]</Todo></p>
          )}
        </div>
      </Section>
    </Page>
  );
}
