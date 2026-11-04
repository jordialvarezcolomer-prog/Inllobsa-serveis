"""Música original (corporate electronic · 120 BPM · Re major / Si menor) generada per síntesi.

Tot el so es crea des de zero amb numpy/scipy: no hi ha mostres ni material de tercers,
de manera que la peça és 100% original i lliure de drets per a Inllobsa.

L'estructura segueix les escenes de src/data/timeline.json:
  obertura (impacte de logotip + arpegi) → compravenda/lloguer (groove) → legal (filtrat)
  → shopper (campanes + pujada) → MÀRQUETING (drop) → equip (piano, break emotiu)
  → tancament (cadència IV–V–I amb cop final sincronitzat amb el logotip).
Sortida: assets/audio/music.wav (estèreo, 48 kHz)
"""
import json
from pathlib import Path
import numpy as np
from scipy import signal

ROOT = Path(__file__).resolve().parent.parent
SR = 48000
TL = json.loads((ROOT / "src/data/timeline.json").read_text())
BEAT = 60 / TL["bpm"]
BAR = 4 * BEAT
DUR = TL["duration"]
N = int(DUR * SR) + SR
EV = TL["events"]
SC = {s["id"]: s for s in TL["scenes"]}
rng = np.random.default_rng(1977)


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


# ---------------------------------------------------------------- oscil·ladors
_tables = {}


def table(kind, midi):
    """Taula d'ona de banda limitada per a la nota (evita l'aliasing)."""
    key = (kind, int(round(midi)))
    if key not in _tables:
        n = 4096
        ph = np.arange(n) / n * 2 * np.pi
        maxh = max(1, int(17000 / mtof(midi)))
        w = np.zeros(n)
        for k in range(1, min(maxh, 120) + 1):
            if kind == "saw":
                w += np.sin(k * ph) / k
            elif kind == "square" and k % 2:
                w += np.sin(k * ph) / k
            elif kind == "tri" and k % 2:
                w += ((-1) ** ((k - 1) // 2)) * np.sin(k * ph) / (k * k)
        w /= np.abs(w).max()
        _tables[key] = w
    return _tables[key]


def osc(kind, midi, n, detune=0.0, phase=None):
    f = mtof(midi + detune / 100)
    tb = table(kind, midi)
    p0 = rng.random() if phase is None else phase
    idx = (p0 + np.arange(n) * f / SR) % 1.0 * len(tb)
    i0 = idx.astype(int)
    fr = idx - i0
    return tb[i0] * (1 - fr) + tb[(i0 + 1) % len(tb)] * fr


def env(n, a=0.005, d=0.1, s=0.7, r=0.1, hold=None):
    """ADSR (segons). hold = durada de la nota abans del release."""
    hold = n / SR - r if hold is None else hold
    t = np.arange(n) / SR
    e = np.where(t < a, t / max(a, 1e-6), s + (1 - s) * np.exp(-(t - a) / max(d, 1e-6)))
    rel = np.clip((t - hold) / max(r, 1e-6), 0, 1)
    return e * (1 - rel)


def lp(x, fc, order=2):
    return signal.sosfilt(signal.butter(order, min(fc, SR / 2 * 0.95), "low", fs=SR, output="sos"), x, axis=0)


def hp(x, fc, order=2):
    return signal.sosfilt(signal.butter(order, fc, "high", fs=SR, output="sos"), x, axis=0)


def bp(x, f1, f2, order=2):
    return signal.sosfilt(signal.butter(order, [f1, f2], "band", fs=SR, output="sos"), x, axis=0)


def add(buf, x, t, gain=1.0, pan=0.0):
    """Afegeix un so mono o estèreo a la posició t (s) amb panoràmica equal-power."""
    i = int(round(t * SR))
    if i >= len(buf) or i + len(x) <= 0:
        return
    if i < 0:
        x = x[-i:]; i = 0
    x = x[: len(buf) - i]
    if x.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        buf[i:i + len(x), 0] += x * gain * l * 1.414
        buf[i:i + len(x), 1] += x * gain * r * 1.414
    else:
        buf[i:i + len(x)] += x * gain


def stem():
    return np.zeros((N, 2))


# ---------------------------------------------------------------- instruments
def kick():
    n = int(0.45 * SR); t = np.arange(n) / SR
    f = 46 + 110 * np.exp(-t * 32)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * np.exp(-t * 6.5)
    click = hp(rng.standard_normal(n), 3000) * np.exp(-t * 300) * 0.25
    return np.tanh((x + click) * 1.6) * 0.9


def clap():
    n = int(0.35 * SR); t = np.arange(n) / SR
    e = np.zeros(n)
    for k, o in enumerate([0, 0.011, 0.022]):
        e += (t >= o) * np.exp(-(t - o).clip(0) * (160 if k < 2 else 16))
    return bp(rng.standard_normal(n), 900, 4200) * e * 0.55


def hat(open_=False):
    n = int((0.28 if open_ else 0.07) * SR); t = np.arange(n) / SR
    return hp(rng.standard_normal(n), 7500, 4) * np.exp(-t * (13 if open_ else 70)) * 0.32


def snare():
    n = int(0.25 * SR); t = np.arange(n) / SR
    tone = np.sin(2 * np.pi * 185 * t) * np.exp(-t * 28)
    nz = bp(rng.standard_normal(n), 1500, 7000) * np.exp(-t * 20)
    return (tone * 0.5 + nz * 0.6) * 0.7


def supersaw(midi, dur, voices=5, spread=14, cutoff=2600, a=0.25, r=0.5):
    n = int((dur + r) * SR)
    L = np.zeros(n); R = np.zeros(n)
    for v in range(voices):
        det = (v - (voices - 1) / 2) / ((voices - 1) / 2) * spread
        x = osc("saw", midi, n, det)
        pan = (v - (voices - 1) / 2) / (voices - 1) * 1.4
        L += x * np.cos((pan + 1) * np.pi / 4); R += x * np.sin((pan + 1) * np.pi / 4)
    st = np.stack([L, R], 1) / voices
    st = lp(st, cutoff)
    return st * env(n, a, 0.6, 0.85, r, hold=dur)[:, None]


def pluck(midi, dur=0.3, cutoff=3200, kind="saw", decay=9.0):
    n = int(dur * SR); t = np.arange(n) / SR
    x = osc(kind, midi, n) * 0.6 + osc(kind, midi + 12, n, 6) * 0.25
    x = lp(x, cutoff)
    return x * np.exp(-t * decay) * np.minimum(1, t / 0.002)


def bass(midi, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    x = osc("saw", midi, n) * 0.55 + osc("square", midi - 12, n) * 0.45 + np.sin(2 * np.pi * mtof(midi - 12) * t) * 0.6
    x = lp(x, 780)
    return np.tanh(x * 1.3) * env(n, 0.004, 0.12, 0.65, 0.03) * 0.55


def piano(midi, dur=2.5, vel=1.0):
    n = int(dur * SR); t = np.arange(n) / SR
    f = mtof(midi)
    x = np.zeros(n)
    for k, (amp, dec) in enumerate([(1, 2.2), (.45, 3.2), (.25, 4.5), (.12, 6), (.07, 8), (.04, 10)], 1):
        x += amp * np.sin(2 * np.pi * f * k * (1 + 0.0004 * k * k) * t) * np.exp(-t * dec * (0.6 + f / 900))
    x += lp(rng.standard_normal(n), 3000) * np.exp(-t * 90) * 0.05
    return x * np.minimum(1, t / 0.003) * 0.35 * vel


def bell(midi, dur=1.6):
    n = int(dur * SR); t = np.arange(n) / SR
    f = mtof(midi)
    mod = np.sin(2 * np.pi * f * 3.5 * t) * 2.2 * np.exp(-t * 4)
    return np.sin(2 * np.pi * f * t + mod) * np.exp(-t * 3.2) * np.minimum(1, t / 0.002) * 0.3


def riser(dur, f0=300, f1=9000):
    n = int(dur * SR)
    nz = rng.standard_normal(n)
    out = np.zeros(n)
    blk = 1024
    for i in range(0, n, blk):
        fr = i / n
        fc = f0 * (f1 / f0) ** fr
        seg = nz[max(0, i - 2048):i + blk]
        y = bp(seg, fc * 0.7, min(fc * 1.4, 20000))
        out[i:i + blk] = y[-len(out[i:i + blk]):]
    t = np.arange(n) / SR
    tone = osc("saw", 50, n) * 0  # (reservat)
    sweep = np.sin(2 * np.pi * np.cumsum(120 * (8 ** (t / dur))) / SR) * 0.15
    return (out * 0.8 + sweep + tone) * (t / dur) ** 2.2


def impact(dur=3.0):
    n = int(dur * SR); t = np.arange(n) / SR
    sub = np.sin(2 * np.pi * np.cumsum(38 + 60 * np.exp(-t * 9)) / SR) * np.exp(-t * 1.6)
    nz = lp(rng.standard_normal(n), 1800) * np.exp(-t * 5) * 0.5
    return np.tanh((sub + nz) * 1.4) * 0.9


def rev_cymbal(dur=1.5):
    n = int(dur * SR); t = np.arange(n) / SR
    x = hp(rng.standard_normal(n), 5000) * np.exp(-(dur - t) * 3.5) * 0.25
    return x


def reverb(x, secs=2.4, mix=0.3, predelay=0.02):
    n = int(secs * SR); t = np.arange(n) / SR
    ir = np.stack([rng.standard_normal(n), rng.standard_normal(n)], 1) * np.exp(-t * 6.9 / secs)[:, None]
    ir = lp(ir, 6500)
    ir[: int(predelay * SR)] = 0
    ir /= np.sqrt((ir ** 2).sum(0))
    wet = np.stack([signal.fftconvolve(x[:, c], ir[:, c])[: len(x)] for c in range(2)], 1)
    return wet * mix


def delay(x, time, fb=0.35, mix=0.3, pingpong=True):
    d = int(time * SR)
    out = np.zeros_like(x)
    tap = x.copy()
    g = mix
    for k in range(5):
        tap = np.roll(tap, d, axis=0); tap[:d] = 0
        if pingpong:
            tap = tap[:, ::-1]
        out += tap * g
        g *= fb
    return out


# ---------------------------------------------------------------- harmonia
# acords: (baix, notes del pad)
CH = {
    "Bm": (47, [59, 62, 66, 71]),
    "G":  (43, [59, 62, 67, 71]),
    "D":  (50, [62, 66, 69, 74]),
    "A":  (45, [61, 64, 69, 73]),
    "Em": (52, [59, 64, 67, 71]),
    "F#m": (54, [61, 66, 69, 73]),
}
PROG_A = ["Bm", "G", "D", "A"]          # vi–IV–I–V
PROG_B = ["D", "A", "Bm", "G"]          # I–V–vi–IV (drop)
PROG_T = ["G", "D", "Em", "A"]          # equip


def bars(start, end):
    """Compases (inici, durada) dins d'una secció; l'últim pot ser incomplet."""
    out, t = [], start
    while t < end - 1e-6:
        out.append((t, min(BAR, end - t)))
        t += BAR
    return out


# ---------------------------------------------------------------- arranjament
drums, bassS, padS, arpS, leadS, keysS, fx = (stem() for _ in range(7))
kick_times = []

SECTIONS = {
    #             prog,   kick,  clap,  hats, bass, pad, arp, arpCut, lead, keys, bells
    "opening":   (PROG_A, "half", False, 0.6, 0.0, 0.9, 1.0, 2400, 0.0, 0.0, False),
    "sale":      (PROG_A, "four", False, 1.0, 1.0, 0.8, 1.0, 3600, 0.0, 0.0, False),
    "rent":      (PROG_A, "four", True, 1.0, 1.0, 0.8, 1.0, 4200, 0.0, 0.0, False),
    "legal":     (PROG_A, "four", False, 0.7, 0.8, 0.9, 0.8, 1700, 0.0, 0.3, False),
    "shopper":   (PROG_A, "four", True, 0.9, 1.0, 0.8, 0.9, 3000, 0.0, 0.0, True),
    "marketing": (PROG_B, "four", True, 1.2, 1.1, 1.0, 1.0, 6000, 1.0, 0.0, False),
    "team":      (PROG_T, "lift", False, 0.6, 0.6, 1.0, 0.0, 2000, 0.0, 1.0, False),
    "closing":   (PROG_B, "four", True, 1.0, 1.0, 1.0, 0.9, 4500, 0.5, 0.4, False),
}

K, CL, HC, HO, SN = kick(), clap(), hat(), hat(True), snare()
final_hit = EV["finalHit"]

for sid, (prog, kmode, clapOn, hats, bassG, padG, arpG, arpCut, leadG, keysG, bells) in SECTIONS.items():
    s0, s1 = SC[sid]["start"], SC[sid]["end"]
    if sid == "opening":
        s0 = EV["logoHit"]                       # la música arrenca amb el logotip
    if sid == "closing":
        s1 = final_hit                           # fins al cop final
    bl = bars(s0, s1)
    chords = [prog[i % 4] for i in range(len(bl))]
    if sid == "closing":                         # cadència IV–V cap al I del cop final
        chords = (["D", "A", "Bm", "G", "Em", "A"] * 4)[: len(bl)]
        chords[-2:] = ["G", "A"] if len(bl) >= 2 else chords[-2:]
    if sid == "shopper":
        chords[-1] = "A"                         # dominant abans del drop
    for bi, ((bt, bd), ch) in enumerate(zip(bl, chords)):
        root, notes = CH[ch]
        nb = int(round(bd / BEAT))
        # --- pad
        if padG:
            for m in notes:
                add(padS, supersaw(m, bd, cutoff=2400 if sid != "marketing" else 4200, a=0.3 if sid == "team" else 0.12),
                    bt, 0.11 * padG)
        # --- bateria
        for b in range(nb):
            tb = bt + b * BEAT
            kick_on = (kmode == "four") or (kmode == "half" and b % 2 == 0) or \
                      (kmode == "lift" and (bi >= 2 and (b % 2 == 0 or bi >= len(bl) - 1)))
            if sid == "opening" and bi == 0 and b < 2:
                kick_on = b == 0
            if kick_on:
                add(drums, K, tb, 0.85); kick_times.append(tb)
            if clapOn and b % 2 == 1:
                add(drums, CL, tb, 0.55, 0.05)
            if hats:
                add(drums, HO if sid in ("marketing", "closing") else HC, tb + BEAT / 2, 0.5 * hats, 0.25)
                if sid in ("marketing", "rent", "closing"):
                    for q in (0.25, 0.75):
                        add(drums, HC, tb + BEAT * q, 0.28 * hats, -0.3)
        # --- baix (corxeres, "pump")
        if bassG:
            for e8 in range(nb * 2):
                te = bt + e8 * BEAT / 2
                n = root + (12 if (sid == "marketing" and e8 % 4 == 3) else 0)
                add(bassS, bass(n, BEAT / 2 * 0.92), te, 0.42 * bassG * (1.0 if e8 % 2 else 0.75))
        # --- arpegi (semicorxeres)
        if arpG:
            pat = [0, 1, 2, 3, 2, 1, 2, 3] if sid != "marketing" else [0, 2, 1, 3, 2, 3, 1, 2]
            for s16 in range(nb * 4):
                m = notes[pat[s16 % 8]] + 12
                vel = 1.0 if s16 % 4 == 0 else 0.7
                add(arpS, pluck(m, 0.28, cutoff=arpCut, kind="square" if sid in ("opening", "legal") else "saw"),
                    bt + s16 * BEAT / 4, 0.15 * arpG * vel, 0.35 if s16 % 2 else -0.35)
        # --- lead (stabs sincopats)
        if leadG:
            for off, ln in [(0, 0.35), (0.75, 0.25), (1.5, 0.35), (2.5, 0.25), (3.0, 0.4)]:
                if off < nb:
                    for m in notes[1:]:
                        add(leadS, supersaw(m + 12, BEAT * ln, voices=7, spread=18, cutoff=7000, a=0.004, r=0.12),
                            bt + off * BEAT, 0.07 * leadG)
        # --- piano / tecles
        if keysG:
            add(keysS, piano(root - 12 + 12, 2.5, 0.8), bt, 0.9 * keysG, -0.1)
            for k, m in enumerate(notes):
                add(keysS, piano(m, 2.2, 0.55), bt + 0.02 * k, 0.7 * keysG, 0.15 * (k - 1.5))
            if sid == "team":   # melodia simple
                mel = [notes[3] + 12, notes[2] + 12, notes[1] + 12, notes[2] + 12]
                for k, m in enumerate(mel[:nb]):
                    add(keysS, piano(m, 1.6, 0.6), bt + k * BEAT + (BEAT / 2 if k == 3 else 0), 0.6 * keysG, 0.2)
        # --- campanes (shopper: "descobriment")
        if bells:
            for k, m in enumerate([notes[3] + 12, notes[1] + 24, notes[2] + 12]):
                add(keysS, bell(m), bt + [0, 1.5, 2.5][k] * BEAT, 0.6, [-0.4, 0.4, 0][k])

# ---------------------------------------------------------------- transicions i cops
add(fx, rev_cymbal(1.0), EV["logoHit"] - 1.0, 0.9)
add(fx, impact(3.5), EV["logoHit"], 0.75)
# pujada + redoble abans del drop de màrqueting
drop = EV["drop"]
add(fx, riser(4 * BEAT * 2), drop - 8 * BEAT, 0.55)
for k in range(16):
    tt = drop - 4 * BEAT + k * BEAT / 4
    add(drums, SN, tt, 0.18 + 0.5 * k / 16, 0.1)
add(fx, impact(3.5), drop, 0.85)
add(fx, rev_cymbal(1.2), drop - 1.2, 0.8)
# entrada de l'equip: cop suau + riser al final de l'escena
add(fx, impact(2.5), EV["teamLift"], 0.45)
add(fx, riser(BAR), SC["closing"]["start"] - BAR, 0.4)
# cop final: acord sostingut de Re major + impacte
add(fx, rev_cymbal(1.5), final_hit - 1.5, 1.0)
add(fx, impact(4.0), final_hit, 1.0)
add(drums, K, final_hit, 1.0); kick_times.append(final_hit)
add(drums, CL, final_hit, 0.6)
tail = DUR - final_hit + 1.0
for m in CH["D"][1] + [50 + 12, 74 + 12]:
    add(padS, supersaw(m, tail * 0.55, voices=7, spread=16, cutoff=5000, a=0.005, r=tail * 0.45), final_hit, 0.11)
for m in [38, 50, 62, 66, 69, 74]:
    add(keysS, piano(m, tail + 1, 0.9), final_hit, 0.75)
add(keysS, bell(86, 2.5), final_hit, 0.5, 0.3)
add(keysS, bell(81, 2.5), final_hit + 0.18, 0.35, -0.3)

# ---------------------------------------------------------------- sidechain + mescla
t = np.arange(N) / SR
duck = np.ones(N)
for kt in kick_times:
    i = int(kt * SR); n = int(0.42 * SR)
    seg = 1 - 0.55 * np.exp(-np.arange(n) / SR / 0.09)
    duck[i:i + n] = np.minimum(duck[i:i + n], seg[: len(duck[i:i + n])])
duck = duck[:, None]

arpS = arpS + delay(arpS, BEAT * 0.75, 0.38, 0.35)
leadS = leadS + delay(leadS, BEAT * 0.75, 0.3, 0.2)
music = (drums * 1.0 + bassS * duck * 1.0 + padS * duck * 0.9 + arpS * duck * 0.9 + leadS * duck * 0.9 + keysS + fx)
send = padS * 0.5 + arpS * 0.8 + keysS * 0.7 + leadS * 0.6 + fx * 0.3 + drums * 0.08
music = music + reverb(send, 2.6, 0.55)
music = hp(music, 28)
# corba d'intensitat per escena (dB): la música creix fins al drop i al final
LEVEL = {"opening": -3.5, "sale": -3.5, "rent": -2.5, "legal": -4.5, "shopper": -2.5,
         "marketing": 0.0, "team": -5.0, "closing": -1.0}
g = np.zeros(N)
for sid, db in LEVEL.items():
    g[int(SC[sid]["start"] * SR):int(SC[sid]["end"] * SR)] = db
g[int(SC["closing"]["end"] * SR):] = LEVEL["closing"]
# l'equip creix suaument cap al tancament
ts, te = SC["team"]["start"], SC["team"]["end"]
i0, i1 = int(ts * SR), int(te * SR)
g[i0:i1] = np.linspace(-5.5, -2.0, i1 - i0)
g = signal.sosfiltfilt(signal.butter(1, 2.0, "low", fs=SR, output="sos"), g)
music *= (10 ** (g / 20))[:, None]
# EQ: menys pes en greus (deixa espai a la veu i evita fatiga)
music = music + signal.sosfilt(signal.butter(2, 120, "low", fs=SR, output="sos"), music, axis=0) * -0.35
# fosa final i normalització de pic
fade = np.clip((DUR - t) / 0.6, 0, 1)[:, None]
music *= fade
music = music[: int(DUR * SR)]
music = np.tanh(music / np.abs(music).max() * 1.6) / np.tanh(1.6) * 0.89
out = ROOT / "assets/audio"; out.mkdir(parents=True, exist_ok=True)
import soundfile as sf
sf.write(str(out / "music.wav"), music.astype(np.float32), SR, subtype="PCM_24")
print("music.wav", music.shape[0] / SR, "s")
