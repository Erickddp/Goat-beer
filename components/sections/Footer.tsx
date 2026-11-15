import Link from "next/link";
import Wordmark from "@/components/ui/Wordmark";
import SocialLinks from "@/components/ui/SocialLinks";
import { site } from "@/content/site";
import t from "@/content/i18n/es";

const NAV = [
  { href: "/#historia", label: t.nav.story },
  { href: "/#ficha", label: t.nav.specs },
  { href: "/#maridaje", label: t.nav.pairing },
  { href: "/tienda", label: t.nav.shop },
  { href: "/#pedidos", label: t.nav.order },
];

/** 11 · Footer. Leyendas legales siempre visibles. */
export default function Footer() {
  return (
    <footer className="cv-auto relative border-t border-gold/15 bg-ink">
      {/* Leyenda principal */}
      <div className="border-b border-gold/10">
        <div className="mx-auto flex max-w-site flex-col items-center gap-3 px-gutter py-12 text-center md:flex-row md:justify-between md:text-left">
          <p className="font-display text-display-md font-light italic text-gold">
            {site.legal.responsibleDrinking}
          </p>
          <p className="text-lg font-semibold uppercase tracking-[0.12em] text-foam">
            {site.legal.underageNotice}
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-site gap-12 px-gutter py-16 sm:grid-cols-2 lg:grid-cols-12">
        <div className="sm:col-span-2 lg:col-span-5">
          <Link href="/" aria-label={`${site.brand}, ${t.header.home}`} className="inline-block">
            <Wordmark size="lg" />
          </Link>
          <p className="mt-6 max-w-xs text-foam-muted">{t.footer.tagline}</p>
        </div>

        <nav aria-label={t.footer.navTitle} className="lg:col-span-4">
          <p className="text-eyebrow uppercase text-foam-faint">{t.footer.navTitle}</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="inline-flex min-h-11 items-center text-foam transition-colors duration-200 hover:text-gold-soft"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <p className="text-eyebrow uppercase text-foam-faint">{t.footer.socialTitle}</p>
          <SocialLinks className="mt-4" />
        </div>
      </div>

      <div className="border-t border-gold/10">
        <div className="mx-auto flex max-w-site flex-col gap-3 px-gutter py-6 text-sm text-foam-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {site.legal.copyrightYear} {site.brand}. {t.footer.rights}
          </p>
          <Link
            href={site.legal.privacyPath}
            className="inline-flex min-h-11 items-center underline-offset-4 transition-colors hover:text-foam hover:underline"
          >
            {t.footer.privacy}
          </Link>
        </div>
      </div>
    </footer>
  );
}
