/* ═══════════════════════════════════════════════════════════════════════════
   ESG OS v14 — 10 · REPORT RENDERER — print/PDF pipeline, claim separation, release
   Extracted verbatim from the single-file build. Classic script: LOAD ORDER
   IS SIGNIFICANT — see the <script> tags in the entry HTML.
   ═══════════════════════════════════════════════════════════════════════════ */
/* ════════════ 10 · REPORT RENDERER — print/PDF pipeline, claim separation, release enforcement ════════════ */


/* Canonical topic-set master record (v6.1 — Report Source Integrity):
   the SAME object the Materiality approval screen displays; the report binds to it */
D.topicSet={version:'v2',status:'FROZEN',by:'Dr. Selim Aziz',date:'12 Jan 2026',gate:'PG-04 PASS'};
/* v8 — remaining report metadata promoted to authoritative objects (no business
   fact is hard-coded inside the report template; it carries layout + controlled wording only) */
D.reportProject={version:'draft v0.7',prepared:'07 Feb 2026',frequency:'Annual'};
D.assuranceEngagement={id:'AE-2026-01',provider:'Verify & Co.',level:'Limited assurance',standards:'ISAE 3000 (Revised) · ISO 14064-3:2019',scope:['305-1','305-2','403-9'],status:'In progress',statusAr:'قيد التنفيذ'};
D.standardSet={gri1:'GRI 1: Foundation 2021',sector:'GRI 14',sectorStatus:'pending confirmation'};
D.restatementsReg=[{id:'RST-2026-001',metric:'Energy intensity FY2024',reason:'Methodology correction',gri:'2-4',st:'open'}];

/* Scope-1 approved run — coherent with PL-001 (COMPLETE, 100%) so the draft report
   binds real run outputs instead of inventing figures inline */
if(!D.runs.some(r=>r.id==='RUN-2212')){
 D.runs.splice(1,0,{id:'RUN-2212',method:'CALC-GHG-S2-MKT v1',inputs:11,factor:'EF-RESIDUAL-EG-2025 v1 + PPA instruments',out:'702.4 tCO2e',at:'2026-02-05 14:12',by:'system',rev:'O. Farid',st:'review',note:'Scope 2 market-based — NEVER aggregated with location-based (DB rule)'});
}
if(!D.runs.some(r=>r.id==='RUN-2231')){
 D.runs.unshift({id:'RUN-2231',method:'CALC-GHG-S1-DIESEL v2',inputs:12,factor:'EF-IPCC-DIESEL-2025 v1',out:'833.6 tCO2e',at:'2026-02-01 10:22',by:'system',rev:'O. Farid',st:'approved',note:'Scope 1 diesel — Jan–Dec · output ≡ approved lineage CV-ENV-GHG-001-FY2025-v3 (an approved run may NEVER contradict the CV/ADV value)'});
}

/* ---------- computed claim model (v6.1) ----------
   STRICT SEPARATION per GRI 1: target intent ≠ current eligibility ≠ stated claim.
   A claim string exists ONLY when its own conditions are met. While ineligible the
   system states NO claim — “in accordance” wording never appears inside a claim
   sentence, and “with reference to” is an INDEPENDENT claim (own conditions,
   governance-elected), never a note inside an in-accordance sentence. */
function claimModel(){const r=reqStats();
 return {met:r,target:D.cycle.intent,eligible:r>=9,
  claim:r>=9?'in accordance with the GRI Standards':null,
  eligLabel:r>=9?(LANG==='ar'?'مؤهل':'ELIGIBLE'):(LANG==='ar'?`غير مؤهل — ${r}/9 متطلبات مستوفاة`:`NOT ELIGIBLE — ${r}/9 requirements met`)}}
/* v8 — P4: RenderMode enforcement (defense-in-depth, not only PG-14/15):
   draft  → render Draft+Review+Approved+Stale, stamping every non-approved object
   release→ Approved only; generation REFUSED while any required section is unapproved */
function renderReportGuard(mode){
 if(mode!=='release')return {refused:false,mode:'draft'};
 const notAppr=D.sections.filter(x=>x.req&&x.st!=='approved');
 return notAppr.length?{refused:true,mode:'release',reasons:notAppr}:{refused:false,mode:'release'}}
function releaseRenderAttempt(){
 const g=renderReportGuard('release');
 if(g.refused){audit('report.render.release','refused',g.reasons.length+' unapproved required sections');
  drawer('🔒 '+(LANG==='ar'?'تصيير الإصدار — مرفوض':'Release render — REFUSED'),
   `<div class="notice err"><b>${LANG==='ar'?'التوليد مرفوض':'Generation refused'}:</b> ${g.reasons.length} ${LANG==='ar'?'أقسام إلزامية غير معتمدة. نسخة الإصدار تطبع المحتوى المعتمد فقط — القاعدة منفذة بالكود، لا بالسياسة وحدها.':'required sections are not Approved. The release render prints approved content only — enforced in code, not by policy alone.'}</div>`+
   g.reasons.map(x=>`<div class="actLine">⏳ <b>${esc(x.id)}</b> — ${esc(x.n)} · ${esc(x.st)} · ${LANG==='ar'?'المالك':'owner'}: <b>${esc(x.owner)}</b></div>`).join('')+
   `<div class="quickRow" style="margin-top:12px">✍️ <a href="#/rpt/rnarr" onclick="closeDrawer()">${LANG==='ar'?'استكمال الأقسام في محرر السرد':'Complete the sections in the Narrative Editor'} →</a></div>`,
   `<button class="btn sec" onclick="closeDrawer()">${t('cancel')}</button>`);return}
 toast(LANG==='ar'?'تصيير الإصدار متاح — كل الأقسام معتمدة':'Release render available — all required sections approved')}
/* v8 — P2: IPageAnchorResolver prototype — measures the actually-rendered document,
   maps each section heading to an estimated printed page, and (in a release render)
   feeds IContentIndexPaginationService to regenerate the index before the final PDF */
function resolvePageAnchors(){
 const PAGE=1056; /* A4 @96dpi content height approximation */
 let out=[],offset=0;
 document.querySelectorAll('#main .pp').forEach(pp=>{
  pp.querySelectorAll('h2').forEach(h=>out.push([h.textContent.replace(/\s+/g,' ').trim().slice(0,44),Math.floor((offset+h.offsetTop)/PAGE)+1]));
  offset+=pp.offsetHeight});
 return out}
function showAnchors(){const a=resolvePageAnchors();audit('report.anchors','resolve',a.length+' anchors (prototype)');
 drawer('⚓ '+(LANG==='ar'?'حل مراسي الصفحات (نموذج)':'Page anchors resolved (prototype)'),
  `<div class="notice info">${LANG==='ar'?'خط التصيير: تصيير ← حل المراسي ← إعادة توليد فهرس المحتوى ← PDF نهائي. في المسودة تُعرض للتحقق فقط ولا تُطبع.':'Pipeline: render → resolve anchors → regenerate the Content Index → final PDF. In a draft they are shown for verification only — never printed.'}</div>
  <table class="tbl"><thead><tr><th>${LANG==='ar'?'القسم':'Section'}</th><th>${LANG==='ar'?'الصفحة (محسوبة)':'Page (measured)'}</th></tr></thead><tbody>
  ${a.map(([n,p])=>`<tr><td>${esc(n)}</td><td><b>p. ${p}</b></td></tr>`).join('')}</tbody></table>`,
  `<button class="btn sec" onclick="closeDrawer()">${t('cancel')}</button>`)}
function pubBlockers(){const locGaps=D.cidx.filter(r=>r.loc==='—').length;
 return {gatesFail:15-gateStats(),reqOut:9-reqStats(),locGaps,stale:D.runs.filter(r=>r.st==='stale').length,
  asrOpen:D.findings.filter(f=>f.src==='Assurance'&&f.st!=='closed').length}}

/* ---------- P-v6.1: the print-ready report ---------- */
/* V13.1 — report layer resolves exclusively through resolveReportBinding() (defined in the engine) */
VIEWS['rpt/print']=()=>{
 const c=D.cycle,cl=claimModel(),b=pubBlockers(),draft=gateStats()<15;
 const inb=D.entities.filter(e=>e.sus),exE=D.entities.find(e=>!e.sus),inS=D.sites.filter(s=>s.inB),acts=[...new Set(inS.map(s=>s.type))];
 const wm=draft?`<div class="wmDraft"><span>DRAFT — ${LANG==='ar'?'غير قابل للنشر':'NOT FOR PUBLICATION'}</span></div>`:'';
 const cv1=cvOf('ENV-GHG-001','FY2025'),cv2=cvOf('ENV-GHG-003','FY2025'),inten=D.runs.find(r=>r.method.includes('INT'))||{id:'—',method:'CALC-ENE-INT (specified)'};
 const secStatus=s=>s.st==='approved'?`<span class="stt" style="color:#067647;border-color:#A6F4C5;background:#ECFDF3">${LANG==='ar'?'معتمد':'approved'}</span>`:s.st==='review'?`<span class="stt" style="color:#B54708;border-color:#FEDF89;background:#FFFAEB">${LANG==='ar'?'قيد المراجعة':'in review'}</span>`:`<span class="stt" style="color:#B42318;border-color:#FECDCA;background:#FEF3F2">${esc(s.st)}</span>`;
 const pend=(s)=>`<div class="pendBox">⏳ <b>${LANG==='ar'?'لا يوجد محتوى مسودة بعد':'No drafted content yet'}</b> — ${esc(s.n)} · ${t('status')}: ${esc(s.st)} · ${LANG==='ar'?'المالك':'owner'}: <b>${esc(s.owner)}</b>. ${LANG==='ar'?'يُكتب في محرر السرد (F-03). سياسة الطباعة: المسودة تطبع المحتوى غير المعتمد بختم حالته؛ نسخة الإصدار تطبع المعتمد فقط.':'Authored in the Narrative Editor (F-03). Print policy: a draft prints unapproved content with a status stamp; the release render prints approved content only.'}</div>`;
 return `
 <div class="printBar"><b>🖨 ${LANG==='ar'?'مسودة جاهزة للطباعة':'Print-ready draft'}</b>
  <span class="st ${draft?'warn':'ok'}">${draft?(LANG==='ar'?'مسودة · '+gateStats()+'/15 بوابة':'DRAFT · '+gateStats()+'/15 gates'):'RELEASE'}</span>
  <span style="font-size:12px;color:var(--mut)" title="${LANG==='ar'?'سياسة الطباعة: المسودة تطبع المحتوى غير المعتمد بختم حالته الظاهر؛ نسخة الإصدار تطبع المحتوى المعتمد فقط.':'Print policy: a DRAFT prints unapproved content WITH a visible status stamp; a RELEASE render prints approved content only.'}">${LANG==='ar'?'سياسة: مسودة = محتوى بختم حالته · إصدار = معتمد فقط':'Policy: draft = stamped content · release = approved only'} ⓘ</span>
  <span style="font-size:12px;color:var(--mut)">${LANG==='ar'?'كل طباعة تُسجل في سجل المراجعة':'Every print is recorded in the audit log'}</span><span class="sp"></span>
  <button class="btn sec" onclick="saveAsMenu()">⬇ ${LANG==='ar'?'حفظ باسم':'Save As'}</button>
  <button class="btn sec" onclick="showAnchors()" title="IPageAnchorResolver prototype">⚓ ${LANG==='ar'?'حل المراسي':'Anchors'}</button>
  <button class="btn sec" onclick="releaseRenderAttempt()" title="RenderMode=release — refuses while required sections are unapproved">🔒 ${LANG==='ar'?'تصيير الإصدار':'Release render'}</button>
  <button class="btn sec" onclick="nav('rpt/rexp')">← ${t('rexp')}</button>
  <button class="btn" onclick="audit('report.print',D.cycle.code,D.reportProject.version+' · '+gateStats()+'/15');window.print()">🖨 ${LANG==='ar'?'طباعة / PDF':'Print / PDF'}</button></div>

 <div class="pp">${wm}
  <div class="covBrand"><div class="sbLogo" style="padding:0"><div class="globe"></div><div class="wm"><b>ENERGYUP</b><span>INTERNATIONAL</span></div></div></div>
  <div style="font-size:12px;letter-spacing:3px;color:#667085;font-family:Inter,'Segoe UI',sans-serif">SUSTAINABILITY REPORT</div>
  <h1 style="font-size:32px;margin-top:8px">${esc(D.org.name)}</h1>
  <div style="font-size:18px;color:#287870;font-weight:700">${esc(c.name)}</div>
  <div style="margin-top:10px;font-size:14px;color:#475467">${LANG==='ar'?'فترة التقرير':'Reporting period'}: ${esc(c.period)}</div>
  ${draft?`<div class="notPub"><b>${LANG==='ar'?'غير قابل للنشر':'Not for publication'}.</b> ${b.gatesFail} ${LANG==='ar'?'بوابة فاشلة':'gates failing'} · ${b.reqOut} ${LANG==='ar'?'متطلبات GRI متبقية':'GRI requirements outstanding'} · ${b.asrOpen} ${LANG==='ar'?'ملاحظة تأكيد مفتوحة':'open assurance finding(s)'} — ${LANG==='ar'?'راجع بوابة النشر':'see the Publication Gate'}.</div>`:''}
  <div class="covMeta">
   <span>${LANG==='ar'?'هدف التقرير':'Target reporting intent'}</span><b>${esc(cl.target)}</b>
   <span>${LANG==='ar'?'الأهلية الحالية':'Current eligibility'}</span><b style="${cl.eligible?'':'color:#B54708'}">${cl.eligLabel}</b>
   <span>${LANG==='ar'?'الادعاء المعلن':'Stated claim'}</span><b>${cl.claim?esc(cl.claim):(LANG==='ar'?'لا يوجد — لا يجوز إعلان ادعاء قبل الأهلية':'NONE — no claim may be stated before eligibility')}</b>
   <span>${LANG==='ar'?'التأكيد الخارجي':'External assurance'}</span><b>${esc(D.assuranceEngagement.provider)} — ${LANG==='ar'?D.assuranceEngagement.statusAr:D.assuranceEngagement.status.toLowerCase()}</b>
   <span>${LANG==='ar'?'النشر المستهدف':'Target publication'}</span><b>${esc(c.pub)}</b>
   <span>${LANG==='ar'?'أُعدت':'Prepared'}</span><b>${esc(D.reportProject.prepared)} · ${esc(D.reportProject.version)} · ${roleName()}</b>
  </div></div>

 <div class="pp">${wm}
  <h2>${LANG==='ar'?'بيان الاستخدام':'Statement of use'}</h2>
  <table><tbody>
  <tr><td style="width:210px"><b>${LANG==='ar'?'هدف التقرير':'Target reporting intent'}</b></td><td><span class="tokv" title="from Cycle — D.cycle.intent">${esc(cl.target)}</span></td></tr>
  <tr><td><b>${LANG==='ar'?'الأهلية الحالية':'Current eligibility'}</b></td><td><span class="${cl.eligible?'tokv':'tokw'}" title="claim engine — reqStats()">${cl.eligLabel}</span></td></tr>
  </tbody></table>
  ${cl.claim
   ?`<p>${esc(D.org.name)} has reported <b class="tokv">${esc(cl.claim)}</b> for the period ${esc(D.cycle.period)}.</p>`
   :`<p>${esc(D.org.name)} has reported <b class="tokw">[${LANG==='ar'?'الادعاء معلق — لا يجوز إعلان أي ادعاء عند':'claim pending — no claim may be stated at'} ${cl.met}/9]</b> for the period ${esc(D.cycle.period)}.</p>`}
  <p class="fn">${esc(D.standardSet.gri1)} · ${LANG==='ar'?'معيار القطاع المنطبق':'Applicable sector standard'}: ${esc(D.standardSet.sector)} (${LANG==='ar'?'بانتظار التثبيت':esc(D.standardSet.sectorStatus)}) · ${LANG==='ar'?'يُشتق هذا النص من محرك الادعاء ولا يُكتب يدويًا':'This text resolves from the claim engine — it is never typed'} (E-11). ${LANG==='ar'?'ادعاء «بالإشارة إلى معايير GRI» ادعاء مستقل بشروطه الخاصة تقرره الحوكمة — لا يُطبع أبدًا كملاحظة داخل جملة in accordance.':'A “with reference to the GRI Standards” claim is an independent claim with its own conditions, elected by governance — it is never printed as a note inside an in-accordance sentence.'}</p>

  <h2>${LANG==='ar'?'جدول المحتويات':'Table of contents'}</h2>
  ${D.sections.map(s=>`<div class="tocLn" style="padding-inline-start:${s.lvl*18}px"><span>${esc(s.id)} — ${esc(s.n)}</span><span class="dots"></span>${secStatus(s)}</div>`).join('')}

  <h2>1 · About this report <span class="fn">(GRI 2-2, 2-3, 2-4, 2-5)</span></h2>
  <p>This report covers the period <b class="tokv" title="D.cycle.period">${esc(c.period)}</b> for the reporting cycle <b class="tokv">${esc(c.code)}</b>. Reporting frequency: <b class="tokv" title="D.reportProject.frequency">${esc(D.reportProject.frequency.toLowerCase())}</b>. Contact point for questions: <b class="tokv" title="D.org.contact">${esc(D.org.contact)}</b>. The sustainability reporting boundary comprises <b class="tokv" title="D.entities · sus flag">${inb.length} of ${D.entities.length}</b> legal entities and <b class="tokv" title="D.sites · inB flag">${inS.length} of ${D.sites.length}</b> sites in <b class="tokv">${[...new Set(inS.map(s=>s.ctry))].length}</b> countries; the exclusion of <b class="tokv">${exE?esc(exE.id):'—'}</b> carries a documented rationale${exE&&exE.diff?` (<span class="fn">${esc(exE.diff)}</span>)`:''} (B-07).</p>
  <p><b>${LANG==='ar'?'إعادة العرض':'Restatements'} (GRI 2-4):</b> ${D.restatementsReg.map(r=>`<b class="tokv" title="D.restatementsReg">${esc(r.metric)}</b> is being restated under <b class="tokv">${esc(r.id)}</b> (${esc(r.reason.toLowerCase())})`).join('; ')}; both values will be presented with the reason for restatement.</p>
  <p><b>${LANG==='ar'?'التأكيد':'Assurance'} (GRI 2-5):</b> <b class="tokv" title="D.assuranceEngagement">${esc(D.assuranceEngagement.level)}</b> engagement with <b class="tokv">${esc(D.assuranceEngagement.provider)}</b> is ${esc(D.assuranceEngagement.status.toLowerCase())} — see §8.</p>

  <h2>2 · Organization profile <span class="fn">(GRI 2-1, 2-6)</span></h2>
  <p><b class="tokv" title="D.org.name">${esc(D.org.name)}</b> — <span class="tokv" title="D.org.form">${esc(D.org.form)}</span> headquartered in <span class="tokv" title="D.org.hq">${esc(D.org.hq)}</span> — operates <span class="tokv" title="derived: D.sites in-boundary types">${acts.map(a=>esc(a.toLowerCase())).join(', ')}</span> activities across <span class="tokv" title="derived: D.sites in-boundary countries">${[...new Set(inS.map(s=>s.ctry))].join(', ')}</span>. Details, ownership and value-chain description are maintained as approved master data (A-02…A-05) and rendered here from the approved versions (org profile v${D.org.version}).</p>

  ${pend(D.sections.find(s=>s.id==='S3'))}

  <h2>4 · Stakeholders &amp; materiality <span class="fn">(GRI 3-1, 3-2)</span></h2>
  <p>${LANG==='ar'?'حُددت الموضوعات الجوهرية عبر عملية التقييم المضبوطة (C-01→C-12): سياق ← تأثيرات ← تقييم شدة واحتمال ← عتبة ← اعتماد حوكمة.':'Material topics were determined through the controlled assessment process (C-01→C-12): context → impacts → severity/likelihood scoring → threshold → governance approval.'} ${D.impacts.length} impacts assessed; ${D.topics.length} topics approved as material (<b class="tokv" title="D.topicSet — same object the Materiality workspace shows">set ${esc(D.topicSet.version)}, ${esc(D.topicSet.status)}</b> · ${esc(D.topicSet.by)} · ${esc(D.topicSet.date)}).</p>
  <table><thead><tr><th>#</th><th>${LANG==='ar'?'الموضوع الجوهري':'Material topic'}</th><th>${LANG==='ar'?'الركيزة':'Pillar'}</th><th>${LANG==='ar'?'معايير GRI':'GRI standards'}</th></tr></thead><tbody>
  ${D.topics.map(mt=>`<tr><td>${esc(mt.id)}</td><td>${esc(mt.n)}</td><td>${mt.p}</td><td>${esc(mt.gri)}</td></tr>`).join('')}</tbody></table>
  <p class="fn">${LANG==='ar'?'الموضوعات المستبعدة وأسبابها':'Topics assessed and excluded, with reasons'}: ${D.excluded.map(x=>`<b>${esc(x.n)}</b> — ${esc(x.reason)}`).join(' · ')}</p>

  <h2>5.1 · Climate &amp; energy <span class="fn">(GRI 302, 305 · MT-01/02 · 3-3)</span></h2>
  ${(()=>{const s51=D.sections.find(s=>s.id==='S5.1');return s51&&s51.st!=='approved'?`<div class="notPub" style="border-color:#FEDF89;background:#FFFAEB;color:#B54708"><b>${LANG==='ar'?'محتوى مسودة':'DRAFT CONTENT'}</b> — ${LANG==='ar'?'حالة القسم':'section status'}: <b>${esc(s51.st).toUpperCase()}</b> · ${LANG==='ar'?'يُطبع في المسودة فقط بختم حالته؛ يُستبعد من نسخة الإصدار حتى الاعتماد.':'prints in a draft only, carrying this stamp; excluded from the release render until approved.'}</div>`:''})()}
  <p>In FY2025, direct (Scope 1) GHG emissions were ${bindFact('RB-001','tCO₂e')} and location-based energy-indirect (Scope 2) emissions were ${bindFact('RB-002','tCO₂e')} (market-based ${bindFact('RB-003','tCO₂e')} — never aggregated). Energy intensity is pending restatement <b class="tokv" title="D.restatementsReg">${esc(D.restatementsReg[0].id)}</b> <span class="tokw" title="EXAMPLE — restatement flow demo, not an approved business value">(EXAMPLE)</span>.</p>
  <table><thead><tr><th>${LANG==='ar'?'الإفصاح':'Disclosure'}</th><th>${LANG==='ar'?'القيمة':'Value'}</th><th>${LANG==='ar'?'الأساس':'Basis'}</th><th>${t('status')}</th></tr></thead><tbody>
  <tr><td>GRI 305-1 · Scope 1</td><td>${bindFact('RB-001','tCO₂e')}</td><td class="fn" data-noar>lineage: ${cv1?esc(cv1.id)+' · '+esc(cv1.methodVer)+' · '+esc(cv1.factorVersionIds.join(', '))+' · '+cv1.inputs+' records':'—'} → ${resolveReportBinding('RB-001').approvedVersionId||''} <span title="CV.output ≡ ADV.value — enforced (TC-INT-15)">≡</span></td><td>Approved 🔒</td></tr>
  <tr><td>GRI 305-2 · Scope 2 (location-based)</td><td>${bindFact('RB-002','tCO₂e')}</td><td class="fn" data-noar>lineage: ${cv2?esc(cv2.id)+' · '+esc(cv2.methodVer)+' · '+esc(cv2.factorVersionIds.join(', '))+' · '+cv2.inputs+' records':'—'} → ${resolveReportBinding('RB-002').approvedVersionId||''} <span title="CV.output ≡ ADV.value — enforced (TC-INT-15)">≡</span></td><td>${advStale('ENV-GHG-003','FY2025')?'⚠ '+(LANG==='ar'?'Stale — سجل معدل بعد الاعتماد':'Stale — record edited after approval'):'Approved 🔒'}</td></tr>
  <tr><td>GRI 305-2 · Scope 2 (market-based)</td><td>${bindFact('RB-003','tCO₂e')}</td><td class="fn" data-noar>lineage: ${(r0=>r0&&Math.abs(parseFloat(String(r0.out).replace(/,/g,''))-(advGet('ENV-GHG-004','FY2025')||{}).v)<0.05?esc(r0.id)+' · ':'')(D.runs.find(r=>r.method.includes('MKT')))}residual mix + contractual instruments → ${resolveReportBinding('RB-003').approvedVersionId||''}</td><td>Approved 🔒</td></tr>
  <tr><td>GRI 302-3 · Energy intensity</td><td><b class="tokw" title="No ApprovedDatapointVersion yet (restatement RST-2026-001 open) — release refuses this row">PENDING RESTATEMENT</b></td><td class="fn">lineage: ${esc(inten.id)} · ${esc(inten.method)} — binding: SPECIFIED, NOT YET BOUND</td><td>⚠ ${LANG==='ar'?'بانتظار إعادة العرض':'Awaiting restatement'}</td></tr>
  </tbody></table>
  <p class="fn" style="margin:8px 0 4px">${LANG==='ar'?'سلسلة السنوات المعتمدة — كل خلية مربوطة بمسقط Approved Fact (لا رقم مكتوب):':'Approved multi-year series — every cell binds the Approved-Fact projection (no typed figure):'}</p>
  <table><thead><tr><th>KPI</th><th>FY2023</th><th>FY2024</th><th>FY2025</th></tr></thead><tbody>
  ${['ENV-GHG-001','ENV-GHG-003','ENV-GHG-004'].map(id=>{const f=factOf(id);const k=kpiById(id);return `<tr><td class="fn">${esc(k.en)} (${esc(k.g.split('—')[1]||'')})</td><td>${f.fy23}</td><td>${f.fy24}</td><td>${bindFact(id)}</td></tr>`}).join('')}
  </tbody></table>
  <p class="fn"><b>${LANG==='ar'?'قاعدة النطاق الثاني المزدوج':'Dual Scope-2 rule'}:</b> ${LANG==='ar'?'القيمتان تُعرضان منفصلتين ولا تُجمعان ولا تُتوسطان مطلقًا — المنع على مستوى قاعدة البيانات.':'the two values are presented separately and are never summed or averaged — prevented at database level.'}</p>
  <p class="fn">${LANG==='ar'?'كل قيمة مطبوعة مربوطة بتشغيل حساب مجمّد الإصدار — افتح Calculation Runs & Lineage للسلسلة الكاملة حتى الدليل.':'Every printed calculated value is bound to an immutable CalculationVersion whose output equals the approved value (CV.output ≡ ADV.value ≡ this cell) — open Calculation Runs & Lineage for the chain down to evidence.'}</p>

  ${D.sections.filter(s=>['S5.2','S5.3','S5.4','S5.5'].includes(s.id)).map(pend).join('')}
 </div>

 <div class="pp">${wm}
  <h2>6 · GRI Content Index</h2>
  <p class="fn">Statement of use — ${LANG==='ar'?'كما في القسم أعلاه (محسوب)':'as per the section above (computed)'} · ${esc(D.standardSet.gri1)} · Sector: ${esc(D.standardSet.sector)} (${LANG==='ar'?'مشروط':esc(D.standardSet.sectorStatus)}).</p>
  <table><thead><tr><th>${LANG==='ar'?'المعيار':'Standard'}</th><th>${LANG==='ar'?'الإفصاح':'Disclosure'}</th><th>${LANG==='ar'?'العنوان':'Title'}</th><th>${LANG==='ar'?'الموقع':'Location'}</th><th>${LANG==='ar'?'حذف':'Omission'}</th></tr></thead><tbody>
  ${D.cidx.map(r=>{const loc=r.loc==='—'?`<span style="color:#B42318">${LANG==='ar'?'فجوة':'gap'}</span>`:r.loc==='omitted'?esc(r.loc):draft?`${esc(r.loc.replace(/\s*p\.\d+/,''))} · <span style="color:#B54708">${LANG==='ar'?'صفحة معلقة':'p. pending'}</span>`:esc(r.loc);
  return `<tr><td class="fn">${esc(r.std)}</td><td><b>${esc(r.dis)}</b></td><td>${esc(r.t)}</td><td>${loc}</td><td class="fn">${r.st==='omission'?esc(r.note):'—'}</td></tr>`}).join('')}</tbody></table>
  <p class="fn">${LANG==='ar'?'أرقام الصفحات لا تُطبع في المسودة — تُثبت في خط التصيير النهائي: تصيير ← حل مراسي الصفحات ← إعادة توليد فهرس المحتوى ← PDF نهائي.':'Page numbers are never printed in a draft — they resolve in the final render pipeline: render → resolve page anchors → regenerate the Content Index → final PDF.'}</p>

  <h2>7 · ${LANG==='ar'?'ملحق الحذف':'Omissions annex'} <span class="fn">(GRI 1 — ${LANG==='ar'?'الأسباب الأربعة المسموح بها فقط':'only the four permitted reasons'})</span></h2>
  <table><thead><tr><th>${LANG==='ar'?'الإفصاح':'Disclosure'}</th><th>${LANG==='ar'?'المتطلب':'Requirement'}</th><th>${LANG==='ar'?'السبب':'Reason'}</th><th>${LANG==='ar'?'التفسير':'Explanation'}</th><th>${t('status')}</th></tr></thead><tbody>
  ${D.omissions.map(o=>`<tr><td><b>${esc(o.dis)}</b></td><td>${esc(o.req)}</td><td>${esc(o.reason)}</td><td class="fn">${esc(o.expl)}${o.steps?`<br><b>${LANG==='ar'?'الخطوات':'Steps'}:</b> ${esc(o.steps)} (${esc(o.due)})`:''}</td><td>${o.st==='approved'?'🔒 '+esc(o.appr):esc(o.st)}</td></tr>`).join('')}</tbody></table>

  <h2>8 · ${LANG==='ar'?'التأكيد الخارجي':'External assurance'} <span class="fn">(GRI 2-5)</span></h2>
  <p>${LANG==='ar'?'ارتباط '+D.assuranceEngagement.level+' مع':D.assuranceEngagement.level+' engagement with'} <b class="tokv" title="D.assuranceEngagement">${esc(D.assuranceEngagement.provider)}</b> (${esc(D.assuranceEngagement.standards)}) — ${LANG==='ar'?'العينات مفتوحة على':'sampling open on'} ${D.assuranceEngagement.scope.join('/')}. ${D.findings.filter(f=>f.src==='Assurance').length} ${LANG==='ar'?'ملاحظات مسجلة':'finding(s) recorded'}; ${pubBlockers().asrOpen} ${LANG==='ar'?'تُعد مفتوحة حتى التحقق المستقل من الإغلاق':'counted OPEN until closure is independently verified'} (Open → Remediation → Resolved by client → Awaiting verification → Closed).</p>
  <div class="pendBox">📜 ${LANG==='ar'?'يُدرج بيان التأكيد الموقع هنا آليًا عند الإصدار — لا يُطبع قبل استنتاج مزود التأكيد.':'The signed assurance statement is inserted here automatically at release — never printed before the provider’s conclusion.'}</div>
  <p class="fn" style="margin-top:26px;border-top:1px solid #EAECF0;padding-top:10px">${LANG==='ar'?'وُلدت هذه المسودة من النظام':'Draft generated from the system'} — ${esc(c.code)} · ${esc(D.reportProject.version)} · ${esc(D.reportProject.prepared)} · ${LANG==='ar'?'مسجلة في سجل المراجعة':'recorded in the audit log'} · ${gateStats()}/15 gates · ${reqStats()}/9 requirements.</p>
 </div>`};

/* ---------- P-v6.2: wire the journey into it (no dead ends) ---------- */

/* ---------- P-v6.3: computed Statement of Use + Release (no hard-coded figures) ---------- */
VIEWS['rev/sou']=()=>{const cl=claimModel(),r=reqStats();
 return pageHead(t('sou'),LANG==='ar'?'نص مضبوط — يجمعه تسلسل الادعاء، تعتمده الحوكمة، ويُقفل على الادعاء النهائي.':'Controlled text — assembled by the claim sequence, approved by governance, locked to the final claim.','','Compliance › Statement of Use (E-11)')+
 `<div class="card"><div class="bd" style="font-size:14px;line-height:1.9;background:#fbfdfd">
 <div style="display:flex;gap:26px;flex-wrap:wrap;margin-bottom:12px;font-size:13px;font-family:Inter,'Segoe UI',sans-serif">
 <span>${LANG==='ar'?'هدف التقرير':'Target reporting intent'}: <b>${esc(cl.target)}</b> ${pv('reuse',LANG==='ar'?'من الدورة':'from Cycle','#/org/cycles')}</span>
 <span>${LANG==='ar'?'الأهلية الحالية':'Current eligibility'}: <b style="color:var(--warn)">${cl.eligLabel}</b> ${pv('der',LANG==='ar'?'من محرك الادعاء':'from claim engine','#/rev/claim')}</span>
 <span>${LANG==='ar'?'الادعاء المعلن':'Stated claim'}: <b>${cl.claim?esc(cl.claim):(LANG==='ar'?'لا يوجد':'NONE')}</b></span></div>
 “<b>${esc(D.org.name)}</b> ${pv('reuse',LANG==='ar'?'من المنظمة':'from Organization','#/org/profile')} has reported <b style="color:var(--warn)">[${cl.claim?esc(cl.claim):(LANG==='ar'?'الادعاء معلق — لا يجوز إعلان أي ادعاء عند':'claim pending — no claim may be stated at')+' '+cl.met+'/9'}]</b> for the period <b>${esc(D.cycle.period)}</b> ${pv('reuse',LANG==='ar'?'من الدورة':'from Cycle','#/org/cycles')}. ${esc(D.standardSet.gri1)} applies. Applicable sector standard: <i>${esc(D.standardSet.sector)} (${esc(D.standardSet.sectorStatus)})</i>.”
 </div>
 <div class="bd" style="border-top:1px solid var(--line2);font-size:12.5px;color:var(--mut)">
 ${LANG==='ar'?'الأهلية الآن':'Eligibility today'}: <b>${r}/9</b> — ${LANG==='ar'?'«وفقًا لمعايير GRI» تتطلب 9/9؛ «بالإشارة إلى معايير GRI» متاحة كصياغة بديلة إذا قررت الحوكمة عدم استكمال المتطلبات.':'“in accordance” requires 9/9; “with reference to the GRI Standards” remains the permitted fallback wording if governance elects not to complete the requirements.'}
 <a href="#/rev/claim">${LANG==='ar'?'فتح تحديد الادعاء':'Open Claim Determination'} →</a></div>
 <div style="display:flex;justify-content:flex-end;gap:8px;padding:12px 16px;border-top:1px solid var(--line2)"><button class="btn" ${r<9?'disabled title="Enabled when the claim sequence resolves 9/9"':''} onclick="audit('sou.lock','cycle','claim locked');toast('Locked')">${LANG==='ar'?'اعتماد وقفل':'Approve & lock'}</button></div></div>`};
VIEWS['rpt/release']=()=>{const b=pubBlockers(),cl=claimModel();
 return pageHead(t('release'),LANG==='ar'?'سطح القرار النهائي: لقطة، قفل، والباب الوحيد للعودة هو إعادة العرض.':'The final decision surface: snapshot, lock, and the only door back in is a restatement.','','Report › Release (F-16)')+
 `<div class="notice err"><b>${LANG==='ar'?'الإصدار محجوب':'Release blocked'}:</b> ${b.gatesFail} ${LANG==='ar'?'بوابة فاشلة':'gates failing'} · ${LANG==='ar'?'الادعاء غير مؤهل':'claim not eligible'} (${reqStats()}/9) · ${b.asrOpen} ${LANG==='ar'?'ملاحظة تأكيد مفتوحة':'open assurance finding(s)'}. ${LANG==='ar'?'زر النشر غير مخفي — معطل بأسباب، لكل سبب مالك.':'The Publish button is not hidden — it is disabled with reasons, each carrying an owner.'}</div>
 <div class="card"><div class="bd kv">
 <dt>${LANG==='ar'?'نسخة التقرير':'Report version'}</dt><dd>${esc(D.reportProject.version)}</dd>
 <dt>${LANG==='ar'?'فهرس المحتوى':'Content index'}</dt><dd>v4 · ${b.locGaps} ${LANG==='ar'?'فجوات موقع':'location gaps'}</dd>
 <dt>${LANG==='ar'?'بيان الاستخدام':'Statement of use'}</dt><dd>${reqStats()<9?(LANG==='ar'?'بانتظار الادعاء':'pending claim'):'ready'}</dd>
 <dt>${LANG==='ar'?'التأكيد':'Assurance'}</dt><dd>${b.asrOpen} ${LANG==='ar'?'ملاحظة قيد الحل':'finding resolving'}</dd>
 <dt>${LANG==='ar'?'البوابات':'Gates'}</dt><dd>${gateStats()}/15</dd>
 <dt>On publish ⚙</dt><dd style="font-weight:400">Immutable snapshot (render + index + statement + claim + gate results + data versions) → period lock (D-14) → GRI notification record check (Req 9) → archive.</dd></div>
 <div style="display:flex;gap:8px;justify-content:flex-end;padding:12px 16px;border-top:1px solid var(--line2)">
 <button class="btn sec" onclick="notifyGriForm()">${D.notifyGRI?'✅':'📮'} ${LANG==='ar'?'إخطار GRI (المتطلب 9)':'Notify GRI (Req 9)'}</button>
 <button class="btn sec" onclick="nav('rpt/print')">🖨 ${LANG==='ar'?'نسخة الطباعة':'Print view'}</button>
 <button class="btn" disabled title="${b.gatesFail} gates failing">🚀 ${LANG==='ar'?'نشر وقفل':'Publish & lock'}</button></div></div>`};

/* ---------- nav + guide ---------- */

