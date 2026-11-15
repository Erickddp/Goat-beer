"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart/store";
import CartDrawer from "./CartDrawer";
import CheckoutModal from "./CheckoutModal";

/** Monta el drawer y el modal una sola vez y rehidrata el carrito desde localStorage. */
export default function CartRoot() {
  useEffect(() => {
    void useCart.persist.rehydrate();
  }, []);

  return (
    <>
      <CartDrawer />
      <CheckoutModal />
    </>
  );
}
