# Fase 5 — Pruebas y lanzamiento (semanas 5 y 6: 21 dic–3 ene)

**Objetivo:** validar la compra real de punta a punta y lanzar primero a un grupo cerrado y luego al público.

**Entregable:** sitio en producción con dominio propio y pagos reales activos.

> Ojo con las fechas: del 24 de diciembre al 1 de enero hay festividades. Conviene dejar el grueso de las pruebas
> antes del 23 de dic y acordar con el cliente qué días puede entregar pedidos.

## Semana 5 (21–27 dic): pruebas

### Compra real
- [ ] Cambiar credenciales de sandbox a producción en Vercel (variables de entorno, nunca en el repo).
- [ ] Pedido real de monto bajo con tarjeta; confirmar que llega el dinero, el webhook, el correo y el aviso al negocio.
- [ ] Prueba con pago en efectivo/OXXO o SPEI si están activos (estado pendiente → pagado).
- [ ] Reembolso de prueba y su efecto en el inventario.
- [ ] Entrega física de un pedido de prueba dentro de Ciudad Juárez, con verificación de edad.

### Calidad
- [ ] Lighthouse móvil ≥ 85 en la home y en `/tienda`.
- [ ] Probar en dispositivos reales: iPhone (Safari), Android (Chrome), escritorio (Chrome, Safari, Firefox).
- [ ] Accesibilidad: navegación por teclado completa en tienda y checkout, contraste AA, lector de pantalla en el flujo de compra.
- [ ] Revisión de seguridad: variables de entorno, políticas RLS, límites de peticiones, validación de entradas, cabeceras (CSP básica), que ninguna ruta exponga datos de otros pedidos.
- [ ] Páginas 404 y de error con marca.
- [ ] Prueba de carga ligera sobre el checkout (no debe vender de más con peticiones simultáneas: stock atómico).

### Observabilidad
- [ ] Registro de errores del servidor (Vercel logs o Sentry).
- [ ] Analítica respetuosa de privacidad (Vercel Analytics, Plausible o similar) y eventos clave: agregar al carrito, iniciar pago, compra.
- [ ] Alerta si falla el webhook o si hay pedidos `pendiente` atorados.
- [ ] Copia de seguridad de la base de datos (activar y probar una restauración).

### SEO y compartir
- [ ] Metadatos y `og-image` con el diseño final, `sitemap.xml`, `robots.txt`, datos estructurados de producto y negocio local.
- [ ] Google Business Profile y enlaces desde Instagram/Facebook.

## Semana 6 (28 dic–3 ene): lanzamiento

- [ ] **Lanzamiento suave:** compartir el enlace con un grupo cerrado (amigos, primeros clientes de WhatsApp) y observar 3–5 días.
- [ ] Revisión diaria de pedidos, errores y mensajes de clientes; lista corta de ajustes.
- [ ] Corregir lo urgente; lo demás pasa a la Fase 6.
- [ ] **Lanzamiento público:** anunciar en redes, actualizar la bio de Instagram/Facebook con el enlace, avisar por WhatsApp.
- [ ] Plan de soporte: quién responde, en cuánto tiempo, por qué canal.

## Criterios de salida
- Al menos un pedido real pagado, entregado y conciliado.
- Sin errores críticos abiertos; alertas activas.
- El cliente aprueba por escrito el lanzamiento público.

## Plan B (si algo bloquea los pagos)
Lanzar con el catálogo y el carrito, y que **"Pagar" genere el pedido y abra WhatsApp** con el resumen (el botón y `whatsappUrl` ya existen), cobrando por transferencia o contra entrega. Se activa el pago en línea cuando se resuelva el bloqueo, sin rehacer el sitio.
