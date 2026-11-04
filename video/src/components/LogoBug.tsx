import React from "react";
import { useCurrentFrame } from "remotion";
import { useLayout } from "../lib/layout";
import { FPS, k, TL } from "../lib/time";
import { Logo } from "./Logo";

// Logotip discret a la cantonada durant les escenes de serveis i equip.
const VARIANT: Record<string, "color" | "white" | null> = {
  opening: null,
  sale: "color",
  rent: "white",
  legal: "color",
  shopper: "color",
  marketing: "white",
  team: "white",
  closing: null,
};

export const LogoBug: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const { v } = useLayout();
  const s = TL.scenes.find((x) => t >= x.start && t < x.end);
  if (!s || !VARIANT[s.id]) return null;
  const a = k(t, s.start + 0.5, s.start + 1.0, 0, 1) * (1 - k(t, s.end - 0.6, s.end - 0.3, 0, 1));
  // al grup final de l'equip i a les transicions de màscara, s'amaga
  return (
    <div style={{ position: "absolute", right: v ? 44 : 52, top: v ? 56 : 40, opacity: a * 0.92 }}>
      <Logo width={v ? 190 : 165} variant={VARIANT[s.id]!} />
    </div>
  );
};
