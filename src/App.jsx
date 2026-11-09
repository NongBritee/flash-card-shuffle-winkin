/* Router:  #/        → home page (choose a set)
            #/<setId> → card game for that set */
import { useEffect } from 'react';
import { SETS, getSet } from './sets/index.js';
import useHashRoute, { goHome } from './hooks/useHashRoute.js';
import { unlock } from './lib/speech.js';
import { SILENCE } from './lib/assets.js';
import { recordWin } from './lib/progress.js';
import Menu from './components/Menu.jsx';
import Game from './components/Game.jsx';

const HOME_THEME = { sky1: '#a5d8ff', sky2: '#fff0f6', hill1: '#d3f9d8', hill2: '#ffe8cc', accent: '#7048e8', accentDark: '#5f3dc4' };

function applyTheme(t) {
  const r = document.documentElement.style;
  Object.entries(t).forEach(([k, v]) => r.setProperty('--' + k, v));
  const m = document.querySelector('meta[name=theme-color]');
  if (m) m.content = t.sky1;
}

export default function App() {
  const id = useHashRoute();
  const set = id ? getSet(id) : null;

  useEffect(() => {
    applyTheme(set ? set.theme : HOME_THEME);
    document.title = set ? `${set.title} · ${set.th} — Word Cards` : 'Word Cards การ์ดคำศัพท์';
  }, [set]);

  // iOS / Safari only allow sound after a tap: unlock audio on the first touch anywhere
  useEffect(() => {
    const on = () => unlock(SILENCE);
    document.addEventListener('pointerdown', on, { once: true });
    document.addEventListener('touchend', on, { once: true });
    return () => { document.removeEventListener('pointerdown', on); document.removeEventListener('touchend', on); };
  }, []);

  return (
    <main id="app">
      {set
        ? <Game key={set.id} set={set} onHome={goHome} onWin={() => recordWin(set.id)} />
        : <Menu sets={SETS} />}
    </main>
  );
}
