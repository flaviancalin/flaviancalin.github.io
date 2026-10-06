import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SITE, SITE_URL } from "@/lib/content";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE.nume}, ${SITE.rol}`, template: `%s · ${SITE.nume}` },
  description: "Cătălin Renghea, candidat la Primăria Sectorului 4. Spune-i ce problemă are cartierul tău și află cum te poți implica.",
  // Preview-ul întreg nu se indexează: nu e site-ul final.
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: { type: "website", locale: "ro_RO", siteName: SITE.nume },
  twitter: { card: "summary_large_image" },
};

// Fără maximum-scale: zoom-ul rămâne permis.
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffffff" };

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.nume,
  jobTitle: SITE.rol,
  email: `mailto:${SITE.contact.email}`,
  telephone: SITE.contact.telefon.replace(/\s/g, ""),
  url: SITE_URL,
  address: { "@type": "PostalAddress", addressLocality: "București", addressRegion: "Sector 4", addressCountry: "RO" },
  sameAs: SITE.social.map((s) => s.url),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ro" className={inter.variable}>
      <body className="flex min-h-dvh flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd).replace(/</g, "\\u003c") }} />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
