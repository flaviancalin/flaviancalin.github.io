"use client";

import { useId } from "react";
import Link from "next/link";
import { contactSchema } from "@/lib/schemas";
import { Consent, FieldError, FormStatus, Honeypot, useDemoForm } from "./form-kit";

export function ContactForm() {
  const id = useId();
  const f = useDemoForm(contactSchema, "contact");
  return (
    <form onSubmit={f.onSubmit} noValidate className="grid gap-5">
      <div>
        <label htmlFor={`${id}-motiv`} className="label">Motivul</label>
        <select id={`${id}-motiv`} name="motiv" className="field" defaultValue="intrebare" aria-describedby={`${id}-motiv-hint`}>
          <option value="intrebare">O întrebare</option>
          <option value="problema">O problemă din cartier</option>
          <option value="presa">Presă</option>
        </select>
        <p id={`${id}-motiv-hint`} className="hint mt-1.5">Pentru o problemă concretă e mai rapid <Link href="/spune-mi-problema" className="underline underline-offset-2">formularul de sesizări</Link>.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-nume`} className="label">Nume</label>
          <input id={`${id}-nume`} name="nume" autoComplete="name" className="field" aria-invalid={!!f.errors.nume} aria-describedby={f.errors.nume ? `${id}-nume-err` : undefined} />
          <FieldError id={`${id}-nume-err`} msg={f.errors.nume} />
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="label">Email</label>
          <input id={`${id}-email`} name="email" type="email" inputMode="email" autoComplete="email" className="field" aria-invalid={!!f.errors.email} aria-describedby={f.errors.email ? `${id}-email-err` : undefined} />
          <FieldError id={`${id}-email-err`} msg={f.errors.email} />
        </div>
      </div>
      <div>
        <label htmlFor={`${id}-mesaj`} className="label">Mesajul</label>
        <textarea id={`${id}-mesaj`} name="mesaj" className="field min-h-36 resize-y" maxLength={2000} aria-invalid={!!f.errors.mesaj} aria-describedby={f.errors.mesaj ? `${id}-mesaj-err` : undefined} />
        <FieldError id={`${id}-mesaj-err`} msg={f.errors.mesaj} />
      </div>
      <Consent id={`${id}-c`} error={f.errors.consimtamant}>
        Sunt de acord ca datele mele să fie folosite doar ca să primesc răspuns. Îmi pot retrage acordul oricând.
      </Consent>
      <Honeypot />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" className="btn btn-primary" disabled={f.state === "loading"}>{f.state === "loading" ? "Se trimite…" : "Trimite mesajul"}</button>
        <FormStatus state={f.state} okText="Mesaj primit (demo: nu s-a trimis nimic)." error={f.serverError} />
      </div>
    </form>
  );
}
