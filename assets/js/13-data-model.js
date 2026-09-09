/* ═══════════════════════════════════════════════════════════════════════════
   ESG OS v14 — shell wiring + V12 DATA OPERATING MODEL + late VIEWS
   Extracted verbatim from the single-file build. Classic script: LOAD ORDER
   IS SIGNIFICANT — see the <script> tags in the entry HTML.
   ═══════════════════════════════════════════════════════════════════════════ */
    /* ════════════ 12 · BOOT — single pass ════════════ */
    const roleSel = $('#roleSel');
    roleSel.innerHTML = ROLES.map(r => `<option value="${r.id}">${LANG === 'ar' ? r.ar : r.en}</option>`).join('');
    roleSel.onchange = e => { ROLE = e.target.value; location.hash = ROLE === 'ASSUR' ? '#/asr/aeng' : '#/home'; render(); toast((LANG === 'ar' ? 'تبديل الشخصية (عرض تجريبي) — الصلاحيات تبقى محكومة بالخادم' : 'Persona switched (demo) — permissions stay server-controlled')) };
    $('#langSel').onchange = e => { LANG = e.target.value; roleSel.innerHTML = ROLES.map(r => `<option value="${r.id}" ${r.id === ROLE ? 'selected' : ''}>${LANG === 'ar' ? r.ar : r.en}</option>`).join(''); render() };
    /* v13.1.1: stale document.title override removed — the <title> tag is the single source */

    /* ================= V12 · DATA OPERATING MODEL ================= */
    /* KPIM (the KPI master) now lives in assets/data/kpi-master.json and is
       loaded ahead of this file via assets/data/kpi-master.js. */
    const KPIM_CHECKSUM = "c29c10b36b7e163d";

    /* Canonical ESG tree — built from controlled KPI data, never hard-coded */
    const CANON = (() => {
      const P = { E: ['E', 'Environmental', 'البيئة'], S: ['S', 'Social', 'المجتمع'], G: ['G', 'Governance / Economic', 'الحوكمة والاقتصاد'], GEN: ['GEN', 'General (GRI 2)', 'عام (GRI 2)'] }; const m = {}; KPIM.forEach(k => { (m[k.p] = m[k.p] || {}); (m[k.p][k.t] = m[k.p][k.t] || []).push(k) });
      return ['E', 'S', 'G', 'GEN'].filter(p => m[p]).map(p => ({ p, en: P[p][1], ar: P[p][2], topics: Object.keys(m[p]).map(t => ({ t, kpis: m[p][t] })) }))
    })();
    /* Machine-readable Dimension Schemas — derived from 53 Report Coverage families; consumed by forms, plan, validation, bindings */
    const DIM_SCHEMAS = {
      'ENV-GHG-006..012': [{ id: 'scope3_category', required: true, values: '1–15' }, { id: 'included_flag', required: true }, { id: 'emission_value', required: true }, { id: 'primary_data_pct', required: true }, { id: 'exclusion_rationale', required: false }, { id: 'period_id', required: true }],
      'ENV-WAT': [{ id: 'site_id', required: true }, { id: 'water_source', required: true }, { id: 'water_type', required: true }, { id: 'water_stress_status', required: true }, { id: 'flow_type', required: true, values: 'Withdrawal|Discharge|Consumption' }, { id: 'period_id', required: true }],
      'SOC-EMP|GEN-EMP': [{ id: 'gender', required: true }, { id: 'region', required: true }, { id: 'contract_type', required: true }, { id: 'employment_type', required: true }, { id: 'employee_category', required: true }, { id: 'period_id', required: true }],
      'SOC-OHS': [{ id: 'worker_relationship', required: true, values: 'Employee|Non-employee' }, { id: 'injury_type', required: true }, { id: 'hours_worked', required: true }, { id: 'rate_type', required: false }, { id: 'hazard_category', required: false }, { id: 'site_id', required: true }, { id: 'period_id', required: true }],
      'ENV-WST': [{ id: 'waste_type', required: true }, { id: 'hazardous_status', required: true }, { id: 'treatment_route', required: true }, { id: 'onsite_offsite', required: true }, { id: 'material_category', required: false }, { id: 'site_id', required: true }, { id: 'period_id', required: true }],
      'ENV-BIO': [{ id: 'site_location', required: true }, { id: 'sensitive_area_relationship', required: true }, { id: 'value_chain_location', required: true }, { id: 'impact_driver', required: true }, { id: 'ecosystem_state', required: false }, { id: 'ecosystem_service', required: false }, { id: 'period_id', required: true }]
    };
    KPIM.forEach(k => {
      if (/^ENV-GHG-0(0[6-9]|1[0-2])$/.test(k.id)) k.dimsSchema = DIM_SCHEMAS['ENV-GHG-006..012'];
      else if (k.id.startsWith('ENV-WAT')) k.dimsSchema = DIM_SCHEMAS['ENV-WAT'];
      else if (k.id.startsWith('SOC-EMP') || k.id.startsWith('GEN-EMP')) k.dimsSchema = DIM_SCHEMAS['SOC-EMP|GEN-EMP'];
      else if (k.id.startsWith('SOC-OHS')) k.dimsSchema = DIM_SCHEMAS['SOC-OHS'];
      else if (k.id.startsWith('ENV-WST')) k.dimsSchema = DIM_SCHEMAS['ENV-WST'];
      else if (k.id.startsWith('ENV-BIO')) k.dimsSchema = DIM_SCHEMAS['ENV-BIO'];
      else k.dimsSchema = [{ id: 'entity_id', required: true }, { id: 'site_id', required: k.p === 'E' }, { id: 'period_id', required: true }];
    });
    function kpiById(id) { return KPIM.find(k => k.id === id) }
    /* ---- ONE authoritative period-record store: KPI+Site+Period → DatapointRecord ---- */
    D.dpr = {};
    ; (function () {
      const mv = [121400, 118900, 124300, 119800, 122600, 125100, 127900, 126400, 123800, 125900, 127200, 128750];
      mv.forEach((v, i) => { D.dpr['ENV-GHG-003|EG-CEM-01|2025-' + String(i + 1).padStart(2, '0')] = { v, u: 'kWh', st: i === 11 ? 'returned' : 'approved', rec: i === 11 ? 'REC-1026' : 'REC-10' + (10 + i) } });
      D.dpr['ENV-ENE-001|EG-CEM-01|2025-12'] = { v: 1290, u: 'GJ', st: 'approved', rec: 'REC-1031' };
      D.dpr['SOC-OHS-001|EG-QRY-01|2025-12'] = { v: 0, u: 'cases', st: 'approved', zero: true, rec: 'REC-1042' };
    })();
    function dprKey(k, s0, p0) { return k + '|' + s0 + '|' + p0 }
    function dprGet(k, s0, p0) { return D.dpr[dprKey(k, s0, p0)] || null }
    function dprSet(k, s0, p0, v) {
      const n = Number(String(v).replace(/,/g, ''));
      if (String(v).trim() === '' || isNaN(n)) { toast(LANG === 'ar' ? 'مرفوض: الفراغ لا يتحول صفرًا — استخدم حالة القيمة Missing (تقدير موثق أو حذف أو استبعاد)' : 'Refused: blank never becomes zero — use value-state Missing (documented estimate, omission, or exclusion)'); return false }
      const key = dprKey(k, s0, p0); const r = D.dpr[key] || (D.dpr[key] = { u: '', st: 'draft' }); r.v = n; r.st = 'draft'; r.dirty = true; audit('datapoint.entry', key, 'grid edit → same DatapointRecord; dependent ApprovedVersion marked stale'); return true
    }
    /* ================================================================
       V13.1 GENERIC APPROVED-FACT ENGINE — no KPI special-casing anywhere.
       SourceRecord → (Calculation) → ApprovedDatapointVersion → Bindings.
       ================================================================ */
    /* Controlled calculation-method registry (Calc Cards = DATA, keyed by calcMethodId) */
    const CALC_METHODS = {
      'CALC-ENV-GHG-003': {
        name: 'Scope 2 LB — kWh × grid EF', unit: 'tCO₂e', ef: 0.458, efId: 'EF-EG-ELEC-2025 v1', ver: 'CALC-GHG-S2-LOC v1',
        fn: recs => Math.round(recs.reduce((a, r) => a + r.v, 0) * 0.458) / 1000
      },
      'CALC-ENV-GHG-001': {
        name: 'Scope 1 — diesel litres × EF (kgCO₂e/L) ÷ 1000', unit: 'tCO₂e', efId: 'EF-STAT-01 (NCV) · IPCC AR6', ver: 'CALC-GHG-S1-DIESEL v2',
        fn: recs => Math.round(recs.reduce((a, r) => a + r.v, 0) * 2.6857 / 100) / 10
      },
      'CALC-SOC-OHS-002': {
        name: 'TRIR — injuries × 200,000 / hours', unit: 'per 200k hrs', efId: 'OSHA method', ver: 'CALC-SAF-RATES v1',
        fn: recs => { const inj = recs.reduce((a, r) => a + r.v, 0), hrs = recs.reduce((a, r) => a + (r.hrs || 0), 0); return hrs ? Math.round(inj * 200000 / hrs * 100) / 100 : null }
      }
    };
    /* Aggregation — strictly definition-driven */
    function aggregateKpi(def, recs) {
      if (!recs.length) return null;
      switch (def.agg) {
        case 'SUM': return Math.round(recs.reduce((a, r) => a + r.v, 0) * 10) / 10;
        case 'AVERAGE': return Math.round(recs.reduce((a, r) => a + r.v, 0) / recs.length * 10) / 10;
        case 'END_OF_PERIOD': return recs[recs.length - 1].v;
        case 'CALCULATED': { const m = CALC_METHODS[def.calc || ('CALC-' + def.id)]; return m ? m.fn(recs) : null }
        default: return null
      }
    }
    /* Period records already live in D.dpr (KPI|Site|Period). Reconciled seeds for 4 KPI classes: */
    ; (function () {
      const put = (k, site, i, rec) => { D.dpr[k + '|' + site + '|2025-' + String(i + 1).padStart(2, '0')] = rec };
      // A. ENV-GHG-003 (CALCULATED) — 12 monthly kWh at EG-CEM-01 that reconcile EXACTLY to 742.1 tCO₂e @0.458
      const kwh = [134900, 132800, 136200, 133500, 135800, 137100, 138400, 136900, 134600, 136300, 134056, 128750];
      const tgt = Math.round(742.1 / 0.458 * 1000); const cur = kwh.reduce((a, b) => a + b, 0); kwh[10] += tgt - cur; // reconcile to the approved value
      kwh.forEach((v, i) => put('ENV-GHG-003', 'EG-CEM-01', i, { v, u: 'kWh', st: i === 11 ? 'returned' : 'approved', rec: i === 11 ? 'REC-1026' : 'REC-10' + (10 + i) }));
      // A2. ENV-GHG-001 (CALCULATED Scope 1) — 12 monthly diesel-litre records reconciling to 833.6 tCO₂e
      [25900, 25700, 26000, 25800, 25950, 25850, 26100, 25980, 25760, 25890, 25870, 25580].forEach((v, i) => put('ENV-GHG-001', 'EG-CEM-01', i, { v, u: 'L diesel', st: 'approved', rec: 'REC-20' + (10 + i) }));
      // B. ENV-WAT-001 (SUM, ML) at EG-QRY-01 — sums exactly to 391.2
      const wat = [33.1, 31.8, 34.0, 32.2, 33.6, 32.9, 33.4, 32.1, 31.9, 32.6, 31.9, 31.7];
      const wcur = Math.round(wat.reduce((a, b) => a + b, 0) * 10) / 10; wat[11] = Math.round((wat[11] + (391.2 - wcur)) * 10) / 10;
      wat.forEach((v, i) => put('ENV-WAT-001', 'EG-QRY-01', i, { v, u: 'ML', st: 'approved', rec: 'REC-1050' }));
      // C. SOC-OHS-002 (CALCULATED TRIR) — injuries + hours reconcile to 1.41
      for (let i = 0; i < 12; i++)put('SOC-OHS-002', 'GROUP', i, { v: i % 4 === 0 ? 2 : 1, hrs: i === 11 ? 141900 : 141850, u: 'inj·hrs', st: 'approved', rec: 'REC-2040' });
      (function () {
        const recs = Array.from({ length: 12 }, (_, i) => D.dpr['SOC-OHS-002|GROUP|2025-' + String(i + 1).padStart(2, '0')]);
        const inj = recs.reduce((a, r) => a + r.v, 0); const target = 1.41; const hrs = Math.round(inj * 200000 / target);
        const cur = recs.reduce((a, r) => a + r.hrs, 0); recs[11].hrs += hrs - cur;
      })();
      // D. GEN-EMP-001 (END_OF_PERIOD headcount) — Dec = 672
      [655, 657, 659, 660, 662, 664, 665, 667, 668, 670, 671, 672].forEach((v, i) => put('GEN-EMP-001', 'GROUP', i, { v, u: 'persons', st: 'approved', rec: 'REC-1001' }));
      // Worked stale example (generic — via a dirty record, NOT a name check): ENV-WST-001 has one edited-after-approval record
      put('ENV-WST-001', 'EG-CEM-01', 11, { v: 0.66, u: 'kt', st: 'approved', rec: 'REC-1052', dirty: true });
    })();
    /* ---- THE single fact store ---- */
    D.adv = {}; D.advHist = [];
    ; (function () {
      const seed = [
        ['ENV-GHG-001', [920.4, 871.2, 833.6], 'RUN-2209', 'High', 'Limited'],
        ['ENV-GHG-003', [812.0, 768.3, 742.1], 'RUN-2210', 'High', 'Limited'],
        ['ENV-GHG-004', [735.5, 719.8, 702.4], 'RUN-2212', 'High', 'Limited'],
        ['ENV-ENE-001', [15400, 14890, 14210], 'REC-1031', 'High', 'Limited'],
        ['ENV-ENE-004', [12.4, 14.1, 16.8], 'RUN-2216', 'Medium', '—'],
        ['ENV-WAT-001', [412.5, 398.7, 391.2], 'REC-1050', 'Medium', '—'],
        ['ENV-WST-001', [8.42, 8.11, 7.65], 'REC-1052', 'Medium', '—'],
        ['SOC-EMP-001', [604, 635, 672], 'REC-1001', 'High', 'Limited'],
        ['SOC-OHS-002', [1.84, 1.62, 1.41], 'RUN-2230', 'High', 'Limited'],
        ['SOC-OHS-001', [0, 1, 0], 'REC-1042', 'High', 'Limited'],
        ['SOC-DIV-001', [21.5, 23.8, 26.1], 'REC-1060', 'Medium', '—'],
        ['SOC-TRN-001', [14.2, 16.8, 19.4], 'REC-1061', 'Medium', '—'],
        ['GOV-ETH-001', [0, 0, 0], 'REC-1070', 'High', 'Limited'],
        ['GOV-ECO-001', [184.2, 201.5, 214.8], 'REC-1072', 'High', '—'],
        ['GEN-EMP-001', [604, 635, 672], 'REC-1001', 'High', 'Limited']];
      seed.forEach(([id, vals, rec, q, asr]) => {
        ['FY2023', 'FY2024', 'FY2025'].forEach((per, i) => {
          D.adv[id + '|' + per] = {
            id: 'ADV-' + id + '-' + per + '-v3', kpi: id, per, v: vals[i], rec, q, asr, ver: 'v3', st: 'approved',
            approvedBy: 'O. Farid', approvedAt: '2026-02-12', supersedes: 'ADV-' + id + '-' + per + '-v2',
            src: 'D.dpr[' + id + '|*|' + per.replace('FY', '') + '-MM]'
          }
        })
      })
    })();
    function advGet(id, per) { return D.adv[id + '|' + per] || null }
    function recordsFor(id, per) {
      per = per || 'FY2025'; const y = per.replace('FY', '');
      return Object.keys(D.dpr).filter(k => k.startsWith(id + '|') && k.includes('|' + y + '-')).sort().map(k => D.dpr[k])
    }
    /* GENERIC stale: an ApprovedVersion is stale iff ANY of its period source records was edited after approval */
    function advStale(id, per) { per = per || 'FY2025'; return recordsFor(id, per).some(r => r.dirty === true) }
    /* GENERIC approval transition — creates an immutable new version from the records via the definition */
    function approve(id, per) {
      per = per || 'FY2025'; const def = kpiById(id); if (!def) { toast('Unknown KPI'); return null }
      const recs = recordsFor(id, per); if (!recs.length) { toast('No period records to approve for ' + id); return null }
      const v = aggregateKpi(def, recs); if (v == null) { toast('Aggregation method ' + def.agg + ' yielded no value'); return null }
      const prev = advGet(id, per); if (prev) D.advHist.push(Object.freeze({ ...prev, st: 'superseded' }));
      const vno = 'v' + ((prev ? parseInt(prev.ver.slice(1)) : 3) + 1);
      D.adv[id + '|' + per] = {
        id: 'ADV-' + id + '-' + per + '-' + vno, kpi: id, per, v, rec: def.agg === 'CALCULATED' ? (CALC_METHODS[def.calc] ? def.calc : prev && prev.rec) : (prev ? prev.rec : 'REC'),
        q: prev ? prev.q : 'High', asr: prev ? prev.asr : '—', ver: vno, st: 'approved', approvedBy: ROLE, approvedAt: 'now',
        supersedes: prev ? prev.id : null, src: recs.length + ' period records'
      };
      recs.forEach(r => { delete r.dirty });
      if (def.agg === 'CALCULATED') mintCalcVersion(id, per, D.adv[id + '|' + per], recs);
      audit('datapoint.approve', id + '|' + per, 'ApprovedDatapointVersion ' + vno + ' created from ' + recs.length + ' records (' + def.agg + ') — supersedes kept immutable; all bindings now resolve ' + vno);
      render(); return D.adv[id + '|' + per]
    }
    function advApprove(id, per) { return approve(id, per) } // back-compat alias
    /* ---- V13.1.1: IMMUTABLE CALCULATION-VERSION LINEAGE (P0-3 closure) ----
       A CALCULATED KPI's ApprovedDatapointVersion links ONE frozen CalculationVersion whose
       output IS the approved value. FREEZE RULE: CV.output === ADV.value === report value —
       a surface can never cite an execution whose output differs (TC-INT-15). */
    D.calcVers = {}; D.calcVersHist = [];
    function cvOf(id, per) { return D.calcVers[id + '|' + (per || 'FY2025')] || null }
    function mintCalcVersion(id, per, adv, recs) {
      const def = kpiById(id); if (!def || def.agg !== 'CALCULATED') return null;
      const mId = def.calc || ('CALC-' + def.id); const m = CALC_METHODS[mId]; if (!m) return null;
      const prev = D.calcVers[id + '|' + per]; if (prev) D.calcVersHist.push(Object.freeze({ ...prev, st: 'superseded' }));
      const cv = Object.freeze({
        id: 'CV-' + id + '-' + per + '-' + adv.ver, kpi: id, per, methodId: mId, methodVer: m.ver || mId,
        factorVersionIds: m.efId ? [m.efId] : [], inputRecordIds: [...new Set(recs.map(r => r.rec).filter(Boolean))], inputs: recs.length,
        output: adv.v, unit: m.unit || def.u, executedAt: adv.approvedAt, reviewedBy: 'O. Farid', approvedBy: adv.approvedBy,
        approvedAt: adv.approvedAt, st: 'approved',
        hash: (id + '|' + per + '|' + adv.v).split('').reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 7).toString(16)
      });
      D.calcVers[id + '|' + per] = cv; adv.cv = cv.id; return cv
    }
    /* mint at boot for every CALCULATED KPI whose approved value is backed by live period records */
    Object.keys(D.adv).forEach(k => {
      const a = D.adv[k]; const d0 = kpiById(a.kpi);
      if (d0 && d0.agg === 'CALCULATED') { const rs = recordsFor(a.kpi, a.per); if (rs.length) mintCalcVersion(a.kpi, a.per, a, rs) }
    });
    /* PROJECTION — the only read path for every consumer */
    function factOf(id) {
      const a3 = advGet(id, 'FY2023'), a4 = advGet(id, 'FY2024'), a5 = advGet(id, 'FY2025');
      if (!a5) return null; const tg = D.targets.find(x => x.kpi === id);
      return {
        id, fy23: a3 && a3.v, fy24: a4 && a4.v, fy25: a5.v, rec: a5.rec, q: a5.q, asr: a5.asr, ver: a5.ver, advId: a5.id,
        tgt: tg ? tg.tv : null, stale: advStale(id, 'FY2025')
      }
    }
    D.fact = { get length() { return Object.keys(D.adv).filter(k => k.endsWith('FY2025')).length } }; // count shim — NOT a store
    /* ---- V13.1.1: APPROVED DIMENSIONAL BREAKDOWN (P0-2 closure) ----
       The site allocation of an approved total is itself governed data pinned to an
       ApprovedVersion id. RULE: sum(rows) === ADV.value, and chart + table render the SAME
       dataset. A newer approved total SUPERSEDES the allocation — surfaces refuse it until
       it is re-allocated (never silently keep old rows). */
    D.brk = {
      'ENV-GHG-003|FY2025': {
        advId: 'ADV-ENV-GHG-003-FY2025-v3', unit: 'tCO₂e', dims: 'site',
        rows: [['EG-CEM-01', 648.6], ['SA-SOL-01', 16.3], ['SA-WND-01', 8.9], ['SA-DEP-01', 68.3]], notes: { 'SA-DEP-01': 'part-period' }
      },
      'ENV-GHG-003|FY2024': {
        advId: 'ADV-ENV-GHG-003-FY2024-v3', unit: 'tCO₂e', dims: 'site',
        rows: [['EG-CEM-01', 671.2], ['SA-SOL-01', 17.8], ['SA-WND-01', 9.6], ['SA-DEP-01', 69.7]], notes: {}
      }
    };
    function brkOf(id, per) {
      const b = D.brk[id + '|' + per]; if (!b) return null; const a = advGet(id, per);
      const sum = Math.round(b.rows.reduce((x, r) => x + r[1], 0) * 10) / 10;
      return {
        ...b, kpi: id, per, sum, total: a ? a.v : null, current: !!a && b.advId === a.id,
        reconciles: !!a && Math.abs(sum - a.v) < 0.05
      }
    }
    /* ---- ONE report binding layer ---- */
    const REPORT_BINDINGS = {
      'RB-001': { el: '§5.1 table · Scope 1', kpi: 'ENV-GHG-001', per: 'FY2025', dims: 'group×FY', agg: 'CALCULATED', kind: 'adv' },
      'RB-002': { el: '§5.1 table · Scope 2 LB', kpi: 'ENV-GHG-003', per: 'FY2025', dims: 'group×FY', agg: 'CALCULATED', kind: 'adv' },
      'RB-003': { el: '§5.1 table · Scope 2 MB', kpi: 'ENV-GHG-004', per: 'FY2025', dims: 'group×FY', agg: 'CALCULATED', kind: 'adv' },
      'RB-004': { el: '§5.1 narrative token · Scope 1', kpi: 'ENV-GHG-001', per: 'FY2025', dims: '—', agg: 'CALCULATED', kind: 'adv' },
      'RB-005': { el: '§5.1 chart TBL-08 + site table', kpi: 'ENV-GHG-003', per: 'FY2025', dims: 'site', agg: 'allocation of the approved total — chart and table read ONE dataset', kind: 'breakdown' },
      'RB-006': { el: '§5.2 energy row', kpi: 'ENV-ENE-001', per: 'FY2025', dims: 'group×FY', agg: 'SUM', kind: 'adv' },
      'RB-007': { el: '§5.3 water row', kpi: 'ENV-WAT-001', per: 'FY2025', dims: 'site×source×stress', agg: 'SUM', kind: 'adv' },
      'RB-008': { el: '§5.4 waste table', kpi: 'ENV-WST-001', per: 'FY2025', dims: 'haz×treatment×disposition', agg: 'SUM', kind: 'spec' },
      'RB-009': { el: '§6.1 workforce total', kpi: 'GEN-EMP-001', per: 'FY2025', dims: 'gender×region×contract', agg: 'END_OF_PERIOD', kind: 'adv' },
      'RB-010': { el: '§6.2 OHS TRIR', kpi: 'SOC-OHS-002', per: 'FY2025', dims: 'group', agg: 'CALCULATED', kind: 'adv' },
      'RB-011': { el: 'Ch.9 targets table', ref: 'D.targets + tgtProgress() — RAG gated NOT_EVALUATED until MD-02 is signed', kind: 'object' },
      'RB-012': { el: 'Ch.10 GRI Content Index', ref: 'generated index pipeline (29-§1) — regenerated at every render', kind: 'object' },
      'RB-013': { el: '§1/§2 organization facts', ref: 'approved org profile + cycle objects (tokv-bound in print)', kind: 'object' },
      'RB-014': { el: 'Annex · calculation methodology', ref: 'CALC_METHODS cards + frozen factor editions — annex page not yet rendered', kind: 'spec' },
      'RB-015': { el: 'Scope 3 table (template family)', kpi: 'ENV-GHG-006', per: 'FY2025', dims: 'category 1–15 × included × %primary', agg: 'CALCULATED', kind: 'spec' },
      'RB-016': { el: '§5.2 renewable share token', kpi: 'ENV-ENE-004', per: 'FY2025', dims: 'group', agg: 'AVERAGE', kind: 'adv' }
    };
    function resolveReportBinding(elId) {
      const b = REPORT_BINDINGS[elId]; if (!b) return { elId, status: 'UNBOUND' };
      if (b.kind === 'object') return { elId, el: b.el, ref: b.ref, status: 'BOUND — OBJECT' };
      if (b.kind === 'spec') return { elId, el: b.el, kpiId: b.kpi, status: 'SPECIFIED — NOT YET BOUND' };
      if (b.kind === 'breakdown') {
        const bk = brkOf(b.kpi, b.per); if (!bk || bk.total == null) return { elId, el: b.el, kpiId: b.kpi, status: 'SPECIFIED — NOT YET BOUND' };
        return {
          elId, el: b.el, kpiId: b.kpi, approvedVersionId: bk.advId, rows: bk.rows, sum: bk.sum, total: bk.total, unit: bk.unit,
          reconciles: bk.reconciles, current: bk.current, value: bk.sum, period: b.per, dims: b.dims, aggregation: b.agg,
          sourceType: 'ApprovedBreakdown', stale: !bk.current || advStale(b.kpi, b.per),
          status: bk.current ? 'BOUND' : 'SUPERSEDED — RE-ALLOCATE'
        }
      }
      const a = advGet(b.kpi, b.per); const k = kpiById(b.kpi); if (!a) return { elId, kpiId: b.kpi, status: 'SPECIFIED — NOT YET BOUND' };
      const cv = cvOf(b.kpi, b.per);
      return {
        elId, el: b.el, kpiId: b.kpi, approvedVersionId: a.id, cvId: cv ? cv.id : null, value: a.v, unit: k ? k.u : '', period: b.per, dims: b.dims,
        aggregation: b.agg, sourceType: cv ? 'ApprovedCalculationVersion' : 'ApprovedDatapointVersion',
        stale: advStale(b.kpi, b.per), status: 'BOUND'
      }
    }
    function bindFact(idOrEl, unit) {
      const elId = REPORT_BINDINGS[idOrEl] ? idOrEl : Object.keys(REPORT_BINDINGS).find(x => REPORT_BINDINGS[x].kpi === idOrEl && REPORT_BINDINGS[x].per === 'FY2025');
      const r = elId ? resolveReportBinding(elId) : { status: 'UNBOUND' };
      if (r.status !== 'BOUND') return '<b class="tokw" title="' + r.status + ' — Release refuses">UNBOUND</b>';
      return `<b class="tok" title="${r.elId} → ${r.kpiId} → ${r.approvedVersionId} · ${r.period} · ${r.aggregation}">${r.value}${unit ? ' ' + unit : ''}</b>${r.stale ? ' <b class="tokw" title="upstream record edited after approval — re-approve, then re-render">⚠ stale</b>' : ''}`
    }
    /* ---- Targets & Goals — first-class objects ---- */
    D.targets = [
      { id: 'TGT-01', topic: 'MT-01', kpi: 'ENV-GHG-001', stmt: 'Reduce absolute Scope 1 30% vs FY2022 by 2030', type: 'Absolute reduction', by: 2022, bv: 1020, ty: 2030, tv: 714, unit: 'tCO₂e', scope: 'Group', own: 'L. Al-Harbi', appr: 'Executive Committee 12 Nov 2025', ev: 'EV-0080', st: 'Approved', ver: 'v2', ca: '' },
      { id: 'TGT-02', topic: 'MT-02', kpi: 'ENV-ENE-004', stmt: 'Reach 30% renewable electricity by 2030', type: 'Share increase', by: 2022, bv: 8.1, ty: 2030, tv: 30, unit: '%', scope: 'Group', own: 'O. Farid', appr: 'Executive Committee', ev: 'EV-0081', st: 'Approved', ver: 'v1', ca: '' },
      { id: 'TGT-03', topic: 'MT-04', kpi: 'SOC-OHS-002', stmt: 'TRIR below 1.2 by FY2026', type: 'Rate reduction', by: 2023, bv: 1.84, ty: 2026, tv: 1.2, unit: 'per 200k hrs', scope: 'All sites', own: 'K. Mansour', appr: 'HSE Committee', ev: 'EV-0082', st: 'Approved', ver: 'v1', ca: '' },
      { id: 'TGT-04', topic: '— non-material (management target)', kpi: 'SOC-DIV-001', stmt: '30% women in management by 2028', type: 'Share increase', by: 2023, bv: 21.5, ty: 2028, tv: 30, unit: '%', scope: 'Group', own: 'HR Director', appr: 'Board People Cttee', ev: 'EV-0083', st: 'Approved', ver: 'v1', ca: 'Hiring-slate rule added FY2026' },
      { id: 'TGT-05', topic: 'MT-03', kpi: 'ENV-WAT-001', stmt: 'Reduce withdrawal intensity 10% by 2027', type: 'Intensity reduction', by: 2023, bv: 412.5, ty: 2027, tv: 371, unit: 'ML', scope: 'Water-stressed sites', own: 'F. Said', appr: '—', ev: '', st: 'Draft', ver: 'v1', ca: '' }];
    /* Governance gate — methodology configuration (controlled data, not code constants) */
    const METH = { md01Signed: false, md02Signed: false, tolPct: null /* set ONLY by approved methodology */, ragMethodVersion: 'MD-02 draft' };
    D.cycle.perfAsOf = 'FY2025'; // PerformanceAsOfDate — from the Reporting Cycle, never today()/implicit
    const MD02_SIGNED = METH.md02Signed;
    /* Trajectory methodology MD-02 (adopted; Methodology Owner countersign pending):
       method = Linear unless the target declares another; expected(asOf) = bv + (tv−bv)·(asOf−by)/(ty−by);
       RAG: GREEN when actual is at/beyond expected; AMBER when short of expected within the target's approved
       tolerance parameter tolPct (a governed field, default 5 — a methodology parameter, not code); RED beyond. */
    function tgtExpected(t, asOf) { asOf = asOf || 2025; if (asOf <= t.by) return t.bv; if (asOf >= t.ty) return t.tv; return t.bv + (t.tv - t.bv) * (asOf - t.by) / (t.ty - t.by) }
    function tgtProgress(t) {
      const f = factOf(t.kpi); if (!f || f.fy25 == null) return null; const cur = f.fy25;
      const asOf = parseInt(String(D.cycle.perfAsOf).replace('FY', '')) || t.ty;
      const exp = tgtExpected(t, asOf);
      const p = Math.round(100 * Math.min(1, Math.max(0, (t.bv - cur) / (t.bv - t.tv))));
      const base = { cur, exp: Math.round(exp * 10) / 10, p, asOf: 'FY' + asOf, var: Math.round((cur - exp) * 10) / 10, method: t.method || 'Linear', methVer: METH.ragMethodVersion };
      if (!METH.md02Signed) return { ...base, on: null, rag: 'NOT_EVALUATED' }; /* governance gate: no Green/Amber/Red before countersign */
      const tol = (t.tolPct ?? METH.tolPct); if (tol == null) return { ...base, on: null, rag: 'NOT_EVALUATED' }; /* no silent numeric fallback — tolerance must be governed */
      const improving = t.tv < t.bv ? cur <= exp : cur >= exp; const gap = t.tv < t.bv ? cur - exp : exp - cur;
      return { ...base, on: improving, rag: improving ? 'GREEN' : (gap <= tol / 100 * Math.abs(t.tv - t.bv) ? 'AMBER' : 'RED') }
    }
    /* ---- ESG Risks & Opportunities (≠ materiality impacts) ---- */
    D.risks = [
      { id: 'RSK-01', p: 'E', topic: 'MT-03', n: 'Water scarcity disrupts quarry & cement production', drv: 'Basin stress + permit tightening', kpis: 'ENV-WAT-001 · ENV-WAT-004', il: 4, ii: 4, ctl: 'Recycling circuit; abstraction permits; contingency supply', cown: 'F. Said', rl: 3, ri: 3, due: '2026-06-30', st: 'Treatment in progress' },
      { id: 'RSK-02', p: 'E', topic: 'MT-01', n: 'Carbon cost exposure (CBAM / local pricing)', drv: 'Regulatory', kpis: 'ENV-GHG-001 · ENV-GHG-003', il: 4, ii: 5, ctl: 'Decarbonization roadmap; PPA; efficiency capex', cown: 'L. Al-Harbi', rl: 3, ri: 4, due: '2027-01-01', st: 'Open' },
      { id: 'RSK-03', p: 'S', topic: 'MT-04', n: 'Serious safety incident at O&M contractors', drv: 'Contractor control gap', kpis: 'SOC-OHS-001 · SOC-OHS-002', il: 3, ii: 5, ctl: 'Contractor HSE pre-qualification; joint audits', cown: 'K. Mansour', rl: 2, ri: 4, due: '2026-03-31', st: 'Treatment in progress' },
      { id: 'RSK-04', p: 'G', topic: 'MT-02', n: 'Opportunity: green-financing margin discount', drv: 'Sustainability-linked loan covenants', kpis: 'ENV-ENE-004 · SOC-OHS-002', il: 3, ii: 3, ctl: 'KPI covenant tracking (this platform)', cown: 'CFO', rl: 3, ri: 3, due: '2026-09-30', st: 'Opportunity — active' }];
    /* ================= VIEWS ================= */
    function canonTree(sel, cb) {
      return `<div class="queue" style="min-width:250px"><div class="qh">${LANG === 'ar' ? 'شجرة ESG المعيارية' : 'Canonical ESG tree'} <span class="sub" data-noar>from KPI Master</span></div>
 ${CANON.map(g => `<div style="padding:7px 12px;font-weight:800;font-size:11px;letter-spacing:.05em;color:var(--mut)" data-noar>${g.p} · ${LANG === 'ar' ? g.ar : g.en}</div>
 ${g.topics.map(tp => { const done = tp.kpis.filter(k => factOf(k.id)).length; return `<div class="qi ${sel === tp.t ? 'active' : ''}" onclick="${cb}('${tp.t.replace(/'/g, "\\'")}')"><span class="secDot ${done === tp.kpis.length && done ? 'approved' : done ? 'review' : 'draft'}"></span> ${esc(tp.t)}<div class="m"><span>${tp.kpis.length} KPI</span><span>${done} ${LANG === 'ar' ? 'معتمد' : 'approved'}</span></div></div>` }).join('')}`).join('')}</div>`
    }
    let PRG_T = 'Water & Effluents'; function prgSel(t) { PRG_T = t; render() }
    VIEWS['home/program'] = () => {
      const tp = CANON.flatMap(g => g.topics).find(x => x.t === PRG_T) || CANON[0].topics[0];
      return pageHead(LANG === 'ar' ? 'نظرة البرنامج — متصفح الموضوعات' : 'ESG Program Overview — Topic Navigator', LANG === 'ar' ? 'شاشة تنسيق فوق النظام كله: نفس الشجرة، ونفس السجلات — لا تملك أي حقيقة عمل.' : 'One orchestration surface over the whole system: the same canonical tree, the same records — owns no business fact.', '', 'Home › Program Overview') +
        `<div class="tiles">${tile('E/S/G/GEN', '4 pillars')}${tile(CANON.reduce((a, g) => a + g.topics.length, 0), 'Topics')}${tile(KPIM.length, 'KPIs registered')}${tile(D.fact.length, 'Approved facts', 'ok', 'data/factbook')}</div>
 <div class="wb">${canonTree(PRG_T, 'prgSel')}<div>
 <div class="card" style="margin:0"><div class="hd">${esc(tp.t)} <span class="sub">${LANG === 'ar' ? 'عرض موحد — كل قيمة تُقرأ من مالكها' : 'consolidated view — every value read from its owner'}</span></div><div class="bd">
 ${(() => {
          const kids = tp.kpis.map(k => k.id); const gset = [...new Set(tp.kpis.map(k => (k.g || '').split(':')[0].replace('GRI', '').trim()).filter(Boolean))].slice(0, 3);
          const mt = (() => { const map = { 'GHG Emissions': 'MT-01', 'Energy': 'MT-02', 'Water & Effluents': 'MT-03', 'Occupational Health & Safety': 'MT-04', 'Local Communities': 'MT-05', 'Anti-corruption & Competition': 'MT-06' }; const id = map[tp.t]; if (!id) return null; const T = D.topics.find(x => x.id === id); return T ? T.id + ' ' + T.n : null })();
          const tg = D.targets.find(x => kids.includes(x.kpi)); const facts = kids.filter(id => factOf(id)).length;
          const own = [...new Set(tp.kpis.map(k => k.dep.replace(/[؀-ۿ]+/g, '').trim()))][0] || '—';
          const fnd = D.findings.filter(f => f.st !== 'closed' && tp.t === 'Workforce & Governance (GRI 2)' ? 1 : 0).length;
          const sec = tp.kpis[0] && tp.kpis[0].p === 'E' ? '§5 Environmental' : tp.kpis[0] && tp.kpis[0].p === 'S' ? '§6 Social' : '§7 Governance';
          return `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:6px 18px;font-size:12px">
  <span>${mt ? pv('reuse', 'Material topic: ' + mt, '#/mat/ranking') : `<span class="st na">${LANG === 'ar' ? 'ليس موضوعًا جوهريًا معتمدًا' : 'Not an approved material topic'}</span>`}</span>
  <span>${pv('reuse', 'GRI ' + (gset.join(' · ') || '2') + ' — applicability in B-10', '#/setup/applic')}</span>
  <span><b>${tp.kpis.length}</b> KPIs ${pv('reuse', 'KPI Master', '#/data/kpimaster')}</span>
  <span>Sites: from B-03 data-domain routing ${pv('reuse', 'B-03', '#/org/sites')}</span>
  <span>${t('who')}: ${esc(own.slice(0, 28))} ${pv('reuse', 'X-PLAN', '#/data/plan')}</span>
  <span>Approved facts: <b>${facts}/${tp.kpis.length}</b> ⚙</span>
  <span>Evidence gaps: <b style="color:${tp.t === 'GHG Emissions' ? 'var(--err)' : 'var(--mut)'}">${tp.t === 'GHG Emissions' ? 1 : 0}</b> ${pv('der', 'derived', '#/data/evid')}</span>
  <span>Open findings: ${fnd} ${pv('der', 'derived', '#/rev/findings')}</span>
  <span>${tg ? pv('reuse', 'Target: ' + tg.id, '#/data/targets') : (LANG === 'ar' ? 'لا هدف مسجل' : 'No target registered')}</span>
  <span>Report ${sec} ${pv('reuse', 'Report Studio', '#/rpt/rstruct')}</span>
  <span>Assurance: per-datapoint flags ⚙</span>
 </div>`})()}
 <table class="tbl" style="margin-top:12px"><thead><tr><th>KPI</th><th>Unit</th><th>GRI</th><th>Dept</th><th>Freq</th><th>Fact FY2025</th><th>${t('status')}</th></tr></thead><tbody>
 ${tp.kpis.map(k => { const f = factOf(k.id); return `<tr><td><b data-noar>${k.id}</b><div style="font-size:11px">${esc(k.en)}</div></td><td data-noar>${esc(k.u)}</td><td style="font-size:11px" data-noar>${esc(k.g.split('—')[0])}</td><td style="font-size:11px">${esc(k.dep.split(' ')[0])}</td><td style="font-size:11px">${esc(k.fq.split(' ')[0])}</td><td>${f ? `<a onclick="factDrill('${k.id}')"><b>${f.fy25}</b></a>` : '<span style="color:var(--mut)">—</span>'}</td><td>${f ? st('approved', 'Approved') : st('progress', 'Collecting')}</td></tr>` }).join('')}
 </tbody></table></div></div></div></div>`};
    /* ---- KPI & Metrics Master ---- */
    let KM_Q = '', KM_P = ''; function kmQ(v) { KM_Q = v.toLowerCase(); render() } function kmP(v) { KM_P = v === 'All' ? '' : v; render() }
    VIEWS['data/kpimaster'] = () => {
      const L = KPIM.filter(k => (!KM_P || k.p === KM_P) && (!KM_Q || (k.id + k.en + k.t + k.g).toLowerCase().includes(KM_Q)));
      return pageHead(LANG === 'ar' ? 'سجل المؤشرات الرئيسي' : 'KPI & Metrics Master', LANG === 'ar' ? '113 تعريفًا معتمدًا — التعريف مصدر واحد وversioned؛ الدورة تحل نسخة التعريف As-Of. التعريف ≠ القيمة.' : '113 governed definitions — one source, versioned; a cycle resolves the definition AS-OF its basis date. Definition ≠ instance.',
        `<span class="st approved">${KPIM.length} KPIs · v2.0</span>`, 'Data & Evidence › KPI Master') +
        `<div class="tiles">${tile(KPIM.filter(k => k.p === 'E').length, 'Environmental')}${tile(KPIM.filter(k => k.p === 'S').length, 'Social')}${tile(KPIM.filter(k => k.p === 'G').length, 'Governance')}${tile(KPIM.filter(k => k.db).length, 'Dashboard-flagged ★', 'ok')}</div>
 <div class="card"><div class="bd" style="display:flex;gap:10px;padding:10px 14px"><input placeholder="${LANG === 'ar' ? 'بحث بالكود/الاسم/GRI' : 'Search id / name / GRI'}" style="flex:1" oninput="kmQ(this.value)" value="${esc(KM_Q)}"><select style="width:auto" onchange="kmP(this.value)">${['All', 'E', 'S', 'G', 'GEN'].map(x => `<option ${KM_P === x ? 'selected' : ''}>${x}</option>`).join('')}</select><span style="align-self:center;font-size:12px;color:var(--mut)">${L.length} ${LANG === 'ar' ? 'ظاهر' : 'shown'}</span></div>
 <div style="max-height:560px;overflow:auto"><table class="tbl"><thead><tr><th>KPI ID</th><th>KPI</th><th>Unit</th><th>GRI ${LANG === 'ar' ? 'حالي' : 'current'}</th><th>FY2027+</th><th>Dept</th><th>Freq</th><th>★</th><th>Dir</th></tr></thead><tbody>
 ${L.map(k => `<tr style="cursor:pointer" onclick="drawer('${k.id}',kpiDetail('${k.id}'))"><td><b data-noar>${k.id}</b></td><td style="min-width:210px">${esc(k.en)}<div style="font-size:11px;color:var(--mut)" data-noar>${esc(k.ar)}</div></td><td data-noar>${esc(k.u)}</td><td style="font-size:11px" data-noar>${esc(k.g.split('—')[0])}</td><td style="font-size:11px" data-noar>${esc((k.g27 || '—').split('—')[0])}</td><td style="font-size:11px">${esc(k.dep.replace(/[؀-ۿ]+/g, '').trim().split('  ')[0].slice(0, 22))}</td><td style="font-size:11px">${esc(k.fq.split(' ')[0])}</td><td>${k.db ? '★' : ''}</td><td style="font-size:11px">${esc((k.dir || '—').split(' ')[0])}</td></tr>`).join('')}
 </tbody></table></div></div>`};
    function kpiDetail(id) {
      const k = kpiById(id); const f = factOf(id); return `<div class="formGrid">
 ${sect('Definition — versioned, read-only from instances', 'التعريف', 'v2.0 · Methodology approval: Dr. H. Nassar')}
 ${field({ label: 'KPI ID / Pillar / Topic', value: k.id + ' · ' + k.p + ' · ' + k.t, ro: 1 })}
 ${field({ label: 'Name EN / AR', value: k.en + ' · ' + k.ar, ro: 1, full: 1 })}
 ${field({ label: 'Definition', value: k.d, ro: 1, full: 1 })}
 ${field({ label: 'Data type / Unit', value: k.dt + ' · ' + (k.u || '—'), ro: 1, help: 'Explicit definition field — never inferred at runtime.' })}
 ${field({ label: 'Formula / Calculation method', value: (k.f && k.f !== '—' ? k.f + (k.calc ? '  [' + k.calc + ']' : '') : '— direct measure'), ro: 1, full: 1 })}
 ${field({ label: 'Aggregation method', value: k.agg, ro: 1, help: 'SUM / AVERAGE / END_OF_PERIOD / CALCULATED / NONE — drives every FY roll-up.' })}
 ${field({ label: 'Dimensions (machine-readable)', value: k.dimsSchema.map(d => d.id + (d.required ? '*' : '') + (d.values ? ' [' + d.values + ']' : '')).join(' × '), ro: 1, full: 1, help: 'dimsSchema[] — one schema consumed by forms, plan, validation and report bindings; prose is display only.' })}
 ${field({ label: 'Boundary rule', value: k.bnd, ro: 1 })}
 ${sect('Mappings', 'الارتباطات', 'crosswalk ≠ applicability')}
 ${field({ label: 'GRI current', value: k.g, ro: 1 })}
 ${field({ label: 'GRI from FY2027', value: k.g27 || '—', ro: 1 })}
 ${field({ label: 'Other frameworks', value: k.fw || '—', ro: 1, full: 1 })}
 ${sect('Operating defaults', 'التشغيل', 'seed the Collection Plan')}
 ${field({ label: 'Owning department', value: k.dep, ro: 1 })}
 ${field({ label: 'Data owner (role)', value: k.own, ro: 1 })}
 ${field({ label: 'Source system', value: k.src, ro: 1 })}
 ${field({ label: 'Collection / Disclosure frequency', value: k.coll + ' · ' + k.disc, ro: 1 })}
 ${field({ label: 'Evidence requirement', value: k.ev, ro: 1 })}
 ${field({ label: 'Validation rule set', value: k.vr, ro: 1 })}
 ${field({ label: 'Effective / Version / Approval', value: k.eff + ' → open · ' + k.ver + ' · ' + k.appr, ro: 1, full: 1 })}
 ${sect('Consumption', 'الاستهلاك', '')}
 ${field({ label: 'Dashboard', value: (k.db ? '★ Yes' : 'No') + ' · ' + (k.ch || '—') + ' · ' + (k.dir || '—'), ro: 1 })}
 ${field({ label: 'RAG methodology', value: k.rag || '—', ro: 1 })}
 ${field({ label: 'Approved fact (FY2025)', value: f ? f.fy25 + ' ' + k.u + ' · ' + f.rec : '— not yet approved', pv: { k: 'der', t: 'Fact Book', l: '#/data/factbook' } })}
 <div class="full notice info" style="margin:0"><b>Identity test:</b> ${k.id} is the SAME id in Master · Plan · Grid · Workspace · Fact Book · Dashboard · Report binding · Assurance.</div></div>`
    }
    /* ---- Department Collection Grid — a pivot VIEW over DatapointRecords ---- */
    let DG_DEP = 'Energy'; function dgDep(v) { DG_DEP = v; render() }
    const DG_VIEWS = [['Energy', 'Energy & Facilities', ['Energy, Utilities', 'Operations /']], ['Environment', 'Environment', ['Environment /']], ['HR', 'Human Resources', ['Human Resources']], ['H&S', 'Health & Safety', ['HSE / OHS']], ['Procurement', 'Procurement & Value Chain', ['Procurement']], ['Customer', 'Customer & Product', ['Product Development', 'Sales, Marketing']], ['Legal', 'Legal & Ethics', ['Legal, Compliance', 'IT & Cyber']], ['Finance', 'Finance, Tax & Strategy', ['Finance, Treasury', 'الضرائب Tax', 'Strategy /']], ['Governance', 'Governance & Community', ['Board /', 'Communications']]];
    /* X-PLAN cycle assignments — generated from defaults at cycle start, then GOVERNED; the grid reads THIS, never the master default */
    D.xplan = KPIM.map(k => {
      const v = DG_VIEWS.find(x => x[2].some(tok => k.dep.includes(tok)));
      return { kpi: k.id, cycle: 'ACME-FY2025', deptView: v ? v[0] : 'Governance', site: k.id === 'ENV-WAT-001' ? 'EG-QRY-01' : (k.id.startsWith('SOC') || k.id.startsWith('GOV') || k.id.startsWith('GEN')) ? 'GROUP' : 'EG-CEM-01', wave: 'W1', owner: k.own.slice(0, 24) }
    });
    /* governed reassignment example (audited): water KPIs collected by Energy view this cycle at the quarry — differs from master default */
    D.xplan.filter(x => x.kpi === 'ENV-WAT-001').forEach(x => { x.deptView = 'Energy'; x.reassigned = 'cycle assignment ≠ master default (Environment) — X-PLAN governs' });
    function dgRows(key) { return D.xplan.filter(x => x.cycle === 'ACME-FY2025' && x.deptView === key).map(x => ({ ...kpiById(x.kpi), _xp: x })) }
    let DG_SITE = 'EG-CEM-01'; function dgSite(v) { DG_SITE = v; render() }
    VIEWS['data/deptgrid'] = () => {
      const deps = DG_VIEWS.map(v => [v[0], v[1]]);
      const all = dgRows(DG_DEP); const rows = all; /* ALL rows — no cap (V13 closure 3a) */
      const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
      return pageHead(LANG === 'ar' ? 'شبكة جمع الإدارة' : 'Department Collection Grid', LANG === 'ar' ? 'وضع الجمع السريع: نفس DatapointRecord التي في مساحة الإفصاح — عرض Pivot لا قاعدة ثانية. الأشهر أعمدة عرض لا أعمدة تخزين.' : 'Fast-collection mode: the SAME DatapointRecords as the Disclosure Workspace — a pivot view, never a second database. Months are view columns, not storage columns.',
        `<select style="width:auto" onchange="dgDep(this.value)">${deps.map(([v, l]) => `<option value="${v}" ${DG_DEP === v ? 'selected' : ''}>${l}</option>`).join('')}</select>`, 'Data & Evidence › Department Grid') +
        `<div class="notice info" style="margin-bottom:10px"><b>${LANG === 'ar' ? 'قاعدة' : 'Rule'}:</b> ${LANG === 'ar' ? 'تعديل خلية ديسمبر هنا يحدث نفس السجل المفتوح في Disclosure Workspace — جرب ثم افتحها.' : 'Editing a December cell here updates the exact record open in the Disclosure Workspace — try it, then open the workspace.'} <a href="#/data/dwork">Workspace →</a></div>
 <div class="card"><div class="bd" style="padding:8px 14px;font-size:12px;color:var(--mut)">${all.length} ${LANG === 'ar' ? 'مؤشرًا في هذه الإدارة' : 'KPIs in this department view'} · ${LANG === 'ar' ? 'معروض' : 'showing'} ${rows.length} · ${LANG === 'ar' ? 'الصفوف من إسناد X-PLAN للدورة (لا من الإدارة الافتراضية في الـMaster)' : 'rows come from the CYCLE X-PLAN assignment — never from the KPI-Master default department'} ${pv('reuse', 'X-PLAN', '#/data/plan')} · ${LANG === 'ar' ? 'الموقع' : 'site'}: <select style="width:auto;padding:2px 6px;font-size:11px" onchange="dgSite(this.value)">${['EG-CEM-01', 'EG-QRY-01', 'SA-SOL-01'].map(x => `<option ${DG_SITE === x ? 'selected' : ''}>${x}</option>`).join('')}</select></div>
 ${rows.length ? '' : `<div class="bd"><div style="border:1.5px dashed var(--line);border-radius:9px;padding:22px;text-align:center;color:var(--mut)">${LANG === 'ar' ? 'لا مؤشرات مسندة لهذه الإدارة في الدورة الحالية' : 'No KPIs assigned to this department in the current cycle'}</div></div>`}
 <div style="overflow-x:auto"><table class="tbl" style="font-size:11.5px"><thead><tr><th style="min-width:170px">KPI</th><th>Unit</th>${months.map(m => `<th>${m}</th>`).join('')}<th>FY ⚙</th><th>PY</th><th>Target 🔗</th><th>${t('status')} ⚙</th><th>Evid</th><th>Q</th></tr></thead><tbody>
 ${rows.map(k => {
          const site = (k._xp && k._xp.site) || DG_SITE; const recs = months.map(m => dprGet(k.id, site, '2025-' + m)); const have = recs.filter(Boolean);
          const fy = (() => { if (!have.length) return null; if (k.agg === 'CALCULATED') return 'ƒx'; return aggregateKpi(k, have) })();
          const tg = D.targets.find(x => x.kpi === k.id);
          return `<tr><td><b data-noar>${k.id}</b><div style="font-size:10.5px">${esc(k.en.slice(0, 34))}</div></td><td data-noar>${esc(k.u)}</td>
  ${months.map(m => { const r = dprGet(k.id, site, '2025-' + m); const ro = ['ASSUR', 'EXEC'].includes(ROLE); return `<td>${r ? (ro ? `<span title="read-only for this role (SoD)">${r.v.toLocaleString()}</span>` : `<input style="width:64px;padding:2px 4px;font-size:11px;${r.st === 'returned' ? 'border-color:var(--warnBd);background:var(--warnBg)' : ''}" value="${r.v.toLocaleString()}" onchange="dprSet('${k.id}','${site}','2025-${m}',this.value);render()" title="${r.rec || ''} · site ${site} — same record as workspace">`) : '<span style="color:var(--line)">·</span>'}</td>` }).join('')}
  <td><b>${fy == null ? '—' : fy === 'ƒx' ? 'ƒx' : fy === 0 ? '0' : fy.toLocaleString()}</b>${fy === 0 ? ` <span class="pv der" title="TRUE ZERO — explicitly entered; never conflated with Missing">0 ✓</span>` : ''}<div style="font-size:9.5px;color:var(--mut)" title="Aggregation Method from the KPI definition — never guessed">${k.agg === 'SUM' ? 'Σ' : k.agg === 'AVERAGE' ? 'avg ⚙' : k.agg === 'END_OF_PERIOD' ? 'EOP ⚙' : k.agg === 'CALCULATED' ? 'via run' : '—'}</div></td><td title="prior-year approved fact (ADV FY2024) — derived ⚙, never typed">${(a => a ? a.v.toLocaleString() + ' ⚙' : '—')(advGet(k.id, 'FY2024'))}</td><td>${tg ? tg.tv + ' ' + tg.unit : '—'}</td><td>${have.length === 0 ? st('draft', 'Not started') : st(recs.some(r => r && r.st === 'returned') ? 'returned' : 'progress', recs.some(r => r && r.st === 'returned') ? 'Returned' : (have.length === 12 ? 'Complete — awaiting approval' : 'In progress'))}</td><td>${k.id === 'ENV-GHG-003' ? '<b style="color:var(--err)">0/1</b>' : '—'}</td><td>${(a => a ? a.q : '—')(advGet(k.id, 'FY2025'))}</td></tr>`
        }).join('')}
 </tbody></table></div>
 <div class="bd" style="font-size:11.5px;color:var(--mut)">${LANG === 'ar' ? 'الأعمدة الممتدة (المصدر، طريقة الجمع، المُعد/المراجع/المعتمد، آخر تحديث) تظهر من زر الأعمدة — كل واحدة مرجع هوية وحدث سير عمل، لا نص حر.' : 'Extended columns (source, collection method, preparer/reviewer/approver, last updated) toggle on — each is an identity reference and a workflow event, never free text.'}</div></div>`
    };
    /* ---- ESG Fact Book ---- */
    let FB_T = 'GHG Emissions'; function fbSel(t) { FB_T = t; render() }
    VIEWS['data/factbook'] = () => {
      const tp = CANON.flatMap(g => g.topics).find(x => x.t === FB_T) || CANON[0].topics[0];
      return pageHead('ESG Fact Book', LANG === 'ar' ? 'واجهة الاستهلاك المضبوطة للحقائق المعتمدة — لا يملك أي قيمة: يقرأ Approved DatapointVersions فقط.' : 'The controlled consumption view of approved ESG facts — owns no values: reads approved DatapointVersions only.',
        `<select style="width:auto" onchange="toast('Filter applied (entity/site/period/status/quality/assurance)')"><option>Group · FY2025</option><option>EG-CEM-01</option><option>SA-SOL-01</option></select>`, 'Data & Evidence › Fact Book') +
        `<div class="wb">${canonTree(FB_T, 'fbSel')}<div>
 <div class="card" style="margin:0"><div class="hd">${esc(tp.t)} <span class="sub">${LANG === 'ar' ? 'قيم معتمدة فقط — انقر أي رقم لفتح مصدره' : 'approved values only — click any number to open its source'}</span></div>
 <table class="tbl"><thead><tr><th>Metric</th><th>Unit</th><th>FY2023</th><th>FY2024</th><th>FY2025</th><th>Target 🔗</th><th>${t('status')}</th><th>Quality</th><th>Assurance</th></tr></thead><tbody>
 ${tp.kpis.map(k => {
          const f = factOf(k.id); if (!f) return `<tr><td><b data-noar>${k.id}</b><div style="font-size:11px">${esc(k.en.slice(0, 40))}</div></td><td data-noar>${esc(k.u)}</td><td colspan=3 style="color:var(--mut)">— ${LANG === 'ar' ? 'لم يُعتمد بعد' : 'not yet approved'}</td><td>—</td><td>${st('progress', 'Collecting')}</td><td>—</td><td>—</td></tr>`;
          const tg = D.targets.find(x => x.kpi === k.id); const stale = f.stale; return `<tr><td><b data-noar>${k.id}</b><div style="font-size:11px">${esc(k.en.slice(0, 40))}</div></td><td data-noar>${esc(k.u)}</td><td>${f.fy23}</td><td>${f.fy24}</td><td><a onclick="factDrill('${k.id}')"><b>${f.fy25}</b></a>${stale ? ' <span class="pv der" title="Source record re-approved after the last report render — consumers show Stale until re-render">⚠ stale</span>' : ''}</td><td>${tg ? tg.tv : '—'}</td><td>${st('approved', 'Approved')}</td><td>${f.q}</td><td>${f.asr}</td></tr>`
        }).join('')}
 </tbody></table></div>
 <div class="notice info" style="margin-top:10px"><b>${LANG === 'ar' ? 'قاعدة' : 'Rule'}:</b> Fact Book ${LANG === 'ar' ? 'لا يُدخل فيه رقم يدويًا أبدًا — القيم المحسوبة تظهر ƒx والنطاق الثاني المزدوج لا يُجمع' : 'never accepts a typed number — calculated values render ƒx; dual Scope-2 rows never sum'}.</div></div></div>`
    };
    function factDrill(id) {
      const f = factOf(id), k = kpiById(id); drawer(id + ' — ' + (k ? k.en : ''), `<div class="kv">
 <dt>Approved value (FY2025)</dt><dd><b>${f.fy25}</b> ${k ? k.u : ''} · version v3</dd>
 <dt>Source record</dt><dd><a href="#/data/dwork" onclick="closeDrawer()">${f.rec}</a> — ${LANG === 'ar' ? 'نفس السجل في كل الواجهات' : 'the same record on every surface'}</dd>
 <dt>Evidence</dt><dd>📎 EV-0021 · 📎 meter photo — SHA-256 verified</dd>
 <dt>Calculation</dt><dd>${f.rec.startsWith('RUN') ? f.rec + ' · Calc Card + frozen factors ƒx' : '— direct measure'}</dd>
 <dt>Validation</dt><dd>VR suite PASS at approval</dd>
 <dt>Review & approval</dt><dd>Dept (M. Adel) → Technical (O. Farid) → approved 12 Feb${id === 'ENV-GHG-003' ? ` · <a onclick="advApprove('ENV-GHG-003','FY2025')">Re-approve from period records →</a>` : ''}</dd>
 <dt>Report uses</dt><dd style="font-weight:400">§5.1 table row · narrative token ×2 · Content Index 305 row · dashboard tile</dd>
 <dt>Assurance</dt><dd>${f.asr === '—' ? 'Out of scope' : 'In scope — ' + f.asr} (per-datapoint flag ⚙)</dd></div>`)
    }
    /* ---- Targets & Goals ---- */
    VIEWS['data/targets'] = () => pageHead(LANG === 'ar' ? 'الأهداف والالتزامات' : 'Targets & Goals', LANG === 'ar' ? 'الهدف كائن حاكم من الدرجة الأولى — التقدم والمسار محسوبان من الحقائق المعتمدة، لا يُكتبان.' : 'Targets are first-class governed objects — progress and on-track state derive from approved facts, never typed.',
      `<button class="btn" onclick="drawer('＋ Target',tgtForm())">＋ ${t('add')}</button>`, 'Data & Evidence › Targets & Goals') +
      `<div class="tiles">${tile(D.targets.length, 'Targets')}${tile(D.targets.filter(x => x.st === 'Approved').length, 'Approved', 'ok')}${tile(D.targets.filter(x => { const p = tgtProgress(x); return p && !p.on }).length, 'Off track', 'warn')}${tile(1, 'Draft', 'warn')}</div>
 <div class="card"><table class="tbl"><thead><tr><th>ID</th><th>Target</th><th>KPI 🔗</th><th>Baseline</th><th>Target</th><th>Current ⚙</th><th>Progress ⚙</th><th>On track ⚙</th><th>${t('status')}</th><th></th></tr></thead><tbody>
 ${D.targets.map(x => { const pr = tgtProgress(x); return `<tr><td><b data-noar>${x.id}</b></td><td style="min-width:200px">${esc(x.stmt)}<div style="font-size:11px;color:var(--mut)">${x.topic} · ${x.type} · ${x.scope}</div></td><td data-noar>${x.kpi}</td><td>${x.bv} <span style="color:var(--mut)">(${x.by})</span></td><td>${x.tv} ${esc(x.unit)} <span style="color:var(--mut)">(${x.ty})</span></td><td>${pr ? pr.cur : '—'}</td><td>${pr ? `<div class="hbar" style="width:90px"><div style="width:${pr.p}%"></div></div> ${pr.p}% <span style="font-size:10px;color:var(--mut)" title="expected AS-OF 2025 per ${pr.method}">exp ${pr.exp}</span>` : '—'}</td><td>${pr ? (pr.rag === 'NOT_EVALUATED' ? `<span class="st pending" title="Methodology approval pending (MD-02) — no Green/Amber/Red is issued before countersign">NOT_EVALUATED</span><div style="font-size:9px;color:var(--mut)">Methodology approval pending</div>` : `<span class="st ${pr.rag === 'GREEN' ? 'approved' : pr.rag === 'AMBER' ? 'review' : 'blocked'}" title="As-of ${pr.asOf} · expected ${pr.exp} · variance ${pr.var} · ${pr.methVer}">${pr.rag}</span>`) : '—'}</td><td>${st(x.st === 'Approved' ? 'approved' : 'draft', x.st)}</td><td class="rowActs"><a onclick="drawer('${x.id}',tgtForm('${x.id}'))">${t('open')}</a></td></tr>` }).join('')}
 </tbody></table></div>
 <div class="notice info">${LANG === 'ar' ? 'تغذي الأهداف: لوحة الأداء، بلوك 3-3 (الأهداف d)، سرد التقرير وجداوله — وتصحيح المسار حقل إلزامي عند Off-track.' : 'Targets feed: Performance Dashboard, topic 3-3 target block, report narrative & tables — corrective action becomes mandatory when off track.'}</div>`;
    function tgtForm(id) {
      const x = D.targets.find(v => v.id === id) || {}; return `<div class="formGrid">
 ${sect('Target', 'الهدف', 'governed object')}
 ${field({ label: 'Target ID', value: x.id || 'TGT-06 — on save', ro: 1 })}
 ${field({ label: 'Material topic', req: 1, type: 'select', opts: D.topics.map(t0 => t0.id + ' ' + t0.n).concat(['— non-material (management target) —']), value: x.topic, help: 'Governed set only — fkCheck() blocks anything else.' })}
 ${field({ label: 'KPI', req: 1, type: 'select', opts: KPIM.filter(k => k.db).slice(0, 20).map(k => k.id + ' · ' + k.en.slice(0, 30)), value: x.kpi, help: 'From the KPI Master — the same id everywhere.' })}
 ${field({ label: 'Target statement', req: 1, type: 'area', value: x.stmt || '', full: 1 })}
 ${field({ label: 'Target type', req: 1, type: 'select', opts: ['Absolute reduction', 'Intensity reduction', 'Share increase', 'Rate reduction', 'Zero-event'], value: x.type })}
 ${sect('Trajectory', 'المسار', '')}
 ${field({ label: 'Baseline year / value', value: (x.by || '') + ' · ' + (x.bv || ''), req: 1 })}
 ${field({ label: 'Target year / value', value: (x.ty || '') + ' · ' + (x.tv || ''), req: 1 })}
 ${field({ label: 'Unit', value: x.unit || '', ro: 1, help: 'From the KPI definition — never retyped.' })}
 ${field({ label: 'Scope / coverage', value: x.scope || '', req: 1 })}
 ${sect('Derived — never typed', 'مشتق', '')}
 ${field({ label: 'Current value', value: (tgtProgress(x) || {}).cur ?? '—', pv: { k: 'der', t: 'Fact Book', l: '#/data/factbook' } })}
 ${field({ label: 'Trajectory method / tolerance / As-of', value: (x.method || 'Linear') + ' · tol=' + (x.tolPct ?? METH.tolPct ?? '— ungoverned (blocks RAG)') + ' · as-of ' + D.cycle.perfAsOf + ' · ' + METH.ragMethodVersion, ro: 1 })}
 ${field({ label: 'Expected AS-OF 2025 / Progress / RAG', value: (() => { const p = tgtProgress(x); return p ? p.exp + ' · ' + p.p + '% · ' + p.rag + ' (var ' + p.var + ')' : '—' })(), pv: { k: 'calc', t: 'ƒx MD-02' } })}
 ${sect('Governance', 'الحوكمة', '')}
 ${field({ label: 'Owner', req: 1, value: x.own || '' })}
 ${field({ label: 'Approver + approval evidence', value: (x.appr || '—') + ' · ' + (x.ev || '—'), ro: 1 })}
 ${field({ label: 'Corrective action', type: 'area', value: x.ca || '', full: 1, help: 'Mandatory when off track.' })}
 ${field({ label: 'Status / version', value: (x.st || 'Draft') + ' · ' + (x.ver || 'v1'), ro: 1 })}
</div>`}
    /* ---- ESG Performance Dashboard ---- */
    VIEWS['home/perf'] = () => {
      const row = (id) => {
        const k = kpiById(id), f = factOf(id); if (!f) return ''; const tg = D.targets.find(x => x.kpi === id); const varr = f.fy24 ? Math.round(1000 * (f.fy25 - f.fy24) / f.fy24) / 10 : null;
        const good = k.dir && k.dir.startsWith('Lower') ? (varr <= 0) : (varr >= 0);
        return `<tr><td><b data-noar>${id}</b><div style="font-size:11px">${esc(k.en.slice(0, 36))}</div></td><td data-noar>${esc(k.u)}</td><td><a onclick="factDrill('${id}')"><b>${f.fy25}</b></a></td><td>${f.fy24}</td><td>${tg ? tg.tv : '—'}</td><td style="color:${good ? 'var(--ok)' : 'var(--err)'}">${varr > 0 ? '+' : ''}${varr}%</td><td>${(() => { if (!tg) return '<span class="st pending">—</span>'; const p = tgtProgress(tg); if (!p) return '—'; return p.rag === 'NOT_EVALUATED' ? '<span class="st pending" title="Methodology approval pending — MD-02">NOT_EVALUATED</span>' : `<span class="st ${p.rag === 'GREEN' ? 'approved' : p.rag === 'AMBER' ? 'review' : 'blocked'}">${p.rag}</span>` })()}</td><td><span style="font-family:monospace;letter-spacing:1px;color:var(--acc)" data-noar>${f.fy23 > f.fy25 ? '▄▃▂' : '▂▃▄'}</span></td></tr>`
      };
      return pageHead(LANG === 'ar' ? 'لوحة أداء الاستدامة' : 'ESG Performance Dashboard', LANG === 'ar' ? 'تجيب: كيف أداء المنظمة؟ (لوحتا الجاهزية والامتثال تجيبان: هل التقرير جاهز؟) كل قيمة من Fact Book + الأهداف — لا إدخال يدوي.' : 'Answers: how is the ORGANIZATION performing? (Readiness & Compliance answer: is the report ready?) Every value reads Fact Book + Targets — nothing typed.',
        `<span class="st approved">⚙ ${LANG === 'ar' ? 'محسوبة بالكامل' : 'fully derived'}</span>`, 'Home › ESG Performance') +
        `${(() => {
          const d = (id) => { const f = factOf(id); if (!f || !f.fy24) return '—'; const v = Math.round(1000 * (f.fy25 - f.fy24) / f.fy24) / 10; return (v > 0 ? '+' : '') + v + '%' };
          const g1 = factOf('ENV-GHG-001'), ren = factOf('ENV-ENE-004'), tr = factOf('SOC-OHS-002'), fat = factOf('SOC-OHS-001');
          return `<div class="tiles">${tile(d('ENV-GHG-001'), 'Scope 1 vs PY ⚙', g1 && g1.fy25 < g1.fy24 ? 'ok' : 'warn', 'data/factbook')}${tile(d('ENV-GHG-003'), 'Scope 2 LB vs PY ⚙', 'ok')}${tile(ren ? ren.fy25 + '%' : '—', 'Renewable electricity ⚙', 'ok')}${tile(tr ? tr.fy25 : '—', 'TRIR (target ' + (D.targets.find(t => t.kpi === 'SOC-OHS-002') || {}).tv + ') ⚙', tr && tr.fy25 > 1.2 ? 'warn' : 'ok')}${tile(fat ? fat.fy25 : '—', 'Fatalities ⚙', fat && fat.fy25 === 0 ? 'ok' : 'err')}</div>`
        })()}` + `
 ${[['Environmental', ['ENV-GHG-001', 'ENV-GHG-003', 'ENV-GHG-004', 'ENV-ENE-001', 'ENV-ENE-004', 'ENV-WAT-001', 'ENV-WST-001']], ['Social', ['SOC-OHS-001', 'SOC-OHS-002', 'SOC-EMP-001', 'SOC-DIV-001', 'SOC-TRN-001']], ['Governance / Economic', ['GOV-ETH-001', 'GOV-ECO-001']]].map(([g, ids]) => `
 <div class="card"><div class="hd">${g}</div><table class="tbl"><thead><tr><th>KPI</th><th>Unit</th><th>FY2025</th><th>PY</th><th>Target 🔗</th><th>Δ vs PY ⚙</th><th>RAG ⚙</th><th>Trend</th></tr></thead><tbody>${ids.map(row).join('')}</tbody></table></div>`).join('')}
 <div class="notice info"><b>Drill:</b> Dashboard → Fact Book → DatapointRecord → Source / Evidence — ${LANG === 'ar' ? 'كل رسم يفتح مصدره' : 'every chart opens its source'}.</div>`
    };
    /* ---- Framework Explorer & Crosswalk ---- */
    let FX_Q = 'emissions'; function fxQ(v) { FX_Q = v.toLowerCase(); render() }
    VIEWS['adm/fwx'] = () => {
      const hits = KPIM.filter(k => (k.en + ' ' + k.g + ' ' + k.fw).toLowerCase().includes(FX_Q));
      const fams = [['GRI', k => k.g], ['ESRS', k => (k.fw.match(/ESRS [A-Z]\d[-\d]*/) || [])[0]], ['IFRS S2', k => k.fw.includes('IFRS') ? 'IFRS S2' : null], ['GHG Protocol', k => k.fw.includes('GHG Protocol') ? 'GHG Protocol' : null], ['CDP', k => k.fw.includes('CDP') ? 'CDP' : null], ['SDG', k => (k.fw.match(/SDG ?\d+[\.\d]*/) || [])[0]]];
      return pageHead(LANG === 'ar' ? 'مستكشف الأطر والمطابقة' : 'Framework Explorer & Crosswalk', LANG === 'ar' ? 'محرك مرجعي: التقط مرة → أفصح لأطر عديدة. المطابقة ليست انطباقًا — محرك الانطباق يبقى صاحب القرار.' : 'Reference engine: capture once → disclose to many frameworks. Mapping is NOT applicability — the Applicability Engine stays authoritative.',
        '', 'Administration › Framework Explorer') +
        `<div class="card"><div class="bd" style="display:flex;gap:10px;padding:12px 14px"><input style="flex:1" value="${esc(FX_Q)}" oninput="fxQ(this.value)" placeholder="emissions / water / diversity…"><span style="align-self:center;font-size:12px;color:var(--mut)">${hits.length} KPIs matched</span></div></div>
 ${fams.map(([fam, fn]) => {
          const rows = hits.map(k => ({ k, ref: fn(k) })).filter(x => x.ref); if (!rows.length) return '';
          return `<div class="card"><div class="hd">${fam} <span class="sub">${rows.length} mapped</span></div><table class="tbl"><tbody>
  ${rows.slice(0, 6).map(({ k, ref }) => `<tr><td style="font-size:12px" data-noar><b>${esc(String(ref).split('—')[0])}</b></td><td style="font-size:12px">${esc(k.en.slice(0, 50))}</td><td class="rowActs"><a onclick="drawer('${k.id}',kpiDetail('${k.id}'))">${LANG === 'ar' ? 'المؤشرات المرتبطة' : 'Show mapped KPI'}</a></td></tr>`).join('')}
  </tbody></table></div>`}).join('')}
 <div class="notice warn"><b>${LANG === 'ar' ? 'قاعدة' : 'Rule'}:</b> ${LANG === 'ar' ? 'لا يقرر هذا المستكشف انطباق أي متطلب — القرار في B-10 وحده.' : 'This explorer never decides applicability of any requirement — that decision lives in B-10 alone.'}</div>`
    };
    /* ---- ESG Risks & Opportunities ---- */
    VIEWS['mat/risk'] = () => pageHead(LANG === 'ar' ? 'مخاطر وفرص الاستدامة' : 'ESG Risks & Opportunities', LANG === 'ar' ? 'الخطر ≠ التأثير: التأثير كيف تؤثر المنظمة على الناس والبيئة (GRI)؛ الخطر كيف تؤثر قضية ESG على المنظمة. درجات الخطر لا تدخل حساب جوهرية التأثير أبدًا.' : 'Risk ≠ Impact: impact is how the organization affects people/environment (GRI); risk is how an ESG issue affects the organization. Risk scores never feed impact-significance.',
      `<button class="btn" onclick="drawer('＋ Risk',riskForm())">＋ ${t('add')}</button>`, 'Materiality & Management › ESG Risks') +
      `<div class="tiles">${tile(D.risks.length, 'Risks & opportunities')}${tile(D.risks.filter(r => r.rl * r.ri >= 12).length, 'High residual', 'err')}${tile(D.risks.filter(r => r.st.includes('Opportunity')).length, 'Opportunities', 'ok')}${tile(4, 'Linked topics')}</div>
 <div class="card"><table class="tbl"><thead><tr><th>ID</th><th>Risk / Opportunity</th><th>Topic 🔗</th><th>KPIs 🔗</th><th>Inherent</th><th>Controls</th><th>Residual ⚙</th><th>${t('due')}</th><th>${t('status')}</th></tr></thead><tbody>
 ${D.risks.map(r => `<tr><td><b data-noar>${r.id}</b></td><td style="min-width:200px">${esc(r.n)}<div style="font-size:11px;color:var(--mut)">${esc(r.drv)}</div></td><td data-noar>${r.topic}</td><td style="font-size:11px" data-noar>${r.kpis}</td><td><span class="st ${r.il * r.ii >= 16 ? 'blocked' : 'pending'}">${r.il}×${r.ii}=${r.il * r.ii}</span></td><td style="font-size:11.5px">${esc(r.ctl.slice(0, 40))} · ${r.cown}</td><td><span class="st ${r.rl * r.ri >= 12 ? 'blocked' : 'approved'}">${r.rl}×${r.ri}=${r.rl * r.ri}</span></td><td>${r.due}</td><td>${st(r.st.includes('progress') ? 'progress' : r.st.includes('Opportunity') ? 'approved' : 'open', r.st)}</td></tr>`).join('')}
 </tbody></table></div>`;
    function riskForm() {
      return `<div class="formGrid">
 ${sect('Risk / Opportunity', 'الخطر', 'enterprise lens — not GRI impact')}
 ${field({ label: 'Risk ID', value: 'RSK-05 — on save', ro: 1 })}
 ${field({ label: 'Pillar', req: 1, type: 'select', opts: ['E', 'S', 'G'] })}
 ${field({ label: 'Material topic link', type: 'select', opts: ['MT-01', 'MT-03', 'MT-04', '— none —'], help: 'A link, never a score transfer.' })}
 ${field({ label: 'Risk / opportunity statement', req: 1, type: 'area', full: 1 })}
 ${field({ label: 'Driver', req: 1, type: 'select', opts: ['Regulatory', 'Physical climate', 'Market', 'Reputation', 'Operational', 'Financing'] })}
 ${field({ label: 'Linked KPIs', type: 'select', opts: KPIM.filter(k => k.db).slice(0, 15).map(k => k.id), help: 'M:N — same KPI ids as the Master.' })}
 ${sect('Inherent', 'المتأصل', '1–5 × 1–5')}
 ${field({ label: 'Likelihood', req: 1, type: 'select', opts: ['1', '2', '3', '4', '5'] })}
 ${field({ label: 'Impact on the organization', req: 1, type: 'select', opts: ['1', '2', '3', '4', '5'] })}
 ${sect('Controls & residual', 'الضوابط', 'residual score derives')}
 ${field({ label: 'Controls', req: 1, type: 'area', full: 1 })}
 ${field({ label: 'Control owner', req: 1, value: '' })}
 ${field({ label: 'Residual likelihood', req: 1, type: 'select', opts: ['1', '2', '3', '4', '5'] })}
 ${field({ label: 'Residual impact', req: 1, type: 'select', opts: ['1', '2', '3', '4', '5'] })}
 ${field({ label: 'Residual score', value: 'L × I — computed on save', pv: { k: 'calc', t: 'ƒx' }, help: 'Never typed.' })}
 ${field({ label: 'Target date / review date', type: 'date', value: '' })}
 <div class="full"><label style="font-weight:600;font-size:12px">Evidence</label><div style="border:1.5px dashed var(--line);border-radius:9px;padding:12px;text-align:center;color:var(--mut)">📎 <a onclick="toast('Evidence object')">Attach assessment basis</a></div></div>
 <div class="full notice warn" style="margin:0">${LANG === 'ar' ? 'درجة الخطر لا تُغذي جوهرية GRI ولا تحجب النشر.' : 'Risk scores never feed GRI impact-significance and never block publication.'}</div></div>`
    }
    /* ---- Derived Reporting RACI ---- */
    VIEWS['adm/raci'] = () => pageHead('Reporting RACI', LANG === 'ar' ? 'مشتقة من RBAC وخطة الجمع وإسناد المراجعة والحوكمة والتأكيد — لا كون إسناد ثانٍ يدويًا؛ الاستثناءات محكومة فقط.' : 'Derived from RBAC + Collection Plan + review + governance + assurance assignments — never a second manual assignment universe; governed exceptions only.',
      `<span class="st approved">⚙ ${LANG === 'ar' ? 'مشتقة' : 'derived'}</span>`, 'Administration › Reporting RACI') +
      `<div class="card"><table class="tbl"><thead><tr><th>${LANG === 'ar' ? 'النشاط' : 'Activity'}</th><th>PM</th><th>Data Owner</th><th>Contributor</th><th>Dept Rev</th><th>Tech Rev</th><th>Exec</th><th>VVB</th><th>${LANG === 'ar' ? 'المصدر' : 'Derived from'}</th></tr></thead><tbody>
 ${[['Scope & boundary', 'A', 'C', '—', '—', 'R', 'A', '—', 'B-07 approvals'], ['Materiality', 'A', 'C', 'C', '—', 'R', 'A', '—', 'C-12 workflow'], ['KPI architecture', 'C', '—', '—', '—', 'A/R', '—', '—', 'KPI Master versions'], ['Data collection', 'A', 'A', 'R', 'C', '—', '—', '—', 'X-PLAN assignments'], ['Validation', '—', 'C', 'R', '—', 'A', '—', '—', 'Validation runs'], ['Review', '—', '—', '—', 'R', 'A', '—', '—', 'Review assignments'], ['Report', 'A/R', '—', '—', '—', 'C', 'A', '—', 'Report project roles'], ['Assurance', 'C', 'C', '—', '—', 'C', '—', 'R', 'Engagement (SOD-04/06)']].map(r => `<tr><td style="font-weight:600">${r[0]}</td>${r.slice(1, 8).map(c => `<td style="text-align:center">${c}</td>`).join('')}<td style="font-size:11px;color:var(--mut)">⚙ ${r[8]}</td></tr>`).join('')}
 </tbody></table><div class="bd"><button class="btn sec" onclick="toast('Governed exception drawer — reason + approver + audit')">${LANG === 'ar' ? 'استثناء محكوم' : 'Governed exception'}</button></div></div>`;
    /* ---- Maturity (optional) ---- */
    VIEWS['adm/maturity'] = () => pageHead(LANG === 'ar' ? 'تقييم نضج الاستدامة (اختياري)' : 'ESG Maturity (optional)', LANG === 'ar' ? 'أداة إدارية للتحسين فقط — لا تحجب النشر ولا تمس محرك الادعاء أو الجوهرية أو البيانات المعتمدة.' : 'A management improvement tool only — never blocks publication, never touches the Claim Engine, Materiality or approved data.',
      `<span class="st pending">${LANG === 'ar' ? 'اختياري' : 'OPTIONAL'}</span>`, 'Administration › Maturity') +
      `<div class="card"><table class="tbl"><thead><tr><th>${LANG === 'ar' ? 'البُعد' : 'Dimension'}</th><th>1 Beginner</th><th>2 Developing</th><th>3 Advanced</th><th>4 Leading</th><th>${LANG === 'ar' ? 'الحالي' : 'Current'}</th><th>${LANG === 'ar' ? 'المستهدف' : 'Target'}</th></tr></thead><tbody>
 ${[['Governance & oversight', 3, 4], ['Materiality & stakeholders', 3, 4], ['Strategy & targets', 2, 3], ['Data & systems', 3, 4], ['Climate & environment', 2, 3], ['Social & human rights', 2, 3], ['Value chain', 2, 3], ['Reporting & assurance', 3, 4]].map(([d, c, g]) => `<tr><td style="font-weight:600">${d}</td>${[1, 2, 3, 4].map(i => `<td style="text-align:center">${i === c ? '●' : '·'}</td>`).join('')}<td><b>${c}</b></td><td>${g}</td></tr>`).join('')}
 </tbody></table></div>`;


    /* ════════════ 13 · ESG DATA COLLECTION — E/S/G topic screens ════════════
       One declarative spec per guide topic; ONE renderer for all of them, so the 33
       screens stay identical to each other and to every other module screen.
       Nothing here owns a fact: metric definitions are read from KPIM, approved values
       through factOf(), and anything already owned by another screen is a pv('reuse',…)
       link-out — never a second table. */

    const EC_PILL = {
      E: { en: 'Environmental', ar: 'البيئية', ic: '🌍' },
      S: { en: 'Social', ar: 'الاجتماعية', ic: '👥' },
      G: { en: 'Governance', ar: 'الحوكمة', ic: '🏛' }
    };

    /* every collected datapoint opens with the same scope block (guide §2) … */
    const EC_FORM_HEAD = [
      { s: ['Scope & period', 'النطاق والفترة', 'the cross-module keys — never re-typed downstream'] },
      { label: 'Reporting period', req: 1, type: 'select', opts: ['2025-01', '2025-06', '2025-09', '2025-12', 'FY2025'], value: '2025-12', help: 'Must fall inside the open cycle — VR-PER-001.' },
      { label: 'Legal entity', req: 1, type: 'select', opts: ['LE-01 Acme Sustainable Industries Holding', 'LE-02 Acme Energy KSA Ltd', 'LE-03 Acme Materials Egypt SAE', 'LE-04 Acme Logistics UAE FZE'], value: 'LE-03 Acme Materials Egypt SAE' },
      { label: 'Site / location', req: 1, type: 'select', opts: ['SA-SOL-01 Sudair Solar Plant', 'SA-WND-01 Dumat Al Jandal Wind Farm', 'EG-CEM-01 10th of Ramadan Cement Works', 'EG-QRY-01 Suez Aggregates Quarry', 'SA-DEP-01 Dammam Fuel Depot', 'ALL — organization level'], value: 'EG-CEM-01 10th of Ramadan Cement Works', help: 'Read and written on the same X-PLAN site.' }
    ];
    /* … and closes with the same evidence / quality / ownership block (guide §2, §7, §8) */
    const EC_FORM_TAIL = [
      { s: ['Source & methodology', 'المصدر والمنهجية', 'guide §2 — every datapoint carries its own provenance'] },
      { label: 'Source', req: 1, type: 'select', opts: ['Utility invoice', 'Meter reading', 'ERP extract', 'Supplier statement', 'HR system', 'Register / logbook', 'Laboratory report', 'Survey', 'Third-party report'], value: 'Utility invoice' },
      { label: 'Methodology', type: 'select', opts: ['Direct measurement', 'Invoice reconciliation', 'Meter + invoice reconciliation', 'Mass balance', 'Supplier-specific data', 'Documented estimate'], value: 'Meter + invoice reconciliation' },
      { label: 'Estimated value?', req: 1, type: 'select', opts: ['No — measured', 'Yes — estimated'], value: 'No — measured', help: 'Missing is never silently replaced by an estimate — guide §8.' },
      { label: 'Estimation method / basis', type: 'area', full: 1, ph: 'Required when the value is estimated', help: 'Required iff estimated; recorded on the record and visible to review and assurance.' },
      { s: ['Evidence', 'الدليل', 'guide §7 — evidence is an object, not a note'] },
      { label: 'Supporting evidence', req: 1, type: 'select', opts: ['EV-0021 · Electricity invoice Dec-2025', 'EV-0022 · Meter log Dec-2025', 'EV-0023 · Fuel purchase register', 'EV-0025 · HSE register extract', 'EV-0027 · Assurance engagement letter', '＋ Upload…'], help: 'Picker only — the Evidence Library owns the object, its hash and its retention.' },
      { label: 'Evidence type', type: 'select', opts: ['Invoice', 'Meter reading', 'Report', 'Register extract', 'Policy', 'Contract', 'Audit record', 'Certificate', 'Laboratory result'], value: 'Invoice' },
      { s: ['Ownership & quality', 'الملكية والجودة', 'guide §5.9 — assignment comes from X-PLAN, never from the KPI default department'] },
      { label: 'Data owner', req: 1, type: 'select', opts: ['S. Tawfik · Utilities', 'R. Barakat · Environment', 'K. Mansour · HR', 'A. Qassem · HSE', 'N. Fouad · CSR', 'Y. Gaber · Legal & Compliance'], help: 'Read from the current cycle assignment (X-PLAN).' },
      { label: 'Reviewer', req: 1, type: 'select', opts: ['M. Adel · Department Reviewer', 'O. Farid · ESG Technical Reviewer', 'H. Aly · Department Reviewer'], help: 'SoD — the reviewer can never be the contributor.' },
      { label: 'Data quality', req: 1, type: 'select', opts: ['High — measured, reconciled', 'Medium — single source', 'Low — estimated'], value: 'High — measured, reconciled' },
      { label: 'Approval status', value: 'Draft — becomes Submitted on send for review', ro: 1, help: 'The 8-state workflow owns this; the form never types it.' },
      { label: 'Assumptions / notes', type: 'area', full: 1, ph: 'Any assumption a reviewer or assurer would need' }
    ];

    function ecTopic(key) { return EC_TOPICS.find(x => x.key === key) }
    function ecKpis(tp) { return tp.kpiIds ? tp.kpiIds.map(kpiById).filter(Boolean) : KPIM.filter(k => (tp.kpiT || []).includes(k.t)) }
    function ecRows(tp) { return (D.ecoll[tp.key] || []) }
    /* the KPI master keeps department as one bilingual string — show the half matching LANG */
    function ecDep(v) { const s0 = String(v), en = s0.replace(/[^\x00-\x7F]/g, '').trim(); return LANG === 'ar' ? (s0.replace(/[\x00-\x7F]/g, ' ').trim() || en) : en }
    /* the rail reads the same spec the screens do — one source of truth for the three dropdowns */
    function ecNav(p) { return EC_TOPICS.filter(x => x.p === p).map(x => ['data/' + x.key, x.ic, () => LANG === 'ar' ? x.ar : x.en]) }

    /* the shared drawer form: scope block + the topic's own fields + evidence/quality block */
    function ecForm(key) {
      const tp = ecTopic(key); if (!tp) return '—';
      const spec = EC_FORM_HEAD.concat(tp.form || [], EC_FORM_TAIL);
      return `<div class="formGrid">${spec.map(f => f.s ? sect(f.s[0], f.s[1], f.s[2]) : field(f)).join('')}</div>`
    }

    /* the shared screen — pageHead + tiles + reuse strip + metric register + collected records */
    function ecView(tp) {
      const P = EC_PILL[tp.p], kp = ecKpis(tp), rows = ecRows(tp);
      const approved = rows.filter(r => r[r.length - 1] === 'approved').length;
      const pending = rows.length - approved;
      const title = LANG === 'ar' ? tp.ar : tp.en;
      const crumb = LANG === 'ar' ? 'البيانات والأدلة › ' + P.ar + ' › ' + tp.ar : 'Data & Evidence › ' + P.en + ' › ' + tp.en;
      const reuse = (tp.reuse || []).map(r => pv('reuse', LANG === 'ar' ? r[1] : r[0], '#/' + r[2])).join(' ');
      const nCols = (tp.cols || []).length + 4;
      return pageHead(title, LANG === 'ar' ? tp.purpose.ar : tp.purpose.en,
        `<button class="btn sec" onclick="nav('data/plan')">🗺 ${t('plan')}</button><button class="btn" onclick="drawer('${t('add')} — ${esc(tp.en)}',ecForm('${tp.key}'))">＋ ${t('add')}</button>`, crumb) +
        `<div class="tiles">${tile(rows.length, LANG === 'ar' ? 'سجلات هذه الدورة' : 'Records this cycle')}${tile(approved, LANG === 'ar' ? 'معتمدة' : 'Approved', 'ok')}${tile(pending, LANG === 'ar' ? 'قيد الجمع/المراجعة' : 'In collection / review', pending ? 'warn' : 'ok')}${tile(kp.length, LANG === 'ar' ? 'مؤشرات في السجل' : 'Metrics in the register', '', 'data/kpimaster')}</div>
 ${reuse ? `<div class="notice info"><b>${LANG === 'ar' ? 'مملوك في شاشة أخرى — بلا تكرار' : 'Owned by another screen — not duplicated here'}:</b> ${reuse}</div>` : ''}
 <div class="card"><div class="hd">${LANG === 'ar' ? 'سجل المؤشرات' : 'Metric register'} <span class="sub">${LANG === 'ar' ? 'من سجل المؤشرات الرئيسي — التعريفات تُقرأ ولا تُكتب هنا' : 'from the KPI Master — definitions are read here, never written'}</span><div class="actions"><button class="btn sec" onclick="nav('data/kpimaster')">${LANG === 'ar' ? 'فتح السجل' : 'Open KPI Master'}</button></div></div>
 <table class="tbl"><thead><tr><th>KPI</th><th>${LANG === 'ar' ? 'المؤشر' : 'Metric'}</th><th>${LANG === 'ar' ? 'الوحدة' : 'Unit'}</th><th>${LANG === 'ar' ? 'النوع / التجميع' : 'Type / Agg'}</th><th>${LANG === 'ar' ? 'الدورية' : 'Collection'}</th><th>GRI</th><th>${LANG === 'ar' ? 'الإدارة' : 'Department'}</th><th>FY2025 ⚙</th></tr></thead><tbody>
 ${kp.map(k => { const f = factOf(k.id); return `<tr style="cursor:pointer" onclick="drawer('${k.id}',kpiDetail('${k.id}'))"><td><b data-noar>${k.id}</b></td><td>${esc(LANG === 'ar' ? k.ar : k.en)}<div style="font-size:11px;color:var(--mut)">${esc(k.t)}</div></td><td data-noar>${esc(k.u)}</td><td data-noar style="font-size:11.5px">${k.dt} / ${k.agg}</td><td>${k.coll}</td><td style="font-size:11.5px">${esc(String(k.g).split('—').pop().trim())}</td><td style="font-size:11.5px">${esc(ecDep(k.dep))}</td><td>${f && f.fy25 !== undefined && f.fy25 !== null ? `<b data-noar>${Number(f.fy25).toLocaleString()}</b>${f.stale ? ' ' + st('stale', 'stale') : ''}` : `<span style="color:var(--mut)">—</span>`}</td></tr>` }).join('') || `<tr><td colspan="8" style="text-align:center;color:var(--mut);padding:24px">${LANG === 'ar' ? 'لا مؤشر مسجّل لهذا الموضوع — يُجمع كسجلات خام' : 'No registered metric for this topic — collected as raw records only'}</td></tr>`}
 </tbody></table></div>
 <div class="card"><div class="hd">${LANG === 'ar' ? 'السجلات المجمّعة' : 'Collected records'} <span class="sub" data-noar>${esc(tp.en)} · ${D.cycle.code}</span></div>
 ${toolbar(`<select><option>${LANG === 'ar' ? 'كل المواقع' : 'All sites'}</option>${D.sites.map(s => `<option>${s.code}</option>`).join('')}</select>`)}
 <table class="tbl"><thead><tr>${(tp.cols || []).map(c => `<th>${esc(c)}</th>`).join('')}<th>${LANG === 'ar' ? 'الدليل' : 'Evidence'}</th><th>${LANG === 'ar' ? 'المالك' : 'Owner'}</th><th>${t('status')}</th><th></th></tr></thead><tbody>
 ${rows.map(r => { const cells = r.slice(0, r.length - 3), ev = r[r.length - 3], own = r[r.length - 2], stt = r[r.length - 1];
          return `<tr>${cells.map((c, ci) => `<td>${ci === 0 ? `<b data-noar>${esc(c)}</b>` : esc(c)}</td>`).join('')}<td><span class="ev" data-noar>📎 ${esc(ev)}</span></td><td>${esc(own)}</td><td>${st(stt, stt.charAt(0).toUpperCase() + stt.slice(1))}</td><td class="rowActs"><a onclick="drawer('${t('edit')} — ${esc(cells[0])}',ecForm('${tp.key}'))">${t('edit')}</a></td></tr>` }).join('') || `<tr><td colspan="${nCols}" style="text-align:center;color:var(--mut);padding:30px">✨ ${LANG === 'ar' ? 'لا سجلات بعد' : 'No records yet'}</td></tr>`}
 </tbody></table>${pager(rows.length)}</div>`
    }

    /* ── the 33 topic specs — one per section of the ESG/GRI Data Collection Guide ──
       kpiIds / kpiT select this topic's slice of the 113-KPI master (never a copy of it);
       reuse[] names the screen that already owns a neighbouring dataset;
       cols/rows are the collected raw records; form[] is the topic's own drawer block. */
    const EC_TOPICS = [
      /* ══ ENVIRONMENTAL — guide §3 ══ */
      {
        key: 'e-energy', p: 'E', ic: '⚡', en: 'Energy', ar: 'الطاقة',
        purpose: { en: 'Organization- and site-level energy consumption, intensity and reductions — guide §3.1. Electricity and fuels are collected on their own screens and roll up here.', ar: 'استهلاك الطاقة على مستوى المنظمة والمواقع وكثافتها وتخفيضاتها — دليل §3.1. الكهرباء والوقود يُجمعان في شاشتيهما ويُجمّعان هنا.' },
        kpiIds: ['ENV-ENE-001', 'ENV-ENE-007', 'ENV-ENE-008', 'ENV-ENE-009', 'ENV-ENE-010', 'ENV-ENE-011'],
        reuse: [['Energy reduction targets', 'أهداف خفض الطاقة', 'data/targets'], ['Conversion factors', 'معاملات التحويل', 'data/factors'], ['Electricity', 'الكهرباء', 'data/e-elec'], ['Fuels', 'الوقود', 'data/e-fuels']],
        cols: ['Record', 'Period', 'Site', 'Energy category', 'Quantity', 'Unit'],
        rows: [
          ['ENE-2025-001', '2025-12', 'EG-CEM-01', 'Total consumption within the organization', '48,210', 'MWh', 'EV-0021', 'S. Tawfik', 'approved'],
          ['ENE-2025-002', '2025-12', 'EG-QRY-01', 'Total consumption within the organization', '6,940', 'MWh', 'EV-0021', 'S. Tawfik', 'approved'],
          ['ENE-2025-003', '2025-12', 'SA-SOL-01', 'Self-generated renewable', '31,480', 'MWh', 'EV-0022', 'S. Tawfik', 'approved'],
          ['ENE-2025-004', '2025-12', 'SA-WND-01', 'Self-generated renewable', '24,760', 'MWh', 'EV-0022', 'S. Tawfik', 'approved'],
          ['ENE-2025-005', 'FY2025', 'ALL', 'Energy intensity (per tonne clinker)', '3.10', 'MWh/t', 'EV-0021', 'S. Tawfik', 'review'],
          ['ENE-2025-006', 'FY2025', 'EG-CEM-01', 'Reduction achieved vs FY2024', '1,820', 'MWh', 'EV-0021', 'R. Barakat', 'review'],
          ['ENE-2025-007', 'FY2025', 'ALL', 'Upstream & downstream energy', '9,410', 'MWh', 'EV-0023', 'S. Tawfik', 'submitted'],
          ['ENE-2025-008', '2025-09', 'SA-DEP-01', 'Total consumption (part-period, 9 months)', '410', 'MWh', 'EV-0021', 'F. Said', 'progress']
        ],
        form: [
          { s: ['Energy', 'الطاقة', 'GRI 302-1 / 302-3 / 302-4'] },
          { label: 'Energy category', gri: '302-1', req: 1, type: 'select', opts: ['Total consumption within the organization', 'Self-generated renewable', 'Self-generated non-renewable', 'Energy sold', 'Upstream & downstream energy', 'Reduction achieved', 'Energy intensity'] },
          { label: 'Quantity', req: 1, type: 'number', unit: ['MWh', 'GJ', 'kWh'], help: 'Unit family is locked by the KPI definition — VR-UOM-004.' },
          { label: 'Renewable / non-renewable', req: 1, type: 'select', opts: ['Renewable', 'Non-renewable', 'Mixed — split recorded separately'] },
          { label: 'Intensity denominator', type: 'select', opts: ['— not an intensity metric —', 'Tonne of clinker', 'MWh generated', 'Revenue', 'FTE'], help: 'Only for intensity metrics; the denominator is declared, never implied.' },
          { label: 'Energy-efficiency initiative', type: 'select', opts: ['— none —', 'Kiln waste-heat recovery', 'VSD retrofit — raw mill', 'LED relamping', 'Compressed-air leak programme'] },
          { label: 'Expected / actual saving', type: 'number', unit: ['MWh'], help: 'Investment and expected saving belong to the initiative, not to the meter reading.' }
        ]
      },
      {
        key: 'e-elec', p: 'E', ic: '🔌', en: 'Electricity', ar: 'الكهرباء',
        purpose: { en: 'Purchased, self-generated, renewable and exported electricity at meter grain — guide §3.1. The activity data behind Scope 2.', ar: 'الكهرباء المشتراة والمولّدة ذاتيًا والمتجددة والمصدّرة على مستوى العداد — دليل §3.1. بيانات النشاط خلف النطاق 2.' },
        kpiIds: ['ENV-ENE-004', 'ENV-ENE-005', 'ENV-ENE-006'],
        reuse: [['Scope 2 emissions', 'انبعاثات النطاق 2', 'data/e-s2'], ['Grid emission factors', 'معاملات الشبكة', 'data/factors'], ['Energy totals', 'إجماليات الطاقة', 'data/e-energy']],
        cols: ['Record', 'Period', 'Site', 'Meter', 'Category', 'kWh', 'Cost'],
        rows: [
          ['ELC-2025-001', '2025-12', 'EG-CEM-01', 'MTR-CEM-MAIN', 'Purchased — grid', '3,910,000', 'EGP 4,120,500', 'EV-0021', 'S. Tawfik', 'approved'],
          ['ELC-2025-002', '2025-12', 'EG-QRY-01', 'MTR-QRY-01', 'Purchased — grid', '578,000', 'EGP 611,400', 'EV-0021', 'S. Tawfik', 'approved'],
          ['ELC-2025-003', '2025-12', 'SA-SOL-01', 'MTR-SOL-EXP', 'Self-generated — solar', '2,623,000', '—', 'EV-0022', 'F. Said', 'approved'],
          ['ELC-2025-004', '2025-12', 'SA-WND-01', 'MTR-WND-EXP', 'Self-generated — wind', '2,063,000', '—', 'EV-0022', 'F. Said', 'approved'],
          ['ELC-2025-005', '2025-12', 'SA-SOL-01', 'MTR-SOL-EXP', 'Exported to grid', '2,480,000', 'SAR 793,600', 'EV-0022', 'F. Said', 'review'],
          ['ELC-2025-006', '2025-12', 'SA-DEP-01', 'MTR-DEP-01', 'Purchased — grid', '38,000', 'SAR 12,160', 'EV-0021', 'F. Said', 'submitted'],
          ['ELC-2025-007', 'FY2025', 'ALL', '—', 'Renewable contract / certificates', '4,100,000', '—', 'EV-0023', 'S. Tawfik', 'progress']
        ],
        form: [
          { s: ['Electricity', 'الكهرباء', 'GRI 302-1-c / 302-1-d'] },
          { label: 'Category', gri: '302-1', req: 1, type: 'select', opts: ['Purchased — grid', 'Purchased — renewable contract', 'Self-generated — solar', 'Self-generated — wind', 'Self-generated — other', 'Exported to grid', 'Purchased steam / heating / cooling'] },
          { label: 'Meter / point of supply', req: 1, type: 'select', opts: ['MTR-CEM-MAIN', 'MTR-QRY-01', 'MTR-SOL-EXP', 'MTR-WND-EXP', 'MTR-DEP-01'] },
          { label: 'Consumption', req: 1, type: 'number', unit: ['kWh', 'MWh', 'GJ'] },
          { label: 'Cost', type: 'number', unit: ['EGP', 'SAR', 'AED', 'USD'], help: 'Cost never substitutes for the metered quantity — it is a separate field.' },
          { label: 'Renewable instrument', type: 'select', opts: ['— none —', 'Renewable energy certificate', 'Power purchase agreement', 'Green tariff'], help: 'Drives the market-based Scope 2 figure on the Scope 2 screen.' },
          { label: 'Meter reading — opening / closing', type: 'text', ph: 'e.g. 812,400 → 816,310' }
        ]
      },
      {
        key: 'e-fuels', p: 'E', ic: '⛽', en: 'Fuels', ar: 'الوقود',
        purpose: { en: 'Consumption by fuel type with energy content and renewable classification — guide §3.1. The activity data behind Scope 1 combustion.', ar: 'الاستهلاك حسب نوع الوقود مع المحتوى الطاقي والتصنيف المتجدد — دليل §3.1. بيانات النشاط خلف احتراق النطاق 1.' },
        kpiIds: ['ENV-ENE-002', 'ENV-ENE-003'],
        reuse: [['Scope 1 emissions', 'انبعاثات النطاق 1', 'data/e-s1'], ['Emission factors', 'معاملات الانبعاث', 'data/factors']],
        cols: ['Record', 'Period', 'Site', 'Fuel type', 'Quantity', 'Unit', 'Renewable?'],
        rows: [
          ['FUE-2025-001', '2025-12', 'EG-CEM-01', 'Natural gas', '812,400', 'm³', 'No', 'EV-0023', 'S. Tawfik', 'approved'],
          ['FUE-2025-002', '2025-12', 'EG-CEM-01', 'Coal / petcoke', '4,180', 't', 'No', 'EV-0023', 'S. Tawfik', 'approved'],
          ['FUE-2025-003', '2025-12', 'EG-QRY-01', 'Diesel — mobile plant', '196,300', 'litre', 'No', 'EV-0023', 'R. Barakat', 'approved'],
          ['FUE-2025-004', '2025-12', 'EG-CEM-01', 'Diesel — standby generators', '18,400', 'litre', 'No', 'EV-0023', 'R. Barakat', 'approved'],
          ['FUE-2025-005', '2025-12', 'SA-DEP-01', 'Petrol / gasoline', '9,120', 'litre', 'No', 'EV-0023', 'F. Said', 'review'],
          ['FUE-2025-006', '2025-12', 'EG-CEM-01', 'Biomass — agricultural residue', '1,240', 't', 'Yes', 'EV-0023', 'R. Barakat', 'review'],
          ['FUE-2025-007', '2025-12', 'SA-SOL-01', 'LPG', '640', 'kg', 'No', 'EV-0023', 'F. Said', 'submitted'],
          ['FUE-2025-008', '2025-11', 'EG-QRY-01', 'Fuel oil', '22,800', 'litre', 'No', 'EV-0023', 'R. Barakat', 'progress']
        ],
        form: [
          { s: ['Fuel', 'الوقود', 'GRI 302-1-a / 302-1-b'] },
          { label: 'Fuel type', gri: '302-1', req: 1, type: 'select', opts: ['Natural gas', 'Diesel', 'Petrol / gasoline', 'LPG', 'Fuel oil', 'Coal / petcoke', 'Kerosene', 'Jet fuel', 'Biomass', 'Biogas', 'Other'] },
          { label: 'Quantity', req: 1, type: 'number', unit: ['litre', 'm³', 'kg', 't', 'GJ'] },
          { label: 'Energy content', type: 'number', unit: ['GJ'], help: 'Net calorific value used for the conversion to energy units.' },
          { label: 'Renewable classification', req: 1, type: 'select', opts: ['Non-renewable', 'Renewable'] },
          { label: 'Equipment / process', req: 1, type: 'select', opts: ['Kiln', 'Boiler', 'Furnace', 'Standby generator', 'Mobile plant', 'Fleet vehicles', 'Marine vessel'] },
          { label: 'Supplier', type: 'select', opts: ['EGAS', 'Misr Petroleum', 'Aramco Trading', 'Local distributor'] },
          { label: 'Invoice / reference', type: 'text', ph: 'Supplier invoice number' }
        ]
      },
      {
        key: 'e-s1', p: 'E', ic: '🏭', en: 'Scope 1 Emissions', ar: 'انبعاثات النطاق 1',
        purpose: { en: 'Direct emissions from owned or controlled sources — stationary, mobile, process and fugitive — guide §3.2. Activity data is collected here; the tCO₂e figure is produced by a calculation run.', ar: 'الانبعاثات المباشرة من مصادر مملوكة أو مسيطر عليها — ثابتة ومتنقلة وعمليات ومتسرّبة — دليل §3.2. بيانات النشاط تُجمع هنا؛ رقم tCO₂e ينتج عن تشغيلة حساب.' },
        kpiIds: ['ENV-GHG-001', 'ENV-GHG-002', 'ENV-GHG-007', 'ENV-GHG-008', 'ENV-GHG-009'],
        reuse: [['Calculation runs & lineage', 'تشغيلات الحساب والنسب', 'data/calcruns'], ['Emission factors', 'معاملات الانبعاث', 'data/factors'], ['GHG reduction targets', 'أهداف خفض الانبعاثات', 'data/targets'], ['Fuels activity data', 'بيانات نشاط الوقود', 'data/e-fuels']],
        cols: ['Record', 'Period', 'Site', 'Category', 'Emission source', 'Activity', 'Unit'],
        rows: [
          ['S1-2025-001', '2025-12', 'EG-CEM-01', 'Stationary combustion', 'Kiln — natural gas', '812,400', 'm³', 'EV-0023', 'S. Tawfik', 'approved'],
          ['S1-2025-002', '2025-12', 'EG-CEM-01', 'Stationary combustion', 'Kiln — coal / petcoke', '4,180', 't', 'EV-0023', 'S. Tawfik', 'approved'],
          ['S1-2025-003', '2025-12', 'EG-CEM-01', 'Process emissions', 'Clinker calcination', '68,900', 't clinker', 'EV-0023', 'R. Barakat', 'approved'],
          ['S1-2025-004', '2025-12', 'EG-QRY-01', 'Mobile combustion', 'Haul trucks & loaders — diesel', '196,300', 'litre', 'EV-0023', 'R. Barakat', 'approved'],
          ['S1-2025-005', '2025-12', 'EG-CEM-01', 'Mobile combustion', 'Site fleet — diesel', '31,700', 'litre', 'EV-0023', 'R. Barakat', 'review'],
          ['S1-2025-006', 'FY2025', 'EG-CEM-01', 'Fugitive emissions', 'R-410A air-conditioning top-up', '84', 'kg', 'EV-0025', 'R. Barakat', 'review'],
          ['S1-2025-007', 'FY2025', 'SA-SOL-01', 'Fugitive emissions', 'SF₆ — switchgear', '1.4', 'kg', 'EV-0025', 'F. Said', 'submitted'],
          ['S1-2025-008', 'FY2025', 'EG-CEM-01', 'Biogenic CO₂ (reported separately)', 'Biomass co-firing', '1,240', 't', 'EV-0023', 'R. Barakat', 'progress'],
          ['S1-2025-009', '2025-09', 'SA-DEP-01', 'Stationary combustion', 'Depot generator — diesel (part-period)', '4,900', 'litre', 'EV-0023', 'F. Said', 'progress']
        ],
        form: [
          { s: ['Emission source', 'مصدر الانبعاث', 'GRI 305-1 · GHG Protocol Scope 1'] },
          { label: 'Scope 1 category', gri: '305-1', req: 1, type: 'select', opts: ['Stationary combustion', 'Mobile combustion', 'Process emissions', 'Fugitive emissions', 'Biogenic CO₂ (reported separately)'] },
          { label: 'Emission source', req: 1, type: 'text', ph: 'Kiln, boiler, haul fleet, chiller…' },
          { label: 'Equipment / vehicle ID', type: 'text', ph: 'Asset register id' },
          { label: 'Gas', req: 1, type: 'select', opts: ['CO₂', 'CH₄', 'N₂O', 'HFCs — R-410A', 'HFCs — R-134a', 'SF₆', 'NF₃', 'Mixed — all seven'], value: 'Mixed — all seven' },
          { label: 'Activity quantity', req: 1, type: 'number', unit: ['litre', 'm³', 'kg', 't', 'km', 'hours'] },
          { label: 'Refrigerant charge / recovered', type: 'number', unit: ['kg'], help: 'Fugitive only — purchased minus recovered is the leaked estimate.' },
          { label: 'Emission factor', value: 'Resolved from the Factor Library at run time', ro: 1, pv: { k: 'reuse', t: 'Factor Library', l: '#/data/factors' } },
          { label: 'Calculated tCO₂e', value: 'Produced by a calculation run — never typed', ro: 1, pv: { k: 'calc', t: 'CALC-ENV-GHG-001', l: '#/data/calcruns' } }
        ]
      },
      {
        key: 'e-s2', p: 'E', ic: '🔋', en: 'Scope 2 Emissions', ar: 'انبعاثات النطاق 2',
        purpose: { en: 'Indirect emissions from purchased electricity, steam, heating and cooling — guide §3.3. Location-based and market-based are separate figures and are never added together.', ar: 'الانبعاثات غير المباشرة من الكهرباء والبخار والتدفئة والتبريد المشتراة — دليل §3.3. القائم على الموقع والقائم على السوق رقمان منفصلان لا يُجمعان أبدًا.' },
        kpiIds: ['ENV-GHG-003', 'ENV-GHG-004', 'ENV-GHG-012'],
        reuse: [['Calculation runs & lineage', 'تشغيلات الحساب', 'data/calcruns'], ['Grid emission factors', 'معاملات الشبكة', 'data/factors'], ['Electricity activity data', 'بيانات نشاط الكهرباء', 'data/e-elec'], ['Approved site breakdown', 'التوزيع المعتمد بالموقع', 'data/factbook']],
        cols: ['Record', 'Period', 'Site', 'Energy carrier', 'Method', 'Activity (MWh)', 'Contract / instrument'],
        rows: [
          ['S2-2025-001', '2025-12', 'EG-CEM-01', 'Purchased electricity', 'Location-based', '3,910', 'National grid — EGY', 'EV-0021', 'S. Tawfik', 'approved'],
          ['S2-2025-002', '2025-12', 'EG-CEM-01', 'Purchased electricity', 'Market-based', '3,910', 'Standard supply — residual mix', 'EV-0021', 'S. Tawfik', 'approved'],
          ['S2-2025-003', '2025-12', 'EG-QRY-01', 'Purchased electricity', 'Location-based', '578', 'National grid — EGY', 'EV-0021', 'S. Tawfik', 'approved'],
          ['S2-2025-004', '2025-12', 'SA-DEP-01', 'Purchased electricity', 'Location-based', '38', 'National grid — KSA', 'EV-0021', 'F. Said', 'approved'],
          ['S2-2025-005', 'FY2025', 'SA-SOL-01', 'Purchased electricity', 'Market-based', '4,100', 'Renewable PPA — 100%', 'EV-0023', 'S. Tawfik', 'review'],
          ['S2-2025-006', '2025-12', 'EG-CEM-01', 'Purchased steam', 'Location-based', '210', 'Third-party supplier', 'EV-0021', 'R. Barakat', 'submitted'],
          ['S2-2025-007', '2025-12', 'EG-CEM-01', 'Purchased cooling', 'Location-based', '96', 'District cooling', 'EV-0021', 'R. Barakat', 'progress']
        ],
        form: [
          { s: ['Purchased energy', 'الطاقة المشتراة', 'GRI 305-2 · GHG Protocol Scope 2'] },
          { label: 'Energy carrier', gri: '305-2', req: 1, type: 'select', opts: ['Purchased electricity', 'Purchased steam', 'Purchased heating', 'Purchased cooling'] },
          { label: 'Accounting method', req: 1, type: 'select', opts: ['Location-based', 'Market-based'], help: 'Both are disclosed; they are never aggregated into one number.' },
          { label: 'Activity quantity', req: 1, type: 'number', unit: ['MWh', 'kWh', 'GJ'] },
          { label: 'Supplier', type: 'select', opts: ['National grid — EGY', 'National grid — KSA', 'National grid — UAE', 'Third-party steam supplier', 'District cooling'] },
          { label: 'Contract type', type: 'select', opts: ['Standard supply', 'Renewable PPA', 'Green tariff', 'Certificate-backed'] },
          { label: 'Grid / supplier factor', value: 'Resolved from the Factor Library at run time', ro: 1, pv: { k: 'reuse', t: 'Factor Library', l: '#/data/factors' } },
          { label: 'Calculated tCO₂e', value: 'Produced by a calculation run — never typed', ro: 1, pv: { k: 'calc', t: 'CALC-ENV-GHG-003', l: '#/data/calcruns' } }
        ]
      },
      {
        key: 'e-s3', p: 'E', ic: '🌐', en: 'Scope 3 Emissions', ar: 'انبعاثات النطاق 3',
        purpose: { en: 'Value-chain emissions across the fifteen categories — guide §3.4. Each row carries its category, primary-data share and, where excluded, the rationale.', ar: 'انبعاثات سلسلة القيمة عبر الفئات الخمس عشرة — دليل §3.4. كل سطر يحمل فئته ونسبة البيانات الأولية وسبب الاستبعاد عند وجوده.' },
        kpiIds: ['ENV-GHG-005', 'ENV-GHG-006', 'ENV-GHG-010', 'ENV-GHG-011'],
        reuse: [['Supplier assessments', 'تقييم الموردين', 'data/g-supp'], ['Waste in operations (cat. 5)', 'نفايات العمليات (فئة 5)', 'data/e-waste'], ['Calculation runs', 'تشغيلات الحساب', 'data/calcruns']],
        cols: ['Record', 'Category', 'Period', 'Counterparty / activity', 'Activity', 'Unit', 'Primary data %'],
        rows: [
          ['S3-2025-001', '1 · Purchased goods & services', 'FY2025', 'Limestone & additives — 12 suppliers', '412,000', 't', '38%', 'EV-0023', 'Y. Gaber', 'review'],
          ['S3-2025-002', '2 · Capital goods', 'FY2025', 'Kiln refurbishment — capex', 'EGP 84,200,000', 'spend', '0%', 'EV-0023', 'Y. Gaber', 'progress'],
          ['S3-2025-003', '3 · Fuel- & energy-related', 'FY2025', 'Upstream fuel + grid T&D losses', '5,120', 'MWh', '100%', 'EV-0021', 'S. Tawfik', 'review'],
          ['S3-2025-004', '4 · Upstream transport & distribution', 'FY2025', 'Inbound road haulage — 3 carriers', '2,840,000', 't·km', '61%', 'EV-0023', 'Y. Gaber', 'review'],
          ['S3-2025-005', '5 · Waste generated in operations', 'FY2025', 'Kiln dust, scrap, municipal', '3,210', 't', '100%', 'EV-0025', 'R. Barakat', 'approved'],
          ['S3-2025-006', '6 · Business travel', 'FY2025', 'Air, rail and hotel — group', '1,940,000', 'passenger·km', '92%', 'EV-0023', 'K. Mansour', 'approved'],
          ['S3-2025-007', '7 · Employee commuting', 'FY2025', 'Survey — 672 employees', '4,310,000', 'passenger·km', '48%', 'EV-0023', 'K. Mansour', 'submitted'],
          ['S3-2025-008', '9 · Downstream transport & distribution', 'FY2025', 'Outbound cement distribution', '6,120,000', 't·km', '55%', 'EV-0023', 'Y. Gaber', 'progress'],
          ['S3-2025-009', '11 · Use of sold products', 'FY2025', 'Not relevant — inert product', '—', '—', '—', 'EV-0023', 'Y. Gaber', 'draft'],
          ['S3-2025-010', '12 · End-of-life of sold products', 'FY2025', 'Concrete demolition route', '412,000', 't', '12%', 'EV-0023', 'Y. Gaber', 'draft']
        ],
        form: [
          { s: ['Value-chain category', 'فئة سلسلة القيمة', 'GRI 305-3 · GHG Protocol Scope 3'] },
          { label: 'Scope 3 category', gri: '305-3', req: 1, type: 'select', opts: ['1 · Purchased goods & services', '2 · Capital goods', '3 · Fuel- & energy-related', '4 · Upstream transport & distribution', '5 · Waste generated in operations', '6 · Business travel', '7 · Employee commuting', '8 · Upstream leased assets', '9 · Downstream transport & distribution', '10 · Processing of sold products', '11 · Use of sold products', '12 · End-of-life of sold products', '13 · Downstream leased assets', '14 · Franchises', '15 · Investments'] },
          { label: 'Included in the inventory?', req: 1, type: 'select', opts: ['Yes — included', 'No — excluded (rationale required)'], value: 'Yes — included' },
          { label: 'Exclusion rationale', type: 'area', full: 1, ph: 'Required when the category is excluded', help: 'An excluded category without a rationale is a finding — never a silent gap.' },
          { label: 'Counterparty / activity', req: 1, type: 'text', ph: 'Supplier, carrier, product or programme' },
          { label: 'Activity quantity', req: 1, type: 'number', unit: ['t', 't·km', 'passenger·km', 'MWh', 'spend', 'units'] },
          { label: 'Primary data share', type: 'number', unit: ['%'], help: 'Supplier-specific data share — disclosed alongside the value.' },
          { label: 'Origin → destination', type: 'text', ph: 'Transport categories only' },
          { label: 'Transport mode', type: 'select', opts: ['— not applicable —', 'Road', 'Rail', 'Sea', 'Air', 'Inland waterway'] }
        ]
      },
      {
        key: 'e-water', p: 'E', ic: '💧', en: 'Water', ar: 'المياه',
        purpose: { en: 'Withdrawal by source, consumption, discharge by destination and reuse — guide §3.6, with water-stress status on every row.', ar: 'السحب حسب المصدر والاستهلاك والتصريف حسب الوجهة وإعادة الاستخدام — دليل §3.6، مع حالة الإجهاد المائي على كل سطر.' },
        kpiT: ['Water & Effluents'],
        reuse: [['Approved water facts', 'حقائق المياه المعتمدة', 'data/factbook'], ['Water reduction targets', 'أهداف ترشيد المياه', 'data/targets'], ['Discharge quality incidents', 'حوادث جودة التصريف', 'data/e-pollution']],
        cols: ['Record', 'Period', 'Site', 'Flow type', 'Source / destination', 'Volume (ML)', 'Water stress'],
        rows: [
          ['WAT-2025-001', '2025-12', 'EG-QRY-01', 'Withdrawal', 'Groundwater', '18.40', 'Water-stressed', 'EV-0022', 'R. Barakat', 'approved'],
          ['WAT-2025-002', '2025-12', 'EG-CEM-01', 'Withdrawal', 'Third-party / municipal', '42.10', 'Water-stressed', 'EV-0022', 'R. Barakat', 'approved'],
          ['WAT-2025-003', '2025-12', 'SA-SOL-01', 'Withdrawal', 'Third-party / municipal', '6.20', 'Water-stressed', 'EV-0022', 'F. Said', 'approved'],
          ['WAT-2025-004', '2025-12', 'EG-CEM-01', 'Discharge', 'Sewer — third-party treatment', '11.80', 'Water-stressed', 'EV-0022', 'R. Barakat', 'approved'],
          ['WAT-2025-005', '2025-12', 'EG-QRY-01', 'Discharge', 'Surface water', '3.40', 'Water-stressed', 'EV-0022', 'R. Barakat', 'review'],
          ['WAT-2025-006', 'FY2025', 'EG-CEM-01', 'Consumption', 'Evaporative & product-bound', '30.30', 'Water-stressed', 'EV-0022', 'R. Barakat', 'review'],
          ['WAT-2025-007', 'FY2025', 'EG-CEM-01', 'Reuse / recycled', 'Cooling-water recirculation', '14.60', 'Water-stressed', 'EV-0022', 'R. Barakat', 'submitted'],
          ['WAT-2025-008', 'FY2025', 'SA-WND-01', 'Withdrawal', 'Rainwater harvesting', '0.90', 'Not stressed', 'EV-0022', 'F. Said', 'progress']
        ],
        form: [
          { s: ['Water flow', 'التدفق المائي', 'GRI 303-3 / 303-4 / 303-5'] },
          { label: 'Flow type', gri: '303-3', req: 1, type: 'select', opts: ['Withdrawal', 'Discharge', 'Consumption', 'Reuse / recycled'] },
          { label: 'Source / destination', req: 1, type: 'select', opts: ['Surface water', 'Groundwater', 'Seawater', 'Produced water', 'Third-party / municipal', 'Rainwater harvesting', 'Sewer — third-party treatment', 'Ground'] },
          { label: 'Volume', req: 1, type: 'number', unit: ['ML', 'm³'] },
          { label: 'Water-stress status', gri: '303-3-b', req: 1, type: 'select', opts: ['Water-stressed', 'Not stressed', 'Not assessed'], help: 'From the approved basin assessment — a dimension of the record, not a note.' },
          { label: 'Water quality band', type: 'select', opts: ['Freshwater (≤1,000 mg/L TDS)', 'Other water (>1,000 mg/L TDS)'] },
          { label: 'Treatment before discharge', type: 'select', opts: ['— not a discharge —', 'None', 'Primary', 'Secondary', 'Tertiary'] },
          { label: 'Permitted limit / exceedance', type: 'text', ph: 'Permit reference and any exceedance', help: 'An exceedance also raises a record on Pollution & Incidents.' }
        ]
      },
      {
        key: 'e-waste', p: 'E', ic: '🗑', en: 'Waste', ar: 'النفايات',
        purpose: { en: 'Waste by stream, hazard classification and treatment route, diverted from or directed to disposal — guide §3.7.', ar: 'النفايات حسب المجرى والتصنيف الخطر ومسار المعالجة، محوّلة عن التخلص أو موجّهة إليه — دليل §3.7.' },
        kpiT: ['Waste'],
        reuse: [['Scope 3 cat. 5 emissions', 'انبعاثات النطاق 3 فئة 5', 'data/e-s3'], ['Circular economy', 'الاقتصاد الدائري', 'data/e-circular'], ['Waste contractor evidence', 'أدلة مقاول النفايات', 'data/evid']],
        cols: ['Record', 'Period', 'Site', 'Waste stream', 'Hazard', 'Treatment route', 'Quantity (t)'],
        rows: [
          ['WST-2025-001', '2025-12', 'EG-CEM-01', 'Cement kiln dust', 'Non-hazardous', 'Recovery — reused in process', '1,240', 'EV-0025', 'R. Barakat', 'approved'],
          ['WST-2025-002', '2025-12', 'EG-CEM-01', 'Scrap metal', 'Non-hazardous', 'Recycling', '186', 'EV-0025', 'R. Barakat', 'approved'],
          ['WST-2025-003', '2025-12', 'EG-CEM-01', 'Waste oil', 'Hazardous', 'Incineration with energy recovery', '24', 'EV-0025', 'R. Barakat', 'approved'],
          ['WST-2025-004', '2025-12', 'EG-QRY-01', 'Overburden & inert rock', 'Non-hazardous', 'Reuse — site restoration', '980', 'EV-0025', 'R. Barakat', 'approved'],
          ['WST-2025-005', '2025-12', 'EG-CEM-01', 'Municipal / general', 'Non-hazardous', 'Landfill', '412', 'EV-0025', 'R. Barakat', 'review'],
          ['WST-2025-006', '2025-12', 'EG-QRY-01', 'Used tyres', 'Non-hazardous', 'Recovery — co-processing', '68', 'EV-0025', 'R. Barakat', 'review'],
          ['WST-2025-007', 'FY2025', 'SA-SOL-01', 'Electronic waste', 'Hazardous', 'Recycling — licensed contractor', '9', 'EV-0025', 'F. Said', 'submitted'],
          ['WST-2025-008', 'FY2025', 'EG-CEM-01', 'Refractory brick', 'Non-hazardous', 'Landfill', '91', 'EV-0025', 'R. Barakat', 'progress']
        ],
        form: [
          { s: ['Waste stream', 'مجرى النفايات', 'GRI 306-3 / 306-4 / 306-5'] },
          { label: 'Waste stream', gri: '306-3', req: 1, type: 'text', ph: 'Kiln dust, scrap metal, waste oil…' },
          { label: 'Hazard classification', req: 1, type: 'select', opts: ['Non-hazardous', 'Hazardous'] },
          { label: 'Composition / material', type: 'select', opts: ['Mineral', 'Metal', 'Oil & chemicals', 'Plastic', 'Paper & card', 'Organic', 'Electronic', 'Mixed'] },
          { label: 'Treatment route', gri: '306-4', req: 1, type: 'select', opts: ['Reuse', 'Recycling', 'Composting', 'Recovery — including co-processing', 'Incineration with energy recovery', 'Incineration without energy recovery', 'Landfill', 'Deep-well injection', 'Other'] },
          { label: 'Diverted or directed?', req: 1, type: 'select', opts: ['Diverted from disposal', 'Directed to disposal'], help: 'Drives the diversion rate — the rate is computed, never typed.' },
          { label: 'Quantity', req: 1, type: 'number', unit: ['t', 'kg'] },
          { label: 'On-site or off-site', req: 1, type: 'select', opts: ['On-site', 'Off-site'] },
          { label: 'Contractor', type: 'select', opts: ['Licensed hazardous-waste contractor', 'Municipal collection', 'Scrap merchant', 'Internal — reused on site'] },
          { label: 'Permit / manifest reference', type: 'text', ph: 'Waste transfer note or manifest number' }
        ]
      },
      {
        key: 'e-materials', p: 'E', ic: '📦', en: 'Materials', ar: 'المواد',
        purpose: { en: 'Raw and packaging materials by weight, renewable classification and recycled input share — guide §3.8.', ar: 'المواد الخام ومواد التغليف حسب الوزن والتصنيف المتجدد ونسبة المدخلات المعاد تدويرها — دليل §3.8.' },
        kpiT: ['Materials'],
        reuse: [['Circular economy', 'الاقتصاد الدائري', 'data/e-circular'], ['Scope 3 cat. 1', 'النطاق 3 فئة 1', 'data/e-s3'], ['Supplier assessments', 'تقييم الموردين', 'data/g-supp']],
        cols: ['Record', 'Period', 'Site', 'Material', 'Renewable?', 'Recycled input %', 'Quantity (t)'],
        rows: [
          ['MAT-2025-001', 'FY2025', 'EG-CEM-01', 'Limestone', 'Non-renewable', '0%', '412,000', 'EV-0023', 'R. Barakat', 'approved'],
          ['MAT-2025-002', 'FY2025', 'EG-CEM-01', 'Clay & shale', 'Non-renewable', '0%', '68,400', 'EV-0023', 'R. Barakat', 'approved'],
          ['MAT-2025-003', 'FY2025', 'EG-CEM-01', 'Gypsum', 'Non-renewable', '4%', '19,200', 'EV-0023', 'R. Barakat', 'approved'],
          ['MAT-2025-004', 'FY2025', 'EG-CEM-01', 'Fly ash — supplementary cementitious', 'Non-renewable', '100%', '31,800', 'EV-0023', 'R. Barakat', 'review'],
          ['MAT-2025-005', 'FY2025', 'EG-CEM-01', 'Kraft paper sacks — packaging', 'Renewable', '62%', '1,940', 'EV-0023', 'Y. Gaber', 'review'],
          ['MAT-2025-006', 'FY2025', 'EG-CEM-01', 'Plastic shrink wrap — packaging', 'Non-renewable', '18%', '210', 'EV-0023', 'Y. Gaber', 'submitted'],
          ['MAT-2025-007', 'FY2025', 'EG-CEM-01', 'Wooden pallets — packaging', 'Renewable', '85%', '640', 'EV-0023', 'Y. Gaber', 'progress']
        ],
        form: [
          { s: ['Material', 'المادة', 'GRI 301-1 / 301-2 / 301-3'] },
          { label: 'Material', gri: '301-1', req: 1, type: 'text', ph: 'Limestone, gypsum, kraft paper…' },
          { label: 'Material role', req: 1, type: 'select', opts: ['Raw material', 'Process material', 'Packaging — primary', 'Packaging — secondary', 'Packaging — tertiary'] },
          { label: 'Renewable classification', req: 1, type: 'select', opts: ['Renewable', 'Non-renewable'] },
          { label: 'Quantity', req: 1, type: 'number', unit: ['t', 'kg', 'm³'] },
          { label: 'Recycled input share', gri: '301-2', type: 'number', unit: ['%'] },
          { label: 'Recyclable at end of life?', type: 'select', opts: ['Yes', 'No', 'Partly'] },
          { label: 'Material of concern / restricted substance', type: 'select', opts: ['— none —', 'Declared restricted substance', 'Under assessment'] }
        ]
      },
      {
        key: 'e-circular', p: 'E', ic: '♻️', en: 'Circular Economy', ar: 'الاقتصاد الدائري',
        purpose: { en: 'Design for reuse, repair and recycling, take-back programmes and waste avoided — guide §3.9. Collected as raw records; the material and waste tonnages stay on their own screens.', ar: 'التصميم لإعادة الاستخدام والإصلاح والتدوير، وبرامج الاسترجاع والنفايات المتجنَّبة — دليل §3.9. تُجمع كسجلات خام؛ أطنان المواد والنفايات تبقى في شاشاتها.' },
        kpiIds: [],
        reuse: [['Materials & packaging', 'المواد والتغليف', 'data/e-materials'], ['Waste & treatment routes', 'النفايات ومسارات المعالجة', 'data/e-waste'], ['Product take-back evidence', 'أدلة الاسترجاع', 'data/evid']],
        cols: ['Record', 'Period', 'Initiative', 'Circular strategy', 'Product / packaging', 'Volume', 'Waste avoided (t)'],
        rows: [
          ['CIR-2025-001', 'FY2025', 'Pallet return & repair scheme', 'Design for reuse', 'Wooden pallets', '18,400 pallets', '540', 'EV-0025', 'Y. Gaber', 'approved'],
          ['CIR-2025-002', 'FY2025', 'Fly-ash substitution programme', 'Recycled input', 'Blended cement', '31,800 t', '31,800', 'EV-0025', 'R. Barakat', 'approved'],
          ['CIR-2025-003', 'FY2025', 'Tyre co-processing', 'Recovery', 'End-of-life tyres', '68 t', '68', 'EV-0025', 'R. Barakat', 'review'],
          ['CIR-2025-004', 'FY2025', 'Big-bag take-back', 'Take-back programme', 'FIBC bulk bags', '9,200 bags', '92', 'EV-0025', 'Y. Gaber', 'review'],
          ['CIR-2025-005', 'FY2025', 'Refractory brick reclamation', 'Design for repair', 'Kiln refractory', '91 t', '34', 'EV-0025', 'R. Barakat', 'submitted'],
          ['CIR-2025-006', 'FY2025', 'Recycled-content sack trial', 'Design for recycling', 'Kraft paper sacks', '1,940 t', '—', 'EV-0025', 'Y. Gaber', 'progress']
        ],
        form: [
          { s: ['Circular initiative', 'المبادرة الدائرية', 'guide §3.9'] },
          { label: 'Initiative', req: 1, type: 'text', ph: 'Programme or scheme name' },
          { label: 'Circular strategy', req: 1, type: 'select', opts: ['Design for reuse', 'Design for repair', 'Design for recycling', 'Recycled input', 'Take-back programme', 'Refurbishment', 'Recovery', 'Product-as-a-service'] },
          { label: 'Product / packaging', req: 1, type: 'text' },
          { label: 'Volume returned / reused', type: 'number', unit: ['units', 't', 'kg'] },
          { label: 'Product recovery rate', type: 'number', unit: ['%'] },
          { label: 'Expected product lifetime', type: 'number', unit: ['years', 'cycles'] },
          { label: 'Waste avoided', type: 'number', unit: ['t'], help: 'Must reconcile with the waste stream it displaces — cross-checked at review.' }
        ]
      },
      {
        key: 'e-pollution', p: 'E', ic: '☁️', en: 'Pollution & Incidents', ar: 'التلوث والحوادث',
        purpose: { en: 'Air, water and soil pollutants against permit limits, plus the environmental incident register — guide §3.10. Exceedances and incidents raise findings.', ar: 'ملوثات الهواء والماء والتربة مقابل حدود التصاريح، مع سجل الحوادث البيئية — دليل §3.10. التجاوزات والحوادث تُنشئ ملاحظات.' },
        kpiT: ['Air Emissions (beyond GHG)'],
        reuse: [['Findings register', 'سجل الملاحظات', 'rev/findings'], ['ESG risks & opportunities', 'مخاطر وفرص ESG', 'mat/risk'], ['Water discharge quality', 'جودة تصريف المياه', 'data/e-water'], ['Environmental permits', 'التصاريح البيئية', 'data/e-ecomp']],
        cols: ['Record', 'Period', 'Site', 'Medium', 'Pollutant / event', 'Quantity', 'Permit limit', 'Exceedance'],
        rows: [
          ['POL-2025-001', 'FY2025', 'EG-CEM-01', 'Air', 'NOx — kiln stack', '412 t', '480 t', 'No', 'EV-0025', 'R. Barakat', 'approved'],
          ['POL-2025-002', 'FY2025', 'EG-CEM-01', 'Air', 'SOx — kiln stack', '96 t', '120 t', 'No', 'EV-0025', 'R. Barakat', 'approved'],
          ['POL-2025-003', 'FY2025', 'EG-CEM-01', 'Air', 'Particulate matter — kiln stack', '38 t', '30 t', 'Yes — Q3', 'EV-0025', 'R. Barakat', 'review'],
          ['POL-2025-004', 'FY2025', 'EG-QRY-01', 'Air', 'Particulate matter — crushing & haul roads', '61 t', '—', 'No permit limit', 'EV-0025', 'R. Barakat', 'review'],
          ['POL-2025-005', 'FY2025', 'EG-CEM-01', 'Air', 'Ozone-depleting substances (R-22 legacy)', '0.4 t CFC-11 eq', '—', 'No', 'EV-0025', 'R. Barakat', 'submitted'],
          ['POL-2025-006', '2025-03', 'EG-QRY-01', 'Soil', 'Incident — diesel spill at refuelling bay', '180 litre', '—', 'Reportable', 'EV-0025', 'R. Barakat', 'review'],
          ['POL-2025-007', '2025-08', 'EG-CEM-01', 'Water', 'Incident — cooling-water pH excursion', '2.1 pH units', 'pH 6–9', 'Yes — 4 hours', 'EV-0025', 'R. Barakat', 'progress'],
          ['POL-2025-008', 'FY2025', 'EG-CEM-01', 'Air', 'VOC — bagging line', '12 t', '20 t', 'No', 'EV-0025', 'R. Barakat', 'progress']
        ],
        form: [
          { s: ['Pollutant or incident', 'الملوث أو الحادث', 'GRI 305-6 / 305-7 · guide §3.10'] },
          { label: 'Record type', req: 1, type: 'select', opts: ['Routine emission / discharge', 'Environmental incident'] },
          { label: 'Medium', req: 1, type: 'select', opts: ['Air', 'Water', 'Soil', 'Noise'] },
          { label: 'Pollutant / substance', gri: '305-7', req: 1, type: 'select', opts: ['NOx', 'SOx', 'Particulate matter', 'VOC', 'Ozone-depleting substances', 'Hazardous air pollutants', 'Persistent organic pollutants', 'Diesel / hydrocarbon', 'Other'] },
          { label: 'Emission source / location', req: 1, type: 'text', ph: 'Kiln stack, haul road, refuelling bay…' },
          { label: 'Quantity / concentration', req: 1, type: 'number', unit: ['t', 'kg', 'mg/Nm³', 'litre', 'pH units'] },
          { label: 'Measurement method', type: 'select', opts: ['Continuous emissions monitoring', 'Periodic stack test', 'Laboratory analysis', 'Mass balance', 'Documented estimate'] },
          { label: 'Permit limit', type: 'text', ph: 'Limit value and permit reference' },
          { label: 'Exceedance?', req: 1, type: 'select', opts: ['No', 'Yes — reported to the regulator', 'Yes — not yet reported'], help: 'Any Yes raises a finding in the unified register.' },
          { label: 'Severity', type: 'select', opts: ['— routine —', 'Minor', 'Moderate', 'Major'] },
          { label: 'Root cause', type: 'area', full: 1 },
          { label: 'Corrective / preventive action', type: 'area', full: 1 },
          { label: 'Regulator notified', type: 'select', opts: ['Not required', 'Yes', 'Pending'] },
          { label: 'Closure date', type: 'date' }
        ]
      },
      {
        key: 'e-biodiv', p: 'E', ic: '🌱', en: 'Biodiversity', ar: 'التنوع البيولوجي',
        purpose: { en: 'Sites in or near biodiversity-important areas, land converted and restored, and the mitigation hierarchy — guide §3.11.', ar: 'المواقع داخل أو قرب مناطق مهمة للتنوع البيولوجي، والأراضي المحوَّلة والمعاد تأهيلها، وتسلسل التخفيف — دليل §3.11.' },
        kpiT: ['Biodiversity'],
        reuse: [['Sites register', 'سجل المواقع', 'org/sites'], ['Sector topics (GRI 14)', 'موضوعات القطاع', 'mat/secrec'], ['Community engagement', 'إشراك المجتمع', 'data/s-comm']],
        cols: ['Record', 'Site', 'Protected-area proximity', 'Ecosystem', 'Area affected (ha)', 'Restored (ha)', 'Mitigation stage'],
        rows: [
          ['BIO-2025-001', 'EG-QRY-01', 'Adjacent — 2.4 km from Wadi Degla protectorate', 'Desert wadi', '84.0', '12.0', 'Minimise', 'EV-0025', 'R. Barakat', 'approved'],
          ['BIO-2025-002', 'EG-QRY-01', 'Adjacent', 'Desert wadi', '18.0', '18.0', 'Restore', 'EV-0025', 'R. Barakat', 'approved'],
          ['BIO-2025-003', 'EG-CEM-01', 'Not in or near a protected area', 'Industrial / modified', '0.0', '0.0', 'Avoid', 'EV-0025', 'R. Barakat', 'approved'],
          ['BIO-2025-004', 'SA-WND-01', 'Within a migratory bird flyway', 'Arid steppe', '210.0', '0.0', 'Minimise', 'EV-0025', 'F. Said', 'review'],
          ['BIO-2025-005', 'SA-SOL-01', 'Not in or near a protected area', 'Arid steppe', '640.0', '0.0', 'Minimise', 'EV-0025', 'F. Said', 'review'],
          ['BIO-2025-006', 'SA-WND-01', 'Within a migratory bird flyway', 'Arid steppe', '—', '—', 'Monitoring — avian survey', 'EV-0025', 'F. Said', 'submitted'],
          ['BIO-2025-007', 'EG-QRY-01', 'Adjacent', 'Desert wadi', '—', '6.0', 'Restore — closure plan year 1', 'EV-0025', 'R. Barakat', 'progress']
        ],
        form: [
          { s: ['Site & ecological context', 'الموقع والسياق البيئي', 'GRI 304-1 / 304-2 / 304-3'] },
          { label: 'Site', gri: '304-1', req: 1, type: 'select', opts: ['SA-SOL-01 Sudair Solar Plant', 'SA-WND-01 Dumat Al Jandal Wind Farm', 'EG-CEM-01 10th of Ramadan Cement Works', 'EG-QRY-01 Suez Aggregates Quarry'] },
          { label: 'Protected-area proximity', req: 1, type: 'select', opts: ['Inside a protected area', 'Adjacent — within 5 km', 'Within a migratory flyway', 'Not in or near a protected area'] },
          { label: 'Ecosystem type', req: 1, type: 'select', opts: ['Desert wadi', 'Arid steppe', 'Coastal', 'Freshwater', 'Agricultural', 'Industrial / modified'] },
          { label: 'Area affected', gri: '304-2', type: 'number', unit: ['ha'] },
          { label: 'Land converted this period', type: 'number', unit: ['ha'] },
          { label: 'Land rehabilitated / restored', gri: '304-3', type: 'number', unit: ['ha'] },
          { label: 'Species of concern affected', type: 'text', ph: 'IUCN-listed or nationally protected species' },
          { label: 'Mitigation hierarchy stage', req: 1, type: 'select', opts: ['Avoid', 'Minimise', 'Restore', 'Offset'] },
          { label: 'Biodiversity management plan', type: 'select', opts: ['In place — approved', 'In draft', 'Not required'] },
          { label: 'Monitoring result', type: 'area', full: 1, ph: 'Survey findings for the period' }
        ]
      },
      {
        key: 'e-ecomp', p: 'E', ic: '⚖️', en: 'Environmental Compliance', ar: 'الامتثال البيئي',
        purpose: { en: 'Environmental permits, inspections, violations and sanctions — guide §3.12. Fines and legal proceedings are recorded once, in the compliance register.', ar: 'التصاريح البيئية والتفتيشات والمخالفات والعقوبات — دليل §3.12. الغرامات والإجراءات القانونية تُسجَّل مرة واحدة في سجل الامتثال.' },
        kpiIds: [],
        reuse: [['Findings register', 'سجل الملاحظات', 'rev/findings'], ['Site certifications', 'شهادات المواقع', 'org/sites'], ['Pollution & incidents', 'التلوث والحوادث', 'data/e-pollution'], ['Group compliance register', 'سجل الامتثال العام', 'data/g-comp']],
        cols: ['Record', 'Site', 'Permit / requirement', 'Permit no.', 'Expiry', 'Compliance status', 'Finding'],
        rows: [
          ['ECP-2025-001', 'EG-CEM-01', 'Air emissions licence — kiln stack', 'EEAA-AIR-4471', '2027-03-31', 'Compliant', '—', 'EV-0025', 'R. Barakat', 'approved'],
          ['ECP-2025-002', 'EG-CEM-01', 'Industrial wastewater discharge permit', 'EEAA-WW-2210', '2026-11-30', 'Compliant', '—', 'EV-0025', 'R. Barakat', 'approved'],
          ['ECP-2025-003', 'EG-CEM-01', 'Hazardous-waste generator registration', 'EEAA-HW-0884', '2026-06-30', 'Compliant', '—', 'EV-0025', 'R. Barakat', 'approved'],
          ['ECP-2025-004', 'EG-QRY-01', 'Quarry operating & closure permit', 'MIN-EG-1132', '2029-01-31', 'Compliant', '—', 'EV-0025', 'R. Barakat', 'approved'],
          ['ECP-2025-005', 'EG-CEM-01', 'Stack PM limit — Q3 exceedance', 'EEAA-AIR-4471', '2027-03-31', 'Non-compliant — corrective action open', 'FND-2025-0002', 'EV-0025', 'R. Barakat', 'review'],
          ['ECP-2025-006', 'SA-SOL-01', 'Environmental permit — generation', 'NCEC-SA-7781', '2028-05-31', 'Compliant', '—', 'EV-0025', 'F. Said', 'review'],
          ['ECP-2025-007', 'EG-QRY-01', 'Groundwater abstraction licence', 'MWRI-EG-3390', '2026-02-28', 'Renewal in progress', '—', 'EV-0025', 'R. Barakat', 'submitted'],
          ['ECP-2025-008', 'SA-WND-01', 'Avian monitoring condition', 'NCEC-SA-7802', '2027-09-30', 'Compliant', '—', 'EV-0025', 'F. Said', 'progress']
        ],
        form: [
          { s: ['Permit / obligation', 'التصريح أو الالتزام', 'guide §3.12'] },
          { label: 'Permit or requirement', req: 1, type: 'text', ph: 'Licence, permit or applicable regulation' },
          { label: 'Permit type', req: 1, type: 'select', opts: ['Air emissions', 'Water discharge', 'Water abstraction', 'Waste', 'Operating / land use', 'Noise', 'Monitoring condition'] },
          { label: 'Permit number', req: 1, type: 'text' },
          { label: 'Issuing authority', req: 1, type: 'select', opts: ['EEAA — Egypt', 'MWRI — Egypt', 'Ministry of Mineral Resources — Egypt', 'NCEC — Saudi Arabia', 'Local municipality'] },
          { label: 'Valid from / expiry', req: 1, type: 'date' },
          { label: 'Compliance status', req: 1, type: 'select', opts: ['Compliant', 'Non-compliant — corrective action open', 'Renewal in progress', 'Not yet assessed'] },
          { label: 'Inspection date & outcome', type: 'text', ph: 'Regulator inspection reference and result' },
          { label: 'Violation / sanction', type: 'select', opts: ['— none —', 'Warning', 'Monetary fine', 'Non-monetary sanction', 'Legal proceeding'] },
          { label: 'Fine amount', type: 'number', unit: ['EGP', 'SAR', 'AED', 'USD'] },
          { label: 'Linked finding', type: 'select', opts: ['— none —', 'FND-2025-0002', 'FND-2025-0004'], help: 'Findings live in one unified register — never duplicated per screen.' },
          { label: 'Corrective action & closure', type: 'area', full: 1 }
        ]
      },

      /* ══ SOCIAL — guide §4 ══ */
      {
        key: 's-workforce', p: 'S', ic: '👷', en: 'Workforce & Employment', ar: 'القوى العاملة والتوظيف',
        purpose: { en: 'Headcount by gender, region and contract, non-employee workers, hires, turnover and parental leave — guide §4.1.', ar: 'العدد حسب الجنس والمنطقة والعقد، والعاملون من غير الموظفين، والتعيينات والدوران وإجازة الوالدية — دليل §4.1.' },
        kpiIds: ['GEN-EMP-001', 'GEN-EMP-002', 'SOC-EMP-001', 'SOC-EMP-002', 'SOC-EMP-004'],
        reuse: [['Gender × contract breakdown (2-7)', 'التفصيل حسب الجنس والعقد', 'data/catalog'], ['Site headcount', 'عدد العاملين بالموقع', 'org/sites'], ['Diversity & inclusion', 'التنوع والشمول', 'data/s-dei'], ['Compensation & benefits', 'الأجور والمزايا', 'data/s-comp']],
        cols: ['Record', 'Period', 'Entity', 'Category', 'Gender', 'Contract', 'Headcount'],
        rows: [
          ['WKF-2025-001', 'FY2025', 'LE-03', 'Employees', 'Male', 'Permanent', '402', 'EV-0025', 'K. Mansour', 'approved'],
          ['WKF-2025-002', 'FY2025', 'LE-03', 'Employees', 'Female', 'Permanent', '156', 'EV-0025', 'K. Mansour', 'approved'],
          ['WKF-2025-003', 'FY2025', 'LE-03', 'Employees', 'Male', 'Temporary', '58', 'EV-0025', 'K. Mansour', 'approved'],
          ['WKF-2025-004', 'FY2025', 'LE-03', 'Employees', 'Female', 'Temporary', '24', 'EV-0025', 'K. Mansour', 'approved'],
          ['WKF-2025-005', 'FY2025', 'LE-02', 'Employees', 'Not disclosed', 'Permanent', '6', 'EV-0025', 'K. Mansour', 'review'],
          ['WKF-2025-006', 'FY2025', 'ALL', 'Workers who are not employees', 'Male', 'Contractor', '214', 'EV-0025', 'K. Mansour', 'review'],
          ['WKF-2025-007', 'FY2025', 'ALL', 'New hires', 'Female', 'Permanent', '38', 'EV-0025', 'K. Mansour', 'submitted'],
          ['WKF-2025-008', 'FY2025', 'ALL', 'Departures', 'Male', 'Permanent', '61', 'EV-0025', 'K. Mansour', 'submitted'],
          ['WKF-2025-009', 'FY2025', 'ALL', 'Parental leave taken', 'Female', 'Permanent', '14', 'EV-0025', 'K. Mansour', 'progress'],
          ['WKF-2025-010', 'FY2025', 'ALL', 'Returned from parental leave', 'Female', 'Permanent', '12', 'EV-0025', 'K. Mansour', 'progress']
        ],
        form: [
          { s: ['Workforce', 'القوى العاملة', 'GRI 2-7 / 2-8 / 401-1 / 401-3'] },
          { label: 'Worker category', gri: '2-7', req: 1, type: 'select', opts: ['Employees', 'Workers who are not employees', 'New hires', 'Departures', 'Parental leave taken', 'Returned from parental leave'] },
          { label: 'Gender', req: 1, type: 'select', opts: ['Male', 'Female', 'Not disclosed', 'Other'] },
          { label: 'Contract type', req: 1, type: 'select', opts: ['Permanent', 'Temporary', 'Contractor', 'Agency', 'Apprentice'] },
          { label: 'Working time', req: 1, type: 'select', opts: ['Full-time', 'Part-time'] },
          { label: 'Age group', type: 'select', opts: ['Under 30', '30–50', 'Over 50'] },
          { label: 'Region / country', req: 1, type: 'select', opts: ['Egypt', 'Saudi Arabia', 'United Arab Emirates'] },
          { label: 'Job category', type: 'select', opts: ['Operations', 'Maintenance', 'Technical', 'Administration', 'Management', 'Senior management'] },
          { label: 'Headcount', req: 1, type: 'number', help: 'Head-count basis at end of period — the aggregation method is END_OF_PERIOD.' },
          { label: 'Reconciliation', value: 'Totals reconcile to the Sites register headcount — VR-SUM-001', ro: 1, pv: { k: 'reuse', t: 'Sites register', l: '#/org/sites' } }
        ]
      },
      {
        key: 's-dei', p: 'S', ic: '🤲', en: 'Diversity & Inclusion', ar: 'التنوع والشمول',
        purpose: { en: 'Diversity of governance bodies and employees, women in leadership and discrimination cases — guide §4.2.', ar: 'تنوع هيئات الحوكمة والموظفين، والنساء في القيادة، وحالات التمييز — دليل §4.2.' },
        kpiIds: ['SOC-DIV-001', 'SOC-DIV-002', 'SOC-DIV-004', 'SOC-NDS-001'],
        reuse: [['Women-in-management target', 'هدف النساء في الإدارة', 'data/targets'], ['Workforce headcount', 'أعداد القوى العاملة', 'data/s-workforce'], ['Board composition', 'تشكيل المجلس', 'data/g-board'], ['Gender pay ratio', 'نسبة الأجور بين الجنسين', 'data/s-comp']],
        cols: ['Record', 'Period', 'Body / level', 'Gender', 'Age group', 'Count', 'Share %'],
        rows: [
          ['DEI-2025-001', 'FY2025', 'Board of Directors', 'Female', '30–50', '2', '22.2%', 'EV-0025', 'K. Mansour', 'approved'],
          ['DEI-2025-002', 'FY2025', 'Board of Directors', 'Male', 'Over 50', '5', '55.6%', 'EV-0025', 'K. Mansour', 'approved'],
          ['DEI-2025-003', 'FY2025', 'Senior management', 'Female', '30–50', '4', '18.2%', 'EV-0025', 'K. Mansour', 'approved'],
          ['DEI-2025-004', 'FY2025', 'Middle management', 'Female', '30–50', '19', '24.1%', 'EV-0025', 'K. Mansour', 'review'],
          ['DEI-2025-005', 'FY2025', 'All employees', 'Female', 'Under 30', '61', '26.8%', 'EV-0025', 'K. Mansour', 'review'],
          ['DEI-2025-006', 'FY2025', 'All employees', 'Not disclosed', '—', '6', '0.9%', 'EV-0025', 'K. Mansour', 'submitted'],
          ['DEI-2025-007', 'FY2025', 'All employees — disability disclosure', 'Not disclosed', '—', '11', '1.6%', 'EV-0025', 'K. Mansour', 'progress'],
          ['DEI-2025-008', 'FY2025', 'Discrimination cases — substantiated', '—', '—', '0', '—', 'EV-0025', 'Y. Gaber', 'review']
        ],
        form: [
          { s: ['Diversity', 'التنوع', 'GRI 405-1 / 405-2 / 406-1'] },
          { label: 'Population', gri: '405-1', req: 1, type: 'select', opts: ['Board of Directors', 'Board committees', 'Senior management', 'Middle management', 'All employees', 'New hires'] },
          { label: 'Gender', req: 1, type: 'select', opts: ['Male', 'Female', 'Not disclosed', 'Other'] },
          { label: 'Age group', req: 1, type: 'select', opts: ['Under 30', '30–50', 'Over 50', '—'] },
          { label: 'Nationality group', type: 'select', opts: ['National', 'Expatriate', 'Not disclosed'], help: 'Collected only where lawful in the jurisdiction.' },
          { label: 'Employees with disabilities', type: 'number', help: 'Voluntary self-disclosure only, where lawful.' },
          { label: 'Count', req: 1, type: 'number' },
          { label: 'Share of population', type: 'number', unit: ['%'], help: 'Derived from count ÷ population — shown for review, not the stored value.' },
          { s: ['Discrimination & remediation', 'التمييز والمعالجة', 'GRI 406-1'] },
          { label: 'Incidents reported', type: 'number' },
          { label: 'Incidents substantiated', type: 'number' },
          { label: 'Corrective action / remediation', type: 'area', full: 1 }
        ]
      },
      {
        key: 's-comp', p: 'S', ic: '💰', en: 'Compensation & Benefits', ar: 'الأجور والمزايا',
        purpose: { en: 'Wages, benefits, living-wage comparison and pay ratios — guide §4.3. Executive pay is governed separately.', ar: 'الأجور والمزايا ومقارنة الأجر المعيشي ونسب الأجور — دليل §4.3. أجور التنفيذيين محكومة بشكل منفصل.' },
        kpiIds: ['SOC-EMP-003', 'SOC-DIV-003', 'GEN-GOV-003', 'GOV-MKT-001'],
        reuse: [['Executive compensation', 'أجور التنفيذيين', 'data/g-execcomp'], ['Diversity & inclusion', 'التنوع والشمول', 'data/s-dei'], ['Economic value distributed', 'القيمة الاقتصادية الموزعة', 'data/g-econ']],
        cols: ['Record', 'Period', 'Entity', 'Population', 'Measure', 'Value', 'Currency / unit'],
        rows: [
          ['CMP-2025-001', 'FY2025', 'LE-03', 'All employees', 'Total wages & benefits', '184,200,000', 'EGP', 'EV-0021', 'K. Mansour', 'approved'],
          ['CMP-2025-002', 'FY2025', 'LE-03', 'Entry level', 'Entry wage vs local minimum wage', '1.34', 'ratio', 'EV-0021', 'K. Mansour', 'approved'],
          ['CMP-2025-003', 'FY2025', 'LE-02', 'Entry level', 'Entry wage vs local minimum wage', '1.18', 'ratio', 'EV-0021', 'K. Mansour', 'approved'],
          ['CMP-2025-004', 'FY2025', 'ALL', 'All employees', 'Median total compensation', '96,400', 'EGP', 'EV-0021', 'K. Mansour', 'review'],
          ['CMP-2025-005', 'FY2025', 'ALL', 'Management', 'Remuneration ratio women : men', '0.94', 'ratio', 'EV-0021', 'K. Mansour', 'review'],
          ['CMP-2025-006', 'FY2025', 'ALL', 'All employees', 'Annual total compensation ratio (CEO : median)', '18.6', 'ratio', 'EV-0021', 'Y. Gaber', 'submitted'],
          ['CMP-2025-007', 'FY2025', 'ALL', 'Full-time employees', 'Benefits provided (health, life, retirement)', '100', '% covered', 'EV-0021', 'K. Mansour', 'review'],
          ['CMP-2025-008', 'FY2025', 'ALL', 'Temporary employees', 'Benefits provided (health only)', '62', '% covered', 'EV-0021', 'K. Mansour', 'progress']
        ],
        form: [
          { s: ['Compensation', 'الأجور', 'GRI 202-1 / 401-2 / 405-2 / 2-21'] },
          { label: 'Population', req: 1, type: 'select', opts: ['All employees', 'Entry level', 'Management', 'Senior management', 'Full-time employees', 'Temporary employees'] },
          { label: 'Measure', gri: '405-2', req: 1, type: 'select', opts: ['Total wages & benefits', 'Average compensation', 'Median total compensation', 'Entry wage vs local minimum wage', 'Living-wage comparison', 'Remuneration ratio women : men', 'Annual total compensation ratio (CEO : median)', 'Benefits provided'] },
          { label: 'Value', req: 1, type: 'number', unit: ['EGP', 'SAR', 'AED', 'USD', 'ratio', '%'] },
          { label: 'Gender split', type: 'select', opts: ['— not split —', 'Male', 'Female'] },
          { label: 'Job category', type: 'select', opts: ['— all —', 'Operations', 'Technical', 'Administration', 'Management'] },
          { label: 'Benefit types included', type: 'select', opts: ['Health insurance', 'Life insurance', 'Retirement provision', 'Parental benefits', 'Disability cover', 'All of the above'] },
          { label: 'Living-wage benchmark used', type: 'text', ph: 'Benchmark source and year, where assessed' }
        ]
      },
      {
        key: 's-ohs', p: 'S', ic: '🦺', en: 'Occupational Health & Safety', ar: 'الصحة والسلامة المهنية',
        purpose: { en: 'Hours worked, injuries, fatalities, ill health and leading indicators — guide §4.4. Every rate stores its numerator, denominator and formula.', ar: 'ساعات العمل والإصابات والوفيات والاعتلال والمؤشرات الاستباقية — دليل §4.4. كل معدّل يحفظ بسطه ومقامه ومعادلته.' },
        kpiT: ['Occupational Health & Safety'],
        reuse: [['TRIR calculation run', 'تشغيلة حساب TRIR', 'data/calcruns'], ['Safety target', 'هدف السلامة', 'data/targets'], ['Findings register', 'سجل الملاحظات', 'rev/findings'], ['Safety training hours', 'ساعات تدريب السلامة', 'data/s-training']],
        cols: ['Record', 'Period', 'Site', 'Worker type', 'Event / measure', 'Count', 'Lost days'],
        rows: [
          ['OHS-2025-001', 'FY2025', 'ALL', 'Employees', 'Hours worked (denominator)', '1,418,000', '—', 'EV-0025', 'A. Qassem', 'approved'],
          ['OHS-2025-002', 'FY2025', 'ALL', 'Contractors', 'Hours worked (denominator)', '486,000', '—', 'EV-0025', 'A. Qassem', 'approved'],
          ['OHS-2025-003', 'FY2025', 'ALL', 'Employees', 'Work-related fatalities', '0', '0', 'EV-0025', 'A. Qassem', 'approved'],
          ['OHS-2025-004', '2025-06', 'EG-CEM-01', 'Employees', 'Lost-time injury — hand laceration', '1', '12', 'EV-0025', 'A. Qassem', 'approved'],
          ['OHS-2025-005', '2025-08', 'EG-QRY-01', 'Contractors', 'Lost-time injury — ankle fracture', '1', '28', 'EV-0025', 'A. Qassem', 'approved'],
          ['OHS-2025-006', 'FY2025', 'ALL', 'Employees', 'Recordable work-related injuries', '10', '54', 'EV-0025', 'A. Qassem', 'review'],
          ['OHS-2025-007', 'FY2025', 'ALL', 'Employees', 'High-consequence injuries (excl. fatalities)', '1', '28', 'EV-0025', 'A. Qassem', 'review'],
          ['OHS-2025-008', 'FY2025', 'ALL', 'Employees', 'Work-related ill health', '2', '9', 'EV-0025', 'A. Qassem', 'submitted'],
          ['OHS-2025-009', 'FY2025', 'ALL', 'Employees & contractors', 'Near misses reported (leading)', '184', '—', 'EV-0025', 'A. Qassem', 'review'],
          ['OHS-2025-010', 'FY2025', 'ALL', 'Employees & contractors', 'Workers covered by the OHS management system', '672', '—', 'EV-0025', 'A. Qassem', 'progress']
        ],
        form: [
          { s: ['Event or measure', 'الحدث أو القياس', 'GRI 403-9 / 403-10'] },
          { label: 'Record type', gri: '403-9', req: 1, type: 'select', opts: ['Hours worked (denominator)', 'Work-related fatalities', 'High-consequence injury', 'Recordable injury', 'Lost-time injury', 'Work-related ill health', 'Near miss', 'Dangerous occurrence', 'Coverage of the OHS management system'] },
          { label: 'Worker type', req: 1, type: 'select', opts: ['Employees', 'Contractors', 'Employees & contractors'], help: 'Employees and non-employee workers are disclosed separately — never merged silently.' },
          { label: 'Count', req: 1, type: 'number' },
          { label: 'Hours worked', type: 'number', unit: ['hours'], help: 'The denominator is stored on the record — rates are never typed.' },
          { label: 'Lost days', type: 'number', unit: ['days'] },
          { s: ['Incident detail', 'تفاصيل الحادث', 'per-incident fields — guide §4.4'] },
          { label: 'Date & time', type: 'date' },
          { label: 'Activity at the time', type: 'text', ph: 'Task being performed' },
          { label: 'Injury type', type: 'select', opts: ['— not an injury —', 'Laceration', 'Fracture', 'Burn', 'Crush', 'Fall from height', 'Struck by object', 'Chemical exposure', 'Heat stress'] },
          { label: 'Severity', type: 'select', opts: ['First aid only', 'Medical treatment', 'Lost time', 'High consequence', 'Fatality'] },
          { label: 'Root cause', type: 'area', full: 1 },
          { label: 'Immediate action', type: 'area', full: 1 },
          { label: 'Corrective / preventive action', type: 'area', full: 1 },
          { label: 'Closure status', type: 'select', opts: ['Open', 'Action in progress', 'Closed'] }
        ]
      },
      {
        key: 's-training', p: 'S', ic: '🎓', en: 'Training & Development', ar: 'التدريب والتطوير',
        purpose: { en: 'Training hours by gender and category, completion of mandatory ESG training, reviews and development programmes — guide §4.5.', ar: 'ساعات التدريب حسب الجنس والفئة، وإتمام التدريب الإلزامي، والمراجعات وبرامج التطوير — دليل §4.5.' },
        kpiT: ['Training & Education'],
        reuse: [['Safety training (OHS)', 'تدريب السلامة', 'data/s-ohs'], ['Human-rights training', 'تدريب حقوق الإنسان', 'data/s-hr'], ['Anti-corruption training', 'تدريب مكافحة الفساد', 'data/g-acorr'], ['Attendance evidence', 'أدلة الحضور', 'data/evid']],
        cols: ['Record', 'Period', 'Topic', 'Job category', 'Gender', 'Employees trained', 'Hours'],
        rows: [
          ['TRN-2025-001', 'FY2025', 'Health & safety — mandatory', 'Operations', 'Male', '388', '6,208', 'EV-0025', 'A. Qassem', 'approved'],
          ['TRN-2025-002', 'FY2025', 'Health & safety — mandatory', 'Operations', 'Female', '96', '1,536', 'EV-0025', 'A. Qassem', 'approved'],
          ['TRN-2025-003', 'FY2025', 'Anti-corruption & ethics — mandatory', 'All categories', 'Male', '402', '804', 'EV-0025', 'Y. Gaber', 'approved'],
          ['TRN-2025-004', 'FY2025', 'Anti-corruption & ethics — mandatory', 'All categories', 'Female', '156', '312', 'EV-0025', 'Y. Gaber', 'approved'],
          ['TRN-2025-005', 'FY2025', 'Human rights', 'Management', 'Male', '58', '232', 'EV-0025', 'K. Mansour', 'review'],
          ['TRN-2025-006', 'FY2025', 'Environmental awareness', 'Operations', 'Male', '214', '428', 'EV-0025', 'R. Barakat', 'review'],
          ['TRN-2025-007', 'FY2025', 'Data privacy & cybersecurity', 'Administration', 'Female', '84', '168', 'EV-0025', 'K. Mansour', 'submitted'],
          ['TRN-2025-008', 'FY2025', 'Leadership development', 'Management', 'Female', '19', '456', 'EV-0025', 'K. Mansour', 'progress'],
          ['TRN-2025-009', 'FY2025', 'Performance & career review completed', 'All categories', 'Male', '402', '—', 'EV-0025', 'K. Mansour', 'review'],
          ['TRN-2025-010', 'FY2025', 'Apprenticeship — solar technician', 'Technical', 'Male', '35', '2,800', 'EV-0025', 'N. Fouad', 'progress']
        ],
        form: [
          { s: ['Training', 'التدريب', 'GRI 404-1 / 404-2 / 404-3'] },
          { label: 'Training topic', gri: '404-1', req: 1, type: 'select', opts: ['Health & safety — mandatory', 'Anti-corruption & ethics — mandatory', 'Human rights', 'Data privacy & cybersecurity', 'Environmental awareness', 'ESG reporting & data quality', 'Technical / skills', 'Leadership development', 'Apprenticeship', 'Performance & career review completed'] },
          { label: 'Mandatory?', req: 1, type: 'select', opts: ['Mandatory', 'Voluntary'] },
          { label: 'Job category', req: 1, type: 'select', opts: ['All categories', 'Operations', 'Maintenance', 'Technical', 'Administration', 'Management', 'Senior management'] },
          { label: 'Gender', req: 1, type: 'select', opts: ['Male', 'Female', 'Not disclosed', '— not split —'] },
          { label: 'Employees trained', req: 1, type: 'number' },
          { label: 'Total training hours', req: 1, type: 'number', unit: ['hours'], help: 'Hours per employee is derived at the KPI, never typed here.' },
          { label: 'Completion rate', type: 'number', unit: ['%'] },
          { label: 'Training provider', type: 'select', opts: ['Internal', 'External accredited provider', 'Regulator / authority', 'Online platform'] },
          { label: 'Training cost', type: 'number', unit: ['EGP', 'SAR', 'USD'] }
        ]
      },
      {
        key: 's-hr', p: 'S', ic: '🕊', en: 'Human Rights', ar: 'حقوق الإنسان',
        purpose: { en: 'Due diligence, operations and suppliers assessed for risk, salient issues and remediation — guide §4.6.', ar: 'العناية الواجبة، والعمليات والموردون المقيَّمون للمخاطر، والقضايا البارزة والمعالجة — دليل §4.6.' },
        kpiT: ['Human Rights Assessment', 'Labor & Supply-chain Human Rights'],
        reuse: [['Human-rights impacts', 'تأثيرات حقوق الإنسان', 'mat/impacts'], ['Supplier assessments', 'تقييم الموردين', 'data/g-supp'], ['Grievance mechanism', 'آلية التظلم', 'data/g-whistle'], ['Human-rights training', 'تدريب حقوق الإنسان', 'data/s-training']],
        cols: ['Record', 'Period', 'Scope assessed', 'Salient issue', 'Operations / suppliers', 'At risk', 'Remediation'],
        rows: [
          ['HRT-2025-001', 'FY2025', 'Own operations — all sites', 'Freedom of association', '6', '0', '— none required', 'EV-0025', 'K. Mansour', 'approved'],
          ['HRT-2025-002', 'FY2025', 'Own operations — all sites', 'Child labour', '6', '0', '— none required', 'EV-0025', 'K. Mansour', 'approved'],
          ['HRT-2025-003', 'FY2025', 'Suppliers — logistics tier 1', 'Forced labour', '18', '2', 'Corrective action plan issued', 'EV-0025', 'Y. Gaber', 'review'],
          ['HRT-2025-004', 'FY2025', 'Suppliers — raw materials tier 1', 'Working conditions', '24', '1', 'Audit scheduled Q1 2026', 'EV-0025', 'Y. Gaber', 'review'],
          ['HRT-2025-005', 'FY2025', 'Own operations — quarry', 'Security personnel conduct', '1', '0', 'Training completed — 100%', 'EV-0025', 'A. Qassem', 'approved'],
          ['HRT-2025-006', 'FY2025', 'Own operations — all sites', 'Rights of Indigenous Peoples', '6', '0', 'Not applicable in operating geographies', 'EV-0025', 'N. Fouad', 'submitted'],
          ['HRT-2025-007', 'FY2025', 'Investment agreements', 'Human-rights clauses included', '4', '—', '3 of 4 agreements carry clauses', 'EV-0025', 'Y. Gaber', 'progress'],
          ['HRT-2025-008', 'FY2025', 'Own operations — all sites', 'Discrimination', '6', '0', '— none required', 'EV-0025', 'K. Mansour', 'review']
        ],
        form: [
          { s: ['Due diligence', 'العناية الواجبة', 'GRI 407 / 408 / 409 / 410 / 411 / 412'] },
          { label: 'Scope assessed', req: 1, type: 'select', opts: ['Own operations — all sites', 'Own operations — single site', 'Suppliers — raw materials tier 1', 'Suppliers — logistics tier 1', 'Suppliers — beyond tier 1', 'Investment agreements', 'Joint ventures'] },
          { label: 'Salient issue', gri: '412-1', req: 1, type: 'select', opts: ['Freedom of association', 'Collective bargaining', 'Child labour', 'Forced labour', 'Working conditions', 'Discrimination', 'Harassment', 'Security personnel conduct', 'Rights of Indigenous Peoples', 'Land rights'] },
          { label: 'Operations / suppliers assessed', req: 1, type: 'number' },
          { label: 'Identified at significant risk', req: 1, type: 'number' },
          { label: 'Assessment method', type: 'select', opts: ['Desk screening', 'Self-assessment questionnaire', 'On-site audit', 'Third-party audit', 'Worker interviews'] },
          { label: 'Complaints received', type: 'number' },
          { label: 'Complaints substantiated', type: 'number' },
          { label: 'Remediation provided', type: 'area', full: 1, ph: 'Action taken, by whom and by when' },
          { label: 'Linked impact', type: 'select', opts: ['— none —', 'IM-13 Supplier labor practices in logistics chain', 'IM-11 Heat stress for outdoor workers'], help: 'Impacts live once in the Impact Universe — this is a link, not a copy.' }
        ]
      },
      {
        key: 's-labor', p: 'S', ic: '🤝', en: 'Labor Practices', ar: 'ممارسات العمل',
        purpose: { en: 'Working hours, collective bargaining coverage, notice periods, worker representation and labour disputes — guide §4.7.', ar: 'ساعات العمل وتغطية المفاوضة الجماعية وفترات الإشعار وتمثيل العمال ونزاعات العمل — دليل §4.7.' },
        kpiIds: ['SOC-LMR-001', 'GEN-STK-001'],
        reuse: [['Human rights due diligence', 'العناية الواجبة لحقوق الإنسان', 'data/s-hr'], ['Grievance mechanism', 'آلية التظلم', 'data/g-whistle'], ['Workforce headcount', 'أعداد القوى العاملة', 'data/s-workforce']],
        cols: ['Record', 'Period', 'Entity', 'Measure', 'Value', 'Unit', 'Note'],
        rows: [
          ['LAB-2025-001', 'FY2025', 'LE-03', 'Employees covered by collective bargaining', '486', 'employees', '74.6% of LE-03 workforce', 'EV-0025', 'K. Mansour', 'approved'],
          ['LAB-2025-002', 'FY2025', 'LE-02', 'Employees covered by collective bargaining', '0', 'employees', 'No union presence in jurisdiction', 'EV-0025', 'K. Mansour', 'approved'],
          ['LAB-2025-003', 'FY2025', 'ALL', 'Minimum notice period for operational changes', '4', 'weeks', 'Per Egyptian labour law', 'EV-0025', 'Y. Gaber', 'approved'],
          ['LAB-2025-004', 'FY2025', 'ALL', 'Average weekly working hours', '45', 'hours', 'Within statutory limit', 'EV-0025', 'K. Mansour', 'review'],
          ['LAB-2025-005', 'FY2025', 'EG-CEM-01', 'Overtime hours', '61,400', 'hours', 'Monitored against the 12-hour weekly cap', 'EV-0025', 'K. Mansour', 'review'],
          ['LAB-2025-006', 'FY2025', 'ALL', 'Absenteeism rate', '2.8', '%', 'Certified absence only', 'EV-0025', 'K. Mansour', 'submitted'],
          ['LAB-2025-007', 'FY2025', 'ALL', 'Labour disputes raised', '3', 'cases', 'All resolved within the period', 'EV-0025', 'Y. Gaber', 'review'],
          ['LAB-2025-008', 'FY2025', 'ALL', 'Worker representation committees', '4', 'committees', 'One per operating site', 'EV-0025', 'K. Mansour', 'progress']
        ],
        form: [
          { s: ['Labour practice', 'ممارسة العمل', 'GRI 2-30 / 402-1 / 407-1'] },
          { label: 'Measure', gri: '2-30', req: 1, type: 'select', opts: ['Employees covered by collective bargaining', 'Minimum notice period for operational changes', 'Average weekly working hours', 'Overtime hours', 'Rest periods provided', 'Absenteeism rate', 'Labour disputes raised', 'Worker representation committees', 'Living-wage assessment completed'] },
          { label: 'Value', req: 1, type: 'number', unit: ['employees', 'weeks', 'hours', '%', 'cases', 'committees'] },
          { label: 'Employee representation body', type: 'select', opts: ['— none —', 'Trade union', 'Works council', 'Site worker committee', 'Joint H&S committee'] },
          { label: 'Grievance mechanism available?', req: 1, type: 'select', opts: ['Yes — anonymous channel', 'Yes — named channel only', 'No'] },
          { label: 'Disputes resolved', type: 'number' },
          { label: 'Violations identified', type: 'number' },
          { label: 'Corrective action', type: 'area', full: 1 }
        ]
      },
      {
        key: 's-comm', p: 'S', ic: '🏘', en: 'Communities', ar: 'المجتمعات المحلية',
        purpose: { en: 'Engagement programmes, impact assessments, grievances and community investment — guide §4.8.', ar: 'برامج الإشراك وتقييمات الأثر والتظلمات والاستثمار المجتمعي — دليل §4.8.' },
        kpiT: ['Local Communities'],
        reuse: [['Community programmes (413-1)', 'برامج المجتمع', 'data/catalog'], ['Stakeholder map', 'خريطة أصحاب المصلحة', 'mat/stake'], ['Engagement records', 'سجلات الإشراك', 'mat/engage'], ['Biodiversity & land', 'التنوع البيولوجي والأراضي', 'data/e-biodiv']],
        cols: ['Record', 'Period', 'Site', 'Community / group', 'Activity', 'Beneficiaries', 'Investment'],
        rows: [
          ['COM-2025-001', 'FY2025', 'EG-QRY-01', 'Suez quarry-adjacent villages', 'Dust mitigation & monitoring programme', '~4,200 residents', 'EGP 3,100,000', 'EV-0025', 'N. Fouad', 'approved'],
          ['COM-2025-002', 'FY2025', 'SA-SOL-01', 'Sudair regional workforce', 'Solar-tech apprenticeship', '35 trainees', 'SAR 1,240,000', 'EV-0025', 'N. Fouad', 'approved'],
          ['COM-2025-003', 'FY2025', 'EG-CEM-01', '10th of Ramadan municipality', 'Local infrastructure — road resurfacing', '~11,000 residents', 'EGP 2,400,000', 'EV-0025', 'N. Fouad', 'approved'],
          ['COM-2025-004', 'FY2025', 'EG-QRY-01', 'Suez quarry-adjacent villages', 'Community impact assessment', '—', '—', 'EV-0025', 'N. Fouad', 'review'],
          ['COM-2025-005', 'FY2025', 'EG-QRY-01', 'Suez quarry-adjacent villages', 'Grievances received — dust & blasting noise', '9 complaints', '—', 'EV-0025', 'N. Fouad', 'review'],
          ['COM-2025-006', 'FY2025', 'EG-QRY-01', 'Suez quarry-adjacent villages', 'Grievances resolved', '7 of 9 closed', '—', 'EV-0025', 'N. Fouad', 'submitted'],
          ['COM-2025-007', 'FY2025', 'ALL', 'Group-wide', 'Employee volunteering', '1,840 hours', '—', 'EV-0025', 'N. Fouad', 'progress'],
          ['COM-2025-008', 'FY2025', 'EG-CEM-01', 'Local schools', 'Education & scholarship programme', '120 students', 'EGP 640,000', 'EV-0025', 'N. Fouad', 'progress']
        ],
        form: [
          { s: ['Community engagement', 'الإشراك المجتمعي', 'GRI 413-1 / 413-2'] },
          { label: 'Community / stakeholder group', gri: '413-1', req: 1, type: 'text', ph: 'Named group, not "the community"' },
          { label: 'Activity type', req: 1, type: 'select', opts: ['Engagement / consultation', 'Community impact assessment', 'Social investment programme', 'Local infrastructure', 'Education programme', 'Healthcare programme', 'Employee volunteering', 'Grievance handling', 'Emergency support'] },
          { label: 'Impact direction', type: 'select', opts: ['Positive', 'Negative — mitigation recorded', 'Both'] },
          { label: 'Beneficiaries', type: 'text', ph: 'Number and description' },
          { label: 'Community investment', type: 'number', unit: ['EGP', 'SAR', 'AED', 'USD'] },
          { label: 'Volunteer hours', type: 'number', unit: ['hours'] },
          { label: 'Local employment / procurement effect', type: 'text', ph: 'Jobs or spend directed locally' },
          { s: ['Grievances', 'التظلمات', 'guide §4.8'] },
          { label: 'Grievances received', type: 'number' },
          { label: 'Grievances resolved', type: 'number' },
          { label: 'Resolution status & mitigation', type: 'area', full: 1 },
          { label: 'Land / resettlement / cultural heritage', type: 'select', opts: ['— not applicable —', 'Land rights engagement', 'Resettlement', 'Cultural heritage protection'] }
        ]
      },
      {
        key: 's-cust', p: 'S', ic: '🛒', en: 'Customers & Products', ar: 'العملاء والمنتجات',
        purpose: { en: 'Product health & safety assessments, recalls, labeling and marketing compliance, and customer complaints — guide §4.9.', ar: 'تقييمات صحة وسلامة المنتج والاسترجاعات والامتثال في البطاقات والتسويق وشكاوى العملاء — دليل §4.9.' },
        kpiT: ['Customer H&S, Marketing & Labeling'],
        reuse: [['Customer privacy', 'خصوصية العملاء', 'data/s-priv'], ['Compliance register', 'سجل الامتثال', 'data/g-comp'], ['Findings register', 'سجل الملاحظات', 'rev/findings']],
        cols: ['Record', 'Period', 'Product category', 'Measure', 'Count', 'Outcome', 'Regulatory action'],
        rows: [
          ['CUS-2025-001', 'FY2025', 'Bagged cement — all grades', 'Product categories assessed for health & safety', '100%', 'Assessed — safety data sheets current', 'None', 'EV-0025', 'Y. Gaber', 'approved'],
          ['CUS-2025-002', 'FY2025', 'Bulk cement', 'Product categories assessed for health & safety', '100%', 'Assessed', 'None', 'EV-0025', 'Y. Gaber', 'approved'],
          ['CUS-2025-003', 'FY2025', 'Aggregates', 'Product categories assessed for health & safety', '100%', 'Assessed', 'None', 'EV-0025', 'Y. Gaber', 'approved'],
          ['CUS-2025-004', 'FY2025', 'All products', 'Non-compliance — product health & safety', '0', 'No incidents', 'None', 'EV-0025', 'Y. Gaber', 'approved'],
          ['CUS-2025-005', 'FY2025', 'Bagged cement', 'Non-compliance — product information & labeling', '1', 'Chromium-VI warning text corrected', 'Warning — no fine', 'EV-0025', 'Y. Gaber', 'review'],
          ['CUS-2025-006', 'FY2025', 'All products', 'Non-compliance — marketing communications', '0', 'No incidents', 'None', 'EV-0025', 'Y. Gaber', 'review'],
          ['CUS-2025-007', 'FY2025', 'Bagged cement', 'Product recalls', '0', 'No recalls', 'None', 'EV-0025', 'Y. Gaber', 'submitted'],
          ['CUS-2025-008', 'FY2025', 'All products', 'Customer complaints — quality', '41', '38 resolved within 14 days', 'None', 'EV-0025', 'Y. Gaber', 'progress']
        ],
        form: [
          { s: ['Product & customer', 'المنتج والعميل', 'GRI 416-1 / 416-2 / 417-2 / 417-3'] },
          { label: 'Product / service category', gri: '416-1', req: 1, type: 'select', opts: ['Bagged cement — all grades', 'Bulk cement', 'Aggregates', 'Renewable electricity', 'All products'] },
          { label: 'Measure', req: 1, type: 'select', opts: ['Product categories assessed for health & safety', 'Non-compliance — product health & safety', 'Non-compliance — product information & labeling', 'Non-compliance — marketing communications', 'Product recalls', 'Customer complaints — quality', 'Customer satisfaction score'] },
          { label: 'Count / share', req: 1, type: 'number', unit: ['count', '%'] },
          { label: 'Complaint category', type: 'select', opts: ['— not a complaint —', 'Product quality', 'Delivery', 'Labeling', 'Safety', 'Billing'] },
          { label: 'Average resolution time', type: 'number', unit: ['days'] },
          { label: 'Regulatory action', req: 1, type: 'select', opts: ['None', 'Warning — no fine', 'Monetary fine', 'Non-monetary sanction'] },
          { label: 'Outcome / corrective action', type: 'area', full: 1 },
          { label: 'Accessibility & labeling requirements met', type: 'select', opts: ['Yes', 'Partly — action open', 'Not applicable'] }
        ]
      },
      {
        key: 's-priv', p: 'S', ic: '🔐', en: 'Customer Privacy', ar: 'خصوصية العملاء',
        purpose: { en: 'Substantiated privacy complaints, identified leaks and losses of customer data, and regulator notifications — guide §4.10.', ar: 'شكاوى الخصوصية المثبتة، وحالات التسريب أو الفقد المحددة لبيانات العملاء، وإخطارات الجهات التنظيمية — دليل §4.10.' },
        kpiT: ['Customer Privacy'],
        reuse: [['Cybersecurity incidents', 'حوادث الأمن السيبراني', 'data/g-cyber'], ['Privacy training', 'تدريب الخصوصية', 'data/s-training'], ['Compliance register', 'سجل الامتثال', 'data/g-comp']],
        cols: ['Record', 'Period', 'Complaint / incident source', 'Type', 'Count', 'Records affected', 'Regulator notified'],
        rows: [
          ['PRV-2025-001', 'FY2025', 'Customers directly', 'Privacy complaints received', '4', '—', 'No', 'EV-0025', 'Y. Gaber', 'approved'],
          ['PRV-2025-002', 'FY2025', 'Customers directly', 'Privacy complaints substantiated', '1', '—', 'No', 'EV-0025', 'Y. Gaber', 'approved'],
          ['PRV-2025-003', 'FY2025', 'Regulatory bodies', 'Complaints from regulators', '0', '—', 'Not applicable', 'EV-0025', 'Y. Gaber', 'approved'],
          ['PRV-2025-004', '2025-07', 'Internal detection', 'Leak / loss of customer data', '1', '212', 'Yes — within 72 hours', 'EV-0025', 'Y. Gaber', 'review'],
          ['PRV-2025-005', 'FY2025', 'Third-party processor', 'Leak / loss of customer data', '0', '0', 'Not applicable', 'EV-0025', 'Y. Gaber', 'review'],
          ['PRV-2025-006', 'FY2025', 'Internal audit', 'Privacy governance review — AF-12 follow-up', '1', '—', 'No', 'EV-0025', 'Y. Gaber', 'submitted'],
          ['PRV-2025-007', 'FY2025', 'Community grievance records', 'Data-minimisation review', '1', '—', 'No', 'EV-0025', 'N. Fouad', 'progress']
        ],
        form: [
          { s: ['Privacy complaint or incident', 'شكوى أو حادث خصوصية', 'GRI 418-1'] },
          { label: 'Record type', gri: '418-1', req: 1, type: 'select', opts: ['Privacy complaints received', 'Privacy complaints substantiated', 'Complaints from regulators', 'Leak / loss of customer data', 'Privacy governance review'] },
          { label: 'Source', req: 1, type: 'select', opts: ['Customers directly', 'Regulatory bodies', 'Internal detection', 'Internal audit', 'Third-party processor'] },
          { label: 'Count', req: 1, type: 'number' },
          { label: 'Records affected', type: 'number', help: 'Number of individuals whose data was affected.' },
          { label: 'Data categories affected', type: 'select', opts: ['— none —', 'Contact details', 'Financial data', 'Identity documents', 'Special-category data'] },
          { label: 'Incident severity', type: 'select', opts: ['— not an incident —', 'Low', 'Medium', 'High', 'Critical'] },
          { label: 'Regulator notified', req: 1, type: 'select', opts: ['Not applicable', 'Yes — within 72 hours', 'Yes — late', 'No — assessed as not notifiable'] },
          { label: 'Root cause', type: 'area', full: 1 },
          { label: 'Corrective action & closure', type: 'area', full: 1 }
        ]
      },

      /* ══ GOVERNANCE — guide §5 ══ */
      {
        key: 'g-board', p: 'G', ic: '🏛', en: 'Board & Governance Structure', ar: 'المجلس وهيكل الحوكمة',
        purpose: { en: 'Composition of the highest governance body, committees, independence, attendance and ESG oversight — guide §5.1.', ar: 'تشكيل أعلى هيئة حوكمة واللجان والاستقلالية والحضور والإشراف على الاستدامة — دليل §5.1.' },
        kpiIds: ['GEN-GOV-001', 'GEN-GOV-002'],
        reuse: [['Board diversity', 'تنوع المجلس', 'data/s-dei'], ['Executive compensation', 'أجور التنفيذيين', 'data/g-execcomp'], ['Governance approval of topics', 'اعتماد الموضوعات', 'mat/approval'], ['Roles & SoD matrix', 'الأدوار وفصل المهام', 'adm/ausers']],
        cols: ['Record', 'Member / body', 'Role', 'Executive?', 'Independent?', 'Committees', 'Meetings attended'],
        rows: [
          ['BRD-2025-001', 'Dr. Selim Aziz', 'Chair of the Board', 'Non-executive', 'Independent', 'Sustainability · Audit', '8 of 8', 'EV-0027', 'Y. Gaber', 'approved'],
          ['BRD-2025-002', 'Layla Al-Harbi', 'Board member', 'Non-executive', 'Independent', 'Sustainability', '8 of 8', 'EV-0027', 'Y. Gaber', 'approved'],
          ['BRD-2025-003', 'Hassan Mourad', 'Chief Executive Officer', 'Executive', 'Not independent', '—', '8 of 8', 'EV-0027', 'Y. Gaber', 'approved'],
          ['BRD-2025-004', 'Amira Fahmy', 'Chief Financial Officer', 'Executive', 'Not independent', 'Audit', '7 of 8', 'EV-0027', 'Y. Gaber', 'approved'],
          ['BRD-2025-005', 'Tarek Nabil', 'Board member', 'Non-executive', 'Independent', 'Audit · Remuneration', '7 of 8', 'EV-0027', 'Y. Gaber', 'review'],
          ['BRD-2025-006', 'Huda Rashed', 'Board member', 'Non-executive', 'Independent', 'Remuneration', '6 of 8', 'EV-0027', 'Y. Gaber', 'review'],
          ['BRD-2025-007', 'Sustainability Committee', 'Board committee', '—', '—', 'ESG oversight mandate', '4 meetings held', 'EV-0027', 'Y. Gaber', 'submitted'],
          ['BRD-2025-008', 'Audit Committee', 'Board committee', '—', '—', 'ESG data assurance oversight', '4 meetings held', 'EV-0027', 'Y. Gaber', 'progress'],
          ['BRD-2025-009', 'Board — conflicts of interest', 'Register', '—', '—', 'Declared and minuted', '2 declarations', 'EV-0027', 'Y. Gaber', 'progress']
        ],
        form: [
          { s: ['Governance body', 'هيئة الحوكمة', 'GRI 2-9 / 2-10 / 2-11 / 2-12 / 2-15'] },
          { label: 'Record type', gri: '2-9', req: 1, type: 'select', opts: ['Board member', 'Board committee', 'Executive officer', 'Conflict-of-interest declaration'] },
          { label: 'Name / body', req: 1, type: 'text' },
          { label: 'Role', req: 1, type: 'select', opts: ['Chair of the Board', 'Board member', 'Chief Executive Officer', 'Chief Financial Officer', 'Committee', 'Company Secretary'] },
          { label: 'Executive status', req: 1, type: 'select', opts: ['Executive', 'Non-executive', '—'] },
          { label: 'Independence', gri: '2-11', req: 1, type: 'select', opts: ['Independent', 'Not independent', '—'] },
          { label: 'Committee membership', type: 'select', opts: ['— none —', 'Sustainability', 'Audit', 'Remuneration', 'Nomination', 'Risk'] },
          { label: 'Tenure (years)', type: 'number' },
          { label: 'Skills & experience', type: 'area', full: 1, ph: 'Competencies relevant to the impacts of the organization' },
          { label: 'Meetings held / attended', type: 'text', ph: 'e.g. 8 of 8' },
          { s: ['ESG oversight', 'الإشراف على الاستدامة', 'GRI 2-12 / 2-13 / 2-14'] },
          { label: 'ESG responsibility', req: 1, type: 'select', opts: ['Reviews and approves the sustainability report', 'Oversees impact management', 'Delegated to management', 'No ESG responsibility'] },
          { label: 'Board review of ESG performance', type: 'date' },
          { label: 'Conflicts of interest declared', type: 'area', full: 1 }
        ]
      },
      {
        key: 'g-execcomp', p: 'G', ic: '📑', en: 'Executive Compensation', ar: 'أجور التنفيذيين',
        purpose: { en: 'Executive pay components, ESG-linked compensation and pay ratios — guide §5.2. Workforce pay is collected on the Compensation screen.', ar: 'مكوّنات أجور التنفيذيين والأجر المرتبط بالاستدامة ونسب الأجور — دليل §5.2. أجور القوى العاملة تُجمع في شاشة الأجور.' },
        kpiIds: ['GEN-GOV-003', 'GOV-ECO-003'],
        reuse: [['Workforce compensation', 'أجور القوى العاملة', 'data/s-comp'], ['Board & committees', 'المجلس واللجان', 'data/g-board'], ['ESG targets used as criteria', 'الأهداف المستخدمة كمعايير', 'data/targets']],
        cols: ['Record', 'Period', 'Role', 'Component', 'Amount', 'Currency', 'ESG-linked?'],
        rows: [
          ['EXC-2025-001', 'FY2025', 'Chief Executive Officer', 'Base salary', '4,800,000', 'EGP', 'No', 'EV-0027', 'Y. Gaber', 'approved'],
          ['EXC-2025-002', 'FY2025', 'Chief Executive Officer', 'Annual bonus', '1,920,000', 'EGP', 'Yes — 20% weighting', 'EV-0027', 'Y. Gaber', 'approved'],
          ['EXC-2025-003', 'FY2025', 'Chief Executive Officer', 'Long-term incentive', '2,400,000', 'EGP', 'Yes — 15% weighting', 'EV-0027', 'Y. Gaber', 'approved'],
          ['EXC-2025-004', 'FY2025', 'Chief Financial Officer', 'Base salary', '3,400,000', 'EGP', 'No', 'EV-0027', 'Y. Gaber', 'approved'],
          ['EXC-2025-005', 'FY2025', 'Chief Financial Officer', 'Annual bonus', '1,020,000', 'EGP', 'Yes — 10% weighting', 'EV-0027', 'Y. Gaber', 'review'],
          ['EXC-2025-006', 'FY2025', 'Executive team', 'Retirement & defined benefit obligation', '2,180,000', 'EGP', 'No', 'EV-0027', 'Y. Gaber', 'review'],
          ['EXC-2025-007', 'FY2025', 'Chief Executive Officer', 'Annual total compensation ratio (CEO : median)', '18.6', 'ratio', '—', 'EV-0027', 'Y. Gaber', 'submitted'],
          ['EXC-2025-008', 'FY2025', 'Executive team', 'Clawback provision invoked', '0', 'count', '—', 'EV-0027', 'Y. Gaber', 'progress']
        ],
        form: [
          { s: ['Remuneration', 'المكافآت', 'GRI 2-19 / 2-20 / 2-21'] },
          { label: 'Role', gri: '2-19', req: 1, type: 'select', opts: ['Chief Executive Officer', 'Chief Financial Officer', 'Chief Operating Officer', 'Executive team', 'Non-executive directors'] },
          { label: 'Component', req: 1, type: 'select', opts: ['Base salary', 'Annual bonus', 'Long-term incentive', 'Benefits', 'Retirement & defined benefit obligation', 'Termination payment', 'Annual total compensation ratio (CEO : median)', 'Clawback provision invoked'] },
          { label: 'Amount', req: 1, type: 'number', unit: ['EGP', 'SAR', 'USD', 'ratio', 'count'] },
          { label: 'ESG-linked?', gri: '2-19', req: 1, type: 'select', opts: ['No', 'Yes — 10% weighting', 'Yes — 15% weighting', 'Yes — 20% weighting'] },
          { label: 'ESG performance criteria', type: 'select', opts: ['— none —', 'TGT-01 GHG reduction', 'TGT-03 TRIR reduction', 'TGT-04 Women in management', 'Composite ESG scorecard'], help: 'Criteria reference approved targets — never a free-text goal.' },
          { label: 'Target achievement', type: 'number', unit: ['%'] },
          { label: 'Approval body', req: 1, type: 'select', opts: ['Remuneration Committee', 'Board of Directors', 'General Assembly'] },
          { label: 'Approval date', type: 'date' },
          { label: 'Clawback mechanism in place?', type: 'select', opts: ['Yes', 'No'] }
        ]
      },
      {
        key: 'g-ethics', p: 'G', ic: '⚜️', en: 'Ethics & Code of Conduct', ar: 'الأخلاقيات ومدونة السلوك',
        purpose: { en: 'Code of conduct, conflict-of-interest and gifts policies, ethics training and confirmed cases — guide §5.3.', ar: 'مدونة السلوك وسياسات تضارب المصالح والهدايا وتدريب الأخلاقيات والحالات المؤكدة — دليل §5.3.' },
        kpiIds: ['GOV-ETH-002'],
        reuse: [['Anti-corruption & bribery', 'مكافحة الفساد والرشوة', 'data/g-acorr'], ['Whistleblowing channel', 'قناة الإبلاغ', 'data/g-whistle'], ['Ethics training hours', 'ساعات تدريب الأخلاقيات', 'data/s-training'], ['Policy evidence', 'أدلة السياسات', 'data/evid']],
        cols: ['Record', 'Period', 'Policy / activity', 'Population', 'Coverage', 'Cases', 'Outcome'],
        rows: [
          ['ETH-2025-001', 'FY2025', 'Code of Conduct — board-approved v3', 'All employees', '100% acknowledged', '—', 'Policy in force', 'EV-0027', 'Y. Gaber', 'approved'],
          ['ETH-2025-002', 'FY2025', 'Conflict-of-interest policy', 'All employees & directors', '100% acknowledged', '2 declarations', 'Both minuted and managed', 'EV-0027', 'Y. Gaber', 'approved'],
          ['ETH-2025-003', 'FY2025', 'Gifts & hospitality rules', 'All employees', '100% acknowledged', '14 entries in register', 'All below threshold', 'EV-0027', 'Y. Gaber', 'approved'],
          ['ETH-2025-004', 'FY2025', 'Ethics training completed', 'All employees', '558 of 588 — 94.9%', '—', 'Remainder scheduled Q1 2026', 'EV-0025', 'Y. Gaber', 'review'],
          ['ETH-2025-005', 'FY2025', 'Ethics training completed', 'Business partners', '38 of 62 — 61.3%', '—', 'Roll-out continuing', 'EV-0025', 'Y. Gaber', 'review'],
          ['ETH-2025-006', 'FY2025', 'Ethics complaints received', 'All channels', '—', '7 cases', '5 substantiated · 2 dismissed', 'EV-0027', 'Y. Gaber', 'submitted'],
          ['ETH-2025-007', 'FY2025', 'Disciplinary actions taken', 'All employees', '—', '5 cases', '3 warnings · 2 dismissals', 'EV-0027', 'Y. Gaber', 'progress']
        ],
        form: [
          { s: ['Policy & training', 'السياسة والتدريب', 'GRI 2-23 / 2-24 / 2-26'] },
          { label: 'Policy / activity', gri: '2-23', req: 1, type: 'select', opts: ['Code of Conduct', 'Ethics policy', 'Conflict-of-interest policy', 'Gifts & hospitality rules', 'Ethics training completed', 'Ethics complaints received', 'Disciplinary actions taken'] },
          { label: 'Population', req: 1, type: 'select', opts: ['All employees', 'All employees & directors', 'Management', 'Business partners', 'All channels'] },
          { label: 'Policy status', type: 'select', opts: ['Board-approved', 'Executive-approved', 'In draft', 'Not in place'] },
          { label: 'Approval date', type: 'date' },
          { label: 'Coverage / completion', type: 'number', unit: ['%', 'count'] },
          { label: 'Cases raised', type: 'number' },
          { label: 'Cases confirmed', type: 'number' },
          { label: 'Disciplinary action', type: 'select', opts: ['— none —', 'Verbal warning', 'Written warning', 'Dismissal', 'Contract termination'] },
          { label: 'Corrective action & remediation', type: 'area', full: 1 }
        ]
      },
      {
        key: 'g-acorr', p: 'G', ic: '🛡', en: 'Anti-Corruption & Bribery', ar: 'مكافحة الفساد والرشوة',
        purpose: { en: 'Operations and partners assessed for corruption risk, training coverage, confirmed incidents and anti-competitive actions — guide §5.4.', ar: 'العمليات والشركاء المقيَّمون لمخاطر الفساد، وتغطية التدريب، والحوادث المؤكدة، والإجراءات المانعة للمنافسة — دليل §5.4.' },
        kpiIds: ['GOV-ETH-001', 'GOV-ETH-003', 'GOV-ACB-001'],
        reuse: [['Ethics & code of conduct', 'الأخلاقيات ومدونة السلوك', 'data/g-ethics'], ['Whistleblowing cases', 'حالات الإبلاغ', 'data/g-whistle'], ['Supplier screening', 'فحص الموردين', 'data/g-supp'], ['ESG risks', 'مخاطر ESG', 'mat/risk']],
        cols: ['Record', 'Period', 'Scope', 'Measure', 'Assessed', 'Result', 'Action'],
        rows: [
          ['ACB-2025-001', 'FY2025', 'Own operations — all sites', 'Operations assessed for corruption risk', '6 of 6 — 100%', '2 sites rated medium risk', 'Enhanced controls applied', 'EV-0027', 'Y. Gaber', 'approved'],
          ['ACB-2025-002', 'FY2025', 'Employees', 'Trained on anti-corruption', '558 of 588 — 94.9%', 'Above the 90% threshold', 'Remainder scheduled', 'EV-0025', 'Y. Gaber', 'approved'],
          ['ACB-2025-003', 'FY2025', 'Governance body members', 'Trained on anti-corruption', '9 of 9 — 100%', 'Complete', '— none required', 'EV-0025', 'Y. Gaber', 'approved'],
          ['ACB-2025-004', 'FY2025', 'Business partners', 'Communicated anti-corruption policies', '62 of 62 — 100%', 'Complete', '— none required', 'EV-0027', 'Y. Gaber', 'review'],
          ['ACB-2025-005', 'FY2025', 'Suppliers — tier 1', 'Assessed for corruption risk', '42 of 42 — 100%', '3 rated high risk', 'Due diligence deepened', 'EV-0027', 'Y. Gaber', 'review'],
          ['ACB-2025-006', 'FY2025', 'Group-wide', 'Confirmed corruption incidents', '—', '0 confirmed', '— none required', 'EV-0027', 'Y. Gaber', 'approved'],
          ['ACB-2025-007', 'FY2025', 'Group-wide', 'Suspected incidents under investigation', '—', '1 under investigation', 'Investigation open', 'EV-0027', 'Y. Gaber', 'submitted'],
          ['ACB-2025-008', 'FY2025', 'Group-wide', 'Legal actions — anti-competitive behavior', '—', '0 actions', '— none required', 'EV-0027', 'Y. Gaber', 'progress']
        ],
        form: [
          { s: ['Assessment & training', 'التقييم والتدريب', 'GRI 205-1 / 205-2 / 205-3 / 206-1'] },
          { label: 'Scope', gri: '205-1', req: 1, type: 'select', opts: ['Own operations — all sites', 'Own operations — single site', 'Employees', 'Governance body members', 'Business partners', 'Suppliers — tier 1', 'Group-wide'] },
          { label: 'Measure', req: 1, type: 'select', opts: ['Operations assessed for corruption risk', 'Assessed for corruption risk', 'Trained on anti-corruption', 'Communicated anti-corruption policies', 'Confirmed corruption incidents', 'Suspected incidents under investigation', 'Legal actions — anti-competitive behavior'] },
          { label: 'Number assessed / trained', req: 1, type: 'number' },
          { label: 'Total population', req: 1, type: 'number', help: 'Numerator and denominator are both stored — the percentage is derived.' },
          { label: 'Significant risks identified', type: 'area', full: 1, ph: 'Nature of the risks found' },
          { s: ['Incidents', 'الحوادث', 'GRI 205-3'] },
          { label: 'Confirmed incidents', type: 'number' },
          { label: 'Employees dismissed or disciplined', type: 'number' },
          { label: 'Contracts terminated or not renewed', type: 'number' },
          { label: 'Legal cases concluded', type: 'number' },
          { label: 'Fines / sanctions', type: 'number', unit: ['EGP', 'SAR', 'USD'] },
          { label: 'Corrective action', type: 'area', full: 1 }
        ]
      },
      {
        key: 'g-whistle', p: 'G', ic: '📣', en: 'Whistleblowing & Grievances', ar: 'الإبلاغ والتظلمات',
        purpose: { en: 'Reporting channels, case volumes, substantiation, retaliation and closure — guide §5.5. Findings themselves live in the unified register.', ar: 'قنوات الإبلاغ وأحجام الحالات والإثبات والانتقام والإغلاق — دليل §5.5. الملاحظات نفسها تعيش في السجل الموحد.' },
        kpiIds: [],
        reuse: [['Findings register', 'سجل الملاحظات', 'rev/findings'], ['Ethics cases', 'حالات الأخلاقيات', 'data/g-ethics'], ['Community grievances', 'تظلمات المجتمع', 'data/s-comm'], ['Labour disputes', 'نزاعات العمل', 'data/s-labor']],
        cols: ['Record', 'Period', 'Channel', 'Category', 'Reports', 'Substantiated', 'Avg. resolution'],
        rows: [
          ['WHB-2025-001', 'FY2025', 'Anonymous hotline', 'Ethics & conduct', '7', '5', '21 days', 'EV-0027', 'Y. Gaber', 'approved'],
          ['WHB-2025-002', 'FY2025', 'Anonymous hotline', 'Fraud & corruption', '1', '0', '34 days', 'EV-0027', 'Y. Gaber', 'approved'],
          ['WHB-2025-003', 'FY2025', 'Line management', 'Health & safety', '12', '9', '9 days', 'EV-0025', 'A. Qassem', 'approved'],
          ['WHB-2025-004', 'FY2025', 'HR channel', 'Harassment & discrimination', '3', '1', '18 days', 'EV-0025', 'K. Mansour', 'review'],
          ['WHB-2025-005', 'FY2025', 'Community grievance desk', 'Environmental nuisance', '9', '7', '26 days', 'EV-0025', 'N. Fouad', 'review'],
          ['WHB-2025-006', 'FY2025', 'Supplier channel', 'Labour practices', '2', '2', '41 days', 'EV-0027', 'Y. Gaber', 'submitted'],
          ['WHB-2025-007', 'FY2025', 'All channels', 'Retaliation reported', '0', '0', '—', 'EV-0027', 'Y. Gaber', 'approved'],
          ['WHB-2025-008', 'FY2025', 'All channels', 'Cases escalated to the Board', '2', '2', '52 days', 'EV-0027', 'Y. Gaber', 'progress']
        ],
        form: [
          { s: ['Channel & case', 'القناة والحالة', 'GRI 2-25 / 2-26'] },
          { label: 'Reporting channel', gri: '2-26', req: 1, type: 'select', opts: ['Anonymous hotline', 'Line management', 'HR channel', 'Community grievance desk', 'Supplier channel', 'External ombudsman', 'All channels'] },
          { label: 'Anonymous reporting available?', req: 1, type: 'select', opts: ['Yes', 'No'] },
          { label: 'Category', req: 1, type: 'select', opts: ['Ethics & conduct', 'Fraud & corruption', 'Health & safety', 'Harassment & discrimination', 'Environmental nuisance', 'Labour practices', 'Data privacy', 'Retaliation reported'] },
          { label: 'Reports received', req: 1, type: 'number' },
          { label: 'Reports investigated', type: 'number' },
          { label: 'Reports substantiated', type: 'number' },
          { label: 'Reports dismissed', type: 'number' },
          { label: 'Average resolution time', type: 'number', unit: ['days'] },
          { label: 'Escalated to the Board?', type: 'select', opts: ['No', 'Yes'] },
          { label: 'Remediation provided', type: 'area', full: 1 },
          { label: 'Closure date', type: 'date' }
        ]
      },
      {
        key: 'g-comp', p: 'G', ic: '📜', en: 'Compliance, Tax & Public Policy', ar: 'الامتثال والضرائب والسياسات العامة',
        purpose: { en: 'Non-compliance with laws and regulations, fines and sanctions, country-by-country tax and political contributions — guide §5.7. Environmental permits sit on their own screen.', ar: 'عدم الامتثال للقوانين واللوائح، والغرامات والعقوبات، والضرائب حسب الدولة، والمساهمات السياسية — دليل §5.7. التصاريح البيئية في شاشتها الخاصة.' },
        kpiIds: ['GOV-CMP-001', 'GOV-TAX-001', 'GOV-PUB-001'],
        reuse: [['Environmental compliance', 'الامتثال البيئي', 'data/e-ecomp'], ['Findings register', 'سجل الملاحظات', 'rev/findings'], ['Product & marketing compliance', 'امتثال المنتج والتسويق', 'data/s-cust'], ['ESG risks', 'مخاطر ESG', 'mat/risk']],
        cols: ['Record', 'Period', 'Jurisdiction', 'Obligation / measure', 'Instances', 'Amount', 'Status'],
        rows: [
          ['CMP-G-2025-001', 'FY2025', 'Egypt', 'Non-compliance with laws & regulations — significant fines', '1', 'EGP 240,000', 'Paid — corrective action closed', 'EV-0027', 'Y. Gaber', 'approved'],
          ['CMP-G-2025-002', 'FY2025', 'Egypt', 'Non-compliance — non-monetary sanctions', '0', '—', 'None', 'EV-0027', 'Y. Gaber', 'approved'],
          ['CMP-G-2025-003', 'FY2025', 'Saudi Arabia', 'Non-compliance with laws & regulations', '0', '—', 'None', 'EV-0027', 'Y. Gaber', 'approved'],
          ['CMP-G-2025-004', 'FY2025', 'United Arab Emirates', 'Non-compliance with laws & regulations', '0', '—', 'None', 'EV-0027', 'Y. Gaber', 'approved'],
          ['CMP-G-2025-005', 'FY2025', 'Egypt', 'Corporate income tax paid', '—', 'EGP 68,400,000', 'Filed', 'EV-0021', 'Y. Gaber', 'review'],
          ['CMP-G-2025-006', 'FY2025', 'Saudi Arabia', 'Corporate income tax paid', '—', 'SAR 12,800,000', 'Filed', 'EV-0021', 'Y. Gaber', 'review'],
          ['CMP-G-2025-007', 'FY2025', 'Group', 'Political contributions', '0', 'Nil', 'Policy prohibits contributions', 'EV-0027', 'Y. Gaber', 'submitted'],
          ['CMP-G-2025-008', 'FY2025', 'Egypt', 'Legal proceedings open at period end', '2', '—', 'Both commercial — not ESG-related', 'EV-0027', 'Y. Gaber', 'progress']
        ],
        form: [
          { s: ['Compliance obligation', 'التزام الامتثال', 'GRI 2-27 / 207-4 / 415-1'] },
          { label: 'Jurisdiction', req: 1, type: 'select', opts: ['Egypt', 'Saudi Arabia', 'United Arab Emirates', 'Group'] },
          { label: 'Obligation / measure', gri: '2-27', req: 1, type: 'select', opts: ['Non-compliance with laws & regulations — significant fines', 'Non-compliance — non-monetary sanctions', 'Corporate income tax paid', 'Corporate income tax accrued', 'Revenue and profit by jurisdiction', 'Political contributions', 'Legal proceedings open at period end', 'Government financial assistance received'] },
          { label: 'Instances', type: 'number' },
          { label: 'Amount', type: 'number', unit: ['EGP', 'SAR', 'AED', 'USD'] },
          { label: 'Regulatory area', type: 'select', opts: ['Environmental', 'Labour & employment', 'Health & safety', 'Product & consumer', 'Competition', 'Tax', 'Data protection', 'Other'] },
          { label: 'Compliance owner', req: 1, type: 'select', opts: ['Y. Gaber · Legal & Compliance', 'A. Fahmy · Finance & Tax', 'R. Barakat · Environment'] },
          { label: 'Assessment date', type: 'date' },
          { label: 'Status', req: 1, type: 'select', opts: ['None', 'Filed', 'Paid — corrective action closed', 'Under appeal', 'Open'] },
          { label: 'Corrective / preventive action', type: 'area', full: 1 }
        ]
      },
      {
        key: 'g-cyber', p: 'G', ic: '💻', en: 'Cybersecurity', ar: 'الأمن السيبراني',
        purpose: { en: 'Security governance, incidents and breaches, assessments and training — guide §5.8. Customer-data breaches are also disclosed under Customer Privacy.', ar: 'حوكمة الأمن والحوادث والاختراقات والتقييمات والتدريب — دليل §5.8. اختراقات بيانات العملاء تُفصح أيضًا تحت خصوصية العملاء.' },
        kpiIds: [],
        reuse: [['Customer privacy incidents', 'حوادث خصوصية العملاء', 'data/s-priv'], ['Cyber & privacy training', 'تدريب الأمن والخصوصية', 'data/s-training'], ['ESG risks — cyber', 'مخاطر ESG السيبرانية', 'mat/risk'], ['Supplier cyber assessment', 'تقييم الموردين السيبراني', 'data/g-supp']],
        cols: ['Record', 'Period', 'Category', 'Detail', 'Count', 'Severity', 'Status'],
        rows: [
          ['CYB-2025-001', 'FY2025', 'Governance', 'Cybersecurity policy — board-approved v2', '1', '—', 'In force', 'EV-0027', 'Y. Gaber', 'approved'],
          ['CYB-2025-002', 'FY2025', 'Security incidents', 'Total incidents detected', '34', 'Low to medium', 'All closed', 'EV-0027', 'Y. Gaber', 'approved'],
          ['CYB-2025-003', '2025-07', 'Data breach', 'Misconfigured file share — customer contact data', '1', 'High', 'Closed — regulator notified', 'EV-0027', 'Y. Gaber', 'review'],
          ['CYB-2025-004', 'FY2025', 'Security incidents', 'Critical incidents', '0', '—', 'None', 'EV-0027', 'Y. Gaber', 'approved'],
          ['CYB-2025-005', 'FY2025', 'Assessment', 'External penetration test', '2', '—', '11 findings — all remediated', 'EV-0027', 'Y. Gaber', 'review'],
          ['CYB-2025-006', 'FY2025', 'Assessment', 'Third-party cyber assessments completed', '18', '—', '2 suppliers require remediation', 'EV-0027', 'Y. Gaber', 'submitted'],
          ['CYB-2025-007', 'FY2025', 'Training', 'Security-awareness training completed', '512 of 588 — 87.1%', '—', 'Remainder scheduled', 'EV-0025', 'K. Mansour', 'review'],
          ['CYB-2025-008', 'FY2025', 'Assessment', 'Internal security audit', '1', '—', 'AF-12 follow-up closed', 'EV-0027', 'Y. Gaber', 'progress']
        ],
        form: [
          { s: ['Cybersecurity', 'الأمن السيبراني', 'guide §5.8'] },
          { label: 'Category', req: 1, type: 'select', opts: ['Governance', 'Security incidents', 'Data breach', 'Assessment', 'Training'] },
          { label: 'Detail', req: 1, type: 'text', ph: 'Policy, incident, assessment or programme' },
          { label: 'Count', req: 1, type: 'number' },
          { label: 'Incident severity', type: 'select', opts: ['— not an incident —', 'Low', 'Medium', 'High', 'Critical'] },
          { label: 'Affected systems', type: 'text', ph: 'Systems or services affected' },
          { label: 'Records affected', type: 'number' },
          { label: 'Customers / employees affected', type: 'number' },
          { label: 'Detection date', type: 'date' },
          { label: 'Resolution date', type: 'date' },
          { label: 'Root cause', type: 'area', full: 1 },
          { label: 'Corrective / preventive action', type: 'area', full: 1 },
          { label: 'Regulator notified', type: 'select', opts: ['Not applicable', 'Yes', 'No — assessed as not notifiable'], help: 'A customer-data breach is also recorded under Customer Privacy — one incident, two disclosures.' }
        ]
      },
      {
        key: 'g-supp', p: 'G', ic: '🔗', en: 'Suppliers & Procurement', ar: 'الموردون والمشتريات',
        purpose: { en: 'Supplier ESG profiles, screening, audits, corrective actions and local procurement — guide §5.10.', ar: 'ملفات الموردين البيئية والاجتماعية والحوكمية، والفحص والتدقيق والإجراءات التصحيحية والشراء المحلي — دليل §5.10.' },
        kpiIds: ['ENV-SUP-001', 'ENV-SUP-002', 'SOC-SUP-001', 'SOC-SUP-002', 'GOV-PRC-001'],
        reuse: [['Responsible sourcing', 'التوريد المسؤول', 'data/g-sourcing'], ['Supplier human-rights risk', 'مخاطر حقوق الإنسان للموردين', 'data/s-hr'], ['Scope 3 cat. 1 & 4', 'النطاق 3 فئتا 1 و4', 'data/e-s3'], ['Supplier impacts', 'تأثيرات الموردين', 'mat/impacts']],
        cols: ['Record', 'Supplier', 'Category', 'Country', 'Annual spend', 'ESG risk', 'Audit / corrective action'],
        rows: [
          ['SUP-2025-001', 'Delta Limestone Co.', 'Raw materials', 'Egypt', 'EGP 48,200,000', 'Medium', 'Audited 2025-04 — 2 actions closed', 'EV-0027', 'Y. Gaber', 'approved'],
          ['SUP-2025-002', 'Nile Logistics Group', 'Logistics', 'Egypt', 'EGP 31,600,000', 'High', 'Audited 2025-09 — 3 actions open', 'EV-0027', 'Y. Gaber', 'review'],
          ['SUP-2025-003', 'EGAS', 'Energy & fuel', 'Egypt', 'EGP 96,400,000', 'Low', 'Screened — no audit required', 'EV-0027', 'S. Tawfik', 'approved'],
          ['SUP-2025-004', 'Gulf Refractories LLC', 'Raw materials', 'United Arab Emirates', 'AED 4,180,000', 'Medium', 'Screened — audit scheduled Q1 2026', 'EV-0027', 'Y. Gaber', 'review'],
          ['SUP-2025-005', 'Sinai Aggregates Trading', 'Raw materials', 'Egypt', 'EGP 12,900,000', 'Medium', 'Audited 2025-06 — closed', 'EV-0027', 'Y. Gaber', 'approved'],
          ['SUP-2025-006', 'Red Sea Haulage', 'Logistics', 'Egypt', 'EGP 8,400,000', 'High', 'Labour-practice finding — plan issued', 'EV-0027', 'Y. Gaber', 'review'],
          ['SUP-2025-007', 'Sudair Technical Services', 'Maintenance', 'Saudi Arabia', 'SAR 6,120,000', 'Low', 'Screened — no findings', 'EV-0027', 'F. Said', 'submitted'],
          ['SUP-2025-008', 'Cairo Industrial Packaging', 'Packaging', 'Egypt', 'EGP 5,240,000', 'Low', 'Screened — no findings', 'EV-0027', 'Y. Gaber', 'submitted'],
          ['SUP-2025-009', 'Group summary', 'All categories', 'All', 'EGP 214,000,000', '—', 'Local procurement share 78.4%', 'EV-0021', 'Y. Gaber', 'progress'],
          ['SUP-2025-010', 'Alexandria Chemicals', 'Process chemicals', 'Egypt', 'EGP 3,900,000', 'Medium', 'Screening in progress', 'EV-0027', 'Y. Gaber', 'progress']
        ],
        form: [
          { s: ['Supplier profile', 'ملف المورد', 'GRI 204-1 / 308-1 / 308-2 / 414-1 / 414-2'] },
          { label: 'Supplier name', req: 1, type: 'text' },
          { label: 'Supplier category', gri: '204-1', req: 1, type: 'select', opts: ['Raw materials', 'Energy & fuel', 'Logistics', 'Packaging', 'Maintenance', 'Process chemicals', 'Professional services'] },
          { label: 'Country', req: 1, type: 'select', opts: ['Egypt', 'Saudi Arabia', 'United Arab Emirates', 'Other'] },
          { label: 'Local supplier?', gri: '204-1', req: 1, type: 'select', opts: ['Local — same country as the operation', 'Non-local'] },
          { label: 'Annual spend', req: 1, type: 'number', unit: ['EGP', 'SAR', 'AED', 'USD'] },
          { label: 'Critical supplier?', req: 1, type: 'select', opts: ['No', 'Yes — single source', 'Yes — high volume'] },
          { s: ['ESG assessment', 'التقييم البيئي والاجتماعي والحوكمي', 'GRI 308 / 414'] },
          { label: 'Overall ESG risk rating', req: 1, type: 'select', opts: ['Low', 'Medium', 'High'] },
          { label: 'Assessments completed', req: 1, type: 'select', opts: ['Environmental', 'Social & labour', 'Human rights', 'Anti-corruption', 'Cybersecurity', 'All of the above'] },
          { label: 'Screened at onboarding?', gri: '308-1', req: 1, type: 'select', opts: ['Yes', 'No — legacy supplier'] },
          { label: 'Audit status', type: 'select', opts: ['Not required', 'Scheduled', 'Completed', 'Overdue'] },
          { label: 'Audit date', type: 'date' },
          { label: 'Findings', type: 'area', full: 1 },
          { label: 'Corrective action & due date', type: 'area', full: 1 },
          { label: 'Corrective-action status', type: 'select', opts: ['— none —', 'Open', 'In progress', 'Closed'] },
          { label: 'Relationship terminated?', type: 'select', opts: ['No', 'Yes — ESG grounds', 'Yes — commercial grounds'] }
        ]
      },
      {
        key: 'g-sourcing', p: 'G', ic: '🧭', en: 'Responsible Sourcing', ar: 'التوريد المسؤول',
        purpose: { en: 'Raw-material origin, chain of custody, certification and high-risk sourcing areas — guide §5.11. Supplier-level assessment stays on the Suppliers screen.', ar: 'منشأ المواد الخام وسلسلة الحيازة والشهادات ومناطق التوريد عالية المخاطر — دليل §5.11. تقييم الموردين يبقى في شاشة الموردين.' },
        kpiIds: [],
        reuse: [['Suppliers & procurement', 'الموردون والمشتريات', 'data/g-supp'], ['Human rights due diligence', 'العناية الواجبة لحقوق الإنسان', 'data/s-hr'], ['Materials collected', 'المواد المجمّعة', 'data/e-materials'], ['Certification evidence', 'أدلة الشهادات', 'data/evid']],
        cols: ['Record', 'Material', 'Origin', 'Source / mine', 'Chain of custody', 'Certification', 'Risk area'],
        rows: [
          ['SRC-2025-001', 'Limestone', 'Egypt — Suez governorate', 'EG-QRY-01 own quarry', 'Fully traceable — own operation', 'ISO 14001 site', 'Low risk', 'EV-0027', 'Y. Gaber', 'approved'],
          ['SRC-2025-002', 'Limestone', 'Egypt — Minya', 'Delta Limestone Co. quarry', 'Supplier-declared', 'Supplier ESG audit 2025-04', 'Low risk', 'EV-0027', 'Y. Gaber', 'approved'],
          ['SRC-2025-003', 'Gypsum', 'Egypt — Red Sea', 'Third-party quarry', 'Supplier-declared', 'None held', 'Medium — traceability gap', 'EV-0027', 'Y. Gaber', 'review'],
          ['SRC-2025-004', 'Fly ash', 'Egypt — power sector', 'Third-party power station', 'Waste-stream declaration', 'By-product certificate', 'Low risk', 'EV-0027', 'R. Barakat', 'approved'],
          ['SRC-2025-005', 'Refractory materials', 'United Arab Emirates', 'Gulf Refractories LLC', 'Supplier-declared', 'Audit scheduled Q1 2026', 'Medium — sub-tier unknown', 'EV-0027', 'Y. Gaber', 'review'],
          ['SRC-2025-006', 'Kraft paper', 'Egypt / imported pulp', 'Cairo Industrial Packaging', 'Mixed — pulp origin declared', 'FSC mixed-credit claim', 'Medium — pulp origin', 'EV-0027', 'Y. Gaber', 'submitted'],
          ['SRC-2025-007', 'Steel grinding media', 'Imported', 'Not yet traced', 'Not established', 'None held', 'High — conflict-minerals screening due', 'EV-0027', 'Y. Gaber', 'progress']
        ],
        form: [
          { s: ['Origin & traceability', 'المنشأ والتتبع', 'guide §5.11'] },
          { label: 'Raw material', req: 1, type: 'text', ph: 'Limestone, gypsum, kraft paper…' },
          { label: 'Country of origin', req: 1, type: 'select', opts: ['Egypt', 'Saudi Arabia', 'United Arab Emirates', 'Imported — origin declared', 'Not yet traced'] },
          { label: 'Source / mine / facility', req: 1, type: 'text' },
          { label: 'Supplier', type: 'select', opts: ['Own operation', 'Delta Limestone Co.', 'Gulf Refractories LLC', 'Cairo Industrial Packaging', 'Alexandria Chemicals', 'Not yet traced'] },
          { label: 'Chain of custody', req: 1, type: 'select', opts: ['Fully traceable — own operation', 'Supplier-declared', 'Third-party verified', 'Mixed', 'Not established'] },
          { label: 'Certification held', type: 'select', opts: ['— none held —', 'ISO 14001 site', 'FSC / PEFC', 'Responsible sourcing scheme', 'By-product certificate'] },
          { label: 'Conflict-minerals relevance', req: 1, type: 'select', opts: ['Not applicable', 'Screened — no 3TG content', 'Screening due'] },
          { label: 'High-risk sourcing area?', req: 1, type: 'select', opts: ['Low risk', 'Medium risk', 'High risk'] },
          { label: 'Child / forced labour risk assessed?', type: 'select', opts: ['Yes — no risk identified', 'Yes — risk identified', 'Not yet assessed'] },
          { label: 'Corrective action', type: 'area', full: 1 }
        ]
      },
      {
        key: 'g-econ', p: 'G', ic: '📊', en: 'Economic Data', ar: 'البيانات الاقتصادية',
        purpose: { en: 'Economic value generated and distributed, climate-related financial implications, government assistance and indirect economic impacts — guide §5.12.', ar: 'القيمة الاقتصادية المولّدة والموزّعة، والآثار المالية المرتبطة بالمناخ، والمساعدات الحكومية، والآثار الاقتصادية غير المباشرة — دليل §5.12.' },
        kpiIds: ['GOV-ECO-001', 'GOV-ECO-002', 'GOV-ECO-004', 'GOV-IEI-001', 'GOV-IEI-002', 'GOV-MKT-002'],
        reuse: [['Community investment', 'الاستثمار المجتمعي', 'data/s-comm'], ['Local procurement', 'الشراء المحلي', 'data/g-supp'], ['Tax paid by jurisdiction', 'الضرائب حسب الدولة', 'data/g-comp'], ['Wages & benefits', 'الأجور والمزايا', 'data/s-comp']],
        cols: ['Record', 'Period', 'Entity', 'Economic component', 'Amount', 'Currency', 'Note'],
        rows: [
          ['ECO-2025-001', 'FY2025', 'Group', 'Economic value generated — revenue', '1,284,000,000', 'EGP', 'Consolidated', 'EV-0021', 'Y. Gaber', 'approved'],
          ['ECO-2025-002', 'FY2025', 'Group', 'Operating costs', '742,000,000', 'EGP', 'Distributed', 'EV-0021', 'Y. Gaber', 'approved'],
          ['ECO-2025-003', 'FY2025', 'Group', 'Employee wages & benefits', '184,200,000', 'EGP', 'Distributed', 'EV-0021', 'K. Mansour', 'approved'],
          ['ECO-2025-004', 'FY2025', 'Group', 'Payments to providers of capital', '96,800,000', 'EGP', 'Distributed', 'EV-0021', 'Y. Gaber', 'approved'],
          ['ECO-2025-005', 'FY2025', 'Group', 'Payments to government — taxes', '81,200,000', 'EGP', 'Distributed', 'EV-0021', 'Y. Gaber', 'review'],
          ['ECO-2025-006', 'FY2025', 'Group', 'Community investment', '6,140,000', 'EGP', 'Distributed', 'EV-0021', 'N. Fouad', 'review'],
          ['ECO-2025-007', 'FY2025', 'Group', 'Economic value retained', '173,660,000', 'EGP', 'Generated less distributed', 'EV-0021', 'Y. Gaber', 'submitted'],
          ['ECO-2025-008', 'FY2025', 'Group', 'Government financial assistance received', '4,200,000', 'EGP', 'Energy-efficiency grant', 'EV-0021', 'Y. Gaber', 'review'],
          ['ECO-2025-009', 'FY2025', 'Group', 'Financial implications of climate risk', '38,000,000', 'EGP', 'Carbon-price exposure — scenario estimate', 'EV-0021', 'Y. Gaber', 'progress'],
          ['ECO-2025-010', 'FY2025', 'Group', 'Infrastructure investments & services supported', '2,400,000', 'EGP', 'Road resurfacing — 10th of Ramadan', 'EV-0021', 'N. Fouad', 'progress'],
          ['ECO-2025-011', 'FY2025', 'LE-03', 'Senior management hired locally', '86', '%', 'GRI 202-2', 'EV-0025', 'K. Mansour', 'review'],
          ['ECO-2025-012', 'FY2025', 'Group', 'Capital expenditure — ESG related', '52,600,000', 'EGP', 'Waste-heat recovery & filters', 'EV-0021', 'S. Tawfik', 'progress']
        ],
        form: [
          { s: ['Economic value', 'القيمة الاقتصادية', 'GRI 201-1 / 201-2 / 201-4 / 202-2 / 203-1'] },
          { label: 'Economic component', gri: '201-1', req: 1, type: 'select', opts: ['Economic value generated — revenue', 'Operating costs', 'Employee wages & benefits', 'Payments to providers of capital', 'Payments to government — taxes', 'Community investment', 'Economic value retained', 'Government financial assistance received', 'Financial implications of climate risk', 'Infrastructure investments & services supported', 'Senior management hired locally', 'Capital expenditure — ESG related'] },
          { label: 'Amount', req: 1, type: 'number', unit: ['EGP', 'SAR', 'AED', 'USD', '%'] },
          { label: 'FX basis', value: 'Dictionary-declared annual average — never typed', ro: 1, pv: { k: 'reuse', t: 'Data Dictionary', l: '#/adm/aconf' } },
          { label: 'Scope', req: 1, type: 'select', opts: ['Group', 'LE-01', 'LE-02', 'LE-03', 'LE-04'] },
          { label: 'Climate scenario used', type: 'select', opts: ['— not a climate estimate —', 'IEA STEPS', 'IEA NZE 2050', 'NGFS Orderly', 'NGFS Disorderly'] },
          { label: 'Indirect economic impact', type: 'area', full: 1, ph: 'Significant indirect impacts and their extent' },
          { label: 'Note', type: 'text', ph: 'Basis or qualification for the figure' }
        ]
      }
    ];

    /* register the 33 screens + their guide-bar entries; the record registers hang off D */
    D.ecoll = {};
    EC_TOPICS.forEach(tp => {
      D.ecoll[tp.key] = tp.rows || [];
      VIEWS['data/' + tp.key] = () => ecView(tp);
      GUIDE['data/' + tp.key] = [2, tp.en + ' records with evidence → validation & review', 'data/valid', 'Validation Console'];
    });
