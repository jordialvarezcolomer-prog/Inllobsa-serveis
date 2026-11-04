import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT } from "../lib/brand";
import { useLayout } from "../lib/layout";
import { BACK, EO, FPS, k, TL } from "../lib/time";

/**
 * Missatges en pantalla sense requadre: tipografia gran i neta, paraula a paraula.
 * Sobre fons fosc: blanc amb ombra suau; sobre fons clar: navy. Paraules clau en taronja.
 */
export const Captions: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const { v, W, H } = useLayout();
  const cue = TL.captions.find((c) => t >= c.start - 0.05 && t < c.end + 0.3);
  if (!cue) return null;
  const sc = TL.scenes.find((s) => s.id === cue.scene)!;
  const dark = sc.theme === "dark";
  const words: { w: string; hl: boolean }[] = [];
  let on = false;
  for (const raw of cue.text.split(" ")) {
    if (raw.startsWith("*")) on = true;
    words.push({ w: raw.replace(/\*/g, ""), hl: on });
    if (raw.replace(/[.,:;?!]+$/, "").endsWith("*")) on = false;
  }
  const out = k(t, cue.end - 0.05, cue.end + 0.25, 0, 1, EO);
  const size = v ? 58 : 50;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: v ? H * 0.2 : 70,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        opacity: 1 - out,
        translate: `0 ${-out * 18}px`,
      }}
    >
      <div
        style={{
          maxWidth: v ? W - 110 : 1500,
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: size,
          lineHeight: 1.12,
          letterSpacing: "-0.015em",
          color: dark ? C.white : C.navy,
          textShadow: dark ? "0 2px 4px rgba(10,16,28,.55), 0 6px 28px rgba(10,16,28,.65)" : "0 2px 16px rgba(255,255,255,.9)",
        }}
      >
        {words.map((w, i) => {
          const a = k(t, cue.start + i * 0.045, cue.start + i * 0.045 + 0.42, 0, 1, BACK);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                marginRight: "0.24em",
                color: w.hl ? (dark ? C.orangeLight : C.orange) : undefined,
                opacity: Math.min(1, a * 1.4),
                translate: `0 ${(1 - a) * 26}px`,
                filter: `blur(${(1 - Math.min(1, a)) * 6}px)`,
              }}
            >
              {w.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};
