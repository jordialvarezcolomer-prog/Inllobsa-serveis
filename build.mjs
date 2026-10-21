// Genera les versions en català (/) i castellà (/es/) a partir de src/template.html
// i dels fitxers de traducció de src/i18n. Sense dependències: `node build.mjs`.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, 'public');
const read = (p) => readFileSync(join(root, p), 'utf8');

const template = read('src/template.html');
const site = JSON.parse(read('src/site.json'));
const team = JSON.parse(read('src/team.json'));
const langs = {
  ca: JSON.parse(read('src/i18n/ca.json')),
  es: JSON.parse(read('src/i18n/es.json')),
};

const escape = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function lookup(path, scopes, optional = false) {
  for (const scope of scopes) {
    const value = path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), scope);
    if (value !== undefined) return value;
  }
  if (optional) return undefined;
  throw new Error(`Clau de traducció inexistent: ${path}`);
}

function render(tpl, scopes) {
  // {{#each path}} … {{/each}}: `this.x` fa referència a l'element; {{@num}} és l'índex 01, 02…
  tpl = tpl.replace(/\{\{#each ([\w.]+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (_, path, body) => {
    const list = lookup(path, scopes);
    if (!Array.isArray(list)) throw new Error(`${path} no és una llista`);
    return list
      .map((item, i) => render(body.replace(/\{\{@num\}\}/g, String(i + 1).padStart(2, '0')), [{ this: item }, ...scopes]))
      .join('');
  });
  // {{#if path}} … {{/if}}: es mostra només si el valor no és buit (sense niuar)
  tpl = tpl.replace(/\{\{#if ([\w.]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, path, body) =>
    (lookup(path, scopes, true) ? body : ''));
  tpl = tpl.replace(/\{\{\{([\w.@]+)\}\}\}/g, (_, path) => String(lookup(path, scopes)));
  return tpl.replace(/\{\{([\w.@]+)\}\}/g, (_, path) => escape(lookup(path, scopes)));
}

for (const [code, dict] of Object.entries(langs)) {
  const isDefault = code === 'ca';
  const other = isDefault ? 'es' : 'ca';
  const ctx = {
    ...dict,
    site,
    base: isDefault ? '' : '../',
    otherLang: other,
    otherHref: isDefault ? 'es/' : '../',
    members: team.map((m) => {
      const role = m.role?.[code] || '';
      return { photo: m.photo, name: m.name, role, alt: m.name ? [m.name, role].filter(Boolean).join(', ') : dict.team.altFallback };
    }),
  };
  const html = render(template, [ctx]);
  const dir = isDefault ? out : join(out, code);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
  console.log(`✓ ${join(dir, 'index.html').replace(root + '/', '')}`);
}

// Comprovació: les dues llengües han de tenir exactament les mateixes claus.
const keys = (o, p = '') =>
  Object.entries(o).flatMap(([k, v]) =>
    v && typeof v === 'object' ? keys(v, `${p}${k}.`) : [`${p}${k}`]);
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
