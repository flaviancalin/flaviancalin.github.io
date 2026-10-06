import Image from "next/image";
import media from "@/content/media.json";

export type FotoKey = keyof typeof media.foto;
export const FOTO = media.foto;
export const LOGO = media.logo;

/**
 * Fotografie din inventar, într-un cadru cu raport fix (fără layout shift).
 * `sizes` trebuie să descrie lățimea reală din layout, ca next/image să aleagă varianta potrivită.
 */
export function Photo({ k, ratio = "4 / 5", sizes, priority = false, className = "", position = "50% 30%" }: { k: FotoKey; ratio?: string; sizes: string; priority?: boolean; className?: string; position?: string }) {
  const f = FOTO[k];
  return (
    <div className={`relative overflow-hidden rounded-[var(--radius-card)] bg-canvas-3 ${className}`} style={{ aspectRatio: ratio }}>
      <Image src={f.src} alt={f.alt} fill sizes={sizes} priority={priority} className="object-cover" style={{ objectPosition: position }} />
    </div>
  );
}
