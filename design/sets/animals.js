/* Set 5 — Animals (fish, lion, tiger, snake, bird): jungle / savanna / sea scenes */
(function () {
  const { sparkle, shadow, vgrad, flower } = ART.h;

  // big kawaii eyes + cheeks (for animal faces drawn by hand)
  const eyes = (x, y, gap, s = 1) => `
    <ellipse cx="${x - gap}" cy="${y}" rx="${11 * s}" ry="${14 * s}" fill="#2B2140"/><ellipse cx="${x + gap}" cy="${y}" rx="${11 * s}" ry="${14 * s}" fill="#2B2140"/>
    <circle cx="${x - gap + 4 * s}" cy="${y - 5 * s}" r="${4.5 * s}" fill="#fff"/><circle cx="${x + gap + 4 * s}" cy="${y - 5 * s}" r="${4.5 * s}" fill="#fff"/>`;
  const cheeks = (x, y, gap, s = 1) => `<ellipse cx="${x - gap}" cy="${y}" rx="${16 * s}" ry="${9 * s}" fill="#FF8FA3" opacity=".7"/><ellipse cx="${x + gap}" cy="${y}" rx="${16 * s}" ry="${9 * s}" fill="#FF8FA3" opacity=".7"/>`;
  const leaf = (x, y, r, s, c) => `<path transform="translate(${x},${y}) rotate(${r}) scale(${s})" d="M0,0 C30,-40 90,-40 120,0 C90,40 30,40 0,0Z" fill="${c}"/>`;
  const jungle = id => `<defs>${vgrad('j-' + id, '#9BE7B4', '#E9FBEF')}</defs>
    <rect width="540" height="500" fill="url(#j-${id})"/>
    ${leaf(-30, 60, 20, 1.3, '#2F9E44')}${leaf(-20, 150, -10, 1.1, '#40C057')}${leaf(570, 70, 160, 1.3, '#2F9E44')}${leaf(560, 170, 200, 1.1, '#51CF66')}
    ${leaf(-10, 330, -30, .9, '#37B24D')}${leaf(550, 340, 210, .9, '#37B24D')}
    <path d="M-20,430 Q140,400 290,430 T560,420 L560,520 L-20,520Z" fill="#69DB7C"/><path d="M-20,462 Q190,438 360,460 T560,455 L560,520 L-20,520Z" fill="#40C057"/>`;

  const scenes = {
    fish() {
      let bubbles = '';
      [[90, 120, 14], [120, 80, 9], [460, 300, 12], [480, 260, 7], [420, 90, 16], [70, 260, 8]].forEach(([x, y, r]) =>
        bubbles += `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#fff" stroke-width="4" opacity=".85"/><circle cx="${x - r * .35}" cy="${y - r * .35}" r="${r * .25}" fill="#fff"/>`);
      const weed = (x, h, c) => `<path d="M${x},500 C${x - 30},${500 - h * .3} ${x + 30},${500 - h * .6} ${x},${500 - h}" stroke="${c}" stroke-width="18" fill="none" stroke-linecap="round"/>`;
      return `<defs>${vgrad('sea', '#4DC3F0', '#C5F1FF')}</defs>
        <rect width="540" height="500" fill="url(#sea)"/>
        <path d="M0,40 Q60,60 120,40 T240,40 T360,40 T480,40 T600,40" stroke="#fff" stroke-width="5" fill="none" opacity=".4"/>
        <path d="M-20,450 Q140,430 290,452 T560,440 L560,520 L-20,520Z" fill="#FFE8A3"/>
        ${weed(60, 170, '#2F9E44')}${weed(95, 120, '#51CF66')}${weed(470, 150, '#2F9E44')}${weed(505, 200, '#51CF66')}
        <circle cx="160" cy="470" r="18" fill="#FF8787"/><circle cx="380" cy="476" r="14" fill="#B197FC"/>
        ${bubbles}
        <g transform="translate(275,250)">
          <path d="M-120,0 L-200,-80 Q-215,0 -200,80Z" fill="#FF922B" stroke="#E8590C" stroke-width="6" stroke-linejoin="round"/>
          <path d="M-20,-92 Q20,-150 70,-96Z" fill="#FF922B" stroke="#E8590C" stroke-width="5" stroke-linejoin="round"/>
          <ellipse rx="150" ry="104" fill="#FFA94D" stroke="#E8590C" stroke-width="6"/>
          <path d="M-60,-100 Q-36,0 -60,100" stroke="#fff" stroke-width="22" fill="none"/><path d="M-60,-100 Q-36,0 -60,100" stroke="#E8590C" stroke-width="4" fill="none" transform="translate(-13,0)"/>
          <ellipse cx="20" cy="50" rx="80" ry="36" fill="#FFD8A8"/>
          <path d="M-10,30 Q20,70 60,30" fill="#FF922B" stroke="#E8590C" stroke-width="5" stroke-linejoin="round"/>
          <ellipse cx="70" cy="-20" rx="24" ry="28" fill="#fff"/><ellipse cx="76" cy="-18" rx="14" ry="18" fill="#2B2140"/><circle cx="81" cy="-25" r="6" fill="#fff"/>
          <ellipse cx="96" cy="22" rx="16" ry="9" fill="#FF8FA3" opacity=".8"/>
          <path d="M112,26 Q126,36 136,22" stroke="#7A2E1E" stroke-width="6" fill="none" stroke-linecap="round"/>
        </g>`;
    },

    lion() {
      let mane = '';
      for (let i = 0; i < 16; i++) {
        const a = i * Math.PI / 8;
        mane += `<circle cx="${(Math.cos(a) * 128).toFixed(1)}" cy="${(Math.sin(a) * 124).toFixed(1)}" r="52" fill="${i % 2 ? '#E8590C' : '#F76707'}"/>`;
      }
      return `<defs>${vgrad('sav', '#FFD8A8', '#FFF4E6')}</defs>
        <rect width="540" height="500" fill="url(#sav)"/>
        <circle cx="460" cy="80" r="46" fill="#FFD43B" opacity=".9"/>
        <path d="M-20,420 Q140,390 290,420 T560,410 L560,520 L-20,520Z" fill="#F4D35E"/><path d="M-20,460 Q190,436 360,458 T560,452 L560,520 L-20,520Z" fill="#E9B44C"/>
        <g transform="translate(50,330)"><rect x="-6" y="0" width="12" height="90" fill="#8D5A3B"/><ellipse cx="0" cy="-6" rx="70" ry="22" fill="#5C940D"/></g>
        <g transform="translate(270,240)">
          ${mane}
          <circle r="120" fill="#C2410C" opacity=".25"/>
          <circle cx="-78" cy="-80" r="28" fill="#FFC078"/><circle cx="78" cy="-80" r="28" fill="#FFC078"/><circle cx="-78" cy="-80" r="14" fill="#FF922B"/><circle cx="78" cy="-80" r="14" fill="#FF922B"/>
          <circle r="104" fill="#FFC078"/>
          ${eyes(0, -18, 40, 1.15)}
          ${cheeks(0, 26, 62, 1)}
          <ellipse cx="-24" cy="38" rx="30" ry="24" fill="#FFF4E6"/><ellipse cx="24" cy="38" rx="30" ry="24" fill="#FFF4E6"/>
          <path d="M-16,14 L16,14 L0,30Z" fill="#7A2E1E" stroke="#7A2E1E" stroke-width="6" stroke-linejoin="round"/>
          <path d="M0,30 L0,42 M-14,52 Q0,62 14,52" stroke="#7A2E1E" stroke-width="5" fill="none" stroke-linecap="round"/>
          ${[[-40, 34], [-48, 44], [40, 34], [48, 44]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#C2410C"/>`).join('')}
        </g>
        ${sparkle(470, 200, 12)}${sparkle(80, 90, 14)}`;
    },

    tiger() {
      const stripe = (d) => `<path d="${d}" fill="#2B2140"/>`;
      return `${jungle('tiger')}
        <g transform="translate(270,250)">
          <circle cx="-96" cy="-98" r="40" fill="#FF922B" stroke="#2B2140" stroke-width="6"/><circle cx="96" cy="-98" r="40" fill="#FF922B" stroke="#2B2140" stroke-width="6"/>
          <circle cx="-96" cy="-98" r="20" fill="#FFF4E6"/><circle cx="96" cy="-98" r="20" fill="#FFF4E6"/>
          <ellipse rx="150" ry="134" fill="#FF922B" stroke="#2B2140" stroke-width="6"/>
          ${stripe('M-20,-134 Q0,-100 -6,-80 Q0,-100 20,-134Z')}${stripe('M-60,-122 Q-44,-96 -44,-80 Q-36,-100 -36,-128Z')}${stripe('M60,-122 Q44,-96 44,-80 Q36,-100 36,-128Z')}
          ${stripe('M-150,-20 Q-110,-14 -96,0 Q-112,4 -148,4Z')}${stripe('M-146,30 Q-110,30 -100,44 Q-116,48 -140,50Z')}
          ${stripe('M150,-20 Q110,-14 96,0 Q112,4 148,4Z')}${stripe('M146,30 Q110,30 100,44 Q116,48 140,50Z')}
          <ellipse cx="-50" cy="56" rx="64" ry="50" fill="#FFF4E6"/><ellipse cx="50" cy="56" rx="64" ry="50" fill="#FFF4E6"/>
          ${eyes(0, -22, 50, 1.2)}
          ${cheeks(0, 20, 84, 1)}
          <path d="M-20,24 Q0,16 20,24 Q12,44 0,46 Q-12,44 -20,24Z" fill="#FF6B8A" stroke="#2B2140" stroke-width="4"/>
          <path d="M0,46 L0,58 M-20,66 Q-10,74 0,62 Q10,74 20,66" stroke="#2B2140" stroke-width="5" fill="none" stroke-linecap="round"/>
          ${[[-60, 48], [-74, 60], [60, 48], [74, 60]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="#868E96"/>`).join('')}
        </g>`;
    },

    snake() {
      return `${jungle('snake')}
        <ellipse cx="120" cy="450" rx="54" ry="24" fill="#ADB5BD"/><ellipse cx="440" cy="458" rx="40" ry="18" fill="#CED4DA"/>
        ${flower(460, 400, 1, '#FF6FAE')}${flower(90, 405, .9, '#FFD43B', '#FF7A00')}
        ${shadow(280, 440, 150, 20, .2)}
        <path d="M140,420 C140,340 420,340 420,410 C420,460 160,470 170,400 C180,330 380,320 370,280 C360,240 300,240 300,200"
          stroke="#2F9E44" stroke-width="64" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M140,420 C140,340 420,340 420,410 C420,460 160,470 170,400 C180,330 380,320 370,280 C360,240 300,240 300,200"
          stroke="#8CE99A" stroke-width="50" fill="none" stroke-linecap="round"/>
        <path d="M140,420 C140,340 420,340 420,410 C420,460 160,470 170,400 C180,330 380,320 370,280 C360,240 300,240 300,200"
          stroke="#FFD43B" stroke-width="14" fill="none" stroke-linecap="round" stroke-dasharray="2 34"/>
        <g transform="translate(296,160)">
          <path d="M-4,56 L-4,86 L-16,98 M-4,86 L8,98" stroke="#FA5252" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          <ellipse rx="78" ry="62" fill="#51CF66" stroke="#2F9E44" stroke-width="6"/>
          ${eyes(0, -10, 32, 1.05)}
          ${cheeks(0, 18, 50, .9)}
          <path d="M-14,30 Q0,42 14,30" stroke="#2B2140" stroke-width="5" fill="none" stroke-linecap="round"/>
          <circle cx="-10" cy="10" r="3" fill="#2F9E44"/><circle cx="10" cy="10" r="3" fill="#2F9E44"/>
        </g>
        ${sparkle(460, 90, 14)}${sparkle(90, 80, 12)}`;
    },

    bird() {
      const note = (x, y, c) => `<g transform="translate(${x},${y})" fill="${c}"><ellipse cx="0" cy="22" rx="11" ry="8" transform="rotate(-20 0 22)"/><rect x="8" y="-14" width="5" height="38"/><path d="M13,-14 q16,4 14,18 q-4,-8 -14,-8Z"/></g>`;
      return `<defs>${vgrad('skyB', '#8EC5FF', '#E7F5FF')}</defs>
        <rect width="540" height="500" fill="url(#skyB)"/>
        <g fill="#fff" opacity=".9"><circle cx="90" cy="90" r="30"/><circle cx="125" cy="80" r="38"/><circle cx="160" cy="95" r="28"/><rect x="62" y="92" width="125" height="28" rx="14"/></g>
        <path d="M-10,392 C120,370 300,400 560,360" stroke="#8D5A3B" stroke-width="26" fill="none" stroke-linecap="round"/>
        <path d="M420,372 C450,340 480,330 520,330" stroke="#8D5A3B" stroke-width="14" fill="none" stroke-linecap="round"/>
        ${[[60, 372, -30], [130, 392, 20], [470, 340, -40], [400, 372, 30], [520, 318, -10]].map(([x, y, r]) => `<path transform="translate(${x},${y}) rotate(${r})" d="M0,0 C14,-26 50,-26 64,0 C50,26 14,26 0,0Z" fill="#51CF66"/>`).join('')}
        ${note(420, 110, '#7950F2')}${note(470, 180, '#F06595')}${note(380, 60, '#339AF0')}
        <g transform="translate(260,262)">
          <path d="M-96,40 L-176,10 L-166,48 L-182,72Z" fill="#364FC7"/>
          <path d="M-6,-110 Q4,-150 26,-128 Q34,-156 52,-122" fill="none" stroke="#364FC7" stroke-width="10" stroke-linecap="round"/>
          <circle r="112" fill="#5C7CFA" stroke="#364FC7" stroke-width="6"/>
          <ellipse cx="14" cy="44" rx="72" ry="58" fill="#DBE4FF"/>
          <path d="M-80,-6 Q-140,60 -60,90 Q-30,40 -80,-6Z" fill="#4263EB" stroke="#364FC7" stroke-width="5" stroke-linejoin="round"/>
          ${eyes(14, -26, 38, 1.1)}
          ${cheeks(14, 12, 60, .9)}
          <path d="M-6,0 L34,0 L14,26Z" fill="#FFA94D" stroke="#E8590C" stroke-width="4" stroke-linejoin="round"/>
          <path d="M-14,108 l-10,22 M-14,108 l4,24 M30,108 l-6,24 M30,108 l10,22" stroke="#E8590C" stroke-width="6" stroke-linecap="round"/>
        </g>
        ${sparkle(80, 220, 12)}`;
    },
  };

  ART.add('animals', { scenes });
})();
