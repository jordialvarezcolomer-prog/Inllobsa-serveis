import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT } from "../lib/brand";
import { Fill, useLayout, useT } from "../lib/layout";
import { BACK, BEAT, EI, EIO, EO, k, pulse, scene } from "../lib/time";
import { LightBg } from "../components/Bg";
import { PersonPill } from "../components/Kit";
import { SERVICE_PEOPLE } from "../data/story";
import type { Cue } from "../components/Sfx";

const S = scene("sale");
const b = (n: number) => S.start + n * BEAT;
const TYPES = ["Pisos", "Cases", "Locals", "Pàrquings", "Naus industrials", "Parcel·les"];
// "Així t'acompanyem" — passos per al propietari a la landing
const STEPS = ["Valoració gratuïta", "Reportatge fotogràfic", "Visites i difusió", "Signatura a notaria"];
const T_STEPS = 8;
const T_TEAM = 14;

export const saleSfx: Cue[] = [
  { t: S.start - 0.45, name: "whoosh", vol: 0.45 },
  ...TYPES.map((_, i) => ({ t: b(1 + i), name: "tick", vol: 0.3 })),
  { t: b(T_STEPS) - 0.2, name: "whoosh", vol: 0.35 },
  ...STEPS.map((_, i) => ({ t: b(T_STEPS + 0.5 + i), name: "pop", vol: 0.35 })),
  { t: b(T_TEAM) - 0.2, name: "whoosh-down", vol: 0.3 },
  ...SERVICE_PEOPLE.sale.map((_, i) => ({ t: b(T_TEAM + 0.5 + i), name: "rise", vol: 0.3 })),
];

/** Segell giratori "Valoració gratuïta · Sense compromís" (com a la landing). */
const Stamp: React.FC<{ t: number; size: number; a: number }> = ({ t, size, a }) => {
  const txt = "VALORACIÓ GRATUÏTA · SENSE COMPROMÍS · ";
  return (
    <div style={{ width: size, height: size, position: "relative", scale: String(a), rotate: `${t * 40}deg` }}>
      <svg viewBox="0 0 200 200" width={size} height={size}>
        <defs>
          <path id="stamp-circle" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
        </defs>
        <circle cx="100" cy="100" r="98" fill={C.orange} />
        <text fontFamily={FONT} fontWeight={900} fontSize="17" letterSpacing="2.2" fill="#fff">
          <textPath href="#stamp-circle">{txt}</textPath>
        </text>
      </svg>
      <div style={{ position: "absolute", inset: "30%", borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center", rotate: `${-t * 40}deg` }}>
        <Img src={staticFile("brand/roof.png")} style={{ width: "70%" }} />
      </div>
    </div>
  );
};

export const Sale: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  const { W, H, v, cx } = useLayout();

  // entrada: escombrat diagonal amb el pendent de la teulada del logotip
  const wipe = k(t, S.start - 0.45, S.start + 0.15, 0, 1, EIO);
  const slope = H * 0.29;
  const xw = -slope + wipe * (W + slope * 2);
  const clip = `polygon(0 0, ${xw}px 0, ${xw - slope}px 100%, 0 100%)`;

  // part 1: tipus d'immoble
  const p1out = k(t, b(T_STEPS) - 0.25, b(T_STEPS) + 0.2, 0, 1, EI);
  const typeIdx = Math.max(0, Math.min(TYPES.length - 1, Math.floor((t - b(1)) / BEAT)));
  const typeA = k(t, b(1 + typeIdx) - 0.05, b(1 + typeIdx) + 0.25, 0, 1, EO);
  const photoIn = k(t, S.start, S.start + 0.6, 0, 1, BACK);

  // part 2: passos
  const p2in = k(t, b(T_STEPS) - 0.1, b(T_STEPS) + 0.4, 0, 1, EO);
  const p2out = k(t, b(T_TEAM) - 0.25, b(T_TEAM) + 0.2, 0, 1, EI);

  // part 3: equip de vendes
  const p3in = k(t, b(T_TEAM) - 0.1, b(T_TEAM) + 0.4, 0, 1, EO);

  return (
    <Fill style={{ clipPath: t < S.start + 0.2 ? clip : undefined }}>
      <LightBg t={t} />
      {t < S.start + 0.2 && (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <polygon points={`${xw - 26},0 ${xw},0 ${xw - slope},${H} ${xw - slope - 26},${H}`} fill={C.orange} />
        </svg>
      )}

      {/* ============ part 1 */}
      {p1out < 1 && (
        <Fill style={{ opacity: 1 - p1out, translate: `${-p1out * 120}px 0` }}>
          <div
            style={{
              position: "absolute",
              left: v ? 90 : 120,
              top: v ? 760 : 170,
              width: v ? 900 : 860,
              height: v ? 560 : 640,
              borderRadius: 30,
              overflow: "hidden",
              boxShadow: "0 40px 90px rgba(30,41,59,.25)",
              scale: String(0.8 + 0.2 * photoIn),
              rotate: `${(1 - photoIn) * -6}deg`,
            }}
          >
            <Img src={staticFile("listing/principal-1920.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(1.15 - (t - S.start) * 0.02) }} />
            <div style={{ position: "absolute", left: 24, top: 24, padding: "10px 22px", borderRadius: 999, background: C.orange, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 26, letterSpacing: ".06em" }}>EN VENDA</div>
            <div style={{ position: "absolute", left: 24, bottom: 24, padding: "10px 20px", borderRadius: 14, background: "rgba(27,38,56,.82)", color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 24 }}>
              Obra nova · Manresa
            </div>
          </div>
          <div style={{ position: "absolute", left: v ? 90 : 1060, top: v ? 250 : 300, fontFamily: FONT }}>
            <div style={{ fontWeight: 800, fontSize: v ? 30 : 28, letterSpacing: ".16em", color: C.blue, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ width: 44, height: 4, background: C.orange, borderRadius: 3 }} />
              Compravenda
            </div>
            <div style={{ fontWeight: 900, fontSize: v ? 110 : 118, color: C.navy, letterSpacing: "-0.04em", lineHeight: 1, marginTop: 14 }}>Venem</div>
            <div style={{ height: v ? 140 : 150, overflow: "hidden", marginTop: 6 }}>
              <div
                style={{
                  fontWeight: 900,
                  fontSize: v ? 110 : TYPES[typeIdx].length > 12 ? 92 : 118,
                  color: C.orange,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.2,
                  translate: `0 ${(1 - typeA) * 100}%`,
                  whiteSpace: "nowrap",
                }}
              >
                {TYPES[typeIdx]}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              {TYPES.map((_, i) => (
                <div key={i} style={{ width: i === typeIdx ? 42 : 14, height: 14, borderRadius: 7, background: i <= typeIdx ? C.orange : C.line }} />
              ))}
            </div>
          </div>
        </Fill>
      )}

      {/* ============ part 2: així t'acompanyem */}
      {t > b(T_STEPS) - 0.2 && p2out < 1 && (
        <Fill style={{ opacity: p2in * (1 - p2out), translate: `${(1 - p2in) * 140 - p2out * 140}px 0` }}>
          <div style={{ position: "absolute", left: v ? 0 : 130, right: v ? 0 : undefined, top: v ? 200 : 140, textAlign: v ? "center" : "left", fontFamily: FONT }}>
            <div style={{ fontWeight: 800, fontSize: v ? 30 : 26, letterSpacing: ".16em", color: C.blue, textTransform: "uppercase" }}>Així t'acompanyem</div>
            <div style={{ fontWeight: 900, fontSize: v ? 78 : 76, color: C.navy, letterSpacing: "-0.035em", lineHeight: 1.05, marginTop: 10 }}>
              Vols <span style={{ color: C.orange }}>vendre</span> el teu immoble?
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              left: v ? 90 : 130,
              right: v ? 90 : 130,
              top: v ? 520 : 400,
              display: "grid",
              gridTemplateColumns: v ? "1fr 1fr" : "repeat(4, 1fr)",
              gap: v ? 26 : 30,
            }}
          >
            {STEPS.map((s, i) => {
              const t0 = b(T_STEPS + 0.5 + i);
              const a = k(t, t0 - 0.1, t0 + 0.35, 0, 1, BACK);
              const on = t >= t0;
              return (
                <div
                  key={s}
                  style={{
                    height: v ? 300 : 300,
                    borderRadius: 28,
                    background: on ? (i === 0 ? C.orange : C.navy) : C.white,
                    color: "#fff",
                    padding: 32,
                    boxSizing: "border-box",
                    fontFamily: FONT,
                    boxShadow: "0 30px 70px rgba(30,41,59,.18)",
                    transform: `perspective(900px) rotateY(${(1 - a) * 80}deg)`,
                    opacity: Math.min(1, a * 1.5),
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ fontWeight: 900, fontSize: 92, lineHeight: 1, opacity: 0.35, letterSpacing: "-0.04em" }}>{String(i + 1).padStart(2, "0")}</div>
                  <div style={{ fontWeight: 900, fontSize: v ? 40 : 38, lineHeight: 1.1 }}>{s}</div>
                </div>
              );
            })}
          </div>
          <div style={{ position: "absolute", right: v ? cx - 130 : 120, top: v ? 1180 : 110 }}>
            <Stamp t={t} size={v ? 260 : 230} a={k(t, b(T_STEPS + 0.5), b(T_STEPS + 1.2), 0, 1, BACK) * (1 + pulse(t, 8) * 0.04)} />
          </div>
        </Fill>
      )}

      {/* ============ part 3: equip de vendes */}
      {t > b(T_TEAM) - 0.2 && (
        <Fill style={{ opacity: p3in }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: v ? 300 : 170, textAlign: "center", fontFamily: FONT }}>
            <div style={{ fontWeight: 800, fontSize: v ? 30 : 26, letterSpacing: ".16em", color: C.blue, textTransform: "uppercase" }}>El teu equip de vendes</div>
            <div style={{ fontWeight: 900, fontSize: v ? 84 : 86, color: C.navy, letterSpacing: "-0.035em", lineHeight: 1.05, marginTop: 10 }}>
              Experts en <span style={{ color: C.orange }}>compravenda</span>
            </div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: v ? 620 : 470, display: "flex", flexDirection: v ? "column" : "row", alignItems: "center", justifyContent: "center", gap: v ? 34 : 30, flexWrap: "wrap" }}>
            {SERVICE_PEOPLE.sale.map((ph, i) => (
              <PersonPill key={ph} photo={ph} t={t} t0={b(T_TEAM + 0.5 + i)} size={v ? 1.25 : 1.3} />
            ))}
          </div>
        </Fill>
      )}
    </Fill>
  );
};
