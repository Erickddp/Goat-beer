# Drunk G.O.A.T. Brewery

Sitio de marca y tienda en línea de **Drunk G.O.A.T. Brewery**, cervecería artesanal de la frontera Ciudad Juárez / El Paso.
Producto estrella: **Mezquite Stout** (stout con pechitas de mezquite y avena · 6 % ABV · 25 IBU · SRM 30 · 355 ml).

**Estado:** preview visual para el cliente. Sin backend: tienda, carrito, reseñas y formularios usan datos mock y estado local.
El camino a la venta en línea está en [`docs/plan/`](docs/plan/README.md).

## Stack
Next.js (App Router, TypeScript) · Tailwind CSS · GSAP + ScrollTrigger · Lenis · Zustand (carrito en localStorage).

## Cómo correrlo

```bash
npm install
npm run dev      # desarrollo en http://localhost:3000
npm run build    # verificación de producción
npm run start    # sirve el build
npm run lint
```

## Estructura

| Ruta | Qué hay |
|---|---|
| `app/` | Páginas (`/`, `/tienda`, `/aviso-de-privacidad`) y `api/checkout` (mock) |
| `components/hero/` | Age gate y `PourSequence` (secuencia de frames en canvas controlada por scroll) |
| `components/sections/` | Historia, ficha técnica, cata, ingredientes, maridaje, tienda, reseñas, pedidos, footer |
| `components/cart/`, `components/shop/` | Drawer del carrito, modal de pago, tarjetas de producto |
| `content/` | **Única fuente de datos**: `products`, `reviews`, `site`, `hero`, `i18n/es.ts` |
| `lib/cart/` | Store del carrito y tipos del checkout |
| `lib/agent/` | Placeholder del futuro agente de ventas de WhatsApp |
| `scripts/extract-frames.sh` | Genera frames WebP y audio a partir de `public/media/*.mp4` |
| `public/media/`, `public/frames/`, `public/sfx/` | Imágenes, secuencias del hero y efectos de sonido |
| `design-system/` | Sistema de diseño generado y ajustado a la identidad |
| `docs/plan/` | Plan por fases, pendientes del cliente, decisiones y riesgos |

## Hero "destape y servido"
La fuente activa se elige en `content/hero.ts` (`frames` o `keyframes`). Para regenerar frames y audio cuando cambie el video:

```bash
bash scripts/extract-frames.sh
# sin ffmpeg en el PATH:
FFMPEG=/ruta/ffmpeg FFPROBE=/ruta/ffprobe bash scripts/extract-frames.sh
```

Si cambia el diseño de la botella, sigue [`docs/plan/cambio-diseno-botella.md`](docs/plan/cambio-diseno-botella.md).

## Despliegue
Pensado para Vercel. `.vercelignore` deja fuera los `.mp4` y los originales (`src/`); se despliegan solo los frames y el audio.
La preview tiene `noindex` activado (`app/layout.tsx`); hay que quitarlo en el lanzamiento (Fase 5).

## Assets pendientes
Ver [`ASSETS_PENDIENTES.md`](ASSETS_PENDIENTES.md).
