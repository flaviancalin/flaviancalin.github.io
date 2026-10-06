"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Icon } from "./icons";
import { CTA, NAV } from "./nav-links";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();

  // Închide meniul la schimbarea paginii (ajustare de stare în render, fără efect).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className={`sticky top-0 z-50 ${open ? "bg-white" : "bg-white/80 backdrop-blur-xl backdrop-saturate-[1.8]"} border-b border-black/[0.06]`}>
      <a href="#continut" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:shadow">
        Sari la conținut
      </a>
      <div className="container-x flex h-13 items-center justify-between gap-4">
        <Link href="/" className="-ml-2 flex min-h-11 items-center gap-2.5 rounded-lg px-2 text-[0.9375rem] font-semibold tracking-tight">
          <Image src="/brand/monogram.svg" alt="" width={22} height={26} unoptimized priority className="h-[26px] w-auto" />
          <span translate="no">Cătălin Renghea<span className="sr-only">, pagina principală</span></span>
        </Link>

        <nav aria-label="Navigare principală" className="hidden lg:block">
          <ul className="flex items-center">
            {NAV.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className="inline-flex min-h-11 items-center rounded-full px-3.5 text-[0.875rem] text-ink-2 transition-colors hover:text-ink aria-[current=page]:text-ink aria-[current=page]:font-medium"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <Link href={CTA.href} className="btn btn-primary hidden !min-h-8 !px-3.5 !py-1.5 !text-[0.8125rem] sm:inline-flex">
            {CTA.label}
          </Link>
          <button
            type="button"
            className="-mr-2 grid h-11 w-11 place-items-center rounded-full hover:bg-black/5 lg:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Închide meniul" : "Deschide meniul"}
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? "close" : "menu"} className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Meniu mobil: panou pe toată înălțimea, linkuri mari, ca la Apple. */}
      <div id={menuId} hidden={!open} className="fixed inset-x-0 top-13 bottom-0 overflow-y-auto overscroll-contain bg-white lg:hidden">
        <nav aria-label="Navigare mobil" className="container-x pt-6 pb-12">
          <ul className="grid">
            {NAV.map((l) => (
              <li key={l.href}>
                <Link href={l.href} aria-current={isActive(l.href) ? "page" : undefined} className="flex min-h-14 items-center text-[1.75rem] font-semibold tracking-tight text-ink aria-[current=page]:text-brand">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href={CTA.href} className="btn btn-primary mt-8 w-full">{CTA.label}</Link>
        </nav>
      </div>
    </header>
  );
}
