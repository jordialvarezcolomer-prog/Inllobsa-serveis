import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT } from "../lib/brand";
import { BACK, EO, k } from "../lib/time";
import team from "../data/team.json";

export const person = (photo: string) => {
  const m = team.find((x) => x.photo === photo)!;
  return { photo: m.photo, name: m.name, role: m.role.ca };
};

/** Fotografia real a sang amb moviment de càmera (Ken Burns). */
export const Photo: React.FC<{
  src: string;
  t: number;
  t0: number;
  dur: number;
  from?: [number, number, number]; // [escala, x%, y%]
  to?: [number, number, number];
  style?: React.CSSProperties;
  position?: string;
}> = ({ src, t, t0, dur, from = [1.12, 0, 0], to = [1.0, 0, 0], style, position = "50% 50%" }) => {
  const q = Math.max(0, Math.min(1, (t - t0) / dur));
  const s = from[0] + (to[0] - from[0]) * q;
  const x = from[1] + (to[1] - from[1]) * q;
  const y = from[2] + (to[2] - from[2]) * q;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", ...style }}>
      <Img
        src={staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: position, scale: String(s), translate: `${x}% ${y}%` }}
      />
    </div>
  );
};

/** Targeta d'una persona de l'equip (foto real + nom + càrrec). */
export const PersonPill: React.FC<{ photo: string; t: number; t0: number; dark?: boolean; size?: number; style?: React.CSSProperties }> = ({
  photo,
  t,
  t0,
  dark = false,
  size = 1,
  style,
}) => {
  const m = person(photo);
  const a = k(t, t0, t0 + 0.5, 0, 1, BACK);
  const txt = k(t, t0 + 0.12, t0 + 0.55, 0, 1, EO);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18 * size,
        padding: `${10 * size}px ${30 * size}px ${10 * size}px ${10 * size}px`,
        borderRadius: 999,
        background: dark ? "rgba(255,255,255,.12)" : C.white,
        border: dark ? "1.5px solid rgba(255,255,255,.22)" : `1.5px solid ${C.line}`,
        boxShadow: dark ? "0 20px 50px rgba(0,0,0,.35)" : "0 20px 50px rgba(30,41,59,.14)",
        fontFamily: FONT,
        scale: String(0.6 + 0.4 * a),
        opacity: Math.min(1, a * 1.6),
        ...style,
      }}
    >
      <div style={{ width: 88 * size, height: 88 * size, borderRadius: "50%", overflow: "hidden", border: `${4 * size}px solid ${C.orange}`, flex: "none" }}>
        <Img src={staticFile(`team/${m.photo}-480.jpg`)} style={{ width: "100%", height: "130%", objectFit: "cover", objectPosition: "50% 8%" }} />
      </div>
      <div style={{ opacity: txt, translate: `${(1 - txt) * -14}px 0` }}>
        <div style={{ fontWeight: 900, fontSize: 30 * size, color: dark ? C.white : C.navy, lineHeight: 1.1, whiteSpace: "nowrap" }}>{m.name}</div>
        <div style={{ fontWeight: 700, fontSize: 21 * size, color: dark ? "#cfe0f5" : C.blue, marginTop: 4, whiteSpace: "nowrap" }}>{m.role}</div>
      </div>
    </div>
  );
};

/** Número que compta fins al valor (amb dígits que roden). */
export const Counter: React.FC<{ value: number; t: number; t0: number; dur?: number; prefix?: string; suffix?: string; from?: number; style?: React.CSSProperties }> = ({
  value,
  t,
  t0,
  dur = 0.9,
  prefix = "",
  suffix = "",
  from = 0,
  style,
}) => {
  const q = k(t, t0, t0 + dur, 0, 1, EO);
  const n = Math.round(from + (value - from) * q);
  return (
    <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {prefix}
      {String(n)}
      {suffix}
    </span>
  );
};
