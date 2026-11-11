/* Small modal message */
import { useEffect } from 'react';

export default function Popup({ icon = '🔒', title, text, onClose }) {
  useEffect(() => {
    const on = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [onClose]);
  return (
    <div id="popup" role="dialog" aria-modal="true" aria-labelledby="popupTitle" onClick={e => { if (e.target.id === 'popup') onClose(); }}>
      <div className="popBox">
        <div className="big">{icon}</div>
        <h2 id="popupTitle">{title}</h2>
        {text && <p>{text}</p>}
        <button className="act done" onClick={onClose} autoFocus><span>👍</span><b>ตกลง</b></button>
      </div>
    </div>
  );
}
