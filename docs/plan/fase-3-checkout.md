# Fase 3 — Checkout y pagos (semana 3: 7–13 dic)

**Objetivo:** que una compra se pague de punta a punta (en sandbox) y quede registrada.

**Entregable:** flujo carrito → datos de entrega → pago → confirmación, funcionando con credenciales de prueba.

**Depende de:** Fase 2 (base de datos), cuenta de la pasarela con datos fiscales/bancarios del cliente.

## Pasarela de pago
Propuesta: **Mercado Pago Checkout Pro** (tarjetas, OXXO, SPEI, mejor aceptación en México).
Alternativa: Stripe, si el cliente quiere cobrar también en USD a El Paso. Decisión en [decisiones-y-riesgos.md](decisiones-y-riesgos.md).

## Tareas

### Flujo de compra (UI)
- [ ] Reemplazar el modal "Pagos en línea muy pronto" por el paso de datos: nombre, teléfono, correo, dirección, referencias, notas.
- [ ] Selector de zona de entrega (hoy solo Ciudad Juárez) con costo de envío y mínimo de compra tomados de `delivery_zones`.
- [ ] Confirmación de mayoría de edad (casilla explícita, además del age gate).
- [ ] Aceptación de términos y aviso de privacidad (casilla con enlace).
- [ ] Estados de carga y error claros; el botón no se puede pulsar dos veces.

### Servidor
- [ ] `app/api/checkout/route.ts`: quitar el mock y quedarse con el contrato `CheckoutRequest` / `CheckoutResult` de `lib/cart/types.ts`.
  1. Validar el cuerpo (tipos, cantidades enteras > 0, límites máximos por línea y por pedido).
  2. Leer productos y precios **de la base de datos**, nunca del cliente; rechazar productos no disponibles.
  3. Verificar zona de entrega, mínimo de compra y stock.
  4. Calcular subtotal, envío y total en servidor.
  5. Crear el pedido en estado `pendiente` y reservar inventario.
  6. Crear la preferencia/sesión de pago y responder `{ status: "redirect", url }`.
- [ ] `app/api/checkout/webhook/route.ts`:
  - Verificar la firma del webhook de la pasarela.
  - Consultar el estado real del pago contra la API de la pasarela (no confiar solo en el cuerpo recibido).
  - Operación **idempotente**: el mismo evento dos veces no duplica nada.
  - Actualizar pedido (`pagado`, `rechazado`, `expirado`) y descontar o liberar inventario.
- [ ] Tarea para liberar reservas vencidas (cron de Vercel o función programada).
- [ ] Limitar la tasa de peticiones al checkout (protección básica contra abuso).

### Páginas
- [ ] `/pedido/[id]` con estado del pedido (acceso por token no adivinable, no por id secuencial).
- [ ] Páginas de éxito, pendiente (pago en OXXO/SPEI) y fallo, con salida clara a WhatsApp.
- [ ] Vaciar el carrito solo cuando el pago se confirma.

### Pruebas
- [ ] Tarjetas de prueba de la pasarela: aprobada, rechazada, pendiente.
- [ ] Webhook duplicado y fuera de orden.
- [ ] Carrito manipulado en el navegador (precio, cantidad, producto inexistente): el servidor debe rechazarlo.
- [ ] Doble clic en "Pagar" y pago abandonado.
- [ ] Pruebas automatizadas de la lógica de cálculo de totales y de validación.

## Criterios de salida
- Pedido de prueba pagado en sandbox queda en `pagado` en la base de datos y descuenta inventario.
- Ningún precio ni total depende de datos enviados por el navegador.
- Webhook idempotente y con firma verificada.

## Riesgos
- Aprobación de la cuenta de la pasarela puede tardar y exigir documentos del cliente: **iniciar el trámite en la semana 1**.
- Algunas pasarelas restringen la venta de alcohol: confirmar políticas antes de construir de más (ver Fase 4).
