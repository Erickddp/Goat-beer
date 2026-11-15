"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { useCart } from "@/lib/cart/store";
import { formatPrice, type Product } from "@/content/products";
import { CheckIcon, PlusIcon } from "@/components/ui/Icons";
import t from "@/content/i18n/es";

/** Cuántas botellas dibujar y dónde (x en %, escala, z) según la presentación. */
const LAYOUTS: Record<number, { x: number; s: number; z: number }[]> = {
  1: [{ x: 0, s: 1, z: 3 }],
  6: [
    { x: -26, s: 0.84, z: 1 },
    { x: 26, s: 0.84, z: 1 },
    { x: 0, s: 1, z: 3 },
  ],
  12: [
    { x: -42, s: 0.72, z: 0 },
    { x: 42, s: 0.72, z: 0 },
    { x: -22, s: 0.86, z: 1 },
    { x: 22, s: 0.86, z: 1 },
    { x: 0, s: 1, z: 3 },
  ],
};

const FINE_POINTER = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

export default function ProductCard({ product }: { product: Product }) {
  const root = useRef<HTMLElement>(null);
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);
  const available = product.status === "available";
  const price = formatPrice(product.priceCents, product.currency);
  const bottles = LAYOUTS[product.unitsPerPack] ?? LAYOUTS[1];

  useEffect(() => {
    if (!added) return;
    const id = window.setTimeout(() => setAdded(false), 1600);
    return () => window.clearTimeout(id);
  }, [added]);

  // Tilt + reflejo que siguen al cursor
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(FINE_POINTER, () => {
        const card = root.current;
        const tilt = card?.querySelector<HTMLElement>("[data-tilt]");
        if (!card || !tilt) return;
        const rx = gsap.quickTo(tilt, "rotationX", { duration: 0.6, ease: "power3.out" });
        const ry = gsap.quickTo(tilt, "rotationY", { duration: 0.6, ease: "power3.out" });

        const move = (e: PointerEvent) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          ry((px - 0.5) * 10);
          rx((0.5 - py) * 8);
          tilt.style.setProperty("--mx", `${px * 100}%`);
          tilt.style.setProperty("--my", `${py * 100}%`);
        };
        const leave = () => {
          rx(0);
          ry(0);
        };
        card.addEventListener("pointermove", move);
        card.addEventListener("pointerleave", leave);
        return () => {
          card.removeEventListener("pointermove", move);
          card.removeEventListener("pointerleave", leave);
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // "Giro" de tornamesa de la botella + brillo que recorre el vidrio
  const spin = () => {
    if (!root.current || !window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    const q = gsap.utils.selector(root.current);
    gsap.killTweensOf(q("[data-bottle], [data-shine]"));
    gsap
      .timeline()
      .to(q("[data-bottle]"), {
        keyframes: { rotationY: [0, 28, -22, 10, 0], ease: "sine.inOut" },
        y: -10,
        duration: 1.5,
        stagger: 0.06,
      })
      .fromTo(
        q("[data-shine]"),
        { backgroundPositionX: "180%" },
        { backgroundPositionX: "-80%", duration: 1.1, ease: "power2.inOut", stagger: 0.06 },
        0.15,
      );
  };
  const settle = () => {
    if (!root.current) return;
    gsap.to(root.current.querySelectorAll("[data-bottle]"), { y: 0, duration: 0.6, ease: "power3.out" });
  };

  return (
    <article
      ref={root}
      data-product-card
      onPointerEnter={spin}
      onPointerLeave={settle}
      className="group [perspective:1100px]"
      aria-labelledby={`${product.id}-name`}
    >
      <div
        data-tilt
        className="relative flex h-full flex-col overflow-hidden rounded-lg bg-stout shadow-gold-sm transition-shadow duration-300 ease-brew will-change-transform group-hover:shadow-gold-md"
      >
        {/* Reflejo */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(500px circle at var(--mx,50%) var(--my,30%), rgb(233 214 176 / 0.09), transparent 45%)",
          }}
        />

        {/* Vitrina */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[radial-gradient(ellipse_at_50%_75%,rgb(212_165_55/0.16),transparent_60%)]">
          {product.featured && (
            <span className="absolute left-4 top-4 z-20 rounded-pill bg-gold px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-ink">
              La consentida
            </span>
          )}
          <span className="absolute right-4 top-4 z-20 rounded-pill border border-foam/15 bg-ink/50 px-3 py-1 text-[0.7rem] uppercase tracking-[0.16em] text-foam-muted backdrop-blur-md">
            {available ? t.shop.bottles(product.unitsPerPack) : t.shop.comingSoon}
          </span>

          {/* Piso con reflejo */}
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-[14%] bg-gradient-to-t from-ink/80 to-transparent" />

          <div className="absolute inset-x-0 bottom-[6%] top-[12%] [perspective:700px]">
            {product.image ? (
              bottles.map((b, i) => (
                <div
                  key={i}
                  className="absolute bottom-0 left-1/2 h-full"
                  style={{
                    aspectRatio: `${product.image!.width} / ${product.image!.height}`,
                    transform: `translateX(calc(-50% + ${b.x}%)) scale(${b.s})`,
                    transformOrigin: "50% 100%",
                    zIndex: b.z,
                    filter: b.z < 3 ? "brightness(0.55)" : undefined,
                  }}
                >
                  <div data-bottle className="relative size-full [transform-style:preserve-3d]">
                    <Image
                      src={product.image!.src}
                      alt={i === bottles.length - 1 ? product.image!.alt : ""}
                      fill
                      sizes="(min-width: 1024px) 12vw, 30vw"
                      className="object-contain"
                    />
                    {/* Brillo enmascarado con la silueta de la botella */}
                    <div
                      data-shine
                      aria-hidden
                      // La máscara se aplica solo en hover: así el PNG no se descarga al cargar la página
                      className="absolute inset-0 mix-blend-screen [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] group-hover:[mask-image:url(/media/_derived/bottle-mask.png)]"
                      style={{
                        background:
                          "linear-gradient(100deg, transparent 40%, rgb(255 236 200 / 0.5) 50%, transparent 60%) 180% 0 / 250% 100% no-repeat",
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="grid size-full place-items-center">
                <div className="relative h-full" style={{ aspectRatio: "1 / 3" }}>
                  <Image
                    src="/media/_derived/bottle-cutout.png"
                    alt=""
                    fill
                    sizes="20vw"
                    className="object-contain opacity-40 blur-[2px] grayscale"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 grid place-items-center font-display text-7xl font-light italic text-gold/70"
                  >
                    ?
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="relative z-20 flex flex-1 flex-col p-6">
          <p className="text-eyebrow uppercase text-foam-faint">{product.style}</p>
          <h3 id={`${product.id}-name`} className="mt-2 font-display text-2xl font-light text-foam">
            {product.name}
          </h3>
          <p className="mt-2 text-foam-muted">{product.shortDescription}</p>

          {product.specs && (
            <p className="mt-4 font-display text-sm tabular-nums text-foam-faint">
              {product.specs.abv}% ABV · {product.specs.ibu} IBU · {product.specs.volumeMl} ml
            </p>
          )}

          <div className="mt-auto flex items-center justify-between gap-4 pt-6">
            <span className={`font-display tabular-nums ${price ? "text-2xl text-foam" : "text-sm text-foam-muted"}`}>
              {available ? (price ?? t.shop.priceTbd) : ""}
            </span>
            {available ? (
              <button
                data-magnetic
                type="button"
                onClick={() => {
                  add(product.id);
                  setAdded(true);
                }}
                aria-label={t.shop.addAria(product.name)}
                className={`inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-md px-5 font-semibold transition-[background-color,box-shadow,color] duration-200 ${
                  added
                    ? "bg-foam text-ink"
                    : "bg-gold text-ink hover:bg-gold-soft hover:shadow-gold-glow"
                }`}
              >
                {added ? <CheckIcon className="size-4" /> : <PlusIcon className="size-4" />}
                <span aria-live="polite">{added ? t.shop.added : t.shop.add}</span>
              </button>
            ) : (
              <span className="inline-flex min-h-12 items-center rounded-md border border-dashed border-gold/40 px-5 text-sm text-foam-muted">
                {t.shop.comingSoon}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
