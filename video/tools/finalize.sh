#!/usr/bin/env bash
# Normalitza el so del vídeo renderitzat a -14 LUFS / -1 dBTP (estàndard web i xarxes) sense recodificar la imatge.
# Ús: tools/finalize.sh out/inllobsa-16x9-raw.mp4 dist/inllobsa-16x9.mp4
set -euo pipefail
in="$1"; out="$2"
stats=$(ffmpeg -hide_banner -nostats -i "$in" -af loudnorm=I=-14:TP=-1:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
get() { echo "$stats" | sed -n "s/.*\"$1\" : \"\(.*\)\".*/\1/p"; }
ffmpeg -hide_banner -v error -y -i "$in" -c:v copy \
  -af "loudnorm=I=-14:TP=-1:LRA=11:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset):linear=true,aresample=48000" \
  -c:a aac -b:a 320k -movflags +faststart "$out"
ffmpeg -hide_banner -i "$out" -af ebur128=framelog=quiet -f null - 2>&1 | grep -E "I:|Peak:" | head -2
