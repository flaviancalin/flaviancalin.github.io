"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { CARTIERE, CATEGORII, SITE } from "@/lib/content";
import { eroriPeCampuri, pasiSesizare, sesizareSchema } from "@/lib/schemas";
import { Icon } from "../icons";
import { FieldError, Honeypot, postForm } from "../forms/form-kit";
import { CENTRU_S4 } from "./center";

const MapPicker = dynamic(() => import("./map-picker"), {
  ssr: false,
  loading: () => <div className="grid h-[min(56vh,420px)] place-items-center rounded-[var(--radius-card)] bg-canvas-3 text-ink-3">Se încarcă harta…</div>,
});

const PASI = ["Categoria", "Locul", "Descrierea", "Contact", "Confirmare"] as const;

type Date_ = {
  categorie: string;
  pos: [number, number];
  cartier: string;
  adresa: string;
  descriere: string;
  foto: string | null;
  email: string;
  telefon: string;
  consimtamant: boolean;
  website: string;
};

const initial: Date_ = { categorie: "", pos: CENTRU_S4, cartier: "", adresa: "", descriere: "", foto: null, email: "", telefon: "", consimtamant: false, website: "" };

export function ReportWizard({ categorie }: { categorie?: string }) {
  const uid = useId();
  // Venit dintr-o categorie de pe Acasă: categoria e deja aleasă, începem cu locul.
  const [pas, setPas] = useState(categorie ? 2 : 1);
  const [d, setD] = useState<Date_>(() => ({ ...initial, categorie: categorie ?? "" }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string>();
  const [cod, setCod] = useState<string>();
  const heading = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);

  // Focus pe titlul pasului la fiecare schimbare (cititoare de ecran, tastatură).
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    heading.current?.focus();
    heading.current?.scrollIntoView({ block: "nearest" });
  }, [pas]);

  // Eliberează previzualizarea locală a pozei.
  useEffect(() => () => { if (d.foto) URL.revokeObjectURL(d.foto); }, [d.foto]);

  const set = <K extends keyof Date_>(k: K, v: Date_[K]) => setD((x) => ({ ...x, [k]: v }));

  function payload(hp = d.website) {
    return {
      categorie: d.categorie,
      lat: d.pos[0],
      lng: d.pos[1],
      cartier: d.cartier,
      adresa: d.adresa || undefined,
      descriere: d.descriere,
      areFoto: !!d.foto,
      contact: { email: d.email, telefon: d.telefon || undefined },
      consimtamant: d.consimtamant,
      website: hp,
    };
  }

  function valideaza(p: number) {
    const schema = pasiSesizare[p as keyof typeof pasiSesizare];
    if (!schema) return true;
    const r = schema.safeParse(payload());
    if (r.success) { setErrors({}); return true; }
    const errs = eroriPeCampuri(r.error);
    setErrors(errs);
    requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
    return false;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const hp = (e.currentTarget.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";

    if (pas < 4) { if (valideaza(pas)) setPas(pas + 1); return; }
    if (!valideaza(4)) return;
    const full = sesizareSchema.safeParse(payload(hp));
    if (!full.success) { setErrors(eroriPeCampuri(full.error)); return; }
    setLoading(true);
    setServerError(undefined);
    try {
      const res = await postForm("/api/sesizari", full.data);
      setCod(res.cod);
      setPas(5);
    } catch (err) {
      setServerError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setD(initial);
    setCod(undefined);
    setErrors({});
    setPas(1);
  }

  const err = (k: string) => errors[k];
  const errId = (k: string) => `${uid}-${k.replace(/\./g, "-")}-err`;
  const cat = CATEGORII.find((c) => c.id === d.categorie);

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Bară de progres */}
      <div className="mb-8">
        <div className="flex items-baseline justify-between text-small">
          <p className="font-semibold text-brand tabular-nums">Pasul {pas} din {PASI.length}</p>
          <p className="text-ink-3">{PASI[pas - 1]}</p>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-canvas-3" role="progressbar" aria-label="Progres" aria-valuemin={1} aria-valuemax={PASI.length} aria-valuenow={pas} aria-valuetext={`Pasul ${pas} din ${PASI.length}: ${PASI[pas - 1]}`}>
          <div className="h-full w-full origin-left rounded-full bg-brand transition-transform duration-500 ease-[var(--ease-out-soft)]" style={{ transform: `scaleX(${pas / PASI.length})` }} />
        </div>
      </div>

      <form onSubmit={onSubmit} noValidate aria-labelledby={`${uid}-h`}>
        <Honeypot />
        {pas === 1 && (
          <fieldset>
            <legend className="contents">
              <h2 id={`${uid}-h`} ref={heading} tabIndex={-1} className="text-h3 outline-none">Ce fel de problemă e?</h2>
            </legend>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3" role="radiogroup" aria-invalid={!!err("categorie")} aria-describedby={err("categorie") ? errId("categorie") : undefined}>
              {CATEGORII.map((c) => {
                const on = d.categorie === c.id;
                return (
                  <label key={c.id} className={`relative flex min-h-28 last:col-span-2 sm:last:col-span-1 cursor-pointer flex-col justify-between gap-3 rounded-2xl border-2 p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand ${on ? "border-brand bg-brand-soft" : "border-line bg-canvas hover:border-[#c7c7cf]"}`}>
                    <input type="radio" name="categorie" value={c.id} checked={on} onChange={() => set("categorie", c.id)} className="sr-only" />
                    <Icon name={c.icon} className={`h-7 w-7 ${on ? "text-brand" : "text-ink-2"}`} />
                    <span className="font-semibold leading-snug">{c.titlu}</span>
                    {on && <Icon name="check" className="absolute right-3 top-3 h-5 w-5 text-brand" />}
                  </label>
                );
              })}
            </div>
            <FieldError id={errId("categorie")} msg={err("categorie")} />
          </fieldset>
        )}

        {pas === 2 && (
          <div>
            <h2 id={`${uid}-h`} ref={heading} tabIndex={-1} className="text-h3 outline-none">Unde e problema?</h2>
            <p className="mt-2 text-ink-2">Trage pinul sau atinge harta în locul exact.</p>
            <div className="mt-5">
              <MapPicker value={d.pos} onChange={(v) => set("pos", v)} label="Hartă Sectorul 4. Atinge harta sau trage pinul ca să alegi locul." />
              <FieldError id={errId("lat")} msg={err("lat") ?? err("lng")} />
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor={`${uid}-cartier`} className="label">Cartierul</label>
                <select id={`${uid}-cartier`} name="cartier" className="field" value={d.cartier} onChange={(e) => set("cartier", e.target.value)} aria-invalid={!!err("cartier")} aria-describedby={err("cartier") ? errId("cartier") : undefined}>
                  <option value="">Alege…</option>
                  {CARTIERE.map((c) => <option key={c}>{c}</option>)}
                </select>
                <FieldError id={errId("cartier")} msg={err("cartier")} />
              </div>
              <div>
                <label htmlFor={`${uid}-adresa`} className="label">Strada sau un reper <span className="font-normal text-ink-3">(opțional)</span></label>
                <input id={`${uid}-adresa`} name="adresa" className="field" value={d.adresa} onChange={(e) => set("adresa", e.target.value)} autoComplete="street-address" placeholder="Ex.: lângă stația de autobuz…" />
              </div>
            </div>
          </div>
        )}

        {pas === 3 && (
          <div>
            <h2 id={`${uid}-h`} ref={heading} tabIndex={-1} className="text-h3 outline-none">Ce se întâmplă?</h2>
            <div className="mt-6">
              <label htmlFor={`${uid}-desc`} className="label">Descrie pe scurt, în 1–2 propoziții</label>
              <textarea id={`${uid}-desc`} name="descriere" className="field min-h-36 resize-y" maxLength={500} value={d.descriere} onChange={(e) => set("descriere", e.target.value)} aria-invalid={!!err("descriere")} aria-describedby={`${uid}-desc-hint${err("descriere") ? ` ${errId("descriere")}` : ""}`} placeholder="Ex.: Stâlpul din fața blocului nu mai luminează de două săptămâni…" />
              <p id={`${uid}-desc-hint`} className="hint mt-1 text-right tabular-nums">{d.descriere.length} / 500</p>
              <FieldError id={errId("descriere")} msg={err("descriere")} />
            </div>
            <div className="mt-6">
              <p className="label" id={`${uid}-foto-l`}>O poză <span className="font-normal text-ink-3">(opțional)</span></p>
              {d.foto ? (
                <div className="flex items-start gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element -- previzualizare locală blob: */}
                  <img src={d.foto} alt="Previzualizarea pozei alese" width={160} height={120} className="h-30 w-40 rounded-2xl object-cover" />
                  <button type="button" className="btn btn-quiet" onClick={() => set("foto", null)}>Scoate poza</button>
                </div>
              ) : (
                <label className="flex min-h-24 cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-line px-4 text-ink-2 hover:border-brand hover:text-brand has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-brand">
                  <Icon name="camera" />
                  <span className="font-semibold">Fă o poză sau alege una</span>
                  <input type="file" accept="image/*" className="sr-only" aria-labelledby={`${uid}-foto-l`} onChange={(e) => { const f = e.target.files?.[0]; if (f) set("foto", URL.createObjectURL(f)); }} />
                </label>
              )}
              <p className="hint mt-2">Poza rămâne pe telefonul tău. În acest preview nu se trimite nicăieri.</p>
            </div>
          </div>
        )}

        {pas === 4 && (
          <div>
            <h2 id={`${uid}-h`} ref={heading} tabIndex={-1} className="text-h3 outline-none">Cum îți putem răspunde?</h2>
            <p className="mt-2 text-ink-2">Lasă un email sau un număr de telefon. Unul e de ajuns.</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor={`${uid}-email`} className="label">Email</label>
                <input id={`${uid}-email`} name="email" type="email" spellCheck={false} inputMode="email" autoComplete="email" className="field" value={d.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!err("contact.email")} aria-describedby={err("contact.email") ? errId("contact.email") : undefined} />
                <FieldError id={errId("contact.email")} msg={err("contact.email")} />
              </div>
              <div>
                <label htmlFor={`${uid}-tel`} className="label">Telefon</label>
                <input id={`${uid}-tel`} name="telefon" type="tel" inputMode="tel" autoComplete="tel" className="field" value={d.telefon} onChange={(e) => set("telefon", e.target.value)} aria-invalid={!!err("contact.telefon")} aria-describedby={err("contact.telefon") ? errId("contact.telefon") : undefined} />
                <FieldError id={errId("contact.telefon")} msg={err("contact.telefon")} />
              </div>
            </div>
            <div className="mt-6">
              <label htmlFor={`${uid}-c`} className="flex cursor-pointer items-start gap-3 text-small text-ink-2">
                <input id={`${uid}-c`} type="checkbox" checked={d.consimtamant} onChange={(e) => set("consimtamant", e.target.checked)} className="mt-0.5 h-6 w-6 shrink-0 accent-[var(--color-brand)]" aria-invalid={!!err("consimtamant")} aria-describedby={err("consimtamant") ? errId("consimtamant") : undefined} />
                <span>
                  Sunt de acord ca emailul sau telefonul meu să fie folosite doar ca să primesc răspuns la această sesizare. Îmi pot retrage acordul oricând, scriind la {SITE.contact.email}, iar datele se șterg.{" "}
                  <Link href="/politica-de-confidentialitate" className="underline underline-offset-2 hover:text-ink">Politica de confidențialitate</Link>.
                </span>
              </label>
              <FieldError id={errId("consimtamant")} msg={err("consimtamant")} />
            </div>
            <div className="mt-6 rounded-2xl bg-canvas-2 p-5 text-small">
              <p className="font-semibold">Rezumat</p>
              <p className="mt-1 text-ink-2">{cat?.titlu} · {d.cartier}{d.adresa ? `, ${d.adresa}` : ""}</p>
              <p className="mt-1 text-ink-2">„{d.descriere}”{d.foto ? " · cu poză" : ""}</p>
            </div>
          </div>
        )}

        {pas === 5 && (
          <div className="text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-soft text-brand"><Icon name="check" className="h-8 w-8" /></span>
            <h2 id={`${uid}-h`} ref={heading} tabIndex={-1} className="mt-6 text-h3 outline-none">Mulțumim. Am primit sesizarea.</h2>
            <p className="mt-3 text-ink-2">Codul tău de referință:</p>
            <p className="mt-2 font-mono text-[1.75rem] font-semibold tracking-wider text-brand" aria-live="polite">{cod}</p>
            <p className="mx-auto mt-4 max-w-md text-small text-ink-3">Acesta e un preview demonstrativ: sesizarea a fost doar validată, nu s-a salvat și nu s-a trimis nicăieri.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button type="button" className="btn btn-primary" onClick={reset}>Trimite altă sesizare</button>
              <Link href="/" className="btn btn-secondary">Înapoi acasă</Link>
            </div>
          </div>
        )}

        {pas < 5 && (
          <>
            <div role="alert" className="mt-6 min-h-6 text-small text-danger">{serverError}</div>
            <div className="mt-4 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
              {pas > 1 ? (
                <button type="button" className="btn btn-quiet" onClick={() => { setErrors({}); setPas(pas - 1); }}><Icon name="back" className="h-5 w-5" /> Înapoi</button>
              ) : <span />}
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {pas < 4 ? <>Continuă <Icon name="arrow" className="h-5 w-5" /></> : loading ? "Se trimite…" : "Trimite sesizarea"}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

