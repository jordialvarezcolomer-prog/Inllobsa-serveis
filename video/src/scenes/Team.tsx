import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT } from "../lib/brand";
import { Fill, useLayout, useT } from "../lib/layout";
import { EIO, EO, k, scene, wt } from "../lib/time";
import { DarkBg, Vignette } from "../components/Bg";
import { Eyebrow, Kinetic } from "../components/Text";
import type { Cue } from "../components/Sfx";
import team from "../data/team.json"; // còpia de src/team.json de la landing

// Equip real d'Inllobsa: fotografies i càrrecs de src/team.json de la landing (sense alterar).
const PEOPLE = team.map((m) => ({ photo: m.photo, name: m.name, role: m.role.ca }));

const S = scene("team");
const T0 = S.start;
const T_FLY = T0 + 0.35;
const T_TITLE = wt("L16", "el", 0) - 0.1;
const T_NAMES = wt("L17", "equip") - 0.05;
const T_GROUP = wt("L18", "Persones") - 0.35;

export const teamSfx: Cue[] = [
  { t: T0 - 0.2, name: "whoosh-long", vol: 0.4 },
  ...PEOPLE.map((_, i) => ({ t: T_FLY + i * 0.22, name: "swipe", vol: 0.22 })),
  { t: T_TITLE, name: "pop", vol: 0.4 },
  ...PEOPLE.map((_, i) => ({ t: T_NAMES + i * 0.36, name: "tick", vol: 0.3 })),
  { t: T_GROUP, name: "whoosh", vol: 0.45 },
  { t: T_GROUP + 0.4, name: "impact", vol: 0.3 },
];

export const Team: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  const { W, H, v, cx } = useLayout();

  const cols = v ? 4 : 8;
  const cw = v ? 228 : 206;
  const ch = cw * (4 / 3);
  const gap = v ? 18 : 15;
  const rowGap = v ? 120 : 0;
  const gw = cols * cw + (cols - 1) * gap;
  const gx = cx - gw / 2;
  const gy = v ? 430 : 330;
  const drift = Math.sin((t - T0) * 0.6) * 14;

  const g = k(t, T_GROUP, T_GROUP + 0.75, 0, 1, EIO); // pas a la foto de grup
  const streak = k(t, T0 - 0.4, T0 + 0.5, 0, 1, EIO);

  // retall de la foto de grup: s'obre des de la filera de retrats
  const boxT = gy * (1 - g);
  const boxB = (H - (gy + (v ? 2 * ch + rowGap : ch))) * (1 - g);
  const boxL = gx * (1 - g);
  const kb = k(t, T_GROUP, S.end + 0.5, 0, 1, (x) => x);

  return (
    <Fill>
      <DarkBg t={t} accent={0.9} />
      {/* ratlla de llum d'entrada */}
      {streak < 1 && (
        <div
          style={{
            position: "absolute",
            top: -200,
            bottom: -200,
            width: 260,
            left: -400 + streak * (W + 800),
            rotate: "16deg",
            background: `linear-gradient(90deg, transparent, ${C.orange}cc, #fff, ${C.orange}cc, transparent)`,
            opacity: Math.sin(streak * Math.PI),
            filter: "blur(10px)",
          }}
        />
      )}

      {/* títol */}
      <div style={{ position: "absolute", left: 0, right: 0, top: v ? 150 : 80, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: 1 - g }}>
        <Eyebrow text="Proximitat i compromís" t={t} t0={T0 + 0.6} color="#cfe0f5" size={v ? 30 : 24} />
        <Kinetic text="El nostre *equip*" t={t} t0={T_TITLE} size={v ? 96 : 84} weight={900} hl={C.orangeLight} align="center" letterSpacing={-0.035} />
      </div>

      {/* retrats */}
      {PEOPLE.map((m, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = gx + col * (cw + gap) + drift;
        const y = gy + row * (ch + rowGap);
        const a = k(t, T_FLY + i * 0.22, T_FLY + i * 0.22 + 0.9, 0, 1, EO);
        // punt de partida dispers en profunditat
        const sx = (((i * 53) % 7) - 3) * 160;
        const sy = (((i * 31) % 5) - 2) * 120;
        const nameT = T_NAMES + i * 0.36;
        const lift = Math.sin(k(t, nameT - 0.05, nameT + 0.6, 0, 1) * Math.PI);
        const nm = k(t, nameT, nameT + 0.45, 0, 1, EO);
        return (
          <div
            key={m.photo}
            style={{
              position: "absolute",
              left: x + sx * (1 - a),
              top: y + sy * (1 - a) - lift * 14,
              width: cw,
              opacity: Math.min(1, a * 1.6) * (1 - g),
              scale: String(1.9 - 0.9 * a),
              filter: `blur(${(1 - a) * 14}px)`,
              zIndex: 10 - Math.round(a * 5),
            }}
          >
            <div
              style={{
                width: cw,
                height: ch,
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: `0 ${20 + lift * 20}px ${50 + lift * 30}px rgba(0,0,0,.45)`,
                outline: `${3 + lift * 3}px solid ${lift > 0.05 ? C.orange : "rgba(255,255,255,.18)"}`,
                outlineOffset: -1,
                position: "relative",
              }}
            >
              <Img
                src={staticFile(`team/${m.photo}-480.jpg`)}
                style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(1.08 - 0.06 * a + lift * 0.03) }}
              />
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 8, background: C.orange, scale: `${nm} 1`, transformOrigin: "0 50%" }} />
            </div>
            <div style={{ marginTop: 14, fontFamily: FONT, textAlign: "center", opacity: nm, translate: `0 ${(1 - nm) * 16}px` }}>
              <div style={{ fontWeight: 900, fontSize: v ? 27 : 24, color: "#fff", lineHeight: 1.1, whiteSpace: "nowrap" }}>{m.name}</div>
              <div style={{ fontWeight: 600, fontSize: v ? 21 : 18, color: "#cfe0f5", marginTop: 5, lineHeight: 1.2 }}>{m.role}</div>
            </div>
          </div>
        );
      })}

      {/* foto de grup */}
      {g > 0 && (
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(${boxT}px ${boxL}px ${boxB}px ${boxL}px round ${20 * (1 - g)}px)` }}>
          <Img
            src={staticFile("photos/hero-01-1920.jpg")}
            style={{
              position: "absolute",
              width: v ? H * 1.5 : W,
              height: v ? H : W / 1.5,
              left: v ? -(H * 1.5 - W) * (0.15 + 0.7 * kb) : 0,
              top: v ? 0 : -(W / 1.5 - H) * 0.35,
              scale: String(1.12 - 0.08 * kb),
            }}
          />
          <div style={{ position: "absolute", inset: 0, background: v ? "linear-gradient(180deg, rgba(27,38,56,.75) 0%, rgba(27,38,56,0) 30%, rgba(27,38,56,0) 70%, rgba(27,38,56,.6) 100%)" : "linear-gradient(180deg, rgba(27,38,56,0) 35%, rgba(27,38,56,.85) 100%)" }} />
          <div style={{ position: "absolute", left: v ? 70 : 120, ...(v ? { top: 230 } : { bottom: 190 }) }}>
            <Kinetic
              text={"Persones compromeses\namb *persones*."}
              t={t}
              t0={T_GROUP + 0.3}
              size={v ? 82 : 92}
              weight={900}
              hl={C.orangeLight}
              letterSpacing={-0.035}
            />
          </div>
        </div>
      )}
      <Vignette strength={0.4} />
    </Fill>
  );
};
