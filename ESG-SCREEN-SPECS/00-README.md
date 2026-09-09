# ESG Screen Specs — Reporting Cycle & Materiality

What each screen **should** contain, what it **actually** contains, and what is **missing** —
for the two areas you asked about: **Reporting Cycle** (10 screens) and **Materiality**
(13 screens).

Every screen is shown **three times**: as the V14 audit captured it, as the HTML prototype
renders it, and **as the running .NET build renders it today** — captured 9 Sep 2026 from
`http://acme.localhost:5270`. Then the three are compared.

---

## Start here

| If you want to know… | Read |
|---|---|
| How the whole process works, and where you Add / Edit / Delete / Submit | [01-PROCESS-AND-WORKFLOW.md](01-PROCESS-AND-WORKFLOW.md) |
| What happens after "Submit for review", and how the Approval Center works | [02-APPROVAL-CENTER.md](02-APPROVAL-CENTER.md) |
| What is broken or missing, ranked by consequence | [03-FINDINGS.md](03-FINDINGS.md) |
| One specific screen | [10-REPORTING-CYCLE/](10-REPORTING-CYCLE/) · [20-MATERIALITY/](20-MATERIALITY/) |
| Everything missing, in one table | [90-GAP-REGISTER.md](90-GAP-REGISTER.md) |
| Which CRUD operation exists where | [91-CRUD-MATRIX.md](91-CRUD-MATRIX.md) |

---

## The three sources, never blended

Each screen document has three separate columns. They are kept apart on purpose, because they
disagree — and the disagreement is the useful part.

| Column | Source | What it means |
|---|---|---|
| **Audit** | `ESG_V14_85_SCREEN_UX_FLOW_TRACEABILITY_AUDIT_FINAL.html` | What the screen is *required* to contain. 85 screens; ours are `scr-16`…`scr-38`. |
| **Prototype** | `assets/js/*.js` in this folder's parent | What the HTML prototype *actually renders*, cited to `file:line`. |
| **.NET** | `D:\projects\global-energy\src\ERP.Modules.Esg` | What is *actually built* in the system you are shipping — read from source, **and photographed running**. |

The .NET column has two halves, kept apart for the same reason:

- **As it runs today** — a screenshot of the live app. It shows structure, copy, actions and
  gates. It **cannot** show what the code guarantees, and on an empty tenant it cannot show
  columns that only render with data. Anything read from a screenshot says so.
- **The code behind it** — page files, service interfaces, entities, status enums, permission
  keys, and a citation to the authoritative `04-screens` spec.

**About the tenant.** The captures are from tenant **acme** with one cycle, **TEST1**, in Setup.
Most registers are empty. That turns out to be *useful* rather than a limitation: an empty screen
shows its **blockers, gates and empty-state rules**, which is exactly the layer the audit never
captured. Where a claim needs data to check, the document says **re-shoot once the tenant has
it**.

**Where a source is silent, these docs say so.** They do not fill the gap from another source
and present it as a requirement. This matters more than it sounds — see the next section.

---

## What the audit does *not* contain

Four limits, established by extracting all 85 screen blocks. Knowing them stops you trusting a
column set that is actually truncated.

1. **No actions or buttons are captured for any screen.** The audit has no field for them.
   Named actions survive only as prose inside other fields — "Fix", "Send to governance",
   "Confirm / Explain not material / Add candidate / Escalate", "partial return".
   **So every CRUD and workflow statement in these docs comes from the prototype or the .NET
   code, never from the audit.**
2. **No per-table column sets.** Each screen has one flat chip list. On multi-table screens the
   tables are merged with no boundary — B-13's own notice says "two visible paths, two tables",
   but only one 5-chip list exists.
3. **The chip list is capped at 10.** Any screen showing exactly 10 is truncated. In our scope:
   B-06, B-07, B-10, B-14, C-04, C-06 and C-13. C-13 is the worst — a 12-block (A–L) record
   represented by 10 chips.
4. **One screen captured zero columns:** **B-09 Applicable Standards**, which shows only the
   sentinel chip *"Derived / navigation screen — business inputs arrive from linked
   authoritative objects"*.
   ✅ **Now closed.** The running build answers it in full — five tables, an unambiguous column
   set, a status vocabulary and a lock-blocker list. See
   [B-09 §3](10-REPORTING-CYCLE/B-09-applicable-standards.md) and
   [F-5](03-FINDINGS.md#f-5). This is the clearest single argument for having taken the
   screenshots.

---

## Screen codes

These docs use the **project's** codes (`EsgScreenCatalog`), not the audit's, per BD-23 in
`docs\ESG\build\02-architecture\13-SCREEN-CODE-RECONCILIATION.md`. Three consequences:

- Materiality is **C-01…C-04, C-06…C-14** — there is **no C-05**. The audit's "C-04/C-05
  consolidated" is one screen, `mat/engage`, code **C-04**.
- `mat/topicmgmt` is **C-13** and `mat/risk` is **C-14**. The audit left both un-coded, labelling
  them "GRI 3-3 management extension" and "ESG risk extension (non-GRI-materiality)".
- `org/cycledetail` is **B-15**. The audit left it un-coded as a "V14 operational/support view".
- **B-12 has no screen.** Gaps and findings are unified in `rev/findings`, outside this scope.

---

## Reading the verdicts

| Mark | Meaning |
|---|---|
| **OK** | Present and working in the layer named. |
| **STUB** | The affordance exists but does nothing — most often a two-argument `drawer()` call (see below). |
| **MISSING** | Not present at all. |
| **N/A** | Deliberately absent, with the decision recorded. |
| *not captured* | The source is silent. Not the same as "missing" — nobody wrote it down. |

### The single most important prototype pattern

`assets/js/05-framework.js:31` —

```js
function drawer(title, body, foot) { … foot || `<button …>Cancel</button>
    <button … onclick="closeDrawer();toast('Saved (prototype)')">Save</button>` … }
```

When `foot` is omitted, the drawer gets a default footer whose Save closes the drawer and shows
a toast. **Any `drawer(title, someForm())` call with only two arguments is a form that cannot
write.** There are **15** of them across these 23 screens, including forms of 20–30 fields.
This is why the prototype looks CRUD-complete and is not.

---

## Regenerating the evidence

Five scripts in `../tools/`, all zero-dependency — no `npm install`, nothing to vendor:

```bash
node tools/extract-audit-shots.mjs     # 23 audit screenshots  -> _shots/audit/
node tools/shoot-screens.mjs           # 23 prototype captures -> _shots/proto/
node tools/shoot-screens.mjs --lang ar # the Arabic pass
node tools/shoot-dotnet.mjs --login    # sign in by hand, once
node tools/shoot-dotnet.mjs            # 23 live captures      -> _shots/dotnet/
node tools/screen-inventory.mjs        # tables, columns, D.* reads, stub drawers
node tools/check-docs.mjs              # every image and link resolves; no orphans
```

`shoot-screens.mjs` drives installed Chrome over the DevTools Protocol using Node's built-in
`WebSocket`. There is no login gate — `ROLE` defaults to `PM` — so each screen is reached by
setting `location.hash` and calling `render()`.

`shoot-dotnet.mjs` does the same against the running app, which **does** have a login, and a
two-step one at that. It keeps a Chrome profile at `.chrome-esg-profile`: `--login` opens a real
window so you sign in yourself, and later headless runs reuse the session cookie. **The script
never reads, stores or transmits a credential** — it only launches a browser and asks it for
pictures. To revoke, delete the profile directory.

**B-15 is not captured.** `org/cycledetail` needs a cycle id, so it is reached by clicking a
cycle name on B-05 rather than by URL. It is documented inside
[B-05](10-REPORTING-CYCLE/B-05-reporting-cycles.md).

---

## Scope and honesty notes

- These docs cover **only** Reporting Cycle and Materiality. The other 62 audited screens are
  untouched.
- The prototype described here is the **Sep-7 original build**, restored deliberately. Work done
  on it later in this session is preserved on the git branch `wip/session-changes`.
- .NET claims were verified by **reading** `src\ERP.Modules.Esg`, not by building or running the
  test suite. Anything called a defect names the file and line so you can reproduce it.
- The **live captures confirm behaviour, not correctness.** They settled several questions the
  code reading left open — and they refuted four things these documents previously recorded as
  missing (C-03's affected/interested class, C-08's resolution owner and rationale, C-09's
  many-to-many mapping, C-13's frozen-set gate). Those rows are now marked ✅ **resolved** in
  [90-GAP-REGISTER.md](90-GAP-REGISTER.md) with the correction stated in the screen file.
- Findings **F-19 to F-24** come from the running build and are labelled `live`. A screenshot
  shows what a screen does, never what the code guarantees, so each of them names the one check
  that would settle it.
- **The build is further along than these documents' scope suggests.** The app's own nav counts
  read **ORGANIZATION 5/5 · REPORTING CYCLE 8/8 · MATERIALITY 13/13**, then
  **DATA AND EVIDENCE 0/16 · REVIEW AND COMPLIANCE 1/10 · REPORT 0/9 · ASSURANCE 0/4 ·
  ADMINISTRATION 1/7** — 28 of 72 ESG screens built, and **the two groups documented here are the
  two that are finished**.
- The .NET project already has authoritative per-screen specs under
  `docs\ESG\build\04-screens\` written to a 22-section template, several of them frozen. **These
  documents cite those specs; they never replace them.** Where something here looks like a spec
  change, it is raised in [03-FINDINGS.md](03-FINDINGS.md) as a candidate decision-log entry, not
  written as settled fact.
