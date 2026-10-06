"use client";

import { useId, useState } from "react";
import type { Etapa, Job } from "@/lib/content";
import { Icon } from "./icons";
import { OrTodo, Todo } from "./todo";

function JobCard({ job }: { job: Job }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const titlu = [job.rol, job.organizatie].filter(Boolean).join(", ");
  return (
    <li className="card overflow-hidden">
      <h4>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className="flex min-h-16 w-full items-center justify-between gap-4 px-6 py-4 text-left hover:bg-canvas-2/60"
        >
          <span>
            <span className="block font-semibold">{titlu || <Todo>[ROL / INSTITUȚIE]</Todo>}</span>
            <span className="mt-0.5 block text-small text-ink-3">
              {!job.rol && <><Todo>[ROL]</Todo> · </>}
              {!job.organizatie && <><Todo>[INSTITUȚIE]</Todo> · </>}
              <OrTodo value={job.perioada} label="[PERIOADA]" />
            </span>
          </span>
          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full bg-canvas-2 text-ink-2 transition-transform duration-300 ${open ? "rotate-45" : ""}`}>
            <Icon name="plus" className="h-5 w-5" />
          </span>
        </button>
      </h4>
      {/* Expand fluid: grid-rows 0fr → 1fr, declanșat doar de utilizator */}
      <div id={id} className={`grid transition-[grid-template-rows] duration-300 ease-[var(--ease-out-soft)] ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`} inert={!open}>
        <div className="overflow-hidden">
          <div className="grid gap-5 border-t border-black/5 px-6 py-5 md:grid-cols-2">
            <div>
              <p className="text-small font-semibold text-ink-3">Responsabilități</p>
              <ul className="mt-2 grid list-disc gap-1.5 pl-5">
                {job.responsabilitati.length ? job.responsabilitati.slice(0, 3).map((r) => <li key={r}>{r}</li>) : <li><Todo>[DIN TEXTUL ORIGINAL, MAX. 3]</Todo></li>}
              </ul>
            </div>
            <div>
              <p className="text-small font-semibold text-ink-3">Realizări</p>
              <ul className="mt-2 grid list-disc gap-1.5 pl-5">
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
    <ol className="relative grid gap-14 md:gap-20">
      {etape.map((e, i) => (
        <li key={e.id} className="reveal grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-12">
          <div className="md:sticky md:top-24 md:self-start">
            <p className="text-small font-semibold text-brand tabular-nums">Etapa {i + 1} din {etape.length}</p>
            <h3 className="mt-2 text-h3">{e.titlu}</h3>
            <p className="mt-3 text-ink-2">{e.rezumat}</p>
          </div>
          <ul className="grid gap-3">
            {e.joburi.map((j) => <JobCard key={j.id} job={j} />)}
          </ul>
        </li>
      ))}
    </ol>
  );
}
