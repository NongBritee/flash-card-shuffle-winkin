/* Home page: one tile per vocabulary set (from SETS.list) */
(function () {
  const grid = document.getElementById('sets');
  const KEY = 'fc.wins';
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };

  function render() {
    const wins = load();
    grid.innerHTML = SETS.list.map(s => {
      const n = wins[s.id] || 0;
      const stars = [...Array(3)].map((_, i) => `<i class="${i < n ? 'on' : ''}">⭐</i>`).join('');
      const [a, b] = [s.words[0], s.words[s.words.length - 1]];
      return `<a class="setTile" href="#/${s.id}" style="--c1:${s.back.c1};--c2:${s.back.c2};--c3:${s.back.c3}" aria-label="ชุดที่ ${s.no} ${s.title} ${s.th}">
        <span class="no">${s.no}</span>
        <span class="fan">
          <img src="${SETS.img(s, a.id)}" alt="" loading="lazy" draggable="false">
          <img src="${SETS.img(s, b.id)}" alt="" loading="lazy" draggable="false">
          <img src="${SETS.img(s, 'back')}" alt="" draggable="false">
        </span>
        <span class="name"><b class="en">${s.title}</b><span class="th">${s.th}</span></span>
        <span class="words">${s.words.map(w => w.en).join(' · ')}</span>
        <span class="stars" aria-label="เล่นจบ ${n} รอบ">${stars}</span>
      </a>`;
    }).join('');
  }

  window.Menu = {
    show: render,
    recordWin(set) {
      const wins = load();
      wins[set.id] = (wins[set.id] || 0) + 1;
      try { localStorage.setItem(KEY, JSON.stringify(wins)); } catch (e) { /* private mode */ }
    },
  };
})();
