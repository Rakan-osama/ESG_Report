/* ═══════════════════════════════════════════════════════════════════════════
   ESG OS v14 — 11 · MANAGEMENT DASHBOARD & ANALYTICS
   Extracted verbatim from the single-file build. Classic script: LOAD ORDER
   IS SIGNIFICANT — see the <script> tags in the entry HTML.
   ═══════════════════════════════════════════════════════════════════════════ */
/* ════════════ 11 · MANAGEMENT DASHBOARD & ANALYTICS ════════════ */

/* status palette — validated (validate_palette.js: ALL CHECKS PASS on #FCFCFB):
   green #067647 · blue #175CD3 · amber #DC6803 · red #B42318 · neutral #D0D5DD (remainder) */
const MDCOL={done:'#067647',prog:'#175CD3',warn:'#DC6803',err:'#B42318',neut:'#D0D5DD'};
function deptStats(){const m={};D.plan.forEach(r=>{const d=m[r.dept]=m[r.dept]||{dept:r.dept,rows:0,cov:0,overdue:0};d.rows++;d.cov+=r.cov;if(r.due<TODAY&&r.st!=='COMPLETE')d.overdue++});
 return Object.values(m).map(d=>({...d,cov:Math.round(d.cov/d.rows)})).sort((a,b)=>a.cov-b.cov)}
function planMix(){const g={COMPLETE:0,UNDER_REVIEW:0,IN_COLLECTION:0,REQUESTED:0,PLANNED:0,BLOCKED:0};D.plan.forEach(r=>{g[r.st]=(g[r.st]||0)+1});return g}
function findMix(){const f=D.findings;return {open:f.filter(x=>x.st==='open').length,rem:f.filter(x=>x.st==='remediation').length,await_:f.filter(x=>x.st==='awaiting_verification').length,res:f.filter(x=>x.st==='resolved').length,closed:f.filter(x=>x.st==='closed').length}}
VIEWS['rev/mdash']=()=>{
 const ps=planStats(),gp=gateStats(),req=reqStats(),ds=deptStats(),pm=planMix(),fm=findMix(),cl=claimModel();
 const worst=ds[0]||{dept:'—',cov:0,overdue:0};
 const hiTopics={};D.impacts.filter(i=>i.sig==='High').forEach(i=>{hiTopics[i.topic]=(hiTopics[i.topic]||0)+1});
 const hiList=Object.entries(hiTopics).map(([tp,n])=>({t:D.topics.find(x=>x.id===tp),n})).filter(x=>x.t);
 const activeF=D.findings.filter(f=>f.st!=='closed').length;
 const seg=(n,c)=>n?`<i style="flex:${n};background:${c}" title="${n}"></i>`:'';
 const leg=(c,l,n)=>`<span><span class="legDot" style="background:${c}"></span>${l}: <b>${n}</b></span>`;
 const insights=[
  ['🚦',`${LANG==='ar'?'النشر معطل':'Publication is disabled'}: <b>${gp}/15</b> ${LANG==='ar'?'بوابة ناجحة و':'gates passing and'} <b>${req}/9</b> ${LANG==='ar'?'متطلبات GRI — الادعاء المعلن: لا يوجد':'GRI requirements — stated claim: NONE yet'}.`,'rev/pgate'],
  ['⏰',`<b>${ps.overdue}</b> ${LANG==='ar'?'طلب بيانات متأخر؛ الأدنى تغطية':'data requests overdue; lowest coverage'}: <b>${esc(worst.dept)}</b> (${worst.cov}% · ${worst.overdue} ${LANG==='ar'?'متأخر':'overdue'}).`,'data/plan'],
  ['🚩',`<b>${activeF}</b> ${LANG==='ar'?'ملاحظات نشطة أمام بوابة النشر، منها':'findings active for the Publication Gate, incl.'} <b>${fm.await_}</b> ${LANG==='ar'?'بانتظار الإغلاق المستقل':'awaiting independent closure'}.`,'rev/findings'],
  ['📊',`${LANG==='ar'?'تغطية خطة الجمع':'Collection-plan coverage'} <b>${ps.cov}%</b> · <b>${pm.COMPLETE}/${ps.rows}</b> ${LANG==='ar'?'صفوف مكتملة':'rows complete'} · <b>${pm.BLOCKED||0}</b> ${LANG==='ar'?'محجوب':'blocked'}.`,'data/plan'],
  ['⚠️',`${LANG==='ar'?'أعلى الموضوعات خطورة':'Highest-severity topics'}: ${hiList.map(x=>`<b>${esc(x.t.n)}</b> (${x.n})`).join(' · ')||'—'}.`,'mat/ranking']];
 return pageHead(LANG==='ar'?'لوحة الإدارة':'Management Dashboard',
  LANG==='ar'?'تحليل الدورة كما يُعرض للإدارة العليا — كل رقم محسوب من الحالة ويُنقر إلى شاشته.':'The cycle analysed as presented to top management — every figure computed from state, every number drills to its surface.',
  `<button class="btn sec" onclick="audit('mdash.export','board pack','xlsx+pdf');toast('${LANG==='ar'?'حزمة مجلس الإدارة — تصدير مسجل':'Board pack export recorded'}')">⬇ ${LANG==='ar'?'عرض مجلس الإدارة':'Board view'}</button>`,
  (LANG==='ar'?'الرئيسية › المراجعة والامتثال › لوحة الإدارة':'Home › Review & Compliance › Management Dashboard'))+
 `<div class="tiles">
   ${tile(gp+'/15',LANG==='ar'?'بوابات النشر':'Publication gates',gp<15?'warn':'ok','rev/pgate')}
   ${tile(req+'/9',LANG==='ar'?'متطلبات GRI':'GRI requirements',req<9?'warn':'ok','rev/claim')}
   ${tile(ps.cov+'%',LANG==='ar'?'تغطية الخطة':'Plan coverage',ps.cov<95?'warn':'ok','data/plan')}
   ${tile(ps.overdue,LANG==='ar'?'طلبات متأخرة':'Overdue requests',ps.overdue?'err':'ok','data/requests')}
   ${tile(activeF,LANG==='ar'?'ملاحظات نشطة':'Active findings',activeF?'err':'ok','rev/findings')}
   ${tile(D.evidence.length,LANG==='ar'?'عناصر أدلة':'Evidence items','','data/evid')}
 </div>
 <div style="display:grid;grid-template-columns:1.15fr 1fr;gap:16px;align-items:start">
  <div>
   <div class="card"><div class="hd">${LANG==='ar'?'الملخص الإداري':'Management summary'} <span class="sub">${LANG==='ar'?'مولد من الحالة — ليس نصًا يدويًا':'generated from state — never typed'}</span></div><div class="bd">
    ${insights.map(([ic,txt,go])=>`<div class="insight"><span class="ic">${ic}</span><div style="flex:1">${txt}</div><a href="#/${go}">${t('open')} →</a></div>`).join('')}
   </div></div>
   <div class="card"><div class="hd">${LANG==='ar'?'اكتمال الإدارات':'Department completeness'} <span class="sub">${LANG==='ar'?'متوسط تغطية صفوف الخطة لكل إدارة':'avg plan-row coverage per department'}</span></div><div class="bd">
    ${ds.map(d=>`<div class="hbarRow"><span>${esc(d.dept)}</span><div class="hbarTrack" title="${d.rows} rows · ${d.overdue} overdue"><i style="width:${d.cov}%;background:${d.cov>=90?MDCOL.done:d.cov>=70?'#287870':MDCOL.warn}"></i></div><span class="hbarV">${d.cov}% · ${d.overdue}⏰</span></div>`).join('')}
    <div style="font-size:11px;color:#98A2B3;margin-top:6px">${LANG==='ar'?'العمود الأيمن: التغطية٪ · الطلبات المتأخرة':'Right column: coverage % · overdue requests'}</div>
   </div></div>
  </div>
  <div>
   <div class="card"><div class="hd">${LANG==='ar'?'مزيج حالات الجمع':'Collection status mix'} <span class="sub">${ps.rows} ${LANG==='ar'?'صفًا':'plan rows'}</span></div><div class="bd">
    <div class="segBar">${seg(pm.COMPLETE,MDCOL.done)}${seg(pm.UNDER_REVIEW,MDCOL.warn)}${seg(pm.IN_COLLECTION,MDCOL.prog)}${seg(pm.REQUESTED,MDCOL.prog)}${seg(pm.BLOCKED,MDCOL.err)}${seg(pm.PLANNED,MDCOL.neut)}</div>
    <div class="legRow">${leg(MDCOL.done,LANG==='ar'?'مكتمل':'Complete',pm.COMPLETE)}${leg(MDCOL.warn,LANG==='ar'?'قيد المراجعة':'Under review',pm.UNDER_REVIEW)}${leg(MDCOL.prog,LANG==='ar'?'قيد الجمع/مطلوب':'Collecting / requested',pm.IN_COLLECTION+pm.REQUESTED)}${leg(MDCOL.err,LANG==='ar'?'محجوب':'Blocked',pm.BLOCKED)}${leg(MDCOL.neut,LANG==='ar'?'مخطط':'Planned',pm.PLANNED)}</div>
   </div></div>
   <div class="card"><div class="hd">${LANG==='ar'?'الملاحظات حسب الحالة':'Findings by state'} <span class="sub">${LANG==='ar'?'مفتوحة حتى الإغلاق المستقل':'open until independently closed'}</span></div><div class="bd">
    <div class="segBar">${seg(fm.open,MDCOL.err)}${seg(fm.rem,MDCOL.warn)}${seg(fm.await_,MDCOL.prog)}${seg(fm.res+fm.closed,MDCOL.done)}</div>
    <div class="legRow">${leg(MDCOL.err,LANG==='ar'?'مفتوحة':'Open',fm.open)}${leg(MDCOL.warn,LANG==='ar'?'قيد المعالجة':'Remediation',fm.rem)}${leg(MDCOL.prog,LANG==='ar'?'بانتظار التحقق':'Awaiting verification',fm.await_)}${leg(MDCOL.done,LANG==='ar'?'مغلقة/محلولة':'Resolved / closed',fm.res+fm.closed)}</div>
   </div></div>
   <div class="card"><div class="hd">${LANG==='ar'?'الموضوعات عالية الخطورة':'High-severity topics'} <span class="sub">${LANG==='ar'?'من تقييم التأثيرات':'from the impact assessment'}</span></div><div class="bd">
    ${hiList.map(x=>`<div class="insight"><span class="ic">⚠️</span><div style="flex:1"><b>${esc(x.t.n)}</b> <span style="color:#667085">· ${x.n} ${LANG==='ar'?'تأثيرات عالية':'high impacts'} · ${esc(x.t.gri)}</span></div><a href="#/mat/impacts">${t('open')} →</a></div>`).join('')||'—'}
   </div></div>
   <div class="card"><div class="hd">${LANG==='ar'?'حالة الادعاء':'Claim status'}</div><div class="bd" style="font-size:13px">
    <div class="insight"><span class="ic">🎯</span><div style="flex:1">${LANG==='ar'?'الهدف':'Target'}: <b>${esc(cl.target)}</b><br>${LANG==='ar'?'الأهلية':'Eligibility'}: <b style="color:#B54708">${cl.eligLabel}</b><br>${LANG==='ar'?'الادعاء المعلن':'Stated claim'}: <b>${cl.claim?esc(cl.claim):(LANG==='ar'?'لا يوجد':'NONE')}</b></div><a href="#/rev/claim">${t('open')} →</a></div>
   </div></div>
  </div>
 </div>`};

/* Workiva "Save As" pattern on the document (export menu → separate exporter services) */
function saveAsMenu(){drawer('⬇ '+(LANG==='ar'?'حفظ باسم':'Save As'),
 [['PDF','IReportRenderer + IPageAnchorResolver',()=>`nav('rpt/print')`],
  ['DOCX','IDocxExporter',null],['XHTML (ESEF-ready)','IXhtmlExporter',null],['XLSX (index + annexes)','IXlsxExporter',null]]
 .map(([f,svc])=>`<div class="actLine" style="cursor:pointer" onclick="closeDrawer();${f==='PDF'?`nav('rpt/print');`:`audit('export.saveas','report','${f}');toast('${f} — ${svc} (separate service) · recorded');`}"><b>${f}</b> — <span data-noar style="color:#667085;font-size:12px">${svc}</span></div>`).join(''),
 `<button class="btn sec" onclick="closeDrawer()">${t('cancel')}</button>`)}


