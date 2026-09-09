/* ═══════════════════════════════════════════════════════════════════════════
   shoot-screens.mjs — full-page screenshots of the prototype, one per route.

       node tools/shoot-screens.mjs                 # the 23 documented screens
       node tools/shoot-screens.mjs --all           # every route in VIEWS
       node tools/shoot-screens.mjs --lang ar       # Arabic pass
       node tools/shoot-screens.mjs org/cycles …    # named routes only

   Drives installed Chrome over the DevTools Protocol using Node's built-in
   WebSocket — no npm packages. The app is a hash router with no login gate
   (ROLE defaults to PM), so each screen is reached by setting location.hash
   and calling render(); #main is the scroll container, so the viewport is
   resized to its scrollHeight before each capture to get the whole page.
   ═══════════════════════════════════════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawn } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'ESG-SCREEN-SPECS/_shots/proto');

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(p => fs.existsSync(p));
if (!CHROME) { console.error('ABORT: no Chrome or Edge found'); process.exit(1); }

/* the entry HTML is whichever root .html loads the split app */
const ENTRY = fs.readdirSync(ROOT).filter(f => f.toLowerCase().endsWith('.html'))
  .find(f => fs.readFileSync(path.join(ROOT, f), 'utf8').includes('assets/js/01-config.js'));
if (!ENTRY) { console.error('ABORT: entry HTML not found'); process.exit(1); }

const DOCUMENTED = [
  'org/cycles', 'org/cycledetail', 'setup/console', 'setup/boundary', 'org/sector',
  'setup/standards', 'setup/applic', 'setup/gri2', 'setup/omissions', 'setup/readiness',
  'mat/config', 'mat/context', 'mat/stake', 'mat/engage', 'mat/impacts', 'mat/assess',
  'mat/diverge', 'mat/mapping', 'mat/secrec', 'mat/ranking', 'mat/topicmgmt',
  'mat/approval', 'mat/risk',
];

const argv = process.argv.slice(2);
const flag = n => { const i = argv.indexOf(n); return i < 0 ? null : argv[i + 1]; };
const LANG = flag('--lang') || 'en';
const named = argv.filter(a => a.includes('/'));
const WIDTH = 1600;

const sleep = ms => new Promise(r => setTimeout(r, ms));
const slug = r => r.replace(/\//g, '-');

/* ── minimal CDP client ──────────────────────────────────────────────────── */
class Cdp {
  constructor(ws) { this.ws = ws; this.id = 0; this.waiting = new Map(); ws.onmessage = e => this.onMsg(e); }
  onMsg(e) {
    const m = JSON.parse(e.data);
    if (m.id && this.waiting.has(m.id)) {
      const { ok, fail } = this.waiting.get(m.id); this.waiting.delete(m.id);
      m.error ? fail(new Error(m.error.message)) : ok(m.result);
    }
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((ok, fail) => {
      this.waiting.set(id, { ok, fail });
      this.ws.send(JSON.stringify({ id, method, params }));
      setTimeout(() => { if (this.waiting.delete(id)) fail(new Error('timeout: ' + method)); }, 30000);
    });
  }
}

const httpJson = async url => (await fetch(url)).json();

async function main() {
  const routes = named.length ? named : DOCUMENTED;
  fs.mkdirSync(OUT, { recursive: true });

  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'esg-shot-'));
  const port = 9333;
  const chrome = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    '--no-first-run', '--no-default-browser-check', '--disable-extensions',
    '--allow-file-access-from-files',
    `--user-data-dir=${profile}`, `--remote-debugging-port=${port}`,
    `--window-size=${WIDTH},1000`, 'about:blank',
  ], { stdio: 'ignore' });

  /* wait for the debugging endpoint */
  let ver = null;
  for (let i = 0; i < 60 && !ver; i++) {
    try { ver = await httpJson(`http://127.0.0.1:${port}/json/version`); } catch { await sleep(250); }
  }
  if (!ver) { chrome.kill(); console.error('ABORT: Chrome did not expose a debugging port'); process.exit(1); }
  console.log('chrome  ' + ver.Browser);

  const targets = (await httpJson(`http://127.0.0.1:${port}/json/list`)).filter(t => t.type === 'page');
  const ws = new WebSocket(targets[0].webSocketDebuggerUrl);
  await new Promise(r => { ws.onopen = r; });
  const cdp = new Cdp(ws);

  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  const url = pathToFileURL(path.join(ROOT, ENTRY)).href;
  await cdp.send('Page.navigate', { url });
  await sleep(1500);                                   // classic scripts + boot render()

  const ready = await cdp.send('Runtime.evaluate', { expression: 'typeof render === "function" && typeof VIEWS === "object"', returnByValue: true });
  if (!ready.result.value) { chrome.kill(); console.error('ABORT: app did not boot in the headless page'); process.exit(1); }

  await cdp.send('Runtime.evaluate', { expression: `LANG=${JSON.stringify(LANG)};`, returnByValue: true });

  let done = 0, failed = [];
  for (const route of routes) {
    try {
      /* set the hash and render; then measure the real content height */
      const m = await cdp.send('Runtime.evaluate', {
        expression: `(() => { location.hash = '#/${route}'; LANG=${JSON.stringify(LANG)}; render();
          const el = document.querySelector('#main');
          return JSON.stringify({ h: Math.max(el ? el.scrollHeight : 0, document.body.scrollHeight), known: !!VIEWS[${JSON.stringify(route)}] }); })()`,
        returnByValue: true,
      });
      const { h, known } = JSON.parse(m.result.value);
      if (!known) { failed.push(route + ' (route not registered)'); continue; }

      const height = Math.min(Math.max(h + 180, 900), 20000);
      await cdp.send('Emulation.setDeviceMetricsOverride', { width: WIDTH, height, deviceScaleFactor: 1, mobile: false });
      await sleep(220);

      const shot = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
      const file = path.join(OUT, `${slug(route)}${LANG === 'en' ? '' : '.' + LANG}.png`);
      fs.writeFileSync(file, Buffer.from(shot.data, 'base64'));
      const kb = Math.round(fs.statSync(file).size / 1024);
      console.log(`  ${route.padEnd(18)} ${String(WIDTH)}x${String(height).padEnd(5)} ${String(kb).padStart(4)} KB  ${path.basename(file)}`);
      done++;
      await cdp.send('Emulation.clearDeviceMetricsOverride');
    } catch (e) { failed.push(route + ' — ' + e.message); }
  }

  ws.close(); chrome.kill();
  try { fs.rmSync(profile, { recursive: true, force: true }); } catch { }

  console.log('');
  console.log(`${done}/${routes.length} captured -> ESG-SCREEN-SPECS/_shots/proto  (lang=${LANG})`);
  if (failed.length) { console.log('FAILED:'); failed.forEach(f => console.log('  ' + f)); process.exit(1); }
}

main().catch(e => { console.error('ABORT: ' + e.message); process.exit(1); });
