import { ViewTransition } from "react";

/** Învelișul fiecărei pagini: <main> + tranziție discretă la navigare. */
export function Page({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <ViewTransition enter="page-fade" exit="page-fade" default="none">
      <main id="continut" tabIndex={-1} className={`flex-1 outline-none ${className}`}>
        {children}
      </main>
    </ViewTransition>
  );
}

export function PageIntro({ eyebrow, title, lead, children }: { eyebrow?: string; title: string; lead?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <header className="container-x pt-14 pb-10 md:pt-24 md:pb-16">
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h1 className="text-h2 md:text-hero max-w-[18ch]">{title}</h1>
      {lead && <p className="measure mt-5 text-lead text-ink-2">{lead}</p>}
      {children}
    </header>
  );
}

export function Section({ children, tone = "white", className = "", id, labelledBy }: { children: React.ReactNode; tone?: "white" | "gray" | "brand"; className?: string; id?: string; labelledBy?: string }) {
  const bg = tone === "gray" ? "bg-canvas-2" : tone === "brand" ? "bg-brand text-white" : "bg-canvas";
  return (
    <section id={id} aria-labelledby={labelledBy} className={`${bg} py-16 md:py-28 ${className}`}>
      <div className="container-x">{children}</div>
    </section>
  );
}
