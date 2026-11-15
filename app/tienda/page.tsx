import type { Metadata } from "next";
import ProductGrid from "@/components/shop/ProductGrid";
import Order from "@/components/sections/Order";
import { BarrelIcon, SnowIcon, TruckIcon } from "@/components/ui/Icons";
import { site } from "@/content/site";
import t from "@/content/i18n/es";

export const metadata: Metadata = {
  title: `${t.shop.eyebrow} · ${site.brand}`,
  description: t.shop.pageIntro,
};

const PERK_ICONS = [TruckIcon, SnowIcon, BarrelIcon];

export default function TiendaPage() {
  return (
    <main id="contenido" className="flex-1">
      <section aria-labelledby="tienda-title" className="relative overflow-hidden pb-section pt-32 md:pt-44">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 size-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ruby/40 blur-[140px]"
        />
        <div className="relative mx-auto max-w-site px-gutter">
          <p className="mb-5 flex items-center gap-3 text-eyebrow uppercase text-gold">
            <span aria-hidden className="h-px w-10 bg-gold-deep" />
            {t.shop.eyebrow}
          </p>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h1 id="tienda-title" className="max-w-3xl font-display text-display-lg font-light text-balance">
              {t.shop.pageTitle}
            </h1>
            <p className="max-w-md text-lg text-foam-muted">{t.shop.pageIntro}</p>
          </div>

          <ul className="mt-12 grid gap-3 sm:grid-cols-3">
            {t.shop.perks.map((perk, i) => {
              const Icon = PERK_ICONS[i];
              return (
                <li key={perk.title} className="flex items-center gap-4 rounded-lg border border-gold/10 bg-stout/50 p-5">
                  <Icon className="size-7 shrink-0 text-gold" />
                  <div>
                    <p className="font-display text-lg text-foam">{perk.title}</p>
                    <p className="text-sm text-foam-muted">{perk.body}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-14">
            <h2 className="sr-only">Productos</h2>
            <ProductGrid />
          </div>
        </div>
      </section>

      <Order />
    </main>
  );
}
