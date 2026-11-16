// Servidor local per veure la web amb la funció /api/immobles: node build.mjs && node tools/dev.mjs [port]
// Per provar sense xarxa: INMOVILLA_XML_FILE=ruta/al/fitxer.xml node tools/dev.mjs
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
const port = Number(process.argv[2]) || 8080;
if (process.env.INMOVILLA_XML_FILE) {
  globalThis.fetch = async () => new Response(readFileSync(process.env.INMOVILLA_XML_FILE, 'utf8'));
}
const { default: immobles } = await import('../netlify/functions/immobles.mjs');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.xml': 'application/xml', '.txt': 'text/plain' };

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/api/immobles') {
    const r = await immobles();
    res.writeHead(r.status, Object.fromEntries(r.headers));
    return res.end(await r.text());
  }
  let file = join(pub, decodeURIComponent(url.pathname));
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file)) { res.writeHead(404); return res.end('404'); }
  res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
}).listen(port, () => console.log(`http://localhost:${port}`));
