"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Wordmark from "@/components/ui/Wordmark";
import CartButton from "@/components/cart/CartButton";
import { site } from "@/content/site";
import t from "@/content/i18n/es";

/** Header fijo: transparente arriba, cristal ahumado al hacer scroll. */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-(--z-header) transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled ? "border-b border-gold/10 bg-ink/70 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-md focus:bg-gold focus:px-4 focus:py-2 focus:text-ink"
      >
        {t.meta.skipToContent}
      </a>
      <div className="mx-auto flex h-16 max-w-site items-center justify-between px-gutter md:h-20">
        <Link href="/" aria-label={`${site.brand}, ${t.header.home}`}>
          <Wordmark />
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-2 sm:gap-6">
          <Link
            href="/#historia"
            className="hidden min-h-11 items-center text-sm text-foam-muted transition-colors hover:text-foam md:inline-flex"
          >
            {t.nav.story}
          </Link>
          <Link
            href="/#maridaje"
            className="hidden min-h-11 items-center text-sm text-foam-muted transition-colors hover:text-foam md:inline-flex"
          >
            {t.nav.pairing}
          </Link>
          <Link
            href="/#pedidos"
            className="hidden min-h-11 items-center text-sm text-foam-muted transition-colors hover:text-foam md:inline-flex"
          >
            {t.header.order}
          </Link>
          <Link
            href="/tienda"
            className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-gold transition-colors hover:text-gold-soft"
          >
            {t.header.shop}
          </Link>
          <CartButton />
        </nav>
      </div>
    </header>
  );
}
