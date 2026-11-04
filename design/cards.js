/* Card art source (SVG). Rendered to cards/*.webp by design/render.js
   Card size: 600 x 840 (5:7). Illustration panel: x30 y30 w540 h500.
   Thai label pill sits at x60 y712 w480 h88 (the web game covers it until "แปล"). */
(function () {
  const W = 600, H = 840;

  const WORDS = [
    { id: 'sunny',  en: 'sunny',  th: 'แดดจ้า',
      c1: '#FFE066', c2: '#FF9F1C', ink: '#B4540A', letters: ['#FF6B35', '#FFB703', '#FB5607', '#FF006E', '#F77F00'] },
    { id: 'cloudy', en: 'cloudy', th: 'มีเมฆมาก',
      c1: '#CFE3FF', c2: '#7FA3D9', ink: '#2F4F86', letters: ['#5B7FC7', '#7B6CD9', '#4C9BE8', '#6C8EBF', '#8C7AE6', '#3E7CB1'] },
    { id: 'windy',  en: 'windy',  th: 'ลมแรง',
      c1: '#B8F5DD', c2: '#2EC4A6', ink: '#0B7461', letters: ['#12A889', '#2BB0D9', '#5CB85C', '#0E9F8A', '#3D9BE9'] },
    { id: 'rainy',  en: 'rainy',  th: 'ฝนตก',
      c1: '#A9D6FF', c2: '#3A86FF', ink: '#163E9C', letters: ['#3A86FF', '#4361EE', '#4CC9F0', '#3F37C9', '#4895EF'] },
    { id: 'snowy',  en: 'snowy',  th: 'หิมะตก',
      c1: '#EEF3FF', c2: '#A5B4FC', ink: '#3B3F9E', letters: ['#6C63FF', '#4EA8DE', '#9B5DE5', '#5E60CE', '#48BFE3'] },
  ];

  /* ---------- helpers ---------- */
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

  /* ---------- scenes (540 x 500) ---------- */
  const scenes = {
    sunny() {
      let rays = '';
      for (let i = 0; i < 12; i++) {
        const a = i * 30;
        rays += `<rect x="-14" y="-178" width="28" height="56" rx="14" fill="${i % 2 ? '#FFB703' : '#FF9F1C'}" transform="rotate(${a})"/>`;
      }
      return `
      <defs>
        <linearGradient id="skyS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4FC3F7"/><stop offset="1" stop-color="#B3ECFF"/></linearGradient>
        <radialGradient id="sunG" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#FFF3A3"/><stop offset=".6" stop-color="#FFD43B"/><stop offset="1" stop-color="#FFB000"/></radialGradient>
        <radialGradient id="glowS"><stop offset="0" stop-color="#FFF7C2" stop-opacity=".9"/><stop offset="1" stop-color="#FFF7C2" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="540" height="500" fill="url(#skyS)"/>
      <circle cx="270" cy="215" r="230" fill="url(#glowS)"/>
      ${cloud(80, 90, .55)}${cloud(470, 130, .5)}
      <g transform="translate(270,215)">${rays}</g>
      <circle cx="270" cy="215" r="112" fill="url(#sunG)" stroke="#FF9F1C" stroke-width="6"/>
      ${face(270, 205, 1.5)}
      <path d="M-20,430 Q120,360 300,420 T560,400 L560,520 L-20,520Z" fill="#7BD957"/>
      <path d="M-20,460 Q160,410 330,455 T560,440 L560,520 L-20,520Z" fill="#4CB944"/>
      ${flower(70, 440, 1, '#FF6FAE')}${flower(140, 462, .8, '#FFFFFF')}${flower(420, 445, 1, '#B388FF')}${flower(480, 470, .8, '#FF6FAE')}${flower(330, 470, .75, '#FFD60A', '#FF7A00')}
      ${sparkle(110, 210, 14)}${sparkle(440, 250, 18)}${sparkle(420, 60, 10)}`;
    },

    cloudy() {
      return `
      <defs>
        <linearGradient id="skyC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FB3E8"/><stop offset="1" stop-color="#DCE9FA"/></linearGradient>
      </defs>
      <rect width="540" height="500" fill="url(#skyC)"/>
      <g opacity=".95">
        <circle cx="400" cy="120" r="70" fill="#FFD43B" stroke="#FFB000" stroke-width="5"/>
        ${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<rect x="392" y="22" width="16" height="30" rx="8" fill="#FFB703" transform="rotate(${a} 400 120)"/>`).join('')}
      </g>
      ${cloud(120, 110, .62, '#F4F7FC', '#C3D3EA')}
      ${cloud(275, 245, 1.45, '#FFFFFF', '#C9D8EE')}
      ${face(275, 232, 1.35)}
      ${cloud(430, 360, .72, '#EEF3FB', '#BFCFE8')}
      ${face(430, 352, .65, 'sleep')}
      ${cloud(95, 330, .6, '#F1F5FC', '#C3D3EA')}
      ${face(95, 322, .55, 'sleep')}
      <path d="M-20,450 Q140,405 290,445 T560,430 L560,520 L-20,520Z" fill="#8FC9A0"/>
      <path d="M-20,475 Q190,440 360,470 T560,465 L560,520 L-20,520Z" fill="#6AAF7E"/>`;
    },

    windy() {
      const leaf = (x, y, r, c) => `<g transform="translate(${x},${y}) rotate(${r})"><path d="M0,-16 Q14,0 0,16 Q-14,0 0,-16Z" fill="${c}"/><path d="M0,-14 L0,14" stroke="#fff" stroke-width="1.6" opacity=".7"/></g>`;
      return `
      <defs>
        <linearGradient id="skyW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7EE0F5"/><stop offset="1" stop-color="#D9FBF3"/></linearGradient>
      </defs>
      <rect width="540" height="500" fill="url(#skyW)"/>
      <!-- blowing cloud -->
      ${cloud(120, 120, .95)}
      ${face(105, 110, .9, 'o')}
      <ellipse cx="72" cy="128" rx="13" ry="9" fill="#FF8FA3" opacity=".8"/><ellipse cx="140" cy="128" rx="13" ry="9" fill="#FF8FA3" opacity=".8"/>
      <!-- wind swirls -->
      <g id="swirls" fill="none" stroke-linecap="round">
        <g stroke="#58BFD6" stroke-width="20" opacity=".55">
          <path d="M200,150 C280,140 360,170 420,150 C470,132 470,80 430,80 C400,80 395,115 420,118"/>
          <path d="M190,215 C290,205 350,235 450,220 C500,212 515,258 485,268 C462,276 450,252 468,246"/>
          <path d="M210,285 C270,280 320,300 380,292"/>
        </g>
        <g stroke="#fff" stroke-width="11">
          <path d="M200,150 C280,140 360,170 420,150 C470,132 470,80 430,80 C400,80 395,115 420,118"/>
          <path d="M190,215 C290,205 350,235 450,220 C500,212 515,258 485,268 C462,276 450,252 468,246"/>
          <path d="M210,285 C270,280 320,300 380,292"/>
        </g>
      </g>
      <!-- kite -->
      <g transform="translate(450,340) rotate(18) scale(1.25)">
        <path d="M0,-58 L40,0 L0,62 L-40,0Z" fill="#FF5D8F" stroke="#fff" stroke-width="5" stroke-linejoin="round"/>
        <path d="M0,-58 L0,62 M-40,0 L40,0" stroke="#fff" stroke-width="4"/>
        <path d="M0,-58 L40,0 L0,0Z" fill="#FFD43B"/><path d="M0,0 L-40,0 L0,62Z" fill="#FFD43B"/>
        <path d="M0,62 C-20,90 20,110 -6,140" stroke="#5E60CE" stroke-width="4" fill="none"/>
        <path d="M-4,90 l-14,-8 l2,16Z M-2,120 l-14,-6 l4,14Z" fill="#5E60CE"/>
      </g>
      <!-- bending tree -->
      <path d="M60,470 C70,420 85,385 120,350" stroke="#8D5A3B" stroke-width="22" fill="none" stroke-linecap="round"/>
      <g fill="#36B37E">
        <circle cx="140" cy="320" r="48"/><circle cx="195" cy="335" r="38"/><circle cx="110" cy="285" r="34"/><circle cx="175" cy="290" r="36"/>
      </g>
      <g fill="#57D196"><circle cx="150" cy="300" r="22"/><circle cx="190" cy="320" r="16"/></g>
      ${leaf(260, 345, 40, '#5CC75C')}${leaf(320, 380, -20, '#FFB703')}${leaf(290, 420, 70, '#36B37E')}${leaf(370, 330, 10, '#F77F00')}${leaf(240, 400, -50, '#FFB703')}
      <path d="M-20,460 Q150,430 300,455 T560,445 L560,520 L-20,520Z" fill="#5BC97A"/>
      <g stroke="#3FA45F" stroke-width="4" stroke-linecap="round">
        <path d="M300,470 q12,-14 26,-18"/><path d="M330,478 q14,-14 28,-16"/><path d="M420,468 q12,-14 26,-18"/><path d="M450,480 q12,-14 26,-16"/>
      </g>`;
    },

    rainy() {
      let drops = '';
      const pts = [[60, 240], [120, 300], [180, 250], [230, 320], [300, 260], [350, 330], [410, 255], [470, 310], [90, 370], [490, 400], [150, 420], [270, 380]];
      pts.forEach(([x, y], i) => drops += drop(x, y, 1 + (i % 3) * .15, i % 2 ? '#4CC9F0' : '#6FA8FF'));
      return `
      <defs>
        <linearGradient id="skyR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5D7FD8"/><stop offset="1" stop-color="#A9C9F5"/></linearGradient>
      </defs>
      <rect width="540" height="500" fill="url(#skyR)"/>
      <!-- rainbow -->
      <g fill="none" stroke-width="12" opacity=".75">
        <path d="M330,250 A140,140 0 0 1 610,250" stroke="#FF6B6B"/><path d="M342,250 A128,128 0 0 1 598,250" stroke="#FFD43B"/>
        <path d="M354,250 A116,116 0 0 1 586,250" stroke="#69DB7C"/><path d="M366,250 A104,104 0 0 1 574,250" stroke="#4DABF7"/>
      </g>
      ${cloud(270, 135, 1.4, '#F2F6FF', '#9DB3E0')}
      ${face(270, 122, 1.3)}
      ${drops}
      <!-- puddles -->
      <path d="M-20,450 Q140,425 290,445 T560,440 L560,520 L-20,520Z" fill="#6BC27A"/>
      <ellipse cx="150" cy="462" rx="80" ry="16" fill="#7FC8FF"/><ellipse cx="150" cy="462" rx="50" ry="9" fill="none" stroke="#fff" stroke-width="3" opacity=".8"/>
      <ellipse cx="400" cy="472" rx="70" ry="13" fill="#7FC8FF"/><ellipse cx="400" cy="472" rx="40" ry="7" fill="none" stroke="#fff" stroke-width="3" opacity=".8"/>
      <!-- umbrella -->
      <g transform="translate(300,300) rotate(-12)">
        <path d="M0,0 L0,120 q0,22 -20,22 q-18,0 -18,-18" stroke="#6B4F3A" stroke-width="8" fill="none" stroke-linecap="round"/>
        <path d="M-100,10 Q-100,-90 0,-92 Q100,-90 100,10 Q83,-8 66,10 Q50,-8 33,10 Q16,-8 0,10 Q-16,-8 -33,10 Q-50,-8 -66,10 Q-83,-8 -100,10Z" fill="#FF4D6D"/>
        <path d="M0,-92 Q-36,-60 -33,10 L0,10 Z" fill="#FFD43B"/>
        <path d="M0,-92 Q66,-50 66,10 L33,10 Q36,-60 0,-92Z" fill="#FFD43B"/>
        <circle cx="0" cy="-96" r="7" fill="#6B4F3A"/>
      </g>`;
    },

    snowy() {
      let flakes = '';
      const f = [[60, 70, 18], [160, 40, 12], [480, 60, 20], [400, 150, 12], [90, 190, 14], [500, 230, 16], [40, 300, 12], [250, 50, 10], [330, 100, 14], [180, 140, 10], [460, 330, 12]];
      f.forEach(([x, y, r]) => flakes += flake(x, y, r, r > 14 ? 4.5 : 3.5));
      let dots = '';
      for (let i = 0; i < 26; i++) dots += `<circle cx="${(i * 97) % 540}" cy="${(i * 53) % 420}" r="${3 + (i % 3)}" fill="#fff" opacity=".85"/>`;
      const pine = (x, y, s) => `<g transform="translate(${x},${y}) scale(${s})">
        <rect x="-8" y="0" width="16" height="26" fill="#7A4E2D"/>
        <path d="M0,-130 L-50,-50 L-30,-50 L-62,0 L62,0 L30,-50 L50,-50Z" fill="#2F9E6E"/>
        <path d="M0,-130 L-22,-95 Q0,-85 22,-95Z M-34,-55 Q0,-40 34,-55 L30,-50 L-30,-50Z M-50,-12 Q0,6 50,-12 L62,0 L-62,0Z" fill="#fff"/></g>`;
      return `
      <defs>
        <linearGradient id="skyN" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6A74D9"/><stop offset="1" stop-color="#C9D4FF"/></linearGradient>
      </defs>
      <rect width="540" height="500" fill="url(#skyN)"/>
      ${dots}${flakes}
      ${pine(80, 420, 1)}${pine(470, 410, .85)}
      <path d="M-20,410 Q140,370 300,405 T560,395 L560,520 L-20,520Z" fill="#F4F7FF"/>
      <path d="M-20,450 Q180,420 360,450 T560,440 L560,520 L-20,520Z" fill="#E1E8FF"/>
      <!-- snowman -->
      <g>
        <ellipse cx="270" cy="440" rx="95" ry="20" fill="#C8D3F5"/>
        <circle cx="270" cy="365" r="88" fill="#fff" stroke="#D7DFF7" stroke-width="5"/>
        <circle cx="270" cy="225" r="66" fill="#fff" stroke="#D7DFF7" stroke-width="5"/>
        <path d="M185,330 L120,280 M130,288 L110,290 M128,286 L120,266" stroke="#7A4E2D" stroke-width="8" stroke-linecap="round" fill="none"/>
        <path d="M355,330 L420,280 M410,288 L430,290 M412,286 L420,266" stroke="#7A4E2D" stroke-width="8" stroke-linecap="round" fill="none"/>
        <circle cx="270" cy="345" r="9" fill="#3A3A5A"/><circle cx="270" cy="380" r="9" fill="#3A3A5A"/><circle cx="270" cy="415" r="8" fill="#3A3A5A"/>
        <!-- scarf -->
        <path d="M205,282 Q270,312 335,282 L338,300 Q270,332 202,300Z" fill="#FF4D6D"/>
        <path d="M300,300 L318,360 L292,364 L282,305Z" fill="#FF4D6D"/>
        <path d="M300,345 l18,15 M296,330 l18,12" stroke="#FFD43B" stroke-width="5"/>
        <!-- hat -->
        <rect x="212" y="158" width="116" height="16" rx="8" fill="#3B4CCA"/>
        <rect x="230" y="98" width="80" height="66" rx="10" fill="#3B4CCA"/>
        <rect x="230" y="140" width="80" height="14" fill="#FFD43B"/>
        ${face(270, 222, 1.05)}
        <path d="M270,240 L312,250 L270,256Z" fill="#FF8C1A"/>
      </g>`;
    },
  };

  /* ---------- card front ---------- */
  function front(w) {
    const fs = w.en.length > 5 ? 124 : 134;
    const letters = `<text x="300" y="672" text-anchor="middle" letter-spacing="3">${[...w.en].map((ch, i) =>
      `<tspan fill="${w.letters[i % w.letters.length]}">${ch}</tspan>`).join('')}</text>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" id="card-${w.id}">
    <defs>
      <linearGradient id="bg-${w.id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${w.c1}"/><stop offset="1" stop-color="${w.c2}"/></linearGradient>
      <clipPath id="clip-${w.id}"><rect x="30" y="30" width="540" height="500" rx="34"/></clipPath>
      <filter id="sh-${w.id}" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="6" stdDeviation="0" flood-color="${w.ink}" flood-opacity=".28"/></filter>
    </defs>
    <rect x="0" y="0" width="${W}" height="${H}" rx="48" fill="#fff"/>
    <rect x="12" y="12" width="${W - 24}" height="${H - 24}" rx="40" fill="url(#bg-${w.id})"/>
    <g opacity=".22" fill="#fff">
      <circle cx="40" cy="600" r="36"/><circle cx="560" cy="580" r="26"/><circle cx="550" cy="800" r="44"/><circle cx="60" cy="810" r="22"/>
    </g>
    <g clip-path="url(#clip-${w.id})"><g transform="translate(30,30)">${scenes[w.id]()}</g></g>
    <rect x="30" y="30" width="540" height="500" rx="34" fill="none" stroke="#fff" stroke-width="10"/>
    <g font-family="Fredoka" font-weight="700" font-size="${fs}" stroke="#fff" stroke-width="16" stroke-linejoin="round" paint-order="stroke" filter="url(#sh-${w.id})">${letters}</g>
    <g filter="url(#sh-${w.id})">
      <rect x="60" y="712" width="480" height="88" rx="44" fill="#fff"/>
    </g>
    <text x="300" y="773" text-anchor="middle" font-family="Mitr" font-weight="600" font-size="52" fill="${w.ink}">${w.th}</text>
    ${sparkle(560, 70, 16, '#fff', .9)}${sparkle(42, 560, 12, '#fff', .8)}
    </svg>`;
  }

  /* ---------- card back ---------- */
  function back() {
    let stars = '';
    for (let i = 0; i < 40; i++) {
      const x = 40 + (i * 137) % 520, y = 40 + (i * 89) % 760;
      stars += sparkle(x, y, 6 + (i % 4) * 3, '#fff', .18 + (i % 3) * .1);
    }
    const mini = [
      `<circle r="22" fill="#FFD43B"/>`,
      `<g transform="scale(.28)">${cloud(0, 0, 1)}</g>`,
      `<g transform="scale(1.3)">${drop(0, 0, 1, '#4CC9F0')}</g>`,
      flake(0, 0, 22, 5),
      `<path d="M-24,-6 C-4,-10 10,-2 22,-8 C34,-14 30,-30 18,-28" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-24,12 C0,8 12,16 26,10" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/>`,
    ];
    const ring = mini.map((m, i) => {
      const a = -Math.PI / 2 + i * 2 * Math.PI / 5;
      return `<g transform="translate(${300 + Math.cos(a) * 222},${400 + Math.sin(a) * 222})">${m}</g>`;
    }).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" id="card-back">
    <defs>
      <linearGradient id="bgB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7B5CFF"/><stop offset=".55" stop-color="#5B3FD9"/><stop offset="1" stop-color="#FF5DA2"/></linearGradient>
      <radialGradient id="orb" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#FFF7B8"/><stop offset=".7" stop-color="#FFD43B"/><stop offset="1" stop-color="#FF9F1C"/></radialGradient>
    </defs>
    <rect width="${W}" height="${H}" rx="48" fill="#fff"/>
    <rect x="12" y="12" width="${W - 24}" height="${H - 24}" rx="40" fill="url(#bgB)"/>
    <rect x="34" y="34" width="${W - 68}" height="${H - 68}" rx="30" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="2 16" stroke-linecap="round" opacity=".8"/>
    ${stars}
    <g fill="none" stroke-width="16" opacity=".9">
      <path d="M110,400 A190,190 0 0 1 490,400" stroke="#FF6B6B"/>
      <path d="M126,400 A174,174 0 0 1 474,400" stroke="#FFD43B"/>
      <path d="M142,400 A158,158 0 0 1 458,400" stroke="#69DB7C"/>
      <path d="M158,400 A142,142 0 0 1 442,400" stroke="#4DABF7"/>
    </g>
    ${ring}
    <circle cx="300" cy="400" r="118" fill="url(#orb)" stroke="#fff" stroke-width="10"/>
    <text x="300" y="455" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="170" fill="#fff" stroke="#E8590C" stroke-width="10" paint-order="stroke">?</text>
    <text x="300" y="680" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="56" fill="#fff" stroke="#3B23A8" stroke-width="10" paint-order="stroke" letter-spacing="2">Weather</text>
    <text x="300" y="745" text-anchor="middle" font-family="Mitr" font-weight="600" font-size="38" fill="#FFF3B0">การ์ดสภาพอากาศ</text>
    </svg>`;
  }

  window.CARD_ART = { WORDS, front, back, W, H };
})();
