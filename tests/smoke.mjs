// End-to-end smoke test (Playwright).   usage: npm test   (= vite build && node tests/smoke.mjs [--shots <dir>])
// Serves the production build (dist/), fakes the speech engine (so we can read what would be said), and checks:
//  - home page lists every set and every card image / back loads
//  - each set's theme is applied, 5 cards are dealt
//  - sequences: face-down tap = spell → word (Thai stays covered), 🔤 = spell → word, 🔊 = word, re-opened card = word,
//    🇹🇭 / sticker = word → Thai (recording when present, else device voice, else a hint)
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

// the child's name is asked first; most tests start with one already saved
const withName = () => { try { localStorage.setItem('fc.name', 'น้องทดสอบ'); } catch (e) {} };

// fake speech: log every utterance / clip; `thai` decides whether a Thai voice exists
const fakeSpeech = arg => {                                       // arg: true/false (Thai voice?) or { thai, blocked }
  const thai = typeof arg === 'object' ? arg.thai : arg, blocked = typeof arg === 'object' && !!arg.blocked;
  window.__log = []; window.__primed = 0;
  const vs = [{ name: 'Samantha', lang: 'en-US' }].concat(thai ? [{ name: 'Kanya', lang: 'th-TH' }] : []);
  speechSynthesis.getVoices = () => vs;
  speechSynthesis.speak = u => {
    if (u.volume === 0) { window.__primed++; return; }            // the silent "wake-up" utterance sent on every tap
    if (blocked) return;                                           // iOS without a fresh tap: nothing starts, nothing ends
    if (u.text.trim()) window.__log.push((u.lang.startsWith('th') ? 'th:' : 'en:') + u.text);
    setTimeout(() => { u.onstart && u.onstart(); setTimeout(() => u.onend && u.onend(), 40); }, 10);
  };
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

  /* ---- name screen: asked before starting, min 2 characters, remembered ---- */
  console.log('name screen');
  let p = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = []; p.on('pageerror', e => errors.push(e.message));
  await p.addInitScript(fakeSpeech, false);
  await p.goto(base);
  check(await p.locator('#gate').isVisible() && !(await p.locator('#menu').count()), 'first visit shows the name screen before the sets');
  if (shotsDir) await p.screenshot({ path: path.join(shotsDir, 'name.png') });
  await p.fill('#childName', 'ก'); await p.click('.gateBtns .done');
  check(await p.locator('#gate').isVisible() && /อย่างน้อย 2/.test(await p.locator('#nameHint').textContent()) && await p.evaluate(() => !localStorage.getItem('fc.name')),
    '1 character is rejected and not saved');
  await p.fill('#childName', '  '); await p.click('.gateBtns .done');
  check(await p.locator('#gate').isVisible(), 'blank / spaces only are rejected');
  await p.fill('#childName', 'น้องบี'); await p.press('#childName', 'Enter');
  await p.waitForSelector('#menu');
  check(await p.evaluate(() => localStorage.getItem('fc.name')) === 'น้องบี', 'valid name saved in localStorage');
  check((await p.locator('#greet').textContent()).includes('น้องบี'), 'home page greets the child by name');
  await p.reload();
  await p.waitForSelector('#menu');
  check(await p.locator('#gate').count() === 0 && (await p.locator('#greet').textContent()).includes('น้องบี'), 'name remembered after reload (no name screen)');
  await p.click('#changeName');
  check(await p.locator('#gate').isVisible() && await p.inputValue('#childName') === 'น้องบี', '✏️ opens the name screen with the saved name');
  await p.fill('#childName', 'Mia'); await p.press('#childName', 'Enter');
  await p.waitForSelector('#menu');
  check((await p.locator('#greet').textContent()).includes('Mia'), 'name can be changed');

  /* ---- locked sets: only the first 2 are playable, ?allow=all opens everything ---- */
  console.log('locked sets');
  const tiles = await p.locator('.setTile').count();
  check(tiles === SETS.length, `${SETS.length} set tiles shown`);
  check(await p.locator('.setTile.locked').count() === SETS.length - 2 && await p.locator('a.setTile').count() === 2, 'sets 1-2 playable, the other sets are shown but locked');
  if (shotsDir) await p.screenshot({ path: path.join(shotsDir, 'home.png') });
  await wait(900);                                             // tiles pop in
  await p.locator('.setTile.locked').first().click({ force: true });   // aria-disabled (still tappable on purpose: it explains why)
  check(await p.locator('#popup').isVisible() && (await p.locator('#popup').textContent()).includes('ยังไม่เปิดใช้งาน') && !/#\/\w/.test(await p.evaluate(() => location.hash)),
    'clicking a locked set shows "ยังไม่เปิดใช้งาน" and does not open it');
  if (shotsDir) await p.screenshot({ path: path.join(shotsDir, 'locked-popup.png') });
  await p.click('#popup .done');
  check(await p.locator('#popup').count() === 0, 'popup closes');
  await p.goto(base + '#/farm'); await p.waitForSelector('#popup');
  check(await p.locator('#menu').isVisible() && await p.locator('#table').count() === 0, 'opening a locked set by URL goes back home with the popup');
  await p.goto(base + '?allow=all'); await p.waitForSelector('#menu');
  check(await p.locator('.setTile.locked').count() === 0 && await p.locator('a.setTile').count() === SETS.length, '?allow=all unlocks every set');

  /* ---- assets ---- */
  console.log('card images');
  const sets = SETS.map(s => ({ id: s.id, title: s.title, theme: s.theme, words: s.words, img: s.words.map(w => w.id).concat('back').map(n => `sets/${s.id}/cards/${n}.webp`) }));
  for (const s of sets) {
    const bad = [];
    for (const u of s.img) { const r = await p.request.get(base + u); if (!r.ok()) bad.push(u); }
    check(!bad.length, `${s.id}: all ${s.img.length} card images load ${bad.join(' ')}`);
  }
  await p.close();

  /* ---- each set: sequences ---- */
  for (const s of sets) {
    console.log(`set ${s.id}`);
    const hasClips = s.words.some(w => fs.existsSync(path.join(ROOT, 'sets', s.id, 'audio', w.id + '.mp3')));
    p = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    p.on('pageerror', e => errors.push(`${s.id}: ${e.message}`));
    await p.addInitScript(withName);
    await p.addInitScript(fakeSpeech, true);
    await p.goto(base + '?allow=all#/' + s.id);
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
    check(!!w && log.length === w.en.length + 1 && log[log.length - 1] === 'en:' + w.en,
      `card tap → spell ${w && w.en.length} letters → "${w && w.en}" and stops   [${log.join(', ')}]`);
    check(await p.locator('#thaiWord').isHidden() && await p.locator('#cover').isVisible(), 'Thai label NOT opened automatically (pink sticker still on)');

    // 2) buttons
    for (const [btn, name, spells] of [['#btnSpell', '🔤 spell', true], ['#btnSay', '🔊 listen', false]]) {
      await p.click(btn); await waitIdle(p); log = await takeLog(p);
      const expectLen = (spells ? w.en.length : 0) + 1;
      check(log.length === expectLen && log[log.length - 1] === 'en:' + w.en && await p.locator('#thaiWord').isHidden(), `${name} → ${spells ? 'spell → ' : ''}word, Thai still covered   [${log.join(', ')}]`);
    }
    // the child presses the sticker / 🇹🇭 → word → Thai
    await p.click('#btnThai'); await waitIdle(p); log = await takeLog(p);
    check(log.length === 2 && log[0] === 'en:' + w.en && thaiStep(log[1]) && !(await p.locator('#thaiWord').isHidden()) && (await p.locator('#thaiWord').textContent()) === w.th,
      `🇹🇭 → word → Thai label opens (${w.th})   [${log.join(', ')}]`);
    if (hasClips) check(log.includes('clip:' + w.id + '.mp3'), 'Thai answer uses the recorded voice');
    // once revealed, the other buttons continue word → Thai
    await p.click('#btnSay'); await waitIdle(p); log = await takeLog(p);
    check(log.length === 2 && log[0] === 'en:' + w.en && thaiStep(log[1]), `after the reveal 🔊 → word → Thai   [${log.join(', ')}]`);
    // 3) re-open the same (already revealed) card
    await p.click('#btnClose'); await wait(300); await takeLog(p);
    await p.locator('#table .card.open').first().click();
    await waitIdle(p); log = await takeLog(p);
    check(log.length === 1 && log[0] === 'en:' + w.en && await p.locator('#thaiWord').isHidden() && await p.locator('#cover').isVisible(),
      `re-opened card → English word only, Thai stays covered   [${log.join(', ')}]`);
    await p.locator('.cardBig').click({ position: { x: 25, y: 25 } });     // top-left corner of the card, nowhere near the sticker
    await waitIdle(p); log = await takeLog(p);
    check(log.length === 2 && log[0] === 'en:' + w.en && thaiStep(log[1]) && !(await p.locator('#thaiWord').isHidden()), `tapping anywhere on the card → word → Thai   [${log.join(', ')}]`);
    if (shotsDir) await p.screenshot({ path: path.join(shotsDir, `${s.id}-detail.png`) });
    await p.click('#btnClose');
    await p.close();
  }

  /* ---- full round: table stays, 3 stars, review with the answer revealed; no-Thai-voice fallback ---- */
  console.log('full round (device without a Thai voice)');
  p = await browser.newPage({ viewport: { width: 1024, height: 768 } });
  p.on('pageerror', e => errors.push(e.message));
  await p.addInitScript(withName);
  await p.addInitScript(fakeSpeech, false);
  await p.goto(base + '?allow=all#/farm');
  await wait(2600);
  for (let i = 0; i < 5; i++) {
    await p.locator('#table .card:not(.open)').first().click();
    await waitIdle(p);
    if (i === 0) {
      check(await p.locator('#notice').count() === 0 || await p.locator('#notice').isHidden(), 'no hint before the child asks for the Thai answer');
      await p.click('#btnThai'); await waitIdle(p);
      check(await p.locator('#notice').isVisible(), 'no Thai voice and no recording → hint shown when the answer is revealed');
    }
    if (i < 4) check(await p.locator('#finish').count() === 0, `after card ${i + 1}: not finished yet`);
    await p.click('#btnClose'); await wait(250);
  }
  await p.waitForSelector('#finish', { timeout: 3000 });
  const cardsAfter = await p.evaluate(() => [...document.querySelectorAll('#table .card')].map(c => { const r = c.getBoundingClientRect(); return r.width > 40 && r.bottom <= innerHeight + 1; }));
  check(await p.locator('#detail').count() === 0 && await p.locator('#popup').count() === 0 && cardsAfter.length === 5 && cardsAfter.every(Boolean),
    'after the 5th card the 5 cards stay on screen (no blocking popup)');
  check((await p.locator('#finish').textContent()).includes('น้องทดสอบ') && (await p.locator('#finish .winStars').textContent()) === '⭐⭐⭐', 'finish bar: praise with the name + 3 stars');
  check(await p.locator('#finish #winHome').isVisible() && await p.locator('#finish #again').isVisible(), 'buttons to choose another set / play again');
  check(await p.evaluate(() => JSON.parse(localStorage.getItem('fc.wins') || '{}').farm === 3), '3 stars saved');
  if (shotsDir) await p.screenshot({ path: path.join(shotsDir, 'win.png') });
  // review one card: the answer is already revealed (no need to press anything)
  await takeLog(p);
  await p.locator('#table .card').nth(1).click();
  await waitIdle(p);
  const log = await takeLog(p);
  check(log.length === 1 && log[0].startsWith('en:') && !(await p.locator('#thaiWord').isHidden()) && await p.locator('#cover').isHidden(),
    `review after finishing → English word, Thai answer already shown (no cover)   [${log.join(', ')}]`);
  await p.click('#btnClose'); await wait(500);
  check(await p.locator('#finish').isVisible() && await p.evaluate(() => JSON.parse(localStorage.getItem('fc.wins')).farm === 3), 'closing a review keeps the finish bar, stars stay at 3');
  await p.click('#winHome');
  await p.waitForSelector('#menu');
  check(await p.locator('.setTile[href="#/farm"] .stars i.on').count() === 3, 'home page shows 3 stars for farm');
  // play again resets the covers
  await p.goto(base + '?allow=all#/farm'); await wait(2600);
  await p.locator('#table .card').first().click(); await waitIdle(p);
  check(await p.locator('#thaiWord').isHidden() && await p.locator('#cover').isVisible(), 'new round works after finishing (Thai covered again)');
  await p.close();

  /* ---- iOS-style speech: wake-up on every tap, hint when the browser refuses to speak ---- */
  console.log('iOS-style speech');
  p = await browser.newPage({ viewport: { width: 390, height: 844 } });
  p.on('pageerror', e => errors.push(e.message));
  await p.addInitScript(withName);
  await p.addInitScript(fakeSpeech, true);
  await p.goto(base + '#/weather');
  await wait(2600);
  const before = await p.evaluate(() => window.__primed);
  await p.locator('#table .card').first().click();
  check(await p.evaluate(b => window.__primed > b, before), 'every tap wakes the speech engine with a silent utterance');
  await waitIdle(p);
  check(await p.locator('#soundHint').count() === 0, 'speech works → no "can\'t hear?" hint');
  // sticker text is centred inside the pink pill (phone size)
  const off = await p.evaluate(() => { const c = document.querySelector('#cover'), r = c.getBoundingClientRect(); const rg = document.createRange(); rg.selectNodeContents(c); const t = rg.getBoundingClientRect(); return Math.abs((t.top + t.bottom) / 2 - (r.top + r.bottom) / 2); });
  check(off <= 3, `sticker text vertically centred on a phone (off by ${off.toFixed(1)}px)`);
  if (shotsDir) await p.screenshot({ path: path.join(shotsDir, 'phone-detail.png') });
  await p.close();
  p = await browser.newPage({ viewport: { width: 390, height: 844 } });
  p.on('pageerror', e => errors.push(e.message));
  await p.addInitScript(withName);
  await p.addInitScript(fakeSpeech, { thai: true, blocked: true });
  await p.goto(base + '#/weather');
  await wait(2600);
  await p.locator('#table .card').first().click();
  await p.waitForSelector('#soundHint', { timeout: 8000 });
  check(true, 'speech refused by the browser → hint to press 🔤 สะกด is shown');
  await p.close();

  /* ---- review after finishing, with a recorded voice ---- */
  console.log('review with the recorded voice (weather)');
  p = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  p.on('pageerror', e => errors.push(e.message));
  await p.addInitScript(withName);
  await p.addInitScript(fakeSpeech, true);
  await p.goto(base + '#/weather');                     // no ?allow needed: set 1 is always open
  await wait(2600);
  for (let i = 0; i < 5; i++) { await p.locator('#table .card:not(.open)').first().click(); await waitIdle(p); await p.click('#btnClose'); await wait(250); }
  await p.waitForSelector('#finish');
  await wait(1500);                                     // let the "Great job! / เก่งมาก" praise finish
  await takeLog(p);
  await p.locator('#table .card').first().click();
  await p.waitForFunction(() => window.__log.length >= 2 && !document.querySelector('#bubble').hidden, null, { timeout: 15000 });
  const rv = await takeLog(p);
  check(rv.length === 2 && rv[0].startsWith('en:') && /^clip:\w+\.mp3$/.test(rv[1]) && await p.locator('#cover').isHidden(), `review → English then the recorded Thai, answer already shown   [${rv.join(', ')}]`);
  await p.close();

  /* ---- layout at many sizes (home, table, detail with the longest word) ---- */
  console.log('layout');
  const sizes = [[1920, 1080], [1366, 768], [1024, 1366], [820, 1180], [768, 1024], [844, 390], [390, 844], [375, 667]];
  for (const [width, height] of sizes) {
    p = await browser.newPage({ viewport: { width, height } });
    await p.addInitScript(withName);
    await p.addInitScript(fakeSpeech, true);
    await p.goto(base + '?allow=all');
    await wait(1200);   // tiles pop in
    const homeOk = await p.evaluate(() => [...document.querySelectorAll('#menu *')].every(e => { const r = e.getBoundingClientRect(); return r.left >= -1 && r.right <= innerWidth + 1; }));
    await p.goto(base + '?allow=all#/days'); await wait(2600);
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
