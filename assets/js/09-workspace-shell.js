/* ═══════════════════════════════════════════════════════════════════════════
   ESG OS v14 — 9 · WORKSPACE SHELL — modules grid, workspace pages, record timeline
   Extracted verbatim from the single-file build. Classic script: LOAD ORDER
   IS SIGNIFICANT — see the <script> tags in the entry HTML.
   ═══════════════════════════════════════════════════════════════════════════ */
/* ════════════ 9 · WORKSPACE SHELL — modules grid, workspace pages, record timeline, cycle record ════════════ */

/* ---------- AR dictionary additions for the new patterns ---------- */

/* ---------- P8: breadcrumb with home icon (pageHead upgrade) ---------- */

/* ---------- P2: KPI stat-card with kebab ⋮ (tile upgrade — same call sites) ---------- */
function tileMenu(label,go){
 drawer(esc(label),
  `<div class="railCard" style="box-shadow:none;margin-bottom:10px"><h4>${LANG==='ar'?'تعريف المؤشر':'Metric definition'}</h4>
   <div class="tlNote">${LANG==='ar'?'قيمة محسوبة من بيانات الدورة الحالية — لا تُدخل يدويًا ولا تُخزن.':'Computed from current-cycle data — never typed, never stored.'} ${pv('calc',LANG==='ar'?'محسوب':'CALCULATED')}</div></div>
   <div class="railCard" style="box-shadow:none"><h4>${LANG==='ar'?'إجراءات':'Actions'}</h4>
   ${go?`<div class="actLine" style="cursor:pointer" onclick="closeDrawer();nav('${go}')">↗ <b>${LANG==='ar'?'فتح مساحة العمل':'Open workspace'}</b> — ${LANG==='ar'?'الانتقال إلى الشاشة المصدر':'go to the source screen'}</div>`:''}
   <div class="actLine" style="cursor:pointer" onclick="audit('kpi.export','tile','${esc(label).replace(/'/g,'&#39;')}');toast('${LANG==='ar'?'تم تسجيل التصدير في سجل المراجعة':'Export recorded in the audit log'}')">⬇ <b>${LANG==='ar'?'تصدير لقطة':'Export snapshot'}</b> — XLSX</div></div>`,
  `<button class="btn sec" onclick="closeDrawer()">${t('cancel')}</button>`)}

/* ---------- P1: Modules card-grid landing ---------- */
const WSDEF=[
 {g:'org', ic:'🏛', en:'Organization & Setup', ar:'المنظمة والإعداد', den:'Master data, boundary, standards, readiness', dar:'البيانات الرئيسية والحدود والمعايير والجاهزية'},
 {g:'mat', ic:'⚖️', en:'Materiality', ar:'الجوهرية', den:'Impacts, stakeholders, material topics', dar:'التأثيرات وأصحاب المصلحة والموضوعات الجوهرية'},
 {g:'data',ic:'🗺', en:'Data & Evidence', ar:'البيانات والأدلة', den:'Collection plan, records, evidence, calculations', dar:'خطة الجمع والسجلات والأدلة والحسابات'},
 {g:'rev', ic:'🧑‍⚖️',en:'Review & Compliance', ar:'المراجعة والامتثال', den:'Reviews, findings, gates, content index', dar:'المراجعات والملاحظات والبوابات وفهرس المحتوى'},
 {g:'rpt', ic:'📁', en:'Report Studio', ar:'استوديو التقرير', den:'Structure, narrative, bindings, release', dar:'الهيكل والسرد والربط والإصدار'},
 {g:'asr', ic:'🔍', en:'Assurance', ar:'التأكيد', den:'Engagement, samples, findings, pack', dar:'الارتباط والعينات والملاحظات والحزمة'}];
const WSFAV={data:true};
function wsStats(g){ // all computed — no stored figures
 const ps=planStats();
 switch(g){
  case 'org': {const gp=D.gates.filter(x=>['PG-01','PG-02','PG-03','PG-04','PG-05','PG-06'].includes(x.id)&&x.st==='pass').length;return {open:D.omissions.filter(o=>o.st!=='approved').length,prog:Math.round(gp/6*100)}}
  case 'mat': {const a=D.impacts.filter(i=>i.st==='assessed').length;return {open:D.impacts.length-a,prog:Math.round(a/D.impacts.length*100)}}
  case 'data': return {open:ps.overdue,prog:ps.cov};
  case 'rev': {const f=D.findings,cl=f.filter(x=>x.st==='closed').length;return {open:f.length-cl,prog:Math.round(cl/f.length*100)}}
  case 'rpt': {const s=D.sections,ap=s.filter(x=>x.st==='approved').length;return {open:s.length-ap,prog:Math.round(ap/s.length*100)}}
  case 'asr': {const f=D.findings.filter(x=>x.src==='Assurance'),cl=f.filter(x=>x.st==='closed').length;return {open:f.length-cl,prog:f.length?Math.round(cl/f.length*100):0}}
 }}
function wsBadge(p){return p>=90?['ok',LANG==='ar'?'جيد':'Good']:p>=60?['warn',LANG==='ar'?'متابعة':'Watch']:['err',LANG==='ar'?'انتباه':'Attention']}
function toggleFav(g){WSFAV[g]=!WSFAV[g];render()}
VIEWS['home/modules']=()=>{
 const role=ROLES.find(r=>r.id===ROLE);
 const list=WSDEF.filter(w=>role.nav.includes(w.g)||(w.g==='asr'&&ROLE==='ASSUR'));
 return pageHead(LANG==='ar'?'الوحدات':'Modules',
  LANG==='ar'?'كل مساحات عمل دورة التقرير في مكان واحد — الأرقام محسوبة من بيانات الدورة الحالية.':'Every workspace of the reporting cycle in one place — all figures computed from current-cycle data.',
  `<button class="btn sec" onclick="nav('setup/readiness')">🚦 ${t('readiness')}</button>`,
  (LANG==='ar'?'الرئيسية › الوحدات':'Home › Modules'))+
 `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
   <div style="font-size:13px;font-weight:700;color:#344054">${LANG==='ar'?'مساحات العمل':'Workspaces'} <span style="color:#98A2B3;font-weight:500">· ${list.length}</span></div>
   <div style="font-size:12px;color:#667085">${D.cycle.code} · ${esc(D.cycle.phase)}</div></div>
 <div class="modGrid">${list.map(w=>{
  const s=wsStats(w.g),[bc,bl]=wsBadge(s.prog);
  return `<div class="modCard">
   <div class="top"><div class="mIcon">${w.ic}</div>
    <div><h3>${LANG==='ar'?w.ar:w.en}</h3><div class="meta">${LANG==='ar'?w.dar:w.den}</div></div>
    <span class="star ${WSFAV[w.g]?'on':''}" title="Favourite" onclick="toggleFav('${w.g}')">${WSFAV[w.g]?'★':'☆'}</span></div>
   <div style="display:flex;gap:8px;align-items:center"><span class="st ${bc}">${bl}</span>
    <span class="meta">${LANG==='ar'?'عناصر مفتوحة':'Open items'}: <b style="color:#181C28">${s.open}</b></span></div>
   <div class="progRow"><div class="prog"><i style="width:${s.prog}%"></i></div><b>${s.prog}%</b></div>
   <div class="modFoot"><button class="gh" onclick="nav('ws/${w.g}')">${LANG==='ar'?'التقارير':'Reports'}</button>
    <button class="btn" style="padding:7px 16px" onclick="nav('ws/${w.g}')">${LANG==='ar'?'فتح':'Open'} →</button></div>
  </div>`}).join('')}</div>
 <div class="quickRow">💡 ${LANG==='ar'?'نمط مرجعي مطبق: شبكة بطاقات الوحدات (أيقونة + مفضلة + حالة + عناصر مفتوحة + تقدم + إجراءات) — المحتوى كله من بيانات هذا النظام.':'Reference pattern applied: module-card grid (icon · favourite · status · open items · progress · actions) — every figure from this system’s own data.'}</div>`};

/* ---------- P3: workspace page = KPI row + tabs + sub-module cards ---------- */
const WSTAB={};
function wsTab(g,i){WSTAB[g]=i;render()}
const WS_KPI={
 org:()=>{const gp=gateStats(),rq=reqStats();return tile(gp+'/15',LANG==='ar'?'بوابات ناجحة':'Gates passing',gp<15?'warn':'ok','rev/pgate')+tile(rq+'/9',LANG==='ar'?'متطلبات GRI':'GRI requirements',rq<9?'warn':'ok','rev/claim')+tile(D.omissions.filter(o=>o.st!=='approved').length,LANG==='ar'?'حذف معلق':'Omissions pending','warn','setup/omissions')+tile(D.cycle.phaseNo+'/8',LANG==='ar'?'مرحلة الدورة':'Cycle phase','','org/cycles')},
 mat:()=>{const a=D.impacts.filter(i=>i.st==='assessed').length;return tile(D.impacts.length,LANG==='ar'?'التأثيرات':'Impacts','','mat/impacts')+tile(a+'/'+D.impacts.length,LANG==='ar'?'تأثيرات مقيّمة':'Assessed',a<D.impacts.length?'warn':'ok','mat/assess')+tile(D.topics.filter(x=>x.st==='approved').length,LANG==='ar'?'موضوعات جوهرية':'Material topics','ok','mat/ranking')+tile(D.divergences.filter(x=>x.st!=='resolved').length,LANG==='ar'?'اختلافات مفتوحة':'Open divergences','err','mat/diverge')},
 data:()=>{const ps=planStats();return tile(ps.rows,LANG==='ar'?'صفوف الخطة':'Plan rows','','data/plan')+tile(ps.cov+'%',LANG==='ar'?'التغطية':'Coverage',ps.cov<95?'warn':'ok','data/plan')+tile(ps.overdue,LANG==='ar'?'متأخر':'Overdue',ps.overdue?'err':'ok','data/requests')+tile(D.evidence.length,LANG==='ar'?'عناصر الأدلة':'Evidence items','ok','data/evid')},
 rev:()=>{const f=D.findings.filter(x=>x.st==='open').length;return tile(gateStats()+'/15',LANG==='ar'?'بوابات ناجحة':'Gates passing','warn','rev/pgate')+tile(f,LANG==='ar'?'ملاحظات مفتوحة':'Open findings',f?'err':'ok','rev/findings')+tile(reqStats()+'/9',LANG==='ar'?'متطلبات GRI':'GRI requirements','warn','rev/claim')+tile(D.omissions.length,LANG==='ar'?'قرارات حذف':'Omission decisions','','rev/oapp')},
 rpt:()=>{const s=D.sections,ap=s.filter(x=>x.st==='approved').length;return tile(s.length,LANG==='ar'?'أقسام التقرير':'Report sections','','rpt/rstruct')+tile(ap+'/'+s.length,LANG==='ar'?'أقسام معتمدة':'Approved',ap<s.length?'warn':'ok','rpt/rstruct')+tile('1',LANG==='ar'?'ربط قديم Stale':'Stale binding','err','rpt/rbind')+tile('0',LANG==='ar'?'إصدارات منشورة':'Releases','','rpt/release')},
 asr:()=>{const f=D.findings.filter(x=>x.src==='Assurance');return tile(f.length,LANG==='ar'?'ملاحظات التأكيد':'Assurance findings','warn','asr/afind')+tile(f.filter(x=>x.st!=='closed').length,LANG==='ar'?'مفتوحة (حتى التحقق المستقل)':'Open (until verified)','err','asr/afind')+tile('305-2',LANG==='ar'?'عينة نشطة':'Active sample','','asr/awork')+tile('—',LANG==='ar'?'الاستنتاج: معلق':'Conclusion: pending','warn','asr/aeng')}};
WSDEF.forEach(w=>{
 VIEWS['ws/'+w.g]=()=>{
  const tab=WSTAB[w.g]||0;const grp=NAV.find(n=>n.g===w.g);const s=wsStats(w.g),[bc,bl]=wsBadge(s.prog);
  const tabs=[LANG==='ar'?'نظرة عامة':'Overview',LANG==='ar'?'الوحدات الفرعية':'Sub-modules',LANG==='ar'?'النشاط':'Activity'];
  let body='';
  if(tab===0){body=`<div class="tiles">${WS_KPI[w.g]?WS_KPI[w.g]():''}</div>
   <div style="display:grid;grid-template-columns:1.35fr 1fr;gap:16px">
    <div class="card"><div class="hd">${LANG==='ar'?'إلى أين بعد ذلك':'Where next'}</div><div class="bd">
     ${(grp?grp.items.slice(0,4):[]).map(([r,ic,lbl])=>`<div class="actLine" style="cursor:pointer;font-size:12.5px" onclick="nav('${r}')">${ic} <b>${lbl()}</b> →</div>`).join('')}
    </div></div>
    <div class="card"><div class="hd">${LANG==='ar'?'حالة مساحة العمل':'Workspace health'}</div><div class="bd">
     <div style="display:flex;gap:10px;align-items:center;margin-bottom:10px"><span class="st ${bc}">${bl}</span><span style="font-size:12.5px;color:#667085">${LANG==='ar'?'عناصر مفتوحة':'Open items'}: <b style="color:#181C28">${s.open}</b></span></div>
     <div class="progRow"><div class="prog"><i style="width:${s.prog}%"></i></div><b>${s.prog}%</b></div></div></div>
   </div>`}
  else if(tab===1){body=`<div class="subGrid">${(grp?grp.items:[]).map(([r,ic,lbl,badge])=>
   `<div class="subCard" onclick="nav('${r}')"><div class="si">${ic}</div><div><b>${lbl()}</b><span>${badge?`${badge()} ${LANG==='ar'?'عنصرًا':'items'}`:(LANG==='ar'?'فتح الوحدة':'Open module')}</span></div><span class="go">›</span></div>`).join('')}</div>`}
  else{const acts=D.audit.slice(0,10);body=`<div class="card"><div class="hd">${LANG==='ar'?'سجل النشاط':'Activity log'} <span class="sub">${LANG==='ar'?'أحدث ١٠ أحداث':'latest 10 events'}</span></div><div class="bd">${acts.map(a=>`<div class="actLine"><b>${esc(a.u)}</b> · ${esc(a.a)} · ${esc(a.o)} <span style="color:#98A2B3">${esc(a.w)}</span></div>`).join('')||'<div class="tlNote">—</div>'}</div></div>`}
  return pageHead(LANG==='ar'?w.ar:w.en,(LANG==='ar'?w.dar:w.den)+` · <b>${D.cycle.code}</b>`,
   `<button class="btn sec" onclick="nav('home/modules')">🗂 ${LANG==='ar'?'الوحدات':'Modules'}</button>`,
   (LANG==='ar'?'الرئيسية › الوحدات › ':'Home › Modules › ')+(LANG==='ar'?w.ar:w.en))+
  `<div class="wsTabs">${tabs.map((tt,i)=>`<button class="${i===tab?'on':''}" onclick="wsTab('${w.g}',${i})">${tt}</button>`).join('')}</div>${body}`}});

/* ---------- P4: record timeline detail (concept from the permit screen) ---------- */
D.recEvents=[
 {ic:'📨',who:'Layla Al-Harbi',role:'Programme Manager',act:'Data request issued',at:'2026-01-05 09:12',note:'REQ-1055 issued from plan row PL-002 (305-2 · purchased electricity · EG-CEM-01 · December).',cls:''},
 {ic:'📝',who:'Fatma Said',role:'Data Contributor',act:'Record submitted',at:'2026-01-28 15:41',note:'December value entered with meter read + supplier invoice attached.',att:'EV-0019 · Electricity invoice Dec',cls:''},
 {ic:'⚠️',who:'System',role:'Validation engine',act:'Plausibility warning raised',at:'2026-01-28 15:41',note:'VR-CMP-004: +28% vs November — explanation required before review.',cls:'warn'},
 {ic:'↩',who:'Mona Adel',role:'Department Reviewer',act:'Returned for correction',at:'2026-01-30 10:05',note:'Reason: invoice covers 25 Dec–24 Jan — period mismatch with the reporting month.',cls:'err'},
 {ic:'📎',who:'Fatma Said',role:'Data Contributor',act:'Resubmitted with new evidence',at:'2026-02-03 13:18',note:'Pro-rated to calendar month per methodology CALC-GHG-S2-LOC v1; workings attached.',att:'EV-0021 · Pro-rating worksheet',cls:''},
 {ic:'🧑‍⚖️',who:'Mona Adel',role:'Department Reviewer',act:'Under department review',at:'2026-02-05 09:00',note:'Checklist in progress — variance explanation accepted, awaiting evidence-period check.',cls:'warn'}];
function qrBox(seed){let h=0;for(const c of seed)h=(h*31+c.charCodeAt(0))>>>0;let cells='';for(let i=0;i<121;i++){h=(h*1103515245+12345)>>>0;cells+=`<i style="opacity:${(h>>>16)%3?1:.06}"></i>`}return `<div class="qr" data-noar>${cells}</div>`}
let RECTAB=1;
function recTab(i){RECTAB=i;render()}
VIEWS['data/record']=()=>{
 const r=D.plan.find(p=>p.id==='PL-002')||D.plan[1];
 const team=[[r.own,LANG==='ar'?'مالك البيانات':'Data Owner'],[r.con,LANG==='ar'?'مُدخل البيانات':'Data Contributor'],[r.revw,LANG==='ar'?'مراجع الإدارة':'Department Reviewer'],['O. Farid',LANG==='ar'?'المراجع الفني':'Technical Reviewer']];
 const det=`<div class="card"><div class="bd"><div class="grid2">
   ${field({label:LANG==='ar'?'الإفصاح':'Disclosure',ro:1,value:'GRI 305-2 · Energy indirect (Scope 2)'})}
   ${field({label:LANG==='ar'?'نقطة البيانات':'Datapoint',ro:1,value:r.dp})}
   ${field({label:LANG==='ar'?'الكيان / الموقع':'Entity / Site',ro:1,value:r.ent+' · '+r.site})}
   ${field({label:LANG==='ar'?'الفترة':'Period',ro:1,value:'December 2025 (Monthly)'})}
   ${field({label:LANG==='ar'?'القيمة المقدمة':'Submitted value',value:'1,462,300',unit:['kWh'],help:LANG==='ar'?'قابلة للتحرير هنا فقط قبل اعتماد الإدارة':'editable here only until department approval'})}
   ${field({label:LANG==='ar'?'تفسير الانحراف':'Variance explanation',type:'area',value:'Kiln 2 returned to full load in December after November maintenance shutdown.',full:1})}
  </div></div></div>`;
 const tlv=`<div class="tl">${D.recEvents.map(e=>`<div class="tlItem ${e.cls}">
   <div class="tlHead"><span class="avat">${esc(e.who.split(' ').map(w=>w[0]).slice(0,2).join(''))}</span><b>${esc(e.act)}</b><time data-noar>${esc(e.at)}</time></div>
   <div class="tlWho" style="font-size:12px;color:#667085;margin-bottom:4px">${esc(e.who)} · ${esc(e.role)}</div>
   <div class="tlNote">${esc(e.note)}</div>
   ${e.att?`<span class="tlAtt" onclick="nav('data/evid')">📎 ${esc(e.att)}</span>`:''}</div>`).join('')}</div>`;
 return `
 <div class="crumb"><a class="hm" href="#/home">🏠</a><span class="sep">›</span><span>${LANG==='ar'?'البيانات والأدلة':'Data & Evidence'}</span><span class="sep">›</span><span>${LANG==='ar'?'مساحة الإفصاح':'Disclosure Workspace'}</span><span class="sep">›</span><span class="curr" data-noar>REC-1055</span></div>
 <div class="pageHead"><div><div class="recHead"><span class="code" data-noar>REC-1055</span><span class="st review">${LANG==='ar'?'قيد مراجعة الإدارة':'UNDER DEPARTMENT REVIEW'}</span>${pv('reuse','PL-002 · REQ-1055','#/data/plan')}</div>
  <div class="purpose">GRI 305-2 · ${esc(r.dp)} · EG-CEM-01 · December 2025</div></div>
  <div class="actions"><button class="btn sec" onclick="audit('record.export','REC-1055','pdf');toast('${LANG==='ar'?'تم تسجيل التصدير':'Export recorded'}')">⬇ ${t('export')}</button>
  <button class="btn" onclick="nav('rev/rwb')">${LANG==='ar'?'فتح في المراجعة':'Open in review'} →</button></div></div>
 <div class="wsTabs"><button class="${RECTAB===0?'on':''}" onclick="recTab(0)">${LANG==='ar'?'التفاصيل':'Details'}</button><button class="${RECTAB===1?'on':''}" onclick="recTab(1)">${LANG==='ar'?'الخط الزمني':'Timeline'}</button></div>
 <div class="tlWrap"><div>${RECTAB===0?det:tlv}</div>
 <div>
  <div class="railCard" style="text-align:center">${qrBox('REC-1055·ACME-FY2025·305-2')}<div style="font-size:12px;color:#667085">${LANG==='ar'?'مفتاح السجل الكنسي':'Canonical record key'}</div><div style="font-size:11.5px;font-weight:700" data-noar>ACME-FY2025 · 305-2 · LE-03 · EG-CEM-01 · 2025-12</div>
   <button class="btn sec" style="margin-top:8px;padding:6px 14px" onclick="toast('${LANG==='ar'?'تم النسخ':'Copied'}')">${LANG==='ar'?'نسخ المفتاح':'Copy key'}</button></div>
  <div class="railCard"><h4>${LANG==='ar'?'أعضاء الفريق':'Team members'}</h4>${team.map(([n,rl])=>`<div class="member"><span class="avat">${esc(n.split(' ').map(w=>w[0]).slice(0,2).join(''))}</span><div><b style="font-size:12.5px">${esc(n)}</b><span>${rl}</span></div></div>`).join('')}</div>
  <div class="railCard"><h4>${LANG==='ar'?'سجل النشاط':'Activity log'}</h4>${D.recEvents.slice().reverse().map(e=>`<div class="actLine"><b>${esc(e.who)}</b> — ${esc(e.act)}<br><span style="color:#98A2B3" data-noar>${esc(e.at)}</span></div>`).join('')}</div>
 </div></div>`};

/* ---------- P7: collapsible-sections record page (cycle record) ---------- */
function accTgl(el){el.parentElement.classList.toggle('open')}
VIEWS['org/cycledetail']=()=>{
 const c=D.cycle,acc=(ic,titleEN,titleAR,chip,body,open)=>`<div class="acc ${open?'open':''}">
  <div class="accHd" onclick="accTgl(this)"><span class="ai">${ic}</span>${LANG==='ar'?titleAR:titleEN} ${chip||''}<span class="chev">▼</span></div>
  <div class="accBd">${body}</div></div>`;
 return pageHead(c.code,
  (LANG==='ar'?'سجل دورة التقرير — كل قسم قابل للطي، بنمط صفحة السجل المرجعية.':'The reporting-cycle record — every section collapsible, following the reference record-page pattern.'),
  `<button class="btn sec" onclick="audit('cycle.export',c.code,'pdf');toast('Export recorded')">⬇ ${t('export')}</button><button class="btn" onclick="nav('setup/readiness')">🚦 ${t('readiness')}</button>`,
  (LANG==='ar'?'الرئيسية › المنظمة › دورات التقرير › ':'Home › Organization › Reporting Cycles › ')+c.code)+
 acc('📋','General information','المعلومات العامة',`<span class="st progress">${esc(c.phase)}</span>`,
  `<div class="grid2">${field({label:LANG==='ar'?'اسم الدورة':'Cycle name',ro:1,value:c.name})}${field({label:LANG==='ar'?'الفترة':'Period',ro:1,value:c.period})}${field({label:LANG==='ar'?'تاريخ النشر المستهدف':'Target publication',ro:1,value:c.pub})}${field({label:LANG==='ar'?'المرحلة':'Phase',ro:1,value:c.phase+' ('+c.phaseNo+'/8)'})}</div>`,true)+
 acc('🛡','Reporting boundary','حدود التقرير',`<span class="st approved">${LANG==='ar'?'مقفلة':'LOCKED'}</span>`,
  `<div class="tlNote" style="margin-bottom:10px">${pv('lock',LANG==='ar'?'معتمد ومقفل — PG-02':'Approved & locked — PG-02','#/setup/boundary')}</div>
   <div class="grid2">${field({label:LANG==='ar'?'كيانات داخل النطاق':'Entities in scope',ro:1,value:'4 of 5 (LE-04 excluded — rationale on file)'})}${field({label:LANG==='ar'?'المواقع':'Sites',ro:1,value:'7 sites · 3 countries'})}</div>`)+
 acc('📚','Standards & claim','المعايير والادعاء',`<span class="st warn">${reqStats()}/9</span>`,
  `<div class="grid2">${field({label:LANG==='ar'?'الادعاء المستهدف':'Target claim',ro:1,value:c.intent})}${field({label:LANG==='ar'?'التأكيد الخارجي':'External assurance',ro:1,value:c.assured?(LANG==='ar'?'نعم — Verify & Co.':'Yes — Verify & Co.'):'No'})}</div>
   <div class="quickRow">🧮 ${LANG==='ar'?'الأهلية تحسب آليًا':'Eligibility is computed'}: <a href="#/rev/claim">${reqStats()}/9 → Claim Determination</a></div>`)+
 acc('👥','Team & responsibilities','الفريق والمسؤوليات','',
  `<div class="subGrid">${[['Layla Al-Harbi','ESG Programme Manager'],['Dr. Selim Aziz','Governance Approver'],['O. Farid','Technical Reviewer'],['Nour Hamed','Report Author']].map(([n,rl])=>`<div class="member" style="border:1px solid #EAECF0;border-radius:10px;padding:9px 12px"><span class="avat">${n.split(' ').map(w=>w[0]).slice(0,2).join('')}</span><div><b style="font-size:12.5px">${n}</b><span>${rl}</span></div></div>`).join('')}</div>`)+
 acc('📎','Linked documents','المستندات المرتبطة',`<span class="st draft">${D.evidence.length}</span>`,
  `${D.evidence.slice(0,3).map(e=>`<div class="actLine">📎 <b data-noar>${esc(e.id)}</b> · ${esc(e.n||e.t||'Evidence item')}</div>`).join('')}<div class="quickRow">📁 <a href="#/data/evid">${LANG==='ar'?'فتح مكتبة الأدلة':'Open the evidence library'} →</a></div>`)+
 acc('🧾','Approvals & history','الاعتمادات والسجل','',
  `${D.audit.slice(0,5).map(a=>`<div class="actLine"><b>${esc(a.u)}</b> · ${esc(a.a)} · ${esc(a.o)} <span style="color:#98A2B3" data-noar>${esc(a.w)}</span></div>`).join('')}`)};

/* ---------- navigation + guide wiring ---------- */
/* v8: quick links flattened into their base definitions */
/* v13.1.1: stale document.title override removed — the <title> tag is the single source */
/* (stray mid-file render removed — single boot at end) */


