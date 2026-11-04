import React from "react";
import { Building2, Check, FileText, Megaphone, UserCheck, Wrench } from "lucide-react";
import { C, FONT } from "../lib/brand";
import { Fill, useLayout, useT } from "../lib/layout";
import { BACK, BEAT, EI, EIO, EO, k, p, scene } from "../lib/time";
import { PersonPill } from "../components/Kit";
import { SERVICE_PEOPLE } from "../data/story";
import type { Cue } from "../components/Sfx";

const S = scene("rent");
const b = (n: number) => S.start + n * BEAT;
// serveis de lloguer i administració de finques de la landing
const STEPS = [
  { Icon: Megaphone, label: "Comercialització", sub: "Residencial i comercial" },
  { Icon: UserCheck, label: "Llogaters solvents", sub: "Anàlisi de solvència" },
  { Icon: FileText, label: "Contractes", sub: "Redactats i actualitzats" },
  { Icon: Building2, label: "Administració", sub: "Liquidació mensual de rendes" },
  { Icon: Wrench, label: "Manteniment", sub: "Resolució ràpida d'avaries" },
];
const T_PIPE = 3;
const T_PEOPLE = 10.5;

export const rentSfx: Cue[] = [
  { t: S.start - 0.45, name: "whoosh-long", vol: 0.4 },
  ...STEPS.map((_, i) => ({ t: b(T_PIPE + 0.5 + i), name: "rise", vol: 0.3 })),
  { t: b(T_PEOPLE) - 0.2, name: "whoosh", vol: 0.3 },
  ...SERVICE_PEOPLE.rent.map((_, i) => ({ t: b(T_PEOPLE + 0.5 + i), name: "pop", vol: 0.35 })),
];

const RentHouse: React.FC<{ t: number; size: number }> = ({ t, size }) => {
  const d = k(t, S.start, S.start + 0.8, 0, 1, EIO);
  const hang = k(t, S.start + 0.4, S.start + 0.7, 0, 1, EO);
  const sw = t > S.start + 0.6 ? Math.sin((t - S.start - 0.6) * 7) * 16 * Math.exp(-(t - S.start - 0.6) * 1.1) : -30 * (1 - hang);
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
  const up = k(t, S.start - 0.45, S.start + 0.1, 0, 1, EIO);
  const top = H * (1 - up);

  const head = k(t, b(T_PIPE) - 0.2, b(T_PIPE) + 0.4, 0, 1, EIO);
  const n = STEPS.length;
  const pts = STEPS.map((_, i) => (v ? { x: 170, y: 520 + i * 150 } : { x: 230 + i * ((W - 460) / (n - 1)), y: 555 }));
  const prog = k(t, b(T_PIPE + 0.5), b(T_PIPE + 0.5 + n - 1), 0, n - 1, (x) => x);
  const peopleIn = k(t, b(T_PEOPLE) - 0.2, b(T_PEOPLE) + 0.3, 0, 1, EO);
  const pipeOut = v ? k(t, b(T_PEOPLE) - 0.3, b(T_PEOPLE), 0, 1, EI) : 0;

  return (
    <Fill style={{ clipPath: t < S.start + 0.15 ? `inset(${top}px 0 0 0)` : undefined }}>
      <Fill style={{ background: `linear-gradient(150deg, ${C.blue} 0%, ${C.blue700} 70%, ${C.navy} 100%)` }} />
      <Fill style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.12) 1.5px, transparent 1.5px)", backgroundSize: "44px 44px", translate: `0 ${(t * 14) % 44}px` }} />
      {t < S.start + 0.15 && <div style={{ position: "absolute", left: 0, right: 0, top: top - 6, height: 12, background: C.orange }} />}

      {/* capçalera: casa + títol, que es fa petita i puja */}
      <div
        style={{
          position: "absolute",
          left: v ? 0 : 120,
          right: v ? 0 : undefined,
          top: v ? 230 - head * 90 : 250 - head * 160,
          display: "flex",
          flexDirection: v ? "column" : "row",
          alignItems: "center",
          gap: v ? 10 : 40,
          scale: String(1 - head * 0.45),
          transformOrigin: v ? "50% 0" : "0 0",
          opacity: 1 - pipeOut,
        }}
      >
        <RentHouse t={t} size={v ? 360 : 360} />
        <div style={{ fontFamily: FONT, color: "#fff", textAlign: v ? "center" : "left" }}>
          <div style={{ fontWeight: 800, fontSize: 30, letterSpacing: ".16em", color: "#cfe0f5", textTransform: "uppercase" }}>Lloguer d'immobles</div>
          <div style={{ fontWeight: 900, fontSize: v ? 104 : 120, letterSpacing: "-0.04em", lineHeight: 1 }}>
            Lloguer <span style={{ color: C.orangeLight }}>i finques</span>
          </div>
        </div>
      </div>

      {/* recorregut */}
      {t > b(T_PIPE) - 0.2 && (
        <Fill style={{ opacity: k(t, b(T_PIPE) - 0.1, b(T_PIPE) + 0.3, 0, 1) * (1 - pipeOut) }}>
          <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
            {pts.slice(0, -1).map((a, i) => {
              const c = pts[i + 1];
              const s = Math.max(0, Math.min(1, prog - i));
              return (
                <g key={i}>
                  <line x1={a.x} y1={a.y} x2={c.x} y2={c.y} stroke="rgba(255,255,255,.25)" strokeWidth={4} strokeDasharray="2 12" strokeLinecap="round" />
                  <line x1={a.x} y1={a.y} x2={a.x + (c.x - a.x) * s} y2={a.y + (c.y - a.y) * s} stroke={C.orange} strokeWidth={8} strokeLinecap="round" />
                </g>
              );
            })}
          </svg>
          {STEPS.map((s, i) => {
            const t0 = b(T_PIPE + 0.5 + i);
            const a = k(t, t0 - 0.12, t0 + 0.35, 0, 1, BACK);
            const lit = t >= t0 - 0.03;
            const pu = p(t, t0, 0.7);
            const R = v ? 60 : 80;
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
                    scale: String(0.7 + 0.3 * a),
                    boxShadow: lit ? `0 0 0 ${pu * 40}px rgba(255,255,255,${0.25 * (1 - pu)}), 0 20px 50px rgba(0,0,0,.25)` : undefined,
                  }}
                >
                  <s.Icon size={R * 0.9} color={lit ? C.blue : "rgba(255,255,255,.6)"} strokeWidth={2} />
                  {lit && (
                    <div style={{ position: "absolute", right: -4, top: -4, width: 38, height: 38, borderRadius: "50%", background: C.orange, display: "grid", placeItems: "center", scale: String(k(t, t0 + 0.1, t0 + 0.4, 0, 1, BACK)) }}>
                      <Check size={24} color="#fff" strokeWidth={3.5} />
                    </div>
                  )}
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: v ? pts[i].x + 100 : pts[i].x - 170,
                    top: v ? pts[i].y - 40 : pts[i].y + R + 26,
                    width: v ? 760 : 340,
                    textAlign: v ? "left" : "center",
                    fontFamily: FONT,
                    opacity: k(t, t0 - 0.05, t0 + 0.3, 0, 1),
                    translate: `0 ${(1 - k(t, t0 - 0.05, t0 + 0.4, 0, 1)) * 24}px`,
                  }}
                >
                  <div style={{ fontWeight: 900, fontSize: v ? 44 : 34, color: "#fff" }}>{s.label}</div>
                  <div style={{ fontWeight: 600, fontSize: v ? 28 : 23, color: "#cfe0f5", marginTop: 4 }}>{s.sub}</div>
                </div>
              </React.Fragment>
            );
          })}
        </Fill>
      )}

      {/* responsables */}
      {t > b(T_PEOPLE) - 0.2 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: v ? 620 : 790,
            display: "flex",
            flexDirection: v ? "column" : "row",
            justifyContent: "center",
            alignItems: "center",
            gap: v ? 34 : 40,
            opacity: peopleIn,
            translate: `0 ${(1 - peopleIn) * 30}px`,
          }}
        >
          {SERVICE_PEOPLE.rent.map((ph, i) => (
            <PersonPill key={ph} photo={ph} t={t} t0={b(T_PEOPLE + 0.5 + i)} dark size={v ? 1.3 : 1.1} />
          ))}
        </div>
      )}
    </Fill>
  );
};
