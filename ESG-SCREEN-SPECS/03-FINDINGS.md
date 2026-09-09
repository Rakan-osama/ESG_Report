# Findings

What is broken or missing, ranked by consequence. Every item names the file so you can
reproduce it.

**F-1 to F-18 are read from source** — the audit HTML, the prototype's JavaScript, the .NET
project. **F-19 to F-24 were seen in the running .NET build** on 9 Sep 2026 and are marked
`live`; a screenshot shows what a screen does, never what the code guarantees, so each of those
names the one check that would settle it.

**Legend** — 🔴 blocks a governed outcome · 🟠 the screen misleads its user · 🟡 inconsistency
or debt · ⚪ the requirement was never captured, so nobody can build it.

| | Finding | Where |
|---|---|---|
| 🔴 | [F-1](#f-1) Materiality freeze never reaches the Approval Center | .NET |
| 🔴 | [F-2](#f-2) 15 forms cannot write anything | prototype |
| 🔴 | [F-3](#f-3) C-11 "Send to governance" submits nothing | prototype |
| 🔴 | [F-4](#f-4) C-12 approve/return are decorative | prototype |
| ✅ | [F-5](#f-5) B-09 Applicable Standards has no captured columns at all — **resolved** | audit |
| 🟠 | [F-6](#f-6) Three contradictory gate vocabularies on one screen | prototype |
| 🟠 | [F-7](#f-7) Boundary states member counts that its own data contradicts | prototype |
| 🟠 | [F-8](#f-8) Five permission keys with nothing behind them | .NET |
| 🟠 | [F-9](#f-9) A reporting cycle can never be approved | .NET |
| 🟠 | [F-10](#f-10) The PM cannot tell what a queue row refers to | .NET |
| 🟡 | [F-11](#f-11) No Delete anywhere in the prototype | prototype |
| 🟡 | [F-12](#f-12) Four Materiality screens have no register behind them | prototype |
| 🟡 | [F-13](#f-13) Topic Mapping duplicates Sector Reconciliation | prototype |
| 🟡 | [F-14](#f-14) Dangling evidence references | prototype |
| 🟡 | [F-15](#f-15) GRI 2 is the only governed set that cannot be deleted | .NET |
| 🟡 | [F-16](#f-16) Row counts disagree with pagers | prototype |
| ⚪ | [F-17](#f-17) Seven column sets are silently truncated | audit |
| ⚪ | [F-18](#f-18) Four gates are asserted with no mechanism | audit |
| 🟠 | [F-19](#f-19) C-01 offers no way to submit the methodology for approval | .NET `live` |
| 🟠 | [F-20](#f-20) A .NET enum name is rendered to the user | .NET `live` |
| 🟠 | [F-24](#f-24) The Approval Center cannot show a decided item | .NET `live` |
| 🟡 | [F-21](#f-21) Four tiles read `Not set` where a number belongs | .NET `live` |
| 🟡 | [F-22](#f-22) Two adjacent columns share the heading `STATUS` | .NET `live` |
| 🟡 | [F-23](#f-23) Screen-code chips appear on cycle screens only | .NET `live` |

---

## F-1 · Materiality freeze never reaches the Approval Center 🔴 {#f-1}

**`src\ERP.Modules.Esg\Persistence\Interceptors\ApprovalQueueProjectionInterceptor.cs`,
`WasQueuedAs`, ~line 134.**

The interceptor finds an entity's status property **by CLR type** and handles exactly two:

```csharp
switch (property.OriginalValue)
{
    case ApprovalStatus approval:        return ApprovalSubmissionStatus.From(approval);
    case OmissionRequestStatus omission: return OmissionRequest.QueueStatusFor(omission);
    default:                             continue;
}
// falls through to:
return entry.Entity.QueueStatus;      // the CURRENT value
```

`MaterialTopicSetVersion.Status` is a **third** enum — `MaterialTopicSetStatus`
(`Domain\Entities\MaterialTopicSetVersion.cs:42`). It matches neither case, so `WasQueuedAs`
returns the *current* queue status. The caller then does:

```csharp
var current  = entry.Entity.QueueStatus;
var previous = entry.State == EntityState.Added ? null : WasQueuedAs(entry);
if (current == previous) continue;    // ← skipped
```

`previous == current`, so the handover is skipped and **no `ApprovalQueueItem` row is written**.

**Consequence.** C-12 Governance Approval is the gate G2 freeze — the single most consequential
approval in Materiality. `ProposeAsync` moves the version `Draft → Proposed`, the screen looks
correct, and the row never appears in the Approval Center. Nobody is asked to approve, so the
topic set is never frozen and Topic Management, the Collection Plan and Report §5 stay locked.

**Evidence it is real, not a misreading:**
- `MaterialTopicSetStatus` appears **nowhere** under `Persistence\`.
- The forward translation `ApprovalSubmissionStatus.From(MaterialTopicSetStatus)` **exists**
  (`Domain\Approvals\ApprovalSubmissionStatus.cs:73`) — the mapping was written, but the
  interceptor never calls it.
- The method's own XML comment enumerates only two enums, so the third was not considered.
- `ApprovalQueueProjectionTests` asserts only that the enrolled *set* matches the
  `IApprovalSubmission` implementers. **No test exercises the transition.**
- The same failure mode was recorded during P4-M1 as BD-195 in
  `docs\ESG\build\07-execution\99-PROGRESS-LOG.md`, described as "would have enqueued nothing".

**Fix.** Add a `case MaterialTopicSetStatus s: return ApprovalSubmissionStatus.From(s);` arm, and
add a projection test per enrolled status enum rather than per object type. Better still, make
`IApprovalSubmission` expose the *previous* queue status so the interceptor never type-switches
again — a fourth enum will otherwise fail the same silent way.

> Verified by reading the source, not by running the suite. Reproduce with a test before fixing.

---

## F-2 · 15 forms cannot write anything 🔴 {#f-2}

`assets/js/05-framework.js:31` — `drawer(title, body, foot)`. When `foot` is omitted the drawer
gets a default footer whose Save is `closeDrawer(); toast('Saved (prototype)')`.

**Every two-argument `drawer()` call is a form that discards its input.** In the 23 screens:

| Screen | Form | Size |
|---|---|---|
| B-05 Reporting Cycles | `cycleForm()` | full cycle setup |
| B-07 Boundary | `bndBasisForm()` | per-lens basis |
| B-09 Standards | `electForm()` | early-adoption election |
| B-11 GRI 2 | `dpEntryForm()` ×3 | **~30 fields** |
| B-13 Omissions | `omForm()`, `omDetail()` | the button even says "Submit to governance" |
| C-02 Context | `ctxForm()` | 18 fields |
| C-03 Stakeholders | `stkForm()` | — |
| C-04 Engagement | `engPlanForm()`, `engForm()` | two forms |
| C-06 Impact Register | `impForm()` | **~20 fields** incl. the 3-3-b involvement rule |
| C-11 Ranking | `rankRatForm()` | decision rationale |
| C-14 ESG Risks | `riskForm()` | 15 fields |

These are not placeholders — they are carefully built forms with GRI references, validation help
text and conditional blocks, wired to nothing. Anyone demoing the prototype will believe data is
being captured.

Reproduce: `node tools/screen-inventory.mjs` — the last section lists all 15.

---

## F-3 · C-11 "Send to governance" submits nothing 🔴 {#f-3}

`assets/js/08-engine.js` — the button is correctly **disabled** while a divergence is open or a
sector topic is pending, which reads as a working gate. When enabled, its handler is:

```js
onclick="nav('mat/approval')"
```

No state change, no audit event, no draft `MaterialTopicSetVersion`, no freeze. It is a link.
This is the one place the audit names an explicit submit action ("Send to governance unlocks only
when all decisions, divergences and sector topics are closed") and it is the one place the
prototype does not implement it.

---

## F-4 · C-12 approve and return are decorative 🔴 {#f-4}

`assets/js/07-views.js` — `mat/approval`:

- **`✓ Approved & frozen` is `disabled`.** There is no path to approve.
- **`Return selected topics`** is a toast, and there is no per-row selection UI to select with —
  yet the audit's P0 hardening is specifically about partial return: *"records exact returned
  topics/reasons"*.
- The **Decision** column renders a hard-coded `Approved` pill on **all 6 rows**; `tp.dec` from
  C-11 is never read. The Stakeholders cell is the literal string `community · workforce ·
  lenders` on every row.

The screen shows a frozen, approved topic set regardless of what Ranking decided.

---

## F-5 · B-09 has no captured columns at all ⚪ → ✅ **RESOLVED** {#f-5}

`scr-21` in the audit carries a single sentinel chip — *"Derived / navigation screen — business
inputs arrive from linked authoritative objects"* — instead of a column set.

It is the **only screen in either group with zero column capture**, and it is not a minor screen:
P1, UX score 9.5, a governance workbench that produces a versioned object
(`ApplicableStandardsSetVersion`) and gates B-10. Four tables are visible in the prototype, none
of them with header rows.

### ✅ Resolved 9 Sep 2026 by the live capture

Opening the running screen answered it outright. **This finding was the single strongest argument
for taking the screenshots**, and it is why the `_shots/dotnet/` pass exists.

**The column set, shared by all four registers:**
`STANDARD` (title over internal code, e.g. `STD-U-001`) · `EDITION` (year over full GRI
citation) · `EFFECTIVE` · `EARLY ADOPTION` · `STATUS`

**A fifth table — "Edition changes ahead"** — has its own: `STANDARD` · `NEWER EDITION` ·
`MANDATORY FROM` · `CURRENT EDITION USABLE UNTIL` · `STATUS`.

**Status vocabulary:** `Resolved` · `Not yet effective` · `Edition change pending`.
**Registers:** Universal · Sector · Topic · **Watch list** — the fourth is *not* "version
transitions" as guessed above; transitions are the separate fifth table.
**Version bar:** Export · Re-resolve · **Submit for review** · Delete draft, over four named lock
blockers.

Full detail and the screenshot: [B-09 §3](10-REPORTING-CYCLE/B-09-applicable-standards.md).

**The audit gap itself is unchanged** — `scr-21` still carries no columns, so anyone working from
the audit alone is still building blind. The requirement is now recoverable from the build instead
of needing re-elicitation from the business.

---

## F-6 · Three contradictory gate vocabularies on one screen 🟠 {#f-6}

`setup/readiness` (B-14) renders all three at once:

1. the real **PG-01…PG-15** publication gates from `D.gates`;
2. **G0–G7** stage gates from `CONFIG.stageGates`;
3. a third hard-coded six-row register whose ids **contradict** CONFIG.

The third table calls **G2 "Boundary approved"**. `CONFIG.stageGates[2]` is
**`"Materiality Approval"`**. Same id, two meanings, on one screen. A reader cannot tell which
G2 a blocker refers to.

Delete the third table; derive the detail from `D.gates`.

---

## F-7 · Boundary states member counts its own data contradicts 🟠 {#f-7}

`setup/boundary` renders **"4/4"** entities and **"6/6"** sites.

From `D`: `D.entities.filter(e => e.sus).length` is **3** of **4**, and of 6 sites one is out of
boundary. The screen also says *"Entities decided 4/4 (3 in · 1 out with 2-2-b note)"* — so the
tile and the sentence beside it disagree about what the number counts.

Any of the three readings could be right; the screen asserts all of them.

---

## F-8 · Five permission keys with nothing behind them 🟠 {#f-8}

`src\ERP.Modules.Esg\Permissions\EsgPermissions.cs` declares, with no service method or page
handler exercising them:

`DeleteMatConfig` · `AddMatTopicMgmt` · `DeleteMatTopicMgmt` · `HandOverMatTopicMgmt` ·
`SignOffMatTopicMgmt`

An administrator can grant a role the right to hand over and sign off C-13 Topic Management.
Nothing will happen. Either implement the workflow or remove the keys — a permission that grants
nothing is worse than an absent one, because it looks like coverage.

---

## F-9 · A reporting cycle can never be approved 🟠 {#f-9}

`ReportingCycle` has full CRUD (`CreateAsync` / `UpdateAsync` / soft `DeleteAsync`) and a phase
machine, but it is **not an `IApprovalSubmission`** and has **no submit, approve, reject or
return**. Creating a cycle, changing its period, its intent or its assurance plan is a single
unreviewed act.

This may well be deliberate — but it is not recorded as a decision anywhere I could find, and it
is the only foundation object in the group without maker-checker. **Worth a BD entry either way.**

---

## F-10 · The PM cannot tell what a queue row refers to 🟠 {#f-10}

`Pages\Esg\Approvals\Index.cshtml.cs` renders `RecordRef` as
`"{ObjectType} · {first 8 hex of the id}"` — so the queue reads:

```
BoundaryBasisVersion · 3f2a91c4
MaterialityConfigVersion · 88be01d7
```

The spec records display codes as deliberately deferred, along with the `Due` column, the
Overdue and "Decided this week" tiles, export, the read-only preview drawer, and the decided
history (`state=decided` returns an empty list). That is a defensible backlog — but for the
person actually working the queue, an opaque reference is the one that hurts daily.

---

## F-11 · No Delete anywhere in the prototype 🟡 {#f-11}

Not one of the 23 screens offers a delete or remove affordance. Deletes exist only in .NET, and
even there four objects are deliberately undeletable. The prototype does not distinguish
"undeletable by design" from "not built".

---

## F-12 · Four Materiality screens have no register behind them 🟡 {#f-12}

`D.*` has **no register at all** for context entries, stakeholder groups, engagement
plans/records, or the impact→topic mapping. Those four screens render literal `<tr>` markup:
C-02 (6 rows), C-03 (6), C-04 (9 across two tables), C-09 (7). Their `＋ Add` buttons therefore
have nowhere to write even if F-2 were fixed.

C-01 Methodology is fully literal too — zero `D.*` reads, no table.

---

## F-13 · Topic Mapping duplicates Sector Reconciliation 🟡 {#f-13}

`mat/mapping` (C-09) renders **two** tables; the second is a sector-reconciliation card with its
own hard-coded rows. `mat/secrec` (C-10) is the screen that owns that decision, over
`D.sectopics` (4 rows). The two are not synchronised and will drift on contact with real data.

---

## F-14 · Dangling evidence references 🟡 {#f-14}

`EV-0031` is cited on screen but does not exist in `D.evidence`. `MAT-PACK-02` is cited and
exists nowhere. Both appear in the Boundary and Materiality screens as if they were real
evidence objects.

---

## F-15 · GRI 2 is the only governed set that cannot be deleted 🟡 {#f-15}

`BoundaryBasisVersion`, `CycleStandardSetVersion`, `DisclosureApplicabilityVersion` and
`SectorAssignmentVersion` all expose `DeleteDraftAsync`. `Gri2AssessmentVersion` does not — its
child rows have `DeleteDatapointAsync` / `DeleteGapAsync`, but the draft version itself cannot be
discarded. Probably an oversight; worth confirming against the frozen spec's §20.

---

## F-16 · Row counts disagree with pagers 🟡 {#f-16}

`mat/context` renders **6** rows under a pager that reads **1–12 / 12**. Cosmetic in a
prototype, but it is the kind of literal that gets copied into a real page and then quietly
lies.

*(Checked and cleared: `mat/impacts` shows 16 against `D.impacts.length === 16` — consistent.)*

---

## F-17 · Seven column sets are silently truncated ⚪ {#f-17}

The audit's chip list is capped at 10. Any screen showing exactly 10 is incomplete, with no
marker saying so: **B-06 · B-07 · B-10 · B-14 · C-04 · C-06 · C-13**.

C-13 is the worst: its own Purpose describes the GRI 3-3 record as **blocks A–L** — twelve — and
the capture shows ten chips. Blocks B through L are enumerated nowhere in the audit.

Multi-table screens also merge their tables into one flat list with no boundary. B-13's notice
says "two visible paths, two tables"; one 5-chip list was captured.

---

## F-18 · Four gates are asserted with no mechanism ⚪ {#f-18}

The audit states a completion gate, then captures nothing that could satisfy it:

| Screen | Gate asserted | What is missing | Live build |
|---|---|---|---|
| C-03 Stakeholders | "Stakeholder universe approved" | no status column, no approver, no approval action | ⚠ **confirmed still absent** |
| ~~C-08 Divergence~~ | resolution owner + final rationale | — | ✅ **both exist** — *"each with its rationale and named owner"* |
| ~~B-14 Readiness~~ | an `Override?` column exists | — | ✅ **resolved by refusal** — gates are derived on load, never set by hand |
| ~~B-11 GRI 2~~ | a **preparer** per datapoint | — | ✅ **owner + a different verifying reviewer** |
| C-07 Assessment | an auditable human-rights severity override | not a column, not an action | ⚠ **screen gated shut — capture could not settle it** |

**Three of the five are answered**, all by opening the running app. The two that remain are the
two that matter most: an approval gate nobody built, and a P0 human-rights control nobody can
find.

C-07's is the sharper of the two. C-01 *does* show a padlocked **human-rights severity floor of
4** with the rule *"non-compensatory, cannot be disabled"* — so the **floor** exists. The
**override** — the auditable act of departing from a score because of human-rights severity — is
what nothing has yet shown. Settle it from the frozen spec's field list, or by re-shooting C-07
once a methodology is approved.

---

## F-19 · C-01 offers no way to submit the methodology for approval 🟠 `live` {#f-19}

`/modules/esg/mat/config` — the version bar of a `Draft · Version 1` methodology carries
**one button: `Edit draft`.**

Compare B-09 on the same class of object — a draft governed version awaiting sign-off:

| Screen | Version bar |
|---|---|
| B-09 Applicable Standards | Export · Re-resolve · **Submit for review** · Delete draft |
| **C-01 Materiality Configuration** | **Edit draft** |

`MaterialityConfigVersion` **is** enrolled in the Approval Center under `mat-config`, and
`SubmitAsync` exists on the service. The screen just does not offer it. The missing *Delete
draft* matches the unimplemented `DeleteMatConfig` key already recorded as
[F-8](#f-8) — but the missing *Submit* is new and worse.

**Why it matters.** C-07 is gated on it in so many words: *"Approve the methodology first (C-01) —
the scales, the thresholds and the human-rights floor all come from it."* C-11 repeats it. If the
methodology cannot be submitted, it cannot be approved, and **the entire materiality chain stays
shut** — C-07, C-08, C-09, C-11, C-12, C-13 all wait behind it.

**The check that settles it:** open **Edit draft** and look for a submit action inside the form.
- If it is there → this is an inconsistency with B-09, not a blocker. Still worth fixing: a
  reviewer looking at the read-only screen cannot tell the object is submittable.
- If it is not → **this is 🔴 and ranks beside [F-1](#f-1)**. Two independent breaks, both on the
  path to the same frozen topic set.

---

## F-20 · A .NET enum name is rendered to the user 🟠 `live` {#f-20}

`/modules/esg/mat/config`, **Version history** table. The Status cell of `TM-TEST1 v1` reads:

```
Esg.Enum.ApprovalStatus.Draft
```

A missing localisation key, falling back to `ToString()` on the fully-qualified enum. The **same
row** shows a correctly rendered `Draft` pill in its second status column, so the two disagree
with each other in the same row.

It leaks an internal namespace to the user, and it will appear in Arabic too — the fallback has no
language. Worth grepping for the pattern rather than fixing this one cell: wherever one enum lost
its resource key, others likely did.

---

## F-21 · Four tiles read `Not set` where a number belongs 🟡 `live` {#f-21}

Seen across four screens on a tenant where the correct answer is **0**, not "not set":

| Screen | Tile | Sub-text |
|---|---|---|
| AC-01 Approval Center | Overdue | *Waiting on the SLA decision (OI-05)* |
| AC-01 Approval Center | Decided this week | *Decided items are not listed yet* |
| B-06 Cycle Setup Wizard | Steps complete | — |
| B-14 Cycle Readiness | Readiness decision | *Last evaluated 09-Sep-26 2:28 PM* |

Two of them are honest — the Approval Center says outright which open item they are waiting on
(see [F-24](#f-24)). The other two say nothing, so a user cannot tell "nothing to count yet" from
"this tile was never built".

B-14's is the most confusing of the four: the screen has just computed **2 of 7 gates passed** and
**8 blocking items**, then reports its headline decision as `Not set`. Given the screen's own
rule — *"derived on every load … a stored verdict would go stale"* — the tile should read *Not
ready to transition*, which the badge beside it already does.

---

## F-22 · Two adjacent columns share the heading `STATUS` 🟡 `live` {#f-22}

**B-14 Cycle Readiness**, prerequisite gates table: the fourth and fifth columns are both headed
`STATUS`. The first holds an outstanding count (`2 outstanding`), the second a badge
(`Blocking` / `Passed`).

**C-01 Materiality Configuration**, version history: same duplication — `VERSION · STATUS ·
DECIDED · STATUS`.

Two different things under one word, twice. `OUTSTANDING` and `STATE` would do. Trivial to fix
and it makes both tables sortable and translatable without ambiguity.

---

## F-23 · Screen-code chips appear on cycle screens only 🟡 `live` {#f-23}

Every Reporting Cycle screen renders its catalogue code beside the title — `B-05`, `B-06`,
`B-07`, `B-08`, `B-09`, `B-10`, `B-11`, `B-13`, `B-14`.

**No Materiality screen does.** C-01 through C-14 render the title alone.

The codes are how BD-23 makes `EsgScreenCatalog` authoritative, and how these documents, the
`04-screens` specs and the gate tables all refer to screens. The build already shows them on half
the surface. Showing them on the rest costs one partial and makes every support conversation and
every one of these documents directly checkable against the screen.

Note the running app *does* use the codes in materiality **prose** — C-07 says "Approve the
methodology first (C-01)", C-09 says "Assess impacts first (C-07)". So the codes are considered
user-facing already; only the chip is missing.

---

## F-24 · The Approval Center cannot show a decided item 🟠 `live` {#f-24}

`/modules/esg/approvals` — the hub every screen in these documents submits into.

Two of its four tiles are unbuilt, and the screen says so:

| Tile | Renders | Sub-text |
|---|---|---|
| Pending | 0 | |
| **Overdue** | `Not set` | *Waiting on the SLA decision (OI-05)* |
| Awaiting my decision | 0 | |
| **Decided this week** | `Not set` | ***Decided items are not listed yet*** |

The filter set is **All statuses** / **Awaiting my decision** — neither shows history.

**So a decision is write-only from the PM's point of view.** Approve or return an item and the row
leaves the queue with nowhere in AC-01 to see it again — not the decision, not the decider, not
the ≥15-word note that `ApprovalDecisionService` insisted on. The note is the audit trail of the
whole maker-checker design, and the screen that collected it cannot display it back.

`ApprovalQueueItem` stores the decision, so this is a missing view, not missing data.

**Also:** the empty state reads *"Nothing waiting for approval — **every submission has been
decided**."* On a tenant that has never had a submission that sentence is simply false. Two
different empty states are needed — *nothing submitted yet* and *all caught up*.

**Overdue** is blocked on an open decision (OI-05, the SLA rule) rather than on code — that one
needs an answer to *"how long may an approval sit before it is late?"*, not an implementation.
