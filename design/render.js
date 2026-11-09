// Render card SVGs to public/sets/<id>/cards/*.webp
// usage: npm run cards [-- setId ...]   (needs playwright + python3 Pillow)
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SETS } from '../src/sets/index.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2' };

// the preview page uses ES modules, which need http:// (not file://)
const server = http.createServer((req, res) => {
  const f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
  res.end(fs.readFileSync(f));
});

const ids = process.argv.slice(2).length ? process.argv.slice(2) : SETS.map(s => s.id);
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}`;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cards-'));
const browser = await chromium.launch();
try {
  for (const id of ids) {
    const out = path.join(ROOT, 'public', 'sets', id, 'cards');
    fs.mkdirSync(out, { recursive: true });
    const page = await browser.newPage({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 2 });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(`${base}/design/cards.html?set=${id}#render`);
    await page.waitForFunction(() => window.READY);
    const names = await page.evaluate(() => window.READY);
    await page.waitForTimeout(200);
    if (errors.length) throw new Error(id + ': ' + errors.join('; '));
    for (const name of names) {
      const png = path.join(tmp, `${id}-${name}.png`);
      await page.locator('#card-' + name).screenshot({ path: png, omitBackground: true });
      const webp = path.join(out, name + '.webp');
      execFileSync('python3', ['-c',
        'import sys;from PIL import Image;im=Image.open(sys.argv[1]).convert("RGBA");im.save(sys.argv[2],"WEBP",quality=86,method=6)',
        png, webp]);
      console.log('wrote', path.relative(ROOT, webp), fs.statSync(webp).size, 'bytes');
    }
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}
