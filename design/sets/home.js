/* Set 4 — In the House (door, jar, cup, pot, box) with kitchen-tile backgrounds */
(function () {
  const { face, sparkle, star, heart, shadow, vgrad } = ART.h;

  // tiled wall + counter top
  const kitchen = (id, tile1, tile2, counter = '#C98B5A') => {
    let t = '';
    for (let r = 0; r < 6; r++) for (let c = 0; c < 8; c++)
      t += `<rect x="${c * 70 + 2}" y="${r * 64 + 2}" width="66" height="60" rx="8" fill="${(r + c) % 2 ? tile1 : tile2}"/>`;
    return `<rect width="540" height="500" fill="#fff"/>${t}
      <rect y="372" width="540" height="22" rx="4" fill="${counter}"/><rect y="390" width="540" height="110" fill="#E9D5C0"/>
      ${[0, 1, 2, 3].map(i => `<rect x="${i * 140 + 14}" y="404" width="118" height="84" rx="10" fill="#F4E6D6" stroke="#D9BFA3" stroke-width="3"/><circle cx="${i * 140 + 73}" cy="420" r="5" fill="#B08968"/>`).join('')}`;
  };
  const steam = (x, y, n = 3, gap = 34) => [...Array(n)].map((_, i) =>
    `<path d="M${x + (i - (n - 1) / 2) * gap},${y} q-14,-20 0,-40 q14,-20 0,-40" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round" opacity=".9"/>`).join('');

  const scenes = {
    door() {
      return `<defs>${vgrad('wall-door', '#FFE8CC', '#FFF6EC')}${vgrad('wood-door', '#C47A3E', '#9C5A28')}</defs>
        <rect width="540" height="500" fill="url(#wall-door)"/>
        ${[0, 1, 2, 3, 4, 5].map(i => `<rect x="0" y="${i * 66}" width="540" height="3" fill="#F3D3B0"/>`).join('')}
        <rect y="440" width="540" height="60" fill="#D9A66B"/>
        <rect x="140" y="52" width="260" height="400" rx="20" fill="#7A3E12"/>
        <rect x="158" y="68" width="224" height="384" rx="14" fill="url(#wood-door)"/>
        <path d="M200,96 Q270,58 340,96 L340,150 L200,150Z" fill="#A5D8FF" stroke="#7A3E12" stroke-width="6"/>
        <path d="M270,78 L270,150 M200,124 L340,124" stroke="#7A3E12" stroke-width="5"/>
        <rect x="186" y="176" width="168" height="110" rx="12" fill="none" stroke="#7A3E12" stroke-width="6" opacity=".55"/>
        <rect x="186" y="304" width="168" height="120" rx="12" fill="none" stroke="#7A3E12" stroke-width="6" opacity=".55"/>
        <circle cx="344" cy="300" r="14" fill="#FFD43B" stroke="#E67700" stroke-width="4"/>
        ${face(270, 224, .95)}
        <rect x="150" y="446" width="240" height="30" rx="12" fill="#FF6B6B"/><text x="270" y="469" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="20" fill="#fff" letter-spacing="2">WELCOME</text>
        <g transform="translate(70,370)"><path d="M-30,0 L30,0 L22,70 L-22,70Z" fill="#E8590C"/><rect x="-34" y="-8" width="68" height="14" rx="5" fill="#FD7E14"/>
          <ellipse cx="-14" cy="-40" rx="14" ry="34" fill="#40C057" transform="rotate(-25)"/><ellipse cx="14" cy="-44" rx="14" ry="36" fill="#51CF66" transform="rotate(20)"/><ellipse cx="0" cy="-56" rx="12" ry="34" fill="#2F9E44"/></g>
        <g transform="translate(470,370)"><path d="M-30,0 L30,0 L22,70 L-22,70Z" fill="#4C6EF5"/><rect x="-34" y="-8" width="68" height="14" rx="5" fill="#5C7CFA"/>
          ${[0, 72, 144, 216, 288].map(a => `<circle cx="${Math.cos(a * Math.PI / 180) * 16}" cy="${-50 + Math.sin(a * Math.PI / 180) * 16}" r="13" fill="#FF8FB1"/>`).join('')}<circle cy="-50" r="10" fill="#FFD43B"/><path d="M0,-30 L0,-6" stroke="#2F9E44" stroke-width="5"/></g>
        ${sparkle(470, 70, 14)}${sparkle(70, 80, 12)}`;
    },

    jar() {
      let candy = '';
      const cs = ['#FF6B6B', '#FFD43B', '#69DB7C', '#4DABF7', '#B197FC', '#FF8FB1'];
      const pts = [[210, 380], [250, 392], [292, 384], [330, 390], [228, 350], [270, 356], [312, 352], [200, 330], [344, 336], [246, 320], [290, 318], [230, 292], [320, 300]];
      pts.forEach(([x, y], i) => candy += `<circle cx="${x}" cy="${y}" r="20" fill="${cs[i % cs.length]}"/><circle cx="${x - 6}" cy="${y - 7}" r="5" fill="#fff" opacity=".7"/>`);
      return `${kitchen('jar', '#D3F9F0', '#EFFFFA')}
        ${shadow(270, 432, 120, 14, .2)}
        <path d="M178,180 Q170,170 182,160 L358,160 Q370,170 362,180 L370,200 Q382,214 382,240 L382,400 Q382,432 350,432 L190,432 Q158,432 158,400 L158,240 Q158,214 170,200Z" fill="#E7F8FF" opacity=".75"/>
        ${candy}
        <path d="M178,180 Q170,170 182,160 L358,160 Q370,170 362,180 L370,200 Q382,214 382,240 L382,400 Q382,432 350,432 L190,432 Q158,432 158,400 L158,240 Q158,214 170,200Z" fill="none" stroke="#7FD1E6" stroke-width="7"/>
        <path d="M184,230 L184,390" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".8"/>
        <rect x="176" y="112" width="188" height="54" rx="14" fill="#FF6B6B"/>
        ${[0, 1, 2, 3, 4].map(i => `<rect x="${190 + i * 36}" y="112" width="16" height="54" fill="#fff" opacity=".45"/>`).join('')}
        <rect x="200" y="214" width="140" height="64" rx="20" fill="#fff" stroke="#7FD1E6" stroke-width="4"/>
        ${face(270, 236, .8)}
        ${sparkle(450, 110, 16)}${sparkle(90, 120, 12)}`;
    },

    cup() {
      return `${kitchen('cup', '#FFE3EE', '#FFF5F9')}
        ${steam(250, 150, 3, 38)}
        ${shadow(260, 400, 160, 18, .22)}
        <ellipse cx="260" cy="392" rx="170" ry="30" fill="#fff" stroke="#F3C4D6" stroke-width="5"/>
        <path d="M345,220 C420,220 430,330 345,340" stroke="#F06595" stroke-width="30" fill="none" stroke-linecap="round"/>
        <path d="M160,180 L360,180 L346,340 Q340,384 300,384 L220,384 Q180,384 174,340Z" fill="#F783AC" stroke="#D6336C" stroke-width="6" stroke-linejoin="round"/>
        <ellipse cx="260" cy="182" rx="100" ry="22" fill="#8B5A3C" stroke="#D6336C" stroke-width="6"/>
        <ellipse cx="236" cy="178" rx="30" ry="7" fill="#B07A55"/>
        ${heart(210, 330, .7, '#fff')}${heart(318, 320, .55, '#fff')}
        ${face(262, 262, 1.05)}
        ${sparkle(460, 100, 14)}${sparkle(80, 110, 12)}`;
    },

    pot() {
      return `${kitchen('pot', '#DDE4FF', '#F2F5FF', '#868E96')}
        ${steam(270, 112, 3, 44)}
        <g>${[-50, -16, 18, 52].map(dx => `<path d="M${270 + dx},372 q-14,-26 0,-46 q8,18 16,0 q14,22 0,46Z" fill="#FF922B"/><path d="M${273 + dx},372 q-6,-14 0,-24 q6,10 8,0 q6,12 -2,24Z" fill="#FFD43B"/>`).join('')}</g>
        <rect x="170" y="364" width="200" height="14" rx="6" fill="#495057"/>
        <rect x="106" y="226" width="56" height="26" rx="13" fill="#364FC7"/><rect x="378" y="226" width="56" height="26" rx="13" fill="#364FC7"/>
        <path d="M140,210 L400,210 L388,330 Q382,362 346,362 L194,362 Q158,362 152,330Z" fill="#748FFC" stroke="#364FC7" stroke-width="6" stroke-linejoin="round"/>
        <rect x="128" y="196" width="284" height="24" rx="12" fill="#5C7CFA" stroke="#364FC7" stroke-width="5"/>
        <path d="M156,196 Q270,120 384,196Z" fill="#91A7FF" stroke="#364FC7" stroke-width="5"/>
        <circle cx="270" cy="140" r="16" fill="#FFD43B" stroke="#364FC7" stroke-width="5"/>
        <path d="M176,236 L176,320" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".6"/>
        ${face(270, 268, 1.1)}
        ${sparkle(460, 110, 14)}${sparkle(80, 110, 12)}`;
    },

    box() {
      return `${kitchen('box', '#FFF0C2', '#FFFAE8')}
        ${star(160, 110, 24)}${star(380, 80, 20, '#FF8787')}${star(270, 60, 16, '#74C0FC')}${sparkle(450, 160, 14)}${sparkle(90, 170, 12)}
        ${shadow(270, 436, 170, 18, .24)}
        <path d="M120,220 L270,250 L420,220 L420,400 L270,438 L120,400Z" fill="#D9A54A"/>
        <path d="M270,250 L420,220 L420,400 L270,438Z" fill="#C08A30"/>
        <path d="M120,220 L60,170 L210,196 L270,250Z" fill="#E9B44C" stroke="#B07A20" stroke-width="4" stroke-linejoin="round"/>
        <path d="M420,220 L480,170 L330,196 L270,250Z" fill="#E9B44C" stroke="#B07A20" stroke-width="4" stroke-linejoin="round"/>
        <path d="M120,220 L270,190 L420,220 L270,250Z" fill="#8A5A12"/>
        <path d="M120,220 L270,250 L420,220 L420,400 L270,438 L120,400Z" fill="none" stroke="#B07A20" stroke-width="5" stroke-linejoin="round"/>
        <path d="M270,250 L270,438" stroke="#B07A20" stroke-width="5"/>
        <rect x="180" y="380" width="56" height="10" rx="3" fill="#fff" opacity=".6" transform="rotate(12 208 385)"/>
        ${face(195, 312, 1.05)}
        <path d="M330,300 l20,-6 M330,320 l20,-6" stroke="#8A5A12" stroke-width="5" stroke-linecap="round" opacity=".5"/>`;
    },
  };

  ART.add('home', { scenes });
})();
