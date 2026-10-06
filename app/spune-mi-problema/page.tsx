import type { Metadata } from "next";
import { Page } from "@/components/page";
import { ReportWizard } from "@/components/report/wizard";
import { CATEGORII } from "@/lib/content";

export const metadata: Metadata = {
  title: "Spune-mi problema ta",
  description: "Semnalează o problemă din Sectorul 4 în cinci pași scurți: categoria, locul pe hartă, descrierea și cum îți putem răspunde.",
  alternates: { canonical: "/spune-mi-problema" },
};

export default async function ProblemaPage(props: PageProps<"/spune-mi-problema">) {
  const { categorie } = await props.searchParams;
  const valida = typeof categorie === "string" && CATEGORII.some((c) => c.id === categorie) ? categorie : undefined;
  return (
    <Page className="bg-canvas-2">
      <div className="container-x py-12 md:py-20">
        <header className="mx-auto mb-10 max-w-2xl text-center">
          <h1 className="text-h2">Spune-mi problema ta.</h1>
          <p className="mt-3 text-tagline text-ink-2">Cinci pași scurți. Durează cam un minut.</p>
          <p className="mt-5 inline-flex rounded-full bg-todo px-3 py-1 text-small font-semibold text-todo-ink">Demo: nimic nu se salvează</p>
        </header>
        <div className="card mx-auto max-w-2xl p-5 sm:p-8 md:p-10">
          <ReportWizard key={valida ?? "nou"} categorie={valida} />
        </div>
      </div>
    </Page>
  );
}
