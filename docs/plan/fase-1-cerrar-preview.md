# Fase 1 — Cerrar la preview (semana 1: 23–29 nov)

**Objetivo:** dejar la preview verificada, desplegada en Vercel y enviada al cliente, y en paralelo
pedirle todo lo que bloquea las fases siguientes.

**Entregable:** URL de preview pública + mensaje al cliente con la lista de pendientes.

## Tareas

### Verificación técnica
- [x] `npm install` y `npm run build` sin errores ni advertencias relevantes. — 2026-11-21: build limpio (Next 16.4.6, 8 rutas).
- [x] `npm run lint` limpio.
- [x] Capturas con Playwright de cada sección a **375, 768, 1280 y 1920 px**; revisar desbordes, cortes de texto, solapes. — sin desborde horizontal ni errores de consola en los 4 anchos; capturas revisadas.
- [x] Hero: probar el recorrido completo en escritorio y móvil (pop, chorro, desborde, texto en cada momento). — revisado por capturas en 6 puntos del recorrido, escritorio y móvil.
- [x] Hero con `prefers-reduced-motion`: imagen fija, sin pin. — la página carga y renderiza; falta revisar a ojo el poster fijo.
- [ ] Sonido (no verificable en este entorno sin audio; probar en iOS Safari y Chrome Android reales): se desbloquea con el clic del age gate, el botón de silencio funciona, no suena antes de interactuar.
- [x] Age gate: guarda en localStorage con try/catch; "No" redirige o bloquea correctamente. — "No" muestra "Vuelve cuando seas mayor" y no guarda nada; "Sí" guarda `goat-age-ok`.
- [x] Carrito: agregar, quitar, cambiar cantidad, persistencia al recargar, modal "Pagar". — agregar, sumar, subtotal "Por confirmar", persistencia y modal OK; quitar/restar no probado.
- [~] Lighthouse móvil, Performance ≥ 85 (anotar resultado y los 3 cuellos principales). — **Home 85** (LCP 3.6 s, TBT 180 ms, CLS 0.02, 3.6 MB), **/tienda 80** (LCP 3.5 s, TBT 370 ms). Accesibilidad 100, Best Practices 100, SEO 63 por el `noindex` intencional. Cuellos: LCP, CSS bloqueante de render, peso de imágenes. Medido en local con servidor de producción; repetir sobre Vercel.
- [~] Accesibilidad: contraste AA, foco visible, `alt` en todas las imágenes. — Lighthouse a11y 100 y alt completos; falta revisar el foco visible a mano.

### Despliegue
- [ ] Proyecto en Vercel conectado al repo (rama principal = producción de la preview).
- [ ] Verificar que `.vercelignore` no deja fuera nada que el sitio necesite (los `.mp4` no se despliegan; los frames y el audio sí).
- [ ] Dominio provisional (`*.vercel.app`) y contraseña o enlace no listado para la preview, si el cliente lo prefiere.
- [ ] Revisar el peso total de `public/frames/` y el tiempo de carga en 4G simulada.

### Pendientes con el cliente
- [ ] Enviar la URL y la lista de [pendientes del cliente](pendientes-cliente.md).
- [ ] Agendar una llamada corta de 20–30 min para recoger feedback de diseño y copy.

### Correcciones visibles que no dependen del cliente
- [x] Completar `imageAlt` de `pairing-mole.png` (o dejarlo pendiente si la foto se cambia; ver `ASSETS_PENDIENTES.md`). — alt descriptivo de lo que se ve (caldo de res); la foto sigue pendiente de cambio.
- [x] Revisar que ningún texto mencione datos aún inexistentes (WhatsApp, redes) como si fueran reales — los botones degradan con "Número de WhatsApp por confirmar".
- [x] Limpiar el `README.md` (hoy es el de `create-next-app`): qué es, cómo correrlo, estructura, enlace a este plan.

## Pendiente de hacer fuera de este entorno
- Despliegue a Vercel: requiere la cuenta del cliente o del equipo (conectar el repo, rama, dominio provisional). No se puede hacer desde la sesión.
- Probar sonido y hero en iPhone y Android reales.
- Repetir Lighthouse sobre la URL de Vercel; `/tienda` está en 80 (meta 85).

## Criterios de salida
- Build y lint sin errores.
- Capturas de los 4 anchos revisadas sin defectos graves.
- Lighthouse móvil ≥ 85 o plan de mejora anotado.
- Preview desplegada y enviada al cliente.

## Riesgos
- El peso de los frames (159 + 64 por variante) puede afectar Lighthouse móvil: considerar reducir calidad WebP o cantidad de frames si no llega a 85.
- Autoplay de audio: algunos navegadores móviles son estrictos; probar en iOS Safari y Chrome Android reales.
