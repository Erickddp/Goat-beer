import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import ProductGrid from "@/components/shop/ProductGrid";
import { ArrowIcon } from "@/components/ui/Icons";
import t from "@/content/i18n/es";

/** 08 · Tienda (preview en la home). La página completa vive en /tienda. */
export default function Shop() {
  return (
    <section id="tienda" aria-labelledby="shop-title" className="cv-auto relative py-section">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"
      />
      <div className="mx-auto max-w-site px-gutter">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader index="08" eyebrow={t.shop.eyebrow} title={t.shop.title} id="shop-title" />
          <p className="max-w-sm text-lg text-foam-muted">{t.shop.intro}</p>
        </div>

        <div className="mt-14 lg:mt-20">
          <ProductGrid />
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            data-magnetic
            href="/tienda"
            className="group inline-flex min-h-12 items-center gap-3 rounded-md border border-gold/60 px-7 text-foam transition-colors duration-200 hover:border-gold hover:text-gold-soft"
          >
            {t.shop.viewAll}
            <ArrowIcon className="size-4 transition-transform duration-300 ease-brew group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
