// Pure SVG-generators: draaien bij de build (statische HTML) en in de browser (live updates).
// Kleuren via style="...var(--color-*)" zodat de accentkeuze automatisch meegaat.

export const MONTHS = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

export const fmt = (n: number) => n.toLocaleString("nl-NL");

export function niceMax(v: number): number {
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  return Math.ceil(v / (p / 2)) * (p / 2);
}

const pathD = (pts: number[][]) => "M" + pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join("L");

/** Hero: kaspositie (k€) met prognose als stippellijn. */
export function heroLineSvg(data: number[], startMonth: number, forecast: number): string {
  const W = 640, H = 240, L = 44, R = 12, T = 12, B = 28;
  const iw = W - L - R, ih = H - T - B;
  const max = niceMax(Math.max(...data) * 1.08), ticks = 4;
  const x = (i: number) => L + (i * iw) / (data.length - 1);
  const y = (v: number) => T + ih - (v / max) * ih;
  let s = "";
  for (let t = 0; t <= ticks; t++) {
    const v = (max * t) / ticks, yy = y(v);
    s += `<line x1="${L}" x2="${W - R}" y1="${yy}" y2="${yy}" style="stroke:var(--color-line-dark)" stroke-width="1"/>`;
    s += `<text x="${L - 8}" y="${yy + 4}" text-anchor="end" style="fill:var(--color-ink-dark-2)">${fmt(Math.round(v))}</text>`;
  }
  data.forEach((_, i) => {
    if (i % 2 === 0 || i === data.length - 1)
      s += `<text x="${x(i)}" y="${H - 8}" text-anchor="middle" style="fill:var(--color-ink-dark-2)">${MONTHS[(startMonth + i) % 12]}</text>`;
  });
  const split = data.length - forecast - 1;
  const pts = data.map((v, i) => [x(i), y(v)]);
  const act = pts.slice(0, split + 1), fc = pts.slice(split);
  const last = pts[pts.length - 1];
  s += `<path d="${pathD(act)}L${act[act.length - 1][0]},${T + ih}L${act[0][0]},${T + ih}Z" style="fill:var(--color-dd1)" fill-opacity="0.10"/>`;
  s += `<path data-line="actual" d="${pathD(act)}" fill="none" style="stroke:var(--color-dd1)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
  s += `<path data-line="forecast" d="${pathD(fc)}" fill="none" style="stroke:var(--color-accent)" stroke-width="2.5" stroke-dasharray="6 6" stroke-linecap="round"/>`;
  s += `<circle data-line="dot" cx="${last[0]}" cy="${last[1]}" r="5" style="fill:var(--color-accent);stroke:var(--color-navy-900)" stroke-width="2"/>`;
  return s;
}

/** Staafgrafiek realisatie tegen budget, grootste afwijking in accent. */
export function barsSvg(act: number[], bud: number[], labels: string[]): string {
  const W = 900, H = 300, L = 48, R = 12, T = 16, B = 32;
  const iw = W - L - R, ih = H - T - B;
  const max = niceMax(Math.max(...act, ...bud) * 1.05), ticks = 4;
  const y = (v: number) => T + ih - (v / max) * ih;
  let s = "";
  for (let t = 0; t <= ticks; t++) {
    const v = (max * t) / ticks, yy = y(v);
    s += `<line x1="${L}" x2="${W - R}" y1="${yy}" y2="${yy}" style="stroke:var(--color-line)" stroke-width="1"/>`;
    s += `<text x="${L - 8}" y="${yy + 4}" text-anchor="end" style="fill:var(--color-ink-2)">${fmt(Math.round(v))}</text>`;
  }
  let mi = 0;
  act.forEach((_, i) => { if (Math.abs(act[i] - bud[i]) > Math.abs(act[mi] - bud[mi])) mi = i; });
  const slot = iw / act.length, bw = Math.min(28, slot * 0.3), gap = 4;
  act.forEach((_, i) => {
    const cx = L + slot * i + slot / 2;
    const fillA = i === mi ? "var(--color-accent-on-light)" : "var(--color-d1)";
    s += `<rect x="${cx - bw - gap / 2}" y="${y(act[i])}" width="${bw}" height="${T + ih - y(act[i])}" rx="2" style="fill:${fillA}"><title>${labels[i]}: realisatie ${act[i]}k, budget ${bud[i]}k</title></rect>`;
    s += `<rect x="${cx + gap / 2}" y="${y(bud[i])}" width="${bw}" height="${T + ih - y(bud[i])}" rx="2" style="fill:var(--color-d3)"/>`;
    s += `<text x="${cx}" y="${H - 10}" text-anchor="middle" style="fill:var(--color-ink-2)">${labels[i]}</text>`;
  });
  return s;
}

/** Kleine sparkline voor KPI-tegels. */
export function sparkSvg(v: number[], color = "var(--color-d1)"): string {
  const W = 120, H = 28, p = 3, min = Math.min(...v), max = Math.max(...v);
  const pts = v.map((y, i) => [p + (i * (W - 2 * p)) / (v.length - 1), H - p - ((y - min) / (max - min || 1)) * (H - 2 * p)]);
  const e = pts[pts.length - 1];
  return `<path d="${pathD(pts)}L${e[0]},${H}L${pts[0][0]},${H}Z" style="fill:${color}" fill-opacity="0.08"/>` +
    `<path d="${pathD(pts)}" fill="none" style="stroke:${color}" stroke-width="1.6"/>` +
    `<circle cx="${e[0]}" cy="${e[1]}" r="2.6" style="fill:${color}"/>`;
}

// Voorbeelddata (fictief bedrijf) — overal gemarkeerd met SampleBadge.
export const SAMPLE = {
  cash: [412, 398, 455, 431, 476, 502, 488, 531, 547, 520, 566, 590],
  revenueActual: [92, 88, 104, 97, 101, 110, 86, 79, 118, 112, 121, 134],
  revenueBudget: [90, 90, 100, 100, 100, 105, 95, 85, 110, 110, 115, 130],
};
