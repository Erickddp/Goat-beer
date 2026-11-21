# Fase 2 — Diseño nuevo y datos de pedidos (semana 2: 30 nov–6 dic)

**Objetivo:** integrar el diseño final de botella y mover el catálogo a una base de datos con inventario,
dejando listo el modelo de pedidos.

**Entregable:** sitio con el diseño definitivo; `/tienda` leyendo productos desde la base de datos.

**Depende de:** diseño final de botella y logo, precios (ver [pendientes del cliente](pendientes-cliente.md)).
Si el diseño no ha llegado, avanzar con la parte de datos y dejar la integración visual para cuando llegue.

## A. Integración del diseño nuevo
Seguir el procedimiento de [cambio-diseno-botella.md](cambio-diseno-botella.md).
- [ ] Videos nuevos (`pour.mp4`, `overflow.mp4`) en `public/media/` y `bash scripts/extract-frames.sh`.
- [ ] Ajustar tiempos en `content/hero.ts` (`beats`, `chapters`, cámara) y en el script (`POP_START`, `POUR_START`).
- [ ] Reemplazar keyframes, `hero-bottle-*`, `glass-foam.png`, maridajes, `og-image.jpg`.
- [ ] Botella con fondo transparente real para tienda y carrito (sustituye `_derived/bottle-cutout.png`).
- [ ] Logo real (SVG o PNG transparente) en header, footer y age gate; quitar el wordmark provisional.
- [ ] Revisión visual completa a 375, 768, 1280 y 1920 px.

## B. Base de datos
Decisión pendiente (ver [decisiones-y-riesgos.md](decisiones-y-riesgos.md)): **Supabase (Postgres)** es la propuesta por defecto
por su capa gratuita, autenticación para un panel futuro y facilidad con Vercel.
- [ ] Crear proyecto y variables de entorno en Vercel (nada de claves en el repo).
- [ ] Esquema mínimo:
  - `products` (id, slug, nombre, descripción, estado `available|coming-soon`, precio en centavos MXN, specs, imagen, orden).
  - `inventory` (product_id, stock, reservado).
  - `orders` (id, estado, subtotal, envío, total, datos del cliente, dirección, zona, notas, proveedor de pago, id de pago, timestamps).
  - `order_items` (order_id, product_id, cantidad, precio unitario al momento de la compra).
  - `delivery_zones` (zona, costo de envío, mínimo de compra, activa).
- [ ] Guardar precios en **centavos enteros**, nunca flotantes.
- [ ] Capa de acceso en `lib/` (por ejemplo `lib/db/`) con tipos propios; los componentes siguen recibiendo la forma `Product` de `content/products.ts`.
- [ ] Script de siembra que cargue el catálogo actual de `content/products.ts`.
- [ ] `/tienda` y la sección de tienda leen de la base de datos (Server Components); `content/products.ts` queda como semilla y respaldo.
- [ ] Políticas de seguridad (RLS) activas: el navegador solo puede leer productos; nada de escritura pública.
- [ ] Inventario: definir si se reserva stock al iniciar el pago y por cuánto tiempo (propuesta: 15 min).

## C. Carrito
- [ ] Validar el carrito persistido contra el catálogo al cargar (producto retirado, precio cambiado, sin stock).
- [ ] Mostrar mensajes claros cuando una línea ya no es válida.

## Criterios de salida
- Diseño final integrado y revisado en los 4 anchos.
- Catálogo, precios e inventario salen de la base de datos.
- Build sin errores; el sitio sigue funcionando si la base de datos no responde (mensaje de error útil, no pantalla en blanco).

## Riesgos
- Que el diseño llegue tarde: no bloquear la parte B.
- Los frames nuevos cambian de peso y de cantidad: volver a medir Lighthouse.
