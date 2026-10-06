import type { Metadata } from "next";
import { Page } from "@/components/page";
import { AdminDashboard } from "@/components/admin/dashboard";
import { sesizariDemo } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Sesizări (demo)",
  description: "Demonstrație a panoului intern de sesizări, cu date fictive.",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminSesizari() {
  return (
    <Page className="bg-canvas-2">
      <div role="note" className="bg-todo text-todo-ink">
        <p className="container-x py-3 text-small font-semibold">DEMO: toate datele de pe această pagină sunt fictive. În preview nu se salvează nicio sesizare reală.</p>
      </div>
      <div className="container-x py-10 md:py-14">
        <header className="mb-8">
          <p className="eyebrow">Panou intern · DEMO</p>
          <h1 className="mt-2 text-h2">Sesizări</h1>
        </header>
        <AdminDashboard data={sesizariDemo()} />
      </div>
    </Page>
  );
}
