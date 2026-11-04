import React from "react";
import { C } from "../lib/brand";
import { Fill } from "../lib/layout";

/** Fons fosc: degradat navy + retícula subtil + llums de color en moviment. */
export const DarkBg: React.FC<{ t: number; accent?: number; grid?: boolean }> = ({ t, accent = 1, grid = true }) => (
  <Fill style={{ background: `radial-gradient(120% 90% at 50% 40%, ${C.navy} 0%, ${C.navy900} 70%)` }}>
    <div
      style={{
        position: "absolute",
        width: 1100,
        height: 1100,
        left: `${30 + Math.sin(t * 0.25) * 12}%`,
        top: `${-20 + Math.cos(t * 0.2) * 10}%`,
        background: `radial-gradient(circle, ${C.blue}55 0%, transparent 60%)`,
        translate: "-50% 0",
      }}
    />
    <div
      style={{
        position: "absolute",
        width: 900,
        height: 900,
        left: `${70 + Math.cos(t * 0.3) * 10}%`,
        top: `${50 + Math.sin(t * 0.22) * 12}%`,
        background: `radial-gradient(circle, ${C.orange}${Math.round(40 * accent)
          .toString(16)
          .padStart(2, "0")} 0%, transparent 60%)`,
        translate: "-50% -50%",
      }}
    />
    {grid && (
      <div
        style={{
          position: "absolute",
          inset: -120,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
          translate: `${(t * 12) % 120}px ${(t * 6) % 120}px`,
        }}
      />
    )}
  </Fill>
);

/** Fons clar: blanc → tint corporatiu amb trama de punts. */
export const LightBg: React.FC<{ t: number; tone?: string }> = ({ t, tone = C.tint }) => (
  <Fill style={{ background: `linear-gradient(160deg, #ffffff 0%, ${tone} 100%)` }}>
    <div
      style={{
        position: "absolute",
        inset: -80,
        backgroundImage: `radial-gradient(${C.navy}22 1.6px, transparent 1.6px)`,
        backgroundSize: "40px 40px",
        translate: `${(t * -8) % 40}px 0`,
        maskImage: "radial-gradient(70% 70% at 50% 50%, black 20%, transparent 80%)",
      }}
    />
  </Fill>
);

/** Vinyeta suau per donar profunditat cinematogràfica. */
export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.45 }) => (
  <Fill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(120% 100% at 50% 50%, transparent 55%, rgba(10,16,28,${strength}) 100%)`,
    }}
  />
);
