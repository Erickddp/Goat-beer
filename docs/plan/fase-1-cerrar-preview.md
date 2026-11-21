# Fase 1 — Cerrar la preview (semana 1: 23–29 nov)

**Objetivo:** dejar la preview verificada, desplegada en Vercel y enviada al cliente, y en paralelo
pedirle todo lo que bloquea las fases siguientes.

**Entregable:** URL de preview pública + mensaje al cliente con la lista de pendientes.

## Tareas

### Verificación técnica
- [ ] `npm install` y `npm run build` sin errores ni advertencias relevantes.
- [ ] `npm run lint` limpio.
- [ ] Capturas con Playwright de cada sección a **375, 768, 1280 y 1920 px**; revisar desbordes, cortes de texto, solapes.
- [ ] Hero: probar el recorrido completo en escritorio y móvil (pop, chorro, desborde, texto en cada momento).
- [ ] Hero con `prefers-reduced-motion`: imagen fija, sin pin.
- [ ] Sonido: se desbloquea con el clic del age gate, el botón de silencio funciona, no suena antes de interactuar.
- [ ] Age gate: guarda en localStorage con try/catch; "No" redirige o bloquea correctamente.
- [ ] Carrito: agregar, quitar, cambiar cantidad, persistencia al recargar, modal "Pagar".
- [ ] Lighthouse móvil, Performance ≥ 85 (anotar resultado y los 3 cuellos principales).
- [ ] Accesibilidad: contraste AA, foco visible, `alt` en todas las imágenes (falta el `imageAlt` del maridaje de mole).

### Despliegue
- [ ] Proyecto en Vercel conectado al repo (rama principal = producción de la preview).
- [ ] Verificar que `.vercelignore` no deja fuera nada que el sitio necesite (los `.mp4` no se despliegan; los frames y el audio sí).
- [ ] Dominio provisional (`*.vercel.app`) y contraseña o enlace no listado para la preview, si el cliente lo prefiere.
- [ ] Revisar el peso total de `public/frames/` y el tiempo de carga en 4G simulada.

### Pendientes con el cliente
- [ ] Enviar la URL y la lista de [pendientes del cliente](pendientes-cliente.md).
- [ ] Agendar una llamada corta de 20–30 min para recoger feedback de diseño y copy.

### Correcciones visibles que no dependen del cliente
- [ ] Completar `imageAlt` de `pairing-mole.png` (o dejarlo pendiente si la foto se cambia; ver `ASSETS_PENDIENTES.md`).
- [ ] Revisar que ningún texto mencione datos aún inexistentes (WhatsApp, redes) como si fueran reales: con `null` los botones deben degradar con gracia.
- [ ] Limpiar el `README.md` (hoy es el de `create-next-app`): qué es, cómo correrlo, estructura, enlace a este plan.

## Criterios de salida
- Build y lint sin errores.
- Capturas de los 4 anchos revisadas sin defectos graves.
- Lighthouse móvil ≥ 85 o plan de mejora anotado.
- Preview desplegada y enviada al cliente.

## Riesgos
- El peso de los frames (159 + 64 por variante) puede afectar Lighthouse móvil: considerar reducir calidad WebP o cantidad de frames si no llega a 85.
- Autoplay de audio: algunos navegadores móviles son estrictos; probar en iOS Safari y Chrome Android reales.
