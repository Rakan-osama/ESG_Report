# V14 — Developer Target-State Contract
## EnergyUp ESG Reporting OS · consolidated deliverables B–J · 2026-08-25
### AS-IS authority: `.NET ERP.Modules.Esg` (audited, 61 tables, Epic B built, Epics C–F = screen catalogue only) · TO-BE authority: V13.1.1 integrity + Doc 08/09 UX · Platform: reuse `Enterprise-SaaS-Platform`

> This is the single authoritative contract. No parallel baselines. The `.xlsx` twin (`V14_Developer_TargetState_Contract.xlsx`) carries the identical tables with colour-coded verdicts.

---

## 1 · In-Flight Change Alignment Matrix  — deliver BEFORE the developer merges major ESG migrations
The developer is extending the old `.NET` ESG model into Epics C–F. Each likely change is classified; **STOP-MERGE** = do not merge before adapting.

| # | Developer in-flight change | Current baseline / entity | Final V14 requirement | Verdict | STOP-MERGE | Risk if merged unchanged |
|---|---|---|---|---|---|---|
| 1 | Materiality (Epic C) on the old placeholder / straight to a scoring table | `EsgScreenCatalog.EpicC` (routes don't exist); no impact/topic/stakeholder tables | Start from **Impact Universe**; governed Impact→Assessment→Topic chain (§4) | **REPLACE** | **YES** | Survey-average materiality; no origin, no HR override — non-defensible topics |
| 2 | Data entry writing to `AssessmentDatapoint.ReportedValue` (string) | `Gri2AssessmentService` / `esg_assessment_datapoints` | **DatapointRecord** with **ValueState** (VALUE_ENTERED/TRUE_ZERO/MISSING/NA), dimensions; same record grid↔workspace (§6) | **ADAPT** | **YES** | Blank→0; true zero lost; no dimensional grain — integrity core broken |
| 3 | Evidence as `EvidenceNote`/`EvidenceReference` scalar | 5 version entities | First-class **Evidence/EvidenceVersion** on SaaS MinIO (retention/legal-hold/SHA/supersede) (§7) | **REPLACE** | **YES** | No hashes/retention/legal-hold — assurance-invalid evidence |
| 4 | Calculation as free-text factor + computed output column | `FindingFactorProvenance` free text; no calc tables | CalculationMethod/MethodVersion + FactorVersion + immutable **CalculationVersion**; CV.output≡ADV.value (§8) | **REPLACE** | **YES** | False lineage (number beside a run that computed something else) — the V13.1.1 defect re-introduced |
| 5 | In-accordance badge from a requirements-met count | `ReportingCycle.RequirementsMet` (hardcoded 0) | CE-1 from **PrincipleAssessment** records; claim computed (§11) | **REPLACE** | **YES** | Unearned "In accordance" claim — regulatory exposure |
| 6 | Ownership derived from KPI default department | KPI-master defaults | **CollectionRequirement / X-PLAN** is the authoritative current-cycle assignment; grid reads it (§5) | **ADAPT** | **YES** | Reassignment impossible; per-cycle SoD lost; wrong site context |
| 7 | Report tables authored by typing KPI values | no report tables yet | Report values ONLY via **bindings** to Approved Fact/Breakdown/Calc; token picker (§12) | **ADAPT** | **YES** | Report literal becomes business truth — single-fact authority broken |
| 8 | Period lock as derived `IsPeriodLocked` flag | `ReportingCycle.Phases` | **ReleaseSnapshot** freezes ADV/CV/evidence/index/claim ids; only restatement creates later versions (§16) | **ADAPT** | — | Published period can silently change |
| 9 | Editing approval rows with no concurrency token | `TenantEntity.RowVersion` (inert `varbinary(max)`) | Activate optimistic concurrency → **409 CONFLICT** (§20A) | **ADAPT** | — | Silent last-write-wins between two reviewers |
| 10 | `AssessmentDatapoint` left non-`IAuditable` | audit interceptor (23/58 entities) | The authoritative value record MUST be auditable (§20B) | **ADAPT** | — | The one table holding `ReportedValue` has no field-level trail |
| 11 | Keep the 8-state approval workflow | `ApprovalStatus` machine | Reuse; extend to new aggregates | **KEEP** | — | — |
| 12 | Keep domain SoD (`SelfApprovalBlockedException` ×11) | 11 aggregates | Reuse + extend cross-role SoD + assurance impartiality | **KEEP** | — | — |
| 13 | Keep the seeded GRI register (49/53/139) | `GriRegisterSeedData` | Keep; load future updates via **ContentRelease** | **KEEP** | — | — |
| 14 | Keep 100% AR/EN resx + `GriDefinition` glossary | Resources | Reuse as the governed glossary; full operational parity | **KEEP** | — | — |
| 15 | Keep Epic-B (org→boundary→standards→applicability→GRI 2) | 15 screens | Reuse as implementation foundation | **KEEP** | — | — |
| 16 | Ship `EsgScreenCatalog` C–F routes as real UI | 52 declared routes | Do NOT expose capability IDs as nav; implement per matrix (§24) | **DROP** | — | Roadmap-as-UI misleads users; 52 dead routes |
| 17 | Any new Tenant/Users/Roles/Auth in the ESG module | (if present) | Reuse the SaaS; ESG Org = SaaS tenant (§19) | **DROP** | **YES** | Duplicate identity/tenancy — security + isolation risk |

---

## 2 · AS-IS `.NET` → TO-BE Implementation (summary; full 35-row detail in Doc 10)

| Capability | AS-IS `.NET` | TO-BE V14 | Disposition | Priority |
|---|---|---|---|---|
| Materiality | absent (0%) | Impact Universe → Assessment → Topic → Governance | BUILD | P0 |
| Data entry | `ReportedValue` string | DatapointRecord + ValueState + dims | ADAPT | P0 |
| Evidence | scalar note | Evidence/EvidenceVersion on MinIO | REPLACE | P0 |
| Calculation | free-text factor | CalculationMethod/Version + FactorVersion + CalculationVersion | REPLACE | P0 |
| Approved fact | n/a | ApprovedDatapointVersion (immutable) | BUILD | P0 |
| Claim / CE-1 | RequirementsMet=0 | PrincipleAssessment-driven | REPLACE | P0 |
| Collection assignment | KPI default dept | CollectionRequirement / X-PLAN | ADAPT | P0 |
| Concurrency | inert RowVersion | optimistic 409 | ADAPT | P0 |
| Audit datapoint | not auditable | IAuditable | ADAPT | P0 |
| Report Studio | absent | sections + bindings + token picker | BUILD | P1 |
| Content index / SoU | enum only | generated | BUILD | P1 |
| Review split | one queue | Dept vs Technical, same record | BUILD | P1 |
| Validation governance | hardcoded FluentValidation | ValidationRuleVersion catalogue | EXTEND | P1 |
| Content loader | absent | ContentRelease atomic activate | BUILD | P1 |
| Licensing | absent | FrameworkLicense gating | BUILD | P1 |
| Period lock | derived flag | ReleaseSnapshot | BUILD | P0 |
| ActionPlan | scattered | one first-class model | BUILD | P1 |
| Epic B | built | reuse | KEEP | — |
| SaaS tenancy/auth/audit/storage | platform | reuse | REUSE | — |

---

## 3 · AS-IS → TO-BE Database Migration Map (over the real 61-table `.NET` schema; audit data never lost)

| AS-IS table | AS-IS fields | Target | KEEP | RENAME/MOVE | DEPRECATE | NEW | Migration rule | History |
|---|---|---|---|---|---|---|---|---|
| `esg_organization_profiles` | name, hq, contact, version, EvidenceNote | OrganizationProfile | all | EvidenceNote→EvidenceLink | — | — | 1:1 keep | keep versions |
| `esg_legal_entities/_versions` | entity data, RestatementNote | LegalEntity/Version | all | — | — | — | 1:1 keep | keep |
| `esg_sites/_versions/_certifications` | site data, EvidenceAttached bool | Site/Version | all | EvidenceAttached→EvidenceLink | — | SiteDataDomain rows | 1:1 + evidence backfill | keep |
| `esg_value_chain_items/_versions` | GRI 2-6 | ValueChainItem/Version | all | — | — | — | 1:1 keep | keep |
| `esg_reporting_cycles` | period, phase, IsPeriodLocked(ignored), RequirementsMet(0) | ReportingCycle | period, phase | — | RequirementsMet | FK→ReleaseSnapshot | drop hardcoded count | keep |
| `esg_boundary_bases/_versions` | lens, scope | BoundaryBasis/Version | all | — | — | — | 1:1 keep | keep |
| `esg_gri_standards/_versions/_disclosures` | register 49/53/139 | GriStandard… | all | — | — | — | 1:1; govern via ContentRelease | keep |
| `esg_disclosure_applicability_*` | verdicts | DisclosureApplicability | all | — | — | — | 1:1 keep | keep |
| `esg_gri2_assessment_*` | readiness | Gri2Assessment | all | — | — | — | 1:1 keep | keep |
| **`esg_assessment_datapoints`** | **ReportedValue(string)**, EvidenceReference, IsEstimated, EstimationMethod, VarianceExplanation | **DatapointRecord + ApprovedDatapointVersion** | KPI, entity/site, period | ReportedValue→Value + **ValueState** | — | ValueState, Dimensions, Unit, Contributor/Owner/Reviewer, Version, **+ADV table** | parse string→typed Value; ValueState=VALUE_ENTERED where present; make **IAuditable** | keep raw; snapshot approved as ADV v1 |
| **(scalar EvidenceNote/Reference)** | free text | **Evidence/EvidenceVersion** | — | note→Description | scalar columns (after backfill) | EvidenceId, VersionId, Type, DocDate, ValidFrom/To, SHA-256, Retention, LegalHold, StorageRef, Supersedes, Links | create Evidence from notes where resolvable | keep note text as v1 |
| `esg_findings/affected` | remediation fields | Finding | all | Remediation→**ActionPlan** link | — | FK→ActionPlan | keep + link | keep |
| `esg_omission_requests` | 4 grounds | OmissionRequest | all | — | — | — | 1:1 keep | keep |
| `esg_audit_entries` | field-level trail | AuditEntry | all | — | — | — | 1:1 — never lose | keep forever |
| **(materiality — none)** | — | Impact, ImpactAssessment, StakeholderGroup, EngagementRecord, MaterialTopic, MaterialTopicSetVersion, ContextItem | — | — | — | full field set (§4) | net-new | n/a |
| **(calc output columns)** | computed value | CalculationVersion + CalculationMethodVersion + FactorVersion | — | output→CalculationVersion.output | — | full field set (§8) | wrap each computed value as a CalculationVersion; freeze factor | keep |

---

## 4 · Field-Level Data Contract (new/changed authoritative objects — field by field)

**DatapointRecord** — DatapointDefinitionId(FK,sys) · KpiId(FK,sys) · Cycle(FK,sys) · Entity(FK,plan) · Site(FK,plan — *read & write the same X-PLAN site*) · Period(str,contrib) · Dimensions(json,contrib) · **ValueState(enum,contrib: VALUE_ENTERED/TRUE_ZERO/MISSING/NOT_APPLICABLE)** · Value(decimal — req iff VALUE_ENTERED or TRUE_ZERO=0) · Unit(str,contrib — family locked) · Source(str) · EstimateFlag(bool) · EstimationBasis(text — req iff estimate) · EvidenceLinks(FK[] — req per rule) · ContributorId · OwnerId · ReviewerId(≠contributor) · ValidationState(PASS/WARNING/BLOCKER) · WorkflowState(8-state) · Version · **Audit(IAuditable)**.

**ApprovedDatapointVersion** — ApprovedVersionId(pk, immutable) · KpiId · Cycle · Entity/Site/Dimensions · Period · **Value (the only approved fact)** · Unit · CalculationVersionId(iff calculated; CV.output≡Value) · ApprovedBy · ApprovedAt · SourceLineage · SupersedesVersionId · Status(approved/superseded).

**Evidence / EvidenceVersion** — EvidenceId · EvidenceVersionId(immutable binary) · Type · DocumentDate · ValidFrom/To · Entity/Site/Period · Source/Issuer · Confidentiality(Public/Internal/Restricted) · StorageObjectRef(MinIO) · SHA256 · Supersedes/SupersededBy · RetentionPolicy/Until · **LegalHold(overrides retention)** · AccessScope(assurance) · HashVerificationState · LinkedObjects · Status.

**CalculationMethodVersion** — MethodId · Version · Formula/Rule · RequiredInputs · AllowedDimensions · OutputType/Unit · RequiredFactorFamilies · UnitConversions · BoundaryRule · MethodologyReference · EffectiveFrom/To · WorkedExample · SelfTest · Owner/Reviewer/Approver · **Status(DRAFT→UNDER_REVIEW→APPROVED→ACTIVE→SUPERSEDED→RETIRED)** · Hash.

**CalculationVersion** — CalculationVersionId(immutable) · MethodVersionId(historical stays historical) · InputRecordVersionIds · FactorVersionIds(frozen at run) · **Output(≡ADV.value)** · Unit · ExecutionTimestamp · Reviewed/ApprovedBy · Hash · Status · Supersedes.

**CollectionRequirement (X-PLAN)** — Cycle · Kpi/Datapoint · Disclosure/Requirement · MaterialTopic(from approved set) · Entity/Site · Department(configurable) · Owner/Contributor/Reviewer(SoD) · Frequency/Period/DueDate · EvidenceRequirement · CalculationRequirement · ValidationRequirement · Status.

**Impact** — **Origin(mandatory — why it entered)** · Source · RelatedActivity/Entity/Site · Stakeholder · ValueChainPosition · Positive/Negative · Actual/Potential · Involvement(caused/contributed/linked) · Scale/Scope/Irremediability · Likelihood(potential only) · **HumanRightsOverride(overrides low likelihood, MDR-009)** · Evidence · Rationale · Review · Version.

**PrincipleAssessment** — Principle(1 of 8) · Assessment · Rationale · Evidence · AssessedBy/ReviewedBy · AssessmentDate · Version/Status → **drives CE-1**.

*(DatapointRecord field 39-dictionary rows extend Doc 39; the full editable-home map stays 1 home per field, conflicts=0.)*

---

## 5 · Screen / Workspace Contracts (compact nav; capability IDs stay metadata)

| Nav area | Capability contracts inside | Reads / owns | IDs (metadata) |
|---|---|---|---|
| Home | readiness, gates, next-best-action, journey | derived — owns no fact | — |
| My Work | task queue (why/topic/site/period/due/reviewer), Open Task | SaaS tasks | — |
| Organization & Cycle | Profile, Entities, Sites, Value chain, Cycle, Boundary, Sector, Standards, Applicability, GRI 2 | Epic B | B-01…B-13 |
| Materiality | Context, Stakeholders, Engagement, Impact Universe, Assessment, Divergence, Sector reconciliation, Mapping, Ranking, Topic decision, Governance, 3-3 | materiality objects | C-01…C-12 |
| Data & Evidence | Collection Plan (+assignment/bulk), Disclosure Workspace (6 tabs), Calculation Runs, Evidence, Validation, Import | DatapointRecord/ADV/Evidence/CV | D-01…D-12 |
| Review & Compliance | Department Review, Technical Review, Findings, Omissions, Computed Compliance, Content Index | same records | E-01…E-12 |
| Report & Assurance | Report Studio (outline/narrative/tables/binding/bilingual/preview/release), Assurance, Publication/Lock, Restatement | ADV + bindings | F-01…F-16 |
| Administration | Users&Roles(SaaS), Calc Methods, Validation Rules, Factor Library, Evidence Governance, Content Loader, Standards, Licensing, Audit Explorer | governance objects | A-* |

---

## 6 · Permission / SoD Mapping (ESG extends the SaaS grammar; enforced server-side)

| ESG permission | Grants | SoD rule |
|---|---|---|
| `esg.data.edit` | edit DatapointRecord | contributor |
| `esg.data.submit` | submit for review | contributor ≠ reviewer |
| `esg.department.review` | dept review/return | dept reviewer ≠ own submission |
| `esg.technical.review` | technical review + calc approve | tech reviewer ≠ restricted preparer |
| `esg.materiality.approve` | approve material topic set | governance approver only |
| `esg.omission.approve` | approve omission | approver ≠ requestor (SelfApprovalBlocked) |
| `esg.report.author` | author narrative / bind | author |
| `esg.report.approve` | approve/release report | approver ≠ author |
| `esg.method.approve` | approve CalculationMethodVersion | method owner |
| `esg.assurance.review` | read facts/lineage/evidence in scope; create findings | assurance ≠ preparer (impartiality); **CANNOT edit facts** |
| *(reuse)* SaaS RBAC/ABAC + tenant + audit | identity, isolation, audit | platform (RLS) |

---

## 7 · Content / Methodology Governance Contract

| Object | Lifecycle | Activation rule | Downstream on activate |
|---|---|---|---|
| **ContentRelease** | UPLOAD→STAGING→SCHEMA→KEY→FK→SEMANTIC→DIFF→IMPACT→REVIEW→APPROVE→**ATOMIC ACTIVATE** | no activation with failed validation; old releases immutable | mark affected KPI defs / cycles / collection reqs / calcs / bindings / claim **STALE** |
| CalculationMethod/Version | DRAFT→UNDER_REVIEW→APPROVED→ACTIVE→SUPERSEDED→RETIRED | draft cannot be used by a CalculationVersion | historical calcs keep historical method |
| ValidationRuleVersion | DRAFT→APPROVED→ACTIVE→SUPERSEDED | runtime engine consumes APPROVED only | no screen-local duplicate rule |
| FactorVersion | DRAFT→APPROVED→ACTIVE→SUPERSEDED | frozen at calculation run | historical runs keep historical factor |
| FrameworkLicense | requested→active→expired | blocks protected rendering/index/preview/PDF/XLSX/statement when not permitted | gates commercial exposure |

---

## 8 · Report Binding Matrix (truthful; RB-008/014/015 carry completion contracts)

| Element | Location | Bound object | KPI / grain | Status | Completion contract |
|---|---|---|---|---|---|
| RB-001 | §5.1 Scope 1 | ADV | ENV-GHG-001 | **BOUND — LIVE** | — |
| RB-002 | §5.1 Scope 2 LB | ADV | ENV-GHG-003 | **BOUND — LIVE** | — |
| RB-003 | §5.1 Scope 2 MB | ADV | ENV-GHG-004 | **BOUND — LIVE** | never aggregated with RB-002 |
| RB-004 | §5.1 narrative token | ADV | ENV-GHG-001 | **BOUND — LIVE** | — |
| RB-005 | §5.1 site chart+table | ApprovedBreakdown | ENV-GHG-003 × site | **BOUND — LIVE** | sum ≡ approved total; supersede refuses |
| RB-006 | §5.2 energy | ADV | ENV-ENE-001 | **BOUND — LIVE** | — |
| RB-007 | §5.3 water | ADV | ENV-WAT-001 | **BOUND — LIVE** | — |
| RB-008 | §5.4 waste | ADV | ENV-WST-001..007 | **SPECIFIED — NOT YET BOUND** | bind when approved Waste facts exist (haz×treatment×disposition) |
| RB-009 | §6.1 workforce | ADV | GEN-EMP-001 | **BOUND — LIVE** | — |
| RB-010 | §6.2 TRIR | ADV + CV | SOC-OHS-002 | **BOUND — LIVE** | — |
| RB-011 | Ch.9 targets | Target + tgtProgress | TGT-01..05 | **BOUND — OBJECT** | RAG NOT_EVALUATED until MD-02 signed |
| RB-012 | Ch.10 content index | generated | all disclosures | **BOUND — OBJECT** | — |
| RB-013 | §1/§2 org facts | org profile | — | **BOUND — OBJECT** | — |
| RB-014 | Annex methodology | CalcMethodVersion+FactorVersion+CalculationVersion+Assumption+Evidence | — | **SPECIFIED — NOT YET BOUND** | derive from governed method/factor/calc — no handwritten text |
| RB-015 | Scope 3 | ADV | ENV-GHG-006..012 | **SPECIFIED — NOT YET BOUND** | grain: Category 1–15, Included flag, Value, Primary-data %, Exclusion rationale, Period, org dims |
| RB-016 | §5.2 renewable token | ADV | ENV-ENE-004 | **BOUND — LIVE** | — |

---

## 9 · UAT / Regression Suite

| ID | Test | Type |
|---|---|---|
| REG-01 | V13.1.1 integrity suite (21/21) on v14 | Regression — **green** |
| REG-02 | Materiality Impact→Assessment→Topic traceability | Regression |
| REG-03 | CollectionRequirement→Grid→Workspace same record (X-PLAN site read=write) | Regression |
| REG-04 | Evidence→Record→Calculation→ADV→Report traceability | Regression |
| REG-05 | CalcMethodVersion→CalculationVersion reproducibility (CV.output≡ADV.value) | Regression |
| REG-06 | Dept vs Technical review on same record | Regression |
| REG-07 | PrincipleAssessment→CE-1 (no integer) | Regression |
| REG-08 | Report token→ApprovedVersion (no typed number) | Regression |
| REG-09 | Table+Chart→same dataset (sum≡total) | Regression |
| REG-10 | Report stale propagation | Regression |
| REG-11 | ReleaseSnapshot immutability | Regression |
| REG-12 | Restatement preserves frozen release | Regression |
| REG-13 | Arabic route parity (no EN-only operational labels) | Regression |
| GOV-01..10 | ContentRelease/method/validation/licence/legal-hold/period-lock/restatement/CE-1 | Integration |
| SAAS-01..06 | Tenant isolation (records/files/exports) + scoped perms + self-review prohibited + assurance impartiality | Integration |
| REP-01..03 | RB-008/014/015 resolve or stay NOT-BOUND | Integration |
| ACT-01 | One ActionPlan reused by all surfaces | Integration |
| OUT-01/02 | Materiality report reproduces approved set; Gap analysis = live blockers, zero invented | Integration |