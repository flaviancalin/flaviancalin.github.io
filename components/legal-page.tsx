import { Page, PageIntro } from "./page";
import { getLegal, type LegalSlug } from "@/lib/legal";

export async function LegalPage({ slug }: { slug: LegalSlug }) {
  const doc = await getLegal(slug);
  return (
    <Page>
      <PageIntro title={doc.title}>
        <p className="mt-6 inline-flex rounded-full bg-todo px-3 py-1 text-small font-semibold text-todo-ink">DE REVIZUIT DE JURIST</p>
      </PageIntro>
      <div className="container-x pb-24">
        <div className="container-narrow !px-0 grid max-w-[68ch] gap-5 text-ink-2">
          {doc.blocks.map((b, i) =>
            b.type === "h2" ? <h2 key={i} className="mt-6 text-h3 text-ink">{b.text}</h2>
            : b.type === "h3" ? <h3 key={i} className="mt-4 font-semibold text-ink">{b.text}</h3>
            : b.type === "ul" ? <ul key={i} className="grid list-disc gap-1.5 pl-5">{b.items.map((it, k) => <li key={k}>{it}</li>)}</ul>
            : <p key={i} className={b.text.startsWith("[") ? "todo w-fit" : ""}>{b.text}</p>,
          )}
        </div>
      </div>
    </Page>
  );
}
