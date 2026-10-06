"use client";

import { useId, useState } from "react";
import { CARTIERE } from "@/lib/content";
import { Consent, FieldError, FormStatus, Honeypot, useDemoForm } from "./form-kit";

const TIPURI = [
  { id: "voluntar", titlu: "Voluntar", text: "Câteva ore pe lună, la evenimente sau pe teren." },
  { id: "sustinator", titlu: "Susținător", text: "Primești noutăți și dai mai departe mesajul." },
  { id: "ambasador", titlu: "Ambasador de cartier", text: "Ești vocea cartierului tău și aduci problemele lui." },
] as const;

export function InvolveForm() {
  const id = useId();
  const f = useDemoForm(() => import("@/lib/schemas").then((m) => m.implicareSchema), "implicare");
  const [tip, setTip] = useState<string>("voluntar");
  return (
    <form onSubmit={f.onSubmit} noValidate className="grid gap-6">
      <fieldset>
        <legend className="label">Cum vrei să te implici?</legend>
        <div className="mt-1 grid gap-3 md:grid-cols-3">
          {TIPURI.map((t) => (
            <label key={t.id} className={`flex cursor-pointer flex-col gap-1 rounded-2xl border-2 p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand ${tip === t.id ? "border-brand bg-brand-soft" : "border-line hover:border-[#c7c7cf]"}`}>
              <input type="radio" name="tip" value={t.id} checked={tip === t.id} onChange={() => setTip(t.id)} className="sr-only" />
              <span className="font-semibold">{t.titlu}</span>
              <span className="text-small text-ink-2">{t.text}</span>
            </label>
          ))}
        </div>
        <FieldError id={`${id}-tip-err`} msg={f.errors.tip} />
      </fieldset>
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
        <div>
          <label htmlFor={`${id}-tel`} className="label">Telefon <span className="font-normal text-ink-3">(opțional)</span></label>
          <input id={`${id}-tel`} name="telefon" type="tel" inputMode="tel" autoComplete="tel" className="field" aria-invalid={!!f.errors.telefon} aria-describedby={f.errors.telefon ? `${id}-tel-err` : undefined} />
          <FieldError id={`${id}-tel-err`} msg={f.errors.telefon} />
        </div>
        <div>
          <label htmlFor={`${id}-cartier`} className="label">Cartierul <span className="font-normal text-ink-3">(opțional)</span></label>
          <select id={`${id}-cartier`} name="cartier" className="field" defaultValue="">
            <option value="">Alege…</option>
            {CARTIERE.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <Consent id={`${id}-c`} error={f.errors.consimtamant}>
        Sunt de acord să fiu contactat de echipa de campanie în legătură cu implicarea mea. Îmi pot retrage acordul oricând.
      </Consent>
      <Honeypot />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" className="btn btn-primary" disabled={f.state === "loading"}>{f.state === "loading" ? "Se trimite…" : "Mă implic"}</button>
        <FormStatus state={f.state} okText="Mulțumim! Te contactăm curând (demo: nu s-a salvat nimic)." error={f.serverError} />
      </div>
    </form>
  );
}
