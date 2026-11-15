# Assets pendientes — `public/media/`

Última revisión: 2026-11-15. Los originales de Gemini están en `src/*.jfif`; se convirtieron a PNG con los nombres de CLAUDE.md.

## Video del hero (2026-11-15)

| Archivo | Origen | Uso |
|---|---|---|
| `pour.mp4` | `src/pour.mp4` (1280×720, 10 s, con audio) | 159 frames en `public/frames/pour/` + `public/sfx/pop.mp3` y `pour.mp3` |
| `overflow.mp4` | `src/overflow - Trim.mp4` (1280×720, 9.7 s) | 64 frames en `public/frames/overflow/` (espuma que cubre la pantalla) |

Regenerar: `bash scripts/extract-frames.sh` (sin ffmpeg en el PATH: `FFMPEG=… FFPROBE=… bash scripts/extract-frames.sh`).
Los `.mp4` no se despliegan (`.vercelignore`); solo los frames y el audio.

## Ya están (origen → destino)

| Archivo | Origen | Notas |
|---|---|---|
| `hero-bottle-16x9.png` | `src/1escritorio.jfif` | 2752×1536 |
| `hero-bottle-9x16.png` | `src/1movil.jfif` | 1536×2752 |
| `glass-foam.png` | `src/2final.jfif` | 1792×2400 (vertical) |
| `ingredients.png` | `src/3v1.jfif` | 2752×1536, sirve para hotspots |
| `desert-border.png` | `src/4.jfif` | 2752×1536 |
| `splash.png` | `src/5.jfif` | 2752×1536 |
| `pairing-chocolate.png` | `src/6.jfif` | 2048×2048 |
| `texture-foam.jpg` | `src/texture-foam.jpg` | 2752×1536 |
| `kf-01-closed.jpg` | `src/kf-01-closed.jpg` | 2752×1536, botella cerrada + copa vacía con logo |
| `kf-02-pop.jpg` | `src/kf-02-pop.jpg` | 2752×1536, corcholata saltando |
| `kf-03-pour.jpg` | `src/kf-03-pour.jpg` | 2752×1536, botella horizontal sirviendo |
| `kf-04-overflow.jpg` | `src/kf-04-overflow.jpg` | 2752×1536, copa desbordando |
| `pairing-carne-asada.png` | `src/5final.jfif` | 2048×2048. **Extra**: corte de carne con botella, para el maridaje "carne asada" |

Alternativas guardadas en `public/media/_alternativas/` (no se usan): copa desbordada (`2.jfif`), ingredientes vertical (`3.jfif`), desierto con etiqueta azulada (`4v1.jfif`; la etiqueta no coincide con la marca) y kf-01 con copa sin logo (`kf01.jfif`).

## Por revisar

- `pairing-mole.png` (agregado por el usuario): la foto parece **caldo de res** (elote, tuétano, verduras), no mole. Confirmar con el cliente o regenerar. Su `imageAlt` en `content/i18n/es.ts` está vacío.

## Faltan

| Archivo | Para qué | Mientras tanto |
|---|---|---|
| `ambient-desert.mp4` | Fondo en loop de La historia | `desert-border.png` con parallax |
| `texture-liquid.png` | Textura de stout líquida (fondos, barra SRM) | Gradiente CSS stout→rubí |
| `logo.svg` (o `logo.png` con fondo transparente) | Header, footer, age gate | Wordmark tipográfico |
| `pairing-tacos.png` (opcional) | Si se prefiere tacos de carne asada en vez del corte de `pairing-carne-asada.png` | Usar `pairing-carne-asada.png` |

### Recomendaciones para generar los que faltan
- Mismo set que `kf-01-closed`: fondo negro, botella a la izquierda, copa con logo a la derecha, misma cámara y luz. Así el crossfade/secuencia no salta.
- `kf-02`…`kf-04` y `pour.mp4` en 16:9 (2752×1536) y, si es posible, una versión 9:16 para móvil.
- Logo en SVG o PNG transparente de al menos 1024 px.

## ⚠️ Texto incorrecto en las etiquetas generadas (revisión 2026-11-15)

Gemini escribió mal el nombre de la marca en las etiquetas:
- Botella (`hero-bottle-*`, `kf-01`, maridajes, tienda): dice **"Sweet GOAT Brewing"**.
- Copa (`glass-foam.png`): dice **"Being G.O.A.T. Brewery"**.

A distancia no se nota, pero en la tienda la botella se ve grande. Conviene regenerar con la etiqueta correcta ("Drunk G.O.A.T. Brewery") o pasar la etiqueta real del cliente para usarla como referencia.

## Assets derivados (generados por script, no editar a mano)

| Archivo | Origen | Uso |
|---|---|---|
| `_derived/bottle-cutout.png` | Recorte de `src/1movil.jfif` con transparencia calculada por luminancia | Tarjetas de producto y carrito |

Cuando llegue una foto de producto con fondo transparente real (500×1500 aprox.), reemplaza este archivo.
