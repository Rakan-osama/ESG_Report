# CRUD & workflow matrix

Every operation, every screen, all three layers. Derived from the per-screen documents — if this
table and a screen file disagree, the screen file is right.

**Legend**
`✔` works · `◐` **stub** — the affordance exists but writes nothing · `✗` absent ·
`—` deliberately absent, decision recorded · `?` declared but unimplemented

---

## Reporting Cycle

### Prototype (`assets/js/*.js`)

| Code | Screen | C | R | U | D | Submit | Approve | Return |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| B-05 | Reporting Cycles | ◐ | ✔ | ◐ | ✗ | ✗ | ✗ | ✗ |
| B-15 | Cycle record | ✗ | ✔ | — | — | — | — | — |
| B-06 | Setup Console | ✗ | ✔ | ✔ notes | ✗ | — | — | — |
| B-07 | Reporting Boundary | ✗ | ✔ | ◐ | ✗ | ✗ | ✗ | ✗ |
| B-08 | Sector Classification | **✔** | ✔ | ◐ | ✗ | **✔** | **✔** | ✗ |
| B-09 | Applicable Standards | ✗ | ✔ | ◐ | ✗ | ✗ | ✗ | ✗ |
| B-10 | Disclosure Applicability | ✗ | ◐ | ◐ | ✗ | ✗ | ◐ | ◐ |
| B-11 | GRI 2 Assessment | ✗ | ✔ | ◐ | ✗ | ✗ | ✗ | ✗ |
| B-13 | Omission Requests | ◐ | ✔ | ✗ | ✗ | ◐ | ✗ | ✗ |
| B-14 | Cycle Readiness | ✗ | ✔ | ✗ | ✗ | ✗ | ✗ | ✗ |

### .NET (`src\ERP.Modules.Esg`)

| Code | C | R | U | D | Submit | Approve | Reject | Return |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| B-05 | ✔ | ✔ | ✔ | ✔ soft | **✗** | **✗** | **✗** | **✗** |
| B-15 | — | ✔ | — | — | — | — | — | — |
| B-06 | ✔ | ✔ | ✔ | ✔ | — | — | — | — |
| B-07 | ✔ | ✔ | ✔ | ✔ draft | ✔ | ✔ | ✔ | ✔ |
| B-08 | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| B-09 | ✔ start | ✔ | ✔ per member | ✔ draft | ✔ | ✔ | ✔ | ✔ |
| B-10 | ✔ start | ✔ | ✔ per determ. | ✔ draft | ✔ | ✔ | ✔ | ✔ |
| B-11 | ✔ start | ✔ | ✔ | **✗** | ✔ | ✔ | ✔ | ✔ |
| B-13 | ✔ | ✔ | ✔ | ✔ draft | ✔ | ✔ | ✔ | ✔ |
| B-14 | ✔ propose | ✔ | — | — | ✔ | ✔ | ✔ | ✔ |

---

## Materiality

### Prototype

| Code | Screen | C | R | U | D | Submit | Approve | Return |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| C-01 | Methodology | ✗ | ◐ literal | ✗ | ✗ | ✗ | ✗ | ✗ |
| C-02 | Context Register | ◐ | ◐ literal | ✗ | ✗ | — | — | — |
| C-03 | Stakeholders | ◐ | ◐ literal | ✗ | ✗ | ✗ | ✗ | ✗ |
| C-04 | Engagement | ◐ ×2 | ◐ literal | ✗ | ✗ | ✗ | ✗ | ✗ |
| C-06 | Impact Register | ◐ | ✔ | ✗ | ✗ | — | — | — |
| C-07 | Impact Assessment | ✗ | ◐ pinned | ✗ | ✗ | ✗ | ◐ | ◐ |
| C-08 | Divergence | — | ✔ | **✔** | ✗ | — | **✔** resolve | ✗ |
| C-09 | Topic Mapping | ✗ | ◐ literal | ✗ | ✗ | — | ✗ | ✗ |
| C-10 | Sector Reconciliation | ◐ misleading | ✔ | **✔** | ✗ | — | **✔** decide | ✗ |
| C-11 | Topics & Ranking | ✗ | ✔ | ◐ | ✗ | 🔴 `nav()` | — | — |
| C-12 | Governance Approval | — | ◐ hard-coded | ✗ | ✗ | — | 🔴 `disabled` | 🔴 toast |
| C-13 | Topic Management | ✗ | ◐ MT-01 only | ✗ | ✗ | ✗ | ✗ | ✗ |
| C-14 | ESG Risks | ◐ | ✔ | ✗ | ✗ | ✗ | ✗ | ✗ |

### .NET

| Code | C | R | U | D | Submit | Approve | Reject | Return |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| C-01 | ✔ | ✔ | ✔ | **?** | ✔ | ✔ | ✔ | ✔ |
| C-02 | ✔ | ✔ | ✔ | ✔ | — | — | — | — |
| C-03 | ✔ | ✔ | ✔ | ✔ | — | — | — | — |
| C-04 plan | ✔ | ✔ | ✔ | ✔ | — | — | — | — |
| C-04 record | ✔ | ✔ | ✔ | ✔ | ✔ offer | ✔ accept | ✗ | ✔ |
| C-06 | ✔ | ✔ | ✔ | ✔ | — | — | — | — |
| C-07 | ✔ score | ✔ | ✔ score | **✗** | ✔ | ✔ review | **✗** | ✔ |
| C-08 | ✔ raise | ✔ | ✔ | ✔ | — | ✔ resolve | — | — |
| C-09 | — derived | ✔ | ✔ map | — | — | ✔ confirm | — | ✔ unconfirm |
| C-10 | — seeded | ✔ | ✔ decide | — | — | ✔ decide | — | ✔ reopen |
| C-11 | — on read | ✔ | ✔ decide | ✗ | ✔ propose¹ | — | — | — |
| C-12 | — | ✔ | — frozen | — | ✔ from C-11 | ✔ **freeze**¹ | — by design | ✔ |
| C-13 | — via freeze | ✔ | ✔ assign | **?** | **?** | **?** | ✗ | ✗ |
| C-14 | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |

¹ 🔴 **The queue row is never written** — see [F-1](03-FINDINGS.md#f-1). The methods run; the
Approval Center stays empty.

---

## Approval Center participation

| | Enrolled | Feature key | Works |
|---|:-:|---|:-:|
| B-07 Boundary | ✔ | `boundary` | ✔ |
| B-08 Sector | ✔ | `sector` | ✔ |
| B-09 Standards | ✔ | `standards` | ✔ |
| B-10 Applicability | ✔ | `applicability` | ✔ |
| B-11 GRI 2 | ✔ | `gri2` | ✔ |
| B-13 Omissions | ✔ | `omissions` | ✔ no review state |
| B-14 Readiness | ✔ | `readiness` | ✔ |
| C-01 Methodology | ✔ | `mat-config` | ✔ |
| **C-12 Topic set** | ✔ | `mat-approval` | 🔴 **never enqueues** |
| C-14 ESG Risks | ✔ | `mat-risk` | ✔ |
| B-05, B-06, B-15, C-02, C-03, C-06, C-08, C-09, C-10, C-11, C-13 | ✗ | — | see [02](02-APPROVAL-CENTER.md#the-13-that-do-not-participate-and-why) |
| C-04, C-07 | ✗ | — | **exempted** by BD-115 — local micro-flows |

---

## What a PM can actually click, on a fresh tenant

Read from the live captures (9 Sep 2026, tenant **acme**, cycle **TEST1** in Setup). This is the
**buttons rendered**, not the service methods that exist — the two tables above cover those.

> **A missing button here is usually a gate, not a gap.** Most of these screens hide their write
> actions until their prerequisite is met, and say so in a blocker. That is the design working.
> The value of the table is what it shows about **the first hour with a new cycle**.

| Screen | Create | Other actions visible | Blocked by |
|---|---|---|---|
| B-05 Cycles | **New cycle (guided)** · **New cycle** | Export · Select · 5 status filters | — |
| B-06 Setup Wizard | **Start a setup run** | Export | — |
| B-07 Boundary | — | **Read from B-02** · 3 lens tabs · Export | — |
| B-08 Sector | **Add sector** | GRI standards register · Activities, Products & Services · Export | — |
| B-09 Standards | — *(set already started)* | Export · **Re-resolve** · **Submit for review** · **Delete draft** | — |
| B-10 Applicability | — | Go to applicable standards · Export | **B-09 not locked** |
| B-11 GRI 2 | — | Export · All / Blocked | standards not settled |
| B-13 Omissions | **Raise an omission** | Export · 4 status filters | — |
| B-14 Readiness | — | Export | 8 blocking items |
| C-01 Methodology | — *(seeded)* | **Edit draft** — and nothing else 🔴 | — |
| C-02 Context | **Add context entry** | Export · 4 filters | — |
| C-03 Stakeholders | **Add stakeholder group** | Export · 2 filters | — |
| C-04 Engagement | — | Export *(Records only)* | stakeholders **and** context both empty |
| C-06 Impact Universe | — | Export · 6 filters | no origin exists yet |
| C-07 Assessment | — | 4 queue filters | **C-01 not approved** |
| C-08 Divergence | — | Status filter | no scored impact |
| C-09 Mapping | — | 2 filters | no reviewed assessment |
| C-10 Sector Rec. | — | Decision filter | no sector standard applies |
| C-11 Ranking | — | Export · 2 filters · Materiality Configuration | **C-01 not approved** |
| C-12 Governance | — | Material Topics Ranking | no proposal |
| C-13 Topic Mgmt | — | Governance Approval | **set not frozen** |
| C-14 ESG Risks | **Add a risk or opportunity** | Export | — |

**Seven of 22 screens offer a create action on day one** — B-05, B-06, B-08, B-13, C-02, C-03,
C-14. Everything else waits on something, and every one of them names what.

**The chain is visible in one column.** C-01 → C-07 → C-08/C-09 → C-11 → C-12 → C-13: each screen
blocked by the one before it, each naming its predecessor by code. That is the materiality
process, enforced rather than documented.

**Two things in that table are defects, not gates:**

- 🔴 **C-01 shows only `Edit draft`.** Nothing blocks it — the methodology is seeded and ready —
  yet there is no **Submit for review**, so the object that six other screens wait on may have no
  way to start moving ([F-19](03-FINDINGS.md#f-19)).
- ⚠ **B-06's "Update" is not field capture.** It creates and advances a `CycleSetupRun`; the
  screen's own banner says *"This screen never captures data."* The ✔ in the .NET table above
  means the run, not a stored value.

---

## Totals

| | Prototype | .NET |
|---|:-:|:-:|
| Screens with a working **Create** | **1** of 23 (B-08) | 20 of 23 |
| Screens with a working **Update** | **3** of 23 (B-06 notes, C-08, C-10) | 22 of 23 |
| Screens with any **Delete** | **0** of 23 | 15 of 23 |
| Screens with a working **Submit** | **1** of 23 (B-08) | 12 of 23 |
| Screens with a working **Approve** | **3** of 23 (B-08, C-08, C-10) | 12 of 23 |
| Forms that discard input | **15** | 0 |

**Read the prototype as a UX reference, not a behavioural one.** Its value is layout, vocabulary,
column sets and the rules written into its notices — not what it does when you click.

The .NET build is close to complete on CRUD. What is missing there is narrower and sharper: four
unimplemented permission keys ([F-8](03-FINDINGS.md#f-8)), no delete on GRI 2 and Impact
Assessment, no approval path for a reporting cycle ([F-9](03-FINDINGS.md#f-9)), and one silent
projection failure that disables the materiality freeze entirely
([F-1](03-FINDINGS.md#f-1)).
