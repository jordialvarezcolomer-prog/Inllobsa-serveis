// Genera una versió de la web en un sol fitxer HTML per idioma (CSS, JS i imatges a dins),
// per enganxar-la o pujar-la allà on no es poden afegir fitxers a part.
// Ús: node build.mjs && node tools/standalone.mjs [carpeta-de-sortida]
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
const outDir = process.argv[2] || join(root, 'standalone');
mkdirSync(outDir, { recursive: true });

const css = readFileSync(join(pub, 'assets/css/styles.css'), 'utf8');
const js = readFileSync(join(pub, 'assets/js/main.js'), 'utf8');
const mime = { '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml' };
const cache = new Map();
const dataUri = (rel) => {
  if (!cache.has(rel)) {
    const file = join(pub, rel);
    if (!existsSync(file)) throw new Error(`No existeix ${rel}`);
    cache.set(rel, `data:${mime[extname(rel)]};base64,${readFileSync(file).toString('base64')}`);
  }
  return cache.get(rel);
};

// Per a cada imatge, la versió que s'incrusta (una sola mida, en WebP quan n'hi ha)
const pick = (rel) => {
  const m = rel.match(/^(.*)-(\d+)\.(jpg|webp)$/);
  if (!m) return rel;
  const preferred = { 'hero-0': 1920, 'equip-banda': 1600, 'solvia-store-vic': 800 };
  const key = Object.keys(preferred).find((k) => m[1].includes(k));
  const size = key ? preferred[key] : m[2];
  return `${m[1]}-${size}.webp`;
};

const files = { ca: 'inllobsa-ca.html', es: 'inllobsa-es.html' };
for (const [lang, src] of [['ca', 'index.html'], ['es', 'es/index.html']]) {
  let html = readFileSync(join(pub, src), 'utf8');
  const other = lang === 'ca' ? 'es' : 'ca';

  html = html
    // estils i script a dins del document
    .replace(/<link rel="stylesheet" href="[^"]*styles\.css">/, () => `<style>\n${css}\n</style>`)
    .replace(/\s*<script src="[^"]*main\.js" defer><\/script>/, '')
    .replace('</body>', () => `<script>\n${js}\n</script>\n</body>`)
    // el preload i les fonts alternatives (<source>, srcset) ja no calen: s'incrusta una sola imatge
    .replace(/\s*<link rel="preload" as="image"[^>]*>/, '')
    .replace(/\s*<source type="image\/webp"[^>]*>/g, '')
    .replace(/\s(srcset|sizes)="[^"]*"/g, '')
    // imatges com a data URI
    .replace(/(src|href)="(?:\.\.\/)?(assets\/img\/[^"]+)"/g, (_, attr, rel) => `${attr}="${dataUri(pick(rel))}"`)
    .replace(/url\((?:\.\.\/)?(assets\/img\/[^)]+)\)/g, (_, rel) => `url(${dataUri(rel)})`)
    // el canvi d'idioma apunta a l'altre fitxer
    .replace(/href="(?:es\/|\.\.\/)index\.html"/g, `href="${files[other]}"`);

  writeFileSync(join(outDir, files[lang]), html);
  console.log(`✓ ${files[lang]} (${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MB)`);
}
