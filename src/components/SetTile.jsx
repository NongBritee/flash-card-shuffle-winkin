import { cardImg } from '../lib/assets.js';
import { MAX_STARS } from '../lib/progress.js';

export default function SetTile({ set, wins, locked, onLocked }) {
  const first = set.words[0], last = set.words[set.words.length - 1];
  const style = { '--c1': set.back.c1, '--c2': set.back.c2, '--c3': set.back.c3 };
  const inner = (
    <>
      <span className="no">{set.no}</span>
      {locked && <span className="lock" aria-hidden="true">🔒</span>}
      <span className="fan">
        <img src={cardImg(set, first.id)} alt="" loading="lazy" draggable="false" />
        <img src={cardImg(set, last.id)} alt="" loading="lazy" draggable="false" />
        <img src={cardImg(set, 'back')} alt="" draggable="false" />
      </span>
      <span className="name"><b className="en">{set.title}</b><span className="th">{set.th}</span></span>
      <span className="words">{set.words.map(w => w.en).join(' · ')}</span>
      <span className="stars" aria-label={`ได้ ${wins} ดาว`}>
        {Array.from({ length: MAX_STARS }, (_, i) => i).map(i => <i key={i} className={i < wins ? 'on' : ''}>⭐</i>)}
      </span>
    </>
  );
  const label = `ชุดที่ ${set.no} ${set.title} ${set.th}`;
  // locked sets are visible but not playable: a click opens the "not available yet" popup
  return locked
    ? <button type="button" className="setTile locked" style={style} aria-disabled="true" aria-label={`${label} (ยังไม่เปิดใช้งาน)`} onClick={onLocked}>{inner}</button>
    : <a className="setTile" href={`#/${set.id}`} style={style} aria-label={label}>{inner}</a>;
}
