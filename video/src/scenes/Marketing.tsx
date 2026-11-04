import React from "react";
import { Img, staticFile } from "remotion";
import { Bath, BedDouble, BrainCircuit, Camera, Globe, Heart, Maximize, MessageCircle, Send, Sparkles, Sofa, Video, Waves } from "lucide-react";
import { C, FONT } from "../lib/brand";
import { Fill, useLayout, useT } from "../lib/layout";
import { BACK, BEAT, EI, EIO, EO, k, p, pulse, scene } from "../lib/time";
import { DarkBg, Vignette } from "../components/Bg";
import { Logo } from "../components/Logo";
import { PersonPill } from "../components/Kit";
import { SERVICE_PEOPLE } from "../data/story";
import type { Cue } from "../components/Sfx";

const S = scene("marketing");
const b = (n: number) => S.start + n * BEAT;
const SHOTS = ["interior-1", "piscina-1", "bany-2", "terrassa-piscina"];
const CAROUSEL = ["piscina-2", "interior-2", "terrassa-1", "bany-1", "facana-2"];
const M1 = 3, M1V = 5.6, M2 = 8, M3 = 12, M4 = 18, M5 = 24, M5B = 28, M5C = 32;
// descripció real de la fitxa (primer paràgraf)
const DESC = "Exclusiu pis d'obra nova en el centre de Manresa, lluminós i funcional, amb terrassa privada i piscina comunitària.";
const DETECT = [
  { label: "Terrassa privada · 6 m²", x: 0.06, y: 0.5, w: 0.5, h: 0.42, at: 24.6 },
  { label: "Piscina comunitària", x: 0.5, y: 0.3, w: 0.46, h: 0.3, at: 25.4 },
  { label: "Llum natural", x: 0.08, y: 0.06, w: 0.4, h: 0.34, at: 26.2 },
];
const AUDIENCE = ["Primera llar", "Parelles joves", "Inversió", "Centre de Manresa", "Obra nova"];

export const marketingSfx: Cue[] = [
  { t: S.start - 0.3, name: "whoosh-long", vol: 0.45 },
  { t: b(1), name: "pop", vol: 0.35 },
  ...SHOTS.map((_, i) => ({ t: b(M1 + i * 0.6), name: "shutter", vol: 0.5 })),
  { t: b(M1V), name: "whoosh", vol: 0.3 },
  { t: b(M2) - 0.2, name: "whoosh", vol: 0.4 },
  ...[0, 1, 2, 3].map((i) => ({ t: b(M2 + 0.5 + i * 0.75), name: "pop", vol: 0.3 })),
  { t: b(M3) - 0.2, name: "whoosh-long", vol: 0.4 },
  ...CAROUSEL.slice(1).map((_, i) => ({ t: b(M3 + 1 + i), name: "swipe", vol: 0.25 })),
  ...[0, 1, 2, 3, 4, 5].map((i) => ({ t: b(M3 + 1.3 + i * 0.75), name: "like", vol: 0.22 })),
  { t: b(M4) - 0.2, name: "whoosh", vol: 0.4 },
  { t: b(M5) - 0.2, name: "whoosh-down", vol: 0.35 },
  { t: b(M5) + 0.1, name: "data", vol: 0.4 },
  ...DETECT.map((d) => ({ t: b(d.at), name: "tick", vol: 0.4 })),
  { t: b(M5B), name: "typing", vol: 0.4 },
  { t: b(M5B) + 1.4, name: "typing", vol: 0.35 },
  { t: b(M5C), name: "sparkle", vol: 0.5 },
  ...AUDIENCE.map((_, i) => ({ t: b(M5C + 1 + i * 0.5), name: "pop", vol: 0.28 })),
  { t: S.end - 0.4, name: "whoosh-long", vol: 0.45 },
];

const seg = (t: number, a: number, z: number) => ({
  inA: k(t, b(a) - 0.12, b(a) + 0.3, 0, 1, EO),
  outA: k(t, b(z) - 0.38, b(z) - 0.1, 0, 1, EI),
  on: t > b(a) - 0.15 && t < b(z),
});

const Tag: React.FC<{ txt: string; a: number; accent?: boolean; size?: number }> = ({ txt, a, accent, size = 28 }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      padding: `${size * 0.4}px ${size * 0.8}px`,
      borderRadius: 999,
      background: accent ? C.orange : "rgba(255,255,255,.95)",
      color: accent ? "#fff" : C.navy,
      fontFamily: FONT,
      fontWeight: 900,
      fontSize: size,
      boxShadow: "0 14px 34px rgba(0,0,0,.3)",
      scale: String(0.5 + 0.5 * a),
      opacity: Math.min(1, a * 1.6),
      whiteSpace: "nowrap",
    }}
  >
    {txt}
  </div>
);

export const Marketing: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  const { W, H, v, cx, cy } = useLayout();
  const zin = k(t, S.start - 0.3, S.start + 0.4, 0, 1, EO);
  const flash = t >= S.start ? Math.exp(-(t - S.start) * 7) : 0;
  const exit = k(t, S.end - 0.4, S.end + 0.4, 0, 1, EI);
  const bp = pulse(t, 8);

  // ---- M0 títol
  const m0 = seg(t, 0, M1);
  // ---- M1 foto/vídeo
  const m1 = seg(t, M1, M2);
  const shot = Math.max(0, Math.min(SHOTS.length - 1, Math.floor((t - b(M1)) / (0.6 * BEAT))));
  const shutter = Math.exp(-Math.max(0, (t - b(M1)) % (0.6 * BEAT)) * 14) * (t > b(M1) && t < b(M1V) ? 1 : 0);
  const vid = k(t, b(M1V) - 0.2, b(M1V) + 0.4, 0, 1, EIO);
  // ---- M2 home staging
  const m2 = seg(t, M2, M3);
  // ---- M3 Instagram
  const m3 = seg(t, M3, M4);
  const slide = Math.max(0, Math.min(CAROUSEL.length - 1, (t - b(M3 + 1)) / BEAT));
  const slideI = Math.floor(slide);
  const slideF = k(slide - slideI, 0, 0.35, 0, 1, EIO);
  // ---- M4 web / portals
  const m4 = seg(t, M4, M5);
  const scroll = k(t, b(M4 + 2), b(M5) - 0.2, 0, 1, EIO);
  // ---- M5 IA
  const m5 = seg(t, M5, 36.5);
  const scan = k(t, b(M5), b(M5 + 1.5), 0, 1, EIO);
  const typed = Math.round(k(t, b(M5B), b(M5B + 3.2), 0, DESC.length, (x) => x));
  const toCore = k(t, b(M5C) - 0.3, b(M5C) + 0.3, 0, 1, EIO);

  const phoneW = v ? 470 : 370;
  const phoneH = phoneW * 2.02;

  return (
    <Fill style={{ scale: String((1.2 - 0.2 * zin) * (1 + exit * 0.9)), filter: `blur(${(1 - zin) * 16 + exit * 10}px)`, opacity: 1 - exit }}>
      <DarkBg t={t} accent={1.1 + bp * 0.3} />

      {/* ============ M0: la força del màrqueting + Maria Vega */}
      {m0.on && (
        <Fill style={{ opacity: m0.inA * (1 - m0.outA), scale: String(1 + m0.outA * 0.25) }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: v ? 520 : 290, textAlign: "center", fontFamily: FONT, color: "#fff" }}>
            <div style={{ fontWeight: 800, fontSize: v ? 30 : 28, letterSpacing: ".18em", color: "#cfe0f5", textTransform: "uppercase" }}>Estratègia i màxima difusió</div>
            <div style={{ fontWeight: 900, fontSize: v ? 120 : 140, letterSpacing: "-0.045em", lineHeight: 1, marginTop: 12 }}>
              La força del
              <br />
              <span style={{ color: C.orangeLight }}>màrqueting</span>
            </div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: v ? 1000 : 700, display: "flex", justifyContent: "center" }}>
            <PersonPill photo={SERVICE_PEOPLE.marketing[0]} t={t} t0={b(1)} dark size={v ? 1.3 : 1.05} />
          </div>
        </Fill>
      )}

      {/* ============ M1: fotografia i vídeo */}
      {m1.on && (
        <Fill style={{ opacity: m1.inA * (1 - m1.outA), translate: `${-m1.outA * 200}px 0` }}>
          {/* visor de càmera */}
          <div
            style={{
              position: "absolute",
              left: v ? 60 : 160 + vid * -40,
              top: v ? 230 : 130,
              width: v ? W - 120 : 1100 - vid * 260,
              height: v ? 740 : 700 - vid * 160,
              borderRadius: 26,
              overflow: "hidden",
              boxShadow: "0 40px 90px rgba(0,0,0,.5)",
              border: "2px solid rgba(255,255,255,.2)",
            }}
          >
            {vid < 1 ? (
              <Img src={staticFile(`listing/${SHOTS[shot]}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(1.08 - ((t - b(M1)) % (0.6 * BEAT)) * 0.08) }} />
            ) : null}
            {vid > 0 && (
              <Img src={staticFile("listing/principal-1920.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: vid, scale: String(1.25 - (t - b(M1V)) * 0.05), translate: `${(t - b(M1V)) * -1.2}% 0` }} />
            )}
            {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([x, y], i) => (
              <div key={i} style={{ position: "absolute", [x ? "right" : "left"]: 26, [y ? "bottom" : "top"]: 26, width: 54, height: 54, borderLeft: x ? undefined : "6px solid #fff", borderRight: x ? "6px solid #fff" : undefined, borderTop: y ? undefined : "6px solid #fff", borderBottom: y ? "6px solid #fff" : undefined }} />
            ))}
            <div style={{ position: "absolute", left: "50%", top: "50%", width: 90, height: 90, translate: "-50% -50%", border: "3px solid rgba(255,255,255,.85)", borderRadius: 8, scale: String(1.3 - 0.3 * k((t - b(M1)) % (0.6 * BEAT), 0, 0.2, 0, 1)) }} />
            <div style={{ position: "absolute", left: 40, top: 36, display: "flex", alignItems: "center", gap: 12, fontFamily: FONT, fontWeight: 900, fontSize: 26, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,.5)" }}>
              {vid > 0.5 ? (
                <>
                  <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#ff3b30", opacity: Math.floor(t * 2) % 2 ? 1 : 0.35 }} /> REC 00:00:0{Math.floor(Math.max(0, t - b(M1V)))} · 4K
                </>
              ) : (
                <>
                  <Camera size={30} color="#fff" /> FOTO {shot + 1}/{SHOTS.length}
                </>
              )}
            </div>
            <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: shutter * 0.85 }} />
          </div>
          {/* editor de vídeo: tira de fotogrames */}
          {vid > 0 && (
            <div style={{ position: "absolute", left: v ? 60 : 120, right: v ? 60 : 120, top: v ? 1000 : 720, height: v ? 200 : 170, borderRadius: 22, background: "rgba(255,255,255,.08)", border: "1.5px solid rgba(255,255,255,.18)", overflow: "hidden", opacity: vid, translate: `0 ${(1 - vid) * 60}px` }}>
              <div style={{ position: "absolute", left: 18, top: 14, display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 900, fontSize: 22, color: "#fff" }}>
                <Video size={26} color={C.orangeLight} /> Vídeo de la propietat
              </div>
              <div style={{ position: "absolute", left: 0, top: 56, display: "flex", gap: 8, translate: `${-(t - b(M1V)) * 140}px 0` }}>
                {[...CAROUSEL, ...SHOTS, ...CAROUSEL].map((c, i) => (
                  <Img key={i} src={staticFile(`listing/${c}.jpg`)} style={{ width: 150, height: 100, objectFit: "cover", borderRadius: 8 }} />
                ))}
              </div>
              <div style={{ position: "absolute", left: "38%", top: 44, bottom: 0, width: 4, background: C.orange }} />
            </div>
          )}
          {!v && (
            <div style={{ position: "absolute", right: 120, top: 210, display: "flex", flexDirection: "column", gap: 18, alignItems: "flex-end" }}>
              <Tag txt="Reportatge fotogràfic" a={k(t, b(M1) + 0.2, b(M1) + 0.6, 0, 1, BACK)} accent />
              <Tag txt="Alta resolució" a={k(t, b(M1 + 1.5), b(M1 + 1.5) + 0.4, 0, 1, BACK)} />
              <Tag txt="Vídeo dinàmic" a={k(t, b(M1V), b(M1V) + 0.4, 0, 1, BACK)} />
            </div>
          )}
        </Fill>
      )}

      {/* ============ M2: home staging (foto real de l'interior decorat) */}
      {m2.on && (
        <Fill style={{ opacity: m2.inA * (1 - m2.outA) }}>
          <div style={{ position: "absolute", left: v ? 50 : 140, top: v ? 300 : 120, width: v ? W - 100 : 1000, height: v ? 760 : 720, borderRadius: 30, overflow: "hidden", boxShadow: "0 40px 90px rgba(0,0,0,.5)", scale: String(0.9 + 0.1 * m2.inA), rotate: `${(1 - m2.inA) * 4}deg` }}>
            <Img src={staticFile("listing/interior-1.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(1.18 - (t - b(M2)) * 0.03) }} />
            <div style={{ position: "absolute", top: -100, bottom: -100, width: 240, left: -300 + k(t, b(M2 + 0.3), b(M2 + 2), 0, 1, EIO) * 1600, background: "linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent)", rotate: "16deg" }} />
            <div style={{ position: "absolute", left: 28, top: 28, display: "flex", alignItems: "center", gap: 12, padding: "12px 22px", borderRadius: 999, background: C.orange, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 30 }}>
              <Sofa size={32} /> Home staging
            </div>
          </div>
          <div style={{ position: "absolute", left: v ? 70 : 1190, top: v ? 1100 : 230, display: "flex", flexDirection: v ? "row" : "column", flexWrap: "wrap", gap: 18, width: v ? W - 140 : 620 }}>
            {["Despersonalització", "Decoració", "Presentació dels espais", "Revaloració immediata"].map((tg, i) => (
              <Tag key={tg} txt={tg} accent={i === 3} a={k(t, b(M2 + 0.5 + i * 0.75), b(M2 + 0.5 + i * 0.75) + 0.4, 0, 1, BACK)} size={v ? 30 : 32} />
            ))}
          </div>
        </Fill>
      )}

      {/* ============ M3: Instagram */}
      {m3.on && (
        <Fill style={{ opacity: m3.inA * (1 - m3.outA) }}>
          <div style={{ position: "absolute", left: v ? cx - phoneW / 2 : 260, top: v ? 150 : (H - phoneH) / 2 - 30, width: phoneW, height: phoneH, borderRadius: 60, background: "#0b111c", padding: 14, boxSizing: "border-box", boxShadow: "0 50px 110px rgba(0,0,0,.6)", translate: `0 ${(1 - m3.inA) * 260}px`, rotate: `${-3 + (1 - m3.inA) * 8}deg` }}>
            <div style={{ width: "100%", height: "100%", borderRadius: 48, background: "#fff", overflow: "hidden", fontFamily: "Mulish, system-ui", position: "relative" }}>
              <div style={{ height: 46 }} />
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 16px" }}>
                <div style={{ width: 54, height: 54, borderRadius: "50%", padding: 3, background: `conic-gradient(${C.orange}, #f9b234, ${C.orange})` }}>
                  <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center" }}>
                    <Logo width={40} />
                  </div>
                </div>
                <div style={{ lineHeight: 1.2 }}>
                  <div style={{ fontWeight: 800, fontSize: 19, color: "#111" }}>Inllobsa Immobiliària</div>
                  <div style={{ fontWeight: 600, fontSize: 15, color: "#666" }}>Manresa, Barcelona</div>
                </div>
              </div>
              <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 5", overflow: "hidden" }}>
                {CAROUSEL.map((c, i) => {
                  const off = (i - slideI - slideF) * 100;
                  return <Img key={c} src={staticFile(`listing/${c}.jpg`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", translate: `${off}% 0` }} />;
                })}
                <div style={{ position: "absolute", right: 12, top: 12, padding: "4px 10px", borderRadius: 999, background: "rgba(0,0,0,.6)", color: "#fff", fontWeight: 800, fontSize: 14 }}>
                  {Math.min(CAROUSEL.length, slideI + 1 + (slideF > 0.5 ? 1 : 0))}/{CAROUSEL.length}
                </div>
                {/* cor gran al doble toc */}
                {(() => {
                  const q = p(t, b(M3 + 2.6), 0.8);
                  return q > 0 && q < 1 ? <Heart size={170} color="#fff" fill="#fff" style={{ position: "absolute", left: "50%", top: "50%", translate: "-50% -50%", scale: String(Math.sin(q * Math.PI) * 1.1), opacity: Math.sin(q * Math.PI), filter: "drop-shadow(0 8px 20px rgba(0,0,0,.35))" }} /> : null;
                })()}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "12px 16px 6px" }}>
                <Heart size={30} color={t > b(M3 + 2.6) ? "#ed4956" : "#111"} fill={t > b(M3 + 2.6) ? "#ed4956" : "none"} strokeWidth={2.2} />
                <MessageCircle size={30} color="#111" strokeWidth={2.2} />
                <Send size={30} color="#111" strokeWidth={2.2} />
                <div style={{ flex: 1, display: "flex", justifyContent: "center", gap: 5 }}>
                  {CAROUSEL.map((_, i) => (
                    <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: i === Math.round(slide) ? C.blue : "#ccc" }} />
                  ))}
                </div>
              </div>
              <div style={{ padding: "4px 16px", fontSize: 16, lineHeight: 1.35, color: "#111" }}>
                <b>inllobsaimmobiliaria</b> ✨ Pis d'alt standing d'obra nova al centre de Manresa. Terrassa privada i piscina comunitària 🏡
              </div>
            </div>
            {/* cors flotants */}
            {Array.from({ length: 10 }, (_, i) => {
              const q = p(t, b(M3 + 1.3) + i * 0.32, 1.6, (x) => x);
              if (q <= 0 || q >= 1) return null;
              return <Heart key={i} size={34 + (i % 3) * 12} color={i % 2 ? C.orangeLight : "#ed4956"} fill={i % 2 ? C.orangeLight : "#ed4956"} style={{ position: "absolute", right: -40 - (i % 3) * 30 + Math.sin(q * 6 + i) * 18, top: phoneH * 0.75 - q * phoneH * 0.75, opacity: Math.sin(q * Math.PI), scale: String(0.6 + q * 0.6) }} />;
            })}
          </div>
          <div style={{ position: "absolute", left: v ? 70 : 840, top: v ? 1180 : 300, fontFamily: FONT, color: "#fff", width: v ? W - 140 : 900 }}>
            <div style={{ fontWeight: 800, fontSize: 28, letterSpacing: ".18em", color: "#cfe0f5", textTransform: "uppercase", display: v ? "none" : "block" }}>Xarxes socials</div>
            <div style={{ fontWeight: 900, fontSize: v ? 0 : 96, letterSpacing: "-0.04em", lineHeight: 1, marginTop: 10, display: v ? "none" : "block" }}>
              Cada immoble,
              <br />
              <span style={{ color: C.orangeLight }}>una història</span>
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: v ? 0 : 40, flexWrap: "wrap" }}>
              {["Instagram", "Facebook", "Campanyes segmentades"].map((tg, i) => (
                <Tag key={tg} txt={tg} accent={i === 2} a={k(t, b(M3 + 1 + i * 0.75), b(M3 + 1 + i * 0.75) + 0.4, 0, 1, BACK)} size={v ? 30 : 30} />
              ))}
            </div>
          </div>
        </Fill>
      )}

      {/* ============ M4: fitxa a inllobsa.com */}
      {m4.on && (
        <Fill style={{ opacity: m4.inA * (1 - m4.outA) }}>
          <div
            style={{
              position: "absolute",
              left: v ? 40 : 150,
              top: v ? 220 : 100,
              width: v ? W - 80 : 1240,
              height: v ? 1080 : 800,
              borderRadius: 24,
              background: "#fff",
              overflow: "hidden",
              boxShadow: "0 50px 110px rgba(0,0,0,.55)",
              transform: `perspective(1800px) rotateY(${v ? 0 : 10 + (1 - m4.inA) * 25}deg) rotateX(${(1 - m4.inA) * 10}deg)`,
              translate: `${(1 - m4.inA) * -200}px 0`,
              fontFamily: FONT,
            }}
          >
            <div style={{ height: 48, background: C.tint2, display: "flex", alignItems: "center", gap: 8, padding: "0 18px" }}>
              {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                <span key={c} style={{ width: 13, height: 13, borderRadius: "50%", background: c }} />
              ))}
              <div style={{ marginLeft: 16, flex: 1, height: 28, borderRadius: 14, background: "#fff", display: "flex", alignItems: "center", gap: 8, padding: "0 14px", fontSize: 17, color: C.muted, fontWeight: 700 }}>
                <Globe size={16} /> www.inllobsa.com
              </div>
            </div>
            <div style={{ translate: `0 ${-scroll * (v ? 380 : 300)}px` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 30px", borderBottom: `1px solid ${C.line}` }}>
                <Logo width={150} />
                <div style={{ display: "flex", gap: 24, fontWeight: 800, fontSize: 18, color: C.navy }}>
                  {(v ? ["Venda", "Lloguer"] : ["Venda", "Lloguer", "Promocions", "Serveis", "Contacte"]).map((n) => (
                    <span key={n}>{n}</span>
                  ))}
                </div>
              </div>
              <div style={{ padding: "22px 30px 0" }}>
                <div style={{ fontWeight: 900, fontSize: v ? 30 : 30, color: C.navy, lineHeight: 1.15 }}>PIS D'ALT STANDING D'OBRA NOVA EN VENDA A MANRESA</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 8 }}>
                  <div style={{ fontWeight: 900, fontSize: 44, color: C.orange }}>238.500 €</div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: C.muted }}>Ref. 5028 · Centre - Passeig i Rodalies</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: v ? "1fr" : "2fr 1fr", gap: 10, padding: "16px 30px" }}>
                <div style={{ height: v ? 440 : 420, borderRadius: 14, overflow: "hidden" }}>
                  <Img src={staticFile("listing/principal-1920.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                {!v && (
                  <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 10 }}>
                    {["piscina-1", "interior-3"].map((c) => (
                      <div key={c} style={{ borderRadius: 14, overflow: "hidden" }}>
                        <Img src={staticFile(`listing/${c}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, padding: "4px 30px" }}>
                {[
                  { I: BedDouble, t: "2 habitacions" },
                  { I: Bath, t: "1 bany" },
                  { I: Maximize, t: "53,83 m² útils" },
                  { I: Sparkles, t: "Terrassa 6 m²" },
                  { I: Waves, t: "Piscina comunitària" },
                ].map(({ I, t: tx }, i) => (
                  <div key={tx} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 12, background: C.tint, color: C.navy, fontWeight: 800, fontSize: 21, scale: String(k(t, b(M4 + 1 + i * 0.4), b(M4 + 1 + i * 0.4) + 0.35, 0.6, 1, BACK)), opacity: k(t, b(M4 + 1 + i * 0.4), b(M4 + 1 + i * 0.4) + 0.25, 0, 1) }}>
                    <I size={24} color={C.blue} /> {tx}
                  </div>
                ))}
              </div>
              <div style={{ padding: "22px 30px", fontSize: 20, lineHeight: 1.5, color: C.ink, fontWeight: 500 }}>
                Exclusiu pis d'obra nova en el centre de Manresa de 2 habitacions, dissenyat per a oferir màxim confort, eficiència energètica i acabats d'alta qualitat. Aerotèrmia amb terra radiant, climatització reversible i terrassa privada amb paviment antilliscant.
              </div>
            </div>
          </div>
          {!v && (
            <div style={{ position: "absolute", right: 70, top: 250, display: "flex", flexDirection: "column", gap: 18, alignItems: "flex-end" }}>
              <Tag txt="inllobsa.com" a={k(t, b(M4 + 0.5), b(M4 + 0.5) + 0.4, 0, 1, BACK)} accent />
              <Tag txt="Portals nacionals" a={k(t, b(M4 + 1.5), b(M4 + 1.5) + 0.4, 0, 1, BACK)} />
              <Tag txt="i internacionals" a={k(t, b(M4 + 2.5), b(M4 + 2.5) + 0.4, 0, 1, BACK)} />
            </div>
          )}
        </Fill>
      )}

      {/* ============ M5: intel·ligència artificial */}
      {m5.on && (
        <Fill style={{ opacity: m5.inA }}>
          {/* 1) la IA llegeix la foto */}
          <div
            style={{
              position: "absolute",
              left: v ? 50 : 110 - toCore * 60,
              top: v ? 230 : 150,
              width: v ? W - 100 : 960,
              height: v ? 700 : 720,
              borderRadius: 26,
              overflow: "hidden",
              boxShadow: "0 40px 90px rgba(0,0,0,.5)",
              scale: String(1 - toCore * 0.35),
              opacity: 1 - toCore * 0.75,
              transformOrigin: "0 50%",
            }}
          >
            <Img src={staticFile("listing/terrassa-piscina.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(242,112,79,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(242,112,79,.25) 1px, transparent 1px)", backgroundSize: "48px 48px", opacity: 0.8 * (1 - k(t, b(M5 + 2), b(M5 + 3), 0, 1)) }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: `${scan * 100}%`, height: 6, background: C.orangeLight, boxShadow: `0 0 30px 10px ${C.orange}`, opacity: scan < 1 ? 1 : 0 }} />
            {DETECT.map((d) => {
              const a = k(t, b(d.at) - 0.05, b(d.at) + 0.3, 0, 1, BACK);
              return (
                <div key={d.label} style={{ position: "absolute", left: `${d.x * 100}%`, top: `${d.y * 100}%`, width: `${d.w * 100}%`, height: `${d.h * 100}%`, border: `4px solid ${C.orangeLight}`, borderRadius: 10, opacity: Math.min(1, a * 1.5), scale: String(1.2 - 0.2 * a), boxShadow: "0 0 0 2000px rgba(0,0,0,0)" }}>
                  <div style={{ position: "absolute", left: -4, top: -48, padding: "6px 14px", borderRadius: 8, background: C.orange, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 22, whiteSpace: "nowrap" }}>
                    {d.label}
                  </div>
                </div>
              );
            })}
            <div style={{ position: "absolute", right: 22, top: 22, display: "flex", alignItems: "center", gap: 10, padding: "8px 18px", borderRadius: 999, background: "rgba(27,38,56,.85)", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 22 }}>
              <BrainCircuit size={26} color={C.orangeLight} /> Anàlisi IA
            </div>
          </div>
          {/* 2) la IA redacta */}
          {t > b(M5B) - 0.3 && (
            <div
              style={{
                position: "absolute",
                left: v ? 50 : 1110,
                top: v ? 990 : 230,
                width: v ? W - 100 : 700,
                borderRadius: 24,
                background: "rgba(255,255,255,.1)",
                border: "1.5px solid rgba(255,255,255,.2)",
                padding: 30,
                boxSizing: "border-box",
                fontFamily: FONT,
                color: "#fff",
                opacity: k(t, b(M5B) - 0.3, b(M5B), 0, 1) * (1 - toCore * 0.7),
                translate: `${(1 - k(t, b(M5B) - 0.3, b(M5B) + 0.2, 0, 1, EO)) * 80}px 0`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 900, fontSize: 24, color: C.orangeLight }}>
                <Sparkles size={28} /> Descripció generada
              </div>
              <div style={{ marginTop: 14, fontWeight: 600, fontSize: v ? 30 : 30, lineHeight: 1.4, minHeight: v ? 170 : 210 }}>
                {DESC.slice(0, typed)}
                <span style={{ color: C.orangeLight, opacity: Math.floor(t * 3) % 2 ? 1 : 0 }}>▍</span>
              </div>
            </div>
          )}
          {/* 3) arribar a les persones adequades */}
          {t > b(M5C) - 0.3 && (
            <Fill>
              <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
                {AUDIENCE.map((_, i) => {
                  const an = -Math.PI / 2 + (i - (AUDIENCE.length - 1) / 2) * (v ? 0.62 : 0.52);
                  const r = v ? 420 : 400;
                  const x = cx + Math.cos(an) * r * (v ? 1 : 1.5);
                  const y = (v ? cy + 120 : cy + 160) + Math.sin(an) * r;
                  const q = k(t, b(M5C + 1 + i * 0.5) - 0.3, b(M5C + 1 + i * 0.5), 0, 1, EIO);
                  const ccx = cx;
                  const ccy = v ? cy + 120 : cy + 160;
                  return <line key={i} x1={ccx} y1={ccy} x2={ccx + (x - ccx) * q} y2={ccy + (y - ccy) * q} stroke={C.orangeLight} strokeWidth={4} opacity={0.8} />;
                })}
              </svg>
              <div style={{ position: "absolute", left: cx - 120, top: (v ? cy + 120 : cy + 160) - 120, width: 240, height: 240, borderRadius: "50%", background: `linear-gradient(140deg, ${C.orangeLight}, ${C.orange})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: FONT, boxShadow: `0 0 0 ${14 + bp * 18}px rgba(242,112,79,.25), 0 0 120px rgba(242,112,79,.6)`, scale: String(k(t, b(M5C) - 0.2, b(M5C) + 0.3, 0, 1, BACK)) }}>
                <BrainCircuit size={86} color="#fff" strokeWidth={1.8} />
                <div style={{ fontWeight: 900, fontSize: 54, lineHeight: 1 }}>IA</div>
              </div>
              {AUDIENCE.map((a, i) => {
                const an = -Math.PI / 2 + (i - (AUDIENCE.length - 1) / 2) * (v ? 0.62 : 0.52);
                const r = v ? 420 : 400;
                const x = cx + Math.cos(an) * r * (v ? 1 : 1.5);
                const y = (v ? cy + 120 : cy + 160) + Math.sin(an) * r;
                return (
                  <div key={a} style={{ position: "absolute", left: x, top: y, translate: "-50% -50%" }}>
                    <Tag txt={a} accent={i % 2 === 0} a={k(t, b(M5C + 1 + i * 0.5), b(M5C + 1 + i * 0.5) + 0.35, 0, 1, BACK)} size={v ? 30 : 30} />
                  </div>
                );
              })}
              {/* partícules */}
              {Array.from({ length: 30 }, (_, i) => {
                const q = ((t - b(M5C)) * 0.6 + i / 30) % 1;
                const an = i * 2.4;
                const R = 140 + q * 700;
                return <div key={i} style={{ position: "absolute", left: cx + Math.cos(an) * R, top: (v ? cy + 120 : cy + 160) + Math.sin(an) * R * 0.6, width: 6, height: 6, borderRadius: "50%", background: i % 3 ? "#fff" : C.orangeLight, opacity: (1 - q) * 0.8 }} />;
              })}
            </Fill>
          )}
        </Fill>
      )}
      <Vignette strength={0.45} />
      {flash > 0.01 && <Fill style={{ background: "#fff", opacity: flash * 0.6 }} />}
    </Fill>
  );
};
