// Statische kwaliteitscheck op de build (dist/): koppen, links, alt-teksten, meta, placeholders.
// Gebruik: npm run build && node scripts/check.mjs
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const DIST = "dist";
const files = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith(".html") && !p.includes("stijlgids")) files.push(p);
  }
})(DIST);

const problems = [];
const warn = (f, m) => problems.push(`${relative(DIST, f)}: ${m}`);
const exists = (href) => {
  const clean = href.split("#")[0].split("?")[0];
  if (clean === "" || clean === "/") return existsSync(join(DIST, "index.html"));
  const p = join(DIST, clean);
  return existsSync(p) || existsSync(join(p, "index.html")) || existsSync(p + ".html");
};
const redirects = ["/backgrount", "/contact-formulier"];

for (const f of files) {
  const h = readFileSync(f, "utf8");
  const h1 = (h.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) warn(f, `${h1} H1's (verwacht 1)`);

  const title = h.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
  if (!title) warn(f, "geen <title>");
  if (title.length > 65) warn(f, `title ${title.length} tekens (>65)`);
  const desc = h.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
  if (!desc) warn(f, "geen meta description");
  if (desc.length > 160) warn(f, `meta description ${desc.length} tekens (>160)`);
  if (!/<html lang="nl"/.test(h)) warn(f, "lang ontbreekt");

  for (const m of h.matchAll(/<img\b[^>]*>/g)) if (!/\balt=/.test(m[0])) warn(f, `img zonder alt: ${m[0].slice(0, 60)}`);
  for (const m of h.matchAll(/<svg\b[^>]*role="img"[^>]*>/g)) if (!/aria-label=/.test(m[0])) warn(f, "svg role=img zonder aria-label");
  for (const m of h.matchAll(/<svg\b(?![^>]*role="img")(?![^>]*aria-hidden)[^>]*>/g)) warn(f, `svg zonder role=img of aria-hidden: ${m[0].slice(0, 70)}`);

  for (const m of h.matchAll(/href="(\/[^"]*)"/g)) {
    const href = m[1];
    if (href.startsWith("/_astro/")) continue;
    if (!exists(href) && !redirects.includes(href)) warn(f, `dode link ${href}`);
  }
  for (const m of h.matchAll(/<a\b(?![^>]*href=)[^>]*>/g)) warn(f, `<a> zonder href: ${m[0].slice(0, 60)}`);

  const ids = [...h.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
  if (dup.length) warn(f, `dubbele id's: ${[...new Set(dup)].join(", ")}`);

  for (const m of h.matchAll(/aria-controls="([^"]+)"/g)) if (!ids.includes(m[1])) warn(f, `aria-controls naar onbekende id ${m[1]}`);

  for (const m of h.matchAll(/<(input|textarea|select)\b[^>]*>/g)) {
    const tag = m[0];
    if (/type="(hidden|submit)"/.test(tag) || /name="bot-field"/.test(tag)) continue;
    const id = tag.match(/\sid="([^"]+)"/)?.[1];
    if (!id || !h.includes(`for="${id}"`)) warn(f, `formulierveld zonder label: ${tag.slice(0, 60)}`);
  }

  const text = h.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "");
  for (const w of ["[AANVULLEN", "[CHECK", "lorem", "gamechanger", "revolutionair", "naadloos", "cruciaal", "transformeer", "Backgrount"])
    if (text.toLowerCase().includes(w.toLowerCase())) warn(f, `verboden/placeholder-tekst: ${w}`);

  // Kopniveaus mogen niet overslaan (h1 -> h3)
  const levels = [...h.matchAll(/<h([1-6])[\s>]/g)].map((m) => +m[1]);
  levels.forEach((l, i) => { if (i && l > levels[i - 1] + 1) warn(f, `kop springt van h${levels[i - 1]} naar h${l}`); });
}

console.log(`${files.length} pagina's gecontroleerd.`);
if (problems.length) { console.log(problems.map((p) => " - " + p).join("\n")); process.exitCode = 1; }
else console.log("Geen problemen gevonden.");
