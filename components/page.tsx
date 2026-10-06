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

/** Deschiderea unei pagini interioare: titlu mare, centrat, o frază. */
export function PageIntro({ title, lead, children }: { title: string; lead?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <header className="container-x pt-16 pb-12 text-center md:pt-28 md:pb-16">
      <h1 className="mx-auto max-w-[16ch] text-h2 md:text-hero">{title}</h1>
      {lead && <p className="mx-auto mt-5 max-w-[40ch] text-tagline text-ink-2">{lead}</p>}
      {children}
    </header>
  );
}

const tones = {
  white: "bg-canvas text-ink",
  gray: "bg-canvas-2 text-ink",
  night: "on-night bg-night text-white",
} as const;

export function Section({ children, tone = "white", className = "", id, labelledBy }: { children: React.ReactNode; tone?: keyof typeof tones; className?: string; id?: string; labelledBy?: string }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`${tones[tone]} py-20 md:py-32 ${className}`}>
      <div className="container-x">{children}</div>
    </section>
  );
}

/** Titlul unui capitol: centrat, cu o frază dedesubt. */
export function ChapterHead({ id, title, lead, as: H = "h2" }: { id?: string; title: React.ReactNode; lead?: React.ReactNode; as?: "h1" | "h2" }) {
  return (
    <div className="chapter-head">
      <H id={id} className={H === "h1" ? "text-hero" : "text-h2"}>{title}</H>
      {lead && <p>{lead}</p>}
    </div>
  );
}
