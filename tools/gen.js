// Generates the arcade SVGs for the profile README:  node tools/gen.js assets
// Fonts are embedded as data URIs so they render inside GitHub's <img> sandbox (no external
// loads allowed there). Panels other than the hero are authored 600px wide so that, scaled to a
// phone-width README (~360px), their text is still legible; on desktop they upscale crisply.
const fs = require('fs'), path = require('path');
const OUT = process.argv[2] || 'assets';
const b64 = f => fs.readFileSync(path.join(__dirname, 'fonts', f)).toString('base64');
const PIX = b64('pixel.woff2'), MONO = b64('mono.woff2'), UI = b64('ui.woff2');

const C = { bg:'#070912', bg2:'#0b0e1c', panel:'#0e1222', line:'#232a4a', line2:'#2f3a6a', tx:'#e8ecf7', mut:'#8b94ad', dim:'#727d9e',
  cyan:'#19e3ff', mag:'#ff3d8a', lime:'#9cff3d', gold:'#ffc83d', violet:'#8f7bff', silver:'#d6dcf0', bronze:'#ff9a5c' };

const fonts = (which = 'pmu') => `
${which.includes('p') ? `@font-face{font-family:"PX";src:url(data:font/woff2;base64,${PIX}) format("woff2")}` : ''}
${which.includes('m') ? `@font-face{font-family:"MN";src:url(data:font/woff2;base64,${MONO}) format("woff2")}` : ''}
${which.includes('u') ? `@font-face{font-family:"UI";src:url(data:font/woff2;base64,${UI}) format("woff2")}` : ''}
.px{font-family:"PX","Press Start 2P",monospace}
.mn{font-family:"MN","Share Tech Mono",Consolas,monospace}
.ui{font-family:"UI","Chakra Petch","Segoe UI",sans-serif;font-weight:600}`;

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const svg = (w, h, label, body, f = 'pmu') =>
`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}">
<style>${fonts(f)}</style>
${body}
</svg>`;

const scan = () => `<pattern id="scan" width="4" height="3" patternUnits="userSpaceOnUse"><rect width="4" height="1" fill="#000" fill-opacity=".14"/></pattern>`;
const corners = (x, y, w, h, c = C.cyan, s = 12) => `<path d="M${x} ${y+s}V${y}h${s}M${x+w-s} ${y+h}h${s}v-${s}" fill="none" stroke="${c}" stroke-width="2"/>`;
const panel = (x, y, w, h, c = C.cyan) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${C.panel}" stroke="${C.line2}"/>${corners(x, y, w, h, c)}`;
const blink = (dur = '1.1s') => `<animate attributeName="opacity" values="1;1;0;0" keyTimes="0;.5;.5;1" dur="${dur}" repeatCount="indefinite"/>`;
// one animation that starts at 0 (no flash), holds, then eases to the end value; static renderers show the base value
const grow = (attr, from, to, delay, dur) => { const tot = delay + dur; return `<animate attributeName="${attr}" values="${from};${from};${to}" keyTimes="0;${(delay / tot).toFixed(3)};1" dur="${tot.toFixed(2)}s" fill="freeze" calcMode="spline" keySplines="0 0 1 1;.22 1 .36 1"/>`; };

/* ---------------- hero (1200 wide: the one banner that is meant to be big) ---------------- */
function hero() {
  const W = 1200, H = 400, hor = 250;
  let stars = '';
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 90; i++) { const x = rnd() * W, y = rnd() * hor * .9, s = rnd() * 2 + 1;
    stars += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${s.toFixed(1)}" height="${s.toFixed(1)}" fill="#cfe6ff"><animate attributeName="opacity" values=".2;.9;.2" dur="${(2 + rnd() * 4).toFixed(1)}s" repeatCount="indefinite" begin="-${(rnd()*4).toFixed(1)}s"/></rect>`; }
  const cx = 600; let grid = '';
  for (let i = -16; i <= 16; i++) grid += `<line x1="${cx + i * 60}" y1="${hor}" x2="${cx + i * 420}" y2="${H}" stroke="${C.cyan}" stroke-opacity=".16"/>`;
  const steps = 7, vals = [];
  for (let s = 0; s <= 12; s++) { const k = s / 12; vals.push((hor + Math.pow(k, 2.2) * (H - hor)).toFixed(1)); }
  for (let i = 0; i < steps; i++) {
    const begin = -(i / steps * 3).toFixed(2);
    grid += `<line x1="0" x2="${W}" stroke="${C.cyan}" stroke-opacity=".25" y1="${hor}" y2="${hor}"><animate attributeName="y1" values="${vals.join(';')}" dur="3s" begin="${begin}s" repeatCount="indefinite"/><animate attributeName="y2" values="${vals.join(';')}" dur="3s" begin="${begin}s" repeatCount="indefinite"/></line>`;
  }
  let sun = `<circle cx="${cx}" cy="${hor - 10}" r="78" fill="url(#sun)" clip-path="url(#above)"/>`;
  for (let i = 0; i < 6; i++) sun += `<rect x="${cx - 90}" y="${hor - 10 - 70 + i * 14 + 30}" width="180" height="${2 + i * 1.2}" fill="${C.bg}" clip-path="url(#above)"/>`;
  const bars = [['GFX', 92, C.cyan], ['WEB', 86, C.mag], ['DSA', 90, C.lime], ['AI', 78, C.gold]];
  const px = 830, py = 40, pw = 330, ph = 320;
  let card = panel(px, py, pw, ph);
  card += `<text x="${px+18}" y="${py+30}" class="mn" font-size="13" fill="${C.mut}" letter-spacing="2">PLAYER 1 · LV. 2026</text>`;
  card += `<text x="${px+pw-18}" y="${py+30}" class="mn" font-size="13" fill="${C.gold}" letter-spacing="1" text-anchor="end">★ SDE @ WASP3D</text>`;
  card += `<line x1="${px}" y1="${py+44}" x2="${px+pw}" y2="${py+44}" stroke="${C.line}"/>`;
  bars.forEach(([n, v, col], i) => {
    const y = py + 70 + i * 36, bx = px + 66, bw = 190, fw = (bw * v / 100).toFixed(1);
    card += `<text x="${px+18}" y="${y+9}" class="mn" font-size="13" fill="${C.mut}" letter-spacing="1">${n}</text>`;
    card += `<rect x="${bx}" y="${y}" width="${bw}" height="10" fill="${C.bg2}" stroke="${C.line}"/>`;
    card += `<rect x="${bx}" y="${y}" width="${fw}" height="10" fill="${col}">${grow('width', 0, fw, .2 + i * .15, 1.4)}</rect>`;
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
<g>${blink()}<text x="40" y="66" class="px" font-size="11" fill="${C.lime}" letter-spacing="1">▶ PRESS START · NOIDA, INDIA</text></g>
<g class="px" font-size="54">
  <text x="48" y="140" fill="#2a0d3a">AMIR</text><text x="44" y="136" fill="${C.mag}">AMIR</text><text x="40" y="132" fill="${C.tx}">AMIR</text>
  <text x="48" y="210" fill="#2a0d3a">CHOUDHARY</text><text x="44" y="206" fill="#0b3a8a">CHOUDHARY</text><text x="40" y="202" fill="${C.cyan}">CHOUDHARY</text>
</g>
<rect x="40" y="236" width="396" height="30" fill="${C.gold}" fill-opacity=".12" stroke="${C.gold}"/>
<rect x="52" y="247" width="8" height="8" fill="${C.lime}">${blink('1.6s')}</rect>
<text x="70" y="257" class="mn" font-size="14" fill="${C.gold}" letter-spacing="1">MULTICLASS: GRAPHICS · FULL-STACK · GEN-AI</text>
<text x="40" y="300" class="mn" font-size="18" fill="${C.cyan}">Software Development Engineer @ Wasp3D<tspan fill="${C.lime}">▌${blink('.9s')}</tspan></text>
<text x="40" y="330" class="ui" font-size="15" fill="${C.mut}">Real-time rendering in C++ / DirectX 12 · full-stack MERN · Gemini agents · 900+ DSA</text>
<rect x="40" y="356" width="740" height="6" fill="${C.line}"/>
<rect x="40" y="356" width="740" height="6" fill="${C.lime}">${grow('width', 0, 740, .4, 2.4)}</rect>
<text x="40" y="380" class="mn" font-size="11" fill="${C.dim}" letter-spacing="2">XP · B.TECH CS (AI &amp; ML) · CGPA 8.01 · CLASS OF 2026</text>
<text x="780" y="380" class="mn" font-size="11" fill="${C.lime}" letter-spacing="2" text-anchor="end">LOADING PROFILE… 100%</text>
${card}
<rect width="${W}" height="${H}" fill="url(#scan)"/>
`;
  return svg(W, H, 'Amir Choudhary — Software Development Engineer, arcade title screen', body);
}

/* ---------------- section headers (600 wide, pixel font only) ---------------- */
function header(num, tag, title) {
  const W = 600, H = 56;
  const tagText = `${num} / ${tag}`, tagW = tagText.length * 9 + 18;
  const tx = 22 + tagW + 14;
  const body = `
<defs>${scan()}</defs>
<rect width="${W}" height="${H}" fill="${C.panel}" stroke="${C.line2}"/>
${corners(0, 0, W, H)}
<rect x="22" y="16" width="${tagW}" height="24" fill="${C.mag}" fill-opacity=".14" stroke="${C.mag}"/>
<text x="31" y="33" class="px" font-size="9" fill="${C.mag}">${esc(tagText)}</text>
<text x="${tx + 2}" y="38" class="px" font-size="18" fill="${C.mag}" opacity=".35">${esc(title)}</text>
<text x="${tx}" y="36" class="px" font-size="18" fill="${C.tx}">${esc(title)}</text>
<g fill="${C.line2}">${[0,1,2,3,4,5].map(i => `<rect x="${528 + i * 9}" y="23" width="5" height="10"${i < 4 ? ` fill="${C.lime}"` : ''}/>`).join('')}</g>
<rect width="${W}" height="${H}" fill="url(#scan)"/>`;
  return svg(W, H, `${num} ${tag}: ${title}`, body, 'p');
}

/* ---------------- attributes (600 wide, two stacked columns) ---------------- */
function attributes() {
  const W = 600, H = 262;
  const rows = [['C++ / DirectX 12', 'STR · engine core', 9, C.cyan], ['HLSL shaders', 'MAG · spells', 8, C.violet], ['React / Node (MERN)', 'DEX · full-stack', 8, C.mag],
                ['DSA & problem solving', 'INT · 900+ solved', 9, C.lime], ['Gen-AI integrations', 'WIS · Gemini, RAG', 7, C.gold], ['System design', 'CON · scale', 7, C.cyan]];
  let g = panel(0, 0, W, H) + `<text x="20" y="30" class="mn" font-size="12" fill="${C.mag}" letter-spacing="3">ATTRIBUTES</text>`;
  rows.forEach(([n, s, v, col], i) => {
    const colX = 20 + (i % 2) * 290, y = 62 + Math.floor(i / 2) * 66;
    g += `<text x="${colX}" y="${y}" class="ui" font-size="15" fill="${C.tx}">${esc(n)}</text>`;
    g += `<text x="${colX + 270}" y="${y}" class="mn" font-size="12" fill="${C.mut}" text-anchor="end">${v}/10</text>`;
    g += `<text x="${colX}" y="${y + 15}" class="mn" font-size="10" fill="${C.dim}" letter-spacing="1">${esc(s)}</text>`;
    for (let p = 0; p < 10; p++) {
      const x = colX + p * 27, on = p < v;
      g += `<rect x="${x}" y="${y + 23}" width="23" height="13" fill="${on ? col : C.bg2}" stroke="${on ? col : C.line}"${on ? `>${grow('opacity', 0, 1, .2 + i * .12 + p * .07, .25)}</rect>` : '/>'}`;
    }
  });
  g += `<defs>${scan()}</defs><rect width="${W}" height="${H}" fill="url(#scan)"/>`;
  return svg(W, H, 'Attributes: C++/DirectX 12 9/10, HLSL 8/10, MERN 8/10, DSA 9/10, Gen-AI 7/10, system design 7/10', g);
}

/* ---------------- trophies (one 600-wide panel, 2 x 2) ---------------- */
function trophies() {
  const W = 600, H = 300, cw = 290, ch = 140;
  const list = [['900+', 'DSA problems solved', 'LeetCode 1600 · GeeksforGeeks', 'PLATINUM · UNLOCKED', C.cyan],
                ['TOP 3', 'Adobe Emerge 2025', 'IIT Delhi · national', 'GOLD · UNLOCKED 2025', C.gold],
                ['TOP 6', 'Hack For Impact 2025', 'IIIT Delhi', 'SILVER · UNLOCKED 2025', C.silver],
                ['TOP 10', 'HackSprint 2024', 'GDG · GL Bajaj', 'BRONZE · UNLOCKED 2024', C.bronze]];
  let defs = scan(), g = '';
  list.forEach(([rank, title, sub, tier, col], i) => {
    const x = (i % 2) * 310, y = Math.floor(i / 2) * 160, mx = x + cw / 2;
    defs += `<radialGradient id="g${i}"><stop offset="0" stop-color="${col}" stop-opacity=".3"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient><clipPath id="c${i}"><rect x="${x}" y="${y}" width="${cw}" height="${ch}"/></clipPath>`;
    g += panel(x, y, cw, ch, col);
    g += `<ellipse cx="${mx}" cy="${y + ch}" rx="${cw * .7}" ry="70" fill="url(#g${i})" clip-path="url(#c${i})"/>`;
    g += `<rect x="${mx - 19}" y="${y + 12}" width="38" height="38" fill="${C.bg2}" stroke="${col}" stroke-width="2"/>`;
    g += `<g transform="translate(${mx - 12},${y + 19})" fill="none" stroke="${col}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 5.5H4V7a3.5 3.5 0 0 0 3.5 3.5"/><path d="M17 5.5h3V7a3.5 3.5 0 0 1-3.5 3.5"/><path d="M12 14v3.5"/><path d="M8.5 20.5h7"/><path d="M9.5 17.5h5l1 3h-7z"/></g>`;
    g += `<text x="${mx}" y="${y + 78}" class="px" font-size="15" fill="${col}" text-anchor="middle">${esc(rank)}</text>`;
    g += `<text x="${mx}" y="${y + 99}" class="ui" font-size="13" fill="${C.tx}" text-anchor="middle">${esc(title)}</text>`;
    g += `<text x="${mx}" y="${y + 115}" class="mn" font-size="10.5" fill="${C.mut}" text-anchor="middle">${esc(sub)}</text>`;
    g += `<text x="${mx}" y="${y + 131}" class="mn" font-size="9.5" fill="${C.lime}" letter-spacing="2" text-anchor="middle">${esc(tier)}</text>`;
  });
  g += `<rect width="${W}" height="${H}" fill="url(#scan)"/>`;
  return svg(W, H, 'Trophies: 900+ DSA problems (platinum), Top 3 Adobe Emerge 2025 (gold), Top 6 Hack For Impact 2025 (silver), Top 10 HackSprint 2024 (bronze)', `<defs>${defs}</defs>${g}`);
}

/* ---------------- console replay (600 wide, wrapped lines) ---------------- */
function consoleSvg() {
  const W = 600, fs_ = 11, lh = 17, maxCh = 84;
  const script = [
    ['$', 'help'], ['>', 'Commands: about · skills · projects · experience · hackathons · certs · contact · goto <screen> · matrix'],
    ['$', 'about'], ['>', "Amir Choudhary — SDE at Wasp3D, Noida. Real-time rendering in C++ / DirectX 12; before that full-stack MERN + AI."],
    ['$', 'experience'], ['>', 'Wasp3D · SDE · Apr 2026 – present · reflection pipeline 2 RTs → 1 (~50% less GPU bandwidth), real-time water, HLSL'],
    ['>', 'Bluestocks Fintech · SDE Intern · Mar – May 2025 · React + Tailwind, Express / MongoDB CRUD APIs'],
    ['$', 'hackathons'], ['>', 'Top 3 Adobe Emerge 2025 (IIT Delhi) · Top 6 Hack For Impact 2025 (IIIT Delhi) · Top 10 HackSprint 2024'],
    ['$', 'goto coop'], ['>', '→ Co-op · amirchoudharyb03@gmail.com'],
  ];
  const wrap = (s, n) => { const out = []; let cur = ''; for (const w of s.split(' ')) { if ((cur + ' ' + w).trim().length > n) { out.push(cur.trim()); cur = w; } else cur += ' ' + w; } if (cur.trim()) out.push(cur.trim()); return out; };
  const rows = []; // {kind, text, t}
  let t = .6; const total = 24;
  for (const [k, s] of script) {
    if (k === '$') { rows.push({ k, text: s, t }); t += 1.1; }
    else { const parts = wrap(s, maxCh - 12); parts.forEach((p, i) => rows.push({ k: i ? '.' : '>', text: p, t: t + i * .05 })); t += .8; }
  }
  const H = 36 + 14 + rows.length * lh + 14 + 30;
  let lines = '';
  rows.forEach((r, i) => {
    const y = 36 + 14 + 12 + i * lh, k1 = (r.t / total).toFixed(3), k2 = ((r.t + .1) / total).toFixed(3);
    const txt = r.k === '$' ? `<text x="16" y="${y}" class="mn" font-size="${fs_}" fill="${C.cyan}">visitor@amir-ai:~$ <tspan fill="${C.lime}">${esc(r.text)}</tspan></text>`
      : r.k === '>' ? `<text x="16" y="${y}" class="mn" font-size="${fs_}" fill="${C.tx}"><tspan fill="${C.dim}">&gt; Amir.AI:</tspan> ${esc(r.text)}</text>`
      : `<text x="86" y="${y}" class="mn" font-size="${fs_}" fill="${C.tx}">${esc(r.text)}</text>`;
    lines += `<g><animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;${k1};${k2};.96;1" dur="${total}s" repeatCount="indefinite"/>${txt}</g>`;
  });
  const body = `
<defs>${scan()}</defs>
${panel(0, 0, W, H)}
<rect x="1" y="1" width="${W-2}" height="30" fill="${C.bg2}"/><line x1="0" y1="32" x2="${W}" y2="32" stroke="${C.line2}"/>
<circle cx="16" cy="16" r="4.5" fill="${C.mag}"/><circle cx="31" cy="16" r="4.5" fill="${C.gold}"/><circle cx="46" cy="16" r="4.5" fill="${C.lime}"/>
<text x="62" y="20" class="mn" font-size="11" fill="${C.mut}">amir-ai-shell v2.0.0 (arcade)</text>
<text x="${W-16}" y="20" class="mn" font-size="11" fill="${C.lime}" letter-spacing="2" text-anchor="end">● ONLINE</text>
${lines}
<line x1="0" y1="${H-30}" x2="${W}" y2="${H-30}" stroke="${C.line2}"/>
<text x="16" y="${H-11}" class="mn" font-size="${fs_}" fill="${C.cyan}">visitor@amir-ai:~$ <tspan fill="${C.lime}">▌${blink('.9s')}</tspan></text>
<rect width="${W}" height="${H}" fill="url(#scan)"/>`;
  return svg(W, H, 'Amir.AI shell demo: help, about, experience, hackathons, goto coop', body, 'pm');
}

/* ---------------- footer ---------------- */
function footer() {
  const W = 600, H = 64;
  const body = `
<defs><linearGradient id="l" x1="0" x2="1"><stop offset="0" stop-color="${C.violet}"/><stop offset=".5" stop-color="${C.cyan}"/><stop offset="1" stop-color="${C.mag}"/></linearGradient>${scan()}</defs>
<rect width="${W}" height="${H}" fill="${C.bg}"/>
<rect width="${W}" height="2" fill="url(#l)"/>
<g>${blink('1.2s')}<text x="${W/2}" y="32" class="px" font-size="11" fill="${C.gold}" text-anchor="middle">INSERT COIN TO CONTINUE</text></g>
<text x="${W/2}" y="52" class="mn" font-size="9.5" fill="${C.dim}" letter-spacing="2" text-anchor="middle">© 2026 AMIR CHOUDHARY · ARCADE EDITION · ↑↑↓↓←→←→BA</text>
<rect width="${W}" height="${H}" fill="url(#scan)"/>`;
  return svg(W, H, 'Insert coin to continue', body, 'pm');
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
  'trophies.svg': trophies(),
  'console.svg': consoleSvg(),
  'footer.svg': footer(),
};
fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(OUT)) if (f.endsWith('.svg') && !(f in files)) fs.unlinkSync(path.join(OUT, f));
let total = 0;
for (const [f, s] of Object.entries(files)) { fs.writeFileSync(path.join(OUT, f), s); total += s.length; }
console.log(Object.keys(files).length, 'svgs,', (total / 1024).toFixed(0), 'KB total');
