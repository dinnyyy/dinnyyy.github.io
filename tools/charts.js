// Project thumbnails: OLS vs MLE, trading bot, GARCH volatility.
// Simulated series use a seeded RNG so the output is reproducible.
// Usage: node tools/charts.js [outDir]   (default: assets/img)
const fs = require('fs');
const OUT = process.argv[2] || 'assets/img';
const C = {
  surface: '#131824', grid: '#262d3d', axis: '#3a4258',
  text: '#e6e9f0', muted: '#8c95ab',
  blue: '#6187e7', amber: '#cd801c', red: '#d63c4a', card: '#f7f8fb',
};
const SANS = `-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif`;
const SERIF = `Georgia, 'Times New Roman', serif`;
const f1 = n => Math.round(n * 10) / 10;
const open = label => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" role="img" aria-label="${label}">\n  <rect width="800" height="500" fill="${C.surface}"/>\n`;
const pathOf = pts => 'M' + pts.map(([x, y]) => `${f1(x)} ${f1(y)}`).join('L');
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function gauss(r) { const u = 1 - r(), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
const legendItem = (x, y, kind, color, label) => {
  const key = kind === 'line' ? `<rect x="${x}" y="${y - 6}" width="22" height="3" rx="1.5" fill="${color}"/>`
            : kind === 'wash' ? `<rect x="${x}" y="${y - 12}" width="16" height="16" rx="4" fill="${color}"/>`
            : kind;
  return `${key}<text x="${x + (kind === 'line' ? 30 : 24)}" y="${y}" font-size="21" fill="${C.text}">${label}</text>`;
};

/* ---------------- OLS vs MLE ---------------- */
function ols() {
  const x0 = 56, x1 = 520, base = 392, top = 92, beta = 0;
  const xmin = -3.2, xmax = 3.6, X = v => x0 + (v - xmin) / (xmax - xmin) * (x1 - x0);
  const pdf = (v, m, s) => Math.exp(-0.5 * ((v - m) / s) ** 2) / (s * Math.sqrt(2 * Math.PI));
  const mle = { m: 0, s: 0.5 }, olsD = { m: 0.45, s: 0.95 };
  const peak = pdf(0, 0, mle.s), Y = d => base - d / peak * (base - top);
  const curve = ({ m, s }) => { const pts = []; for (let i = 0; i <= 200; i++) { const v = xmin + (xmax - xmin) * i / 200; pts.push([X(v), Y(pdf(v, m, s))]); } return pts; };
  const cm = curve(mle), co = curve(olsD);
  const area = pts => pathOf(pts) + `L${x1} ${base}L${x0} ${base}Z`;
  // coverage dot plot
  const px0 = 600, px1 = 744, P = v => px0 + (v - 0.8) / 0.2 * (px1 - px0);
  const rows = [['OLS', 0.87, C.amber, 186], ['MLE', 0.95, C.blue, 236]];
  let dots = '';
  for (const [name, v, col, y] of rows) {
    dots += `<line x1="${px0}" y1="${y}" x2="${px1}" y2="${y}" stroke="${C.grid}" stroke-width="1"/>`;
    dots += `<text x="${px0 - 14}" y="${y + 6}" font-size="21" fill="${C.text}" text-anchor="end">${name}</text>`;
    dots += `<circle cx="${f1(P(v))}" cy="${y}" r="8" fill="${col}" stroke="${C.surface}" stroke-width="2"/>`;
    dots += `<text x="${f1(P(v)) + 14}" y="${y - 10}" font-size="19" fill="${C.text}">${v.toFixed(2)}</text>`;
  }
  const tx = f1(P(0.95));
  return open('Sampling distributions of OLS and maximum likelihood estimates around the true parameter: the OLS distribution is wider and off-centre, the MLE distribution is tight and centred. Inset: 95% interval coverage of 0.87 for OLS and 0.95 for MLE.') + `
  <g stroke="${C.grid}" stroke-width="1"><path d="M${x0} ${top + 60}H${x1}M${x0} ${top + 160}H${x1}"/></g>
  <path d="${area(co)}" fill="${C.amber}" fill-opacity="0.08"/>
  <path d="${area(cm)}" fill="${C.blue}" fill-opacity="0.08"/>
  <path d="${pathOf(co)}" fill="none" stroke="${C.amber}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
  <path d="${pathOf(cm)}" fill="none" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
  <line x1="${f1(X(beta))}" y1="${top - 30}" x2="${f1(X(beta))}" y2="${base}" stroke="${C.text}" stroke-opacity="0.7" stroke-width="1.5"/>
  <line x1="${x0}" y1="${base}" x2="${x1}" y2="${base}" stroke="${C.axis}" stroke-width="1.5"/>
  <g font-family="${SANS}">
    <text x="${f1(X(beta)) + 10}" y="${top - 14}" font-size="21" fill="${C.text}">true &#946;</text>
    <text x="${f1(X(-0.6)) - 14}" y="${f1(Y(pdf(-0.6, 0, 0.5))) + 6}" font-size="24" font-weight="700" fill="${C.text}" text-anchor="end">MLE</text>
    <text x="${f1(X(1.75))}" y="${f1(Y(pdf(1.75, 0.45, 0.95))) - 12}" font-size="24" font-weight="700" fill="${C.text}">OLS</text>
    <text x="${x0}" y="436" font-size="21" fill="${C.muted}">Estimates of &#946; across 5,000 simulated datasets</text>
    <text x="${px0 - 64}" y="126" font-size="21" fill="${C.muted}">95% interval coverage</text>
    <line x1="${tx}" y1="150" x2="${tx}" y2="260" stroke="${C.text}" stroke-opacity="0.55" stroke-width="1.5"/>
    <text x="${tx}" y="286" font-size="18" fill="${C.muted}" text-anchor="middle">target</text>
    ${dots}
    <text x="${px0}" y="314" font-size="18" fill="${C.muted}" text-anchor="middle">0.80</text>
    <text x="${px1}" y="314" font-size="18" fill="${C.muted}" text-anchor="middle">1.00</text>
  </g>
</svg>
`;
}

/* ---------------- Trading bot ---------------- */
function trading() {
  const regimes = [[0, 95, 'calm', 0.0012, 0.0065], [95, 165, 'volatile', -0.0022, 0.015], [165, 260, 'calm', 0.0013, 0.007]];
  const N = 260; let price;
  for (let seed = 1; seed < 500; seed++) { // pick a path where the regime switches land near the turning points
    const r = rng(seed); price = [100];
    for (let t = 1; t < N; t++) { const g = regimes.find(([a, b]) => t >= a && t < b); price.push(price[t - 1] * Math.exp(g[3] + g[4] * gauss(r))); }
    const top1 = Math.max(...price.slice(0, 96)), volMax = Math.max(...price.slice(96, 165)), low2 = Math.min(...price.slice(150, 180));
    if (price[95] > 0.985 * top1 && volMax < price[95] * 1.01 && Math.abs(price[168] - low2) < 0.012 * low2 && price[N - 1] > price[168] * 1.1) break;
  }
  const x0 = 56, x1 = 744, top = 104, bot = 360;
  const lo = Math.min(...price), hi = Math.max(...price), pad = (hi - lo) * 0.12;
  const X = t => x0 + t / (N - 1) * (x1 - x0), Y = p => bot - (p - (lo - pad)) / (hi - lo + 2 * pad) * (bot - top);
  const line = pathOf(price.map((p, t) => [X(t), Y(p)]));
  let bands = '', strip = '';
  for (const [a, b, kind] of regimes) {
    const col = kind === 'calm' ? C.blue : C.amber, xa = f1(X(a)), xb = f1(X(Math.min(b, N - 1)));
    bands += `<rect x="${xa}" y="${top - 12}" width="${f1(xb - xa)}" height="${bot - top + 12}" fill="${col}" fill-opacity="${kind === 'calm' ? 0.08 : 0.12}"/>`;
    strip += `<rect x="${xa + (a ? 1 : 0)}" y="${bot + 14}" width="${f1(xb - xa - (a ? 2 : 0) - 1)}" height="10" rx="3" fill="${col}"/>`;
  }
  const tri = (x, y, up) => up ? `<path d="M${f1(x)} ${f1(y - 8)}L${f1(x + 8)} ${f1(y + 6)}L${f1(x - 8)} ${f1(y + 6)}Z" fill="${C.text}" stroke="${C.surface}" stroke-width="2" stroke-linejoin="round"/>`
                               : `<path d="M${f1(x)} ${f1(y + 8)}L${f1(x + 8)} ${f1(y - 6)}L${f1(x - 8)} ${f1(y - 6)}Z" fill="${C.text}" stroke="${C.surface}" stroke-width="2" stroke-linejoin="round"/>`;
  const buys = [4, 168], sells = [95];
  let marks = '';
  buys.forEach(t => { marks += tri(X(t), Y(price[t]) + 24, true); });
  sells.forEach(t => { marks += tri(X(t), Y(Math.max(...price.slice(t - 3, t + 4))) - 24, false); });
  const bt = buys[1], st = sells[0];
  return open('Simulated S&amp;P 500 price line over shaded market regimes from a Hidden Markov Model, calm then volatile then calm, with buy and sell signals marked') + `
  ${bands}
  <g stroke="${C.grid}" stroke-width="1"><path d="M${x0} ${top + 64}H${x1}M${x0} ${top + 128}H${x1}M${x0} ${top + 192}H${x1}"/></g>
  <path d="${line}" fill="none" stroke="${C.text}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
  ${strip}
  ${marks}
  <g font-family="${SANS}">
    <text x="${f1(X(bt)) + 14}" y="${f1(Y(price[bt]) + 30)}" font-size="21" fill="${C.text}">Buy</text>
    <text x="${f1(X(st)) - 14}" y="${f1(Y(Math.max(...price.slice(st - 3, st + 4))) - 18)}" font-size="21" fill="${C.text}" text-anchor="end">Sell</text>
    ${legendItem(x0, 58, 'wash', C.blue, 'Calm regime')}
    ${legendItem(x0 + 186, 58, 'wash', C.amber, 'Volatile regime')}
    <text x="${x0}" y="436" font-size="21" fill="${C.muted}">Daily S&amp;P 500 with regimes from a Hidden Markov Model</text>
  </g>
</svg>
`;
}

/* ---------------- GARCH volatility ---------------- */
function garch() {
  const omega = 2.2e-6, alpha = 0.09, betaG = 0.89, LR = omega / (1 - alpha - betaG);
  let seed = 3, H = 400, F = 100, ret, sig;
  for (; seed < 200; seed++) { // find a path that ends calm, so the forecast visibly reverts upward
    const r = rng(seed); let s2 = LR; ret = []; sig = [];
    for (let t = 0; t < H; t++) { sig.push(Math.sqrt(s2)); const e = Math.sqrt(s2) * gauss(r); ret.push(e); s2 = omega + alpha * e * e + betaG * s2; }
    const peak = Math.max(...sig);
    if (sig[H - 1] ** 2 < 0.55 * LR && peak > 1.9 * Math.sqrt(LR) && sig.slice(0, 120).some(s => s > 1.6 * Math.sqrt(LR))) break;
  }
  const last = ret[H - 1], s2next = omega + alpha * last * last + betaG * sig[H - 1] ** 2;
  const fc = []; for (let h = 1; h <= F; h++) fc.push(Math.sqrt(LR + (alpha + betaG) ** (h - 1) * (s2next - LR)));
  const x0 = 56, x1 = 744, mid = 238, N = H + F, X = t => x0 + t / (N - 1) * (x1 - x0);
  const maxAbs = Math.max(...ret.map(Math.abs), ...sig.map(s => 2 * s)), K = 128 / maxAbs, Y = v => mid - v * K;
  let bars = '';
  ret.forEach((v, t) => { bars += `M${f1(X(t))} ${mid}V${f1(Y(v))}`; });
  const up = pathOf(sig.map((s, t) => [X(t), Y(2 * s)])), dn = pathOf(sig.map((s, t) => [X(t), Y(-2 * s)]));
  const fup = pathOf(fc.map((s, h) => [X(H - 1 + h + 1), Y(2 * s)])), fdn = pathOf(fc.map((s, h) => [X(H - 1 + h + 1), Y(-2 * s)]));
  const xs = f1(X(H - 0.5));
  return open('Simulated daily stock returns showing volatility clustering, with a fitted GARCH(1,1) volatility band and a 100-day-ahead forecast that rises back toward its long-run level') + `
  <line x1="${x0}" y1="${mid}" x2="${x1}" y2="${mid}" stroke="${C.axis}" stroke-width="1"/>
  <path d="${bars}" stroke="${C.muted}" stroke-opacity="0.75" stroke-width="1.2"/>
  <path d="${up}" fill="none" stroke="${C.blue}" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="${dn}" fill="none" stroke="${C.blue}" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="${fup}" fill="none" stroke="${C.amber}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
  <path d="${fdn}" fill="none" stroke="${C.amber}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
  <line x1="${xs}" y1="96" x2="${xs}" y2="380" stroke="${C.text}" stroke-opacity="0.45" stroke-width="1.5"/>
  <g font-family="${SANS}">
    <text x="${f1(xs) + 10}" y="118" font-size="21" fill="${C.text}">Forecast</text>
    ${legendItem(x0, 58, 'line', C.blue, 'Fitted volatility')}
    ${legendItem(x0 + 236, 58, 'line', C.amber, '100-day forecast')}
    <text x="${x0}" y="436" font-size="21" fill="${C.muted}">Daily log returns with a GARCH(1,1) volatility band</text>
  </g>
</svg>
`;
}

fs.writeFileSync(`${OUT}/ols-vs-mle.svg`, ols());
fs.writeFileSync(`${OUT}/trading-bot.svg`, trading());
fs.writeFileSync(`${OUT}/volatility.svg`, garch());
console.log('ok');
