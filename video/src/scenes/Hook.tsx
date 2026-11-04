import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT } from "../lib/brand";
import { Fill, useLayout, useT } from "../lib/layout";
import { BACK, BEAT, EI, EIO, EO, k, p, pulse, scene } from "../lib/time";
import { DarkBg, Vignette } from "../components/Bg";
import { Logo } from "../components/Logo";
import { Photo } from "../components/Kit";
import type { Cue } from "../components/Sfx";

const S = scene("hook");
const b = (n: number) => S.start + n * BEAT;
// fotografies reals de la promoció d'obra nova (fitxa d'Inllobsa)
const CARDS = ["piscina-1", "interior-1", "terrassa-piscina", "bany-2", "piscina-3", "habitacio", "terrassa-1"];
const WORDS = [
  { w: "Trobem", at: 0.5 },
  { w: "la llar", at: 2, hl: true },
  { w: "dels teus", at: 4, hl: true },
  { w: "somnis", at: 6, hl: true },
];
const LOGO = 8;

export const hookSfx: Cue[] = [
  ...CARDS.map((_, i) => ({ t: b(1 + i), name: "swipe", vol: 0.22 })),
  { t: b(LOGO) - 0.9, name: "whoosh-long", vol: 0.4 },
  { t: b(LOGO) + 0.05, name: "logo-shine", vol: 0.4 },
];

export const Hook: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  const { W, H, v, cx, cy } = useLayout();

  const toLogo = k(t, b(LOGO) - 0.35, b(LOGO) + 0.25, 0, 1, EIO);
  const beatPunch = pulse(t, 9);

  // --- logotip
  const roof = k(t, b(LOGO) - 0.3, b(LOGO) + 0.5, 0, 1, EIO);
  const word = k(t, b(LOGO) + 0.3, b(LOGO) + 0.8, 0, 1, EO);
  const tag = k(t, b(LOGO) + 0.6, b(LOGO) + 1.2, 0, 1, EO);
  const lw = v ? 820 : 900;
  const ring = p(t, b(LOGO) + 0.3, 1.3);
  const slogan = k(t, b(LOGO + 2), b(LOGO + 2.8), 0, 1, EO);
  const exit = k(t, S.end - 0.35, S.end + 0.3, 0, 1, EI);

  return (
    <Fill>
      {/* ============ PART 1: fotos reals al ritme */}
      {toLogo < 1 && (
        <Fill style={{ clipPath: `inset(${toLogo * 50}% ${toLogo * 50}% round ${toLogo * 40}px)` }}>
          <Photo src="listing/principal-1920.jpg" t={t} t0={S.start} dur={8 * BEAT} from={[1.25, -3, 2]} to={[1.05, 2, -2]} />
          <Fill style={{ background: "linear-gradient(90deg, rgba(27,38,56,.82) 0%, rgba(27,38,56,.35) 55%, rgba(27,38,56,.05) 100%)" }} />
          {/* targetes de fotos que piquen a cada temps */}
          {CARDS.map((c, i) => {
            const t0 = b(1 + i);
            const a = k(t, t0 - 0.08, t0 + 0.32, 0, 1, BACK);
            if (t < t0 - 0.08) return null;
            const cw = v ? 560 : 560;
            const ch = cw * 0.75;
            const slots = v
              ? [
                  [W * 0.5, 1240],
                  [W * 0.32, 1390],
                  [W * 0.68, 1410],
                  [W * 0.42, 1560],
                  [W * 0.62, 1270],
                  [W * 0.5, 1440],
                  [W * 0.5, 1340],
                ]
              : [
                  [1370, 300],
                  [1560, 560],
                  [1230, 690],
                  [1450, 420],
                  [1620, 780],
                  [1300, 520],
                  [1480, 640],
                ];
            const [x, y] = slots[i];
            const rot = [-7, 5, -3, 8, -5, 3, -2][i];
            return (
              <div
                key={c}
                style={{
                  position: "absolute",
                  left: x - cw / 2,
                  top: y - ch / 2,
                  width: cw,
                  height: ch,
                  borderRadius: 18,
                  overflow: "hidden",
                  border: "8px solid #fff",
                  boxShadow: "0 30px 70px rgba(0,0,0,.45)",
                  rotate: `${rot * a}deg`,
                  scale: String((1.6 - 0.6 * a) * (i === CARDS.length - 1 ? 1 + beatPunch * 0.02 : 1)),
                  opacity: Math.min(1, a * 2),
                }}
              >
                <Img src={staticFile(`listing/${c}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(1.1 - 0.1 * a) }} />
              </div>
            );
          })}
          {/* eslògan paraula a paraula */}
          <div style={{ position: "absolute", left: v ? 80 : 130, top: v ? 250 : 260, fontFamily: FONT, fontWeight: 900, lineHeight: 0.98, letterSpacing: "-0.045em" }}>
            {WORDS.map((w) => {
              const a = k(t, b(w.at) - 0.06, b(w.at) + 0.4, 0, 1, EO);
              return (
                <div key={w.w} style={{ overflow: "hidden", paddingBottom: 14 }}>
                  <div
                    style={{
                      fontSize: v ? 150 : 148,
                      color: w.hl ? C.orangeLight : "#fff",
                      translate: `0 ${(1 - a) * 140}%`,
                      textShadow: "0 8px 40px rgba(0,0,0,.35)",
                    }}
                  >
                    {w.w}
                  </div>
                </div>
              );
            })}
          </div>
          <Vignette strength={0.35} />
        </Fill>
      )}

      {/* ============ PART 2: logotip + eslògan */}
      {toLogo > 0 && (
        <Fill style={{ clipPath: toLogo < 1 ? `inset(${(1 - toLogo) * 50}% ${(1 - toLogo) * 50}% round 40px)` : undefined, scale: String(1 + exit * 0.08), opacity: 1 - exit * 0.3 }}>
          <DarkBg t={t} accent={1 + Math.exp(-Math.max(0, t - b(LOGO)) * 2)} />
          <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
            {t > b(LOGO) + 0.3 && (
              <>
                <circle cx={cx} cy={cy - 60} r={80 + ring * W * 0.6} fill="none" stroke={C.orange} strokeWidth={10 * (1 - ring)} opacity={1 - ring} />
                <circle cx={cx} cy={cy - 60} r={40 + ring * W * 0.4} fill="none" stroke="#fff" strokeWidth={3 * (1 - ring)} opacity={0.6 * (1 - ring)} />
              </>
            )}
          </svg>
          <div style={{ position: "absolute", left: cx - lw / 2, top: cy - (lw * 234) / 518 / 2 - (v ? 140 : 110), scale: String(1 + 0.05 * Math.exp(-Math.max(0, t - b(LOGO) - 0.3) * 6) * (t > b(LOGO) + 0.3 ? 1 : 0)) }}>
            <Logo width={lw} variant="white" roof={roof} word={word} tag={tag} glow={t > b(LOGO) ? Math.exp(-(t - b(LOGO)) * 1.5) : 0} />
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: cy + (v ? 150 : 160),
              textAlign: "center",
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: v ? 84 : 88,
              letterSpacing: "-0.03em",
              color: "#fff",
            }}
          >
            {"La llar dels teus somnis".split(" ").map((w, i) => {
              const a = k(t, b(LOGO + 2) + i * 0.08, b(LOGO + 2) + i * 0.08 + 0.45, 0, 1, BACK);
              return (
                <span key={i} style={{ display: "inline-block", marginRight: "0.25em", opacity: Math.min(1, a * 1.5), translate: `0 ${(1 - a) * 40}px`, color: i >= 1 ? C.orangeLight : "#fff" }}>
                  {w}
                </span>
              );
            })}
            <div style={{ height: 6, width: 220 * slogan, background: C.orange, borderRadius: 4, margin: "22px auto 0" }} />
          </div>
        </Fill>
      )}
    </Fill>
  );
};
