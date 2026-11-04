import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Mulish: la tipografia de la landing d'Inllobsa (styles.css → --font)
const weights = [300, 400, 500, 600, 700, 800, 900];
export const fontsReady = Promise.all(
  weights.map((w) =>
    loadFont({
      family: "Mulish",
      url: staticFile(`fonts/mulish-latin-${w}-normal.woff2`),
      weight: String(w),
    }),
  ),
);
