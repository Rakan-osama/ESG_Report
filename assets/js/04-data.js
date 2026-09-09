/* ═══════════════════════════════════════════════════════════════════════════
   ESG OS v14 — 4 · DATA — single demo state (Acme FY2025)
   Extracted verbatim from the single-file build. Classic script: LOAD ORDER
   IS SIGNIFICANT — see the <script> tags in the entry HTML.
   ═══════════════════════════════════════════════════════════════════════════ */
/* ════════════ 4 · DATA — single demo state (Acme FY2025) ════════════ */
const D={
 org:{name:'Acme Sustainable Industries Holding',form:'Joint stock company',hq:'Riyadh, Saudi Arabia',countries:['SA','EG','AE'],contact:'sustainability@acme.example.com',owner:'Layla Al-Harbi',version:3,approved:true},
 cycle:{code:'ACME-FY2025',name:'Sustainability Report FY2025',period:'01 Jan – 31 Dec 2025',pub:'30 Apr 2026',intent:'In accordance with the GRI Standards',assured:true,phase:'Data collection',phaseNo:4,phases:['Setup','Boundary & standards','Materiality','Data collection','Review','Assurance','Publication','Locked']},
 entities:[
  {id:'LE-01',name:'Acme Sustainable Industries Holding',ctry:'SA',own:100,rel:'Ultimate parent',cons:'Full',sus:true,fin:true,st:'approved'},
  {id:'LE-02',name:'Acme Energy KSA Ltd',ctry:'SA',own:100,rel:'Subsidiary',cons:'Full',sus:true,fin:true,st:'approved'},
  {id:'LE-03',name:'Acme Materials Egypt SAE',ctry:'EG',own:75,rel:'Subsidiary',cons:'Full',sus:true,fin:true,st:'approved'},
  {id:'LE-04',name:'Acme Logistics UAE FZE',ctry:'AE',own:100,rel:'Subsidiary',cons:'Full',sus:false,fin:true,st:'approved',diff:'Leased logistics hub under equity-share treatment — excluded from operational-control sustainability boundary (2-2-b note recorded)'}
 ],
 sites:[
  {code:'SA-SOL-01',name:'Sudair Solar Plant',ctry:'SA',entity:'LE-02',type:'Generation',ctl:'Operated',status:'Operating',head:86,inB:true,dom:['Energy','Emissions','H&S'],st:'approved'},
  {code:'SA-WND-01',name:'Dumat Al Jandal Wind Farm',ctry:'SA',entity:'LE-02',type:'Generation',ctl:'Operated',status:'Operating',head:54,inB:true,dom:['Energy','Emissions','H&S'],st:'approved'},
  {code:'EG-CEM-01',name:'10th of Ramadan Cement Works',ctry:'EG',entity:'LE-03',type:'Manufacturing',ctl:'Operated',status:'Operating',head:412,inB:true,dom:['Energy','Emissions','Water','Waste','H&S','Workforce'],st:'approved',cert:['ISO 14001:2015','ISO 45001:2018']},
  {code:'EG-QRY-01',name:'Suez Aggregates Quarry',ctry:'EG',entity:'LE-03',type:'Quarry',ctl:'Operated',status:'Operating',head:97,inB:true,dom:['Emissions','Waste','H&S'],st:'approved'},
  {code:'AE-LOG-01',name:'Jebel Ali Logistics Hub',ctry:'AE',entity:'LE-04',type:'Warehouse',ctl:'Equity share',status:'Operating',head:23,inB:false,excl:'Equity-share site outside operational-control boundary — rationale recorded',dom:[],st:'approved'},
  {code:'SA-DEP-01',name:'Dammam Fuel Depot',ctry:'SA',entity:'LE-02',type:'Storage',ctl:'Operated',status:'Closed 30 Sep 2025',head:0,inB:true,part:'In scope 9 months — part-period aggregation pro-rata (GRI 2-4 note)',dom:['Energy','Emissions'],st:'approved'}
 ],
 topics:[
  {id:'MT-01',n:'Climate change & GHG emissions',p:'E',gri:'GRI 305 / 302',imp:4,sig:'High',st:'approved'},
  {id:'MT-02',n:'Energy management & renewables',p:'E',gri:'GRI 302',imp:3,sig:'High',st:'approved'},
  {id:'MT-03',n:'Water stewardship',p:'E',gri:'GRI 303',imp:2,sig:'Medium',st:'approved'},
  {id:'MT-04',n:'Occupational health & safety',p:'S',gri:'GRI 403',imp:3,sig:'High',st:'approved'},
  {id:'MT-05',n:'Local communities & land use',p:'S',gri:'GRI 413',imp:2,sig:'Medium',st:'approved',hr:true},
  {id:'MT-06',n:'Business integrity & anti-corruption',p:'G',gri:'GRI 205',imp:2,sig:'Medium',st:'approved'}
 ],
 excluded:[{n:'Biodiversity',reason:'Assessed below threshold at all operated sites; quarry rehabilitation covered under MT-05. Sector candidate explained not-material (C-10).'},{n:'Marketing & labeling',reason:'B2B model; no consumer-facing products.'}],
 impacts:[
  {id:'IM-01',n:'GHG emissions from cement production',p:'E',dir:'Negative · Actual',inv:'Caused',vc:'Own operations',site:'EG-CEM-01',src:'Context CTX-03 · sector standard',sev:5,lik:5,sig:'High',topic:'MT-01',st:'assessed'},
  {id:'IM-02',n:'Grid decarbonization contribution (solar/wind)',p:'E',dir:'Positive · Actual',vc:'Downstream',site:'SA-SOL-01',src:'Strategy plan 2025',sev:4,lik:5,sig:'High',topic:'MT-02',st:'assessed'},
  {id:'IM-03',n:'Quarry dust affecting nearby community',p:'S',dir:'Negative · Actual',inv:'Caused',vc:'Own operations',site:'EG-QRY-01',src:'Complaint log · engagement ENG-02',sev:3,lik:4,sig:'Medium',topic:'MT-05',st:'assessed'},
  {id:'IM-04',n:'Water abstraction in stressed basin',p:'E',dir:'Negative · Potential',inv:'Contributed to',vc:'Own operations',site:'EG-CEM-01',src:'Context CTX-07 (basin study)',sev:4,lik:3,sig:'Medium',topic:'MT-03',st:'assessed'},
  {id:'IM-05',n:'Contractor safety at height (wind O&M)',p:'S',dir:'Negative · Potential',vc:'Own operations',site:'SA-WND-01',src:'Incident register 2024-11',sev:4,lik:2,sig:'High',topic:'MT-04',st:'assessed',hr:'HR severity floor applied — severity ≥4 material regardless of likelihood'},
  {id:'IM-06',n:'Land livelihood displacement near quarry expansion',p:'S',dir:'Negative · Potential',vc:'Own operations',site:'EG-QRY-01',src:'Engagement ENG-03 · community consultation',sev:4,lik:2,sig:'High',topic:'MT-05',hr:'Human-rights override — non-compensatory',st:'assessed'},
  {id:'IM-07',n:'Facilitation-payment exposure in customs clearance',p:'G',dir:'Negative · Potential',vc:'Upstream',site:'—',src:'Audit finding AF-12',sev:3,lik:2,sig:'Medium',topic:'MT-06',st:'assessed'},
  {id:'IM-08',n:'Rooftop-solar jobs in host communities',p:'S',dir:'Positive · Potential',vc:'Downstream',site:'—',src:'Engagement ENG-01',sev:2,lik:3,sig:'Watchlist',topic:'—',st:'review'}
 ],
 plan:[
  {id:'PL-001',topic:'MT-01',dis:'305-1',dp:'Scope 1 emissions — diesel combustion',ent:'LE-02',site:'SA-DEP-01',dept:'Operations',own:'K. Mansour',con:'F. Said',revw:'M. Adel',freq:'Monthly',unit:'litre → tCO2e',due:'2026-02-15',st:'COMPLETE',cov:100},
  {id:'PL-002',topic:'MT-01',dis:'305-2',dp:'Scope 2 — purchased electricity',ent:'LE-03',site:'EG-CEM-01',dept:'Utilities',own:'S. Tawfik',con:'F. Said',revw:'M. Adel',freq:'Monthly',unit:'kWh → tCO2e',due:'2026-02-15',st:'UNDER_REVIEW',cov:92},
  {id:'PL-003',topic:'MT-02',dis:'302-1',dp:'Energy consumption within org',ent:'ALL',site:'ALL',dept:'Utilities',own:'S. Tawfik',con:'F. Said',revw:'M. Adel',freq:'Monthly',unit:'kWh/GJ',due:'2026-02-20',st:'IN_COLLECTION',cov:74},
  {id:'PL-004',topic:'MT-03',dis:'303-3',dp:'Water withdrawal by source',ent:'LE-03',site:'EG-CEM-01',dept:'Environment',own:'R. Barakat',con:'H. Aly',revw:'M. Adel',freq:'Quarterly',unit:'m³',due:'2026-02-20',st:'IN_COLLECTION',cov:75},
  {id:'PL-005',topic:'MT-04',dis:'403-9',dp:'Work-related injuries & LTIFR',ent:'ALL',site:'ALL',dept:'HSE',own:'A. Qassem',con:'A. Qassem',revw:'—',freq:'Monthly',unit:'count / hours',due:'2026-02-10',st:'BLOCKED',cov:60,sod:'Reviewer not assigned — contributor = owner refused (SoD)'},
  {id:'PL-006',topic:'MT-05',dis:'413-1',dp:'Community engagement programmes coverage',ent:'LE-03',site:'EG-QRY-01',dept:'CSR',own:'N. Fouad',con:'N. Fouad',revw:'O. Farid',freq:'Annual',unit:'% sites',due:'2026-03-01',st:'REQUESTED',cov:0},
  {id:'PL-007',topic:'MT-06',dis:'205-3',dp:'Confirmed corruption incidents',ent:'ALL',site:'—',dept:'Compliance',own:'Y. Gaber',con:'Y. Gaber',revw:'O. Farid',freq:'Annual',unit:'count',due:'2026-03-01',st:'PLANNED',cov:0},
  {id:'PL-008',topic:'MT-02',dis:'302-3',dp:'Energy intensity',ent:'ALL',site:'—',dept:'Utilities',own:'S. Tawfik',con:'ƒx',revw:'O. Farid',freq:'Annual',unit:'MWh/t',due:'2026-03-10',st:'PLANNED',cov:0,calc:true}
 ],
 records:[
  {id:'REC-1024',dp:'305-2 · Purchased electricity',site:'EG-CEM-01',period:'2025-10',val:'120,000',unit:'kWh',src:'Utility invoice',est:false,st:'approved',ev:['EV-0019'],calc:'54.96 tCO2e (grid 0.458)',by:'F. Said',rev:'M. Adel'},
  {id:'REC-1025',dp:'305-2 · Purchased electricity',site:'EG-CEM-01',period:'2025-11',val:'131,400',unit:'kWh',src:'Utility invoice',est:false,st:'review',ev:['EV-0021'],by:'F. Said'},
  {id:'REC-1026',dp:'305-2 · Purchased electricity',site:'EG-CEM-01',period:'2025-12',val:'128,750',unit:'kWh',src:'Utility invoice',est:false,st:'returned',ret:'Meter photo missing for December — invoice alone does not reconcile (VR-EVD-001).',ev:[],by:'F. Said'},
  {id:'REC-1031',dp:'302-1 · Diesel consumption',site:'SA-DEP-01',period:'2025-09',val:'18,000',unit:'litre',src:'Fuel log',est:false,st:'approved',ev:['EV-0020'],calc:'48.24 tCO2e (diesel 2.68)',by:'F. Said',rev:'M. Adel',note:'Final month before closure — part-period'},
  {id:'REC-1040',dp:'303-3 · Water withdrawal',site:'EG-CEM-01',period:'2025-Q4',val:'4,200',unit:'m³',src:'Meter reading',est:true,estB:'Meter fault 12–18 Nov: interpolated from daily average of adjacent weeks (basis documented)',st:'submitted',ev:['EV-0024'],by:'H. Aly'},
  {id:'REC-1055',dp:'403-9 · Lost-time injuries',site:'ALL',period:'2025',val:'3',unit:'count',src:'HSE register',est:false,st:'review',ev:['EV-0025'],vr:'+28% vs FY2024 — explanation attached (VR-TRD-001)',by:'A. Qassem'}
 ],
 evidence:[
  {id:'EV-0019',n:'EG-CEM-01 utility invoice Oct-2025.pdf',type:'Invoice',period:'2025-10',site:'EG-CEM-01',hash:'a3f1…9c02',valid:'2025-10 → 2025-10',up:'F. Said',st:'linked'},
  {id:'EV-0020',n:'Dammam fuel log Sep-2025.xlsx',type:'Meter/Log',period:'2025-09',site:'SA-DEP-01',hash:'77b2…d114',valid:'2025-09',up:'F. Said',st:'linked'},
  {id:'EV-0021',n:'EG-CEM-01 utility invoice Nov-2025.pdf',type:'Invoice',period:'2025-11',site:'EG-CEM-01',hash:'c9d4…1a77',valid:'2025-11',up:'F. Said',st:'linked'},
  {id:'EV-0024',n:'Water meter readings Q4 + fault memo.pdf',type:'Meter/Log',period:'2025-Q4',site:'EG-CEM-01',hash:'e2a8…44b9',valid:'2025-Q4',up:'H. Aly',st:'linked'},
  {id:'EV-0025',n:'HSE incident register FY2025.pdf',type:'Register extract',period:'2025',site:'ALL',hash:'b613…f2c8',valid:'FY2025',up:'A. Qassem',st:'linked'},
  {id:'EV-0007',n:'EG grid factor letter 2024 (superseded)',type:'Factor source',period:'2024',site:'—',hash:'91aa…03de',valid:'2024',up:'Dr. H. Nassar',st:'superseded',sup:'EV-0028'},
  {id:'EV-0028',n:'National grid emission factor bulletin 2025.pdf',type:'Factor source',period:'2025',site:'—',hash:'5c07…8e91',valid:'2025',up:'Dr. H. Nassar',st:'linked'}
 ],
 factors:[
  {id:'EF-EG-ELEC-2025',n:'Egypt grid electricity',val:'0.458 kgCO2e/kWh',geo:'EG',yr:2025,src:'National bulletin 2025 · EV-0028',st:'approved',by:'Dr. H. Nassar'},
  {id:'EF-DIESEL-2025',n:'Diesel combustion',val:'2.68 kgCO2e/litre',geo:'Global',yr:2025,src:'IPCC AR6 100-yr GWP set',st:'approved',by:'Dr. H. Nassar'},
  {id:'EF-SA-ELEC-2025',n:'Saudi grid electricity',val:'0.554 kgCO2e/kWh',geo:'SA',yr:2025,src:'Supplier disclosure — pending verification',st:'review'},
  {id:'EF-NG-DEMO',n:'Natural gas (demo set)',val:'2.02 kgCO2e/Nm³',geo:'EG',yr:2025,src:'DEMO_ONLY — refused in product mode',st:'blocked'}
 ],
 findings:[
  {id:'FND-2025-0001',t:'Meter-invoice reconciliation gap Dec (EG-CEM-01)',src:'Technical review',sev:'MAJOR',st:'open',own:'S. Tawfik',due:'2026-02-28',dis:'305-2',blocks:true},
  {id:'FND-2025-0002',t:'LTIFR hours base uses payroll not attendance',src:'Department review',sev:'MINOR',st:'remediation',own:'A. Qassem',due:'2026-03-05',dis:'403-9',blocks:false},
  {id:'FND-2025-0003',t:'Scope 2 factor edition — confirm 2025 bulletin applied to all months',src:'Assurance',sev:'MAJOR',st:'awaiting_verification',own:'Dr. H. Nassar',due:'2026-03-15',dis:'305-2',blocks:true,note:'Resolved by client — awaiting independent verification of closure. State chain: Open → Remediation → Resolved by client → Awaiting verification → Closed; a finding counts as OPEN for the Publication Gate until Closed / independently verified.'},
  {id:'FND-2025-0004',t:'GRI 2-8 workers-not-employees headcount incomplete (contractors)',src:'GRI 2 assessment',sev:'MAJOR',st:'open',own:'K. Mansour',due:'2026-02-25',dis:'2-8',blocks:true},
  {id:'FND-2025-0005',t:'Quarry community grievance log evidence outdated',src:'Technical review',sev:'MINOR',st:'closed',own:'N. Fouad',due:'2026-01-30',dis:'413-1',blocks:false}
 ],
 omissions:[
  {id:'OMR-2025-0001',dis:'2-21',req:'Annual total compensation ratio',rfo:'RFO-03',reason:'Confidentiality constraints',st:'approved',expl:'Executive remuneration bound by board confidentiality policy; ratio derivable to individuals given small executive population.',appr:'Dr. S. Aziz'},
  {id:'OMR-2025-0002',dis:'303-5',req:'Water consumption (site detail)',rfo:'RFO-04',reason:'Information unavailable / incomplete',st:'submitted',expl:'Discharge sub-metering at quarry commissioned Nov 2025; full-year split not reconstructable.',steps:'Sub-meters live from FY2026; expected complete FY2026 report.',due:'FY2026'}
 ],
principlesSigned:8, notifyGRI:null, principlesRef:"esg_principles_checklist — 8/8 signed",
 gates:[
  {id:'PG-01',n:'Organization configuration',st:'pass'},
  {id:'PG-02',n:'Reporting boundary',st:'pass'},
  {id:'PG-03',n:'Applicable standards',st:'pass'},
  {id:'PG-04',n:'Materiality approval',st:'pass'},
  {id:'PG-05',n:'Data completeness ≥95% · no drafts/returned',st:'fail',fix:'Completeness 89% · 1 returned record (REC-1026)',own:'K. Mansour'},
  {id:'PG-06',n:'Evidence coverage ≥90% · no superseded links',st:'pass'},
  {id:'PG-07',n:'Calculation readiness (factors approved · self-tests)',st:'fail',fix:'EF-SA-ELEC-2025 not approved — 2 runs waiting',own:'Dr. H. Nassar'},
  {id:'PG-08',n:'Validation completion',st:'fail',fix:'1 submit-stage blocker (REC-1026 evidence)',own:'F. Said'},
  {id:'PG-09',n:'Technical review complete · no open technical findings',st:'fail',fix:'FND-2025-0001, FND-2025-0004 open',own:'O. Farid'},
  {id:'PG-10',n:'GRI 2 completion',st:'fail',fix:'2-8 blocked by finding',own:'K. Mansour'},
  {id:'PG-11',n:'Topic disclosures completion',st:'fail',fix:'3 topic KPIs not yet approved',own:'Layla'},
  {id:'PG-12',n:'Reasons for omission',st:'fail',fix:'OMR-2025-0002 awaiting approval',own:'Dr. S. Aziz'},
  {id:'PG-13',n:'Content index complete',st:'fail',fix:'2 rows missing location',own:'Nour'},
  {id:'PG-14',n:'Governance approval of report',st:'fail',fix:'Report in authoring',own:'Dr. S. Aziz'},
  {id:'PG-15',n:'Publication & assurance readiness',st:'fail',fix:'Depends on PG-05…14 + open assurance finding',own:'Governance'}
 ],
 cidx:[
  {std:'GRI 2:2021',dis:'2-1',t:'Organizational details',loc:'§2.1 p.8',st:'bound'},
  {std:'GRI 2:2021',dis:'2-7',t:'Employees',loc:'§2.4 p.14',st:'bound'},
  {std:'GRI 2:2021',dis:'2-8',t:'Workers who are not employees',loc:'—',st:'gap',note:'FND-2025-0004'},
  {std:'GRI 2:2021',dis:'2-21',t:'Annual total compensation ratio',loc:'omitted',st:'omission',note:'OMR-2025-0001 · Confidentiality'},
  {std:'GRI 3:2021',dis:'3-2',t:'List of material topics',loc:'§4.2 p.22',st:'bound'},
  {std:'GRI 305:2016',dis:'305-1',t:'Direct (Scope 1) GHG emissions',loc:'§5.1 p.28',st:'bound'},
  {std:'GRI 305:2016',dis:'305-2',t:'Energy indirect (Scope 2)',loc:'§5.1 p.29',st:'stale',note:'Dec record returned'},
  {std:'GRI 302:2016',dis:'302-1',t:'Energy consumption within org',loc:'—',st:'gap',note:'74% collected'},
  {std:'GRI 303:2018',dis:'303-3',t:'Water withdrawal',loc:'§5.3 p.34',st:'pending'},
  {std:'GRI 403:2018',dis:'403-9',t:'Work-related injuries',loc:'§5.4 p.38',st:'pending'},
  {std:'GRI 413:2016',dis:'413-1',t:'Local community engagement',loc:'§5.5 p.41',st:'bound'},
  {std:'GRI 205:2016',dis:'205-3',t:'Confirmed incidents of corruption',loc:'§5.6 p.44',st:'pending'}
 ],
 audit:[
  {w:'2026-02-06 14:22',u:'M. Adel',a:'record.return',o:'REC-1026',d:'Reason: meter photo missing (VR-EVD-001)'},
  {w:'2026-02-06 11:05',u:'F. Said',a:'evidence.upload',o:'EV-0024',d:'Water meter readings Q4 · SHA-256 stored'},
  {w:'2026-02-05 16:40',u:'Dr. S. Aziz',a:'omission.approve',o:'OMR-2025-0001',d:'Confidentiality · fields complete'},
  {w:'2026-02-05 10:12',u:'system',a:'gate.reEvaluate',o:'cycle ACME-FY2025',d:'4/15 passed · cache invalidated by record change'},
  {w:'2026-02-04 09:30',u:'Layla',a:'request.bulk',o:'14 requests',d:'Reminder escalation rung 1 — logged per recipient'}
 ],
 tasks:{
  PM:[{t:'PG-05 failing — 14 overdue requests need reminders',v:'data/plan',k:'act'},{t:'Assign reviewer for 403-9 plan row (SoD block)',v:'data/plan',k:'act'},{t:'Content index: 2 rows missing location',v:'rev/cidx',k:'warn'}],
  CONTRIB:[{t:'↩ Returned: Dec electricity — meter photo missing',v:'data/dwork',k:'ret'},{t:'Due 15 Feb: Nov water withdrawal (EG-CEM-01)',v:'data/dwork',k:'due'},{t:'Due 20 Feb: 302-1 site fuel split',v:'data/dwork',k:'due'}],
  DREV:[{t:'8 records awaiting department review',v:'rev/rwb',k:'act'},{t:'REC-1055 variance +28% — review explanation',v:'rev/rwb',k:'warn'}],
  TREV:[{t:'Cross-check blocker: 302-1 total ≠ site breakdown',v:'rev/xchk',k:'act'},{t:'Verify closure: FND-2025-0003 (assurance)',v:'rev/findings',k:'act'},{t:'3 impact assessments awaiting review',v:'mat/assess',k:'due'}],
  GOV:[{t:'OMR-2025-0002 awaiting your decision',v:'rev/oapp',k:'act'},{t:'Topic set v2 approved — next: report approval later',v:'mat/approval',k:'ok'}],
  AUTHOR:[{t:'STALE: §5.1 Scope-2 table (Dec record returned)',v:'rpt/rbind',k:'warn'},{t:'2 sections unwritten: Water, Community',v:'rpt/rnarr',k:'due'}],
  OWNER:[{t:'Returned in your team: REC-1026',v:'data/dwork',k:'ret'},{t:'2-8 contractor headcount — finding FND-2025-0004',v:'rev/findings',k:'act'}],
  METH:[{t:'Approve EF-SA-ELEC-2025 (2 runs waiting — PG-07)',v:'data/factors',k:'act'},{t:'GRI 102:2025 early-adoption election open',v:'adm/astd',k:'due'}],
  ASSUR:[{t:'Sample: 305-2 population (12 records)',v:'asr/awork',k:'act'},{t:'Evidence request #3 answered — review',v:'asr/awork',k:'due'}]
 }
};

