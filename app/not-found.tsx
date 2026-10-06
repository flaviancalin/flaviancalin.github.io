import Link from "next/link";
import { Page } from "@/components/page";

export default function NotFound() {
  return (
    <Page>
      <div className="container-x py-24 md:py-36">
        <p className="eyebrow">Eroare 404</p>
        <h1 className="mt-3 text-h2">Pagina nu există.</h1>
        <p className="mt-4 text-lead text-ink-2">Poate a fost mutată. Mergi la pagina principală sau semnalează o problemă din cartier.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn btn-primary">Pagina principală</Link>
          <Link href="/spune-mi-problema" className="btn btn-secondary">Spune-mi problema ta</Link>
        </div>
      </div>
    </Page>
  );
}
