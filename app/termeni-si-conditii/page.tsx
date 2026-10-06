import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Termeni și condiții",
  description: "Termeni și condiții pentru site-ul lui Cătălin Renghea.",
  alternates: { canonical: "/termeni-si-conditii" },
};

export default function Page() {
  return <LegalPage slug="termeni-si-conditii" />;
}
