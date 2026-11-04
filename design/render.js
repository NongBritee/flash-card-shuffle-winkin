// Render card SVGs to cards/*.webp
// usage: node design/render.js   (needs playwright + python3 Pillow)
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

(async () => {
  const root = path.resolve(__dirname, '..');
  const out = path.join(root, 'cards');
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'cards-'));
  fs.mkdirSync(out, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, 'cards.html') + '#render');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);

  const ids = await page.$$eval('#sheet svg', els => els.map(e => e.id));
  for (const id of ids) {
    const png = path.join(tmp, id + '.png');
    await page.locator('#' + id).screenshot({ path: png, omitBackground: true });
    const name = id.replace(/^card-/, '');
    const webp = path.join(out, name + '.webp');
    execFileSync('python3', ['-c',
      'import sys;from PIL import Image;im=Image.open(sys.argv[1]).convert("RGBA");im.save(sys.argv[2],"WEBP",quality=86,method=6)',
      png, webp]);
    console.log('wrote', path.relative(root, webp), fs.statSync(webp).size, 'bytes');
  }
  await browser.close();
})();
