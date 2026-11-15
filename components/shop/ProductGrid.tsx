"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useSectionMotion } from "@/lib/useSectionMotion";
import { products as allProducts, type Product } from "@/content/products";
import ProductCard from "./ProductCard";

/**
 * Rejilla de productos. Entrada "vitrina": cada tarjeta se descubre de abajo
 * hacia arriba (clip-path) mientras sube, en lotes según van entrando.
 */
export default function ProductGrid({ products = allProducts }: { products?: Product[] }) {
  const root = useRef<HTMLUListElement>(null);

  useSectionMotion(root, (q) => {
        const items = q("[data-grid-item]");
        gsap.set(items, { clipPath: "inset(100% 0% 0% 0%)", y: 80 });
        ScrollTrigger.batch(items, {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              clipPath: "inset(0% 0% 0% 0%)",
              y: 0,
              duration: 1.3,
              ease: "expo.out",
              stagger: 0.1,
              // Quitar el clip al final: el tilt 3D necesita salir del recorte
              onComplete: () => gsap.set(batch, { clearProps: "clipPath" }),
            }),
        });
  });

  return (
    <ul ref={root} className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {products.map((p) => (
        <li key={p.id} data-grid-item>
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  );
}
