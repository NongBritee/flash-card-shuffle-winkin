// Rounds finished per set, kept in this browser (localStorage)
const KEY = 'fc.wins';
export function loadWins() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
}
export function recordWin(setId) {
  const wins = loadWins();
  wins[setId] = (wins[setId] || 0) + 1;
  try { localStorage.setItem(KEY, JSON.stringify(wins)); } catch (e) { /* private mode */ }
  return wins;
}
