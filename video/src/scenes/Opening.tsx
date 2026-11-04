import React from "react";
import { C, FONT } from "../lib/brand";
import { Fill, useLayout, useT } from "../lib/layout";
import { BACK, EI, EIO, EO, EV, k, p, scene, wt } from "../lib/time";
import { DarkBg, Vignette } from "../components/Bg";
import { Logo } from "../components/Logo";
import { Skyline } from "../components/Illus";
import { Eyebrow } from "../components/Text";
import type { Cue } from "../components/Sfx";

const S = scene("opening");
const HIT = EV.logoHit;
const T_YEAR = wt("L01", "1977") - 0.12;
const T_W = [wt("L01", "persones"), wt("L01", "oportunitats"), wt("L01", "projectes")];
const T_OUT = S.end - 0.5;

export const openingSfx: Cue[] = [
  { t: 0.05, name: "whoosh-long", vol: 0.55 },
  { t: HIT + 0.05, name: "logo-shine", vol: 0.5 },
  { t: 2.15, name: "whoosh", vol: 0.4 },
  ...[0, 1, 2, 3].map((i) => ({ t: T_YEAR + i * 0.07, name: "tick", vol: 0.35 })),
  ...T_W.map((t) => ({ t, name: "pop", vol: 0.45 })),
];

export const Opening: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  const { W, H, v, cx, cy } = useLayout();

  // --- logotip: traç de la teulada → cop → lletres
  const roof = k(t, 0.12, HIT, 0, 1, EIO);
  const word = k(t, HIT, HIT + 0.45, 0, 1, EO);
  const tag = k(t, HIT + 0.25, HIT + 0.9, 0, 1, EO);
  const move = k(t, 2.15, 2.95, 0, 1, EIO); // el logotip puja i es fa petit
  const logoW0 = v ? 820 : 900;
  const logoW1 = v ? 420 : 340;
  const logoW = logoW0 + (logoW1 - logoW0) * move;
  const logoY0 = cy - (logoW0 * 234) / 518 / 2;
  const logoY1 = v ? 190 : 86;
  const logoY = logoY0 + (logoY1 - logoY0) * move;
  const punch = 1 + 0.05 * Math.exp(-Math.max(0, t - HIT) * 6) * (t > HIT ? 1 : 0);
  const glow = t > HIT ? Math.exp(-(t - HIT) * 2.2) : roof * 0.4;

  // ona expansiva al cop
  const ring = p(t, HIT, 1.3);
  const flash = t > HIT ? Math.exp(-(t - HIT) * 9) : 0;

  // --- 1977
  const yearIn = p(t, T_YEAR, 0.9);
  const sky = k(t, 2.4, 6.5, 0, 1, EIO);
  const exit = k(t, T_OUT, S.end + 0.4, 0, 1, EI);

  // --- tres paraules
  const words = ["Persones", "Immobles", "Confiança"];
  const wordsX = v ? 110 : 1060;
  const wordsY = v ? 905 : 330;

  const cam = 1 + t * 0.006; // push-in lent constant

  return (
    <Fill>
      <DarkBg t={t} accent={0.8 + glow} />
      <Fill style={{ scale: String(cam * (1 + exit * 0.08)), filter: `blur(${exit * 8}px)`, opacity: 1 - exit * 0.4 }}>
        {/* skyline en dues capes (parallax) */}
        <div
          style={{
            position: "absolute",
            left: -100 - t * 6,
            bottom: v ? 380 : -10,
            opacity: 0.22 * (1 - move * 0) * (t > 2.3 ? 1 : 0),
          }}
        >
          <Skyline d={sky} width={W + 600} color="#ffffff" seed={3} />
        </div>
        <div style={{ position: "absolute", left: -260 - t * 14, bottom: v ? 360 : -30, opacity: t > 2.3 ? 0.5 : 0 }}>
          <Skyline d={k(t, 2.7, 7.2, 0, 1, EIO)} width={W + 900} color={C.orangeLight} opacity={0.6} seed={7} />
        </div>

        {/* ona expansiva */}
        {t > HIT && t < HIT + 1.4 && (
          <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
            <circle cx={cx} cy={cy} r={60 + ring * (W * 0.7)} fill="none" stroke={C.orange} strokeWidth={10 * (1 - ring)} opacity={1 - ring} />
            <circle cx={cx} cy={cy} r={40 + ring * (W * 0.45)} fill="none" stroke="#fff" strokeWidth={3 * (1 - ring)} opacity={0.7 * (1 - ring)} />
          </svg>
        )}

        {/* logotip */}
        <div style={{ position: "absolute", left: cx - logoW / 2, top: logoY, scale: String(punch) }}>
          <Logo width={logoW} variant="white" roof={roof} word={word} tag={tag} glow={glow} />
        </div>

        {/* DES DE 1977 */}
        <div
          style={{
            position: "absolute",
            left: v ? 110 : 150,
            top: v ? 425 : 330,
            opacity: yearIn > 0 ? 1 : 0,
          }}
        >
          <Eyebrow text="Des de" t={t} t0={T_YEAR - 0.25} color="#cfe0f5" size={v ? 34 : 30} />
          <svg width={v ? 860 : 820} height={v ? 330 : 310} style={{ overflow: "visible", marginTop: 6 }}>
            <text
              x={0}
              y={v ? 270 : 255}
              fontFamily={FONT}
              fontWeight={900}
              fontSize={v ? 330 : 310}
              letterSpacing={-12}
              fill={C.white}
              fillOpacity={k(t, T_YEAR + 0.35, T_YEAR + 0.9, 0, 1)}
              stroke={C.white}
              strokeWidth={3}
              strokeDasharray={1400}
              strokeDashoffset={1400 * (1 - yearIn)}
              style={{ translate: `0 ${(1 - k(t, T_YEAR, T_YEAR + 0.7, 0, 1, BACK)) * 40}px` }}
            >
              1977
            </text>
          </svg>
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: v ? 40 : 34,
              color: "#cfe0f5",
              opacity: k(t, T_YEAR + 0.6, T_YEAR + 1.2, 0, 1),
              translate: `${(1 - k(t, T_YEAR + 0.6, T_YEAR + 1.3, 0, 1)) * -30}px 0`,
              marginTop: 4,
            }}
          >
            Immobiliària a <b style={{ color: C.white, fontWeight: 800 }}>Manresa</b>
          </div>
        </div>

        {/* Persones. Immobles. Confiança. — connectats per una línia */}
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <path
            d={`M${wordsX - 40} ${wordsY + 70} V${wordsY + 70 + 2 * (v ? 160 : 150)}`}
            stroke={C.orange}
            strokeWidth={4}
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - k(t, T_W[0], T_W[2] + 0.3, 0, 1, EIO)}
          />
          {T_W.map((tw, i) => {
            const a = k(t, tw - 0.05, tw + 0.35, 0, 1, BACK);
            return (
              <circle
                key={i}
                cx={wordsX - 40}
                cy={wordsY + 70 + i * (v ? 160 : 150)}
                r={14 * a}
                fill={C.orange}
                stroke={C.navy900}
                strokeWidth={5}
              />
            );
          })}
        </svg>
        {words.map((w, i) => {
          const a = k(t, T_W[i] - 0.05, T_W[i] + 0.55, 0, 1, EO);
          return (
            <div
              key={w}
              style={{
                position: "absolute",
                left: wordsX,
                top: wordsY + i * (v ? 160 : 150),
                overflow: "hidden",
                paddingBottom: 12,
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: v ? 140 : 128,
                letterSpacing: "-0.035em",
                lineHeight: 1.05,
                color: C.white,
              }}
            >
              <div style={{ translate: `0 ${(1 - a) * 140}%` }}>
                {w}
                <span style={{ color: C.orange }}>.</span>
              </div>
            </div>
          );
        })}
      </Fill>
      {flash > 0.01 && <Fill style={{ background: "#fff", opacity: flash * 0.28 }} />}
      <Vignette />
      {/* abans de 2.2 s: cortina negra que s'obre (inici net) */}
      <Fill style={{ background: C.navy900, opacity: 1 - k(t, 0, 0.35, 0, 1) }} />
    </Fill>
  );
};
