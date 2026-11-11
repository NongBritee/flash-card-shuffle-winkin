/* Router:  #/        → home page (choose a set)
            #/<setId> → card game for that set */
import { useEffect, useState } from 'react';
import { SETS, getSet, isUnlocked } from './sets/index.js';
import useHashRoute, { goHome } from './hooks/useHashRoute.js';
import { unlock } from './lib/speech.js';
import { SILENCE } from './lib/assets.js';
import { recordWin, loadName, saveName } from './lib/progress.js';
import Menu from './components/Menu.jsx';
import Game from './components/Game.jsx';
import NameGate from './components/NameGate.jsx';
import Popup from './components/Popup.jsx';

const HOME_THEME = { sky1: '#a5d8ff', sky2: '#fff0f6', hill1: '#d3f9d8', hill2: '#ffe8cc', accent: '#7048e8', accentDark: '#5f3dc4' };

function applyTheme(t) {
  const r = document.documentElement.style;
  Object.entries(t).forEach(([k, v]) => r.setProperty('--' + k, v));
  const m = document.querySelector('meta[name=theme-color]');
  if (m) m.content = t.sky1;
}

export default function App() {
  const id = useHashRoute();
  const found = id ? getSet(id) : null;
  const [name, setName] = useState(loadName);          // child's name (asked before starting)
  const [editingName, setEditingName] = useState(false);
  const [popup, setPopup] = useState(false);           // "not available yet"
  const locked = !!found && !isUnlocked(found);
  const set = found && !locked && name ? found : null;

  // opening a locked set by URL goes back home with the popup
  useEffect(() => {
    if (locked) { setPopup(true); location.replace('#/'); }
  }, [locked]);

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
      {(!name || editingName)
        ? <NameGate initial={name} onCancel={name ? () => setEditingName(false) : null}
            onSave={n => { const v = saveName(n); if (v) { setName(v); setEditingName(false); } }} />
        : set
          ? <Game key={set.id} set={set} name={name} onHome={goHome} onWin={() => recordWin(set.id)} />
          : <Menu sets={SETS} name={name} onChangeName={() => setEditingName(true)} onLocked={() => setPopup(true)} />}
      {popup && <Popup icon="🔒" title="ยังไม่เปิดใช้งาน" text="ชุดนี้ยังไม่เปิดให้เล่นนะ เล่น 2 ชุดแรกไปก่อนน้า" onClose={() => setPopup(false)} />}
    </main>
  );
}
