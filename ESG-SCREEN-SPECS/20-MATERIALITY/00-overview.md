# Materiality — group overview

> **Every screen file now carries three screenshots** — the V14 audit capture, the HTML
> prototype, and the **running .NET build** (9 Sep 2026, tenant `acme`, cycle `TEST1`). The live
> column **refuted four gaps** this set had recorded as missing — C-03's affected/interested
> class, C-08's resolution owner and rationale, C-09's many-to-many mapping, and C-13's
> frozen-set gate all exist. It also found a new one: **C-01 offers no Submit for review**, and
> every screen below it waits on that approval ([F-19](../03-FINDINGS.md#f-19)).
>
> In the app's own nav this group reads **MATERIALITY 13/13** — every screen built, and each one
> blocked by the one before it, naming its predecessor by code.

Thirteen screens that answer one question: **what is this organization actually accountable for,
and on what evidence?**

The chain is strict. An impact with no origin cannot exist; a topic with no impacts cannot be
ranked; a ranking with no rationale cannot be sent to governance; and nothing downstream moves
until governance **freezes** the topic set.

---

## The thirteen screens

| Code | Screen | Route | Audit | Owns | Doc |
|---|---|---|---|---|---|
| C-01 | Methodology & Thresholds | `mat/config` | scr-26 · P1 | `MaterialityConfigVersion` | [→](C-01-methodology.md) |
| C-02 | Context Register | `mat/context` | scr-27 · P1 | `ContextEntry` | [→](C-02-context-register.md) |
| C-03 | Stakeholders | `mat/stake` | scr-28 · P1 | `Stakeholder` | [→](C-03-stakeholders.md) |
| C-04 | Engagement | `mat/engage` | scr-29 · P1 | `EngagementPlan` + `EngagementRecord` | [→](C-04-engagement.md) |
| C-06 | Impact Register | `mat/impacts` | scr-30 · **P0** | `Impact` | [→](C-06-impact-register.md) |
| C-07 | Impact Assessment | `mat/assess` | scr-31 · **P0** | `ImpactAssessment` | [→](C-07-impact-assessment.md) |
| C-08 | Divergence Reconciliation | `mat/diverge` | scr-32 · P1 | `DivergenceRecord` | [→](C-08-divergence.md) |
| C-09 | Topic Mapping | `mat/mapping` | scr-33 · P1 | `TopicMapping` | [→](C-09-topic-mapping.md) |
| C-10 | Sector Reconciliation | `mat/secrec` | scr-34 · P1 | `SectorReconciliation` | [→](C-10-sector-reconciliation.md) |
| C-11 | Topics & Ranking | `mat/ranking` | scr-35 · P1 | `TopicRanking` | [→](C-11-topics-and-ranking.md) |
| C-12 | Governance Approval | `mat/approval` | scr-36 · **P0** | `MaterialTopicSetVersion` | [→](C-12-governance-approval.md) |
| C-13 | Topic Management (GRI 3-3) | `mat/topicmgmt` | scr-37 · P1 | `MaterialTopic` | [→](C-13-topic-management.md) |
| C-14 | ESG Risks & Opportunities | `mat/risk` | scr-38 · P2 | `EsgRisk` | [→](C-14-esg-risks.md) |

**There is no C-05.** The audit consolidates C-04/C-05 into one screen; `EsgScreenCatalog` keeps
the code `C-04` and absorbs Engagement Records into it. Objects stay distinct — one screen, two
entities.

**C-13 and C-14 have no capability id in the audit** — it labels them "GRI 3-3 management
extension" and "ESG risk extension (non-GRI-materiality)". The catalogue codes them C-13 and C-14.

---

## The chain

```
  C-01 methodology approved            ← thresholds, dimensions, HR floor. Not disableable.
    │       every assessment must reference an approved MethodologyVersion
    ▼
  C-02 context ────► C-03 stakeholders ────► C-04 engagement
    │  regulation, incidents,     affected vs        plan → records → concerns
    │  complaints, audits         interested
    └──────────────┬──────────────────────────┘
                   ▼
              C-06 IMPACT REGISTER  ← an impact with NO ORIGIN cannot be saved
                   │
                   ▼
              C-07 IMPACT ASSESSMENT ← inputs only; severity & significance are DERIVED
                   │
          ┌────────┴────────┐
          ▼                 ▼
     C-08 divergence    C-09 topic mapping ────► C-10 sector reconciliation
     (if views          impact → topic → GRI      every sector likely-material topic:
      conflict)          no-match must be          Confirm / Explain / Add / Escalate
          │              explained                        │
          └────────┬───────────────────────────────────────┘
                   ▼
              C-11 TOPICS & RANKING   ← decision + rationale per topic
                   │  "Send to governance" — unlocks only when divergences and
                   │   sector topics are all closed
                   ▼
              C-12 GOVERNANCE APPROVAL  ← approve = FREEZE  [PG-04 / gate G2]
                   │  partial return keeps unaffected decisions
                   ▼
              C-13 topic management (3-3)     C-14 ESG risks (optional, never a claim gate)
                   │
                   ▼  DATA & EVIDENCE · Report §5
```

---

## Three rules that hold across the group

**1. Inputs are entered; significance is derived.** C-07 takes scale, scope, irremediability and
likelihood. The system computes severity, significance and candidate status from the **approved**
methodology. A screen that lets someone type a significance score has broken the model.

**2. Stakeholder scores are visible but isolated.** The community survey rank is shown for
context and is **never read by the significance calculation** (DEC-06). Risk scores (C-14) are
likewise walled off — *"Risk ≠ Impact"*, and risk never alters material-topic status.

**3. Nothing is silently dropped.** A no-match at C-09 must be explained and escalated to the
Methodology Owner. Every sector likely-material topic at C-10 must end in one of four named
decisions. Divergences must be resolved or escalated, never averaged away.

---

## State of the group at a glance

| | Audit | Prototype | .NET |
|---|---|---|---|
| Screens specified | 13 of 13 | — | — |
| Column sets fully captured | **9** of 13 | — | — |
| Screens backed by a real register | — | **7** of 13 | 13 of 13 |
| Forms that can write | — | **3** (C-08, C-10, and C-11's decision) | 13 |
| Submit → Approval Center | — | **0** | **3** (C-01, C-12, C-14) |

**The prototype's materiality chain has no end-to-end workflow.** Five screens (C-01, C-02, C-03,
C-04, C-09) render literal markup with no register at all. C-11's "Send to governance" is a
`nav()`. C-12's Approve is `disabled`. So the single most important act in Epic C — freezing the
topic set — cannot be performed anywhere in the prototype.

In .NET it can, except that the queue row never gets written —
[F-1](../03-FINDINGS.md#f-1), the highest-priority finding in this whole document.

Everything missing is collected in [../90-GAP-REGISTER.md](../90-GAP-REGISTER.md).
