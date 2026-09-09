/* ═══════════════════════════════════════════════════════════════════════════
   ESG OS v14 — 8 · ENGINE — computed metrics, guide flow, deep-AR
   Extracted verbatim from the single-file build. Classic script: LOAD ORDER
   IS SIGNIFICANT — see the <script> tags in the entry HTML.
   ═══════════════════════════════════════════════════════════════════════════ */
/* ════════════ 8 · ENGINE — computed metrics, guide flow, deep-AR ════════════ */

/* ---- data integrity: expand demo to match every computed figure ---- */
D.impacts.push(
 {id:'IM-09',n:'NOx/SOx stack emissions at cement kiln',p:'E',dir:'Negative · Actual',vc:'Own operations',site:'EG-CEM-01',src:'CTX-03 · stack monitoring',sev:3,lik:4,sig:'Medium',topic:'MT-01',st:'assessed'},
 {id:'IM-10',n:'Diesel spill risk at quarry refuelling',p:'E',dir:'Negative · Potential',vc:'Own operations',site:'EG-QRY-01',src:'Incident register 2025-03',sev:2,lik:2,sig:'Low',topic:'—',st:'assessed'},
 {id:'IM-11',n:'Heat stress for outdoor workers (summer)',p:'S',dir:'Negative · Actual',vc:'Own operations',site:'ALL',src:'HSE register · CTX-05',sev:3,lik:4,sig:'Medium',topic:'MT-04',st:'assessed'},
 {id:'IM-12',n:'Local hiring & skills development',p:'S',dir:'Positive · Actual',vc:'Own operations',site:'EG-QRY-01',src:'ENG-02 · community',sev:2,lik:4,sig:'Watchlist',topic:'MT-05',st:'assessed'},
 {id:'IM-13',n:'Supplier labor practices in logistics chain',p:'S',dir:'Negative · Potential',vc:'Upstream',site:'—',src:'Supplier screening 2025',sev:3,lik:2,sig:'Medium',topic:'MT-06',st:'assessed'},
 {id:'IM-14',n:'Grid stability services from wind assets',p:'E',dir:'Positive · Actual',vc:'Downstream',site:'SA-WND-01',src:'Strategy plan 2025',sev:2,lik:5,sig:'Watchlist',topic:'MT-02',st:'assessed'},
 {id:'IM-15',n:'Groundwater contamination from kiln dust landfill',p:'E',dir:'Negative · Potential',vc:'Own operations',site:'EG-CEM-01',src:'CTX-07 · basin study',sev:4,lik:2,sig:'High',topic:'MT-03',st:'assessed'},
 {id:'IM-16',n:'Data privacy of community grievance records',p:'G',dir:'Negative · Potential',vc:'Own operations',site:'—',src:'Audit finding AF-12',sev:2,lik:2,sig:'Low',topic:'—',st:'assessed'}
);
/* plan: extend to a real 24-row slice; several overdue; tiles computed from data */
(function(){
 const extra=[
  ['PL-009','MT-01','305-1','Scope 1 — mobile plant diesel','LE-03','EG-QRY-01','Operations','R. Barakat','H. Aly','M. Adel','Monthly','litre → tCO2e','2026-02-01','IN_COLLECTION',58],
  ['PL-010','MT-01','305-7','NOx / SOx stack emissions','LE-03','EG-CEM-01','Environment','R. Barakat','H. Aly','O. Farid','Quarterly','kg','2026-02-01','REQUESTED',0],
  ['PL-011','MT-02','302-4','Energy reductions achieved','LE-02','SA-SOL-01','Utilities','S. Tawfik','F. Said','M. Adel','Annual','MWh','2026-03-05','PLANNED',0],
  ['PL-012','MT-03','303-1','Water interactions narrative','LE-03','EG-CEM-01','Environment','R. Barakat','R. Barakat','O. Farid','Annual','—','2026-02-05','BLOCKED',0,'Reviewer = owner refused (SoD)'],
  ['PL-013','MT-04','403-1','OHS management system','ALL','ALL','HSE','A. Qassem','N. Fouad','O. Farid','Annual','—','2026-02-25','IN_COLLECTION',40],
  ['PL-014','MT-04','403-5','Worker OHS training','ALL','ALL','HSE','A. Qassem','N. Fouad','M. Adel','Quarterly','hours','2026-02-01','UNDER_REVIEW',88],
  ['PL-015','MT-05','413-2','Operations w/ significant community impacts','LE-03','EG-QRY-01','CSR','N. Fouad','N. Fouad','O. Farid','Annual','—','2026-03-01','REQUESTED',0],
  ['PL-016','MT-06','205-2','Anti-corruption training & comms','ALL','—','Compliance','Y. Gaber','K. Mansour','O. Farid','Annual','% covered','2026-02-28','IN_COLLECTION',66],
  ['PL-017','GRI2','2-7','Employees by contract & gender','ALL','ALL','HR','K. Mansour','F. Said','M. Adel','Annual','headcount','2026-01-30','COMPLETE',100],
  ['PL-018','GRI2','2-8','Workers who are not employees','ALL','ALL','HR','K. Mansour','F. Said','M. Adel','2026-01-30','—','2026-01-30','BLOCKED',33,'FND-2025-0004 open'],
  ['PL-019','MT-01','305-4','GHG intensity','ALL','—','Utilities','S. Tawfik','ƒx','O. Farid','Annual','tCO2e/t','2026-03-10','PLANNED',0],
  ['PL-020','MT-02','302-1','Fuel split — SA sites Dec','LE-02','SA-SOL-01','Utilities','S. Tawfik','F. Said','M. Adel','Monthly','litre/kWh','2026-02-02','IN_COLLECTION',50],
  ['PL-021','MT-03','303-4','Water discharge by destination','LE-03','EG-CEM-01','Environment','R. Barakat','H. Aly','M. Adel','Quarterly','m³','2026-02-04','REQUESTED',0],
  ['PL-022','MT-04','403-2','Hazard identification processes','ALL','ALL','HSE','A. Qassem','N. Fouad','O. Farid','Annual','—','2026-03-02','PLANNED',0],
  ['PL-023','MT-05','413-1','Engagement programmes — SA sites','LE-02','SA-WND-01','CSR','N. Fouad','N. Fouad','O. Farid','Annual','% sites','2026-03-04','PLANNED',0],
  ['PL-024','GRI2','2-27','Compliance with laws','ALL','—','Legal','Y. Gaber','Y. Gaber','O. Farid','Annual','count','2026-02-20','IN_COLLECTION',80]
 ];
 extra.forEach(r=>D.plan.push({id:r[0],topic:r[1],dis:r[2],dp:r[3],ent:r[4],site:r[5],dept:r[6],own:r[7],con:r[8],revw:r[9],freq:r[10],unit:r[11],due:r[12],st:r[13],cov:r[14],sod:r[15]||null,calc:r[8]==='ƒx'}));
})();
const TODAY='2026-02-07';
function planStats(){const rows=D.plan;const overdue=rows.filter(r=>r.due<TODAY&&r.st!=='COMPLETE').length;
 const cov=Math.round(rows.reduce((a,r)=>a+r.cov,0)/rows.length);const sod=rows.filter(r=>r.sod).length;
 return {rows:rows.length,overdue,cov,sod}}
function ceEval(){return CONFIG.CE.map(c=>({...c,res:c.ev()}))}
function reqRows(){return ceEval().filter(c=>!c.x).map((c,i)=>({n:i+1,t:c.n.replace(/^Requirement \d+ — /,''),st:c.res.pass?'pass':(c.id==='CE-9'?'fail':'pending'),d:c.res.d}))}
function reqStats(){return ceEval().filter(c=>!c.x&&c.res.pass).length}
function gateStats(){return D.gates.filter(g=>g.st==='pass').length}

/* ---- i18n additions ---- */
Object.assign(I18N.en,{diverge:'Divergence Reconciliation',secrec:'Sector Reconciliation',calcruns:'Calculation Runs & Lineage',cdash:'Compliance Dashboard',orgG:'Organization',cycG:'Reporting Cycle',assign:'Assign',bulkAssign:'Bulk assign',youAreHere:'You are here',produces:'This screen produces',nextStep:'Next',prevStep:'Comes from'});
Object.assign(I18N.ar,{diverge:'تسوية الاختلاف',secrec:'مطابقة القطاع',calcruns:'تشغيلات الحساب والنسب',cdash:'لوحة الامتثال',orgG:'المنظمة',cycG:'دورة التقرير',assign:'إسناد',bulkAssign:'إسناد جماعي',youAreHere:'أنت هنا',produces:'مخرَج هذه الشاشة',nextStep:'التالي',prevStep:'يأتي من'});

/* — canonical navigation (Organization vs Reporting Cycle split) — */
const NAV=[
 {g:null,items:[['home','🏠',()=>t('home')],['home/program','🧭',()=>LANG==='ar'?'نظرة البرنامج':'Program Overview'],['home/perf','📈',()=>LANG==='ar'?'أداء الاستدامة':'ESG Performance'],['home/modules','🗂',()=>LANG==='ar'?'الوحدات':'Modules'],['mywork','📥',()=>t('mywork'),()=> (D.tasks[ROLE]||[]).length]]},
 {g:'org',lbl:'orgG',items:[['org/profile','🏛',()=>t('profile')],['org/entities','🌳',()=>t('entities')],['org/sites','📍',()=>t('sites')],['org/acts','🔗',()=>t('acts')],['org/sector','🏷',()=>t('sector')]]},
 {g:'org',lbl:'cycG',items:[['org/cycles','📅',()=>t('cycles')],['setup/console','🎛',()=>LANG==='ar'?'وحدة تهيئة الدورة':'Cycle Setup Console'],['setup/boundary','🛡',()=>t('boundary')],['setup/standards','📚',()=>t('standards')],['setup/applic','🎯',()=>t('applic')],['setup/gri2','📋',()=>t('gri2')],['setup/omissions','✂️',()=>t('omissions')],['setup/readiness','🚦',()=>t('readiness')]]},
 {g:'mat',lbl:'mat',items:[['mat/config','⚗️',()=>t('config')],['mat/context','🗂',()=>t('context')],['mat/stake','👥',()=>t('stake')],['mat/engage','🤝',()=>t('engage')],['mat/impacts','💥',()=>t('impacts'),()=>D.impacts.length],['mat/assess','⚖️',()=>t('assess')],['mat/diverge','🔀',()=>t('diverge')],['mat/mapping','🧭',()=>t('mapping')],['mat/secrec','🏷',()=>t('secrec')],['mat/ranking','📊',()=>t('ranking')],['mat/topicmgmt','🗂️',()=>LANG==='ar'?'إدارة الموضوع (3-3)':'Topic Management (3-3)'],['mat/approval','✅',()=>t('approval')],['mat/risk','⚠️',()=>LANG==='ar'?'مخاطر وفرص ESG':'ESG Risks']]},
 {g:'data',lbl:'data',items:[['data/plan','🗺',()=>t('plan')],['data/deptgrid','🧮',()=>LANG==='ar'?'شبكة جمع الإدارة':'Dept Collection Grid'],['data/requests','📨',()=>t('requests')],['data/dwork','📝',()=>t('dwork')],['data/kpimaster','🧬',()=>LANG==='ar'?'سجل المؤشرات':'KPI Master'],['data/catalog','🗄',()=>LANG==='ar'?'كتالوج الأنواع':'Data Catalog (types)'],['data/targets','🎯',()=>LANG==='ar'?'الأهداف':'Targets & Goals'],['data/factbook','📔',()=>'Fact Book'],['data/imp','📤',()=>t('imp')],['data/evid','📎',()=>t('evid')],['data/factors','🧪',()=>t('factors')],['data/calcruns','🧮',()=>t('calcruns')],['data/valid','🧰',()=>t('valid')],['data/qual','💠',()=>t('qual')],['data/comp','📈',()=>t('comp')],['data/restate','♻️',()=>t('restate')]]},
 {g:'rev',lbl:'rev',items:[['rev/rwb','🧑‍⚖️',()=>t('rwb')],['rev/xchk','🔀',()=>t('xchk')],['rev/findings','🚩',()=>t('findings'),()=>D.findings.filter(f=>f.st==='open').length,'red'],['rev/oapp','🗳',()=>t('oapp')],['rev/claim','🧮',()=>t('claim')],['rev/mdash','📈',()=>LANG==='ar'?'لوحة الإدارة':'Management Dashboard'],['rev/cdash','📟',()=>t('cdash')],['rev/cidx','📇',()=>t('cidx')],['rev/sou','📜',()=>t('sou')],['rev/pgate','🚪',()=>t('pgate')]]},
 {g:'rpt',lbl:'rpt',items:[['rpt/rproj','📁',()=>t('rproj')],['rpt/rstruct','🧱',()=>t('rstruct')],['rpt/rnarr','✍️',()=>t('rnarr')],['rpt/rtab','📊',()=>t('rtab')],['rpt/rbind','🪢',()=>t('rbind')],['rpt/rprev','👁',()=>t('rprev')],['rpt/rexp','📦',()=>t('rexp')],['rpt/print','🖨',()=>LANG==='ar'?'طباعة التقرير':'Print / PDF'],['rpt/release','🚀',()=>t('release')]]},
 {g:'asr',lbl:'rpt',items:[['asr/aeng','🤝',()=>t('aeng')],['asr/awork','🔍',()=>t('awork')],['asr/afind','🚩',()=>t('afind')],['asr/apack','🗃',()=>t('apack')]]},
 {g:'adm',lbl:'adm',items:[['adm/astd','📚',()=>t('astd')],['adm/fwx','🌐',()=>LANG==='ar'?'مستكشف الأطر':'Framework Explorer'],['adm/raci','🧩',()=>'RACI'],['adm/maturity','📶',()=>LANG==='ar'?'النضج (اختياري)':'Maturity (opt.)'],['adm/ausers','👤',()=>t('ausers')],['adm/aconf','⚙️',()=>t('aconf')],['adm/aaudit','🧾',()=>t('aaudit')]]}
];
function renderSidebar(){
 const role=ROLES.find(r=>r.id===ROLE);const allowed=role.nav;
 let h=`<div class="sbLogo"><div class="globe"></div><div class="wm"><b>ENERGYUP</b><span>INTERNATIONAL</span></div></div>`;
 NAV.forEach(g=>{
  if(g.g&&!allowed.includes(g.g))return;
  if(g.g==='asr'&&ROLE!=='ASSUR')return;
  if(ROLE==='ASSUR'&&g.g!=='asr')return;
  const items=g.items.map(([r,ic,lbl,badge,bcls])=>{
   const active=CUR===r?'active':'';
   const b=badge?`<span class="b ${bcls||''}">${badge()}</span>`:'';
   return `<div class="navItem ${active}" onclick="nav('${r}')"><span>${ic}</span> ${lbl()} ${b}</div>`}).join('');
  h+=`<div class="navGroup">${g.g?`<h3>${t(g.lbl||g.g)}</h3>`:''}${items}</div>`});
 h+=`<div class="navGroup" style="margin-top:auto;padding-top:18px"><div class="navItem" onclick="toast('Support')">🛟 ${LANG==='ar'?'الدعم':'Support'}</div><div class="navItem" onclick="toast('Settings')">⚙️ ${LANG==='ar'?'الإعدادات':'Settings'}</div></div>`;
 $('#sidebar').innerHTML=h;
};

/* ---- guide bar: you-are-here + flow (auto-injected on every screen) ---- */
const PHASES=[['B',()=>LANG==='ar'?'النطاق والإعداد':'Scope & Setup'],['C',()=>LANG==='ar'?'الجوهرية':'Materiality'],['D',()=>LANG==='ar'?'البيانات والأدلة':'Data & Evidence'],['E',()=>LANG==='ar'?'المراجعة والامتثال':'Review & Compliance'],['F',()=>LANG==='ar'?'التقرير والتأكيد':'Report & Assurance']];
const PHASE_PCT=[96,100,71,38,22];
const GUIDE={
 'org/profile':[0,'Approved organization profile (GRI 2-1)','org/entities','Legal Entities'],
 'org/entities':[0,'Approved entity tree + scope flags (GRI 2-2)','org/sites','Sites Register'],
 'org/sites':[0,'Approved sites + data domains','org/acts','Activities & Value Chain'],
 'org/acts':[0,'Approved value chain (GRI 2-6) — feeds sector & materiality context','org/sector','Sector Classification'],
 'org/sector':[0,'Approved sector classification → resolves sector standards','org/cycles','Reporting Cycles'],
 'org/cycles':[0,'Open reporting cycle (scope key for everything downstream)','setup/boundary','Reporting Boundary'],
 'setup/boundary':[0,'Locked boundary per lens (PG-02)','setup/standards','Applicable Standards'],
 'setup/standards':[0,'Locked standards set + elections (PG-03)','setup/applic','Disclosure Applicability'],
 'setup/applic':[0,'Applicability verdicts (Initial → Final)','setup/gri2','GRI 2 Assessment'],
 'setup/gri2':[0,'GRI 2 readiness at datapoint grain → Requirement 2','setup/omissions','Omission Requests'],
 'setup/omissions':[0,'Approved omissions → Requirement 6','setup/readiness','Cycle Readiness'],
 'setup/readiness':[0,'Go/no-go picture — 15 gates','mat/config','Materiality'],
 'mat/config':[1,'Approved methodology & thresholds (G0)','mat/context','Context Register'],
 'mat/context':[1,'Approved context universe (G1)','mat/stake','Stakeholders'],
 'mat/stake':[1,'Approved stakeholder map','mat/engage','Engagement'],
 'mat/engage':[1,'Engagement plan + evidence-backed records → impact feed','mat/impacts','Impact Register'],
 'mat/impacts':[1,'Impact universe — every impact with an origin (G2)','mat/assess','Impact Assessment'],
 'mat/assess':[1,'Assessed impacts (severity/significance derived) (G3)','mat/diverge','Divergence'],
 'mat/diverge':[1,'Resolved divergences','mat/mapping','Topic Mapping'],
 'mat/mapping':[1,'Impact→topic→GRI map','mat/secrec','Sector Reconciliation'],
 'mat/secrec':[1,'Every sector topic confirmed or explained','mat/ranking','Ranking'],
 'mat/ranking':[1,'Proposed material topic set (G4)','mat/approval','Governance Approval'],
 'mat/topicmgmt':[1,'The complete 3-3 record for a material topic (MTM Blocks A–L)','mat/approval','Governance Approval'],
 'mat/approval':[1,'FROZEN Material Topic Set (PG-04) → unlocks planning','data/plan','Collection Plan'],
 'data/plan':[2,'Assigned collection plan → issued requests','data/requests','Data Requests'],
 'data/requests':[2,'Issued requests → contributor tasks','data/dwork','Disclosure Workspace'],
 'data/dwork':[2,'Submitted records with evidence → review queue','rev/rwb','Review Workbench'],
 'data/imp':[2,'Validated batch → draft records','data/dwork','Disclosure Workspace'],
 'data/evid':[2,'Evidence objects with metadata & hashes','data/dwork','Disclosure Workspace'],
 'data/factors':[2,'Approved factors → unblock calculations (PG-07)','data/calcruns','Calculation Runs'],
 'data/calcruns':[2,'Reviewed calculation outputs with lineage','data/valid','Validation Console'],
 'data/valid':[2,'Zero blockers (PG-08)','data/qual','Data Quality'],
 'data/qual':[2,'Quality picture per department','rev/rwb','Review Workbench'],
 'data/comp':[2,'Explained variances','rev/rwb','Review Workbench'],
 'data/restate':[2,'Approved restatements → GRI 2-4','rev/claim','GRI Claim'],
 'rev/rwb':[3,'Approved records (version-bound)','rev/xchk','Cross-checks'],
 'rev/xchk':[3,'Cross-disclosure consistency','rev/findings','Findings'],
 'rev/findings':[3,'Closed findings (PG-09)','rev/oapp','Omission Approval'],
 'rev/oapp':[3,'Final omission decisions (PG-12)','rev/claim','GRI Claim'],
 'rev/claim':[3,'Computed claim (9 requirements)','rev/cidx','Content Index'],
 'rev/cdash':[3,'Compliance overview','rev/cidx','Content Index'],
 'rev/cidx':[3,'Generated Content Index vN (PG-13)','rev/sou','Statement of Use'],
 'rev/sou':[3,'Locked Statement of Use (Req 8)','rev/pgate','Publication Gate'],
 'rev/pgate':[3,'15-gate publication verdict','rpt/rproj','Report Project'],
 'rpt/rproj':[4,'Report project + generated structure','rpt/rstruct','Report Structure'],
 'rpt/rstruct':[4,'Approved structure with owners','rpt/rnarr','Narrative Editor'],
 'rpt/rnarr':[4,'Approved narrative blocks (token-bound)','rpt/rtab','Tables & Charts'],
 'rpt/rtab':[4,'Bound tables & charts','rpt/rbind','Data Binding'],
 'rpt/rbind':[4,'100% binding lineage','rpt/rprev','Preview'],
 'rpt/rprev':[4,'Publishable preview (0 blockers)','rpt/release','Release'],
 'rpt/rexp':[4,'Recorded export artifacts','rpt/release','Release'],
 'rpt/release':[4,'Immutable release snapshot + period lock','data/restate','Restatement (only way back)'],

 'home/modules':[0,'Oriented entry into every workspace','setup/readiness','Cycle Readiness'],
 'ws/org':[0,'Workspace overview — Organization & Setup','org/profile','Organization Profile'],
 'ws/mat':[1,'Workspace overview — Materiality','mat/config','Methodology & Thresholds'],
 'ws/data':[3,'Workspace overview — Data & Evidence','data/plan','Collection Plan (X-PLAN)'],
 'ws/rev':[3,'Workspace overview — Review & Compliance','rev/rwb','Review Workbench'],
 'ws/rpt':[4,'Workspace overview — Report Studio','rpt/rstruct','Report Structure'],
 'data/record':[3,'Reviewed datapoint record REC-1055 (full history)','rev/rwb','Review Workbench'],
 'org/cycledetail':[0,'The cycle record — scope key for everything downstream','setup/boundary','Reporting Boundary'],
'rpt/print':[4,'Print-ready draft report — browser Print = PDF (audited)','rpt/release','Release & Lock'],
'rev/mdash':[3,'The management view of cycle health — computed, drillable','rev/pgate','Publication Gate'],
'data/catalog':[3,'Typed datapoint entries — every type through its fixed rendering contract','data/evid','Evidence Library']
};
function guideBar(route){
 const g=GUIDE[route];if(!g)return '';
 const [ph,out,nextR,nextL]=g;
 const chips=PHASES.map((p,i)=>`<span class="ph ${i<ph?'done':i===ph?'now':''}">${i<ph?'✓ ':''}${p[0]} · ${p[1]()}${i===ph?` · ${PHASE_PCT[i]}%`:''}</span>`).join('<span style="color:var(--mut2)">›</span>');
 return `<div class="guideBar"><div class="phases">${chips}</div>
 <div class="gline"><span>📍 <b>${t('youAreHere')}</b></span><span>${t('produces')}: <b>${esc(out)}</b></span>
 <span class="gnext">${t('nextStep')}: <a href="#/${nextR}">${esc(nextL)} →</a></span></div></div>`;
}

/* ----: computed Home (no fake metrics) ---- */
VIEWS['home']=()=>{
 const ps=planStats(),req=reqStats(),gp=gateStats();
 const tasks=D.tasks[ROLE]||[];
 const na={PM:['Assign a reviewer to the 403-9 plan row, then issue reminders for '+ps.overdue+' overdue requests','data/plan'],
  CONTRIB:['Correct and resubmit the returned December electricity record','data/dwork'],
  DREV:['Review REC-1055 (variance +28% — explanation attached)','rev/rwb'],
  TREV:['Clear cross-check blocker: 302-1 total vs site breakdown','rev/xchk'],
  GOV:['Decide omission OMR-2025-0002 (303-5 · information unavailable)','rev/oapp'],
  AUTHOR:['Refresh the stale Scope-2 table binding, then draft the Water section','rpt/rbind'],
  OWNER:['Resolve the returned record in your team (REC-1026)','data/dwork'],
  METH:['Approve EF-SA-ELEC-2025 — two calculation runs are waiting (PG-07)','data/factors'],
  ASSUR:['Open the 305-2 sample population','asr/awork']}[ROLE]||['Review cycle readiness','setup/readiness'];
 return pageHead(LANG==='ar'?'مركز قيادة الجاهزية':'Readiness Command Center',
  `${D.cycle.name} · ${D.cycle.period} · ${LANG==='ar'?'الادعاء المستهدف':'target claim'}: <b>${D.cycle.intent}</b>`,
  `<button class="btn sec" onclick="nav('setup/readiness')">${t('readiness')}</button>`)+
 `<div class="nextAct"><div><div class="t">⭐ ${t('nextAction')}</div><div class="a">${esc(na[0])}</div></div><button onclick="nav('${na[1]}')">${t('openItem')} →</button></div>
 <div class="tiles">
  ${tile(`${D.cycle.phaseNo}/8`,LANG==='ar'?'مرحلة الدورة':'Cycle phase','','org/cycles')}
  ${tile(`${gp}/15`,LANG==='ar'?'بوابات النشر':'Publication gates',gp<15?'warn':'ok','rev/pgate')}
  ${tile(`${req}/9`,LANG==='ar'?'متطلبات GRI مستوفاة':'GRI requirements met',req<9?'warn':'ok','rev/claim')}
  ${tile(ps.cov+'%',LANG==='ar'?'تغطية الخطة':'Plan coverage',ps.cov<95?'warn':'ok','data/plan')}
  ${tile('92%',LANG==='ar'?'تغطية الأدلة':'Evidence coverage','ok','data/evid')}
  ${tile(D.findings.filter(f=>f.st==='open').length,LANG==='ar'?'ملاحظات مفتوحة':'Open findings','err','rev/findings')}
  ${tile(D.omissions.filter(o=>o.st!=='approved').length,LANG==='ar'?'حذف بانتظار الاعتماد':'Omissions pending','warn','rev/oapp')}
  ${tile(ps.overdue,LANG==='ar'?'طلبات متأخرة':'Overdue requests',ps.overdue?'err':'ok','data/plan')}
 </div>
 <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:16px">
 <div class="card"><div class="hd">${LANG==='ar'?'البوابات الحاجبة الآن':'Blocking gates right now'}<span class="sub">${LANG==='ar'?'محسوبة حيًا — لا يوجد زر يجعل بوابة تنجح':'computed live — no action can set a gate to PASS'}</span></div><div class="bd">
  ${D.gates.filter(x=>x.st==='fail').slice(0,6).map(x=>`<div class="gateRow"><span class="gid">${x.id}</span><div style="flex:1"><b style="font-size:12.5px">${esc(x.n)}</b><div style="font-size:12px;color:var(--mut)">${esc(x.fix||'')} · ${t('who')}: <b>${esc(x.own||'—')}</b></div></div><span class="st fail">FAIL</span></div>`).join('')}
 </div></div>
 <div class="card"><div class="hd">${t('mywork')} <span class="sub">(${roleName()})</span></div><div class="bd">
  ${tasks.length?tasks.map(x=>`<div class="gateRow"><div style="flex:1;font-size:12.5px">${x.k==='ret'?'↩ ':x.k==='warn'?'⚠ ':x.k==='ok'?'✓ ':'• '}${esc(x.t)}</div><a href="#/${x.v}">${t('open')} →</a></div>`).join(''):`<div style="color:var(--mut)">${LANG==='ar'?'لا مهام':'Nothing assigned'} ✨</div>`}
 </div></div></div>
 <div class="card"><div class="hd">${LANG==='ar'?'تقدم الرحلة':'Journey progress'}<span class="sub">B → C → D → E → F</span></div><div class="bd" style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px">
  ${PHASES.map((p,i)=>`<div style="cursor:pointer" onclick="nav('${['setup/readiness','mat/approval','data/plan','rev/claim','rpt/rstruct'][i]}')"><div style="font-size:12px;font-weight:600;margin-bottom:5px">${p[0]} · ${p[1]()}</div><div class="prog ${PHASE_PCT[i]<60?'warn':''}"><i style="width:${PHASE_PCT[i]}%"></i></div><div style="font-size:11px;color:var(--mut);margin-top:3px">${PHASE_PCT[i]}%</div></div>`).join('')}
 </div></div>`+`<div class="quickRow">🗂 ${LANG==='ar'?'كل مساحات العمل كبطاقات وحدات':'All workspaces as module cards'}: <a href="#/home/modules">${LANG==='ar'?'الوحدات':'Modules'} →</a></div>`;
};

/* ----: X-PLAN with assignment drawer + bulk + computed tiles ---- */
function assignForm(id){const p=D.plan.find(x=>x.id===id)||{};return `<div class="notice info" style="margin-bottom:12px">${esc(p.dp||'')} · <b>${p.dis}</b> · ${p.ent} / ${p.site}</div><div class="formGrid">
 ${field({label:'Responsible department',req:1,type:'select',opts:['Utilities','HSE','Environment','CSR','Compliance','HR','Operations','Legal'],value:p.dept})}
 ${field({label:'Data owner',req:1,type:'select',opts:['K. Mansour','S. Tawfik','R. Barakat','A. Qassem','N. Fouad','Y. Gaber'],value:p.own})}
 ${field({label:'Contributor',req:1,type:'select',opts:['F. Said','H. Aly','N. Fouad','A. Qassem','K. Mansour'],value:p.con})}
 ${field({label:'Reviewer',req:1,type:'select',opts:['M. Adel','O. Farid'],value:p.revw!=='—'?p.revw:'',err:p.sod?'SoD: reviewer must differ from contributor — current assignment refused':'',help:'Compared on user IDs. Reviewer = contributor is refused at planning time.'})}
 ${field({label:'Approver (optional)',type:'select',opts:['—','Layla Al-Harbi','Dr. S. Aziz'],value:'—'})}
 ${field({label:'Frequency',req:1,type:'select',opts:['Monthly','Quarterly','Annual','Event-based'],value:p.freq})}
 ${field({label:'Due date',req:1,type:'date',value:p.due})}
 ${field({label:'Entity / site slice',value:(p.ent||'')+' · '+(p.site||''),pv:{k:'reuse',t:'from Boundary',l:'#/setup/boundary'}})}
 ${field({label:'Evidence expectation',type:'select',opts:['Meter photo + invoice','Register extract','Minutes + attendance','Policy document','None (narrative)'],full:1,value:'Meter photo + invoice'})}
</div>`}
function saveAssign(id){const p=D.plan.find(x=>x.id===id);if(p){p.revw=p.revw==='—'?'M. Adel':p.revw;p.sod=null;if(p.st==='BLOCKED')p.st='PLANNED';}
 closeDrawer();audit('plan.assign',id,'Assignment updated — SoD check passed');toast('Assignment saved · SoD verified · audit recorded');render();}
VIEWS['data/plan']=()=>{const ps=planStats();
 return pageHead(t('plan'),LANG==='ar'?'مولّدة من الانطباق × الموضوعات × الحدود × القاموس — النظام يقترح والمدير يُسند ويُصدر. حالة الصف محسوبة من السجلات.':'Generated from applicability × topics × boundary × dictionary — the system proposes; the manager assigns and issues. Row status computed from records.',
 `<button class="btn sec" onclick="toast('Plan regenerated — diff: 0 new, 0 retired (idempotent on canonical key)')">↻ ${LANG==='ar'?'توليد من النطاق':'Generate from scope'}</button>
  <button class="btn sec" onclick="bulkAssign()">👥 ${t('bulkAssign')}</button>
  <button class="btn" onclick="bulkIssue()">📨 ${LANG==='ar'?'إصدار للمحدد':'Issue selected'}</button>`,'Data & Evidence › Collection Plan (X-PLAN)')+
 `<div class="tiles">${tile(ps.rows,LANG==='ar'?'صفوف الخطة (معروضة كاملة)':'Plan rows (all shown)')}${tile(ps.cov+'%',LANG==='ar'?'التغطية':'Coverage',ps.cov<80?'warn':'ok')}${tile(ps.overdue,LANG==='ar'?'متأخر':'Overdue',ps.overdue?'err':'ok')}${tile(ps.sod,LANG==='ar'?'موقوف SoD':'SoD blocks',ps.sod?'err':'ok')}</div>
 <div class="card">${toolbar(`<select><option>${LANG==='ar'?'كل الموضوعات':'All topics'}</option>${D.topics.map(x=>`<option>${x.id}</option>`).join('')}</select><select><option>${LANG==='ar'?'كل الإدارات':'All departments'}</option><option>Utilities</option><option>HSE</option><option>Environment</option><option>CSR</option></select>`)}
 <div style="overflow-x:auto"><table class="tbl"><thead><tr><th><input type="checkbox" class="selCol" onclick="document.querySelectorAll('.rowSel').forEach(c=>c.checked=this.checked)"></th><th>Topic 🔗</th><th>Disclosure 🔗</th><th>Datapoint</th><th>Entity/Site</th><th>Owner</th><th>Contributor</th><th>Reviewer</th><th>Freq</th><th>${t('due')}</th><th>Status ⚙</th><th>Cov%</th><th></th></tr></thead><tbody>
 ${D.plan.map(p=>{const od=p.due<TODAY&&p.st!=='COMPLETE';return `<tr><td><input type="checkbox" class="rowSel selCol"></td><td>${p.topic}</td><td><b>${p.dis}</b></td><td style="font-weight:600;min-width:180px">${esc(p.dp)}${p.calc?' '+pv('calc','derived',''):''}${p.sod?`<div style="font-size:11px;color:var(--err)">⛔ ${esc(p.sod)}</div>`:''}</td><td style="font-size:11.5px">${p.ent} · ${p.site}</td><td>${p.own}</td><td>${p.con}</td><td>${p.revw}</td><td>${p.freq}</td><td>${od?`<b style="color:var(--err)">${p.due} ⚠</b>`:p.due}</td><td>${st(p.st)}</td><td>${p.cov}%</td><td class="rowActs"><a onclick="drawer('${t('assign')} — ${p.id}',assignForm('${p.id}'),assignFoot('${p.id}'))">${t('assign')}</a><a onclick="drawer(p.id||'row',planDetail('${p.id}'))">${LANG==='ar'?'تفاصيل':'Detail'}</a><a href="#/data/dwork">${t('open')}</a></td></tr>`}).join('')}
 </tbody></table></div>${pager(D.plan.length)}</div>`};
function planDetail(id){const p=D.plan.find(x=>x.id===id)||{};return `<div class="kv">
 <dt>Plan row</dt><dd>${p.id||'—'}</dd>
 <dt>Material topic</dt><dd>${p.topic||'—'} ${pv('reuse','frozen set','#/mat/approval')}</dd>
 <dt>Standard / Disclosure / Requirement</dt><dd>GRI ${(p.dis||'').split('-')[0]} · ${p.dis||''} · requirement a</dd>
 <dt>Datapoint / Definition</dt><dd style="font-weight:400">${esc(p.dp||'')} — definition, type & unit from the Dictionary ${pv('reuse','Dictionary','#/data/catalog')}</dd>
 <dt>Data type / Unit / Dimensions</dt><dd>${p.calc?'CALCULATED ƒx':'NUMBER'} · from definition · site × month</dd>
 <dt>Entity / Site / Department</dt><dd>${p.ent||''} · ${p.site||''} · ${p.dept||'—'}</dd>
 <dt>Owner / Contributor / Reviewer</dt><dd>${p.own||''} · ${p.con||''} · ${p.revw||''}</dd>
 <dt>Frequency / Period / Due</dt><dd>${p.freq||''} · FY2025 · ${p.due||''}</dd>
 <dt>Evidence requirement</dt><dd>${p.calc?'Run inputs carry their own evidence':'Invoice / meter photo — VR-EVD-001'}</dd>
 <dt>Calculation requirement</dt><dd>${p.calc?'CALC card from the Calc Book — value only via a run':'None — direct entry'}</dd>
 <dt>Validation requirement</dt><dd style="font-weight:400">VR-UOM-004 · VR-PER-001 · VR-SIT-002 · VR-DUP-001${p.calc?' · frozen-factor rule':''}</dd>
 <dt>Status ⚙ / Completeness</dt><dd>${st(p.st||'PENDING')} · ${p.cov!=null?p.cov+'%':'—'}</dd>
 <dt>Last update</dt><dd>2026-02-06 14:32 · by ${p.con||'—'} (audited)</dd></div>`}
function assignFoot(id){return `<button class="btn sec" onclick="closeDrawer()">${t('cancel')}</button><button class="btn" onclick="saveAssign('${id}')">${LANG==='ar'?'حفظ الإسناد':'Save assignment'}</button>`}
function bulkAssign(){const n=document.querySelectorAll('.rowSel:checked').length;if(!n)return toast(LANG==='ar'?'اختر صفوفًا أولًا':'Select rows first');
 drawer(t('bulkAssign')+` (${n})`,`<div class="notice info">${LANG==='ar'?'يُطبَّق على':'Applies to'} ${n} ${LANG==='ar'?'صفًا محددًا':'selected rows'} — ${LANG==='ar'?'الحقول الفارغة لا تتغير':'blank fields left unchanged'}.</div><div class="formGrid">
 ${field({label:'Data owner',type:'select',opts:['—','K. Mansour','S. Tawfik','R. Barakat']})}
 ${field({label:'Contributor',type:'select',opts:['—','F. Said','H. Aly']})}
 ${field({label:'Reviewer',type:'select',opts:['—','M. Adel','O. Farid'],help:'SoD checked per row; conflicting rows are skipped and reported.'})}
 ${field({label:'Due date',type:'date'})}</div>`,
 `<button class="btn sec" onclick="closeDrawer()">${t('cancel')}</button><button class="btn" onclick="closeDrawer();audit('plan.bulkAssign','${'{'}n${'}'} rows','applied; 0 SoD conflicts');toast('Bulk assignment applied — audit per row')">${LANG==='ar'?'تطبيق':'Apply'}</button>`)}
function bulkIssue(){const n=document.querySelectorAll('.rowSel:checked').length;if(!n)return toast(LANG==='ar'?'اختر صفوفًا أولًا':'Select rows first');
 audit('request.bulk',n+' rows','requests issued → tasks created');toast(`${n} ${LANG==='ar'?'طلبات صدرت ← مهام أنشئت · مسجلة':'requests issued → tasks created · audited'}`)}

/* ----: Evidence upload drawer (real metadata) ---- */
function evidForm(){return `<div class="formGrid">
 <div class="full"><div style="border:1.5px dashed var(--bd);border-radius:10px;padding:22px;text-align:center;color:var(--mut)"><div style="width:40px;height:40px;border-radius:10px;border:1px solid var(--line);display:inline-flex;align-items:center;justify-content:center;margin-bottom:6px">📤</div><div><a onclick="toast('File picker (prototype)')">${LANG==='ar'?'اضغط للرفع':'Click to upload'}</a> ${LANG==='ar'?'أو اسحب وأفلت':'or drag and drop'}</div><div style="font-size:11px;color:var(--mut2)">PDF, XLSX, JPG, PNG (max. 25MB) · SHA-256 ${LANG==='ar'?'يُحسب على الخادم':'computed server-side'}</div></div></div>
 ${field({label:'Evidence type',req:1,type:'select',opts:['Invoice','Meter/Log','Register extract','Policy','Certificate','Minutes','Factor source','Photo']})}
 ${field({label:'Document date',req:1,type:'date',value:'2025-12-31'})}
 ${field({label:'Valid from',type:'date',value:'2025-12-01'})}
 ${field({label:'Valid to',type:'date',value:'2025-12-31'})}
 ${field({label:'Entity',type:'select',opts:['—','Acme Energy KSA','Acme Materials Egypt']})}
 ${field({label:'Site',type:'select',opts:['—','EG-CEM-01','EG-QRY-01','SA-SOL-01','SA-WND-01']})}
 ${field({label:'Reporting period',req:1,type:'select',opts:['2025-12','2025-Q4','FY2025']})}
 ${field({label:'Source / issuer',req:1,ph:'e.g. Utility company'})}
 ${field({label:'Confidentiality',req:1,type:'select',opts:['Internal','Restricted','Public']})}
 ${field({label:'Supersedes',type:'select',opts:['— none —',...D.evidence.map(e=>e.id)],help:LANG==='ar'?'الاستبدال يحفظ النسخة السابقة وينقل الروابط — لا حذف أبدًا':'Supersession preserves the old version and moves links — never deleted.'})}
 ${field({label:'Link to objects',type:'select',opts:['REC-1026 · 305-2 Dec','FND-2025-0001','IM-03'],full:1,help:LANG==='ar'?'دليل واحد قد يدعم عدة إفصاحات':'One document can support many disclosures.'})}
 ${field({label:'Description',type:'area',full:1})}
</div>`}
function evidSave(){const id='EV-00'+(30+D.evidence.length);D.evidence.unshift({id,n:'meter-photo-dec-2025.jpg',type:'Meter/Log',period:'2025-12',site:'EG-CEM-01',hash:'f31b…7a20',valid:'2025-12',up:roleName(),st:'linked'});
 closeDrawer();audit('evidence.upload',id,'SHA-256 stored · metadata complete · linked to REC-1026');toast(id+' '+(LANG==='ar'?'رُفع — البصمة محسوبة والميتاداتا كاملة':'uploaded — hash stored, metadata complete'));render();}
VIEWS['data/evid']=()=>pageHead(t('evid'),LANG==='ar'?'الدليل كائن: ميتاداتا، بصمة SHA-256، صلاحية، روابط متعددة، استبدال بلا حذف.':'Evidence is an object: metadata, SHA-256, validity, many-to-many links, supersede-never-delete.',
 `<button class="btn" onclick="drawer('${LANG==='ar'?'رفع دليل':'Upload evidence'}',evidForm(),evidFoot())">＋ ${LANG==='ar'?'رفع دليل':'Upload'}</button>`,'Data & Evidence › Evidence Library')+
 `<div class="card">${toolbar(`<select><option>${LANG==='ar'?'كل الأنواع':'All types'}</option><option>Invoice</option><option>Meter/Log</option><option>Factor source</option></select>`)}
 <table class="tbl"><thead><tr><th>ID</th><th>${LANG==='ar'?'المستند':'Document'}</th><th>${LANG==='ar'?'النوع':'Type'}</th><th>${LANG==='ar'?'الفترة':'Period'}</th><th>SHA-256</th><th>${LANG==='ar'?'مرتبط بـ':'Linked to'}</th><th>${t('status')}</th></tr></thead><tbody>
 ${D.evidence.map(e=>`<tr><td><b>${e.id}</b></td><td>${esc(e.n)}</td><td>${e.type}</td><td>${e.period}</td><td style="font-family:monospace;font-size:11px">${e.hash}</td><td style="font-size:11.5px">${e.st==='superseded'?`superseded by <b>${e.sup}</b> — links moved, version preserved`:'records / findings'}</td><td>${e.st==='superseded'?st('locked','Superseded'):st('approved','Linked')}</td></tr>`).join('')}
 </tbody></table>${pager(D.evidence.length)}</div>`;
function evidFoot(){return `<button class="btn sec" onclick="closeDrawer()">${t('cancel')}</button><button class="btn" onclick="evidSave()">${LANG==='ar'?'رفع وربط':'Upload & link'}</button>`}

/* ----: Calculation Runs & Lineage workspace (D-07/D-08) ---- */
D.runs=[
 {id:'RUN-2210',method:'CALC-GHG-S2-LOC v1',inputs:11,factor:'EF-EG-ELEC-2025 v1',out:'649.2 tCO2e',at:'2026-02-05 14:10',by:'system',rev:'O. Farid',st:'review',note:'in-flight recalculation (11/12 inputs; Dec returned) — NOT the approved lineage; approved = CV-ENV-GHG-003-FY2025-v3'},
 {id:'RUN-2188',method:'CALC-ENE-INT v1',inputs:14,factor:'—',out:'3.1 MWh/t',at:'2026-01-28 09:00',by:'system',rev:'O. Farid',st:'stale',note:'Superseded by restatement RST-2026-001'},
 {id:'RUN-2245',method:'CALC-ENE-INT v1',inputs:14,factor:'—',out:'3.04 MWh/t',at:'2026-02-06 16:22',by:'system',rev:'—',st:'submitted',note:'Awaiting technical review'},
 {id:'RUN-2101',method:'CALC-GHG-S1-DIESEL v1',inputs:9,factor:'EF-DIESEL-2025 v1',out:'48.24 tCO2e',at:'2026-01-15 10:02',by:'system',rev:'O. Farid',st:'superseded',note:'record-level run (single month, method v1) — superseded; the FY approved lineage is CV-ENV-GHG-001-FY2025-v3'},
 {id:'RUN-2102',method:'CALC-OHS-LTIFR v1',inputs:2,factor:'—',out:'2.95 /M hrs',at:'2026-01-20 11:30',by:'system',rev:'M. Adel',st:'approved'}
];
function runDetail(id){const r=D.runs.find(x=>x.id===id);return `<div class="kv">
 <dt>Method</dt><dd>${r.method} ${pv('reuse','registry · worked example self-test ✓','#/adm/aconf')}</dd>
 <dt>Formula</dt><dd style="font-weight:400"><code>Σ monthly kWh × grid_factor ÷ 1000</code></dd>
 <dt>Inputs (${r.inputs})</dt><dd style="font-weight:400">approved records — each pinned to its version (e.g. REC-1024 v1 · 120,000 kWh · Oct)</dd>
 <dt>Factor</dt><dd>${r.factor==='—'?'—':r.factor+' · approved Dr. H. Nassar'}</dd>
 <dt>Unit conversion</dt><dd style="font-weight:400">kgCO2e → tCO2e ÷1000 (family: ghg · trace recorded)</dd>
 <dt>Output</dt><dd>${r.out}</dd>
 <dt>Executed</dt><dd style="font-weight:400">${r.at} · by ${r.by}</dd>
 <dt>Reviewer</dt><dd>${r.rev}</dd>
 <dt>Status</dt><dd>${st(r.st)}</dd></div>
 <div class="inspector" style="margin-top:14px"><h4>🔍 Lineage (D-08)</h4><div class="ichain">
 <div><b>Output</b> ${r.out} → bound to §5.1 token / TBL-07</div>
 <div><b>Calculation</b> ${r.id} · ${r.method}</div>
 <div><b>Factor</b> ${r.factor}</div>
 <div><b>Records</b> ${r.inputs} approved (versions pinned)</div>
 <div><b>Evidence</b> EV-0019, EV-0021 … (hashes ✓)</div>
 <div><b>People</b> contributor → dept reviewer → technical reviewer</div>
 <div><b>Boundary</b> in-scope sites only (VR-SIT-002)</div></div></div>`}
VIEWS['data/calcruns']=()=>pageHead(t('calcruns'),LANG==='ar'?'كل تشغيلة: المدخلات بنسخها، المعادلة، المعامِل بنسخته، التحويل، المخرَج، المنفّذ والمراجع — وإعادة التشغيل تنشئ تشغيلة جديدة، لا تعدّل قديمة.':'Every run: inputs with versions, formula, factor version, conversion, output, executor and reviewer — Recalculate creates a NEW run, never edits an old one.',
 `<button class="btn" onclick="D.runs.unshift({id:'RUN-'+(2250+D.runs.length),method:'CALC-GHG-S2-LOC v1',inputs:12,factor:'EF-EG-ELEC-2025 v1',out:'651.0 tCO2e',at:'2026-02-07 10:00',by:'system',rev:'—',st:'submitted',note:'Recalculation'});audit('calculation.run','RUN new','12 inputs · factor v1');toast('${LANG==='ar'?'تشغيلة جديدة أُنشئت — بانتظار المراجعة':'New run created — awaiting review'}');render()">↻ ${LANG==='ar'?'إعادة الحساب':'Recalculate'}</button>`,'Data & Evidence › Calculation Runs (D-07/D-08)')+
 `<div class="tiles">${tile(D.runs.length,'Runs')}${tile(D.runs.filter(r=>r.st==='approved').length,LANG==='ar'?'معتمدة':'Approved','ok')}${tile(D.runs.filter(r=>r.st==='stale').length,'STALE','warn')}${tile('100%',LANG==='ar'?'اكتمال النسب':'Lineage completeness','ok')}</div>
 <div class="card"><div class="hd">${LANG==='ar'?'سلاسل الحساب المعتمدة — CalculationVersions (غير قابلة للتغيير)':'Approved calculation lineage — immutable CalculationVersions'} <span class="sub" data-noar>CV.output ≡ ApprovedDatapointVersion.value ≡ report value — enforced (TC-INT-15)</span></div>
 <table class="tbl"><thead><tr><th>CV</th><th>KPI</th><th>Method</th><th>Factors</th><th>Inputs</th><th>Output</th><th>ADV</th><th>${t('status')}</th></tr></thead><tbody>
 ${Object.values(D.calcVers).map(c=>`<tr><td data-noar><b>${c.id}</b></td><td data-noar>${c.kpi}</td><td style="font-size:11.5px" data-noar>${esc(c.methodVer)}</td><td style="font-size:11.5px" data-noar>${esc(c.factorVersionIds.join(', '))}</td><td>${c.inputs}</td><td data-noar><b>${c.output} ${esc(c.unit)}</b></td><td data-noar style="font-size:11px">${(advGet(c.kpi,c.per)||{}).id||''}</td><td>${st('approved','Approved 🔒')}</td></tr>`).join('')}
 </tbody></table></div>
 <div class="card"><table class="tbl"><thead><tr><th>Run</th><th>${LANG==='ar'?'الطريقة':'Method'}</th><th>${LANG==='ar'?'مدخلات':'Inputs'}</th><th>${LANG==='ar'?'المعامِل':'Factor'}</th><th>${LANG==='ar'?'المخرَج':'Output'} ƒx</th><th>${LANG==='ar'?'نُفذت':'Executed'}</th><th>${LANG==='ar'?'المراجع':'Reviewer'}</th><th>${t('status')}</th><th></th></tr></thead><tbody>
 ${D.runs.map(r=>`<tr><td><b>${r.id}</b>${r.note?`<div style="font-size:10.5px;color:var(--mut)">${esc(r.note)}</div>`:''}</td><td style="font-size:12px">${r.method}</td><td>${r.inputs}</td><td style="font-size:12px">${r.factor}</td><td><b>${r.out}</b></td><td style="font-size:11.5px">${r.at}</td><td>${r.rev}</td><td>${st(r.st)}</td><td class="rowActs"><a onclick="drawer('${LANG==='ar'?'تفاصيل التشغيلة':'Run detail'} — ${r.id}',runDetail('${r.id}'))">${t('open')}</a>${r.st==='submitted'&&(ROLE==='TREV'||ROLE==='PM')?`<a onclick="D.runs.find(x=>x.id==='${r.id}').st='approved';D.runs.find(x=>x.id==='${r.id}').rev='O. Farid';audit('calculation.review','${r.id}','approved');toast('Run approved');render()">${t('approve')}</a>`:''}</td></tr>`).join('')}
 </tbody></table></div>`;

/* ----: Materiality closure — engagement plan, divergence, sector reconciliation, ranking decisions, MDR-07 ---- */
VIEWS['mat/engage']=()=>pageHead(t('engage'),LANG==='ar'?'خطة ← سجلات ← تغذية التأثيرات. القلق المسجل هنا ينشئ تأثيرًا بأصله المربوط مسبقًا.':'Plan → records → impact feed. A concern recorded here can create an impact with its origin pre-linked.',
 `<button class="btn sec" onclick="drawer('${LANG==='ar'?'إضافة بند خطة مشاركة':'Add engagement plan item'}',engPlanForm())">＋ ${LANG==='ar'?'بند خطة':'Plan item'}</button>
  <button class="btn" onclick="drawer('${LANG==='ar'?'تسجيل مشاركة':'Record engagement'}',engForm())">＋ ${LANG==='ar'?'سجل مشاركة':'Record engagement'}</button>`,'Materiality › Engagement (C-04 + C-05)')+
 `<div class="card"><div class="hd">${LANG==='ar'?'خطة المشاركة':'Engagement Plan'} <span class="sub">C-04 · 4 ${LANG==='ar'?'مخطط':'planned'} · 3 ${LANG==='ar'?'منفذ':'done'}</span></div>
 <table class="tbl"><thead><tr><th>${LANG==='ar'?'صاحب المصلحة':'Stakeholder'}</th><th>${LANG==='ar'?'الهدف':'Objective'}</th><th>${LANG==='ar'?'الطريقة':'Method'}</th><th>${LANG==='ar'?'التاريخ المخطط':'Planned'}</th><th>${t('who')}</th><th>${LANG==='ar'?'المخرَج المتوقع':'Expected output'}</th><th>${t('status')}</th></tr></thead><tbody>
 <tr><td>Quarry community</td><td>${LANG==='ar'?'مخاوف الغبار والتوسع':'Dust & expansion concerns'}</td><td>Consultation</td><td>2025-11-14</td><td>N. Fouad</td><td>Concern list + impacts</td><td>${st('approved','Done → ENG-02')}</td></tr>
 <tr><td>Community elders</td><td>${LANG==='ar'?'المراعي وسبل العيش':'Grazing & livelihoods'}</td><td>Consultation</td><td>2025-12-09</td><td>N. Fouad</td><td>Impact evidence</td><td>${st('approved','Done → ENG-03')}</td></tr>
 <tr><td>Grid off-taker</td><td>Curtailment & jobs</td><td>Quarterly review</td><td>2025-10-02</td><td>Layla</td><td>Minutes</td><td>${st('approved','Done → ENG-01')}</td></tr>
 <tr><td>Own workforce</td><td>${LANG==='ar'?'مسح سنوي':'Annual survey'}</td><td>Survey</td><td>2026-02-20</td><td>K. Mansour</td><td>Survey results (isolated from significance)</td><td>${st('progress','Planned')}</td></tr>
 </tbody></table></div>
 <div class="card"><div class="hd">${LANG==='ar'?'سجلات المشاركة':'Engagement Records'} <span class="sub">C-05 · evidence-backed</span></div><table class="tbl"><thead><tr><th>ID</th><th>${LANG==='ar'?'صاحب المصلحة':'Stakeholder'}</th><th>${LANG==='ar'?'الطريقة':'Method'}</th><th>${LANG==='ar'?'التاريخ':'Date'}</th><th>${LANG==='ar'?'المخاوف الرئيسية':'Key concerns'}</th><th>${LANG==='ar'?'أنشأ تأثيرات':'Fed impacts'}</th><th>${LANG==='ar'?'الدليل':'Evidence'}</th></tr></thead><tbody>
 <tr><td>ENG-01</td><td>Grid off-taker</td><td>Quarterly review</td><td>2025-10-02</td><td>Curtailment transparency; local jobs</td><td><a href="#/mat/impacts">IM-08</a></td><td><span class="ev">📎 minutes</span></td></tr>
 <tr><td>ENG-02</td><td>Quarry community</td><td>Consultation</td><td>2025-11-14</td><td>Dust, blasting hours, road safety</td><td><a href="#/mat/impacts">IM-03, IM-12</a></td><td><span class="ev">📎 minutes + attendance</span></td></tr>
 <tr><td>ENG-03</td><td>Community elders</td><td>Consultation</td><td>2025-12-09</td><td>Grazing-land access near expansion</td><td><a href="#/mat/impacts">IM-06</a></td><td><span class="ev">📎 minutes</span></td></tr>
 </tbody></table></div>`;
function engPlanForm(){return `<div class="formGrid">
 ${sect('Plan','الخطة','C-04')}
 ${field({label:'Stakeholder',req:1,type:'select',opts:['Quarry community','Own workforce','O&M contractors','Lenders','Regulator'],pv:{k:'reuse',t:'from C-03',l:'#/mat/stake'}})}
 ${field({label:'Purpose / objective',req:1,ph:'What we need to learn / resolve'})}
 ${field({label:'Issues to raise',req:1,ph:'from C-02 context register',pv:{k:'reuse',t:'C-02',l:'#/mat/context'}})}
 ${field({label:'Engagement type',req:1,type:'select',opts:['Consultation','Survey','Focus group','Committee','Interview']})}
 ${field({label:'Method / channel',type:'select',opts:['In-person','Online','Hybrid']})}
 ${field({label:'Frequency',type:'select',opts:['One-off','Quarterly','Annual']})}
 ${field({label:'Planned date',req:1,type:'date'})}
 ${sect('People','الأشخاص','')}
 ${field({label:'Owner',req:1,type:'select',opts:['N. Fouad','K. Mansour','Layla Al-Harbi']})}
 ${field({label:'Participants',ph:'groups / counts'})}
 ${sect('Instrument','الأداة','')}
 ${field({label:'Questions / discussion guide',type:'area',full:1,help:'The questions to be asked — versioned with the plan.'})}
 ${field({label:'Expected output',req:1,ph:'e.g. concern list feeding impact register'})}
 ${field({label:'Evidence requirement',req:1,type:'select',opts:['Minutes + attendance','Survey export','Recording + summary'],full:1})}
 ${field({label:'Status',value:'Planned · v1',ro:1})}</div>`}

D.divergences=[
 {id:'DIV-01',topic:'Water stewardship',a:'Stakeholder view: basin stress = top-3 concern (survey #2)',b:'Management view: permits secured, low priority',diff:'Priority gap (2 ranks)',res:'',st:'open'},
 {id:'DIV-02',topic:'Biodiversity',a:'Sector expectation: GRI 14 likely-material',b:'Technical view: below threshold at all sites (ecology screening)',diff:'Sector vs internal',res:'Explained not material — evidence: ecology screening 2025; approved O. Farid',st:'resolved'}
];
VIEWS['mat/diverge']=()=>pageHead(t('diverge'),LANG==='ar'?'حيث تتباعد رؤية أصحاب المصلحة / الإدارة / الفني / القطاع جوهريًا — تسوية مضبوطة بدليل وقرار مُسمّى.':'Where stakeholder / management / technical / sector views materially differ — a controlled reconciliation with evidence and a named decision.',
 '','Materiality › Divergence (C-08)')+
 `<div class="tiles">${tile(D.divergences.length,'Divergences')}${tile(D.divergences.filter(d=>d.st==='open').length,LANG==='ar'?'مفتوحة — تحجب G4':'Open — blocks G4','err')}${tile(D.divergences.filter(d=>d.st==='resolved').length,LANG==='ar'?'مسواة':'Resolved','ok')}</div>
 <div class="card"><table class="tbl"><thead><tr><th>ID</th><th>${LANG==='ar'?'الموضوع':'Topic'}</th><th>${LANG==='ar'?'الموقف أ':'Position A'}</th><th>${LANG==='ar'?'الموقف ب':'Position B'}</th><th>${LANG==='ar'?'الفرق':'Difference'}</th><th>${t('status')}</th><th></th></tr></thead><tbody>
 ${D.divergences.map(d=>`<tr><td><b>${d.id}</b></td><td>${esc(d.topic)}</td><td style="font-size:12px">${esc(d.a)}</td><td style="font-size:12px">${esc(d.b)}</td><td style="font-size:12px">${esc(d.diff)}</td><td>${st(d.st==='open'?'open':'approved',d.st)}</td><td class="rowActs">${d.st==='open'?`<a onclick="drawer('${LANG==='ar'?'تسوية':'Resolve'} — ${d.id}',divForm('${d.id}'),divFoot('${d.id}'))">${LANG==='ar'?'تسوية':'Resolve'}</a>`:`<a onclick="toast('${esc(d.res)}')">${t('view')}</a>`}</td></tr>`).join('')}
 </tbody></table></div>`;
function divForm(id){const d=D.divergences.find(x=>x.id===id);return `<div class="kv" style="margin-bottom:14px"><dt>Position A</dt><dd style="font-weight:400">${esc(d.a)}</dd><dt>Position B</dt><dd style="font-weight:400">${esc(d.b)}</dd></div><div class="formGrid">
 ${field({label:'Resolution',req:1,type:'select',opts:['Adopt A (stakeholder priority)','Adopt B (management)','Blended position','Escalate to Methodology Owner']})}
 ${field({label:'Decision owner',req:1,type:'select',opts:['O. Farid (Technical Reviewer)','Layla Al-Harbi (PM)']})}
 ${field({label:'Rationale',req:1,type:'area',full:1})}
 ${field({label:'Evidence',full:1,ph:'link ecology study / survey export'})}</div>`}
function divFoot(id){return `<button class="btn sec" onclick="closeDrawer()">${t('cancel')}</button><button class="btn" onclick="const d=D.divergences.find(x=>x.id==='${id}');d.st='resolved';d.res='Resolved — recorded with rationale + evidence';closeDrawer();audit('materiality.divergence','${id}','resolved · approval recorded');toast('Resolved — G4 unblocks when all divergences close');render()">${LANG==='ar'?'اعتماد التسوية':'Approve resolution'}</button>`}

D.sectopics=[
 {n:'Biodiversity (GRI 14 candidate)',src:'GRI 14 Mining 2024',ev:'Ecology screening 2025',st:'explained',note:'Below threshold all sites; rehabilitation under MT-05'},
 {n:'Tailings & mineral waste',src:'GRI 14',ev:'Waste register',st:'confirmed',note:'Merged into MT-01/MT-05 scope'},
 {n:'Artisanal & small-scale mining interface',src:'GRI 14',ev:'—',st:'pending',note:''},
 {n:'Mine closure & rehabilitation',src:'GRI 14',ev:'Closure plan draft',st:'pending',note:''}
];
VIEWS['mat/secrec']=()=>pageHead(t('secrec'),LANG==='ar'?'كل موضوع مرجّح الجوهرية من معيار القطاع: تأكيد أو شرح عدم الجوهرية أو إضافة كمرشح أو تصعيد — لا إسقاط صامت أبدًا.':'Every sector likely-material topic: Confirm, Explain not material, Add candidate, or Escalate — never silently dropped.',
 '','Materiality › Sector Reconciliation (C-10)')+
 `<div class="tiles">${tile(D.sectopics.length,LANG==='ar'?'موضوعات القطاع':'Sector topics')}${tile(D.sectopics.filter(x=>x.st==='pending').length,LANG==='ar'?'بانتظار القرار — تحجب G4':'Pending — blocks G4',D.sectopics.some(x=>x.st==='pending')?'err':'ok')}${tile(D.sectopics.filter(x=>x.st!=='pending').length,LANG==='ar'?'محسومة':'Decided','ok')}</div>
 <div class="card"><table class="tbl"><thead><tr><th>${LANG==='ar'?'الموضوع المتوقع من القطاع':'Sector expected topic'}</th><th>${LANG==='ar'?'المصدر':'Source'}</th><th>${LANG==='ar'?'دليل داخلي':'Internal evidence'}</th><th>${LANG==='ar'?'القرار':'Decision'}</th><th></th></tr></thead><tbody>
 ${D.sectopics.map((x,i)=>`<tr><td><b>${esc(x.n)}</b>${x.note?`<div style="font-size:11px;color:var(--mut)">${esc(x.note)}</div>`:''}</td><td>${x.src}</td><td>${x.ev}</td><td>${x.st==='confirmed'?st('approved','Confirmed'):x.st==='explained'?st('na','Explained not material'):st('pending','Pending')}</td>
 <td class="rowActs">${x.st==='pending'?`<a onclick="secDecide(${i},'confirmed')">Confirm</a><a onclick="drawer('${LANG==='ar'?'شرح عدم الجوهرية':'Explain not material'}',secExpForm(${i}),secExpFoot(${i}))">${LANG==='ar'?'شرح':'Explain'}</a><a onclick="secDecide(${i},'candidate')">＋ Candidate</a><a onclick="audit('materiality.escalate','${esc(x.n)}','to Methodology Owner');toast('Escalated to Methodology Owner — task created')">Escalate</a>`:'—'}</td></tr>`).join('')}
 </tbody></table></div>`;
function secDecide(i,how){const x=D.sectopics[i];x.st=how==='candidate'?'confirmed':how;x.note=how==='candidate'?'Added as topic candidate → ranking':'Confirmed';audit('materiality.sector',x.n,how);toast(how==='candidate'?'Added to ranking as candidate':'Confirmed');render()}
function secExpForm(i){return `<div class="formGrid">${field({label:'Rationale',req:1,type:'area',full:1,ph:'Why this sector topic is not material for us'})}${field({label:'Evidence',req:1,full:1,ph:'link study / screening'})}${field({label:'Decided by',value:'O. Farid — stamped from actor',pv:{k:'der',t:'derived'},full:1})}</div>`}
function secExpFoot(i){return `<button class="btn sec" onclick="closeDrawer()">${t('cancel')}</button><button class="btn" onclick="D.sectopics[${i}].st='explained';D.sectopics[${i}].note='Explained not material — appears in materiality report exclusions';closeDrawer();audit('materiality.sector',D.sectopics[${i}].n,'explained not material');toast('Recorded — will appear in C-14 exclusions');render()">${LANG==='ar'?'تسجيل':'Record'}</button>`}

/* ranking with real decision controls */
VIEWS['mat/ranking']=()=>{
 const pend=D.divergences.some(d=>d.st==='open')||D.sectopics.some(x=>x.st==='pending');
 return pageHead(t('ranking'),LANG==='ar'?'قرار لكل موضوع: جوهري / غير جوهري / يحتاج مراجعة — مع مبرر. الإرسال للحوكمة يقفل فقط عندما تكتمل القرارات والتسويات.':'A decision per topic: Material / Not material / Needs review — with rationale. Send to governance unlocks only when all decisions, divergences and sector topics are closed.',
 `<button class="btn" ${pend?'disabled title="Blocked: open divergence / pending sector topic"':''} onclick="nav('mat/approval')">${LANG==='ar'?'إرسال للحوكمة':'Send to governance'} →</button>`,'Materiality › Ranking (C-11)')+
 (pend?`<div class="notice warn"><b>${LANG==='ar'?'محجوب':'Blocked'}:</b> ${D.divergences.filter(d=>d.st==='open').length} ${LANG==='ar'?'تسوية مفتوحة':'open divergence'} · ${D.sectopics.filter(x=>x.st==='pending').length} ${LANG==='ar'?'موضوع قطاع معلق':'pending sector topics'} — <a href="#/mat/diverge">${t('diverge')}</a> · <a href="#/mat/secrec">${t('secrec')}</a></div>`:'')+
 `<div class="card"><div class="hd">${LANG==='ar'?'الموضوعات المرشحة':'Candidate topics'} <span class="sub">threshold ${pv('reuse','TM-ACME-2025 v1.2','#/mat/config')}</span></div>
 <table class="tbl"><thead><tr><th>${LANG==='ar'?'الموضوع':'Topic'}</th><th>P</th><th>${LANG==='ar'?'التأثيرات':'Impacts'}</th><th>${LANG==='ar'?'الدلالة':'Significance'} ƒx</th><th>GRI</th><th>${LANG==='ar'?'القرار':'Decision'}</th><th>${LANG==='ar'?'المبرر':'Rationale'}</th></tr></thead><tbody>
 ${D.topics.map(tp=>`<tr><td><b>${esc(tp.n)}</b>${tp.hr?' ⚖':''}</td><td>${tp.p}</td><td><a href="#/mat/impacts">${tp.imp}</a></td><td>${pv('calc',tp.sig,'')}</td><td style="font-size:11.5px">${tp.gri}</td>
 <td><select style="width:auto;padding:4px 8px;font-size:12px" onchange="audit('materiality.decision','${tp.id}',this.value);toast('${tp.id}: '+this.value+' — rationale required on change')"><option>Material</option><option>Not material</option><option>Needs review</option></select></td>
 <td><a onclick="drawer('${LANG==='ar'?'مبرر القرار':'Decision rationale'} — ${tp.id}',rankRatForm('${tp.id}'))">${LANG==='ar'?'تحرير':'edit'}</a></td></tr>`).join('')}
 </tbody></table></div>
 <div class="card"><div class="hd">${LANG==='ar'?'موضوعات مستبعدة':'Excluded topics'} <span class="sub">${LANG==='ar'?'تظهر في تقرير الجوهرية بأسبابها':'appear in the materiality report with reasons'}</span></div><table class="tbl"><tbody>
 ${D.excluded.map(e=>`<tr><td><b>${esc(e.n)}</b></td><td style="font-size:12px">${esc(e.reason)}</td><td>${st('na','Not material')}</td></tr>`).join('')}
 </tbody></table></div>`};
function rankRatForm(id){return `<div class="formGrid">${field({label:'Decision rationale',req:1,type:'area',full:1,ph:'Impact evidence, thresholds, stakeholder input considered…'})}${field({label:'Evidence links',full:1,ph:'IM-xx · assessments'})}</div>`}

/* MDR-07 explicit closure in config */

/* ----: Review Workbench — two real modes (Department vs Technical) ---- */
let RWB_MODE=null;
VIEWS['rev/rwb']=()=>{
 const mode=RWB_MODE||(ROLE==='TREV'?'tech':'dept');
 const deptCk=[['Source document matches value (invoice ↔ meter)',1],['Completeness for the period (no missing months)',1],['Evidence attached and legible',0],['Site & period correct (VR-SIT/PER)',1],['Plausibility vs prior period (+28% explained?)',0],['Estimation basis documented (if estimated)',1]];
 const techCk=[['GRI requirement satisfied at datapoint grain',1],['Methodology per approved Calculation Book',1],['Calculation run reviewed · factor edition correct',0],['Boundary consistency (in-scope site, part-period rule)',1],['Cross-disclosure consistency (302-1 ↔ 305-x)',0],['Materiality linkage correct (topic ↔ disclosure)',1]];
 const ck=mode==='dept'?deptCk:techCk;
 return pageHead(t('rwb'),LANG==='ar'?'منضدة واحدة بوضعين حقيقيين: مراجعة الإدارة (المصدر والاكتمال والأدلة) والمراجعة الفنية (GRI والمنهجية والحسابات والحدود) — على نفس السجل المعتمد، لا نسخ.':'One workbench, two real modes: Department review (source, completeness, evidence) and Technical review (GRI, methodology, calculations, boundary) — over the same authoritative record, never a copy.',
 `<div class="tabs" style="margin:0;border:none"><button class="${mode==='dept'?'on':''}" onclick="RWB_MODE='dept';render()">${LANG==='ar'?'مراجعة الإدارة':'Department review'} <span class="b">8</span></button><button class="${mode==='tech'?'on':''}" onclick="RWB_MODE='tech';render()">${LANG==='ar'?'المراجعة الفنية':'Technical review'} <span class="b">3</span></button></div>`,'Review › Workbench (E-01 / E-02)')+
 `<div class="wb"><div class="queue"><div class="qh">${mode==='dept'?(LANG==='ar'?'قائمة الإدارة':'Department queue'):(LANG==='ar'?'القائمة الفنية':'Technical queue')}</div>
 ${(mode==='dept'?[['REC-1025','305-2 Nov · EG-CEM-01','review'],['REC-1040','303-3 Q4 · estimated','submitted'],['REC-1055','403-9 · variance +28%','review']]:[['REC-1024','305-2 Oct · calc chain','review'],['RUN-2245','Energy intensity recalc','submitted'],['2-8','GRI 2 · blocked by finding','blocked']]).map(([id,n,s],i)=>`<div class="qi ${i===0?'active':''}"><b>${id}</b> · ${n}<div class="m"><span></span>${st(s)}</div></div>`).join('')}
 <div class="qh" style="border-top:1px solid var(--line2)">${LANG==='ar'?'إجراءاتي':'My throughput'}</div>
 <div class="qi" style="cursor:default;font-size:11.5px;color:var(--mut)">${mode==='dept'?'Approved this week: 12 · Returned: 2':'Approved: 6 · Findings raised: 2 · Cross-checks: 1 open'}</div>
 </div><div>
 <div class="card" style="margin:0"><div class="hd">${mode==='dept'?'REC-1025 · 305-2 Purchased electricity · Nov 2025':'REC-1024 · 305-2 · Oct + calculation chain'} <span class="sub">${mode==='dept'?'contributor F. Said → dept review (M. Adel)':'dept-approved → technical review (O. Farid)'}</span><div class="actions">${st('review','Under review')}</div></div>
 <div class="bd">
 <div class="tabs">${['Data','Evidence','Calculation','Validation','Prior period','History'].map((x,i)=>`<button class="${i===0?'on':''}" onclick="toast('${x} panel')">${x}</button>`).join('')}</div>
 <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:16px">
 <div><div class="kv">
 ${mode==='dept'?`<dt>Submitted value</dt><dd>131,400 kWh</dd><dt>Definition</dt><dd style="font-weight:400">Purchased electricity · kWh · monthly · meter/invoice ${pv('reuse','Dictionary','#/data/catalog')}</dd><dt>Material topic / GRI</dt><dd>MT-01 · GRI 305-2-a</dd><dt>Entity / Site / Boundary</dt><dd>Acme Materials Egypt · EG-CEM-01 · in scope ✓</dd><dt>Owner / Contributor</dt><dd>S. Tawfik · F. Said</dd><dt>Source</dt><dd>Utility invoice (system: utilities register)</dd><dt>Evidence</dt><dd><span class="ev">📎 EV-0021 invoice Nov</span> <span class="ev">📎 meter photo Nov</span></dd><dt>Prior period / variance</dt><dd>Nov 2024: 124,100 kWh · <b>+5.9%</b> (below threshold)</dd><dt>Validation</dt><dd>4 PASS · 0 blockers ⚙</dd><dt>Completeness</dt><dd>11/12 months entered — Dec pending</dd><dt>Estimation</dt><dd>Not estimated</dd><dt>Related findings</dt><dd>— none open on this record</dd><dt>SoD ⚙</dt><dd>Reviewer ≠ contributor ✓ (user IDs)</dd><dt>Comments</dt><dd style="font-weight:400">Contributor note: November spike = kiln maintenance restart.</dd>`
 :`<dt>Submitted value</dt><dd>120,000 kWh → 54.96 tCO2e ƒx</dd><dt>Definition</dt><dd style="font-weight:400">Scope 2 location-based · CALC-GHG-S2-LOC v1 ${pv('reuse','Calc Book','#/data/calcruns')}</dd><dt>Material topic / GRI</dt><dd>MT-01 · GRI 305-2-a</dd><dt>Run</dt><dd><a href="#/data/calcruns">RUN-2210</a> · CALC-GHG-S2-LOC v1</dd><dt>Factor</dt><dd>EF-EG-ELEC-2025 · edition 2025 ✓ · frozen-factor rule ✓</dd><dt>Boundary</dt><dd>EG-CEM-01 in scope · operational control ✓</dd><dt>Prior / variance</dt><dd>Oct 2024: 49.9 tCO2e · +10.1% — explained</dd><dt>Validation</dt><dd>VR suite PASS · dual Scope-2 never aggregated ✓</dd><dt>Related findings</dt><dd>— none</dd><dt>Cross-check</dt><dd style="color:var(--warn)">302-1 site split incomplete — <a href="#/rev/xchk">open</a></dd>`}
 </div>
 <div class="formGrid" style="margin-top:10px">${field({label:mode==='dept'?'Decision':'Technical decision',req:1,type:'select',opts:['Approve','Return for correction','Raise finding'],value:'Approve'})}${field({label:'Return reason (≥15 words when returning)',type:'area',full:1,help:'TRN-D06 — mandatory comment on every return; written to the record timeline.'})}</div></div>
 <div class="card" style="margin:0"><div class="hd" style="font-size:12.5px">${mode==='dept'?(LANG==='ar'?'قائمة فحص مراجعة الإدارة':'Department review checklist'):(LANG==='ar'?'قائمة الفحص الفنية':'Technical review checklist')}</div><div class="bd ckl">
 ${ck.map(([c,done])=>`<label class="ck"><input type="checkbox" ${done?'checked':''}> <span>${esc(c)}</span></label>`).join('')}
 </div></div></div>
 </div>
 <div style="display:flex;gap:8px;justify-content:flex-end;padding:12px 16px;border-top:1px solid var(--line2)">
 <button class="btn danger" onclick="toast('Raise finding drawer — owner, action, due prefilled')">${t('raiseFinding')}</button>
 <button class="btn warn" onclick="drawer(t('return'),retForm(),retFoot())">${t('return')}</button>
 <button class="btn" onclick="toast('${mode==='dept'?'Dept-approved → Technical review queue':'Technically approved (version-bound) — authoritative'} · audited')">${t('approve')}</button></div></div>
 </div></div>`+`<div class="quickRow">🕘 ${LANG==='ar'?'افتح الخط الزمني الكامل للسجل قيد المراجعة':'Open the full timeline of the record under review'}: <a href="#/data/record" data-noar>REC-1055 →</a></div>`};

/* ----: Compliance dashboard (E-08 explicit) ---- */
VIEWS['rev/cdash']=()=>{const req=reqStats(),gp=gateStats();
 return pageHead(t('cdash'),LANG==='ar'?'صورة الامتثال الكاملة: المتطلبات التسعة، البوابات، الحذف، الملاحظات حسب المصدر — كل رقم ينقر إلى شاشته.':'The compliance picture: nine requirements, gates, omissions, findings by source — every number drills to its surface.',
 '','Compliance › Dashboard (E-08)')+
 `<div class="tiles">${tile(req+'/9',LANG==='ar'?'متطلبات GRI':'GRI requirements',req<9?'warn':'ok','rev/claim')}${tile(gp+'/15',LANG==='ar'?'البوابات':'Gates',gp<15?'warn':'ok','rev/pgate')}${tile(D.findings.filter(f=>f.st==='open').length,LANG==='ar'?'ملاحظات مفتوحة':'Open findings','err','rev/findings')}${tile(D.omissions.filter(o=>o.st!=='approved').length,LANG==='ar'?'حذف معلق':'Omissions pending','warn','rev/oapp')}${tile('2',LANG==='ar'?'صفوف فهرس ناقصة':'Index gaps','warn','rev/cidx')}${tile('1',LANG==='ar'?'ملاحظة تأكيد':'Assurance finding','warn','rev/findings')}</div>
 <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
 <div class="card"><div class="hd">${LANG==='ar'?'المتطلبات التسعة':'Nine requirements'}</div><div class="bd">${reqRows().map(r=>`<div class="gateRow"><span class="gid">Req ${r.n}</span><div style="flex:1;font-size:12.5px">${esc(r.t)}</div><span class="st ${r.st}">${r.st.toUpperCase()}</span></div>`).join('')}</div></div>
 <div class="card"><div class="hd">${LANG==='ar'?'الملاحظات حسب المصدر':'Findings by source'}</div><div class="bd">
 ${['Technical review','Department review','GRI 2 assessment','Assurance'].map(src=>{const n=D.findings.filter(f=>f.src===src).length;return `<div class="gateRow"><div style="flex:1;font-size:12.5px">${src}</div><b>${n}</b></div>`}).join('')}
 <div style="margin-top:10px"><div class="prog"><i style="width:${Math.round(100*D.findings.filter(f=>f.st==='closed').length/D.findings.length)}%"></i></div><div style="font-size:11px;color:var(--mut);margin-top:4px">${LANG==='ar'?'نسبة الإغلاق':'Closure rate'}: ${Math.round(100*D.findings.filter(f=>f.st==='closed').length/D.findings.length)}%</div></div>
 </div></div></div>`};

/* ----: Content Index with real Builder/Preview tabs (E-09/E-10) ---- */
let CIDX_TAB='builder';
VIEWS['rev/cidx']=()=>pageHead(t('cidx'),LANG==='ar'?'يُولَّد من الانطباق والسجلات والحذف والربط — موقع النشر فقط قابل للتحرير.':'Generated from applicability, records, omissions and bindings — only the publication location is editable.',
 `<button class="btn sec" onclick="toast('Regenerated v4 — 2 location gaps remain (PG-13)')">↻ Regenerate</button><button class="btn" onclick="toast('Index XLSX exported — version stamped')">⬇ ${t('export')}</button>`,'Compliance › Content Index (E-09 / E-10)')+
 `<div class="tabs"><button class="${CIDX_TAB==='builder'?'on':''}" onclick="CIDX_TAB='builder';render()">Builder (E-09)</button><button class="${CIDX_TAB==='prev'?'on':''}" onclick="CIDX_TAB='prev';render()">Preview (E-10)</button></div>`+
 (CIDX_TAB==='builder'?
 `<div class="notice warn"><b>Statement of use (header):</b> “Acme Sustainable Industries Holding has reported <i>[pending eligibility]</i> for the period 1 Jan – 31 Dec 2025 …” — ${LANG==='ar'?'يُشتق من الادعاء المحسوب، لا يُكتب':'resolves from the computed claim; never typed'}.</div>
 <div class="card"><table class="tbl"><thead><tr><th>Standard</th><th>Disclosure</th><th>Title</th><th>${LANG==='ar'?'الموقع (قابل للتحرير)':'Location (editable)'}</th><th>${LANG==='ar'?'حذف':'Omission'}</th><th>${t('status')}</th></tr></thead><tbody>
 ${D.cidx.map(r=>`<tr><td style="font-size:11.5px">${r.std}</td><td><b>${r.dis}</b></td><td>${esc(r.t)}</td><td>${r.loc==='—'?`<input style="max-width:120px;padding:3px 8px" placeholder="§ / p." onchange="this.closest('td').nextElementSibling.nextElementSibling.innerHTML='${st('pending','Pending')}';toast('Location recorded — PG-13 re-evaluates')">`:r.loc}</td><td style="font-size:11.5px">${r.st==='omission'?esc(r.note):'—'}</td><td>${r.st==='bound'?st('approved','Bound'):r.st==='gap'?st('blocked','Gap · '+(r.note||'')):r.st==='stale'?st('stale','STALE'):st('pending','Pending')}</td></tr>`).join('')}
 </tbody></table></div>`
 :
 `<div class="card"><div class="bd" style="max-width:820px;margin:0 auto;background:#fff;padding:34px;font-family:Georgia,serif">
 <div style="border-bottom:3px solid var(--teal);padding-bottom:12px;margin-bottom:16px"><div style="font-size:20px;font-weight:700">GRI Content Index — Acme Sustainability Report 2025</div>
 <div style="font-size:12px;color:var(--mut);font-family:Inter,'Segoe UI'">Statement of use: pending computed claim · GRI 1: Foundation 2021 · Sector standard: GRI 14 (conditional)</div></div>
 <table style="width:100%;border-collapse:collapse;font-size:12.5px">
 <tr style="background:#f3f6f6"><th style="text-align:start;padding:8px;border:1px solid #ddd">GRI Standard</th><th style="text-align:start;padding:8px;border:1px solid #ddd">Disclosure</th><th style="text-align:start;padding:8px;border:1px solid #ddd">Location</th><th style="text-align:start;padding:8px;border:1px solid #ddd">Omission</th></tr>
 ${D.cidx.map(r=>`<tr><td style="padding:7px;border:1px solid #e5e5e5">${r.std}</td><td style="padding:7px;border:1px solid #e5e5e5"><b>${r.dis}</b> ${esc(r.t)}</td><td style="padding:7px;border:1px solid #e5e5e5">${r.st==='omission'?'—':r.loc}</td><td style="padding:7px;border:1px solid #e5e5e5;font-size:11.5px">${r.st==='omission'?esc(r.note):''}</td></tr>`).join('')}
 </table>
 <div style="font-size:11px;color:var(--mut);margin-top:12px;font-family:Inter">Preview checks: 2 rows missing location (blocks PG-13) · omission texts sourced from OMR register · every row backed by source records.</div>
 </div></div>`);

/* ----: REPORT STUDIO — real structure editor, narrative editor, chart builder, bilingual ---- */
D.sections=[
 {id:'S1',n:'About this report',owner:'Layla',req:true,st:'approved',lvl:0},
 {id:'S2',n:'Organization profile',owner:'Nour',req:true,st:'approved',lvl:0},
 {id:'S3',n:'Governance',owner:'Nour',req:true,st:'review',lvl:0},
 {id:'S4',n:'Stakeholders & materiality',owner:'Layla',req:true,st:'approved',lvl:0},
 {id:'S5',n:'Material topics',owner:'—',req:true,st:'review',lvl:0},
 {id:'S5.1',n:'Climate & energy (MT-01/02)',owner:'Nour',req:true,st:'review',lvl:1},
 {id:'S5.2',n:'Water (MT-03)',owner:'Nour',req:true,st:'draft',lvl:1},
 {id:'S5.3',n:'Safety (MT-04)',owner:'A. Qassem',req:true,st:'review',lvl:1},
 {id:'S5.4',n:'Communities (MT-05)',owner:'N. Fouad',req:true,st:'draft',lvl:1},
 {id:'S5.5',n:'Integrity (MT-06)',owner:'Y. Gaber',req:true,st:'draft',lvl:1},
 {id:'S6',n:'GRI Content Index',owner:'—',req:true,st:'pending',lvl:0},
 {id:'S7',n:'Statement of use',owner:'—',req:true,st:'pending',lvl:0},
 {id:'S8',n:'Assurance',owner:'—',req:true,st:'pending',lvl:0}
];
function moveSec(i,d){const a=D.sections;const j=i+d;if(j<0||j>=a.length)return;const t=a[i];a[i]=a[j];a[j]=t;audit('report.structure','reorder',t.id+' moved');render()}
VIEWS['rpt/rstruct']=()=>pageHead(t('rstruct'),LANG==='ar'?'الهيكل مُقترح من مصفوفة المصادر — أعد الترتيب، أضف أقسامًا مسموحة، أسند مالكين. العناصر الإلزامية لا تُحذف.':'Proposed from the Source Matrix — reorder, add permitted sections, assign owners. Required elements cannot be removed.',
 `<button class="btn" onclick="drawer('${LANG==='ar'?'إضافة قسم':'Add section'}',addSecForm(),addSecFoot())">＋ ${LANG==='ar'?'إضافة قسم':'Add section'}</button>`,'Report › Structure Editor (F-02)')+
 `<div class="card"><table class="tbl"><thead><tr><th style="width:80px">${LANG==='ar'?'ترتيب':'Order'}</th><th>§</th><th>${LANG==='ar'?'القسم':'Section'}</th><th>${LANG==='ar'?'المصدر':'Source'} ⚙</th><th>${t('who')}</th><th>${t('status')}</th><th></th></tr></thead><tbody>
 ${D.sections.map((s2,i)=>`<tr class="treeRow"><td><button class="btn sec" style="padding:2px 8px" onclick="moveSec(${i},-1)">↑</button> <button class="btn sec" style="padding:2px 8px" onclick="moveSec(${i},1)">↓</button></td><td><b>${s2.id.replace('S','')}</b></td><td style="padding-inline-start:${14+s2.lvl*26}px">${s2.lvl?'└ ':''}<span class="secDot ${s2.st}" title="${esc(s2.st)}"></span><a onclick="drawer(s2i='${s2.id}',secMeta('${s2.id}'))" style="font-weight:700">${esc(s2.n)}</a>${({'S3':1,'S5.1':2,'S5.3':1})[s2.id]?`<span class="cmtB" title="${LANG==='ar'?'تعليقات مراجعة مفتوحة':'open review comments'}">💬 ${({'S3':1,'S5.1':2,'S5.3':1})[s2.id]}</span>`:''} ${s2.req?'<span class="reqBadge">REQUIRED</span>':''}${s2.free?' <span class="pv der">free narrative — no numeric tokens</span>':''}</td><td style="font-size:11.5px">${s2.id.startsWith('S5.')?'frozen topic set':s2.id==='S6'?'generated index':s2.id==='S7'?'controlled':'approved objects'}</td>
 <td><select style="width:auto;padding:3px 8px;font-size:12px" onchange="D.sections[${i}].owner=this.value;audit('report.structure','${s2.id}','owner='+this.value);toast('Owner assigned')"><option ${s2.owner==='—'?'selected':''}>—</option>${['Layla','Nour','A. Qassem','N. Fouad','Y. Gaber'].map(o=>`<option ${s2.owner===o?'selected':''}>${o}</option>`).join('')}</select></td>
 <td>${st(s2.st)}</td>
 <td class="rowActs">${s2.req?`<a onclick="toast('${LANG==='ar'?'قسم إلزامي — إزالته تتطلب تغيير مجموعة الموضوعات أو المنهجية، لا زر حذف':'Required — removing it needs a topic-set/methodology change, not a delete key'}')">🔒</a>`:`<a onclick="D.sections.splice(${i},1);toast('Removed');render()">✕</a>`}</td></tr>`).join('')}
 </tbody></table></div>
 <div style="display:grid;grid-template-columns:2.2fr 1fr;gap:14px;margin-top:2px"><div></div>
 <div class="card" style="margin:0"><div class="hd" style="font-size:12px">${LANG==='ar'?'الشريط الأيمن — القسم المحدد':'Right rail — selected section'} <span class="sub">S5.1</span></div><div class="bd" style="font-size:12px">
 <b>💬 ${LANG==='ar'?'التعليقات':'Comments'} (2)</b><div style="color:var(--mut);margin:4px 0 8px">M. Adel: “Scope-2 market-based note needs the residual-mix source.” · Nour: “AR translation pending.”</div>
 <b>🗒 ${LANG==='ar'?'المهام':'Tasks'} (1)</b><div style="color:var(--mut);margin:4px 0 8px">Resolve residual-mix citation — due 20 Feb · L. Al-Harbi</div>
 <b>🔍 Source inspector</b><div style="color:var(--mut);margin:4px 0 8px">${(cvOf('ENV-GHG-003')||{}).id||'—'} · ${(cvOf('ENV-GHG-001')||{}).id||'—'} · Boundary v3 · Topic Set v2 — ${LANG==='ar'?'كل رقم مربوط؛ تغيّر المصدر ⇒ Stale':'every number bound; source change ⇒ Stale'}</div>
 <b>🧵 Traceability</b><div style="color:var(--mut);margin-top:4px">§5.1 ← 305-2 ← ENV-GHG-003/004 ← REC/RUN ← Evidence</div>
 </div></div></div>`;
function secMeta(id){const s2=D.sections.find(x=>x.id===id)||{};return `<div class="kv">
 <dt>Report section</dt><dd>${s2.id} · ${esc(s2.n||'')}</dd>
 <dt>Owner / Status</dt><dd>${esc(s2.owner||'—')} · ${st(s2.st||'draft')}</dd>
 <dt>GRI basis</dt><dd>${s2.id&&s2.id.startsWith('S5')?'Topic standards (frozen set v2)':'GRI 2 / GRI 1 required elements'}</dd>
 <dt>Material topic</dt><dd>${s2.id==='S5.1'?'MT-01 Climate change':s2.id&&s2.id.startsWith('S5')?'per topic map':'—'}</dd>
 <dt>Bound records</dt><dd style="font-weight:400">${s2.id==='S5.1'?'REC-1024/1025/1026 (305-2) · dual Scope-2 rows':'approved objects only — see Source Matrix (15)'}</dd>
 <dt>Bound calculations</dt><dd style="font-weight:400">${s2.id==='S5.1'?((cvOf('ENV-GHG-003')||{}).id||'—')+' · RUN-2212 (market-based — output ≡ approved)':'—'}</dd>
 <dt>Source versions</dt><dd style="font-weight:400">Boundary v3 · Topic Set v2 · Standards set locked · Factor editions 2025</dd>
 <dt>Narrative version</dt><dd>v${s2.id==='S3'?'4 — Human Reviewed (AI Suggested v1)':'2'} · numeric tokens bound</dd>
 <dt>Language state</dt><dd>EN authored · AR pending translation review</dd>
 <dt>Review comments</dt><dd>${({'S3':1,'S5.1':2,'S5.3':1})[s2.id]||0} open</dd>
 <dt>Assurance scope</dt><dd>${s2.id==='S5.1'?'In scope — limited (per-datapoint flags ⚙)':'computed from datapoint flags'}</dd>
 <dt>Staleness</dt><dd>${s2.st==='stale'?'⚠ bound value re-approved after last render':'fresh at last render'}</dd>
 <dt>Publication status</dt><dd>Draft render only — Release refuses while any required section is unapproved</dd></div>`}
function addSecForm(){return `<div class="formGrid">
 ${field({label:'Section type',req:1,type:'select',opts:['Permitted: CEO message','Permitted: Awards & memberships','Free narrative (no numeric tokens)'],full:1})}
 ${field({label:'Title',req:1,ph:'Section title'})}
 ${field({label:'Owner',req:1,type:'select',opts:['Nour','Layla']})}
 ${field({label:'Insert after',type:'select',opts:D.sections.map(x=>x.id),full:1})}
 <div class="full notice info" style="margin:0">${LANG==='ar'?'الأقسام الحرة لا يمكن أن تحتوي أرقامًا يدوية — أي رقم يتطلب Token مربوطًا.':'Free sections cannot carry typed numbers — any figure requires a bound token.'}</div></div>`}
function addSecFoot(){return `<button class="btn sec" onclick="closeDrawer()">${t('cancel')}</button><button class="btn" onclick="D.sections.splice(2,0,{id:'S2b',n:'CEO message',owner:'Nour',req:false,free:true,st:'draft',lvl:0});closeDrawer();audit('report.structure','S2b','added');toast('Section added');render()">${t('add')}</button>`}

/* real narrative editor: contenteditable + token picker + bilingual pane */
let NARR_LANG='both';
function insertToken(label,stale){const ed=document.getElementById('rteEN');if(!ed)return;ed.focus();
 const sp=document.createElement('span');sp.className='tok'+(stale?'':'');sp.contentEditable='false';sp.textContent=label;if(stale){sp.style.background='var(--warnBg)';sp.style.color='var(--warn)';sp.title='STALE'}
 sp.onclick=()=>toast('Inspector opened for token');
 const sel=window.getSelection();if(sel.rangeCount){const r=sel.getRangeAt(0);r.insertNode(document.createTextNode(' '));r.insertNode(sp)}else ed.appendChild(sp);
 closeDrawer();toast(LANG==='ar'?'Token مربوط بقيمة معتمدة أُدرج':'Token bound to an approved value inserted');}
function tokenPicker(){return `<div class="notice info">${LANG==='ar'?'القيم المعتمدة فقط تظهر هنا — الأرقام الحرة مرفوضة في المحرر.':'Only approved values appear here — free numerics are refused by the editor.'}</div>
 <table class="tbl"><thead><tr><th>Datapoint</th><th>Value</th><th>Source</th><th></th></tr></thead><tbody>
 ${['RB-001','RB-002','RB-003','RB-006','RB-010','RB-009','RB-016'].map(el=>{const r=resolveReportBinding(el);const k=kpiById(r.kpiId)||{};return `<tr><td>${esc((k.en||r.kpiId||'').slice(0,28))}</td><td><b>${r.status==='BOUND'?r.value+' '+(k.u||''):r.status}</b></td><td style="font-size:11.5px" data-noar>${r.approvedVersionId||'—'}</td><td><a onclick="insertToken('${r.value} ${k.u||''} ƒx ${r.kpiId} [${r.approvedVersionId}]',${r.stale?1:0})">${r.stale?'insert (STALE ⚠)':'Insert'}</a></td></tr>`}).join('')}
 </tbody></table>`}
VIEWS['rpt/rnarr']=()=>pageHead(t('rnarr'),LANG==='ar'?'محرر فعلي: نص + Tokens معتمدة + مراجع GRI + تعليقات + الزوج العربي جنبًا إلى جنب بحالة ترجمة. كتابة رقم يدويًا مكان Datapoint مرفوضة.':'A real editor: text + approved tokens + GRI references + comments + the Arabic pair side-by-side with translation status. Typing a number where a datapoint exists is refused.',
 `<span class="st review">§5.1 · under review</span>`,'Report › Narrative Editor (F-03 + F-06)')+
 `<div style="display:grid;grid-template-columns:1.6fr 1fr;gap:16px">
 <div class="card" style="margin:0"><div class="hd">§5.1 Climate & energy
  <div class="actions">
  <button class="btn sec" onclick="drawer('${LANG==='ar'?'إدراج Token':'Insert token'}',tokenPicker())">＋ Token</button>
  <button class="btn sec" onclick="toast('GRI reference chip inserted: [GRI 305-2]')">GRI ref</button>
  <button class="btn sec" onclick="toast('Comment thread opened')">💬 2</button></div></div>
 <div class="bd">
 <div class="rte"><div class="rteBar">
  <button onclick="document.execCommand('bold')"><b>B</b></button><button onclick="document.execCommand('italic')"><i>I</i></button><button onclick="document.execCommand('formatBlock',false,'h3')">H</button><button onclick="document.execCommand('insertUnorderedList')">≔</button>
  <span style="flex:1"></span><span style="font-size:11px;color:var(--mut);align-self:center">EN · ${LANG==='ar'?'يحفظ نسخة جديدة عند كل اعتماد':'versioned on approval'}</span></div>
 <div class="rteArea" id="rteEN" contenteditable="true" oninput="if(/(?:^|\\s)\\d{2,}(?:[.,]\\d+)?(?:\\s|$)/.test(this.innerText.split('ƒx').pop())){this.dataset.warn='1'}" onkeyup="if(this.dataset.warn){this.dataset.warn='';toast('${LANG==='ar'?'رقم يدوي رُصد — اربط Datapoint معتمدًا بدلًا منه':'Typed numeral detected — bind an approved datapoint instead'}')}">In FY2025 our operations emitted <span class="tok" contenteditable="false" onclick="toast('Inspector')">${(r=>`${r.value} ${(kpiById(r.kpiId)||{}).u||''} ƒx Scope 1 [${r.approvedVersionId}]${r.stale?" ⚠STALE":""}`)(resolveReportBinding('RB-004'))}</span> and <span class="tok" contenteditable="false" onclick="toast('Inspector')">${(r=>`${r.value} ${(kpiById(r.kpiId)||{}).u||''} ƒx Scope 2 (loc.) [${r.approvedVersionId}]${r.stale?" ⚠STALE":""}`)(resolveReportBinding('RB-002'))}</span>, while our renewable-electricity share reached <span class="tok" contenteditable="false">${(r=>`${r.value} ${(kpiById(r.kpiId)||{}).u||''} ƒx Renewable share [${r.approvedVersionId}]${r.stale?" ⚠STALE":""}`)(resolveReportBinding('RB-016'))}</span>. Energy intensity improved to <span class="tok" contenteditable="false" style="background:var(--warnBg);color:var(--warn)" title="STALE" onclick="toast('STALE: rebind to RUN-2245')">⚠ STALE token — EXAMPLE (rebind flow demo; not an approved business value)</span> per tonne of cement.</div></div>
 <div class="rte" style="margin-top:12px" dir="rtl"><div class="rteBar" dir="ltr"><span style="font-size:11px;color:var(--mut)">AR pair (F-06) · ${LANG==='ar'?'حالة الترجمة':'translation status'}: <span class="st review">Human review pending</span> · ${LANG==='ar'?'الأرقام Tokens مشتركة بين اللغتين':'numeric tokens shared across languages'}</span><span style="flex:1"></span><button onclick="toast('${LANG==='ar'?'قبول الترجمة — تتحول إلى Approved terminology':'Translation accepted — status → Approved'}')">✓ Accept</button></div>
 <div class="rteArea" contenteditable="true" style="text-align:right">في السنة المالية 2025 أصدرت عملياتنا <span class="tok" contenteditable="false">${(r=>`${r.value} ${(kpiById(r.kpiId)||{}).u||''} ƒx النطاق 1 [${r.approvedVersionId}]${r.stale?" ⚠STALE":""}`)(resolveReportBinding('RB-004'))}</span> من النطاق الأول و<span class="tok" contenteditable="false">${(r=>`${r.value} ${(kpiById(r.kpiId)||{}).u||''} ƒx النطاق 2 [${r.approvedVersionId}]${r.stale?" ⚠STALE":""}`)(resolveReportBinding('RB-002'))}</span> من النطاق الثاني (الموقعي)، وبلغت حصة الكهرباء المتجددة <span class="tok" contenteditable="false">${(r=>`${r.value} ${(kpiById(r.kpiId)||{}).u||''} ƒx متجددة [${r.approvedVersionId}]${r.stale?" ⚠STALE":""}`)(resolveReportBinding('RB-016'))}</span>.</div></div>
 </div>
 <div style="display:flex;gap:8px;justify-content:flex-end;padding:12px 16px;border-top:1px solid var(--line2)"><button class="btn sec" onclick="toast('Draft saved · v0.8')">${t('save')}</button><button class="btn" onclick="toast('Submitted for review — bilingual parity check queued')">${t('submit')}</button></div></div>
 <div class="inspector"><h4>🔍 Traceability Inspector — token “${resolveReportBinding('RB-002').value} tCO₂e [${resolveReportBinding('RB-002').approvedVersionId}]”</h4><div class="ichain">
 <div><b>Report element</b> §5.1 narrative token</div>
 <div><b>Binding</b> BND-114 → <a href="#/data/calcruns" data-noar>${(cvOf('ENV-GHG-003')||{}).id||'—'}</a> (immutable CalculationVersion — output ≡ approved value)</div>
 <div><b>Calculation</b> Σ monthly 305-2 × EF-EG-ELEC-2025 ƒx</div>
 <div><b>Records</b> 11 approved · 1 returned (Dec) → <span class="st stale">STALE risk</span></div>
 <div><b>Factor</b> 0.458 kgCO2e/kWh · approved</div>
 <div><b>Evidence</b> EV-0019, EV-0021 + 9 (hashes ✓)</div>
 <div><b>Topic</b> MT-01 · GRI 305-2 · boundary EG-CEM-01</div>
 <div><b>Open gap</b> <a href="#/data/dwork" style="color:var(--err)">Dec record returned — fix →</a></div></div>
 <h4 style="margin-top:14px">💬 ${LANG==='ar'?'تعليقات':'Comments'}</h4>
 <div style="font-size:11.5px;color:var(--ink2)"><b>O. Farid:</b> align wording with 302-1 narrative ("intensity improved" vs cross-check). <a onclick="toast('Reply added')">${LANG==='ar'?'رد':'Reply'}</a></div>
 </div></div>`;

/* real table & chart builder */
let TB={ds:'DS-305-2 · Scope 2 records (approved)',met:['tCO2e'],dim:'Site',per:'FY2025 vs FY2024',agg:'Sum',type:'Bar'};
VIEWS['rpt/rtab']=()=>pageHead(t('rtab'),LANG==='ar'?'Builder فعلي: Dataset ← مقاييس ← أبعاد ← فترة ← تجميع ← نوع الرسم ← معاينة حية ← حفظ مربوطًا بالمصدر.':'A real builder: Dataset → Metrics → Dimensions → Period → Aggregation → Chart type → live Preview → Save bound to source.',
 '','Report › Tables & Charts Builder (F-04)')+
 `<div style="display:grid;grid-template-columns:330px 1fr;gap:16px">
 <div class="card" style="margin:0"><div class="hd">${LANG==='ar'?'الإعداد':'Configuration'}</div><div class="bd" style="display:grid;gap:12px">
 ${field({label:'Dataset (approved only)',req:1,type:'select',opts:['DS-305-2 · Scope 2 records (approved)','DS-302-1 · Energy','DS-403-9 · Injuries','DS-303-3 · Water'],value:TB.ds,id:'tbDs'})}
 ${field({label:'Metrics',req:1,type:'select',opts:['tCO2e','kWh','Both'],value:'tCO2e'})}
 ${field({label:'Dimension',req:1,type:'select',opts:['Site','Entity','Month','Quarter'],value:TB.dim,id:'tbDim'})}
 ${field({label:'Period',req:1,type:'select',opts:['FY2025 vs FY2024','FY2025 only','Last 24 months'],value:TB.per})}
 ${field({label:'Aggregation',req:1,type:'select',opts:['Sum','Average','Max'],value:TB.agg})}
 ${field({label:'Chart type',req:1,type:'select',opts:['Bar','Line','Donut','Table only'],value:TB.type,id:'tbType'})}
 <button class="btn" onclick="TB.dim=document.getElementById('tbDim').value;TB.type=document.getElementById('tbType').value;toast('${LANG==='ar'?'حُدّثت المعاينة':'Preview updated'}');render()">↻ ${LANG==='ar'?'معاينة':'Preview'}</button>
 <button class="btn sec" onclick="audit('report.chart','TBL-08','saved · bound to DS-305-2');toast('${LANG==='ar'?'حُفظ TBL-08 مربوطًا بالمصدر — يظهر في الربط والمعاينة':'Saved TBL-08 bound to source — appears in Binding & Preview'}')">💾 ${LANG==='ar'?'حفظ في التقرير':'Save to report'}</button>
 </div></div>
 <div class="card" style="margin:0"><div class="hd">${LANG==='ar'?'معاينة حية':'Live preview'} <span class="sub">${esc(TB.ds)} · ${TB.dim} · ${TB.agg}</span></div><div class="bd">
 ${(()=>{const bk=resolveReportBinding('RB-005'),bk4=brkOf('ENV-GHG-003','FY2024');
  if(bk.status!=='BOUND')return `<div class="notice warn" style="margin:0"><b data-noar>RB-005 · ${bk.status}</b> — ${LANG==='ar'?'التوزيع الموقعي المعتمد تخطاه اعتماد أحدث للإجمالي؛ لا يُعرض توزيع قديم أبدًا — أعد التخصيص من النسخة المعتمدة الحالية.':'the approved site allocation was superseded by a newer approved total; an old allocation is never shown — re-allocate from the current ApprovedVersion.'}</div>`;
  const rows=bk.rows.map(([s0,v])=>[s0,v,(bk4&&(bk4.rows.find(x=>x[0]===s0)||[])[1])||null]);
  const mx=Math.max(...rows.map(r=>r[1]));
  return `<div class="chartWrap">
  ${rows.map(([s0,a,b])=>`<div class="cb" style="height:${Math.max(3,Math.round(a/mx*88))}%"><i>${a}</i><em>${s0}</em></div><div class="cb" style="height:${b?Math.max(2,Math.round(b/mx*88)):2}%;opacity:.35"><i>${b??'—'}</i><em>FY24</em></div>`).join('')}
  </div>
  <table class="tbl" style="margin-top:26px"><thead><tr><th>${TB.dim}</th><th>FY2024</th><th>FY2025 ⚙</th><th>Δ</th></tr></thead><tbody>
  ${rows.map(([s0,a,b])=>`<tr><td>${s0}${(D.brk['ENV-GHG-003|FY2025'].notes||{})[s0]?` <span class="pv der">⚙ ${(D.brk['ENV-GHG-003|FY2025'].notes)[s0]}</span>`:''}</td><td>${b??'—'}</td><td>${a}</td><td>${b?((a-b)/b>0?'+':'')+(Math.round((a-b)/b*1000)/10)+'%':'—'}</td></tr>`).join('')}
  <tr style="font-weight:700;border-top:2px solid var(--line)"><td>${LANG==='ar'?'الإجمالي':'Total'}</td><td>${bk4?bk4.sum:'—'}</td><td data-noar>${bk.sum} <span class="pv der" title="sum of the approved site allocation ≡ the approved group total ${bk.approvedVersionId} — enforced, never typed">= ${bk.total} ✓</span></td><td></td></tr>
  </tbody></table>
  <div class="help" style="margin-top:8px" data-noar>RB-005 · ${bk.approvedVersionId} · ${LANG==='ar'?'الرسم والجدول يقرآن نفس الـdataset المعتمد — لا رقم مكتوب في أي منهما، والمجموع يساوي الإجمالي المعتمد قسريًا':'chart and table read the SAME approved dataset — no typed figure in either; the sum is forced to equal the approved total'}${bk.stale?' · <b style="color:var(--warn)">⚠ STALE</b>':''}</div>`})()}
 </div></div></div>`;

/* export center: formal scope decision */

/* ----: guided wizard (left-stepper, base-design pattern) for new reporting cycle ---- */
const WIZ_STEPS=[['🏛','Organization data','Reused from approved profile'],['🌳','Entities & structure','Confirm in-scope entities'],['📍','Sites & activities','Confirm sites and domains'],['📅','Reporting period','Period, frequency, publication'],['🛡','Boundary','Per-lens decisions'],['🏷','Sector & standards','Classification + editions'],['✅','Review & create','Validate and generate draft']];
let WIZ_AT=3;
function openWizard(){let o=document.getElementById('wizOvl');
 if(!o){o=document.createElement('div');o.id='wizOvl';document.body.appendChild(o)}
 o.style.display='flex';renderWiz();}
function closeWiz(){const o=document.getElementById('wizOvl');if(o)o.style.display='none'}
function renderWiz(){const o=document.getElementById('wizOvl');
 const stepBody=[
  `<div class="notice info">${LANG==='ar'?'كل الحقول أدناه 🔗 من الملف المعتمد — لا إدخال مكرر.':'Everything below is 🔗 reused from the approved profile — no duplicate entry.'}</div><div class="formGrid">${field({label:'Legal name',value:D.org.name,pv:{k:'reuse',t:'from Organization'}})}${field({label:'Headquarters',value:D.org.hq,ro:1})}${field({label:'Contact',value:D.org.contact,pv:{k:'reuse',t:'GRI 2-3-d'}})}${field({label:'Countries',value:D.org.countries.join(' · '),ro:1})}</div>`,
  `<div class="formGrid">${field({label:'Entities in sustainability scope',value:'3 of 4 (LE-04 excluded — 2-2-b note)',pv:{k:'reuse',t:'from Entities'}})}${field({label:'Confirm for new cycle?',type:'select',opts:['Yes — carry forward','Review changes first'],value:'Yes — carry forward'})}</div>`,
  `<div class="formGrid">${field({label:'Sites carried forward',value:'5 active (SA-DEP-01 closed — drops out)',pv:{k:'der',t:'derived'}})}${field({label:'Data domains',value:'per site register',pv:{k:'reuse',t:'from Sites'}})}</div>`,
  `<div class="formGrid">${field({label:'Cycle name',req:1,value:'Sustainability Report FY2026',id:'wzName'})}${field({label:'Cycle code',req:1,value:'ACME-FY2026'})}${field({label:'Period start',req:1,type:'date',value:'2026-01-01'})}${field({label:'Period end',req:1,type:'date',value:'2026-12-31'})}${field({label:'Frequency',req:1,type:'select',opts:['Annual','Biennial'],value:'Annual'})}${field({label:'Target publication',req:1,type:'date',value:'2027-04-30',help:'Plausibility pack applies — implausible combinations are refused.'})}${field({label:'Reporting intent',req:1,type:'select',opts:['In accordance with the GRI Standards','With reference to the GRI Standards'],full:1})}</div>`,
  `<div class="notice warn">${LANG==='ar'?'حدود FY2025 تُعرض كاقتراح — كل قرار يُعاد تأكيده للدورة الجديدة.':'FY2025 boundary shown as a proposal — every decision re-confirmed for the new cycle.'}</div><div class="formGrid">${field({label:'Consolidation approach',value:'Operational control',pv:{k:'reuse',t:'group approach (B-02)'}})}${field({label:'Entities to decide',value:'4 rows → grid opens after creation',ro:1})}</div>`,
  `<div class="formGrid">${field({label:'Sector classification',value:'carried (Mining pending confirmation)',pv:{k:'reuse',t:'org-scoped'}})}${field({label:'Standards resolution basis',value:'publication date 2027-04-30 (frozen at Start)',pv:{k:'der',t:'derived'}})}${field({label:'GRI 102/103:2025 election',type:'select',opts:['Decide later in Standards tab','Elect early adoption now'],full:1})}</div>`,
  `<div class="notice ok"><b>${LANG==='ar'?'جاهز':'Ready'}.</b> ${LANG==='ar'?'سيُنشأ: دورة FY2026 (مسودة) + حدود مقترحة + مجموعة معايير محلولة + خطة انطباق أولية. كل شيء قابل للمراجعة في شاشاته المستقلة.':'Will create: FY2026 cycle (draft) + proposed boundary + resolved standards set + initial applicability. Everything reviewable in its own screens (returning-year mode).'}</div><div class="kv"><dt>Cycle</dt><dd>ACME-FY2026 · Annual</dd><dt>Publication</dt><dd>2027-04-30</dd><dt>Intent</dt><dd>In accordance (computed later)</dd><dt>Checks</dt><dd>plausibility ✓ · uniqueness ✓ · SoD n/a</dd></div>`
 ][WIZ_AT];
 o.innerHTML=`<div class="wiz"><div class="wh"><h2>${LANG==='ar'?'إنشاء دورة تقرير (موجَّه)':'Create Reporting Cycle (guided)'}</h2><span class="st draft">Draft</span><button class="x" onclick="closeWiz()">✕</button></div>
 <div class="wb2"><div class="wSteps">${WIZ_STEPS.map((s5,i)=>`<div class="wStep ${i<WIZ_AT?'done':i===WIZ_AT?'now':''}" onclick="WIZ_AT=${i};renderWiz()"><div class="ic">${i<WIZ_AT?'✓':s5[0]}</div><div class="tx"><b>${s5[1]}</b><span>${s5[2]}</span></div></div>`).join('')}</div>
 <div><div class="wBody"><h3 style="font-size:15px;margin-bottom:14px">${WIZ_STEPS[WIZ_AT][1]}</h3>${stepBody}</div>
 <div class="wFoot"><button class="btn sec" onclick="WIZ_AT=Math.max(0,WIZ_AT-1);renderWiz()">← ${LANG==='ar'?'السابق':'Back'}</button><button class="btn sec" onclick="toast('${LANG==='ar'?'حُفظت مسودة':'Draft saved'}')">💾 ${t('save')}</button>
 ${WIZ_AT<6?`<button class="btn" onclick="WIZ_AT++;renderWiz()">${LANG==='ar'?'الخطوة التالية':'Next step'} →</button>`:`<button class="btn" onclick="closeWiz();audit('cycle.create','ACME-FY2026','wizard complete — draft created');toast('${LANG==='ar'?'أُنشئت دورة FY2026 (مسودة) — افتح جاهزية الدورة':'FY2026 cycle created (draft) — open Cycle Readiness'}')">✓ ${LANG==='ar'?'إنشاء الدورة':'Create cycle'}</button>`}</div></div>
 </div></div>`;}

/* ----: deep Arabic — dictionary translator over rendered text nodes ---- */
const AR_MAP={
'Legal name':'الاسم القانوني','Legal form':'الشكل القانوني','Ultimate parent':'الكيان الأم النهائي','Headquarters':'المقر الرئيسي','Countries of operation':'دول التشغيل','Report contact':'جهة اتصال التقرير','Responsible owner':'المالك المسؤول','Version basis':'أساس النسخة','Legal identity':'الهوية القانونية',
'Entity':'الكيان','Entities':'الكيانات','Ownership':'الملكية','Consolidation':'التوحيد','Approved':'معتمد','Draft':'مسودة','Locked':'مقفل','Returned':'معاد','Under review':'قيد المراجعة','In review':'قيد المراجعة','Submitted':'مقدم','Pending':'معلق','Blocked':'محجوب','Open':'مفتوح','Closed':'مغلق','In set':'ضمن المجموعة',
'Site':'الموقع','Sites':'المواقع','Country':'الدولة','City':'المدينة','Address':'العنوان','Headcount':'عدد العاملين','Boundary':'الحدود','Data domains':'مجالات البيانات','Certifications':'الشهادات',
'Value':'القيمة','Unit':'الوحدة','Period':'الفترة','Source':'المصدر','Evidence':'الدليل','Status':'الحالة','Owner':'المالك','Contributor':'المُدخل','Reviewer':'المراجع','Approver':'المعتمد','Due date':'تاريخ الاستحقاق','Frequency':'الدورية','Actions':'إجراءات','History':'السجل','Description':'الوصف',
'Topic':'الموضوع','Impacts':'التأثيرات','Impact':'التأثير','Significance':'الدلالة','Severity':'الشدة','Likelihood':'الاحتمالية','Stakeholder':'صاحب المصلحة','Stakeholders':'أصحاب المصلحة','Material':'جوهري','Not material':'غير جوهري','Needs review':'يحتاج مراجعة','Decision':'القرار','Rationale':'المبرر',
'Disclosure':'الإفصاح','Requirement':'المتطلب','Standard':'المعيار','Omission':'الحذف','Reason':'السبب','Explanation':'التفسير','Findings':'الملاحظات','Finding':'الملاحظة','Severity':'الشدة',
'Data owner':'مالك البيانات','Data quality':'جودة البيانات','Coverage':'التغطية','Overdue':'متأخر','Plan rows (all shown)':'صفوف الخطة (معروضة كاملة)','Calculation':'الحساب','Validation':'التحقق','Lineage':'النسب','Method':'الطريقة','Factor':'المعامِل','Output':'المخرَج','Inputs':'المدخلات','Executed':'نُفذت','Runs':'تشغيلات',
'Report element':'عنصر التقرير','Binding':'الربط','Section':'القسم','Order':'الترتيب','Location':'الموقع','Preview':'معاينة','Publication gates':'بوابات النشر','Cycle phase':'مرحلة الدورة','Journey progress':'تقدم الرحلة','Blocking gates right now':'البوابات الحاجبة الآن',
'Document':'المستند','Type':'النوع','Linked to':'مرتبط بـ','Uploaded':'مرفوع','Save assignment':'حفظ الإسناد','Assign':'إسناد','Search':'بحث','Export':'تصدير','Add':'إضافة','Edit':'تعديل','View':'عرض','Open':'فتح','Approve':'اعتماد','Return':'إرجاع','Reject':'رفض','Submit':'تقديم','Cancel':'إلغاء','Save draft':'حفظ مسودة',
'All topics':'كل الموضوعات','All departments':'كل الإدارات','All statuses':'كل الحالات','All types':'كل الأنواع','All countries':'كل الدول','All sources':'كل المصادر','All pillars':'كل الركائز',
'Required':'إلزامي','REQUIRED':'إلزامي','required':'إلزامي','Next':'التالي','Comes from':'يأتي من','Configuration':'الإعداد','Live preview':'معاينة حية','Chart type':'نوع الرسم','Aggregation':'التجميع','Metrics':'المقاييس','Dimension':'البعد','Dataset (approved only)':'مجموعة البيانات (المعتمدة فقط)',
'Department review':'مراجعة الإدارة','Technical review':'المراجعة الفنية','Department queue':'قائمة الإدارة','Technical queue':'القائمة الفنية','GRI requirements met':'متطلبات GRI مستوفاة','Evidence coverage':'تغطية الأدلة','Open findings':'ملاحظات مفتوحة','Omissions pending':'حذف بانتظار الاعتماد','Overdue requests':'طلبات متأخرة',
'Sector expected topic':'الموضوع المتوقع من القطاع','Internal evidence':'دليل داخلي','Confirmed':'مؤكد','Explained not material':'مشروح كغير جوهري','Divergences':'الاختلافات','Resolved':'مسواة','Position A':'الموقف أ','Position B':'الموقف ب','Difference':'الفرق',
'Engagement Plan':'خطة المشاركة','Engagement Records':'سجلات المشاركة','Planned':'مخطط','Done':'منفذ','Objective':'الهدف','Expected output':'المخرَج المتوقع','Key concerns':'المخاوف الرئيسية','Fed impacts':'أنشأ تأثيرات',
'Nine requirements':'المتطلبات التسعة','Gates':'البوابات','Index gaps':'صفوف فهرس ناقصة','Assurance finding':'ملاحظة تأكيد','Findings by source':'الملاحظات حسب المصدر','Closure rate':'نسبة الإغلاق',

 'Modules':'الوحدات','Workspace':'مساحة العمل','Workspaces':'مساحات العمل','Overview':'نظرة عامة','Sub-modules':'الوحدات الفرعية',
 'Activity':'النشاط','Activity log':'سجل النشاط','Team members':'أعضاء الفريق','Record key':'مفتاح السجل','Timeline':'الخط الزمني',
 'Details':'التفاصيل','Open items':'عناصر مفتوحة','Progress':'التقدّم','Reports':'التقارير','Favourite':'مفضلة',
 'General information':'المعلومات العامة','Linked documents':'المستندات المرتبطة','Approvals & history':'الاعتمادات والسجل',
 'Standards & claim':'المعايير والادعاء','Team & responsibilities':'الفريق والمسؤوليات','Reporting boundary':'حدود التقرير',
 'Copy key':'نسخ المفتاح','All events':'كل الأحداث','vs last period':'مقارنة بالفترة السابقة','Metric definition':'تعريف المؤشر',
 'Export snapshot':'تصدير لقطة','Open workspace':'فتح مساحة العمل',
 'Data request issued':'تم إصدار طلب البيانات','Record submitted':'تم تقديم السجل','Plausibility warning raised':'تنبيه معقولية','Returned for correction':'أعيد للتصحيح','Resubmitted with new evidence':'أعيد التقديم بدليل جديد','Under department review':'قيد مراجعة الإدارة',
 'Programme Manager':'مدير البرنامج','Data Owner':'مالك البيانات','Data Contributor':'مُدخل البيانات','Department Reviewer':'مراجع الإدارة','Technical Reviewer':'المراجع الفني','Validation engine':'محرك التحقق','Canonical record key':'مفتاح السجل المعياري','Open module':'فتح الوحدة','Open in review':'فتح في المراجعة',
'Print / PDF':'طباعة / PDF','Print-ready draft':'مسودة جاهزة للطباعة','Open print view':'فتح نسخة الطباعة',
 'Not for publication':'غير قابل للنشر','Draft report':'مسودة التقرير','Table of contents':'جدول المحتويات',
 'Statement of use':'بيان الاستخدام','Omissions annex':'ملحق الحذف','Assurance':'التأكيد','Prepared':'أُعدت',
 'Section pending':'قسم غير مكتمل','Every print is recorded in the audit log':'كل طباعة تُسجل في سجل المراجعة',
'Management Dashboard':'لوحة الإدارة','Management summary':'الملخص الإداري','Department completeness':'اكتمال الإدارات',
 'Collection status mix':'مزيج حالات الجمع','Findings by state':'الملاحظات حسب الحالة','High-severity topics':'الموضوعات عالية الخطورة',
 'Save As':'حفظ باسم','vs plan':'مقابل الخطة','Board view':'عرض مجلس الإدارة',
'Data Catalog':'كتالوج البيانات','Environmental':'بيئي','Social':'اجتماعي','Governance':'حوكمة',
 'Search datapoints':'ابحث في نقاط البيانات','Breakdown must reconcile':'التفصيل يجب أن يطابق','Add row':'إضافة صف',
 'Save entry':'حفظ الإدخال','Rendering contract':'عقد العرض','First cycle (draft)':'الدورة الأولى (مسودة)',
 'Add sector classification':'إضافة تصنيف قطاع','Draft Boundary Grid':'شبكة مسودة الحدود'
};
const AR_KEYS=Object.keys(AR_MAP).sort((a,b)=>b.length-a.length);
function arTranslateText(txt){let out=txt;
 for(const k of AR_KEYS){if(out.includes(k))out=out.split(k).join(AR_MAP[k])}
 return out}
let POSTING=false;
function postProcess(root){if(POSTING)return;POSTING=true;
 try{
  if(LANG==='ar'){
   const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null);
   let n;while(n=w.nextNode()){const p=n.parentElement;if(!p)continue;
    if(p.closest('code,.tok,[data-noar]'))continue;
    const v=n.nodeValue;if(v&&/[A-Za-z]/.test(v)){const tr=arTranslateText(v);if(tr!==v)n.nodeValue=tr}}
  }
  if(root.id==='main'&&!root.querySelector('.guideBar')){
   const g=guideBar(CUR);
   if(g){const ph=root.querySelector('.pageHead');
    if(ph){ph.insertAdjacentHTML('afterend',g)}else{root.insertAdjacentHTML('afterbegin',g)}}}
 }finally{POSTING=false}}
new MutationObserver(()=>postProcess($('#main'))).observe($('#main'),{childList:true});
new MutationObserver(()=>{if($('#drawer').style.display!=='none')postProcess($('#drawer'))}).observe($('#drawer'),{childList:true});
postProcess($('#main'));

/* ----.1: kill every remaining hard-coded computed figure ---- */
function stageGateRail(){const cur=2; /* G0–G2 passed at phase 4 (Data Collection) */
 return `<div class="card"><div class="hd">${LANG==='ar'?'بوابات المراحل G0–G7 (من الـConfig — REQ-09)':'Stage gates G0–G7 (from CONFIG — REQ-09)'} <span class="sub">${LANG==='ar'?'غير بوابات النشر الخمس عشرة — هذه تحكم انتقال مراحل الدورة':'distinct from the 15 publication gates — these govern cycle-phase transitions'}</span></div><div class="bd">
 ${CONFIG.stageGates.map((g,i)=>`<div class="gateRow"><span class="gid" data-noar>${g.id}</span><div style="flex:1"><b style="font-size:12.5px">${esc(g.n)}</b><div style="font-size:11.5px;color:var(--mut)">${esc(g.crit)}</div></div><span class="st ${i<=cur?'approved':'draft'}">${i<=cur?'PASSED':'AHEAD'}</span>${g.ov?'':`<span class="pv lock" title="never overridable">🔒</span>`}</div>`).join('')}
 </div></div>`}
VIEWS['setup/readiness']=()=>{const gp=gateStats(),req=reqStats(),ps=planStats();
 return setupRail('readiness')+pageHead(t('readiness'),LANG==='ar'?'كل رقم أدناه يُشتق عند كل تقييم — الجاهزية ليست علمًا مخزنًا أبدًا.':'Every number below is re-derived on each evaluation — readiness is never a stored flag.',
 `<button class="btn sec" onclick="audit('gate.reEvaluate','cycle',gateStats()+'/15');toast('Re-evaluated · audit recorded')">↻ ${LANG==='ar'?'إعادة التقييم':'Re-evaluate'}</button>`,'Reporting Setup › Readiness (B-14)')+
 `<div class="tiles">${tile(gp+'/15',LANG==='ar'?'بوابات ناجحة':'Gates passing',gp<15?'warn':'ok')}${tile(req+'/9',LANG==='ar'?'متطلبات GRI':'GRI requirements',req<9?'warn':'ok','rev/claim')}${tile('96%',LANG==='ar'?'اكتمال الإعداد':'Setup complete','ok')}${tile(ps.cov+'%',LANG==='ar'?'تغطية الخطة':'Plan coverage',ps.cov<80?'warn':'ok','data/plan')}</div>
 <div class="card"><div class="hd">${LANG==='ar'?'البوابات الخمس عشرة':'The fifteen publication gates'} <span class="sub">${LANG==='ar'?'كل فشل يحمل معالجة ومالكًا':'each failure carries remediation + a responsible owner'}</span></div><div class="bd">
 ${D.gates.map(g=>`<div class="gateRow"><span class="gid">${g.id}</span><div style="flex:1"><b style="font-size:12.5px">${esc(g.n)}</b>${g.fix?`<div style="font-size:12px;color:var(--mut)">→ ${esc(g.fix)} · <b>${esc(g.own)}</b></div>`:''}</div><span class="st ${g.st}">${g.st.toUpperCase()}</span></div>`).join('')}
 </div></div>
 <div class="card"><div class="hd">${LANG==='ar'?'تفصيل الجاهزية — سجل تشغيلي':'Readiness detail — operational register'} <span class="sub">${LANG==='ar'?'محسوب بالكامل؛ القرار والتعليق فقط قابلان للإدخال حيث يسمح السير':'fully computed; only a governance decision/comment is enterable where the workflow permits'}</span></div>
 <div style="overflow-x:auto"><table class="tbl"><thead><tr><th>Gate</th><th>${LANG==='ar'?'المتطلب':'Requirement'}</th><th>${t('status')}</th><th>${LANG==='ar'?'الكائن الأساسي':'Underlying object'}</th><th>${LANG==='ar'?'السبب':'Reason'}</th><th>${t('who')}</th><th>${t('due')}</th><th>${LANG==='ar'?'حاجب؟':'Blocking?'}</th><th>${LANG==='ar'?'تجاوز؟':'Override?'}</th><th>${LANG==='ar'?'الدليل':'Evidence'}</th><th>${LANG==='ar'?'الإصلاح':'Fix'}</th></tr></thead><tbody>
 ${[
  ['G2','Boundary approved & locked','pass','Boundary v3','All lenses approved','L. Al-Harbi','—','Yes','🔒 No','EV-0031','setup/boundary'],
  ['G3','Sector confirmed → standards resolved','warn','SectorAssignment v1','Pending B-08 approval','O. Farid','28 Feb','Yes','No — with justification','—','org/sector'],
  ['G4','Materiality frozen (C-12)','pass','Topic Set v2','8 topics approved','Dr. H. Nassar','—','Yes','🔒 No','MAT-PACK-02','mat/approval'],
  ['G5','GRI 2 complete or validly omitted','warn','2-8 assessment','FND-2025-0004 open','K. Mansour','25 Feb','Yes','🔒 No','—','setup/gri2'],
  ['G6','Claim eligibility (9/9)','fail','Claim engine','3/9 today — computed','—','—','Yes','🔒 Never','—','rev/claim'],
  ['G7','GRI notified (Req 9)','fail','Notification record','Not yet sent','L. Al-Harbi','pre-publication','Yes','🔒 No','—','rpt/release']
 ].map(r=>`<tr><td><b data-noar>${r[0]}</b></td><td style="font-size:12px">${r[1]}</td><td>${r[2]==='pass'?st('approved','PASS'):r[2]==='warn'?st('review','AT RISK'):st('blocked','FAIL')}</td><td style="font-size:11.5px" data-noar>${r[3]}</td><td style="font-size:11.5px">${r[4]}</td><td style="font-size:11.5px">${r[5]}</td><td style="font-size:11.5px">${r[6]}</td><td>${r[7]}</td><td style="font-size:11.5px">${r[8]}</td><td style="font-size:11.5px" data-noar>${r[9]}</td><td class="rowActs"><a onclick="location.hash='#/${r[10]}';render()">${LANG==='ar'?'المصدر':'Source'}</a></td></tr>`).join('')}
 </tbody></table></div>
 <div class="bd formGrid">${field({label:LANG==='ar'?'قرار/تعليق الحوكمة':'Governance decision / comment',type:'area',value:'',full:1,help:LANG==='ar'?'الحقل الوحيد القابل للإدخال هنا — يُسجل في التدقيق':'The only enterable field on this dashboard — audited.'})}</div></div>`+stageGateRail()};
VIEWS['rev/pgate']=()=>{const gp=gateStats(),req=reqStats();
 return pageHead(t('pgate'),LANG==='ar'?'البوابات الخمس عشرة الصارمة. النشر يظل معطلًا مع أي بوابة إلزامية فاشلة — لا تجاوز.':'The fifteen hard gates. Publication stays disabled while any mandatory gate fails — there is no override.','','Compliance › Publication Gate (E-12)')+
 `<div class="tiles">${tile(gp+'/15',LANG==='ar'?'بوابات ناجحة':'Gates passing',gp<15?'warn':'ok')}${tile(req+'/9',LANG==='ar'?'متطلبات GRI':'GRI requirements',req<9?'warn':'ok','rev/claim')}${tile(D.findings.filter(f=>f.src==='Assurance'&&f.st!=='closed').length,LANG==='ar'?'ملاحظة تأكيد مفتوحة/حرجة':'Open assurance finding','err','rev/findings')}${tile('—',LANG==='ar'?'النشر: معطل':'Publish: disabled','err')}</div>
 <div class="card"><div class="bd">${D.gates.map(g=>`<div class="gateRow"><span class="gid">${g.id}</span><div style="flex:1"><b style="font-size:12.5px">${esc(g.n)}</b>${g.fix?`<div style="font-size:12px;color:var(--mut)">→ ${esc(g.fix)} · <b>${esc(g.own)}</b></div>`:''}</div><span class="st ${g.st}">${g.st.toUpperCase()}</span></div>`).join('')}</div></div>`};
/* (stray mid-file render removed — single boot at end) */



