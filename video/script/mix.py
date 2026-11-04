"""Premescla veu + música amb "ducking" automàtic → public/audio/voice-music.wav

La música baixa uns 9 dB mentre parla la locutora (atac 60 ms, alliberament 350 ms),
de manera que la narració sempre té prioritat. Els efectes sonors els afegeix Remotion.
"""
import json
from pathlib import Path
import numpy as np
import soundfile as sf
from scipy import signal

ROOT = Path(__file__).resolve().parent.parent
SR = 48000
TL = json.loads((ROOT / "src/data/timeline.json").read_text())
N = int(TL["duration"] * SR)

music, sr = sf.read(str(ROOT / "assets/audio/music.wav"), dtype="float64")
assert sr == SR
music = music[:N]
voice = np.zeros(N)
for l in TL["lines"]:
    a, sr = sf.read(str(ROOT / f"public/audio/voice/{l['id']}.wav"), dtype="float64")
    i = int(round(l["start"] * SR))
    voice[i:i + len(a)] += a[: N - i]

# envolupant de veu → guany de la música
win = int(0.02 * SR)
lvl = np.sqrt(np.convolve(voice ** 2, np.ones(win) / win, mode="same"))
active = (lvl > 10 ** (-40 / 20)).astype(float)
att, rel = np.exp(-1 / (0.06 * SR)), np.exp(-1 / (0.35 * SR))
g = np.zeros(N); y = 0.0
for i in range(0, N, 32):                     # suavitzat atac/alliberament (per blocs)
    x = active[i]
    c = att if x > y else rel
    y = c ** 32 * y + (1 - c ** 32) * x
    g[i:i + 32] = y
duck_db = -9.0
gain = 10 ** (duck_db * g / 20)
# EQ de la música mentre parla: forat suau a 2-4 kHz per a la intel·ligibilitat
mid = signal.sosfilt(signal.butter(2, [1800, 4200], "band", fs=SR, output="sos"), music, axis=0)
music_d = (music - mid * 0.35 * g[:, None]) * gain[:, None]

MUSIC_LEVEL = 10 ** (-6.5 / 20)
VOICE_LEVEL = 10 ** (-1.0 / 20)
mixd = music_d * MUSIC_LEVEL + (voice * VOICE_LEVEL)[:, None]
peak = np.abs(mixd).max()
mixd *= 0.79 / peak                           # deixa marge per als efectes de Remotion
out = ROOT / "public/audio"; out.mkdir(parents=True, exist_ok=True)
sf.write(str(out / "voice-music.wav"), mixd.astype(np.float32), SR, subtype="PCM_16")
# stems per a l'edició posterior
stems = ROOT / "assets/audio"
sf.write(str(stems / "voice.wav"), voice.astype(np.float32), SR, subtype="PCM_24")
sf.write(str(stems / "music-ducked.wav"), (music_d * MUSIC_LEVEL).astype(np.float32), SR, subtype="PCM_24")
print("voice-music.wav", N / SR, "s · pic", round(peak, 3))
