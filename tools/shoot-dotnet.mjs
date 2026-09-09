/* ═══════════════════════════════════════════════════════════════════════════
   shoot-dotnet.mjs — screenshots of the REAL .NET app, for the third column.

   The app requires a two-step sign-in (emailed one-time code), so it cannot be
   automated. Instead this keeps a persistent Chrome profile beside the repo:
   you sign in once, by hand, and every later run reuses that session.

       node tools/shoot-dotnet.mjs --login    # opens a real window; sign in, then close it
       node tools/shoot-dotnet.mjs            # headless capture of all 24 routes
       node tools/shoot-dotnet.mjs mat/ranking setup/boundary     # named routes

   Options:  --base http://acme.localhost:5270   (default)
             --out  ESG-SCREEN-SPECS/_shots/dotnet

   Your credentials are never read, stored or transmitted by this script — the
   session cookie lives only in the local Chrome profile directory.
   ═══════════════════════════════════════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const flag = n => { const i = argv.indexOf(n); return i < 0 ? null : argv[i + 1]; };

const BASE = (flag('--base') || 'http://acme.localhost:5270').replace(/\/$/, '');
const OUT = path.join(ROOT, flag('--out') || 'ESG-SCREEN-SPECS/_shots/dotnet');
const PROFILE = path.join(ROOT, '.chrome-esg-profile');   // persistent, git-ignorable
const LOGIN = argv.includes('--login');
const WIDTH = 1600;

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
].find(p => fs.existsSync(p));
if (!CHROME) { console.error('ABORT: Chrome not found'); process.exit(1); }

/* route -> screen code. B-15 needs a cycle id, so it is reached from B-05 instead. */
const ROUTES = [
  ['B-05', 'org/cycles'], ['B-06', 'setup/console'], ['B-07', 'setup/boundary'],
  ['B-08', 'org/sector'], ['B-09', 'setup/standards'], ['B-10', 'setup/applic'],
  ['B-11', 'setup/gri2'], ['B-13', 'setup/omissions'], ['B-14', 'setup/readiness'],
  ['C-01', 'mat/config'], ['C-02', 'mat/context'], ['C-03', 'mat/stake'],
  ['C-04', 'mat/engage'], ['C-06', 'mat/impacts'], ['C-07', 'mat/assess'],
  ['C-08', 'mat/diverge'], ['C-09', 'mat/mapping'], ['C-10', 'mat/secrec'],
  ['C-11', 'mat/ranking'], ['C-12', 'mat/approval'], ['C-13', 'mat/topicmgmt'],
  ['C-14', 'mat/risk'], ['AC-01', 'approvals'],
];

const sleep = ms => new Promise(r => setTimeout(r, ms));
const slug = r => r.replace(/\//g, '-');

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
      setTimeout(() => { if (this.waiting.delete(id)) fail(new Error('timeout: ' + method)); }, 45000);
    });
  }
}

async function login() {
  console.log('Opening a real Chrome window at ' + BASE + '/modules/esg');
  console.log('Sign in (including the emailed code), then CLOSE the window.');
  console.log('The session is kept in ' + path.relative(ROOT, PROFILE) + ' for later headless runs.\n');
  const p = spawn(CHROME, [`--user-data-dir=${PROFILE}`, '--no-first-run', '--no-default-browser-check',
    `${BASE}/modules/esg`], { stdio: 'ignore' });
  await new Promise(r => p.on('exit', r));
  console.log('Window closed. Now run:  node tools/shoot-dotnet.mjs');
}

async function capture() {
  if (!fs.existsSync(PROFILE)) {
    console.error('ABORT: no saved session. Run first:  node tools/shoot-dotnet.mjs --login');
    process.exit(1);
  }
  const named = argv.filter(a => a.includes('/') && !a.startsWith('http'));
  const routes = named.length ? ROUTES.filter(r => named.includes(r[1])) : ROUTES;
  fs.mkdirSync(OUT, { recursive: true });

  const port = 9334;
  const chrome = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    '--no-first-run', '--no-default-browser-check',
    `--user-data-dir=${PROFILE}`, `--remote-debugging-port=${port}`,
    `--window-size=${WIDTH},1000`, 'about:blank',
  ], { stdio: 'ignore' });

  let ver = null;
  for (let i = 0; i < 60 && !ver; i++) {
    try { ver = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json(); } catch { await sleep(250); }
  }
  if (!ver) { chrome.kill(); console.error('ABORT: Chrome did not expose a debugging port'); process.exit(1); }
  console.log('chrome  ' + ver.Browser + '\nbase    ' + BASE + '\n');

  const targets = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).filter(t => t.type === 'page');
  const ws = new WebSocket(targets[0].webSocketDebuggerUrl);
  await new Promise(r => { ws.onopen = r; });
  const cdp = new Cdp(ws);
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable');

  let done = 0; const failed = [];
  for (const [code, route] of routes) {
    const url = `${BASE}/modules/esg/${route}`;
    try {
      await cdp.send('Page.navigate', { url });
      await sleep(1800);
      const info = await cdp.send('Runtime.evaluate', {
        expression: `JSON.stringify({ u: location.pathname, h: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) })`,
        returnByValue: true,
      });
      const { u, h } = JSON.parse(info.result.value);
      if (/login/i.test(u)) { failed.push(`${route} — redirected to sign-in (session expired; re-run --login)`); continue; }

      const height = Math.min(Math.max(h + 60, 900), 20000);
      await cdp.send('Emulation.setDeviceMetricsOverride', { width: WIDTH, height, deviceScaleFactor: 1, mobile: false });
      await sleep(250);
      const shot = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
      const file = path.join(OUT, `${slug(route)}.png`);
      fs.writeFileSync(file, Buffer.from(shot.data, 'base64'));
      console.log(`  ${code.padEnd(6)} ${route.padEnd(18)} ${WIDTH}x${String(height).padEnd(5)} ${String(Math.round(fs.statSync(file).size / 1024)).padStart(4)} KB`);
      done++;
      await cdp.send('Emulation.clearDeviceMetricsOverride');
    } catch (e) { failed.push(route + ' — ' + e.message); }
  }

  ws.close(); chrome.kill();
  console.log(`\n${done}/${routes.length} captured -> ${path.relative(ROOT, OUT)}`);
  if (failed.length) { console.log('FAILED:'); failed.forEach(f => console.log('  ' + f)); }
}

(LOGIN ? login() : capture()).catch(e => { console.error('ABORT: ' + e.message); process.exit(1); });
