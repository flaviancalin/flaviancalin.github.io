"use client";

import dynamic from "next/dynamic";
import { useId, useMemo, useState } from "react";
import { CARTIERE, CATEGORII, STATUSURI } from "@/lib/content";
import type { SesizareDemo } from "@/lib/demo-data";

const PointsMap = dynamic(() => import("../report/map-picker").then((m) => m.PointsMap), {
  ssr: false,
  loading: () => <div className="grid h-[420px] place-items-center rounded-[var(--radius-card)] bg-canvas-3 text-ink-3">Se încarcă harta…</div>,
});

const statusCls: Record<string, string> = {
  "Nouă": "bg-brand-soft text-brand-strong",
  "În analiză": "bg-todo text-todo-ink",
  "Trimisă la instituție": "bg-canvas-3 text-ink",
  "Rezolvată": "bg-[#e3f4e8] text-ok",
};
const statusColor: Record<string, string> = { "Nouă": "#1747b0", "În analiză": "#b7791f", "Trimisă la instituție": "#6e6e73", "Rezolvată": "#1f7a3a" };
const catTitlu = Object.fromEntries(CATEGORII.map((c) => [c.id, c.titlu]));
const fmt = new Intl.DateTimeFormat("ro-RO", { day: "numeric", month: "short" });

export function AdminDashboard({ data }: { data: SesizareDemo[] }) {
  const id = useId();
  const [cat, setCat] = useState("");
  const [cart, setCart] = useState("");
  const [st, setSt] = useState("");

  const rows = useMemo(() => data.filter((d) => (!cat || d.categorie === cat) && (!cart || d.cartier === cart) && (!st || d.status === st)), [data, cat, cart, st]);
  const perStatus = useMemo(() => STATUSURI.map((s) => ({ s, n: rows.filter((r) => r.status === s).length })), [rows]);
  const perCat = useMemo(() => CATEGORII.map((c) => ({ c: c.titlu, n: rows.filter((r) => r.categorie === c.id).length })).filter((x) => x.n).sort((a, b) => b.n - a.n), [rows]);
  const max = Math.max(1, ...perCat.map((x) => x.n));
  const points = useMemo(() => rows.map((r) => ({ lat: r.lat, lng: r.lng, color: statusColor[r.status], title: `${r.cod}: ${r.titlu} (${r.status})` })), [rows]);

  return (
    <div className="grid gap-8">
      {/* Filtre */}
      <div className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
        <div>
          <label htmlFor={`${id}-cat`} className="label text-small">Categorie</label>
          <select id={`${id}-cat`} className="field" value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="">Toate</option>
            {CATEGORII.map((c) => <option key={c.id} value={c.id}>{c.titlu}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-cart`} className="label text-small">Cartier</label>
          <select id={`${id}-cart`} className="field" value={cart} onChange={(e) => setCart(e.target.value)}>
            <option value="">Toate</option>
            {CARTIERE.filter((c) => !c.startsWith("Altul")).map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-st`} className="label text-small">Status</label>
          <select id={`${id}-st`} className="field" value={st} onChange={(e) => setSt(e.target.value)}>
            <option value="">Toate</option>
            {STATUSURI.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <button type="button" className="btn btn-secondary" onClick={() => { setCat(""); setCart(""); setSt(""); }} disabled={!cat && !cart && !st}>Resetează filtrele</button>
      </div>

      {/* Statistici */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="card p-5">
          <p className="text-small text-ink-3">Total</p>
          <p className="mt-1 text-[2.25rem] font-semibold leading-none tabular-nums">{rows.length}</p>
        </div>
        {perStatus.map(({ s, n }) => (
          <div key={s} className="card p-5">
            <p className="flex items-center gap-2 text-small text-ink-3"><span className="h-2.5 w-2.5 rounded-full" style={{ background: statusColor[s] }} aria-hidden="true" />{s}</p>
            <p className="mt-1 text-[2.25rem] font-semibold leading-none tabular-nums">{n}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section aria-labelledby={`${id}-map`} className="card p-5">
          <h2 id={`${id}-map`} className="mb-4 font-semibold">Harta sesizărilor</h2>
          <PointsMap points={points} label={`Hartă cu ${rows.length} sesizări demo, colorate după status`} />
        </section>
        <section aria-labelledby={`${id}-cats`} className="card p-5">
          <h2 id={`${id}-cats`} className="mb-4 font-semibold">Pe categorii</h2>
          <ul className="grid gap-3">
            {perCat.map(({ c, n }) => (
              <li key={c} className="grid grid-cols-[minmax(0,9rem)_1fr_2.5rem] items-center gap-3 text-small">
                <span className="truncate">{c}</span>
                <span className="h-2.5 overflow-hidden rounded-full bg-canvas-2"><span className="block h-full rounded-full bg-brand" style={{ width: `${(n / max) * 100}%` }} /></span>
                <span className="text-right tabular-nums">{n}</span>
              </li>
            ))}
            {!perCat.length && <li className="text-ink-3">Nicio sesizare pentru filtrele alese.</li>}
          </ul>
        </section>
      </div>

      {/* Tabel */}
      <section aria-labelledby={`${id}-tbl`} className="card overflow-hidden">
        <h2 id={`${id}-tbl`} className="p-5 font-semibold">Lista sesizărilor <span className="font-normal text-ink-3">({rows.length})</span></h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] text-left text-small">
            <thead className="border-y border-line bg-canvas-2 text-ink-3">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">Cod</th>
                <th scope="col" className="px-5 py-3 font-semibold">Data</th>
                <th scope="col" className="px-5 py-3 font-semibold">Problema</th>
                <th scope="col" className="px-5 py-3 font-semibold">Categorie</th>
                <th scope="col" className="px-5 py-3 font-semibold">Cartier</th>
                <th scope="col" className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.cod} className="border-b border-line last:border-0">
                  <td className="whitespace-nowrap px-5 py-3 font-mono tabular-nums">{r.cod}</td>
                  <td className="whitespace-nowrap px-5 py-3 tabular-nums">{fmt.format(new Date(r.data))}</td>
                  <td className="px-5 py-3">{r.titlu}</td>
                  <td className="px-5 py-3">{catTitlu[r.categorie]}</td>
                  <td className="px-5 py-3">{r.cartier}</td>
                  <td className="px-5 py-3"><span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 font-semibold ${statusCls[r.status]}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
