/** Placeholder gri pentru fotografii lipsă. Nu folosim poze stock. */
export function PhotoPlaceholder({ label = "FOTO DE ÎNLOCUIT", hint, ratio = "4 / 5", className = "" }: { label?: string; hint?: string; ratio?: string; className?: string }) {
  return (
    <div
      role="img"
      aria-label={`${label}${hint ? `: ${hint}` : ""}`}
      className={`relative grid place-items-center overflow-hidden rounded-[var(--radius-card)] bg-canvas-3 text-ink-3 ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <svg className="absolute inset-0 h-full w-full opacity-40" aria-hidden="true">
        <defs>
          <pattern id="ph-diag" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="14" stroke="#d6d6dc" strokeWidth="6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ph-diag)" />
      </svg>
      <div className="relative px-4 text-center">
        <p className="text-small font-semibold tracking-wide">{label}</p>
        {hint && <p className="mt-1 text-small">{hint}</p>}
      </div>
    </div>
  );
}
