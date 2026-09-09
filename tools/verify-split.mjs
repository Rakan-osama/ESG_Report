/* ═══════════════════════════════════════════════════════════════════════════
   verify-split.mjs — prove assets/ + the entry HTML are still a LOSSLESS split
   of _reference/single-file-formatted.html.

       node tools/verify-split.mjs

   Exits non-zero on any failure. See assets/README.md.
   ═══════════════════════════════════════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, '_reference/single-file-formatted.html');
const ENTRY = path.join(ROOT, '24_ESG_OS_v14_FinalDeveloperBaseline.html');

const L = fs.readFileSync(SRC, 'utf8').split(/\r?\n/);
const find = re => { const i = L.findIndex(l => re.test(l)); if (i < 0) { console.error('marker not found: ' + re); process.exit(1); } return i + 1; };
const styleOpen = find(/^\s*<style>\s*$/), styleClose = find(/^\s*<\/style>\s*$/);
const scriptOpen = find(/^\s*<script>\s*$/), scriptClose = find(/^\s*<\/script>\s*$/);
const kpimNo = find(/^\s*const KPIM\s*=\s*\[/);

const srcJs = L.slice(scriptOpen, scriptClose - 1).join('\n');       // inside <script>
const srcCss = L.slice(styleOpen, styleClose - 1).join('\n');        // inside <style>
const kpimLine = L[kpimNo - 1];

let fails = 0;
const check = (ok, pass, fail) => { console.log((ok ? 'PASS  ' : 'FAIL  ') + (ok ? pass : fail)); if (!ok) fails++; };

const entryHtml = fs.readFileSync(ENTRY, 'utf8');
const files = [...entryHtml.matchAll(/<script src="assets\/js\/([^"]+)"><\/script>/g)].map(m => m[1]);
check(files.length === 14, `entry HTML loads ${files.length} app scripts`, `entry HTML loads ${files.length} app scripts, expected 14`);

// ── 1: the JS files reassemble to the original <script> block ────────────────
const BANNER_LINES = 5;
const perFile = [];
let cursor = 0;
for (const f of files) {
  let lines = fs.readFileSync(path.join(ROOT, 'assets/js', f), 'utf8').replace(/\r\n/g, '\n').split('\n').slice(BANNER_LINES);
  if (lines.at(-1) === '') lines.pop();
  const i = lines.findIndex(l => /KPIM \(the KPI master\) now lives in/.test(l));
  if (i >= 0) lines.splice(i, 2, kpimLine);                          // put the blob back
  perFile.push({ name: f, start: cursor, lines });
  cursor += lines.length;
}
const rebuilt = perFile.flatMap(p => p.lines).join('\n');
if (rebuilt === srcJs) check(true, 'JS reassembles byte-identically to the source <script> block');
else {
  const a = srcJs.split('\n'), b = rebuilt.split('\n');
  const i = a.findIndex((l, k) => l !== b[k]);
  check(false, '', `JS differs (src ${a.length} lines / rebuilt ${b.length}); first diff at ${i + 1}:\n   src: ${String(a[i]).slice(0, 150)}\n   new: ${String(b[i]).slice(0, 150)}`);
}

// ── 2: CSS is byte-identical ─────────────────────────────────────────────────
const cssLines = fs.readFileSync(path.join(ROOT, 'assets/app.css'), 'utf8').replace(/\r\n/g, '\n').split('\n').slice(BANNER_LINES);
if (cssLines.at(-1) === '') cssLines.pop();
check(cssLines.join('\n') === srcCss, 'app.css is byte-identical to the source <style> block', 'app.css differs from the source <style> block');

// ── 3: no cross-file function-hoisting hazard ────────────────────────────────
// Inside ONE script, `foo()` may precede `function foo(){}` (hoisting). Across
// separate <script> files it may not.
const all = perFile.flatMap(p => p.lines.map((text, k) => ({ file: p.name, line: k + 1, idx: p.start + k, text })));
const decl = new Map();
for (const r of all) { const m = r.text.match(/^\s*function\s+([A-Za-z_$][\w$]*)\s*\(/); if (m && !decl.has(m[1])) decl.set(m[1], r); }
const hz = [];
for (const r of all) {
  const m = r.text.match(/^([A-Za-z_$][\w$]*)\s*\(/);                // column-0 call = top-level
  if (!m || /^(if|for|while|switch|catch|function|return|typeof|new|do|else)$/.test(m[1])) continue;
  const d = decl.get(m[1]);
  if (d && d.idx > r.idx && d.file !== r.file) hz.push(`${r.file}:${r.line} calls ${m[1]}() declared later in ${d.file}`);
}
check(hz.length === 0, `no cross-file hoisting hazards (${decl.size} top-level functions scanned)`, 'hoisting hazards:\n   ' + hz.join('\n   '));

// ── 4: KPI data identical across source / .json / generated .js ──────────────
const j = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/kpi-master.json'), 'utf8'));
const shim = fs.readFileSync(path.join(ROOT, 'assets/data/kpi-master.js'), 'utf8');
const fromShim = JSON.parse(shim.slice(shim.indexOf('const KPIM=') + 11).replace(/;\s*$/, ''));
const fromSrc = JSON.parse(kpimLine.trim().replace(/^const\s+KPIM\s*=\s*/, '').replace(/;\s*$/, ''));
const S = JSON.stringify;
check(S(j) === S(fromSrc) && S(fromShim) === S(fromSrc), `KPI data identical across source / .json / .js (${j.length} rows)`, 'KPI data drifted');

// ── 5: every emitted JS file parses ──────────────────────────────────────────
let bad = [];
for (const f of [...files.map(f => 'assets/js/' + f), 'assets/data/kpi-master.js'])
  try { new (async () => {}).constructor(fs.readFileSync(path.join(ROOT, f), 'utf8')); } catch (e) { bad.push(`${f}: ${e.message}`); }
check(bad.length === 0, `all ${files.length + 1} emitted JS files parse`, 'parse errors:\n   ' + bad.join('\n   '));

// ── 6: entry HTML carries no inline <style>/<script> body ────────────────────
check(!/<style[\s>]/.test(entryHtml.replace(/<!--[\s\S]*?-->/g, '')) &&
      !/<script(?![^>]*\bsrc=)/.test(entryHtml.replace(/<!--[\s\S]*?-->/g, '')),
      'entry HTML has no inline <style> or inline <script>', 'entry HTML still contains inline CSS or JS');

process.exit(fails ? 1 : 0);
