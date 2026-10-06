"use client";

import { useState, type FormEvent } from "react";
import type { z } from "zod";
import { eroriPeCampuri } from "@/lib/schemas";

export type FormState = "idle" | "loading" | "ok" | "error";

/** Convertește FormData în obiect: checkbox → boolean, câmpuri goale păstrate ca "". */
export function formToObject(form: HTMLFormElement) {
  const out: Record<string, unknown> = {};
  for (const el of Array.from(form.elements) as HTMLInputElement[]) {
    if (!el.name || el.disabled) continue;
    if (el.type === "checkbox") out[el.name] = el.checked;
    else if (el.type === "radio") { if (el.checked) out[el.name] = el.value; }
    else out[el.name] = el.value;
  }
  return out;
}

export async function postForm(url: string, data: unknown) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(json.message ?? "Nu am putut trimite. Încearcă din nou."), { fields: json.errors });
  return json;
}

/** Formular simplu: validare zod în client, apoi POST la /api/formular/[tip] (care doar validează). */
export function useDemoForm<S extends z.ZodType>(schema: S, tip: string) {
  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = formToObject(form);
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs = eroriPeCampuri(parsed.error);
      setErrors(errs);
      setState("idle");
      const first = form.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`);
      first?.focus();
      return;
    }
    setErrors({});
    setState("loading");
    try {
      await postForm(`/api/formular/${tip}`, parsed.data);
      setState("ok");
      form.reset();
    } catch (err) {
      const e2 = err as Error & { fields?: Record<string, string> };
      if (e2.fields) setErrors(e2.fields);
      setServerError(e2.message);
      setState("error");
    }
  }
  return { state, errors, serverError, onSubmit };
}

export function FieldError({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return <p id={id} className="error">{msg}</p>;
}

export function Consent({ id, error, children, name = "consimtamant" }: { id: string; error?: string; children: React.ReactNode; name?: string }) {
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-small text-ink-2">
        {/* Nebifat implicit (GDPR). */}
        <input id={id} name={name} type="checkbox" className="mt-0.5 h-6 w-6 shrink-0 accent-[var(--color-brand)]" aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} />
        <span>
          {children}{" "}
          <a href="/politica-de-confidentialitate" className="underline underline-offset-2 hover:text-ink">Politica de confidențialitate</a>.
        </span>
      </label>
      <FieldError id={`${id}-err`} msg={error} />
    </div>
  );
}

/** Câmp-capcană pentru boți: ascuns vizual și pentru cititoare de ecran. */
export function Honeypot() {
  return (
    <div className="hp" aria-hidden="true">
      <label>Nu completa acest câmp <input name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" /></label>
    </div>
  );
}

export function FormStatus({ state, okText, error }: { state: FormState; okText: string; error?: string }) {
  return (
    <div role="status" aria-live="polite" className="min-h-6 text-small">
      {state === "ok" && <p className="font-semibold text-ok">{okText}</p>}
      {state === "error" && <p className="text-danger">{error ?? "Nu am putut trimite. Încearcă din nou."}</p>}
    </div>
  );
}
