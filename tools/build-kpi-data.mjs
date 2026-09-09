/* ═══════════════════════════════════════════════════════════════════════════
   build-kpi-data.mjs — regenerate assets/data/kpi-master.js from the JSON.

   assets/data/kpi-master.json is the single editable source of truth for the
   KPI master. The browser cannot fetch() it when index.html is opened by
   double-clicking (file:// URLs are cross-origin, so fetch is blocked), so the
   page loads a generated .js shim that declares the same array as a global.

   Run after ANY edit to kpi-master.json:
       node tools/build-kpi-data.mjs

   Add --check to verify the shim is in sync without writing (exit 1 if stale).
   ═══════════════════════════════════════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const JSON_PATH = path.join(ROOT, 'assets/data/kpi-master.json');
const JS_PATH = path.join(ROOT, 'assets/data/kpi-master.js');
const CHECK = process.argv.includes('--check');

const rows = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
if (!Array.isArray(rows) || rows.length === 0) {
  console.error('kpi-master.json must be a non-empty array'); process.exit(1);
}

/* Required keys — a row missing any of these breaks a view somewhere. */
const REQUIRED = ['id', 'p', 'en', 'ar', 'u', 'dt', 'agg'];
const bad = [];
const seen = new Set();
rows.forEach((r, i) => {
  REQUIRED.forEach(k => { if (!(k in r)) bad.push(`row ${i} (${r.id ?? '?'}): missing "${k}"`); });
  if (seen.has(r.id)) bad.push(`duplicate id "${r.id}"`);
  seen.add(r.id);
});
if (bad.length) { console.error('kpi-master.json invalid:\n  ' + bad.join('\n  ')); process.exit(1); }

const out =
  `/* ═══════════════════════════════════════════════════════════════════════════\n` +
  `   GENERATED FILE — DO NOT EDIT.\n` +
  `   Source: assets/data/kpi-master.json   Rebuild: node tools/build-kpi-data.mjs\n` +
  `   Exists only so index.html works from file:// where fetch() is blocked.\n` +
  `   ═══════════════════════════════════════════════════════════════════════════ */\n` +
  `const KPIM=${JSON.stringify(rows)};\n`;

if (CHECK) {
  const cur = fs.existsSync(JS_PATH) ? fs.readFileSync(JS_PATH, 'utf8') : '';
  if (cur.replace(/\r\n/g, '\n') !== out) {
    console.error('STALE: assets/data/kpi-master.js does not match the JSON. Run: node tools/build-kpi-data.mjs');
    process.exit(1);
  }
  console.log(`in sync — ${rows.length} KPI rows`);
} else {
  fs.writeFileSync(JS_PATH, out, 'utf8');
  console.log(`wrote assets/data/kpi-master.js — ${rows.length} KPI rows, ${out.length} bytes`);
}
