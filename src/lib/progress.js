// Stars per set, kept in this browser (localStorage). Answering all 5 cards always earns the full 3 stars.
export const MAX_STARS = 3;
const KEY = 'fc.wins';
export function loadWins() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
}
export function recordWin(setId) {
  const wins = loadWins();
  wins[setId] = MAX_STARS;
  try { localStorage.setItem(KEY, JSON.stringify(wins)); } catch (e) { /* private mode */ }
  return wins;
}

// Child's name, asked once before starting and remembered in this browser
export const MIN_NAME = 2;
const NAME_KEY = 'fc.name';
export const cleanName = v => String(v || '').replace(/\s+/g, ' ').trim().slice(0, 20);
export const validName = v => [...cleanName(v)].length >= MIN_NAME;     // count characters, not UTF-16 units
export function loadName() {
  try { const n = cleanName(localStorage.getItem(NAME_KEY)); return validName(n) ? n : ''; } catch (e) { return ''; }
}
export function saveName(v) {
  const n = cleanName(v);
  if (!validName(n)) return '';
  try { localStorage.setItem(NAME_KEY, n); } catch (e) { /* private mode */ }
  return n;
}
