"use client";

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
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/75 backdrop-blur-xl backdrop-saturate-150 supports-[not(backdrop-filter:blur(1px))]:bg-white">
      <a href="#continut" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:shadow">
        Sari la conținut
      </a>
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex min-h-11 items-center gap-2 font-semibold tracking-tight">
          <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full bg-brand text-[0.8rem] font-bold text-white">CR</span>
          <span className="text-[1.0625rem]">Cătălin Renghea<span className="sr-only">, pagina principală</span></span>
        </Link>

        <nav aria-label="Navigare principală" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className="inline-flex min-h-11 items-center rounded-full px-3.5 text-[0.98rem] text-ink-2 transition-colors hover:text-ink aria-[current=page]:text-ink aria-[current=page]:font-semibold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link href={CTA.href} className="btn btn-secondary hidden !min-h-10 !px-4 !py-2 !text-[0.95rem] sm:inline-flex">
            {CTA.label}
          </Link>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full hover:bg-black/5 lg:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Închide meniul" : "Deschide meniul"}
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>

      <div id={menuId} hidden={!open} className="border-t border-black/5 bg-white lg:hidden">
        <nav aria-label="Navigare mobil" className="container-x py-4">
          <ul className="grid gap-1">
            {NAV.map((l) => (
              <li key={l.href}>
                <Link href={l.href} aria-current={isActive(l.href) ? "page" : undefined} className="flex min-h-12 items-center rounded-2xl px-3 text-lg hover:bg-canvas-2 aria-[current=page]:font-semibold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href={CTA.href} className="btn btn-primary mt-4 w-full sm:hidden">
            {CTA.label}
          </Link>
        </nav>
      </div>
    </header>
  );
}
