import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT } from "../lib/brand";
import { Fill, useLayout, useT } from "../lib/layout";
import { BEAT, EIO, EO, k, scene } from "../lib/time";
import { DarkBg, Vignette } from "../components/Bg";
import { person } from "../components/Kit";
import { TEAM_ORDER } from "../data/story";
import type { Cue } from "../components/Sfx";

// Equip real d'Inllobsa (src/team.json), ordenat per àrees
const PEOPLE = TEAM_ORDER.map(person);
const S = scene("team");
const b = (n: number) => S.start + n * BEAT;
const T_FLY = 0.2;
const T_NAMES = 2.5;
const T_GROUP = 10;

export const teamSfx: Cue[] = [
  { t: S.start - 0.3, name: "whoosh-long", vol: 0.4 },
  ...PEOPLE.map((_, i) => ({ t: b(T_FLY + i * 0.4), name: "swipe", vol: 0.16 })),
  ...PEOPLE.map((_, i) => ({ t: b(T_NAMES + i * 0.6), name: "tick", vol: 0.25 })),
  { t: b(T_GROUP) - 0.2, name: "whoosh", vol: 0.4 },
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
  const gy = v ? 430 : 300;
  const drift = Math.sin((t - S.start) * 0.9) * 14;
  const g = k(t, b(T_GROUP) - 0.2, b(T_GROUP) + 0.5, 0, 1, EIO);
  const boxT = gy * (1 - g);
  const boxB = (H - (gy + (v ? 2 * ch + rowGap : ch))) * (1 - g);
  const boxL = gx * (1 - g);
  const kb = k(t, b(T_GROUP), S.end + 0.5, 0, 1, (x) => x);
  const streak = k(t, S.start - 0.4, S.start + 0.5, 0, 1, EIO);

  return (
    <Fill>
      <DarkBg t={t} accent={0.9} />
      {streak < 1 && <div style={{ position: "absolute", top: -200, bottom: -200, width: 260, left: -400 + streak * (W + 800), rotate: "16deg", background: `linear-gradient(90deg, transparent, ${C.orange}cc, #fff, ${C.orange}cc, transparent)`, opacity: Math.sin(streak * Math.PI), filter: "blur(10px)" }} />}
      <div style={{ position: "absolute", left: 0, right: 0, top: v ? 150 : 80, textAlign: "center", fontFamily: FONT, opacity: 1 - g }}>
        <div style={{ fontWeight: 800, fontSize: v ? 30 : 24, letterSpacing: ".18em", color: "#cfe0f5", textTransform: "uppercase" }}>10 professionals al teu servei</div>
        <div style={{ fontWeight: 900, fontSize: v ? 96 : 86, color: "#fff", letterSpacing: "-0.035em", marginTop: 8 }}>
          El nostre <span style={{ color: C.orangeLight }}>equip</span>
        </div>
      </div>
      {PEOPLE.map((m, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = gx + col * (cw + gap) + drift;
        const y = gy + row * (ch + rowGap);
        const a = k(t, b(T_FLY + i * 0.4), b(T_FLY + i * 0.4) + 0.6, 0, 1, EO);
        const sx = (((i * 53) % 7) - 3) * 160;
        const sy = (((i * 31) % 5) - 2) * 120;
        const nameT = b(T_NAMES + i * 0.6);
        const lift = Math.sin(k(t, nameT - 0.05, nameT + 0.45, 0, 1) * Math.PI);
        const nm = k(t, nameT, nameT + 0.35, 0, 1, EO);
        return (
          <div key={m.photo} style={{ position: "absolute", left: x + sx * (1 - a), top: y + sy * (1 - a) - lift * 14, width: cw, opacity: Math.min(1, a * 1.6) * (1 - g), scale: String(1.9 - 0.9 * a), filter: `blur(${(1 - a) * 14}px)` }}>
            <div style={{ width: cw, height: ch, borderRadius: 20, overflow: "hidden", boxShadow: `0 ${20 + lift * 20}px ${50 + lift * 30}px rgba(0,0,0,.45)`, outline: `${3 + lift * 3}px solid ${lift > 0.05 ? C.orange : "rgba(255,255,255,.18)"}`, outlineOffset: -1, position: "relative" }}>
              <Img src={staticFile(`team/${m.photo}-480.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(1.08 - 0.06 * a + lift * 0.03) }} />
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 8, background: C.orange, scale: `${nm} 1`, transformOrigin: "0 50%" }} />
            </div>
            <div style={{ marginTop: 14, fontFamily: FONT, textAlign: "center", opacity: nm, translate: `0 ${(1 - nm) * 16}px` }}>
              <div style={{ fontWeight: 900, fontSize: v ? 27 : 24, color: "#fff", lineHeight: 1.1, whiteSpace: "nowrap" }}>{m.name}</div>
              <div style={{ fontWeight: 600, fontSize: v ? 21 : 18, color: "#cfe0f5", marginTop: 5, lineHeight: 1.2 }}>{m.role}</div>
            </div>
          </div>
        );
      })}
      {g > 0 && (
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(${boxT}px ${boxL}px ${boxB}px ${boxL}px round ${20 * (1 - g)}px)` }}>
          <Img src={staticFile("photos/hero-02-1920.jpg")} style={{ position: "absolute", width: v ? H * 1.5 : W, height: v ? H : W / 1.5, left: v ? -(H * 1.5 - W) * (0.2 + 0.6 * kb) : 0, top: v ? 0 : -(W / 1.5 - H) * 0.3, scale: String(1.12 - 0.08 * kb) }} />
          <div style={{ position: "absolute", inset: 0, background: v ? "linear-gradient(180deg, rgba(27,38,56,.8) 0%, rgba(27,38,56,0) 32%, rgba(27,38,56,0) 65%, rgba(27,38,56,.7) 100%)" : "linear-gradient(180deg, rgba(27,38,56,.75) 0%, rgba(27,38,56,0) 35%, rgba(27,38,56,0) 70%, rgba(27,38,56,.7) 100%)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: v ? 200 : 70, textAlign: "center", fontFamily: FONT, color: "#fff" }}>
            {["Proximitat", "i compromís"].map((w, i) => {
              const a = k(t, b(T_GROUP + 0.5 + i * 0.6), b(T_GROUP + 0.5 + i * 0.6) + 0.45, 0, 1, EO);
              return (
                <div key={w} style={{ overflow: "hidden", paddingBottom: 8, display: v ? "block" : "inline-block", marginRight: v ? 0 : 24 }}>
                  <div style={{ fontWeight: 900, fontSize: v ? 104 : 110, letterSpacing: "-0.04em", lineHeight: 1, translate: `0 ${(1 - a) * 130}%`, color: i ? C.orangeLight : "#fff", textShadow: "0 8px 40px rgba(0,0,0,.4)" }}>{w}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <Vignette strength={0.4} />
    </Fill>
  );
};
