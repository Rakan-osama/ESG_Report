/* ═══════════════════════════════════════════════════════════════════════════
   ESG OS v14 — 7 · VIEWS — every screen definition + named drawer forms
   Extracted verbatim from the single-file build. Classic script: LOAD ORDER
   IS SIGNIFICANT — see the <script> tags in the entry HTML.
   ═══════════════════════════════════════════════════════════════════════════ */
    /* ================= HOME — Readiness Command Center (B-14) ================= */

    /* ================= MY WORK ================= */
    VIEWS['mywork'] = () => {
      const tasks = D.tasks[ROLE] || [];
      return pageHead(t('mywork'), LANG === 'ar' ? 'كل ما هو مُسند إليك: طلبات بيانات، مرتجعات، مراجعات، اعتمادات، ملاحظات، قرارات حذف — مع من أرسله وما التالي.' : 'Everything assigned to you: requests, returns, reviews, approvals, findings, omission decisions — with who sent it and what happens next.') +
        `<div class="card"><div class="hd">${LANG === 'ar' ? 'قائمة المهام' : 'Queue'} <span class="sub">${tasks.length}</span></div>
 <table class="tbl"><thead><tr><th></th><th>${LANG === 'ar' ? 'المهمة' : 'Task'}</th><th>${LANG === 'ar' ? 'العملية / الدورة' : 'Process / Cycle'}</th><th>${LANG === 'ar' ? 'الكائن' : 'Object'}</th><th>${LANG === 'ar' ? 'من' : 'From'}</th><th>${t('due')}</th><th>${LANG === 'ar' ? 'الإنجاز' : 'Completion'} ⚙</th><th>${LANG === 'ar' ? 'سبب الحجب' : 'Blocking'}</th><th>${LANG === 'ar' ? 'التالي' : 'Next'}</th><th></th></tr></thead><tbody>
 ${tasks.map(x => `<tr><td>${x.k === 'ret' ? '↩' : x.k === 'warn' ? '⚠' : x.k === 'ok' ? '✓' : '📨'}</td><td style="font-weight:600">${esc(x.t)}</td><td style="font-size:11.5px">${LANG === 'ar' ? 'جمع البيانات' : 'Data collection'} · ${D.cycle.code}</td><td style="font-size:11.5px" data-noar>${x.k === 'ret' ? 'REC-1026' : x.k === 'warn' ? 'FND-2025-0004' : 'X-PLAN row'}</td><td>${x.k === 'ret' ? 'M. Adel (reviewer)' : 'System / workflow'}</td><td style="font-size:11.5px">${x.k === 'ret' ? '82%' : '—'}</td><td style="font-size:11.5px">${x.k === 'warn' ? (LANG === 'ar' ? 'دليل ناقص' : 'evidence missing') : '—'}</td><td>${x.k === 'due' ? 'this week' : x.k === 'ret' ? 'ASAP' : '—'}</td><td style="color:var(--mut);font-size:12px">${x.k === 'ret' ? (LANG === 'ar' ? 'التقديم يعود لمراجعة الإدارة' : 'Resubmit → Department review') : (LANG === 'ar' ? 'وفق مسار الاعتماد' : 'Per workflow')}</td><td class="rowActs"><a href="#/${x.v}">${t('open')}</a></td></tr>`).join('') || `<tr><td colspan="6" style="text-align:center;color:var(--mut);padding:30px">✨ ${LANG === 'ar' ? 'لا مهام معلقة' : 'No pending work'}</td></tr>`}
 </tbody></table></div>`;
    };

    /* ================= ORGANIZATION WORKSPACE ================= */
    VIEWS['org/profile'] = () => pageHead(t('profile'), LANG === 'ar' ? 'من هي المنظمة لأغراض التقرير — GRI 2-1. كل الشاشات الأخرى تقرأ النسخة المعتمدة بدل السؤال مرة أخرى.' : 'Who the organization is for reporting purposes — GRI 2-1. Every other screen reads the approved version instead of asking again.',
      `<span class="st approved">🔒 v${D.org.version} · ${t('apprv')}</span><button class="btn sec" onclick="toast('${t('viewHist')}')">${t('history')}</button><button class="btn" onclick="drawer('${t('edit')} — ${t('profile')}',profileForm())">${t('edit')}</button>`, 'Organization › Profile (B-01)') +
      `<div class="card"><div class="hd">${LANG === 'ar' ? 'هوية المنظمة' : 'Organization identity'} <span class="sub">GRI 2-1-a/b</span></div><div class="bd formGrid">
  ${field({ label: 'Legal name', gri: '2-1-a', value: D.org.name, ro: 1 })}
  ${field({ label: 'Trade name(s)', value: 'Acme Sustainable', ro: 1 })}
  ${field({ label: 'Nature of ownership', gri: '2-1-b', value: 'Publicly listed', ro: 1 })}
  ${field({ label: 'Legal form', value: D.org.form, ro: 1 })}
  ${field({ label: 'Commercial registration no.', value: 'CR-1010-556677', ro: 1 })}
  ${field({ label: 'Tax ID', value: 'TAX-300-112-334', ro: 1 })}
 </div></div>
 <div class="card"><div class="hd">${LANG === 'ar' ? 'هيكل المنظمة' : 'Organization structure'} <span class="sub">GRI 2-2</span></div><div class="bd formGrid">
  ${field({ label: 'Ultimate parent', value: 'Acme Sustainable Industries Holding (root of B-02 tree)', pv: { k: 'der', t: t('derived'), l: '#/org/entities' }, help: 'Derived from the Legal Entity hierarchy — never typed twice.' })}
  ${field({ label: 'Group entities in scope', value: '4 entities · 3 in sustainability scope', pv: { k: 'der', t: t('derived'), l: '#/org/entities' } })}
 </div></div>
 <div class="card"><div class="hd">${LANG === 'ar' ? 'المقر والانتشار' : 'Headquarters & operating footprint'} <span class="sub">GRI 2-1-c/d</span></div><div class="bd formGrid">
  ${field({ label: 'Headquarters country / city', gri: '2-1-c', value: D.org.hq, ro: 1 })}
  ${field({ label: 'Headquarters address', value: 'King Fahd Rd, Riyadh 12212', ro: 1 })}
  ${field({ label: 'Countries of operation', gri: '2-1-d', value: D.org.countries.join(' · '), ro: 1, help: 'Drives entity/site scoping in B-02 & B-03.' })}
 </div></div>
 <div class="card"><div class="hd">${LANG === 'ar' ? 'جهة اتصال التقرير' : 'Report contact'} <span class="sub">GRI 2-3-d · ${LANG === 'ar' ? 'يُلتقط مرة' : 'captured once'}</span></div><div class="bd formGrid">
  ${field({ label: 'Contact name', value: 'Layla Al-Harbi', ro: 1 })}
  ${field({ label: 'Contact email', gri: '2-3-d', value: D.org.contact, ro: 1 })}
  ${field({ label: 'Contact phone', value: '+966 11 000 0000', ro: 1 })}
  ${field({ label: 'Contact role', value: 'Head of Sustainability', ro: 1 })}
 </div></div>
 <div class="card"><div class="hd">${LANG === 'ar' ? 'الحوكمة والإصدار' : 'Governance & version control'}</div><div class="bd formGrid">
  ${field({ label: 'Responsible owner', value: D.org.owner + ' (roster reference)', ro: 1 })}
  ${field({ label: 'Preparer entity', value: 'Acme Sustainable Industries Holding', pv: { k: 'lock', t: 'SOD-04' }, help: 'Locked — a verification body (VVB) can never be the preparer.' })}
  ${field({ label: 'Effective from', value: '2025-01-01', ro: 1 })}
  ${field({ label: 'Version basis', value: 'v' + D.org.version + ' · approved 15 Dec 2024 · no-overlap enforced · change ⇒ new version + 2-4 note', pv: { k: 'lock', t: t('apprv') } })}
 </div></div>
 <div class="notice info"><b>${LANG === 'ar' ? 'الالتقاط مرة واحدة:' : 'Capture once:'}</b> ${LANG === 'ar' ? 'الاسم القانوني وجهة الاتصال يُعاد استخدامهما في بيان الاستخدام وفهرس المحتوى والتقرير — النسخ المنشورة تُجمَّد كلقطة عند الإصدار.' : 'Legal name & contact are reused by the Statement of Use, Content Index and Report — published outputs freeze a snapshot at release.'}</div>`;
    function profileForm() {
      return `<div class="formGrid">
 ${sect('Organization identity', 'هوية المنظمة', 'GRI 2-1-a/b')}
 ${field({ label: 'Legal name', gri: '2-1-a', req: 1, value: D.org.name })}
 ${field({ label: 'Trade name(s)', value: 'Acme Sustainable', help: 'Repeater in production — one row per trading name.' })}
 ${field({ label: 'Nature of ownership', gri: '2-1-b', req: 1, type: 'select', opts: ['Private (unlisted)', 'Publicly listed', 'State-owned', 'Cooperative', 'Partnership', 'Nonprofit'], value: 'Publicly listed' })}
 ${field({ label: 'Legal form', req: 1, type: 'select', opts: ['Joint stock company', 'LLC', 'Free-zone establishment'], value: D.org.form })}
 ${field({ label: 'Commercial registration no.', value: 'CR-1010-556677' })}
 ${field({ label: 'Tax ID', value: 'TAX-300-112-334' })}
 ${sect('Organization structure', 'هيكل المنظمة', 'GRI 2-2')}
 ${field({ label: 'Ultimate parent entity', value: 'Acme Sustainable Industries Holding', pv: { k: 'der', t: t('derived'), l: '#/org/entities' }, help: 'Derived from the B-02 hierarchy root — corrected there, never typed here twice.' })}
 ${sect('Headquarters', 'المقر', 'GRI 2-1-c')}
 ${field({ label: 'Headquarters country', gri: '2-1-c', req: 1, type: 'select', opts: ['Saudi Arabia', 'Egypt', 'UAE'], value: 'Saudi Arabia' })}
 ${field({ label: 'Headquarters city', req: 1, value: 'Riyadh' })}
 ${field({ label: 'Headquarters address', req: 1, value: 'King Fahd Rd, Riyadh 12212' })}
 ${sect('Operating footprint', 'الانتشار التشغيلي', 'GRI 2-1-d')}
 ${field({ label: 'Countries of operation', gri: '2-1-d', req: 1, value: 'Saudi Arabia, Egypt', help: 'At least one — drives entity/site scoping in B-02 & B-03. Multi-select in production.' })}
 ${sect('Report contact', 'جهة اتصال التقرير', 'GRI 2-3-d · captured once')}
 ${field({ label: 'Report contact name', gri: '2-3-d', req: 1, value: 'Layla Al-Harbi' })}
 ${field({ label: 'Report contact email', gri: '2-3-d', req: 1, value: D.org.contact, help: 'Reused by GRI notification and report — entered once here.' })}
 ${field({ label: 'Contact phone', value: '+966 11 000 0000' })}
 ${field({ label: 'Contact role', value: 'Head of Sustainability' })}
 ${sect('Governance', 'الحوكمة', '')}
 ${field({ label: 'Responsible owner', req: 1, type: 'select', opts: ['Layla Al-Harbi', 'Khaled Mansour'], value: 'Layla Al-Harbi', help: 'Roster reference — free-text names are not accepted.' })}
 ${field({ label: 'Preparer entity', value: 'Acme Sustainable Industries Holding', ro: 1, help: 'Locked — SOD-04: a verification body (VVB) can never be the preparer.' })}
 ${sect('Temporal / version control', 'التحكم الزمني والإصدار', '')}
 ${field({ label: 'Effective from', req: 1, type: 'date', value: '2025-01-01', help: 'Must not overlap the previous version.' })}
 ${field({ label: 'Version', value: 'v1 · change ⇒ new version + GRI 2-4 restatement note', ro: 1 })}
 ${field({ label: 'Change reason', type: 'area', value: '', full: 1, help: 'Required on every re-approval — written to the audit log and the 2-4 note.' })}
</div>`}

    VIEWS['org/entities'] = () => pageHead(t('entities'), LANG === 'ar' ? 'شجرة الملكية GRI 2-2. النطاق المالي مرساة B-07 ولا يُكتب هناك أبدًا.' : 'Ownership tree — GRI 2-2. Financial scope anchors B-07 and is never written there.',
      `<button class="btn" onclick="drawer('${t('add')} — Legal entity',entityForm())">＋ ${t('add')}</button>`, 'Organization › Entities') +
      `<div class="tiles">${tile(4, 'Entities')}${tile(3, 'In sustainability scope')}${tile(4, 'In financial scope')}${tile(1, 'Scope difference — explained', 'ok')}</div>
 <div class="card">${toolbar()}<table class="tbl"><thead><tr><th>Entity</th><th>Ctry</th><th>Ownership</th><th>Consolidation</th><th>Sust.</th><th>Fin.</th><th>${t('status')}</th><th></th></tr></thead><tbody>
 ${D.entities.map(e => `<tr><td style="font-weight:600">${e.rel === 'Ultimate parent' ? '🏛 ' : '└ '}${esc(e.name)}<div style="font-size:11px;color:var(--mut)">${e.rel}${e.diff ? ` · <span class="pv der">⚙ 2-2-b note</span>` : ''}</div></td><td>${e.ctry}</td><td>${e.own}%</td><td>${e.cons}</td><td>${e.sus ? '✓' : '✗'}</td><td>${e.fin ? '✓' : '✗'}</td><td>${st(e.st, 'Approved')}</td><td class="rowActs"><a onclick="drawer('${t('edit')} — ${esc(e.name)}',entityForm('${e.id}'))">${t('edit')}</a><a onclick="toast('Version history drawer')">${t('history')}</a></td></tr>`).join('')}
 </tbody></table>${pager(4)}</div>
 <div class="card"><div class="hd">GRI 2-2-c · ${LANG === 'ar' ? 'نهج التوحيد للمجموعة' : 'Group consolidation approach'} <span class="sub">${LANG === 'ar' ? 'يُلتقط هنا؛ B-07 يعيد استخدامه لكل عدسة' : 'captured here; B-07 reuses per lens'}</span><div class="actions"><button class="btn sec" onclick="toast('Edit approach (was seeder-only — now a real UI)')">${t('edit')}</button></div></div>
 <div class="bd formGrid">${field({ label: 'Approach', value: 'Operational control', ro: 1 })}${field({ label: 'Note', value: 'Financial statements consolidate on control per IFRS 10; sustainability boundary applies operational control — difference explained per 2-2-b.', ro: 1, full: 1 })}</div></div>`;
    function entityForm(id) {
      const e = D.entities.find(x => x.id === id) || {}; return `<div class="formGrid">
 ${sect('Identity', 'الهوية', 'GRI 2-1')}
 ${field({ label: 'Legal name', gri: '2-1', req: 1, value: e.name })}
 ${field({ label: 'Trade name(s)', value: '' })}
 ${field({ label: 'Jurisdiction / country of incorporation', req: 1, type: 'select', opts: ['SA', 'EG', 'AE'], value: e.ctry })}
 ${field({ label: 'Legal form', req: 1, type: 'select', opts: ['Joint stock company', 'LLC', 'Joint-venture LLC', 'Free-zone establishment'], value: 'LLC' })}
 ${field({ label: 'Commercial registration no.', value: '' })}
 ${field({ label: 'Tax ID', value: '' })}
 ${sect('Ownership structure', 'هيكل الملكية', 'GRI 2-2')}
 ${field({ label: 'Parent entity', req: 1, type: 'select', opts: ['— none (root) —', 'Acme Sustainable Industries Holding'], value: e.rel === 'Ultimate parent' ? '— none (root) —' : 'Acme Sustainable Industries Holding', help: 'Sets position in the tree — circular references refused.' })}
 ${field({ label: 'Control relationship', req: 1, type: 'select', opts: ['Subsidiary', 'Joint venture', 'Associate', 'Branch'], value: e.rel === 'Ultimate parent' ? 'Subsidiary' : (e.rel || 'Subsidiary') })}
 ${field({ label: 'Ownership %', gri: '2-2', req: 1, type: 'number', value: e.own })}
 ${field({ label: 'Voting rights %', type: 'number', value: '', help: 'Capture separately only when it differs from ownership.' })}
 ${field({ label: 'Non-controlling interest %', value: e.own != null ? String(100 - e.own) : '', ro: 1, help: 'Derived: 100 − ownership. Never typed.' })}
 ${field({ label: 'Control basis', req: 1, type: 'select', opts: ['Financial control', 'Operational control', 'Equity share (joint control)'], value: 'Financial control' })}
 ${sect('Consolidation / reporting scope', 'التوحيد ونطاق التقرير', 'GRI 2-2')}
 ${field({ label: 'Consolidation method', req: 1, type: 'select', opts: ['Full', 'Equity share', 'Proportional', 'Excluded'], value: e.cons })}
 ${field({ label: 'In sustainability report?', req: 1, type: 'select', opts: ['Yes', 'No'], value: e.sus === false ? 'No' : 'Yes' })}
 ${field({ label: 'In financial statements?', req: 1, type: 'select', opts: ['Yes', 'No'], value: 'Yes' })}
 ${field({ label: 'Scope difference rationale', gri: '2-2-b', type: 'area', value: e.diff || '', full: 1, help: 'Required when the entity sits in one scope and not the other.' })}
 ${sect('Lifecycle', 'دورة الحياة', 'GRI 2-4')}
 ${field({ label: 'Entity lifecycle status', gri: '2-4', req: 1, type: 'select', opts: ['Active (no change)', 'Acquired this period', 'Disposed this period', 'Dormant'], value: 'Active (no change)', help: '≠ Active reveals the dates and the restatement note below.' })}
 ${field({ label: 'Acquisition date', type: 'date', value: '' })}
 ${field({ label: 'Disposal date', type: 'date', value: '' })}
 ${field({ label: 'Part-year treatment', type: 'select', opts: ['Full period', 'Part-period — from acquisition date', 'Part-period — until disposal date'], value: 'Full period', help: 'Consumed by every calculation touching this entity’s data.' })}
 ${field({ label: 'Restatement note', gri: '2-4', type: 'area', value: '', full: 1, help: 'Required on any structural change — feeds the restatements register.' })}
 ${sect('Governance', 'الحوكمة', '')}
 ${field({ label: 'Responsible owner', req: 1, type: 'select', opts: ['Layla Al-Harbi', 'Khaled Mansour'], value: 'Khaled Mansour', help: 'Named person + role — not a bare role code.' })}
 ${field({ label: 'Preparer entity', value: 'Acme Sustainable Industries Holding', ro: 1, help: 'Locked — SOD-04: a VVB can never be the preparer.' })}
 ${field({ label: 'Effective from', req: 1, type: 'date', value: '2025-01-01' })}
 ${field({ label: 'Version', value: 'v1', ro: 1 })}
 <div class="full"><label style="font-weight:600;font-size:12px">Evidence</label><div style="border:1.5px dashed var(--line);border-radius:9px;padding:14px;text-align:center;color:var(--mut)">📎 <a onclick="toast('Evidence object — metadata + SHA-256; text-only evidence fields are prohibited (29-§12)')">${LANG === 'ar' ? 'أرفق مستند التأسيس/الملكية' : 'Attach incorporation / ownership document'}</a></div></div>
</div>`}

    VIEWS['org/sites'] = () => pageHead(t('sites'), LANG === 'ar' ? 'سجل تشغيلي كامل: بحث، تصفية، ترقيم صفحات، إضافة/تعديل عبر Drawer — والموقع داخل الحدود قرار B-07 المشتق.' : 'Full operational register: search, filter, pagination, drawer add/edit — in-boundary is B-07’s derived decision.',
      `<button class="btn" onclick="drawer('${t('add')} — Site',siteForm())">＋ ${t('add')}</button>`, 'Organization › Sites') +
      `<div class="tiles">${tile(6, 'Sites')}${tile(4, 'In boundary', 'ok')}${tile(672, 'Headcount (2-7 scale)')}${tile(0, 'Collecting nothing', 'ok')}</div>
 <div class="card">${toolbar(`<select><option>All countries</option><option>SA</option><option>EG</option><option>AE</option></select>`)}
 <table class="tbl"><thead><tr><th>Code</th><th>Site</th><th>Entity</th><th>Control</th><th>Head</th><th>Boundary</th><th>Data domains</th><th>${t('status')}</th><th></th></tr></thead><tbody>
 ${D.sites.map(s => `<tr><td><b>${s.code}</b></td><td>${esc(s.name)}<div style="font-size:11px;color:var(--mut)">${s.status}${s.part ? ` · <span class="pv der">⚙ part-period</span>` : ''}${s.cert ? ` · 🎓 ${s.cert.join(', ')}` : ''}</div></td><td>${s.entity}</td><td>${s.ctl}</td><td>${s.head}</td><td>${s.inB ? '<span class="st approved">In</span>' : `<span class="st na">Out</span>`}${s.excl ? ` <span class="pv der" title="${esc(s.excl)}">⚙ rationale</span>` : ''}</td><td style="font-size:11px">${s.dom.join(' · ') || '—'}</td><td>${st('approved', 'Approved')}</td><td class="rowActs"><a onclick="drawer('${t('edit')} — ${s.code}',siteForm('${s.code}'))">${t('edit')}</a></td></tr>`).join('')}
 </tbody></table>${pager(6)}</div>`;
    function siteForm(code) {
      const s = D.sites.find(x => x.code === code) || { dom: [] }; return `<div class="formGrid">
 ${sect('Identity', 'الهوية', 'GRI 2-1-d')}
 ${field({ label: 'Site name', gri: '2-1-d', req: 1, value: s.name })}
 ${field({ label: 'Site code', req: 1, value: s.code, help: 'Stable across cycles — the cross-module key.' })}
 ${field({ label: 'Site type', req: 1, type: 'select', opts: ['Generation', 'Manufacturing', 'Quarry', 'Warehouse', 'Storage', 'Office', 'Project / construction'], value: s.type })}
 ${sect('Entity', 'الكيان', 'ownership & control inherited from B-02')}
 ${field({ label: 'Owning legal entity', req: 1, type: 'select', opts: D.entities.map(e => e.name), value: (D.entities.find(e => e.id === s.entity) || {}).name, help: 'Must already be approved in B-02.' })}
 ${sect('Location', 'الموقع الجغرافي', 'GRI 2-1')}
 ${field({ label: 'Country / City', req: 1, value: s.ctry })}
 ${field({ label: 'Address', value: '' })}
 ${field({ label: 'Latitude', type: 'number', value: '30.29' })}
 ${field({ label: 'Longitude', type: 'number', value: '31.74' })}
 ${sect('Operations', 'العمليات', 'GRI 2-6 / 2-4')}
 ${field({ label: 'Headcount', gri: '2-7', req: 1, type: 'number', value: s.head, help: 'Aggregates to organizational scale — GRI 2-7.' })}
 ${field({ label: 'Operational control', req: 1, type: 'select', opts: ['Operated', 'Operated (leased)', 'Controlled not operated', 'Equity share'], value: s.ctl, help: 'Drives boundary inclusion under the operational-control approach.' })}
 ${field({ label: 'In reporting boundary?', value: s.inB === false ? 'Out — derived' : 'In — derived', ro: 1, help: 'Auto-derived from control status; confirmed against B-07 — never typed here.' })}
 ${field({ label: 'Operational status', gri: '2-4', req: 1, type: 'select', opts: ['Active (no change)', 'Acquired this period', 'Closed / divested this period', 'Idle / dormant'], value: 'Active (no change)', help: 'Acquisition / closure dates appear only when status changes this period.' })}
 ${field({ label: 'Acquisition date', type: 'date', value: '' })}
 ${field({ label: 'Closure date', type: 'date', value: '' })}
 ${field({ label: 'Part-period status', value: 'Full period — derived from status + dates', ro: 1, help: 'Consumed by calculations; never typed.' })}
 ${field({ label: 'Reporting since', req: 1, type: 'date', value: '2025-01-01' })}
 ${sect('Workforce', 'القوى العاملة', 'GRI 2-7')}
 ${sect('Governance', 'الحوكمة', '')}
 ${field({ label: 'Site data owner', req: 1, type: 'select', opts: ['K. Mansour', 'F. Said', 'R. Hassan'], value: 'F. Said', help: 'Named person — receives this site’s data requests.' })}
 ${field({ label: 'Preparer entity', value: 'Acme Sustainable Industries Holding', ro: 1, help: 'Locked — SOD-04.' })}
 ${sect('Data routing', 'توجيه البيانات', 'each domain generates data requests')}
 ${field({ label: 'Data domains collected here', req: 1, value: (s.dom || []).join(', '), full: 1, help: 'Required when in boundary; forbidden when out — validator preserved. Each selected domain generates data requests for this site in the collection cycle.' })}
 <div class="full"><label style="font-size:12px;font-weight:600">Certifications 🎓</label>
  <div class="card" style="margin:6px 0 0"><table class="tbl"><thead><tr><th>Standard</th><th>Valid until</th><th>Evidence</th><th></th></tr></thead><tbody>
  <tr><td>ISO 14001:2015</td><td>2027-03</td><td><span class="ev">📎 cert-14001.pdf</span></td><td><a onclick="toast('Removed')">✕</a></td></tr>
  <tr><td>ISO 45001:2018</td><td>2026-11</td><td><span class="ev">📎 cert-45001.pdf</span></td><td><a onclick="toast('Removed')">✕</a></td></tr>
  </tbody></table><div style="padding:8px 12px"><button class="btn ghost" onclick="toast('Row added — and preserved on save (defect fixed)')">＋ Add certification</button></div></div>
  <div class="help">Regression note: saving this form preserves certification rows (the silent-wipe defect is closed).</div></div>
</div>`}

    VIEWS['org/acts'] = () => pageHead(t('acts'), 'GRI 2-6 — activities, products, services, markets and value-chain relationships.',
      `<button class="btn" onclick="drawer(t('add')+' — Activity / product',actForm())">＋ ${t('add')}</button>`, 'Organization › Activities') +
      `<div class="tiles">${tile(5, 'Items')}${tile('4/4', 'Segments covered', 'ok')}${tile(3, 'Markets served')}${tile(1, 'Changes this period')}</div>
 <div class="card">${toolbar()}<table class="tbl"><thead><tr><th>Item</th><th>Type</th><th>Suggested sector</th><th>Entities</th><th>Change</th><th>${t('status')}</th></tr></thead><tbody>
 <tr><td><b>Utility-scale renewable generation</b></td><td>Own operations</td><td>Energy ${pv('reuse', 'feeds Sector tab', '#/org/sector')}</td><td>LE-02</td><td>—</td><td>${st('approved', 'Approved')}</td></tr>
 <tr><td><b>Cement & clinker production</b></td><td>Own operations</td><td>Construction materials</td><td>LE-03</td><td>—</td><td>${st('approved', 'Approved')}</td></tr>
 <tr><td><b>Aggregates quarrying</b></td><td>Own operations</td><td>Construction materials / Mining ${pv('der', 'reconciliation open', '#/org/sector')}</td><td>LE-03</td><td>—</td><td>${st('approved', 'Approved')}</td></tr>
 <tr><td><b>Regional logistics services</b></td><td>Service</td><td>Logistics</td><td>LE-04</td><td>—</td><td>${st('approved', 'Approved')}</td></tr>
 <tr><td><b>Fuel storage (Dammam)</b></td><td>Own operations</td><td>Energy</td><td>LE-02</td><td>⚙ Removed Sep 2025 — change described (2-6-d)</td><td>${st('approved', 'Approved')}</td></tr>
 </tbody></table></div>
 <div class="notice info"><b>Materiality note moved:</b> pre-assessment notes captured here now flow to the Materiality Context register with a "from Activities" chip — they are inputs to GRI 3, not GRI 3 judgements.</div>`;

    /* — sector classification: data-driven register + create/submit/approve workflow — */
    D.sectors = [
      { id: 'SC-01', name: 'Renewable power generation', primary: true, resolved: 'No published GRI sector standard covers renewables — GRI 11 (Oil & Gas) does NOT apply', std: null, basis: 'Utility-scale solar & wind only; no oil/gas value chain. (Fixes the demo defect that mapped renewables → GRI 11.)', by: 'Layla Al-Harbi', eff: '2025-01-01', ev: 'Strategy plan 2025', st: 'approved' },
      { id: 'SC-02', name: 'Construction materials (cement)', primary: false, resolved: 'Watch list — GSSB project underway', std: null, basis: 'Cement production; monitored for a future sector standard.', by: 'Layla Al-Harbi', eff: '2025-01-01', ev: 'B-04 activity register', st: 'approved' },
      { id: 'SC-03', name: 'Mining & quarrying (aggregates)', primary: false, resolved: 'resolved from register · eff. 2026-01-01', std: 'GRI 14: Mining 2024', basis: '⚠ Pending confirmation — likely-material sector topics queued, not auto-included.', by: 'O. Farid', eff: '2026-01-01', ev: 'Ecology screening 2025', st: 'review' }
    ];
    function secClsForm() {
      return `<div class="formGrid">
 ${field({ label: LANG === 'ar' ? 'القطاع (من التصنيف)' : 'Sector (taxonomy)', req: 1, type: 'select', opts: ['Mining & quarrying (aggregates)', 'Oil & Gas (GRI 11)', 'Coal (GRI 12)', 'Agriculture, aquaculture & fishing (GRI 13)', 'Construction materials (cement)', 'Renewable power generation', 'Financial services (under development)', 'Textiles & apparel (under development)'], full: 1, help: LANG === 'ar' ? 'القائمة من سجل المعايير — ليست Hard-coded' : 'List comes from the standards register — never hard-coded.' })}
 ${field({ label: LANG === 'ar' ? 'أساسي؟' : 'Primary?', req: 1, type: 'select', opts: ['Yes — primary sector', 'No — secondary'], value: 'No — secondary' })}
 ${field({ label: LANG === 'ar' ? 'ساري من' : 'Effective from', req: 1, type: 'date', value: '2026-01-01' })}
 ${field({ label: LANG === 'ar' ? 'أساس التصنيف' : 'Classification basis', req: 1, type: 'area', ph: LANG === 'ar' ? 'لماذا ينطبق/لا ينطبق هذا القطاع — يُكتب الأساس دائمًا' : 'Why this sector applies / does not apply — the basis is always written', full: 1 })}
 ${field({ label: LANG === 'ar' ? 'الأنشطة المرتبطة' : 'Related activities', type: 'select', opts: ['ACT-03 · Aggregates quarrying', 'ACT-01 · Solar generation', 'ACT-02 · Cement production', 'ACT-04 · Logistics'], full: 1, pv: { k: 'reuse', t: LANG === 'ar' ? 'من الأنشطة (B-04)' : 'from Activities (B-04)', l: '#/org/acts' } })}
 ${field({ label: LANG === 'ar' ? 'الدليل' : 'Evidence', type: 'select', opts: ['EV-0019 · Utility invoice', 'EV-0021 · Pro-rating worksheet', '＋ Upload new…'], help: LANG === 'ar' ? 'مستند يدعم الأساس' : 'A document supporting the basis.' })}
 ${field({ label: LANG === 'ar' ? 'طبيعة النشاط' : 'Activity nature', req: 1, type: 'select', opts: ['Extraction & primary processing', 'Manufacturing', 'Services'], value: 'Extraction & primary processing' })}
 ${field({ label: LANG === 'ar' ? 'حدده' : 'Determined by', req: 1, type: 'select', opts: ['Layla Al-Harbi', 'O. Farid', 'Dr. H. Nassar'], value: 'Layla Al-Harbi' })}
 ${field({ label: LANG === 'ar' ? 'المراجع' : 'Reviewer', req: 1, type: 'select', opts: ['O. Farid', 'Dr. H. Nassar'], value: 'O. Farid', help: 'SoD: determiner ≠ reviewer.' })}
 ${field({ label: LANG === 'ar' ? 'الحالة / الإصدار' : 'Status / version', value: 'Draft · v1', ro: 1 })}
 ${sect('Derived — from the standards register', 'مشتق من سجل المعايير', 'never typed')}
 ${field({ label: 'Resolved GRI sector standard', value: 'GRI 14: Mining (when published) · today: none published for aggregates', pv: { k: 'der', t: t('derived'), l: '#/setup/standards' }, full: 1 })}
 ${field({ label: 'Effective edition', value: '— resolves from the register at cycle publication date', pv: { k: 'der', t: t('derived') } })}
 ${field({ label: 'Applicability impact', value: 'Sector topics will enter B-10 as “sector-required” rows on approval', pv: { k: 'der', t: t('derived'), l: '#/setup/applic' } })}
</div>`}
    function secClsFoot() {
      return `<button class="btn sec" onclick="closeDrawer()">${t('cancel')}</button>
 <button class="btn sec" onclick="secClsSave('draft')">${LANG === 'ar' ? 'حفظ مسودة' : 'Save draft'}</button>
 <button class="btn" onclick="secClsSave('submitted')">${LANG === 'ar' ? 'إرسال للمراجعة' : 'Submit for review'} →</button>`
    }
    function secClsSave(st0) {
      const d = document.querySelector('#drawer'); const sel = d.querySelectorAll('select')[0].value; const basis = d.querySelector('textarea').value || '(basis pending)';
      D.sectors.unshift({ id: 'SC-0' + (D.sectors.length + 1), name: sel, primary: d.querySelectorAll('select')[1].value.startsWith('Yes'), resolved: LANG === 'ar' ? 'يُحل من السجل عند الاعتماد' : 'resolves from the register on approval', std: null, basis, by: d.querySelectorAll('select')[4] ? d.querySelectorAll('select')[4].value : 'Layla Al-Harbi', eff: d.querySelector('input[type=date]').value, ev: '—', st: st0 });
      audit('sector.classification', D.sectors[0].id, st0 + ' · ' + sel); closeDrawer(); toast(st0 === 'draft' ? (LANG === 'ar' ? 'حُفظت مسودة التصنيف' : 'Classification draft saved') : (LANG === 'ar' ? 'أُرسل للمراجعة الفنية' : 'Submitted to technical review')); render()
    }
    function secClsApprove(id) { const r = D.sectors.find(x => x.id === id); if (!r) return; r.st = 'approved'; audit('sector.classification', id, 'approved (technical review)'); toast(LANG === 'ar' ? 'اعتُمد التصنيف — الانطباق يعاد حسابه' : 'Classification approved — applicability re-resolves'); render() }
    VIEWS['org/sector'] = () => pageHead(t('sector'), LANG === 'ar' ? 'تصنيف على مستوى المنظمة بأساس مكتوب. معيار القطاع المحلول يُستدعى من السجل — لا يُكتب.' : 'Org-scoped classification with a written determination basis. The resolved GRI Sector Standard is looked up from the register — never typed.',
      `<button class="btn" onclick="drawer('＋ '+(LANG==='ar'?'إضافة تصنيف قطاع':'Add sector classification'),secClsForm(),secClsFoot())">＋ ${t('add')}</button>`, 'Organization › Sector (B-08)') +
      `<div class="notice warn"><b>Reconciliation open:</b> quarrying activity (B-04) may fall under <b>GRI 14: Mining 2024</b> (effective 01 Jan 2026). Confirm the classification or record why it does not apply — the in-accordance claim counts sector coverage.</div>
 <div class="card"><table class="tbl"><thead><tr><th>Sector (taxonomy)</th><th>Primary</th><th>Resolved standard ⚙</th><th>${LANG === 'ar' ? 'أساس التحديد' : 'Determination basis'}</th><th>${LANG === 'ar' ? 'حدده' : 'By'}</th><th>${t('status')}</th><th></th></tr></thead><tbody>
 ${D.sectors.map(r => `<tr><td><b>${esc(r.name)}</b><div style="font-size:10.5px;color:var(--mut)" data-noar>${r.id} · eff. ${esc(r.eff)}</div></td><td>${r.primary ? '★ Primary' : '—'}</td><td>${r.std ? `<b>${esc(r.std)}</b> ${pv('der', esc(r.resolved), '')}` : pv('der', esc(r.resolved), '')}</td><td style="font-size:12px">${esc(r.basis)} ${r.ev && r.ev !== '—' ? `<span class="ev" title="${esc(r.ev)}">📎</span>` : ''}</td><td style="font-size:12px">${esc(r.by)}</td><td>${st(r.st === 'approved' ? 'approved' : r.st === 'review' ? 'review' : r.st === 'submitted' ? 'submitted' : 'draft', r.st)}</td>
 <td class="rowActs">${r.st === 'approved' ? `<a onclick="toast('${LANG === 'ar' ? 'الأساس + الدليل (قراءة)' : 'Basis + evidence (read-only)'}')">${t('view')}</a>` : r.st === 'review' || r.st === 'submitted' ? `<a onclick="secClsApprove('${r.id}')"><b>${LANG === 'ar' ? 'اعتماد' : 'Approve'}</b></a>` : `<a onclick="toast('${LANG === 'ar' ? 'استكمال المسودة' : 'Continue draft'}')">${t('edit')}</a>`}</td></tr>`).join('')}
 </tbody></table></div>
 <div class="notice err"><b>Sector-content completeness control:</b> a sector standard resolving <i>Applicable</i> with no loaded disclosure content blocks the in-accordance claim path until the content release is activated (Admin › Content loader).</div>`;

    VIEWS['org/cycles'] = () => pageHead(t('cycles'), 'The period selector every downstream workspace scopes to. Claim, phase and alignment are derived — never typed.',
      `<button class="btn sec" onclick="drawer(t('add')+' — quick',cycleForm())">＋ ${LANG === 'ar' ? 'سريع' : 'Quick'}</button><button class="btn" onclick="openWizard()">🧭 ${LANG === 'ar' ? 'دورة جديدة (موجَّه)' : 'New cycle (guided)'}</button>`, 'Organization › Cycles') +
      `<div class="tiles">${tile(3, 'Cycles')}${tile(1, 'Published & locked', 'ok')}${tile(1, 'Active')}${tile(0, 'Overdue', 'ok')}</div>
 <div class="card"><table class="tbl"><thead><tr><th>Cycle</th><th>Period</th><th>Publication</th><th>Intent</th><th>Claim ⚙</th><th>Phase</th><th></th></tr></thead><tbody>
 <tr class="sel"><td><b>ACME-FY2025</b><div style="font-size:11px;color:var(--mut)">${esc(D.cycle.name)}</div></td><td>${D.cycle.period}</td><td>${D.cycle.pub}</td><td>In accordance</td><td>${pv('der', 'Not yet eligible · ' + reqStats() + '/9', '#/rev/claim')}</td><td>${st('progress', D.cycle.phase + ' · 4/8')}</td><td class="rowActs"><a href="#/setup/readiness">${t('open')}</a></td></tr>
 <tr><td><b>ACME-FY2024</b></td><td>Jan–Dec 2024</td><td>30 Apr 2025</td><td>With reference</td><td>${pv('lock', 'With reference · published')}</td><td>${st('locked', 'Locked')}</td><td class="rowActs"><a onclick="toast('Read-only — locked period')">${t('view')}</a></td></tr>
 <tr><td><b>ACME-FY2023</b></td><td>Jan–Dec 2023</td><td>—</td><td>—</td><td>—</td><td>${st('locked', 'Locked')}</td><td class="rowActs"><a onclick="toast('Read-only')">${t('view')}</a></td></tr>
 </tbody></table></div>`+ `<div class="quickRow">🗂 ${LANG === 'ar' ? 'صفحة سجل الدورة بالأقسام القابلة للطي' : 'The cycle record page with collapsible sections'}: <a href="#/org/cycledetail" data-noar>ACME-FY2025 →</a></div>`;
    function cycleForm() {
      return `<div class="formGrid">
 ${sect('Cycle identity', 'هوية الدورة', '')}
 ${field({ label: 'Cycle name', req: 1, ph: 'Sustainability Report FY2026' })}
 ${field({ label: 'Cycle code', req: 1, ph: 'ACME-FY2026', help: 'Unique per organization.' })}
 ${sect('Sustainability reporting period', 'فترة تقرير الاستدامة', 'GRI 2-3-a')}
 ${field({ label: 'Period start', gri: '2-3-a', req: 1, type: 'date', value: '2026-01-01' })}
 ${field({ label: 'Period end', req: 1, type: 'date', value: '2026-12-31' })}
 ${field({ label: 'Frequency', req: 1, type: 'select', opts: ['Annual', 'Biennial', 'Other'], value: 'Annual' })}
 ${sect('Financial period & alignment', 'الفترة المالية والتوافق', 'GRI 2-3-b')}
 ${field({ label: 'Financial period start', req: 1, type: 'date', value: '2026-01-01' })}
 ${field({ label: 'Financial period end', req: 1, type: 'date', value: '2026-12-31' })}
 ${field({ label: 'Alignment', req: 1, type: 'select', opts: ['Same as sustainability period', 'Different'], value: 'Same as sustainability period' })}
 ${field({ label: 'Reason for the difference', type: 'area', value: '', full: 1, help: 'Required only when Alignment = Different — GRI 2-3-b.' })}
 ${sect('Publication & intent', 'النشر ونية الإبلاغ', 'GRI 2-3-c · GRI 1')}
 ${field({ label: 'Target publication', gri: '2-3-c', req: 1, type: 'date', value: '2027-04-30', err: '', help: 'Plausibility pack: publication within 18 months of period end; collection due dates must precede it.' })}
 ${field({ label: 'Reporting intent', req: 1, type: 'select', opts: ['In accordance with the GRI Standards', 'With reference to the GRI Standards'], help: 'The claim itself is computed — intent only declares the target.' })}
 ${field({ label: 'Standards baseline', req: 1, type: 'select', opts: ['GRI 1/2/3 : 2021', 'GRI 1/2/3 : 2021 + GRI 102/103 : 2025 (early adoption)'], value: 'GRI 1/2/3 : 2021', full: 1, help: 'Feeds B-09 — the applicable version then resolves per standard from the register; elections live there.' })}
 ${sect('Assurance plan', 'خطة التأكيد', 'GRI 2-5 · capture-once')}
 ${field({ label: 'External assurance planned?', gri: '2-5', type: 'select', opts: ['Yes — create assurance engagement', 'No'], value: 'Yes — create assurance engagement', help: 'Provider, level, scope and standards live on the Assurance Engagement record — not here (capture once).' })}
 ${sect('Governance', 'الحوكمة', '')}
 ${field({ label: 'Cycle owner', req: 1, type: 'select', opts: ['Layla Al-Harbi (ESG Programme Manager)', 'Khaled Mansour'], value: 'Layla Al-Harbi (ESG Programme Manager)' })}
 ${sect('Derived — read-only', 'مشتق — قراءة فقط', 'never typed')}
 ${field({ label: 'Claim', value: 'NONE — computed by the claim engine (3/9 today)', pv: { k: 'calc', t: 'ƒx claim engine', l: '#/rev/claim' } })}
 ${field({ label: 'Phase', value: 'Data collection — one-way stepper', pv: { k: 'der', t: t('derived') } })}
 ${field({ label: 'Readiness', value: 'G2 of G7 · computed from stage gates', pv: { k: 'der', t: t('derived'), l: '#/setup/readiness' } })}
 ${field({ label: 'Standards resolution', value: 'GRI 305:2016 resolves for FY2026 unless elected', pv: { k: 'der', t: t('derived'), l: '#/setup/standards' } })}
 ${field({ label: 'Boundary state', value: 'Locked v3 · 4 entities / 6 sites', pv: { k: 'der', t: t('derived'), l: '#/setup/boundary' } })}
</div>`}

    /* ================= REPORTING SETUP (cycle-scoped) ================= */
    const SETUPSTEPS = [
      ['1', 'Organization profile', 'B-01 · GRI 2-1', 'Starting point', '1 of 1 checks passed', '—', 'complete', 'org/profile'],
      ['2', 'Legal entities', 'B-02 · GRI 2-2', 'Ownership & consolidation', '2 of 2 checks passed', 'Organization profile', 'complete', 'org/entities'],
      ['3', 'Sites', 'B-03 · GRI 2-1-d', 'Locations & data routing', '2 of 2 checks passed', 'Legal entities', 'complete', 'org/sites'],
      ['4', 'Activities & value chain', 'B-04 · GRI 2-6', 'What enters, exits, changed', '1 of 3 checks passed', 'Legal entities', 'incomplete', 'org/acts'],
      ['5', 'Reporting period', 'B-05 · GRI 2-3', 'Period, frequency, intent', '4 of 4 checks passed', 'Organization profile', 'complete', 'org/cycles'],
      ['6', 'Reporting boundary', 'B-07 · GRI 2-2', 'Entities & sites in scope', '1 of 3 checks passed', 'Entities, Sites', 'incomplete', 'setup/boundary'],
      ['7', 'Sector classification', 'B-08', 'Sector → sector standards', '1 of 3 checks passed', 'Activities', 'incomplete', 'org/sector'],
      ['8', 'Applicable standards', 'B-09 · GRI 1', 'Editions resolved per publication date', '1 of 3 checks passed', 'Boundary, Sector', 'incomplete', 'setup/standards'],
      ['9', 'Materiality readiness', 'C-01 · GRI 3', 'Not owned here — read from Track C', '—', 'Sector, Standards', 'blocked', 'mat/config'],
      ['10', 'External assurance readiness', 'B-05 · GRI 2-5', 'Optional — engagement exists', '4 of 4 checks passed', 'Starting point', 'complete', 'asr/aeng']];
    VIEWS['setup/console'] = () => pageHead(LANG === 'ar' ? 'وحدة تهيئة الدورة' : 'Cycle Setup Console', LANG === 'ar' ? 'شاشة تنسيق فقط — لا تلتقط أي بيانات: كل قيمة مقروءة من الشاشة المالكة، والإصلاح يفتح تلك الشاشة.' : 'Orchestration only — this screen captures no data: every value is read from its owning screen; Fix opens that screen.',
      `<button class="btn sec" onclick="drawer('${LANG === 'ar' ? 'التخلي عن التهيئة' : 'Abandon setup'}',\`<div class=formGrid>\${field({label:'Abandon reason',req:1,type:'area',full:1,help:'Mandatory — written to the audit log; the draft is retained.'})}</div>\`)">${LANG === 'ar' ? 'التخلي بسبب' : 'Abandon (reason)'}</button><button class="btn" onclick="toast('Setup resumed at step 4 — Activities')">${LANG === 'ar' ? 'استئناف' : 'Resume setup'}</button>`, 'Reporting Setup › Cycle Setup Console (B-06)') +
      `<div class="tiles">${tile(1, 'Setup runs')}${tile(1, 'Open', 'warn')}${tile(0, 'Complete')}${tile('6/10', 'Steps complete', 'ok')}</div>
 <div class="card"><div class="hd">${LANG === 'ar' ? 'خطوات التهيئة — المحاولة 1' : 'Setup steps — attempt 1'} <span class="sub">${D.cycle.code} · ${LANG === 'ar' ? 'مسودة' : 'draft'} v1</span></div>
 <table class="tbl"><thead><tr><th>#</th><th>${LANG === 'ar' ? 'الخطوة' : 'Step'}</th><th>${LANG === 'ar' ? 'الغرض' : 'Purpose'}</th><th>${LANG === 'ar' ? 'الفحوص' : 'Checks'}</th><th>${LANG === 'ar' ? 'يعتمد على' : 'Depends on'}</th><th>${t('status')}</th><th></th></tr></thead><tbody>
 ${SETUPSTEPS.map(r => `<tr><td>${r[0]}</td><td style="font-weight:600">${r[1]}<div style="font-size:11px;color:var(--mut)" data-noar>${r[2]}</div></td><td style="font-size:12px">${r[3]}</td><td style="font-size:12px">${r[4]}</td><td style="font-size:12px;color:var(--mut)">${r[5]}</td><td>${r[6] === 'complete' ? st('approved', LANG === 'ar' ? 'مكتملة' : 'Complete') : r[6] === 'blocked' ? st('blocked', LANG === 'ar' ? 'محجوبة' : 'Blocked') + `<div style="font-size:10px;color:var(--mut)">${LANG === 'ar' ? 'لماذا: خطوات 7–8 لم تكتمل' : 'why: steps 7–8 incomplete'}</div>` : st('review', LANG === 'ar' ? 'غير مكتملة' : 'Incomplete')}</td><td class="rowActs"><a onclick="location.hash='#/${r[7]}';render()">${r[6] === 'complete' ? (LANG === 'ar' ? 'فتح المصدر' : 'Open source') : (LANG === 'ar' ? 'إصلاح' : 'Fix')}</a></td></tr>`).join('')}
 </tbody></table></div>
 <div class="card"><div class="hd">${LANG === 'ar' ? 'تفاصيل المحاولة' : 'Attempt details'}</div><div class="bd formGrid">
  ${field({ label: 'Cycle', value: D.cycle.code + ' · ' + D.cycle.period, pv: { k: 'reuse', t: 'B-05', l: '#/org/cycles' } })}
  ${field({ label: 'Phase', value: 'Data collection', pv: { k: 'der', t: t('derived') } })}
  ${field({ label: 'Setup owner', value: 'Layla Al-Harbi', ro: 1 })}
  ${field({ label: 'Claim preview', value: 'No statement of use yet — requires all 9 GRI 1 requirements; B-11 readiness feeds it', pv: { k: 'calc', t: 'ƒx', l: '#/rev/claim' } })}
  ${field({ label: 'Setup notes', type: 'area', value: '', full: 1, help: 'The only free field this console owns.' })}
 </div></div>
 <div class="notice info"><b>${LANG === 'ar' ? 'قاعدة:' : 'Rule:'}</b> ${LANG === 'ar' ? 'هذه الشاشة لا تملك أي حقيقة عمل — أي تعديل يفتح الشاشة المالكة.' : 'This console owns no business fact — every edit opens the owning screen.'}</div>`;

    function setupRail(active) {
      const steps = [['boundary', 'B-07', t('boundary'), 'pass'], ['standards', 'B-09', t('standards'), 'pass'], ['applic', 'B-10', t('applic'), 'pass'], ['gri2', 'B-11', t('gri2'), 'warn'], ['omissions', 'B-13', t('omissions'), 'warn'], ['readiness', 'B-14', t('readiness'), 'warn']];
      return `<div class="card"><div class="bd" style="display:flex;gap:6px;flex-wrap:wrap;padding:10px 14px">
  <span style="font-size:11px;color:var(--mut);align-self:center;margin-inline-end:6px">${t('setup')} · ${D.cycle.code} — ${LANG === 'ar' ? 'شريط الجاهزية (بديل شاشة B-06)' : 'readiness rail (replaces B-06 screen)'}:</span>
  ${steps.map(([r, id, n, s]) => `<button class="btn ${active === r ? '' : 'sec'}" style="padding:5px 11px;font-size:11.5px" onclick="nav('setup/${r}')">${s === 'pass' ? '✓' : '⚠'} ${id} · ${n}</button>`).join('')}
 </div></div>`}

    /* — reporting boundary: locked-cycle state + first-cycle draft grid — */
    let BND_TAB = 0; function bndTab(i) { BND_TAB = i; render() }
    D.bndDraft = [
      { m: 'Acme Energy KSA', id: 'LE-02', kind: 'Entity', fin: true, sus: 'Yes', basis: 'Operational control', rat: '' },
      { m: 'Acme Materials Egypt', id: 'LE-03', kind: 'Entity', fin: true, sus: 'Undecided', basis: 'Operational control', rat: '' },
      { m: 'Acme Logistics UAE', id: 'LE-04', kind: 'Entity', fin: true, sus: 'No', basis: 'Equity share', rat: 'Leased hub under equity-share treatment — 2-2-b note' },
      { m: 'Sudair Solar Plant', id: 'SA-SOL-01', kind: 'Site', fin: true, sus: 'Yes', basis: 'Operational control', rat: '' },
      { m: 'Jebel Ali Logistics Hub', id: 'AE-LOG-01', kind: 'Site', fin: true, sus: 'Undecided', basis: 'Equity share', rat: '' }
    ];
    function bndSet(i, k, v) { D.bndDraft[i][k] = v; audit('boundary.draft', D.bndDraft[i].id, k + '=' + v); render() }
    function bndDraftGrid() {
      const und = D.bndDraft.filter(r => r.sus === 'Undecided').length;
      const noRat = D.bndDraft.filter(r => r.sus === 'No' && !r.rat.trim()).length;
      const ok = !und && !noRat;
      return `<div class="notice info"><b>${LANG === 'ar' ? 'الدورة الأولى — شبكة مسودة الحدود' : 'First cycle — Draft Boundary Grid'}:</b> ${LANG === 'ar' ? 'تُفتح مباشرة بعد إنشاء الدورة. «غير محسوم» قيمة حقيقية — البوابة لا تُجتاز بالافتراض.' : 'opens immediately after Create Cycle. “Undecided” is a real value — the gate is never passed by defaulting.'}</div>
 <div class="card"><table class="tbl"><thead><tr><th>${LANG === 'ar' ? 'العضو' : 'Entity / Site'}</th><th>Financial</th><th>Sustainability — ${LANG === 'ar' ? 'إدراج؟' : 'Include?'}</th><th>${LANG === 'ar' ? 'الأساس' : 'Basis'}</th><th>${LANG === 'ar' ? 'الحصة المطبقة' : 'Applied share'}</th><th>${LANG === 'ar' ? 'المعالجة' : 'Treatment'}</th><th>${LANG === 'ar' ? 'مبرر الاستبعاد' : 'Exclusion rationale'}</th></tr></thead><tbody>
 ${D.bndDraft.map((r, i) => `<tr><td><b>${esc(r.m)}</b><div style="font-size:10.5px;color:var(--mut)" data-noar>${r.id} · ${r.kind}</div></td><td style="text-align:center">✓</td>
 <td><select style="width:auto;padding:4px 9px;font-size:12px;${r.sus === 'Undecided' ? 'border-color:var(--warnBd);background:var(--warnBg)' : ''}" onchange="bndSet(${i},'sus',this.value)">${['Yes', 'No', 'Undecided'].map(o => `<option ${r.sus === o ? 'selected' : ''}>${o}</option>`).join('')}</select></td>
 <td><select style="width:auto;padding:4px 9px;font-size:12px" onchange="bndSet(${i},'basis',this.value)">${['Operational control', 'Financial control', 'Equity share'].map(o => `<option ${r.basis === o ? 'selected' : ''}>${o}</option>`).join('')}</select></td>
 <td style="font-size:12px">${r.basis === 'Equity share' ? '50% <span class="pv reuse" title="from B-02 — override needs a reason">🔗</span>' : '100% <span class="pv reuse" title="from B-02">🔗</span>'}</td>
 <td style="font-size:11.5px">${r.sus === 'No' ? (LANG === 'ar' ? 'خارج الحدود' : 'Out of boundary') : r.basis === 'Equity share' ? 'Equity-share pro-rata' : 'Full'}</td>
 <td>${r.sus === 'No' ? `<input style="padding:4px 9px;font-size:12px;${!r.rat.trim() ? 'border-color:var(--errBd,#FECDCA)' : ''}" value="${esc(r.rat)}" placeholder="${LANG === 'ar' ? 'مطلوب لكل استبعاد' : 'required for every exclusion'}" onchange="bndSet(${i},'rat',this.value)">` : '<span style="color:var(--mut)">—</span>'}</td></tr>`).join('')}
 </tbody></table>
 <div style="display:flex;gap:8px;align-items:center;padding:12px 16px;border-top:1px solid var(--line2)">
  <span class="st ${ok ? 'ok' : 'warn'}">${und} ${LANG === 'ar' ? 'غير محسوم' : 'Undecided'} · ${noRat} ${LANG === 'ar' ? 'استبعاد بلا مبرر' : 'exclusion(s) missing rationale'}</span><span style="flex:1"></span>
  <button class="btn sec" onclick="audit('boundary.draft','cycle','draft saved');toast('${LANG === 'ar' ? 'حُفظت المسودة' : 'Draft saved'}')">${LANG === 'ar' ? 'حفظ مسودة' : 'Save draft'}</button>
  <button class="btn sec" onclick="audit('boundary.draft','cycle','submitted to technical review');toast('${LANG === 'ar' ? 'أُرسلت للمراجعة الفنية' : 'Submitted to technical review'}')">${LANG === 'ar' ? 'إرسال للمراجعة' : 'Submit'} →</button>
  <button class="btn" ${ok ? '' : 'disabled title="Refused: undecided members / missing rationale"'} onclick="audit('boundary','cycle','approved & locked (PG-02)');toast('${LANG === 'ar' ? 'اعتُمدت وقُفلت — PG-02' : 'Approved & locked — PG-02'}')">🔒 ${LANG === 'ar' ? 'اعتماد وقفل' : 'Approve & lock'}</button>
 </div></div>`}
    VIEWS['setup/boundary'] = () => setupRail('boundary') + pageHead(t('boundary'), LANG === 'ar' ? 'الحدود لكل عدسة (GRI 2-2 / ISO 14064-1 §5). «غير محسوم» قيمة حقيقية؛ البوابة لا تُجتاز بالافتراض.' : 'Per-lens boundary (GRI 2-2 / ISO 14064-1 §5). Undecided is a real value; the gate cannot be passed by defaulting.',
      BND_TAB === 0 ? `<span class="st approved">🔒 Approved & locked</span><button class="btn sec" onclick="toast('Change after lock opens a restatement (GRI 2-4)')">${LANG === 'ar' ? 'فتح إعادة عرض' : 'Open restatement'}</button>` : `<span class="st draft">DRAFT</span>`, 'Reporting Setup › Boundary (B-07)') +
      `<div class="wsTabs"><button class="${BND_TAB === 0 ? 'on' : ''}" onclick="bndTab(0)">ACME-FY2025 · ${LANG === 'ar' ? 'معتمدة ومقفلة' : 'Approved & locked'}</button><button class="${BND_TAB === 1 ? 'on' : ''}" onclick="bndTab(1)">${LANG === 'ar' ? 'الدورة الأولى (مسودة) — مثال FY2026' : 'First cycle (draft) — FY2026 walkthrough'}</button></div>` +
      (BND_TAB === 1 ? bndDraftGrid() :
        `<div class="card"><div class="hd">${LANG === 'ar' ? 'أساس الحدود' : 'Boundary basis'} <span class="sub">GRI 2-2 · ISO 14064-1 §5</span><div class="actions"><button class="btn sec" onclick="drawer('${LANG === 'ar' ? 'أساس الحدود' : 'Boundary basis'} — v3',bndBasisForm())">${t('edit')}</button></div></div><div class="bd formGrid">
  ${field({ label: 'Boundary lens', value: 'Sustainability report (GRI 2-2)', ro: 1, help: 'Three lenses: Financial · Sustainability · GHG organizational — each its own basis version.' })}
  ${field({ label: 'Standard / basis reference', value: 'GRI 2-2 + ISO 14064-1:2018 §5 (GHG lens)', ro: 1 })}
  ${field({ label: 'Consolidation approach', value: 'Operational control', pv: { k: 'reuse', t: 'from Group approach (B-02)', l: '#/org/entities' } })}
  ${field({ label: 'Base year (GHG lens)', value: 'FY2022 · recalculation policy ±5%', pv: { k: 'reuse', t: 'Calc Book §7' } })}
  ${field({ label: 'Bound to cycle', value: D.cycle.code, pv: { k: 'reuse', t: 'B-05', l: '#/org/cycles' } })}
  ${field({ label: 'Effective period', value: '2025-01-01 → 2025-12-31', ro: 1 })}
  ${field({ label: 'Basis owner', value: 'Layla Al-Harbi', ro: 1 })}
  ${field({ label: 'Reviewer', value: 'O. Farid — approved 12 Jan 2025', pv: { k: 'lock', t: t('apprv') } })}
 </div></div>
 <div class="card"><div class="hd">Sustainability lens <span class="sub">operational control</span><div class="actions">${st('approved', 'Approved')}</div></div><div class="bd">
 <div class="kv"><dt>Consolidation approach</dt><dd>${pv('reuse', 'Operational control — from Group approach (B-02)', '#/org/entities')} <span style="font-weight:400;color:var(--mut)">no override for this lens</span></dd>
 <dt>Entities decided</dt><dd>4/4 (3 in · 1 out with 2-2-b note)</dd><dt>Sites decided</dt><dd>6/6 (4 in · 1 out with rationale · 1 closed part-period)</dd>
 <dt>Evidence</dt><dd><span class="ev">📎 boundary-memo-fy2025.pdf</span></dd></div>
 <table class="tbl" style="margin-top:12px"><thead><tr><th>Member</th><th>Financial</th><th>Sustainability</th><th>GHG org.</th><th>Applied share</th><th>Note</th></tr></thead><tbody>
 <tr><td>Acme Energy KSA</td><td>✓</td><td>✓</td><td>✓</td><td>100% ${pv('reuse', 'from B-02', '#/org/entities')}</td><td>—</td></tr>
 <tr><td>Acme Materials Egypt</td><td>✓</td><td>✓</td><td>✓</td><td>75% ${pv('reuse', 'from B-02', '')} <span class="pv der" title="Override requires a reason">⚙ override allowed</span></td><td>—</td></tr>
 <tr><td>Acme Logistics UAE</td><td>✓</td><td>✗</td><td>✗</td><td>—</td><td style="font-size:11.5px">2-2-b: equity-share treatment — rationale recorded</td></tr>
 <tr><td>SA-DEP-01 Dammam depot</td><td>—</td><td>✓ (9 mo)</td><td>✓ (9 mo)</td><td>—</td><td style="font-size:11.5px">⚙ part-period pro-rata · GRI 2-4 note</td></tr>
 </tbody></table></div></div>
 <div class="card"><div class="hd">${LANG === 'ar' ? 'التسوية مقابل الحدود المالية' : 'Reconciliation vs financial boundary'} <span class="sub">GRI 2-2-b</span></div><div class="bd formGrid">
  ${field({ label: 'Scope difference narrative', value: 'Financial statements consolidate Acme Logistics UAE (full, IFRS 10); the sustainability boundary applies operational control and excludes it — equity-share GHG treatment recorded.', ro: 1, full: 1 })}
  ${field({ label: 'Reconciliation status', value: 'Reconciled — no unexplained member', pv: { k: 'der', t: t('derived') } })}
  ${field({ label: 'Evidence', value: '📎 boundary-memo-fy2025.pdf · EV-0031', pv: { k: 'reuse', t: 'Evidence object' } })}
 </div></div>
 <div class="notice ok"><b>PG-02 PASS</b> — all lenses approved; every excluded member carries a recorded rationale; evidence attached.</div>`);
    function bndBasisForm() {
      return `<div class="formGrid">
 ${sect('Basis', 'الأساس', 'GRI 2-2 / ISO 14064-1 §5')}
 ${field({ label: 'Boundary lens', req: 1, type: 'select', opts: ['Financial statements', 'Sustainability report (GRI 2-2)', 'GHG organizational (ISO 14064-1 §5)'], value: 'Sustainability report (GRI 2-2)' })}
 ${field({ label: 'Standard / basis reference', req: 1, type: 'select', opts: ['GRI 2-2', 'ISO 14064-1:2018', 'GHG Protocol Corporate Standard', 'ISO 14064-1:2018 + GHG Protocol'], value: 'GRI 2-2' })}
 ${field({ label: 'Consolidation approach', value: 'Operational control', pv: { k: 'reuse', t: 'from B-02 group approach', l: '#/org/entities' }, help: 'Reused — an override here requires a reason below.' })}
 ${field({ label: 'Base year', type: 'select', opts: ['FY2022', 'FY2023', '— not applicable to this lens —'], value: 'FY2022' })}
 ${field({ label: 'Effective from', req: 1, type: 'date', value: '2025-01-01' })}
 ${sect('Per-member treatment', 'معالجة الأعضاء', 'JV & partial interests')}
 ${field({ label: 'Nile Logistics JV — inclusion', req: 1, type: 'select', opts: ['Equity share (50%)', 'Exclude — outside boundary'], value: 'Equity share (50%)' })}
 ${field({ label: 'Ownership interest applied', value: '50%', pv: { k: 'reuse', t: 'from B-02', l: '#/org/entities' }, help: 'Reused from the entity record.' })}
 ${field({ label: 'Override?', type: 'select', opts: ['No', 'Yes'], value: 'No' })}
 ${field({ label: 'Override value + mandatory reason', type: 'area', value: '', full: 1, help: 'Both required when Override = Yes — audited.' })}
 ${field({ label: 'Treatment note', req: 1, type: 'area', value: '', full: 1 })}
 ${sect('Reconciliation', 'التسوية', 'GRI 2-2-b')}
 ${field({ label: 'Difference vs financial & sustainability boundaries', req: 1, type: 'area', value: '', full: 1, help: 'Required before approval; separate from per-member notes.' })}
 ${sect('Governance', 'الحوكمة', '')}
 ${field({ label: 'Basis owner', req: 1, type: 'select', opts: ['Layla Al-Harbi', 'O. Farid'], value: 'Layla Al-Harbi' })}
 ${field({ label: 'Reviewer', req: 1, type: 'select', opts: ['O. Farid', 'Dr. H. Nassar'], value: 'O. Farid', help: 'SoD: owner ≠ reviewer.' })}
 <div class="full"><label style="font-weight:600;font-size:12px">Evidence</label><div style="border:1.5px dashed var(--line);border-radius:9px;padding:12px;text-align:center;color:var(--mut)">📎 <a onclick="toast('Evidence object')">Attach boundary memo</a></div></div>
</div>`}

    VIEWS['setup/standards'] = () => setupRail('standards') + pageHead(t('standards'), 'Which editions this cycle is written against. Resolved against the frozen basis date — a moved target date warns, never silently re-resolves.',
      `<span class="st locked">🔒 Locked set</span><button class="btn sec" onclick="toast('Restate to change a locked set')">Restate</button>`, 'Reporting Setup › Standards') +
      `<div class="notice info"><b>${LANG === 'ar' ? 'أساس الحل' : 'Resolution basis'}:</b> publication date <b>30 Apr 2026</b> (frozen at Start). ${LANG === 'ar' ? '' : 'B-05 target unchanged — no drift.'}</div>
 <div class="card"><div class="hd">Universal <span class="sub">required in every report</span></div><table class="tbl"><tbody>
 <tr><td><b>GRI 1: Foundation 2021</b></td><td>eff. 2023-01-01</td><td>${st('locked', 'In set')}</td></tr>
 <tr><td><b>GRI 2: General Disclosures 2021</b></td><td>eff. 2023-01-01</td><td>${st('locked', 'In set')}</td></tr>
 <tr><td><b>GRI 3: Material Topics 2021</b></td><td>eff. 2023-01-01</td><td>${st('locked', 'In set')}</td></tr></tbody></table></div>
 <div class="card"><div class="hd">Sector <span class="sub">from Sector classification</span></div><table class="tbl"><tbody>
 <tr><td><b>GRI 14: Mining 2024</b> <span style="color:var(--mut);font-size:11.5px">(aggregates quarrying — pending B-08 confirmation)</span></td><td>eff. 2026-01-01</td><td>${st('pending', 'Conditional')}</td></tr></tbody></table>
 <div class="notice err" style="margin:10px 14px"><b>Content check:</b> GRI 14 topic content not yet loaded — if confirmed Applicable, the claim path blocks until Admin activates the sector content release.</div></div>
 <div class="card"><div class="hd">Topic <span class="sub">enter the set when materiality confirms the topic — 6 confirmed</span></div><table class="tbl"><tbody>
 ${[['GRI 305: Emissions 2016', 'ACTIVE_UNTIL_2026-12-31'], ['GRI 302: Energy 2016', 'ACTIVE_UNTIL_2026-12-31'], ['GRI 303: Water & Effluents 2018', 'Active'], ['GRI 403: OH&S 2018', 'Active'], ['GRI 413: Local Communities 2016', 'Active'], ['GRI 205: Anti-corruption 2016', 'Active']].map(([n, s]) => `<tr><td><b>${n}</b></td><td style="font-size:11.5px;color:var(--mut)">${s}</td><td>${st('approved', 'In set')}</td></tr>`).join('')}
 </tbody></table></div>
 <div class="card"><div class="hd">${LANG === 'ar' ? 'تحولات الإصدارات' : 'Version transitions'} <span class="sub">early-adoption decisions — recorded per member</span></div><table class="tbl"><tbody>
 <tr><td><b>GRI 102: Climate Change 2025</b> supersedes parts of 305</td><td>eff. 2027-01-01 · early adoption permitted</td><td><button class="btn sec" onclick="drawer('Early-adoption decision — GRI 102:2025',electForm())">Decide</button></td></tr>
 <tr><td><b>GRI 103: Energy 2025</b> supersedes 302</td><td>eff. 2027-01-01</td><td>${st('draft', 'Not elected')}</td></tr>
 </tbody></table></div>`;

    VIEWS['setup/applic'] = () => setupRail('applic') + pageHead(t('applic'), 'One of three questions only: does the condition apply? Materiality and omission are decided elsewhere — the three axes never collapse.',
      '', 'Reporting Setup › Applicability') +
      `<div class="card"><div class="hd" style="background:var(--okBg)">1 · Initial Applicability <span class="sub">pre-materiality: universal + GRI 2 + sector</span><div class="actions">${st('approved', 'Complete — 41/41 determined')}</div></div>
 <div class="bd" style="font-size:12.5px">GRI 2: 30 always-applicable · Sector rows: 9 conditional (2 not-applicable with rationale + determiner stamped ⚙) · 2 requirements pending sector confirmation.</div></div>
 <div class="card"><div class="hd" style="background:var(--accBg)">2 · Final Disclosure Applicability <span class="sub">unlocked by C-12 freeze — topic standards</span><div class="actions">${st('progress', '48 requirements · 3 undetermined')}</div></div>
 <div class="bd">
 <div class="wb"><div class="queue"><div class="qh">Requirements</div>
 ${[['305-1-a', 'Gross Scope 1', 'approved'], ['305-2-b', 'Location-based Scope 2', 'approved'], ['302-1-c', 'Fuel by type', 'review'], ['303-3-a', 'Withdrawal by source', 'approved'], ['403-9-a', 'Injuries & rates', 'approved'], ['205-3', 'Corruption incidents', 'draft']].map(([c, n, s], i) => `<div class="qi ${i === 2 ? 'active' : ''}"><b>${c}</b> · ${n}<div class="m"><span>GRI ${c.split('-')[0]}</span>${st(s, s === 'approved' ? 'Applicable' : s === 'review' ? 'Under review' : 'Undetermined')}</div></div>`).join('')}
 </div><div>
 <div class="card" style="margin:0"><div class="hd">302-1-c · Fuel consumption by type <span class="gri" style="background:var(--accBg);color:var(--accD);border-radius:5px;padding:0 6px;font-size:10.5px">Condition: applies where fuels are consumed within the organization</div></div><div class="bd formGrid">
 ${sect('Requirement context — read-only', 'سياق المتطلب', 'from the disclosure matrix')}
 ${field({ label: 'Standard / Disclosure / Requirement', value: 'GRI 302: Energy 2016 · 302-1 · letter c', pv: { k: 'reuse', t: 'Standards register', l: '#/setup/standards' } })}
 ${field({ label: 'Applicability condition', value: 'Applies where fuels are consumed within the organization', ro: 1 })}
 ${field({ label: 'Sector context', value: 'Mining (pending B-08 confirmation) — fuel intensity is a sector-expected topic', pv: { k: 'reuse', t: 'B-08', l: '#/org/sector' } })}
 ${field({ label: 'Material topic context', value: 'MT-02 Energy — confirmed material', pv: { k: 'reuse', t: 'C-12 frozen set', l: '#/mat/approval' } })}
 ${field({ label: 'Current state', value: 'Under review · v2 (v1 returned 12 Feb — reviewer comment retained)', ro: 1 })}
 ${sect('Determination', 'القرار', 'the only writable facts here')}
 ${field({ label: 'Verdict', req: 1, type: 'select', opts: ['Applicable', 'Not applicable'], value: 'Applicable', help: '“Undetermined” is a state, never an answer.' })}
 ${field({ label: 'Determined by', value: 'Omar Farid — stamped from signed-in actor', pv: { k: 'der', t: t('derived') } })}
 ${field({ label: 'Rationale', req: 1, type: 'area', value: 'Diesel consumed at depot (9 months) and mobile plant at quarry.', full: 1 })}
 ${field({ label: 'Evidence', value: '', full: 1, pv: { k: 'reuse', t: 'EV-0020 fuel log', l: '#/data/evid' } })}
 ${field({ label: 'Reviewer', value: 'Dr. H. Nassar — SoD: determiner ≠ reviewer', ro: 1 })}
 </div><div class="df" style="display:flex;gap:8px;justify-content:flex-end;padding:12px 16px;border-top:1px solid var(--line2)"><button class="btn sec">${t('return')}</button><button class="btn" onclick="toast('Determination approved — audit recorded')">${t('approve')}</button></div></div>
 </div></div></div></div>
 <div class="notice info"><b>Three axes:</b> Applicability (here) ≠ Materiality (Materiality workspace) ≠ Omission (Omission requests). A requirement that is applicable and material but unreportable goes to <a href="#/setup/omissions">omissions</a> — never marked "not applicable".</div>`;

    VIEWS['setup/gri2'] = () => setupRail('gri2') + pageHead(t('gri2'), 'Datapoint grain: a disclosure is complete only when every datapoint carries a value, source, preparer and evidence. Missing is a finding — never zero, never N/A.',
      `<span class="st review">28/30 complete</span>`, 'Reporting Setup › GRI 2') +
      `<div class="tiles">${tile(30, 'Disclosures')}${tile(28, 'Complete', 'ok')}${tile(1, 'Open gap → finding', 'err', 'rev/findings')}${tile(1, 'Valid omission', 'ok', 'setup/omissions')}</div>
 <div class="wb"><div class="queue"><div class="qh">GRI 2 disclosures</div>
 ${[['2-1', 'Organizational details', 'approved', '4/4'], ['2-7', 'Employees', 'approved', '6/6'], ['2-8', 'Workers who are not employees', 'blocked', '1/3'], ['2-9', 'Governance structure', 'approved', '5/5'], ['2-21', 'Compensation ratio', 'na', 'omitted'], ['2-22', 'Sustainable development statement', 'review', '1/1']].map(([c, n, s, m], i) => `<div class="qi ${i === 2 ? 'active' : ''}"><b>${c}</b> · ${n}<div class="m"><span>${m}</span>${st(s, s === 'na' ? 'Omitted' : undefined)}</div></div>`).join('')}
 </div><div>
 <div class="card" style="margin:0 0 12px"><div class="hd">2-8 · Workers who are not employees <span class="sub">owner: K. Mansour · reviewer: O. Farid (roster refs — SoD on user IDs)</span><div class="actions">${st('blocked', 'Blocked by finding')}</div></div>
 <div class="bd">
 <div class="notice err"><b>FND-2025-0004 (MAJOR · open):</b> contractor headcount incomplete — two O&M contractors not in HR extract. Owner K. Mansour · due 25 Feb. <a href="#/rev/findings">Open finding →</a></div>
 <table class="tbl"><thead><tr><th>Datapoint</th><th>Value</th><th>Readiness</th><th>Source</th><th>Evidence</th><th></th></tr></thead><tbody>
 <tr><td>Total workers not employees</td><td><i style="color:var(--mut)">— (never written as zero)</i></td><td>${st('blocked', 'Not available')}</td><td>—</td><td>—</td><td class="rowActs"><a onclick="drawer('Datapoint — Total non-employee workers',dpEntryForm())">${t('edit')}</a></td></tr>
 <tr><td>Contract type breakdown</td><td>—</td><td>${st('blocked', 'Not available')}</td><td>—</td><td>—</td><td class="rowActs"><a onclick="drawer('Datapoint',dpEntryForm())">${t('edit')}</a></td></tr>
 <tr><td>Description of work performed</td><td>O&M, security, catering</td><td>${st('approved', 'Ready')}</td><td>Procurement register</td><td><span class="ev">📎 EV-0025</span></td><td class="rowActs"><a onclick="drawer('Datapoint',dpEntryForm())">${t('view')}</a></td></tr>
 </tbody></table></div></div>
 </div></div>`;
    function dpEntryForm() {
      return `<div class="formGrid">
 ${sect('Definition — read-only', 'التعريف — قراءة فقط', 'Data Dictionary; definition ≠ instance')}
 ${field({ label: 'Datapoint', value: '2-8-a · Total workers who are not employees', pv: { k: 'reuse', t: 'Data Dictionary' } })}
 ${field({ label: 'GRI requirement', value: 'GRI 2-8-a (2021)', ro: 1 })}
 ${field({ label: 'Data type / Unit', value: 'NUMBER · persons', ro: 1 })}
 ${field({ label: 'Reporting basis', value: 'Headcount (not FTE)', ro: 1, help: 'Definition attribute — changing it is a Data Dictionary decision, never an entry-time choice.' })}
 ${field({ label: 'Measurement point', value: 'End of reporting period', ro: 1, help: 'Definition attribute (end-of-period vs average across the period).' })}
 ${field({ label: 'Definition', value: 'Workers who are not employees and whose work is controlled by the organization', ro: 1, full: 1 })}
 ${sect('Assignment — reused from the Collection Plan', 'الإسناد — من خطة الجمع', 'X-PLAN; never editable on this form')}
 ${field({ label: 'Department / Owner', value: 'HR Operations · K. Mansour', pv: { k: 'reuse', t: 'X-PLAN', l: '#/data/plan' } })}
 ${field({ label: 'Contributor / Reviewer', value: 'F. Said · O. Farid (SoD on user IDs)', pv: { k: 'reuse', t: 'X-PLAN', l: '#/data/plan' } })}
 ${field({ label: 'Due date / Frequency', value: '2026-02-25 · Annual', pv: { k: 'reuse', t: 'X-PLAN', l: '#/data/plan' } })}
 ${sect('Instance input', 'إدخال القيمة', 'the only writable facts')}
 ${field({ label: 'Value state', req: 1, type: 'select', opts: ['Value entered', 'True zero', 'Missing — estimate, omit or exclude', 'Not applicable (needs omission path)'], value: 'Missing — estimate, omit or exclude', help: 'Zero ≠ missing ≠ not applicable — schema states, never conventions.' })}
 ${field({ label: 'Reported value', type: 'number', ph: '—', help: 'Disabled while readiness = Not available. A datapoint with no source is never written as zero.' })}
 ${field({ label: 'Period covered', value: 'FY2025 (2025-01-01 → 2025-12-31)', pv: { k: 'reuse', t: 'from B-05' } })}
 ${field({ label: 'Readiness', req: 1, type: 'select', opts: ['Not available', 'In progress', 'Ready'], value: 'Not available' })}
 ${field({ label: 'Source type', type: 'select', opts: ['System extract', 'Register', 'Manual count', 'Invoice / meter'], value: 'System extract' })}
 ${field({ label: 'Source system / object', type: 'select', opts: ['HR system', 'Procurement register', 'Manual count'] })}
 ${field({ label: 'Estimated?', type: 'select', opts: ['No', 'Yes — method & basis required'] })}
 ${field({ label: 'Estimation method', type: 'select', opts: ['— not estimated —', 'Pro-rata extrapolation', 'Prior-period carry with adjustment', 'Engineering estimate'], value: '— not estimated —' })}
 ${field({ label: 'Estimation basis', type: 'area', value: '', full: 1, help: 'Required when Estimated = Yes — documented basis, auditable.' })}
 ${field({ label: 'Data quality', type: 'select', opts: ['Not assessable — no source', 'Low', 'Medium', 'High'], value: 'Not assessable — no source', help: 'Feeds the Data Quality Score — L1–L5 tiers map behind these labels.' })}
 ${field({ label: 'Variance vs prior period', value: '— no prior value (first period for this datapoint)', pv: { k: 'der', t: t('derived') }, help: 'Computed; a jump over threshold demands the explanation below.' })}
 ${field({ label: 'Variance explanation', type: 'area', value: '', full: 1 })}
 ${field({ label: 'Restates a prior figure?', gri: '2-4', type: 'select', opts: ['No', 'Yes — feeds GRI 2-4'], value: 'No', help: 'Yes opens the restatement register entry — never edits the prior value in place.' })}
 ${field({ label: 'In assurance scope?', gri: '2-5', value: 'Yes — per-datapoint flag', ro: 1, help: 'Source of truth for assurance scope; any scope text is computed from these flags (29-§12).' })}
 ${field({ label: 'Comments', type: 'area', value: '', full: 1 })}
 <div class="full"><label style="font-weight:600;font-size:12px">Evidence</label><div style="border:1.5px dashed var(--line);border-radius:9px;padding:18px;text-align:center;color:var(--mut)">📎 ${LANG === 'ar' ? 'اسحب ملفًا أو' : 'Drag a file or'} <a onclick="toast('Evidence uploaded — SHA-256 computed server-side · metadata drawer opens')">${LANG === 'ar' ? 'تصفح' : 'browse'}</a> · <span style="font-size:11px">type · period · validity captured</span></div></div>
 <div class="full notice warn" style="margin:0"><b>Linked finding:</b> FND-2025-0004 (MAJOR · open) blocks this disclosure — the finding is a linked object with its own lifecycle, never an embedded copy. <a href="#/rev/findings">Open →</a></div>
</div>`}

    VIEWS['setup/omissions'] = () => setupRail('omissions') + pageHead(t('omissions'), 'GRI 1 Requirement 6 — four permitted reasons only; seven disclosures can never be omitted; approved omissions feed the claim.',
      `<button class="btn" onclick="drawer('${t('add')} — Omission request',omForm())">＋ ${t('add')}</button>`, 'Reporting Setup › Omissions') +
      `<div class="tiles">${tile(2, 'Requests')}${tile(1, 'Approved', 'ok')}${tile(1, 'Awaiting governance', 'warn', 'rev/oapp')}${tile(0, 'On never-omit disclosures', 'ok')}</div>
 <div class="card"><table class="tbl"><thead><tr><th>Ref</th><th>Disclosure</th><th>Reason</th><th>${t('status')}</th><th>Approver</th><th></th></tr></thead><tbody>
 ${D.omissions.map(o => `<tr><td><b>${o.id}</b></td><td>${o.dis} · ${esc(o.req)}</td><td><span class="gid" data-noar>${o.rfo || ''}</span> ${esc(o.reason)}${o.rfo === 'RFO-04' ? ` <span class="pv der" title="auto-created, owned by the Data Owner, carried to next cycle">⚙ Action plan → FY2026</span>` : ''}</td><td>${st(o.st === 'approved' ? 'approved' : 'submitted', o.st)}</td><td>${esc(o.appr || '— Dr. S. Aziz (queue)')}</td><td class="rowActs"><a onclick="drawer('${o.id}',omDetail('${o.id}'))">${t('view')}</a></td></tr>`).join('')}
 </tbody></table></div>
 <div class="card"><div class="hd">${LANG === 'ar' ? 'كتالوج أسباب الحذف (قائمة مغلقة — Config)' : 'Reasons-for-Omission catalogue (closed list — CONFIG)'} <span class="sub" data-noar>GRI 1 Req. 6</span></div><div class="bd">
 ${CONFIG.RFO.map(r => `<div class="gateRow"><span class="gid" data-noar>${r.code}</span><div style="flex:1"><b style="font-size:12.5px">${esc(r.r)}</b><div style="font-size:11.5px;color:var(--mut)">${esc(r.v)}</div></div></div>`).join('')}
 </div></div>
 <div class="notice err"><b>${LANG === 'ar' ? 'المحظور من الحذف نهائيًا' : 'Hard-blocked from omission'}:</b> <span data-noar>${CONFIG.omissionBlocked.join(' · ')}</span> — ${LANG === 'ar' ? 'الرفض على مستوى الـAPI لا الواجهة' : 'rejected at API level, not just hidden in the UI'} (<code>OMISSION_NOT_PERMITTED</code>). <a onclick="tryBlockedOmission()">${LANG === 'ar' ? 'جرّب طلب حذف على 3-2' : 'Try omitting 3-2'} →</a></div>
 <div class="notice ok"><b>${LANG === 'ar' ? '«البند غير موجود» ليس حذفًا' : '“Item does not exist” is NOT an omission'} (TRN-D22):</b> ${LANG === 'ar' ? 'غياب لجنة/سياسة يُسجَّل إجابة مكتملة متوافقة ولا يكتب شيئًا في سجل الحذف — مساران منفصلان في الواجهة وجدولان في القاعدة.' : 'a missing committee/policy is recorded as a compliant, complete answer and writes nothing to the omission register — two visible paths, two tables.'}</div>`;
    function tryBlockedOmission() {
      audit('omission.blocked', '3-2', 'OMISSION_NOT_PERMITTED');
      drawer('⛔ OMISSION_NOT_PERMITTED', `<div class="notice err"><b>HTTP 422</b> — <span data-noar>{"error":"OMISSION_NOT_PERMITTED","disclosure":"3-2","blocked_list":[${CONFIG.omissionBlocked.map(x => '"' + x + '"').join(',')}]}</span></div>
 <div class="tlNote">${LANG === 'ar' ? 'الإفصاحات السبعة 2-1…2-5 و3-1 و3-2 لا يجوز حذفها إطلاقًا (GRI 1 Req. 6). الرفض يقع في الخدمة وقاعدة البيانات حتى لو تجاوز أحدهم الواجهة.' : 'Disclosures 2-1…2-5, 3-1, 3-2 can never be omitted (GRI 1 Req. 6). The refusal happens in the service and the database even if someone bypasses the UI.'}</div>`,
        `<button class="btn sec" onclick="closeDrawer()">${t('cancel')}</button>`)
    }
    function omForm() {
      return `<div class="formGrid">
 ${sect('Requirement', 'المتطلب', 'GRI 1 Requirement 6')}
 ${field({ label: 'Disclosure', req: 1, type: 'select', opts: ['303-5 Water consumption', '302-1 Energy within org', '2-30 Collective bargaining'], help: 'Never-omit disclosures are not in this list — the API refuses them too (OMISSION_NOT_PERMITTED).' })}
 ${field({ label: 'Requirement (letter)', type: 'select', opts: ['Whole disclosure', '303-5-a', '303-5-b'], help: 'Dependent picker — letters follow the chosen disclosure.' })}
 ${sect('Reason', 'السبب', 'four permitted reasons — RFO-01…04')}
 ${field({ label: 'Reason', req: 1, type: 'select', opts: ['RFO-01 · Not applicable', 'RFO-02 · Legal prohibitions', 'RFO-03 · Confidentiality constraints', 'RFO-04 · Information unavailable / incomplete'], value: 'RFO-04 · Information unavailable / incomplete' })}
 ${field({ label: 'Explanation', req: 1, type: 'area', full: 1 })}
 ${sect('Reason-dependent — RFO-01 Not applicable', 'حقول السبب', 'shown only for that reason')}
 ${field({ label: 'Characteristic / impact rationale', type: 'area', full: 1, help: 'Why the item genuinely does not exist for this organization — distinct from “item does not exist” (TRN-D22, which is a compliant answer, not an omission).' })}
 ${sect('Reason-dependent — RFO-02 Legal prohibition', '', '')}
 ${field({ label: 'Law / regulation', value: '', help: 'Named instrument.' })}
 ${field({ label: 'Article / clause', value: '' })}
 ${field({ label: 'Legal evidence', type: 'select', opts: ['— attach legal opinion —', 'EV-0051 counsel memo'] })}
 ${sect('Reason-dependent — RFO-03 Confidentiality', '', '')}
 ${field({ label: 'Specific constraint', type: 'area', full: 1, help: 'The specific confidentiality constraint — generic “sensitive” is refused by validation.' })}
 ${field({ label: 'Decision reference', value: '', help: 'Board / committee decision reference.' })}
 ${sect('Reason-dependent — RFO-04 Information unavailable', '', '')}
 ${field({ label: 'What is missing & why', type: 'area', full: 1 })}
 ${field({ label: 'Steps being taken', req: 1, type: 'area', full: 1 })}
 ${field({ label: 'Expected date', type: 'date', value: '2027-01-31' })}
 ${field({ label: 'Action plan owner', type: 'select', opts: ['K. Mansour', 'F. Said'], help: 'RFO-04 auto-creates a carried action plan owned here.' })}
 ${sect('Governance', 'الحوكمة', '')}
 ${field({ label: 'Requester', value: 'Stamped from signed-in actor at creation', pv: { k: 'der', t: t('derived') } })}
 ${field({ label: 'Approver', req: 1, type: 'select', opts: ['Dr. S. Aziz (Governance)', 'Executive Approver'], help: 'SoD: requester ≠ approver.' })}
 ${field({ label: 'Status / version', value: 'Draft · v1 — history retained per request', ro: 1 })}
</div>`}
    function omDetail(id) { const o = D.omissions.find(x => x.id === id); return `<div class="kv"><dt>Disclosure</dt><dd>${o.dis} · ${esc(o.req)}</dd><dt>Reason</dt><dd>${esc(o.reason)}</dd><dt>Explanation</dt><dd style="font-weight:400">${esc(o.expl)}</dd>${o.steps ? `<dt>Steps / timeframe</dt><dd style="font-weight:400">${esc(o.steps)} · ${o.due}</dd>` : ''}<dt>${t('status')}</dt><dd>${st(o.st === 'approved' ? 'approved' : 'submitted', o.st)}</dd></div>${o.st !== 'approved' ? `<div class="notice info" style="margin-top:12px">Awaiting governance decision — approving flips Requirement 6 and updates the Content Index row automatically.</div>` : ''}` }


    /* ================= MATERIALITY WORKSPACE ================= */
    VIEWS['mat/config'] = () => pageHead(t('config'), 'Approved methodology & thresholds. The human-rights floor is not disableable.', '', 'Materiality › Setup') +
      `<div class="card"><div class="hd">Threshold model TM-ACME-2025 · v1.2 <span class="sub">approved by Governance · 12 Jan 2026</span></div><div class="bd formGrid">
 ${field({ label: 'Negative-impact threshold', value: '12 / 25', ro: 1 })}${field({ label: 'Positive-impact threshold', value: '10 / 25', ro: 1 })}
 ${field({ label: 'Human-rights severity floor', value: 'Severity ≥ 4 ⇒ material regardless of likelihood — non-compensatory · notDisableable', pv: { k: 'lock', t: t('apprv') }, full: 1 })}
 ${field({ label: 'Assessment dimensions', value: 'Scale · Scope · Irremediable character · Likelihood (potential only)', ro: 1, full: 1 })}
 ${field({ label: 'Calibration', value: 'Anchors 1–5 defined per dimension · inter-assessor agreement 0.81 on the 12-impact calibration set', ro: 1, full: 1 })}
 </div></div>
 <div class="notice ok"><b>MDR-07 — ${LANG === 'ar' ? 'محسوم: غير حاجب' : 'RESOLVED: Non-blocking'}.</b> ${LANG === 'ar' ? 'الاشتقاقات الحالية تستخدم مقاييس TM-ACME-2025 v1.2 المعتمدة (الأوزان المتساوية للأبعاد المعتمدة في النموذج). أي تحسين لأوزان الأبعاد هو تغيير منهجي مستقبلي عبر نسخة نموذج جديدة، ولا يمس المجموعة المجمّدة FY2025.' : 'Current derivations use the approved TM-ACME-2025 v1.2 anchors (equal-weight dimensions as approved in the model). Any per-dimension weight refinement is a future methodology change via a new model version and does not affect the frozen FY2025 set.'} <b>Owner:</b> Methodology Owner · <b>Decision recorded:</b> 2026-01-10 · audit #3901</div>`;

    VIEWS['mat/context'] = () => pageHead(t('context'), 'Where candidate issues come from — regulation, incidents, complaints, audits, sector, strategy. Every impact must cite an origin here or in engagement.',
      `<button class="btn" onclick="drawer(t('add')+' — Context entry',ctxForm())">＋ ${t('add')}</button>`, 'Materiality › Context') +
      `<div class="card">${toolbar()}<table class="tbl"><thead><tr><th>ID</th><th>Type</th><th>P</th><th>Description</th><th>Where</th><th>Source</th><th>${t('status')}</th></tr></thead><tbody>
 <tr><td>CTX-03</td><td>Sector issue</td><td>E</td><td>Cement-sector GHG intensity scrutiny; sector-standard likely-material topic</td><td>EG-CEM-01</td><td>GRI sector programme</td><td>${st('approved', 'Approved')}</td></tr>
 <tr><td>CTX-05</td><td>Complaint</td><td>S</td><td>Dust complaints from village adjacent to quarry (log: 7 in 2025)</td><td>EG-QRY-01</td><td>Grievance log <span class="ev">📎</span></td><td>${st('approved', 'Approved')}</td></tr>
 <tr><td>CTX-07</td><td>Regulation</td><td>E</td><td>Basin water-stress designation — abstraction permits under review</td><td>EG-CEM-01</td><td>Basin study 2025 <span class="ev">📎</span></td><td>${st('approved', 'Approved')}</td></tr>
 <tr><td>CTX-09</td><td>Strategic issue</td><td>E</td><td>2030 renewables expansion — positive-impact candidate</td><td>—</td><td>Strategy plan ${pv('reuse', 'from Activities (B-04)', '#/org/acts')}</td><td>${st('approved', 'Approved')}</td></tr>
 <tr><td>CTX-11</td><td>Audit finding</td><td>G</td><td>Customs facilitation-payment exposure flagged by internal audit</td><td>—</td><td>AF-12</td><td>${st('review', 'In review')}</td></tr>
 </tbody></table>${pager(12)}</div>`;

    VIEWS['mat/stake'] = () => pageHead(t('stake'), 'Affected stakeholders vs interested parties — the GRI 3 distinction drives engagement priority.',
      `<button class="btn" onclick="drawer(t('add')+' — Stakeholder group',stkForm())">＋ ${t('add')}</button>`, 'Materiality › Stakeholders') +
      `<div class="card"><table class="tbl"><thead><tr><th>Group</th><th>Class</th><th>Where</th><th>Influence</th><th>Dependency</th><th>Engagement</th><th>Owner</th></tr></thead><tbody>
 <tr><td><b>Quarry-adjacent community</b></td><td>${st('blocked', 'Affected')}</td><td>EG-QRY-01</td><td>Medium</td><td>High</td><td>Consultations · quarterly</td><td>N. Fouad</td></tr>
 <tr><td><b>Own workforce</b></td><td>${st('blocked', 'Affected')}</td><td>ALL</td><td>High</td><td>High</td><td>Committees · monthly</td><td>K. Mansour</td></tr>
 <tr><td><b>O&M contractors</b></td><td>${st('blocked', 'Affected')}</td><td>SA sites</td><td>Medium</td><td>High</td><td>HSE briefings · monthly</td><td>A. Qassem</td></tr>
 <tr><td><b>Grid off-taker & regulator</b></td><td>${st('submitted', 'Interested')}</td><td>SA</td><td>High</td><td>Medium</td><td>Quarterly reviews</td><td>Layla</td></tr>
 <tr><td><b>Lenders (sustainability-linked)</b></td><td>${st('submitted', 'Interested')}</td><td>—</td><td>High</td><td>Low</td><td>Annual + covenants</td><td>CFO office</td></tr>
 </tbody></table></div>`;


    VIEWS['mat/impacts'] = () => pageHead(t('impacts'), 'The Impact Universe. An impact with no origin cannot be saved — no topic appears at ranking by magic.',
      `<button class="btn" onclick="drawer(t('add')+' — Impact',impForm())">＋ ${t('add')}</button>`, 'Materiality › Impacts') +
      `<div class="tiles">${tile(16, 'Impacts identified')}${tile(15, 'Assessed', 'ok')}${tile(2, 'Human-rights flagged', 'warn')}${tile(1, 'Awaiting review', 'warn')}</div>
 <div class="card">${toolbar(`<select><option>All pillars</option><option>E</option><option>S</option><option>G</option></select>`)}
 <table class="tbl"><thead><tr><th>ID</th><th>Impact</th><th>P</th><th>Type</th><th>Where</th><th>Origin 🔗</th><th>Sev</th><th>Lik</th><th>Significance ƒx</th><th>Topic</th></tr></thead><tbody>
 ${D.impacts.map(i => `<tr><td>${i.id}</td><td style="font-weight:600">${esc(i.n)}${i.hr ? `<div style="font-size:11px;color:var(--warn)">⚖ ${esc(i.hr === true ? 'HR-linked' : i.hr)}</div>` : ''}</td><td>${i.p}</td><td style="font-size:11.5px">${i.dir}<br>${i.vc}</td><td>${i.site}</td><td style="font-size:11.5px">${pv('reuse', i.src, '')}</td><td>${i.sev}</td><td>${i.lik}</td><td>${pv('calc', i.sig, '')}</td><td>${i.topic !== '—' ? `<a href="#/mat/ranking">${i.topic}</a>` : '—'}</td></tr>`).join('')}
 </tbody></table>${pager(16)}</div>`;

    VIEWS['mat/assess'] = () => pageHead(t('assess'), 'Enter the judgement inputs; the system derives severity, significance and candidate status per the approved model. Stakeholder scores are visible but isolated from the derivation.',
      '', 'Materiality › Assessment') +
      `<div class="wb"><div class="queue"><div class="qh">Queue · 1 awaiting review</div>
 ${D.impacts.slice(0, 6).map((i, x) => `<div class="qi ${x === 5 ? 'active' : ''}"><b>${i.id}</b> · ${esc(i.n).slice(0, 34)}…<div class="m"><span>${i.p} · ${i.site}</span>${st(i.st === 'review' ? 'review' : 'approved', i.st)}</div></div>`).join('')}
 </div><div><div class="card" style="margin:0"><div class="hd">IM-06 · Land livelihood displacement near quarry expansion <span class="sub">origin: ENG-03 🔗 · affected: community</span></div>
 <div class="bd"><div class="formGrid">
 ${field({ label: 'Scale (1–5)', req: 1, type: 'select', opts: ['1', '2', '3', '4', '5'], value: '4' })}
 ${field({ label: 'Scope (1–5)', req: 1, type: 'select', opts: ['1', '2', '3', '4', '5'], value: '3' })}
 ${field({ label: 'Irremediable character (1–5)', req: 1, type: 'select', opts: ['1', '2', '3', '4', '5'], value: '4' })}
 ${field({ label: 'Likelihood (potential impact)', req: 1, type: 'select', opts: ['1', '2', '3', '4', '5'], value: '2' })}
 ${field({ label: 'Severity', value: '4 — derived (scale·scope·irremediability per TM-ACME-2025)', pv: { k: 'calc', t: t('calcd'), l: '#/mat/config' } })}
 ${field({ label: 'Candidate status', value: 'MATERIAL — human-rights floor: severity ≥ 4 overrides likelihood (non-compensatory)', pv: { k: 'der', t: t('derived') } })}
 ${field({ label: 'Technical rationale', req: 1, type: 'area', value: 'Expansion overlaps seasonal grazing route; livelihood dependency high for 40–60 households.', full: 1 })}
 ${field({ label: 'Evidence', value: '', full: 1, pv: { k: 'reuse', t: 'ENG-03 minutes · land survey 2025', l: '#/data/evid' } })}
 </div>
 <div class="notice info" style="margin-top:10px"><b>Stakeholder view (isolated):</b> community survey ranked this #1 of 9 concerns — displayed for context; never read by the significance calculation (DEC-06).</div>
 </div><div style="display:flex;gap:8px;justify-content:flex-end;padding:12px 16px;border-top:1px solid var(--line2)"><button class="btn sec" onclick="toast('Returned to assessor with reason')">${t('return')}</button><button class="btn" onclick="toast('Assessment approved — ranking updated')">${t('approve')}</button></div></div>
 </div></div>`;

    VIEWS['mat/mapping'] = () => pageHead(t('mapping'), 'Impact → topic → GRI standard. No match must be explained; escalation goes to the Methodology Owner.', '', 'Materiality › Mapping') +
      `<div class="card"><table class="tbl"><thead><tr><th>Impact</th><th>→ Topic</th><th>→ GRI Standard</th><th>Sector expectation</th><th>${t('status')}</th></tr></thead><tbody>
 <tr><td>IM-01 GHG from cement</td><td>Climate change & GHG</td><td>GRI 305 / 302</td><td>✓ sector likely-material</td><td>${st('approved', 'Mapped')}</td></tr>
 <tr><td>IM-03 Quarry dust</td><td>Local communities</td><td>GRI 413 (+305-7 air)</td><td>✓</td><td>${st('approved', 'Mapped')}</td></tr>
 <tr><td>IM-06 Land livelihoods</td><td>Local communities & land use</td><td>GRI 413</td><td>GRI 14 topic (pending sector confirm)</td><td>${st('approved', 'Mapped')}</td></tr>
 <tr><td>IM-08 Rooftop-solar jobs</td><td><i>no standard topic</i></td><td>—</td><td>—</td><td>${st('pending', 'Explain / escalate')}</td></tr>
 </tbody></table></div>
 <div class="card"><div class="hd">${t('secrec')} <span class="sub">sector likely-material topics — confirm or explain, never silently drop</span></div><table class="tbl"><tbody>
 <tr><td><b>Biodiversity (GRI 14 candidate)</b></td><td style="font-size:12px">Explained not material: below threshold at all operated sites; rehabilitation under MT-05. Evidence: ecology screening 2025.</td><td>${st('approved', 'Explained')}</td></tr>
 <tr><td><b>Tailings & waste (GRI 14)</b></td><td style="font-size:12px">Confirmed → merged into waste management under MT-01/MT-05 scope.</td><td>${st('approved', 'Confirmed')}</td></tr>
 </tbody></table></div>`;


    VIEWS['mat/approval'] = () => pageHead(t('approval'), 'Governance sees the full basis per topic and may return selected topics — a partial return keeps the set open.',
      '', 'Materiality › Governance') +
      `<div class="notice ok"><b>Material Topic Set ${D.topicSet.version} — ${D.topicSet.status}</b> · approved by ${D.topicSet.by} · ${D.topicSet.date} · ${D.topicSet.gate}. Downstream unlocked: Final Applicability, Collection Plan, Report §5 structure. ${pv('lock', 'version ' + D.topicSet.version + ' · view v1 diff', '')}</div>
 <div class="card"><table class="tbl"><thead><tr><th>Topic</th><th>Impacts & rationale</th><th>Stakeholders</th><th>Sector req.</th><th>Decision</th></tr></thead><tbody>
 ${D.topics.map(tp => `<tr><td><b>${esc(tp.n)}</b><div style="font-size:11px;color:var(--mut)">${tp.gri}</div></td><td style="font-size:12px">${tp.imp} impacts · evidence chain complete</td><td style="font-size:12px">community · workforce · lenders</td><td>${tp.id === 'MT-05' ? 'GRI 14 (pending)' : '—'}</td><td>${st('approved', 'Approved')}</td></tr>`).join('')}
 </tbody></table>
 <div style="display:flex;gap:8px;justify-content:flex-end;padding:12px 16px;border-top:1px solid var(--line2)">
 <button class="btn sec" onclick="toast('Clarification request recorded → PM task')">${LANG === 'ar' ? 'طلب توضيح' : 'Request clarification'}</button>
 <button class="btn warn" onclick="toast('Selected topics returned — set reopened (v3 draft)')">${LANG === 'ar' ? 'إرجاع موضوعات محددة' : 'Return selected topics'}</button>
 <button class="btn" disabled>✓ ${LANG === 'ar' ? 'معتمد ومجمّد' : 'Approved & frozen'}</button></div></div>`;

    /* ================= DATA & EVIDENCE ================= */

    VIEWS['data/requests'] = () => pageHead(t('requests'), 'Issued from plan rows; every request is a task in someone’s My Work with an escalation ladder that logs every reminder.', '', 'Data & Evidence › Requests') +
      `<div class="card"><table class="tbl"><thead><tr><th>Request</th><th>Plan row</th><th>To</th><th>Issued</th><th>${t('due')}</th><th>Escalation</th><th>${t('status')}</th></tr></thead><tbody>
 <tr><td>REQ-0088</td><td>PL-002 · 305-2 Dec</td><td>F. Said</td><td>2026-01-05</td><td>2026-02-15</td><td>rung 1 sent 04 Feb (logged)</td><td>${st('returned', 'Returned')}</td></tr>
 <tr><td>REQ-0090</td><td>PL-003 · 302-1 fuel split</td><td>F. Said</td><td>2026-01-05</td><td>2026-02-20</td><td>—</td><td>${st('progress', 'In collection')}</td></tr>
 <tr><td>REQ-0093</td><td>PL-006 · 413-1 coverage</td><td>N. Fouad</td><td>2026-02-01</td><td>2026-03-01</td><td>—</td><td>${st('submitted', 'Open')}</td></tr>
 </tbody></table></div>`;

    VIEWS['data/dwork'] = () => {
      const r = D.records.find(x => x.id === 'REC-1026');
      return pageHead(t('dwork'), 'One place to finish one disclosure: data, evidence, calculation, validation, lineage, history — never five separate applications.',
        `<span class="st returned">↩ ${t('retn')}</span>`, 'Data & Evidence › Disclosure Workspace') +
        `<div class="card"><div class="hd">${LANG === 'ar' ? 'سياق السجل — دائم' : 'Record context — persistent'} <span class="sub">REC-1026 · v3 (v2 returned)</span></div><div class="bd" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:6px 18px;font-size:12px">
  <span>${pv('reuse', 'MT-01 Climate change', '#/mat/ranking')} · <b>E</b></span>
  <span>${pv('reuse', 'GRI 305: Emissions 2016', '#/setup/standards')}</span>
  <span><b>305-2</b> · requirement <b>a</b> (location-based)</span>
  <span>Datapoint: <b>Purchased electricity</b></span>
  <span>Definition: kWh · monthly · meter/invoice ${pv('reuse', 'Dictionary', '#/data/catalog')}</span>
  <span>Entity: <b>Acme Materials Egypt</b></span>
  <span>Site: <b>EG-CEM-01</b> ${pv('reuse', 'in boundary', '#/setup/boundary')}</span>
  <span>Period: <b>2025-12</b> (FY2025)</span>
  <span>Department: Utilities ${pv('reuse', 'X-PLAN', '#/data/plan')}</span>
  <span>${t('who')}: S. Tawfik · Contributor: F. Said</span>
  <span>Reviewer: M. Adel (SoD ✓)</span>
  <span>Frequency: Monthly · ${t('due')}: 15 Feb</span>
  <span>Status: <span class="st returned">Returned</span> · Completeness: <b>82%</b></span>
  <span>Evidence: required · <b style="color:var(--err)">0/1 linked</b></span>
  <span>Calculation: CALC-GHG-S2-LOC v1 ƒx</span>
  <span>Validation: <b style="color:var(--err)">1 blocker</b> · Review: awaiting resubmit</span>
 </div></div>
 <div class="notice warn"><b>↩ ${t('retn')} — M. Adel, 06 Feb:</b> “Meter photo missing for December — invoice alone does not reconcile (VR-EVD-001).” <button class="btn warn" style="padding:4px 10px;font-size:11.5px" onclick="toast('Jumped to Evidence tab')">${t('correct')}</button></div>
 <div class="tabs">${['DATA', 'EVIDENCE', 'CALCULATION', 'VALIDATION', 'LINEAGE', 'HISTORY'].map((x, i) => `<button class="${i === 0 ? 'on' : ''}" onclick="toast('${x} tab (all rendered below in prototype)')">${x}${i === 1 ? '<span class="b">!</span>' : ''}</button>`).join('')}</div>
 <div class="card"><div class="hd">DATA — ${LANG === 'ar' ? 'حقول إدخال فعلية' : 'actual input controls'}</div><div class="bd formGrid">
 ${field({ label: 'Purchased electricity', gri: '305-2', req: 1, type: 'number', value: (dprGet('ENV-GHG-003', 'EG-CEM-01', '2025-12') || { v: 128750 }).v.toLocaleString(), unit: ['kWh', 'MWh'], help: 'Unit family: energy — cross-family conversion refused. KPI ENV-GHG-003 · the SAME DatapointRecord the Department Grid edits.' })}
 ${field({ label: 'Period', req: 1, value: '2025-12', ro: 1 })}
 ${field({ label: 'Site', value: 'EG-CEM-01 (in boundary ✓ VR-SIT-002)', pv: { k: 'reuse', t: 'from Boundary', 'l': '#/setup/boundary' } })}
 ${field({ label: 'Source type', req: 1, type: 'select', opts: ['Utility invoice', 'Meter reading', 'Estimate'], value: 'Utility invoice' })}
 ${field({ label: 'Estimated?', type: 'select', opts: ['No', 'Yes — basis required'], value: 'No' })}
 ${field({ label: 'Comparative FY2024', value: '121,300 kWh · variance +6.1% (below 25% threshold)', pv: { k: 'der', t: t('derived') } })}
 </div></div>
 <div class="card"><div class="hd">EVIDENCE <span class="sub">required before submit (VR-EVD-001)</span></div><div class="bd">
  <span class="ev">📎 EG-CEM-01 invoice Dec-2025.pdf · linked</span>
  <div style="border:1.5px dashed var(--warn);border-radius:9px;padding:16px;text-align:center;color:var(--warn);margin-top:8px"><b>Missing: meter photo (Dec)</b> — 📎 ${LANG === 'ar' ? 'اسحب الملف هنا أو' : 'drop file or'} <a onclick="toast('Uploaded · SHA-256 computed · metadata captured · blocker cleared')">${LANG === 'ar' ? 'تصفح' : 'browse'}</a></div>
 </div></div>
 <div class="card"><div class="hd">CALCULATION ƒx</div><div class="bd" style="font-size:12.5px">
 <code>128,750 kWh × 0.458 kgCO2e/kWh = <b>58.97 tCO2e</b></code> · method CALC-GHG-S2-LOC v1 · factor ${pv('reuse', 'EF-EG-ELEC-2025 · approved', '#/data/factors')} · conversion trace kg→t ÷1000 · <a onclick="toast('Full lineage drawer')">${t('viewCalc')}</a></div></div>
 <div class="card"><div class="hd">VALIDATION</div><div class="bd">
 <div class="gateRow"><span class="st fail">BLOCKER</span><div style="flex:1;font-size:12.5px"><b>VR-EVD-001</b> — this datapoint requires linked evidence before submission · <a onclick="toast('Go to field: Evidence')">Go to field →</a></div></div>
 <div class="gateRow"><span class="st pass">PASS</span><div style="flex:1;font-size:12.5px">VR-UOM-004 unit in family · VR-PER-001 period in cycle · VR-SIT-002 site in boundary · VR-DUP-001 no duplicate (canonical key)</div></div>
 </div></div>
 <div style="display:flex;gap:8px;align-items:center;margin-top:4px;flex-wrap:wrap"><span style="font-size:11.5px;color:var(--mut)">${LANG === 'ar' ? 'حالة القيمة (ثلاث حالات منفصلة Schema-level)' : 'Value state (three distinct schema states)'}:</span><select style="width:auto;padding:4px 9px;font-size:12px" onchange="audit('datapoint.valueState','REC-1055',this.value);toast(this.value==='Missing'?'${LANG === 'ar' ? 'مفقود ⇒ تقدير موثق أو سبب حذف أو استبعاد مبرر — لا خيار رابع' : 'Missing ⇒ documented estimate, omission reason, or justified exclusion — no fourth option'}':'Recorded')"><option>Value entered</option><option>True zero</option><option>Missing</option><option>Not applicable</option></select><span style="flex:1"></span>
 <button class="btn sec" onclick="toast('Draft saved')">${t('save')}</button>
 <button class="btn sec" title="TRN-D22 — compliant answer, never an omission" onclick="audit('ABSENCE_RECORDED','REC-1055','item does not exist — compliant answer');toast('${LANG === 'ar' ? 'سُجل «البند غير موجود» — إجابة متوافقة مكتملة، لا تُنشئ حذفًا (TRN-D22)' : 'Recorded: item does not exist — compliant & complete, no omission record (TRN-D22)'}')">📋 ${LANG === 'ar' ? 'البند غير موجود' : 'Item does not exist'}</button>
 <button class="btn sec" onclick="nav('setup/omissions')">✂ ${LANG === 'ar' ? 'طلب حذف' : 'Request omission'}</button>
 <button class="btn" onclick="toast('Submit refused — 1 blocker (evidence). Upload the meter photo first.')">${t('submit')} → Dept review</button></div>` + `<div class="quickRow">🕘 ${LANG === 'ar' ? 'السجل الكامل والخط الزمني لسجل ديسمبر المعاد' : 'Full history & timeline of the returned December record'}: <a href="#/data/record" data-noar>REC-1055 →</a></div>`
    };

    VIEWS['data/imp'] = () => pageHead(t('imp'), 'Template round-trip: every cell carries its datapoint id — unmapped columns are rejected, never guessed.', '', 'Data & Evidence › Bulk import') +
      `<div class="card"><div class="bd" style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;text-align:center">
 ${[['1 · Download template', '124 rows × datapoint ids', 'done'], ['2 · Upload filled file', 'acme-energy-dec.xlsx', 'done'], ['3 · Validate & preview', '118 accepted · 6 rejected', 'warn'], ['4 · Commit', 'creates DRAFT records → workflow', 'wait']].map(([a, b, s]) => `<div class="tile ${s === 'warn' ? 'warn' : ''}"><div style="font-weight:700">${a}</div><div style="font-size:11.5px;color:var(--mut)">${b}</div></div>`).join('')}
 </div></div>
 <div class="card"><div class="hd">Rejected rows <span class="sub">fix and re-upload — nothing imported silently</span></div><table class="tbl"><thead><tr><th>Row</th><th>Problem</th><th>Rule</th></tr></thead><tbody>
 <tr><td>17</td><td>Unit “tons” not in energy family</td><td>VR-UOM-004</td></tr>
 <tr><td>44</td><td>Duplicate of REC-1024 (same activity·site·month)</td><td>VR-DUP-001</td></tr>
 <tr><td>61</td><td>Negative quantity — raise a restatement instead</td><td>VR-LOG-005</td></tr>
 </tbody></table></div>`;


    VIEWS['data/factors'] = () => pageHead(t('factors'), 'First-class factor library (extracted from findings). No unapproved factor calculates; every factor has source, edition, geography, period and a named approval.',
      `<button class="btn" onclick="toast('Add factor drawer — approval workflow, named sign-off')">＋ ${t('add')}</button>`, 'Data & Evidence › Factor Library') +
      `<div class="card"><table class="tbl"><thead><tr><th>Factor</th><th>Value</th><th>Geo · Year</th><th>Source & evidence</th><th>Approval</th><th></th></tr></thead><tbody>
 ${D.factors.map(f => `<tr><td><b>${f.id}</b><div style="font-size:11px;color:var(--mut)">${esc(f.n)}</div></td><td>${f.val}</td><td>${f.geo} · ${f.yr}</td><td style="font-size:11.5px">${esc(f.src)}</td><td>${f.st === 'approved' ? st('approved', 'Approved · ' + f.by) : f.st === 'review' ? st('review', 'Awaiting approval') : st('blocked', 'Refused in product mode')}</td><td class="rowActs">${f.st === 'review' && ROLE === 'METH' ? `<a onclick="toast('Factor approved — 2 waiting runs unblocked · PG-07 re-evaluates')">${t('approve')}</a>` : `<a onclick="toast('History & usage: which runs use this factor')">${t('history')}</a>`}</td></tr>`).join('')}
 </tbody></table></div>`;

    VIEWS['data/valid'] = () => pageHead(t('valid'), 'PASS / WARNING / BLOCKER with rule, field, value, owner and Go-to-field.', '', 'Data & Evidence › Validation Console') +
      `<div class="tiles">${tile(212, 'Checks run')}${tile(1, 'Blockers', 'err')}${tile(3, 'Warnings', 'warn')}${tile(208, 'Pass', 'ok')}</div>
 <div class="card"><table class="tbl"><thead><tr><th>Sev</th><th>Rule</th><th>Record</th><th>Problem</th><th>${t('who')}</th><th></th></tr></thead><tbody>
 <tr><td>${st('fail', 'BLOCKER')}</td><td>VR-EVD-001</td><td>REC-1026</td><td>Evidence required before submission</td><td>F. Said</td><td class="rowActs"><a href="#/data/dwork">Go to field</a></td></tr>
 <tr><td>${st('pending', 'WARN')}</td><td>VR-TRD-001</td><td>REC-1055</td><td>+28% vs prior — explanation attached, review pending</td><td>M. Adel</td><td class="rowActs"><a href="#/rev/rwb">${t('open')}</a></td></tr>
 <tr><td>${st('pending', 'WARN')}</td><td>VR-EST-001</td><td>REC-1040</td><td>Estimated value — basis documented ✓</td><td>H. Aly</td><td class="rowActs"><a onclick="toast('Basis shown')">${t('view')}</a></td></tr>
 </tbody></table></div>`;

    VIEWS['data/qual'] = () => pageHead(t('qual'), 'Per-dimension quality — no invented composite score (methodology decision). Every card drills to its records.', '', 'Data & Evidence › Quality') +
      `<div class="tiles">${tile('89%', 'Completeness', 'warn', 'data/plan')}${tile('92%', 'Evidence coverage', 'ok', 'data/evid')}${tile('1', 'Validation blockers', 'err', 'data/valid')}${tile('96%', 'Timeliness', 'ok')}${tile('1', 'Estimates (documented)', 'ok')}${tile('72%', 'Reviewed', 'warn', 'rev/rwb')}</div>
 <div class="card"><div class="hd">${LANG === 'ar' ? 'حسب الإدارة' : 'By department'}</div><div class="bd">
 ${[['Utilities', 86], ['HSE', 60], ['Environment', 75], ['CSR', 40], ['Compliance', 100]].map(([d, p]) => `<div style="display:grid;grid-template-columns:130px 1fr 44px;gap:10px;align-items:center;margin-bottom:8px"><span style="font-size:12.5px">${d}</span><div class="prog ${p < 70 ? 'warn' : ''}"><i style="width:${p}%"></i></div><b style="font-size:12px">${p}%</b></div>`).join('')}
 </div></div>
 <div class="card"><div class="hd">${LANG === 'ar' ? 'جودة البيانات حسب الإدارة — نمط العرض (EXAMPLE)' : 'Data quality by department — display pattern (EXAMPLE)'} <span class="sub" data-noar>seed display data — the .NET build derives these from records (contract 29-§9)</span></div>
 <table class="tbl"><thead><tr><th>${LANG === 'ar' ? 'الإدارة' : 'Department'}</th><th>KPIs</th><th>FY entered ⚙</th><th>Completeness ⚙</th><th>High-quality ⚙</th><th>Estimated ⚙</th><th>Assured ⚙</th><th>Sign-off ⚙</th></tr></thead><tbody>
 ${[['Energy & Facilities', 14, 12, '86%', '79%', '7%', '64%', '71%'], ['Environment', 31, 24, '77%', '68%', '13%', '42%', '58%'], ['Human Resources', 20, 18, '90%', '85%', '0%', '55%', '80%'], ['Health & Safety', 11, 11, '100%', '91%', '0%', '82%', '91%'], ['Procurement & Value Chain', 9, 6, '67%', '56%', '11%', '22%', '44%'], ['Customer & Product', 7, 5, '71%', '71%', '0%', '29%', '57%'], ['Legal & Ethics', 10, 9, '90%', '90%', '0%', '70%', '80%'], ['Finance, Tax & Strategy', 8, 7, '88%', '75%', '0%', '50%', '75%'], ['Governance & Community', 3, 3, '100%', '100%', '0%', '67%', '100%']].map(r => `<tr><td style="font-weight:600">${r[0]}</td>${r.slice(1).map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}
 </tbody></table></div>`;

    VIEWS['data/comp'] = () => pageHead(t('comp'), 'Current vs prior with thresholds; explanations are recorded on the record and visible to review and assurance.', '', 'Data & Evidence › Comparative') +
      `<div class="card"><table class="tbl"><thead><tr><th>KPI</th><th>FY2024</th><th>FY2025</th><th>Δ</th><th>Threshold</th><th>Explanation</th></tr></thead><tbody>
 ${['ENV-GHG-003', 'ENV-WAT-001', 'SOC-OHS-002', 'GEN-EMP-001'].map(id => {
        const f = factOf(id), k = kpiById(id); if (!f || f.fy24 == null) return '';
        const d = Math.round((f.fy25 - f.fy24) / f.fy24 * 1000) / 10; const br = Math.abs(d) > 25;
        return `<tr><td>${esc(k.en)} <span class="fn" data-noar>(${esc(k.u)})</span></td><td>${f.fy24.toLocaleString()}</td><td>${f.fy25.toLocaleString()} ⚙</td><td ${br ? 'style="color:var(--warn);font-weight:700"' : ''}>${d > 0 ? '+' : ''}${d}%</td><td>25%</td><td>${br ? `<a onclick="toast('Explanation required on the record before approval (comparison rule VR-CMP-001)')">required</a>` : '—'}</td></tr>`
      }).join('')}
 </tbody></table></div>`;

    VIEWS['data/restate'] = () => pageHead(t('restate'), 'The only path into locked data. The affected set is computed, never guessed; the original is never overwritten.', '', 'Data & Evidence › Restatements') +
      `<div class="card"><div class="hd">RST-2026-001 · FY2024 Scope-2 figure <span class="sub">GRI 2-4</span><div class="actions">${st('approved', 'Approved')}</div></div><div class="bd">
 <div class="kv"><dt>Original (published FY2024)</dt><dd>598 tCO2e 🔒</dd><dt>Corrected</dt><dd>612 tCO2e</dd><dt>Reason</dt><dd style="font-weight:400">Grid factor edition error (2023 factor applied to Q4)</dd>
 <dt>Affected (computed ⚙)</dt><dd style="font-weight:400">1 calc run · 305-2 comparative baseline · report §5.1 prior-year column · content-index row · assurance sample A-7</dd>
 <dt>Approval</dt><dd>Dr. S. Aziz · 20 Jan 2026 · audit #4411</dd></div>
 <div class="notice info" style="margin-top:10px"><b>Dual view:</b> after publication both values remain retrievable — the original is never overwritten (E-14).</div></div></div>`;

    /* ================= REVIEW & COMPLIANCE ================= */

    VIEWS['rev/xchk'] = () => pageHead(t('xchk'), 'Automated consistency across disclosures: totals vs breakdowns, boundary, periods, narrative vs metric.', '', 'Review › Cross-checks') +
      `<div class="card"><table class="tbl"><thead><tr><th>Sev</th><th>Check</th><th>Detail</th><th>Affected</th><th>${t('who')}</th><th></th></tr></thead><tbody>
 <tr><td>${st('fail', 'BLOCKER')}</td><td>Total vs breakdown</td><td>302-1 org total 74% collected — site fuel split incomplete (SA sites missing Dec)</td><td>302-1</td><td>S. Tawfik</td><td class="rowActs"><a href="#/data/plan">${t('open')}</a></td></tr>
 <tr><td>${st('pending', 'WARN')}</td><td>Narrative vs metric</td><td>Draft §5.4 says “injuries decreased” — LTIFR rose 28%</td><td>403-9 / §5.4</td><td>Nour</td><td class="rowActs"><a href="#/rpt/rnarr">${t('open')}</a></td></tr>
 <tr><td>${st('pass', 'PASS')}</td><td>Boundary consistency</td><td>All records inside approved boundary (VR-SIT-002)</td><td>—</td><td>—</td><td></td></tr>
 </tbody></table></div>`;

    VIEWS['rev/findings'] = () => pageHead(t('findings'), 'One unified register for every source — technical review, department, GRI 2 gaps, assurance. Independent closure enforced.',
      `<button class="btn" onclick="drawer('＋ '+(LANG==='ar'?'ملاحظة جديدة':'New finding'),findingForm())">＋ ${t('raiseFinding')}</button>`, 'Review › Findings (B-12)') +
      `<div class="tiles">${tile(D.findings.length, LANG === 'ar' ? 'الملاحظات' : 'Findings')}${tile(D.findings.filter(f => f.st === 'open').length, LANG === 'ar' ? 'مفتوحة' : 'Open', 'err')}${tile(D.findings.filter(f => f.st === 'awaiting_verification').length, LANG === 'ar' ? 'بانتظار الإغلاق المستقل' : 'Awaiting independent closure', 'warn')}${tile(D.findings.filter(f => f.st !== 'closed').length, LANG === 'ar' ? 'نشطة أمام بوابة النشر' : 'Active for the Publication Gate', 'warn', 'rev/pgate')}${tile(D.findings.filter(f => f.blocks && f.st !== 'closed').length, LANG === 'ar' ? 'تحجب إفصاحات' : 'Blocking disclosures', 'err')}</div>
 <div class="card">${toolbar(`<select><option>All sources</option><option>Technical review</option><option>Department review</option><option>GRI 2 assessment</option><option>Assurance</option></select>`)}
 <table class="tbl"><thead><tr><th>Ref</th><th>Finding</th><th>Source</th><th>Sev</th><th>Blocks</th><th>${t('who')}</th><th>${t('due')}</th><th>${t('status')}</th><th></th></tr></thead><tbody>
 ${D.findings.map(f => `<tr><td><b>${f.id}</b></td><td>${esc(f.t)}</td><td style="font-size:11.5px">${f.src}</td><td><span class="st ${f.sev === 'MAJOR' ? 'blocked' : 'pending'}">${f.sev}</span></td><td>${f.blocks ? `<b>${f.dis}</b>` : '—'}</td><td>${f.own}</td><td>${f.due}</td><td>${st(f.st === 'open' ? 'open' : f.st === 'closed' ? 'closed' : f.st === 'awaiting_verification' ? 'awaiting_verification' : 'progress', f.st.replace(/_/g, ' '))}</td><td class="rowActs">${f.st === 'awaiting_verification' ? `<a onclick="toast('Closure verified by independent user (SoD) — closed · audited')">Verify closure</a>` : `<a onclick="drawer(f.id+' — '+esc(f.t),findingDetail(f.id))">${t('open')}</a>`}</td></tr>`).join('')}
 </tbody></table></div>`;

    function findingForm() {
      return `<div class="formGrid">
 ${sect('Finding', 'الملاحظة', '')}
 ${field({ label: 'Title', req: 1, ph: 'What was found' })}
 ${field({ label: 'Source', req: 1, type: 'select', opts: ['Technical review', 'Department review', 'GRI 2 assessment', 'Validation rule', 'Assurance', 'Manual'], value: 'Manual' })}
 ${field({ label: 'Category', req: 1, type: 'select', opts: ['Data', 'Calculation', 'Evidence', 'Process', 'Policy', 'System'] })}
 ${field({ label: 'Severity', req: 1, type: 'select', opts: ['MAJOR — material / blocks the claim', 'MINOR'], help: 'Severity is recorded and displayed; the affected disclosure blocks — never the whole cycle by itself.' })}
 ${field({ label: 'Description', req: 1, type: 'area', full: 1, help: 'What exists, where found, why it matters.' })}
 ${sect('Affected objects — linked', 'الكائنات المتأثرة', 'links, never copies')}
 ${field({ label: 'Affected disclosure', type: 'select', opts: ['2-8 Workers who are not employees', '305-2 Scope 2', '302-1 Energy'], help: 'M:N — FindingAffectedDisclosure.' })}
 ${field({ label: 'Affected datapoint', type: 'select', opts: ['2-8-a Total non-employee workers', '— none —'] })}
 ${field({ label: 'Affected object', type: 'select', opts: ['RUN-2209 (calculation)', 'EV-0025 (evidence)', '— none —'] })}
 ${field({ label: 'Blocks disclosure?', req: 1, type: 'select', opts: ['Yes — disclosure blocked until closure', 'No'], value: 'Yes — disclosure blocked until closure' })}
 ${field({ label: 'Factor reference', type: 'select', opts: ['— none —', 'EF-EG-GRID-2025 (Factor Library)'], help: 'A factor problem points at the Factor Library — master fields are never duplicated here.' })}
 ${sect('Remediation', 'المعالجة', '')}
 ${field({ label: 'Root cause', type: 'area', full: 1 })}
 ${field({ label: 'Corrective action', req: 1, type: 'area', full: 1 })}
 ${field({ label: 'Remediation owner', req: 1, type: 'select', opts: ['K. Mansour', 'F. Said', 'M. Fouad'], help: 'SoD: closer ≠ raiser and ≠ handler.' })}
 ${field({ label: 'Target date', req: 1, type: 'date' })}
 <div class="full"><label style="font-weight:600;font-size:12px">Evidence</label><div style="border:1.5px dashed var(--line);border-radius:9px;padding:12px;text-align:center;color:var(--mut)">📎 <a onclick="toast('Evidence object linked')">Attach</a></div></div>
</div>`}
    function findingDetail(id) {
      const f = D.findings.find(x => x.id === id) || D.findings[0]; return `<div class="kv">
 <dt>Finding</dt><dd>${f.id} · ${esc(f.t)}</dd><dt>Source / Category</dt><dd>${f.src} · Data</dd>
 <dt>Severity</dt><dd><span class="st ${f.sev === 'MAJOR' ? 'blocked' : 'pending'}">${f.sev}</span> ${f.blocks ? '· blocks <b>' + f.dis + '</b>' : ''}</dd>
 <dt>Affected objects</dt><dd style="font-weight:400">Disclosure ${f.dis || '—'} · datapoint 2-8-a · linked, not copied</dd>
 <dt>Root cause</dt><dd style="font-weight:400">Contractor extract excludes two O&M vendors — interface gap HR↔Procurement.</dd>
 <dt>Corrective action</dt><dd style="font-weight:400">Extend extract to procurement vendor register; reconcile monthly; re-submit datapoint.</dd>
 <dt>Remediation owner / due</dt><dd>${f.own} · ${f.due}</dd>
 <dt>${t('status')}</dt><dd>${st(f.st === 'open' ? 'open' : f.st === 'closed' ? 'closed' : 'awaiting_verification', f.st.replace(/_/g, ' '))}</dd>
 <dt>Response</dt><dd style="font-weight:400">Owner accepted 14 Feb — remediation in progress.</dd>
 <dt>Closure</dt><dd style="font-weight:400">${f.st === 'closed' ? 'Closed by independent verifier (SoD) · evidence EV-0042 · 02 Mar' : 'Requires: closure evidence + independent closure reviewer (never raiser/handler) + closure date.'}</dd>
 <dt>History</dt><dd style="font-weight:400">Raised → assigned → response → ${f.st.replace(/_/g, ' ')} — hash-chained audit entries.</dd></div>
 ${f.st === 'awaiting_verification' ? `<div class="notice info" style="margin-top:10px">Closure verification is restricted to a user who neither raised nor remediated (SOD) — the button appears only for them.</div>` : ''}`
    }
    VIEWS['rev/oapp'] = () => pageHead(t('oapp'), 'Governance decisions on omission requests (SoD: requester ≠ approver).', '', 'Review › Omission approval') +
      `<div class="card"><div class="hd">OMR-2025-0002 · 303-5 Water consumption <span class="sub">reason: information unavailable / incomplete</span><div class="actions">${st('submitted', 'Awaiting decision')}</div></div>
 <div class="bd"><div class="kv">
 <dt>Explanation</dt><dd style="font-weight:400">${esc(D.omissions[1].expl)}</dd>
 <dt>Steps + timeframe</dt><dd style="font-weight:400">${esc(D.omissions[1].steps)} — ${D.omissions[1].due}</dd>
 <dt>Requested by</dt><dd>O. Farid (stamped at creation)</dd>
 <dt>Claim impact ⚙</dt><dd style="font-weight:400">Approving satisfies Requirement 6 for this disclosure; the Content Index row flips to “omitted” with this explanation.</dd></div></div>
 <div style="display:flex;gap:8px;justify-content:flex-end;padding:12px 16px;border-top:1px solid var(--line2)">
 <button class="btn danger" onclick="toast('Rejected with reason → requester task')">${t('reject')}</button>
 <button class="btn warn" onclick="toast('Returned for stronger steps/timeframe')">${t('return')}</button>
 <button class="btn" onclick="toast('Approved — requirement 6 re-evaluated · PG-12 re-evaluated · index updated · audited')">${t('approve')}</button></div></div>`;

    VIEWS['rev/claim'] = () => pageHead(t('claim'), 'The claim is computed by the engine — no role can write it (CLAIM_MANUAL_SET_BLOCKED). Fix the underlying objects; this screen only tells the truth.',
      `<span class="st pending">Provisional: NOT YET ELIGIBLE</span>`, 'Compliance › Claim') +
      `<div class="card"><div class="hd">${LANG === 'ar' ? 'المتطلبات التسعة — GRI 1:2021' : 'The nine requirements — GRI 1:2021'} <span class="sub">${reqStats()} pass · ${reqRows().filter(r => r.st === 'pending').length} pending · ${reqRows().filter(r => r.st === 'fail').length} fail</span></div><div class="bd">
 ${reqRows().map(r => `<div class="gateRow"><span class="gid">Req ${r.n}</span><div style="flex:1"><b style="font-size:12.5px">${esc(r.t)}</b><div style="font-size:12px;color:var(--mut)">${esc(r.d)}</div></div><span class="st ${r.st}">${r.st.toUpperCase()}</span></div>`).join('')}
 </div></div>
 <div class="notice info"><b>${LANG === 'ar' ? 'تسلسل الادعاء' : 'Claim sequence'}:</b> substantive 1–7 → provisional eligibility → statement generated → validated (Req 8) → notification (Req 9) → final claim → statement locked. ${LANG === 'ar' ? '' : 'With 9/9: <b>IN ACCORDANCE</b>; with index+statement+notification only: <b>WITH REFERENCE</b>.'}</div>
 <div class="card"><div class="hd">${LANG === 'ar' ? 'ضوابط النزاهة' : 'Integrity controls'} <span class="sub" data-noar>CE-X1 · CE-X2 · CE-X3 — ${LANG === 'ar' ? 'ليست متطلبات GRI؛ ضوابط نظام حاجبة' : 'system controls, blocking'}</span></div><div class="bd">
 ${ceEval().filter(c => c.x).map(c => `<div class="gateRow"><span class="gid" data-noar>${c.id}</span><div style="flex:1"><b style="font-size:12.5px">${esc(c.n)}</b><div style="font-size:12px;color:var(--mut)">${esc(c.res.d)}</div></div><span class="st ${c.res.pass ? (c.warn ? 'ok' : 'approved') : 'blocked'}">${c.res.pass ? 'PASS' : 'FAIL'}</span></div>`).join('')}
 </div></div>
 <div class="card"><div class="hd">${LANG === 'ar' ? 'صيغتا بيان الاستخدام (من الـConfig — لا تُكتبان)' : 'The two statement templates (from CONFIG — never typed, never a dropdown)'}</div><div class="bd" style="font-size:12.5px;line-height:1.8">
 <div><span class="st approved">IN ACCORDANCE</span> <span data-noar style="color:var(--mut)">${esc(CONFIG.stmt.inAcc)}</span></div>
 <div style="margin-top:8px"><span class="st review">WITH REFERENCE</span> <span data-noar style="color:var(--mut)">${esc(CONFIG.stmt.withRef)}</span></div>
 <div class="help" style="margin-top:10px">${LANG === 'ar' ? 'G6 — بوابة الادعاء: غير قابلة للتجاوز مطلقًا؛ نقص أي متطلب يحوّل آليًا إلى with reference.' : 'G6 — the Claim Gate: never overridable; any missing requirement forces the with-reference statement automatically.'}</div>
 </div></div>`;




    /* ================= REPORT & ASSURANCE ================= */
    VIEWS['rpt/rproj'] = () => pageHead(t('rproj'), 'Setup form — the report starts ~70% generated, never a blank editor.', '', 'Report › Project') +
      `<div class="card"><div class="bd formGrid">
 ${field({ label: 'Cycle', value: 'ACME-FY2025', pv: { k: 'reuse', t: 'from Cycles', 'l': '#/org/cycles' } })}
 ${field({ label: 'Report name', req: 1, value: 'Acme Sustainability Report 2025' })}
 ${field({ label: 'Primary language', req: 1, type: 'select', opts: ['English', 'Arabic'], value: 'English' })}
 ${field({ label: 'Secondary language', type: 'select', opts: ['Arabic', '—'], value: 'Arabic' })}
 ${field({ label: 'Reporting basis', value: 'GRI Standards — claim computed', pv: { k: 'der', t: t('derived'), l: '#/rev/claim' } })}
 ${field({ label: 'Report owner', req: 1, type: 'select', opts: ['Nour Hamed'], value: 'Nour Hamed' })}
 ${field({ label: 'Target publication', value: '30 Apr 2026', pv: { k: 'reuse', t: 'from Cycle' } })}
 </div><div style="display:flex;justify-content:flex-end;gap:8px;padding:12px 16px;border-top:1px solid var(--line2)"><button class="btn" onclick="nav('rpt/rstruct')">Generate structure →</button></div></div>`;




    VIEWS['rpt/rbind'] = () => pageHead(t('rbind'), 'Every published value ↔ its immutable source reference. Lineage must be 100% before preview clears.', '', 'Report › Binding') +
      `<div class="tiles">${tile(48, 'Bindings')}${tile(46, 'Healthy', 'ok')}${tile(1, 'STALE', 'warn')}${tile(1, 'Unbound element', 'err')}</div>
 <div class="card"><table class="tbl"><thead><tr><th>Element</th><th>Bound to</th><th>Version</th><th>${t('status')}</th><th></th></tr></thead><tbody>
 <tr><td>§5.1 token · energy intensity</td><td>CALC-ENE-INT run #2188</td><td>v1 (superseded by restatement)</td><td>${st('stale', 'STALE')}</td><td class="rowActs"><a onclick="toast('Rebound to run #2245 — STALE cleared · audited')">Refresh</a></td></tr>
 <tr><td>§2.3 headcount table</td><td>2-7 records (approved)</td><td>current</td><td>${st('approved', 'Healthy')}</td><td></td></tr>
 <tr><td>§5.2 water chart</td><td><i style="color:var(--err)">no binding</i></td><td>—</td><td>${st('blocked', 'Unbound')}</td><td class="rowActs"><a onclick="toast('Bind to DS-303-3')">Bind</a></td></tr>
 </tbody></table></div>`;

    VIEWS['rpt/rprev'] = () => pageHead(t('rprev'), 'Full bilingual render with unresolved-items panel and provenance on hover.', '', 'Report › Preview') +
      `<div class="notice warn"><b>${pubBlockers().stale + 1 + pubBlockers().locGaps} blockers before a publishable preview:</b> ${pubBlockers().stale} STALE binding · 1 unbound chart · content index ${pubBlockers().locGaps} location gaps. ${LANG === 'ar' ? '' : 'Publishable preview unlocks F-16 only when this list is empty.'}</div>
 <div class="card"><div class="bd" style="background:#fff;max-width:760px;margin:0 auto;padding:34px;font-family:Georgia,serif">
 <div style="text-align:center;border-bottom:2px solid var(--acc);padding-bottom:18px;margin-bottom:18px"><div style="font-size:24px;font-weight:700">Acme Sustainability Report 2025</div><div style="color:var(--mut);font-size:13px">Reported in accordance with the GRI Standards <span class="st pending" style="font-family:'Segoe UI'">pending — computed</span></div></div>
 <div style="font-size:13px;line-height:1.9">§5.1 — In FY2025 our operations emitted <u title="${resolveReportBinding('RB-002').approvedVersionId} — bound via resolver · lineage ${(cvOf('ENV-GHG-003') || {}).id || '—'}">${resolveReportBinding('RB-002').value} tCO₂e</u> of location-based Scope 2 emissions… <span style="background:var(--warnBg)">[⚠ energy-intensity token stale]</span></div>
 </div></div>`+ `<div class="quickRow">🖨 ${LANG === 'ar' ? 'شاهد الوثيقة كاملة كما ستُطبع' : 'See the whole document as it will print'}: <a href="#/rpt/print">${LANG === 'ar' ? 'فتح نسخة الطباعة' : 'Open print view'} →</a></div>`;

    VIEWS['rpt/rexp'] = () => pageHead(t('rexp'), LANG === 'ar' ? 'كل تصدير يسجل النسخة والوقت والمستخدم ونسخة التقرير المصدر — ولكل صيغة مصدرها المنفصل.' : 'Every export records version, timestamp, user and source report version — and each format has its own exporter service.', '', 'Report › Export Center (F-15)') +
      `<div class="card"><table class="tbl"><thead><tr><th>Artifact</th><th>Format</th><th>${LANG === 'ar' ? 'الخدمة المسؤولة' : 'Exporter service'}</th><th>Last generated</th><th>Stamp</th><th></th></tr></thead><tbody>
 ${[['Full report', 'PDF', 'IReportRenderer + IPageAnchorResolver', `<a onclick="nav('rpt/print')"><b>${LANG === 'ar' ? 'فتح نسخة الطباعة' : 'Open print view'}</b></a>`, '—', '—'],
      ['Full report', 'Word', 'IDocxExporter', `<a onclick="audit('export.docx','report','draft v0.7');toast('Word Exporter (IDocxExporter) — separate service, never window.print · recorded')">Generate</a>`, '—', '—'],
      ['Content Index', 'XLSX', 'IXlsxExporter', `<a onclick="audit('export.xlsx','cidx','v4');toast('Spreadsheet Exporter (IXlsxExporter) — version stamped · recorded')">Generate</a>`, '06 Feb 14:02', 'v3 · Layla'],
      ['Data annexes', 'XLSX', 'IXlsxExporter', `<a onclick="audit('export.xlsx','annex','v3');toast('Spreadsheet Exporter (IXlsxExporter) — version stamped · recorded')">Generate</a>`, '06 Feb 14:03', 'v3 · Layla'],
      ['Gap analysis', 'XLSX', 'IXlsxExporter', `<a onclick="audit('export.xlsx','gap','v2');toast('Spreadsheet Exporter (IXlsxExporter) — version stamped · recorded')">Generate</a>`, '04 Feb', 'v2 · Layla'],
      ['XBRL / taxonomy', '(phase 2)', 'IXbrlTagger — Conditional Release 2', '', '—', 'never blocks core journey']].map(([a, f, svc, act, l, s]) => `<tr><td><b>${a}</b></td><td>${f}</td><td style="font-size:11px;color:var(--mut)" data-noar>${svc}</td><td>${l}</td><td style="font-size:11.5px">${s}</td><td class="rowActs">${act}</td></tr>`).join('')}
 </tbody></table></div>`+
      `<div class="notice info"><b>${LANG === 'ar' ? 'قرار نطاق رسمي SD-01' : 'Formal scope decision SD-01'} — XBRL / Taxonomy (F-09…F-11):</b> ${LANG === 'ar' ? 'إصدار مشروط ثانٍ (Conditional Release 2). معتمد من مالك المنتج بتاريخ 2026-02-01. لا يحجب دورة التقرير الأساسية؛ قاعدة البيانات جاهزة بالـTaxonomy Tags منذ اليوم الأول.' : 'Conditional Release 2 — approved by the Product Owner on 2026-02-01. Does not block the core reporting cycle; the data model carries taxonomy-tag readiness from day one.'} · audit #4102</div>` +
      `<div class="quickRow">🖨 ${LANG === 'ar' ? 'المسودة الكاملة القابلة للطباعة (غلاف + بيان الاستخدام + الفهرس + ملحق الحذف)' : 'The full print-ready draft (cover · statement of use · index · omissions annex)'}: <a href="#/rpt/print">${LANG === 'ar' ? 'طباعة / PDF' : 'Print / PDF'} →</a></div>
 <div class="card"><div class="hd">${LANG === 'ar' ? 'بيان الإصدار — هوية النسخ' : 'Release manifest — version identity'} <span class="sub">${LANG === 'ar' ? 'الـPDF لا يعرض المعرفات؛ البيان يحفظها' : 'the PDF hides IDs; the manifest preserves them'}</span></div>
 <div class="bd" style="font-size:12px"><table class="tbl"><thead><tr><th>Element</th><th>KPI</th><th>ApprovedVersionId</th><th>Value</th><th>Stale</th></tr></thead><tbody>
 ${Object.keys(REPORT_BINDINGS).map(el => { const r = resolveReportBinding(el); return `<tr><td data-noar>${el} · ${esc((REPORT_BINDINGS[el].el || '').slice(0, 26))}</td><td data-noar>${r.kpiId || '—'}</td><td data-noar>${r.approvedVersionId || r.status}</td><td>${r.value ?? '—'}</td><td>${r.stale ? '⚠' : '—'}</td></tr>` }).join('')}
 </tbody></table>
 <div style="margin-top:8px;color:var(--mut)">Release REL-2026-DRAFT · Report v${D.reportProject ? D.reportProject.version || '0.9' : '0.9'} · Binding registry v14 · KPIM ${KPIM_CHECKSUM} · generated: on release · actor: ${ROLE} — ${LANG === 'ar' ? 'أي عنصر Stale أو UNBOUND يمنع الإصدار النهائي' : 'any stale or unbound element refuses the final release'}</div></div></div>`;


    /* ================= ASSURANCE (external persona) ================= */
    VIEWS['asr/aeng'] = () => pageHead(t('aeng'), 'Scope frozen at acceptance; impartiality (SOD-04) checked at assignment — preparers cannot join.', '', 'Assurance › Engagement') +
      `<div class="card"><div class="bd kv">
 <dt>Provider</dt><dd>Verify & Co. (engagement AE-2026-01)</dd><dt>Standards</dt><dd>ISAE 3000 (Revised) · ISO 14064-3:2019</dd><dt>Level</dt><dd>Limited assurance</dd>
 <dt>Scope (enumerable)</dt><dd style="font-weight:400">GHG 305-1/305-2 · energy 302-1 · safety 403-9 · water 303-3 — 5 scope lines, each mapping to populations below</dd>
 <dt>Period</dt><dd>FY2025 · fieldwork Feb–Mar 2026</dd><dt>Access ⚙</dt><dd style="font-weight:400">Read-only over approved client data & evidence; may write: evidence requests, clarifications, findings.</dd></div></div>`+
      `<div class="card"><div class="hd">${LANG === 'ar' ? 'ضوابط فصل المهام — من الـConfig' : 'Segregation of duties — from CONFIG'} <span class="sub" data-noar>SOD-01…08</span></div><div class="bd">
 ${CONFIG.SOD.map(([id, r, lv]) => `<div class="gateRow"><span class="gid" data-noar>${id}</span><div style="flex:1;font-size:12.5px">${esc(r)}</div><span class="st draft" data-noar>${lv}</span></div>`).join('')}
 <div class="notice ok" style="margin-top:10px"><b data-noar>SOD-06 — G_IMPARTIALITY:</b> ${LANG === 'ar' ? 'كيان الإعداد' : 'preparer entity'} <b data-noar>Acme (client)</b> ≠ ${LANG === 'ar' ? 'كيان مزود التأكيد' : 'provider entity'} <b data-noar>Verify & Co.</b> — PASS. <a onclick="sodDemo()">${LANG === 'ar' ? 'جرّب تسجيل كيان الإعداد كمزود' : 'Try registering the preparer as provider'} →</a></div>
 </div></div>`;
    function sodDemo() {
      audit('assurance.provider', 'SOD-06', 'G_IMPARTIALITY refusal');
      drawer('⛔ G_IMPARTIALITY', `<div class="notice err"><b>HTTP 422</b> — <span data-noar>{"guard":"G_IMPARTIALITY","message":"Impartiality conflict: the preparing entity cannot be registered as the assurance provider"}</span></div>
 <div class="tlNote">${LANG === 'ar' ? 'القاعدة على مستوى الكيان القانوني لا المستخدم — النظام يجعل تعارض الإعداد/التأكيد مستحيلًا تقنيًا لا بسياسة. وهي نفسها قاعدة الفصل بين الكيان الاستشاري وأي جهة تحقق مستقلة.' : 'Enforced on the legal entity, not the user — the system makes the preparer/assurer conflict technically impossible rather than a policy. The same rule that separates an advisory entity from any independent verifier.'}</div>`,
        `<button class="btn sec" onclick="closeDrawer()">${t('cancel')}</button>`)
    }
    VIEWS['asr/awork'] = () => pageHead(t('awork'), 'Same evidence chain the organization used — no separate assurance data universe.', '', 'Assurance › Workspace') +
      `${(() => {
        const f = factOf('ENV-GHG-003'); return `<div class="card"><div class="hd">${LANG === 'ar' ? 'الحقيقة محل الفحص — من نفس المسقط' : 'Fact under scrutiny — the same projection every surface reads'} <span class="sub" data-noar>factOf('ENV-GHG-003')</span></div><div class="bd" style="display:flex;gap:18px;flex-wrap:wrap;font-size:12px">
  <span>Scope 2 LB FY2025: <b>${f.fy25}</b> tCO₂e ${f.stale ? '<span class="pv der">⚠ stale — re-approval pending</span>' : ''}</span>
  <span>ApprovedVersion: <b data-noar>${f.ver}</b> · ${f.rec}</span><span>Quality: ${f.q}</span><span>${LANG === 'ar' ? 'نطاق التأكيد' : 'Assurance'}: ${f.asr} (per-datapoint flag ⚙)</span>
 </div></div>`})()}<div class="tiles">${tile(5, 'Scope lines')}${tile(12, 'Population · 305-2')}${tile(4, 'Sampled')}${tile(2, 'Evidence requests open', 'warn')}</div>
 <div class="card"><div class="hd">Sample — 305-2 (method & seed recorded; re-run returns identical selection)</div><table class="tbl"><thead><tr><th>Record</th><th>Value</th><th>Lineage</th><th>Evidence</th><th>Assessment</th></tr></thead><tbody>
 <tr><td>REC-1024 · Oct</td><td>120,000 kWh → 54.96 tCO2e ƒx</td><td><a onclick="toast('Full backward walk: record → calc → factor → evidence → contributor')">walk ←</a></td><td><span class="ev">📎 EV-0019 ✓ hash</span></td><td>${st('approved', 'No exception')}</td></tr>
 <tr><td>REC-1025 · Nov</td><td>131,400 kWh</td><td><a onclick="toast('walk')">walk ←</a></td><td><span class="ev">📎 EV-0021 ✓</span></td><td>${st('review', 'Testing')}</td></tr>
 <tr><td>REC-1031 · Sep (diesel)</td><td>18,000 L → 48.24 ƒx</td><td><a onclick="toast('walk')">walk ←</a></td><td><span class="ev">📎 EV-0020 ✓</span></td><td>${st('approved', 'No exception')}</td></tr>
 </tbody></table></div>
 <div class="card"><div class="hd">Evidence requests & clarifications</div><table class="tbl"><tbody>
 <tr><td>ER-03 · “October utility bill original”</td><td>→ preparer task</td><td>${st('closed', 'Answered')}</td></tr>
 <tr><td>ER-04 · “Contractor hours basis for LTIFR”</td><td>→ A. Qassem</td><td>${st('open', 'Open')}</td></tr>
 </tbody></table></div>`;
    VIEWS['asr/afind'] = () => pageHead(t('afind'), 'Assurance findings enter the same unified register; the provider never edits client data.', '', 'Assurance › Findings') +
      `<div class="card"><table class="tbl"><thead><tr><th>Ref</th><th>Finding</th><th>Response</th><th>${t('status')}</th></tr></thead><tbody>
 <tr><td><b>FND-2025-0003</b></td><td>Scope 2 factor edition — confirm 2025 bulletin applied to all months</td><td>Preparer response 05 Feb: re-run confirmed; evidence EV-0028 attached</td><td>${st('review', 'Resolved — awaiting our verification')}</td></tr>
 </tbody></table><div style="display:flex;justify-content:flex-end;gap:8px;padding:12px 16px;border-top:1px solid var(--line2)"><button class="btn" onclick="toast('Closure verified — PG-15 re-evaluates')">Verify closure</button></div></div>`;
    VIEWS['asr/apack'] = () => pageHead(t('apack'), 'Generated from the same chain: data, evidence, lineage, audit, findings, responses, index, draft report.', '', 'Assurance › Pack') +
      `<div class="card"><table class="tbl"><tbody>
 ${[['Approved records extract (scope lines)', '1,412 rows', 'ready'], ['Evidence manifest + hashes', '214 objects', 'ready'], ['Calculation lineage', '38 runs', 'ready'], ['Findings & responses', '5 threads', 'ready'], ['Content index v3', '—', 'warn'], ['Draft report v0.7', '—', 'warn'], ['Audit trail extract', '8,204 events', 'ready']].map(([a, b, s]) => `<tr><td><b>${a}</b></td><td>${b}</td><td>${s === 'ready' ? st('approved', 'Current') : st('stale', 'Regenerates on change')}</td></tr>`).join('')}
 </tbody></table></div>`;

    /* ================= ADMIN ================= */
    VIEWS['adm/astd'] = () => pageHead(t('astd'), 'Governed reference data: standards & editions, disclosure matrix, data dictionary — content releases activate with a diff, never a hand edit.', '', 'Admin › Standards') +
      `<div class="card"><table class="tbl"><thead><tr><th>Standard</th><th>Edition</th><th>Status</th><th>Transition</th></tr></thead><tbody>
 <tr><td>GRI 1/2/3</td><td>2021</td><td>${st('approved', 'Active')}</td><td>—</td></tr>
 <tr><td>GRI 102 Climate Change</td><td>2025</td><td>${st('pending', 'Future · eff. 2027')}</td><td>early adoption electable per cycle</td></tr>
 <tr><td>GRI 103 Energy</td><td>2025</td><td>${st('pending', 'Future · eff. 2027')}</td><td>supersedes GRI 302:2016</td></tr>
 <tr><td>GRI 14 Mining</td><td>2024</td><td>${st('approved', 'Active · eff. 2026')}</td><td style="color:var(--err)">topic content NOT loaded — claim-blocking if applicable</td></tr>
 </tbody></table></div>
 <div class="card"><div class="hd">Content releases (A-15)</div><div class="bd" style="font-size:12.5px">CR-2026-02 · GRI 14 topic set · 87 rows · <button class="btn sec" onclick="toast('Diff shown: +87 rows, 0 changed — activate?')">Review diff & activate</button></div></div>`;
    VIEWS['adm/ausers'] = () => pageHead(t('ausers'), 'Roster + role assignments + SoD matrix. An assignment breaching SoD is refused and audited.', '', 'Admin › Users') +
      `<div class="card"><table class="tbl"><thead><tr><th>User</th><th>Roles</th><th>Scope</th><th>SoD notes</th></tr></thead><tbody>
 ${ROLES.filter(r => !['ASSUR'].includes(r.id)).slice(0, 7).map(r => `<tr><td><b>${(r.en).split('·')[0]}</b></td><td>${(r.en).split('·')[1] || ''}</td><td>cycle/org</td><td style="font-size:11.5px;color:var(--mut)">${r.id === 'CONTRIB' ? 'cannot approve own records (SOD-01)' : r.id === 'GOV' ? 'cannot prepare what he approves (SOD-03)' : '—'}</td></tr>`).join('')}
 </tbody></table></div>`;
    VIEWS['adm/aconf'] = () => pageHead(t('aconf'), 'Taxonomies as data — sectors, certifications, context types, assurance standards, units. No code deploy to add a value.', '', 'Admin › Configuration') +
      `<div class="card"><div class="bd legendGrid">
 ${[['Sectors', 'Renewable power · Construction materials · Mining & quarrying · Logistics · + add'], ['Certification standards', 'ISO 14001 · ISO 45001 · ISO 50001 · + add'], ['Context types', 'Regulation · Incident · Complaint · Audit finding · Sector issue · …'], ['Assurance standards', 'ISAE 3000 (R) · ISO 14064-3:2019 · AA1000AS'], ['Unit families', 'energy(kWh) · mass(kg) · volume(m³) · ghg(kgCO2e) · currency(EGP) — cross-family conversion refused'], ['Validation rules', '10 seeded VR-* · severities BLOCKER/WARNING · table-driven']].map(([a, b]) => `<div class="tile"><div style="font-weight:700;font-size:12.5px">${a}</div><div style="font-size:11.5px;color:var(--mut)">${b}</div></div>`).join('')}
 </div></div>`;
    VIEWS['adm/aaudit'] = () => pageHead(t('aaudit'), 'Append-only — no UI, API or database path updates or deletes an entry.', '', 'Admin › Audit') +
      `<div class="card">${toolbar()}<table class="tbl"><thead><tr><th>When</th><th>Who</th><th>Action</th><th>Object</th><th>Detail</th></tr></thead><tbody>
 ${D.audit.map(a => `<tr><td style="white-space:nowrap">${a.w}</td><td>${esc(a.u)}</td><td><code style="font-size:11.5px">${a.a}</code></td><td>${esc(a.o)}</td><td style="font-size:12px">${esc(a.d)}</td></tr>`).join('')}
 </tbody></table></div>`;


    /* ---- named drawer forms (quote-safe) ---- */
    function actForm() { return `<div class="formGrid">${sect('Item', 'العنصر', 'GRI 2-6')}${field({ label: 'Item name', gri: '2-6', req: 1 })}${field({ label: 'Item code', req: 1, ph: 'ACT-05', help: 'Stable key — reused by Sector, Context and Impacts.' })}${field({ label: 'Item type', req: 1, type: 'select', opts: ['Activity', 'Product', 'Service', 'Market served', 'Supplier category (upstream)', 'Downstream entity', 'Other business relationship'] })}${field({ label: 'Value-chain position', req: 1, type: 'select', opts: ['Own operations', 'Upstream (supply chain)', 'Downstream', 'Other relationship'], help: 'Whether this sits before, inside, or after the organization’s operations.' })}${field({ label: 'Suggested sector', type: 'select', opts: ['Energy', 'Construction materials', 'Logistics'], help: 'Suggestion only — classification is decided in the Sector tab (single authority).' })}${field({ label: 'Markets served', gri: '2-6', value: 'KSA, Egypt, GCC' })}${field({ label: 'Key upstream inputs / supplier categories', value: '', help: 'Repeater in production — what GRI 2-6 asks: what enters, what exits.' })}${field({ label: 'Downstream customers / entities', value: '' })}${sect('Relationships', 'العلاقات', 'GRI 2-6-b')}${field({ label: 'Related legal entities', type: 'select', opts: ['Acme Energy KSA Ltd', 'Acme Materials Egypt SAE'], help: 'The B-02 entities this item flows through.' })}${field({ label: 'Related sites', type: 'select', opts: ['S-KSA-01 · Solar plant', 'S-EG-01 · Cement plant', 'S-EG-02 · Quarry'], help: 'Where relevant — B-03 references.' })}${field({ label: 'Products / services produced', value: '', help: 'What this item puts on the market.' })}${field({ label: 'Description', type: 'area', full: 1 })}${sect('Change during the period', 'التغيير خلال الفترة', 'GRI 2-6-d')}${field({ label: 'Lifecycle change this period', gri: '2-6-d', req: 1, type: 'select', opts: ['No change', 'Added this period', 'Removed this period'], value: 'No change' })}${field({ label: 'Change description', type: 'area', full: 1, help: 'Required when added / removed during the reporting period — GRI 2-6 asks what changed and why.' })}${field({ label: 'Materiality / impact relevance', type: 'area', full: 1, help: 'Feeds C-02 Context as an input — never a materiality decision here.' })}${sect('Governance', 'الحوكمة', '')}${field({ label: 'Responsible owner', req: 1, type: 'select', opts: ['Khaled Mansour', 'F. Said'], value: 'Khaled Mansour' })}${field({ label: 'Preparer entity', value: 'Acme Sustainable Industries Holding', ro: 1, help: 'Locked — SOD-04.' })}${field({ label: 'Effective from', req: 1, type: 'date', value: '2026-01-01' })}${field({ label: 'Effective to', type: 'date', value: '' })}<div class="full"><label style="font-weight:600;font-size:12px">Evidence</label><div style="border:1.5px dashed var(--line);border-radius:9px;padding:12px;text-align:center;color:var(--mut)">📎 <a onclick="toast('Evidence object — linked, never free text')">Attach supporting document</a></div></div></div>` }
    function electForm() {
      return `<div class="notice info">Both editions rendered side-by-side; the applicable version resolves automatically from the cycle publication date unless elected here.</div><div class="formGrid">
 ${sect('Standard — composite-key aware', 'المعيار', 'from the register')}
 ${field({ label: 'Standard', value: 'GRI 305 → GRI 102: Climate Change', pv: { k: 'reuse', t: 'Standards register', l: '#/adm/astd' } })}
 ${field({ label: 'Versions in the register', value: '305:2016 (active until 2026-12-31) · 102:2025 (eff. 2027-01-01, early adoption permitted)', ro: 1, full: 1 })}
 ${field({ label: 'Cycle publication basis', value: '30 Apr 2026 — frozen at Start', pv: { k: 'reuse', t: 'from B-05', l: '#/org/cycles' } })}
 ${field({ label: 'Resolved applicable edition', value: 'GRI 305:2016 — auto-resolved from publication date', pv: { k: 'der', t: t('derived') }, help: 'System-controlled; the election below is the only human input.' })}
 ${sect('Election', 'القرار', '')}
 ${field({ label: 'Elect early adoption?', req: 1, type: 'select', opts: ['No — remain on GRI 305:2016', 'Yes — adopt GRI 102:2025'] })}
 ${field({ label: 'Decision owner', req: 1, type: 'select', opts: ['Dr. Hala Nassar (Methodology Owner)'] })}
 ${field({ label: 'Rationale', req: 1, type: 'area', full: 1 })}
 ${field({ label: 'Restatement note', gri: '2-4', type: 'area', full: 1, help: 'Required when the election changes previously reported comparatives.' })}
 ${field({ label: 'Status / version', value: 'Draft · v1 — approval routes to Methodology Owner; history retained per member', ro: 1, full: 1 })}
</div>`}
    function ctxForm() {
      return `<div class="formGrid">
 ${sect('Identity', 'الهوية', 'C-02')}
 ${field({ label: 'Context ID', value: 'CTX-06 — assigned on save', ro: 1 })}
 ${field({ label: 'Issue type', req: 1, type: 'select', opts: ['Regulation', 'Incident', 'Complaint', 'Audit finding', 'Sector issue', 'Strategic issue', 'Community issue', 'Workforce issue'] })}
 ${field({ label: 'Title', req: 1, ph: 'Short issue title' })}
 ${field({ label: 'ESG pillar', req: 1, type: 'select', opts: ['E', 'S', 'G'] })}
 ${field({ label: 'Status / version', value: 'Draft · v1', ro: 1 })}
 ${sect('Where it sits', 'الموضع', 'organization & value chain')}
 ${field({ label: 'Entity / site', type: 'select', opts: ['—', 'EG-CEM-01', 'EG-QRY-01', 'SA-SOL-01'] })}
 ${field({ label: 'Activity / product / service', type: 'select', opts: ['— none —', 'ACT-02 · Cement production', 'ACT-03 · Aggregates quarrying'], pv: { k: 'reuse', t: 'from B-04', l: '#/org/acts' } })}
 ${field({ label: 'Value-chain position', type: 'select', opts: ['Own operations', 'Upstream', 'Downstream'] })}
 ${field({ label: 'Geography', type: 'select', opts: ['Egypt — Suez', 'Egypt — Minya', 'KSA — Riyadh', 'Group-wide'] })}
 ${field({ label: 'Affected stakeholders', type: 'select', opts: ['Quarry community', 'Workforce', 'Contractors', 'Customers'], pv: { k: 'reuse', t: 'from C-03', l: '#/mat/stake' } })}
 ${field({ label: 'Period', type: 'select', opts: ['FY2025'] })}
 ${sect('Source & traceability', 'المصدر', 'origin references — save refused without one')}
 ${field({ label: 'Regulatory source', ph: 'e.g. EEAA Law 4/1994 inspection' })}
 ${field({ label: 'Incident / complaint reference', ph: 'e.g. INC-2025-014' })}
 ${field({ label: 'Audit reference', ph: 'e.g. AF-12' })}
 ${field({ label: 'Strategic source', ph: 'e.g. 2030 decarbonization strategy' })}
 ${field({ label: 'Description', req: 1, type: 'area', full: 1 })}
 ${sect('Governance', 'الحوكمة', '')}
 ${field({ label: 'Owner', req: 1, type: 'select', opts: ['N. Fouad (CSR)', 'K. Mansour (HR)', 'Layla Al-Harbi'] })}
 ${field({ label: 'Date recorded', type: 'date', value: '2026-01-15' })}
 <div class="full"><label style="font-weight:600;font-size:12px">Evidence</label><div style="border:1.5px dashed var(--line);border-radius:9px;padding:12px;text-align:center;color:var(--mut)">📎 <a onclick="toast('Evidence object')">Attach source document</a></div></div>
</div>`}
    function stkForm() {
      return `<div class="formGrid">
 ${sect('Group', 'الفئة', 'C-03')}
 ${field({ label: 'Group', req: 1, ph: 'e.g. Quarry-adjacent community' })}
 ${field({ label: 'Type', req: 1, type: 'select', opts: ['Community', 'Workforce', 'Business partner', 'Regulator', 'Investor / lender', 'Customer', 'Civil society'] })}
 ${field({ label: 'Affected / Interested', req: 1, type: 'select', opts: ['Affected', 'Interested', 'Both'], help: 'GRI 3 distinguishes affected stakeholders from interested parties.' })}
 ${field({ label: 'Vulnerability', type: 'select', opts: ['— none identified —', 'Vulnerable group present — heightened due diligence'], help: 'Flags heightened human-rights attention.' })}
 ${sect('Where', 'الموضع', '')}
 ${field({ label: 'Locations / entity / site', type: 'select', opts: ['EG-QRY-01', 'EG-CEM-01', 'ALL'] })}
 ${field({ label: 'Linked impacts / topics', type: 'select', opts: ['IM-01 dust & noise', 'IM-04 water drawdown', 'MT-01'], pv: { k: 'reuse', t: 'links, not copies' } })}
 ${sect('Salience', 'الأهمية', '')}
 ${field({ label: 'Influence', type: 'select', opts: ['High', 'Medium', 'Low'] })}
 ${field({ label: 'Dependency', type: 'select', opts: ['High', 'Medium', 'Low'] })}
 ${sect('Engagement', 'المشاركة', '')}
 ${field({ label: 'Engagement method', type: 'select', opts: ['Community consultations', 'Survey', 'Focus group', 'Joint committee', 'Grievance channel'] })}
 ${field({ label: 'Frequency', type: 'select', opts: ['Quarterly', 'Biannual', 'Annual', 'Event-based'] })}
 ${field({ label: 'Owner', type: 'select', opts: ['N. Fouad (CSR)', 'K. Mansour (HR)'] })}
 ${field({ label: 'Status / version', value: 'Active · v2', ro: 1 })}
 <div class="full"><label style="font-weight:600;font-size:12px">Evidence</label><div style="border:1.5px dashed var(--line);border-radius:9px;padding:12px;text-align:center;color:var(--mut)">📎 <a onclick="toast('Evidence object')">Attach mapping basis</a></div></div>
</div>`}
    function engForm() {
      return `<div class="formGrid">
 ${sect('Session', 'الجلسة', 'C-05')}
 ${field({ label: 'Stakeholder', req: 1, type: 'select', opts: ['Quarry-adjacent community', 'Own workforce', 'O&M contractors'] })}
 ${field({ label: 'Date', req: 1, type: 'date', value: '2026-01-20' })}
 ${field({ label: 'Method', req: 1, type: 'select', opts: ['Community consultation', 'Survey', 'Focus group', 'Committee'] })}
 ${field({ label: 'Participants', ph: 'names / counts' })}
 ${sect('What was heard', 'ما سُمع', '')}
 ${field({ label: 'Issues raised & concerns', req: 1, type: 'area', full: 1 })}
 ${field({ label: 'Positive feedback', type: 'area', full: 1 })}
 ${field({ label: 'Potential impacts identified', type: 'area', full: 1, help: 'Saving offers Create impact from concern with origin pre-linked.' })}
 ${field({ label: 'Topic candidates', ph: 'candidate material topics surfaced' })}
 ${sect('Follow-through', 'المتابعة', '')}
 ${field({ label: 'Commitments made', type: 'area', full: 1 })}
 ${field({ label: 'Actions + owners + due dates', type: 'area', full: 1, help: 'Each action becomes a tracked task.' })}
 <div class="full"><label style="font-weight:600;font-size:12px">Evidence (minutes, attendance)</label><div style="border:1.5px dashed var(--line);border-radius:9px;padding:14px;text-align:center;color:var(--mut)">📎 drop minutes.pdf</div></div></div>`}
    function impForm() {
      return `<div class="formGrid">
 ${sect('Identity', 'الهوية', 'C-06')}
 ${field({ label: 'Impact ID', value: 'IM-06 — assigned on save', ro: 1 })}
 ${field({ label: 'Impact name', req: 1 })}
 ${field({ label: 'ESG pillar', req: 1, type: 'select', opts: ['E', 'S', 'G'] })}
 ${field({ label: 'Status / version', value: 'Identified · v1 — materiality_decision is a separate field', ro: 1 })}
 ${sect('Nature', 'الطبيعة', 'GRI 3-3-a/b')}
 ${field({ label: 'Positive / Negative', req: 1, type: 'select', opts: ['Negative', 'Positive'] })}
 ${field({ label: 'Actual / Potential', req: 1, type: 'select', opts: ['Actual', 'Potential'] })}
 ${field({ label: 'Involvement (3-3-b — required for Negative)', req: 1, type: 'select', opts: ['Caused', 'Contributed to', 'Directly linked through business relationship'], help: 'GRI 3-3-b. Saving a negative impact without it is refused (MT-C01).' })}
 ${field({ label: 'Human-rights flag', type: 'select', opts: ['No', 'Yes — severity floor applies'], help: 'HR impacts carry a severity floor in ranking — cannot be averaged away.' })}
 ${sect('Where it arises', 'الموضع', 'value chain & organization')}
 ${field({ label: 'Involved activities / relationships', type: 'select', opts: ['ACT-03 · Aggregates quarrying', 'ACT-02 · Cement production', 'Supplier: fuel logistics', 'Off-taker PPA'], full: 1, pv: { k: 'reuse', t: 'B-04', l: '#/org/acts' } })}
 ${field({ label: 'Value-chain position', req: 1, type: 'select', opts: ['Own operations', 'Upstream', 'Downstream'] })}
 ${field({ label: 'Entity / site', type: 'select', opts: ['EG-CEM-01', 'EG-QRY-01', 'SA-SOL-01', 'SA-WND-01', '—'] })}
 ${field({ label: 'Product / service', type: 'select', opts: ['— none —', 'Aggregates', 'Cement', 'Power'] })}
 ${field({ label: 'Affected stakeholders', type: 'select', opts: ['Quarry community', 'Workforce', 'Contractors'], pv: { k: 'reuse', t: 'C-03', l: '#/mat/stake' } })}
 ${sect('Origin & description', 'المنشأ والوصف', 'save refused without origin')}
 ${field({ label: 'Origin (required)', req: 1, type: 'select', opts: ['CTX-05 · community complaints', 'ENG-02 · consultation', 'Incident register', 'Audit finding AF-12'], full: 1, help: 'Save is refused without an origin link.' })}
 ${field({ label: 'Description', req: 1, type: 'area', full: 1 })}
 ${sect('Severity inputs', 'مدخلات الخطورة', 'scored in C-07 Assessment — read-only here after scoring')}
 ${field({ label: 'Scale (severity)', type: 'select', opts: ['— scored in Assessment —', '1', '2', '3', '4', '5'], value: '— scored in Assessment —' })}
 ${field({ label: 'Scope (how widespread)', type: 'select', opts: ['— scored in Assessment —', '1', '2', '3', '4', '5'], value: '— scored in Assessment —' })}
 ${field({ label: 'Irremediability', type: 'select', opts: ['— scored in Assessment —', '1', '2', '3', '4', '5'], value: '— scored in Assessment —' })}
 ${field({ label: 'Likelihood (potential only)', type: 'select', opts: ['— n/a for actual —', '1', '2', '3', '4', '5'], value: '— n/a for actual —' })}
 ${sect('Governance', 'الحوكمة', '')}
 ${field({ label: 'Impact owner', req: 1, type: 'select', opts: ['N. Fouad', 'K. Mansour', 'O. Farid'] })}
 <div class="full"><label style="font-weight:600;font-size:12px">Evidence</label><div style="border:1.5px dashed var(--line);border-radius:9px;padding:12px;text-align:center;color:var(--mut)">📎 <a onclick="toast('Evidence object')">Attach basis (complaint log, monitoring data)</a></div></div>
</div>`}
    function retForm() { return `<div class="formGrid">${field({ label: 'Reason (required — returns without a reason are refused)', req: 1, type: 'area', full: 1 })}</div>` }
    function retFoot() { return `<button class="btn sec" onclick="closeDrawer()">${t('cancel')}</button><button class="btn warn" onclick="closeDrawer();toast('Returned with reason → contributor task created · audited')">${t('return')}</button>` }

    /* (boot moved to the end of the file — single boot pass) */

