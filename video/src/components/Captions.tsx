import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT } from "../lib/brand";
import { useLayout } from "../lib/layout";
import { EO, FPS, k, TL } from "../lib/time";

type Cue = { start: number; end: number; words: { w: string; hl: boolean; t: number }[] };
const CUES: Cue[] = TL.lines.flatMap((l) => l.cues as Cue[]);

/**
 * Subtítols integrats: blanc, paraules clau en taronja, màxim dues línies.
 * Cada paraula s'il·lumina subtilment quan la locutora la pronuncia.
 */
export const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const { v, W, H } = useLayout();
  const cue = CUES.find((c) => t >= c.start - 0.05 && t < c.end + 0.12);
  if (!cue) return null;
  const inA = k(t, cue.start - 0.05, cue.start + 0.22, 0, 1, EO);
  const outA = k(t, cue.end - 0.05, cue.end + 0.12, 0, 1, EO);
  const a = inA * (1 - outA);
  const size = v ? 50 : 42;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        // 16:9: a baix; 9:16: per sobre de la zona d'interfície de Reels/TikTok
        bottom: v ? H * 0.235 : 64,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          maxWidth: v ? W - 120 : 1380,
          padding: v ? "16px 30px 18px" : "12px 30px 14px",
          borderRadius: 18,
          background: "rgba(16,24,40,.72)",
          boxShadow: "0 10px 40px rgba(0,0,0,.25)",
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: size,
          lineHeight: 1.25,
          letterSpacing: "-0.005em",
          color: C.white,
          opacity: a,
          translate: `0 ${(1 - inA) * 14}px`,
        }}
      >
        {cue.words.map((w, i) => {
          const lit = k(t, w.t - 0.06, w.t + 0.12, 0, 1);
          return (
            <span
              key={i}
              style={{
                color: w.hl ? C.orangeLight : C.white,
                opacity: 0.62 + 0.38 * lit,
                fontWeight: w.hl ? 800 : 700,
              }}
            >
              {w.w}
              {i < cue.words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
};
