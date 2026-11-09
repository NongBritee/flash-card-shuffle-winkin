// Letter names spoken as words — iOS reads a single capital as "capital A", and "ay" can sound like "eye", so A stays a lone "a"
const LETTER = {
  a: 'a', b: 'bee', c: 'see', d: 'dee', e: 'ee', f: 'ef', g: 'jee', h: 'aitch', i: 'eye', j: 'jay', k: 'kay', l: 'el', m: 'em',
  n: 'en', o: 'oh', p: 'pee', q: 'cue', r: 'ar', s: 'ess', t: 'tee', u: 'you', v: 'vee', w: 'double you', x: 'ex', y: 'why', z: 'zee',
};
export const letterName = ch => LETTER[ch.toLowerCase()] || ch;

// spelling speed: lower rate = slower voice; gap = pause between letters (ms)
export const LETTER_RATE = 0.6, LETTER_GAP = 650, WORD_RATE = 0.65;
