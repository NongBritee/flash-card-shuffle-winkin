/* Shared card-art toolkit. Each design/sets/<id>.js registers its scenes with ART.add(id, {...}).
   Word data (en/th/colours) comes from sets/<id>/set.js so there is one source of truth.
   Card size 600 x 840 (5:7). Illustration panel: x30 y30 w540 h500.
   Thai label pill: x60 y712 w480 h88 (the game covers it until the answer is revealed). */
(function () {
  const W = 600, H = 840;

  /* ---------- drawing helpers ---------- */
  const face = (x, y, s = 1, mouth = 'smile') => {
    const e = 9 * s, gap = 26 * s;
    const m = mouth === 'o'
      ? `<ellipse cx="${x}" cy="${y + 20 * s}" rx="${8 * s}" ry="${10 * s}" fill="#5A2A1A"/>`
      : mouth === 'sleep'
      ? `<path d="M${x - 9 * s},${y + 16 * s} Q${x},${y + 24 * s} ${x + 9 * s},${y + 16 * s}" stroke="#4A3A5A" stroke-width="${4 * s}" fill="none" stroke-linecap="round"/>`
      : `<path d="M${x - 14 * s},${y + 14 * s} Q${x},${y + 32 * s} ${x + 14 * s},${y + 14 * s} Z" fill="#7A2E1E"/><path d="M${x - 7 * s},${y + 22 * s} Q${x},${y + 30 * s} ${x + 7 * s},${y + 22 * s} Z" fill="#FF6F91"/>`;
    const eyes = mouth === 'sleep'
      ? `<path d="M${x - gap - e},${y} Q${x - gap},${y + e} ${x - gap + e},${y}" stroke="#3A2E4A" stroke-width="${4 * s}" fill="none" stroke-linecap="round"/>
         <path d="M${x + gap - e},${y} Q${x + gap},${y + e} ${x + gap + e},${y}" stroke="#3A2E4A" stroke-width="${4 * s}" fill="none" stroke-linecap="round"/>`
      : `<ellipse cx="${x - gap}" cy="${y}" rx="${e}" ry="${e * 1.25}" fill="#2B2140"/>
         <ellipse cx="${x + gap}" cy="${y}" rx="${e}" ry="${e * 1.25}" fill="#2B2140"/>
         <circle cx="${x - gap + 3 * s}" cy="${y - 4 * s}" r="${3.4 * s}" fill="#fff"/>
         <circle cx="${x + gap + 3 * s}" cy="${y - 4 * s}" r="${3.4 * s}" fill="#fff"/>`;
    return `<g>${eyes}
      <ellipse cx="${x - gap - 12 * s}" cy="${y + 16 * s}" rx="${10 * s}" ry="${6 * s}" fill="#FF8FA3" opacity=".75"/>
      <ellipse cx="${x + gap + 12 * s}" cy="${y + 16 * s}" rx="${10 * s}" ry="${6 * s}" fill="#FF8FA3" opacity=".75"/>
      ${m}</g>`;
  };

  // fluffy cloud built from circles, centred on (x,y), width ~ 220*s
  const cloud = (x, y, s = 1, fill = '#fff', shade = '#DCE7F7') => {
    const bumps = [[-70, 10, 42], [-28, -22, 56], [30, -30, 60], [78, 4, 44]];
    const shape = (dy, f) => `<g fill="${f}">${bumps.map(([bx, by, r]) =>
      `<circle cx="${x + bx * s}" cy="${y + by * s + dy}" r="${r * s}"/>`).join('')}
      <rect x="${x - 110 * s}" y="${y + dy}" width="${220 * s}" height="${50 * s}" rx="${25 * s}"/></g>`;
    return shape(8 * s, shade) + shape(0, fill);
  };

  const sparkle = (x, y, r, fill = '#fff', op = 1) =>
    `<path d="M${x},${y - r} Q${x + r * .18},${y - r * .18} ${x + r},${y} Q${x + r * .18},${y + r * .18} ${x},${y + r} Q${x - r * .18},${y + r * .18} ${x - r},${y} Q${x - r * .18},${y - r * .18} ${x},${y - r}Z" fill="${fill}" opacity="${op}"/>`;

  const drop = (x, y, s = 1, fill = '#4CC9F0') =>
    `<path transform="translate(${x},${y}) scale(${s})" d="M0,-20 C9,-7 13,0 13,7 A13,13 0 0 1 -13,7 C-13,0 -9,-7 0,-20Z" fill="${fill}"/>
     <ellipse cx="${x - 4 * s}" cy="${y + 4 * s}" rx="${3 * s}" ry="${5 * s}" fill="#fff" opacity=".7"/>`;

  const flake = (x, y, r, sw = 4, col = '#fff') => {
    let d = '';
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3, c = Math.cos(a), s = Math.sin(a);
      const bx = x + c * r * .55, by = y + s * r * .55;
      const b1 = a + .7, b2 = a - .7, bl = r * .32;
      d += `M${x},${y} L${x + c * r},${y + s * r} `;
      d += `M${bx},${by} L${bx + Math.cos(b1) * bl},${by + Math.sin(b1) * bl} M${bx},${by} L${bx + Math.cos(b2) * bl},${by + Math.sin(b2) * bl} `;
    }
    return `<path d="${d}" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" fill="none"/>`;
  };

  const flower = (x, y, s, petal, center = '#FFD60A') => {
    let p = '';
    for (let i = 0; i < 5; i++) {
      const a = i * 72 * Math.PI / 180;
      p += `<circle cx="${x + Math.cos(a) * 9 * s}" cy="${y + Math.sin(a) * 9 * s}" r="${7 * s}" fill="${petal}"/>`;
    }
    return `<path d="M${x},${y} L${x},${y + 30 * s}" stroke="#2D9D3A" stroke-width="${3 * s}"/>${p}<circle cx="${x}" cy="${y}" r="${6 * s}" fill="${center}"/>`;
  };

  const heart = (x, y, s = 1, fill = '#FF6B8A') =>
    `<path transform="translate(${x},${y}) scale(${s})" d="M0,18 C-28,-2 -26,-26 -12,-28 C-4,-29 0,-22 0,-18 C0,-22 4,-29 12,-28 C26,-26 28,-2 0,18Z" fill="${fill}"/>`;
  const star = (x, y, r, fill = '#FFD43B', rot = 0) => {
    let d = '';
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5 + rot, rr = i % 2 ? r * .48 : r;
      d += (i ? 'L' : 'M') + (x + Math.cos(a) * rr).toFixed(1) + ',' + (y + Math.sin(a) * rr).toFixed(1);
    }
    return `<path d="${d}Z" fill="${fill}" stroke="#fff" stroke-width="${r * .12}" stroke-linejoin="round"/>`;
  };
  const shadow = (x, y, rx, ry = rx * .18, op = .18) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#000" opacity="${op}"/>`;
  const dots = (n, col = '#fff', op = .5, w = 540, h = 380, seed = 1) => {
    let s = '';
    for (let i = 0; i < n; i++) s += `<circle cx="${(i * 97 * seed + 31) % w}" cy="${(i * 53 * seed + 17) % h}" r="${4 + (i % 3) * 2}" fill="${col}" opacity="${op}"/>`;
    return s;
  };
  const vgrad = (id, a, b) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  const hills = (a, b) => `<path d="M-20,440 Q140,395 290,435 T560,420 L560,520 L-20,520Z" fill="${a}"/>
      <path d="M-20,470 Q190,435 360,465 T560,458 L560,520 L-20,520Z" fill="${b}"/>`;

  const h = { face, cloud, sparkle, drop, flake, flower, heart, star, shadow, dots, vgrad, hills };

  /* ---------- registry ---------- */
  const designs = {};
  const add = (id, d) => { designs[id] = d; };

  /* ---------- card front ---------- */
  function front(set, w) {
    const d = designs[set.id];
    const letters = w.letters || set.palette;
    const c1 = w.c1, c2 = w.c2, ink = w.ink;
    const tsp = [...w.en].map((ch, i) => `<tspan fill="${letters[i % letters.length]}">${ch}</tspan>`).join('');
    const uid = `${set.id}-${w.id}`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" id="card-${w.id}">
    <defs>
      <linearGradient id="bg-${uid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
      <clipPath id="clip-${uid}"><rect x="30" y="30" width="540" height="500" rx="34"/></clipPath>
      <filter id="sh-${uid}" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="6" stdDeviation="0" flood-color="${ink}" flood-opacity=".28"/></filter>
    </defs>
    <rect x="0" y="0" width="${W}" height="${H}" rx="48" fill="#fff"/>
    <rect x="12" y="12" width="${W - 24}" height="${H - 24}" rx="40" fill="url(#bg-${uid})"/>
    <g opacity=".22" fill="#fff">
      <circle cx="40" cy="600" r="36"/><circle cx="560" cy="580" r="26"/><circle cx="550" cy="800" r="44"/><circle cx="60" cy="810" r="22"/>
    </g>
    <g clip-path="url(#clip-${uid})"><g transform="translate(30,30)">${d.scenes[w.id]()}</g></g>
    <rect x="30" y="30" width="540" height="500" rx="34" fill="none" stroke="#fff" stroke-width="10"/>
    <g font-family="Fredoka" font-weight="700" font-size="${w.en.length > 5 ? 124 : 134}" stroke="#fff" stroke-width="16" stroke-linejoin="round" paint-order="stroke" filter="url(#sh-${uid})">
      <text class="word" x="300" y="672" text-anchor="middle" letter-spacing="3">${tsp}</text></g>
    <g filter="url(#sh-${uid})"><rect x="60" y="712" width="480" height="88" rx="44" fill="#fff"/></g>
    <text class="thai" x="300" y="773" text-anchor="middle" font-family="Mitr" font-weight="600" font-size="52" fill="${ink}">${w.th}</text>
    ${sparkle(560, 70, 16, '#fff', .9)}${sparkle(42, 560, 12, '#fff', .8)}
    </svg>`;
  }

  /* ---------- card back (themed per set) ---------- */
  function back(set) {
    const b = set.back, d = designs[set.id] || {};
    let stars = '';
    for (let i = 0; i < 40; i++) {
      const x = 40 + (i * 137) % 520, y = 40 + (i * 89) % 760;
      stars += sparkle(x, y, 6 + (i % 4) * 3, '#fff', .18 + (i % 3) * .1);
    }
    const ring = (d.ring || b.ring).map((m, i) => {
      const a = -Math.PI / 2 + i * 2 * Math.PI / 5;
      const body = m.trim().startsWith('<') ? m : `<text y="16" text-anchor="middle" font-size="46" font-family="Noto Color Emoji">${m}</text>`;
      return `<g transform="translate(${(300 + Math.cos(a) * 222).toFixed(1)},${(400 + Math.sin(a) * 222).toFixed(1)})">${body}</g>`;
    }).join('');
    const arcs = b.arcs.map((c, i) => {
      const r = 190 - i * 16;
      return `<path d="M${300 - r},400 A${r},${r} 0 0 1 ${300 + r},400" stroke="${c}"/>`;
    }).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" id="card-back">
    <defs>
      <linearGradient id="bgB-${set.id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${b.c1}"/><stop offset=".55" stop-color="${b.c2}"/><stop offset="1" stop-color="${b.c3}"/></linearGradient>
      <radialGradient id="orb-${set.id}" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#FFF7B8"/><stop offset=".7" stop-color="#FFD43B"/><stop offset="1" stop-color="#FF9F1C"/></radialGradient>
    </defs>
    <rect width="${W}" height="${H}" rx="48" fill="#fff"/>
    <rect x="12" y="12" width="${W - 24}" height="${H - 24}" rx="40" fill="url(#bgB-${set.id})"/>
    <rect x="34" y="34" width="${W - 68}" height="${H - 68}" rx="30" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="2 16" stroke-linecap="round" opacity=".8"/>
    ${stars}
    <g fill="none" stroke-width="16" opacity=".9">${arcs}</g>
    ${ring}
    <circle cx="300" cy="400" r="118" fill="url(#orb-${set.id})" stroke="#fff" stroke-width="10"/>
    <text x="300" y="455" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="170" fill="#fff" stroke="#E8590C" stroke-width="10" paint-order="stroke">?</text>
    <text class="word" x="300" y="680" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="56" fill="#fff" stroke="${b.ink}" stroke-width="10" paint-order="stroke" letter-spacing="2">${set.title}</text>
    <text x="300" y="745" text-anchor="middle" font-family="Mitr" font-weight="600" font-size="38" fill="#FFF3B0">การ์ด${set.th}</text>
    </svg>`;
  }

  window.ART = { W, H, h, add, front, back, designs };
})();
