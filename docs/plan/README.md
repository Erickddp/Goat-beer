# Plan de proyecto — Drunk G.O.A.T. Brewery

> Documento vivo. Es una **previa**: se revisa y se ajusta cada semana (ver "Revisión semanal").
> Creado: 2026-11-21 · Meta: **vender en línea desde el sitio a inicios de enero de 2027**.

## Estado de partida (2026-11-21)

Preview visual completa y sin backend: hero con secuencia de frames en canvas, las 11 secciones one-page,
tienda con carrito (Zustand) y modal de "pagos muy pronto", `/api/checkout` mock, datos en `content/`.
Detalle de pendientes de assets en `ASSETS_PENDIENTES.md`.

## Fases y calendario

| Fase | Documento | Semana | Fechas (aprox.) | Resultado |
|---|---|---|---|---|
| 1 | [Cerrar la preview](fase-1-cerrar-preview.md) | 1 | 23–29 nov | Preview verificada, desplegada y enviada al cliente |
| 2 | [Diseño nuevo y datos de pedidos](fase-2-diseno-y-datos.md) | 2 | 30 nov–6 dic | Assets nuevos integrados; catálogo e inventario en base de datos |
| 3 | [Checkout y pagos](fase-3-checkout.md) | 3 | 7–13 dic | Compra pagada de punta a punta en sandbox |
| 4 | [Operación y legal](fase-4-operacion-y-legal.md) | 4 | 14–20 dic | Avisos legales, envíos, notificaciones de pedido, permisos de venta |
| 5 | [Pruebas y lanzamiento](fase-5-pruebas-y-lanzamiento.md) | 5–6 | 21 dic–3 ene | Lanzamiento suave y luego público |
| 6 | [Después del lanzamiento](fase-6-post-lanzamiento.md) | 7+ | enero en adelante | Reseñas reales, inglés, agente de WhatsApp, 3D |

Material de apoyo:
- [Pendientes del cliente](pendientes-cliente.md): lo que hay que pedirle, con prioridad y fecha límite.
- [Cambio de diseño de botella](cambio-diseno-botella.md): qué se reemplaza y cómo, cuando el cliente entregue el diseño final.
- [Decisiones abiertas y riesgos](decisiones-y-riesgos.md).

## Alcance del primer lanzamiento

**Entra:** tienda con pago real, pedidos guardados, confirmación al cliente y aviso al negocio, zona de entrega
Ciudad Juárez, avisos legales reales, WhatsApp como respaldo, móvil primero.

**No entra** (para no apretar el calendario): inglés/El Paso, 3D, agente de ventas con IA, reseñas reales
(llegan tras las primeras ventas), otros estilos de cerveza ("Próximamente" se queda).

## Revisión semanal

Cada lunes (o al cierre de cada semana):
1. Marcar lo hecho en el documento de la fase (casillas `[x]`).
2. Mover lo que se atrasó a la semana siguiente y anotar el motivo en "Bitácora" abajo.
3. Revisar [pendientes del cliente](pendientes-cliente.md): ¿qué sigue sin llegar y a qué fase bloquea?
4. Decidir si el lanzamiento sigue en fecha o se activa el plan B (ver riesgos).

## Bitácora

| Fecha | Nota |
|---|---|
| 2026-11-21 | Plan inicial creado. Preview ya cubre las 11 secciones; falta cierre de calidad y datos del cliente. |

## Reglas que se mantienen durante todo el proyecto

- `content/` sigue siendo la única fuente de datos hasta que la Fase 2 la pase a base de datos; los componentes no cambian de forma.
- Los precios y el inventario **se recalculan siempre en servidor**; el cliente (navegador) nunca es fuente de verdad.
- Ninguna credencial en el repo: todo en variables de entorno de Vercel.
- Antes de decir "listo" en cualquier fase: `npm run build` sin errores y revisión visual a 375, 768, 1280 y 1920 px.
- Todo el copy en español, con la voz de la marca. Nada de reseñas ni nombres inventados que parezcan reales.
- Next.js de este repo puede traer cambios incompatibles con lo que se conoce: leer la guía en `node_modules/next/dist/docs/` antes de tocar rutas, handlers o configuración (ver `AGENTS.md`).
