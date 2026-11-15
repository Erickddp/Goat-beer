#!/usr/bin/env bash
# Genera las secuencias del hero a partir de los videos de public/media/.
#   bash scripts/extract-frames.sh
# Sin ffmpeg en el PATH:  FFMPEG=/ruta/ffmpeg FFPROBE=/ruta/ffprobe bash scripts/extract-frames.sh
#
# Salida:
#   public/frames/pour/{desktop,mobile}/0001.webp…      (destape y servido)
#   public/frames/overflow/{desktop,mobile}/0001.webp…  (espuma que cubre la pantalla)
#   public/sfx/pop.mp3, public/sfx/pour.mp3
# Si cambias la cantidad de frames, actualiza frameCount en content/hero.ts.
set -euo pipefail

FFMPEG="${FFMPEG:-ffmpeg}"
FFPROBE="${FFPROBE:-ffprobe}"

# --- Ajustables ---------------------------------------------------------
POUR_SRC="public/media/pour.mp4"
POUR_FRAMES=160          # de 240 frames del video (10 s a 24 fps)
POUR_DESKTOP_W=1280      # el video es 1280×720: no escalar hacia arriba
POUR_MOBILE_W=960        # en móvil la "cámara" hace zoom: necesita más que 800 px

OVERFLOW_SRC="public/media/overflow.mp4"
OVERFLOW_FRAMES=64
OVERFLOW_UNTIL=8.6       # segundos: a partir de aquí la espuma ya cubre todo
OVERFLOW_DESKTOP_W=1280
OVERFLOW_MOBILE_W=720

WEBP_Q=70

POP_START=0.95           # corcholata (incluye el golpe al caer, ~2.1 s)
POP_DUR=1.5
POUR_START=2.8           # chorro
POUR_DUR=3.6
# ------------------------------------------------------------------------

command -v "$FFMPEG" >/dev/null || { echo "Falta ffmpeg (https://ffmpeg.org/download.html) o define FFMPEG=/ruta"; exit 1; }

# Negros del video → exactamente #0A0806 (fondo del sitio). Aplana el ruido de
# compresión de las sombras para que no se note el borde del cuadro.
LIFT_TO_INK="lutrgb=r='if(lt(val\,9)\,10\,val*245/255+10)':g='if(lt(val\,9)\,8\,val*247/255+8)':b='if(lt(val\,9)\,6\,val*249/255+6)'"
# Espuma: se mezcla con "screen", así que el negro debe ser negro puro (= transparente).
CRUSH_BLACK="lutrgb=r='if(lt(val\,16)\,0\,val)':g='if(lt(val\,16)\,0\,val)':b='if(lt(val\,16)\,0\,val)'"

extract() { # src frames until(seg|"") width filtro destino
  local src="$1" frames="$2" until="$3" width="$4" filter="$5" out="$6"
  local dur
  if [ -n "$until" ]; then dur="$until"; else dur=$("$FFPROBE" -v error -show_entries format=duration -of csv=p=0 "$src"); fi
  local fps
  fps=$(awk -v f="$frames" -v d="$dur" 'BEGIN { printf "%.4f", f / d }')
  rm -rf "$out" && mkdir -p "$out"
  "$FFMPEG" -v error -y -t "$dur" -i "$src" \
    -vf "fps=${fps},${filter},scale=${width}:-2:flags=lanczos" \
    -c:v libwebp -quality "$WEBP_Q" -compression_level 6 -frames:v "$frames" "$out/%04d.webp"
  echo "  $out: $(ls "$out" | wc -l) frames, $(du -sh "$out" | cut -f1)"
}

[ -f "$POUR_SRC" ] || { echo "No existe $POUR_SRC"; exit 1; }
echo "pour.mp4"
extract "$POUR_SRC" "$POUR_FRAMES" "" "$POUR_DESKTOP_W" "$LIFT_TO_INK" "public/frames/pour/desktop"
extract "$POUR_SRC" "$POUR_FRAMES" "" "$POUR_MOBILE_W" "$LIFT_TO_INK" "public/frames/pour/mobile"

if [ -f "$OVERFLOW_SRC" ]; then
  echo "overflow.mp4"
  extract "$OVERFLOW_SRC" "$OVERFLOW_FRAMES" "$OVERFLOW_UNTIL" "$OVERFLOW_DESKTOP_W" "$CRUSH_BLACK" "public/frames/overflow/desktop"
  extract "$OVERFLOW_SRC" "$OVERFLOW_FRAMES" "$OVERFLOW_UNTIL" "$OVERFLOW_MOBILE_W" "$CRUSH_BLACK" "public/frames/overflow/mobile"
fi

# Audio: el del video viene muy bajo → normalizar
mkdir -p public/sfx
if "$FFPROBE" -v error -select_streams a -show_entries stream=index -of csv=p=0 "$POUR_SRC" | grep -q .; then
  "$FFMPEG" -v error -y -ss "$POP_START" -t "$POP_DUR" -i "$POUR_SRC" -vn -ac 1 \
    -af "loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=out:st=$(awk -v d="$POP_DUR" 'BEGIN{print d-0.3}'):d=0.3" -b:a 96k public/sfx/pop.mp3
  "$FFMPEG" -v error -y -ss "$POUR_START" -t "$POUR_DUR" -i "$POUR_SRC" -vn -ac 1 \
    -af "loudnorm=I=-18:TP=-1.5:LRA=11,afade=t=in:d=0.15,afade=t=out:st=$(awk -v d="$POUR_DUR" 'BEGIN{print d-0.6}'):d=0.6" -b:a 96k public/sfx/pour.mp3
  echo "Audio → public/sfx/pop.mp3, public/sfx/pour.mp3"
else
  echo "pour.mp4 no trae audio: se usa el pop sintetizado"
fi
