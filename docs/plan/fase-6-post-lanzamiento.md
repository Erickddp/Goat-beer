# Fase 6 — Después del lanzamiento (semana 7 en adelante)

**Objetivo:** mejorar con datos reales. El orden se decide con lo que se vea en las ventas y en la analítica.
Cada ítem es independiente; se priorizan en la revisión semanal.

## 1. Reseñas reales (prioridad alta, primeras semanas)
- [ ] Pedir reseña a clientes tras la entrega (mensaje de WhatsApp o correo con enlace).
- [ ] Guardar reseñas en la base de datos con moderación manual antes de publicar; autorización explícita del nombre mostrado.
- [ ] Alimentar `content/reviews.ts` (o su reemplazo en base de datos) manteniendo el tipo `Review` y marcar `verifiedPurchase` cuando haya pedido asociado.
- [ ] Quitar las tarjetas esqueleto "Ejemplo" cuando haya reseñas reales suficientes (mínimo recomendado: 3).
- [ ] Nunca inventar ni editar testimonios.

## 2. Nuevos productos y estilos
- [ ] Activar productos "Próximamente" cuando el cliente los libere (cambio de estado en la base de datos).
- [ ] Promociones, cupones y envíos gratis por monto.
- [ ] Suscripción o "club" de cerveza (si el cliente lo quiere).

## 3. Inglés para El Paso
- [ ] Llenar `content/i18n/en.ts` y agregar selector de idioma (es por defecto).
- [ ] Precios en USD y envío transfronterizo: **requiere análisis legal y logístico aparte** (importación de alcohol); no asumir que se puede.
- [ ] Si solo es informativo, versión en inglés sin tienda para El Paso.

## 4. Agente de ventas de WhatsApp
- [ ] Definir con el cliente qué debe resolver el agente: dudas de producto, tomar pedidos, estado de pedido, horarios.
- [ ] Flujo en n8n con webhook de WhatsApp Business API; implementar la interfaz de `lib/agent/types.ts`.
- [ ] El agente consulta catálogo, precios e inventario desde la base de datos (misma fuente que el sitio) y crea pedidos por el mismo flujo de checkout.
- [ ] Reglas duras: no vender a menores, no prometer fuera de zona, escalar a una persona cuando no sepa.
- [ ] Registro de conversaciones y aviso de privacidad actualizado.

## 5. Experiencia
- [ ] 3D con React Three Fiber + drei (botella interactiva): solo si el rendimiento móvil se mantiene ≥ 85 en Lighthouse; cargar bajo demanda.
- [ ] Mejoras al hero según métricas (tiempo de carga, abandono antes del primer scroll).
- [ ] Pruebas A/B de textos y de la posición del botón "Agregar".

## 6. Operación
- [ ] Panel de administración propio (productos, precios, inventario, pedidos) si la tabla/hoja se queda corta.
- [ ] Facturación automática (CFDI) con un proveedor.
- [ ] Integración con logística/rutas de reparto.
- [ ] Programa de recompra: recordatorio a los 15–30 días.
- [ ] Reporte semanal automático de ventas (n8n) al cliente.

## 7. Deuda técnica
- [ ] Pruebas end-to-end con Playwright del flujo de compra, ejecutadas en CI antes de cada despliegue.
- [ ] Actualizar dependencias de forma programada.
- [ ] Revisar peso de `public/frames/` y evaluar mover los frames a un CDN/almacenamiento de objetos.
