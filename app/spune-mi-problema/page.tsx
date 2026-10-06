import type { Metadata } from "next";
import { Page } from "@/components/page";
import { ReportWizard } from "@/components/report/wizard";

export const metadata: Metadata = {
  title: "Spune-mi problema ta",
  description: "Semnalează o problemă din Sectorul 4 în cinci pași scurți: categoria, locul pe hartă, descrierea și cum îți putem răspunde.",
  alternates: { canonical: "/spune-mi-problema" },
};

export default function ProblemaPage() {
  return (
    <Page className="bg-canvas-2">
      <div className="container-x py-10 md:py-16">
        <header className="mx-auto mb-10 max-w-2xl">
          <p className="mb-3 inline-flex rounded-full bg-todo px-3 py-1 text-small font-semibold text-todo-ink">DEMO: nimic nu se salvează</p>
          <h1 className="text-h2">Spune-mi problema ta.</h1>
          <p className="mt-3 text-lead text-ink-2">Cinci pași scurți. Durează cam un minut.</p>
        </header>
        <div className="card mx-auto max-w-2xl p-5 sm:p-8 md:p-10">
          <ReportWizard />
        </div>
      </div>
    </Page>
  );
}
