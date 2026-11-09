// Confetti burst drawn on a full-screen <canvas>
export default function confetti(canvas) {
  if (!canvas) return;
  const g = canvas.getContext('2d');
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  const cols = ['#FF6B6B', '#FFD43B', '#69DB7C', '#4DABF7', '#B197FC', '#FF8FD8'];
  const ps = Array.from({ length: 140 }, () => ({
    x: innerWidth / 2, y: innerHeight * .45,
    vx: (Math.random() - .5) * 16, vy: -Math.random() * 15 - 4,
    r: 5 + Math.random() * 6, c: cols[Math.floor(Math.random() * cols.length)], a: Math.random() * 6, va: (Math.random() - .5) * .4,
  }));
  let f = 0;
  (function step() {
    g.clearRect(0, 0, innerWidth, innerHeight);
    ps.forEach(p => {
      p.vy += .35; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.va;
      g.save(); g.translate(p.x, p.y); g.rotate(p.a); g.fillStyle = p.c;
      g.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); g.restore();
    });
    if (++f < 200) requestAnimationFrame(step); else g.clearRect(0, 0, innerWidth, innerHeight);
  })();
}
