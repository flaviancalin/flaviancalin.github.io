"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { CENTRU_S4 } from "./center";

const pinIcon = L.divIcon({
  className: "",
  html: '<span class="map-pin" aria-hidden="true"></span>',
  iconSize: [32, 42],
  iconAnchor: [16, 40],
});

/** Hartă OpenStreetMap (fără cheie API) cu pin mutabil prin tragere sau click/tap pe hartă. */
export default function MapPicker({
  value,
  onChange,
  label,
}: {
  value: [number, number];
  onChange: (v: [number, number]) => void;
  label: string;
}) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const marker = useRef<L.Marker | null>(null);
  const cb = useRef(onChange);
  useEffect(() => { cb.current = onChange; }, [onChange]);

  useEffect(() => {
    if (!el.current || map.current) return;
    const m = L.map(el.current, { center: value, zoom: 14, scrollWheelZoom: false, attributionControl: true });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(m);
    const mk = L.marker(value, { draggable: true, icon: pinIcon, keyboard: true, title: "Pinul sesizării", alt: "Pinul sesizării" }).addTo(m);
    mk.on("dragend", () => { const p = mk.getLatLng(); cb.current([p.lat, p.lng]); });
    m.on("click", (e: L.LeafletMouseEvent) => { mk.setLatLng(e.latlng); cb.current([e.latlng.lat, e.latlng.lng]); });
    map.current = m;
    marker.current = mk;
    return () => { m.remove(); map.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const mk = marker.current;
    if (!mk) return;
    const cur = mk.getLatLng();
    if (cur.lat !== value[0] || cur.lng !== value[1]) {
      mk.setLatLng(value);
      map.current?.panTo(value);
    }
  }, [value]);

  return (
    <div className="grid gap-2">
      <div ref={el} role="application" aria-label={label} className="h-[min(56vh,420px)] w-full overflow-hidden rounded-[var(--radius-card)] bg-canvas-3" />
      <button
        type="button"
        className="btn btn-quiet justify-self-start !min-h-11 text-small"
        onClick={() => { const c = map.current?.getCenter(); if (c) cb.current([c.lat, c.lng]); }}
      >
        Mută pinul în centrul hărții
      </button>
    </div>
  );
}

/** Hartă doar pentru afișare, cu puncte colorate (folosită în /admin/sesizari). */
export function PointsMap({ points, label }: { points: { lat: number; lng: number; color: string; title: string }[]; label: string }) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!el.current || map.current) return;
    const m = L.map(el.current, { center: CENTRU_S4, zoom: 13, scrollWheelZoom: false });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(m);
    layer.current = L.layerGroup().addTo(m);
    map.current = m;
    return () => { m.remove(); map.current = null; };
  }, []);

  useEffect(() => {
    const g = layer.current;
    if (!g) return;
    g.clearLayers();
    for (const p of points) {
      L.circleMarker([p.lat, p.lng], { radius: 7, color: "#fff", weight: 2, fillColor: p.color, fillOpacity: 0.95 }).bindTooltip(p.title).addTo(g);
    }
  }, [points]);

  return <div ref={el} role="img" aria-label={label} className="h-[420px] w-full overflow-hidden rounded-[var(--radius-card)] bg-canvas-3" />;
}
