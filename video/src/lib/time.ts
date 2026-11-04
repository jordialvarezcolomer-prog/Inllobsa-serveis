import { Easing, interpolate } from "remotion";
import { BAR, BEAT, CAPTIONS, FPS, OFFSET, SCENE_BARS, type SceneId, type Theme } from "../data/story";
import music from "../data/music.json";

export { FPS, BEAT, BAR };
export type { SceneId };

// Línia de temps derivada dels compassos: cada escena comença sobre un temps fort de la música.
type Scene = { id: SceneId; start: number; end: number; from: number; frames: number; theme: Theme };
let acc = 0;
const scenes: Scene[] = SCENE_BARS.map((s, i) => {
  const start = i === 0 ? 0 : OFFSET + acc * BAR;
  acc += s.bars;
  const end = OFFSET + acc * BAR;
  return { id: s.id, start, end, from: Math.round(start * FPS), frames: Math.round(end * FPS) - Math.round(start * FPS), theme: s.theme };
});
const last = scenes[scenes.length - 1];
// el final s'allarga fins al final de la música (acord sostingut)
const duration = Math.max(last.end, Math.min(music.duration, last.end + 2));
last.end = duration;
last.frames = Math.round(duration * FPS) - last.from;

export const TL = {
  fps: FPS,
  scenes,
  duration,
  frames: Math.round(duration * FPS),
  captions: CAPTIONS.map((c) => {
    const s = scenes.find((x) => x.id === c.scene)!;
    return { ...c, start: s.start + c.at * BEAT, end: s.start + (c.at + c.len) * BEAT };
  }),
};

export const scene = (id: SceneId) => scenes.find((s) => s.id === id)!;
/** Temps absolut del temps musical `n` (pot ser fraccionari) dins de l'escena. */
export const bt = (id: SceneId, n: number) => scene(id).start + n * BEAT;
export const sec = (s: number) => Math.round(s * FPS);

// --- easings
export const EO = Easing.bezier(0.16, 1, 0.3, 1);
export const EIO = Easing.bezier(0.65, 0, 0.35, 1);
export const EI = Easing.bezier(0.7, 0, 0.84, 0);
export const BACK = Easing.bezier(0.34, 1.56, 0.64, 1);

export const k = (t: number, t0: number, t1: number, a: number, b: number, easing: (x: number) => number = EO) =>
  interpolate(t, [t0, t1], [a, b], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });
export const p = (t: number, t0: number, d: number, easing: (x: number) => number = EO) => k(t, t0, t0 + d, 0, 1, easing);
/** Pols que decau després de cada temps (0..1), per fer "bategar" elements amb la música. */
export const pulse = (t: number, decay = 7) => {
  const x = (((t - OFFSET) % BEAT) + BEAT) % BEAT;
  return Math.exp(-x * decay);
};
