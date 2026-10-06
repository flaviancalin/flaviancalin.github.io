import { eroriPeCampuri, formulare, type TipFormular } from "@/lib/schemas";

// Preview: doar validează și răspunde. Nu stochează și nu trimite date personale.
export async function POST(req: Request, ctx: RouteContext<"/api/formular/[tip]">) {
  const { tip } = await ctx.params;
  const schema = formulare[tip as TipFormular];
  if (!schema) return Response.json({ message: "Formular necunoscut." }, { status: 404 });

  const body = await req.json().catch(() => null);
  if (body && typeof body === "object" && "website" in body && body.website) {
    // Honeypot completat: răspundem „ok” fără să facem nimic.
    return Response.json({ ok: true, demo: true });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ message: "Verifică câmpurile marcate.", errors: eroriPeCampuri(parsed.error) }, { status: 422 });
  }
  return Response.json({ ok: true, demo: true });
}
