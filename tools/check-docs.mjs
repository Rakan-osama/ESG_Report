/* ═══════════════════════════════════════════════════════════════════════════
   check-docs.mjs — verify ESG-SCREEN-SPECS is internally consistent.

       node tools/check-docs.mjs

   Checks every ![image](path) and [link](path.md#anchor) resolves, that each of
   the 23 screens has a doc carrying its screenshots, and that no screenshot is
   orphaned. 22 of the 23 also carry a live .NET capture; B-15 has no route of
   its own. Exits non-zero on any failure.
   ═══════════════════════════════════════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = path.join(ROOT, 'ESG-SCREEN-SPECS');

let fails = 0;
const ok = (cond, msg) => { console.log((cond ? '  PASS  ' : '  FAIL  ') + msg); if (!cond) fails++; };

const walk = d => fs.readdirSync(d, { withFileTypes: true })
  .flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);

const all = walk(DOCS);
const md = all.filter(f => f.endsWith('.md'));
const shots = all.filter(f => /\.(png|jpe?g)$/i.test(f));

console.log('=== inventory ===');
ok(md.length >= 29, md.length + ' markdown files');
ok(shots.filter(f => f.includes('audit')).length === 23, shots.filter(f => f.includes('audit')).length + ' audit screenshots');
ok(shots.filter(f => f.includes('proto')).length >= 23, shots.filter(f => f.includes('proto')).length + ' prototype screenshots');
ok(shots.filter(f => f.includes('dotnet')).length === 23, shots.filter(f => f.includes('dotnet')).length + ' live .NET screenshots (22 screens + AC-01)');

console.log('\n=== every image and link resolves ===');
const badImg = [], badLink = [], usedShots = new Set();
for (const f of md) {
  const text = fs.readFileSync(f, 'utf8');
  const dir = path.dirname(f);
  for (const m of text.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
    const p = path.resolve(dir, m[1]);
    if (fs.existsSync(p)) usedShots.add(p); else badImg.push(path.relative(DOCS, f) + ' -> ' + m[1]);
  }
  for (const m of text.matchAll(/(?<!!)\[[^\]]*\]\(([^)#][^)]*?)(#[^)]*)?\)/g)) {
    const target = m[1];
    if (/^https?:|^mailto:/.test(target)) continue;
    if (!fs.existsSync(path.resolve(dir, target))) badLink.push(path.relative(DOCS, f) + ' -> ' + target);
  }
}
ok(badImg.length === 0, badImg.length ? 'broken images:\n     ' + badImg.join('\n     ') : 'all image paths resolve');
ok(badLink.length === 0, badLink.length ? 'broken links:\n     ' + badLink.join('\n     ') : 'all relative links resolve');

console.log('\n=== every screen is documented with both screenshots ===');
/* code, prototype route, audit section, live .NET shot ('' = no standalone route) */
const SCREENS = [
  ['B-05', 'org/cycles', 'scr-16', 'org-cycles'], ['B-15', 'org/cycledetail', 'scr-17', ''],
  ['B-06', 'setup/console', 'scr-18', 'setup-console'], ['B-07', 'setup/boundary', 'scr-19', 'setup-boundary'],
  ['B-08', 'org/sector', 'scr-20', 'org-sector'], ['B-09', 'setup/standards', 'scr-21', 'setup-standards'],
  ['B-10', 'setup/applic', 'scr-22', 'setup-applic'], ['B-11', 'setup/gri2', 'scr-23', 'setup-gri2'],
  ['B-13', 'setup/omissions', 'scr-24', 'setup-omissions'], ['B-14', 'setup/readiness', 'scr-25', 'setup-readiness'],
  ['C-01', 'mat/config', 'scr-26', 'mat-config'], ['C-02', 'mat/context', 'scr-27', 'mat-context'],
  ['C-03', 'mat/stake', 'scr-28', 'mat-stake'], ['C-04', 'mat/engage', 'scr-29', 'mat-engage'],
  ['C-06', 'mat/impacts', 'scr-30', 'mat-impacts'], ['C-07', 'mat/assess', 'scr-31', 'mat-assess'],
  ['C-08', 'mat/diverge', 'scr-32', 'mat-diverge'], ['C-09', 'mat/mapping', 'scr-33', 'mat-mapping'],
  ['C-10', 'mat/secrec', 'scr-34', 'mat-secrec'], ['C-11', 'mat/ranking', 'scr-35', 'mat-ranking'],
  ['C-12', 'mat/approval', 'scr-36', 'mat-approval'], ['C-13', 'mat/topicmgmt', 'scr-37', 'mat-topicmgmt'],
  ['C-14', 'mat/risk', 'scr-38', 'mat-risk'],
];
const corpus = md.map(f => ({ f, t: fs.readFileSync(f, 'utf8') }));
const missing = [], noLive = [];
for (const [code, route, scr, dot] of SCREENS) {
  const hit = corpus.find(c => c.t.includes(scr + '-') && c.t.includes(route.replace('/', '-') + '.png'));
  if (!hit) { missing.push(code + ' ' + route); continue; }
  if (dot && !hit.t.includes('_shots/dotnet/' + dot + '.png')) noLive.push(code + ' ' + route);
}
ok(missing.length === 0, missing.length ? 'screens without both shots: ' + missing.join(', ') : 'all 23 screens carry an audit and a prototype screenshot');
ok(noLive.length === 0, noLive.length ? 'screens without a live .NET shot: ' + noLive.join(', ') : 'all 22 routable screens carry a live .NET screenshot');

console.log('\n=== no orphaned screenshots ===');
const orphan = shots.filter(s => !usedShots.has(s) && !s.endsWith('.json'));
ok(orphan.length === 0, orphan.length ? orphan.length + ' unused: ' + orphan.slice(0, 5).map(o => path.basename(o)).join(', ') : 'every screenshot is referenced');

console.log('\n' + (fails ? '== ' + fails + ' CHECK(S) FAILED ==' : '== DOCS CONSISTENT =='));
process.exit(fails ? 1 : 0);
