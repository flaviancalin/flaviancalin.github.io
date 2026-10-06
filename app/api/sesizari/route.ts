import { eroriPeCampuri, sesizareSchema } from "@/lib/schemas";

// Preview: validează sesizarea și întoarce un cod de referință. Nimic nu se salvează.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (body && typeof body === "object" && "website" in body && body.website) {
    return Response.json({ ok: true, demo: true, cod: "S4-DEMO" });
  }
  const parsed = sesizareSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ message: "Verifică pașii marcați.", errors: eroriPeCampuri(parsed.error) }, { status: 422 });
  }
  const zi = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const rand = crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase().slice(0, 4).padStart(4, "0");
  return Response.json({ ok: true, demo: true, cod: `S4-${zi}-${rand}` });
}
