# Design System Master — GOAT Beer (Drunk G.O.A.T. Brewery)

> **LOGIC:** When building a specific page, first check `design-system/goat-beer/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file. If not, follow the rules below.
>
> Generado con `ui-ux-pro-max` ("craft brewery premium dark beverage e-commerce", 2026-11-15) y
> **ajustado a la identidad de CLAUDE.md**. Donde la skill chocaba con la marca, ganó la marca:
> - Skill: fondo claro `#FAFAF9` → **Marca: fondo oscuro siempre** (`#0A0806`).
> - Skill: Amatic SC / Cabin → **Marca: Fraunces (display) / Manrope (texto)**.
> - Skill: "Liquid Glass" pleno → **solo cristal ahumado puntual** (drawer, modales, header), sin iridiscencias ni aberración cromática.
> - Se conserva de la skill: oro como acento único, patrón "Horizontal Scroll Journey" (lo usa Maridaje), anti-patrones y checklist.

**Categoría:** E-commerce de lujo / bebida artesanal · **Tokens:** `app/globals.css` (`@theme`, Tailwind v4)

---

## Color

| Rol | Hex | Token Tailwind | Uso | Contraste sobre `ink` |
|-----|-----|----------------|-----|-----|
| Fondo | `#0A0806` | `ink` | Fondo de página, siempre | — |
| Superficie | `#1C120C` | `stout` | Secciones alternas, tarjetas | — |
| Superficie elevada | `#2A1C13` | `stout-2` | Drawer, modales, hover de tarjeta | — |
| Oro de etiqueta | `#D4A537` | `gold` | CTAs, bordes, números. **Con moderación** | 8.8:1 |
| Oro claro | `#E6C068` | `gold-soft` | Hover de CTA, brillos | 11.5:1 |
| Oro profundo | `#9C7A28` | `gold-deep` | Líneas, divisores, estados inactivos | 5.0:1 |
| Espuma | `#E9D6B0` | `foam` | Texto principal | 14.0:1 |
| Espuma tenue | `#B9A684` | `foam-muted` | Texto secundario | 8.4:1 |
| Espuma apagada | `#9B896A` | `foam-faint` | Metadatos, legales (≥4.75:1 en todas las superficies) | 5.9:1 |
| Rubí | `#5A1E14` | `ruby` | Acentos de fondo, glows, barra SRM. **Nunca texto** | 1.5:1 |
| Rubí legible | `#C2553F` | `ruby-bright` | Errores, avisos (≥18px o sobre `ink`) | 4.4:1 |

Regla de oro (literal): si en un viewport hay más de ~10% de oro, sobra oro.

## Tipografía

- **Display:** Fraunces (variable, eje `opsz` + `SOFT`), pesos 300–700, itálica para énfasis. Token `font-display`.
- **Texto:** Manrope 400–700. Token `font-sans`.
- Cargadas con `next/font/google` en `app/layout.tsx`.
- Escala fluida (clamp): `text-display-xl` (hero), `text-display-lg`, `text-display-md`, `text-eyebrow` (mayúsculas, tracking 0.24em, oro).
- Cuerpo ≥ 16px en móvil, `line-height` 1.6, ancho máx. 65ch.
- Números técnicos (ABV, IBU, SRM, precios): Fraunces con `tabular-nums`.

## Espaciado y layout

- Base 4px (escala de Tailwind). Secciones: `py-section` = `clamp(5rem, 12vw, 10rem)`.
- Gutter: 16px móvil · 24px tablet · 48px desktop. Contenedor máx. 1440px.
- Breakpoints de prueba: 375, 768, 1280, 1920.

## Radios

`radius-sm` 6px (chips) · `radius-md` 12px (botones, inputs) · `radius-lg` 20px (tarjetas) · `radius-xl` 32px (modales) · `radius-pill` (badges). La etiqueta es un óvalo: usar `radius-pill`/óvalos como motivo gráfico.

## Sombras doradas

| Token | Valor | Uso |
|-------|-------|-----|
| `shadow-gold-sm` | `0 0 0 1px rgb(212 165 55 / .25), 0 2px 8px rgb(0 0 0 / .5)` | Tarjetas en reposo |
| `shadow-gold-md` | `0 0 0 1px rgb(212 165 55 / .35), 0 12px 32px -8px rgb(212 165 55 / .25)` | Hover de tarjeta |
| `shadow-gold-lg` | `0 0 0 1px rgb(212 165 55 / .45), 0 24px 64px -12px rgb(212 165 55 / .35)` | Producto destacado, modal |
| `shadow-gold-glow` | `0 0 48px 4px rgb(212 165 55 / .30)` | Halo de botella / CTA principal |
| `inset-shadow-stout` | `inset 0 1px 0 rgb(233 214 176 / .06)` | Brillo superior de superficies |

## Efectos

- **Grano de película** sobre todo el sitio (`.film-grain`, SVG noise, opacity 0.05, `pointer-events: none`).
- **Cristal ahumado:** `bg-stout/70 backdrop-blur-md` + borde `gold/15`. Solo header, drawer y modales.
- **Easing:** `ease-brew` = `cubic-bezier(0.22, 1, 0.36, 1)`. Micro-interacciones 150–300ms; revelados 600–900ms (GSAP).
- Animar solo `transform` y `opacity`. `prefers-reduced-motion`: sin pin, sin parallax, imágenes fijas.

## Componentes base

- **Botón primario:** fondo `gold`, texto `ink`, `radius-md`, 48px de alto mín., hover `gold-soft` + `shadow-gold-glow`.
- **Botón secundario:** transparente, borde `gold/60`, texto `foam`; hover borde `gold`.
- **Tarjeta:** `bg-stout`, `radius-lg`, `shadow-gold-sm` → hover `shadow-gold-md` (sin `scale` que mueva layout).
- **Input:** `bg-ink`, borde `foam/15`, foco `ring-2 ring-gold`.
- **Foco visible global:** `outline: 2px solid gold; outline-offset: 3px`.
- Iconos: SVG lineales (Lucide), trazo 1.5px. Nunca emojis.

## Patrón de página (de la skill)

"Horizontal Scroll Journey": intro vertical → recorrido horizontal pinned (Maridaje) → detalle → footer vertical. CTA de compra flotante discreto (carrito) y al final de cada recorrido.

## Anti-patrones

- ❌ Fondos claros o secciones blancas
- ❌ Colores vibrantes / bloques saturados / paletas juguetonas
- ❌ Emojis como iconos
- ❌ Oro en párrafos largos o en más de un elemento protagonista por pantalla
- ❌ Rubí `#5A1E14` como color de texto
- ❌ Hover con `scale` que desplaza el layout · cambios de estado sin transición · foco invisible
- ❌ Testimonios o nombres inventados que parezcan reales

## Checklist previo a entregar

- [ ] Sin emojis como iconos; set de iconos consistente
- [ ] `cursor-pointer` en todo lo clicable; objetivos táctiles ≥ 44px
- [ ] Hovers con transición 150–300ms
- [ ] Contraste AA (texto ≥ 4.5:1) sobre fondos oscuros
- [ ] Foco visible en navegación por teclado
- [ ] `prefers-reduced-motion` respetado
- [ ] Responsive: 375, 768, 1280, 1920 — sin scroll horizontal
- [ ] Nada oculto detrás del header fijo
- [ ] "Evita el exceso" y "Prohibida la venta a menores de edad" visibles
