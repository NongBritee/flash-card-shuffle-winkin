import { forwardRef } from 'react';

// One card on the table. Face-down shows the set's back; once a word is drawn the front flips up.
const Card = forwardRef(function Card({ index, backSrc, frontSrc, open, done, glow, onClick }, ref) {
  const cls = ['card', open && 'open', done && 'done', glow && 'glow'].filter(Boolean).join(' ');
  return (
    <button ref={ref} className={cls} style={{ '--d': `${index * 0.08}s` }} aria-label={`การ์ดใบที่ ${index + 1}`} onClick={onClick}>
      <div className="flip">
        <img className="face back" src={backSrc} alt="" draggable="false" />
        <img className="face front" src={frontSrc || undefined} alt="" draggable="false" />
      </div>
      <span className="tick">⭐</span>
    </button>
  );
});
export default Card;
