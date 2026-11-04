/* Set 2 — Days of the week. A cute calendar page in the Thai colour of each day,
   with the day's sky symbol: Sun-day ☀, Mon-day 🌙 (moon), Tues ♂ Mars, Thurs ♃ Jupiter, Fri ♀ Venus (hearts). */
(function () {
  const { face, sparkle, heart, star, vgrad, dots } = ART.h;

  const bg = (id, a, b) => `
    <defs>${vgrad('sky-' + id, a, b)}</defs>
    <rect width="540" height="500" fill="url(#sky-${id})"/>
    <circle cx="60" cy="420" r="120" fill="#fff" opacity=".18"/><circle cx="500" cy="470" r="140" fill="#fff" opacity=".15"/>
    ${dots(22, '#fff', .45, 540, 500, 3)}`;

  // calendar page centred at (270, 280)
  const calendar = (abbr, col, dark) => {
    let grid = '';
    for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++)
      grid += `<rect x="${-118 + c * 40}" y="${92 + r * 24}" width="28" height="14" rx="5" fill="${col}" opacity="${(r * 6 + c) % 5 === 2 ? .9 : .28}"/>`;
    return `<g transform="translate(270,288)">
      <rect x="-150" y="-140" width="300" height="290" rx="34" fill="${dark}" opacity=".25" transform="translate(8,12)"/>
      <rect x="-150" y="-140" width="300" height="290" rx="34" fill="#fff"/>
      <path d="M-150,-106 a34,34 0 0 1 34,-34 h232 a34,34 0 0 1 34,34 v44 h-300z" fill="${col}"/>
      <text x="0" y="-82" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="52" fill="#fff" letter-spacing="4">${abbr}</text>
      ${[-80, 80].map(x => `<rect x="${x - 11}" y="-164" width="22" height="48" rx="11" fill="#4B4B6B"/><circle cx="${x}" cy="-118" r="7" fill="${dark}" opacity=".5"/>`).join('')}
      ${face(0, 8, 1.45)}
      ${grid}
    </g>`;
  };

  const sun = (x, y, r) => {
    let rays = '';
    for (let i = 0; i < 12; i++) rays += `<rect x="-9" y="${-r - 36}" width="18" height="34" rx="9" fill="${i % 2 ? '#FFB703' : '#FF9F1C'}" transform="rotate(${i * 30})"/>`;
    return `<g transform="translate(${x},${y})">${rays}<circle r="${r}" fill="#FFD43B" stroke="#FF9F1C" stroke-width="5"/>${face(0, -4, r / 70)}</g>`;
  };
  const moon = (x, y, r) => `<g transform="translate(${x},${y}) rotate(-20)">
      <path d="M0,${-r} A${r},${r} 0 1 0 0,${r} A${r * .72},${r} 0 1 1 0,${-r}Z" fill="#FFE066" stroke="#FAB005" stroke-width="5" stroke-linejoin="round"/>
      <circle cx="${-r * .55}" cy="${-r * .1}" r="5" fill="#2B2140"/><path d="M${-r * .7},${r * .22} q${r * .14},${r * .12} ${r * .28},0" stroke="#2B2140" stroke-width="4" fill="none" stroke-linecap="round"/>
      <ellipse cx="${-r * .72}" cy="${r * .08}" rx="7" ry="4" fill="#FF8FA3" opacity=".8"/></g>`;
  const planet = (x, y, r, fill, bands, ring) => `<g transform="translate(${x},${y})">
      <defs><clipPath id="pl-${fill.slice(1)}"><circle r="${r}"/></clipPath></defs>
      ${ring ? `<ellipse rx="${r * 1.6}" ry="${r * .42}" fill="none" stroke="${ring}" stroke-width="9" transform="rotate(-18)"/>` : ''}
      <circle r="${r}" fill="${fill}"/>
      <g clip-path="url(#pl-${fill.slice(1)})">${bands}</g>
      <circle r="${r}" fill="none" stroke="#fff" stroke-width="4" opacity=".7"/>
      ${ring ? `<path d="M${-r * 1.52},${r * .1} A${r * 1.6},${r * .42} 0 0 0 ${r * 1.52},${-r * .1}" fill="none" stroke="${ring}" stroke-width="9" transform="rotate(-18)"/>` : ''}
      ${face(0, -2, r / 80)}</g>`;
  const rocket = (x, y, rot) => `<g transform="translate(${x},${y}) rotate(${rot})">
      <path d="M-10,34 q10,30 20,0Z" fill="#FF922B"/><path d="M-6,34 q6,18 12,0Z" fill="#FFD43B"/>
      <path d="M0,-40 C22,-20 22,14 14,34 L-14,34 C-22,14 -22,-20 0,-40Z" fill="#fff" stroke="#ADB5BD" stroke-width="3"/>
      <path d="M0,-40 C10,-31 15,-22 17,-14 L-17,-14 C-15,-22 -10,-31 0,-40Z" fill="#FA5252"/>
      <circle cy="2" r="8" fill="#74C0FC" stroke="#4C6EF5" stroke-width="3"/>
      <path d="M-14,14 L-28,36 L-14,32Z M14,14 L28,36 L14,32Z" fill="#FA5252"/></g>`;

  const scenes = {
    monday() {
      return `${bg('mon', '#FFE98A', '#FFF8D6')}
        ${moon(420, 105, 66)}
        ${star(70, 80, 20, '#FFF')}${star(140, 140, 12, '#FFD43B')}${sparkle(480, 220, 14)}${sparkle(60, 230, 12)}
        ${calendar('MON', '#FAB005', '#E67700')}`;
    },
    tuesday() {
      const bands = `<circle cx="-24" cy="-20" r="14" fill="#C2255C" opacity=".35"/><circle cx="28" cy="22" r="10" fill="#C2255C" opacity=".35"/><circle cx="-6" cy="40" r="7" fill="#C2255C" opacity=".35"/>`;
      return `${bg('tue', '#FFC2DD', '#FFF0F6')}
        ${planet(425, 108, 62, '#FF6B8A', bands, null)}
        ${rocket(90, 120, 30)}
        ${sparkle(330, 60, 12)}${sparkle(490, 240, 14)}${star(60, 240, 14, '#fff')}
        ${calendar('TUE', '#F06595', '#C2255C')}`;
    },
    thursday() {
      const bands = `<rect x="-90" y="-44" width="180" height="16" fill="#E8590C" opacity=".55"/><rect x="-90" y="-8" width="180" height="12" fill="#FFF4E6" opacity=".7"/>
        <rect x="-90" y="22" width="180" height="16" fill="#E8590C" opacity=".55"/><ellipse cx="26" cy="30" rx="16" ry="10" fill="#C92A2A" opacity=".8"/>`;
      return `${bg('thu', '#FFD8A8', '#FFF4E6')}
        ${planet(420, 110, 64, '#FFA94D', bands, '#FFD8A8')}
        ${star(80, 90, 18, '#fff')}${sparkle(150, 50, 12)}${sparkle(480, 250, 14)}${sparkle(60, 240, 12)}
        ${calendar('THU', '#FD7E14', '#D9480F')}`;
    },
    friday() {
      return `${bg('fri', '#B8E2FF', '#EEF8FF')}
        ${heart(425, 100, 3.1, '#FF6B8A')}${face(425, 92, .85)}
        ${heart(90, 110, 1.4, '#FFA8C5')}${heart(160, 60, .9, '#FF8FB1')}${heart(490, 240, 1, '#FFA8C5')}
        ${sparkle(330, 60, 12)}${sparkle(60, 240, 14)}
        ${calendar('FRI', '#339AF0', '#1971C2')}`;
    },
    sunday() {
      return `${bg('sun', '#FFC9C2', '#FFF1EF')}
        ${sun(425, 105, 52)}
        ${star(80, 90, 18, '#fff')}${sparkle(150, 160, 12)}${sparkle(60, 240, 12)}${sparkle(480, 250, 14)}
        ${calendar('SUN', '#FA5252', '#C92A2A')}`;
    },
  };

  ART.add('days', { scenes });
})();
