import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { site } from "@/content/site";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Header from "@/components/Header";
import Footer from "@/components/sections/Footer";
import CartRoot from "@/components/cart/CartRoot";
import Preloader from "@/components/ui/Preloader";
import CustomCursor from "@/components/ui/CustomCursor";
import AgeGate from "@/components/hero/AgeGate";
import SoundToggle from "@/components/hero/SoundToggle";
import "./globals.css";

// Sin precarga: el preloader cubre el primer segundo, así el cambio de fuente no
// se ve y las fuentes salen de la ruta crítica del LCP (Lighthouse móvil).
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

/** URL absoluta para Open Graph: variable propia → dominio de Vercel → local. */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

const title = `${site.tagline} · ${site.brand}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s · ${site.brand}` },
  description: site.description,
  applicationName: site.brand,
  keywords: ["cerveza artesanal", "stout", "mezquite", "Ciudad Juárez", "El Paso", "cervecería", "Mezquite Stout"],
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: site.brand,
    title,
    description: site.description,
    url: "/",
    images: [
      {
        // Derivada de public/media/hero-bottle-16x9.png (1200×630, ~100 KB)
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Botella de Mezquite Stout iluminada sobre fondo negro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
    images: ["/og-image.jpg"],
  },
  // Preview para el cliente: que no se indexe hasta producción
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0A0806",
  colorScheme: "dark",
};

/** Antes del primer pintado: ocultar preloader (ya visto en la sesión) y age gate (edad ya confirmada). */
const preloadScript = `try{if(sessionStorage.getItem("goat-preloaded")==="1")document.documentElement.classList.add("preloaded");if(localStorage.getItem("goat-age-ok")==="1")document.documentElement.classList.add("age-ok")}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${manrope.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: preloadScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <Preloader />
        <AgeGate />
        <SmoothScroll>
          <Header />
          {children}
          <Footer />
        </SmoothScroll>
        <CartRoot />
        <SoundToggle />
        <CustomCursor />
        <div aria-hidden className="film-grain" />
      </body>
    </html>
  );
}
