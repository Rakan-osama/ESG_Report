/* ═══════════════════════════════════════════════════════════════════════════
   screen-inventory.mjs — what each prototype screen ACTUALLY contains.

       node tools/screen-inventory.mjs            # table to stdout
       node tools/screen-inventory.mjs --json     # full detail as JSON

   Static analysis of assets/js/*.js. For each documented route it reports the
   defining file:line, the tables and their column headers, the action
   affordances, which D.* registers it reads, how many literal <tr> rows are
   hard-coded, and — the important one — every drawer() call that was given
   only TWO arguments. drawer(title, body, foot) falls back to a default footer
   whose Save is `closeDrawer(); toast('Saved (prototype)')`, so a two-argument
   call is a form that cannot write: the screen looks CRUD-complete but is not.
   ═══════════════════════════════════════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const JS = path.join(ROOT, 'assets/js');

const ROUTES = [
  ['B-05', 'org/cycles'], ['B-15', 'org/cycledetail'], ['B-06', 'setup/console'],
  ['B-07', 'setup/boundary'], ['B-08', 'org/sector'], ['B-09', 'setup/standards'],
  ['B-10', 'setup/applic'], ['B-11', 'setup/gri2'], ['B-13', 'setup/omissions'],
  ['B-14', 'setup/readiness'],
  ['C-01', 'mat/config'], ['C-02', 'mat/context'], ['C-03', 'mat/stake'],
  ['C-04', 'mat/engage'], ['C-06', 'mat/impacts'], ['C-07', 'mat/assess'],
  ['C-08', 'mat/diverge'], ['C-09', 'mat/mapping'], ['C-10', 'mat/secrec'],
  ['C-11', 'mat/ranking'], ['C-13', 'mat/topicmgmt'], ['C-12', 'mat/approval'],
  ['C-14', 'mat/risk'],
];

/* ---- load every source, remember which file each character came from ------ */
const files = fs.readdirSync(JS).filter(f => f.endsWith('.js')).sort();
const src = files.map(f => ({
  file: 'assets/js/' + f,
  text: fs.readFileSync(path.join(JS, f), 'utf8').replace(/\r\n/g, '\n'),
}));

/* every VIEWS['x'] = assignment, in file order, so a route's body is the span
   from its own assignment to the next one anywhere in the same file */
const defs = [];
src.forEach(s => {
  [...s.text.matchAll(/VIEWS\['([^']+)'\]\s*=/g)].forEach(m => {
    defs.push({ route: m[1], file: s.file, idx: m.index, text: s.text });
  });
});

const lineOf = (text, idx) => text.slice(0, idx).split('\n').length;

function bodyOf(route) {
  const d = defs.find(x => x.route === route);
  if (!d) return null;
  const nexts = defs.filter(x => x.file === d.file && x.idx > d.idx).map(x => x.idx);
  const end = nexts.length ? Math.min(...nexts) : d.text.length;
  return { ...d, line: lineOf(d.text, d.idx), body: d.text.slice(d.idx, end) };
}

const clean = s => s.replace(/<[^>]*>/g, '').replace(/\$\{[^}]*\}/g, '~').replace(/\s+/g, ' ').trim();

function analyse(route) {
  const d = bodyOf(route);
  if (!d) return { route, missing: true };
  const b = d.body;

  const tables = [...b.matchAll(/<table[\s\S]*?<\/table>|<table[\s\S]*$/g)].map(t => {
    const ths = [...t[0].matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map(m => clean(m[1])).filter(Boolean);
    return { cols: ths, hasThead: /<thead/.test(t[0]) };
  });

  /* drawer(a, b) vs drawer(a, b, c) — count top-level commas in the call */
  const drawers = [];
  let i = -1;
  while ((i = b.indexOf('drawer(', i + 1)) >= 0) {
    if (/[A-Za-z0-9_$.]/.test(b[i - 1] || '')) continue;          // closeDrawer( etc.
    let depth = 0, commas = 0, j = i + 7, inStr = null;
    for (; j < b.length && j < i + 1200; j++) {
      const c = b[j];
      if (inStr) { if (c === inStr && b[j - 1] !== '\\') inStr = null; continue; }
      if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
      if ('([{'.includes(c)) depth++;
      else if (')]}'.includes(c)) { if (depth === 0) break; depth--; }
      else if (c === ',' && depth === 0) commas++;
    }
    const call = b.slice(i, j + 1).replace(/\s+/g, ' ');
    const form = (call.match(/,\s*([A-Za-z_$][\w$]*)\s*\(/) || [, ''])[1];
    drawers.push({ args: commas + 1, form, stub: commas + 1 < 3, snippet: call.slice(0, 110) });
  }

  const btns = [...b.matchAll(/<button[^>]*>([\s\S]{0,60}?)<\/button>/g)].map(m => clean(m[1])).filter(Boolean);
  const anchors = [...b.matchAll(/<a\s+onclick="([^"]{0,80})/g)].map(m => m[1]);

  return {
    route, file: d.file, line: d.line, chars: b.length,
    tables: tables.map(t => t.cols), tablesNoThead: tables.filter(t => !t.hasThead).length,
    literalRows: (b.match(/<tr>/g) || []).length,
    reads: [...new Set([...b.matchAll(/\bD\.([a-zA-Z0-9_]+)/g)].map(m => m[1]))].sort(),
    drawers, buttons: btns, anchors,
    hasAdd: /[＋+]\s*\$?\{?t\('add'\)|＋/.test(b),
    hasToolbar: /toolbar\(/.test(b),
    hasPager: /pager\(/.test(b),
    hasRail: /setupRail\(/.test(b),
    submitish: btns.concat(anchors).filter(x => /submit|governance|approve|return|escalate|confirm|decide|resolve/i.test(x)),
  };
}

const out = ROUTES.map(([code, route]) => ({ code, ...analyse(route) }));

if (process.argv.includes('--json')) {
  const dest = path.join(ROOT, 'ESG-SCREEN-SPECS/_shots/inventory.json');
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, JSON.stringify(out, null, 1));
  console.log('wrote ' + path.relative(ROOT, dest) + ' (' + out.length + ' screens)');
} else {
  console.log('code  route              file:line                    chars tbl cols litTr  D.*  drawers(stub)  submit-ish');
  out.forEach(x => {
    if (x.missing) { console.log(`${x.code.padEnd(5)} ${x.route.padEnd(18)} NOT FOUND`); return; }
    const stubs = x.drawers.filter(d => d.stub).length;
    console.log(
      `${x.code.padEnd(5)} ${x.route.padEnd(18)} ${(x.file.replace('assets/js/', '') + ':' + x.line).padEnd(28)} ` +
      `${String(x.chars).padStart(5)} ${String(x.tables.length).padStart(3)} ` +
      `${String(x.tables.reduce((a, c) => a + c.length, 0)).padStart(4)} ${String(x.literalRows).padStart(5)} ` +
      `${String(x.reads.length).padStart(4)}  ${String(x.drawers.length).padStart(2)}(${stubs})         ${x.submitish.length}`);
  });
  const allStubs = out.flatMap(x => (x.drawers || []).filter(d => d.stub).map(d => x.route + ' -> ' + (d.form || '?') + '()'));
  console.log('\ntwo-argument drawer() calls — forms that cannot write (' + allStubs.length + '):');
  allStubs.forEach(s => console.log('  ' + s));
}
