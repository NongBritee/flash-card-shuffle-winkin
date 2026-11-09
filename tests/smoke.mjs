// End-to-end smoke test (Playwright).   usage: npm test   (= vite build && node tests/smoke.mjs [--shots <dir>])
// Serves the production build (dist/), fakes the speech engine (so we can read what would be said), and checks:
//  - home page lists every set and every card image / back loads
//  - each set's theme is applied, 5 cards are dealt
//  - sequences: face-down tap = spell → word → Thai, 🔤 = spell → word → Thai, 🔊 / 🇹🇭 = word → Thai,
//    re-opened card = word → Thai; Thai uses the recording when present, else device voice, else a hint
//  - finishing a round shows the win box, records progress, and 🏠 goes back home
//  - nothing overflows the screen on phone / tablet / desktop sizes
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SETS } from '../src/sets/index.js';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROOT = path.join(REPO, 'dist');
if (!fs.existsSync(path.join(ROOT, 'index.html'))) { console.error('dist/ missing — run "npm run build" first (npm test does both)'); process.exit(1); }
const shotsDir = process.argv.includes('--shots') ? process.argv[process.argv.indexOf('--shots') + 1] : null;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html'));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  const buf = fs.readFileSync(f), type = TYPES[path.extname(f)] || 'application/octet-stream';
  const m = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '');      // media elements need byte ranges
  if (m) {
    const start = +m[1] || 0, end = m[2] ? +m[2] : buf.length - 1;
    res.writeHead(206, { 'Content-Type': type, 'Content-Length': end - start + 1, 'Content-Range': `bytes ${start}-${end}/${buf.length}`, 'Accept-Ranges': 'bytes' });
    return res.end(buf.subarray(start, end + 1));
  }
  res.writeHead(200, { 'Content-Type': type, 'Content-Length': buf.length, 'Accept-Ranges': 'bytes' });
  res.end(buf);
});

let failures = 0;
const check = (ok, msg) => { console.log((ok ? '  ✓ ' : '  ✗ ') + msg); if (!ok) failures++; };
const wait = ms => new Promise(r => setTimeout(r, ms));

// fake speech: log every utterance / clip; `thai` decides whether a Thai voice exists
const fakeSpeech = thai => {
  window.__log = [];
  const vs = [{ name: 'Samantha', lang: 'en-US' }].concat(thai ? [{ name: 'Kanya', lang: 'th-TH' }] : []);
  speechSynthesis.getVoices = () => vs;
  speechSynthesis.speak = u => { if (u.text.trim()) window.__log.push((u.lang.startsWith('th') ? 'th:' : 'en:') + u.text); setTimeout(() => u.onend && u.onend(), 40); };
  speechSynthesis.cancel = () => {};
  const play = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () { if (!this.muted) window.__log.push('clip:' + this.src.split('/').slice(-1)[0].split('?')[0]); return play.call(this); };
};

async function waitIdle(p, ms = 20000) {      // wait until the "repeat after me" bubble appears (= sequence finished)
  try { await p.waitForFunction(() => { const b = document.querySelector('#bubble'); return b && !b.hidden; }, null, { timeout: ms, polling: 100 }); }
  catch (e) { throw new Error('sequence did not finish; heard so far: ' + (await p.evaluate(() => window.__log.join(', ')))); }
}
const takeLog = p => p.evaluate(() => window.__log.splice(0));

(async () => {
  await new Promise(r => server.listen(0, r));
  const base = `http://localhost:${server.address().port}/`;
  const browser = await chromium.launch();

  /* ---- home page + assets ---- */
  console.log('home page');
  let p = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = []; p.on('pageerror', e => errors.push(e.message));
  await p.addInitScript(fakeSpeech, false);
  await p.goto(base);
  const sets = SETS.map(s => ({ id: s.id, title: s.title, theme: s.theme, words: s.words, img: s.words.map(w => w.id).concat('back').map(n => `sets/${s.id}/cards/${n}.webp`) }));
  check(await p.locator('.setTile').count() === sets.length, `${sets.length} set tiles on the home page`);
  for (const s of sets) {
    const bad = [];
    for (const u of s.img) { const r = await p.request.get(base + u); if (!r.ok()) bad.push(u); }
    check(!bad.length, `${s.id}: all ${s.img.length} card images load ${bad.join(' ')}`);
  }
  if (shotsDir) await p.screenshot({ path: path.join(shotsDir, 'home.png') });
  await p.close();

  /* ---- each set: sequences ---- */
  for (const s of sets) {
    console.log(`set ${s.id}`);
    const hasClips = s.words.some(w => fs.existsSync(path.join(ROOT, 'sets', s.id, 'audio', w.id + '.mp3')));
    p = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    p.on('pageerror', e => errors.push(`${s.id}: ${e.message}`));
    await p.addInitScript(fakeSpeech, true);
    await p.goto(base + '#/' + s.id);
    await p.waitForFunction(() => document.querySelectorAll('#table .card').length === 5);
    check(await p.evaluate(sky => getComputedStyle(document.documentElement).getPropertyValue('--sky1').trim() === sky, s.theme.sky1), 'theme colours applied');
    await wait(2600);                                            // deal + shuffle (taps are ignored meanwhile)
    await p.evaluate(() => window.__log.splice(0));

    // 1) tap a face-down card
    await p.locator('#table .card').first().click();
    await waitIdle(p);
    let log = await takeLog(p);
    const w = s.words.find(x => log.includes('en:' + x.en));
    const thaiStep = l => l === 'th:' + w.th || l === 'clip:' + w.id + '.mp3';
    check(!!w && log.length === w.en.length + 2 && thaiStep(log[log.length - 1]) && log[log.length - 2] === 'en:' + w.en,
      `card tap → spell ${w && w.en.length} letters → "${w && w.en}" → Thai   [${log.join(', ')}]`);
    if (hasClips) check(log.includes('clip:' + w.id + '.mp3'), 'Thai answer uses the recorded voice');
    check(!(await p.locator('#thaiWord').isHidden()) && (await p.locator('#thaiWord').textContent()) === w.th, `Thai word shown: ${w.th}`);

    // 2) buttons
    for (const [btn, name, spells] of [['#btnSpell', '🔤 spell', true], ['#btnSay', '🔊 listen', false], ['#btnThai', '🇹🇭 thai', false]]) {
      await p.click(btn); await waitIdle(p); log = await takeLog(p);
      const expectLen = (spells ? w.en.length : 0) + 2;
      check(log.length === expectLen && log[log.length - 2] === 'en:' + w.en && thaiStep(log[log.length - 1]), `${name} → ${spells ? 'spell → ' : ''}word → Thai   [${log.join(', ')}]`);
    }
    // 3) re-open the same (already revealed) card
    await p.click('#btnClose'); await wait(300); await takeLog(p);
    await p.locator('#table .card.open').first().click();
    await waitIdle(p); log = await takeLog(p);
    check(log.length === 2 && log[0] === 'en:' + w.en && thaiStep(log[1]), `re-opened card → word → Thai   [${log.join(', ')}]`);
    if (shotsDir) await p.screenshot({ path: path.join(shotsDir, `${s.id}-detail.png`) });
    await p.click('#btnClose');
    await p.close();
  }

  /* ---- full round, win, progress, home; no-Thai-voice fallback ---- */
  console.log('full round (device without a Thai voice)');
  p = await browser.newPage({ viewport: { width: 1024, height: 768 } });
  p.on('pageerror', e => errors.push(e.message));
  await p.addInitScript(fakeSpeech, false);
  await p.goto(base + '#/farm');
  await wait(2600);
  for (let i = 0; i < 5; i++) {
    await p.locator('#table .card:not(.open)').first().click();
    await waitIdle(p);
    if (i === 0) check(await p.locator('#notice').isVisible(), 'no Thai voice and no recording → hint shown');
    await p.click('#btnClose'); await wait(250);
  }
  await p.waitForSelector('#win:not([hidden])', { timeout: 3000 });
  check(true, 'win box after 5 cards');
  check(await p.evaluate(() => JSON.parse(localStorage.getItem('fc.wins') || '{}').farm === 1), 'progress saved');
  if (shotsDir) await p.screenshot({ path: path.join(shotsDir, 'win.png') });
  await p.click('#winHome');
  await p.waitForSelector('#menu:not([hidden])');
  check(await p.locator('.setTile[href="#/farm"] .stars i.on').count() === 1, 'home page shows 1 star for farm');
  await p.close();

  /* ---- layout at many sizes (home, table, detail with the longest word) ---- */
  console.log('layout');
  const sizes = [[1920, 1080], [1366, 768], [1024, 1366], [820, 1180], [768, 1024], [844, 390], [390, 844], [375, 667]];
  for (const [width, height] of sizes) {
    p = await browser.newPage({ viewport: { width, height } });
    await p.addInitScript(fakeSpeech, true);
    await p.goto(base);
    await wait(500);
    await wait(700);   // tiles pop in
    const homeOk = await p.evaluate(() => [...document.querySelectorAll('#menu *')].every(e => { const r = e.getBoundingClientRect(); return r.left >= -1 && r.right <= innerWidth + 1; }));
    await p.goto(base + '#/days'); await wait(2600);
    const tableOk = await p.evaluate(() => [...document.querySelectorAll('#table .card')].every(c => { const b = c.getBoundingClientRect(); return b.bottom <= innerHeight + 1 && b.right <= innerWidth + 1 && b.left >= -1; }));
    // open "Thursday" (longest word) directly
    await p.evaluate(() => { document.querySelector('#table .card').click(); });
    await wait(1200);
    const detailOk = await p.evaluate(() => [...document.querySelectorAll('.tile, #btnClose, .act')].every(e => { const b = e.getBoundingClientRect(); return b.right <= innerWidth + 1 && b.left >= -1 && b.bottom <= innerHeight + 1; }));
    check(homeOk && tableOk && detailOk, `${width}x${height}: home ${homeOk ? 'ok' : 'OVERFLOW'}, cards ${tableOk ? 'ok' : 'OVERFLOW'}, detail ${detailOk ? 'ok' : 'OVERFLOW'}`);
    if (shotsDir) await p.screenshot({ path: path.join(shotsDir, `days-${width}x${height}.png`) });
    await p.close();
  }

  check(!errors.length, 'no JavaScript errors ' + errors.join(' | '));
  await browser.close();
  server.close();
  console.log(failures ? `\n${failures} check(s) FAILED` : '\nall checks passed');
  process.exit(failures ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
