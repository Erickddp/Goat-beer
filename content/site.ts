/**
 * Datos generales del sitio. Campos `null` = pendientes de confirmar con el cliente.
 */

export interface SocialLink {
  network: "instagram" | "facebook" | "tiktok";
  label: string;
  url: string | null;
}

export interface SiteConfig {
  brand: string;
  shortName: string;
  tagline: string;
  description: string;
  locales: readonly ["es", "en"];
  defaultLocale: "es";
  contact: {
    /** Formato internacional sin "+" ni espacios, p. ej. "5216561234567". */
    whatsappNumber: string | null;
    whatsappDefaultMessage: string;
    email: string | null;
  };
  delivery: {
    zones: string[];
    notes: string;
  };
  social: SocialLink[];
  legal: {
    minimumAge: number;
    responsibleDrinking: string;
    underageNotice: string;
    privacyPath: string;
    copyrightYear: number;
  };
}

export const site: SiteConfig = {
  brand: "Drunk G.O.A.T. Brewery",
  shortName: "GOAT Beer",
  tagline: "Mezquite Stout",
  description:
    "Cerveza artesanal de la frontera Ciudad Juárez · El Paso. Mezquite Stout: stout con pechitas de mezquite y avena.",
  locales: ["es", "en"],
  defaultLocale: "es",
  contact: {
    whatsappNumber: null, // TODO: confirmar con el cliente
    whatsappDefaultMessage: "¡Hola! Quiero pedir Mezquite Stout 🐐",
    email: null,
  },
  delivery: {
    zones: ["Ciudad Juárez"],
    notes: "Entregas a domicilio en Ciudad Juárez. Pronto más zonas.",
  },
  social: [
    { network: "instagram", label: "Instagram", url: null }, // TODO: confirmar
    { network: "facebook", label: "Facebook", url: null }, // TODO: confirmar
  ],
  legal: {
    minimumAge: 18,
    responsibleDrinking: "Evita el exceso.",
    underageNotice: "Prohibida la venta a menores de edad.",
    privacyPath: "/aviso-de-privacidad",
    copyrightYear: 2026,
  },
};

export const whatsappUrl = (message = site.contact.whatsappDefaultMessage) =>
  site.contact.whatsappNumber
    ? `https://wa.me/${site.contact.whatsappNumber}?text=${encodeURIComponent(message)}`
    : null;
