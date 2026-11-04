import React from "react";
import { C, FONT } from "../lib/brand";
import { Fill, useLayout, useT } from "../lib/layout";
import { BACK, BEAT, EIO, EO, k, pulse, scene } from "../lib/time";
import { Counter, Photo } from "../components/Kit";
import type { Cue } from "../components/Sfx";

const S = scene("numbers");
const b = (n: number) => S.start + n * BEAT;
// xifres de la landing (src/i18n/ca.json → stats)
const STATS = [
  { value: 50, from: 0, suffix: "", label: "anys", sub: "d'experiència", photo: "photos/oficina-1920.jpg", pos: "50% 40%" },
  { value: 1977, from: 1900, suffix: "", label: "any", sub: "de fundació", photo: "photos/equip-banda-1600.jpg", pos: "50% 30%" },
  { value: 100, from: 0, suffix: "%", label: "gestió", sub: "transparent", photo: "photos/hero-03-1920.jpg", pos: "50% 25%" },
  { value: 10, from: 0, suffix: "", label: "professionals", sub: "al teu servei", photo: "photos/hero-02-1920.jpg", pos: "50% 30%" },
];

export const numbersSfx: Cue[] = [
  { t: S.start - 0.3, name: "whoosh", vol: 0.4 },
  ...STATS.map((_, i) => ({ t: b(i * 4) + 0.05, name: "impact", vol: 0.28 })),
  ...STATS.slice(1).map((_, i) => ({ t: b((i + 1) * 4) - 0.25, name: "whoosh-down", vol: 0.25 })),
];

export const Numbers: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  const { W, H, v } = useLayout();
  const enter = k(t, S.start - 0.4, S.start + 0.15, 0, 1, EIO);

  return (
    <Fill style={{ clipPath: t < S.start + 0.2 ? `inset(0 0 ${(1 - enter) * 100}% 0)` : undefined, background: C.navy900 }}>
      {STATS.map((s, i) => {
        const t0 = b(i * 4);
        const t1 = b(i * 4 + 4);
        if (t < t0 - 0.4 || t > t1 + 0.4) return null;
        const inA = k(t, t0 - 0.3, t0 + 0.2, 0, 1, EIO);
        const outA = i < 3 ? k(t, t1 - 0.3, t1 + 0.2, 0, 1, EIO) : 0;
        const big = k(t, t0, t0 + 0.5, 0, 1, BACK);
        const lab = k(t, t0 + 0.35, t0 + 0.8, 0, 1, EO);
        const hit = pulse(t, 6) * (t > t0 ? 1 : 0);
        const ring = k(t, t0 + 0.1, t0 + 1.4, 0, 1, EO);
        return (
          <Fill key={i} style={{ translate: `0 ${(1 - inA) * 100 - outA * 100}%` }}>
            {/* foto real en duotò */}
            <Photo src={s.photo} t={t} t0={t0} dur={4 * BEAT} from={[1.18, 2, 0]} to={[1.06, -2, 0]} position={s.pos} style={{ filter: "grayscale(1) contrast(1.05)" }} />
            <Fill style={{ background: `linear-gradient(${v ? 180 : 100}deg, ${C.navy900}f2 0%, ${C.navy}d9 45%, ${C.blue}99 100%)`, mixBlendMode: "normal" }} />
            <Fill style={{ background: `radial-gradient(60% 70% at ${v ? "50% 40%" : "30% 50%"}, ${C.orange}33, transparent 70%)` }} />
            {/* número gegant de fons */}
            <div
              style={{
                position: "absolute",
                right: v ? -60 : -80,
                bottom: v ? 260 : -120,
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: v ? 620 : 760,
                letterSpacing: "-0.06em",
                color: "transparent",
                WebkitTextStroke: "3px rgba(255,255,255,.10)",
                translate: `${(t - t0) * -30}px 0`,
                lineHeight: 1,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                position: "absolute",
                left: v ? 0 : 150,
                right: v ? 0 : undefined,
                top: v ? 430 : 230,
                display: "flex",
                flexDirection: "column",
                alignItems: v ? "center" : "flex-start",
                fontFamily: FONT,
                color: "#fff",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 18, fontWeight: 800, fontSize: v ? 30 : 26, letterSpacing: ".18em", color: "#cfe0f5", opacity: lab }}>
                <span style={{ width: 46 * lab, height: 4, background: C.orange, borderRadius: 3 }} />
                {String(i + 1).padStart(2, "0")} / 04
              </div>
              <div
                style={{
                  fontWeight: 900,
                  fontSize: v ? (s.value >= 1000 ? 250 : 300) : s.value >= 1000 ? 330 : 380,
                  lineHeight: 0.95,
                  letterSpacing: "-0.055em",
                  scale: String((0.6 + 0.4 * big) * (1 + hit * 0.02)),
                  transformOrigin: v ? "50% 50%" : "0 60%",
                  textShadow: "0 20px 60px rgba(0,0,0,.35)",
                }}
              >
                <Counter value={s.value} from={s.from} t={t} t0={t0} dur={0.9} />
                <span style={{ color: C.orangeLight }}>{s.suffix}</span>
              </div>
              <div style={{ overflow: "hidden", paddingBottom: 10 }}>
                <div style={{ fontWeight: 900, fontSize: v ? 84 : 92, letterSpacing: "-0.03em", lineHeight: 1, translate: `0 ${(1 - lab) * 120}%` }}>
                  {s.label} <span style={{ color: C.orangeLight }}>{s.sub}</span>
                </div>
              </div>
            </div>
            {/* anell de progrés per al 100% */}
            {s.value === 100 && (
              <svg width={v ? 380 : 420} height={v ? 380 : 420} style={{ position: "absolute", right: v ? W / 2 - 190 : 210, top: v ? 1100 : H / 2 - 210 }}>
                <circle cx="50%" cy="50%" r="42%" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth={22} />
                <circle
                  cx="50%"
                  cy="50%"
                  r="42%"
                  fill="none"
                  stroke={C.orange}
                  strokeWidth={22}
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="1 1"
                  strokeDashoffset={1 - ring}
                  style={{ rotate: "-90deg", transformOrigin: "50% 50%" }}
                />
              </svg>
            )}
          </Fill>
        );
      })}
      {/* indicadors */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: v ? 200 : 40, display: "flex", justifyContent: "center", gap: 12, opacity: v ? 0 : 1 }}>
        {STATS.map((_, i) => (
          <div key={i} style={{ width: 70, height: 5, borderRadius: 3, background: "rgba(255,255,255,.25)", overflow: "hidden" }}>
            <div style={{ height: "100%", background: C.orange, width: `${k(t, b(i * 4), b(i * 4 + 4), 0, 100, (x) => x)}%` }} />
          </div>
        ))}
      </div>
    </Fill>
  );
};
