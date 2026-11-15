#!/usr/bin/env bash
# Extrae la secuencia del hero desde public/media/pour.mp4.
#   bash scripts/extract-frames.sh
# Luego cambia `source` a `framesSource` en content/hero.ts (y frameCount si cambia).
set -euo pipefail

# --- Ajustables ---
FRAMES=120            # frames totales de la secuencia
DESKTOP_W=1600        # ancho de los frames de escritorio
MOBILE_W=800          # ancho de los frames de móvil
WEBP_Q=72             # calidad WebP
POP_START=1.2         # segundo donde suena el destape en pour.mp4
POP_DUR=0.6
POUR_START=2.4        # segundo donde empieza el chorro
POUR_DUR=3.0
# -------------------

SRC="public/media/pour.mp4"
OUT="public/frames/pour"
SFX="public/sfx"

command -v ffmpeg >/dev/null || { echo "Falta ffmpeg (https://ffmpeg.org/download.html)"; exit 1; }
[ -f "$SRC" ] || { echo "No existe $SRC"; exit 1; }

DURATION=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SRC")
FPS=$(awk -v f="$FRAMES" -v d="$DURATION" 'BEGIN { printf "%.4f", f / d }')
echo "Duración ${DURATION}s → ${FRAMES} frames (${FPS} fps)"

rm -rf "$OUT" && mkdir -p "$OUT/desktop" "$OUT/mobile" "$SFX"

ffmpeg -v error -i "$SRC" -vf "fps=${FPS},scale=${DESKTOP_W}:-2:flags=lanczos" \
  -c:v libwebp -quality "$WEBP_Q" -frames:v "$FRAMES" "$OUT/desktop/%04d.webp"
ffmpeg -v error -i "$SRC" -vf "fps=${FPS},scale=${MOBILE_W}:-2:flags=lanczos" \
  -c:v libwebp -quality "$WEBP_Q" -frames:v "$FRAMES" "$OUT/mobile/%04d.webp"

# Audio: si el video trae pista de audio, recortar el pop y el chorro
if ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$SRC" | grep -q .; then
  ffmpeg -v error -y -ss "$POP_START" -t "$POP_DUR" -i "$SRC" -vn -ac 1 -b:a 96k "$SFX/pop.mp3"
  ffmpeg -v error -y -ss "$POUR_START" -t "$POUR_DUR" -i "$SRC" -vn -ac 1 -b:a 96k "$SFX/pour.mp3"
  echo "Audio → $SFX/pop.mp3, $SFX/pour.mp3"
else
  echo "pour.mp4 no trae audio: se seguirá usando el pop sintetizado"
fi

echo "Listo: $(ls "$OUT/desktop" | wc -l) frames desktop, $(ls "$OUT/mobile" | wc -l) móvil"
