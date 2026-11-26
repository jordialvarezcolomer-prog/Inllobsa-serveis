// Llegeix el XML d'Inmovilla i el serveix com a JSON net a /api/immobles.
// Quan Inmovilla treu un immoble del XML (venut, retirat…), desapareix de la web sola.
// L'URL del XML es pot posar a Netlify com a variable d'entorn INMOVILLA_XML_URL.
const DEFAULT_XML = 'https://procesos.apinmo.com/xml/v2/3d1m6VhR/7168-VITRINIMEDIA.xml';

// Estats de fitxa d'Inmovilla que NO s'han de mostrar (es desconeix què significa el 7: vegeu README).
const HIDDEN_STATES = (process.env.INMOVILLA_HIDE_STATES || '').split(',').map((s) => s.trim()).filter(Boolean);

const TYPE_KEY = {
  'Piso': 'pis', 'Apartamento': 'pis', 'Planta baja': 'pis', 'Dúplex': 'pis', 'Ático Dúplex': 'pis',
  'Adosado': 'casa', 'Casa': 'casa', 'Casa con terreno': 'casa', 'Chalet': 'casa',
  'Local comercial': 'local', 'Nave industrial': 'nau', 'Oficina': 'oficina',
  'Parcela': 'terreny', 'Terreno urbano': 'terreny', 'Parking': 'parking', 'Edificio': 'edifici',
};
const FEATURES = {
  ascensor: 'ascensor', balcon: 'balco', terraza: 'terrassa', jardin: 'jardi', aire_con: 'aire', airecentral: 'aire',
  calefaccion: 'calefaccio', calefacentral: 'calefaccio', plaza_gara: 'garatge', parking: 'garatge', trastero: 'traster',
  muebles: 'moblat', piscina_com: 'piscina', piscina_prop: 'piscina', chimenea: 'xemeneia', solarium: 'solarium',
  luminoso: 'lluminos', cocina_inde: 'cuina', alarma: 'alarma', gasciudad: 'gas', vallado: 'tancat',
};

const decode = (s) => s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&')
  .trim();

function parse(xml) {
  const out = [];
  for (const m of xml.matchAll(/<propiedad>([\s\S]*?)<\/propiedad>/g)) {
    const f = {};
    // Algunes etiquetes porten atributs (p. ex. <foto3 eti="cuina">): s'accepten igualment
    for (const t of m[1].matchAll(/<([a-z0-9_]+)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi)) f[t[1]] = decode(t[2]);
    out.push(f);
  }
  return out;
}

const num = (v) => { const n = parseFloat(String(v ?? '').replace(',', '.')); return Number.isFinite(n) ? n : 0; };

function normalize(f) {
  const acc = (f.accion || '').toLowerCase();
  const sell = acc.includes('vender') || acc.includes('venta');
  const rent = acc.includes('alquil');
  const fotos = [];
  for (let i = 1; i <= 60; i++) if (f[`foto${i}`]) fotos.push(f[`foto${i}`]);
  const feats = new Set();
  for (const [k, v] of Object.entries(FEATURES)) if (num(f[k]) > 0) feats.add(v);
  if (num(f.m_terraza) > 0) feats.add('terrassa');
  return {
    id: f.id,
    ref: f.ref,
    sell, rent,
    preuV: sell ? num(f.precioinmo) : 0,
    preuA: rent ? num(f.precioalq) : 0,
    tipo: f.tipo_ofer,
    tipus: TYPE_KEY[f.tipo_ofer] || 'altres',
    ciutat: f.ciudad,
    zona: f.zona,
    cp: f.cp,
    m2: num(f.m_cons) || num(f.m_uties),
    m2u: num(f.m_uties),
    parcela: num(f.m_parcela),
    hab: Math.round(num(f.habitaciones) + num(f.habdobles)),
    banys: Math.round(num(f.banyos) + num(f.aseos)),
    planta: f.planta && f.planta !== '0' ? f.planta : '',
    any: f.antiguedad && f.antiguedad !== '0' ? f.antiguedad : '',
    estat: f.conservacion || '',
    energia: f.energialetra || '',
    destacat: f.destacado === '1',
    outlet: f.outlet === '1',
    consultar: f.aconsultar === '1',
    lat: num(f.latitud), lng: num(f.altitud),
    data: f.fechaact || f.fecha || '',
    titol: f.titulo1 || '',
    desc: (f.descrip1 || '').replace(/~/g, '\n'),
    fotos,
    features: [...feats],
    estadoficha: f.estadoficha,
  };
}

let cache = { at: 0, body: null };
const TTL = 5 * 60 * 1000;

export default async () => {
  const headers = {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'public, max-age=120, s-maxage=300, stale-while-revalidate=3600',
  };
  try {
    if (!cache.body || Date.now() - cache.at > TTL) {
      const res = await fetch(process.env.INMOVILLA_XML_URL || DEFAULT_XML, { headers: { accept: 'application/xml' } });
      if (!res.ok) throw new Error(`XML ${res.status}`);
      const items = parse(await res.text())
        .filter((f) => !HIDDEN_STATES.includes(f.estadoficha))
        .map(normalize)
        .filter((p) => p.ref && p.fotos.length && (p.sell || p.rent));
      cache = { at: Date.now(), body: JSON.stringify({ updated: new Date().toISOString(), count: items.length, items }) };
    }
    return new Response(cache.body, { headers });
  } catch (err) {
    // Si falla Inmovilla, es serveix l'últim llistat correcte si n'hi ha
    if (cache.body) return new Response(cache.body, { headers });
    return new Response(JSON.stringify({ error: 'unavailable' }), { status: 502, headers: { 'content-type': 'application/json' } });
  }
};

export const config = { path: '/api/immobles' };
