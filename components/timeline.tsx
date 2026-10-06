"use client";

import { useId, useState } from "react";
import type { Etapa, Job } from "@/lib/content";
import { Icon } from "./icons";
import { OrTodo, Todo } from "./todo";

function JobRow({ job }: { job: Job }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <li className="tile-white overflow-hidden !rounded-[var(--radius-card)]">
      <h4>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className="flex min-h-18 w-full items-center justify-between gap-5 px-6 py-5 text-left md:px-7"
        >
          <span className="min-w-0">
            <span className="block text-small text-ink-3 tabular-nums"><OrTodo value={job.perioada} label="[PERIOADA]" /></span>
            <span className="mt-1 block text-[1.125rem] font-semibold leading-snug">{job.rol ?? <Todo>[ROL]</Todo>}</span>
            <span className="mt-0.5 block text-ink-2">{job.organizatie ?? <Todo>[INSTITUȚIE]</Todo>}</span>
          </span>
          <Icon name="plus" aria-hidden="true" className={`h-6 w-6 shrink-0 text-ink-3 transition-transform duration-300 ${open ? "rotate-45" : ""}`} />
        </button>
      </h4>
      {/* Expand fluid: grid-rows 0fr → 1fr, declanșat doar de utilizator */}
      <div id={id} className={`grid transition-[grid-template-rows] duration-300 ease-[var(--ease-out-soft)] ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`} inert={!open}>
        <div className="overflow-hidden">
          <div className="grid gap-6 px-6 pb-7 md:grid-cols-2 md:px-7">
            <div>
              <p className="text-small font-semibold text-ink">Responsabilități</p>
              <ul className="mt-2 grid list-disc gap-1.5 pl-5 text-ink-2 marker:text-ink-3">
                {job.responsabilitati.length ? job.responsabilitati.slice(0, 3).map((r) => <li key={r}>{r}</li>) : <li><Todo>[DIN TEXTUL ORIGINAL, MAX. 3]</Todo></li>}
              </ul>
            </div>
            <div>
              <p className="text-small font-semibold text-ink">Realizări</p>
              <ul className="mt-2 grid list-disc gap-1.5 pl-5 text-ink-2 marker:text-ink-3">
                {job.realizari.length ? job.realizari.slice(0, 2).map((r) => <li key={r}>{r}</li>) : <li><Todo>[DIN TEXTUL ORIGINAL, 1–2]</Todo></li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export function Timeline({ etape }: { etape: Etapa[] }) {
  return (
    <ol className="mx-auto grid max-w-5xl gap-16 md:gap-24">
      {etape.map((e, i) => (
        <li key={e.id} className="grid gap-6 md:grid-cols-[minmax(0,0.85fr)_minmax(0,2fr)] md:gap-14">
          <div className="md:sticky md:top-24 md:self-start">
            <p className="text-small text-ink-3 tabular-nums">Etapa {i + 1} din {etape.length}</p>
            <h3 className="mt-2 text-h3">{e.titlu}</h3>
            <p className="mt-3 text-ink-2">{e.rezumat}</p>
          </div>
          <ul className="grid content-start gap-3">
            {e.joburi.map((j) => <JobRow key={j.id} job={j} />)}
          </ul>
        </li>
      ))}
    </ol>
  );
}
