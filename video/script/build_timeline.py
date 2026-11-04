"""Construeix la línia de temps del vídeo a partir de la durada real de cada frase.

Sortides:
  src/data/timeline.json   (escenes, frases, blocs de subtítol, temps de cada paraula)
  dist/inllobsa-video.srt  (subtítols)
La música (music.py), els efectes (sfx.py) i les animacions (src/) llegeixen aquest fitxer,
de manera que tot queda sincronitzat amb la veu.
"""
import json, math, re
from pathlib import Path
import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
FPS = 30
BPM = 120
BEAT = 60 / BPM

# Temps (s) des de l'inici de l'escena fins a la primera frase, i cua després de l'última.
SCENES = [
    # id,        lead, tail
    ("opening",   2.40, 0.80),
    ("sale",      0.45, 0.55),
    ("rent",      0.45, 0.55),
    ("legal",     0.45, 0.55),
    ("shopper",   0.40, 0.55),
    ("marketing", 0.35, 0.60),
    ("team",      0.60, 0.85),
    ("closing",   0.50, 2.40),
]

data = json.loads((ROOT / "script/narration.json").read_text())
lines = data["lines"]


def ceil_beat(t):
    return math.ceil(t / BEAT - 1e-6) * BEAT


def tokens(text):
    """Separa el text de subtítol en blocs i paraules; *així* marca les paraules destacades."""
    cues, hl = [], False
    for chunk in text.split("|"):
        words = []
        for raw in chunk.split():
            if raw.startswith("*"):
                hl = True
            words.append({"w": raw.replace("*", ""), "hl": hl})
            if re.sub(r"[.,:;?!…]+$", "", raw).endswith("*"):
                hl = False
        cues.append(words)
    return cues


def gaps(path):
    """Pauses internes (centre en s) detectades a l'àudio: energia < -32 dB durant ≥ 70 ms."""
    a, sr = sf.read(str(path), dtype="float32")
    win = int(sr * 0.01)
    n = len(a) // win
    rms = np.sqrt((a[: n * win].reshape(n, win) ** 2).mean(1) + 1e-12)
    db = 20 * np.log10(rms / rms.max())
    quiet = db < -32
    out, i = [], 0
    while i < n:
        if quiet[i]:
            j = i
            while j < n and quiet[j]:
                j += 1
            if j - i >= 7 and i > 5 and j < n - 5:
                out.append(((i + j) / 2) * 0.01)
            i = j
        else:
            i += 1
    return out, len(a) / sr


def word_times(cues, dur, found_gaps):
    """Estima l'inici de cada paraula: pes per lletres + pausa per puntuació, ancorat a les pauses reals."""
    flat = [w for c in cues for w in c]
    weights, bounds = [], []  # bounds: índex de paraula després d'una puntuació
    for i, w in enumerate(flat):
        letters = len(re.sub(r"[^\wà-ü·]", "", w["w"], flags=re.I))
        weights.append(letters * 1.0 + 1.6)
        if re.search(r"[,.:;?!…]$", w["w"]) and i < len(flat) - 1:
            bounds.append(i + 1)
    pause_w = 4.0
    total = sum(weights) + pause_w * len(bounds)
    lead, tail = 0.05, 0.12
    scale = (dur - lead - tail) / total
    t, est = lead, []
    for i, wt in enumerate(weights):
        if i in bounds:
            t += pause_w * scale
        est.append(t)
        t += wt * scale
    # ancoratge: cada límit de puntuació es mou a la pausa real més propera (si n'hi ha a < 0.45 s)
    anchors = [(0, est[0])]
    used = set()
    for b in bounds:
        guess = est[b] - pause_w * scale * 0.5
        best = None
        for k, g in enumerate(found_gaps):
            if k in used:
                continue
            if abs(g - guess) < 0.45 and (best is None or abs(g - guess) < abs(found_gaps[best] - guess)):
                best = k
        if best is not None:
            used.add(best)
            anchors.append((b, found_gaps[best] + 0.06))
    anchors.append((len(flat), dur - tail))
    anchors.sort()
    # re-escalat lineal a trossos entre ancoratges
    res = est[:]
    for (i0, t0), (i1, t1) in zip(anchors, anchors[1:]):
        if i1 <= i0:
            continue
        e0 = est[i0]
        e1 = est[i1] if i1 < len(est) else (est[-1] + weights[-1] * scale)
        for i in range(i0, min(i1, len(est))):
            res[i] = t0 + (est[i] - e0) * (t1 - t0) / max(1e-6, e1 - e0)
    for w, rt in zip(flat, res):
        w["t"] = round(rt, 3)


timeline = {"fps": FPS, "bpm": BPM, "scenes": [], "lines": []}
t = 0.0
for sid, lead, tail in SCENES:
    start = ceil_beat(t)
    cur = start + lead
    sl = [l for l in lines if l["scene"] == sid]
    for i, l in enumerate(sl):
        wav = ROOT / f"public/audio/voice/{l['id']}.wav"
        found, dur = gaps(wav)
        cues = tokens(l["text"])
        word_times(cues, dur, found)
        entry = {"id": l["id"], "scene": sid, "start": round(cur, 3), "dur": round(dur, 3), "cues": []}
        for c in cues:
            entry["cues"].append({"words": [{**w, "t": round(cur + w["t"], 3)} for w in c]})
        timeline["lines"].append(entry)
        cur += dur + (l["pause"] if i < len(sl) - 1 else 0)
    end = cur + tail
    timeline["scenes"].append({"id": sid, "start": round(start, 3)})
    t = end

total = ceil_beat(t)
for i, s in enumerate(timeline["scenes"]):
    s["end"] = timeline["scenes"][i + 1]["start"] if i + 1 < len(timeline["scenes"]) else total
    s["from"] = round(s["start"] * FPS)
    s["frames"] = round(s["end"] * FPS) - s["from"]
timeline["duration"] = total
timeline["frames"] = round(total * FPS)

# temps d'inici/fi de cada bloc de subtítol
all_cues = []
for li, l in enumerate(timeline["lines"]):
    nxt = timeline["lines"][li + 1]["start"] if li + 1 < len(timeline["lines"]) else total
    line_end = l["start"] + l["dur"]
    for ci, c in enumerate(l["cues"]):
        c["start"] = round(c["words"][0]["t"] - 0.08, 3)
        if ci + 1 < len(l["cues"]):
            c["end"] = round(l["cues"][ci + 1]["words"][0]["t"] - 0.1, 3)
        else:
            c["end"] = round(min(line_end + 0.45, nxt - 0.12), 3)
        all_cues.append(c)

# Esdeveniments musicals compartits per música, efectes i animació
last = timeline["lines"][-1]
sc = {s["id"]: s for s in timeline["scenes"]}
timeline["events"] = {
    "logoHit": 1.0,                                   # el logotip "aterra" a l'obertura
    "drop": sc["marketing"]["start"],                 # clímax musical: escena de màrqueting
    "teamLift": sc["team"]["start"],                  # break emotiu: equip
    "finalHit": round(ceil_beat(last["start"] + last["dur"] + 0.3), 3),  # cop final del logotip
}

out = ROOT / "src/data/timeline.json"
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps(timeline, ensure_ascii=False, indent=1))


def srt_time(x):
    ms = int(round(x * 1000))
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


dist = ROOT / "dist"; dist.mkdir(exist_ok=True)
srt = []
for i, c in enumerate(all_cues, 1):
    srt.append(f"{i}\n{srt_time(c['start'])} --> {srt_time(c['end'])}\n{' '.join(w['w'] for w in c['words'])}\n")
(dist / "inllobsa-video.srt").write_text("\n".join(srt), encoding="utf-8")

for s in timeline["scenes"]:
    print(f"{s['id']:10s} {s['start']:6.2f} → {s['end']:6.2f}  ({s['end'] - s['start']:.2f}s)")
print(f"TOTAL {total:.2f}s  {timeline['frames']} frames")
