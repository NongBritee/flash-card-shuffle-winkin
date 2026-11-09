// Big card + letter tiles + buttons (spell / listen / Thai / next)
export default function DetailView({ word, img, lit, cover, thaiShown, thaiKey, bubble, onLetter, onSpell, onSay, onThai, onClose }) {
  const style = { '--ink': word.ink, '--bg': word.bg, '--n': word.en.length };
  return (
    <div id="detail" className="show" style={style} onClick={e => { if (e.target.id === 'detail') onClose(); }}>
      <div className="panel">
        <div className="cardBig">
          <img id="bigImg" src={img} alt={`${word.en} — ${word.th}`} />
          <button id="cover" className={cover === 'peel' ? 'peel' : ''} hidden={cover === 'off'} aria-label="แตะเพื่อแปล" onClick={onThai}>🇹🇭 แตะเพื่อแปล</button>
          <div id="bubble" className={bubble || ''} hidden={!bubble}>
            {bubble === 'say' && <>🎤 พูดตามนะ<br /><b>{word.en}</b></>}
            {bubble === 'yay' && <>⭐ เก่งมาก!</>}
          </div>
        </div>
        <div className="side">
          <div id="letters" aria-label="ตัวอักษร">
            {[...word.en].map((ch, i) => (
              <button key={i} className={'tile' + (lit === 'all' || lit === i ? ' on' : '')}
                style={{ '--c': word.letters[i % word.letters.length] }} aria-label={ch.toUpperCase()} onClick={() => onLetter(i)}>{ch}</button>
            ))}
          </div>
          <div id="thaiWord" key={thaiKey} className={thaiKey ? 'pop' : ''} hidden={!thaiShown}>{word.th}</div>
          <div className="actions">
            <button id="btnSpell" className="act spell" onClick={onSpell}><span>🔤</span><b>สะกด</b><small>Spell</small></button>
            <button id="btnSay" className="act say" onClick={onSay}><span>🔊</span><b>ฟัง</b><small>Listen</small></button>
            <button id="btnThai" className="act thai" onClick={onThai}><span>🇹🇭</span><b>แปล</b><small>Thai</small></button>
          </div>
          <button id="btnClose" className="act done" onClick={onClose}><span>✅</span><b>เลือกใบต่อไป</b></button>
        </div>
      </div>
    </div>
  );
}
