/* ═══════════════════════════════════════════════════════════════════════════
   ESG OS v14 — 3 · ROLES & PERSONAS
   Extracted verbatim from the single-file build. Classic script: LOAD ORDER
   IS SIGNIFICANT — see the <script> tags in the entry HTML.
   ═══════════════════════════════════════════════════════════════════════════ */
    /* ════════════ 3 · ROLES & PERSONAS ════════════ */
    const ROLES = [
      { id: 'PM', en: 'Layla Al-Harbi · ESG Programme Manager', ar: 'ليلى الحربي · مدير برنامج الاستدامة', nav: ['home', 'mywork', 'org', 'mat', 'data', 'rev', 'rpt', 'adm'] },
      { id: 'CONTRIB', en: 'Fatma Said · Data Contributor', ar: 'فاطمة سعيد · مُدخل بيانات', nav: ['home', 'mywork', 'data'] },
      { id: 'OWNER', en: 'Khaled Mansour · Data Owner (HR)', ar: 'خالد منصور · مالك بيانات', nav: ['home', 'mywork', 'data', 'qualOnly'] },
      { id: 'DREV', en: 'Mona Adel · Department Reviewer', ar: 'منى عادل · مراجع الإدارة', nav: ['home', 'mywork', 'rev'] },
      { id: 'TREV', en: 'Omar Farid · ESG Technical Reviewer', ar: 'عمر فريد · المراجع الفني', nav: ['home', 'mywork', 'mat', 'rev', 'data'] },
      { id: 'GOV', en: 'Dr. Selim Aziz · Governance Approver', ar: 'د. سليم عزيز · معتمد الحوكمة', nav: ['home', 'mywork', 'mat', 'rev', 'rpt'] },
      { id: 'AUTHOR', en: 'Nour Hamed · Report Author', ar: 'نور حامد · محرر التقرير', nav: ['home', 'mywork', 'rpt'] },
      { id: 'ASSUR', en: 'Verify & Co. · Assurance Reviewer (external)', ar: 'Verify & Co. · مراجع تأكيد خارجي', nav: ['asr'] },
      { id: 'METH', en: 'Dr. Hala Nassar · Methodology Owner', ar: 'د. هالة نصار · مالك المنهجية', nav: ['home', 'adm', 'data'] },
    ];
    let ROLE = 'PM';

