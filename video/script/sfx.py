"""Biblioteca d'efectes sonors originals (síntesi) → public/audio/sfx/*.wav
Les escenes de Remotion els col·loquen exactament en el fotograma de cada animació.
"""
from pathlib import Path
import numpy as np
from scipy import signal
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public/audio/sfx"; OUT.mkdir(parents=True, exist_ok=True)
SR = 48000
rng = np.random.default_rng(51)


def sos(kind, f, order=2):
    return signal.butter(order, f, kind, fs=SR, output="sos")


def tvf(x, f0, f1, q=1.2, curve=1.0):
    """Filtre passabanda variable en el temps (escombrat de f0 a f1)."""
    out = np.zeros_like(x); blk = 512; n = len(x)
    for i in range(0, n, blk):
        fr = (i / n) ** curve
        fc = f0 * (f1 / f0) ** fr
        lo, hi = fc / (1 + 1 / q), min(fc * (1 + 1 / q), 22000)
        seg = x[max(0, i - 2048): i + blk]
        y = signal.sosfilt(sos("band", [lo, hi]), seg)
        out[i:i + blk] = y[-len(out[i:i + blk]):]
    return out


def stereo(x, pan_from=-0.6, pan_to=0.6):
    p = np.linspace(pan_from, pan_to, len(x))
    return np.stack([x * np.cos((p + 1) * np.pi / 4), x * np.sin((p + 1) * np.pi / 4)], 1) * 1.414


def save(name, x, peak=0.8):
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    f = int(0.004 * SR)
    x[-f:] *= np.linspace(1, 0, f)[:, None]
    x = x / (np.abs(x).max() + 1e-9) * peak
    sf.write(str(OUT / f"{name}.wav"), x.astype(np.float32), SR, subtype="PCM_16")


def whoosh(dur, f0, f1, pan=(-0.7, 0.7), peak_at=0.6):
    n = int(dur * SR); t = np.arange(n) / SR
    x = tvf(rng.standard_normal(n), f0, f1, q=1.6)
    e = np.where(t < dur * peak_at, (t / (dur * peak_at)) ** 2, np.exp(-(t - dur * peak_at) / (dur * 0.18)))
    return stereo(x * e, *pan)


T = lambda d: np.arange(int(d * SR)) / SR

save("whoosh", whoosh(0.7, 400, 5000), 0.75)                       # transició general
save("whoosh-long", whoosh(1.2, 250, 7000, (-0.9, 0.9), 0.7), 0.75)
save("whoosh-down", whoosh(0.8, 6000, 300, (0.7, -0.7), 0.35), 0.7)
save("swipe", whoosh(0.32, 1500, 8000, (-0.4, 0.4), 0.5), 0.6)  # targetes, panells

# pop suau d'aparició de text
t = T(0.12); f = 600 + 900 * np.exp(-t * 60)
save("pop", np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 38), 0.55)
# tic (icones petites, xips)
t = T(0.05)
save("tick", signal.sosfilt(sos("high", 2500), rng.standard_normal(len(t))) * np.exp(-t * 160) * 0.6
     + np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 120) * 0.4, 0.45)
# "boop" ascendent per a icones que apareixen
t = T(0.22); f = 420 * 2 ** (t / 0.22 * 1.0)
save("rise", np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / 0.22) * np.exp(-t * 4), 0.5)
# impacte subtil (missatges importants)
t = T(1.6)
sub = np.sin(2 * np.pi * np.cumsum(45 + 80 * np.exp(-t * 14)) / SR) * np.exp(-t * 3)
nz = signal.sosfilt(sos("low", 2500), rng.standard_normal(len(t))) * np.exp(-t * 12) * 0.5
save("impact", np.tanh((sub + nz) * 1.6), 0.85)
# segell (document / venut)
t = T(0.5)
thump = np.sin(2 * np.pi * np.cumsum(90 + 120 * np.exp(-t * 40)) / SR) * np.exp(-t * 14)
slap = signal.sosfilt(sos("band", [600, 5000]), rng.standard_normal(len(t))) * np.exp(-t * 45)
save("stamp", thump + slap * 0.8, 0.85)
# obturador de càmera
t = T(0.25)
c1 = signal.sosfilt(sos("band", [1800, 9000]), rng.standard_normal(len(t))) * np.exp(-t * 90)
c2 = np.roll(c1, int(0.07 * SR)) * 0.7
save("shutter", c1 + c2, 0.7)
# tecleig (8 tecles)
n = int(1.4 * SR); x = np.zeros(n)
for k in range(11):
    i = int((k * 0.12 + rng.random() * 0.03) * SR); tt = T(0.035)
    key = signal.sosfilt(sos("band", [2000, 7000]), rng.standard_normal(len(tt))) * np.exp(-tt * 200)
    x[i:i + len(tt)] += key * (0.7 + 0.3 * rng.random())
save("typing", x, 0.5)
# "ding" de coincidència
t = T(1.4)
d = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t * dcy) for a, f, dcy in [(1, 1318.5, 3), (.5, 1975.5, 4), (.3, 2637, 6)])
save("ding", d * np.minimum(1, t / 0.003), 0.55)
# brillantor / espurnes (màrqueting, IA)
n = int(1.4 * SR); x = np.zeros(n)
for k in range(14):
    i = int(k * 0.07 * SR); tt = T(0.4); f = 2600 + 2200 * rng.random()
    x[i:i + len(tt)] += np.sin(2 * np.pi * f * tt) * np.exp(-tt * 14) * (1 - k / 16)
save("sparkle", stereo(x, -0.5, 0.5), 0.45)
# cor / like
t = T(0.18); f = 700 * 2 ** (t / 0.18)
save("like", np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 18), 0.45)
# brunzit digital (dades, IA)
t = T(0.9)
g = np.sign(np.sin(2 * np.pi * 9 * t)) * 0.5 + 0.5
data = signal.sosfilt(sos("band", [1200, 6000]), rng.standard_normal(len(t))) * g * np.sin(np.pi * t / 0.9) * 0.3
blips = sum(np.sin(2 * np.pi * (1800 + 300 * k) * t) * ((t > k * 0.11) & (t < k * 0.11 + 0.03)) for k in range(8)) * 0.3
save("data", data + blips, 0.45)
# brillantor del logotip (final)
t = T(2.6)
sh = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * dcy) * a for f, dcy, a in [(1760, 1.5, .6), (2637, 1.8, .4), (3520, 2.2, .3), (880, 1.2, .5)])
air = signal.sosfilt(sos("high", 6000), rng.standard_normal(len(t))) * np.exp(-t * 3) * 0.15
save("logo-shine", stereo((sh + air) * np.minimum(1, t / 0.01), -0.3, 0.3), 0.6)
print("sfx:", sorted(p.name for p in OUT.glob("*.wav")))
