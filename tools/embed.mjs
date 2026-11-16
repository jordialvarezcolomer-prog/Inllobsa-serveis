// Genera la versió per integrar dins d'Inmovilla (o qualsevol altra plantilla amb capçalera pròpia):
// un únic fragment HTML (sense <html>, <head> ni <body>) amb estils, JS i imatges a dins.
//  - Tots els estils queden encapsulats dins de #inllobsa, perquè no xoquin amb els de la plantilla
//    amfitriona (.container, .btn, .icon, .section… existeixen a Bootstrap i similars).
//  - Sense logotip a la capçalera (Inmovilla ja en té un) ni botó flotant de WhatsApp.
//  - L'amplada s'adapta al contenidor on s'enganxa; la capçalera no és fixa.
// Ús: node build.mjs && node tools/embed.mjs [carpeta-de-sortida]
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
const outDir = process.argv[2] || join(root, 'standalone');
mkdirSync(outDir, { recursive: true });

const ID = '#inllobsa';

/* ---- Encapsulat del CSS -------------------------------------------------- */
function scopeSelector(sel) {
  sel = sel.trim();
  if (!sel) return sel;
  if (/^(:root|html|body)$/.test(sel)) return ID;
  if (/^(html|body)\s+/.test(sel)) return sel.replace(/^(html|body)\s+/, `${ID} `);
  if (/^\.(js|no-js)(\s|$)/.test(sel)) return sel.replace(/^\.(js|no-js)/, `${ID}.$1`); // classes que van a l'arrel
  if (/^\*/.test(sel)) return `${ID}, ${ID} ${sel}`;
  return `${ID} ${sel}`;
}

function scopeCss(css) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  let out = '';
  let i = 0;
  // Llegeix fins al proper '{' o '}' respectant parèntesis i cometes
  const readUntil = (chars) => {
    let depth = 0, q = null, s = '';
    while (i < css.length) {
      const c = css[i];
      if (q) { if (c === q && css[i - 1] !== '\\') q = null; }
      else if (c === '"' || c === "'") q = c;
      else if (c === '(') depth++;
      else if (c === ')') depth--;
      else if (depth === 0 && chars.includes(c)) break;
      s += c; i++;
    }
    return s;
  };
  const block = (scope) => {
    let res = '';
    while (i < css.length) {
      const head = readUntil('{};');
      const c = css[i];
      if (c === '}') { i++; return res; }
      if (c === ';') { i++; res += head + ';'; continue; }
      if (c !== '{') break;
      i++;
      const h = head.trim();
      if (/^@(media|supports)/.test(h)) res += `${h}{${block(scope)}}`;
      else if (/^@/.test(h)) { // @keyframes, @font-face…: es copien tal qual
        let depth = 1, body = '';
        while (i < css.length && depth) {
          const ch = css[i++];
          if (ch === '{') depth++; else if (ch === '}') { depth--; if (!depth) break; }
          body += ch;
        }
        res += `${h}{${body}}`;
      } else {
        let depth = 1, body = '';
        while (i < css.length && depth) {
          const ch = css[i++];
          if (ch === '{') depth++; else if (ch === '}') { depth--; if (!depth) break; }
          body += ch;
        }
        // separa per comes de primer nivell (fora de parèntesis)
        const sels = []; let d = 0, cur = '';
        for (const ch of h) {
          if (ch === '(') d++; if (ch === ')') d--;
          if (ch === ',' && !d) { sels.push(cur); cur = ''; } else cur += ch;
        }
        sels.push(cur);
        res += `${sels.map(scopeSelector).join(',')}{${body}}`;
      }
    }
    return res;
  };
  out = block('');
  return out;
}

/* ---- Ajustos per a la integració ----------------------------------------- */
const embedCss = `
/* === Integració dins d'una plantilla amfitriona (Inmovilla) === */
#inllobsa { display: block; width: 100%; max-width: 100%; margin: 0; padding: 0; overflow-x: clip; position: relative; text-align: left; }
#inllobsa, #inllobsa * { box-sizing: border-box; }
#inllobsa img, #inllobsa svg { max-width: 100%; }
#inllobsa { --container: 100%; --gutter: clamp(12px, 2.5vw, 24px); --header-h: 72px; }
#inllobsa .container { width: 100%; max-width: var(--container); margin-inline: auto; padding-inline: var(--gutter); float: none; }
#inllobsa .container--wide { max-width: var(--container); }
#inllobsa .site-header { position: relative; top: auto; backdrop-filter: none; background: #fff; border-bottom: 1px solid var(--line); }
#inllobsa .header-inner { justify-content: flex-end; }
#inllobsa .main-nav { gap: 22px; }
#inllobsa .nav-list { gap: 18px; }
#inllobsa .hero { padding-top: 12px; }
#inllobsa .hero-stage { min-height: min(68vh, 640px); }
#inllobsa .topbar-inner { padding-inline: var(--gutter); }
@media (max-width: 1180px) {
  #inllobsa .header-inner { justify-content: flex-end; }
  #inllobsa .main-nav { position: absolute; inset: var(--header-h) 0 auto 0; max-height: none; }
}
`;

/* ---- Imatges i muntatge --------------------------------------------------- */
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
const pick = (rel) => {
  const m = rel.match(/^(.*)-(\d+)\.(jpg|webp)$/);
  if (!m) return rel;
  const preferred = { 'hero-0': 1920, 'equip-banda': 1600, 'solvia-store-vic': 800 };
  const key = Object.keys(preferred).find((k) => m[1].includes(k));
  return `${m[1]}-${key ? preferred[key] : m[2]}.webp`;
};

const css = scopeCss(readFileSync(join(pub, 'assets/css/styles.css'), 'utf8')) + embedCss;
const js = readFileSync(join(pub, 'assets/js/main.js'), 'utf8')
  .replace("const root = document.documentElement;", "const root = document.getElementById('inllobsa');");

const files = { ca: 'inllobsa-ca-inmovilla.html', es: 'inllobsa-es-inmovilla.html' };
// Dins d'Inmovilla les URL de la resta de pàgines no existeixen: el selector d'idioma apunta a l'altre fitxer
for (const [lang, src] of [['ca', 'index.html'], ['es', 'es/index.html']]) {
  const other = lang === 'ca' ? 'es' : 'ca';
  let html = readFileSync(join(pub, src), 'utf8');

  const sprite = html.match(/<svg[^>]*hidden[\s\S]*?<\/svg>|<svg[^>]*width="0"[\s\S]*?<\/svg>/)?.[0] || '';
  let body = html.slice(html.indexOf('<body'), html.lastIndexOf('</body>'));
  body = body.replace(/^<body[^>]*>/, '');
  body = body
    // sense logotip a la capçalera (el de peu es conserva)
    .replace(/<a class="brand" href="#top"[^>]*>[\s\S]*?<\/a>\s*/, '')
    // sense botó flotant de WhatsApp
    .replace(/<a class="wa-float"[\s\S]*?<\/a>\s*/, '')
    .replace(/<a class="skip-link"[^>]*>[^<]*<\/a>/, '')
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/\s(srcset|sizes)="[^"]*"/g, '')
    .replace(/\s*<source type="image\/webp"[^>]*>/g, '')
    .replace(/(src|href)="(?:\.\.\/)?(assets\/img\/[^"]+)"/g, (_, a, rel) => `${a}="${dataUri(pick(rel))}"`)
    .replace(/href="(?:es\/|\.\.\/)index\.html"/g, `href="${files[other]}"`);

  const cssFinal = css.replace(/url\((?:\.\.\/)?(assets\/img\/[^)]+)\)/g, (_, rel) => `url(${dataUri(rel)})`);
  const fragment = `<!-- Inllobsa · versió per integrar a Inmovilla (${lang.toUpperCase()}) -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400&display=swap">
<style>
${cssFinal}
</style>
<div id="inllobsa" class="js" lang="${lang}">
${body.trim()}
</div>
<script>
${js}
</script>
`;
  writeFileSync(join(outDir, files[lang]), fragment);
  console.log(`✓ ${files[lang]} (${(Buffer.byteLength(fragment) / 1024 / 1024).toFixed(2)} MB)`);
}
