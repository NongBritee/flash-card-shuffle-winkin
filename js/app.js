/* Router:  #/          → home page (choose a set)
            #/<setId>   → card game for that set            */
(function () {
  const menu = document.getElementById('menu'), game = document.getElementById('game');
  const HOME_THEME = { sky1: '#a5d8ff', sky2: '#fff0f6', hill1: '#d3f9d8', hill2: '#ffe8cc', accent: '#7048e8', accentDark: '#5f3dc4' };

  function theme(t) {
    const r = document.documentElement.style;
    Object.entries(t).forEach(([k, v]) => r.setProperty('--' + k, v));
    const m = document.querySelector('meta[name=theme-color]');
    if (m) m.content = t.sky1;
  }

  function route() {
    const id = (location.hash.match(/^#\/([\w-]+)/) || [])[1];
    const set = id && SETS.get(id);
    if (set) {
      theme(set.theme);
      menu.hidden = true; game.hidden = false;
      document.title = `${set.title} · ${set.th} — Word Cards`;
      Game.start(set, { onWin: Menu.recordWin });
    } else {
      Game.stop();
      theme(HOME_THEME);
      game.hidden = true; menu.hidden = false;
      document.title = 'Word Cards การ์ดคำศัพท์';
      Menu.show();
    }
  }

  document.getElementById('home').addEventListener('click', () => { location.hash = '#/'; });
  document.getElementById('winHome').addEventListener('click', () => { location.hash = '#/'; });
  window.addEventListener('hashchange', route);
  route();
})();
