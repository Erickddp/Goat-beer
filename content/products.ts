/**
 * Catálogo base. Con DATABASE_URL, el sitio lee de la base de datos (`lib/catalog/server.ts`)
 * y este archivo sirve de semilla (`npm run db:seed`) y de respaldo; sin ella, es la fuente de datos.
 * Mantener la forma de `Product`: los componentes dependen de ella.
 * Precios: `null` = por confirmar con el cliente (la UI muestra "Precio por confirmar").
 */

export type ProductStatus = "available" | "coming-soon";

export type Currency = "MXN";

export interface BeerSpecs {
  /** Alcohol por volumen, en % */
  abv: number;
  /** International Bitterness Units */
  ibu: number;
  /** Standard Reference Method (color) */
  srm: number;
  /** Volumen por botella, en ml */
  volumeMl: number;
}

export interface ProductImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  style: string;
  shortDescription: string;
  /** Botellas por unidad de venta (1, 6, 12…) */
  unitsPerPack: number;
  /** Precio en centavos de MXN. `null` mientras el cliente no lo confirme. */
  priceCents: number | null;
  currency: Currency;
  status: ProductStatus;
  featured?: boolean;
  specs?: BeerSpecs;
  image?: ProductImage;
  /** SKU para la futura integración de pagos/inventario */
  sku?: string;
  /**
   * Unidades disponibles para vender (stock − apartado), si el producto lleva inventario.
   * `undefined`/`null` = sin control de stock. Viene de la base de datos; aquí no se llena.
   */
  stock?: number | null;
}

const mezquiteStoutSpecs: BeerSpecs = { abv: 6, ibu: 25, srm: 30, volumeMl: 355 };

const bottleImage: ProductImage = {
  // Recorte de hero-bottle-9x16.png (src/1movil.jfif). Fondo negro: se integra con mix-blend-lighten.
  src: "/media/_derived/bottle-cutout.png",
  alt: "Botella ámbar de Mezquite Stout con la etiqueta dorada de la cabra",
  width: 500,
  height: 1500,
};

export const products: Product[] = [
  {
    id: "mezquite-stout-1",
    slug: "mezquite-stout",
    name: "Mezquite Stout",
    style: "Oatmeal Stout con mezquite",
    shortDescription: "Una botella de 355 ml. Para el cafecito de la mañana (dirán los envidiosos).",
    unitsPerPack: 1,
    priceCents: null,
    currency: "MXN",
    status: "available",
    featured: true,
    specs: mezquiteStoutSpecs,
    image: bottleImage,
    sku: "DG-MS-355-1",
  },
  {
    id: "mezquite-stout-6",
    slug: "mezquite-stout-six-pack",
    name: "Mezquite Stout · Six pack",
    style: "Oatmeal Stout con mezquite",
    shortDescription: "Seis botellas. Una para ti y cinco para presumir.",
    unitsPerPack: 6,
    priceCents: null,
    currency: "MXN",
    status: "available",
    specs: mezquiteStoutSpecs,
    image: bottleImage,
    sku: "DG-MS-355-6",
  },
  {
    id: "mezquite-stout-12",
    slug: "mezquite-stout-caja-12",
    name: "Mezquite Stout · Caja de 12",
    style: "Oatmeal Stout con mezquite",
    shortDescription: "Doce botellas. La carne asada del domingo ya tiene invitada de honor.",
    unitsPerPack: 12,
    priceCents: null,
    currency: "MXN",
    status: "available",
    specs: mezquiteStoutSpecs,
    image: bottleImage,
    sku: "DG-MS-355-12",
  },
  {
    id: "proximamente",
    slug: "proximamente",
    name: "Próximamente",
    style: "Nuevos estilos en el fermentador",
    shortDescription: "La cabra está tramando algo. Pronto, más estilos de la frontera.",
    unitsPerPack: 1,
    priceCents: null,
    currency: "MXN",
    status: "coming-soon",
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);

export const formatPrice = (cents: number | null, currency: Currency = "MXN") =>
  cents === null
    ? null
    : new Intl.NumberFormat("es-MX", { style: "currency", currency }).format(cents / 100);
