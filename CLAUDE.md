# CLAUDE.md — Drunk G.O.A.T. Brewery (sitio web)

## Qué es
Sitio de marca y tienda en línea de **Drunk G.O.A.T. Brewery**, cervecería artesanal de la frontera **Ciudad Juárez / El Paso**.
Producto estrella: **Mezquite Stout**, una stout elaborada con vainas de mezquite ("pechitas") y avena.
- 6% ABV · 25 IBU · SRM 30 · botella ámbar de 355 ml
- Notas: maderadas y ahumadas de maltas oscuras, dulzor peculiar de las pechitas, cuerpo sedoso por la avena, carbonatación media-alta, calidez alcohólica bien integrada.
- Personalidad: orgullo fronterizo + humor ("Buenos días, tomando un cafecito. Los envidiosos dirán que es cerveza") con estética premium.

## Fase actual: PREVIEW VISUAL para el cliente
- Debe verse **espectacular**, de nivel Awwwards. Es una demo para el cliente, no producción.
- **Sin backend.** Tienda, carrito, reseñas y formularios funcionan con datos mock y estado local. Todo debe estar **preparado para conectarse después** (interfaces y tipos limpios, datos en `/content`).
- Prioridad: hero con animación de scroll > identidad visual > tienda (UI) > resto de secciones.

## Stack
- Next.js (App Router, TypeScript, última estable), Tailwind CSS.
- GSAP + ScrollTrigger (y SplitText si hace falta), Lenis para smooth scroll.
- Estado del carrito: Zustand (persistir en localStorage con try/catch).
- 3D a futuro: React Three Fiber + drei. **No** en la preview, salvo que sobre tiempo.
- Deploy: Vercel.

## Skills
- Usa **UI UX Pro Max** (`ui-ux-pro-max`) para el sistema de diseño: corre su búsqueda con "craft brewery premium dark beverage e-commerce" y genera el design system con `--persist -p "GOAT Beer"` antes de escribir componentes. Ajusta su resultado a la identidad de abajo; si algo choca, gana la identidad de marca.

## Identidad visual
- Paleta base: negro profundo `#0A0806`, café stout `#1C120C`, oro de etiqueta `#D4A537`, espuma `#E9D6B0`, rojo rubí sutil `#5A1E14` para acentos.
- Tipografía: serif display con carácter para titulares (p. ej. "Fraunces" o "Playfair Display"), sans limpia para texto (p. ej. "Inter" o "Manrope"). Cárgalas con `next/font`.
- Fondo oscuro siempre; el oro se usa con moderación (bordes, números, CTAs).
- Grano de película sutil sobre todo el sitio (overlay con CSS, opacity ~0.05).
- El logo es la cabra negra dentro de un óvalo dorado. Los assets reales están en `public/media/`.

## Assets (`public/media/`)
Los genera el usuario con Gemini y conservan estos nombres. Si alguno falta, usa un placeholder del mismo tamaño y déjalo anotado en `ASSETS_PENDIENTES.md`:
`hero-bottle-16x9.png`, `hero-bottle-9x16.png`, `glass-foam.png`, `ingredients.png`, `desert-border.png`, `splash.png`, `pairing-chocolate.png`, `texture-foam.jpg`, `texture-liquid.png`, `kf-01-closed.jpg`, `kf-02-pop.jpg`, `kf-03-pour.jpg`, `kf-04-overflow.jpg`, `pour.mp4`, `overflow.mp4`, `ambient-desert.mp4`, `logo.png` (o `.svg`).

## La animación principal (hero "destape y servido")
Técnica: **secuencia de imágenes en `<canvas>` controlada por scroll**, la técnica de las páginas de producto de Apple. NO uses un `<video>` con currentTime, porque se traba en móvil.
1. `scripts/extract-frames.sh`: con ffmpeg, saca de `public/media/pour.mp4` ~120 frames WebP (1600px de ancho en desktop y 800px en móvil) a `public/frames/pour/desktop/0001.webp…` y `/mobile/`. También extrae el audio a `public/sfx/pop.mp3` y `public/sfx/pour.mp3` (recorta los tramos con `-ss`/`-t`; deja los tiempos como variables al inicio del script).
2. Componente `<PourSequence/>`: sección pinned de ~400vh con ScrollTrigger; dibuja el frame que toca según el progreso; precarga progresiva (primero cada 4º frame y luego el resto).
3. Sobre la secuencia aparecen textos con SplitText en momentos clave: "Destápala." → "Mezquite Stout" → "Hecha en la frontera."
4. Al terminar, la espuma (`overflow.mp4` en secuencia o la textura de espuma con máscara) "se derrama" y cubre la pantalla como transición a la siguiente sección.
5. **Sonido:** los navegadores bloquean el audio hasta que el usuario interactúa. El clic en el **age gate** desbloquea el audio (Web Audio API). El "pop" suena cuando el scroll cruza el frame del destape y el chorro, al servir. Pon un botón visible de silencio/sonido (por defecto encendido tras el age gate) y respeta `prefers-reduced-motion`: sin pin y con una imagen fija.
6. Si `pour.mp4` aún no existe, haz la secuencia con los 4 keyframes (`kf-01-closed.jpg` … `kf-04-overflow.jpg`) con crossfade, para que la demo funcione igual. La fuente activa se elige en `content/hero.ts` (`keyframes` o `frames`).

## Secciones (one-page + /tienda)
1. **Age gate** a pantalla completa: "¿Eres mayor de 18?" Sí / No. Guárdalo en localStorage.
2. **Hero PourSequence.**
3. **La historia**: el mezquite, las pechitas, la frontera. Usa `desert-border.png` / `ambient-desert.mp4` con parallax.
4. **Ficha técnica**: contadores animados (6% ABV, 25 IBU, SRM 30). Barra de color SRM que se "llena" del tono stout.
5. **Notas de cata**: tarjetas que aparecen con el scroll e iconos sutiles: madera, humo, dulzor de mezquite, cuerpo sedoso.
6. **Ingredientes**: `ingredients.png` con hotspots que muestran cada ingrediente al pasar el cursor.
7. **Maridaje**: carrusel horizontal pinned (pastel de chocolate, tacos de carne asada, mole).
8. **Tienda (preview)**: tarjetas de producto desde `content/products.ts` (Mezquite Stout individual, six pack, caja de 12 y "Próximamente" para otros estilos). Botón "Agregar", drawer del carrito, subtotal y botón "Pagar" que abre un modal "Pagos en línea muy pronto". Precios en MXN desde `products.ts` como `0`/`TBD` hasta que el cliente los confirme.
9. **Reseñas**: componente listo para reseñas reales, alimentado por `content/reviews.ts`. En la preview muestra **tarjetas esqueleto claramente marcadas como "Ejemplo"**. No inventes nombres ni testimonios que parezcan reales.
10. **Dónde comprar / Pedidos**: CTA a WhatsApp (número en `content/site.ts`), zona de entrega (Ciudad Juárez) e Instagram/Facebook.
11. **Footer**: logo, redes, aviso de privacidad (página placeholder), **"Evita el exceso"** visible y "Prohibida la venta a menores de edad".

## Arquitectura pensada a futuro
- `content/` = única fuente de datos (products, reviews, site). Luego se sustituye por un CMS o DB sin tocar componentes.
- `lib/cart/` con interfaz `CartProvider`; el checkout futuro irá contra Mercado Pago (Checkout Pro) o Stripe desde un Route Handler `app/api/checkout/route.ts`. Por ahora deja el archivo con un TODO y una respuesta mock.
- `lib/agent/`: placeholder para el futuro agente de ventas de WhatsApp (webhook n8n). Solo un tipo y un TODO.
- i18n listo (es por defecto, en para El Paso): textos en `content/i18n/es.ts` y `en.ts`. Solo hace falta llenar `es` ahora.

## Calidad (no negociable)
- Mobile first. Prueba a 375, 768, 1280 y 1920 px. En móvil la secuencia usa los frames de `/mobile/`.
- Lighthouse Performance ≥ 85 en móvil aunque haya animaciones: imágenes con `next/image`, frames WebP, lazy-load de todo lo que no sea hero.
- Accesibilidad: contraste AA, foco visible, `alt` en todo, `prefers-reduced-motion`.
- Nada de "lorem ipsum": todo el copy en español, con la voz de la marca (orgullosa, fronteriza, con humor fino).
- Antes de decir "listo", corre `npm run build` sin errores y revisa visualmente cada sección (Playwright o capturas).

## Comandos
- `npm run dev`: desarrollo
- `bash scripts/extract-frames.sh`: regenera los frames y el audio cuando cambie `pour.mp4`
- `npm run build`: verificación final
