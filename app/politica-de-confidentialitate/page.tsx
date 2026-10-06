import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Politica de confidențialitate",
  description: "Politica de confidențialitate pentru site-ul lui Cătălin Renghea.",
  alternates: { canonical: "/politica-de-confidentialitate" },
};

export default function Page() {
  return <LegalPage slug="politica-de-confidentialitate" />;
}
