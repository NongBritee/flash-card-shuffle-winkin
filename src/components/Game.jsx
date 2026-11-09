/* Card game for one vocabulary set.
   Sequences:
     tap a face-down card → flip → spell → English word → Thai
     🔤 spell             → spell → English word → Thai
     🔊 listen / 🇹🇭 Thai  → English word → Thai
     tap an opened card   → English word → Thai
   Async sequences are cancelled with a "token": every new action bumps it, and running steps stop when it changed. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { say, stop, unlock, hasThaiVoice, playClip, preloadClips, SFX } from '../lib/speech.js';
import { cardImg, clipUrl, SILENCE } from '../lib/assets.js';
import { letterName, LETTER_RATE, LETTER_GAP, WORD_RATE } from '../lib/letters.js';
import confetti from '../lib/confetti.js';
import useFitTable from '../hooks/useFitTable.js';
import Card from './Card.jsx';
import DetailView from './DetailView.jsx';
import WinBox from './WinBox.jsx';

const wait = ms => new Promise(r => setTimeout(r, ms));
const rand = n => Math.floor(Math.random() * n);
let noticeShown = false;                     // the "no Thai voice" hint shows once per visit

export default function Game({ set, onHome, onWin }) {
  const WORDS = set.words;
  const [slots, setSlots] = useState(() => WORDS.map((_, key) => ({ key, word: null, open: false, done: false, glow: false })));
  const [order, setOrder] = useState(() => WORDS.map((_, i) => i));
  const [deal, setDeal] = useState(false);
  const [detail, setDetail] = useState(null);          // word shown in the big view
  const [lit, setLit] = useState(-1);                   // highlighted letter index, 'all' or -1
  const [cover, setCover] = useState('on');             // sticker over the Thai label: on | peel | off
  const [thaiShown, setThaiShown] = useState(false);
  const [thaiKey, setThaiKey] = useState(0);            // bump to replay the pop animation
  const [bubble, setBubble] = useState(null);           // 'say' | 'yay' | null
  const [notice, setNotice] = useState(false);
  const [win, setWin] = useState(false);

  const slotsRef = useRef(slots); slotsRef.current = slots;
  const coverRef = useRef(cover); coverRef.current = cover;
  const current = useRef(null);
  const busy = useRef(false);
  const token = useRef(0);
  const cardEls = useRef({});
  const tableRef = useRef(null), screenRef = useRef(null), fxRef = useRef(null);
  const flipPending = useRef(null);
  const tableStyle = useFitTable(tableRef, screenRef, WORDS.length);

  const img = name => cardImg(set, name);
  const patch = (key, p) => setSlots(ss => ss.map(s => (s.key === key ? { ...s, ...p } : s)));
  const tap = () => unlock(SILENCE);

  /* ---------- shuffle (FLIP animation) ---------- */
  // after React re-orders the cards, start each one from where it was and slide it to its new place
  useLayoutEffect(() => {
    const f = flipPending.current;
    if (!f) return;
    flipPending.current = null;
    const els = Object.entries(cardEls.current).filter(([, el]) => el);
    els.forEach(([, el]) => { el.style.transition = 'none'; el.style.transform = ''; });
    els.forEach(([k, el]) => {
      const was = f.before.get(+k), now = el.getBoundingClientRect();
      el.style.transform = `translate(${was.left - now.left}px, ${was.top - now.top}px) rotate(${rand(30) - 15}deg)`;
    });
    tableRef.current && tableRef.current.offsetWidth;  // reflow
    els.forEach(([, el], i) => { el.style.transition = `transform .42s cubic-bezier(.2,1.3,.4,1) ${i * 0.04}s`; el.style.transform = ''; });
    f.resolve();
  }, [order]);

  async function shuffleAnim(rounds, t) {
    for (let r = 0; r < rounds && t === token.current; r++) {
      const tr = tableRef.current.getBoundingClientRect();
      const cx = tr.left + tr.width / 2, cy = tr.top + tr.height / 2;
      SFX.shuffle();
      const els = Object.entries(cardEls.current).filter(([, el]) => el);
      els.forEach(([, el]) => {
        const b = el.getBoundingClientRect();
        el.style.transition = 'transform .32s cubic-bezier(.5,0,.5,1)';
        el.style.transform = `translate(${cx - (b.left + b.width / 2)}px, ${cy - (b.top + b.height / 2)}px) rotate(${rand(30) - 15}deg)`;
      });
      await wait(340);
      if (t !== token.current) break;
      const before = new Map(els.map(([k, el]) => [+k, el.getBoundingClientRect()]));
      await new Promise(resolve => {
        flipPending.current = { before, resolve };
        setOrder(o => [...o].sort(() => Math.random() - .5));
      });
      await wait(560);
    }
    Object.values(cardEls.current).forEach(el => { if (el) { el.style.transition = ''; el.style.transform = ''; } });
  }

  async function newRound(first) {
    const t = ++token.current;
    busy.current = true;
    const anyOpen = slotsRef.current.some(s => s.word);
    setSlots(ss => ss.map(s => ({ ...s, open: false, done: false, glow: false })));
    if (anyOpen) { SFX.flip(); await wait(550); }
    setSlots(ss => ss.map(s => ({ ...s, word: null })));
    if (first) { setDeal(true); await wait(900); setDeal(false); }
    await shuffleAnim(first ? 1 : 2, t);
    if (t === token.current) busy.current = false;
  }

  useEffect(() => {
    WORDS.forEach(w => { const i = new Image(); i.src = img(w.id); });
    preloadClips(WORDS.map(w => clipUrl(set, w)));
    newRound(true);
    return () => { token.current++; stop(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---------- pick a card ---------- */
  async function pick(key) {
    tap();
    if (busy.current) return;
    const slot = slotsRef.current.find(s => s.key === key);
    if (slot.word) { openDetail(slot.word, false); return; }
    busy.current = true;
    const used = new Set(slotsRef.current.filter(s => s.word).map(s => s.word.id));
    const left = WORDS.filter(w => !used.has(w.id));
    const w = left[rand(left.length)];          // random word for the chosen card
    patch(key, { word: w, glow: true });
    await wait(120);
    SFX.flip();
    patch(key, { open: true });
    await wait(750);
    patch(key, { glow: false, done: true });
    busy.current = false;
    openDetail(w, true);
  }

  // 🎲 roulette over the face-down cards
  async function lucky() {
    tap();
    if (busy.current) return;
    const down = slotsRef.current.filter(s => !s.word).map(s => s.key);
    if (!down.length) return;
    busy.current = true;
    const t = token.current;
    let i = rand(down.length), delay = 70;
    const steps = 10 + rand(5);
    for (let k = 0; k < steps && t === token.current; k++) {
      i = (i + 1 + (down.length > 1 ? rand(down.length - 1) : 0)) % down.length;
      const on = down[i];
      setSlots(ss => ss.map(s => ({ ...s, glow: s.key === on })));
      SFX.tick(k);
      await wait(delay);
      delay *= 1.17;
    }
    await wait(250);
    busy.current = false;
    if (t === token.current) pick(down[i]);
  }

  /* ---------- detail view + sequences ---------- */
  function openDetail(w, fromBack) {
    current.current = w;
    setDetail(w); setCover('on'); setThaiShown(false); setThaiKey(0); setBubble(null); setLit(-1);
    const t = ++token.current;
    setTimeout(() => { if (t === token.current) (fromBack ? spell : sayWord)(); }, 550);
  }

  function closeDetail() {
    token.current++; stop();
    setDetail(null); setBubble(null); setLit(-1);
    current.current = null;
    if (slotsRef.current.every(s => s.word)) setTimeout(showWin, 300);
  }

  const begin = () => { const t = ++token.current; stop(); setBubble(null); return t; };

  async function revealThai(t, w) {
    if (coverRef.current === 'on') { SFX.peel(); setCover('peel'); setTimeout(() => setCover('off'), 450); }
    setThaiShown(true); setThaiKey(k => k + 1);
    await wait(350);
    if (t !== token.current) return;
    // 1) recorded voice  2) device Thai voice  3) show a hint
    if (await playClip(clipUrl(set, w))) return;
    if (t !== token.current) return;
    if (hasThaiVoice()) await say(w.th, 'th-TH', 0.9);
    else {
      if (!noticeShown) { noticeShown = true; setNotice(true); setTimeout(() => setNotice(false), 9000); }
      await wait(1500);
    }
  }

  async function repeatAfterMe(t) {
    setBubble('say');
    await wait(3000);
    if (t !== token.current) return;
    setBubble('yay'); SFX.chime();
    await wait(1400);
    if (t === token.current) setBubble(null);
  }

  // shared tail of every sequence: English word → Thai → "repeat after me"
  async function wordThenThai(t, w) {
    setLit('all');
    await say(w.en, 'en-US', WORD_RATE);
    if (t !== token.current) return;
    setLit(-1);
    await wait(450);
    if (t !== token.current) return;
    await revealThai(t, w);
    if (t !== token.current) return;
    await wait(400);
    repeatAfterMe(t);
  }

  async function spell() {
    const t = begin(), w = current.current;
    for (let i = 0; i < w.en.length; i++) {
      if (t !== token.current) return;
      setLit(i); SFX.pop();
      await say(letterName(w.en[i]), 'en-US', LETTER_RATE);
      await wait(LETTER_GAP);
    }
    if (t !== token.current) return;
    setLit('all');
    await wait(500);
    if (t !== token.current) return;
    await wordThenThai(t, w);
  }

  async function sayWord() { const t = begin(); await wordThenThai(t, current.current); }

  async function letter(i) {
    const t = begin(), w = current.current;
    setLit(i); SFX.pop();
    await say(letterName(w.en[i]), 'en-US', LETTER_RATE);
    if (t === token.current) setLit(-1);
  }

  /* ---------- win ---------- */
  function showWin() {
    setWin(true);
    SFX.tada(); confetti(fxRef.current);
    onWin && onWin();
    const t = ++token.current;
    say('Great job!', 'en-US', 0.85).then(() => t === token.current && hasThaiVoice() && say('เก่งมาก', 'th-TH', 0.95));
  }
  function again() { tap(); setWin(false); stop(); newRound(false); }

  const opened = slots.filter(s => s.word).length;
  const hint = opened === 0 ? '👆 จิ้มเลือกการ์ด 1 ใบ' : opened < WORDS.length ? '👆 เลือกใบต่อไปเลย!' : '🎉 ครบทุกใบแล้ว';

  return (
    <section id="game" className="screen" ref={screenRef}>
      <header id="top">
        <div className="left">
          <button id="home" className="round" aria-label="กลับหน้าเลือกชุด" onClick={onHome}><span>🏠</span><small>หน้าแรก</small></button>
          <h1><span className="en" id="setTitle">{set.title}</span> <span className="th" id="setTh">{set.th}</span></h1>
        </div>
        <div id="score" aria-live="polite" aria-label={`เปิดแล้ว ${opened} จาก ${WORDS.length} ใบ`}>
          {WORDS.map((_, i) => <i key={i} className={i < opened ? 'on' : ''}>⭐</i>)}
        </div>
        <div className="tools">
          <button id="lucky" className="round" aria-label="สุ่มให้" onClick={lucky}><span>🎲</span><small>สุ่มให้</small></button>
          <button id="shuffle" className="round" aria-label="สับการ์ด" onClick={() => { tap(); if (!busy.current) newRound(false); }}><span>🔀</span><small>สับการ์ด</small></button>
        </div>
      </header>

      <p id="hint">{hint}</p>
      <section id="table" ref={tableRef} className={deal ? 'deal' : ''} style={tableStyle} aria-label="การ์ด 5 ใบ">
        {order.map((key, i) => {
          const s = slots[key];
          return (
            <Card key={key} ref={el => { cardEls.current[key] = el; }} index={i}
              backSrc={img('back')} frontSrc={s.word ? img(s.word.id) : null}
              open={s.open} done={s.done} glow={s.glow} onClick={() => pick(key)} />
          );
        })}
      </section>

      {detail && (
        <DetailView word={detail} img={img(detail.id)} lit={lit} cover={cover} thaiShown={thaiShown} thaiKey={thaiKey} bubble={bubble}
          onLetter={i => { tap(); letter(i); }} onSpell={() => { tap(); spell(); }} onSay={() => { tap(); sayWord(); }}
          onThai={() => { tap(); sayWord(); }} onClose={closeDetail} />
      )}
      {win && <WinBox images={WORDS.map(w => ({ src: img(w.id), alt: w.en }))} onAgain={again} onHome={onHome} />}

      <div id="notice" hidden={!notice}>🔇 เครื่องนี้ยังไม่มีเสียงภาษาไทย<br /><small>บน PC ให้เปิดด้วย <b>Microsoft Edge</b> หรือเพิ่มเสียงภาษาไทยใน Windows<br />(Settings → Time &amp; language → Speech → Add voices → ไทย)</small></div>
      <canvas id="fx" ref={fxRef}></canvas>
    </section>
  );
}
