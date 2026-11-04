# Vídeo corporatiu Inllobsa — projecte de motion graphics

## Versió 2 (actual): sense locució, ~90 s, al ritme de la música

* Guió i missatges en pantalla: `src/data/story.ts` (escenes en compassos, textos, persones per servei).
* Música: `src/data/music.json` (fitxer, BPM i desplaçament del primer temps). Totes les animacions
  cauen sobre els temps musicals; si canvia el tempo, el vídeo es reajusta sol.
* Fotos reals de la promoció (fitxa ref. 5028 d'inllobsa.com): `public/listing/`.
* Previsualització amb música provisional: `dist/previa/`.
* Per posar la música definitiva d'ElevenLabs: deseu-la a `public/audio/music.mp3`, poseu-ne el BPM real
  i l'`offset` (segons fins al primer temps fort) a `music.json` i torneu a renderitzar.

La documentació de sota correspon a la versió 1 (amb locució), que es manté a l'historial.


Projecte editable i reproduïble (Remotion + React + Python) que genera el vídeo corporatiu d'Inllobsa Immobiliària
a partir dels recursos reals de la landing (logotip, colors, tipografia, serveis, equip i contacte).

## Lliurables (`dist/`)

| Fitxer | Descripció |
|---|---|
| `inllobsa-16x9.mp4` | Vídeo principal 1920×1080, 30 fps, 110,5 s, H.264 + AAC, subtítols integrats |
| `inllobsa-9x16.mp4` | Versió vertical 1080×1920 per a Reels / TikTok / Shorts |
| `inllobsa-video.srt` | Subtítols sincronitzats (per a YouTube, LinkedIn o reproductors) |
| `GUIO.md` (arrel del projecte) | Guió definitiu de locució i storyboard escena per escena |

## Estructura

```
video/
├─ script/                 ← àudio i línia de temps (Python)
│  ├─ narration.json       ← guió: text de subtítol, text per a la veu, pauses
│  ├─ tts.py               ← locució (Piper, veu femenina ca_ES-upc_ona) + tria de la millor presa amb Whisper
│  ├─ build_timeline.py    ← línia de temps: escenes, temps de cada paraula, subtítols i SRT
│  ├─ music.py             ← música original sintetitzada (120 BPM) que segueix les escenes
│  ├─ sfx.py               ← efectes sonors originals (whooshes, pops, impactes, segell, obturador…)
│  └─ mix.py               ← premescla veu + música amb ducking automàtic
├─ src/                    ← composició Remotion (React)
│  ├─ Video.tsx            ← muntatge: escenes, subtítols, logotip, àudio i efectes
│  ├─ scenes/              ← una escena per fitxer (Opening, Sale, Rent, Legal, Shopper, Marketing, Team, Closing)
│  ├─ components/          ← Logo, il·lustracions, fons, text cinètic, subtítols, efectes
│  ├─ lib/                 ← colors corporatius, temps i easings, maquetació 16:9 / 9:16
│  └─ data/                ← timeline.json (generat), team.json i site.json (còpia de la landing)
├─ public/                 ← recursos: brand/, team/, photos/, icons/, fonts/, audio/
├─ assets/                 ← stems d'àudio (veu, música) per a edició externa
└─ tools/                  ← stills.mjs (fotogrames de prova) i finalize.sh (loudness -14 LUFS)
```

Tota la sincronia surt de `src/data/timeline.json`. Les animacions, els subtítols i els efectes sonors es col·loquen
sobre el temps real de cada paraula de la locució, i la música canvia de secció a l'inici de cada escena.

## Com regenerar-ho

Requisits: Node 20+, ffmpeg, Python 3.11+ amb `piper-tts numpy scipy soundfile` (i opcionalment `sherpa-onnx`).

```bash
npm install
```

1) Veu. Model: `vits-piper-ca_ES-upc_ona-medium` (releases de k2-fsa/sherpa-onnx, carpeta `tts-models`).
   `--takes 6 --asr <whisper-small>` genera sis preses per frase i es queda la que Whisper entén millor.

```bash
python script/tts.py --model ca_ES-upc_ona-medium.onnx --takes 6 --asr sherpa-onnx-whisper-small
```

2) Línia de temps, música, efectes i premescla:

```bash
python script/build_timeline.py && python script/music.py && python script/sfx.py && python script/mix.py
```

3) Previsualitzar i editar:

```bash
npx remotion studio
```

4) Renderitzar i normalitzar el so:

```bash
npx remotion render Inllobsa-16x9 out/inllobsa-16x9-raw.mp4 --crf=17 --audio-bitrate=320k
```

```bash
tools/finalize.sh out/inllobsa-16x9-raw.mp4 dist/inllobsa-16x9.mp4
```

Composicions disponibles: `Inllobsa-16x9`, `Inllobsa-9x16` i `Inllobsa-16x9-net` (sense subtítols).
Per a 4K: `npx remotion render Inllobsa-16x9 out/4k.mp4 --scale=2`. Els gràfics són vectorials; les fotos de l'equip són
de 480 px i en 4K perden nitidesa, de manera que caldrien els originals a més resolució.

## Canviar la veu per una locució professional

La veu actual és sintètica (Piper, model obert `upc_ona`, català central femení), perquè l'entorn de producció no
tenia accés a serveis de veu neuronal. Per substituir-la per una locutora real o per ElevenLabs / Azure (`ca-ES-JoanaNeural`):

1. Graveu cada frase de `script/narration.json` (camp `text`) en un WAV separat: `script/voice-override/L01.wav` … `L21.wav`.
2. Executeu de nou els passos 1 a 4. `tts.py` utilitza els fitxers d'override, i la línia de temps, els subtítols,
   les animacions i la música s'adapten automàticament a la durada nova.

## Llicències

* Música i efectes: originals, generats per codi en aquest projecte. Sense mostres de tercers.
* Veu: model Piper `ca_ES-upc_ona` (dataset UPC Festcat, CC BY-SA). Recomanable substituir-la per una locució
  professional per a ús publicitari.
* Icones: Lucide (ISC) i icones pròpies de la web. Tipografia: Mulish (SIL OFL).
* Fotografies, logotip i textos: propietat d'Inllobsa.
