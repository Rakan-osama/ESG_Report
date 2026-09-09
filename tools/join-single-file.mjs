/* ═══════════════════════════════════════════════════════════════════════════
   join-single-file.mjs — the INVERSE of split-single-file.mjs.

       node tools/join-single-file.mjs

   Rebuilds _reference/single-file-formatted.html from assets/ so the reference
   stays the split's source of truth after an edit made in assets/. It performs
   exactly the reassembly that verify-split.mjs asserts:

     · drop the 5-line banner from app.css and from each of the 14 JS files;
     · concatenate the JS in the entry HTML's <script> order;
     · put the `const KPIM = [...]` line back where the placeholder comment sits;
     · splice the two blocks into the reference's <style> and <script> bodies.

   Nothing else in the reference is touched. Round-trip:
       edit assets/  ->  node tools/join-single-file.mjs  ->  node tools/verify-split.mjs
   ═══════════════════════════════════════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, '_reference/single-file-formatted.html');
/* The entry HTML is whichever root .html loads the split app, so renaming it
   (24_ESG_OS_v14_FinalDeveloperBaseline.html → v14.html → …) does not break the build. */
const ENTRY = path.join(ROOT, findEntry());
function findEntry() {
  const hit = fs.readdirSync(ROOT).filter(f => f.toLowerCase().endsWith('.html'))
    .find(f => fs.readFileSync(path.join(ROOT, f), 'utf8').includes('assets/js/01-config.js'));
  if (!hit) throw new Error('no root .html loads assets/js/01-config.js — entry HTML not found');
  return hit;
}
const BANNER_LINES = 5;

const die = m => { console.error('ABORT: ' + m); process.exit(1); };

const raw = fs.readFileSync(SRC, 'utf8');
const eol = raw.includes('\r\n') ? '\r\n' : '\n';
const L = raw.split(/\r?\n/);

const find = re => { const i = L.findIndex(l => re.test(l)); if (i < 0) die('marker not found: ' + re); return i + 1 };
const styleOpen = find(/^\s*<style>\s*$/), styleClose = find(/^\s*<\/style>\s*$/);
const scriptOpen = find(/^\s*<script>\s*$/), scriptClose = find(/^\s*<\/script>\s*$/);
const kpimLine = L[find(/^\s*const KPIM\s*=\s*\[/) - 1];

if (!(styleOpen < styleClose && styleClose < scriptOpen && scriptOpen < scriptClose)) die('landmarks out of order');

/* strip the generated 5-line banner an extracted file carries */
const body = p => {
  const lines = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n').split('\n').slice(BANNER_LINES);
  if (lines.at(-1) === '') lines.pop();
  return lines;
};

/* the entry HTML is the authority on which files there are, and in what order */
const files = [...fs.readFileSync(ENTRY, 'utf8').matchAll(/<script src="assets\/js\/([^"]+)"><\/script>/g)].map(m => m[1]);
if (files.length !== 14) die(`entry HTML loads ${files.length} app scripts, expected 14`);

const js = [];
for (const f of files) {
  const lines = body(path.join(ROOT, 'assets/js', f));
  const i = lines.findIndex(l => /KPIM \(the KPI master\) now lives in/.test(l));
  if (i >= 0) lines.splice(i, 2, kpimLine);                          // put the blob back
  js.push(...lines);
}
const css = body(path.join(ROOT, 'assets/app.css'));

const out = [
  ...L.slice(0, styleOpen),                    // … <style>
  ...css,
  ...L.slice(styleClose - 1, scriptOpen),      // </style> … <script>
  ...js,
  ...L.slice(scriptClose - 1)                  // </script> …
].join(eol);

fs.writeFileSync(SRC, out, 'utf8');
console.log(`_reference/single-file-formatted.html rebuilt — ${css.length} CSS lines, ${js.length} JS lines from ${files.length} files`);
