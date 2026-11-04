/* Set 6 — Farm animals (pig, cow, horse, duck, goat): barn, fence, hay */
(function () {
  const { sparkle, shadow, vgrad, flower, cloud } = ART.h;

  const eyes = (x, y, gap, s = 1) => `
    <ellipse cx="${x - gap}" cy="${y}" rx="${11 * s}" ry="${14 * s}" fill="#2B2140"/><ellipse cx="${x + gap}" cy="${y}" rx="${11 * s}" ry="${14 * s}" fill="#2B2140"/>
    <circle cx="${x - gap + 4 * s}" cy="${y - 5 * s}" r="${4.5 * s}" fill="#fff"/><circle cx="${x + gap + 4 * s}" cy="${y - 5 * s}" r="${4.5 * s}" fill="#fff"/>`;
  const cheeks = (x, y, gap, s = 1) => `<ellipse cx="${x - gap}" cy="${y}" rx="${16 * s}" ry="${9 * s}" fill="#FF8FA3" opacity=".7"/><ellipse cx="${x + gap}" cy="${y}" rx="${16 * s}" ry="${9 * s}" fill="#FF8FA3" opacity=".7"/>`;
  const smile = (x, y, w = 14) => `<path d="M${x - w},${y} Q${x},${y + w * .9} ${x + w},${y}" stroke="#2B2140" stroke-width="5" fill="none" stroke-linecap="round"/>`;

  const farm = id => {
    let fence = '';
    for (let i = 0; i < 10; i++) fence += `<rect x="${i * 60 - 4}" y="330" width="22" height="80" rx="6" fill="#fff" stroke="#E9D8C4" stroke-width="3"/>`;
    return `<defs>${vgrad('fs-' + id, '#8FD3FF', '#E7F5FF')}</defs>
      <rect width="540" height="500" fill="url(#fs-${id})"/>
      ${cloud(90, 70, .45)}${cloud(450, 90, .4)}
      <path d="M-20,340 Q150,290 320,330 T560,310 L560,400 L-20,400Z" fill="#A9E34B"/>
      <g transform="translate(450,250)"><path d="M-50,0 L0,-46 L50,0 L50,80 L-50,80Z" fill="#E03131"/><path d="M-60,4 L0,-54 L60,4" stroke="#fff" stroke-width="8" fill="none" stroke-linejoin="round"/>
        <rect x="-20" y="30" width="40" height="50" fill="#fff"/><path d="M-20,30 L20,80 M20,30 L-20,80" stroke="#E03131" stroke-width="5"/></g>
      ${fence}<rect x="-10" y="348" width="560" height="14" rx="5" fill="#fff"/><rect x="-10" y="380" width="560" height="14" rx="5" fill="#fff"/>
      <path d="M-20,410 Q140,392 290,412 T560,404 L560,520 L-20,520Z" fill="#82C91E"/><path d="M-20,460 Q190,440 360,458 T560,452 L560,520 L-20,520Z" fill="#66A80F"/>`;
  };

  const scenes = {
    pig() {
      return `${farm('pig')}
        <ellipse cx="270" cy="458" rx="190" ry="34" fill="#8D6E63" opacity=".75"/>
        <g transform="translate(270,262)">
          <path d="M-120,-80 L-150,-160 L-60,-122Z" fill="#FF8FB1" stroke="#E64980" stroke-width="6" stroke-linejoin="round"/>
          <path d="M120,-80 L150,-160 L60,-122Z" fill="#FF8FB1" stroke="#E64980" stroke-width="6" stroke-linejoin="round"/>
          <ellipse rx="160" ry="140" fill="#FFB3C8" stroke="#E64980" stroke-width="6"/>
          ${eyes(0, -40, 58, 1.2)}
          ${cheeks(0, 10, 104, 1.1)}
          <ellipse cx="0" cy="36" rx="64" ry="44" fill="#FF8FB1" stroke="#E64980" stroke-width="5"/>
          <ellipse cx="-22" cy="36" rx="11" ry="17" fill="#C2255C"/><ellipse cx="22" cy="36" rx="11" ry="17" fill="#C2255C"/>
          ${smile(0, 92, 22)}
        </g>
        ${sparkle(80, 200, 12)}`;
    },

    cow() {
      return `${farm('cow')}
        <g transform="translate(270,250)">
          <path d="M-90,-110 Q-130,-170 -100,-182 Q-96,-150 -60,-126Z" fill="#FFF3BF" stroke="#C9A227" stroke-width="5"/>
          <path d="M90,-110 Q130,-170 100,-182 Q96,-150 60,-126Z" fill="#FFF3BF" stroke="#C9A227" stroke-width="5"/>
          <ellipse cx="-150" cy="-60" rx="54" ry="26" fill="#fff" stroke="#343A40" stroke-width="5" transform="rotate(-20 -150 -60)"/>
          <ellipse cx="150" cy="-60" rx="54" ry="26" fill="#fff" stroke="#343A40" stroke-width="5" transform="rotate(20 150 -60)"/>
          <ellipse cx="-150" cy="-60" rx="30" ry="12" fill="#FFC9D6" transform="rotate(-20 -150 -60)"/><ellipse cx="150" cy="-60" rx="30" ry="12" fill="#FFC9D6" transform="rotate(20 150 -60)"/>
          <path d="M-125,-40 Q-130,-140 0,-142 Q130,-140 125,-40 Q130,60 0,60 Q-130,60 -125,-40Z" fill="#fff" stroke="#343A40" stroke-width="6"/>
          <path d="M-110,-110 Q-60,-120 -60,-74 Q-90,-40 -122,-60Z" fill="#343A40"/><path d="M60,-126 Q110,-120 118,-80 Q86,-86 70,-100Z" fill="#343A40"/>
          <path d="M-20,-142 Q0,-170 22,-142" fill="#343A40"/>
          ${eyes(0, -60, 50, 1.15)}
          ${cheeks(0, -22, 92, 1)}
          <ellipse cx="0" cy="40" rx="110" ry="70" fill="#FFC9D6" stroke="#343A40" stroke-width="6"/>
          <ellipse cx="-38" cy="28" rx="14" ry="20" fill="#C2255C"/><ellipse cx="38" cy="28" rx="14" ry="20" fill="#C2255C"/>
          ${smile(0, 70, 26)}
          <path d="M-60,108 Q0,128 60,108" stroke="#FA5252" stroke-width="14" fill="none" stroke-linecap="round"/>
          <path d="M-18,118 L18,118 L24,150 Q0,162 -24,150Z" fill="#FFD43B" stroke="#E67700" stroke-width="5" stroke-linejoin="round"/><circle cx="0" cy="150" r="6" fill="#E67700"/>
        </g>`;
    },

    horse() {
      let mane = '';
      for (let i = 0; i < 7; i++) mane += `<ellipse cx="${-40 + i * 13}" cy="${-150 + Math.abs(i - 3) * 6}" rx="22" ry="34" fill="${i % 2 ? '#5C3317' : '#7A4520'}" transform="rotate(${(i - 3) * 14} ${-40 + i * 13} -150)"/>`;
      return `${farm('horse')}
        <g transform="translate(270,246)">
          <path d="M-70,-140 L-100,-200 L-40,-160Z" fill="#C08552" stroke="#6B3A15" stroke-width="5" stroke-linejoin="round"/>
          <path d="M70,-140 L100,-200 L40,-160Z" fill="#C08552" stroke="#6B3A15" stroke-width="5" stroke-linejoin="round"/>
          <path d="M-110,-60 Q-120,-170 0,-170 Q120,-170 110,-60 L96,90 Q90,170 0,170 Q-90,170 -96,90Z" fill="#C08552" stroke="#6B3A15" stroke-width="6"/>
          ${mane}
          <path d="M-14,-120 Q0,-140 14,-120 L8,20 Q0,30 -8,20Z" fill="#fff" opacity=".85"/>
          ${eyes(0, -54, 54, 1.15)}
          ${cheeks(0, -10, 80, 1)}
          <ellipse cx="0" cy="104" rx="90" ry="64" fill="#E3B58A" stroke="#6B3A15" stroke-width="5"/>
          <ellipse cx="-36" cy="92" rx="12" ry="16" fill="#6B3A15"/><ellipse cx="36" cy="92" rx="12" ry="16" fill="#6B3A15"/>
          ${smile(0, 128, 24)}
        </g>
        ${sparkle(80, 200, 12)}${sparkle(470, 180, 12)}`;
    },

    duck() {
      return `${farm('duck')}
        <ellipse cx="270" cy="440" rx="240" ry="54" fill="#74C0FC"/>
        <ellipse cx="270" cy="440" rx="170" ry="30" fill="none" stroke="#fff" stroke-width="4" opacity=".7"/>
        <ellipse cx="90" cy="446" rx="40" ry="14" fill="#40C057"/><ellipse cx="460" cy="430" rx="34" ry="12" fill="#40C057"/>
        <g transform="translate(270,300)">
          <ellipse cx="20" cy="70" rx="160" ry="92" fill="#FFD43B" stroke="#F59F00" stroke-width="6"/>
          <path d="M150,40 Q200,20 190,70 Q170,80 150,70Z" fill="#FFD43B" stroke="#F59F00" stroke-width="6" stroke-linejoin="round"/>
          <path d="M-10,60 Q60,30 110,70 Q60,120 -10,60Z" fill="#FCC419" stroke="#F59F00" stroke-width="5"/>
          <circle cx="-60" cy="-70" r="96" fill="#FFE066" stroke="#F59F00" stroke-width="6"/>
          <path d="M-70,-166 Q-60,-196 -40,-168 Q-36,-190 -20,-160" fill="none" stroke="#F59F00" stroke-width="7" stroke-linecap="round"/>
          ${eyes(-60, -86, 38, 1.1)}
          ${cheeks(-60, -50, 62, .9)}
          <path d="M-104,-46 Q-60,-70 -16,-46 Q-28,-16 -60,-14 Q-92,-16 -104,-46Z" fill="#FF922B" stroke="#E8590C" stroke-width="5"/>
          <path d="M-100,-42 Q-60,-34 -20,-42" stroke="#E8590C" stroke-width="4" fill="none"/>
        </g>
        ${flower(500, 330, .9, '#FF6FAE')}${sparkle(80, 210, 12)}`;
    },

    goat() {
      return `${farm('goat')}
        <g transform="translate(270,246)">
          <path d="M-56,-120 C-110,-200 -190,-150 -150,-90 C-150,-130 -110,-150 -78,-104Z" fill="#ADB5BD" stroke="#495057" stroke-width="5"/>
          <path d="M56,-120 C110,-200 190,-150 150,-90 C150,-130 110,-150 78,-104Z" fill="#ADB5BD" stroke="#495057" stroke-width="5"/>
          <ellipse cx="-138" cy="-30" rx="58" ry="24" fill="#F1E9DD" stroke="#8C7A5E" stroke-width="5" transform="rotate(16 -138 -30)"/>
          <ellipse cx="138" cy="-30" rx="58" ry="24" fill="#F1E9DD" stroke="#8C7A5E" stroke-width="5" transform="rotate(-16 138 -30)"/>
          <ellipse cx="-138" cy="-30" rx="32" ry="11" fill="#FFC9D6" transform="rotate(16 -138 -30)"/><ellipse cx="138" cy="-30" rx="32" ry="11" fill="#FFC9D6" transform="rotate(-16 138 -30)"/>
          <path d="M-100,-60 Q-110,-150 0,-150 Q110,-150 100,-60 L80,70 Q66,130 0,130 Q-66,130 -80,70Z" fill="#F8F4EC" stroke="#8C7A5E" stroke-width="6"/>
          <path d="M-30,-150 Q0,-178 30,-150 Q0,-130 -30,-150Z" fill="#E9DFCF"/>
          ${eyes(0, -50, 46, 1.15)}
          ${cheeks(0, -10, 72, 1)}
          <ellipse cx="0" cy="66" rx="58" ry="44" fill="#FFD8E2" stroke="#8C7A5E" stroke-width="5"/>
          <ellipse cx="-20" cy="58" rx="8" ry="12" fill="#8C7A5E"/><ellipse cx="20" cy="58" rx="8" ry="12" fill="#8C7A5E"/>
          ${smile(0, 84, 16)}
          <path d="M-26,126 Q0,200 26,126Z" fill="#F1E9DD" stroke="#8C7A5E" stroke-width="5" stroke-linejoin="round"/>
        </g>
        ${flower(70, 410, .9, '#FFD43B', '#FF7A00')}${sparkle(470, 190, 12)}`;
    },
  };

  ART.add('farm', { scenes });
})();
