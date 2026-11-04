import React from "react";
import { C, FONT } from "../lib/brand";
import { Fill, useLayout, useT } from "../lib/layout";
import { BACK, BEAT, EIO, EO, k, pulse, scene } from "../lib/time";
import type { Cue } from "../components/Sfx";

const S = scene("values");
const b = (n: number) => S.start + n * BEAT;
const STAR = "#fbbf24"; // --star de la landing
// valors de la landing (src/i18n/ca.json → values) amb les seves il·lustracions (src/art/*.svg)
const VALUES = [
  { id: "excellence", title: "Excel·lència", text: "Busquem superar-nos constantment per oferir el millor servei en cada pas." },
  { id: "originality", title: "Originalitat", text: "Apostem per la innovació i per fer les coses d'una manera diferent." },
  { id: "family", title: "Família", text: "Un ambient proper on cadascú se sent valorat i recolzat." },
  { id: "training", title: "Formació", text: "Ens formem contínuament per oferir-te un assessorament rigorós i actualitzat." },
];
const LEN = 3.5;
const T_SUM = 14;

export const valuesSfx: Cue[] = [
  { t: S.start - 0.4, name: "whoosh", vol: 0.4 },
  ...VALUES.map((_, i) => ({ t: b(i * LEN) + 0.02, name: i === 0 ? "sparkle" : "rise", vol: 0.32 })),
  { t: b(T_SUM), name: "impact", vol: 0.25 },
];

const Art: React.FC<{ id: string; d: number; t: number; size: number }> = ({ id, d, t, size }) => {
  const line = { fill: "none", stroke: "#fff", strokeWidth: 2.4, strokeLinecap: "round", strokeLinejoin: "round", pathLength: 1, strokeDasharray: "1 1", strokeDashoffset: 1 - d } as const;
  const tw = (o: number) => 0.4 + 0.6 * Math.abs(Math.sin(t * 3 + o));
  const fillA = k(d, 0.7, 1, 0, 1);
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} style={{ overflow: "visible" }}>
      {id === "excellence" && (
        <>
          <path d="M32 9l6.6 14.2 15.4 1.6-11.6 10.4 3.4 15.3L32 42.6l-13.8 7.9 3.4-15.3L10 24.8l15.4-1.6z" {...line} stroke={d > 0.6 ? STAR : "#fff"} fill={`rgba(251,191,36,${0.9 * fillA})`} style={{ scale: String(1 + 0.06 * Math.sin(t * 4)), transformOrigin: "32px 30px" }} />
          {["M54 6v6M51 9h6", "M9 44v5M6.5 46.5h5", "M55 46v4M53 48h4"].map((p, i) => (
            <path key={i} d={p} fill="none" stroke={STAR} strokeWidth={2.4} strokeLinecap="round" opacity={fillA * tw(i)} />
          ))}
        </>
      )}
      {id === "originality" && (
        <>
          <circle cx="32" cy="26" r="17" fill={STAR} opacity={fillA * (0.25 + 0.2 * Math.sin(t * 4))} />
          <path d="M32 2v4M14 9l3 3M50 9l-3 3M6 26h4M54 26h4" fill="none" stroke={STAR} strokeWidth={2.4} strokeLinecap="round" opacity={fillA * tw(0)} />
          <path d="M32 11a14 14 0 0 0-8.2 25.4c1.5 1.1 2.4 2.9 2.4 4.8V44h11.6v-2.8c0-1.9.9-3.7 2.4-4.8A14 14 0 0 0 32 11z" {...line} />
          <path d="M26.5 49h11M28.5 54h7M28 30l4 4 4-4" {...line} />
        </>
      )}
      {id === "family" && (
        <>
          <path d="M8 31 32 11l24 20" {...line} />
          <path d="M14 26v28h36V26" {...line} />
          <path d="M32 47s-9-5.4-9-11a4.8 4.8 0 0 1 9-2.4A4.8 4.8 0 0 1 41 36c0 5.6-9 11-9 11z" fill={C.orange} opacity={fillA} style={{ scale: String(1 + 0.12 * pulse(t, 6)), transformOrigin: "32px 40px" }} />
          {[0, 1].map((i) => {
            const q = ((t * 0.5 + i * 0.5) % 1);
            return <path key={i} d={i ? "M14 12s-2.8-1.7-2.8-3.4a1.5 1.5 0 0 1 2.8-.7 1.5 1.5 0 0 1 2.8.7c0 1.7-2.8 3.4-2.8 3.4z" : "M50 14s-3.5-2.1-3.5-4.3a1.9 1.9 0 0 1 3.5-.9 1.9 1.9 0 0 1 3.5.9c0 2.2-3.5 4.3-3.5 4.3z"} fill="#f5a593" opacity={fillA * Math.sin(q * Math.PI)} style={{ translate: `0 ${-q * 8}px` }} />;
          })}
        </>
      )}
      {id === "training" && (
        <>
          <g style={{ rotate: `${Math.sin(t * 2.5) * 4}deg`, transformOrigin: "32px 30px" }}>
            <path d="M4 25 32 13l28 12-28 12z" {...line} />
            <path d="M16 31v10c0 4.4 7.2 8 16 8s16-3.6 16-8V31" {...line} />
            <g style={{ rotate: `${Math.sin(t * 4) * 12}deg`, transformOrigin: "55px 27px" }}>
              <path d="M55 27v14" {...line} />
              <circle cx="55" cy="44" r="3" fill={C.orange} opacity={fillA} />
            </g>
          </g>
          {["M8 46v5M5.5 48.5h5", "M58 8v4M56 10h4"].map((p, i) => (
            <path key={i} d={p} fill="none" stroke={STAR} strokeWidth={2.4} strokeLinecap="round" opacity={fillA * tw(i)} />
          ))}
        </>
      )}
    </svg>
  );
};

export const Values: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  const { W, H, v } = useLayout();
  const enter = k(t, S.start - 0.4, S.start + 0.15, 0, 1, EIO);
  const sum = k(t, b(T_SUM) - 0.2, b(T_SUM) + 0.3, 0, 1, EO);

  return (
    <Fill style={{ clipPath: t < S.start + 0.2 ? `inset(0 ${(1 - enter) * 100}% 0 0)` : undefined, background: C.tint }}>
      {VALUES.map((val, i) => {
        const t0 = b(i * LEN);
        const t1 = b((i + 1) * LEN);
        if (t < t0 - 0.4 || t > t1 + 0.4 || sum >= 1) return null;
        const inA = i === 0 ? 1 : k(t, t0 - 0.3, t0 + 0.15, 0, 1, EIO);
        const d = k(t, t0, t0 + 1.0, 0, 1, EIO);
        const word = k(t, t0 + 0.05, t0 + 0.5, 0, 1, EO);
        const txt = k(t, t0 + 0.4, t0 + 0.9, 0, 1, EO);
        const bg = i % 2 ? "#ffffff" : C.tint;
        const R = v ? 300 : 330;
        return (
          <Fill key={val.id} style={{ clipPath: `inset(0 0 0 ${(1 - inA) * 100}%)`, background: bg }}>
            <div style={{ position: "absolute", right: v ? -40 : 80, top: v ? 60 : 60, fontFamily: FONT, fontWeight: 900, fontSize: v ? 420 : 520, color: C.navy, opacity: 0.05, letterSpacing: "-0.05em", lineHeight: 1 }}>
              {String(i + 1).padStart(2, "0")}
            </div>
            <div style={{ position: "absolute", left: v ? W / 2 - R : 190, top: v ? 250 : H / 2 - R, width: R * 2, height: R * 2, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, ${C.blue}, ${C.navy})`, boxShadow: "0 40px 90px rgba(30,41,59,.3)", display: "grid", placeItems: "center", scale: String(k(t, t0 - 0.1, t0 + 0.4, 0.6, 1, BACK)) }}>
              <Art id={val.id} d={d} t={t} size={R * 1.15} />
            </div>
            <div style={{ position: "absolute", left: v ? 80 : 960, right: v ? 80 : 120, top: v ? 960 : 330, fontFamily: FONT, textAlign: v ? "center" : "left" }}>
              <div style={{ fontWeight: 800, fontSize: 28, letterSpacing: ".18em", color: C.blue, textTransform: "uppercase" }}>El nostre ADN · {String(i + 1).padStart(2, "0")}</div>
              <div style={{ overflow: "hidden", paddingBottom: 14 }}>
                <div style={{ fontWeight: 900, fontSize: v ? 128 : 150, color: C.navy, letterSpacing: "-0.045em", lineHeight: 1.05, translate: `0 ${(1 - word) * 130}%` }}>
                  {val.title}
                  <span style={{ color: C.orange }}>.</span>
                </div>
              </div>
              <div style={{ fontWeight: 600, fontSize: v ? 40 : 40, color: C.muted, lineHeight: 1.35, opacity: txt, translate: `0 ${(1 - txt) * 20}px`, maxWidth: 820, margin: v ? "0 auto" : undefined }}>{val.text}</div>
            </div>
          </Fill>
        );
      })}
      {/* resum: els quatre valors junts */}
      {sum > 0 && (
        <Fill style={{ background: C.navy, opacity: sum }}>
          <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: v ? "1fr 1fr" : "repeat(4, 1fr)", alignContent: "center", gap: v ? 40 : 0, padding: v ? "0 60px 300px" : "0 80px 80px" }}>
            {VALUES.map((val, i) => {
              const a = k(t, b(T_SUM) + i * 0.08, b(T_SUM) + 0.4 + i * 0.08, 0, 1, BACK);
              return (
                <div key={val.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, scale: String(0.6 + 0.4 * a), opacity: Math.min(1, a * 1.5) }}>
                  <Art id={val.id} d={1} t={t} size={v ? 200 : 210} />
                  <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: v ? 52 : 50, color: "#fff", letterSpacing: "-0.02em" }}>{val.title}</div>
                </div>
              );
            })}
          </div>
        </Fill>
      )}
    </Fill>
  );
};
