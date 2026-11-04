import React from "react";
import { Building2, Check, FileText, Megaphone, UserCheck, Wrench } from "lucide-react";
import { C, FONT } from "../lib/brand";
import { Fill, useLayout, useT } from "../lib/layout";
import { BACK, EI, EIO, EO, k, p, scene, wt } from "../lib/time";
import { Eyebrow, Kinetic } from "../components/Text";
import type { Cue } from "../components/Sfx";

const S = scene("rent");
const T0 = S.start;
const STEPS = [
  { Icon: Megaphone, label: "Comercialització", sub: "Difusió i visites", t: wt("L06", "comercialitzem") },
  { Icon: UserCheck, label: "Selecció de llogaters", sub: "Anàlisi de solvència", t: wt("L06", "seleccionem") },
  { Icon: FileText, label: "Contracte", sub: "Redactat i actualitzat", t: wt("L06", "contracte") },
  { Icon: Building2, label: "Administració", sub: "de finques", t: wt("L07", "l'administració") },
  { Icon: Wrench, label: "Incidències", sub: "i manteniment", t: wt("L07", "incidències") },
];
const T_PIPE = STEPS[0].t - 0.55;
const T_REBUTS = wt("L07", "rebuts");
const T_MANS = wt("L07", "bones");

export const rentSfx: Cue[] = [
  { t: T0 - 0.45, name: "whoosh-long", vol: 0.45 },
  { t: T0 + 0.25, name: "rise", vol: 0.35 },
  { t: wt("L05", "ens") - 0.05, name: "pop", vol: 0.4 },
  { t: T_PIPE, name: "whoosh", vol: 0.4 },
  ...STEPS.map((s) => ({ t: s.t - 0.04, name: "rise", vol: 0.4 })),
  { t: T_REBUTS, name: "tick", vol: 0.4 },
  { t: T_MANS - 0.05, name: "ding", vol: 0.4 },
];

/** Casa amb rètol "ES LLOGA" que es gronxa. */
const RentHouse: React.FC<{ t: number; size: number }> = ({ t, size }) => {
  const d = k(t, T0 + 0.1, T0 + 1.2, 0, 1, EIO);
  const hang = k(t, T0 + 0.7, T0 + 1.1, 0, 1, EO);
  const sw = t > T0 + 0.9 ? Math.sin((t - T0 - 0.9) * 6.5) * 14 * Math.exp(-(t - T0 - 0.9) * 0.9) : -30 * (1 - hang);
  const line = { pathLength: 1, strokeDasharray: "1 1", strokeDashoffset: 1 - d } as const;
  return (
    <svg viewBox="0 0 300 300" width={size} height={size} style={{ overflow: "visible" }}>
      <path d="M40 140 L150 50 L260 140" fill="none" stroke={C.orange} strokeWidth={18} strokeLinejoin="round" strokeLinecap="round" {...line} />
      <path d="M70 128 V262 H230 V128" fill="none" stroke="#fff" strokeWidth={8} strokeLinejoin="round" {...line} />
      <path d="M128 262 V200 H172 V262" fill="none" stroke="#fff" strokeWidth={8} {...line} />
      <g style={{ rotate: `${sw}deg`, transformOrigin: "150px 128px", opacity: hang }}>
        <path d="M118 128 L110 150 M182 128 L190 150" stroke="#fff" strokeWidth={4} />
        <rect x="86" y="148" width="128" height="46" rx="8" fill="#fff" />
        <text x="150" y="180" textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={25} fill={C.blue} letterSpacing={1}>
          ES LLOGA
        </text>
      </g>
    </svg>
  );
};

export const Rent: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  const { W, H, v } = useLayout();

  // entrada: panell blau que puja amb una línia taronja al capdavant
  const up = k(t, T0 - 0.5, T0 + 0.1, 0, 1, EIO);
  const top = H * (1 - up);

  const introOut = k(t, T_PIPE, T_PIPE + 0.6, 0, 1, EI);
  const pipeIn = k(t, T_PIPE + 0.1, T_PIPE + 0.8, 0, 1, EO);
  const cam = 1.04 - 0.04 * k(t, T0, S.end, 0, 1, (x) => x);

  // geometria del recorregut
  const n = STEPS.length;
  const pts = STEPS.map((_, i) =>
    v ? { x: 190, y: 330 + i * 190 } : { x: 210 + i * ((W - 420) / (n - 1)), y: 470 },
  );
  // progrés de la línia taronja: arriba a cada node en el seu temps
  const prog = (() => {
    for (let i = n - 1; i >= 0; i--) {
      if (t >= STEPS[i].t) {
        if (i === n - 1) return n - 1;
        return i + k(t, STEPS[i].t + 0.2, STEPS[i + 1].t, 0, 1, EIO) * 0.999;
      }
    }
    return k(t, T_PIPE + 0.3, STEPS[0].t, -0.4, 0, EIO);
  })();
  const seg = (i: number) => Math.max(0, Math.min(1, prog - i));
  const done = k(t, T_MANS - 0.1, T_MANS + 0.6, 0, 1, BACK);

  return (
    <Fill style={{ clipPath: t < T0 + 0.2 ? `inset(${top}px 0 0 0)` : undefined }}>
      <Fill style={{ background: `linear-gradient(150deg, ${C.blue} 0%, ${C.blue700} 70%, ${C.navy} 100%)` }} />
      <Fill
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,.12) 1.5px, transparent 1.5px)",
          backgroundSize: "44px 44px",
          translate: `0 ${(t * 10) % 44}px`,
          opacity: 0.7,
        }}
      />
      {t < T0 + 0.2 && <div style={{ position: "absolute", left: 0, right: 0, top: top - 6, height: 12, background: C.orange }} />}

      <Fill style={{ scale: String(cam) }}>
        {/* --- intro */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: v ? "column" : "row",
            alignItems: "center",
            justifyContent: "center",
            gap: v ? 40 : 90,
            paddingBottom: v ? 300 : 80,
            opacity: 1 - introOut,
            translate: `0 ${-introOut * 120}px`,
            scale: String(1 - introOut * 0.1),
          }}
        >
          <RentHouse t={t} size={v ? 440 : 420} />
          <div style={{ display: "flex", flexDirection: "column", gap: 22, alignItems: v ? "center" : "flex-start" }}>
            <Eyebrow text="Lloguer d'immobles" t={t} t0={T0 + 0.3} color="#cfe0f5" size={v ? 32 : 28} />
            <Kinetic
              text={"Ens n'ocupem\n*de tot.*"}
              t={t}
              t0={wt("L05", "ens") - 0.1}
              size={v ? 110 : 126}
              weight={900}
              hl={C.orangeLight}
              align={v ? "center" : "left"}
              letterSpacing={-0.035}
            />
          </div>
        </div>

        {/* --- recorregut de gestió */}
        {t > T_PIPE && (
          <>
            <div style={{ position: "absolute", left: v ? 0 : 0, right: 0, top: v ? 150 : 160, display: "flex", justifyContent: "center", opacity: pipeIn }}>
              <Eyebrow text="Gestió integral del lloguer" t={t} t0={T_PIPE + 0.2} color="#ffffff" size={v ? 32 : 28} />
            </div>
            <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
              {pts.slice(0, -1).map((a, i) => {
                const b = pts[i + 1];
                return (
                  <g key={i}>
                    <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(255,255,255,.25)" strokeWidth={4} strokeDasharray="2 12" strokeLinecap="round" opacity={pipeIn} />
                    <line
                      x1={a.x}
                      y1={a.y}
                      x2={a.x + (b.x - a.x) * seg(i)}
                      y2={a.y + (b.y - a.y) * seg(i)}
                      stroke={C.orange}
                      strokeWidth={8}
                      strokeLinecap="round"
                    />
                  </g>
                );
              })}
              {/* punt viatger */}
              {prog >= 0 && prog < n - 1 && (
                <circle
                  cx={pts[Math.floor(prog)].x + (pts[Math.min(n - 1, Math.floor(prog) + 1)].x - pts[Math.floor(prog)].x) * (prog % 1)}
                  cy={pts[Math.floor(prog)].y + (pts[Math.min(n - 1, Math.floor(prog) + 1)].y - pts[Math.floor(prog)].y) * (prog % 1)}
                  r={13}
                  fill="#fff"
                  stroke={C.orange}
                  strokeWidth={6}
                />
              )}
            </svg>
            {STEPS.map((s, i) => {
              const a = k(t, s.t - 0.15, s.t + 0.45, 0, 1, BACK);
              const lit = t >= s.t - 0.05;
              const pulse = p(t, s.t, 0.8);
              const R = v ? 76 : 84;
              return (
                <React.Fragment key={s.label}>
                  <div
                    style={{
                      position: "absolute",
                      left: pts[i].x - R,
                      top: pts[i].y - R,
                      width: R * 2,
                      height: R * 2,
                      borderRadius: "50%",
                      background: lit ? "#fff" : "rgba(255,255,255,.12)",
                      border: `3px solid ${lit ? "#fff" : "rgba(255,255,255,.35)"}`,
                      display: "grid",
                      placeItems: "center",
                      scale: String(0.75 + 0.25 * Math.max(a, pipeIn * 0.85)),
                      opacity: pipeIn,
                      boxShadow: lit ? `0 0 0 ${pulse * 36}px rgba(255,255,255,${0.25 * (1 - pulse)}), 0 20px 50px rgba(0,0,0,.25)` : undefined,
                    }}
                  >
                    <s.Icon size={R * 0.9} color={lit ? C.blue : "rgba(255,255,255,.6)"} strokeWidth={2} />
                    {lit && (
                      <div
                        style={{
                          position: "absolute",
                          right: -4,
                          top: -4,
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          background: C.orange,
                          display: "grid",
                          placeItems: "center",
                          scale: String(k(t, s.t + 0.2, s.t + 0.55, 0, 1, BACK)),
                        }}
                      >
                        <Check size={26} color="#fff" strokeWidth={3.5} />
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: v ? pts[i].x + 120 : pts[i].x - 170,
                      top: v ? pts[i].y - 46 : pts[i].y + R + 30,
                      width: v ? 700 : 340,
                      textAlign: v ? "left" : "center",
                      fontFamily: FONT,
                      opacity: k(t, s.t - 0.05, s.t + 0.4, 0, 1),
                      translate: `0 ${(1 - k(t, s.t - 0.05, s.t + 0.5, 0, 1)) * 24}px`,
                    }}
                  >
                    <div style={{ fontWeight: 900, fontSize: v ? 46 : 34, color: "#fff", lineHeight: 1.1 }}>{s.label}</div>
                    <div style={{ fontWeight: 600, fontSize: v ? 32 : 24, color: "#cfe0f5", marginTop: 6 }}>{s.sub}</div>
                  </div>
                </React.Fragment>
              );
            })}
            {/* rebuts: xip sota administració */}
            <div
              style={{
                position: "absolute",
                left: v ? pts[3].x + 120 : pts[3].x - 110,
                top: v ? pts[3].y + 50 : pts[3].y + 210,
                display: "flex",
                gap: 10,
              }}
            >
              {["Rebuts", "Rendes"].map((r, j) => (
                <div
                  key={r}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,.16)",
                    color: "#fff",
                    fontFamily: FONT,
                    fontWeight: 800,
                    fontSize: v ? 26 : 20,
                    opacity: k(t, T_REBUTS + j * 0.12, T_REBUTS + 0.3 + j * 0.12, 0, 1),
                    scale: String(k(t, T_REBUTS + j * 0.12, T_REBUTS + 0.4 + j * 0.12, 0.6, 1, BACK)),
                  }}
                >
                  {r}
                </div>
              ))}
            </div>
            {/* en bones mans */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: v ? 1215 : 800,
                display: "flex",
                justifyContent: "center",
                opacity: Math.min(1, done),
                scale: String(0.7 + 0.3 * done),
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "14px 30px 14px 16px",
                  borderRadius: 999,
                  background: C.orange,
                  color: "#fff",
                  fontFamily: FONT,
                  fontWeight: 900,
                  fontSize: v ? 40 : 34,
                  boxShadow: "0 20px 50px rgba(0,0,0,.25)",
                }}
              >
                <span style={{ width: 52, height: 52, borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center" }}>
                  <Check size={32} color={C.orange} strokeWidth={3.5} />
                </span>
                La teva propietat, en bones mans
              </div>
            </div>
          </>
        )}
      </Fill>
    </Fill>
  );
};
