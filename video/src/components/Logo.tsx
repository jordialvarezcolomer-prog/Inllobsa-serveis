import React from "react";
import { Img, staticFile } from "remotion";
import { C } from "../lib/brand";

// Coordenades del logotip original (inllobsa-logo.png, 518×234 px).
// La teulada es redibuixa en vectorial seguint exactament la geometria del PNG
// per poder animar-ne el traç; les lletres són els píxels originals.
export const LOGO_W = 518;
export const LOGO_H = 234;
export const ROOF_POLY = "70,63 257,8 446,63 446,85 257,30 70,85";
export const ROOF_CENTER = "M70 74 L257 19 L446 74";

type Props = {
  width: number;
  variant?: "color" | "white";
  roof?: number; // 0→1 traç de la teulada
  word?: number; // 0→1 aparició de "inllobsa"
  tag?: number; // 0→1 aparició de "IMMOBILIÀRIA"
  glow?: number;
  style?: React.CSSProperties;
};

export const Logo: React.FC<Props> = ({ width, variant = "color", roof = 1, word = 1, tag = 1, glow = 0, style }) => {
  const s = width / LOGO_W;
  const white = variant === "white";
  const id = React.useId().replace(/:/g, "");
  return (
    <div style={{ position: "relative", width, height: LOGO_H * s, ...style }}>
      <svg
        viewBox={`0 0 ${LOGO_W} ${LOGO_H}`}
        width={width}
        height={LOGO_H * s}
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
      >
        <defs>
          <clipPath id={`roof-${id}`}>
            <polygon points={ROOF_POLY} />
          </clipPath>
          <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>
        {glow > 0 && (
          <polygon points={ROOF_POLY} fill={C.orange} opacity={glow * 0.9} filter={`url(#glow-${id})`} />
        )}
        <g clipPath={`url(#roof-${id})`}>
          <path
            d={ROOF_CENTER}
            fill="none"
            stroke={C.orange}
            strokeWidth={40}
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - roof}
          />
        </g>
      </svg>
      {/* "inllobsa" — revelat de baix a dalt amb màscara */}
      <div
        style={{
          position: "absolute",
          left: 2 * s,
          top: 87 * s,
          width: 512 * s,
          height: 98 * s,
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile(`brand/wordmark${white ? "-white" : ""}.png`)}
          style={{
            width: "100%",
            height: "100%",
            translate: `0 ${(1 - word) * 105}%`,
          }}
        />
      </div>
      <Img
        src={staticFile(`brand/tagline${white ? "-white" : ""}.png`)}
        style={{
          position: "absolute",
          left: 82 * s,
          top: 190 * s,
          width: 357 * s,
          height: 38 * s,
          opacity: tag,
          clipPath: `inset(0 ${(1 - tag) * 50}% 0 ${(1 - tag) * 50}%)`,
        }}
      />
    </div>
  );
};
