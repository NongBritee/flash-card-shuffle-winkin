/* Set 3 — My Things (fan, pan, ball, book, bag) in a cosy playroom */
(function () {
  const { face, sparkle, star, shadow, vgrad } = ART.h;

  // wall with polka-dot wallpaper + wooden floor
  const room = (id, wall1, wall2, dot) => {
    let d = '';
    for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) d += `<circle cx="${30 + c * 80 + (r % 2) * 40}" cy="${30 + r * 72}" r="7" fill="${dot}" opacity=".5"/>`;
    let planks = '';
    for (let i = 0; i < 6; i++) planks += `<path d="M${i * 100 - 20},392 L${i * 100 - 60},500" stroke="#C9874D" stroke-width="3" opacity=".5"/>`;
    return `<defs>${vgrad('wall-' + id, wall1, wall2)}${vgrad('floor-' + id, '#F2B97C', '#E0995A')}</defs>
      <rect width="540" height="392" fill="url(#wall-${id})"/>${d}
      <rect y="380" width="540" height="14" fill="#fff" opacity=".85"/>
      <rect y="392" width="540" height="108" fill="url(#floor-${id})"/>${planks}`;
  };

  const scenes = {
    fan() {
      let blades = '', grill = '';
      for (let i = 0; i < 3; i++) blades += `<ellipse cx="0" cy="-58" rx="38" ry="62" fill="#8FDBFF" stroke="#4FC3F7" stroke-width="4" transform="rotate(${i * 120 + 15})"/>`;
      for (let i = 0; i < 16; i++) grill += `<path d="M0,0 L0,-122" stroke="#CED4DA" stroke-width="3" transform="rotate(${i * 22.5})"/>`;
      return `${room('fan', '#DFF6FF', '#F4FCFF', '#9ADBF5')}
        <g fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".95">
          <path d="M420,150 q40,-10 80,6"/><path d="M425,210 q45,-6 95,10"/><path d="M420,270 q40,0 80,14"/>
        </g>
        ${shadow(270, 462, 110, 16)}
        <rect x="256" y="300" width="28" height="150" rx="12" fill="#E9ECEF" stroke="#ADB5BD" stroke-width="4"/>
        <path d="M170,462 Q170,420 270,418 Q370,420 370,462Z" fill="#4FC3F7" stroke="#1E88C7" stroke-width="5" stroke-linejoin="round"/>
        <circle cx="232" cy="446" r="8" fill="#FF6B6B"/><circle cx="262" cy="442" r="8" fill="#FFD43B"/><circle cx="292" cy="442" r="8" fill="#69DB7C"/>
        <g transform="translate(270,190)">
          <circle r="130" fill="#fff" opacity=".55"/>
          ${blades}
          <g opacity=".9">${grill}</g>
          <circle r="130" fill="none" stroke="#ADB5BD" stroke-width="8"/>
          <circle r="104" fill="none" stroke="#CED4DA" stroke-width="3"/>
          <circle r="48" fill="#4FC3F7" stroke="#fff" stroke-width="6"/>
          ${face(0, -6, .8)}
        </g>
        ${sparkle(70, 80, 14)}${sparkle(470, 60, 12)}`;
    },

    pan() {
      return `${room('pan', '#FFE8DC', '#FFF7F2', '#FFB59A')}
        <rect x="0" y="330" width="540" height="70" fill="#ADB5BD"/><rect x="0" y="322" width="540" height="16" rx="6" fill="#DEE2E6"/>
        ${[0, 1, 2].map(i => `<path d="M${200 + i * 60},120 q-18,-24 0,-48 q18,-24 0,-48" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round" opacity=".85"/>`).join('')}
        ${shadow(250, 320, 170, 22, .22)}
        <rect x="380" y="232" width="150" height="34" rx="17" fill="#6B4F3A" transform="rotate(-8 380 249)"/>
        <rect x="370" y="236" width="40" height="26" rx="6" fill="#495057" transform="rotate(-8 380 249)"/>
        <ellipse cx="250" cy="262" rx="170" ry="68" fill="#343A40"/>
        <ellipse cx="250" cy="252" rx="150" ry="54" fill="#495057"/>
        <path d="M160,258 C150,215 210,205 228,222 C245,195 320,200 330,232 C360,240 350,285 300,285 C260,300 200,295 180,282 C158,280 155,268 160,258Z" fill="#fff"/>
        <ellipse cx="252" cy="248" rx="44" ry="32" fill="#FFC107"/>
        <ellipse cx="238" cy="238" rx="12" ry="7" fill="#FFF3BF"/>
        ${face(252, 244, .7)}
        ${sparkle(80, 90, 14)}${sparkle(470, 90, 12)}`;
    },

    ball() {
      return `${room('ball', '#FFF6CC', '#FFFCEB', '#FFD95A')}
        ${shadow(270, 460, 120, 18, .22)}
        <g fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".9">
          <path d="M90,250 q-20,40 0,80"/><path d="M60,230 q-26,60 0,120"/><path d="M450,250 q20,40 0,80"/><path d="M480,230 q26,60 0,120"/>
        </g>
        <defs><clipPath id="clip-ball"><circle cx="270" cy="270" r="140"/></clipPath></defs>
        <g clip-path="url(#clip-ball)">
          <circle cx="270" cy="270" r="140" fill="#4DABF7"/>
          <ellipse cx="270" cy="270" rx="104" ry="146" fill="#FFD43B"/>
          <ellipse cx="270" cy="270" rx="56" ry="148" fill="#FF6B6B"/>
          <ellipse cx="270" cy="270" rx="16" ry="150" fill="#fff"/>
          <rect x="120" y="120" width="300" height="300" fill="url(#shade-ball)"/>
        </g>
        <defs><radialGradient id="shade-ball" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></radialGradient></defs>
        <circle cx="270" cy="270" r="140" fill="none" stroke="#fff" stroke-width="6"/>
        <rect x="205" y="236" width="130" height="76" rx="38" fill="#fff" opacity=".92"/>
        ${face(270, 262, 1)}
        ${star(90, 100, 18)}${star(450, 90, 14, '#FF8787')}${sparkle(470, 190, 12)}`;
    },

    book() {
      return `${room('book', '#EDE5FF', '#F8F5FF', '#C0A8FF')}
        ${shadow(270, 440, 200, 20, .2)}
        <path d="M60,410 L270,430 L480,410 L480,170 L270,190 L60,170Z" fill="#7048E8"/>
        <path d="M74,396 Q170,380 266,414 L266,186 Q170,150 74,170Z" fill="#fff" stroke="#E5DBFF" stroke-width="4"/>
        <path d="M466,396 Q370,380 274,414 L274,186 Q370,150 466,170Z" fill="#FFFBEA" stroke="#E5DBFF" stroke-width="4"/>
        <rect x="266" y="186" width="8" height="228" fill="#5F3DC4"/>
        ${[0, 1, 2, 3].map(i => `<path d="M104,${300 + i * 22} Q170,${292 + i * 22} 236,${312 + i * 22}" stroke="#D0BFFF" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('')}
        <text x="170" y="285" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="96" fill="#FF6B6B" stroke="#fff" stroke-width="6" paint-order="stroke">A</text>
        <text x="335" y="282" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="78" fill="#4DABF7" stroke="#fff" stroke-width="6" paint-order="stroke">B</text>
        <text x="410" y="300" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="66" fill="#51CF66" stroke="#fff" stroke-width="6" paint-order="stroke">C</text>
        ${face(370, 350, .75)}
        <path d="M300,186 L300,140 L318,156 L336,140 L336,190" fill="#FF6B6B"/>
        ${star(150, 100, 22)}${star(400, 80, 18, '#FF8787')}${sparkle(270, 90, 16)}${sparkle(470, 130, 12)}${sparkle(70, 120, 12)}`;
    },

    bag() {
      return `${room('bag', '#E3F8DC', '#F5FCF2', '#9BE08A')}
        ${shadow(270, 456, 140, 18, .22)}
        <path d="M222,128 Q222,78 270,78 Q318,78 318,128" stroke="#2F9E44" stroke-width="18" fill="none" stroke-linecap="round"/>
        <rect x="150" y="120" width="40" height="300" rx="20" fill="#2F9E44"/><rect x="350" y="120" width="40" height="300" rx="20" fill="#2F9E44"/>
        <path d="M160,170 Q160,112 270,112 Q380,112 380,170 L380,410 Q380,448 342,448 L198,448 Q160,448 160,410Z" fill="#51CF66" stroke="#2F9E44" stroke-width="6"/>
        <path d="M168,180 Q270,150 372,180" stroke="#fff" stroke-width="5" fill="none" stroke-dasharray="4 10" stroke-linecap="round" opacity=".8"/>
        <rect x="314" y="290" width="16" height="100" rx="6" fill="#FFD43B" transform="rotate(14 322 340)"/><path d="M314,290 l8,-22 l8,22Z" fill="#FFC9A0" transform="rotate(14 322 340)"/>
        <rect x="190" y="320" width="160" height="112" rx="30" fill="#8CE99A" stroke="#2F9E44" stroke-width="6"/>
        <path d="M200,344 L340,344" stroke="#2F9E44" stroke-width="5" stroke-linecap="round"/><circle cx="340" cy="344" r="7" fill="#FFD43B"/>
        ${star(270, 394, 20, '#FFD43B')}
        ${face(270, 222, 1.15)}
        ${sparkle(80, 90, 14)}${sparkle(470, 80, 14)}${star(460, 200, 14, '#FF8787')}`;
    },
  };

  ART.add('things', { scenes });
})();
