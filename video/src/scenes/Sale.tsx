import React from "react";
import { Img, staticFile } from "remotion";
import { ArrowLeftRight, Check } from "lucide-react";
import { C, FONT } from "../lib/brand";
import { Fill, useLayout, useT } from "../lib/layout";
import { BACK, EI, EIO, EO, k, p, scene, wt } from "../lib/time";
import { LightBg } from "../components/Bg";
import { Property, type PropertyKind } from "../components/Illus";
import { Eyebrow, Kinetic } from "../components/Text";
import type { Cue } from "../components/Sfx";

const S = scene("sale");
const T0 = S.start;
const CARDS: { kind: PropertyKind; label: string; t: number }[] = [
  { kind: "flat", label: "Pisos", t: wt("L03", "Pisos") },
  { kind: "house", label: "Cases", t: wt("L03", "cases") },
  { kind: "shop", label: "Locals", t: wt("L03", "locals") },
  { kind: "parking", label: "Pàrquings", t: wt("L03", "pàrquings") },
  { kind: "warehouse", label: "Naus industrials", t: wt("L03", "naus") },
  { kind: "plot", label: "Parcel·les", t: wt("L03", "parcel") },
];
const T_HEAD_UP = CARDS[0].t - 0.45;
const T_CARDS_OUT = wt("L04", "t'hi") - 0.15;
const T_EXPERT = wt("L04", "assessorament");
const T_MIDA = wt("L04", "estratègia");
const T_OP = wt("L04", "cada");

export const saleSfx: Cue[] = [
  { t: T0 - 0.45, name: "whoosh", vol: 0.55 },
  { t: wt("L02", "Comprar"), name: "pop", vol: 0.4 },
  { t: wt("L02", "vendre") - 0.05, name: "swipe", vol: 0.45 },
  { t: T_HEAD_UP, name: "whoosh-down", vol: 0.25 },
  ...CARDS.map((c) => ({ t: c.t - 0.06, name: "swipe", vol: 0.4 })),
  { t: T_CARDS_OUT, name: "whoosh", vol: 0.45 },
  { t: T_CARDS_OUT + 0.3, name: "rise", vol: 0.4 },
  { t: T_EXPERT, name: "pop", vol: 0.45 },
  { t: T_MIDA, name: "pop", vol: 0.45 },
  { t: T_OP, name: "impact", vol: 0.3 },
];

export const Sale: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  const { W, H, v, cx } = useLayout();

  // transició d'entrada: escombrat diagonal amb el pendent de la teulada del logotip
  const wipe = k(t, T0 - 0.5, T0 + 0.15, 0, 1, EIO);
  const slope = H * 0.29; // pendent ≈ 16°
  const xw = -slope + wipe * (W + slope * 2);
  const clip = `polygon(0 0, ${xw}px 0, ${xw - slope}px 100%, 0 100%)`;

  // capçalera COMPRAR ⇄ VENDRE
  const swap = k(t, wt("L02", "vendre") - 0.1, wt("L02", "vendre") + 0.5, 0, 1, EIO);
  const headUp = k(t, T_HEAD_UP, T_HEAD_UP + 0.7, 0, 1, EIO);
  const headOut = k(t, T_CARDS_OUT, T_CARDS_OUT + 0.4, 0, 1, EI);
  const hs = 1 - headUp * 0.55;
  const headY = (v ? 640 : 420) + headUp * ((v ? 210 : 120) - (v ? 640 : 420));

  // targetes
  const cols = v ? 2 : 6;
  const cw = v ? 430 : 252;
  const ch = v ? 330 : 318;
  const gap = v ? 34 : 26;
  const gridW = cols * cw + (cols - 1) * gap;
  const gx = cx - gridW / 2;
  const gy = v ? 420 : 330;

  // part final: assessorament
  const iconIn = k(t, T_CARDS_OUT + 0.25, T_CARDS_OUT + 1.0, 0, 1, BACK);
  const ring = p(t, T_CARDS_OUT + 0.3, 1.6);

  return (
    <Fill style={{ clipPath: t < T0 + 0.2 ? clip : undefined }}>
      <LightBg t={t} />
      {/* banda taronja a la vora de l'escombrat */}
      {t < T0 + 0.2 && (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <polygon points={`${xw - 26},0 ${xw},0 ${xw - slope},${H} ${xw - slope - 26},${H}`} fill={C.orange} />
        </svg>
      )}

      {/* --- COMPRAR ⇄ VENDRE */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: headY,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          scale: String(hs),
          transformOrigin: "50% 0",
          opacity: 1 - headOut,
          translate: `0 ${-headOut * 60}px`,
        }}
      >
        <Eyebrow text="Compravenda d'immobles" t={t} t0={T0 + 0.1} size={v ? 34 : 28} />
        <div style={{ display: "flex", alignItems: "center", gap: v ? 26 : 48, marginTop: 18 }}>
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: v ? 120 : 150,
              letterSpacing: "-0.04em",
              color: C.navy,
              opacity: 1 - swap * 0.55,
              translate: `${(1 - k(t, T0 + 0.2, T0 + 0.9, 0, 1)) * -80}px 0`,
            }}
          >
            Comprar
          </div>
          <div
            style={{
              width: v ? 110 : 140,
              height: v ? 110 : 140,
              borderRadius: "50%",
              background: C.orange,
              display: "grid",
              placeItems: "center",
              rotate: `${swap * 180}deg`,
              scale: String(k(t, T0 + 0.35, T0 + 0.9, 0, 1, BACK)),
              boxShadow: "0 18px 40px rgba(201,72,47,.35)",
            }}
          >
            <ArrowLeftRight size={v ? 62 : 78} color="#fff" strokeWidth={2.6} />
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: v ? 120 : 150,
              letterSpacing: "-0.04em",
              color: C.navy,
              opacity: 0.45 + swap * 0.55,
              translate: `${(1 - k(t, T0 + 0.2, T0 + 0.9, 0, 1)) * 80}px 0`,
            }}
          >
            vendre
          </div>
        </div>
      </div>

      {/* --- targetes d'immobles */}
      {CARDS.map((c, i) => {
        const a = k(t, c.t - 0.12, c.t + 0.55, 0, 1, EO);
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = gx + col * (cw + gap);
        const y = gy + row * (ch + gap) + (v ? 0 : 60);
        const float = Math.sin(t * 1.6 + i) * 6;
        const out = k(t, T_CARDS_OUT + i * 0.05, T_CARDS_OUT + 0.6 + i * 0.05, 0, 1, EI);
        if (a <= 0) return null;
        return (
          <div
            key={c.kind}
            style={{
              position: "absolute",
              left: x,
              top: y + (1 - a) * 160 + float - out * 40,
              width: cw,
              height: ch,
              borderRadius: 26,
              background: C.white,
              boxShadow: "0 24px 60px rgba(30,41,59,.14)",
              border: `1px solid ${C.line}`,
              opacity: Math.min(1, a * 1.4) * (1 - out),
              transform: `perspective(900px) rotateY(${(1 - a) * -35}deg) rotateX(${(1 - a) * 18}deg)`,
              scale: String(1 - out * 0.2),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
            }}
          >
            <Property kind={c.kind} width={cw * 0.78} d={k(t, c.t, c.t + 0.9, 0, 1, EIO)} f={k(t, c.t + 0.2, c.t + 0.7, 0, 1)} />
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: v ? 36 : 27, color: C.navy, textAlign: "center" }}>
              {c.label}
            </div>
            <div
              style={{
                position: "absolute",
                top: 16,
                left: 16,
                width: 34,
                height: 6,
                borderRadius: 4,
                background: C.orange,
                scale: `${k(t, c.t + 0.3, c.t + 0.8, 0, 1)} 1`,
                transformOrigin: "0 50%",
              }}
            />
          </div>
        );
      })}

      {/* --- assessorament expert + estratègia a mida */}
      {t > T_CARDS_OUT && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: v ? "column" : "row",
            alignItems: "center",
            justifyContent: "center",
            gap: v ? 70 : 110,
            paddingBottom: v ? 220 : 60,
          }}
        >
          <div style={{ position: "relative", width: v ? 360 : 380, height: v ? 360 : 380 }}>
            <svg width="100%" height="100%" viewBox="0 0 380 380" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
              <circle cx="190" cy="190" r={150 + ring * 60} fill="none" stroke={C.orange} strokeWidth={4 * (1 - ring)} opacity={1 - ring} />
              <circle
                cx="190"
                cy="190"
                r="176"
                fill="none"
                stroke={C.blue}
                strokeWidth={5}
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1 - k(t, T_CARDS_OUT + 0.3, T_OP + 0.6, 0, 1, EIO)}
                style={{ rotate: "-90deg", transformOrigin: "190px 190px" }}
              />
            </svg>
            <div
              style={{
                position: "absolute",
                inset: 24,
                borderRadius: "50%",
                background: C.white,
                boxShadow: "0 30px 80px rgba(30,41,59,.18)",
                display: "grid",
                placeItems: "center",
                scale: String(iconIn),
              }}
            >
              <Img src={staticFile("icons/svc-compravenda.png")} style={{ width: "62%" }} />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: v ? 26 : 30, alignItems: v ? "center" : "flex-start" }}>
            <Eyebrow text="En cada operació" t={t} t0={T_CARDS_OUT + 0.35} size={v ? 32 : 26} />
            {[
              { t0: T_EXPERT, txt: "Assessorament *expert*" },
              { t0: T_MIDA, txt: "Estratègia *a mida*" },
            ].map((r) => (
              <div key={r.txt} style={{ display: "flex", alignItems: "center", gap: 26 }}>
                <div
                  style={{
                    width: v ? 76 : 70,
                    height: v ? 76 : 70,
                    flex: "none",
                    borderRadius: 20,
                    background: C.blue,
                    display: "grid",
                    placeItems: "center",
                    scale: String(k(t, r.t0 - 0.1, r.t0 + 0.35, 0, 1, BACK)),
                  }}
                >
                  <Check size={44} color="#fff" strokeWidth={3.2} />
                </div>
                <Kinetic text={r.txt} t={t} t0={r.t0 - 0.05} size={v ? 70 : 84} weight={900} color={C.navy} letterSpacing={-0.03} />
              </div>
            ))}
          </div>
        </div>
      )}
    </Fill>
  );
};
