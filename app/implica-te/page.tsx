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
      <section aria-labelledby="implica-title" className="overflow-hidden pt-16 pb-16 md:pt-28 md:pb-24">
        <div className="container-x text-center">
          <h1 id="implica-title" className="mx-auto max-w-[14ch] text-h2 md:text-hero">Sectorul&nbsp;4 se schimbă cu oamenii lui.</h1>
          <p className="mx-auto mt-5 max-w-[38ch] text-tagline text-ink-2">Alege cât de mult vrei să te implici. Orice ajutor contează, de la o distribuire la o zi pe teren.</p>
        </div>
        <div className="container-x mt-12 md:mt-16">
          <Photo k="implica" priority ratio="var(--r)" position="50% 30%" sizes="(min-width: 1200px) 1120px, 100vw" className="media-settle [--r:4/5] sm:[--r:3/2] lg:[--r:16/9]" />
        </div>
      </section>
      <Section tone="gray" labelledBy="form-title">
        <div className="mx-auto max-w-3xl">
          <h2 id="form-title" className="text-center text-h2">Spune-ne cum vrei să ajuți.</h2>
          <p className="mt-3 mb-10 text-center text-small text-ink-3">Formular demonstrativ: datele doar se validează, nu se salvează.</p>
          <div className="card p-6 sm:p-10"><InvolveForm /></div>
        </div>
      </Section>
      <Section labelledBy="wa-title">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="chapter-head">
            <h2 id="wa-title" className="text-h2">Canalul de WhatsApp.</h2>
            <p>Noutăți scurte, direct pe telefon.</p>
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
