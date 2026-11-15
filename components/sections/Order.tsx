"use client";

import { useSectionMotion } from "@/lib/useSectionMotion";
import { useRef } from "react";
import Image from "next/image";
import { gsap, SplitText } from "@/lib/gsap";
import SocialLinks from "@/components/ui/SocialLinks";
import { PinIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { site, whatsappUrl } from "@/content/site";
import t from "@/content/i18n/es";

/**
 * 10 · Dónde comprar / Pedidos
 * Entrada: "salpicadura" — la foto del splash entra girando y escalando con el
 * scroll, como si la botella cayera en cuadro; el titular se escribe por letras.
 */
export default function Order() {
  const root = useRef<HTMLElement>(null);
  const wa = whatsappUrl();

  useSectionMotion(root, (q) => {
        gsap.fromTo(
          q("[data-splash]"),
          { scale: 1.35, rotation: -8 },
          {
            scale: 1,
            rotation: 0,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "center center", scrub: true },
          },
        );
        SplitText.create(q("[data-order-title]"), {
          type: "chars,words",
          mask: "chars",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.chars, {
              yPercent: 100,
              duration: 0.9,
              stagger: 0.025,
              ease: "expo.out",
              scrollTrigger: { trigger: self.elements[0], start: "top 85%" },
            }),
        });
        gsap.from(q("[data-order-fade]"), {
          opacity: 0,
          y: 24,
          stagger: 0.1,
          scrollTrigger: { trigger: q("[data-order-title]")[0], start: "top 80%" },
        });
  });

  const ctaCls =
    "inline-flex min-h-14 items-center justify-center gap-3 rounded-md px-8 text-lg font-semibold";

  return (
    <section ref={root} id="pedidos" aria-labelledby="order-title" className="cv-auto relative overflow-hidden py-section">
      <div aria-hidden className="absolute inset-0 opacity-45">
        <div data-splash className="relative size-full">
          <Image src="/media/splash.png" alt="" fill sizes="100vw" className="object-cover" />
        </div>
      </div>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-ink via-ink/70 to-ink" />

      <div className="relative mx-auto flex max-w-site flex-col items-center px-gutter text-center">
        <p data-order-fade className="mb-5 flex items-center gap-3 text-eyebrow uppercase text-gold">
          <span className="font-display tabular-nums">10</span>
          <span aria-hidden className="h-px w-10 bg-gold-deep" />
          {t.order.eyebrow}
        </p>
        <h2
          id="order-title"
          data-order-title
          className="max-w-4xl font-display text-display-lg font-light text-balance text-foam"
        >
          {t.order.title}
        </h2>
        <p data-order-fade className="mt-6 max-w-xl text-lg text-foam-muted">
          {t.order.body}
        </p>

        <div data-order-fade className="mt-10">
          {wa ? (
            <a
              data-magnetic
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className={`${ctaCls} bg-gold text-ink shadow-gold-glow transition-[background-color] duration-200 hover:bg-gold-soft`}
            >
              <WhatsAppIcon className="size-6" />
              {t.order.whatsappCta}
            </a>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <span aria-disabled className={`${ctaCls} cursor-not-allowed bg-gold/30 text-foam`}>
                <WhatsAppIcon className="size-6" />
                {t.order.whatsappCta}
              </span>
              <span className="text-sm text-foam-faint">{t.order.whatsappPending}</span>
            </div>
          )}
        </div>

        <div data-order-fade className="mt-16 grid w-full max-w-3xl gap-4 text-left sm:grid-cols-2">
          <div className="rounded-lg border border-gold/15 bg-stout/70 p-6 backdrop-blur-md">
            <p className="flex items-center gap-2 text-eyebrow uppercase text-foam-faint">
              <PinIcon className="size-4 text-gold" />
              {t.order.deliveryZone}
            </p>
            <p className="mt-3 font-display text-2xl text-foam">{site.delivery.zones.join(" · ")}</p>
            <p className="mt-2 text-sm text-foam-muted">{site.delivery.notes}</p>
          </div>
          <div className="rounded-lg border border-gold/15 bg-stout/70 p-6 backdrop-blur-md">
            <p className="text-eyebrow uppercase text-foam-faint">{t.order.follow}</p>
            <p className="mt-3 font-display text-2xl text-foam">
              {site.social.map((s) => s.label).join(" · ")}
            </p>
            <SocialLinks className="mt-4" />
          </div>
        </div>
      </div>
    </section>
  );
}
