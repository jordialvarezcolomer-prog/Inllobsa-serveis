import React from "react";
import { Img, staticFile } from "remotion";
import { Check, KeyRound, Landmark, ShieldCheck } from "lucide-react";
import { C, FONT } from "../lib/brand";
import { Fill, useLayout, useT } from "../lib/layout";
import { BACK, EIO, EO, k, p, scene, wt } from "../lib/time";
import { LightBg } from "../components/Bg";
import { Eyebrow } from "../components/Text";
import type { Cue } from "../components/Sfx";

const S = scene("legal");
const T0 = S.start;
const T_FIN = wt("L08", "finançament");
const T_HIP = wt("L08", "hipoteca");
const T_ADAPT = wt("L08", "s'adapta");
const T_B = wt("L09", "I") - 0.25;
const ITEMS = [
  { label: "Herències i successions", t: wt("L09", "herències") },
  { label: "Tràmits registrals", t: wt("L09", "tràmits") },
  { label: "Contractes d'arres i compravenda", t: wt("L09", "contractes") },
];
const T_STAMP = wt("L09", "confiança") - 0.05;

export const legalSfx: Cue[] = [
  { t: T0 - 0.45, name: "whoosh", vol: 0.5 },
  { t: T0 + 0.2, name: "pop", vol: 0.35 },
  { t: T_FIN, name: "rise", vol: 0.35 },
  { t: T_FIN + 0.25, name: "rise", vol: 0.3 },
  { t: T_HIP, name: "tick", vol: 0.4 },
  { t: T_ADAPT, name: "ding", vol: 0.35 },
  { t: T_B, name: "swipe", vol: 0.45 },
  ...ITEMS.map((i) => ({ t: i.t, name: "tick", vol: 0.45 })),
  { t: T_STAMP, name: "stamp", vol: 0.6 },
];

export const Legal: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  const { W, H, v, cx, cy } = useLayout();

  // entrada: iris circular amb anell taronja
  const iris = k(t, T0 - 0.5, T0 + 0.2, 0, 1, EIO);
  const R = iris * Math.hypot(W, H) * 0.55;

  const b = k(t, T_B, T_B + 0.8, 0, 1, EIO); // fase B (document)
  // targeta hipotecària
  const cardW = v ? 900 : 760;
  const cardH = v ? 520 : 480;
  const cardX = v ? cx - cardW / 2 : cx - cardW / 2 + b * (130 - (cx - cardW / 2));
  const cardY = v ? 230 + b * (130 - 230) : cy - cardH / 2 - 40 + b * 40;
  const cardS = v ? 1 - b * 0.22 : 1.18 - b * 0.2;
  const cardIn = k(t, T0 + 0.05, T0 + 0.8, 0, 1, EO);

  const bars = [
    { label: "Tipus fix", w: k(t, T_FIN, T_FIN + 0.9, 0, 0.78, EIO), color: C.blue },
    { label: "Tipus variable", w: k(t, T_FIN + 0.25, T_FIN + 1.15, 0, 0.62, EIO), color: C.navy },
  ];

  // document
  const docW = v ? 760 : 700;
  const docH = v ? 640 : 760;
  const docX = v ? cx - docW / 2 : 1060;
  const docY = v ? 585 : 120;
  const docIn = k(t, T_B + 0.1, T_B + 0.9, 0, 1, EO);
  const stamp = k(t, T_STAMP - 0.12, T_STAMP + 0.08, 0, 1, (x) => x);
  const stampShake = t > T_STAMP ? Math.sin((t - T_STAMP) * 60) * 6 * Math.exp(-(t - T_STAMP) * 12) : 0;
  const ring = p(t, T_STAMP, 0.8);

  return (
    <Fill style={{ clipPath: t < T0 + 0.25 ? `circle(${R}px at 50% 50%)` : undefined }}>
      <LightBg t={t} tone={C.tint2} />
      {t < T0 + 0.25 && (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <circle cx={cx} cy={cy} r={Math.max(0, R - 8)} fill="none" stroke={C.orange} strokeWidth={16} />
        </svg>
      )}

      <div style={{ position: "absolute", left: v ? 0 : 130, right: v ? 0 : undefined, top: v ? 120 : 70, display: "flex", justifyContent: "center", opacity: 1 - b * (v ? 1 : 0) }}>
        <Eyebrow text="Assessorament hipotecari i jurídic" t={t} t0={T0 + 0.2} size={v ? 30 : 26} />
      </div>

      {/* --- targeta: assessorament hipotecari */}
      <div
        style={{
          position: "absolute",
          left: cardX,
          top: cardY + (1 - cardIn) * 80,
          width: cardW,
          height: cardH,
          borderRadius: 32,
          background: C.white,
          boxShadow: "0 40px 90px rgba(30,41,59,.16)",
          padding: 48,
          boxSizing: "border-box",
          opacity: cardIn * (1 - b * 0.25),
          scale: String(cardS),
          transformOrigin: v ? "50% 0" : "0 50%",
          fontFamily: FONT,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 110, height: 110, borderRadius: 26, background: C.tint, display: "grid", placeItems: "center" }}>
            <Img src={staticFile("icons/svc-hipoteca.png")} style={{ width: 84, scale: String(k(t, T0 + 0.3, T0 + 0.8, 0.5, 1, BACK)) }} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: ".14em", color: C.blue, textTransform: "uppercase" }}>Finançament</div>
            <div style={{ fontSize: 46, fontWeight: 900, color: C.navy, letterSpacing: "-0.02em", lineHeight: 1.05 }}>
              La hipoteca que
              <br />
              <span style={{ color: C.orange }}>s'adapta a tu</span>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 22 }}>
          {bars.map((br) => (
            <div key={br.label}>
              <div style={{ fontSize: 24, fontWeight: 800, color: C.ink, marginBottom: 8 }}>{br.label}</div>
              <div style={{ height: 26, borderRadius: 13, background: C.tint, overflow: "hidden" }}>
                <div style={{ width: `${br.w * 100}%`, height: "100%", borderRadius: 13, background: br.color }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 34, display: "flex", gap: 16, flexWrap: "wrap" }}>
          {[
            { Icon: Landmark, txt: "Negociació amb les entitats", t0: T_HIP },
            { Icon: KeyRound, txt: "Fins a la signatura", t0: T_HIP + 0.35 },
          ].map(({ Icon, txt, t0 }) => (
            <div
              key={txt}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 18px",
                borderRadius: 999,
                background: C.tint,
                color: C.navy,
                fontWeight: 800,
                fontSize: 22,
                opacity: k(t, t0, t0 + 0.3, 0, 1),
                scale: String(k(t, t0, t0 + 0.45, 0.7, 1, BACK)),
              }}
            >
              <Icon size={26} color={C.blue} strokeWidth={2.4} />
              {txt}
            </div>
          ))}
        </div>
        {/* segell "a mida" */}
        <div
          style={{
            position: "absolute",
            right: 36,
            top: 40,
            width: 92,
            height: 92,
            borderRadius: "50%",
            background: C.orange,
            display: "grid",
            placeItems: "center",
            scale: String(k(t, T_ADAPT - 0.1, T_ADAPT + 0.35, 0, 1, BACK)),
            boxShadow: "0 14px 30px rgba(201,72,47,.35)",
          }}
        >
          <Check size={56} color="#fff" strokeWidth={3.4} />
        </div>
      </div>

      {/* --- document jurídic */}
      {t > T_B && (
        <div
          style={{
            position: "absolute",
            left: docX + (1 - docIn) * (v ? 0 : 300),
            top: docY + (1 - docIn) * (v ? 300 : 0),
            width: docW,
            height: docH,
            rotate: `${(1 - docIn) * 8 + 2}deg`,
            opacity: docIn,
            fontFamily: FONT,
          }}
        >
          {/* full de sota */}
          <div style={{ position: "absolute", inset: 0, translate: "22px 18px", rotate: "3deg", borderRadius: 20, background: "#f7f9fc", boxShadow: "0 30px 70px rgba(30,41,59,.12)" }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 20,
              background: C.white,
              boxShadow: "0 40px 90px rgba(30,41,59,.18)",
              padding: 56,
              boxSizing: "border-box",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <Img src={staticFile("icons/svc-legal.png")} style={{ width: 86 }} />
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: ".14em", color: C.blue, textTransform: "uppercase" }}>Suport jurídic</div>
                <div style={{ fontSize: 40, fontWeight: 900, color: C.navy, letterSpacing: "-0.02em" }}>Tràmits sense dubtes</div>
              </div>
            </div>
            {/* línies de text que s'escriuen */}
            <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 12 }}>
              {[0.95, 0.8, 0.88, 0.6].map((w, i) => (
                <div
                  key={i}
                  style={{
                    height: 12,
                    borderRadius: 6,
                    background: C.line,
                    width: `${w * 100 * k(t, T_B + 0.4 + i * 0.15, T_B + 0.9 + i * 0.15, 0, 1, EIO)}%`,
                  }}
                />
              ))}
            </div>
            <div style={{ marginTop: 38, display: "flex", flexDirection: "column", gap: 22 }}>
              {ITEMS.map((it) => {
                const a = k(t, it.t - 0.1, it.t + 0.35, 0, 1, BACK);
                return (
                  <div key={it.label} style={{ display: "flex", alignItems: "center", gap: 20, opacity: k(t, it.t - 0.2, it.t + 0.1, 0.35, 1) }}>
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 14,
                        border: `3px solid ${a > 0.05 ? C.blue : C.line}`,
                        background: a > 0.05 ? C.blue : "transparent",
                        display: "grid",
                        placeItems: "center",
                        flex: "none",
                      }}
                    >
                      <Check size={34} color="#fff" strokeWidth={3.6} style={{ scale: String(a) }} />
                    </div>
                    <div style={{ fontSize: v ? 34 : 32, fontWeight: 800, color: C.navy }}>{it.label}</div>
                  </div>
                );
              })}
            </div>
            {/* signatura */}
            <svg width={300} height={80} style={{ position: "absolute", left: 56, bottom: 40 }}>
              <path
                d="M5 55 C 30 10, 50 70, 75 35 S 120 20, 135 50 S 175 60, 200 30 S 250 45, 290 38"
                fill="none"
                stroke={C.navy}
                strokeWidth={4}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1 - k(t, ITEMS[2].t + 0.3, ITEMS[2].t + 1.2, 0, 1, EIO)}
              />
            </svg>
          </div>
          {/* segell de seguretat */}
          {stamp > 0 && (
            <div
              style={{
                position: "absolute",
                right: -30,
                bottom: 40,
                width: 250,
                height: 250,
                scale: String(2.2 - 1.2 * stamp),
                opacity: stamp,
                rotate: `${-14 + stampShake}deg`,
              }}
            >
              <svg viewBox="0 0 250 250" width={250} height={250} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
                <circle cx="125" cy="125" r={120 + ring * 70} fill="none" stroke={C.orange} strokeWidth={6 * (1 - ring)} opacity={1 - ring} />
              </svg>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  border: `8px solid ${C.orange}`,
                  background: "rgba(255,255,255,.9)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.orange,
                  fontWeight: 900,
                  fontSize: 26,
                  letterSpacing: ".08em",
                  textAlign: "center",
                  lineHeight: 1.1,
                }}
              >
                <ShieldCheck size={84} color={C.orange} strokeWidth={2.2} />
                SEGURETAT
                <br />
                JURÍDICA
              </div>
            </div>
          )}
        </div>
      )}
    </Fill>
  );
};
