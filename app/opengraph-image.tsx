import { ImageResponse } from "next/og";
import { SITE } from "@/lib/content";

export const alt = `${SITE.nume}, ${SITE.rol}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Imagine de partajare generată. Se înlocuiește cu portretul real când îl avem.
export default async function OgImage() {
  const font = await fetch("https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf")
    .then((r) => (r.ok ? r.arrayBuffer() : null))
    .catch(() => null);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80, background: "#ffffff", color: "#1d1d1f", fontFamily: "Inter" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: 999, background: "#1747b0", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 700 }}>CR</div>
          <div style={{ fontSize: 34, fontWeight: 700 }}>{SITE.nume}</div>
        </div>
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 980 }}>{SITE.slogan}</div>
        <div style={{ fontSize: 30, color: "#1747b0", fontWeight: 700 }}>{SITE.rol}</div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Inter", data: font, weight: 700, style: "normal" }] : undefined },
  );
}
