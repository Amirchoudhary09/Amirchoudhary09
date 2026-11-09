// Generates the arcade SVGs for the profile README. Fonts are embedded as data URIs so
// they render inside GitHub's <img> sandbox (no external loads allowed there).
const fs = require('fs'), path = require('path');
const OUT = process.argv[2];
const b64 = f => fs.readFileSync(path.join(__dirname, 'fonts', f)).toString('base64');
const PIX = b64('pixel.woff2'), MONO = b64('mono.woff2'), UI = b64('ui.woff2');

const C = { bg:'#070912', bg2:'#0b0e1c', panel:'#0e1222', line:'#232a4a', line2:'#2f3a6a', tx:'#e8ecf7', mut:'#8b94ad', dim:'#5b6480',
  cyan:'#19e3ff', mag:'#ff3d8a', lime:'#9cff3d', gold:'#ffc83d', violet:'#8f7bff', silver:'#d6dcf0', bronze:'#ff9a5c' };

const fonts = (which = 'pmu') => `
${which.includes('p') ? `@font-face{font-family:"PX";src:url(data:font/woff2;base64,${PIX}) format("woff2")}` : ''}
${which.includes('m') ? `@font-face{font-family:"MN";src:url(data:font/woff2;base64,${MONO}) format("woff2")}` : ''}
${which.includes('u') ? `@font-face{font-family:"UI";src:url(data:font/woff2;base64,${UI}) format("woff2")}` : ''}
.px{font-family:"PX","Press Start 2P",monospace}
.mn{font-family:"MN","Share Tech Mono",Consolas,monospace}
.ui{font-family:"UI","Chakra Petch","Segoe UI",sans-serif;font-weight:600}`;

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const svg = (w, h, label, body, extraStyle = '', f = 'pmu') =>
`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}">
<style>${fonts(f)}${extraStyle}</style>
${body}
</svg>`;

const scan = (w, h) => `<pattern id="scan" width="4" height="3" patternUnits="userSpaceOnUse"><rect width="4" height="1" fill="#000" fill-opacity=".16"/></pattern>`;
const corners = (x, y, w, h, c = C.cyan) => `<path d="M${x} ${y+12}V${y}h12M${x+w-12} ${y+h}h12v-12" fill="none" stroke="${c}" stroke-width="2"/>`;
const panel = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${C.panel}" stroke="${C.line2}"/>${corners(x, y, w, h)}`;
const blink = (dur = '1.1s') => `<animate attributeName="opacity" values="1;1;0;0" keyTimes="0;.5;.5;1" dur="${dur}" repeatCount="indefinite"/>`;

/* ---------------- hero ---------------- */
function hero() {
  const W = 1200, H = 400, hor = 250;
  let stars = '';
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 90; i++) { const x = rnd() * W, y = rnd() * hor * .9, s = rnd() * 2 + 1;
    stars += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${s.toFixed(1)}" height="${s.toFixed(1)}" fill="#cfe6ff"><animate attributeName="opacity" values=".2;.9;.2" dur="${(2 + rnd() * 4).toFixed(1)}s" repeatCount="indefinite" begin="-${(rnd()*4).toFixed(1)}s"/></rect>`; }
  // perspective grid
  const cx = 600; let grid = '';
  for (let i = -16; i <= 16; i++) grid += `<line x1="${cx + i * 60}" y1="${hor}" x2="${cx + i * 420}" y2="${H}" stroke="${C.cyan}" stroke-opacity=".16"/>`;
  const steps = 7, vals = [];
  for (let s = 0; s <= 12; s++) { const k = s / 12; vals.push((hor + Math.pow(k, 2.2) * (H - hor)).toFixed(1)); }
  for (let i = 0; i < steps; i++) {
    const begin = -(i / steps * 3).toFixed(2);
    grid += `<line x1="0" x2="${W}" stroke="${C.cyan}" stroke-opacity=".25" y1="${hor}" y2="${hor}"><animate attributeName="y1" values="${vals.join(';')}" dur="3s" begin="${begin}s" repeatCount="indefinite"/><animate attributeName="y2" values="${vals.join(';')}" dur="3s" begin="${begin}s" repeatCount="indefinite"/></line>`;
  }
  // sun
  let sun = `<circle cx="${cx}" cy="${hor - 10}" r="78" fill="url(#sun)" clip-path="url(#above)"/>`;
  for (let i = 0; i < 6; i++) sun += `<rect x="${cx - 90}" y="${hor - 10 - 70 + i * 14 + 30}" width="180" height="${2 + i * 1.2}" fill="${C.bg}" clip-path="url(#above)"/>`;
  // bars
  const bars = [['GFX', 92, C.cyan], ['WEB', 86, C.mag], ['DSA', 90, C.lime], ['AI', 78, C.gold]];
  const px = 830, py = 40, pw = 330, ph = 320;
  let card = panel(px, py, pw, ph);
  card += `<text x="${px+18}" y="${py+30}" class="mn" font-size="13" fill="${C.mut}" letter-spacing="2">PLAYER 1</text>`;
  card += `<text x="${px+pw-18}" y="${py+30}" class="mn" font-size="13" fill="${C.gold}" letter-spacing="1" text-anchor="end">★ SDE @ WASP3D</text>`;
  card += `<line x1="${px}" y1="${py+44}" x2="${px+pw}" y2="${py+44}" stroke="${C.line}"/>`;
  bars.forEach(([n, v, col], i) => {
    const y = py + 70 + i * 36, bx = px + 66, bw = 190;
    card += `<text x="${px+18}" y="${y+9}" class="mn" font-size="13" fill="${C.mut}" letter-spacing="1">${n}</text>`;
    card += `<rect x="${bx}" y="${y}" width="${bw}" height="10" fill="${C.bg2}" stroke="${C.line}"/>`;
    const fw = (bw * v / 100).toFixed(1), d = (.2 + i * .15), tot = d + 1.4;
    card += `<rect x="${bx}" y="${y}" width="${fw}" height="10" fill="${col}"><animate attributeName="width" values="0;0;${fw}" keyTimes="0;${(d / tot).toFixed(3)};1" dur="${tot.toFixed(2)}s" fill="freeze" calcMode="spline" keySplines="0 0 1 1;.22 1 .36 1"/></rect>`;
    card += `<rect x="${bx}" y="${y}" width="${bw}" height="10" fill="url(#seg)"/>`;
    card += `<text x="${px+pw-18}" y="${y+10}" class="mn" font-size="13" fill="${C.tx}" text-anchor="end">${v}</text>`;
  });
  const tiles = [['900+', 'DSA SOLVED', C.lime], ['50%', 'GPU BW SAVED', C.cyan], ['200+', 'USERS', C.mag], ['TOP 3', 'IIT DELHI', C.gold]];
  tiles.forEach(([v, l, col], i) => {
    const tx = px + 18 + (i % 2) * 152, ty = py + 218 + Math.floor(i / 2) * 50;
    card += `<rect x="${tx}" y="${ty}" width="142" height="42" fill="${C.bg2}" stroke="${C.line}"/>`;
    card += `<text x="${tx+10}" y="${ty+22}" class="px" font-size="12" fill="${col}">${v}</text>`;
    card += `<text x="${tx+10}" y="${ty+35}" class="mn" font-size="9" fill="${C.dim}" letter-spacing="1">${l}</text>`;
  });

  const body = `
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070912"/><stop offset=".62" stop-color="#0b0e1c"/><stop offset="1" stop-color="#160b2c"/></linearGradient>
  <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.gold}"/><stop offset="1" stop-color="${C.mag}"/></linearGradient>
  <radialGradient id="glow"><stop offset="0" stop-color="${C.mag}" stop-opacity=".35"/><stop offset="1" stop-color="${C.mag}" stop-opacity="0"/></radialGradient>
  <pattern id="seg" width="10" height="10" patternUnits="userSpaceOnUse"><rect x="9" width="1" height="10" fill="${C.bg}" fill-opacity=".7"/></pattern>
  <clipPath id="above"><rect x="0" y="0" width="${W}" height="${hor}"/></clipPath>
  ${scan()}
</defs>
<rect width="${W}" height="${H}" fill="url(#sky)"/>
${stars}
<circle cx="${cx}" cy="${hor}" r="220" fill="url(#glow)"/>
${sun}
${grid}
<rect x="0" y="${hor}" width="${W}" height="1" fill="${C.mag}" fill-opacity=".7"/>
<!-- left: title -->
<g opacity="1">${blink()}<text x="40" y="66" class="px" font-size="11" fill="${C.lime}" letter-spacing="1">▶ PRESS START · NOIDA, INDIA</text></g>
<g class="px" font-size="54">
  <text x="48" y="140" fill="#2a0d3a">AMIR</text><text x="44" y="136" fill="${C.mag}">AMIR</text><text x="40" y="132" fill="${C.tx}">AMIR</text>
  <text x="48" y="210" fill="#2a0d3a">CHOUDHARY</text><text x="44" y="206" fill="#0b3a8a">CHOUDHARY</text><text x="40" y="202" fill="${C.cyan}">CHOUDHARY</text>
</g>
<rect x="40" y="236" width="372" height="30" fill="${C.gold}" fill-opacity=".12" stroke="${C.gold}"/>
<rect x="52" y="247" width="8" height="8" fill="${C.lime}">${blink('1.6s')}</rect>
<text x="70" y="257" class="mn" font-size="14" fill="${C.gold}" letter-spacing="1">CLASS: GRAPHICS ENGINEER · LV. 2026</text>
<text x="40" y="300" class="mn" font-size="18" fill="${C.cyan}">Software Development Engineer @ Wasp3D<tspan fill="${C.lime}">▌${blink('.9s')}</tspan></text>
<text x="40" y="330" class="ui" font-size="15" fill="${C.mut}">Real-time rendering in C++ / DirectX 12 · full-stack MERN · Gemini agents · 900+ DSA</text>
<!-- xp bar -->
<rect x="40" y="356" width="740" height="6" fill="${C.line}"/>
<rect x="40" y="356" width="0" height="6" fill="${C.lime}"><animate attributeName="width" from="0" to="740" dur="2.4s" begin=".4s" fill="freeze" calcMode="spline" keySplines=".22 1 .36 1"/></rect>
<text x="40" y="380" class="mn" font-size="11" fill="${C.dim}" letter-spacing="2">XP · B.TECH CS (AI &amp; ML) · CGPA 8.01 · CLASS OF 2026</text>
<text x="780" y="380" class="mn" font-size="11" fill="${C.lime}" letter-spacing="2" text-anchor="end">LOADING PROFILE… 100%</text>
${card}
<rect width="${W}" height="${H}" fill="url(#scan)"/>
`;
  return svg(W, H, 'Amir Choudhary — Software Development Engineer, arcade title screen', body);
}

/* ---------------- section headers ---------------- */
function header(num, tag, title) {
  const W = 1200, H = 64;
  const tagW = 20 + (num.length + 3 + tag.length) * 8.2;
  const body = `
<defs>${scan()}</defs>
<rect width="${W}" height="${H}" fill="${C.panel}" stroke="${C.line2}"/>
${corners(0, 0, W, H)}
<rect x="22" y="19" width="${tagW.toFixed(0)}" height="26" fill="${C.mag}" fill-opacity=".14" stroke="${C.mag}"/>
<text x="32" y="37" class="mn" font-size="13" fill="${C.mag}" letter-spacing="2">${num} / ${tag}</text>
<text x="${(40 + tagW).toFixed(0)}" y="41" class="px" font-size="20" fill="${C.tx}">${esc(title)}</text>
<text x="${(40 + tagW + 2).toFixed(0)}" y="43" class="px" font-size="20" fill="${C.mag}" opacity=".35">${esc(title)}</text>
<text x="${(40 + tagW).toFixed(0)}" y="41" class="px" font-size="20" fill="${C.tx}">${esc(title)}</text>
<g fill="${C.line2}">${[0,1,2,3,4,5].map(i => `<rect x="${1120 + i * 10}" y="26" width="6" height="12"${i < 4 ? ` fill="${C.lime}"` : ''}/>`).join('')}</g>
<rect width="${W}" height="${H}" fill="url(#scan)"/>`;
  return svg(W, H, `${num} ${tag}: ${title}`, body, '', 'pm');
}

/* ---------------- attributes (pips) ---------------- */
function attributes() {
  const W = 1200, H = 236;
  const rows = [['C++ / DirectX 12', 'STR · engine core', 9, C.cyan], ['HLSL shaders', 'MAG · spells', 8, C.violet], ['React / Node (MERN)', 'DEX · full-stack', 8, C.mag],
                ['DSA & problem solving', 'INT · 900+ solved', 9, C.lime], ['Gen-AI integrations', 'WIS · Gemini, RAG', 7, C.gold], ['System design', 'CON · scale', 7, C.cyan]];
  let g = panel(0, 0, W, H) + `<text x="24" y="34" class="mn" font-size="12" fill="${C.mag}" letter-spacing="3">ATTRIBUTES</text>`;
  rows.forEach(([n, s, v, col], i) => {
    const colX = 24 + (i % 2) * 590, y = 70 + Math.floor(i / 2) * 54;
    g += `<text x="${colX}" y="${y}" class="ui" font-size="16" fill="${C.tx}">${esc(n)}</text><text x="${colX}" y="${y+17}" class="mn" font-size="11" fill="${C.dim}" letter-spacing="1">${esc(s)}</text>`;
    for (let p = 0; p < 10; p++) {
      const x = colX + 250 + p * 26, on = p < v;
      const d = .2 + i * .12 + p * .07, tot = d + .25;
      g += `<rect x="${x}" y="${y-12}" width="20" height="14" fill="${on ? col : C.bg2}" stroke="${on ? col : C.line}"${on ? `><animate attributeName="opacity" values="0;0;1" keyTimes="0;${(d / tot).toFixed(3)};1" dur="${tot.toFixed(2)}s" fill="freeze"/></rect>` : '/>'}`;
    }
    g += `<text x="${colX + 548}" y="${y}" class="mn" font-size="14" fill="${C.mut}" text-anchor="end">${v}/10</text>`;
  });
  g += `<defs>${scan()}</defs><rect width="${W}" height="${H}" fill="url(#scan)"/>`;
  return svg(W, H, 'Attributes: C++/DirectX 12 9/10, HLSL 8/10, MERN 8/10, DSA 9/10, Gen-AI 7/10, system design 7/10', g);
}

/* ---------------- trophies ---------------- */
function trophy(file, rank, title, sub, tier, col) {
  const W = 290, H = 210;
  const cup = `<g transform="translate(${W/2 - 14},34)" fill="none" stroke="${col}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h14v6a7 7 0 0 1-14 0z" transform="scale(1.1)"/><path d="M7 5.5H3V8a4 4 0 0 0 4 4M21 5.5h4V8a4 4 0 0 1-4 4M14 17v4M9.5 24h9M11 21h6l1 3h-8z" transform="scale(1.1)"/></g>`;
  const body = `
<defs><radialGradient id="g"><stop offset="0" stop-color="${col}" stop-opacity=".28"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient>${scan()}</defs>
${panel(0, 0, W, H).replace(C.cyan, col).replace(C.cyan, col)}
<ellipse cx="${W/2}" cy="${H}" rx="${W*.7}" ry="90" fill="url(#g)"/>
<rect x="${W/2-28}" y="24" width="56" height="56" fill="${C.bg2}" stroke="${col}" stroke-width="2"/>
${cup}
<text x="${W/2}" y="118" class="px" font-size="18" fill="${col}" text-anchor="middle">${esc(rank)}</text>
<text x="${W/2}" y="144" class="ui" font-size="15" fill="${C.tx}" text-anchor="middle">${esc(title)}</text>
<text x="${W/2}" y="164" class="mn" font-size="12" fill="${C.mut}" text-anchor="middle">${esc(sub)}</text>
<text x="${W/2}" y="192" class="mn" font-size="11" fill="${C.lime}" letter-spacing="2" text-anchor="middle">${esc(tier)}</text>
<rect width="${W}" height="${H}" fill="url(#scan)"/>`;
  return [file, svg(W, H, `${rank} ${title} ${sub}`, body)];
}

/* ---------------- console ---------------- */
function consoleSvg() {
  const W = 1200, H = 330;
  const script = [
    ['$', 'help'], ['>', 'Commands: about · skills · projects · experience · hackathons · certs · contact · goto <screen> · matrix'],
    ['$', 'about'], ['>', "Amir Choudhary — SDE at Wasp3D, Noida. Real-time rendering in C++ / DirectX 12; before that full-stack MERN + AI."],
    ['$', 'experience'], ['>', 'Wasp3D · SDE · Apr 2026 – present    reflection pipeline 2 RTs → 1 (~50% less GPU bandwidth), real-time water, HLSL'],
    ['>', 'Bluestocks Fintech · SDE Intern · Mar – May 2025    React + Tailwind, Express / MongoDB CRUD APIs'],
    ['$', 'hackathons'], ['>', 'Top 3 Adobe Emerge 2025 (IIT Delhi) · Top 6 Hack For Impact 2025 (IIIT Delhi) · Top 10 HackSprint 2024'],
    ['$', 'goto coop'], ['>', '→ Co-op   amirchoudharyb03@gmail.com'],
  ];
  const total = 22; let t = .6, lines = '';
  script.forEach(([k, s], i) => {
    const y = 72 + i * 22, user = k === '$';
    const dur = user ? .5 : .15;
    // one looping animation per line, starting at 0 so there is no flash; static renderers see every line
    const k1 = (t / total).toFixed(3), k2 = ((t + .1) / total).toFixed(3);
    lines += `<g><animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;${k1};${k2};.96;1" dur="${total}s" repeatCount="indefinite"/>` +
      (user ? `<text x="24" y="${y}" class="mn" font-size="14" fill="${C.cyan}">visitor@amir-ai:~$ <tspan fill="${C.lime}">${esc(s)}</tspan></text>`
            : `<text x="24" y="${y}" class="mn" font-size="14" fill="${C.tx}"><tspan fill="${C.dim}">&gt; Amir.AI:</tspan> ${esc(s)}</text>`) + `</g>`;
    t += user ? 1.1 : .8;
  });
  const body = `
<defs>${scan()}</defs>
${panel(0, 0, W, H)}
<rect x="1" y="1" width="${W-2}" height="34" fill="${C.bg2}"/><line x1="0" y1="36" x2="${W}" y2="36" stroke="${C.line2}"/>
<circle cx="20" cy="18" r="5" fill="${C.mag}"/><circle cx="38" cy="18" r="5" fill="${C.gold}"/><circle cx="56" cy="18" r="5" fill="${C.lime}"/>
<text x="76" y="23" class="mn" font-size="12" fill="${C.mut}">amir-ai-shell v2.0.0 (arcade)</text>
<text x="${W-20}" y="23" class="mn" font-size="12" fill="${C.lime}" letter-spacing="2" text-anchor="end">● ONLINE</text>
<text x="24" y="${H-18}" class="mn" font-size="14" fill="${C.cyan}">visitor@amir-ai:~$ <tspan fill="${C.lime}">▌${blink('.9s')}</tspan></text>
${lines}
<rect width="${W}" height="${H}" fill="url(#scan)"/>`;
  return svg(W, H, 'Amir.AI shell demo: help, about, experience, hackathons, goto coop', body, '', 'pm');
}

/* ---------------- footer ---------------- */
function footer() {
  const W = 1200, H = 96;
  const body = `
<defs><linearGradient id="l" x1="0" x2="1"><stop offset="0" stop-color="${C.violet}"/><stop offset=".5" stop-color="${C.cyan}"/><stop offset="1" stop-color="${C.mag}"/></linearGradient>${scan()}</defs>
<rect width="${W}" height="${H}" fill="${C.bg}"/>
<rect width="${W}" height="3" fill="url(#l)"/>
<g>${blink('1.2s')}<text x="${W/2}" y="48" class="px" font-size="14" fill="${C.gold}" text-anchor="middle">INSERT COIN TO CONTINUE</text></g>
<text x="${W/2}" y="76" class="mn" font-size="12" fill="${C.dim}" letter-spacing="2" text-anchor="middle">© 2026 AMIR CHOUDHARY · ARCADE EDITION · ↑↑↓↓←→←→BA</text>
<rect width="${W}" height="${H}" fill="url(#scan)"/>`;
  return svg(W, H, 'Insert coin to continue', body, '', 'pm');
}

/* ---------------- write ---------------- */
const files = {
  'arcade-hero.svg': hero(),
  'hud-stats.svg': header('01', 'STATS', 'PLAYER HUD'),
  'hud-quests.svg': header('02', 'QUESTS', 'QUEST LOG'),
  'hud-levels.svg': header('03', 'LEVELS', 'SELECT LEVEL'),
  'hud-inventory.svg': header('04', 'INVENTORY', 'SKILL INVENTORY'),
  'hud-trophies.svg': header('05', 'TROPHIES', 'ACHIEVEMENTS'),
  'hud-badges.svg': header('06', 'BADGES', 'CERTIFICATIONS'),
  'hud-console.svg': header('07', 'CONSOLE', 'AMIR.AI SHELL'),
  'hud-github.svg': header('08', 'SAVE DATA', 'GITHUB ACTIVITY'),
  'hud-coop.svg': header('09', 'CO-OP', 'JOIN THE PARTY'),
  'attributes.svg': attributes(),
  'console.svg': consoleSvg(),
  'footer.svg': footer(),
};
[trophy('trophy-dsa.svg', '900+', 'DSA problems solved', 'LeetCode 1600 · GeeksforGeeks', 'PLATINUM · UNLOCKED', C.cyan),
 trophy('trophy-adobe.svg', 'TOP 3', 'Adobe Emerge 2025', 'IIT Delhi · national', 'GOLD · UNLOCKED 2025', C.gold),
 trophy('trophy-hfi.svg', 'TOP 6', 'Hack For Impact 2025', 'IIIT Delhi', 'SILVER · UNLOCKED 2025', C.silver),
 trophy('trophy-hacksprint.svg', 'TOP 10', 'HackSprint 2024', 'GDG · GL Bajaj', 'BRONZE · UNLOCKED 2024', C.bronze),
].forEach(([f, s]) => files[f] = s);
fs.mkdirSync(OUT, { recursive: true });
let total = 0;
for (const [f, s] of Object.entries(files)) { fs.writeFileSync(path.join(OUT, f), s); total += s.length; }
console.log(Object.keys(files).length, 'svgs,', (total / 1024).toFixed(0), 'KB total');
