/**
 * Textos en español (idioma por defecto). `en.ts` debe exportar un objeto
 * `satisfies Dictionary` con las mismas llaves.
 */

const es = {
  meta: {
    skipToContent: "Saltar al contenido",
  },
  ageGate: {
    title: "¿Eres mayor de 18?",
    body: "Esta cabra solo convive con adultos. Prometemos no pedirte credencial (esta vez).",
    yes: "Sí, soy mayor de 18",
    no: "No",
    soundNote: "Este sitio tiene sonido. Puedes silenciarlo cuando quieras.",
    legal: "Evita el exceso. Prohibida la venta a menores de edad.",
    deniedTitle: "Vuelve cuando seas mayor",
    deniedBody: "Mientras tanto, la cabra te guarda tu lugar.",
  },
  sound: {
    on: "Sonido activado",
    off: "Sonido silenciado",
    toggle: "Activar o silenciar el sonido",
  },
  nav: {
    story: "Historia",
    specs: "Ficha",
    tasting: "Cata",
    pairing: "Maridaje",
    shop: "Tienda",
    order: "Pedidos",
    cart: "Carrito",
  },
  hero: {
    beats: ["Destápala.", "Mezquite Stout", "Hecha en la frontera."],
    eyebrow: "Drunk G.O.A.T. Brewery",
    scrollHint: "Desliza para servir",
    tagline: "Evita el exceso.",
  },
  story: {
    eyebrow: "La historia",
    title: "Del mezquite a tu copa",
    coords: "31.69° N · 106.42° O",
    place: "Desierto de Chihuahua · Ciudad Juárez / El Paso",
    imageAlt: "Botella de Mezquite Stout sobre una roca en el desierto fronterizo al atardecer, junto a un mezquite",
    paragraphs: [
      "En el desierto entre Ciudad Juárez y El Paso, el mezquite aguanta lo que sea: sol, viento, heladas y uno que otro chisme. Sus vainas, las pechitas, guardan un dulzor que la frontera conoce desde antes de que existiera la frontera.",
      "Nosotros nada más les hicimos caso. Las juntamos, las tostamos y las metimos a una stout con avena. Salió algo que sabe a madera, a humo y a tierra propia.",
    ],
    closing: "Orgullo fronterizo, embotellado.",
  },
  specs: {
    eyebrow: "Ficha técnica",
    title: "Los números de la cabra",
    intro: "Para los que leen la etiqueta antes de destapar. Te entendemos.",
    abv: "Alcohol",
    abvNote: "Calidez bien integrada. Se siente, no se presume.",
    ibu: "Amargor",
    ibuNote: "Equilibra el dulzor del mezquite sin robar cámara.",
    srm: "Color",
    srmNote: "Negra a la vista, rubí a contraluz.",
    srmScaleTitle: "Escala SRM",
    srmScaleLabels: ["Pilsner", "Ámbar", "Brown", "Stout", "Noche sin luna"],
    srmCaption: "La Mezquite Stout llega al 30 de 40. Más oscura que el café de la oficina.",
    details: [
      { label: "Botella", value: "Ámbar · 355 ml" },
      { label: "Carbonatación", value: "Media-alta" },
      { label: "Estilo", value: "Oatmeal Stout con mezquite" },
    ],
  },
  tasting: {
    eyebrow: "Notas de cata",
    title: "Lo que vas a encontrar",
    notes: [
      { id: "madera", title: "Madera", body: "Maltas oscuras con un fondo maderado que llega, se sienta y se queda a platicar." },
      { id: "humo", title: "Humo", body: "Un ahumado discreto, como la carne asada del vecino: no la ves, pero sabes que ahí está." },
      { id: "mezquite", title: "Dulzor de mezquite", body: "El dulce peculiar de las pechitas: ni piloncillo ni caramelo. Algo que solo sabe a aquí." },
      { id: "cuerpo", title: "Cuerpo sedoso", body: "La avena le da textura de terciopelo y la carbonatación media-alta la mantiene despierta." },
    ],
    warmth: "Sírvela entre 8 y 12 °C, en copa. Ya sabemos que la vas a tomar de la botella, pero al menos lo intentamos.",
  },
  ingredients: {
    eyebrow: "Ingredientes",
    title: "Pocos, buenos y de aquí",
    hint: "Toca o pasa el cursor por cada ingrediente",
    imageAlt: "Vainas de mezquite, un tazón de avena, un tazón de malta oscura y trozos de chocolate sobre madera oscura",
    items: [
      { id: "pechitas", title: "Pechitas de mezquite", body: "Vainas del mezquite fronterizo, tostadas para sacarles ese dulzor terroso. La estrella del show." },
      { id: "avena", title: "Avena", body: "El secreto del cuerpo sedoso y de esa espuma cremosa que se queda pegada a la copa." },
      { id: "maltas", title: "Maltas oscuras", body: "Tostadas hasta llegar al café y al humo. Ellas ponen el color de noche." },
      { id: "cacao", title: "¿Chocolate?", body: "Pura ilusión: no lleva. Ese sabor a cacao amargo lo sacan las maltas tostadas. Magia de cervecero." },
    ],
    hops: "Y un toque de lúpulo, 25 IBU, para que nadie se empalague.",
  },
  pairing: {
    eyebrow: "Maridaje",
    title: "Con qué se lleva bien",
    intro: "Una stout así no llega con las manos vacías. Desliza y arma el plan.",
    items: [
      { id: "chocolate", title: "Pastel de chocolate", body: "Chocolate amargo y stout: pareja de toda la vida. Ni la suegra los separa.", imageAlt: "Rebanada de pastel de chocolate con frutos rojos junto a una botella y una copa de Mezquite Stout" },
      { id: "carne-asada", title: "Carne asada", body: "El humo de la parrilla encuentra su eco en la copa. En taco, en corte o directo del asador.", imageAlt: "Corte de carne asada sobre tabla junto a una botella y una copa de Mezquite Stout" },
      { id: "mole", title: "Mole", body: "Cacao, chiles y especias contra maltas tostadas. Fiesta asegurada, ropa blanca no recomendada.", imageAlt: "Cazuela de barro con caldo de res, elote y verduras, junto a tortillas, limón, una botella y una copa de Mezquite Stout" },
    ],
    imagePending: "Foto en camino",
    outroTitle: "¿Y tú con qué la acompañas?",
    outroBody: "Cuéntanos tu maridaje fronterizo. Si nos convence, lo presumimos.",
  },
  shop: {
    eyebrow: "Tienda",
    title: "Llévate la cabra a casa",
    intro: "Directo de la cervecería a tu refri. Por ahora entregamos en Ciudad Juárez.",
    pageTitle: "La tienda de la cabra",
    pageIntro: "Escoge tu presentación, arma tu carrito y nosotros nos encargamos del resto. Pagos en línea muy pronto; mientras, pedidos por WhatsApp.",
    viewAll: "Ver la tienda completa",
    add: "Agregar",
    added: "Agregado",
    addAria: (name: string) => `Agregar ${name} al carrito`,
    comingSoon: "Próximamente",
    priceTbd: "Precio por confirmar",
    bottles: (n: number) => (n === 1 ? "1 botella" : `${n} botellas`),
    perks: [
      { title: "Entrega local", body: "A domicilio en Ciudad Juárez." },
      { title: "Bien fría", body: "Llega lista para destapar." },
      { title: "Hecha aquí", body: "Cervecería de la frontera, lote pequeño." },
    ],
  },
  cart: {
    title: "Tu carrito",
    open: (n: number) => (n === 0 ? "Abrir carrito (vacío)" : `Abrir carrito (${n} ${n === 1 ? "artículo" : "artículos"})`),
    empty: "Tu carrito está más vacío que el desierto a mediodía.",
    emptyCta: "Ir a la tienda",
    subtotal: "Subtotal",
    subtotalTbd: "Por confirmar",
    taxesNote: "Precios en MXN. El costo de envío se confirma con tu pedido.",
    checkout: "Pagar",
    checkingOut: "Un momento…",
    remove: "Quitar",
    increase: "Agregar una más",
    decrease: "Quitar una",
    quantity: "Cantidad",
    close: "Cerrar carrito",
    checkoutSoonTitle: "Pagos en línea muy pronto",
    checkoutSoonBody: "Estamos afinando la caja registradora. Mientras tanto, mándanos tu pedido por WhatsApp y te lo llevamos.",
    checkoutSoonCta: "Pedir por WhatsApp",
    checkoutSoonClose: "Seguir viendo",
  },
  reviews: {
    eyebrow: "Reseñas",
    title: "Lo que dice la banda",
    exampleBadge: "Ejemplo",
    exampleNote: "Estas tarjetas son de ejemplo. Aquí aparecerán las reseñas reales de quienes ya probaron la Mezquite Stout.",
    ratingLabel: (n: number) => `${n} de 5 estrellas`,
    verified: "Compra verificada",
  },
  order: {
    eyebrow: "Dónde comprar",
    title: "Pídela y te la llevamos",
    body: "Escríbenos por WhatsApp, dinos cuántas y dónde. Nosotros ponemos la cerveza; tú pones el pretexto.",
    whatsappCta: "Pedir por WhatsApp",
    whatsappPending: "Número de WhatsApp por confirmar",
    deliveryZone: "Zona de entrega",
    follow: "Síguenos",
    socialPending: "Enlace por confirmar",
    splashAlt: "Botella de Mezquite Stout entre salpicaduras de cerveza y vainas de mezquite",
  },
  header: {
    home: "Inicio",
    shop: "Tienda",
    order: "Pedidos",
  },
  footer: {
    tagline: "Cerveza artesanal de la frontera Ciudad Juárez · El Paso.",
    navTitle: "Explora",
    socialTitle: "Redes",
    privacy: "Aviso de privacidad",
    rights: "Todos los derechos reservados.",
  },
  privacy: {
    title: "Aviso de privacidad",
    body: "Estamos preparando nuestro aviso de privacidad. En esta versión de vista previa no recopilamos datos personales: tu carrito vive solo en tu navegador.",
    back: "Volver al inicio",
  },
} as const;

type Widen<T> = T extends string
  ? string
  : T extends (...args: infer A) => infer R
    ? (...args: A) => Widen<R>
    : T extends readonly (infer U)[]
      ? readonly Widen<U>[]
      : { [K in keyof T]: Widen<T[K]> };

export type Dictionary = Widen<typeof es>;

export default es as Dictionary;
