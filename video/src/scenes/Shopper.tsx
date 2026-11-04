import React from "react";
import { Img, staticFile } from "remotion";
import { Check, Heart, Search, SlidersHorizontal } from "lucide-react";
import { C, FONT } from "../lib/brand";
import { Fill, useLayout, useT } from "../lib/layout";
import { BACK, EI, EIO, EO, k, scene, wt } from "../lib/time";
import { Property, type PropertyKind } from "../components/Illus";
import type { Cue } from "../components/Sfx";

const S = scene("shopper");
const T0 = S.start;
const QUERY = "Casa amb jardí, a prop de Manresa";
const T_TYPE0 = T0 + 0.45;
const T_TYPE1 = wt("L10", "especial") + 0.3;
const T_BADGE = wt("L11", "personal");
const FILTERS = ["Jardí", "3 habitacions", "Terrassa", "Zona tranquil·la"];
const T_F = [0, 1, 2, 3].map((i) => wt("L11", "immobiliari") + i * 0.32);
const T_SCAN = wt("L11", "busca");
const T_PICK = wt("L11", "trobar");
const T_HEART = wt("L11", "l'opció");
const T_MATCH = wt("L11", "encaixa");

const KINDS: PropertyKind[] = ["flat", "shop", "plot", "house", "flat", "warehouse", "parking", "house"];
const WIN = 3; // la casa amb jardí

export const shopperSfx: Cue[] = [
  { t: T0 - 0.45, name: "whoosh", vol: 0.5 },
  { t: T_TYPE0, name: "typing", vol: 0.5 },
  { t: T_TYPE0 + 1.0, name: "typing", vol: 0.4 },
  { t: T_BADGE - 0.05, name: "pop", vol: 0.4 },
  ...T_F.map((t) => ({ t, name: "tick", vol: 0.45 })),
  { t: T_SCAN, name: "whoosh-long", vol: 0.25 },
  { t: T_PICK, name: "swipe", vol: 0.45 },
  { t: T_HEART, name: "like", vol: 0.5 },
  { t: T_MATCH - 0.05, name: "ding", vol: 0.45 },
];

export const Shopper: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  const { W, v, cx } = useLayout();

  // entrada: persianes
  const bl = k(t, T0 - 0.5, T0 + 0.15, 0, 1, EIO);
  const stripe = W / (v ? 5 : 8);
  const mask = `repeating-linear-gradient(90deg, #000 0px, #000 ${bl * stripe}px, transparent ${bl * stripe}px, transparent ${stripe}px)`;

  const typed = Math.round(k(t, T_TYPE0, T_TYPE1, 0, QUERY.length, (x) => x));
  const caret = Math.floor(t * 2.5) % 2 === 0;

  const barW = v ? 960 : 1120;
  const barY = v ? 150 : 110;

  const cols = v ? 2 : 4;
  const shown = v ? [0, 1, 2, 3, 5, 7] : [0, 1, 2, 3, 4, 5, 6, 7];
  const cw = v ? 440 : 300;
  const ch = v ? 250 : 216;
  const gap = v ? 26 : 30;
  const gw = cols * cw + (cols - 1) * gap;
  const gx = cx - gw / 2;
  const gy = v ? 500 : 420;

  const pick = k(t, T_PICK, T_PICK + 0.9, 0, 1, EIO);
  const scanP = k(t, T_SCAN, T_PICK, 0, 1, EIO);
  const winIdx = shown.indexOf(WIN);
  const wx = gx + (winIdx % cols) * (cw + gap);
  const wy = gy + Math.floor(winIdx / cols) * (ch + gap);
  const tx = cx - cw / 2;
  const ty = v ? 760 : 470;
  const ws = 1 + pick * (v ? 0.75 : 0.9);

  return (
    <Fill style={{ maskImage: t < T0 + 0.2 ? mask : undefined, WebkitMaskImage: t < T0 + 0.2 ? mask : undefined }}>
      <Fill style={{ background: `linear-gradient(180deg, #ffffff 0%, ${C.tint} 100%)` }} />

      {/* barra de cerca */}
      <div
        style={{
          position: "absolute",
          left: cx - barW / 2,
          top: barY,
          width: barW,
          height: v ? 116 : 104,
          borderRadius: 999,
          background: C.white,
          boxShadow: "0 24px 60px rgba(30,41,59,.14)",
          border: `2px solid ${t > T_TYPE0 ? C.blue : C.line}`,
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "0 18px 0 34px",
          boxSizing: "border-box",
          fontFamily: FONT,
          scale: String(k(t, T0, T0 + 0.6, 0.85, 1, BACK)),
        }}
      >
        <Search size={v ? 46 : 42} color={C.blue} strokeWidth={2.6} />
        <div style={{ flex: 1, fontSize: v ? 40 : 38, fontWeight: 700, color: C.navy, whiteSpace: "nowrap", overflow: "hidden" }}>
          {QUERY.slice(0, typed)}
          <span style={{ opacity: caret && t < T_SCAN ? 1 : 0, color: C.orange }}>|</span>
        </div>
        <div style={{ width: v ? 84 : 76, height: v ? 84 : 76, borderRadius: "50%", background: C.orange, display: "grid", placeItems: "center" }}>
          <SlidersHorizontal size={34} color="#fff" strokeWidth={2.6} />
        </div>
      </div>

      {/* filtres */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: barY + (v ? 150 : 132),
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 16,
          padding: v ? "0 60px" : 0,
        }}
      >
        {FILTERS.map((f, i) => {
          const on = k(t, T_F[i], T_F[i] + 0.25, 0, 1);
          return (
            <div
              key={f}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: v ? "12px 24px" : "10px 22px",
                borderRadius: 999,
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: v ? 30 : 25,
                background: on > 0.5 ? C.blue : C.white,
                color: on > 0.5 ? C.white : C.muted,
                border: `2px solid ${on > 0.5 ? C.blue : C.line}`,
                scale: String(1 + Math.sin(on * Math.PI) * 0.12),
                opacity: k(t, T0 + 0.3 + i * 0.08, T0 + 0.7 + i * 0.08, 0, 1),
              }}
            >
              {on > 0.5 && <Check size={24} strokeWidth={3.4} />}
              {f}
            </div>
          );
        })}
      </div>

      {/* insígnia personal shopper */}
      <div
        style={{
          position: "absolute",
          left: v ? cx - 260 : 70,
          top: v ? 1330 : 40,
          
          alignItems: "center",
          gap: 16,
          padding: "10px 26px 10px 10px",
          borderRadius: 999,
          background: C.navy,
          color: "#fff",
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: v ? 30 : 24,
          opacity: k(t, T_BADGE - 0.1, T_BADGE + 0.3, 0, 1) * (v ? 1 - k(t, T_MATCH - 0.6, T_MATCH - 0.3, 0, 1) : 1),
          translate: `${(1 - k(t, T_BADGE - 0.1, T_BADGE + 0.5, 0, 1, EO)) * -40}px 0`,
          display: v && t > T_MATCH ? "none" : "flex",
        }}
      >
        <span style={{ width: 60, height: 60, borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center" }}>
          <Img src={staticFile("icons/svc-shopper.png")} style={{ width: 44 }} />
        </span>
        Personal shopper immobiliari
      </div>

      {/* graella d'immobles */}
      {shown.map((kind, i) => {
        if (kind === WIN) return null;
        const col = i % cols;
        const row = Math.floor(i / cols);
        const a = k(t, T0 + 0.5 + i * 0.07, T0 + 1.1 + i * 0.07, 0, 1, EO);
        const out = k(t, T_SCAN + 0.25 + i * 0.12, T_SCAN + 0.6 + i * 0.12, 0, 1, EI);
        const gone = k(t, T_PICK, T_PICK + 0.5, 0, 1);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: gx + col * (cw + gap),
              top: gy + row * (ch + gap) + (1 - a) * 60,
              width: cw,
              height: ch,
              borderRadius: 22,
              background: C.white,
              boxShadow: "0 16px 40px rgba(30,41,59,.1)",
              display: "grid",
              placeItems: "center",
              opacity: a * (1 - out * 0.75) * (1 - gone),
              filter: `grayscale(${out})`,
              scale: String(1 - out * 0.08),
            }}
          >
            <Property kind={KINDS[kind]} width={cw * 0.62} />
          </div>
        );
      })}
      {/* l'immoble triat */}
      {(() => {
        const a = k(t, T0 + 0.5 + winIdx * 0.07, T0 + 1.1 + winIdx * 0.07, 0, 1, EO);
        const x = wx + (tx - wx) * pick;
        const y = wy + (ty - wy) * pick;
        const heart = k(t, T_HEART - 0.05, T_HEART + 0.4, 0, 1, BACK);
        return (
          <div
            style={{
              position: "absolute",
              left: x,
              top: y + (1 - a) * 60,
              width: cw,
              height: ch,
              borderRadius: 22,
              background: C.white,
              boxShadow: `0 ${16 + pick * 30}px ${40 + pick * 60}px rgba(30,41,59,${0.1 + pick * 0.12})`,
              outline: `${pick * 5}px solid ${C.orange}`,
              display: "grid",
              placeItems: "center",
              opacity: a,
              scale: String(ws),
              zIndex: 5,
            }}
          >
            <Property kind="house" width={cw * 0.62} />
            <div
              style={{
                position: "absolute",
                right: 12,
                top: 12,
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: C.orange,
                display: "grid",
                placeItems: "center",
                scale: String(heart),
              }}
            >
              <Heart size={28} color="#fff" fill="#fff" />
            </div>
          </div>
        );
      })()}
      {/* lupa que escaneja la graella */}
      {t > T_SCAN - 0.2 && t < T_PICK + 0.4 && (
        <div
          style={{
            position: "absolute",
            left: gx + scanP * gw - 70,
            top: gy + ch * (0.5 + 0.6 * Math.sin(scanP * Math.PI * 2)) - 70,
            width: 140,
            height: 140,
            borderRadius: "50%",
            border: `10px solid ${C.navy}`,
            background: "rgba(28,98,178,.12)",
            opacity: k(t, T_SCAN - 0.2, T_SCAN + 0.1, 0, 1) * (1 - k(t, T_PICK, T_PICK + 0.4, 0, 1)),
            zIndex: 6,
          }}
        >
          <div style={{ position: "absolute", width: 70, height: 16, background: C.navy, borderRadius: 8, rotate: "45deg", left: 105, top: 135 }} />
        </div>
      )}
      {/* etiqueta final */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: v ? ty + ch * ws + 40 - (ch * (ws - 1)) / 2 : ty + ch * ws - (ch * (ws - 1)) / 2 + 36,
          display: "flex",
          justifyContent: "center",
          opacity: k(t, T_MATCH - 0.1, T_MATCH + 0.3, 0, 1),
          translate: `0 ${(1 - k(t, T_MATCH - 0.1, T_MATCH + 0.4, 0, 1, EO)) * 20}px`,
          zIndex: 7,
        }}
      >
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: v ? 52 : 46, color: C.navy }}>
          L'opció que <span style={{ color: C.orange }}>encaixa amb tu</span>
        </div>
      </div>
    </Fill>
  );
};
