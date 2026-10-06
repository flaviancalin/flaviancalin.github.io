"use client";

import { useId } from "react";
import { newsletterSchema } from "@/lib/schemas";
import { useDemoForm, FormStatus, Consent, Honeypot, FieldError } from "./forms/form-kit";

export function Newsletter() {
  const id = useId();
  const f = useDemoForm(newsletterSchema, "newsletter");
  return (
    <form onSubmit={f.onSubmit} noValidate className="mx-auto grid max-w-xl gap-4" aria-describedby={`${id}-desc`}>
      <p id={`${id}-desc`} className="sr-only">Abonare la noutăți. În preview nu se salvează nimic.</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor={`${id}-email`} className="sr-only">Adresa de email</label>
          <input id={`${id}-email`} name="email" type="email" autoComplete="email" inputMode="email" placeholder="adresa@email.ro" className="field" aria-invalid={!!f.errors.email} aria-describedby={f.errors.email ? `${id}-email-err` : undefined} />
          <FieldError id={`${id}-email-err`} msg={f.errors.email} />
        </div>
        <button type="submit" className="btn btn-primary shrink-0" disabled={f.state === "loading"}>
          {f.state === "loading" ? "Se trimite…" : "Abonează-mă"}
        </button>
      </div>
      <Consent id={`${id}-c`} error={f.errors.consimtamant}>
        Sunt de acord să primesc emailuri despre campanie. Mă pot dezabona oricând, din orice email.
      </Consent>
      <Honeypot />
      <FormStatus state={f.state} okText="Gata. Te-ai abonat (demo: nu s-a salvat nimic)." error={f.serverError} />
    </form>
  );
}
