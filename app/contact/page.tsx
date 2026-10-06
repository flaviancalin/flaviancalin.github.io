import type { Metadata } from "next";
import { Page, PageIntro, Section } from "@/components/page";
import { ContactForm } from "@/components/forms/contact-form";
import { Icon } from "@/components/icons";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Scrie-i lui Cătălin Renghea: întrebări, probleme din cartier sau solicitări de presă. Telefon, email și rețele sociale.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <Page>
      <PageIntro eyebrow="Contact" title="Scrie-mi." lead="Pentru întrebări, probleme din cartier sau solicitări de presă." />
      <Section tone="gray" labelledBy="c-form" className="!pt-14">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="card p-6 sm:p-10">
            <h2 id="c-form" className="mb-6 text-h3">Trimite un mesaj</h2>
            <ContactForm />
          </div>
          <aside aria-label="Date de contact" className="grid content-start gap-4">
            <a href={SITE.contact.telefonHref} className="card flex min-h-20 items-center gap-4 p-6 hover:shadow-[var(--shadow-lift)]">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-soft text-brand"><Icon name="phone" className="h-5 w-5" /></span>
              <span><span className="block text-small text-ink-3">Telefon</span><span className="font-semibold tabular-nums">{SITE.contact.telefon}</span></span>
            </a>
            <a href={`mailto:${SITE.contact.email}`} className="card flex min-h-20 items-center gap-4 p-6 hover:shadow-[var(--shadow-lift)]">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-soft text-brand"><Icon name="mail" className="h-5 w-5" /></span>
              <span className="min-w-0"><span className="block text-small text-ink-3">Email</span><span className="block break-all font-semibold">{SITE.contact.email}</span></span>
            </a>
            <div className="card flex items-center gap-4 p-6">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-soft text-brand"><Icon name="pin" className="h-5 w-5" /></span>
              <span><span className="block text-small text-ink-3">Locul</span><span className="font-semibold">{SITE.oras}</span></span>
            </div>
            <div className="card p-6">
              <p className="text-small text-ink-3">Rețele sociale</p>
              <ul className="mt-2 grid">
                {SITE.social.map((s) => (
                  <li key={s.nume}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center justify-between gap-3 font-semibold hover:text-brand">
                      <span>{s.nume} <span className="font-normal text-ink-3">{s.handle}</span></span>
                      <Icon name="arrow" className="h-4 w-4 shrink-0" />
                      <span className="sr-only">(se deschide într-o filă nouă)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Section>
    </Page>
  );
}
