/* Home page: one tile per vocabulary set */
import { loadWins } from '../lib/progress.js';
import SetTile from './SetTile.jsx';

export default function Menu({ sets }) {
  const wins = loadWins();
  return (
    <section id="menu" className="screen" aria-label="เลือกชุดคำศัพท์">
      <header>
        <h1><span className="en">Word Cards</span> <span className="th">การ์ดคำศัพท์ภาษาอังกฤษ</span></h1>
        <p className="pick">👇 เลือกชุดคำศัพท์</p>
      </header>
      <nav id="sets">
        {sets.map(s => <SetTile key={s.id} set={s} wins={wins[s.id] || 0} />)}
      </nav>
    </section>
  );
}
