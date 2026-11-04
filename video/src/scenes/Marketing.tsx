import React from "react";
import { BrainCircuit, Camera, Globe, Heart, House, Megaphone, MessageCircle, Share2, Sofa, Sparkles, Target, User } from "lucide-react";
import { C, FONT } from "../lib/brand";
import { Fill, useLayout, useT } from "../lib/layout";
import { BACK, EI, EIO, EO, EV, k, p, scene, wt } from "../lib/time";
import { DarkBg, Vignette } from "../components/Bg";
import { Property, Room } from "../components/Illus";
import { Eyebrow, Kinetic } from "../components/Text";
import { Logo } from "../components/Logo";
import type { Cue } from "../components/Sfx";

const S = scene("marketing");
const T0 = EV.drop;
const T_BRILLI = wt("L12", "brilli");
const M2 = wt("L13", "Fotografia") - 0.2;
const T_FOTO = wt("L13", "Fotografia");
const T_VIDEO = wt("L13", "vídeo");
const T_HOME = wt("L13", "home");
const T_PLA = wt("L13", "pla");
const M3 = wt("L14", "i") - 0.1;
const T_PORT = wt("L14", "portals");
const T_XARX = wt("L14", "xarxes");
const M4 = wt("L15", "A") - 0.1;
const T_IA = wt("L15", "intel·ligència");
const T_APL = wt("L15", "l'apliquem");
const T_PERS = wt("L15", "persones");
const T_OUT = S.end - 0.55;

export const marketingSfx: Cue[] = [
  { t: T0 + 0.05, name: "whoosh-long", vol: 0.35 },
  { t: T0 + 0.5, name: "pop", vol: 0.35 },
  { t: T_BRILLI - 0.1, name: "sparkle", vol: 0.6 },
  { t: M2, name: "whoosh", vol: 0.5 },
  { t: T_FOTO + 0.05, name: "shutter", vol: 0.6 },
  { t: T_VIDEO, name: "tick", vol: 0.4 },
  { t: T_HOME - 0.15, name: "swipe", vol: 0.45 },
  { t: T_HOME + 0.15, name: "whoosh", vol: 0.3 },
  { t: T_PLA - 0.15, name: "swipe", vol: 0.45 },
  { t: T_PLA + 0.25, name: "impact", vol: 0.35 },
  { t: M3, name: "whoosh-long", vol: 0.45 },
  ...[0, 1, 2, 3, 4].map((i) => ({ t: T_PORT + 0.2 + i * 0.45, name: "like", vol: 0.3 })),
  { t: T_PORT, name: "pop", vol: 0.4 },
  { t: T_XARX, name: "pop", vol: 0.4 },
  { t: M4, name: "whoosh-down", vol: 0.4 },
  { t: T_IA - 0.05, name: "data", vol: 0.5 },
  { t: T_APL, name: "data", vol: 0.4 },
  { t: T_PERS - 0.05, name: "sparkle", vol: 0.5 },
  { t: T_OUT, name: "whoosh-long", vol: 0.5 },
];

/** Targeta "fotografia" d'un immoble (il·lustració sobre cel). */
const PhotoCard: React.FC<{ w: number; h: number; t: number; radius?: number }> = ({ w, h, t, radius = 20 }) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: radius,
      overflow: "hidden",
      position: "relative",
      background: "linear-gradient(180deg, #a9c9ec 0%, #e8f1fb 70%, #dfe9d6 70%, #cfe3c4 100%)",
    }}
  >
    <div style={{ position: "absolute", width: w * 0.16, height: w * 0.16, borderRadius: "50%", background: "#fff3c4", left: w * 0.72, top: h * 0.12, boxShadow: "0 0 60px #fff3c4" }} />
    <div style={{ position: "absolute", left: w * 0.5 - (w * 0.62) / 2, top: h * 0.68 - (w * 0.62 * 0.75) * 0.92, translate: `${Math.sin(t * 0.6) * 4}px 0` }}>
      <Property kind="house" width={w * 0.62} />
    </div>
  </div>
);

const Panel: React.FC<React.PropsWithChildren<{ x: number; y: number; w: number; h: number; a: number; out: number; title: string; Icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }> }>> = ({
  x,
  y,
  w,
  h,
  a,
  out,
  title,
  Icon,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: 28,
      background: "linear-gradient(160deg, rgba(255,255,255,.12), rgba(255,255,255,.04))",
      border: "1.5px solid rgba(255,255,255,.18)",
      boxShadow: "0 40px 80px rgba(0,0,0,.35)",
      transform: `perspective(1400px) rotateY(${(1 - a) * 70 - out * 40}deg) translateZ(${(1 - a) * -300}px)`,
      opacity: Math.min(1, a * 1.5) * (1 - out),
      overflow: "hidden",
      fontFamily: FONT,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "22px 26px 0" }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: C.orange, display: "grid", placeItems: "center" }}>
        <Icon size={30} color="#fff" strokeWidth={2.4} />
      </div>
      <div style={{ color: "#fff", fontWeight: 900, fontSize: 30, letterSpacing: "-0.01em" }}>{title}</div>
    </div>
    <div style={{ position: "absolute", left: 26, right: 26, top: 96, bottom: 26 }}>{children}</div>
  </div>
);

export const Marketing: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  const { W, H, v, cx } = useLayout();

  const zin = k(t, T0, T0 + 0.6, 0, 1, EO);
  const flash = t >= T0 ? Math.exp(-(t - T0) * 7) : 0;
  const exit = k(t, T_OUT, S.end + 0.4, 0, 1, EI);

  // ---------------- M1: la força del màrqueting
  const m1out = k(t, M2 - 0.1, M2 + 0.45, 0, 1, EI);
  const shine = k(t, T_BRILLI - 0.15, T_BRILLI + 0.7, 0, 1, EIO);
  const glow = k(t, T_BRILLI - 0.1, T_BRILLI + 0.3, 0, 1) * (1 - k(t, T_BRILLI + 0.4, M2, 0, 0.6));
  const cardW = v ? 820 : 760;
  const cardH = v ? 560 : 470;

  // ---------------- M2: panells
  const pw = v ? 900 : 570;
  const ph = v ? 340 : 540;
  const pos = (i: number) => (v ? { x: cx - pw / 2, y: 190 + i * (ph + 26) } : { x: (W - 3 * pw - 60) / 2 + i * (pw + 30), y: 215 });
  const m2out = k(t, M3 - 0.15, M3 + 0.4, 0, 1, EI);
  const a1 = k(t, M2 + (v ? 0.3 : 0.05), M2 + (v ? 0.85 : 0.6), 0, 1, EO);
  const a2 = k(t, T_HOME - 0.35, T_HOME + 0.25, 0, 1, EO);
  const a3 = k(t, T_PLA - 0.35, T_PLA + 0.25, 0, 1, EO);
  const shutter = t > T_FOTO ? Math.exp(-(t - T_FOTO) * 10) : 0;
  const rec = Math.max(0, t - T_VIDEO);
  const slider = k(t, T_HOME, T_HOME + 0.9, 1, 0, EIO);
  const arrow = k(t, T_PLA - 0.05, T_PLA + 0.3, 0, 1, EI);

  // ---------------- M3: portals i xarxes
  const m3in = k(t, M3, M3 + 0.7, 0, 1, EO);
  const m3out = k(t, M4 - 0.1, M4 + 0.5, 0, 1, EI);
  const phW = v ? 380 : 340;
  const phH = phW * 2;

  // ---------------- M4: intel·ligència artificial
  const m4in = k(t, M4, M4 + 0.7, 0, 1, EO);
  const ncx = cx;
  const ncy = v ? 870 : 600;
  const rx1 = v ? 300 : 360;
  const ry1 = v ? 300 : 210;
  const rx2 = v ? 460 : 720;
  const ry2 = v ? 470 : 330;
  const props = Array.from({ length: 8 }, (_, i) => {
    const an = (i / 8) * Math.PI * 2 + 0.2;
    return { x: ncx + Math.cos(an) * rx1, y: ncy + Math.sin(an) * ry1, an };
  });
  const people = Array.from({ length: 12 }, (_, i) => {
    const an = (i / 12) * Math.PI * 2 + t * 0.05;
    return { x: ncx + Math.cos(an) * rx2, y: ncy + Math.sin(an) * ry2, i };
  });
  const links = k(t, T_IA - 0.2, T_IA + 0.8, 0, 1, EIO);
  const reach = k(t, T_PERS - 0.3, T_PERS + 0.8, 0, 1, EIO);

  if (t < T0 - 0.02) return null;

  return (
    <Fill style={{ scale: String((1.25 - 0.25 * zin) * (1 + exit * 1.2)), filter: `blur(${(1 - zin) * 18 + exit * 10}px)`, opacity: 1 - exit }}>
      <DarkBg t={t} accent={1.2} />

      {/* ============ M1 */}
      {t < M2 + 0.5 && (
        <Fill style={{ opacity: 1 - m1out, scale: String(1 + m1out * 0.3) }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: v ? 215 : 70, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <Eyebrow text="Estratègia i màxima difusió" t={t} t0={T0 + 0.1} color="#cfe0f5" size={v ? 30 : 26} />
            <Kinetic text="La força del *màrqueting*" t={t} t0={T0 + 0.12} size={v ? 88 : 96} weight={900} hl={C.orangeLight} align="center" letterSpacing={-0.035} />
          </div>
          <div
            style={{
              position: "absolute",
              left: cx - cardW / 2,
              top: v ? 640 : 330,
              width: cardW,
              height: cardH,
              borderRadius: 30,
              boxShadow: `0 0 ${80 * glow}px ${30 * glow}px rgba(242,112,79,${0.55 * glow}), 0 40px 90px rgba(0,0,0,.45)`,
              scale: String(k(t, T0 + 0.15, T0 + 0.95, 0.7, 1, BACK) + glow * 0.04),
              opacity: k(t, T0 + 0.15, T0 + 0.5, 0, 1),
              rotate: `${Math.sin(t * 0.7) * 1.2}deg`,
              overflow: "hidden",
            }}
          >
            <PhotoCard w={cardW} h={cardH} t={t} radius={30} />
            {/* escombrat de llum */}
            <div
              style={{
                position: "absolute",
                top: -100,
                bottom: -100,
                width: 220,
                left: -300 + shine * (cardW + 600),
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,.85), transparent)",
                rotate: "18deg",
              }}
            />
          </div>
          {/* espurnes */}
          {Array.from({ length: 14 }, (_, i) => {
            const ang = i * 2.39;
            const r = 0.55 + ((i * 37) % 10) / 22;
            const x = cx + Math.cos(ang) * (cardW * 0.62) * r;
            const y = (v ? 640 : 330) + cardH / 2 + Math.sin(ang) * (cardH * 0.75) * r;
            const s = p(t, T_BRILLI - 0.1 + (i % 7) * 0.06, 0.7, (x) => x);
            const sc = Math.sin(s * Math.PI);
            return (
              <Sparkles key={i} size={36 + (i % 3) * 18} color={i % 3 ? "#fff" : C.orangeLight} strokeWidth={2} style={{ position: "absolute", left: x, top: y, scale: String(sc), rotate: `${s * 90}deg`, opacity: sc }} />
            );
          })}
        </Fill>
      )}

      {/* ============ M2 */}
      {t > M2 - 0.1 && t < M3 + 0.5 && (
        <Fill>
          <Panel {...pos(0)} w={pw} h={ph} a={a1} out={m2out} title="Fotografia i vídeo" Icon={Camera}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 16, overflow: "hidden" }}>
              <PhotoCard w={pw - 52} h={ph - 122} t={t} radius={16} />
              {/* visor */}
              {[
                [0, 0, 1, 1],
                [1, 0, -1, 1],
                [0, 1, 1, -1],
                [1, 1, -1, -1],
              ].map(([x, y, sx, sy], i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: x ? undefined : 16 + (1 - k(t, M2 + 0.3, M2 + 0.8, 0, 1, BACK)) * 30,
                    right: x ? 16 + (1 - k(t, M2 + 0.3, M2 + 0.8, 0, 1, BACK)) * 30 : undefined,
                    top: y ? undefined : 16,
                    bottom: y ? 16 : undefined,
                    width: 40,
                    height: 40,
                    borderLeft: sx > 0 ? "5px solid #fff" : undefined,
                    borderRight: sx < 0 ? "5px solid #fff" : undefined,
                    borderTop: sy > 0 ? "5px solid #fff" : undefined,
                    borderBottom: sy < 0 ? "5px solid #fff" : undefined,
                  }}
                />
              ))}
              <div style={{ position: "absolute", left: 24, top: 22, display: "flex", alignItems: "center", gap: 10, fontWeight: 900, fontSize: 22, color: "#fff", textShadow: "0 2px 6px rgba(0,0,0,.4)", opacity: rec > 0 ? 1 : 0 }}>
                <span style={{ width: 16, height: 16, borderRadius: "50%", background: "#ff3b30", opacity: Math.floor(t * 2) % 2 ? 1 : 0.3 }} />
                REC 00:00:{String(Math.floor(rec)).padStart(2, "0")}
              </div>
              <div style={{ position: "absolute", left: 24, right: 24, bottom: 22, height: 8, borderRadius: 4, background: "rgba(255,255,255,.35)" }}>
                <div style={{ width: `${Math.min(1, rec / 4.5) * 100}%`, height: "100%", borderRadius: 4, background: C.orange }} />
              </div>
              <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: shutter }} />
            </div>
          </Panel>
          <Panel {...pos(1)} w={pw} h={ph} a={a2} out={m2out} title="Home staging" Icon={Sofa}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 16, overflow: "hidden", display: "grid", placeItems: "center", background: "#f1f1ef" }}>
              <div style={{ position: "absolute", inset: 0 }}>
                <Room furnish={1} width={Math.max(pw - 52, ((ph - 122) * 400) / 260)} />
              </div>
              <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${(1 - slider) * 100}%)` }}>
                <Room furnish={0} width={Math.max(pw - 52, ((ph - 122) * 400) / 260)} />
              </div>
              <div style={{ position: "absolute", top: 0, bottom: 0, left: `${(1 - slider) * 100}%`, width: 5, background: "#fff", boxShadow: "0 0 12px rgba(0,0,0,.3)" }}>
                <div style={{ position: "absolute", top: "50%", left: -22, width: 48, height: 48, borderRadius: "50%", background: C.orange, border: "4px solid #fff", translate: "0 -50%" }} />
              </div>
              <div style={{ position: "absolute", left: 16, bottom: 14, padding: "6px 14px", borderRadius: 999, background: "rgba(27,38,56,.8)", color: "#fff", fontWeight: 800, fontSize: 20 }}>Abans</div>
              <div style={{ position: "absolute", right: 16, bottom: 14, padding: "6px 14px", borderRadius: 999, background: C.orange, color: "#fff", fontWeight: 800, fontSize: 20, opacity: 1 - slider }}>Després</div>
            </div>
          </Panel>
          <Panel {...pos(2)} w={pw} h={ph} a={a3} out={m2out} title="Pla de màrqueting" Icon={Target}>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "space-around" }}>
              <svg viewBox="0 0 240 240" width={v ? 220 : 230} height={v ? 220 : 230} style={{ overflow: "visible" }}>
                {[110, 80, 50, 22].map((r, i) => (
                  <circle key={r} cx={120} cy={120} r={r * k(t, T_PLA - 0.3 + i * 0.05, T_PLA + 0.2 + i * 0.05, 0, 1, BACK)} fill={i % 2 ? "#fff" : C.orange} opacity={i % 2 ? 0.95 : 1} />
                ))}
                <g style={{ translate: `${(1 - arrow) * 260}px ${(1 - arrow) * -200}px` }}>
                  <line x1={120} y1={120} x2={200} y2={58} stroke="#fff" strokeWidth={8} strokeLinecap="round" />
                  <path d="M200 58 l26 -6 l-8 24 z" fill="#fff" />
                </g>
              </svg>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {["Perfil", "Zona", "Públic"].map((tg, i) => (
                  <div
                    key={tg}
                    style={{
                      padding: "10px 20px",
                      borderRadius: 999,
                      background: "rgba(255,255,255,.14)",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: 26,
                      opacity: k(t, T_PLA + 0.4 + i * 0.2, T_PLA + 0.7 + i * 0.2, 0, 1),
                      translate: `${(1 - k(t, T_PLA + 0.4 + i * 0.2, T_PLA + 0.8 + i * 0.2, 0, 1, EO)) * 30}px 0`,
                    }}
                  >
                    ✓ {tg}
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </Fill>
      )}

      {/* ============ M3 */}
      {t > M3 - 0.1 && t < M4 + 0.6 && (
        <Fill style={{ opacity: m3in * (1 - m3out), scale: String(1 - m3out * 0.25) }}>
          {/* navegador: portal immobiliari */}
          <div
            style={{
              position: "absolute",
              left: v ? 70 : 120,
              top: v ? 170 : 220,
              width: v ? 640 : 640,
              height: v ? 400 : 430,
              borderRadius: 22,
              background: "#fff",
              boxShadow: "0 40px 90px rgba(0,0,0,.4)",
              overflow: "hidden",
              transform: `perspective(1400px) rotateY(${18 + (1 - m3in) * 30}deg)`,
              translate: `${(1 - m3in) * -200}px 0`,
              opacity: v ? 0.85 : 1,
            }}
          >
            <div style={{ height: 46, background: C.tint2, display: "flex", alignItems: "center", gap: 8, padding: "0 18px" }}>
              {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                <span key={c} style={{ width: 13, height: 13, borderRadius: "50%", background: c }} />
              ))}
              <div style={{ marginLeft: 16, flex: 1, height: 24, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", gap: 8, padding: "0 12px", fontFamily: FONT, fontSize: 15, color: C.muted, fontWeight: 700 }}>
                <Globe size={15} /> Portals immobiliaris
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: 18, translate: `0 ${-((t - M3) * 26) % 160}px` }}>
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} style={{ borderRadius: 14, overflow: "hidden", background: C.tint, height: 150, position: "relative" }}>
                  <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                    <Property kind={(["house", "flat", "shop", "house"] as const)[i % 4]} width={150} />
                  </div>
                  {i % 3 === 0 && (
                    <div style={{ position: "absolute", left: 8, top: 8, padding: "3px 10px", borderRadius: 999, background: C.orange, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 13 }}>Inllobsa</div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* mòbil: xarxes socials */}
          <div
            style={{
              position: "absolute",
              left: v ? cx - phW / 2 + 140 : cx - phW / 2 + 60,
              top: v ? 420 : 150,
              width: phW,
              borderRadius: 54,
              background: "#0e1522",
              padding: 14,
              boxSizing: "border-box",
              boxShadow: "0 50px 100px rgba(0,0,0,.55)",
              translate: `0 ${(1 - m3in) * 300}px`,
              rotate: `${-4 + (1 - m3in) * 10}deg`,
              height: v ? phH * 0.82 : phH * 0.98,
            }}
          >
            <div style={{ width: "100%", height: "100%", borderRadius: 42, background: "#fff", overflow: "hidden", fontFamily: FONT, position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "40px 18px 14px" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#fff", border: `3px solid ${C.orange}`, display: "grid", placeItems: "center" }}>
                  <Logo width={40} />
                </div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: 20, color: C.ink }}>inllobsa</div>
                  <div style={{ fontWeight: 600, fontSize: 15, color: C.muted }}>Manresa</div>
                </div>
              </div>
              <PhotoCard w={phW - 28} h={(phW - 28) * 1.0} t={t} radius={0} />
              <div style={{ display: "flex", gap: 20, padding: "14px 18px" }}>
                <Heart size={34} color={C.orange} fill={t > T_PORT + 0.2 ? C.orange : "none"} strokeWidth={2.2} style={{ scale: String(1 + Math.max(0, Math.sin((t - T_PORT - 0.2) * 7)) * 0.15 * (t > T_PORT ? 1 : 0)) }} />
                <MessageCircle size={34} color={C.ink} strokeWidth={2.2} />
                <Share2 size={34} color={C.ink} strokeWidth={2.2} />
              </div>
              <div style={{ padding: "0 18px" }}>
                {[0.9, 0.65].map((w, i) => (
                  <div key={i} style={{ height: 12, width: `${w * 100}%`, borderRadius: 6, background: C.line, marginBottom: 10 }} />
                ))}
              </div>
            </div>
            {/* cors que pugen */}
            {Array.from({ length: 9 }, (_, i) => {
              const st = T_PORT + 0.2 + i * 0.28;
              const q = p(t, st, 1.6, (x) => x);
              if (q <= 0 || q >= 1) return null;
              return (
                <Heart
                  key={i}
                  size={30 + (i % 3) * 12}
                  color={i % 2 ? C.orangeLight : "#fff"}
                  fill={i % 2 ? C.orangeLight : "#fff"}
                  style={{ position: "absolute", right: -30 - (i % 3) * 26 + Math.sin(q * 6 + i) * 16, top: phH * 0.6 - q * phH * 0.7, opacity: Math.sin(q * Math.PI), scale: String(0.6 + q * 0.6) }}
                />
              );
            })}
          </div>
          {/* xips */}
          <div style={{ position: "absolute", right: v ? undefined : 110, left: v ? 70 : undefined, top: v ? 1040 : 330, display: "flex", flexDirection: "column", gap: 20, alignItems: v ? "flex-start" : "flex-end" }}>
            {[
              { Icon: Globe, txt: "Portals immobiliaris", t0: T_PORT },
              { Icon: Share2, txt: "Xarxes socials", t0: T_XARX },
              { Icon: Megaphone, txt: "Campanyes segmentades", t0: T_XARX + 0.45 },
            ].map(({ Icon, txt, t0 }) => (
              <div
                key={txt}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 26px 14px 16px",
                  borderRadius: 999,
                  background: t0 === T_PORT ? C.orange : "rgba(255,255,255,.14)",
                  border: "1.5px solid rgba(255,255,255,.2)",
                  color: "#fff",
                  fontFamily: FONT,
                  fontWeight: 900,
                  fontSize: v ? 34 : 32,
                  opacity: k(t, t0 - 0.1, t0 + 0.25, 0, 1),
                  scale: String(k(t, t0 - 0.1, t0 + 0.4, 0.6, 1, BACK)),
                }}
              >
                <span style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(255,255,255,.2)", display: "grid", placeItems: "center" }}>
                  <Icon size={28} color="#fff" strokeWidth={2.4} />
                </span>
                {txt}
              </div>
            ))}
          </div>
        </Fill>
      )}

      {/* ============ M4 */}
      {t > M4 - 0.1 && (
        <Fill style={{ opacity: m4in }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: v ? 150 : 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <Eyebrow text="Innovació" t={t} t0={M4 + 0.1} color="#cfe0f5" size={v ? 30 : 24} />
            <Kinetic text={"Experts en\n*intel·ligència artificial*"} t={t} t0={wt("L15", "experts") - 0.1} size={v ? 74 : 70} weight={900} hl={C.orangeLight} align="center" letterSpacing={-0.03} />
          </div>
          <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <defs>
              <radialGradient id="core">
                <stop offset="0%" stopColor={C.orangeLight} stopOpacity={0.9} />
                <stop offset="100%" stopColor={C.orange} stopOpacity={0} />
              </radialGradient>
            </defs>
            <ellipse cx={ncx} cy={ncy} rx={rx2} ry={ry2} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth={2} strokeDasharray="4 10" opacity={m4in} />
            <ellipse cx={ncx} cy={ncy} rx={rx1} ry={ry1} fill="none" stroke="rgba(255,255,255,.14)" strokeWidth={2} opacity={m4in} />
            {/* connexions IA → immobles */}
            {props.map((pt, i) => (
              <g key={i}>
                <line x1={ncx} y1={ncy} x2={ncx + (pt.x - ncx) * links} y2={ncy + (pt.y - ncy) * links} stroke={C.orangeLight} strokeWidth={3} opacity={0.7} />
                {links >= 1 && (
                  <circle
                    cx={ncx + (pt.x - ncx) * (((t - T_IA) * 0.9 + i * 0.13) % 1)}
                    cy={ncy + (pt.y - ncy) * (((t - T_IA) * 0.9 + i * 0.13) % 1)}
                    r={6}
                    fill="#fff"
                  />
                )}
              </g>
            ))}
            {/* immobles → persones adequades */}
            {people
              .filter((_, j) => j % 2 === 0)
              .map((pp, j) => {
                const src = props[(j * 3) % 8];
                const r = Math.max(0, Math.min(1, reach * 1.6 - j * 0.12));
                return <line key={j} x1={src.x} y1={src.y} x2={src.x + (pp.x - src.x) * r} y2={src.y + (pp.y - src.y) * r} stroke="#fff" strokeWidth={2.5} opacity={0.75} />;
              })}
            <circle cx={ncx} cy={ncy} r={210 + Math.sin(t * 3) * 10} fill="url(#core)" opacity={0.55 * k(t, T_IA - 0.3, T_IA + 0.3, 0.3, 1)} />
          </svg>
          {/* nucli IA */}
          <div
            style={{
              position: "absolute",
              left: ncx - 105,
              top: ncy - 105,
              width: 210,
              height: 210,
              borderRadius: "50%",
              background: `linear-gradient(140deg, ${C.orangeLight}, ${C.orange})`,
              boxShadow: `0 0 0 ${10 + Math.sin(t * 4) * 4}px rgba(242,112,79,.25), 0 30px 80px rgba(0,0,0,.4)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              scale: String(k(t, M4 + 0.2, M4 + 0.8, 0, 1, BACK)),
              fontFamily: FONT,
              color: "#fff",
            }}
          >
            <BrainCircuit size={74} color="#fff" strokeWidth={1.8} />
            <div style={{ fontWeight: 900, fontSize: 46, lineHeight: 1, marginTop: 4 }}>IA</div>
          </div>
          {props.map((pt, i) => {
            const a = k(t, T_IA - 0.1 + i * 0.06, T_IA + 0.3 + i * 0.06, 0, 1, BACK);
            return (
              <div key={i} style={{ position: "absolute", left: pt.x - 40, top: pt.y - 40, width: 80, height: 80, borderRadius: 22, background: "#fff", display: "grid", placeItems: "center", scale: String(a), boxShadow: "0 16px 40px rgba(0,0,0,.35)" }}>
                <House size={42} color={C.blue} strokeWidth={2.2} />
              </div>
            );
          })}
          {people.map((pp) => {
            const lit = k(t, T_PERS - 0.2 + pp.i * 0.06, T_PERS + 0.2 + pp.i * 0.06, 0, 1, BACK);
            const target = pp.i % 2 === 0;
            const a = k(t, T_APL - 0.1 + pp.i * 0.04, T_APL + 0.3 + pp.i * 0.04, 0, 1, EO);
            return (
              <div
                key={pp.i}
                style={{
                  position: "absolute",
                  left: pp.x - 32,
                  top: pp.y - 32,
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: target && lit > 0.5 ? C.orange : "rgba(255,255,255,.14)",
                  border: `2px solid ${target && lit > 0.5 ? "#fff" : "rgba(255,255,255,.3)"}`,
                  display: "grid",
                  placeItems: "center",
                  opacity: a,
                  scale: String(0.7 + 0.3 * a + (target ? Math.sin(lit * Math.PI) * 0.35 : 0)),
                }}
              >
                <User size={34} color="#fff" strokeWidth={2.2} />
              </div>
            );
          })}
        </Fill>
      )}

      <Vignette strength={0.5} />
      {flash > 0.01 && <Fill style={{ background: "#fff", opacity: flash * 0.9 }} />}
    </Fill>
  );
};
