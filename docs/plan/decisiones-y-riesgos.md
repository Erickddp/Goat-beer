# Decisiones abiertas y riesgos

## Decisiones abiertas

| # | Decisión | Propuesta por defecto | Quién decide | Antes de |
|---|---|---|---|---|
| D1 | Pasarela de pago | Mercado Pago Checkout Pro (México: tarjeta, OXXO, SPEI). Stripe si se cobra en USD | Cliente + desarrollo | Fase 3 (iniciar alta en semana 1) |
| D2 | Base de datos y hosting | Código en Postgres estándar (decidido). Hosting: **Vercel + Supabase** recomendado; **Railway** es válido (ver [base-de-datos.md](base-de-datos.md)) | Erick | Semana 2 |
| D3 | Cómo ve y gestiona pedidos el negocio | Aviso por WhatsApp/correo + tabla simple; panel propio después | Cliente | Fase 4 |
| D4 | Correo transaccional | Resend o similar, con dominio propio | Desarrollo | Fase 4 |
| D5 | Medios de pago activos al inicio | Tarjeta + SPEI/OXXO si la pasarela los aprueba | Cliente | Fase 3 |
| D6 | Reserva de inventario | 15 min desde que se inicia el pago | Desarrollo + cliente | Fase 2 |
| D7 | Venta a El Paso | Fuera del primer lanzamiento | Cliente | Fase 6 |
| D8 | Facturación | Manual por WhatsApp/correo al inicio; CFDI automático después | Cliente + contador | Fase 4 |
| D9 | Analítica | Vercel Analytics o Plausible (sin cookies invasivas) | Desarrollo | Fase 5 |
| D10 | Protección de la preview | Enlace no listado o contraseña | Cliente | Fase 1 |

## Riesgos

| # | Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|---|
| R1 | El diseño final de botella llega tarde | Media | Medio | La Fase 2 parte B (datos) no depende de él; ver [cambio-diseno-botella.md](cambio-diseno-botella.md) |
| R2 | La pasarela no aprueba el giro (alcohol) o tarda | Media | **Alto** | Iniciar el alta en la semana 1; leer su política de uso; plan B por WhatsApp |
| R3 | El cliente no tiene todos los permisos de venta/reparto | Media | **Alto** | Preguntar ya (pendiente #1); no lanzar venta pública sin confirmación escrita |
| R4 | Datos del cliente (precios, contacto, fiscales) llegan tarde | Alta | Medio | Fechas límite en [pendientes-cliente.md](pendientes-cliente.md); sustitutos temporales |
| R5 | Rendimiento móvil del hero (muchos frames) baja Lighthouse < 85 | Media | Medio | Bajar calidad/cantidad de frames, precarga progresiva, medir cada semana |
| R6 | Festividades (24 dic–1 ene) reducen disponibilidad de todos | Alta | Medio | Pruebas antes del 23 dic; acordar días de entrega; lanzamiento suave primero |
| R7 | Sobreventa por compras simultáneas | Baja | Medio | Stock atómico en la base de datos y reserva de inventario |
| R8 | Manipulación de precios o carrito desde el navegador | Media | **Alto** | Recalcular todo en servidor; pruebas dedicadas en Fase 3 |
| R9 | Webhooks duplicados o perdidos | Media | Medio | Idempotencia, verificación de firma, conciliación con la API de la pasarela, alertas |
| R10 | Etiquetas con texto incorrecto llegan a producción | Media | Medio | Lista de revisión en [cambio-diseno-botella.md](cambio-diseno-botella.md) |
| R11 | Venta a menores | Baja | **Alto** | Age gate + casilla en checkout + verificación de ID en la entrega + términos |
| R12 | Autoplay de audio bloqueado en móviles | Media | Bajo | El age gate desbloquea el audio; probar en iOS y Android reales; el sitio funciona en silencio |

## Plan B de lanzamiento
Si R2 o R3 bloquean el cobro en línea: lanzar con catálogo y carrito, y que **"Pagar" genere el pedido y lo cierre por WhatsApp**
(cobro por transferencia o contra entrega). El pago en línea se activa después sin rehacer el sitio.
