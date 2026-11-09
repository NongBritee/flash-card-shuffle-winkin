// Round complete: all 5 cards opened
export default function WinBox({ images, onAgain, onHome }) {
  return (
    <div id="win">
      <div className="winBox">
        <div className="big">🎉</div>
        <h2>เก่งมาก!<br /><span>Great job!</span></h2>
        <div id="winCards">{images.map(({ src, alt }) => <img key={src} src={src} alt={alt} />)}</div>
        <div className="winBtns">
          <button id="again" className="act done" onClick={onAgain}><span>🔁</span><b>เล่นอีกครั้ง</b></button>
          <button id="winHome" className="act home" onClick={onHome}><span>🏠</span><b>เลือกชุดอื่น</b></button>
        </div>
      </div>
    </div>
  );
}
