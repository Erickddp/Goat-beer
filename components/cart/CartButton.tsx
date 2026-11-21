"use client";

import { useCart, useCartTotals } from "@/lib/cart/store";
import { CartIcon } from "@/components/ui/Icons";
import t from "@/content/i18n/es";

export default function CartButton() {
  const bump = useCart((s) => s.bump);
  const open = useCart((s) => s.open);
  const count = useCartTotals().itemCount;

  return (
    <button
      data-magnetic
      type="button"
      onClick={open}
      aria-label={t.cart.open(count)}
      className="relative grid size-11 cursor-pointer place-items-center rounded-full border border-gold/30 text-foam transition-colors duration-200 hover:border-gold hover:text-gold-soft"
    >
      <CartIcon className="size-5" />
      {count > 0 && (
        <span
          key={bump}
          aria-hidden
          className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-pill bg-gold px-1 text-[0.7rem] font-bold tabular-nums leading-5 text-ink motion-safe:animate-[cart-bump_0.45s_var(--ease-brew)]"
        >
          {count}
        </span>
      )}
    </button>
  );
}
