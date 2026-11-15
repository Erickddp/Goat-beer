"use client";

import { useCart } from "@/lib/cart/store";
import { whatsappUrl } from "@/content/site";
import { getProduct } from "@/content/products";
import Dialog from "@/components/ui/Dialog";
import { CloseIcon, WhatsAppIcon } from "@/components/ui/Icons";
import t from "@/content/i18n/es";

/** Modal "Pagos en línea muy pronto". Ofrece mandar el carrito por WhatsApp. */
export default function CheckoutModal() {
  const { checkoutOpen, closeCheckout, lines } = useCart();

  const orderText = [
    "¡Hola! Quiero pedir:",
    ...lines.map((l) => `• ${l.quantity} × ${getProduct(l.productId)?.name ?? l.productId}`),
  ].join("\n");
  const wa = whatsappUrl(orderText);

  return (
    <Dialog open={checkoutOpen} onClose={closeCheckout} labelledBy="checkout-title" variant="modal">
      <div className="relative overflow-hidden rounded-xl bg-stout p-8 shadow-gold-lg sm:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-gold/15 blur-3xl"
        />
        <button
          type="button"
          onClick={closeCheckout}
          aria-label={t.cart.checkoutSoonClose}
          className="absolute right-3 top-3 grid size-11 cursor-pointer place-items-center rounded-full text-foam-muted transition-colors hover:bg-foam/5 hover:text-foam"
        >
          <CloseIcon className="size-5" />
        </button>

        <p className="text-eyebrow uppercase text-gold">Checkout</p>
        <h2 id="checkout-title" className="mt-3 font-display text-display-md font-light text-balance">
          {t.cart.checkoutSoonTitle}
        </h2>
        <p className="mt-4 text-foam-muted">{t.cart.checkoutSoonBody}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {wa ? (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-md bg-gold px-6 font-semibold text-ink transition-[background-color,box-shadow] duration-200 hover:bg-gold-soft hover:shadow-gold-glow"
            >
              <WhatsAppIcon className="size-5" />
              {t.cart.checkoutSoonCta}
            </a>
          ) : (
            <p className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-md border border-dashed border-gold/40 px-4 text-center text-sm text-foam-muted">
              <WhatsAppIcon className="size-5 shrink-0 text-gold" />
              {t.order.whatsappPending}
            </p>
          )}
          <button
            type="button"
            onClick={closeCheckout}
            className="min-h-12 cursor-pointer rounded-md border border-foam/20 px-6 text-foam transition-colors duration-200 hover:border-gold/60"
          >
            {t.cart.checkoutSoonClose}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
