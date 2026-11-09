import { cardImg } from '../lib/assets.js';

export default function SetTile({ set, wins }) {
  const first = set.words[0], last = set.words[set.words.length - 1];
  const style = { '--c1': set.back.c1, '--c2': set.back.c2, '--c3': set.back.c3 };
  return (
    <a className="setTile" href={`#/${set.id}`} style={style} aria-label={`ชุดที่ ${set.no} ${set.title} ${set.th}`}>
      <span className="no">{set.no}</span>
      <span className="fan">
        <img src={cardImg(set, first.id)} alt="" loading="lazy" draggable="false" />
        <img src={cardImg(set, last.id)} alt="" loading="lazy" draggable="false" />
        <img src={cardImg(set, 'back')} alt="" draggable="false" />
      </span>
      <span className="name"><b className="en">{set.title}</b><span className="th">{set.th}</span></span>
      <span className="words">{set.words.map(w => w.en).join(' · ')}</span>
      <span className="stars" aria-label={`เล่นจบ ${wins} รอบ`}>
        {[0, 1, 2].map(i => <i key={i} className={i < wins ? 'on' : ''}>⭐</i>)}
      </span>
    </a>
  );
}
