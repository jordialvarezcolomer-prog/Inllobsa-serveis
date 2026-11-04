import React from "react";
import { Img, staticFile } from "remotion";
import { Check, KeyRound, Landmark, ShieldCheck } from "lucide-react";
import { C, FONT } from "../lib/brand";
import { Fill, useLayout, useT } from "../lib/layout";
import { BACK, BEAT, EIO, EO, k, p, scene } from "../lib/time";
import { LightBg } from "../components/Bg";
import type { Cue } from "../components/Sfx";

const S = scene("legal");
const b = (n: number) => S.start + n * BEAT;
// textos dels serveis "Assessorament hipotecari" i "Orientació legal i jurídica" de la landing
const ITEMS = ["Herències i successions", "Càrregues registrals", "Contractes d'arres i compravenda"];
const T_ITEMS = 4;
const T_STAMP = 8;

export const legalSfx: Cue[] = [
  { t: S.start - 0.45, name: "whoosh", vol: 0.4 },
  { t: b(1), name: "rise", vol: 0.3 },
  { t: b(2.5), name: "tick", vol: 0.3 },
  ...ITEMS.map((_, i) => ({ t: b(T_ITEMS + i), name: "tick", vol: 0.4 })),
  { t: b(T_STAMP), name: "stamp", vol: 0.55 },
];

export const Legal: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  const { W, H, v, cx, cy } = useLayout();
  const iris = k(t, S.start - 0.45, S.start + 0.15, 0, 1, EIO);
  const R = iris * Math.hypot(W, H) * 0.55;

  const cardIn = k(t, S.start, S.start + 0.5, 0, 1, EO);
  const docIn = k(t, b(3), b(3) + 0.5, 0, 1, EO);
  const bars = [
    { label: "Tipus fix", w: k(t, b(1), b(1) + 0.7, 0, 0.78, EIO), color: C.blue },
    { label: "Tipus variable", w: k(t, b(1.3), b(1.3) + 0.7, 0, 0.6, EIO), color: C.navy },
  ];
  const stamp = k(t, b(T_STAMP) - 0.12, b(T_STAMP) + 0.06, 0, 1, (x) => x);
  const shake = t > b(T_STAMP) ? Math.sin((t - b(T_STAMP)) * 60) * 6 * Math.exp(-(t - b(T_STAMP)) * 12) : 0;
  const ring = p(t, b(T_STAMP), 0.8);

  const cw = v ? 880 : 760;
  const dw = v ? 800 : 700;

  return (
    <Fill style={{ clipPath: t < S.start + 0.2 ? `circle(${R}px at 50% 50%)` : undefined }}>
      <LightBg t={t} tone={C.tint2} />
      {t < S.start + 0.2 && (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <circle cx={cx} cy={cy} r={Math.max(0, R - 8)} fill="none" stroke={C.orange} strokeWidth={16} />
        </svg>
      )}
      {/* hipotecari */}
      <div
        style={{
          position: "absolute",
          left: v ? cx - cw / 2 : 120,
          top: v ? 160 : 190,
          width: cw,
          borderRadius: 32,
          background: C.white,
          boxShadow: "0 40px 90px rgba(30,41,59,.16)",
          padding: 44,
          boxSizing: "border-box",
          fontFamily: FONT,
          opacity: cardIn,
          translate: `${(1 - cardIn) * -200}px 0`,
          rotate: `${(1 - cardIn) * -6}deg`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ width: 104, height: 104, borderRadius: 26, background: C.tint, display: "grid", placeItems: "center" }}>
            <Img src={staticFile("icons/svc-hipoteca.png")} style={{ width: 80 }} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: ".14em", color: C.blue, textTransform: "uppercase" }}>Assessorament hipotecari</div>
            <div style={{ fontSize: 48, fontWeight: 900, color: C.navy, letterSpacing: "-0.02em", lineHeight: 1.05 }}>
              La millor <span style={{ color: C.orange }}>hipoteca</span>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 20 }}>
          {bars.map((br) => (
            <div key={br.label}>
              <div style={{ fontSize: 24, fontWeight: 800, color: C.ink, marginBottom: 8 }}>{br.label}</div>
              <div style={{ height: 24, borderRadius: 12, background: C.tint, overflow: "hidden" }}>
                <div style={{ width: `${br.w * 100}%`, height: "100%", borderRadius: 12, background: br.color }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 28, display: "flex", gap: 14, flexWrap: "wrap" }}>
          {[
            { Icon: Landmark, txt: "Negociem amb les entitats", t0: b(2.5) },
            { Icon: KeyRound, txt: "Fins a la signatura", t0: b(3) },
          ].map(({ Icon, txt, t0 }) => (
            <div key={txt} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 999, background: C.tint, color: C.navy, fontWeight: 800, fontSize: 22, opacity: k(t, t0, t0 + 0.25, 0, 1), scale: String(k(t, t0, t0 + 0.4, 0.7, 1, BACK)) }}>
              <Icon size={26} color={C.blue} strokeWidth={2.4} />
              {txt}
            </div>
          ))}
        </div>
      </div>

      {/* jurídic */}
      <div
        style={{
          position: "absolute",
          left: v ? cx - dw / 2 : 1010,
          top: v ? 700 : 150,
          width: dw,
          height: v ? 560 : 700,
          borderRadius: 22,
          background: C.white,
          boxShadow: "0 40px 90px rgba(30,41,59,.18)",
          padding: 48,
          boxSizing: "border-box",
          fontFamily: FONT,
          opacity: docIn,
          translate: `${(1 - docIn) * 260}px 0`,
          rotate: `${2 + (1 - docIn) * 8}deg`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Img src={staticFile("icons/svc-legal.png")} style={{ width: 84 }} />
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: ".14em", color: C.blue, textTransform: "uppercase" }}>Orientació jurídica</div>
            <div style={{ fontSize: 42, fontWeight: 900, color: C.navy }}>Tràmits segurs</div>
          </div>
        </div>
        <div style={{ marginTop: v ? 26 : 40, display: "flex", flexDirection: "column", gap: v ? 18 : 26 }}>
          {ITEMS.map((it, i) => {
            const t0 = b(T_ITEMS + i);
            const a = k(t, t0 - 0.1, t0 + 0.3, 0, 1, BACK);
            return (
              <div key={it} style={{ display: "flex", alignItems: "center", gap: 18, opacity: k(t, t0 - 0.2, t0 + 0.1, 0.35, 1) }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, border: `3px solid ${a > 0.05 ? C.blue : C.line}`, background: a > 0.05 ? C.blue : "transparent", display: "grid", placeItems: "center", flex: "none" }}>
                  <Check size={34} color="#fff" strokeWidth={3.6} style={{ scale: String(a) }} />
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, color: C.navy }}>{it}</div>
              </div>
            );
          })}
        </div>
        <svg width={300} height={80} style={{ position: "absolute", left: 48, bottom: 36 }}>
          <path d="M5 55 C 30 10, 50 70, 75 35 S 120 20, 135 50 S 175 60, 200 30 S 250 45, 290 38" fill="none" stroke={C.navy} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - k(t, b(7), b(8), 0, 1, EIO)} />
        </svg>
        {stamp > 0 && (
          <div style={{ position: "absolute", right: -30, bottom: 30, width: 240, height: 240, scale: String(2.2 - 1.2 * stamp), opacity: stamp, rotate: `${-14 + shake}deg` }}>
            <svg viewBox="0 0 240 240" width={240} height={240} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
              <circle cx="120" cy="120" r={115 + ring * 70} fill="none" stroke={C.orange} strokeWidth={6 * (1 - ring)} opacity={1 - ring} />
            </svg>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `8px solid ${C.orange}`, background: "rgba(255,255,255,.92)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: C.orange, fontWeight: 900, fontSize: 25, letterSpacing: ".08em", textAlign: "center", lineHeight: 1.1 }}>
              <ShieldCheck size={80} color={C.orange} strokeWidth={2.2} />
              SEGURETAT
              <br />
              JURÍDICA
            </div>
          </div>
        )}
      </div>
    </Fill>
  );
};
