# Fase 4 — Operación y legal (semana 4: 14–20 dic)

**Objetivo:** que el negocio pueda recibir, preparar y entregar pedidos, y que el sitio cumpla lo legal para vender alcohol en línea.

**Entregable:** avisos legales reales, notificaciones de pedido funcionando y un procedimiento de entrega acordado.

## A. Legal y cumplimiento
> No es asesoría legal: el cliente debe validarlo con su contador o abogado.
- [ ] Confirmar con el cliente que cuenta con **licencias y permisos** para vender y repartir cerveza a domicilio (federales, estatales y municipales).
- [ ] Confirmar que la **pasarela elegida permite** vender alcohol y qué condiciones pide (leer sus políticas de uso aceptable).
- [ ] Aviso de privacidad real (reemplaza la página placeholder `app/aviso-de-privacidad/page.tsx`), conforme a la LFPDPPP: responsable, datos que se recogen, finalidades, derechos ARCO, contacto.
- [ ] Términos y condiciones de venta: precios, formas de pago, entregas, cambios y devoluciones, zona de cobertura.
- [ ] Política de envíos: horarios, costos, tiempos, qué pasa si no hay nadie.
- [ ] Verificación de edad en la entrega: el repartidor pide identificación; dejarlo escrito en términos y en la confirmación del pedido.
- [ ] Leyendas obligatorias visibles ("Evita el exceso", "Prohibida la venta a menores de edad") en footer y checkout. Confirmar con el cliente si hay leyendas sanitarias adicionales exigidas en publicidad de bebidas alcohólicas.
- [ ] Datos fiscales del negocio en el pie (razón social, RFC) si el cliente lo desea o lo exige la normativa; definir el flujo de facturación (por WhatsApp/correo al inicio).

## B. Operación de pedidos
- [ ] Notificación al negocio por cada pedido pagado: WhatsApp y/o correo con resumen, dirección y teléfono (n8n o servicio de correo transaccional).
- [ ] Correo o mensaje de confirmación al cliente con número de pedido y enlace a `/pedido/[id]`.
- [ ] Vista sencilla para el cliente del negocio para ver y cambiar el estado del pedido (`pagado → preparando → en camino → entregado`). Opciones: panel protegido en el sitio, tabla en Supabase o una hoja alimentada por n8n; elegir la más simple que el cliente use de verdad.
- [ ] Definir quién reparte, horarios, tiempos de entrega y qué pasa con pedidos fuera de zona.
- [ ] Procedimiento de cancelación y reembolso (quién lo ejecuta en la pasarela y cómo se refleja en el inventario).

## C. Contenido real
- [ ] Reemplazar los `null` de `content/site.ts` por los datos reales: WhatsApp, Instagram, Facebook, correo.
- [ ] Precios definitivos y zonas de entrega con costos.
- [ ] Revisar todo el copy de producto con el cliente (notas de cata, historia, maridajes). Confirmar la foto y el nombre del maridaje de mole.

## D. Dominio y correo
- [ ] Dominio definitivo comprado y apuntado a Vercel (con SSL).
- [ ] Correo transaccional con el dominio (SPF, DKIM, DMARC configurados para no caer en spam).

## Criterios de salida
- Aviso de privacidad y términos reales publicados.
- Un pedido de prueba dispara las notificaciones correctas al negocio y al cliente.
- El cliente confirma por escrito que tiene permisos de venta y que la pasarela acepta su giro.

## Riesgos
- Permisos o política de la pasarela pueden impedir la venta en línea con pago: **plan B** = checkout que genera el pedido y lo cierra por WhatsApp (pago contra entrega o transferencia) hasta resolverlo.
