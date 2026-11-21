"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart, useCartTotals } from "@/lib/cart/store";
import { findProduct, useCatalog } from "@/lib/catalog/store";
import { maxQtyFor } from "@/lib/cart/logic";
import { formatPrice } from "@/content/products";
import Dialog from "@/components/ui/Dialog";
import { CloseIcon, MinusIcon, PlusIcon, TrashIcon, ArrowIcon } from "@/components/ui/Icons";
import t from "@/content/i18n/es";

export default function CartDrawer() {
  const { lines, isOpen, close, setQuantity, remove, checkout, notice, dismissNotice, checkoutError } = useCart();
  const products = useCatalog((s) => s.products);
  const [pending, setPending] = useState(false);
  const totals = useCartTotals();
  const subtotal = formatPrice(totals.subtotalCents);

  const onCheckout = async () => {
    setPending(true);
    try {
      await checkout();
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={close} labelledBy="cart-title" variant="drawer">
      <div className="flex h-full flex-col border-l border-gold/15 bg-stout/95 backdrop-blur-xl">
        <header className="flex items-center justify-between border-b border-gold/10 px-6 py-5">
          <h2 id="cart-title" className="font-display text-2xl font-light">
            {t.cart.title}
            {totals.itemCount > 0 && (
              <span className="ml-3 align-middle font-sans text-sm tabular-nums text-foam-faint">
                ({totals.itemCount})
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label={t.cart.close}
            className="grid size-11 cursor-pointer place-items-center rounded-full text-foam-muted transition-colors duration-200 hover:bg-foam/5 hover:text-foam"
          >
            <CloseIcon className="size-5" />
          </button>
        </header>

        {notice && (
          <div role="status" className="flex items-start gap-3 border-b border-gold/10 bg-ruby/20 px-6 py-4 text-sm text-foam">
            <p className="flex-1">
              {notice.removed.length > 0 && <span className="block">{t.cart.noticeRemoved(notice.removed)}</span>}
              {notice.reduced.length > 0 && <span className="block">{t.cart.noticeReduced(notice.reduced)}</span>}
            </p>
            <button
              type="button"
              onClick={dismissNotice}
              aria-label={t.cart.noticeDismiss}
              className="-mr-2 -mt-2 grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-foam-muted transition-colors hover:text-foam"
            >
              <CloseIcon className="size-4" />
            </button>
          </div>
        )}

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
            <p className="max-w-[18rem] font-display text-2xl font-light italic text-foam-muted">{t.cart.empty}</p>
            <Link
              href="/tienda"
              onClick={close}
              className="inline-flex min-h-12 items-center gap-2 rounded-md border border-gold/60 px-6 text-foam transition-colors duration-200 hover:border-gold hover:text-gold-soft"
            >
              {t.cart.emptyCta}
              <ArrowIcon className="size-4" />
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-gold/10 overflow-y-auto overscroll-contain px-6">
              {lines.map((line) => {
                const product = findProduct(products, line.productId);
                if (!product) return null;
                const lineTotal = formatPrice(
                  product.priceCents === null ? null : product.priceCents * line.quantity,
                );
                return (
                  <li key={line.productId} className="flex gap-4 py-5">
                    <div className="relative h-24 w-14 shrink-0 overflow-hidden rounded-sm bg-ink">
                      {product.image && (
                        <Image
                          src={product.image.src}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-contain"
                        />
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-display text-lg leading-tight">{product.name}</p>
                          <p className="mt-1 text-sm text-foam-faint">{t.shop.bottles(product.unitsPerPack)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(product.id)}
                          aria-label={`${t.cart.remove} ${product.name}`}
                          className="-mr-2 -mt-2 grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-foam-faint transition-colors duration-200 hover:text-ruby-bright"
                        >
                          <TrashIcon className="size-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div
                          role="group"
                          aria-label={`${t.cart.quantity}: ${product.name}`}
                          className="flex items-center rounded-pill border border-foam/15"
                        >
                          <button
                            type="button"
                            onClick={() => setQuantity(product.id, line.quantity - 1)}
                            aria-label={t.cart.decrease}
                            className="grid size-10 cursor-pointer place-items-center rounded-full text-foam-muted transition-colors hover:text-gold"
                          >
                            <MinusIcon className="size-4" />
                          </button>
                          <span aria-live="polite" className="w-8 text-center font-display tabular-nums">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQuantity(product.id, line.quantity + 1)}
                            disabled={line.quantity >= maxQtyFor(product)}
                            aria-label={line.quantity >= maxQtyFor(product) ? t.cart.maxReached : t.cart.increase}
                            className="grid size-10 cursor-pointer place-items-center rounded-full text-foam-muted transition-colors hover:text-gold disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:text-foam-muted"
                          >
                            <PlusIcon className="size-4" />
                          </button>
                        </div>
                        <span className="font-display tabular-nums text-foam-muted">
                          {lineTotal ?? t.shop.priceTbd}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <footer className="border-t border-gold/10 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5">
              <div className="flex items-baseline justify-between">
                <span className="text-eyebrow uppercase text-foam-faint">{t.cart.subtotal}</span>
                <span className="font-display text-2xl tabular-nums text-foam">
                  {subtotal ?? <span className="text-lg text-foam-muted">{t.cart.subtotalTbd}</span>}
                </span>
              </div>
              <p className="mt-2 text-sm text-foam-faint">{t.cart.taxesNote}</p>
              {checkoutError && (
                <p role="alert" className="mt-3 rounded-md bg-ruby/25 px-4 py-3 text-sm text-foam">
                  {checkoutError}
                </p>
              )}
              <button
                data-magnetic
                type="button"
                onClick={onCheckout}
                disabled={pending}
                className="mt-5 flex min-h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-gold px-6 font-semibold text-ink transition-[background-color,box-shadow] duration-200 hover:bg-gold-soft hover:shadow-gold-glow disabled:cursor-wait disabled:opacity-70"
              >
                {pending ? t.cart.checkingOut : t.cart.checkout}
              </button>
            </footer>
          </>
        )}
      </div>
    </Dialog>
  );
}
