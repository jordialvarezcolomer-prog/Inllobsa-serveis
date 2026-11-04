import React from "react";
import { C, FONT } from "../lib/brand";
import { BACK, EO, k } from "../lib/time";

/** Text cinètic: cada paraula puja des d'una màscara. *paraula* = taronja. */
export const Kinetic: React.FC<{
  text: string;
  t: number;
  t0: number;
  stagger?: number;
  size: number;
  weight?: number;
  color?: string;
  hl?: string;
  align?: "left" | "center" | "right";
  lineHeight?: number;
  letterSpacing?: number;
  out?: number; // instant de sortida (s)
  style?: React.CSSProperties;
  maxWidth?: number;
  uppercase?: boolean;
}> = ({
  text,
  t,
  t0,
  stagger = 0.06,
  size,
  weight = 800,
  color = C.white,
  hl = C.orange,
  align = "left",
  lineHeight = 1.05,
  letterSpacing = -0.02,
  out,
  style,
  maxWidth,
  uppercase,
}) => {
  const lines = text.split("\n");
  let idx = 0;
  let on = false;
  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: size,
        fontWeight: weight,
        lineHeight,
        letterSpacing: `${letterSpacing}em`,
        textAlign: align,
        color,
        maxWidth,
        textTransform: uppercase ? "uppercase" : undefined,
        ...style,
      }}
    >
      {lines.map((ln, li) => (
        <div key={li} style={{ display: "block" }}>
          {ln.split(" ").map((raw, wi) => {
            if (raw.startsWith("*")) on = true;
            const isHl = on;
            if (raw.replace(/[.,:;?!]+$/, "").endsWith("*")) on = false;
            const w = raw.replace(/\*/g, "");
            const i = idx++;
            const a = k(t, t0 + i * stagger, t0 + i * stagger + 0.55, 0, 1, EO);
            const o = out !== undefined ? k(t, out + i * 0.03, out + i * 0.03 + 0.35, 0, 1, EO) : 0;
            return (
              <span
                key={wi}
                style={{
                  display: "inline-block",
                  overflow: "hidden",
                  verticalAlign: "top",
                  paddingBottom: "0.08em",
                  marginRight: "0.26em",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    translate: `0 ${(1 - a) * 140 - o * 140}%`,
                    color: isHl ? hl : undefined,
                  }}
                >
                  {w}
                </span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Etiqueta petita amb guió taronja (com .eyebrow de la web). */
export const Eyebrow: React.FC<{ text: string; t: number; t0: number; color?: string; size?: number; style?: React.CSSProperties }> = ({
  text,
  t,
  t0,
  color = C.blue,
  size = 26,
  style,
}) => {
  const a = k(t, t0, t0 + 0.6, 0, 1);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: size * 0.6,
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color,
        opacity: a,
        ...style,
      }}
    >
      <span style={{ width: size * 1.6 * a, height: size * 0.14, background: C.orange, borderRadius: 4 }} />
      <span style={{ translate: `${(1 - a) * -20}px 0` }}>{text}</span>
    </div>
  );
};

/** Xip / etiqueta amb icona. */
export const Chip: React.FC<
  React.PropsWithChildren<{ t: number; t0: number; bg?: string; color?: string; size?: number; style?: React.CSSProperties }>
> = ({ t, t0, bg = C.white, color = C.navy, size = 26, children, style }) => {
  const a = k(t, t0, t0 + 0.5, 0, 1, BACK);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.45,
        padding: `${size * 0.5}px ${size * 0.85}px`,
        borderRadius: 999,
        background: bg,
        color,
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: size,
        boxShadow: "0 12px 30px rgba(20,30,50,.18)",
        scale: String(0.6 + 0.4 * a),
        opacity: Math.min(1, a * 1.5),
        ...style,
      }}
    >
      {children}
    </div>
  );
};
