import { TODO } from "@/lib/content";

/** Marcaj vizibil pentru conținut care lipsește. Nu se inventează nimic în locul lui. */
export function Todo({ children = TODO }: { children?: React.ReactNode }) {
  return <span className="todo">{children}</span>;
}

/** Afișează textul dacă există, altfel marcajul. */
export function OrTodo({ value, label }: { value: string | null | undefined; label?: string }) {
  if (!value || value.startsWith("[DE COMPLETAT")) return <Todo>{label ?? value ?? "[DE COMPLETAT DIN SITE-UL ACTUAL]"}</Todo>;
  return <>{value}</>;
}
