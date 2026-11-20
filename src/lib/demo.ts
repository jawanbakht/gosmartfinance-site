// Demo-dashboard: voorbeelddata van een fictief bedrijf met twee entiteiten.
// Alles wordt hier berekend, zodat server (eerste weergave) en browser (filters) hetzelfde tonen.
import { MONTHS, SAMPLE, fmt, niceMax, barsSvg } from "./charts.ts";

export type Entity = "totaal" | "noord" | "zuid";
export type Period = "jaar" | "q1" | "q2" | "q3" | "q4";

export const ENTITY_LABEL: Record<Entity, string> = { totaal: "Totaal", noord: "Noord BV", zuid: "Zuid BV" };
export const PERIOD_LABEL: Record<Period, string> = { jaar: "Heel jaar", q1: "Q1", q2: "Q2", q3: "Q3", q4: "Q4" };

const BASE = {
  noord: {
    act: [55, 52, 63, 58, 60, 66, 51, 47, 71, 67, 73, 80],
    bud: [54, 54, 60, 60, 60, 63, 57, 51, 66, 66, 69, 78],
    gmA: 0.39, gmB: 0.38, persA: 0.21, persB: 0.20, other: 0.06, dso: 44, dsoPrev: 46, cashShare: 0.58,
  },
  zuid: {
    act: [37, 36, 41, 39, 41, 44, 35, 32, 47, 45, 48, 54],
    bud: [36, 36, 40, 40, 40, 42, 38, 34, 44, 44, 46, 52],
    gmA: 0.37, gmB: 0.38, persA: 0.22, persB: 0.21, other: 0.06, dso: 52, dsoPrev: 50, cashShare: 0.42,
  },
};

const monthsFor = (p: Period) => (p === "jaar" ? [...Array(12).keys()] : [0, 1, 2].map((j) => (Number(p[1]) - 1) * 3 + j));
const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);

type Row = { post: string; act: number; bud: number; total?: boolean };

function plRows(e: "noord" | "zuid", idx: number[]) {
  const b = BASE[e];
  const A = sum(idx.map((i) => b.act[i])), B = sum(idx.map((i) => b.bud[i]));
  return {
    omzet: [A, B],
    kostprijs: [-A * (1 - b.gmA), -B * (1 - b.gmB)],
    personeel: [-A * b.persA, -B * b.persB],
    overig: [-A * b.other, -B * b.other],
  };
}

export function compute(entity: Entity, period: Period) {
  const idx = monthsFor(period);
  const ents: ("noord" | "zuid")[] = entity === "totaal" ? ["noord", "zuid"] : [entity];
  const parts = ents.map((e) => plRows(e, idx));
  const add = (k: keyof ReturnType<typeof plRows>, j: 0 | 1) => Math.round(sum(parts.map((p) => p[k][j])));
  const omzet = [add("omzet", 0), add("omzet", 1)];
  const kostprijs = [add("kostprijs", 0), add("kostprijs", 1)];
  const marge = [omzet[0] + kostprijs[0], omzet[1] + kostprijs[1]];
  const personeel = [add("personeel", 0), add("personeel", 1)];
  const overig = [add("overig", 0), add("overig", 1)];
  const ebitda = [marge[0] + personeel[0] + overig[0], marge[1] + personeel[1] + overig[1]];
  const rows: Row[] = [
    { post: "Omzet", act: omzet[0], bud: omzet[1] },
    { post: "Kostprijs omzet", act: kostprijs[0], bud: kostprijs[1] },
    { post: "Brutomarge", act: marge[0], bud: marge[1], total: true },
    { post: "Personeelskosten", act: personeel[0], bud: personeel[1] },
    { post: "Overige bedrijfskosten", act: overig[0], bud: overig[1] },
    { post: "EBITDA", act: ebitda[0], bud: ebitda[1], total: true },
  ];

  const series = (k: "act" | "bud") => idx.map((i) => sum(ents.map((e) => BASE[e][k][i])));
  const act = series("act"), bud = series("bud");
  const dso = entity === "totaal" ? 47 : BASE[entity].dso;
  const dsoPrev = entity === "totaal" ? 48 : BASE[entity].dsoPrev;
  const share = entity === "totaal" ? 1 : BASE[entity].cashShare;
  const cash = SAMPLE.cash.map((v) => Math.round(v * share));

  return { idx, labels: idx.map((i) => MONTHS[i]), act, bud, rows, omzet, marge, ebitda, dso, dsoPrev, cash };
}

const pct = (a: number, b: number) => ((a / b - 1) * 100);
const nl1 = (n: number) => n.toLocaleString("nl-NL", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const signed = (n: number) => (n >= 0 ? "+" : "−") + fmt(Math.abs(n));

function tile(label: string, value: string, delta: string, good: boolean) {
  return `<div class="grid gap-1.5 content-start rounded-[var(--radius-card)] border border-line bg-white p-4">
    <span class="text-[13px] font-medium text-ink-2">${label}</span>
    <span class="num text-[clamp(22px,2.6vw,30px)] font-semibold tracking-[-0.02em] leading-[1.1]">${value}</span>
    <span class="num text-[13px] font-semibold ${good ? "text-pos" : "text-neg"}">${delta}</span>
  </div>`;
}

export function kpisHtml(d: ReturnType<typeof compute>) {
  const om = pct(d.omzet[0], d.omzet[1]);
  const gmA = (d.marge[0] / d.omzet[0]) * 100, gmB = (d.marge[1] / d.omzet[1]) * 100;
  const eb = d.ebitda[0] - d.ebitda[1];
  const dd = d.dso - d.dsoPrev;
  return [
    tile("Omzet", `€ ${fmt(d.omzet[0])}k`, `${om >= 0 ? "▲ +" : "▼ −"}${nl1(Math.abs(om))}% t.o.v. budget`, om >= 0),
    tile("Brutomarge", `${nl1(gmA)}%`, `${gmA >= gmB ? "▲ +" : "▼ −"}${nl1(Math.abs(gmA - gmB))} %-punt t.o.v. budget`, gmA >= gmB),
    tile("EBITDA", `€ ${fmt(d.ebitda[0])}k`, `${eb >= 0 ? "▲" : "▼"} ${signed(eb)}k t.o.v. budget`, eb >= 0),
    tile("DSO", `${d.dso} dagen`, `${dd <= 0 ? "▼" : "▲"} ${Math.abs(dd)} ${Math.abs(dd) === 1 ? "dag" : "dagen"} t.o.v. vorige periode`, dd <= 0),
  ].join("");
}

export function tableHtml(d: ReturnType<typeof compute>) {
  return d.rows.map((r) => {
    const v = r.act - r.bud, good = v >= 0;
    const cls = r.total ? "font-semibold text-ink" : "";
    return `<tr class="border-t border-line ${cls}">
      <th scope="row" class="text-left font-[inherit] py-3 pr-3">${r.post}</th>
      <td class="text-right py-3 pr-3">${fmt(r.act)}</td>
      <td class="text-right py-3 pr-3">${fmt(r.bud)}</td>
      <td class="text-right py-3 font-semibold ${v === 0 ? "text-ink-2" : good ? "text-pos" : "text-neg"}">${v === 0 ? "0" : (good ? "▲ " : "▼ ") + signed(v)}</td>
    </tr>`;
  }).join("");
}

export function barsHtml(d: ReturnType<typeof compute>) {
  return barsSvg(d.act, d.bud, d.labels);
}

/** Kaspositie op wit, gekozen periode gemarkeerd. */
export function cashSvg(d: ReturnType<typeof compute>) {
  const W = 900, H = 260, L = 48, R = 12, T = 14, B = 30, iw = W - L - R, ih = H - T - B;
  const data = d.cash, max = niceMax(Math.max(...data) * 1.1);
  const x = (i: number) => L + (i * iw) / (data.length - 1);
  const y = (v: number) => T + ih - (v / max) * ih;
  let s = "";
  if (d.idx.length < 12) {
    const a = x(d.idx[0]) - iw / 22, b = x(d.idx[d.idx.length - 1]) + iw / 22;
    s += `<rect x="${Math.max(L, a)}" y="${T}" width="${Math.min(W - R, b) - Math.max(L, a)}" height="${ih}" style="fill:var(--color-mist)"/>`;
  }
  for (let t = 0; t <= 4; t++) {
    const v = (max * t) / 4, yy = y(v);
    s += `<line x1="${L}" x2="${W - R}" y1="${yy}" y2="${yy}" style="stroke:var(--color-line)"/>`;
    s += `<text x="${L - 8}" y="${yy + 4}" text-anchor="end" style="fill:var(--color-ink-2)">${fmt(Math.round(v))}</text>`;
  }
  const pts = data.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`);
  s += `<path d="M${pts.join("L")}L${x(11)},${T + ih}L${x(0)},${T + ih}Z" style="fill:var(--color-d1)" fill-opacity="0.07"/>`;
  s += `<path d="M${pts.join("L")}" fill="none" style="stroke:var(--color-d1)" stroke-width="2.4" stroke-linejoin="round"/>`;
  data.forEach((v, i) => {
    const sel = d.idx.includes(i);
    s += `<circle cx="${x(i)}" cy="${y(v)}" r="${sel ? 4 : 2.5}" style="fill:${sel ? "var(--color-accent-on-light)" : "var(--color-d1)"}"><title>${MONTHS[i]}: € ${fmt(v)}k</title></circle>`;
    s += `<text x="${x(i)}" y="${H - 8}" text-anchor="middle" style="fill:var(--color-ink-2)">${MONTHS[i]}</text>`;
  });
  return s;
}

export function summaryText(d: ReturnType<typeof compute>, entity: Entity, period: Period) {
  const v = d.omzet[0] - d.omzet[1], e = d.ebitda[0] - d.ebitda[1];
  return `${ENTITY_LABEL[entity]}, ${PERIOD_LABEL[period].toLowerCase()}: omzet € ${fmt(d.omzet[0])}k tegen budget € ${fmt(d.omzet[1])}k (${signed(v)}k). EBITDA € ${fmt(d.ebitda[0])}k tegen € ${fmt(d.ebitda[1])}k (${signed(e)}k).`;
}
