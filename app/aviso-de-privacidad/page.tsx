import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import t from "@/content/i18n/es";

export const metadata: Metadata = {
  title: `${t.privacy.title} · ${site.brand}`,
  robots: { index: false },
};

// TODO: reemplazar con el aviso de privacidad real (LFPDPPP) antes de producción.
export default function PrivacyPage() {
  return (
    <main id="contenido" className="flex-1">
      <section className="mx-auto max-w-3xl px-gutter pb-section pt-36 md:pt-44">
        <h1 className="font-display text-display-md font-light">{t.privacy.title}</h1>
        <p className="mt-8 text-lg text-foam-muted">{t.privacy.body}</p>
        <Link
          href="/"
          className="mt-10 inline-flex min-h-12 items-center rounded-md border border-gold/60 px-6 text-foam transition-colors hover:border-gold hover:text-gold-soft"
        >
          {t.privacy.back}
        </Link>
      </section>
    </main>
  );
}
