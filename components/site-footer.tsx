import Link from "next/link";
import { SITE } from "@/lib/content";
import { NAV, CTA } from "./nav-links";

export function SiteFooter() {
  return (
    <footer className="bg-canvas-2 text-small text-ink-2">
      {/* Tricolorul, ca detaliu de brand preluat din site-ul actual */}
      <div aria-hidden="true" className="grid h-1 grid-cols-3">
        <span className="bg-flag-blue" /><span className="bg-flag-yellow" /><span className="bg-flag-red" />
      </div>
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div>
          <p className="text-[1.0625rem] font-semibold text-ink">{SITE.nume}</p>
          <p className="mt-1">{SITE.rol}</p>
          <p className="mt-4">{SITE.oras}</p>
          <p className="mt-4 grid gap-1">
            <a href={SITE.contact.telefonHref} className="inline-flex min-h-11 w-fit items-center hover:text-ink">{SITE.contact.telefon}</a>
            <a href={`mailto:${SITE.contact.email}`} className="inline-flex min-h-11 w-fit items-center hover:text-ink">{SITE.contact.email}</a>
          </p>
        </div>
        <nav aria-label="Pagini">
          <p className="mb-2 font-semibold text-ink">Pagini</p>
          <ul className="grid">
            <li><Link className="inline-flex min-h-11 items-center hover:text-ink" href={CTA.href}>{CTA.label}</Link></li>
            {NAV.map((l) => (
              <li key={l.href}><Link className="inline-flex min-h-11 items-center hover:text-ink" href={l.href}>{l.label}</Link></li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="mb-2 font-semibold text-ink">Urmărește</p>
          <ul className="grid">
            {SITE.social.map((s) => (
              <li key={s.nume}>
                <a className="inline-flex min-h-11 items-center hover:text-ink" href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.nume}<span className="sr-only"> (se deschide într-o filă nouă)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-black/5">
        <div className="container-x flex flex-col gap-3 py-6 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {SITE.nume}. Preview de lucru, nu este site-ul final.</p>
          <ul className="flex flex-wrap gap-x-5">
            <li><Link className="inline-flex min-h-11 items-center hover:text-ink" href="/termeni-si-conditii">Termeni</Link></li>
            <li><Link className="inline-flex min-h-11 items-center hover:text-ink" href="/politica-de-confidentialitate">Confidențialitate</Link></li>
            <li><Link className="inline-flex min-h-11 items-center hover:text-ink" href="/politica-de-cookies">Cookies</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
