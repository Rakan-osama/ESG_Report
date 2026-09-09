# ESG OS v14 — file layout

`24_ESG_OS_v14_FinalDeveloperBaseline.html` keeps its original filename but is now a
**3.5 KB shell**: markup, one `<link>`, and fifteen `<script>` tags. Nothing is inlined.

```
24_ESG_OS_v14_FinalDeveloperBaseline.html     3.5 KB   the app — open this
assets/app.css                                 39 KB   the entire <style> block
assets/data/kpi-master.json                   146 KB   the 113-row KPI master — EDIT THIS
assets/data/kpi-master.js                     105 KB   GENERATED from the .json
assets/js/01…14-*.js                          534 KB   the <script> block, in 14 files
tools/split-single-file.mjs                            regenerates all of the above
tools/build-kpi-data.mjs                               regenerates the .js from the .json
tools/verify-split.mjs                                 proves the split is still lossless
_reference/single-file-formatted.html         674 KB   the split's SOURCE OF TRUTH
_reference/single-file-original.html          613 KB   pristine pre-formatting build
```

The split is **verbatim** — no code was rewritten, reindented, reordered or reformatted.

## ⚠ Do not let your editor re-save the old single-file version

This has already happened once: a stale VS Code buffer holding the 613 KB single-file
build was auto-formatted and saved over the shell, silently re-inlining everything.
**Before editing `24_ESG_OS_v14_FinalDeveloperBaseline.html`, close and reopen it** so
the editor picks up the 3.5 KB version. `node tools/verify-split.mjs` fails loudly if
inline CSS or JS reappears, so run it if anything looks wrong.

## The two rules

**1. Script order is load-bearing.** These are classic scripts sharing one global
scope, so the `<script>` tags reproduce the source file's exact top-to-bottom execution
order. Do not reorder them, do not add `defer` or `async`, and do not convert them to
`type="module"` — each changes *when* the code runs. The numeric prefixes encode load
order, not the author's section numbers, which is why `12-data-catalog.js` holds
section *7b*: that is where it physically sat.

| file | section |
|---|---|
| `01-config.js` | 1 · CONFIG |
| `02-i18n.js` | 2 · I18N |
| `03-roles.js` | 3 · ROLES & PERSONAS |
| `04-data.js` | 4 · DATA |
| `05-framework.js` | 5 · FRAMEWORK |
| `06-navigation.js` | 6 · NAVIGATION & SHELL |
| `07-views.js` | 7 · VIEWS + named drawer forms |
| `08-engine.js` | 8 · ENGINE |
| `09-workspace-shell.js` | 9 · WORKSPACE SHELL |
| `10-report-renderer.js` | 10 · REPORT RENDERER |
| `11-dashboard.js` | 11 · DASHBOARD & ANALYTICS |
| `12-data-catalog.js` | 7b · DATA CATALOG |
| `13-data-model.js` | shell wiring + V12 DATA OPERATING MODEL + late VIEWS |
| `14-boot.js` | `fkCheck()` + the single `render()` pass |

**2. After editing the KPI data, rebuild the shim.**

```sh
node tools/build-kpi-data.mjs           # kpi-master.json  ->  kpi-master.js
node tools/build-kpi-data.mjs --check   # CI: fail if the two have drifted
```

`kpi-master.json` is the editable source of truth. The page loads the generated
`kpi-master.js` instead, because the HTML is opened by double-clicking and browsers
block `fetch()` on `file://` URLs. The build also rejects duplicate KPI ids and rows
missing `id·p·en·ar·u·dt·agg`.

> `KPIM_CHECKSUM` (in `13-data-model.js`) is a release stamp that is *displayed*, not
> verified at runtime. The build does not recompute it — update it by hand when you cut
> a release with changed KPI data.

## What is NOT in app.css

Only the `<style>` block was extracted. Generated markup still carries **480 inline
`style="…"` attributes** and 11 `.style.x` assignments in the JS, left in place
deliberately: most interpolate runtime values (`style="width:${pct}%"`), so converting
them means rewriting generated markup and hand-naming ~480 classes — a visual-regression
risk with no structural payoff. There is no runtime CSS injection.

## Regenerating and verifying

```sh
node tools/split-single-file.mjs        # rebuild assets/ + the entry HTML from _reference/
node tools/verify-split.mjs             # prove the result is lossless
```

The splitter locates every boundary by **content marker** (the author's own
`════════════ N ·` section banners), never by line number, so it survives a reformat of
the source. It aborts rather than guessing if a marker is missing, duplicated, or out of
order.

`verify-split.mjs` checks, against `_reference/single-file-formatted.html`:

- the 14 JS files reassemble **byte-identically** to the source `<script>` block, and
  `app.css` to the source `<style>` block;
- KPI data is identical across the source, the `.json` and the generated `.js` (113 rows);
- no function declaration is called across a file boundary before it is defined
  (hoisting works inside one script, not across separate files) — 129 top-level functions
  scanned, zero hazards;
- the entry HTML loads all 14 scripts, in order, with no inline CSS or JS left.

Additionally confirmed in headless Chrome, split build vs. single-file source:

- **the same rendered DOM, byte for byte**;
- all **86 routes** render in both — 0 JS errors, 0 FK violations;
- the external stylesheet applies (`#topbar` computes to the same `64px` / white in both).

## The two `_reference/` copies

`single-file-formatted.html` is the source the split is generated from and verified
against — regenerate from it, and keep it in step if you ever edit the split files.
`single-file-original.html` is the untouched 613 KB build from before the editor
reformat; it renders identically apart from HTML indentation whitespace. It is kept only
as a historical reference and nothing points at it.

## Regression suite

`v14_regression_suite.js` resolves `../24_ESG_OS_v14_FinalDeveloperBaseline.html`, so it
targets the split build with no change needed. It requires `playwright` + chromium, which
are not installed in this workspace, so it has not been run here.
