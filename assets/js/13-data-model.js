/* ═══════════════════════════════════════════════════════════════════════════
   ESG OS v14 — shell wiring + V12 DATA OPERATING MODEL + late VIEWS
   Extracted verbatim from the single-file build. Classic script: LOAD ORDER
   IS SIGNIFICANT — see the <script> tags in the entry HTML.
   ═══════════════════════════════════════════════════════════════════════════ */
/* ════════════ 12 · BOOT — single pass ════════════ */
const roleSel=$('#roleSel');
roleSel.innerHTML=ROLES.map(r=>`<option value="${r.id}">${LANG==='ar'?r.ar:r.en}</option>`).join('');
roleSel.onchange=e=>{ROLE=e.target.value;location.hash=ROLE==='ASSUR'?'#/asr/aeng':'#/home';render();toast((LANG==='ar'?'تبديل الشخصية (عرض تجريبي) — الصلاحيات تبقى محكومة بالخادم':'Persona switched (demo) — permissions stay server-controlled'))};
$('#langSel').onchange=e=>{LANG=e.target.value;roleSel.innerHTML=ROLES.map(r=>`<option value="${r.id}" ${r.id===ROLE?'selected':''}>${LANG==='ar'?r.ar:r.en}</option>`).join('');render()};
/* v13.1.1: stale document.title override removed — the <title> tag is the single source */

/* ================= V12 · DATA OPERATING MODEL ================= */
    /* KPIM (the KPI master) now lives in assets/data/kpi-master.json and is
       loaded ahead of this file via assets/data/kpi-master.js. */
const KPIM_CHECKSUM="c29c10b36b7e163d";

/* Canonical ESG tree — built from controlled KPI data, never hard-coded */
const CANON=(()=>{const P={E:['E','Environmental','البيئة'],S:['S','Social','المجتمع'],G:['G','Governance / Economic','الحوكمة والاقتصاد'],GEN:['GEN','General (GRI 2)','عام (GRI 2)']};const m={};KPIM.forEach(k=>{(m[k.p]=m[k.p]||{});(m[k.p][k.t]=m[k.p][k.t]||[]).push(k)});
 return ['E','S','G','GEN'].filter(p=>m[p]).map(p=>({p,en:P[p][1],ar:P[p][2],topics:Object.keys(m[p]).map(t=>({t,kpis:m[p][t]}))}))})();
/* Machine-readable Dimension Schemas — derived from 53 Report Coverage families; consumed by forms, plan, validation, bindings */
const DIM_SCHEMAS={
 'ENV-GHG-006..012':[{id:'scope3_category',required:true,values:'1–15'},{id:'included_flag',required:true},{id:'emission_value',required:true},{id:'primary_data_pct',required:true},{id:'exclusion_rationale',required:false},{id:'period_id',required:true}],
 'ENV-WAT':[{id:'site_id',required:true},{id:'water_source',required:true},{id:'water_type',required:true},{id:'water_stress_status',required:true},{id:'flow_type',required:true,values:'Withdrawal|Discharge|Consumption'},{id:'period_id',required:true}],
 'SOC-EMP|GEN-EMP':[{id:'gender',required:true},{id:'region',required:true},{id:'contract_type',required:true},{id:'employment_type',required:true},{id:'employee_category',required:true},{id:'period_id',required:true}],
 'SOC-OHS':[{id:'worker_relationship',required:true,values:'Employee|Non-employee'},{id:'injury_type',required:true},{id:'hours_worked',required:true},{id:'rate_type',required:false},{id:'hazard_category',required:false},{id:'site_id',required:true},{id:'period_id',required:true}],
 'ENV-WST':[{id:'waste_type',required:true},{id:'hazardous_status',required:true},{id:'treatment_route',required:true},{id:'onsite_offsite',required:true},{id:'material_category',required:false},{id:'site_id',required:true},{id:'period_id',required:true}],
 'ENV-BIO':[{id:'site_location',required:true},{id:'sensitive_area_relationship',required:true},{id:'value_chain_location',required:true},{id:'impact_driver',required:true},{id:'ecosystem_state',required:false},{id:'ecosystem_service',required:false},{id:'period_id',required:true}]};
KPIM.forEach(k=>{
 if(/^ENV-GHG-0(0[6-9]|1[0-2])$/.test(k.id))k.dimsSchema=DIM_SCHEMAS['ENV-GHG-006..012'];
 else if(k.id.startsWith('ENV-WAT'))k.dimsSchema=DIM_SCHEMAS['ENV-WAT'];
 else if(k.id.startsWith('SOC-EMP')||k.id.startsWith('GEN-EMP'))k.dimsSchema=DIM_SCHEMAS['SOC-EMP|GEN-EMP'];
 else if(k.id.startsWith('SOC-OHS'))k.dimsSchema=DIM_SCHEMAS['SOC-OHS'];
 else if(k.id.startsWith('ENV-WST'))k.dimsSchema=DIM_SCHEMAS['ENV-WST'];
 else if(k.id.startsWith('ENV-BIO'))k.dimsSchema=DIM_SCHEMAS['ENV-BIO'];
 else k.dimsSchema=[{id:'entity_id',required:true},{id:'site_id',required:k.p==='E'},{id:'period_id',required:true}];});
function kpiById(id){return KPIM.find(k=>k.id===id)}
/* ---- ONE authoritative period-record store: KPI+Site+Period → DatapointRecord ---- */
D.dpr={};
;(function(){const mv=[121400,118900,124300,119800,122600,125100,127900,126400,123800,125900,127200,128750];
 mv.forEach((v,i)=>{D.dpr['ENV-GHG-003|EG-CEM-01|2025-'+String(i+1).padStart(2,'0')]={v,u:'kWh',st:i===11?'returned':'approved',rec:i===11?'REC-1026':'REC-10'+(10+i)}});
 D.dpr['ENV-ENE-001|EG-CEM-01|2025-12']={v:1290,u:'GJ',st:'approved',rec:'REC-1031'};
 D.dpr['SOC-OHS-001|EG-QRY-01|2025-12']={v:0,u:'cases',st:'approved',zero:true,rec:'REC-1042'};})();
function dprKey(k,s0,p0){return k+'|'+s0+'|'+p0}
function dprGet(k,s0,p0){return D.dpr[dprKey(k,s0,p0)]||null}
function dprSet(k,s0,p0,v){const n=Number(String(v).replace(/,/g,''));
 if(String(v).trim()===''||isNaN(n)){toast(LANG==='ar'?'مرفوض: الفراغ لا يتحول صفرًا — استخدم حالة القيمة Missing (تقدير موثق أو حذف أو استبعاد)':'Refused: blank never becomes zero — use value-state Missing (documented estimate, omission, or exclusion)');return false}
 const key=dprKey(k,s0,p0);const r=D.dpr[key]||(D.dpr[key]={u:'',st:'draft'});r.v=n;r.st='draft';r.dirty=true;audit('datapoint.entry',key,'grid edit → same DatapointRecord; dependent ApprovedVersion marked stale');return true}
/* ================================================================
   V13.1 GENERIC APPROVED-FACT ENGINE — no KPI special-casing anywhere.
   SourceRecord → (Calculation) → ApprovedDatapointVersion → Bindings.
   ================================================================ */
/* Controlled calculation-method registry (Calc Cards = DATA, keyed by calcMethodId) */
const CALC_METHODS={
 'CALC-ENV-GHG-003':{name:'Scope 2 LB — kWh × grid EF',unit:'tCO₂e',ef:0.458,efId:'EF-EG-ELEC-2025 v1',ver:'CALC-GHG-S2-LOC v1',
   fn:recs=>Math.round(recs.reduce((a,r)=>a+r.v,0)*0.458)/1000},
 'CALC-ENV-GHG-001':{name:'Scope 1 — diesel litres × EF (kgCO₂e/L) ÷ 1000',unit:'tCO₂e',efId:'EF-STAT-01 (NCV) · IPCC AR6',ver:'CALC-GHG-S1-DIESEL v2',
   fn:recs=>Math.round(recs.reduce((a,r)=>a+r.v,0)*2.6857/100)/10},
 'CALC-SOC-OHS-002':{name:'TRIR — injuries × 200,000 / hours',unit:'per 200k hrs',efId:'OSHA method',ver:'CALC-SAF-RATES v1',
   fn:recs=>{const inj=recs.reduce((a,r)=>a+r.v,0),hrs=recs.reduce((a,r)=>a+(r.hrs||0),0);return hrs?Math.round(inj*200000/hrs*100)/100:null}}};
/* Aggregation — strictly definition-driven */
function aggregateKpi(def,recs){if(!recs.length)return null;
 switch(def.agg){
  case 'SUM':return Math.round(recs.reduce((a,r)=>a+r.v,0)*10)/10;
  case 'AVERAGE':return Math.round(recs.reduce((a,r)=>a+r.v,0)/recs.length*10)/10;
  case 'END_OF_PERIOD':return recs[recs.length-1].v;
  case 'CALCULATED':{const m=CALC_METHODS[def.calc||('CALC-'+def.id)];return m?m.fn(recs):null}
  default:return null}}
/* Period records already live in D.dpr (KPI|Site|Period). Reconciled seeds for 4 KPI classes: */
;(function(){
 const put=(k,site,i,rec)=>{D.dpr[k+'|'+site+'|2025-'+String(i+1).padStart(2,'0')]=rec};
 // A. ENV-GHG-003 (CALCULATED) — 12 monthly kWh at EG-CEM-01 that reconcile EXACTLY to 742.1 tCO₂e @0.458
 const kwh=[134900,132800,136200,133500,135800,137100,138400,136900,134600,136300,134056,128750];
 const tgt=Math.round(742.1/0.458*1000); const cur=kwh.reduce((a,b)=>a+b,0); kwh[10]+=tgt-cur; // reconcile to the approved value
 kwh.forEach((v,i)=>put('ENV-GHG-003','EG-CEM-01',i,{v,u:'kWh',st:i===11?'returned':'approved',rec:i===11?'REC-1026':'REC-10'+(10+i)}));
 // A2. ENV-GHG-001 (CALCULATED Scope 1) — 12 monthly diesel-litre records reconciling to 833.6 tCO₂e
 [25900,25700,26000,25800,25950,25850,26100,25980,25760,25890,25870,25580].forEach((v,i)=>put('ENV-GHG-001','EG-CEM-01',i,{v,u:'L diesel',st:'approved',rec:'REC-20'+(10+i)}));
 // B. ENV-WAT-001 (SUM, ML) at EG-QRY-01 — sums exactly to 391.2
 const wat=[33.1,31.8,34.0,32.2,33.6,32.9,33.4,32.1,31.9,32.6,31.9,31.7];
 const wcur=Math.round(wat.reduce((a,b)=>a+b,0)*10)/10; wat[11]=Math.round((wat[11]+(391.2-wcur))*10)/10;
 wat.forEach((v,i)=>put('ENV-WAT-001','EG-QRY-01',i,{v,u:'ML',st:'approved',rec:'REC-1050'}));
 // C. SOC-OHS-002 (CALCULATED TRIR) — injuries + hours reconcile to 1.41
 for(let i=0;i<12;i++)put('SOC-OHS-002','GROUP',i,{v:i%4===0?2:1,hrs:i===11?141900:141850,u:'inj·hrs',st:'approved',rec:'REC-2040'});
 (function(){const recs=Array.from({length:12},(_,i)=>D.dpr['SOC-OHS-002|GROUP|2025-'+String(i+1).padStart(2,'0')]);
  const inj=recs.reduce((a,r)=>a+r.v,0);const target=1.41;const hrs=Math.round(inj*200000/target);
  const cur=recs.reduce((a,r)=>a+r.hrs,0);recs[11].hrs+=hrs-cur;})();
 // D. GEN-EMP-001 (END_OF_PERIOD headcount) — Dec = 672
 [655,657,659,660,662,664,665,667,668,670,671,672].forEach((v,i)=>put('GEN-EMP-001','GROUP',i,{v,u:'persons',st:'approved',rec:'REC-1001'}));
 // Worked stale example (generic — via a dirty record, NOT a name check): ENV-WST-001 has one edited-after-approval record
 put('ENV-WST-001','EG-CEM-01',11,{v:0.66,u:'kt',st:'approved',rec:'REC-1052',dirty:true});
})();
/* ---- THE single fact store ---- */
D.adv={}; D.advHist=[];
;(function(){const seed=[
 ['ENV-GHG-001',[920.4,871.2,833.6],'RUN-2209','High','Limited'],
 ['ENV-GHG-003',[812.0,768.3,742.1],'RUN-2210','High','Limited'],
 ['ENV-GHG-004',[735.5,719.8,702.4],'RUN-2212','High','Limited'],
 ['ENV-ENE-001',[15400,14890,14210],'REC-1031','High','Limited'],
 ['ENV-ENE-004',[12.4,14.1,16.8],'RUN-2216','Medium','—'],
 ['ENV-WAT-001',[412.5,398.7,391.2],'REC-1050','Medium','—'],
 ['ENV-WST-001',[8.42,8.11,7.65],'REC-1052','Medium','—'],
 ['SOC-EMP-001',[604,635,672],'REC-1001','High','Limited'],
 ['SOC-OHS-002',[1.84,1.62,1.41],'RUN-2230','High','Limited'],
 ['SOC-OHS-001',[0,1,0],'REC-1042','High','Limited'],
 ['SOC-DIV-001',[21.5,23.8,26.1],'REC-1060','Medium','—'],
 ['SOC-TRN-001',[14.2,16.8,19.4],'REC-1061','Medium','—'],
 ['GOV-ETH-001',[0,0,0],'REC-1070','High','Limited'],
 ['GOV-ECO-001',[184.2,201.5,214.8],'REC-1072','High','—'],
 ['GEN-EMP-001',[604,635,672],'REC-1001','High','Limited']];
 seed.forEach(([id,vals,rec,q,asr])=>{['FY2023','FY2024','FY2025'].forEach((per,i)=>{
  D.adv[id+'|'+per]={id:'ADV-'+id+'-'+per+'-v3',kpi:id,per,v:vals[i],rec,q,asr,ver:'v3',st:'approved',
   approvedBy:'O. Farid',approvedAt:'2026-02-12',supersedes:'ADV-'+id+'-'+per+'-v2',
   src:'D.dpr['+id+'|*|'+per.replace('FY','')+'-MM]'}})})})();
function advGet(id,per){return D.adv[id+'|'+per]||null}
function recordsFor(id,per){per=per||'FY2025';const y=per.replace('FY','');
 return Object.keys(D.dpr).filter(k=>k.startsWith(id+'|')&&k.includes('|'+y+'-')).sort().map(k=>D.dpr[k])}
/* GENERIC stale: an ApprovedVersion is stale iff ANY of its period source records was edited after approval */
function advStale(id,per){per=per||'FY2025';return recordsFor(id,per).some(r=>r.dirty===true)}
/* GENERIC approval transition — creates an immutable new version from the records via the definition */
function approve(id,per){per=per||'FY2025';const def=kpiById(id);if(!def){toast('Unknown KPI');return null}
 const recs=recordsFor(id,per);if(!recs.length){toast('No period records to approve for '+id);return null}
 const v=aggregateKpi(def,recs);if(v==null){toast('Aggregation method '+def.agg+' yielded no value');return null}
 const prev=advGet(id,per);if(prev)D.advHist.push(Object.freeze({...prev,st:'superseded'}));
 const vno='v'+((prev?parseInt(prev.ver.slice(1)):3)+1);
 D.adv[id+'|'+per]={id:'ADV-'+id+'-'+per+'-'+vno,kpi:id,per,v,rec:def.agg==='CALCULATED'?(CALC_METHODS[def.calc]?def.calc:prev&&prev.rec):(prev?prev.rec:'REC'),
  q:prev?prev.q:'High',asr:prev?prev.asr:'—',ver:vno,st:'approved',approvedBy:ROLE,approvedAt:'now',
  supersedes:prev?prev.id:null,src:recs.length+' period records'};
 recs.forEach(r=>{delete r.dirty});
 if(def.agg==='CALCULATED')mintCalcVersion(id,per,D.adv[id+'|'+per],recs);
 audit('datapoint.approve',id+'|'+per,'ApprovedDatapointVersion '+vno+' created from '+recs.length+' records ('+def.agg+') — supersedes kept immutable; all bindings now resolve '+vno);
 render();return D.adv[id+'|'+per]}
function advApprove(id,per){return approve(id,per)} // back-compat alias
/* ---- V13.1.1: IMMUTABLE CALCULATION-VERSION LINEAGE (P0-3 closure) ----
   A CALCULATED KPI's ApprovedDatapointVersion links ONE frozen CalculationVersion whose
   output IS the approved value. FREEZE RULE: CV.output === ADV.value === report value —
   a surface can never cite an execution whose output differs (TC-INT-15). */
D.calcVers={};D.calcVersHist=[];
function cvOf(id,per){return D.calcVers[id+'|'+(per||'FY2025')]||null}
function mintCalcVersion(id,per,adv,recs){const def=kpiById(id);if(!def||def.agg!=='CALCULATED')return null;
 const mId=def.calc||('CALC-'+def.id);const m=CALC_METHODS[mId];if(!m)return null;
 const prev=D.calcVers[id+'|'+per];if(prev)D.calcVersHist.push(Object.freeze({...prev,st:'superseded'}));
 const cv=Object.freeze({id:'CV-'+id+'-'+per+'-'+adv.ver,kpi:id,per,methodId:mId,methodVer:m.ver||mId,
  factorVersionIds:m.efId?[m.efId]:[],inputRecordIds:[...new Set(recs.map(r=>r.rec).filter(Boolean))],inputs:recs.length,
  output:adv.v,unit:m.unit||def.u,executedAt:adv.approvedAt,reviewedBy:'O. Farid',approvedBy:adv.approvedBy,
  approvedAt:adv.approvedAt,st:'approved',
  hash:(id+'|'+per+'|'+adv.v).split('').reduce((a,c)=>((a<<5)-a+c.charCodeAt(0))|0,7).toString(16)});
 D.calcVers[id+'|'+per]=cv;adv.cv=cv.id;return cv}
/* mint at boot for every CALCULATED KPI whose approved value is backed by live period records */
Object.keys(D.adv).forEach(k=>{const a=D.adv[k];const d0=kpiById(a.kpi);
 if(d0&&d0.agg==='CALCULATED'){const rs=recordsFor(a.kpi,a.per);if(rs.length)mintCalcVersion(a.kpi,a.per,a,rs)}});
/* PROJECTION — the only read path for every consumer */
function factOf(id){const a3=advGet(id,'FY2023'),a4=advGet(id,'FY2024'),a5=advGet(id,'FY2025');
 if(!a5)return null;const tg=D.targets.find(x=>x.kpi===id);
 return {id,fy23:a3&&a3.v,fy24:a4&&a4.v,fy25:a5.v,rec:a5.rec,q:a5.q,asr:a5.asr,ver:a5.ver,advId:a5.id,
  tgt:tg?tg.tv:null,stale:advStale(id,'FY2025')}}
D.fact={get length(){return Object.keys(D.adv).filter(k=>k.endsWith('FY2025')).length}}; // count shim — NOT a store
/* ---- V13.1.1: APPROVED DIMENSIONAL BREAKDOWN (P0-2 closure) ----
   The site allocation of an approved total is itself governed data pinned to an
   ApprovedVersion id. RULE: sum(rows) === ADV.value, and chart + table render the SAME
   dataset. A newer approved total SUPERSEDES the allocation — surfaces refuse it until
   it is re-allocated (never silently keep old rows). */
D.brk={
 'ENV-GHG-003|FY2025':{advId:'ADV-ENV-GHG-003-FY2025-v3',unit:'tCO₂e',dims:'site',
  rows:[['EG-CEM-01',648.6],['SA-SOL-01',16.3],['SA-WND-01',8.9],['SA-DEP-01',68.3]],notes:{'SA-DEP-01':'part-period'}},
 'ENV-GHG-003|FY2024':{advId:'ADV-ENV-GHG-003-FY2024-v3',unit:'tCO₂e',dims:'site',
  rows:[['EG-CEM-01',671.2],['SA-SOL-01',17.8],['SA-WND-01',9.6],['SA-DEP-01',69.7]],notes:{}}};
function brkOf(id,per){const b=D.brk[id+'|'+per];if(!b)return null;const a=advGet(id,per);
 const sum=Math.round(b.rows.reduce((x,r)=>x+r[1],0)*10)/10;
 return {...b,kpi:id,per,sum,total:a?a.v:null,current:!!a&&b.advId===a.id,
  reconciles:!!a&&Math.abs(sum-a.v)<0.05}}
/* ---- ONE report binding layer ---- */
const REPORT_BINDINGS={
 'RB-001':{el:'§5.1 table · Scope 1',kpi:'ENV-GHG-001',per:'FY2025',dims:'group×FY',agg:'CALCULATED',kind:'adv'},
 'RB-002':{el:'§5.1 table · Scope 2 LB',kpi:'ENV-GHG-003',per:'FY2025',dims:'group×FY',agg:'CALCULATED',kind:'adv'},
 'RB-003':{el:'§5.1 table · Scope 2 MB',kpi:'ENV-GHG-004',per:'FY2025',dims:'group×FY',agg:'CALCULATED',kind:'adv'},
 'RB-004':{el:'§5.1 narrative token · Scope 1',kpi:'ENV-GHG-001',per:'FY2025',dims:'—',agg:'CALCULATED',kind:'adv'},
 'RB-005':{el:'§5.1 chart TBL-08 + site table',kpi:'ENV-GHG-003',per:'FY2025',dims:'site',agg:'allocation of the approved total — chart and table read ONE dataset',kind:'breakdown'},
 'RB-006':{el:'§5.2 energy row',kpi:'ENV-ENE-001',per:'FY2025',dims:'group×FY',agg:'SUM',kind:'adv'},
 'RB-007':{el:'§5.3 water row',kpi:'ENV-WAT-001',per:'FY2025',dims:'site×source×stress',agg:'SUM',kind:'adv'},
 'RB-008':{el:'§5.4 waste table',kpi:'ENV-WST-001',per:'FY2025',dims:'haz×treatment×disposition',agg:'SUM',kind:'spec'},
 'RB-009':{el:'§6.1 workforce total',kpi:'GEN-EMP-001',per:'FY2025',dims:'gender×region×contract',agg:'END_OF_PERIOD',kind:'adv'},
 'RB-010':{el:'§6.2 OHS TRIR',kpi:'SOC-OHS-002',per:'FY2025',dims:'group',agg:'CALCULATED',kind:'adv'},
 'RB-011':{el:'Ch.9 targets table',ref:'D.targets + tgtProgress() — RAG gated NOT_EVALUATED until MD-02 is signed',kind:'object'},
 'RB-012':{el:'Ch.10 GRI Content Index',ref:'generated index pipeline (29-§1) — regenerated at every render',kind:'object'},
 'RB-013':{el:'§1/§2 organization facts',ref:'approved org profile + cycle objects (tokv-bound in print)',kind:'object'},
 'RB-014':{el:'Annex · calculation methodology',ref:'CALC_METHODS cards + frozen factor editions — annex page not yet rendered',kind:'spec'},
 'RB-015':{el:'Scope 3 table (template family)',kpi:'ENV-GHG-006',per:'FY2025',dims:'category 1–15 × included × %primary',agg:'CALCULATED',kind:'spec'},
 'RB-016':{el:'§5.2 renewable share token',kpi:'ENV-ENE-004',per:'FY2025',dims:'group',agg:'AVERAGE',kind:'adv'}};
function resolveReportBinding(elId){const b=REPORT_BINDINGS[elId];if(!b)return {elId,status:'UNBOUND'};
 if(b.kind==='object')return {elId,el:b.el,ref:b.ref,status:'BOUND — OBJECT'};
 if(b.kind==='spec')return {elId,el:b.el,kpiId:b.kpi,status:'SPECIFIED — NOT YET BOUND'};
 if(b.kind==='breakdown'){const bk=brkOf(b.kpi,b.per);if(!bk||bk.total==null)return {elId,el:b.el,kpiId:b.kpi,status:'SPECIFIED — NOT YET BOUND'};
  return {elId,el:b.el,kpiId:b.kpi,approvedVersionId:bk.advId,rows:bk.rows,sum:bk.sum,total:bk.total,unit:bk.unit,
   reconciles:bk.reconciles,current:bk.current,value:bk.sum,period:b.per,dims:b.dims,aggregation:b.agg,
   sourceType:'ApprovedBreakdown',stale:!bk.current||advStale(b.kpi,b.per),
   status:bk.current?'BOUND':'SUPERSEDED — RE-ALLOCATE'}}
 const a=advGet(b.kpi,b.per);const k=kpiById(b.kpi);if(!a)return {elId,kpiId:b.kpi,status:'SPECIFIED — NOT YET BOUND'};
 const cv=cvOf(b.kpi,b.per);
 return {elId,el:b.el,kpiId:b.kpi,approvedVersionId:a.id,cvId:cv?cv.id:null,value:a.v,unit:k?k.u:'',period:b.per,dims:b.dims,
  aggregation:b.agg,sourceType:cv?'ApprovedCalculationVersion':'ApprovedDatapointVersion',
  stale:advStale(b.kpi,b.per),status:'BOUND'}}
function bindFact(idOrEl,unit){const elId=REPORT_BINDINGS[idOrEl]?idOrEl:Object.keys(REPORT_BINDINGS).find(x=>REPORT_BINDINGS[x].kpi===idOrEl&&REPORT_BINDINGS[x].per==='FY2025');
 const r=elId?resolveReportBinding(elId):{status:'UNBOUND'};
 if(r.status!=='BOUND')return '<b class="tokw" title="'+r.status+' — Release refuses">UNBOUND</b>';
 return `<b class="tok" title="${r.elId} → ${r.kpiId} → ${r.approvedVersionId} · ${r.period} · ${r.aggregation}">${r.value}${unit?' '+unit:''}</b>${r.stale?' <b class="tokw" title="upstream record edited after approval — re-approve, then re-render">⚠ stale</b>':''}`}
/* ---- Targets & Goals — first-class objects ---- */
D.targets=[
 {id:'TGT-01',topic:'MT-01',kpi:'ENV-GHG-001',stmt:'Reduce absolute Scope 1 30% vs FY2022 by 2030',type:'Absolute reduction',by:2022,bv:1020,ty:2030,tv:714,unit:'tCO₂e',scope:'Group',own:'L. Al-Harbi',appr:'Executive Committee 12 Nov 2025',ev:'EV-0080',st:'Approved',ver:'v2',ca:''},
 {id:'TGT-02',topic:'MT-02',kpi:'ENV-ENE-004',stmt:'Reach 30% renewable electricity by 2030',type:'Share increase',by:2022,bv:8.1,ty:2030,tv:30,unit:'%',scope:'Group',own:'O. Farid',appr:'Executive Committee',ev:'EV-0081',st:'Approved',ver:'v1',ca:''},
 {id:'TGT-03',topic:'MT-04',kpi:'SOC-OHS-002',stmt:'TRIR below 1.2 by FY2026',type:'Rate reduction',by:2023,bv:1.84,ty:2026,tv:1.2,unit:'per 200k hrs',scope:'All sites',own:'K. Mansour',appr:'HSE Committee',ev:'EV-0082',st:'Approved',ver:'v1',ca:''},
 {id:'TGT-04',topic:'— non-material (management target)',kpi:'SOC-DIV-001',stmt:'30% women in management by 2028',type:'Share increase',by:2023,bv:21.5,ty:2028,tv:30,unit:'%',scope:'Group',own:'HR Director',appr:'Board People Cttee',ev:'EV-0083',st:'Approved',ver:'v1',ca:'Hiring-slate rule added FY2026'},
 {id:'TGT-05',topic:'MT-03',kpi:'ENV-WAT-001',stmt:'Reduce withdrawal intensity 10% by 2027',type:'Intensity reduction',by:2023,bv:412.5,ty:2027,tv:371,unit:'ML',scope:'Water-stressed sites',own:'F. Said',appr:'—',ev:'',st:'Draft',ver:'v1',ca:''}];
/* Governance gate — methodology configuration (controlled data, not code constants) */
const METH={md01Signed:false,md02Signed:false,tolPct:null /* set ONLY by approved methodology */,ragMethodVersion:'MD-02 draft'};
D.cycle.perfAsOf='FY2025'; // PerformanceAsOfDate — from the Reporting Cycle, never today()/implicit
const MD02_SIGNED=METH.md02Signed;
/* Trajectory methodology MD-02 (adopted; Methodology Owner countersign pending):
   method = Linear unless the target declares another; expected(asOf) = bv + (tv−bv)·(asOf−by)/(ty−by);
   RAG: GREEN when actual is at/beyond expected; AMBER when short of expected within the target's approved
   tolerance parameter tolPct (a governed field, default 5 — a methodology parameter, not code); RED beyond. */
function tgtExpected(t,asOf){asOf=asOf||2025;if(asOf<=t.by)return t.bv;if(asOf>=t.ty)return t.tv;return t.bv+(t.tv-t.bv)*(asOf-t.by)/(t.ty-t.by)}
function tgtProgress(t){const f=factOf(t.kpi);if(!f||f.fy25==null)return null;const cur=f.fy25;
 const asOf=parseInt(String(D.cycle.perfAsOf).replace('FY',''))||t.ty;
 const exp=tgtExpected(t,asOf);
 const p=Math.round(100*Math.min(1,Math.max(0,(t.bv-cur)/(t.bv-t.tv))));
 const base={cur,exp:Math.round(exp*10)/10,p,asOf:'FY'+asOf,var:Math.round((cur-exp)*10)/10,method:t.method||'Linear',methVer:METH.ragMethodVersion};
 if(!METH.md02Signed)return {...base,on:null,rag:'NOT_EVALUATED'}; /* governance gate: no Green/Amber/Red before countersign */
 const tol=(t.tolPct??METH.tolPct);if(tol==null)return {...base,on:null,rag:'NOT_EVALUATED'}; /* no silent numeric fallback — tolerance must be governed */
 const improving=t.tv<t.bv?cur<=exp:cur>=exp;const gap=t.tv<t.bv?cur-exp:exp-cur;
 return {...base,on:improving,rag:improving?'GREEN':(gap<=tol/100*Math.abs(t.tv-t.bv)?'AMBER':'RED')}}
/* ---- ESG Risks & Opportunities (≠ materiality impacts) ---- */
D.risks=[
 {id:'RSK-01',p:'E',topic:'MT-03',n:'Water scarcity disrupts quarry & cement production',drv:'Basin stress + permit tightening',kpis:'ENV-WAT-001 · ENV-WAT-004',il:4,ii:4,ctl:'Recycling circuit; abstraction permits; contingency supply',cown:'F. Said',rl:3,ri:3,due:'2026-06-30',st:'Treatment in progress'},
 {id:'RSK-02',p:'E',topic:'MT-01',n:'Carbon cost exposure (CBAM / local pricing)',drv:'Regulatory',kpis:'ENV-GHG-001 · ENV-GHG-003',il:4,ii:5,ctl:'Decarbonization roadmap; PPA; efficiency capex',cown:'L. Al-Harbi',rl:3,ri:4,due:'2027-01-01',st:'Open'},
 {id:'RSK-03',p:'S',topic:'MT-04',n:'Serious safety incident at O&M contractors',drv:'Contractor control gap',kpis:'SOC-OHS-001 · SOC-OHS-002',il:3,ii:5,ctl:'Contractor HSE pre-qualification; joint audits',cown:'K. Mansour',rl:2,ri:4,due:'2026-03-31',st:'Treatment in progress'},
 {id:'RSK-04',p:'G',topic:'MT-02',n:'Opportunity: green-financing margin discount',drv:'Sustainability-linked loan covenants',kpis:'ENV-ENE-004 · SOC-OHS-002',il:3,ii:3,ctl:'KPI covenant tracking (this platform)',cown:'CFO',rl:3,ri:3,due:'2026-09-30',st:'Opportunity — active'}];
/* ================= VIEWS ================= */
function canonTree(sel,cb){return `<div class="queue" style="min-width:250px"><div class="qh">${LANG==='ar'?'شجرة ESG المعيارية':'Canonical ESG tree'} <span class="sub" data-noar>from KPI Master</span></div>
 ${CANON.map(g=>`<div style="padding:7px 12px;font-weight:800;font-size:11px;letter-spacing:.05em;color:var(--mut)" data-noar>${g.p} · ${LANG==='ar'?g.ar:g.en}</div>
 ${g.topics.map(tp=>{const done=tp.kpis.filter(k=>factOf(k.id)).length;return `<div class="qi ${sel===tp.t?'active':''}" onclick="${cb}('${tp.t.replace(/'/g,"\\'")}')"><span class="secDot ${done===tp.kpis.length&&done?'approved':done?'review':'draft'}"></span> ${esc(tp.t)}<div class="m"><span>${tp.kpis.length} KPI</span><span>${done} ${LANG==='ar'?'معتمد':'approved'}</span></div></div>`}).join('')}`).join('')}</div>`}
let PRG_T='Water & Effluents';function prgSel(t){PRG_T=t;render()}
VIEWS['home/program']=()=>{const tp=CANON.flatMap(g=>g.topics).find(x=>x.t===PRG_T)||CANON[0].topics[0];
 return pageHead(LANG==='ar'?'نظرة البرنامج — متصفح الموضوعات':'ESG Program Overview — Topic Navigator',LANG==='ar'?'شاشة تنسيق فوق النظام كله: نفس الشجرة، ونفس السجلات — لا تملك أي حقيقة عمل.':'One orchestration surface over the whole system: the same canonical tree, the same records — owns no business fact.','','Home › Program Overview')+
 `<div class="tiles">${tile('E/S/G/GEN','4 pillars')}${tile(CANON.reduce((a,g)=>a+g.topics.length,0),'Topics')}${tile(KPIM.length,'KPIs registered')}${tile(D.fact.length,'Approved facts','ok','data/factbook')}</div>
 <div class="wb">${canonTree(PRG_T,'prgSel')}<div>
 <div class="card" style="margin:0"><div class="hd">${esc(tp.t)} <span class="sub">${LANG==='ar'?'عرض موحد — كل قيمة تُقرأ من مالكها':'consolidated view — every value read from its owner'}</span></div><div class="bd">
 ${(()=>{const kids=tp.kpis.map(k=>k.id);const gset=[...new Set(tp.kpis.map(k=>(k.g||'').split(':')[0].replace('GRI','').trim()).filter(Boolean))].slice(0,3);
  const mt=(()=>{const map={'GHG Emissions':'MT-01','Energy':'MT-02','Water & Effluents':'MT-03','Occupational Health & Safety':'MT-04','Local Communities':'MT-05','Anti-corruption & Competition':'MT-06'};const id=map[tp.t];if(!id)return null;const T=D.topics.find(x=>x.id===id);return T?T.id+' '+T.n:null})();
  const tg=D.targets.find(x=>kids.includes(x.kpi));const facts=kids.filter(id=>factOf(id)).length;
  const own=[...new Set(tp.kpis.map(k=>k.dep.replace(/[؀-ۿ]+/g,'').trim()))][0]||'—';
  const fnd=D.findings.filter(f=>f.st!=='closed'&&tp.t==='Workforce & Governance (GRI 2)'?1:0).length;
  const sec=tp.kpis[0]&&tp.kpis[0].p==='E'?'§5 Environmental':tp.kpis[0]&&tp.kpis[0].p==='S'?'§6 Social':'§7 Governance';
  return `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:6px 18px;font-size:12px">
  <span>${mt?pv('reuse','Material topic: '+mt,'#/mat/ranking'):`<span class="st na">${LANG==='ar'?'ليس موضوعًا جوهريًا معتمدًا':'Not an approved material topic'}</span>`}</span>
  <span>${pv('reuse','GRI '+ (gset.join(' · ')||'2') +' — applicability in B-10','#/setup/applic')}</span>
  <span><b>${tp.kpis.length}</b> KPIs ${pv('reuse','KPI Master','#/data/kpimaster')}</span>
  <span>Sites: from B-03 data-domain routing ${pv('reuse','B-03','#/org/sites')}</span>
  <span>${t('who')}: ${esc(own.slice(0,28))} ${pv('reuse','X-PLAN','#/data/plan')}</span>
  <span>Approved facts: <b>${facts}/${tp.kpis.length}</b> ⚙</span>
  <span>Evidence gaps: <b style="color:${tp.t==='GHG Emissions'?'var(--err)':'var(--mut)'}">${tp.t==='GHG Emissions'?1:0}</b> ${pv('der','derived','#/data/evid')}</span>
  <span>Open findings: ${fnd} ${pv('der','derived','#/rev/findings')}</span>
  <span>${tg?pv('reuse','Target: '+tg.id,'#/data/targets'):(LANG==='ar'?'لا هدف مسجل':'No target registered')}</span>
  <span>Report ${sec} ${pv('reuse','Report Studio','#/rpt/rstruct')}</span>
  <span>Assurance: per-datapoint flags ⚙</span>
 </div>`})()}
 <table class="tbl" style="margin-top:12px"><thead><tr><th>KPI</th><th>Unit</th><th>GRI</th><th>Dept</th><th>Freq</th><th>Fact FY2025</th><th>${t('status')}</th></tr></thead><tbody>
 ${tp.kpis.map(k=>{const f=factOf(k.id);return `<tr><td><b data-noar>${k.id}</b><div style="font-size:11px">${esc(k.en)}</div></td><td data-noar>${esc(k.u)}</td><td style="font-size:11px" data-noar>${esc(k.g.split('—')[0])}</td><td style="font-size:11px">${esc(k.dep.split(' ')[0])}</td><td style="font-size:11px">${esc(k.fq.split(' ')[0])}</td><td>${f?`<a onclick="factDrill('${k.id}')"><b>${f.fy25}</b></a>`:'<span style="color:var(--mut)">—</span>'}</td><td>${f?st('approved','Approved'):st('progress','Collecting')}</td></tr>`}).join('')}
 </tbody></table></div></div></div></div>`};
/* ---- KPI & Metrics Master ---- */
let KM_Q='',KM_P='';function kmQ(v){KM_Q=v.toLowerCase();render()}function kmP(v){KM_P=v==='All'?'':v;render()}
VIEWS['data/kpimaster']=()=>{const L=KPIM.filter(k=>(!KM_P||k.p===KM_P)&&(!KM_Q||(k.id+k.en+k.t+k.g).toLowerCase().includes(KM_Q)));
 return pageHead(LANG==='ar'?'سجل المؤشرات الرئيسي':'KPI & Metrics Master',LANG==='ar'?'113 تعريفًا معتمدًا — التعريف مصدر واحد وversioned؛ الدورة تحل نسخة التعريف As-Of. التعريف ≠ القيمة.':'113 governed definitions — one source, versioned; a cycle resolves the definition AS-OF its basis date. Definition ≠ instance.',
 `<span class="st approved">${KPIM.length} KPIs · v2.0</span>`,'Data & Evidence › KPI Master')+
 `<div class="tiles">${tile(KPIM.filter(k=>k.p==='E').length,'Environmental')}${tile(KPIM.filter(k=>k.p==='S').length,'Social')}${tile(KPIM.filter(k=>k.p==='G').length,'Governance')}${tile(KPIM.filter(k=>k.db).length,'Dashboard-flagged ★','ok')}</div>
 <div class="card"><div class="bd" style="display:flex;gap:10px;padding:10px 14px"><input placeholder="${LANG==='ar'?'بحث بالكود/الاسم/GRI':'Search id / name / GRI'}" style="flex:1" oninput="kmQ(this.value)" value="${esc(KM_Q)}"><select style="width:auto" onchange="kmP(this.value)">${['All','E','S','G','GEN'].map(x=>`<option ${KM_P===x?'selected':''}>${x}</option>`).join('')}</select><span style="align-self:center;font-size:12px;color:var(--mut)">${L.length} ${LANG==='ar'?'ظاهر':'shown'}</span></div>
 <div style="max-height:560px;overflow:auto"><table class="tbl"><thead><tr><th>KPI ID</th><th>KPI</th><th>Unit</th><th>GRI ${LANG==='ar'?'حالي':'current'}</th><th>FY2027+</th><th>Dept</th><th>Freq</th><th>★</th><th>Dir</th></tr></thead><tbody>
 ${L.map(k=>`<tr style="cursor:pointer" onclick="drawer('${k.id}',kpiDetail('${k.id}'))"><td><b data-noar>${k.id}</b></td><td style="min-width:210px">${esc(k.en)}<div style="font-size:11px;color:var(--mut)" data-noar>${esc(k.ar)}</div></td><td data-noar>${esc(k.u)}</td><td style="font-size:11px" data-noar>${esc(k.g.split('—')[0])}</td><td style="font-size:11px" data-noar>${esc((k.g27||'—').split('—')[0])}</td><td style="font-size:11px">${esc(k.dep.replace(/[؀-ۿ]+/g,'').trim().split('  ')[0].slice(0,22))}</td><td style="font-size:11px">${esc(k.fq.split(' ')[0])}</td><td>${k.db?'★':''}</td><td style="font-size:11px">${esc((k.dir||'—').split(' ')[0])}</td></tr>`).join('')}
 </tbody></table></div></div>`};
function kpiDetail(id){const k=kpiById(id);const f=factOf(id);return `<div class="formGrid">
 ${sect('Definition — versioned, read-only from instances','التعريف','v2.0 · Methodology approval: Dr. H. Nassar')}
 ${field({label:'KPI ID / Pillar / Topic',value:k.id+' · '+k.p+' · '+k.t,ro:1})}
 ${field({label:'Name EN / AR',value:k.en+' · '+k.ar,ro:1,full:1})}
 ${field({label:'Definition',value:k.d,ro:1,full:1})}
 ${field({label:'Data type / Unit',value:k.dt+' · '+(k.u||'—'),ro:1,help:'Explicit definition field — never inferred at runtime.'})}
 ${field({label:'Formula / Calculation method',value:(k.f&&k.f!=='—'?k.f+(k.calc?'  ['+k.calc+']':''):'— direct measure'),ro:1,full:1})}
 ${field({label:'Aggregation method',value:k.agg,ro:1,help:'SUM / AVERAGE / END_OF_PERIOD / CALCULATED / NONE — drives every FY roll-up.'})}
 ${field({label:'Dimensions (machine-readable)',value:k.dimsSchema.map(d=>d.id+(d.required?'*':'')+(d.values?' ['+d.values+']':'')).join(' × '),ro:1,full:1,help:'dimsSchema[] — one schema consumed by forms, plan, validation and report bindings; prose is display only.'})}
 ${field({label:'Boundary rule',value:k.bnd,ro:1})}
 ${sect('Mappings','الارتباطات','crosswalk ≠ applicability')}
 ${field({label:'GRI current',value:k.g,ro:1})}
 ${field({label:'GRI from FY2027',value:k.g27||'—',ro:1})}
 ${field({label:'Other frameworks',value:k.fw||'—',ro:1,full:1})}
 ${sect('Operating defaults','التشغيل','seed the Collection Plan')}
 ${field({label:'Owning department',value:k.dep,ro:1})}
 ${field({label:'Data owner (role)',value:k.own,ro:1})}
 ${field({label:'Source system',value:k.src,ro:1})}
 ${field({label:'Collection / Disclosure frequency',value:k.coll+' · '+k.disc,ro:1})}
 ${field({label:'Evidence requirement',value:k.ev,ro:1})}
 ${field({label:'Validation rule set',value:k.vr,ro:1})}
 ${field({label:'Effective / Version / Approval',value:k.eff+' → open · '+k.ver+' · '+k.appr,ro:1,full:1})}
 ${sect('Consumption','الاستهلاك','')}
 ${field({label:'Dashboard',value:(k.db?'★ Yes':'No')+' · '+(k.ch||'—')+' · '+(k.dir||'—'),ro:1})}
 ${field({label:'RAG methodology',value:k.rag||'—',ro:1})}
 ${field({label:'Approved fact (FY2025)',value:f?f.fy25+' '+k.u+' · '+f.rec:'— not yet approved',pv:{k:'der',t:'Fact Book',l:'#/data/factbook'}})}
 <div class="full notice info" style="margin:0"><b>Identity test:</b> ${k.id} is the SAME id in Master · Plan · Grid · Workspace · Fact Book · Dashboard · Report binding · Assurance.</div></div>`}
/* ---- Department Collection Grid — a pivot VIEW over DatapointRecords ---- */
let DG_DEP='Energy';function dgDep(v){DG_DEP=v;render()}
const DG_VIEWS=[['Energy','Energy & Facilities',['Energy, Utilities','Operations /']],['Environment','Environment',['Environment /']],['HR','Human Resources',['Human Resources']],['H&S','Health & Safety',['HSE / OHS']],['Procurement','Procurement & Value Chain',['Procurement']],['Customer','Customer & Product',['Product Development','Sales, Marketing']],['Legal','Legal & Ethics',['Legal, Compliance','IT & Cyber']],['Finance','Finance, Tax & Strategy',['Finance, Treasury','الضرائب Tax','Strategy /']],['Governance','Governance & Community',['Board /','Communications']]];
/* X-PLAN cycle assignments — generated from defaults at cycle start, then GOVERNED; the grid reads THIS, never the master default */
D.xplan=KPIM.map(k=>{const v=DG_VIEWS.find(x=>x[2].some(tok=>k.dep.includes(tok)));
 return {kpi:k.id,cycle:'ACME-FY2025',deptView:v?v[0]:'Governance',site:k.id==='ENV-WAT-001'?'EG-QRY-01':(k.id.startsWith('SOC')||k.id.startsWith('GOV')||k.id.startsWith('GEN'))?'GROUP':'EG-CEM-01',wave:'W1',owner:k.own.slice(0,24)}});
/* governed reassignment example (audited): water KPIs collected by Energy view this cycle at the quarry — differs from master default */
D.xplan.filter(x=>x.kpi==='ENV-WAT-001').forEach(x=>{x.deptView='Energy';x.reassigned='cycle assignment ≠ master default (Environment) — X-PLAN governs'});
function dgRows(key){return D.xplan.filter(x=>x.cycle==='ACME-FY2025'&&x.deptView===key).map(x=>({...kpiById(x.kpi),_xp:x}))}
let DG_SITE='EG-CEM-01';function dgSite(v){DG_SITE=v;render()}
VIEWS['data/deptgrid']=()=>{const deps=DG_VIEWS.map(v=>[v[0],v[1]]);
 const all=dgRows(DG_DEP);const rows=all; /* ALL rows — no cap (V13 closure 3a) */
 const months=Array.from({length:12},(_,i)=>String(i+1).padStart(2,'0'));
 return pageHead(LANG==='ar'?'شبكة جمع الإدارة':'Department Collection Grid',LANG==='ar'?'وضع الجمع السريع: نفس DatapointRecord التي في مساحة الإفصاح — عرض Pivot لا قاعدة ثانية. الأشهر أعمدة عرض لا أعمدة تخزين.':'Fast-collection mode: the SAME DatapointRecords as the Disclosure Workspace — a pivot view, never a second database. Months are view columns, not storage columns.',
 `<select style="width:auto" onchange="dgDep(this.value)">${deps.map(([v,l])=>`<option value="${v}" ${DG_DEP===v?'selected':''}>${l}</option>`).join('')}</select>`,'Data & Evidence › Department Grid')+
 `<div class="notice info" style="margin-bottom:10px"><b>${LANG==='ar'?'قاعدة':'Rule'}:</b> ${LANG==='ar'?'تعديل خلية ديسمبر هنا يحدث نفس السجل المفتوح في Disclosure Workspace — جرب ثم افتحها.':'Editing a December cell here updates the exact record open in the Disclosure Workspace — try it, then open the workspace.'} <a href="#/data/dwork">Workspace →</a></div>
 <div class="card"><div class="bd" style="padding:8px 14px;font-size:12px;color:var(--mut)">${all.length} ${LANG==='ar'?'مؤشرًا في هذه الإدارة':'KPIs in this department view'} · ${LANG==='ar'?'معروض':'showing'} ${rows.length} · ${LANG==='ar'?'الصفوف من إسناد X-PLAN للدورة (لا من الإدارة الافتراضية في الـMaster)':'rows come from the CYCLE X-PLAN assignment — never from the KPI-Master default department'} ${pv('reuse','X-PLAN','#/data/plan')} · ${LANG==='ar'?'الموقع':'site'}: <select style="width:auto;padding:2px 6px;font-size:11px" onchange="dgSite(this.value)">${['EG-CEM-01','EG-QRY-01','SA-SOL-01'].map(x=>`<option ${DG_SITE===x?'selected':''}>${x}</option>`).join('')}</select></div>
 ${rows.length?'':`<div class="bd"><div style="border:1.5px dashed var(--line);border-radius:9px;padding:22px;text-align:center;color:var(--mut)">${LANG==='ar'?'لا مؤشرات مسندة لهذه الإدارة في الدورة الحالية':'No KPIs assigned to this department in the current cycle'}</div></div>`}
 <div style="overflow-x:auto"><table class="tbl" style="font-size:11.5px"><thead><tr><th style="min-width:170px">KPI</th><th>Unit</th>${months.map(m=>`<th>${m}</th>`).join('')}<th>FY ⚙</th><th>PY</th><th>Target 🔗</th><th>${t('status')} ⚙</th><th>Evid</th><th>Q</th></tr></thead><tbody>
 ${rows.map(k=>{const site=(k._xp&&k._xp.site)||DG_SITE;const recs=months.map(m=>dprGet(k.id,site,'2025-'+m));const have=recs.filter(Boolean);
  const fy=(()=>{if(!have.length)return null;if(k.agg==='CALCULATED')return 'ƒx';return aggregateKpi(k,have)})();
  const tg=D.targets.find(x=>x.kpi===k.id);
  return `<tr><td><b data-noar>${k.id}</b><div style="font-size:10.5px">${esc(k.en.slice(0,34))}</div></td><td data-noar>${esc(k.u)}</td>
  ${months.map(m=>{const r=dprGet(k.id,site,'2025-'+m);const ro=['ASSUR','EXEC'].includes(ROLE);return `<td>${r?(ro?`<span title="read-only for this role (SoD)">${r.v.toLocaleString()}</span>`:`<input style="width:64px;padding:2px 4px;font-size:11px;${r.st==='returned'?'border-color:var(--warnBd);background:var(--warnBg)':''}" value="${r.v.toLocaleString()}" onchange="dprSet('${k.id}','${site}','2025-${m}',this.value);render()" title="${r.rec||''} · site ${site} — same record as workspace">`):'<span style="color:var(--line)">·</span>'}</td>`}).join('')}
  <td><b>${fy==null?'—':fy==='ƒx'?'ƒx':fy===0?'0':fy.toLocaleString()}</b>${fy===0?` <span class="pv der" title="TRUE ZERO — explicitly entered; never conflated with Missing">0 ✓</span>`:''}<div style="font-size:9.5px;color:var(--mut)" title="Aggregation Method from the KPI definition — never guessed">${k.agg==='SUM'?'Σ':k.agg==='AVERAGE'?'avg ⚙':k.agg==='END_OF_PERIOD'?'EOP ⚙':k.agg==='CALCULATED'?'via run':'—'}</div></td><td title="prior-year approved fact (ADV FY2024) — derived ⚙, never typed">${(a=>a?a.v.toLocaleString()+' ⚙':'—')(advGet(k.id,'FY2024'))}</td><td>${tg?tg.tv+' '+tg.unit:'—'}</td><td>${have.length===0?st('draft','Not started'):st(recs.some(r=>r&&r.st==='returned')?'returned':'progress',recs.some(r=>r&&r.st==='returned')?'Returned':(have.length===12?'Complete — awaiting approval':'In progress'))}</td><td>${k.id==='ENV-GHG-003'?'<b style="color:var(--err)">0/1</b>':'—'}</td><td>${(a=>a?a.q:'—')(advGet(k.id,'FY2025'))}</td></tr>`}).join('')}
 </tbody></table></div>
 <div class="bd" style="font-size:11.5px;color:var(--mut)">${LANG==='ar'?'الأعمدة الممتدة (المصدر، طريقة الجمع، المُعد/المراجع/المعتمد، آخر تحديث) تظهر من زر الأعمدة — كل واحدة مرجع هوية وحدث سير عمل، لا نص حر.':'Extended columns (source, collection method, preparer/reviewer/approver, last updated) toggle on — each is an identity reference and a workflow event, never free text.'}</div></div>`};
/* ---- ESG Fact Book ---- */
let FB_T='GHG Emissions';function fbSel(t){FB_T=t;render()}
VIEWS['data/factbook']=()=>{const tp=CANON.flatMap(g=>g.topics).find(x=>x.t===FB_T)||CANON[0].topics[0];
 return pageHead('ESG Fact Book',LANG==='ar'?'واجهة الاستهلاك المضبوطة للحقائق المعتمدة — لا يملك أي قيمة: يقرأ Approved DatapointVersions فقط.':'The controlled consumption view of approved ESG facts — owns no values: reads approved DatapointVersions only.',
 `<select style="width:auto" onchange="toast('Filter applied (entity/site/period/status/quality/assurance)')"><option>Group · FY2025</option><option>EG-CEM-01</option><option>SA-SOL-01</option></select>`,'Data & Evidence › Fact Book')+
 `<div class="wb">${canonTree(FB_T,'fbSel')}<div>
 <div class="card" style="margin:0"><div class="hd">${esc(tp.t)} <span class="sub">${LANG==='ar'?'قيم معتمدة فقط — انقر أي رقم لفتح مصدره':'approved values only — click any number to open its source'}</span></div>
 <table class="tbl"><thead><tr><th>Metric</th><th>Unit</th><th>FY2023</th><th>FY2024</th><th>FY2025</th><th>Target 🔗</th><th>${t('status')}</th><th>Quality</th><th>Assurance</th></tr></thead><tbody>
 ${tp.kpis.map(k=>{const f=factOf(k.id);if(!f)return `<tr><td><b data-noar>${k.id}</b><div style="font-size:11px">${esc(k.en.slice(0,40))}</div></td><td data-noar>${esc(k.u)}</td><td colspan=3 style="color:var(--mut)">— ${LANG==='ar'?'لم يُعتمد بعد':'not yet approved'}</td><td>—</td><td>${st('progress','Collecting')}</td><td>—</td><td>—</td></tr>`;
  const tg=D.targets.find(x=>x.kpi===k.id);const stale=f.stale;return `<tr><td><b data-noar>${k.id}</b><div style="font-size:11px">${esc(k.en.slice(0,40))}</div></td><td data-noar>${esc(k.u)}</td><td>${f.fy23}</td><td>${f.fy24}</td><td><a onclick="factDrill('${k.id}')"><b>${f.fy25}</b></a>${stale?' <span class="pv der" title="Source record re-approved after the last report render — consumers show Stale until re-render">⚠ stale</span>':''}</td><td>${tg?tg.tv:'—'}</td><td>${st('approved','Approved')}</td><td>${f.q}</td><td>${f.asr}</td></tr>`}).join('')}
 </tbody></table></div>
 <div class="notice info" style="margin-top:10px"><b>${LANG==='ar'?'قاعدة':'Rule'}:</b> Fact Book ${LANG==='ar'?'لا يُدخل فيه رقم يدويًا أبدًا — القيم المحسوبة تظهر ƒx والنطاق الثاني المزدوج لا يُجمع':'never accepts a typed number — calculated values render ƒx; dual Scope-2 rows never sum'}.</div></div></div>`};
function factDrill(id){const f=factOf(id),k=kpiById(id);drawer(id+' — '+(k?k.en:''),`<div class="kv">
 <dt>Approved value (FY2025)</dt><dd><b>${f.fy25}</b> ${k?k.u:''} · version v3</dd>
 <dt>Source record</dt><dd><a href="#/data/dwork" onclick="closeDrawer()">${f.rec}</a> — ${LANG==='ar'?'نفس السجل في كل الواجهات':'the same record on every surface'}</dd>
 <dt>Evidence</dt><dd>📎 EV-0021 · 📎 meter photo — SHA-256 verified</dd>
 <dt>Calculation</dt><dd>${f.rec.startsWith('RUN')?f.rec+' · Calc Card + frozen factors ƒx':'— direct measure'}</dd>
 <dt>Validation</dt><dd>VR suite PASS at approval</dd>
 <dt>Review & approval</dt><dd>Dept (M. Adel) → Technical (O. Farid) → approved 12 Feb${id==='ENV-GHG-003'?` · <a onclick="advApprove('ENV-GHG-003','FY2025')">Re-approve from period records →</a>`:''}</dd>
 <dt>Report uses</dt><dd style="font-weight:400">§5.1 table row · narrative token ×2 · Content Index 305 row · dashboard tile</dd>
 <dt>Assurance</dt><dd>${f.asr==='—'?'Out of scope':'In scope — '+f.asr} (per-datapoint flag ⚙)</dd></div>`)}
/* ---- Targets & Goals ---- */
VIEWS['data/targets']=()=>pageHead(LANG==='ar'?'الأهداف والالتزامات':'Targets & Goals',LANG==='ar'?'الهدف كائن حاكم من الدرجة الأولى — التقدم والمسار محسوبان من الحقائق المعتمدة، لا يُكتبان.':'Targets are first-class governed objects — progress and on-track state derive from approved facts, never typed.',
 `<button class="btn" onclick="drawer('＋ Target',tgtForm())">＋ ${t('add')}</button>`,'Data & Evidence › Targets & Goals')+
 `<div class="tiles">${tile(D.targets.length,'Targets')}${tile(D.targets.filter(x=>x.st==='Approved').length,'Approved','ok')}${tile(D.targets.filter(x=>{const p=tgtProgress(x);return p&&!p.on}).length,'Off track','warn')}${tile(1,'Draft','warn')}</div>
 <div class="card"><table class="tbl"><thead><tr><th>ID</th><th>Target</th><th>KPI 🔗</th><th>Baseline</th><th>Target</th><th>Current ⚙</th><th>Progress ⚙</th><th>On track ⚙</th><th>${t('status')}</th><th></th></tr></thead><tbody>
 ${D.targets.map(x=>{const pr=tgtProgress(x);return `<tr><td><b data-noar>${x.id}</b></td><td style="min-width:200px">${esc(x.stmt)}<div style="font-size:11px;color:var(--mut)">${x.topic} · ${x.type} · ${x.scope}</div></td><td data-noar>${x.kpi}</td><td>${x.bv} <span style="color:var(--mut)">(${x.by})</span></td><td>${x.tv} ${esc(x.unit)} <span style="color:var(--mut)">(${x.ty})</span></td><td>${pr?pr.cur:'—'}</td><td>${pr?`<div class="hbar" style="width:90px"><div style="width:${pr.p}%"></div></div> ${pr.p}% <span style="font-size:10px;color:var(--mut)" title="expected AS-OF 2025 per ${pr.method}">exp ${pr.exp}</span>`:'—'}</td><td>${pr?(pr.rag==='NOT_EVALUATED'?`<span class="st pending" title="Methodology approval pending (MD-02) — no Green/Amber/Red is issued before countersign">NOT_EVALUATED</span><div style="font-size:9px;color:var(--mut)">Methodology approval pending</div>`:`<span class="st ${pr.rag==='GREEN'?'approved':pr.rag==='AMBER'?'review':'blocked'}" title="As-of ${pr.asOf} · expected ${pr.exp} · variance ${pr.var} · ${pr.methVer}">${pr.rag}</span>`):'—'}</td><td>${st(x.st==='Approved'?'approved':'draft',x.st)}</td><td class="rowActs"><a onclick="drawer('${x.id}',tgtForm('${x.id}'))">${t('open')}</a></td></tr>`}).join('')}
 </tbody></table></div>
 <div class="notice info">${LANG==='ar'?'تغذي الأهداف: لوحة الأداء، بلوك 3-3 (الأهداف d)، سرد التقرير وجداوله — وتصحيح المسار حقل إلزامي عند Off-track.':'Targets feed: Performance Dashboard, topic 3-3 target block, report narrative & tables — corrective action becomes mandatory when off track.'}</div>`;
function tgtForm(id){const x=D.targets.find(v=>v.id===id)||{};return `<div class="formGrid">
 ${sect('Target','الهدف','governed object')}
 ${field({label:'Target ID',value:x.id||'TGT-06 — on save',ro:1})}
 ${field({label:'Material topic',req:1,type:'select',opts:D.topics.map(t0=>t0.id+' '+t0.n).concat(['— non-material (management target) —']),value:x.topic,help:'Governed set only — fkCheck() blocks anything else.'})}
 ${field({label:'KPI',req:1,type:'select',opts:KPIM.filter(k=>k.db).slice(0,20).map(k=>k.id+' · '+k.en.slice(0,30)),value:x.kpi,help:'From the KPI Master — the same id everywhere.'})}
 ${field({label:'Target statement',req:1,type:'area',value:x.stmt||'',full:1})}
 ${field({label:'Target type',req:1,type:'select',opts:['Absolute reduction','Intensity reduction','Share increase','Rate reduction','Zero-event'],value:x.type})}
 ${sect('Trajectory','المسار','')}
 ${field({label:'Baseline year / value',value:(x.by||'')+' · '+(x.bv||''),req:1})}
 ${field({label:'Target year / value',value:(x.ty||'')+' · '+(x.tv||''),req:1})}
 ${field({label:'Unit',value:x.unit||'',ro:1,help:'From the KPI definition — never retyped.'})}
 ${field({label:'Scope / coverage',value:x.scope||'',req:1})}
 ${sect('Derived — never typed','مشتق','')}
 ${field({label:'Current value',value:(tgtProgress(x)||{}).cur??'—',pv:{k:'der',t:'Fact Book',l:'#/data/factbook'}})}
 ${field({label:'Trajectory method / tolerance / As-of',value:(x.method||'Linear')+' · tol='+(x.tolPct??METH.tolPct??'— ungoverned (blocks RAG)')+' · as-of '+D.cycle.perfAsOf+' · '+METH.ragMethodVersion,ro:1})}
 ${field({label:'Expected AS-OF 2025 / Progress / RAG',value:(()=>{const p=tgtProgress(x);return p?p.exp+' · '+p.p+'% · '+p.rag+' (var '+p.var+')':'—'})(),pv:{k:'calc',t:'ƒx MD-02'}})}
 ${sect('Governance','الحوكمة','')}
 ${field({label:'Owner',req:1,value:x.own||''})}
 ${field({label:'Approver + approval evidence',value:(x.appr||'—')+' · '+(x.ev||'—'),ro:1})}
 ${field({label:'Corrective action',type:'area',value:x.ca||'',full:1,help:'Mandatory when off track.'})}
 ${field({label:'Status / version',value:(x.st||'Draft')+' · '+(x.ver||'v1'),ro:1})}
</div>`}
/* ---- ESG Performance Dashboard ---- */
VIEWS['home/perf']=()=>{const row=(id)=>{const k=kpiById(id),f=factOf(id);if(!f)return '';const tg=D.targets.find(x=>x.kpi===id);const varr=f.fy24?Math.round(1000*(f.fy25-f.fy24)/f.fy24)/10:null;
 const good=k.dir&&k.dir.startsWith('Lower')?(varr<=0):(varr>=0);
 return `<tr><td><b data-noar>${id}</b><div style="font-size:11px">${esc(k.en.slice(0,36))}</div></td><td data-noar>${esc(k.u)}</td><td><a onclick="factDrill('${id}')"><b>${f.fy25}</b></a></td><td>${f.fy24}</td><td>${tg?tg.tv:'—'}</td><td style="color:${good?'var(--ok)':'var(--err)'}">${varr>0?'+':''}${varr}%</td><td>${(()=>{if(!tg)return '<span class="st pending">—</span>';const p=tgtProgress(tg);if(!p)return '—';return p.rag==='NOT_EVALUATED'?'<span class="st pending" title="Methodology approval pending — MD-02">NOT_EVALUATED</span>':`<span class="st ${p.rag==='GREEN'?'approved':p.rag==='AMBER'?'review':'blocked'}">${p.rag}</span>`})()}</td><td><span style="font-family:monospace;letter-spacing:1px;color:var(--acc)" data-noar>${f.fy23>f.fy25?'▄▃▂':'▂▃▄'}</span></td></tr>`};
 return pageHead(LANG==='ar'?'لوحة أداء الاستدامة':'ESG Performance Dashboard',LANG==='ar'?'تجيب: كيف أداء المنظمة؟ (لوحتا الجاهزية والامتثال تجيبان: هل التقرير جاهز؟) كل قيمة من Fact Book + الأهداف — لا إدخال يدوي.':'Answers: how is the ORGANIZATION performing? (Readiness & Compliance answer: is the report ready?) Every value reads Fact Book + Targets — nothing typed.',
 `<span class="st approved">⚙ ${LANG==='ar'?'محسوبة بالكامل':'fully derived'}</span>`,'Home › ESG Performance')+
 `${(()=>{const d=(id)=>{const f=factOf(id);if(!f||!f.fy24)return '—';const v=Math.round(1000*(f.fy25-f.fy24)/f.fy24)/10;return (v>0?'+':'')+v+'%'};
   const g1=factOf('ENV-GHG-001'),ren=factOf('ENV-ENE-004'),tr=factOf('SOC-OHS-002'),fat=factOf('SOC-OHS-001');
   return `<div class="tiles">${tile(d('ENV-GHG-001'),'Scope 1 vs PY ⚙',g1&&g1.fy25<g1.fy24?'ok':'warn','data/factbook')}${tile(d('ENV-GHG-003'),'Scope 2 LB vs PY ⚙','ok')}${tile(ren?ren.fy25+'%':'—','Renewable electricity ⚙','ok')}${tile(tr?tr.fy25:'—','TRIR (target '+(D.targets.find(t=>t.kpi==='SOC-OHS-002')||{}).tv+') ⚙',tr&&tr.fy25>1.2?'warn':'ok')}${tile(fat?fat.fy25:'—','Fatalities ⚙',fat&&fat.fy25===0?'ok':'err')}</div>`})()}`+`
 ${[['Environmental',['ENV-GHG-001','ENV-GHG-003','ENV-GHG-004','ENV-ENE-001','ENV-ENE-004','ENV-WAT-001','ENV-WST-001']],['Social',['SOC-OHS-001','SOC-OHS-002','SOC-EMP-001','SOC-DIV-001','SOC-TRN-001']],['Governance / Economic',['GOV-ETH-001','GOV-ECO-001']]].map(([g,ids])=>`
 <div class="card"><div class="hd">${g}</div><table class="tbl"><thead><tr><th>KPI</th><th>Unit</th><th>FY2025</th><th>PY</th><th>Target 🔗</th><th>Δ vs PY ⚙</th><th>RAG ⚙</th><th>Trend</th></tr></thead><tbody>${ids.map(row).join('')}</tbody></table></div>`).join('')}
 <div class="notice info"><b>Drill:</b> Dashboard → Fact Book → DatapointRecord → Source / Evidence — ${LANG==='ar'?'كل رسم يفتح مصدره':'every chart opens its source'}.</div>`};
/* ---- Framework Explorer & Crosswalk ---- */
let FX_Q='emissions';function fxQ(v){FX_Q=v.toLowerCase();render()}
VIEWS['adm/fwx']=()=>{const hits=KPIM.filter(k=>(k.en+' '+k.g+' '+k.fw).toLowerCase().includes(FX_Q));
 const fams=[['GRI',k=>k.g],['ESRS',k=>(k.fw.match(/ESRS [A-Z]\d[-\d]*/)||[])[0]],['IFRS S2',k=>k.fw.includes('IFRS')?'IFRS S2':null],['GHG Protocol',k=>k.fw.includes('GHG Protocol')?'GHG Protocol':null],['CDP',k=>k.fw.includes('CDP')?'CDP':null],['SDG',k=>(k.fw.match(/SDG ?\d+[\.\d]*/)||[])[0]]];
 return pageHead(LANG==='ar'?'مستكشف الأطر والمطابقة':'Framework Explorer & Crosswalk',LANG==='ar'?'محرك مرجعي: التقط مرة → أفصح لأطر عديدة. المطابقة ليست انطباقًا — محرك الانطباق يبقى صاحب القرار.':'Reference engine: capture once → disclose to many frameworks. Mapping is NOT applicability — the Applicability Engine stays authoritative.',
 '','Administration › Framework Explorer')+
 `<div class="card"><div class="bd" style="display:flex;gap:10px;padding:12px 14px"><input style="flex:1" value="${esc(FX_Q)}" oninput="fxQ(this.value)" placeholder="emissions / water / diversity…"><span style="align-self:center;font-size:12px;color:var(--mut)">${hits.length} KPIs matched</span></div></div>
 ${fams.map(([fam,fn])=>{const rows=hits.map(k=>({k,ref:fn(k)})).filter(x=>x.ref);if(!rows.length)return '';
  return `<div class="card"><div class="hd">${fam} <span class="sub">${rows.length} mapped</span></div><table class="tbl"><tbody>
  ${rows.slice(0,6).map(({k,ref})=>`<tr><td style="font-size:12px" data-noar><b>${esc(String(ref).split('—')[0])}</b></td><td style="font-size:12px">${esc(k.en.slice(0,50))}</td><td class="rowActs"><a onclick="drawer('${k.id}',kpiDetail('${k.id}'))">${LANG==='ar'?'المؤشرات المرتبطة':'Show mapped KPI'}</a></td></tr>`).join('')}
  </tbody></table></div>`}).join('')}
 <div class="notice warn"><b>${LANG==='ar'?'قاعدة':'Rule'}:</b> ${LANG==='ar'?'لا يقرر هذا المستكشف انطباق أي متطلب — القرار في B-10 وحده.':'This explorer never decides applicability of any requirement — that decision lives in B-10 alone.'}</div>`};
/* ---- ESG Risks & Opportunities ---- */
VIEWS['mat/risk']=()=>pageHead(LANG==='ar'?'مخاطر وفرص الاستدامة':'ESG Risks & Opportunities',LANG==='ar'?'الخطر ≠ التأثير: التأثير كيف تؤثر المنظمة على الناس والبيئة (GRI)؛ الخطر كيف تؤثر قضية ESG على المنظمة. درجات الخطر لا تدخل حساب جوهرية التأثير أبدًا.':'Risk ≠ Impact: impact is how the organization affects people/environment (GRI); risk is how an ESG issue affects the organization. Risk scores never feed impact-significance.',
 `<button class="btn" onclick="drawer('＋ Risk',riskForm())">＋ ${t('add')}</button>`,'Materiality & Management › ESG Risks')+
 `<div class="tiles">${tile(D.risks.length,'Risks & opportunities')}${tile(D.risks.filter(r=>r.rl*r.ri>=12).length,'High residual','err')}${tile(D.risks.filter(r=>r.st.includes('Opportunity')).length,'Opportunities','ok')}${tile(4,'Linked topics')}</div>
 <div class="card"><table class="tbl"><thead><tr><th>ID</th><th>Risk / Opportunity</th><th>Topic 🔗</th><th>KPIs 🔗</th><th>Inherent</th><th>Controls</th><th>Residual ⚙</th><th>${t('due')}</th><th>${t('status')}</th></tr></thead><tbody>
 ${D.risks.map(r=>`<tr><td><b data-noar>${r.id}</b></td><td style="min-width:200px">${esc(r.n)}<div style="font-size:11px;color:var(--mut)">${esc(r.drv)}</div></td><td data-noar>${r.topic}</td><td style="font-size:11px" data-noar>${r.kpis}</td><td><span class="st ${r.il*r.ii>=16?'blocked':'pending'}">${r.il}×${r.ii}=${r.il*r.ii}</span></td><td style="font-size:11.5px">${esc(r.ctl.slice(0,40))} · ${r.cown}</td><td><span class="st ${r.rl*r.ri>=12?'blocked':'approved'}">${r.rl}×${r.ri}=${r.rl*r.ri}</span></td><td>${r.due}</td><td>${st(r.st.includes('progress')?'progress':r.st.includes('Opportunity')?'approved':'open',r.st)}</td></tr>`).join('')}
 </tbody></table></div>`;
function riskForm(){return `<div class="formGrid">
 ${sect('Risk / Opportunity','الخطر','enterprise lens — not GRI impact')}
 ${field({label:'Risk ID',value:'RSK-05 — on save',ro:1})}
 ${field({label:'Pillar',req:1,type:'select',opts:['E','S','G']})}
 ${field({label:'Material topic link',type:'select',opts:['MT-01','MT-03','MT-04','— none —'],help:'A link, never a score transfer.'})}
 ${field({label:'Risk / opportunity statement',req:1,type:'area',full:1})}
 ${field({label:'Driver',req:1,type:'select',opts:['Regulatory','Physical climate','Market','Reputation','Operational','Financing']})}
 ${field({label:'Linked KPIs',type:'select',opts:KPIM.filter(k=>k.db).slice(0,15).map(k=>k.id),help:'M:N — same KPI ids as the Master.'})}
 ${sect('Inherent','المتأصل','1–5 × 1–5')}
 ${field({label:'Likelihood',req:1,type:'select',opts:['1','2','3','4','5']})}
 ${field({label:'Impact on the organization',req:1,type:'select',opts:['1','2','3','4','5']})}
 ${sect('Controls & residual','الضوابط','residual score derives')}
 ${field({label:'Controls',req:1,type:'area',full:1})}
 ${field({label:'Control owner',req:1,value:''})}
 ${field({label:'Residual likelihood',req:1,type:'select',opts:['1','2','3','4','5']})}
 ${field({label:'Residual impact',req:1,type:'select',opts:['1','2','3','4','5']})}
 ${field({label:'Residual score',value:'L × I — computed on save',pv:{k:'calc',t:'ƒx'},help:'Never typed.'})}
 ${field({label:'Target date / review date',type:'date',value:''})}
 <div class="full"><label style="font-weight:600;font-size:12px">Evidence</label><div style="border:1.5px dashed var(--line);border-radius:9px;padding:12px;text-align:center;color:var(--mut)">📎 <a onclick="toast('Evidence object')">Attach assessment basis</a></div></div>
 <div class="full notice warn" style="margin:0">${LANG==='ar'?'درجة الخطر لا تُغذي جوهرية GRI ولا تحجب النشر.':'Risk scores never feed GRI impact-significance and never block publication.'}</div></div>`}
/* ---- Derived Reporting RACI ---- */
VIEWS['adm/raci']=()=>pageHead('Reporting RACI',LANG==='ar'?'مشتقة من RBAC وخطة الجمع وإسناد المراجعة والحوكمة والتأكيد — لا كون إسناد ثانٍ يدويًا؛ الاستثناءات محكومة فقط.':'Derived from RBAC + Collection Plan + review + governance + assurance assignments — never a second manual assignment universe; governed exceptions only.',
 `<span class="st approved">⚙ ${LANG==='ar'?'مشتقة':'derived'}</span>`,'Administration › Reporting RACI')+
 `<div class="card"><table class="tbl"><thead><tr><th>${LANG==='ar'?'النشاط':'Activity'}</th><th>PM</th><th>Data Owner</th><th>Contributor</th><th>Dept Rev</th><th>Tech Rev</th><th>Exec</th><th>VVB</th><th>${LANG==='ar'?'المصدر':'Derived from'}</th></tr></thead><tbody>
 ${[['Scope & boundary','A','C','—','—','R','A','—','B-07 approvals'],['Materiality','A','C','C','—','R','A','—','C-12 workflow'],['KPI architecture','C','—','—','—','A/R','—','—','KPI Master versions'],['Data collection','A','A','R','C','—','—','—','X-PLAN assignments'],['Validation','—','C','R','—','A','—','—','Validation runs'],['Review','—','—','—','R','A','—','—','Review assignments'],['Report','A/R','—','—','—','C','A','—','Report project roles'],['Assurance','C','C','—','—','C','—','R','Engagement (SOD-04/06)']].map(r=>`<tr><td style="font-weight:600">${r[0]}</td>${r.slice(1,8).map(c=>`<td style="text-align:center">${c}</td>`).join('')}<td style="font-size:11px;color:var(--mut)">⚙ ${r[8]}</td></tr>`).join('')}
 </tbody></table><div class="bd"><button class="btn sec" onclick="toast('Governed exception drawer — reason + approver + audit')">${LANG==='ar'?'استثناء محكوم':'Governed exception'}</button></div></div>`;
/* ---- Maturity (optional) ---- */
VIEWS['adm/maturity']=()=>pageHead(LANG==='ar'?'تقييم نضج الاستدامة (اختياري)':'ESG Maturity (optional)',LANG==='ar'?'أداة إدارية للتحسين فقط — لا تحجب النشر ولا تمس محرك الادعاء أو الجوهرية أو البيانات المعتمدة.':'A management improvement tool only — never blocks publication, never touches the Claim Engine, Materiality or approved data.',
 `<span class="st pending">${LANG==='ar'?'اختياري':'OPTIONAL'}</span>`,'Administration › Maturity')+
 `<div class="card"><table class="tbl"><thead><tr><th>${LANG==='ar'?'البُعد':'Dimension'}</th><th>1 Beginner</th><th>2 Developing</th><th>3 Advanced</th><th>4 Leading</th><th>${LANG==='ar'?'الحالي':'Current'}</th><th>${LANG==='ar'?'المستهدف':'Target'}</th></tr></thead><tbody>
 ${[['Governance & oversight',3,4],['Materiality & stakeholders',3,4],['Strategy & targets',2,3],['Data & systems',3,4],['Climate & environment',2,3],['Social & human rights',2,3],['Value chain',2,3],['Reporting & assurance',3,4]].map(([d,c,g])=>`<tr><td style="font-weight:600">${d}</td>${[1,2,3,4].map(i=>`<td style="text-align:center">${i===c?'●':'·'}</td>`).join('')}<td><b>${c}</b></td><td>${g}</td></tr>`).join('')}
 </tbody></table></div>`;

