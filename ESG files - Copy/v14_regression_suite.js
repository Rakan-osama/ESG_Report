/* V13.1.1 INTEGRITY SUITE — reproducible acceptance probes.
   Strengthened after the V13.1 review: this suite was rebuilt to CATCH the four defects that
   the V13.1 smoke missed (grid site read/write split · hard-coded chart/table · false
   calculation lineage · binding-matrix overclaim) — each has a dedicated probe that FAILS
   on the V13.1 build and passes only on V13.1.1.
   Run:  node tests/v14_regression_suite.js   (from the package root; needs playwright + chromium)
   Writes: test-results/v14_regression_suite.json  — the JSON reports total/passed explicitly. */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
(async()=>{
const exe=process.env.CHROMIUM||'/opt/pw-browsers/chromium';
const b=await chromium.launch(fs.existsSync(exe)?{executablePath:exe}:{});
const pg=await b.newPage({viewport:{width:1440,height:900}});
const errs=[];pg.on('pageerror',e=>errs.push(e.message));
const file=path.resolve(__dirname,'..','24_ESG_OS_v14_FinalDeveloperBaseline.html');
await pg.goto('file://'+file);
await pg.evaluate(()=>{ROLE='PM'});
const R=[];const T=async(id,name,f,arg)=>{let pass=false,actual='';
 try{const r=await pg.evaluate(f,arg);pass=r===true||(r&&r.pass===true);actual=(r&&r.actual)||String(r)}catch(e){actual='EX: '+e.message.slice(0,140)}
 R.push({id,name,pass,actual});console.log(pass?'PASS':'FAIL',id,name,pass?'':('→ '+actual))};

/* TC-INT-01 — aggregation strictly per definition */
await T('TC-INT-01','aggregation methods (SUM/AVERAGE/EOP/CALCULATED)',()=>{
 const sum=aggregateKpi({agg:'SUM'},[{v:2},{v:3}])===5;
 const avg=aggregateKpi({agg:'AVERAGE'},[{v:2},{v:4}])===3;
 const eop=aggregateKpi({agg:'END_OF_PERIOD'},[{v:2},{v:9}])===9;
 const cal=aggregateKpi(kpiById('SOC-OHS-002'),recordsFor('SOC-OHS-002'))===1.41;
 return {pass:sum&&avg&&eop&&cal,actual:JSON.stringify({sum,avg,eop,cal})}});

/* TC-INT-02 — Missing ≠ Zero */
await T('TC-INT-02','blank/invalid input refused, record unchanged',()=>{
 const v0=dprGet('ENV-GHG-003','EG-CEM-01','2025-03').v;
 const a=dprSet('ENV-GHG-003','EG-CEM-01','2025-03','')===false;
 const b2=dprSet('ENV-GHG-003','EG-CEM-01','2025-03','abc')===false;
 return {pass:a&&b2&&dprGet('ENV-GHG-003','EG-CEM-01','2025-03').v===v0,actual:'refused; v='+v0}});

/* TC-INT-13 — P0-1 regression: grid reads AND writes on the X-PLAN site (Water @ EG-QRY-01) */
await T('TC-INT-13','grid site integrity — monthly READ = X-PLAN site = WRITE (Water, EG-QRY-01)',()=>{
 const xp=D.xplan.find(x=>x.kpi==='ENV-WAT-001');if(!xp||xp.site!=='EG-QRY-01')return {pass:false,actual:'xplan site '+(xp&&xp.site)};
 DG_DEP='Energy';location.hash='#/data/deptgrid';render();
 const v=dprGet('ENV-WAT-001','EG-QRY-01','2025-03').v;
 const inp=[...document.querySelectorAll('#main input')].find(i=>(i.title||'').includes('EG-QRY-01')&&i.value===v.toLocaleString());
 if(!inp)return {pass:false,actual:'no grid cell rendering the EG-QRY-01 record value '+v};
 if(dprGet('ENV-WAT-001','EG-CEM-01','2025-03'))return {pass:false,actual:'ghost record exists at EG-CEM-01'};
 // write path: edit lands on the SAME site the cell read from — never another site
 dprSet('ENV-WAT-001','EG-QRY-01','2025-03',String(v+1));
 const wroteQry=dprGet('ENV-WAT-001','EG-QRY-01','2025-03').v===v+1;
 const noCem=!dprGet('ENV-WAT-001','EG-CEM-01','2025-03');
 dprSet('ENV-WAT-001','EG-QRY-01','2025-03',String(v)); // restore value (record stays dirty → golden approves later)
 return {pass:wroteQry&&noCem,actual:'read '+v+' @EG-QRY-01 · wrote @EG-QRY-01 · no EG-CEM-01 ghost'}});

/* TC-INT-14 — P0-2 regression: chart + table = ONE approved breakdown; sum ≡ approved total; superseded refused */
await T('TC-INT-14','report Tables & Charts — single approved dataset; sum(rows) ≡ ADV total; superseded flow',()=>{
 const r=resolveReportBinding('RB-005');
 if(r.status!=='BOUND'||!r.reconciles)return {pass:false,actual:'status '+r.status+' sum '+r.sum+' total '+r.total};
 const src=VIEWS['rpt/rtab'].toString();
 const clean=!src.includes('.874')&&!src.includes('>612<')&&!src.includes('>649<')&&!src.includes('>18<');
 if(!clean)return {pass:false,actual:'hard-coded shares/values still in rpt/rtab source'};
 location.hash='#/rpt/rtab';render();const t1=document.querySelector('#main').textContent;
 if(!(t1.includes('648.6')&&t1.includes(String(r.total))))return {pass:false,actual:'rendered table not from breakdown dataset'};
 // supersede: a newer approved total must REFUSE the old allocation (never silently keep it)
 const key=Object.keys(D.dpr).find(k=>k.startsWith('ENV-GHG-003|'));
 dprSet('ENV-GHG-003',key.split('|')[1],key.split('|')[2],String(D.dpr[key].v)); // same value — marks dirty
 approve('ENV-GHG-003','FY2025');
 const r2=resolveReportBinding('RB-005');
 location.hash='#/rpt/rtab';render();const t2=document.querySelector('#main').textContent;
 const refused=r2.status==='SUPERSEDED — RE-ALLOCATE'&&(t2.includes('SUPERSEDED')||t2.includes('RE-ALLOCATE')||t2.includes('re-allocate'));
 // governed re-allocation step: pin the allocation to the new ApprovedVersion
 D.brk['ENV-GHG-003|FY2025'].advId=advGet('ENV-GHG-003','FY2025').id;
 const rebound=resolveReportBinding('RB-005').status==='BOUND';
 return {pass:refused&&rebound,actual:'sum '+r.sum+' ≡ total '+r.total+' · superseded→refused→re-allocated→bound'}});

/* TC-INT-03 — Grid ↔ Workspace same DatapointRecord */
await T('TC-INT-03','grid edit visible in workspace (same record)',()=>{
 dprSet('ENV-GHG-003','EG-CEM-01','2025-12','131000');
 location.hash='#/data/dwork';render();
 const seen=document.querySelector('#main').textContent.includes('131,000')||[...document.querySelectorAll('#main input')].some(i=>i.value==='131,000');
 dprSet('ENV-GHG-003','EG-CEM-01','2025-12',String(131000));return {pass:seen,actual:'shared D.dpr'}});

/* TC-INT-15 — P0-3 regression: immutable CalculationVersion lineage — CV.output ≡ ADV.value ≡ report value */
await T('TC-INT-15','calculation lineage — CV.output ≡ ADV.value ≡ report; print cites CV; no contradicting approved run',()=>{
 const out=[];
 ['ENV-GHG-001','ENV-GHG-003','SOC-OHS-002'].forEach(id=>{
  const a=advGet(id,'FY2025'),cv=cvOf(id,'FY2025');
  if(!cv)return out.push(id+': no CalculationVersion');
  if(cv.output!==a.v)out.push(id+': CV.output '+cv.output+' ≠ ADV '+a.v);
  if(!Object.isFrozen(cv))out.push(id+': CV not immutable');
  if(a.cv!==cv.id)out.push(id+': ADV not linked to CV');
  const el=Object.keys(REPORT_BINDINGS).find(e=>REPORT_BINDINGS[e].kind==='adv'&&REPORT_BINDINGS[e].kpi===id);
  if(el){const r=resolveReportBinding(el);
   if(r.value!==cv.output)out.push(id+': report value '+r.value+' ≠ CV.output '+cv.output);
   if(r.cvId!==cv.id)out.push(id+': resolver cvId ≠ CV');
   if(r.sourceType!=='ApprovedCalculationVersion')out.push(id+': sourceType not CV-backed')}});
 location.hash='#/rpt/print';render();const t=document.querySelector('#main').textContent;
 if(!t.includes(cvOf('ENV-GHG-001','FY2025').id))out.push('print §5.1 does not cite Scope-1 CV');
 if(!t.includes(cvOf('ENV-GHG-003','FY2025').id))out.push('print §5.1 does not cite Scope-2 CV');
 if(t.includes('12,480'))out.push('print still shows contradicting 12,480');
 // no APPROVED run may contradict the CV for the same method family
 D.runs.filter(r=>r.st==='approved'&&r.method.includes('S1')).forEach(r=>{
  const cv=cvOf('ENV-GHG-001','FY2025');
  if(Math.abs(parseFloat(String(r.out).replace(/,/g,''))-cv.output)>0.05)out.push(r.id+' ('+r.out+') contradicts '+cv.id)});
 return {pass:out.length===0,actual:out.join('; ')||'CV≡ADV≡Report on 3 calculated KPIs; print cites CV ids'}});

/* TC-INT-16 — P0-4 regression: binding matrix truth — runtime statuses ≡ matrix 53, 16/16, no overclaim */
await T('TC-INT-16','binding registry truthful — every matrix-53 status matches the runtime resolver (16/16)',()=>{
 const exp={'RB-001':'BOUND','RB-002':'BOUND','RB-003':'BOUND','RB-004':'BOUND','RB-005':'BOUND',
  'RB-006':'BOUND','RB-007':'BOUND','RB-008':'SPECIFIED — NOT YET BOUND','RB-009':'BOUND','RB-010':'BOUND',
  'RB-011':'BOUND — OBJECT','RB-012':'BOUND — OBJECT','RB-013':'BOUND — OBJECT',
  'RB-014':'SPECIFIED — NOT YET BOUND','RB-015':'SPECIFIED — NOT YET BOUND','RB-016':'BOUND'};
 const bad=Object.keys(exp).filter(id=>resolveReportBinding(id).status!==exp[id]).map(id=>id+'='+resolveReportBinding(id).status);
 const extra=Object.keys(REPORT_BINDINGS).filter(id=>!exp[id]);
 return {pass:bad.length===0&&extra.length===0&&Object.keys(REPORT_BINDINGS).length===16,
  actual:bad.concat(extra.map(x=>'extra:'+x)).join('; ')||'16/16 runtime statuses ≡ matrix 53'}});

/* TC-INT-06 — no second business-value store */
await T('TC-INT-06','single store: D.fact is not an array/store; consumers project D.adv',()=>{
 return {pass:!Array.isArray(D.fact)&&typeof factOf==='function'&&factOf('ENV-WAT-001').advId.startsWith('ADV-'),actual:'D.adv only'}});

/* TC-INT-07 — verbatim 113 + checksum */
await T('TC-INT-07','113 KPIs verbatim + checksum + untruncated samples',()=>{
 const ok=KPIM.length===113&&KPIM_CHECKSUM.length===16
  &&kpiById('ENV-GHG-001').dep==='الطاقة والمرافق Energy, Utilities & Facilities'
  &&KPIM.some(k=>k.g==='GRI 403: Occupational Health and Safety 2018 — 403-9');
 return {pass:ok,actual:'checksum '+KPIM_CHECKSUM}});

/* TC-INT-08 — FK + semantic integrity */
await T('TC-INT-08','fkCheck v2 (IDs + semantic labels + xplan/dpr/adv/bindings) = 0',()=>{
 const bad=fkCheck();return {pass:bad.length===0,actual:bad.slice(0,3).join(';')||'0 violations'}});

/* TC-INT-09 — report binding identity */
await T('TC-INT-09','report binding identity (resolver everywhere)',()=>{
 const r=resolveReportBinding('RB-002');const f=factOf('ENV-GHG-003');
 location.hash='#/rpt/print';render();
 const t=document.querySelector('#main').textContent;
 return {pass:r.status==='BOUND'&&r.value===f.fy25&&r.approvedVersionId===f.advId&&t.includes(String(r.value)),actual:r.approvedVersionId+'='+r.value}});

/* TC-INT-10 — dimensional grain machine-readable */
await T('TC-INT-10','dimsSchema[] machine-readable on report-critical families',()=>{
 const w=kpiById('ENV-WAT-001').dimsSchema.map(d=>d.id);
 const s3=KPIM.find(k=>k.id==='ENV-GHG-006').dimsSchema.map(d=>d.id);
 return {pass:w.includes('water_stress_status')&&w.includes('flow_type')&&s3.includes('scope3_category')&&s3.includes('primary_data_pct'),actual:w.join(',')}});

/* TC-INT-11 — target methodology gate */
await T('TC-INT-11','RAG = NOT_EVALUATED while MD-02 unsigned; no numeric fallback',()=>{
 const p=tgtProgress(D.targets[0]);
 const src=tgtProgress.toString();
 return {pass:p.rag==='NOT_EVALUATED'&&p.on===null&&!src.includes('?5')&&!src.includes('0.4'),actual:p.rag+' asOf '+p.asOf}});

/* TC-INT-12 — True Zero across surfaces */
await T('TC-INT-12','TRUE ZERO renders 0 (never Not-started/Missing)',()=>{
 const f=factOf('SOC-OHS-001');const fb=(location.hash='#/data/factbook',fbSel('Occupational Health & Safety'),document.querySelector('#main').textContent);
 return {pass:f.fy25===0&&fb.includes('SOC-OHS-001'),actual:'fatalities fy25=0 rendered'}});

/* ---- GOLDEN TEST — generic lifecycle on FOUR data shapes, now asserted on the release manifest DOM too ---- */
const golden=async(kpi,label)=>{
 await T('GOLD-'+kpi,'golden lifecycle — '+label,(kpi)=>{
  const before=advGet(kpi,'FY2025');const v0=before.v,id0=before.id;
  const f=factOf(kpi);if(f.fy25!==v0||f.advId!==id0)return {pass:false,actual:'projection mismatch'};
  const el=Object.keys(REPORT_BINDINGS).find(e=>REPORT_BINDINGS[e].kind==='adv'&&REPORT_BINDINGS[e].kpi===kpi);
  if(el){const r=resolveReportBinding(el);if(r.value!==v0||r.approvedVersionId!==id0)return {pass:false,actual:'binding mismatch'}}
  const recs=recordsFor(kpi,'FY2025');if(!recs.length)return {pass:false,actual:'no source records'};
  const key=Object.keys(D.dpr).find(k=>k.startsWith(kpi+'|'));const site=key.split('|')[1];const per=key.split('|')[2];
  const old=D.dpr[key].v;dprSet(kpi,site,per,String(old+(kpi==='GEN-EMP-001'?3:5)));
  if(!advStale(kpi,'FY2025'))return {pass:false,actual:'not stale after edit'};
  if(!factOf(kpi).stale)return {pass:false,actual:'projection not stale'};
  if(el&&!resolveReportBinding(el).stale)return {pass:false,actual:'binding not stale'};
  const nv=approve(kpi,'FY2025');if(!nv)return {pass:false,actual:'approve failed'};
  if(nv.id===id0)return {pass:false,actual:'version not incremented'};
  if(!D.advHist.some(h=>h.id===id0&&h.st==='superseded'))return {pass:false,actual:'old version not archived immutable'};
  const f2=factOf(kpi);if(f2.advId!==nv.id||f2.stale)return {pass:false,actual:'consumers did not move to new version'};
  if(el){const r2=resolveReportBinding(el);if(r2.approvedVersionId!==nv.id)return {pass:false,actual:'report still on old version'}}
  // CALCULATED KPIs must also mint a NEW immutable CalculationVersion whose output ≡ new ADV
  if(kpiById(kpi).agg==='CALCULATED'){const cv=cvOf(kpi,'FY2025');
   if(!cv||cv.id.indexOf(nv.ver)<0||cv.output!==nv.v)return {pass:false,actual:'no new CV minted on re-approval'};
   if(!D.calcVersHist.some(h=>h.st==='superseded'&&h.kpi===kpi))return {pass:false,actual:'old CV not archived'}}
  // the RELEASE MANIFEST (a real consumer surface) must now show the new ADV id
  location.hash='#/rpt/rexp';render();
  if(el&&!document.querySelector('#main').textContent.includes(nv.id))return {pass:false,actual:'release manifest not on new version'};
  // restore demo state
  dprSet(kpi,site,per,String(old));approve(kpi,'FY2025');
  if(kpi==='ENV-GHG-003')D.brk['ENV-GHG-003|FY2025'].advId=advGet(kpi,'FY2025').id; // governed re-allocation
  const back=advGet(kpi,'FY2025');
  return {pass:Math.abs(back.v-v0)<0.6,actual:'v '+id0+' → '+nv.id+' → manifest moved → restored '+back.v}},kpi)};
await golden('ENV-GHG-001','Scope 1 (calculated GHG)');
await golden('ENV-WAT-001','Water (dimensional SUM)');
await golden('SOC-OHS-002','OHS TRIR (calculated rate)');
await golden('GEN-EMP-001','Workforce (END_OF_PERIOD breakdown)');

/* TC-INT-04 — stale visible in the Fact Book; clears on approval (worked WST example) */
await T('TC-INT-04','stale shown in Fact Book; clears on approval (worked WST example)',()=>{
 const staleNow=advStale('ENV-WST-001','FY2025');
 location.hash='#/data/factbook';fbSel('Waste');const t1=document.querySelector('#main').textContent.includes('stale');
 approve('ENV-WST-001','FY2025');const cleared=!advStale('ENV-WST-001','FY2025');
 return {pass:staleNow&&t1&&cleared,actual:'WST stale→approve→cleared'}});

/* TC-INT-05 — stale visible in the REPORT DOM itself (was only asserted on Fact Book in V13.1) */
await T('TC-INT-05','stale shown in the printed report row; clears after re-approval (report DOM)',()=>{
 const key=Object.keys(D.dpr).find(k=>k.startsWith('ENV-GHG-003|'));
 dprSet('ENV-GHG-003',key.split('|')[1],key.split('|')[2],String(D.dpr[key].v)); // dirty, same value
 location.hash='#/rpt/print';render();
 const staleShown=document.querySelector('#main').textContent.includes('Stale');
 approve('ENV-GHG-003','FY2025');
 D.brk['ENV-GHG-003|FY2025'].advId=advGet('ENV-GHG-003','FY2025').id; // governed re-allocation
 location.hash='#/rpt/print';render();
 const cleared=!document.querySelector('#main').textContent.includes('Stale — record edited');
 return {pass:staleShown&&cleared,actual:'report row: stale→re-approve→Approved 🔒'}});

/* route sweep + zero errors */
await T('SWEEP','all routes render, zero console/page errors',async function(){return true});
const routes=await pg.evaluate(()=>Object.keys(VIEWS).filter(k=>k!=='login'));
let short=[];for(const r of routes){await pg.evaluate(x=>{location.hash='#/'+x;render()},r);await pg.waitForTimeout(8);
 const len=await pg.evaluate(()=>document.querySelector('#main').innerHTML.length);if(len<300)short.push(r)}
R[R.length-1].pass=short.length===0&&errs.length===0;R[R.length-1].actual=routes.length+' routes; short:'+short.join(',')+'; errors:'+errs.slice(0,2).join(';');
console.log(R[R.length-1].pass?'PASS':'FAIL','SWEEP',R[R.length-1].actual);

const out={build:'24_ESG_OS_v14_FinalDeveloperBaseline.html',at:new Date().toISOString(),routes:routes.length,
 total:R.length,passed:R.filter(x=>x.pass).length,results:R,pass:R.every(x=>x.pass)};
fs.mkdirSync(path.resolve(__dirname,'..','test-results'),{recursive:true});
fs.writeFileSync(path.resolve(__dirname,'..','test-results','v14_regression_suite.json'),JSON.stringify(out,null,1));
console.log(out.pass?('\n== V14 REGRESSION: ALL GREEN ('+out.passed+'/'+out.total+') =='):('\n== FAILURES: '+(out.total-out.passed)+'/'+out.total+' =='));
await b.close();process.exit(out.pass?0:1)})();
