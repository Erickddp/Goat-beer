"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useCart } from "@/lib/cart/store";
import { useDeferredMount } from "@/lib/useDeferredMount";

// Drawer y modal no se ven al cargar: se descargan después del primer pintado
// (o con la primera interacción), fuera de la ruta crítica del LCP.
const CartDrawer = dynamic(() => import("./CartDrawer"), { ssr: false });
const CheckoutModal = dynamic(() => import("./CheckoutModal"), { ssr: false });

/** Rehidrata el carrito desde localStorage y monta el drawer y el modal una sola vez. */
export default function CartRoot() {
  const ready = useDeferredMount();
  // Si alguien abre el carrito antes de que termine la carga diferida, se monta de inmediato.
  const wanted = useCart((s) => s.isOpen || s.checkoutOpen);

  useEffect(() => {
    void useCart.persist.rehydrate();
  }, []);

  if (!ready && !wanted) return null;
  return (
    <>
      <CartDrawer />
      <CheckoutModal />
    </>
  );
}
