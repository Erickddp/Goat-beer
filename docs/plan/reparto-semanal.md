# Reparto semanal: quién hace qué

Lista básica. Tres columnas de responsabilidad: **Claude** (código, documentos, pruebas), **Tú** (Erick: cuentas, despliegue, trato con el cliente, pruebas en dispositivos reales) y **Cliente** (decisiones, datos, permisos, assets).
Cada semana termina con un **avance para el cliente** (formato al final).

## Semana 1 (23–29 nov) — Preview lista y pedir datos

| Claude | Tú | Cliente |
|---|---|---|
| Mejorar `/tienda` de Lighthouse 80 a 85 (LCP y CSS bloqueante) | Desplegar a Vercel (importar repo, URL `*.vercel.app`) y pasarme la URL | Revisar la preview |
| Repetir Lighthouse sobre la URL de Vercel | Enviar la URL y la lista de [pendientes](pendientes-cliente.md) | Empezar el alta de la pasarela de pago (Mercado Pago o Stripe) |
| Preparar el mensaje y el avance semanal #1 | Probar sonido y hero en iPhone y Android reales | Confirmar permisos para vender y repartir cerveza a domicilio |
| | Agendar llamada de feedback (20–30 min) | Mandar fecha de entrega del diseño final de botella |

**Avance #1 al cliente:** preview en línea, qué incluye, qué datos faltan.

## Semana 2 (30 nov–6 dic) — Diseño final y base de datos

| Claude | Tú | Cliente |
|---|---|---|
| Integrar videos e imágenes nuevos ([procedimiento](cambio-diseno-botella.md)) | Pasarme el diseño final, videos, logo y fotos en cuanto lleguen | Entregar diseño final, videos `pour` y `overflow`, logo, foto con fondo transparente |
| Ajustar tiempos del hero (`hero.ts`) y regenerar frames | Crear el proyecto de Supabase y darme las claves (en variables de Vercel, no por chat) | Precios definitivos |
| Pasar el catálogo a base de datos con inventario | Confirmar con el cliente la decisión de pasarela | Inventario inicial y número de WhatsApp |
| Validar el carrito contra el catálogo | | |

**Avance #2:** sitio con el diseño nuevo; tienda leyendo de base de datos.

## Semana 3 (7–13 dic) — Checkout y pagos

| Claude | Tú | Cliente |
|---|---|---|
| Formulario de datos de entrega y confirmaciones | Pasar credenciales **de prueba** de la pasarela (a Vercel) | Zonas de entrega, costo de envío, mínimo de compra y horarios |
| `/api/checkout` real: precios en servidor, zona, stock | Registrar la URL del webhook en la pasarela | Razón social, RFC y domicilio fiscal |
| Webhook con firma e idempotencia | Hacer pagos de prueba con tarjetas de sandbox | Redes sociales y correo del negocio |
| Páginas de pedido, éxito y fallo; pruebas automáticas | | |

**Avance #3:** compra de prueba completa, de carrito a pago confirmado.

## Semana 4 (14–20 dic) — Operación y legal

| Claude | Tú | Cliente |
|---|---|---|
| Aviso de privacidad y términos (borrador) | Comprar dominio y apuntarlo a Vercel | **Confirmar por escrito sus permisos de venta** |
| Notificación de pedido al negocio y al cliente (n8n o correo) | Configurar correo con el dominio | Validar aviso, términos y política de envíos con contador o abogado |
| Quitar datos `null` de `content/site.ts` | Definir con el cliente cómo verá y cambiará el estado de los pedidos | Aprobar copy final |
| Estados del pedido y cancelaciones | | Definir quién reparte |

**Avance #4:** pedido de prueba que avisa al negocio; textos legales listos para revisar.

## Semanas 5 y 6 (21 dic–3 ene) — Pruebas y lanzamiento

| Claude | Tú | Cliente |
|---|---|---|
| Revisión de seguridad, errores, accesibilidad y Lighthouse | Pasar credenciales **reales** de la pasarela (a Vercel) | Aprobar el lanzamiento por escrito |
| Quitar `noindex`, SEO, `sitemap`, `og-image` final | Pedido real de monto bajo y entrega física de prueba | Compartir con grupo cerrado (lanzamiento suave) |
| Alertas y registro de errores; copia de la base de datos | Probar en dispositivos reales | Anunciar en redes en el lanzamiento público |
| Ajustes del lanzamiento suave | Dar soporte a los primeros pedidos | |

**Avance #5 y #6:** sitio en producción; primeros pedidos reales.

## Después (enero en adelante)
Claude: reseñas reales, nuevos productos, inglés, agente de WhatsApp, 3D. Tú y el cliente: priorizar según las ventas. Ver [fase 6](fase-6-post-lanzamiento.md).

## Formato del avance semanal (mensaje corto al cliente)

1. **Lo que se hizo** (3–5 puntos, con captura o enlace).
2. **Lo que viene la próxima semana**.
3. **Lo que necesito del cliente** (con fecha límite).
4. **Riesgos o cambios de fecha**, si los hay.

Cada lunes: Claude actualiza la bitácora de [README.md](README.md) y deja el borrador del avance; tú lo revisas y lo envías.

## Lo que más se puede atrasar (ver [riesgos](decisiones-y-riesgos.md))
1. Alta de la pasarela de pago: empezarla ya.
2. Permisos de venta del cliente: preguntarlos ya.
3. Diseño final de botella: sin esto, la semana 2 avanza solo en la parte de datos.
