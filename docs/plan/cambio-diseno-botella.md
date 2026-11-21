# Procedimiento: cambio de diseño de botella

Cuando el cliente entregue el diseño final. **Cambiar solo el video no basta**: la botella aparece en más sitios.
Lo ideal es pedir **un set completo y coherente** (misma cámara, luz y composición que el actual) y reemplazar todo junto.

## 1. Qué hay que reemplazar

| Asset | Dónde se usa | Cómo se regenera |
|---|---|---|
| `public/media/pour.mp4` | Hero: destape y servido | Reemplazar y correr el script de frames |
| `public/media/overflow.mp4` | Hero: espuma que cubre la pantalla | Reemplazar y correr el script de frames |
| `public/frames/**` y `public/sfx/*.mp3` | Salida del script | `bash scripts/extract-frames.sh` |
| `kf-01-closed.jpg` … `kf-04-overflow.jpg` | Fallback sin video y carga inicial | Reemplazar; mantener nombres y 2752×1536 |
| `hero-bottle-16x9.png`, `hero-bottle-9x16.png` | Hero estático / base del recorte | Reemplazar |
| `public/media/_derived/bottle-cutout.png` | Tarjetas de producto y carrito (`content/products.ts`) | Sustituir por PNG/WebP con **transparencia real** (~500×1500) |
| `glass-foam.png` | Sección de cata / copa | Reemplazar (hoy tiene la etiqueta mal escrita) |
| `pairing-*.png` | Maridaje | Reemplazar los que muestran la botella |
| `public/og-image.jpg` | Vista previa al compartir (1200×630) | Derivar de `hero-bottle-16x9` |
| `app/icon.png`, `app/apple-icon.png` | Favicon | Solo si cambia el logo |
| Logo (`logo.svg`/`.png`) | Header, footer, age gate | Nuevo asset; sustituir el wordmark provisional |

## 2. Pasos

1. Copiar los videos nuevos a `public/media/` con los mismos nombres.
2. Si el video no mide 10 s o 1280×720, ajustar al inicio de `scripts/extract-frames.sh`: `POUR_FRAMES`, `POUR_DESKTOP_W`, `POUR_MOBILE_W`, `OVERFLOW_*`.
3. Medir los **momentos clave** del video nuevo (corcholata, inclinación, inicio del chorro, botella fuera, desborde).
4. Actualizar `POP_START`, `POP_DUR`, `POUR_START`, `POUR_DUR` en el script (recortan el audio).
5. Correr `bash scripts/extract-frames.sh` (sin ffmpeg en el PATH: `FFMPEG=… FFPROBE=… bash scripts/extract-frames.sh`).
6. En `content/hero.ts`:
   - `frameCount` de `main` y `overlay` con la cantidad real generada.
   - `beats` y `chapters` con los tiempos del paso 3 (se escriben en segundos del video; la constante `POUR_END` reparte el recorrido).
   - Puntos de la `camera` (`desktop` y `mobile`): ajustar `cx`, `cy` y zoom si la botella o la copa cambian de posición.
   - `reducedPoster` apuntando a un frame final bueno de la copa servida.
   - `width`/`height` si cambia la resolución.
7. Reemplazar los demás assets de la tabla y actualizar los `alt` que describan la botella.
8. Validar el negro del fondo: los frames se igualan a `#0A0806` con el filtro `LIFT_TO_INK`; si el fondo del video nuevo es distinto, revisar que no se vea el borde del cuadro.
9. Probar el recorrido completo en escritorio y móvil (375 px), con sonido, y con `prefers-reduced-motion`.
10. Medir peso y Lighthouse móvil; si se pasa, bajar `WEBP_Q` o `POUR_FRAMES`.
11. Actualizar `ASSETS_PENDIENTES.md` y quitar el aviso de etiquetas incorrectas.

## 3. Lista de revisión
- [ ] Texto de la etiqueta correcto en todos los assets ("Drunk G.O.A.T. Brewery").
- [ ] Pop y chorro suenan en el momento correcto.
- [ ] Textos "Destápala." → "Mezquite Stout" → "Hecha en la frontera." aparecen sobre la acción correcta.
- [ ] Sin saltos entre el último frame del pour y la espuma.
- [ ] Fallback de keyframes coherente con el video (activable con `source = keyframesSource`).
- [ ] Tarjetas de la tienda sin halo ni borde de recorte alrededor de la botella.
- [ ] `og-image` actualizada y verificada al compartir en WhatsApp/Facebook.

## 4. Consejos para el cliente al generar el set
- Mismo set que `kf-01-closed`: fondo negro, botella a la izquierda, copa con logo a la derecha, misma cámara y luz.
- Videos y keyframes en 16:9 y, si es posible, una versión 9:16 para móvil.
- Botella sobre fondo transparente o negro puro, sin ruido en las sombras.
- Revisar con lupa el texto de la etiqueta antes de entregar.
