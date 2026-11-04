import React from "react";
import { Globe, MapPin, Phone } from "lucide-react";
import { C, FONT } from "../lib/brand";
import { Fill, useLayout, useT } from "../lib/layout";
import { BACK, BEAT, EIO, EO, k, p, pulse, scene } from "../lib/time";
import { Logo, ROOF_POLY } from "../components/Logo";
import type { Cue } from "../components/Sfx";
import site from "../data/site.json";

const S = scene("closing");
const b = (n: number) => S.start + n * BEAT;
const T_WORD = 0.75;
const T_TAG = 1.25;
const T_SLOGAN = 2;
const T_UP = 6;
const T_CTA = 7;
const T_CONTACT = 9;
const T_OFFICES = 11;
const HIT = b(16);

export const closingSfx: Cue[] = [
  { t: S.start - 0.5, name: "whoosh-long", vol: 0.45 },
  { t: b(T_WORD), name: "whoosh", vol: 0.25 },
  ...[0, 1, 2, 3, 4].map((i) => ({ t: b(T_SLOGAN) + i * 0.09, name: "pop", vol: 0.2 })),
  { t: b(T_UP) - 0.1, name: "whoosh-down", vol: 0.3 },
  { t: b(T_CTA), name: "impact", vol: 0.3 },
  ...[0, 1, 2].map((i) => ({ t: b(T_CONTACT + i * 0.5), name: "tick", vol: 0.3 })),
  { t: b(T_OFFICES), name: "pop", vol: 0.3 },
  { t: HIT, name: "logo-shine", vol: 0.55 },
];

export const Closing: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  const { W, H, v, cx, cy } = useLayout();

  // entrada: màscara amb forma de casa que creix des del centre
  const m = k(t, S.start - 0.5, S.start + 0.2, 0, 1, EIO);
  const sc = m * Math.max(W, H) * 1.25;
  const house = [[0, -1], [1, -0.42], [1, 1], [-1, 1], [-1, -0.42]].map(([x, y]) => `${cx + x * sc}px ${cy + y * sc}px`).join(", ");

  const roof = k(t, S.start + 0.05, b(T_WORD) + 0.1, 0, 1, EIO);
  const word = k(t, b(T_WORD) - 0.05, b(T_WORD) + 0.4, 0, 1, EO);
  const tag = k(t, b(T_TAG) - 0.05, b(T_TAG) + 0.5, 0, 1, EO);
  const up = k(t, b(T_UP), b(T_UP) + 0.7, 0, 1, EIO);
  const hit = t > HIT ? Math.exp(-(t - HIT) * 3.5) : 0;
  const ring = p(t, HIT, 1.4);

  const lw0 = v ? 800 : 820;
  const lw1 = v ? 500 : 400;
  const lw = lw0 + (lw1 - lw0) * up;
  const lh = (lw * 234) / 518;
  const ly0 = cy - lh / 2 - (v ? 250 : 170);
  const ly1 = v ? 150 : 50;
  const ly = ly0 + (ly1 - ly0) * up;
  const sloganY0 = ly0 + (lw0 * 234) / 518 + (v ? 70 : 50);
  const sloganY1 = v ? 420 : 270;
  const sloganY = sloganY0 + (sloganY1 - sloganY0) * up;
  const ctaY = v ? 800 : 520;
  const contactY = v ? 1020 : 670;
  const officesY = v ? 1300 : 800;
  const ctaPulse = 1 + pulse(t, 7) * 0.035 * (t > b(T_CTA + 1) ? 1 : 0);

  return (
    <Fill style={{ clipPath: t < S.start + 0.25 ? `polygon(${house})` : undefined }}>
      <Fill style={{ background: `linear-gradient(170deg, #ffffff 0%, #ffffff 55%, ${C.tint} 100%)` }} />
      <svg viewBox="0 0 518 234" width={W * 1.4} style={{ position: "absolute", left: -W * 0.2, top: v ? H * 0.25 : -H * 0.02, opacity: 0.055, scale: String(1 + (t - S.start) * 0.01) }}>
        <polygon points={ROOF_POLY} fill={C.orange} />
      </svg>
      <div style={{ position: "absolute", inset: 0, scale: String(1 + hit * 0.025) }}>
        {t > HIT && (
          <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
            <circle cx={cx} cy={ly + lh * 0.45} r={lw * 0.4 + ring * W * 0.6} fill="none" stroke={C.orange} strokeWidth={8 * (1 - ring)} opacity={1 - ring} />
          </svg>
        )}
        <div style={{ position: "absolute", left: cx - lw / 2, top: ly }}>
          <Logo width={lw} roof={roof} word={word} tag={tag} glow={hit * 0.9} />
          {t > HIT - 0.1 && t < HIT + 1.2 && (
            <div style={{ position: "absolute", inset: -20, overflow: "hidden", mixBlendMode: "screen" }}>
              <div style={{ position: "absolute", top: -60, bottom: -60, width: lw * 0.25, left: -lw * 0.3 + k(t, HIT - 0.1, HIT + 0.9, 0, 1, EIO) * lw * 1.6, rotate: "18deg", background: "linear-gradient(90deg, transparent, rgba(255,255,255,.9), transparent)" }} />
            </div>
          )}
        </div>
        {/* eslògan */}
        <div style={{ position: "absolute", left: 0, right: 0, top: sloganY, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: (v ? 92 : 96) * (1 - up * 0.12), letterSpacing: "-0.035em", lineHeight: 1.02, color: C.navy }}>
          {(v ? ["La llar", "dels teus somnis"] : ["La llar dels teus somnis"]).map((ln, li) => (
            <div key={ln}>
              {ln.split(" ").map((w, i) => {
                const idx = li * 2 + i;
                const a = k(t, b(T_SLOGAN) + idx * 0.09, b(T_SLOGAN) + idx * 0.09 + 0.45, 0, 1, BACK);
                return (
                  <span key={i} style={{ display: "inline-block", marginRight: "0.24em", opacity: Math.min(1, a * 1.5), translate: `0 ${(1 - a) * 40}px`, color: (v ? idx >= 1 : i >= 1) ? C.orange : C.navy }}>
                    {w}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
        {/* crida a l'acció */}
        <div style={{ position: "absolute", left: 0, right: 0, top: ctaY, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ padding: v ? "24px 48px" : "22px 52px", borderRadius: 999, background: C.orange, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: v ? 52 : 50, boxShadow: "0 22px 50px rgba(201,72,47,.35)", scale: String(k(t, b(T_CTA) - 0.05, b(T_CTA) + 0.4, 0, 1, BACK) * ctaPulse) }}>
            Demana una valoració gratuïta
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: v ? 30 : 26, letterSpacing: ".14em", color: C.blue, textTransform: "uppercase", opacity: k(t, b(T_CTA + 0.7), b(T_CTA + 1.2), 0, 1) }}>Sense compromís</div>
        </div>
        {/* contacte */}
        <div style={{ position: "absolute", left: 0, right: 0, top: contactY, display: "flex", flexDirection: v ? "column" : "row", justifyContent: "center", alignItems: "center", gap: v ? 18 : 54, fontFamily: FONT, fontWeight: 800, fontSize: v ? 44 : 36, color: C.navy }}>
          {[
            { Icon: Phone, txt: site.phone },
            { Icon: Globe, txt: "www.inllobsa.com" },
            { Icon: MapPin, txt: `${site.street} · ${site.city}` },
          ].map(({ Icon, txt }, i) => {
            const a = k(t, b(T_CONTACT + i * 0.5), b(T_CONTACT + i * 0.5) + 0.45, 0, 1, EO);
            return (
              <div key={txt} style={{ display: "flex", alignItems: "center", gap: 14, opacity: a, translate: `0 ${(1 - a) * 24}px` }}>
                <span style={{ width: v ? 70 : 60, height: v ? 70 : 60, borderRadius: "50%", background: C.tint, display: "grid", placeItems: "center" }}>
                  <Icon size={v ? 36 : 32} color={C.orange} strokeWidth={2.6} />
                </span>
                {txt}
              </div>
            );
          })}
        </div>
        {/* oficines */}
        <div style={{ position: "absolute", left: 0, right: 0, top: officesY, display: "flex", justifyContent: "center", gap: 14, fontFamily: FONT, fontWeight: 800, fontSize: v ? 30 : 26, color: C.muted, opacity: k(t, b(T_OFFICES), b(T_OFFICES) + 0.4, 0, 1) }}>
          <span>Manresa</span>
          <span style={{ color: C.orange }}>·</span>
          <span>Solvia Store Vic</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 12, width: `${k(t, b(T_CONTACT), HIT, 0, 100, EIO)}%`, background: C.orange }} />
    </Fill>
  );
};
