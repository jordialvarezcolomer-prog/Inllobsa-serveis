"""Genera la locució femenina en català (Piper · veu ca_ES-upc_ona-medium).

Ús:  python script/tts.py --model /ruta/ca_ES-upc_ona-medium.onnx

Per a cada frase de narration.json crea assets/voice/raw/Lxx.wav i el tractat
public/audio/voice/Lxx.wav (48 kHz, EQ de veu, compressió suau, silencis retallats).

Si existeix script/voice-override/Lxx.wav (p. ex. una locució professional o una
veu d'ElevenLabs/Azure), s'utilitza aquest fitxer en lloc de la síntesi.
"""
import argparse, json, subprocess, wave
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
p = argparse.ArgumentParser()
p.add_argument("--model", required=True)
p.add_argument("--length-scale", type=float, default=0.93)
p.add_argument("--takes", type=int, default=1, help="preses per frase (es tria la més intel·ligible)")
p.add_argument("--asr", help="directori del model sherpa-onnx-whisper-small per puntuar les preses")
p.add_argument("--only", help="ids separats per comes")
args = p.parse_args()

lines = json.loads((ROOT / "script/narration.json").read_text())["lines"]
raw_dir = ROOT / "assets/voice/raw"; raw_dir.mkdir(parents=True, exist_ok=True)
out_dir = ROOT / "public/audio/voice"; out_dir.mkdir(parents=True, exist_ok=True)
override = ROOT / "script/voice-override"

voice = None


def trim(path, pre=0.04, post=0.12, rel_db=-30):
    """Retalla el silenci inicial i final segons l'envolupant d'energia (finestres de 10 ms)."""
    import numpy as np, soundfile as sf
    a, sr = sf.read(str(path), dtype="float32")
    win = int(sr * 0.01)
    n = len(a) // win
    rms = np.sqrt((a[: n * win].reshape(n, win) ** 2).mean(1) + 1e-12)
    db = 20 * np.log10(rms / rms.max())
    idx = np.where(db > rel_db)[0]
    s0 = max(0, idx[0] * win - int(pre * sr))
    s1 = min(len(a), (idx[-1] + 1) * win + int(post * sr))
    seg = a[s0:s1].copy()
    f = int(0.008 * sr)
    seg[:f] *= np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)
    sf.write(str(path), seg, sr, subtype="PCM_16")

# Cadena de tractament de veu: neteja de greus, cos, presència, aire, compressió i límit.
CHAIN = ("aresample=48000:resampler=soxr,highpass=f=85,"
         "equalizer=f=180:t=q:w=1.0:g=1.5,equalizer=f=350:t=q:w=1.2:g=-1.5,"
         "equalizer=f=3200:t=q:w=1.0:g=2.5,highshelf=f=9000:g=2,"
         "acompressor=threshold=-20dB:ratio=3:attack=5:release=80:makeup=3,"
         "alimiter=limit=0.89")

asr = None
def norm(t):
    import re, unicodedata
    t = unicodedata.normalize("NFD", t.lower().replace("·", ""))
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]+", " ", t).strip()

def score(path, ref):
    """Semblança 0-1 entre la transcripció de Whisper i el text esperat."""
    global asr
    import difflib, numpy as np, soundfile as sf, sherpa_onnx
    if asr is None:
        d = args.asr.rstrip("/") + "/"
        asr = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=d + "small-encoder.int8.onnx",
            decoder=d + "small-decoder.int8.onnx", tokens=d + "small-tokens.txt", language="ca", num_threads=8)
    a, sr = sf.read(str(path), dtype="float32")
    a = np.concatenate([np.zeros(int(sr * .3), "float32"), a, np.zeros(int(sr * .8), "float32")])
    st = asr.create_stream(); st.accept_waveform(sr, a); asr.decode_stream(st)
    hyp = st.result.text
    return difflib.SequenceMatcher(None, norm(hyp), norm(ref)).ratio(), hyp

only = set(args.only.split(",")) if args.only else None
for ln in lines:
    lid = ln["id"]
    if only and lid not in only:
        continue
    raw = raw_dir / f"{lid}.wav"
    src = override / f"{lid}.wav"
    if src.exists():
        raw = src
        print(lid, "override")
    else:
        if voice is None:
            from piper import PiperVoice, SynthesisConfig
            voice = PiperVoice.load(args.model, config_path=args.model + ".json")
            cfg = SynthesisConfig(length_scale=args.length_scale, noise_scale=0.72, noise_w_scale=0.85)
        ref = ln["text"].replace("*", "").replace("|", " ")
        best = None
        for k in range(args.takes):
            take = raw_dir / f"{lid}.take{k}.wav"
            with wave.open(str(take), "wb") as w:
                voice.synthesize_wav(ln["tts"], w, syn_config=cfg)
            if args.takes == 1:
                best = (1, "", take); break
            sc, hyp = score(take, ref)
            if best is None or sc > best[0]:
                best = (sc, hyp, take)
        take = best[2]
        take.replace(raw)
        for t in raw_dir.glob(f"{lid}.take*.wav"):
            t.unlink()
        if args.takes > 1:
            print(f"   {lid} millor presa {best[0]:.2f}: {best[1]}")
    out = out_dir / f"{lid}.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(raw), "-af", CHAIN, "-ac", "1", str(out)], check=True)
    trim(out)
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                         "-of", "csv=p=0", str(out)]).decode())
    print(f"{lid} {dur:6.2f}s  {ln['tts']}")
