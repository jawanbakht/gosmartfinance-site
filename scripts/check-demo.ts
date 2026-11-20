// Rekencontrole demo-dashboard: totaal = Noord + Zuid, EBITDA sluit aan, kwartalen tellen op tot het jaar.
// Gebruik: node scripts/check-demo.ts
import { compute } from "../src/lib/demo.ts";

let fail = 0;
const eq = (a: number, b: number, msg: string, tol = 2) => {
  if (Math.abs(a - b) > tol) { console.log(`FOUT ${msg}: ${a} != ${b}`); fail++; }
};

for (const p of ["jaar", "q1", "q2", "q3", "q4"] as const) {
  const t = compute("totaal", p), n = compute("noord", p), z = compute("zuid", p);
  eq(t.omzet[0], n.omzet[0] + z.omzet[0], `omzet totaal ${p}`, 0);
  eq(t.omzet[1], n.omzet[1] + z.omzet[1], `budget totaal ${p}`, 0);
  eq(t.ebitda[0], n.ebitda[0] + z.ebitda[0], `ebitda totaal ${p}`);
  for (const d of [t, n, z]) {
    const r = d.rows;
    eq(r[2].act, r[0].act + r[1].act, `brutomarge ${p}`, 0);
    eq(r[5].act, r[2].act + r[3].act + r[4].act, `ebitda ${p}`, 0);
    eq(d.act.reduce((a, b) => a + b, 0), d.omzet[0], `grafiek = tabel ${p}`, 0);
  }
}
const year = compute("totaal", "jaar").omzet[0];
const qs = (["q1", "q2", "q3", "q4"] as const).reduce((s, q) => s + compute("totaal", q).omzet[0], 0);
eq(qs, year, "kwartalen = jaar", 0);

console.log(fail ? `${fail} fout(en)` : "Demo-berekeningen kloppen.");
process.exitCode = fail ? 1 : 0;
