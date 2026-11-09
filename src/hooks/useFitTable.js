import { useCallback, useEffect, useState } from 'react';

// Choose 5 / 3 / 2 cards per row — whichever gives the biggest card that still fits the free space.
export default function useFitTable(tableRef, screenRef, count) {
  const [style, setStyle] = useState({});
  const fit = useCallback(() => {
    const table = tableRef.current, screen = screenRef.current;
    if (!table || !screen) return;
    const cs = getComputedStyle(screen), tcs = getComputedStyle(table);
    const W = screen.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const H = table.clientHeight - parseFloat(tcs.paddingTop) - parseFloat(tcs.paddingBottom);
    if (W <= 0 || H <= 0) return;
    const gap = Math.max(10, Math.min(28, Math.min(W, H) * 0.03));
    let best = { w: 0, cols: 5 };
    for (const cols of [5, 3, 2]) {
      const rows = Math.ceil(count / cols);
      const w = Math.min((W - (cols - 1) * gap) / cols, ((H - (rows - 1) * gap) / rows) * 5 / 7);
      if (w > best.w) best = { w, cols };
    }
    const cw = Math.max(60, Math.floor(Math.min(best.w, 400)));
    setStyle({ '--cw': cw + 'px', '--gap': gap + 'px', maxWidth: Math.ceil(best.cols * cw + (best.cols - 1) * gap + 2) + 'px' });
  }, [tableRef, screenRef, count]);

  useEffect(() => {
    fit();
    const onRot = () => setTimeout(fit, 200);
    window.addEventListener('resize', fit);
    window.addEventListener('orientationchange', onRot);
    const ro = window.ResizeObserver ? new ResizeObserver(fit) : null;
    if (ro && tableRef.current) ro.observe(tableRef.current);
    if (document.fonts) document.fonts.ready.then(fit);
    return () => { window.removeEventListener('resize', fit); window.removeEventListener('orientationchange', onRot); ro && ro.disconnect(); };
  }, [fit, tableRef]);

  return style;
}
