/* ═══════════════════════════════════════════════════════════════════════════
   ESG OS v14 — 1 · CONFIG — normative workflow configuration
   Extracted verbatim from the single-file build. Classic script: LOAD ORDER
   IS SIGNIFICANT — see the <script> tags in the entry HTML.
   ═══════════════════════════════════════════════════════════════════════════ */
/* ════════════ 1 · CONFIG — normative workflow configuration ════════════
   Source: REQ09_workflow_engine_config.json v1.0 (25 Jul 2026) — adopted verbatim
   as the engine's configuration. States, gates, claim checks, the omission
   catalogue, SoD rules and prohibited-claim patterns are DATA, never code.
   The claim below is COMPUTED from CONFIG.CE — reqStats() reads it; nothing
   in any view stores a requirement status by hand. */
const CONFIG={
 source:'REQ-09 v1.0 · normative basis: GRI 1: Foundation 2021 §3–4 + App.1',
 cycleStates:['Draft','Scoping','Materiality','Data Collection','Internal Review','Assurance Readiness','Assurance','Finding Remediation','Executive Approval','Reporting','Published','Locked','Reopened','Cancelled'],
 disclosureStates:['Not Started','Out of Scope','Data Requested','In Progress','Submitted','Under Department Review','Returned for Correction','Department Approved','Under ESG Review','Omission Requested','Omission Approved','Omission Rejected','Approved','Assurance Review','Finding Raised','Closed','Locked','Restated'],
 stageGates:[
  {id:'G0',n:'Cycle Setup',ov:false,crit:'Period valid · ≥1 entity · consolidation approach (2-2-c) · contact (2-3) · no SoD conflict'},
  {id:'G1',n:'Scope',ov:true,crit:'GRI 1 snapshot frozen · sector determination · GRI 2 set instantiated · boundary version-stamped'},
  {id:'G2',n:'Materiality Approval',ov:false,crit:'Impacts assessed · threshold + rationale · HR severity priority · every sector topic decided WITH explanation · 2-14 recorded'},
  {id:'G3',n:'Internal Review',ov:true,crit:'Zero unresolved disclosures · omissions decided · zero blocking errors · evidence coverage ≥ minimum'},
  {id:'G4',n:'Assurance Readiness',ov:false,crit:'Hash-stamped snapshot · read-only · scope per disclosure · provider entity ≠ preparer entity'},
  {id:'G5',n:'Governance Approval',ov:false,crit:'Findings closed/accepted · assurance statement (or "not assured") · approver identity+role+date'},
  {id:'G6',n:'Claim',ov:false,crit:'All nine CE checks TRUE — else the system forces "with reference"; NEVER overridable'},
  {id:'G7',n:'Publication & Lock',ov:false,crit:'Report archived · GRI notification evidence stored (Req 9) · content index published · audit log complete'}],
 /* Claim engine — each check carries an evaluator over live state (demo predicates
    mirror the Acme FY2025 story); severity Blocking unless noted */
 CE:[
  {id:'CE-1',n:'Requirement 1 — Apply the reporting principles',ev:()=>({pass:D.principlesSigned>=8,d:D.principlesSigned+'/8 principles signed with evidence refs'})},
  {id:'CE-2',n:'Requirement 2 — Report all GRI 2 disclosures',ev:()=>{const gap=D.cidx.filter(r=>r.std.startsWith('GRI 2')&&r.st==='gap').length;return {pass:gap===0,d:gap?gap+' GRI 2 gap open (2-8 → FND-2025-0004) · 1 valid omission (2-21)':'complete'}}},
  {id:'CE-3',n:'Requirement 3 — Determine material topics',ev:()=>({pass:D.topicSet.status==='FROZEN',d:'Topic set '+D.topicSet.version+' '+D.topicSet.status+' · '+D.topicSet.by+' · sector reconciliation complete'})},
  {id:'CE-4',n:'Requirement 4 — Report GRI 3-1, 3-2, 3-3',ev:()=>({pass:D.topics.every(t=>t.st==='approved'),d:D.topics.length+'/'+D.topics.length+' topics carry complete 3-3 records'})},
  {id:'CE-5',n:'Requirement 5 — Topic disclosures per material topic',ev:()=>{const open=D.plan.filter(r=>r.st!=='COMPLETE').length;return {pass:open===0,d:open+' plan rows not yet complete (302-1 · 303-3 · 403-9 …)'}}},
  {id:'CE-6',n:'Requirement 6 — Reasons for omission',ev:()=>{const und=D.omissions.filter(o=>o.st!=='approved').length;return {pass:und===0,d:und?und+' omission awaiting decision (303-5 · RFO-04)':'all decided'}}},
  {id:'CE-7',n:'Requirement 7 — Publish a GRI content index',ev:()=>{const gaps=D.cidx.filter(r=>r.loc==='—').length;return {pass:gaps===0,d:gaps+' rows missing a report location (PG-13)'}}},
  {id:'CE-8',n:'Requirement 8 — Statement of use',ev:()=>({pass:false,d:'resolves from this engine after CE-1…7 — never typed, never a dropdown'})},
  {id:'CE-9',n:'Requirement 9 — Notify GRI',ev:()=>({pass:!!D.notifyGRI,d:D.notifyGRI?('evidence stored '+D.notifyGRI.date):'notification evidence not stored — BLOCKS period lock (G7), not publication'})},
  {id:'CE-X1',n:'Integrity — no self-approval',x:1,ev:()=>({pass:true,d:'audit scan: 0 disclosures approved by their own preparer (SOD-01/02/03 enforced on user_id)'})},
  {id:'CE-X2',n:'Integrity — omission ratio',x:1,warn:1,ev:()=>{const r=Math.round(D.omissions.length/D.cidx.length*100);return {pass:r<=10,d:'ratio '+r+'% of applicable disclosures (threshold 10% · OI-03) · 0 on material-topic disclosures'}}},
  {id:'CE-X3',n:'Prohibited-claim scan',x:1,ev:()=>{const txt=D.sections.map(s=>s.n).join(' ');const hit=CONFIG.prohibited.find(p=>txt.includes(p));return {pass:!hit,d:hit?('HARD FAIL — pattern "'+hit+'"'):'report + UI clean of certification/approval/rating wording (EN+AR patterns)'}}}],
 RFO:[
  {code:'RFO-01',r:'Not applicable',v:'≥20 words; "not applicable" alone rejected; must cite the organizational characteristic or impact rationale'},
  {code:'RFO-02',r:'Legal prohibitions',v:'statutory reference mandatory; "local law" rejected; supporting document required'},
  {code:'RFO-03',r:'Confidentiality constraints',v:'specific constraint + internal decision ref; not usable on quantitative environmental totals without executive override'},
  {code:'RFO-04',r:'Information unavailable / incomplete',v:'5 sub-fields mandatory (what · which part · why · steps · expected date) → auto Action Plan owned by the Data Owner, carried to the next cycle'}],
 omissionBlocked:['2-1','2-2','2-3','2-4','2-5','3-1','3-2'],
 prohibited:['GRI certified','GRI-certified','certified by GRI','GRI approved','GRI rating','GRI compliance certificate','GRI accreditation','GRI verified','معتمد من GRI','شهادة GRI'],
 SOD:[
  ['SOD-01','Submitter ≠ reviewer','user_id'],['SOD-02','Reviewer ≠ Data Owner of the same disclosure','user_id'],
  ['SOD-03','Technical reviewer ∉ {submitter, dept reviewer}','user_id'],['SOD-04','Assurance provider: read-only + findings only','permission'],
  ['SOD-06','Preparer entity ≠ assurance-provider entity (same cycle)','legal entity'],['SOD-08','Small-org override: executive approval, printed permanently in the audit pack','governed exception']],
 restatementTriggers:['BOUNDARY_CHANGE','METHODOLOGY_CHANGE','ERROR_CORRECTION','STRUCTURAL_CHANGE','PERIOD_LENGTH_CHANGE','RECLASSIFICATION','ESTIMATE_REPLACED_BY_ACTUAL'],
 stmt:{inAcc:'[Legal name] has reported in accordance with the GRI Standards for the period [start] to [end].',
       withRef:'[Legal name] has reported the information cited in this GRI content index for the period [start] to [end] with reference to the GRI Standards.'}
};


