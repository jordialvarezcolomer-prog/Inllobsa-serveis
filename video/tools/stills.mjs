// Renderitza fotogrames de prova: node tools/stills.mjs <composició> <sortida_dir> <frame1,frame2,...> [escala]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const [comp = "Inllobsa-16x9", out = "out/stills", list = "0", scale = "0.5"] = process.argv.slice(2);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const serveUrl = process.env.BUNDLE || (await bundle({ entryPoint: path.join(root, "src/index.ts"), publicDir: path.join(root, "public") }));
const browserExecutable = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const browser = await openBrowser("chrome", { browserExecutable });
const composition = await selectComposition({ serveUrl, id: comp, puppeteerInstance: browser });
fs.mkdirSync(out, { recursive: true });
for (const f of list.split(",").map(Number)) {
  const output = path.join(out, `${comp}-${String(f).padStart(4, "0")}.png`);
  await renderStill({ serveUrl, composition, frame: f, output, scale: Number(scale), puppeteerInstance: browser });
  console.log(output);
}
await browser.close({ silent: true });
