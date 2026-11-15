import Image from "next/image";
import { site } from "@/content/site";

/**
 * Wordmark provisional: cabra (extraída de la etiqueta) en óvalo dorado + nombre.
 * TODO: reemplazar por public/media/logo.svg cuando llegue (ver ASSETS_PENDIENTES.md).
 */
export default function Wordmark({ size = "md" }: { size?: "md" | "lg" }) {
  const lg = size === "lg";
  return (
    <span className="inline-flex items-center gap-3">
      <span
        aria-hidden
        className={`relative grid shrink-0 place-items-center rounded-[50%] border border-gold/80 bg-gold/10 ${
          lg ? "h-16 w-13" : "h-10 w-8"
        }`}
      >
        <Image
          src="/media/_derived/goat-mark.png"
          alt=""
          width={lg ? 34 : 22}
          height={lg ? 34 : 22}
          className="object-contain"
        />
      </span>
      <span aria-hidden className="flex flex-col leading-none">
        <span className={`whitespace-nowrap font-display font-light tracking-wide text-foam ${lg ? "text-3xl" : "text-lg"}`}>
          Drunk G.O.A.T.
        </span>
        <span className={`uppercase tracking-[0.3em] text-gold ${lg ? "mt-2 text-xs" : "mt-1 text-[0.6rem]"}`}>
          Brewery
        </span>
      </span>
      <span className="sr-only">{site.brand}</span>
    </span>
  );
}
