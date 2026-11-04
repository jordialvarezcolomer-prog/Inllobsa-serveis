import { Easing, interpolate } from "remotion";
import timeline from "../data/timeline.json";

export const TL = timeline;
export const FPS = timeline.fps;
export type SceneId =
  | "opening" | "sale" | "rent" | "legal" | "shopper" | "marketing" | "team" | "closing";

export const scene = (id: SceneId) => timeline.scenes.find((s) => s.id === id)!;
export const line = (id: string) => timeline.lines.find((l) => l.id === id)!;
export const EV = timeline.events;

/** Temps absolut (s) en què comença la paraula `word` (o l'índex) de la frase `lineId`. */
export const wt = (lineId: string, word: string | number, occurrence = 0): number => {
  const words = line(lineId).cues.flatMap((c) => c.words);
  if (typeof word === "number") return words[word].t;
  const norm = (s: string) => s.toLowerCase().replace(/[^a-zà-ü·0-9']/g, "");
  let seen = 0;
  for (const w of words) {
    if (norm(w.w).startsWith(norm(word))) {
      if (seen === occurrence) return w.t;
      seen++;
    }
  }
  throw new Error(`Paraula no trobada: ${lineId} / ${word}`);
};
export const lineStart = (id: string) => line(id).start;
export const lineEnd = (id: string) => line(id).start + line(id).dur;
export const sec = (s: number) => Math.round(s * FPS);

// --- easings
export const EO = Easing.bezier(0.16, 1, 0.3, 1); // expo out
export const EIO = Easing.bezier(0.65, 0, 0.35, 1); // in-out
export const EI = Easing.bezier(0.7, 0, 0.84, 0); // in
export const BACK = Easing.bezier(0.34, 1.56, 0.64, 1); // overshoot

/** Interpolació en segons absoluts amb clamp. */
export const k = (
  t: number,
  t0: number,
  t1: number,
  a: number,
  b: number,
  easing: (x: number) => number = EO,
) => interpolate(t, [t0, t1], [a, b], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

/** Progrés 0→1 entre t0 i t0+d. */
export const p = (t: number, t0: number, d: number, easing: (x: number) => number = EO) =>
  k(t, t0, t0 + d, 0, 1, easing);

/** Molla amortida simple (0→1) a partir de t0. */
export const spring = (t: number, t0: number, freq = 2.2, damp = 6) => {
  const x = t - t0;
  if (x <= 0) return 0;
  return 1 - Math.exp(-damp * x) * Math.cos(freq * 2 * Math.PI * x);
};
