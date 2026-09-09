/* ═══════════════════════════════════════════════════════════════════════════
   split-single-file.mjs — regenerate assets/ + the entry HTML from a
   single-file ESG OS build.

       node tools/split-single-file.mjs _reference/single-file-formatted.html

   Boundaries are found by CONTENT MARKERS (the author's own section banners),
   never by line number, so this survives a reformat of the source file.
   Everything is copied VERBATIM — no reindenting, no reordering, no rewriting.
   ═══════════════════════════════════════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.resolve(ROOT, process.argv[2] ?? '_reference/single-file-formatted.html');
const ENTRY = path.join(ROOT, '24_ESG_OS_v14_FinalDeveloperBaseline.html');

const raw = fs.readFileSync(SRC, 'utf8');
const eol = raw.includes('\r\n') ? '\r\n' : '\n';
const L = raw.split(/\r?\n/);
const slice = (a, b) => L.slice(a - 1, b).join(eol);          // inclusive, 1-indexed

const die = m => { console.error('ABORT: ' + m); process.exit(1); };
const findOne = (re, what) => {
  const hits = [];
  L.forEach((l, i) => { if (re.test(l)) hits.push(i + 1); });
  if (hits.length !== 1) die(`expected exactly 1 ${what}, found ${hits.length}`);
  return hits[0];
};

// ── structural landmarks ─────────────────────────────────────────────────────
const styleOpen  = findOne(/^\s*<style>\s*$/,      '<style> line');
const styleClose = findOne(/^\s*<\/style>\s*$/,    '</style> line');
const headClose  = findOne(/^\s*<\/head>\s*$/,     '</head> line');
const bodyOpen   = findOne(/^\s*<body>\s*$/,       '<body> line');
const scriptOpen = findOne(/^\s*<script>\s*$/,     '<script> line');
const scriptClose= findOne(/^\s*<\/script>\s*$/,   '</script> line');
const bannerOpen = findOne(/^\s*<!--\s*═+/,        'banner comment start');
const kpimLineNo = findOne(/^\s*const KPIM\s*=\s*\[/, 'const KPIM = [ line');

if (!(styleOpen < styleClose && styleClose < headClose && headClose < bodyOpen &&
      bodyOpen < scriptOpen && scriptOpen < scriptClose)) die('landmarks out of order');

// ── section map: name -> the marker that STARTS it, in load order ────────────
const SECTIONS = [
  ['01-config.js',          /════════════ 1 · CONFIG/,               '1 · CONFIG — normative workflow configuration'],
  ['02-i18n.js',            /════════════ 2 · I18N/,                 '2 · I18N — bilingual strings + deep-AR dictionary'],
  ['03-roles.js',           /════════════ 3 · ROLES/,                '3 · ROLES & PERSONAS'],
  ['04-data.js',            /════════════ 4 · DATA/,                 '4 · DATA — single demo state (Acme FY2025)'],
  ['05-framework.js',       /════════════ 5 · FRAMEWORK/,            '5 · FRAMEWORK — rendering primitives'],
  ['06-navigation.js',      /════════════ 6 · NAVIGATION/,           '6 · NAVIGATION & SHELL'],
  ['07-views.js',           /=+ HOME — Readiness Command Center/,    '7 · VIEWS — every screen definition + named drawer forms'],
  ['08-engine.js',          /════════════ 8 · ENGINE/,               '8 · ENGINE — computed metrics, guide flow, deep-AR'],
  ['09-workspace-shell.js', /════════════ 9 · WORKSPACE SHELL/,      '9 · WORKSPACE SHELL — modules grid, workspace pages, record timeline'],
  ['10-report-renderer.js', /════════════ 10 · REPORT RENDERER/,     '10 · REPORT RENDERER — print/PDF pipeline, claim separation, release'],
  ['11-dashboard.js',       /════════════ 11 · MANAGEMENT DASHBOARD/,'11 · MANAGEMENT DASHBOARD & ANALYTICS'],
  ['12-data-catalog.js',    /════════════ 7b · DATA CATALOG/,        '7b · DATA CATALOG — E/S/G tree + the Dynamic Form Engine contract'],
  ['13-data-model.js',      /════════════ 12 · BOOT/,                'shell wiring + V12 DATA OPERATING MODEL + late VIEWS'],
  ['14-boot.js',            /^\s*function fkCheck\s*\(\)/,           'BOOT — FK integrity check + the single render() pass'],
];

const starts = SECTIONS.map(([name, re]) => {
  const hit = L.findIndex((l, i) => i + 1 > scriptOpen && i + 1 < scriptClose && re.test(l));
  if (hit < 0) die(`section marker not found for ${name}: ${re}`);
  return hit + 1;
});
starts.forEach((s, i) => { if (i && s <= starts[i - 1]) die(`section ${SECTIONS[i][0]} is out of order`); });
if (starts[0] !== scriptOpen + 1) die(`gap between <script> and the first section (${scriptOpen + 1} vs ${starts[0]})`);

// ── output tree ──────────────────────────────────────────────────────────────
for (const d of ['assets', 'assets/js', 'assets/data']) fs.mkdirSync(path.join(ROOT, d), { recursive: true });

// 1 ── CSS ───────────────────────────────────────────────────────────────────
fs.writeFileSync(path.join(ROOT, 'assets/app.css'),
  `/* ═══════════════════════════════════════════════════════════════════════════${eol}` +
  `   ESG OS v14 — application stylesheet.${eol}` +
  `   Extracted verbatim from the single-file build's <style> block.${eol}` +
  `   Regenerate: node tools/split-single-file.mjs${eol}` +
  `   ═══════════════════════════════════════════════════════════════════════════ */${eol}` +
  slice(styleOpen + 1, styleClose - 1) + eol, 'utf8');

// 2 ── KPI master → pure JSON ────────────────────────────────────────────────
const kpimSrc = L[kpimLineNo - 1].trim();
const KPIM = JSON.parse(kpimSrc.replace(/^const\s+KPIM\s*=\s*/, '').replace(/;\s*$/, ''));
if (!Array.isArray(KPIM) || !KPIM.length) die('KPIM did not parse to a non-empty array');
fs.writeFileSync(path.join(ROOT, 'assets/data/kpi-master.json'), JSON.stringify(KPIM, null, 2) + eol, 'utf8');

// 3 ── JS sections (KPIM line lifted out) ────────────────────────────────────
const written = [];
SECTIONS.forEach(([name, , title], i) => {
  const a = starts[i];
  const b = (i + 1 < starts.length ? starts[i + 1] - 1 : scriptClose - 1);
  let body;
  if (a <= kpimLineNo && kpimLineNo <= b) {
    body = slice(a, kpimLineNo - 1) + eol +
      `    /* KPIM (the KPI master) now lives in assets/data/kpi-master.json and is${eol}` +
      `       loaded ahead of this file via assets/data/kpi-master.js. */${eol}` +
      slice(kpimLineNo + 1, b);
  } else body = slice(a, b);

  fs.writeFileSync(path.join(ROOT, 'assets/js', name),
    `/* ═══════════════════════════════════════════════════════════════════════════${eol}` +
    `   ESG OS v14 — ${title}${eol}` +
    `   Extracted verbatim from the single-file build. Classic script: LOAD ORDER${eol}` +
    `   IS SIGNIFICANT — see the <script> tags in the entry HTML.${eol}` +
    `   ═══════════════════════════════════════════════════════════════════════════ */${eol}` +
    body + eol, 'utf8');
  written.push(name);
});

// 4 ── entry HTML ────────────────────────────────────────────────────────────
const banner = [
  '  <!-- ═══════════════════════════════════════════════════════════════════════════',
  '       ESG REPORTING OPERATING SYSTEM — v14 Final Developer Target-State Baseline',
  '       EnergyUp International · 2026-08-24',
  '       Architecture: 1·CONFIG (REQ-09 normative) → 2·I18N → 3·ROLES → 4·DATA →',
  '       5·FRAMEWORK → 6·NAVIGATION → 7·VIEWS → 8·ENGINE → 9·WORKSPACE SHELL →',
  '       10·REPORT RENDERER → 11·DASHBOARD → 7b·DATA CATALOG → 12·BOOT.',
  '',
  '       Split out of the single-file build, kept verbatim in _reference/ :',
  '         assets/app.css            the whole <style> block',
  '         assets/data/kpi-master.*  the KPI master, as data',
  '         assets/js/01…14-*.js      the script block, cut on its section boundaries',
  '       CLASSIC scripts sharing one global scope — the tag order below IS the',
  '       original execution order. Do not reorder, defer, async or modularise it.',
  '       Inline style="…" attributes in generated markup are left in place.',
  '       Regenerate: node tools/split-single-file.mjs   Verify: node tools/verify-split.mjs',
  '       ═══════════════════════════════════════════════════════════════════════════ -->',
].join(eol);

const html = [
  slice(1, bannerOpen - 1),                       // doctype … <title>
  banner,
  '  <link rel="stylesheet" href="assets/app.css">',
  slice(headClose, bodyOpen),                     // </head> … <body>
  slice(bodyOpen + 1, scriptOpen - 1),            // the app markup, untouched
  '',
  '  <!-- data: KPI master (generated from assets/data/kpi-master.json) -->',
  '  <script src="assets/data/kpi-master.js"></script>',
  '',
  '  <!-- application, in the original execution order -->',
  ...written.map(f => `  <script src="assets/js/${f}"></script>`),
  slice(scriptClose + 1, L.length).replace(/(\r?\n)+$/, ''),   // </body> … </html>
  '',
].join(eol);

fs.writeFileSync(ENTRY, html, 'utf8');

console.log(`source     ${path.relative(ROOT, SRC)} (${L.length} lines)`);
console.log(`css        ${styleClose - styleOpen - 1} lines`);
console.log(`kpi rows   ${KPIM.length}`);
console.log(`js files   ${written.length}  (lines ${starts[0]}–${scriptClose - 1})`);
console.log(`entry      ${path.basename(ENTRY)}  ${html.length} bytes`);
