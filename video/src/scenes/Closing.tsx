import React from "react";
import { Globe, MapPin, Phone } from "lucide-react";
import { C, FONT } from "../lib/brand";
import { Fill, useLayout, useT } from "../lib/layout";
import { BACK, EIO, EO, EV, k, p, scene, wt } from "../lib/time";
import { Logo, ROOF_POLY } from "../components/Logo";
import type { Cue } from "../components/Sfx";
import site from "../data/site.json";

const S = scene("closing");
const T0 = S.start;
const T_WORD = wt("L19", "Inllobsa");
const T_TAG = wt("L19", "Immobiliària");
const VALUES = [
  { w: "Experiència", t: wt("L19", "Experiència") },
  { w: "Innovació", t: wt("L19", "innovació") },
  { w: "Persones", t: wt("L19", "persones") },
];
const T_UP = wt("L20", "El") - 0.45;
const T_L1 = wt("L20", "El");
const T_L2 = wt("L20", "el", 1);
const T_CTA = wt("L21", "Parlem") - 0.05;
const T_CONTACT = T_CTA + 0.45;
const HIT = EV.finalHit;

export const closingSfx: Cue[] = [
  { t: T0 - 0.5, name: "whoosh-long", vol: 0.5 },
  { t: T_WORD - 0.05, name: "whoosh", vol: 0.3 },
  { t: T_TAG, name: "pop", vol: 0.35 },
  ...VALUES.map((v) => ({ t: v.t, name: "pop", vol: 0.35 })),
  { t: T_UP, name: "whoosh-down", vol: 0.3 },
  { t: T_L2, name: "impact", vol: 0.4 },
  { t: T_CTA, name: "pop", vol: 0.45 },
  ...[0, 1, 2].map((i) => ({ t: T_CONTACT + i * 0.15, name: "tick", vol: 0.35 })),
  { t: HIT, name: "logo-shine", vol: 0.7 },
];

export const Closing: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  const { W, H, v, cx, cy } = useLayout();

  // entrada: màscara amb forma de casa (geometria del logotip) que creix des del centre
  const m = k(t, T0 - 0.55, T0 + 0.25, 0, 1, EIO);
  const sc = m * Math.max(W, H) * 1.25;
  const house = [
    [0, -1],
    [1, -0.42],
    [1, 1],
    [-1, 1],
    [-1, -0.42],
  ]
    .map(([x, y]) => `${cx + x * sc}px ${cy + y * sc}px`)
    .join(", ");

  const roof = k(t, T0 + 0.05, T_WORD + 0.1, 0, 1, EIO);
  const word = k(t, T_WORD - 0.05, T_WORD + 0.45, 0, 1, EO);
  const tag = k(t, T_TAG - 0.05, T_TAG + 0.6, 0, 1, EO);
  const up = k(t, T_UP, T_UP + 0.8, 0, 1, EIO);
  const hit = t > HIT ? Math.exp(-(t - HIT) * 3.5) : 0;
  const ring = p(t, HIT, 1.4);

  const lw0 = v ? 800 : 860;
  const lw1 = v ? 520 : 440;
  const lw = lw0 + (lw1 - lw0) * up;
  const lh = (lw * 234) / 518;
  const ly0 = cy - lh / 2 - (v ? 160 : 90);
  const ly1 = v ? 130 : 56;
  const ly = ly0 + (ly1 - ly0) * up;

  const tagY = v ? 470 : 330;
  const ctaY = v ? 945 : 640;
  const contactY = v ? 1065 : 770;

  return (
    <Fill style={{ clipPath: t < T0 + 0.3 ? `polygon(${house})` : undefined }}>
      <Fill style={{ background: `linear-gradient(170deg, #ffffff 0%, #ffffff 55%, ${C.tint} 100%)` }} />
      {/* teulada gegant de fons */}
      <svg viewBox="0 0 518 234" width={W * 1.4} style={{ position: "absolute", left: -W * 0.2, top: v ? H * 0.2 : -H * 0.05, opacity: 0.06, scale: String(1 + (t - T0) * 0.01) }}>
        <polygon points={ROOF_POLY} fill={C.orange} />
      </svg>

      <div style={{ position: "absolute", inset: 0, scale: String(1 + hit * 0.025) }}>
        {/* anell del cop final */}
        {t > HIT && (
          <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
            <circle cx={cx} cy={ly + lh * 0.45} r={lw * 0.4 + ring * W * 0.6} fill="none" stroke={C.orange} strokeWidth={8 * (1 - ring)} opacity={1 - ring} />
          </svg>
        )}
        {/* logotip original */}
        <div style={{ position: "absolute", left: cx - lw / 2, top: ly }}>
          <Logo width={lw} roof={roof} word={word} tag={tag} glow={hit * 0.9} />
          {/* escombrat de llum al cop final */}
          {t > HIT - 0.1 && t < HIT + 1.2 && (
            <div style={{ position: "absolute", inset: -20, overflow: "hidden", mixBlendMode: "screen" }}>
              <div
                style={{
                  position: "absolute",
                  top: -60,
                  bottom: -60,
                  width: lw * 0.25,
                  left: -lw * 0.3 + k(t, HIT - 0.1, HIT + 0.9, 0, 1, EIO) * lw * 1.6,
                  rotate: "18deg",
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,.9), transparent)",
                }}
              />
            </div>
          )}
        </div>

        {/* valors */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: ly0 + lh + (v ? 90 : 70),
            display: "flex",
            flexDirection: v ? "column" : "row",
            justifyContent: "center",
            alignItems: "center",
            gap: v ? 22 : 46,
            opacity: 1 - up,
            translate: `0 ${-up * 40}px`,
          }}
        >
          {VALUES.map((val, i) => {
            const a = k(t, val.t - 0.08, val.t + 0.4, 0, 1, BACK);
            return (
              <div key={val.w} style={{ display: "flex", alignItems: "center", gap: v ? 0 : 46 }}>
                {i > 0 && !v && <span style={{ width: 14, height: 14, borderRadius: "50%", background: C.orange, scale: String(a) }} />}
                <span
                  style={{
                    fontFamily: FONT,
                    fontWeight: 800,
                    fontSize: v ? 62 : 52,
                    color: C.navy,
                    letterSpacing: "-0.01em",
                    opacity: Math.min(1, a),
                    translate: `0 ${(1 - Math.min(1, a)) * 30}px`,
                  }}
                >
                  {val.w}
                </span>
              </div>
            );
          })}
        </div>

        {/* EL TEU PROJECTE, EL NOSTRE COMPROMÍS. */}
        <div style={{ position: "absolute", left: 0, right: 0, top: tagY, textAlign: "center", fontFamily: FONT, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.02 }}>
          {[
            { txt: v ? "EL TEU\nPROJECTE," : "EL TEU PROJECTE,", c: C.navy, t0: T_L1 },
            { txt: v ? "EL NOSTRE\nCOMPROMÍS." : "EL NOSTRE COMPROMÍS.", c: C.orange, t0: T_L2 },
          ].map((l) => {
            const a = k(t, l.t0 - 0.05, l.t0 + 0.55, 0, 1, EO);
            return (
              <div key={l.txt} style={{ overflow: "hidden", paddingBottom: 8 }}>
                <div style={{ fontSize: v ? 98 : 108, color: l.c, translate: `0 ${(1 - a) * 140}%`, whiteSpace: "pre-line" }}>{l.txt}</div>
              </div>
            );
          })}
        </div>

        {/* crida a l'acció */}
        <div style={{ position: "absolute", left: 0, right: 0, top: ctaY, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              padding: v ? "18px 40px" : "16px 38px",
              borderRadius: 999,
              background: C.blue,
              color: "#fff",
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: v ? 44 : 38,
              boxShadow: "0 18px 40px rgba(28,98,178,.3)",
              scale: String(k(t, T_CTA - 0.05, T_CTA + 0.4, 0, 1, BACK)),
            }}
          >
            Parlem del teu pròxim projecte?
          </div>
        </div>

        {/* contacte */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: contactY,
            display: "flex",
            flexDirection: v ? "column" : "row",
            justifyContent: "center",
            alignItems: "center",
            gap: v ? 16 : 54,
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: v ? 40 : 34,
            color: C.navy,
          }}
        >
          {[
            { Icon: MapPin, txt: `${site.street} — ${site.city}` },
            { Icon: Phone, txt: `Tel. ${site.phone}` },
            { Icon: Globe, txt: "www.inllobsa.com" },
          ].map(({ Icon, txt }, i) => {
            const a = k(t, T_CONTACT + i * 0.15, T_CONTACT + i * 0.15 + 0.5, 0, 1, EO);
            return (
              <div key={txt} style={{ display: "flex", alignItems: "center", gap: 14, opacity: a, translate: `0 ${(1 - a) * 24}px` }}>
                <span style={{ width: v ? 64 : 56, height: v ? 64 : 56, borderRadius: "50%", background: C.tint, display: "grid", placeItems: "center" }}>
                  <Icon size={v ? 34 : 30} color={C.orange} strokeWidth={2.6} />
                </span>
                {txt}
              </div>
            );
          })}
        </div>
      </div>
      {/* línia taronja inferior */}
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 12, width: `${k(t, T_CONTACT, HIT, 0, 100, EIO)}%`, background: C.orange }} />
    </Fill>
  );
};
