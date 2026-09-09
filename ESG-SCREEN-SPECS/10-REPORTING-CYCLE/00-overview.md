# Reporting Cycle — group overview

> **Every screen file now carries three screenshots** — the V14 audit capture, the HTML
> prototype, and the **running .NET build** (9 Sep 2026, tenant `acme`, cycle `TEST1`). The live
> column closed the group's biggest open item: **B-09's column set**, which the audit captured as
> zero columns and the running screen answers in full. It also settled B-14's `Override?`
> question — by refusing it: gates are derived on every load and cannot be overridden.
>
> In the app's own nav this group reads **REPORTING CYCLE 8/8** — every screen built. Note that
> **B-08 Sector Classification sits under Organization there**, not with the cycle.

Ten screens. They answer one question in sequence: **what, exactly, is this report about?**
Period, boundary, sector, standards, which disclosures apply, whether GRI 2 can be answered,
what may be omitted, and whether the foundation is ready for Materiality to begin.

Nothing downstream is trustworthy until this group closes. The Collection Plan, the claim and
Report §5 all scope to what is decided here.

---

## The ten screens

| Code | Screen | Route | Audit | Owns | Doc |
|---|---|---|---|---|---|
| B-05 | Reporting Cycles | `org/cycles` | scr-16 · P2 | `ReportingCycle` | [→](B-05-reporting-cycles.md) |
| B-15 | Cycle record | `org/cycledetail` | scr-17 · P2 | *nothing — derived* | [→](B-05-reporting-cycles.md#b-15--the-cycle-record) |
| B-06 | Cycle Setup Console | `setup/console` | scr-18 · P2 | *nothing — orchestration* | [→](B-06-cycle-setup-console.md) |
| B-07 | Reporting Boundary | `setup/boundary` | scr-19 · **P1** | `BoundaryBasisVersion` | [→](B-07-reporting-boundary.md) |
| B-08 | Sector Classification | `org/sector` | scr-20 · P2 | `SectorAssignmentVersion` | [→](B-08-sector-classification.md) |
| B-09 | Applicable Standards | `setup/standards` | scr-21 · **P1** | `CycleStandardSetVersion` | [→](B-09-applicable-standards.md) |
| B-10 | Disclosure Applicability | `setup/applic` | scr-22 · **P1** | `DisclosureApplicabilityVersion` | [→](B-10-disclosure-applicability.md) |
| B-11 | GRI 2 Assessment | `setup/gri2` | scr-23 · **P0** | `Gri2AssessmentVersion` | [→](B-11-gri2-assessment.md) |
| B-13 | Omission Requests | `setup/omissions` | scr-24 · P2 | `OmissionRequest` | [→](B-13-omission-requests.md) |
| B-14 | Cycle Readiness | `setup/readiness` | scr-25 · **P1** | `CycleReadinessProposal` | [→](B-14-cycle-readiness.md) |

**B-12 does not exist.** The audit's delta panel: *"B-12 Gap Register is not a separate route:
gaps/findings are unified in `rev/findings`."*

---

## Order of work

```
  B-05 create the cycle
    │      period · financial-period alignment · publication target · intent · assurance
    ▼
  B-07 decide the boundary            ← needs Entities + Sites approved
    │      per lens: Include / Exclude / Undecided, with rationale     [PG-02]
    ▼
  B-08 classify the sector            ← needs activities + boundary
    │      resolves the GRI Sector Standard — never typed
    ▼
  B-09 resolve applicable standards   ← as-of the FROZEN basis date
    │      Universal · Sector · Topic · version transitions
    ▼
  B-10 determine applicability        ← per requirement: does the condition apply?
    │      Applicable / Not applicable — Undetermined is a state, not an answer
    ▼
  B-11 assess GRI 2                   ← datapoint grain, not disclosure checkbox
    │      incomplete ⇒ a Finding, or a controlled path to…
    ▼
  B-13 omission requests              ← four permitted reasons only, 7 never omittable
    │
    ▼
  B-14 cycle readiness                ← derived, never a stored flag
           foundation gates pass ⇒ Materiality may begin

  B-06 Cycle Setup Console runs alongside all of it — a read-only view of the above.
```

---

## Two rules that hold across the whole group

**1. Undecided / Undetermined is a real value.** B-07 must not default an undecided member to
Exclude; B-10 must not mark a requirement "not applicable" because data is missing. Both are
first-class states that *block* the gate rather than resolving it.

**2. The three axes never collapse.** Applicability (B-10) ≠ Materiality (Epic C) ≠ Omission
(B-13). A requirement that is applicable *and* material but cannot be reported goes to an
omission request — never to "not applicable".

---

## State of the group at a glance

| | Audit | Prototype | .NET |
|---|---|---|---|
| Screens specified | 10 of 10 | — | — |
| Column sets fully captured | **2** of 10 | — | — |
| Screens backed by a real register | — | **6** of 10 | 10 of 10 |
| Forms that can write | — | **1** (B-08) | 10 |
| Submit → Approval Center | — | **0** | **7** of 10 |

The prototype's Reporting Cycle group is largely a **visual mock**: B-09 and B-11 read **zero**
`D.*` registers, and B-10 has no table at all. The .NET build is the real implementation. Use the
prototype for layout and vocabulary, not for behaviour.

Per-screen detail is in each file; everything missing is collected in
[../90-GAP-REGISTER.md](../90-GAP-REGISTER.md).
