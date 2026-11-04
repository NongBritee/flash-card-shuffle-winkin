(function () {
  const WORDS = window.WORDS;
  const { say, stop, unlock, SFX } = window.Speech;
  const $ = s => document.querySelector(s);
  const table = $('#table'), detail = $('#detail'), win = $('#win');
  const bigImg = $('#bigImg'), cover = $('#cover'), bubble = $('#bubble');
  const lettersEl = $('#letters'), thaiWord = $('#thaiWord'), scoreEl = $('#score'), hint = $('#hint');
  // speak letter names as words — iOS reads a single capital as "capital A"
  const LETTER = { a: 'ay', b: 'bee', c: 'see', d: 'dee', e: 'ee', f: 'ef', g: 'jee', h: 'aitch', i: 'eye', j: 'jay', k: 'kay', l: 'el', m: 'em',
    n: 'en', o: 'oh', p: 'pee', q: 'cue', r: 'ar', s: 'ess', t: 'tee', u: 'you', v: 'vee', w: 'double you', x: 'ex', y: 'why', z: 'zee' };
  const letterName = ch => LETTER[ch.toLowerCase()] || ch;
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const rand = n => Math.floor(Math.random() * n);

  // preload fronts
  WORDS.forEach(w => { const i = new Image(); i.src = `cards/${w.id}.webp`; });

  let slots = [];          // {el, word}
  let busy = false;
  let current = null;      // word open in detail
  let token = 0;           // cancels running speech sequences

  /* ---------- table ---------- */
  function build() {
    table.innerHTML = '';
    slots = WORDS.map((_, i) => {
      const el = document.createElement('button');
      el.className = 'card';
      el.setAttribute('aria-label', `การ์ดใบที่ ${i + 1}`);
      el.innerHTML = `<div class="flip"><img class="face back" src="cards/back.webp" alt="" draggable="false"><img class="face front" alt="" draggable="false"></div><span class="tick">⭐</span>`;
      el.style.setProperty('--d', (i * 0.08) + 's');
      const slot = { el, word: null };
      el.addEventListener('click', () => pick(slot));
      table.appendChild(el);
      return slot;
    });
    updateScore();
  }

  function updateScore() {
    const n = slots.filter(s => s.word).length;
    scoreEl.innerHTML = WORDS.map((_, i) => `<i class="${i < n ? 'on' : ''}">⭐</i>`).join('');
    scoreEl.setAttribute('aria-label', `เปิดแล้ว ${n} จาก ${WORDS.length} ใบ`);
    hint.textContent = n === 0 ? '👆 จิ้มเลือกการ์ด 1 ใบ' : n < WORDS.length ? '👆 เลือกใบต่อไปเลย!' : '🎉 ครบทุกใบแล้ว';
  }

  // FLIP shuffle: gather to the centre, reorder, spread out again
  async function shuffleAnim(rounds = 2) {
    const tr = table.getBoundingClientRect();
    const cx = tr.left + tr.width / 2, cy = tr.top + tr.height / 2;
    for (let r = 0; r < rounds; r++) {
      SFX.shuffle();
      slots.forEach(s => {
        const b = s.el.getBoundingClientRect();
        s.el.style.transition = 'transform .32s cubic-bezier(.5,0,.5,1)';
        s.el.style.transform = `translate(${cx - (b.left + b.width / 2)}px, ${cy - (b.top + b.height / 2)}px) rotate(${rand(30) - 15}deg)`;
      });
      await wait(340);
      // reorder DOM
      const order = slots.map(s => s.el).sort(() => Math.random() - .5);
      const before = new Map(order.map(el => [el, el.getBoundingClientRect()]));
      order.forEach(el => table.appendChild(el));
      order.forEach(el => {
        const was = before.get(el), now = el.getBoundingClientRect();
        el.style.transition = 'none';
        el.style.transform = `translate(${was.left - now.left}px, ${was.top - now.top}px) rotate(${rand(30) - 15}deg)`;
      });
      table.offsetWidth; // reflow
      order.forEach((el, i) => {
        el.style.transition = `transform .42s cubic-bezier(.2,1.3,.4,1) ${i * 0.04}s`;
        el.style.transform = '';
      });
      await wait(560);
    }
    slots.forEach(s => { s.el.style.transition = ''; s.el.style.transform = ''; });
  }

  async function newRound(first) {
    busy = true;
    const anyOpen = slots.some(s => s.word);
    slots.forEach(s => s.el.classList.remove('open', 'done', 'glow'));
    if (anyOpen) { SFX.flip(); await wait(550); }
    slots.forEach(s => { s.word = null; s.el.querySelector('.front').removeAttribute('src'); });
    updateScore();
    if (first) { table.classList.add('deal'); await wait(900); table.classList.remove('deal'); }
    await shuffleAnim(first ? 1 : 2);
    busy = false;
  }

  /* ---------- pick a card ---------- */
  async function pick(slot) {
    unlock();
    if (busy) return;
    if (slot.word) { openDetail(slot.word, false); return; }
    busy = true;
    const used = new Set(slots.filter(s => s.word).map(s => s.word.id));
    const left = WORDS.filter(w => !used.has(w.id));
    const w = left[rand(left.length)];          // random word for the chosen card
    slot.word = w;
    const front = slot.el.querySelector('.front');
    front.src = `cards/${w.id}.webp`;
    slot.el.classList.add('glow');
    await wait(120);
    SFX.flip();
    slot.el.classList.add('open');
    await wait(750);
    slot.el.classList.remove('glow');
    slot.el.classList.add('done');
    updateScore();
    busy = false;
    openDetail(w, true);
  }

  // 🎲 roulette over the face-down cards
  async function lucky() {
    unlock();
    if (busy) return;
    const down = slots.filter(s => !s.word);
    if (!down.length) return;
    busy = true;
    let i = rand(down.length), steps = 10 + rand(5), delay = 70;
    for (let k = 0; k < steps; k++) {
      down.forEach(s => s.el.classList.remove('glow'));
      i = (i + 1 + (down.length > 1 ? rand(down.length - 1) : 0)) % down.length;
      down[i].el.classList.add('glow');
      SFX.tick(k);
      await wait(delay);
      delay *= 1.17;
    }
    await wait(250);
    busy = false;
    pick(down[i]);
  }

  /* ---------- detail view ---------- */
  function openDetail(w, auto) {
    current = w;
    detail.style.setProperty('--ink', w.ink);
    detail.style.setProperty('--bg', w.bg);
    bigImg.src = `cards/${w.id}.webp`;
    bigImg.alt = `${w.en} — ${w.th}`;
    cover.hidden = false; cover.classList.remove('peel');
    thaiWord.hidden = true; thaiWord.textContent = w.th;
    bubble.hidden = true;
    lettersEl.innerHTML = [...w.en].map((ch, i) =>
      `<button class="tile" style="--c:${w.letters[i % w.letters.length]}" aria-label="${ch.toUpperCase()}">${ch}</button>`).join('');
    lettersEl.querySelectorAll('.tile').forEach((b, i) => b.addEventListener('click', () => letter(i)));
    detail.hidden = false;
    detail.classList.remove('show'); detail.offsetWidth; detail.classList.add('show');
    const t = ++token;
    setTimeout(() => { if (t === token) (auto ? spell : sayWord)(); }, 550);
  }

  function closeDetail() {
    token++; stop();
    detail.hidden = true;
    current = null;
    if (slots.every(s => s.word)) setTimeout(showWin, 300);
  }

  const tiles = () => [...lettersEl.querySelectorAll('.tile')];
  const light = idx => tiles().forEach((t, i) => t.classList.toggle('on', idx === 'all' || i === idx));

  async function spell() {
    const t = ++token, w = current; stop(); bubble.hidden = true;
    for (let i = 0; i < w.en.length; i++) {
      if (t !== token) return;
      light(i); SFX.pop();
      await say(letterName(w.en[i]), 'en-US', 0.85);
      await wait(160);
    }
    if (t !== token) return;
    light('all');
    await wait(200);
    await say(w.en, 'en-US', 0.72);
    if (t !== token) return;
    await wait(300);
    light(-1);
    repeatAfterMe(t, w);
  }

  async function repeatAfterMe(t, w) {
    bubble.innerHTML = `🎤 พูดตามนะ<br><b>${w.en}</b>`;
    bubble.className = 'say'; bubble.hidden = false;
    await wait(3000);
    if (t !== token) return;
    bubble.innerHTML = `⭐ เก่งมาก!`; bubble.className = 'yay';
    SFX.chime();
    await wait(1400);
    if (t === token) bubble.hidden = true;
  }

  async function sayWord() {
    const t = ++token, w = current; stop(); bubble.hidden = true;
    light('all');
    await say(w.en, 'en-US', 0.72);
    if (t !== token) return;
    light(-1);
    repeatAfterMe(t, w);
  }

  async function letter(i) {
    const t = ++token, w = current; stop(); bubble.hidden = true;
    light(i); SFX.pop();
    await say(letterName(w.en[i]), 'en-US', 0.85);
    if (t === token) light(-1);
  }

  async function translate() {
    const t = ++token, w = current; stop(); bubble.hidden = true;
    if (!cover.hidden) { SFX.peel(); cover.classList.add('peel'); setTimeout(() => { cover.hidden = true; }, 450); }
    thaiWord.hidden = false;
    thaiWord.classList.remove('pop'); thaiWord.offsetWidth; thaiWord.classList.add('pop');
    light('all');
    await say(w.en, 'en-US', 0.75);
    if (t !== token) return;
    light(-1);
    await wait(150);
    await say('แปลว่า ' + w.th, 'th-TH', 0.9);
  }

  /* ---------- win ---------- */
  function showWin() {
    $('#winCards').innerHTML = WORDS.map(w => `<img src="cards/${w.id}.webp" alt="${w.en}">`).join('');
    win.hidden = false;
    SFX.tada(); confetti();
    const t = ++token;
    say('Great job!', 'en-US', 0.85).then(() => t === token && say('เก่งมาก', 'th-TH', 0.95));
  }

  /* ---------- confetti ---------- */
  const fx = $('#fx'), g = fx.getContext('2d');
  function confetti() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    fx.width = innerWidth * dpr; fx.height = innerHeight * dpr;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cols = ['#FF6B6B', '#FFD43B', '#69DB7C', '#4DABF7', '#B197FC', '#FF8FD8'];
    const ps = Array.from({ length: 140 }, () => ({
      x: innerWidth / 2, y: innerHeight * .45,
      vx: (Math.random() - .5) * 16, vy: -Math.random() * 15 - 4,
      r: 5 + Math.random() * 6, c: cols[rand(cols.length)], a: Math.random() * 6, va: (Math.random() - .5) * .4,
    }));
    let f = 0;
    (function step() {
      g.clearRect(0, 0, innerWidth, innerHeight);
      ps.forEach(p => {
        p.vy += .35; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.va;
        g.save(); g.translate(p.x, p.y); g.rotate(p.a); g.fillStyle = p.c;
        g.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); g.restore();
      });
      if (++f < 200) requestAnimationFrame(step); else g.clearRect(0, 0, innerWidth, innerHeight);
    })();
  }

  /* ---------- wire up ---------- */
  $('#btnSpell').addEventListener('click', () => { unlock(); spell(); });
  $('#btnSay').addEventListener('click', () => { unlock(); sayWord(); });
  $('#btnThai').addEventListener('click', () => { unlock(); translate(); });
  cover.addEventListener('click', () => { unlock(); translate(); });
  $('#btnClose').addEventListener('click', closeDetail);
  detail.addEventListener('click', e => { if (e.target === detail) closeDetail(); });
  $('#shuffle').addEventListener('click', () => { unlock(); if (!busy) newRound(false); });
  $('#lucky').addEventListener('click', lucky);
  $('#again').addEventListener('click', () => { unlock(); win.hidden = true; token++; stop(); newRound(false); });
  document.addEventListener('pointerdown', unlock, { once: true });

  // pick 5 / 3 / 2 cards per row — whichever gives the biggest card that still fits the free space
  function fitTable() {
    const app = $('#app'), cs = getComputedStyle(app);
    const W = app.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const tcs = getComputedStyle(table);
    const H = table.clientHeight - parseFloat(tcs.paddingTop) - parseFloat(tcs.paddingBottom);
    const gap = Math.max(10, Math.min(28, Math.min(W, H) * 0.03));
    let best = { w: 0, cols: 5 };
    for (const cols of [5, 3, 2]) {
      const rows = Math.ceil(WORDS.length / cols);
      const w = Math.min((W - (cols - 1) * gap) / cols, ((H - (rows - 1) * gap) / rows) * 5 / 7);
      if (w > best.w) best = { w, cols };
    }
    const cw = Math.max(60, Math.floor(Math.min(best.w, 400)));
    table.style.setProperty('--cw', cw + 'px');
    table.style.setProperty('--gap', gap + 'px');
    table.style.maxWidth = Math.ceil(best.cols * cw + (best.cols - 1) * gap + 2) + 'px';
  }
  window.addEventListener('resize', fitTable);
  window.addEventListener('orientationchange', () => setTimeout(fitTable, 200));
  if (window.ResizeObserver) new ResizeObserver(fitTable).observe(table);
  if (document.fonts) document.fonts.ready.then(fitTable);

  build();
  fitTable();
  newRound(true);
})();
