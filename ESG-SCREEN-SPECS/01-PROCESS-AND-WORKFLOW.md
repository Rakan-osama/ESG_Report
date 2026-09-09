# The process, end to end

Where you add, edit, delete and submit on every screen — and what happens after you submit.

---

## 1. The journey

Reporting Cycle sets the scope; Materiality decides what to report about. Neither can start
until the one before it closes its gate.

```
ORGANIZATION                          REPORTING CYCLE                       MATERIALITY
─────────────                         ───────────────                       ───────────
 Profile                               B-05 Reporting Cycles                 C-01 Methodology
 Legal Entities  ──┐                        │                                    │
 Sites Register  ──┼──────────────────► B-07 Reporting Boundary  ────────►   C-02 Context
 Activities      ──┘                        │  (PG-02)                           │
 B-08 Sector ──────────────────────────► B-09 Applicable Standards            C-03 Stakeholders
                                            │                                    │
                                       B-10 Disclosure Applicability          C-04 Engagement
                                            │                                    │
                                       B-11 GRI 2 Assessment                  C-06 Impact Register
                                            │                                    │
                                       B-13 Omission Requests                 C-07 Impact Assessment
                                            │                                    │
                                       B-14 Cycle Readiness ───────────►      C-08 Divergence
                                            │  (foundation gates)                │
                                       B-06 Cycle Setup Console                C-09 Topic Mapping
                                            (orchestration only)                 │
                                                                              C-10 Sector Recon.
                                                                                 │
                                                                              C-11 Topics & Ranking
                                                                                 │  "Send to governance"
                                                                              C-12 Governance Approval
                                                                                 │  (PG-04 — freeze)
                                                                              C-13 Topic Management (3-3)
                                                                              C-14 ESG Risks (optional)
                                                                                 │
                                                                                 ▼
                                                                          DATA & EVIDENCE
```

Two ordering rules the audit states explicitly:

- **B-06 Cycle Setup Console owns no business fact.** It reads the other screens and its "Fix"
  links open them. It is not a step you complete; it is a view of the steps.
- **C-13 must not be editable before C-12 freezes the topic set.** The audit records this as a
  flow defect: "Current nav exposes it before Governance Approval; lock editing until approval
  or clearly mark Draft-prep mode."

---

## 2. The state machine

Twelve of the fourteen governed objects share one 8-state machine
(`Domain\Enums\ApprovalStatus.cs`). Learn this once and it applies everywhere.

```
                    ┌──────────────────────── return ────────────────────────┐
                    │                                                        │
   ┌───────┐  submit   ┌───────────┐  beginReview  ┌────────────────┐  ┌──────────────────────┐
   │ Draft ├──────────►│ Submitted ├──────────────►│ UnderEsgReview ├─►│ ReturnedForCorrection│
   └───▲───┘           └───────────┘               └────────┬───────┘  └───────────┬──────────┘
       │                                                    │                      │
       │                                          approve   │   reject             │
       │                                             ┌──────┴──────┐               │
       │                                             ▼             ▼               │
       │                                        ┌──────────┐  ┌──────────┐         │
       └─────────────────────────────────────── │ Approved │  │ Rejected │         │
                                                └────┬─────┘  └──────────┘         │
                                                     │ lock      (terminal)        │
                                                     ▼                             │
                                                ┌────────┐                         │
                                                │ Locked │◄────────────────────────┘
                                                └────────┘
   approving version n marks version n-1  ──►  Superseded
```

**Two objects do not use it:**

| Object | Its own states | Difference that matters |
|---|---|---|
| `MaterialTopicSetVersion` (C-12) | `Draft · Proposed · Returned · Frozen · Superseded` | **No `Rejected`.** Approve *is* `FreezeAsync`. A reject falls through to a return. |
| `OmissionRequest` (B-13) | `Draft · Submitted · Approved · Rejected` | **No review state** — the Approval Center skips pick-up for it. |

Status is persisted as a string with a CHECK constraint. **Never `ORDER BY` it** — the numeric
values are not in workflow order (`MaterialTopicSetStatus.Draft = 5`, `Proposed = 1`).

---

## 3. Who does what

Nine roles exist in the prototype (`assets/js/03-roles.js`). In the .NET system, authority is a
permission (`esg.<feature>.<action>`), not a role name — but they map cleanly:

| Role | Does | Typical actions |
|---|---|---|
| **PM** — ESG Programme Manager | Owns the cycle | Creates cycles, boundary, standards, applicability; submits everything |
| **CONTRIB** — Data Contributor | Enters values | Datapoint entry (outside this scope) |
| **OWNER** — Data Owner | Owns a domain's numbers | GRI 2 datapoints |
| **DREV** — Department Reviewer | First review | Returns for correction |
| **TREV** — Technical Reviewer | Methodology review | Applicability verdicts, impact assessment, mapping |
| **GOV** — Governance Approver | Approves | **Freezes the material topic set (C-12)**, approves omissions |
| **METH** — Methodology Owner | Owns the model | C-01 methodology version, escalations from C-09/C-10 |
| AUTHOR, ASSUR | Report and assurance | outside this scope |

**Separation of duties is enforced, not advisory.** The approver may not be the submitter —
refused in **three layers**: the decision service, the `ApprovalQueueItem.Decide()` entity
method, and a database check constraint `CK_ApprovalQueueItems_NoSelfApproval`.

---

## 4. Where you Add, Edit, Delete and Submit — every screen

Read this as: *the affordance that exists today in each layer.*
**STUB** = the button exists but writes nothing (a two-argument `drawer()` — see
[00-README](00-README.md#the-single-most-important-prototype-pattern)).

### Reporting Cycle

| Screen | Add | Edit | Delete | Submit for review | Approves |
|---|---|---|---|---|---|
| **B-05** Reporting Cycles | `＋ Quick` + 7-step wizard — both **STUB** in prototype; `CreateAsync` in .NET | row `Edit` — **STUB**; `UpdateAsync` in .NET | **MISSING** in prototype; `DeleteAsync` (soft) in .NET | **MISSING everywhere** — a cycle is not an approval object | — |
| **B-15** Cycle record | — | — read-only by design | — | — | — |
| **B-06** Setup Console | — | Setup notes only | — | — *(owns no fact)* | — |
| **B-07** Reporting Boundary | **MISSING** in prototype; `CreateAsync` / `StartNextVersionAsync` | basis row `Edit` — **STUB**; `UpdateAsync` | **MISSING** in prototype; `DeleteDraftAsync` | .NET `SubmitAsync` — **MISSING** in prototype | boundary sign-off |
| **B-08** Sector Classification | `＋ Add` → **writes** `D.sectors` | draft `Edit` → toast only | **MISSING** | **Yes** — `secClsSave('submitted')`; .NET `SubmitAsync` | sector sign-off |
| **B-09** Applicable Standards | — resolved, never typed | `Decide` (election) — **STUB**; .NET `DecideAsync` | `DeleteDraftAsync` (.NET) | .NET `SubmitAsync` — **MISSING** in prototype | standards sign-off |
| **B-10** Disclosure Applicability | — | verdict + rationale — **MISSING** in this build; .NET `DetermineAsync` | `DeleteDraftAsync` (.NET) | .NET `SubmitAsync` — **MISSING** in prototype | applicability sign-off |
| **B-11** GRI 2 Assessment | — | `Edit` → `dpEntryForm()` **STUB** (~30 fields, writes nothing) | **MISSING in .NET too** — the only governed set with no `DeleteDraftAsync` | .NET `SubmitAsync` — **MISSING** in prototype | gri2 sign-off |
| **B-13** Omission Requests | `＋ Add` → **STUB** (button says "Submit to governance", writes nothing) | **MISSING** | `DeleteDraftAsync` (.NET) | .NET `SubmitAsync`; prototype button is a no-op | **GOV** |
| **B-14** Cycle Readiness | — | — | — | .NET `ProposeAsync` **creates and submits in one act** | readiness sign-off |

### Materiality

| Screen | Add | Edit | Delete | Submit for review | Approves |
|---|---|---|---|---|---|
| **C-01** Methodology | .NET `SaveDraftAsync` / `StartNextVersionAsync` | .NET `SaveDraftAsync` | **MISSING** — permission key declared, no method | .NET `SubmitAsync` | **METH** |
| **C-02** Context Register | `＋ Add` → **STUB**; .NET `CreateAsync` | — prototype; .NET `UpdateAsync` | — prototype; .NET `DeleteAsync` | **None by design** — living register | — |
| **C-03** Stakeholders | `＋ Add` → **STUB**; .NET `CreateAsync` | — prototype; .NET `UpdateAsync` | — prototype; .NET `DeleteAsync` | **None** — but the audit's gate says "Stakeholder universe approved" | *(gate has no mechanism)* |
| **C-04** Engagement | `＋ Plan item` and `＋ Record` — both **STUB**; .NET Create for both | .NET `UpdatePlanAsync` / `UpdateRecordAsync` | .NET Delete for both | .NET `OfferRecordAsync` → **local accept/return, not the Approval Center** | record owner |
| **C-06** Impact Register | `＋ Add` → **STUB**; .NET `CreateAsync` | **no row actions at all** in prototype | .NET `DeleteAsync` | **None** — status is derived | — |
| **C-07** Impact Assessment | — | scores exist but are hard-pinned to IM-06 | **MISSING in .NET too** | .NET `SubmitAsync` → **local review, exempt from the Center** | **TREV** |
| **C-08** Divergence | **MISSING** | row `Resolve` → **writes** `d.st='resolved'` | .NET `DeleteAsync` | **None** | resolver |
| **C-09** Topic Mapping | — seeded by derivation | **no actions at all** in prototype; .NET `MapAsync` | **MISSING** by design | **None** | `ConfirmAsync` / escalate to **METH** |
| **C-10** Sector Reconciliation | `＋ Candidate` — **flips a status, creates nothing** | `Confirm` / `Explain` → **both write** | **MISSING** by design | **None** | decision is terminal |
| **C-11** Topics & Ranking | — | row `edit` → rationale **STUB** | **MISSING** | **"Send to governance"** — see §5 | — |
| **C-12** Governance Approval | — | — | — | — *(receives)* | **GOV** — approve = **freeze** |
| **C-13** Topic Management | — | every field read-only | — | — | — |
| **C-14** ESG Risks | `＋ Add` → **STUB**; .NET `CreateAsync` | .NET `UpdateAsync` | .NET `DeleteAsync` | .NET `SubmitAsync` | risk sign-off |

> **There is no Delete affordance anywhere in the prototype** — not on one of the 23 screens.
> Deletes exist only in .NET.

---

## 5. What happens after you press Submit

This is the part the prototype does not model at all. In the .NET system:

```
  1. YOU press "Submit for review" on the section screen
         │
         │  the page handler calls the OWNING workflow service:
         │  e.g. IBoundaryWorkflowService.SubmitAsync(versionId)
         │  → requires the feature's `handover` permission
         │  → moves Status: Draft ──► Submitted
         ▼
  2. SaveChanges runs. ApprovalQueueProjectionInterceptor watches every
     IApprovalSubmission entity and sees QueueStatus move null ──► Pending
         │
         │  → INSERTs an ApprovalQueueItem row (ObjectType, ObjectId,
         │    FeatureKey, SubmittedBy, SubmittedAtUtc, Status = Pending)
         ▼
  3. THE APPROVAL CENTER  /modules/esg/approvals
     The PM (or any holder of that feature's `signoff` permission) sees the row.
         │
         ├── Approve ──► pick-up (BeginReviewAsync) ──► the owning service's
         │               ApproveAsync ──► Status = Approved ──► queue row Decided
         │               ──► downstream unlocks
         │
         ├── Return  ──► ReturnForCorrectionAsync ──► Status = ReturnedForCorrection
         │               ──► back to YOU as Draft.  Note ≥ 15 words REQUIRED.
         │
         └── Reject  ──► RejectAsync ──► Status = Rejected (terminal).
                         Note ≥ 15 words REQUIRED.
```

**You never approve from the section screen.** Rule BD-115 forbids it, and a reflection test
(`ApprovalCentralizationTests`) scans every page model for `OnPostApprove/Reject/Return/
BeginReviewAsync` and fails the build if one appears. Five exemptions are named and deliberate:
Findings, Cycles (phase return, not a verdict), the Center itself, C-04 Engagement and
C-07 Assessment (both local micro-flows).

### Where it goes on approve

| Screen | Approving it unlocks |
|---|---|
| B-07 Boundary | B-08 Sector, B-09 Standards |
| B-08 Sector | re-resolves B-09 and flags dependents stale |
| B-09 Standards | B-10 Applicability |
| B-10 Applicability | B-11 GRI 2, C-01 Materiality, Collection Plan |
| B-11 GRI 2 | B-14 Readiness |
| B-13 Omissions | the claim computation |
| B-14 Readiness | C-01 — materiality may begin |
| **C-12 Topic set** | **freezes `MaterialTopicSetVersion`** → C-13 Topic Management, Collection Plan, Report §5 |

### The one that does not work

**C-11's "Send to governance" does not submit anything.** In the prototype it is correctly
disabled while a divergence is open or a sector topic is pending — and then it only calls
`nav('mat/approval')`. No state change, no audit, no freeze. In .NET the real submit is
`IMaterialTopicSetWorkflowService.ProposeAsync`, but see
[03-FINDINGS.md](03-FINDINGS.md) — the queue row it should produce is never written.

---

## 6. Gates

Two vocabularies, and they are not the same thing.

| | Publication gates | Stage gates |
|---|---|---|
| Ids | `PG-01` … `PG-15` | `G0` … `G7` |
| Ask | "may this be published?" | "may the cycle advance a phase?" |
| Source | `D.gates` | `CONFIG.stageGates` |
| In scope here | **PG-02** boundary · **PG-04** topic set frozen | **G2** materiality approval |

`setup/readiness` (B-14) renders both, plus a third six-row register whose G-ids **contradict**
`CONFIG.stageGates` — its "G2 = Boundary" against CONFIG's "G2 = Materiality Approval". See
[03-FINDINGS.md](03-FINDINGS.md).
