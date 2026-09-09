# V14 — Final Developer Target-State Baseline · Closure
## EnergyUp ESG Reporting OS · consolidation & developer alignment · 2026-08-25

This is the single closure for the consolidation order. It does not reopen product design, add UX concepts, or produce another evaluation. It states what is now the authoritative target, proves the integrity core survived, and hands the developer an exact old-code → final-target contract with an in-flight merge guard.

## What this release is
- **`24_ESG_OS_v14_FinalDeveloperBaseline.html`** — the one authoritative connected build. It is V13.1.1 promoted: the integrity engine, all operational surfaces, and the approved compositions live in **one** build, not as islands. Docs 08/09 remain as premium reference demonstrations of surfaces that already exist, connected, inside v14 (Impact-Universe materiality `mat/impacts`, the full C-01→C-12 chain, and the Report Studio `rpt/rstruct·rnarr·rtab·rbind·rprev·release`). **Data depth was not simplified to achieve visual refinement** (§25).
- **`V14_Developer_TargetState_Contract.xlsx`** — nine implementation sheets (below), the consolidated deliverables B–J. No parallel competing baselines.
- **`tests/v14_regression_suite.js` → `test-results/v14_regression_suite.json`** — the V13.1.1 integrity suite bound to the v14 build: **21/21 PASS · 85 routes · zero errors**.

## The integrity core survived unchanged (§2)
`SourceRecord → validation → calculation → review → approval → ApprovedDatapointVersion → controlled consumption`, and for calculated data `SourceRecordVersion → CalculationMethodVersion → FactorVersion → CalculationVersion → ApprovedDatapointVersion`. The invariant **`CalculationVersion.output = ApprovedDatapointVersion.value = Fact Book = Performance = Report = Narrative token = Assurance = Release Manifest`** is proven on the v14 file by TC-INT-15 (GHG-001/GHG-003/OHS-002) and the golden lifecycle ×4. No second authoritative value store; no report literal is business truth.

## The workbook (deliverables B–J)
1. **In-Flight Alignment Matrix** — 17 developer changes classified KEEP/ADAPT/REPLACE/DROP, with **8 STOP-MERGE** items. Delivered *before* the developer closes major ESG migrations, as ordered (§22).
2. **AS-IS → TO-BE Implementation** (full 35-row detail in Doc 10).
3. **DB Migration Map** — table-by-table over the real 61-table .NET schema: KEEP/RENAME/MOVE/DERIVE/DEPRECATE/NEW + migration rule + historical-data treatment. Audit data is never lost.
4. **Field-Level Data Contract** — DatapointRecord, ApprovedDatapointVersion, Evidence/EvidenceVersion, CalculationMethodVersion, CalculationVersion, CollectionRequirement, Impact, PrincipleAssessment — field by field.
5. **Screen/Workspace Contracts** — the eight compact nav areas; capability IDs (B-03/C-07…) stay metadata, never navigation.
6. **Permission / SoD Mapping** — ESG permissions extending the SaaS grammar; SoD enforced server-side.
7. **Content / Methodology Governance** — ContentRelease atomic activation + method/validation/factor/licence lifecycles.
8. **Report Binding Matrix** — RB-001…016 truthful; RB-008/014/015 carry explicit completion contracts (Scope-3 grain named).
9. **UAT / Regression** — REG-01…13 + GOV/SAAS/REP/ACT/OUT.

## The eight STOP-MERGE items (must not merge before adapting)
Materiality on the old placeholder (must be Impact Universe first) · data entry on `ReportedValue` string without ValueState (Missing≠Zero, dimensions) · evidence as a scalar note (must be first-class Evidence) · calculation without CalculationVersion (false lineage) · claim from a requirements-met integer (must be PrincipleAssessment) · ownership from the KPI default department (must be CollectionRequirement/X-PLAN) · report values typed into tables (bind only) · any new Tenant/Users/Auth in the ESG module (reuse the SaaS).

## The three .NET defects to close regardless of sequence (§20)
Inert `RowVersion` → activate optimistic concurrency (409). · `AssessmentDatapoint` → `IAuditable`. · Dead Excel/PDF export path → wire to a user workflow or deprecate.

## The 29 freeze gates
| Gate | State |
|---|---|
| V13.1.1 integrity tests pass on v14 | ✅ 21/21 |
| No duplicate fact authority | ✅ single ADV; proven |
| Impact Universe is the Materiality entry | ✅ (design/prototype); .NET: BUILD |
| Collection assignment real & X-PLAN governed | ✅ (design/prototype); .NET: BUILD |
| Evidence first-class | ✅ (contract); .NET: REPLACE scalar |
| Calculation methodology versioned | ✅ (contract); .NET: BUILD |
| CalculationVersion lineage immutable | ✅ proven |
| PrincipleAssessment drives CE-1 | ✅ (contract); .NET: BUILD |
| Dept/Technical review distinct, share data | ✅ (design/prototype); .NET: BUILD |
| Report Studio operational | ✅ live in v14 |
| Report values bind only to approved data | ✅ proven |
| Outstanding bindings honestly statused | ✅ RB-008/014/015 NOT-BOUND |
| Period Lock = frozen snapshot contract | ✅ (contract); .NET: BUILD |
| In-flight changes classified | ✅ 17 rows / 8 STOP-MERGE |
| DB migration path exists | ✅ sheet 3 |
| No SaaS foundation duplicated | ✅ reuse-only |
| EN/AR parity complete | ✅ prototype + .NET resx 100% |
| No new unresolved P0 product decision | ✅ — remaining P0s are **build**, not design |

## Honest verdict
**PRODUCT DESIGN IS FROZEN — this is the authoritative final target state.** The connected baseline (`24_…v14…html`) passes the integrity suite and carries the design in one build; the contract tells the developer exactly what to keep, adapt, replace, drop, and migrate, with an 8-item merge guard.

It is **not yet a labeled FINAL running system**: that gate is the developer implementing to this contract (the P0 BUILD/ADAPT items in .NET) and five governance signatures — **MDR-001, MDR-002, MDR-007, MDR-009, MDR-010**. Those are execution and governance, not product design. After this release, product design does not reopen; work proceeds from the contract sheets and the build sequence in Doc 14 §2.