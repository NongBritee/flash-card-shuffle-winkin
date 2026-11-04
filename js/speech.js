// Speech (Web Speech API) + tiny sound effects (Web Audio)
(function () {
  const synth = window.speechSynthesis || null;
  let voices = [];
  const loadVoices = () => { if (synth) voices = synth.getVoices() || []; };
  loadVoices();
  if (synth && 'onvoiceschanged' in synth) synth.onvoiceschanged = loadVoices;

  const PREFER = {
    en: [/Samantha/i, /Google US English/i, /Jenny|Aria|Ana/i, /Natural/i, /Google/i],
    th: [/Kanya|Narisa/i, /Premwadee|Niwat|Achara/i, /Google/i, /Pattara/i],
  };
  function pickVoice(lang) {
    const key = lang.slice(0, 2);
    const list = voices.filter(v => v.lang && v.lang.replace('_', '-').toLowerCase().startsWith(key));
    if (!list.length) return null;
    const exact = list.filter(v => v.lang.replace('_', '-').toLowerCase() === lang.toLowerCase());
    const pool = exact.length ? exact : list;
    for (const re of PREFER[key] || []) { const v = pool.find(x => re.test(x.name)); if (v) return v; }
    return pool.find(v => v.localService) || pool[0];
  }

  const keep = []; // keep utterances referenced (Chrome GC bug)
  function say(text, lang = 'en-US', rate = 0.8) {
    return new Promise(resolve => {
      const est = 700 + text.length * (lang.startsWith('th') ? 160 : 230) / rate;
      if (!synth) { setTimeout(resolve, est); return; }
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      const v = pickVoice(lang);
      if (v) u.voice = v;
      u.rate = rate;
      u.pitch = 1.1;
      let done = false;
      const fin = () => { if (done) return; done = true; clearTimeout(t); keep.splice(keep.indexOf(u), 1); resolve(); };
      const t = setTimeout(fin, est + 2500);
      u.onend = fin; u.onerror = fin;
      keep.push(u);
      synth.speak(u);
      if (synth.paused) synth.resume();
    });
  }
  function stop() { if (synth) synth.cancel(); }
  // iOS / Safari: speech must first be started from a user gesture
  let unlocked = false;
  function unlock() {
    if (unlocked) return; unlocked = true;
    if (synth) { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; synth.speak(u); }
    ctx();
  }
  const hasThaiVoice = () => !!pickVoice('th-TH');

  /* ---- sound effects ---- */
  let ac = null;
  function ctx() {
    if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ac = null; } }
    if (ac && ac.state === 'suspended') ac.resume();
    return ac;
  }
  function tone(freq, dur, type = 'sine', vol = .18, delay = 0, slide = 0) {
    const a = ctx(); if (!a) return;
    const t0 = a.currentTime + delay;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(freq * slide, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + .015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(a.destination);
    o.start(t0); o.stop(t0 + dur + .05);
  }
  function whoosh(delay = 0, dur = .28, vol = .22) {
    const a = ctx(); if (!a) return;
    const t0 = a.currentTime + delay;
    const buf = a.createBuffer(1, Math.floor(a.sampleRate * dur), a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const src = a.createBufferSource(); src.buffer = buf;
    const f = a.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.2;
    f.frequency.setValueAtTime(600, t0); f.frequency.exponentialRampToValueAtTime(2600, t0 + dur);
    const g = a.createGain(); g.gain.value = vol;
    src.connect(f).connect(g).connect(a.destination);
    src.start(t0);
  }
  const SFX = {
    flip() { whoosh(0, .3); tone(520, .12, 'triangle', .12, .18, 1.5); },
    pop() { tone(660, .09, 'sine', .2, 0, 1.6); },
    shuffle() { for (let i = 0; i < 6; i++) whoosh(i * .09, .1, .14); },
    tick(i = 0) { tone(880 + (i % 5) * 60, .05, 'square', .06); },
    chime() { [784, 988, 1175].forEach((f, i) => tone(f, .35, 'sine', .15, i * .09)); },
    tada() { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, .4, 'triangle', .14, i * .11)); },
    peel() { whoosh(0, .22, .18); tone(400, .18, 'sine', .12, .05, 2); },
  };

  window.Speech = { say, stop, unlock, hasThaiVoice, SFX };
})();
