import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { SITE } from "@/lib/content";
import media from "@/content/media.json";

export const alt = `${SITE.nume}, ${SITE.rol}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Imagine de partajare: portretul din hero + nume, slogan, rol.
export default async function OgImage() {
  const [photo, font] = await Promise.all([
    readFile(path.join(process.cwd(), "public", media.foto.hero.src)),
    fetch("https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf")
      .then((r) => (r.ok ? r.arrayBuffer() : null))
      .catch(() => null),
  ]);
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#ffffff", fontFamily: "Inter" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "70px 60px 70px 80px", color: "#1d1d1f" }}>
          <div style={{ fontSize: 30, fontWeight: 700 }}>{SITE.nume}</div>
          <div style={{ fontSize: 62, fontWeight: 700, lineHeight: 1.06, letterSpacing: -1.5 }}>{SITE.slogan}</div>
          <div style={{ fontSize: 28, color: "#2461a2", fontWeight: 700 }}>{SITE.rol}</div>
        </div>
        <img src={src} alt="" width={420} height={630} style={{ objectFit: "cover", objectPosition: "50% 20%" }} />
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Inter", data: font, weight: 700, style: "normal" }] : undefined },
  );
}
