import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Politica de cookies",
  description: "Politica de cookies pentru site-ul lui Cătălin Renghea.",
  alternates: { canonical: "/politica-de-cookies" },
};

export default function Page() {
  return <LegalPage slug="politica-de-cookies" />;
}
