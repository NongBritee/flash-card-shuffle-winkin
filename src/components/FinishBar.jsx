// Shown under the 5 cards once every card was answered. The cards stay on screen so they can be reviewed.
export default function FinishBar({ name, onAgain, onHome }) {
  return (
    <div id="finish" role="status">
      <div className="msg">
        <span className="big">🎉</span>
        <span className="txt"><b>เก่งมาก{name ? ` ${name}` : ''}!</b><small>Great job! แตะการ์ดเพื่อดูซ้ำได้</small></span>
        <span className="winStars" aria-label="ได้ 3 ดาว">⭐⭐⭐</span>
      </div>
      <div className="winBtns">
        <button id="again" className="act done" onClick={onAgain}><span>🔁</span><b>เล่นอีกครั้ง</b></button>
        <button id="winHome" className="act home" onClick={onHome}><span>🏠</span><b>เลือกชุดอื่น</b></button>
      </div>
    </div>
  );
}
