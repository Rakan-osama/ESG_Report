/* ═══════════════════════════════════════════════════════════════════════════
   extract-audit-shots.mjs — pull the captured V14 screenshots out of
   ESG_V14_85_SCREEN_UX_FLOW_TRACEABILITY_AUDIT_FINAL.html.

       node tools/extract-audit-shots.mjs            # the 23 in-scope screens
       node tools/extract-audit-shots.mjs --all      # all 85

   The audit is 10.7 MB, of which ~99% is one inline base64 JPEG per screen
   (<img class="shot" src="data:image/jpeg;base64,…">). Decoding them to files
   is what makes the document usable, and gives the docs their "what the audit
   captured" image. Zero dependencies.
   ═══════════════════════════════════════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'ESG_V14_85_SCREEN_UX_FLOW_TRACEABILITY_AUDIT_FINAL.html');
const OUT = path.join(ROOT, 'ESG-SCREEN-SPECS/_shots/audit');
const ALL = process.argv.includes('--all');

/* in scope: Reporting Cycle scr-16…25, Materiality scr-26…38 */
const inScope = n => n >= 16 && n <= 38;

const html = fs.readFileSync(SRC, 'utf8');
const secs = [...html.matchAll(/<section class="screen" id="(scr-(\d+))"/g)];
if (!secs.length) { console.error('ABORT: no <section class="screen"> found'); process.exit(1); }

fs.mkdirSync(OUT, { recursive: true });

const slug = s => String(s).trim().toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

let written = 0, skipped = 0, missing = [];
const index = [];

secs.forEach((m, i) => {
  const id = m[1], n = +m[2];
  if (!ALL && !inScope(n)) return;
  const block = html.slice(m.index, i + 1 < secs.length ? secs[i + 1].index : html.length);

  /* route + capability id live in div.meta as: <code>route</code> · CAP-ID · stage */
  const meta = (block.match(/<div class="meta">([\s\S]*?)<\/div>/) || [, ''])[1];
  const route = (meta.match(/<code>([^<]+)<\/code>/) || [, ''])[1].trim();
  const cap = (meta.replace(/<[^>]+>/g, '').split('·')[1] || '').trim();
  const name = (block.match(/<h2[^>]*>([\s\S]*?)<\/h2>/) || [, ''])[1].replace(/<[^>]+>/g, '').trim();

  const img = block.match(/<img[^>]*class="shot"[^>]*src="data:image\/([a-z]+);base64,([A-Za-z0-9+/=]+)"/);
  if (!img) { missing.push(id + ' ' + route); return; }

  const ext = img[1] === 'jpeg' ? 'jpg' : img[1];
  const file = `${id}-${slug(route) || slug(name) || 'screen'}.${ext}`;
  const buf = Buffer.from(img[2], 'base64');
  const dest = path.join(OUT, file);

  if (fs.existsSync(dest) && fs.statSync(dest).size === buf.length) { skipped++; }
  else { fs.writeFileSync(dest, buf); written++; }

  index.push({ id, n, cap, route, name, file, kb: Math.round(buf.length / 1024) });
});

index.sort((a, b) => a.n - b.n);
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(index, null, 1));

console.log(`audit screenshots -> ESG-SCREEN-SPECS/_shots/audit`);
console.log(`  ${written} written, ${skipped} already current, ${index.length} total`);
if (missing.length) console.log('  NO IMAGE: ' + missing.join(', '));
console.log('');
index.forEach(x => console.log(`  ${x.id.padEnd(7)} ${(x.cap || '—').padEnd(6)} ${x.route.padEnd(18)} ${String(x.kb).padStart(4)} KB  ${x.name}`));
