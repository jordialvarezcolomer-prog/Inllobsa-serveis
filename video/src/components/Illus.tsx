import React from "react";
import { C } from "../lib/brand";

// Il·lustracions vectorials pròpies (estil pla, colors corporatius).
// No són fotografies d'immobles reals: només suport gràfic.
// `d` = progrés de traç 0→1 (dibuix de línies), `f` = progrés d'emplenat 0→1.

const S = (d: number, extra?: Record<string, unknown>) =>
  ({
    fill: "none",
    stroke: C.navy,
    strokeWidth: 3.2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    pathLength: 1,
    strokeDasharray: "1 1",
    strokeDashoffset: 1 - d,
    ...extra,
  }) as Record<string, unknown>;

export type PropertyKind = "flat" | "house" | "shop" | "parking" | "warehouse" | "plot";

type IP = { d?: number; f?: number; width?: number; dark?: boolean };

const Ground: React.FC<{ d: number }> = ({ d }) => <path d="M10 166 H230" {...S(d)} />;

export const Property: React.FC<IP & { kind: PropertyKind }> = ({ kind, d = 1, f = 1, width = 240 }) => {
  const fill = (c: string, o = 1) => ({ fill: c, opacity: f * o });
  let body: React.ReactNode = null;
  switch (kind) {
    case "flat":
      body = (
        <>
          <rect x="62" y="22" width="116" height="144" rx="3" {...fill(C.tint2)} />
          <rect x="62" y="22" width="116" height="144" rx="3" {...S(d)} />
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2].map((c) => (
              <rect
                key={`${r}-${c}`}
                x={76 + c * 32}
                y={36 + r * 30}
                width="20"
                height="18"
                rx="2"
                {...fill(r === 1 && c === 1 ? C.orange : C.white)}
                stroke={C.navy}
                strokeWidth={2}
                opacity={f}
              />
            )),
          )}
          <rect x="108" y="140" width="24" height="26" {...fill(C.navy)} />
          <path d="M54 22 H186" {...S(d, { strokeWidth: 5 })} />
          <Ground d={d} />
        </>
      );
      break;
    case "house":
      body = (
        <>
          <rect x="58" y="86" width="124" height="80" {...fill(C.white)} />
          <path d="M58 86 V166 H182 V86" {...S(d)} />
          <path d="M40 96 L120 40 L200 96" {...S(d, { stroke: C.orange, strokeWidth: 12 })} />
          <rect x="108" y="122" width="26" height="44" rx="2" {...fill(C.orange)} />
          <rect x="74" y="104" width="24" height="22" rx="2" {...fill(C.tint2)} stroke={C.navy} strokeWidth={2} opacity={f} />
          <rect x="146" y="104" width="24" height="22" rx="2" {...fill(C.tint2)} stroke={C.navy} strokeWidth={2} opacity={f} />
          <circle cx="212" cy="128" r="16" {...fill("#7fb38f", 0.9)} />
          <path d="M212 144 V166" {...S(d)} />
          <Ground d={d} />
        </>
      );
      break;
    case "shop":
      body = (
        <>
          <rect x="44" y="62" width="152" height="104" {...fill(C.white)} />
          <path d="M44 62 V166 M196 62 V166" {...S(d)} />
          <path d="M36 40 H204 V62 H36 Z" {...S(d)} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path
              key={i}
              d={`M${36 + i * 28} 62 q14 16 28 0 V62`}
              fill={i % 2 ? C.white : C.orange}
              stroke={C.navy}
              strokeWidth={2}
              opacity={f}
            />
          ))}
          <rect x="58" y="88" width="80" height="54" rx="2" {...fill(C.tint2)} stroke={C.navy} strokeWidth={2.4} opacity={f} />
          <rect x="150" y="96" width="32" height="70" rx="2" {...fill(C.navy)} />
          <Ground d={d} />
        </>
      );
      break;
    case "parking":
      body = (
        <>
          <rect x="30" y="120" width="180" height="46" {...fill(C.tint2)} />
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M${48 + i * 48} 128 V160`} {...S(d, { stroke: C.white, strokeWidth: 4 })} />
          ))}
          <path
            d="M72 150 h96 q8 0 8 -8 v-10 q0 -6 -6 -8 l-16 -4 l-14 -16 h-42 l-16 18 l-10 4 q-8 3 -8 10 v6 q0 8 8 8 z"
            {...fill(C.blue)}
          />
          <path
            d="M72 150 h96 q8 0 8 -8 v-10 q0 -6 -6 -8 l-16 -4 l-14 -16 h-42 l-16 18 l-10 4 q-8 3 -8 10 v6 q0 8 8 8 z"
            {...S(d)}
          />
          <circle cx="90" cy="152" r="10" {...fill(C.navy)} />
          <circle cx="152" cy="152" r="10" {...fill(C.navy)} />
          <rect x="176" y="22" width="46" height="46" rx="8" {...fill(C.blue)} />
          <text x="199" y="57" fontSize="36" fontWeight={900} textAnchor="middle" fill={C.white} opacity={f} fontFamily="Mulish">
            P
          </text>
          <path d="M199 68 V120" {...S(d)} />
          <Ground d={d} />
        </>
      );
      break;
    case "warehouse":
      body = (
        <>
          <path d="M26 166 V78 L66 54 V78 L106 54 V78 L146 54 V78 L186 54 V78 L214 62 V166 Z" {...fill(C.tint2)} />
          <path d="M26 166 V78 L66 54 V78 L106 54 V78 L146 54 V78 L186 54 V78 L214 62 V166" {...S(d)} />
          <rect x="54" y="104" width="64" height="62" {...fill(C.white)} stroke={C.navy} strokeWidth={2.4} opacity={f} />
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d={`M56 ${114 + i * 11} H116`} stroke={C.navy} strokeWidth={1.6} opacity={f} />
          ))}
          <rect x="138" y="104" width="54" height="22" rx="2" {...fill(C.orange)} />
          <Ground d={d} />
        </>
      );
      break;
    case "plot":
      body = (
        <>
          <path d="M20 150 L70 112 L200 112 L222 150 Z" {...fill("#cfe3d4")} />
          <path d="M20 150 L70 112 L200 112 L222 150 Z" {...S(d, { strokeDasharray: "0.03 0.02" })} />
          {[
            [20, 150],
            [70, 112],
            [200, 112],
            [222, 150],
          ].map(([x, y], i) => (
            <g key={i} opacity={f}>
              <path d={`M${x} ${y} V${y - 30}`} stroke={C.navy} strokeWidth={3} />
              <path d={`M${x} ${y - 30} l16 6 l-16 6 z`} fill={C.orange} />
            </g>
          ))}
          <circle cx="110" cy="96" r="14" {...fill("#7fb38f")} />
          <path d="M110 110 V124" {...S(d)} />
          <Ground d={d} />
        </>
      );
      break;
  }
  return (
    <svg viewBox="0 0 240 180" width={width} height={(width * 180) / 240} style={{ overflow: "visible" }}>
      {body}
    </svg>
  );
};

/** Estança per al home staging: `furnish` 0 = buida, 1 = decorada. */
export const Room: React.FC<{ furnish: number; width: number }> = ({ furnish, width }) => {
  const a = (i: number) => Math.max(0, Math.min(1, furnish * 5 - i)); // aparició esglaonada
  const pop = (i: number) => ({ opacity: a(i), transform: `translateY(${(1 - a(i)) * 14}px)` });
  return (
    <svg viewBox="0 0 400 260" width={width} height={(width * 260) / 400}>
      <rect width="400" height="260" fill={furnish > 0 ? "#f6efe6" : "#f1f1ef"} />
      <rect y="196" width="400" height="64" fill={furnish > 0 ? "#d9c2a3" : "#d8d6d2"} />
      <rect x="250" y="40" width="96" height="110" fill="#cfe0f5" stroke="#ffffff" strokeWidth="8" />
      <path d="M298 40 V150 M250 95 H346" stroke="#ffffff" strokeWidth="5" />
      <g style={pop(0)}>
        <ellipse cx="150" cy="226" rx="120" ry="18" fill={C.orange} opacity={0.35} />
      </g>
      <g style={pop(1)}>
        <rect x="56" y="150" width="190" height="52" rx="14" fill={C.navy} />
        <rect x="68" y="124" width="166" height="44" rx="14" fill="#3d5478" />
        <rect x="76" y="132" width="44" height="30" rx="8" fill={C.orange} />
        <rect x="182" y="132" width="44" height="30" rx="8" fill="#e8ddd0" />
      </g>
      <g style={pop(2)}>
        <rect x="80" y="54" width="90" height="56" fill="#ffffff" stroke={C.navy} strokeWidth="4" />
        <path d="M88 100 L112 76 L128 92 L142 80 L162 100 Z" fill={C.blue} opacity={0.7} />
        <circle cx="146" cy="68" r="6" fill={C.orange} />
      </g>
      <g style={pop(3)}>
        <path d="M30 202 V96" stroke={C.navy} strokeWidth="4" />
        <path d="M14 96 H46 L38 70 H22 Z" fill={C.orange} />
      </g>
      <g style={pop(4)}>
        <rect x="352" y="168" width="28" height="32" rx="4" fill="#ffffff" stroke={C.navy} strokeWidth="3" />
        <circle cx="366" cy="146" r="20" fill="#7fb38f" />
        <circle cx="352" cy="160" r="12" fill="#6aa27c" />
      </g>
    </svg>
  );
};

/** Skyline lineal genèric (no pretén reproduir edificis concrets). */
export const Skyline: React.FC<{ d: number; width: number; color: string; opacity?: number; seed?: number }> = ({
  d,
  width,
  color,
  opacity = 1,
  seed = 1,
}) => {
  const items: string[] = [];
  let x = 0;
  let i = 0;
  const rnd = (n: number) => {
    const s = Math.sin(n * 91.7 + seed * 13.1) * 43758.5453;
    return s - Math.floor(s);
  };
  while (x < 1900) {
    const w = 70 + rnd(i) * 110;
    const h = 90 + rnd(i + 0.5) * 230;
    const type = Math.floor(rnd(i + 0.3) * 4);
    if (type === 0) items.push(`M${x} 400 V${400 - h} L${x + w / 2} ${400 - h - 50} L${x + w} ${400 - h} V400`);
    else if (type === 1) items.push(`M${x} 400 V${400 - h} H${x + w} V400 M${x + w * 0.5} ${400 - h} V${400 - h - 30}`);
    else if (type === 2) items.push(`M${x} 400 V${400 - h} H${x + w * 0.6} V${400 - h + 40} H${x + w} V400`);
    else items.push(`M${x} 400 V${400 - h} Q${x + w / 2} ${400 - h - 60} ${x + w} ${400 - h} V400`);
    // finestres
    for (let r = 0; r < Math.floor(h / 50); r++) {
      items.push(`M${x + 16} ${400 - h + 30 + r * 46} h${w - 32}`);
    }
    x += w + 12;
    i++;
  }
  return (
    <svg viewBox="0 0 1900 404" width={width} height={(width * 404) / 1900} style={{ opacity }}>
      <path d="M0 400 H1900" stroke={color} strokeWidth={3} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - d} />
      {items.map((pth, j) => (
        <path
          key={j}
          d={pth}
          fill="none"
          stroke={color}
          strokeWidth={2.4}
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - Math.max(0, Math.min(1, d * 1.6 - (j / items.length) * 0.6))}
        />
      ))}
    </svg>
  );
};
