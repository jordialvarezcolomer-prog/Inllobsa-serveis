// Genera les versions en català (/) i castellà (/es/) a partir de src/template.html
// i dels fitxers de dades de src/. Sense dependències: `node build.mjs`.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, 'public');
const read = (p) => readFileSync(join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));

const template = read('src/template.html');
const site = json('src/site.json');
const team = json('src/team.json');
const reviews = json('src/reviews.json');
const langs = { ca: json('src/i18n/ca.json'), es: json('src/i18n/es.json') };

const escape = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const digits = (s) => String(s).replace(/\D/g, '');
const waLink = (number, text) => `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

function lookup(path, scopes, optional = false) {
  for (const scope of scopes) {
    const value = path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), scope);
    if (value !== undefined) return value;
  }
  if (optional) return undefined;
  throw new Error(`Clau inexistent: ${path}`);
}

// Troba el bloc {{#tag path}} … {{/tag}} més extern, tenint en compte els blocs niats.
function nextBlock(tpl, tag) {
  const open = new RegExp(`\\{\\{#${tag} ([\\w.]+)\\}\\}`, 'g');
  const m = open.exec(tpl);
  if (!m) return null;
  const token = new RegExp(`\\{\\{(#${tag} [\\w.]+|\\/${tag})\\}\\}`, 'g');
  token.lastIndex = m.index + m[0].length;
  let depth = 1, t;
  while ((t = token.exec(tpl))) {
    depth += t[1].startsWith('#') ? 1 : -1;
    if (depth === 0) {
      return { start: m.index, end: token.lastIndex, path: m[1], body: tpl.slice(m.index + m[0].length, t.index) };
    }
  }
  throw new Error(`Bloc {{#${tag} ${m[1]}}} sense tancar`);
}

function render(tpl, scopes) {
  // {{#each path}} … {{/each}}: `this.x` és l'element actual, `this` sol per a llistes de text,
  // {{@num}} és l'índex (01, 02…) i {{@i}} l'índex des de 0. Es poden niuar.
  let b;
  while ((b = nextBlock(tpl, 'each'))) {
    const list = lookup(b.path, scopes);
    if (!Array.isArray(list)) throw new Error(`${b.path} no és una llista`);
    const html = list.map((item, i) => render(
      b.body.replace(/\{\{@num\}\}/g, String(i + 1).padStart(2, '0')).replace(/\{\{@i\}\}/g, String(i)),
      [{ this: item }, ...scopes],
    )).join('');
    tpl = tpl.slice(0, b.start) + html + tpl.slice(b.end);
  }
  // {{#if path}} … {{/if}}: només es mostra si el valor no és buit (una llista buida compta com a buida).
  while ((b = nextBlock(tpl, 'if'))) {
    const v = lookup(b.path, scopes, true);
    const show = Array.isArray(v) ? v.length > 0 : Boolean(v);
    tpl = tpl.slice(0, b.start) + (show ? render(b.body, scopes) : '') + tpl.slice(b.end);
  }
  tpl = tpl.replace(/\{\{\{([\w.@]+)\}\}\}/g, (_, path) => String(lookup(path, scopes)));
  return tpl.replace(/\{\{([\w.@]+)\}\}/g, (_, path) => escape(lookup(path, scopes)));
}

for (const [code, dict] of Object.entries(langs)) {
  const isDefault = code === 'ca';
  const ctx = {
    ...dict,
    hoopSvg: read('src/art/hoop.svg').trim(),
    // Il·lustracions animades dels valors (src/art/*.svg), inserides dins l'HTML
    values: {
      ...dict.values,
      items: dict.values.items.map((it) => ({ ...it, artSvg: read(`src/art/${it.art}.svg`).trim() })),
    },
    services: {
      ...dict.services,
      items: dict.services.items.map((it) => ({ ...it, waHref: waLink(site.whatsapp, `${dict.wa.service} ${it.title}`) })),
    },
    site,
    base: isDefault ? '' : '../',
    otherLang: isDefault ? 'es' : 'ca',
    otherHref: isDefault ? 'es/index.html' : '../index.html',
    links: {
      waGeneral: waLink(site.whatsapp, dict.wa.general),
      waValuation: waLink(site.whatsapp, dict.wa.valuation),
    },
    members: team.map((m) => {
      const role = m.role?.[code] || '';
      return {
        ...m,
        role,
        quote: m.quote?.[code] || '',
        alt: m.name ? [m.name, role].filter(Boolean).join(', ') : dict.team.altFallback,
        waHref: m.phone ? waLink(`34${digits(m.phone)}`, dict.wa.person) : '',
      };
    }),
    // Ressenyes repartides en dues files per al carrusel continu
    reviewRows: [0, 1].map((row) => ({
      items: reviews.filter((_, i) => i % 2 === row).map((r) => ({
        ...r,
        initials: r.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase(),
      })),
    })),
  };
  const html = render(template, [ctx]);
  const dir = isDefault ? out : join(out, code);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
  console.log(`✓ ${join(dir, 'index.html').replace(root + '/', '')}`);
}

// Comprovació: les dues llengües han de tenir exactament les mateixes claus.
const keys = (o, p = '') =>
  Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' ? keys(v, `${p}${k}.`) : [`${p}${k}`]));
const [ca, es] = [keys(langs.ca), keys(langs.es)];
const missing = [...ca.filter((k) => !es.includes(k)), ...es.filter((k) => !ca.includes(k))];
if (missing.length) {
  console.error('Claus no coincidents entre ca i es:', missing);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${['/', '/es/'].map((p) => `  <url>
    <loc>${site.url}${p}</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="ca" href="${site.url}/"/>
    <xhtml:link rel="alternate" hreflang="es" href="${site.url}/es/"/>
  </url>`).join('\n')}
</urlset>
`);
writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
