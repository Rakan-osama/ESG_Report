# Gap register

Everything missing across the 23 screens, in one place, ordered by what to do about it.

Derived from the per-screen documents — if this table and a screen file disagree, the screen file
is right.

> ### ✅ Eight rows were closed by the live captures (9 Sep 2026)
>
> Screenshots of the running .NET build answered eight questions this register had open, and
> **refuted four items previously recorded as missing**. Each is struck through below with the
> answer.
>
> | Was open | Answer from the running build |
> |---|---|
> | **B-09's columns** — the largest item in the set | Five tables; `STANDARD · EDITION · EFFECTIVE · EARLY ADOPTION · STATUS` |
> | B-14's `Override?` | **There is no override.** Gates are derived on every load, "not set by hand" |
> | B-11's *preparer* | Modelled as **owner + a different verifying reviewer** |
> | C-03 affected vs interested | **Modelled** — a `Class` filter and an *Affected groups* tile |
> | C-08 resolution owner + rationale | **Both exist** — *"each with its rationale and named owner"* |
> | C-09 many-to-many | **Explicit** — *"preserving many-to-many traceability"* |
> | C-10 escalate — verdict or action? | **Three** decisions: confirmed · added as candidate · explained |
> | C-13 gated on a frozen set | **Implemented** — *"opens when the material topic set is approved and frozen"* |
>
> Six new findings came the other way — see §6.

---

## 1. Fix in the .NET build

Things that are wrong or absent in the system you are shipping.

| # | Gap | Screen | Severity | Reference |
|---|---|---|:-:|---|
| 1 | **`MaterialTopicSetVersion` never reaches the Approval Center** — the projection interceptor type-switches on the status enum and does not know the third one. Gate G2 cannot pass. | C-12 | 🔴 | [F-1](03-FINDINGS.md#f-1) |
| 2 | Five permission keys declared with **no implementation**: `DeleteMatConfig`, `AddMatTopicMgmt`, `DeleteMatTopicMgmt`, `HandOverMatTopicMgmt`, `SignOffMatTopicMgmt` | C-01, C-13 | 🟠 | [F-8](03-FINDINGS.md#f-8) |
| 3 | **A reporting cycle has no approval path at all** — full CRUD, no maker-checker, not an `IApprovalSubmission` | B-05 | 🟠 | [F-9](03-FINDINGS.md#f-9) |
| 4 | Approval Center rows show `ObjectType · 8 hex` — the PM cannot tell what a row refers to | AC-01 | 🟠 | [F-10](03-FINDINGS.md#f-10) |
| 5 | `Gri2AssessmentVersion` is the **only governed set with no `DeleteDraftAsync`** | B-11 | 🟡 | [F-15](03-FINDINGS.md#f-15) |
| 6 | `ImpactAssessment` has **no Delete and no Reject** | C-07 | 🟡 | [C-07 §4](20-MATERIALITY/C-07-impact-assessment.md) |
| 7 | `EsgRisk` has no `Lock` — the only workflow verb missing | C-14 | ⚪ | [C-14 §4](20-MATERIALITY/C-14-esg-risks.md) |
| 8 | **C-01 has no Submit for review** — the methodology cannot be sent for approval, and every materiality screen waits behind it | C-01 | 🟠 | [F-19](03-FINDINGS.md#f-19) |
| 9 | **The Approval Center cannot show a decided item** — the ≥15-word note is collected and never displayed | AC-01 | 🟠 | [F-24](03-FINDINGS.md#f-24) |
| 10 | `Esg.Enum.ApprovalStatus.Draft` rendered to the user — a missing i18n key | C-01 | 🟠 | [F-20](03-FINDINGS.md#f-20) |

---

## 2. Decide before building

Requirements that were asserted but never specified. **These block work** — nobody can implement
them as written.

| # | Question | Screen | Why it blocks | Reference |
|---|---|---|---|---|
| ~~1~~ | ✅ **RESOLVED — B-09's columns.** `STANDARD · EDITION · EFFECTIVE · EARLY ADOPTION · STATUS`, over four registers, plus an *Edition changes ahead* table. | B-09 | — | [B-09 §3](10-REPORTING-CYCLE/B-09-applicable-standards.md) |
| 2 | **Enumerate GRI 3-3 blocks A–L.** Purpose says twelve; ten chips captured; nine child entities; eleven prototype accordions; and the live screen names **four families** (impacts, involvement, governance, effectiveness). **Five** counts now. | C-13 | "3-3 record complete" is unmeasurable | [F-17](03-FINDINGS.md#f-17) |
| 3 | **Where is the human-rights severity override?** P0 — "explicit, non-compensatory, auditable". Not a column, action or method. **The live C-07 is gated shut, so the capture could not settle it**; C-01 does show a padlocked floor of 4. | C-07 | It is a P0 hardening item | [F-18](03-FINDINGS.md#f-18) |
| 4 | **What approves the "stakeholder universe"?** A gate with no status, approver or action anywhere — **confirmed still absent in the running build**. | C-03 | The gate cannot be evaluated | [F-18](03-FINDINGS.md#f-18) |
| ~~5~~ | ✅ **RESOLVED by refusal.** .NET has **no override** — every gate is derived on load, *"not set by hand"*. Record the decision; do not build it. | B-14 | — | [B-14 §3](10-REPORTING-CYCLE/B-14-cycle-readiness.md) |
| ~~6~~ | ✅ **RESOLVED.** Attribution is **owner + a different verifying reviewer**, stated on the screen. Confirm the column names against the frozen spec. | B-11 | — | [B-11 §3](10-REPORTING-CYCLE/B-11-gri2-assessment.md) |
| 7 | **Is the decision "Needs review" or "Monitored"?** Audit and code disagree, and they imply different gate logic. | C-11 | Determines whether the gate passes | [C-11 §3](20-MATERIALITY/C-11-topics-and-ranking.md) |
| 8 | **Is partial return actually partial?** The P0 item is returning *selected* topics; the method looks set-level. **C-12 renders nothing without a proposal**, so the capture could not settle it. | C-12 | It is the screen's P0 hardening | [C-12 §4](20-MATERIALITY/C-12-governance-approval.md) |
| 9 | **Is Impact versioned?** Audit says `ImpactVersion`; the entity is `Impact`. | C-06 | Difference between auditable history and an editable row | [C-06 §4](20-MATERIALITY/C-06-impact-register.md) |
| ~~10~~ | ✅ **RESOLVED.** *"Link impacts to topics while preserving **many-to-many** traceability."* | C-09 | — | [C-09 §3](20-MATERIALITY/C-09-topic-mapping.md) |
| ~~11~~ | ✅ **RESOLVED.** A `Class` filter and an *Affected groups* tile; `StakeholderCategory` is a different axis. **Vulnerability** is modelled too. | C-03 | — | [C-03 §3](20-MATERIALITY/C-03-stakeholders.md) |
| ~~12~~ | ✅ **RESOLVED.** **Three** decisions — *"confirmed, added as a candidate, or explained"*. Escalation is a separate act, as the code reading said. | C-10 | — | [C-10 §3](20-MATERIALITY/C-10-sector-reconciliation.md) |
| 13 | **Who sees an escalation?** Asked by C-08, C-09 and C-10. There is no Methodology Owner inbox in either layer. | C-08/09/10 | Three screens escalate into nothing | — |

---

## 3. Missing columns

Captured requirements with no column to hold them, or column sets truncated by the audit's
10-chip cap.

| Screen | Missing | Why it matters |
|---|---|---|
| ~~C-08~~ | ✅ **Both exist** — the Resolved tile reads *"each with its rationale and named owner"* | — |
| C-10 | **Owner**, **decided-on** | A terminal governance decision with no attribution. **Still open** — with no sector standard in force the live register does not render at all |
| ~~C-02~~ | ✅ **Built as two tiles and a filter** — *Cited as impact origin* / *Not yet cited* | — |
| C-12 | **Returned topics + reasons**, **version diff** | Both implied by the screen's own notice |
| B-07 | **The entire member decision grid** | ✅ It **exists** live as a lens-scoped *Boundary reconciliation* block — but its columns need a populated tenant to read. **Re-shoot** |
| B-13 | The **second table** ("two visible paths, two tables") | Prototype supplies it: `Disclosure · Why it may never be omitted · Correct alternative` |
| C-04 | Records table beyond `Key concerns` | Prototype supplies it; `Fed impacts` ✅ exists live as an **Impacts fed** tile |
| B-06, B-10, B-14, C-06 | Truncated at 10 chips | Verify against the .NET view models, not the audit |

---

## 4. Prototype-only defects

Fix these **only** if the prototype stays in use as a reference. They do not affect the .NET
build.

| # | Defect | Screen | Reference |
|---|---|---|---|
| 1 | 15 forms discard everything typed into them | 11 screens | [F-2](03-FINDINGS.md#f-2) |
| 2 | "Send to governance" is a `nav()` | C-11 | [F-3](03-FINDINGS.md#f-3) |
| 3 | Approve `disabled`; Return is a toast with no selection UI; Decision cells hard-coded | C-12 | [F-4](03-FINDINGS.md#f-4) |
| 4 | Three contradictory gate vocabularies; a fake register whose **G2 = Boundary** against CONFIG's **G2 = Materiality Approval** | B-14 | [F-6](03-FINDINGS.md#f-6) |
| 5 | Member counts: tile says `4/4` and `6/6`, the sentence beside it says `3 in`, the data says 3 of 4 | B-07 | [F-7](03-FINDINGS.md#f-7) |
| 6 | No Delete affordance on any of the 23 screens | all | [F-11](03-FINDINGS.md#f-11) |
| 7 | No register at all for context, stakeholders, engagement or mapping | C-02/03/04/09 | [F-12](03-FINDINGS.md#f-12) |
| 8 | Topic Mapping duplicates Sector Reconciliation with unsynchronised rows | C-09 | [F-13](03-FINDINGS.md#f-13) |
| 9 | `EV-0031` and `MAT-PACK-02` cited but do not exist | B-07, C-* | [F-14](03-FINDINGS.md#f-14) |
| 10 | `mat/context` renders 6 rows under a pager reading `1–12 / 12` | C-02 | [F-16](03-FINDINGS.md#f-16) |
| 11 | Queues with no click handler — detail pinned to one record | B-10, B-11, C-07, C-13 | per-screen §2 |
| 12 | `dpEntryForm()` takes no argument, so every Edit opens the same datapoint | B-11 | [B-11 §2](10-REPORTING-CYCLE/B-11-gri2-assessment.md) |
| 13 | `＋ Candidate` flips a status and creates nothing | C-10 | [C-10 §2](20-MATERIALITY/C-10-sector-reconciliation.md) |
| 14 | Registers with no row actions at all | C-06, C-09, C-14 | per-screen §2 |
| 15 | `org/sector` has no `setupRail()` though it is a setup step | B-08 | [B-08 §2](10-REPORTING-CYCLE/B-08-sector-classification.md) |

---

## 5. Behaviour asserted but unverified

Rules the audit states that I could not confirm in either implementation. **Each needs a test**,
not a code reading — that is the only way to know.

| Rule | Screen |
|---|---|
| An **impact with no origin cannot be saved** | C-06 · P0 |
| Stakeholder scores are **isolated** from significance (DEC-06) | C-07 · P0 |
| Risk scores **never** alter claim or material-topic status | C-14 · P2 |
| The **human-rights floor is not disableable** | C-01 |
| An unresolved methodology yields **`NOT_EVALUATED`** | C-01 |
| An assessment records **which methodology version** it was scored under | C-01 / C-07 |
| Sector approval **re-resolves** downstream and flags dependents stale | B-08 |
| A moved publication date **warns** and never silently re-resolves | B-09 |
| Sector content not loaded **blocks the claim path** | B-08 / B-09 |
| **"Item does not exist" is not an omission** (TRN-D22) | B-11 / B-13 |
| Upstream change marks dependent approved objects **stale**, never rewrites them | all — the traceability contract |

---

## 6. Found by the live captures

Not in the audit, not in the prototype, not visible from a code reading — only from opening the
running app.

| # | Gap | Screen | Severity | Reference |
|---|---|---|:-:|---|
| 1 | **No Submit for review** on the methodology, though it is Approval-Center-enrolled and everything downstream waits on it | C-01 | 🟠 | [F-19](03-FINDINGS.md#f-19) |
| 2 | **No decided history** — approve or return and the row, the decider and the ≥15-word note vanish from view | AC-01 | 🟠 | [F-24](03-FINDINGS.md#f-24) |
| 3 | `Esg.Enum.ApprovalStatus.Draft` shown to the user; the same row's other cell renders it correctly | C-01 | 🟠 | [F-20](03-FINDINGS.md#f-20) |
| 4 | Four tiles read `Not set` where the answer is `0` | AC-01, B-06, B-14 | 🟡 | [F-21](03-FINDINGS.md#f-21) |
| 5 | Two adjacent columns both headed `STATUS` | B-14, C-01 | 🟡 | [F-22](03-FINDINGS.md#f-22) |
| 6 | Screen-code chips on cycle screens only, never on materiality | C-01…C-14 | 🟡 | [F-23](03-FINDINGS.md#f-23) |
| 7 | **20 scoring-scale descriptors ship as `Not yet defined`** and nothing flags it as outstanding | C-01 | 🟡 | [C-01 §3](20-MATERIALITY/C-01-methodology.md) |
| 8 | B-08 sits under **Organization** in .NET and under **Reporting Cycle** in the prototype and audit | B-08 | 🟡 | [B-08 §3](10-REPORTING-CYCLE/B-08-sector-classification.md) |
| 9 | The nav still lists **C-13 before C-12**, the ordering the audit objected to — though the screen is now correctly gated | C-13 | ⚪ | [C-13 §3](20-MATERIALITY/C-13-topic-management.md) |
| 10 | C-14's high-residual threshold is **12** — the same as C-01's negative-impact threshold. Shared constant, or coupling the P2 rule forbids? | C-14 | ⚪ | [C-14 §3](20-MATERIALITY/C-14-esg-risks.md) |

### Two vocabulary reconciliations

- **Gate numbering.** C-08 and C-10 both say **"blocks G4"**. These documents and the prototype
  use **G2** for the materiality freeze. The .NET numbering is the one to follow — fold it into
  [F-6](03-FINDINGS.md#f-6).
- **Gate *counts*.** B-05 reports the claim as **"0 of 9"**; B-14 counts **7** prerequisite gates.
  Two different sets — readiness-to-start-materiality (7) and in-accordance claim (9). Never
  conflate them.

---

## Suggested order

1. **[F-1](03-FINDINGS.md#f-1)** — one `case` arm plus a test per enrolled status enum. It
   currently disables the entire materiality freeze.
2. **[F-19](03-FINDINGS.md#f-19)** — open C-01's *Edit draft* and check for a submit action.
   **Five minutes, and it decides whether this is cosmetic or a second blocker on the same path.**
3. **Section 2 items 2–3** — C-13's blocks and C-07's HR override. Both still block build work.
   *(Item 1, B-09's columns, is now closed.)*
4. **Section 5** — write tests for the asserted rules. The live build states several of them in
   its own UI copy, which raises confidence and proves nothing.
5. **Section 1 items 2–4 and 8–10** — the orphan permissions, the cycle approval decision, the
   queue's record reference, and the three live .NET defects.
6. **Section 3** — the missing columns, most cheaply while each screen is already open. Re-shoot
   B-07 and C-10 against a populated tenant first; two of these rows may already be closed.
7. **Section 6 items 4–10** — cosmetic, but items 5, 6 and 8 are each a one-line fix.
8. **Section 4** — only if the prototype stays in use.
