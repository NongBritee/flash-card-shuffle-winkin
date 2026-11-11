/* Home page: one tile per vocabulary set; sets beyond FREE_SETS are shown but locked */
import { loadWins } from '../lib/progress.js';
import { isUnlocked } from '../sets/index.js';
import SetTile from './SetTile.jsx';

export default function Menu({ sets, name, onChangeName, onLocked }) {
  const wins = loadWins();
  return (
    <section id="menu" className="screen" aria-label="เลือกชุดคำศัพท์">
      <header>
        <h1><span className="en">Word Cards</span> <span className="th">การ์ดคำศัพท์ภาษาอังกฤษ</span></h1>
        <p className="pick">
          <span id="greet">👋 สวัสดี {name}</span>
          <button id="changeName" type="button" onClick={onChangeName} aria-label="เปลี่ยนชื่อ">✏️</button>
          <span> · เลือกชุดคำศัพท์</span>
        </p>
      </header>
      <nav id="sets">
        {sets.map(s => <SetTile key={s.id} set={s} wins={wins[s.id] || 0} locked={!isUnlocked(s)} onLocked={onLocked} />)}
      </nav>
    </section>
  );
}
