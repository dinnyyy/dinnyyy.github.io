// JackTen project thumbnail: J-10 of hearts beside a 169-hand range grid
// shaded by the Chen formula (brighter = stronger starting hand).
// Usage: node tools/jackten.js [outFile]   (default: assets/img/jackten.svg)
const R = ['A','K','Q','J','T','9','8','7','6','5','4','3','2'];
const val = r => 14 - R.indexOf(r);            // A=14 ... 2=2
const high = v => v===14?10:v===13?8:v===12?7:v===11?6:v/2;
function chen(i, j) {                            // i,j index into R; i<j suited, i>j offsuit
  const a = Math.max(val(R[i]), val(R[j])), b = Math.min(val(R[i]), val(R[j]));
  if (i === j) return Math.max(5, Math.ceil(high(a) * 2));
  let s = high(a);
  if (i < j) s += 2;
  const gap = a - b - 1;
  s -= gap === 0 ? 0 : gap === 1 ? 1 : gap === 2 ? 2 : gap === 3 ? 4 : 5;
  if (gap <= 1 && a < 12) s += 1;
  return Math.ceil(s);
}
const INK = '#131824', CELL_OFF = '#1d2436', TEXT = '#e6e9f0', MUTED = '#8c95ab', AMBER = '#f2b544', RED = '#d63c4a';
const cell = 23, gap = 3, gx = 424, gy = 92;
// blue ramp for in-range hands, from mid cobalt to light periwinkle
const ramp = t => { const a=[54,86,206], b=[173,194,255]; return '#'+a.map((x,k)=>Math.round(x+(b[k]-x)*t).toString(16).padStart(2,'0')).join(''); };
let grid = '', labels = '', inRange = 0;
for (let i = 0; i < 13; i++) {
  labels += `<text x="${gx + i*(cell+gap) + cell/2}" y="${gy - 12}" text-anchor="middle">${R[i]}</text>`;
  labels += `<text x="${gx - 12}" y="${gy + i*(cell+gap) + cell/2 + 5}" text-anchor="end">${R[i]}</text>`;
  for (let j = 0; j < 13; j++) {
    const s = chen(i, j), x = gx + j*(cell+gap), y = gy + i*(cell+gap);
    let fill = CELL_OFF;
    if (s >= 7) { inRange++; fill = ramp(Math.min(1, (s - 7) / 13)); }
    else if (s >= 5) fill = '#2b3757';
    const isJT = (i === 3 && j === 4);
    grid += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="4" fill="${isJT ? AMBER : fill}"/>`;
  }
}
const jtx = gx + 4*(cell+gap), jty = gy + 3*(cell+gap);
const heart = `<path id="h" d="M0 -4.2C-1.6 -9 -9.6 -9 -9.6 -2.8C-9.6 2.6 -3 6.4 0 9.6C3 6.4 9.6 2.6 9.6 -2.8C9.6 -9 1.6 -9 0 -4.2Z"/>`;
const serif = `Georgia, 'Times New Roman', serif`;
const sans = `-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif`;
function corner(rank) {
  return `<g fill="${RED}"><text x="-63" y="-86" font-family="${serif}" font-weight="700" font-size="30" text-anchor="middle">${rank}</text><use href="#h" transform="translate(-63 -66) scale(0.95)"/></g>
      <g fill="${RED}" transform="rotate(180)"><text x="-63" y="-86" font-family="${serif}" font-weight="700" font-size="30" text-anchor="middle">${rank}</text><use href="#h" transform="translate(-63 -66) scale(0.95)"/></g>`;
}
const W = 170, H = 238;
const cardBase = `<rect x="${-W/2}" y="${-H/2}" width="${W}" height="${H}" rx="14" fill="#f7f8fb"/><rect x="${-W/2}" y="${-H/2}" width="${W}" height="${H}" rx="14" fill="none" stroke="#000" stroke-opacity="0.08"/>`;
// ten: 4 rows of two plus two in the middle column
const pips = [[-30,-74],[30,-74],[-30,-25],[30,-25],[0,-50],[-30,25],[30,25],[-30,74],[30,74],[0,50]]
  .map(([x,y]) => `<use href="#h" fill="${RED}" transform="translate(${x} ${y}) scale(1.05)${y>0?' rotate(180)':''}"/>`).join('');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" role="img" aria-label="JackTen: a jack and ten of hearts beside a 13 by 13 starting-hand range grid with the jack-ten suited cell highlighted">
  <defs>${heart}
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#000" flood-opacity="0.45"/></filter>
  </defs>
  <rect width="800" height="500" fill="${INK}"/>

  <!-- the hand: jack and ten of hearts -->
  <g filter="url(#shadow)">
    <g transform="translate(168 254) rotate(-9)">
      ${cardBase}
      ${corner('J')}
      <rect x="-42" y="-62" width="84" height="124" rx="6" fill="none" stroke="${RED}" stroke-opacity="0.35" stroke-width="2"/>
      <text x="0" y="22" font-family="${serif}" font-weight="700" font-size="76" fill="${RED}" text-anchor="middle">J</text>
      <use href="#h" fill="${RED}" transform="translate(0 44) scale(1.1)"/>
    </g>
    <g transform="translate(278 266) rotate(7)">
      ${cardBase}
      ${corner('10').replace(/font-size="30"/g,'font-size="26"')}
      ${pips}
    </g>
  </g>

  <!-- 169 starting hands: suited above the diagonal, offsuit below; brighter = stronger -->
  <g>${grid}</g>
  <rect x="${jtx - 3}" y="${jty - 3}" width="${cell + 6}" height="${cell + 6}" rx="6" fill="none" stroke="${AMBER}" stroke-width="2"/>
  <g font-family="${sans}" font-size="17" font-weight="600" fill="${MUTED}">${labels}</g>

</svg>
`;
require('fs').writeFileSync(process.argv[2] || 'assets/img/jackten.svg', svg);
console.log('in range', inRange, 'of 169');
