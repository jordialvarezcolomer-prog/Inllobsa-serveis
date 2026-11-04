import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { FPS } from "./time";

/** Dades de maquetació: el vídeo funciona en 16:9 (1920×1080) i 9:16 (1080×1920). */
export const useLayout = () => {
  const { width, height } = useVideoConfig();
  const v = height > width; // vertical
  return { W: width, H: height, v, cx: width / 2, cy: height / 2 };
};

/** Temps absolut (s) de la línia de temps global dins d'una escena que comença a `fromFrame`. */
export const useT = (fromFrame: number) => {
  const f = useCurrentFrame();
  return (f + fromFrame) / FPS;
};

export const Fill: React.FC<React.PropsWithChildren<{ style?: React.CSSProperties }>> = ({ children, style }) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", ...style }}>{children}</div>
);
