// Render card SVGs to sets/<id>/cards/*.webp
// usage: node design/render.js [setId ...]   (needs playwright + python3 Pillow)
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ALL = ['weather', 'days', 'things', 'home', 'animals', 'farm'];

(async () => {
  const root = path.resolve(__dirname, '..');
  const ids = process.argv.slice(2).length ? process.argv.slice(2) : ALL;
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cards-'));
  const browser = await chromium.launch();
  for (const id of ids) {
    const out = path.join(root, 'sets', id, 'cards');
    fs.mkdirSync(out, { recursive: true });
    const page = await browser.newPage({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 2 });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('file://' + path.join(__dirname, 'cards.html') + `?set=${id}#render`);
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
      console.log('wrote', path.relative(root, webp), fs.statSync(webp).size, 'bytes');
    }
    await page.close();
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
