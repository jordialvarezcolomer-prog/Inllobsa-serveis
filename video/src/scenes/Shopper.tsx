import React from "react";
import { Img, staticFile } from "remotion";
import { BedDouble, Bath, Check, Heart, Maximize, Search, SlidersHorizontal, Waves } from "lucide-react";
import { C, FONT } from "../lib/brand";
import { Fill, useLayout, useT } from "../lib/layout";
import { BACK, BEAT, EI, EIO, EO, k, scene } from "../lib/time";
import { Property, type PropertyKind } from "../components/Illus";
import type { Cue } from "../components/Sfx";

const S = scene("shopper");
const b = (n: number) => S.start + n * BEAT;
const QUERY = "Pis d'obra nova amb piscina, Manresa";
// característiques reals de la fitxa (ref. 5028)
const FILTERS = ["Obra nova", "2 habitacions", "Terrassa", "Piscina"];
const KINDS: PropertyKind[] = ["house", "shop", "flat", "plot", "warehouse", "parking", "house"];
const T_SCAN = 4.5;
const T_PICK = 6;

export const shopperSfx: Cue[] = [
  { t: S.start - 0.45, name: "whoosh", vol: 0.4 },
  { t: S.start + 0.1, name: "typing", vol: 0.45 },
  ...FILTERS.map((_, i) => ({ t: b(2 + i * 0.5), name: "tick", vol: 0.4 })),
  { t: b(T_SCAN), name: "whoosh-long", vol: 0.2 },
  { t: b(T_PICK), name: "swipe", vol: 0.4 },
  { t: b(T_PICK + 1), name: "like", vol: 0.45 },
  { t: b(T_PICK + 2), name: "ding", vol: 0.4 },
];

export const Shopper: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  const { W, v, cx } = useLayout();
  const bl = k(t, S.start - 0.45, S.start + 0.1, 0, 1, EIO);
  const stripe = W / (v ? 5 : 8);
  const mask = `repeating-linear-gradient(90deg, #000 0px, #000 ${bl * stripe}px, transparent ${bl * stripe}px, transparent ${stripe}px)`;
  const typed = Math.round(k(t, S.start + 0.1, b(2), 0, QUERY.length, (x) => x));
  const barW = v ? 960 : 1120;

  const cols = v ? 2 : 4;
  const cw = v ? 440 : 300;
  const ch = v ? 250 : 210;
  const gap = v ? 26 : 28;
  const gw = cols * cw + (cols - 1) * gap;
  const gx = cx - gw / 2;
  const gy = v ? 520 : 400;
  const total = v ? 6 : 8;
  const WIN = v ? 3 : 5;
  const pick = k(t, b(T_PICK), b(T_PICK) + 0.6, 0, 1, EIO);

  // targeta final: l'immoble real
  const fw = v ? 900 : 1100;
  const fh = v ? 640 : 470;
  const fx0 = gx + (WIN % cols) * (cw + gap);
  const fy0 = gy + Math.floor(WIN / cols) * (ch + gap);
  const fx1 = cx - fw / 2;
  const fy1 = v ? 470 : 330;
  const w = cw + (fw - cw) * pick;
  const h = ch + (fh - ch) * pick;
  const x = fx0 + (fx1 - fx0) * pick;
  const y = fy0 + (fy1 - fy0) * pick;

  return (
    <Fill style={{ maskImage: t < S.start + 0.15 ? mask : undefined, WebkitMaskImage: t < S.start + 0.15 ? mask : undefined }}>
      <Fill style={{ background: `linear-gradient(180deg, #fff 0%, ${C.tint} 100%)` }} />
      <div
        style={{
          position: "absolute",
          left: cx - barW / 2,
          top: v ? 160 : 100,
          width: barW,
          height: v ? 116 : 100,
          borderRadius: 999,
          background: C.white,
          boxShadow: "0 24px 60px rgba(30,41,59,.14)",
          border: `2px solid ${C.blue}`,
          display: "flex",
          alignItems: "center",
          gap: 20,
          padding: "0 16px 0 32px",
          boxSizing: "border-box",
          fontFamily: FONT,
          opacity: 1 - pick * 0.0,
        }}
      >
        <Search size={42} color={C.blue} strokeWidth={2.6} />
        <div style={{ flex: 1, fontSize: v ? 38 : 36, fontWeight: 700, color: C.navy, whiteSpace: "nowrap", overflow: "hidden" }}>
          {QUERY.slice(0, typed)}
          <span style={{ color: C.orange, opacity: Math.floor(t * 3) % 2 ? 1 : 0 }}>|</span>
        </div>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: C.orange, display: "grid", placeItems: "center" }}>
          <SlidersHorizontal size={32} color="#fff" strokeWidth={2.6} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: v ? 300 : 225, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 14, padding: v ? "0 60px" : 0 }}>
        {FILTERS.map((f, i) => {
          const on = t >= b(2 + i * 0.5);
          return (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 999, fontFamily: FONT, fontWeight: 800, fontSize: v ? 30 : 25, background: on ? C.blue : C.white, color: on ? "#fff" : C.muted, border: `2px solid ${on ? C.blue : C.line}`, scale: String(1 + Math.sin(k(t, b(2 + i * 0.5), b(2 + i * 0.5) + 0.25, 0, 1) * Math.PI) * 0.12) }}>
              {on && <Check size={22} strokeWidth={3.4} />}
              {f}
            </div>
          );
        })}
      </div>
      {Array.from({ length: total }, (_, i) => {
        if (i === WIN) return null;
        const a = k(t, S.start + 0.3 + i * 0.06, S.start + 0.8 + i * 0.06, 0, 1, EO);
        const out = k(t, b(T_SCAN) + i * 0.06, b(T_SCAN) + 0.3 + i * 0.06, 0, 1, EI);
        const gone = k(t, b(T_PICK), b(T_PICK) + 0.4, 0, 1);
        return (
          <div key={i} style={{ position: "absolute", left: gx + (i % cols) * (cw + gap), top: gy + Math.floor(i / cols) * (ch + gap) + (1 - a) * 50, width: cw, height: ch, borderRadius: 22, background: C.white, boxShadow: "0 16px 40px rgba(30,41,59,.1)", display: "grid", placeItems: "center", opacity: a * (1 - out * 0.75) * (1 - gone), filter: `grayscale(${out})` }}>
            <Property kind={KINDS[i % KINDS.length]} width={cw * 0.6} />
          </div>
        );
      })}
      {/* l'immoble que encaixa: fitxa real */}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: w,
          height: h,
          borderRadius: 26,
          background: C.white,
          overflow: "hidden",
          boxShadow: `0 ${20 + pick * 30}px ${50 + pick * 50}px rgba(30,41,59,${0.12 + pick * 0.12})`,
          outline: `${pick * 5}px solid ${C.orange}`,
          display: "flex",
          flexDirection: v ? "column" : "row",
          opacity: k(t, S.start + 0.3 + WIN * 0.06, S.start + 0.8 + WIN * 0.06, 0, 1),
          zIndex: 5,
        }}
      >
        <div style={{ position: "relative", flex: v ? "none" : "1.15", height: v ? h * 0.58 : "100%" }}>
          <Img src={staticFile("listing/piscina-2.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", right: 14, top: 14, width: 56, height: 56, borderRadius: "50%", background: C.orange, display: "grid", placeItems: "center", scale: String(k(t, b(T_PICK + 1) - 0.05, b(T_PICK + 1) + 0.35, 0, 1, BACK)) }}>
            <Heart size={30} color="#fff" fill="#fff" />
          </div>
        </div>
        <div style={{ flex: 1, padding: v ? "26px 34px" : "34px 40px", fontFamily: FONT, opacity: k(t, b(T_PICK) + 0.3, b(T_PICK) + 0.7, 0, 1) }}>
          <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: ".14em", color: C.blue, textTransform: "uppercase" }}>Obra nova · Centre de Manresa</div>
          <div style={{ fontWeight: 900, fontSize: v ? 40 : 38, color: C.navy, lineHeight: 1.1, marginTop: 8 }}>Pis d'alt standing amb terrassa i piscina</div>
          <div style={{ fontWeight: 900, fontSize: v ? 62 : 60, color: C.orange, marginTop: 12, letterSpacing: "-0.02em" }}>238.500 €</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 14 }}>
            {[
              { I: BedDouble, t: "2 hab." },
              { I: Bath, t: "1 bany" },
              { I: Maximize, t: "53,83 m²" },
              { I: Waves, t: "Piscina" },
            ].map(({ I, t: tx }, i) => (
              <div key={tx} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 12, background: C.tint, color: C.navy, fontWeight: 800, fontSize: 22, opacity: k(t, b(T_PICK + 1) + i * 0.1, b(T_PICK + 1) + 0.3 + i * 0.1, 0, 1) }}>
                <I size={24} color={C.blue} /> {tx}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* lupa */}
      {t > b(T_SCAN) - 0.3 && t < b(T_PICK) + 0.3 && (
        <div style={{ position: "absolute", left: gx + k(t, b(T_SCAN) - 0.3, b(T_PICK), 0, 1, EIO) * gw - 70, top: gy + ch * 0.6 - 70, width: 140, height: 140, borderRadius: "50%", border: `10px solid ${C.navy}`, background: "rgba(28,98,178,.12)", opacity: 1 - k(t, b(T_PICK) - 0.1, b(T_PICK) + 0.3, 0, 1), zIndex: 6 }}>
          <div style={{ position: "absolute", width: 70, height: 16, background: C.navy, borderRadius: 8, rotate: "45deg", left: 105, top: 135 }} />
        </div>
      )}
    </Fill>
  );
};
