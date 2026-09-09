/* ═══════════════════════════════════════════════════════════════════════════
   ESG OS v14 — BOOT — FK integrity check + the single render() pass
   Extracted verbatim from the single-file build. Classic script: LOAD ORDER
   IS SIGNIFICANT — see the <script> tags in the entry HTML.
   ═══════════════════════════════════════════════════════════════════════════ */
    function fkCheck() {
      const mts = new Map(D.topics.map(t => [t.id, t.n])); const kps = new Set(KPIM.map(k => k.id)); const bad = [];
      const mtOk = v => !v || !String(v).startsWith('MT-') || mts.has(String(v).split(' ')[0]);
      D.targets.forEach(t => { if (!mtOk(t.topic)) bad.push('target ' + t.id + ' topic ' + t.topic); if (!kps.has(t.kpi)) bad.push('target ' + t.id + ' kpi ' + t.kpi) });
      D.risks.forEach(r => { if (!mtOk(r.topic)) bad.push('risk ' + r.id + ' topic ' + r.topic); (r.kpis || '').split('·').map(x => x.trim()).filter(Boolean).forEach(k0 => { if (!kps.has(k0)) bad.push('risk ' + r.id + ' kpi ' + k0) }) });
      D.xplan.forEach(x => { if (!kps.has(x.kpi)) bad.push('xplan ' + x.kpi) });
      Object.keys(D.dpr).forEach(k => { if (!kps.has(k.split('|')[0])) bad.push('dpr ' + k) });
      Object.keys(D.adv).forEach(k => { if (!kps.has(D.adv[k].kpi)) bad.push('adv ' + k) });
      Object.keys(REPORT_BINDINGS).forEach(el => { const b0 = REPORT_BINDINGS[el]; if (b0.kpi && !kps.has(b0.kpi)) bad.push('binding ' + el) });
      /* SEMANTIC integrity: any "MT-xx <label>" pairing anywhere in seeds must match the governed label */
      const scanPair = (where, str) => { const m = String(str || '').match(/^(MT-0\d)\s+(.+)$/); if (m && mts.has(m[1]) && !mts.get(m[1]).toLowerCase().startsWith(m[2].slice(0, 6).toLowerCase())) bad.push('SEMANTIC ' + where + ': ' + str + ' ≠ governed "' + mts.get(m[1]) + '"') };
      D.targets.forEach(t => scanPair('target ' + t.id, t.topic)); D.risks.forEach(r => scanPair('risk ' + r.id, r.topic));
      if (bad.length) console.error('FK VIOLATIONS:', bad); return bad
    }
    window.FK_VIOLATIONS = fkCheck();
    render();

    function notifyGriForm() {
      drawer('📮 ' + (LANG === 'ar' ? 'إخطار GRI — المتطلب 9' : 'Notify GRI — Requirement 9'),
        `<div class="notice ${D.notifyGRI ? 'ok' : 'warn'}">${D.notifyGRI ? ((LANG === 'ar' ? 'الدليل مخزن — ' : 'Evidence stored — ') + '<span data-noar>' + esc(D.notifyGRI.date) + '</span>') : (LANG === 'ar' ? 'قفل الفترة (G7) محجوب حتى تخزين دليل الإخطار — النشر نفسه يجوز أن يسبقه.' : 'Period lock (G7) is BLOCKED until the notification evidence is stored — publication itself may proceed first.')}</div>
 <div class="formGrid">
 ${field({ label: LANG === 'ar' ? 'تاريخ الإرسال' : 'Date sent', req: 1, type: 'date', value: '2026-04-30' })}
 ${field({ label: LANG === 'ar' ? 'المستلم' : 'Recipient', ro: 1, value: 'reportregistration@globalreporting.org' })}
 ${field({ label: LANG === 'ar' ? 'الحمولة (قائمة إلزامية)' : 'Payload (mandatory)', ro: 1, full: 1, value: 'legal name · content index link · report link · statement of use · contact person' })}
 </div>`,
        `<button class="btn sec" onclick="closeDrawer()">${t('cancel')}</button><button class="btn" onclick="D.notifyGRI={date:document.querySelector('#drawer input[type=date]').value,to:'reportregistration@globalreporting.org'};audit('gri.notify','cycle','evidence stored — CE-9/G7');closeDrawer();toast('${LANG === 'ar' ? 'خُزن دليل الإخطار — CE-9 يتحول PASS' : 'Notification evidence stored — CE-9 flips to PASS'}');render()">${LANG === 'ar' ? 'تخزين الدليل' : 'Store evidence'}</button>`)
    }

